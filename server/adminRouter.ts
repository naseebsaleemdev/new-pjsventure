import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response, type Router } from 'express';

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

interface AuthenticatedRequest extends Request {
  staffSession?: SessionPayload;
}

const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const revokedTokens = new Set<string>();

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

function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';
  const session = verifyToken(token);
  if (!session) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  req.staffSession = session;
  next();
}

export function createAdminRouter(): Router {
  const router = express.Router();

  router.get('/auth-status', (_req: Request, res: Response) => {
    const users = loadUsers();
    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    res.json({
      initialized: users.length > 0,
      envPasscodeActive: envPasscode.length > 0,
    });
  });

  // One-time atomic first-run admin user setup (locks once claimed or if ADMIN_PASSCODE is set)
  router.post('/bootstrap', (req: Request, res: Response) => {
    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    const users = loadUsers();
    if (users.length > 0 || envPasscode.length > 0) {
      res.status(409).json({
        error: 'Admin portal is already initialized. Please sign in.',
      });
      return;
    }

    const fullName =
      typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const email =
      typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const portDesk =
      typeof req.body?.portDesk === 'string'
        ? req.body.portDesk.trim()
        : 'Yokohama HQ';
    const password =
      typeof req.body?.password === 'string' ? req.body.password : '';

    if (!fullName || !email || !email.includes('@') || password.length < 6) {
      res.status(400).json({
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

    res.status(201).json({
      token,
      user: toPublicUser(firstUser),
    });
  });

  router.post('/login', (req: Request, res: Response) => {
    const emailInput =
      typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const passwordInput =
      typeof req.body?.password === 'string' ? req.body.password : '';

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
        res.json({ token, user: envUser });
        return;
      }
    }

    const found = users.find((u) => u.email === emailInput && u.active);
    if (!found || !verifyPassword(passwordInput, found.passwordSalt, found.passwordHash)) {
      res.status(401).json({ error: 'Invalid staff email or password.' });
      return;
    }

    const token = signToken({
      userId: found.id,
      email: found.email,
      role: found.role,
      exp: Date.now() + 1000 * 60 * 60 * 12,
    });

    res.json({
      token,
      user: toPublicUser(found),
    });
  });

  router.post('/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : '';
    if (token) revokedTokens.add(token);
    res.json({ ok: true });
  });

  router.get('/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    const users = loadUsers();
    const current = users.find((u) => u.id === req.staffSession?.userId);
    if (current) {
      res.json({ user: toPublicUser(current) });
      return;
    }
    res.json({
      user: {
        id: req.staffSession?.userId || 'env-admin',
        fullName: 'Portal Administrator',
        email: req.staffSession?.email || 'admin@pjsventure.jp',
        role: (req.staffSession?.role as PublicStaffUser['role']) || 'Super Admin',
        portDesk: 'Yokohama HQ',
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    });
  });

  router.get('/users', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    const users = loadUsers().map(toPublicUser);
    res.json({ users });
  });

  router.post('/users', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    const fullName =
      typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const email =
      typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const roleInput = req.body?.role;
    const role: StoredStaffUser['role'] =
      roleInput === 'Super Admin' ||
      roleInput === 'Export Coordinator' ||
      roleInput === 'Blog Editor'
        ? roleInput
        : 'Export Coordinator';
    const portDesk =
      typeof req.body?.portDesk === 'string' && req.body.portDesk.trim()
        ? req.body.portDesk.trim()
        : 'Yokohama HQ';
    const password =
      typeof req.body?.password === 'string' ? req.body.password : '';

    if (!fullName || !email || !email.includes('@') || password.length < 6) {
      res.status(400).json({
        error: 'Provide full name, valid email, and password (6+ chars).',
      });
      return;
    }

    const users = loadUsers();
    if (users.some((u) => u.email === email)) {
      res.status(409).json({ error: 'A staff user with this email already exists.' });
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
    res.status(201).json({ user: toPublicUser(created) });
  });

  router.patch(
    '/users/:id',
    requireAdminAuth,
    (req: AuthenticatedRequest, res: Response) => {
      const targetId = req.params.id;
      const users = loadUsers();
      const idx = users.findIndex((u) => u.id === targetId);
      if (idx === -1) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      const existing = users[idx];
      const fullName =
        typeof req.body?.fullName === 'string' && req.body.fullName.trim()
          ? req.body.fullName.trim()
          : existing.fullName;
      const portDesk =
        typeof req.body?.portDesk === 'string' && req.body.portDesk.trim()
          ? req.body.portDesk.trim()
          : existing.portDesk;
      const roleInput = req.body?.role;
      const role: StoredStaffUser['role'] =
        roleInput === 'Super Admin' ||
        roleInput === 'Export Coordinator' ||
        roleInput === 'Blog Editor'
          ? roleInput
          : existing.role;
      const active =
        typeof req.body?.active === 'boolean' ? req.body.active : existing.active;

      let passwordSalt = existing.passwordSalt;
      let passwordHash = existing.passwordHash;
      if (typeof req.body?.password === 'string' && req.body.password.length >= 6) {
        const nextHash = hashPassword(req.body.password);
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
      res.json({ user: toPublicUser(updated) });
    }
  );

  router.delete(
    '/users/:id',
    requireAdminAuth,
    (req: AuthenticatedRequest, res: Response) => {
      const targetId = req.params.id;
      if (req.staffSession?.userId === targetId) {
        res.status(400).json({ error: 'Cannot delete the currently signed-in account.' });
        return;
      }
      const users = loadUsers();
      const filtered = users.filter((u) => u.id !== targetId);
      if (filtered.length === users.length) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      saveUsers(filtered);
      res.json({ ok: true });
    }
  );

  return router;
}
