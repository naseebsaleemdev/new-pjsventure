import crypto from 'node:crypto';
import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

export interface StoredStaffUser {
  id: string;
  fullName: string;
  email: string;
  role: 'Super Admin' | 'Export Coordinator' | 'Blog Editor';
  portDesk: string;
  passwordSalt: string;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}

export interface PublicStaffUser {
  id: string;
  fullName: string;
  email: string;
  role: 'Super Admin' | 'Export Coordinator' | 'Blog Editor';
  portDesk: string;
  active: boolean;
  createdAt: string;
}

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

type AdminRequest = IncomingMessage & { body?: unknown };

const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const revokedTokens = new Set<string>();

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function getUsersFilePath(): string {
  const preferredDir =
    process.env.VERCEL === '1'
      ? path.join('/tmp', 'pjs-venture-data')
      : path.resolve(process.cwd(), '.data');
  try {
    if (!fs.existsSync(preferredDir)) {
      fs.mkdirSync(preferredDir, { recursive: true });
    }
    return path.resolve(preferredDir, 'staff-users.json');
  } catch {
    const tmpDir = path.join('/tmp', 'pjs-venture-data');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return path.resolve(tmpDir, 'staff-users.json');
  }
}

function loadUsers(): StoredStaffUser[] {
  try {
    const filePath = getUsersFilePath();
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredStaffUser[]): void {
  const filePath = getUsersFilePath();
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

function signToken(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token: string): SessionPayload | null {
  if (!token || revokedTokens.has(token)) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  const sigBuf = Buffer.from(sig, 'utf8');
  const expBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf8')
    ) as SessionPayload;
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

function toPublicUser(user: StoredStaffUser): PublicStaffUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    portDesk: user.portDesk,
    active: user.active,
    createdAt: user.createdAt,
  };
}

function extractBearerSession(req: IncomingMessage): SessionPayload | null {
  const authHeader =
    typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';
  return verifyToken(token);
}

async function readJsonBody(req: AdminRequest): Promise<Record<string, unknown>> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        return parsed && typeof parsed === 'object'
          ? (parsed as Record<string, unknown>)
          : {};
      } catch {
        return {};
      }
    }
    if (typeof req.body === 'object') {
      return req.body as Record<string, unknown>;
    }
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > 2 * 1024 * 1024) {
      throw new Error('Request body exceeds 2MB limit');
    }
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function normalizeRoutePath(rawUrl: string | undefined): string {
  const pathOnly = (rawUrl || '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (pathOnly.startsWith('/api/admin')) {
    return pathOnly.slice('/api/admin'.length) || '/';
  }
  if (pathOnly.startsWith('/admin')) {
    return pathOnly.slice('/admin'.length) || '/';
  }
  return pathOnly;
}

export async function handleAdminRequest(
  req: AdminRequest,
  res: ServerResponse
): Promise<void> {
  const method = (req.method || 'GET').toUpperCase();
  const routePath = normalizeRoutePath(req.url);

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (method === 'GET' && routePath === '/auth-status') {
      const users = loadUsers();
      const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
      sendJson(res, 200, {
        initialized: users.length > 0,
        envPasscodeActive: envPasscode.length > 0,
      });
      return;
    }

    if (method === 'POST' && routePath === '/bootstrap') {
      const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
      const users = loadUsers();
      if (users.length > 0 || envPasscode.length > 0) {
        sendJson(res, 409, {
          error: 'Admin portal is already initialized. Please sign in.',
        });
        return;
      }

      const body = await readJsonBody(req);
      const fullName =
        typeof body.fullName === 'string' ? body.fullName.trim() : '';
      const email =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const portDesk =
        typeof body.portDesk === 'string' ? body.portDesk.trim() : 'Yokohama HQ';
      const password = typeof body.password === 'string' ? body.password : '';

      if (!fullName || !email || !email.includes('@') || password.length < 6) {
        sendJson(res, 400, {
          error:
            'Provide a valid full name, email address, and password (at least 6 characters).',
        });
        return;
      }

      const { salt, hash } = hashPassword(password);
      const firstUser: StoredStaffUser = {
        id: `usr-${Date.now()}`,
        fullName,
        email,
        role: 'Super Admin',
        portDesk: portDesk || 'Yokohama HQ',
        passwordSalt: salt,
        passwordHash: hash,
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      saveUsers([firstUser]);

      const token = signToken({
        userId: firstUser.id,
        email: firstUser.email,
        role: firstUser.role,
        exp: Date.now() + 1000 * 60 * 60 * 12,
      });

      sendJson(res, 201, {
        token,
        user: toPublicUser(firstUser),
      });
      return;
    }

    if (method === 'POST' && routePath === '/login') {
      const body = await readJsonBody(req);
      const emailInput =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const passwordInput =
        typeof body.password === 'string' ? body.password : '';

      const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
      const users = loadUsers();

      if (envPasscode.length > 0 && passwordInput.length > 0) {
        const a = Buffer.from(passwordInput, 'utf8');
        const b = Buffer.from(envPasscode, 'utf8');
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
          const matched = users.find((u) => u.email === emailInput) || users[0];
          const envUser: PublicStaffUser = matched
            ? toPublicUser(matched)
            : {
                id: 'env-admin',
                fullName: 'Portal Administrator',
                email: emailInput || 'admin@pjsventure.jp',
                role: 'Super Admin',
                portDesk: 'Yokohama HQ',
                active: true,
                createdAt: new Date().toISOString().slice(0, 10),
              };
          const token = signToken({
            userId: envUser.id,
            email: envUser.email,
            role: envUser.role,
            exp: Date.now() + 1000 * 60 * 60 * 12,
          });
          sendJson(res, 200, { token, user: envUser });
          return;
        }
      }

      const found = users.find((u) => u.email === emailInput && u.active);
      if (
        !found ||
        !verifyPassword(passwordInput, found.passwordSalt, found.passwordHash)
      ) {
        sendJson(res, 401, { error: 'Invalid staff email or password.' });
        return;
      }

      const token = signToken({
        userId: found.id,
        email: found.email,
        role: found.role,
        exp: Date.now() + 1000 * 60 * 60 * 12,
      });

      sendJson(res, 200, {
        token,
        user: toPublicUser(found),
      });
      return;
    }

    if (method === 'POST' && routePath === '/logout') {
      const authHeader =
        typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : '';
      if (token) revokedTokens.add(token);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (method === 'GET' && routePath === '/me') {
      const session = extractBearerSession(req);
      if (!session) {
        sendJson(res, 401, { error: 'Authentication required' });
        return;
      }
      const users = loadUsers();
      const current = users.find((u) => u.id === session.userId);
      if (current) {
        sendJson(res, 200, { user: toPublicUser(current) });
        return;
      }
      sendJson(res, 200, {
        user: {
          id: session.userId || 'env-admin',
          fullName: 'Portal Administrator',
          email: session.email || 'admin@pjsventure.jp',
          role: (session.role as PublicStaffUser['role']) || 'Super Admin',
          portDesk: 'Yokohama HQ',
          active: true,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      });
      return;
    }

    if (method === 'GET' && routePath === '/users') {
      const session = extractBearerSession(req);
      if (!session) {
        sendJson(res, 401, { error: 'Authentication required' });
        return;
      }
      const users = loadUsers().map(toPublicUser);
      sendJson(res, 200, { users });
      return;
    }

    if (method === 'POST' && routePath === '/users') {
      const session = extractBearerSession(req);
      if (!session) {
        sendJson(res, 401, { error: 'Authentication required' });
        return;
      }
      const body = await readJsonBody(req);
      const fullName =
        typeof body.fullName === 'string' ? body.fullName.trim() : '';
      const email =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const roleInput = body.role;
      const role: StoredStaffUser['role'] =
        roleInput === 'Super Admin' ||
        roleInput === 'Export Coordinator' ||
        roleInput === 'Blog Editor'
          ? roleInput
          : 'Export Coordinator';
      const portDesk =
        typeof body.portDesk === 'string' && body.portDesk.trim()
          ? body.portDesk.trim()
          : 'Yokohama HQ';
      const password = typeof body.password === 'string' ? body.password : '';

      if (!fullName || !email || !email.includes('@') || password.length < 6) {
        sendJson(res, 400, {
          error: 'Provide full name, valid email, and password (6+ chars).',
        });
        return;
      }

      const users = loadUsers();
      if (users.some((u) => u.email === email)) {
        sendJson(res, 409, {
          error: 'A staff user with this email already exists.',
        });
        return;
      }

      const { salt, hash } = hashPassword(password);
      const created: StoredStaffUser = {
        id: `usr-${Date.now()}`,
        fullName,
        email,
        role,
        portDesk,
        passwordSalt: salt,
        passwordHash: hash,
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      saveUsers([created, ...users]);
      sendJson(res, 201, { user: toPublicUser(created) });
      return;
    }

    if (routePath.startsWith('/users/')) {
      const session = extractBearerSession(req);
      if (!session) {
        sendJson(res, 401, { error: 'Authentication required' });
        return;
      }
      const targetId = decodeURIComponent(routePath.slice('/users/'.length));

      if (method === 'PATCH') {
        const users = loadUsers();
        const idx = users.findIndex((u) => u.id === targetId);
        if (idx === -1) {
          sendJson(res, 404, { error: 'User not found.' });
          return;
        }

        const body = await readJsonBody(req);
        const existing = users[idx];
        const fullName =
          typeof body.fullName === 'string' && body.fullName.trim()
            ? body.fullName.trim()
            : existing.fullName;
        const portDesk =
          typeof body.portDesk === 'string' && body.portDesk.trim()
            ? body.portDesk.trim()
            : existing.portDesk;
        const roleInput = body.role;
        const role: StoredStaffUser['role'] =
          roleInput === 'Super Admin' ||
          roleInput === 'Export Coordinator' ||
          roleInput === 'Blog Editor'
            ? roleInput
            : existing.role;
        const active =
          typeof body.active === 'boolean' ? body.active : existing.active;

        let passwordSalt = existing.passwordSalt;
        let passwordHash = existing.passwordHash;
        if (typeof body.password === 'string' && body.password.length >= 6) {
          const nextHash = hashPassword(body.password);
          passwordSalt = nextHash.salt;
          passwordHash = nextHash.hash;
        }

        const updated: StoredStaffUser = {
          ...existing,
          fullName,
          portDesk,
          role,
          active,
          passwordSalt,
          passwordHash,
        };
        users[idx] = updated;
        saveUsers(users);
        sendJson(res, 200, { user: toPublicUser(updated) });
        return;
      }

      if (method === 'DELETE') {
        if (session.userId === targetId) {
          sendJson(res, 400, {
            error: 'Cannot delete the currently signed-in account.',
          });
          return;
        }
        const users = loadUsers();
        const filtered = users.filter((u) => u.id !== targetId);
        if (filtered.length === users.length) {
          sendJson(res, 404, { error: 'User not found.' });
          return;
        }
        saveUsers(filtered);
        sendJson(res, 200, { ok: true });
        return;
      }
    }

    sendJson(res, 404, { error: 'Staff API route not found.' });
  } catch (err) {
    console.error('Staff API error:', err);
    sendJson(res, 500, { error: 'Internal server error handling staff request.' });
  }
}

export default async function handler(
  req: AdminRequest,
  res: ServerResponse
): Promise<void> {
  await handleAdminRequest(req, res);
}
