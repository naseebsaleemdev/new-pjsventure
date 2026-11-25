import { DestinationPort } from '../types/vehicle';
import { DESTINATION_PORTS } from './ports';

const PORT_COORDS: Record<string, { lat: number; lng: number }> = {
  mombasa: { lat: -4.0435, lng: 39.6682 },
  'dar-es-salaam': { lat: -6.8235, lng: 39.2695 },
  durban: { lat: -29.8587, lng: 31.0218 },
  kingston: { lat: 17.9714, lng: -76.7931 },
  'port-of-spain': { lat: 10.6549, lng: -61.5019 },
  southampton: { lat: 50.9097, lng: -1.4044 },
  colombo: { lat: 6.9271, lng: 79.8612 },
  karachi: { lat: 24.8607, lng: 67.0011 },
  suva: { lat: -18.1416, lng: 178.4419 },
  'jebel-ali': { lat: 25.0113, lng: 55.0612 },
};

const COUNTRY_TO_PORT_ID: Record<string, string> = {
  // Primary direct ports
  KE: 'mombasa',
  TZ: 'dar-es-salaam',
  ZA: 'durban',
  JM: 'kingston',
  TT: 'port-of-spain',
  GB: 'southampton',
  UK: 'southampton',
  LK: 'colombo',
  PK: 'karachi',
  FJ: 'suva',
  AE: 'jebel-ali',

  // East Africa gateway (Mombasa)
  UG: 'mombasa',
  RW: 'mombasa',
  BI: 'mombasa',
  SS: 'mombasa',
  ET: 'mombasa',
  SO: 'mombasa',
  DJ: 'mombasa',

  // Central/East Africa corridor (Dar es Salaam)
  ZM: 'dar-es-salaam',
  MW: 'dar-es-salaam',
  CD: 'dar-es-salaam',

  // Southern Africa gateway (Durban)
  ZW: 'durban',
  BW: 'durban',
  MZ: 'durban',
  NA: 'durban',
  SZ: 'durban',
  LS: 'durban',
  AO: 'durban',

  // South Asia
  AF: 'karachi',
  BD: 'colombo',
  MV: 'colombo',
  NP: 'colombo',
  IN: 'colombo',
  BT: 'colombo',

  // Middle East
  SA: 'jebel-ali',
  OM: 'jebel-ali',
  QA: 'jebel-ali',
  KW: 'jebel-ali',
  BH: 'jebel-ali',
  JO: 'jebel-ali',
  IQ: 'jebel-ali',
  EG: 'jebel-ali',
  YE: 'jebel-ali',

  // Caribbean
  BS: 'kingston',
  KY: 'kingston',
  TC: 'kingston',
  DO: 'kingston',
  HT: 'kingston',
  CU: 'kingston',
  BB: 'port-of-spain',
  GY: 'port-of-spain',
  SR: 'port-of-spain',
  LC: 'port-of-spain',
  GD: 'port-of-spain',
  VC: 'port-of-spain',
  AG: 'port-of-spain',
  DM: 'port-of-spain',
  KN: 'port-of-spain',
  BZ: 'kingston',

  // Oceania
  PG: 'suva',
  WS: 'suva',
  TO: 'suva',
  SB: 'suva',
  VU: 'suva',
  NZ: 'suva',
  AU: 'suva',

  // UK & Europe
  IE: 'southampton',
  DE: 'southampton',
  FR: 'southampton',
  NL: 'southampton',
  BE: 'southampton',
  ES: 'southampton',
  IT: 'southampton',
  PT: 'southampton',
  SE: 'southampton',
  NO: 'southampton',
  DK: 'southampton',
  FI: 'southampton',
  PL: 'southampton',
  CY: 'southampton',
  MT: 'southampton',
  GR: 'southampton',
  AT: 'southampton',
  CH: 'southampton',
};

const TIMEZONE_TO_PORT_ID: Record<string, string> = {
  'Asia/Karachi': 'karachi',
  'Asia/Kabul': 'karachi',
  'Africa/Nairobi': 'mombasa',
  'Africa/Kampala': 'mombasa',
  'Africa/Kigali': 'mombasa',
  'Africa/Bujumbura': 'mombasa',
  'Africa/Juba': 'mombasa',
  'Africa/Addis_Ababa': 'mombasa',
  'Africa/Mogadishu': 'mombasa',
  'Africa/Dar_es_Salaam': 'dar-es-salaam',
  'Africa/Lusaka': 'dar-es-salaam',
  'Africa/Blantyre': 'dar-es-salaam',
  'Africa/Lubumbashi': 'dar-es-salaam',
  'Africa/Johannesburg': 'durban',
  'Africa/Harare': 'durban',
  'Africa/Gaborone': 'durban',
  'Africa/Maputo': 'durban',
  'Africa/Windhoek': 'durban',
  'Africa/Mbabane': 'durban',
  'Africa/Maseru': 'durban',
  'America/Jamaica': 'kingston',
  'America/Nassau': 'kingston',
  'America/Cayman': 'kingston',
  'America/Port_of_Spain': 'port-of-spain',
  'America/Barbados': 'port-of-spain',
  'America/Guyana': 'port-of-spain',
  'Europe/London': 'southampton',
  'Europe/Dublin': 'southampton',
  'Asia/Colombo': 'colombo',
  'Asia/Dhaka': 'colombo',
  'Asia/Kathmandu': 'colombo',
  'Asia/Kolkata': 'colombo',
  'Asia/Calcutta': 'colombo',
  'Pacific/Fiji': 'suva',
  'Pacific/Auckland': 'suva',
  'Pacific/Port_Moresby': 'suva',
  'Australia/Sydney': 'suva',
  'Australia/Melbourne': 'suva',
  'Australia/Brisbane': 'suva',
  'Asia/Dubai': 'jebel-ali',
  'Asia/Muscat': 'jebel-ali',
  'Asia/Qatar': 'jebel-ali',
  'Asia/Riyadh': 'jebel-ali',
  'Asia/Kuwait': 'jebel-ali',
  'Asia/Bahrain': 'jebel-ali',
};

function findPortById(portId: string | undefined): DestinationPort | undefined {
  if (!portId) return undefined;
  return DESTINATION_PORTS.find((p) => p.id === portId);
}

export function getPortByCountryCode(
  countryCode: string | null | undefined
): DestinationPort | null {
  if (!countryCode) return null;
  const portId = COUNTRY_TO_PORT_ID[countryCode.trim().toUpperCase()];
  return findPortById(portId) ?? null;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestPortByCoords(lat: number, lng: number): DestinationPort {
  let best = DESTINATION_PORTS[0];
  let bestDist = Infinity;

  for (const port of DESTINATION_PORTS) {
    const coords = PORT_COORDS[port.id];
    if (!coords) continue;
    const dist = haversineKm(lat, lng, coords.lat, coords.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = port;
    }
  }

  return best;
}

export interface PortDetectionResult {
  port: DestinationPort;
  label: string;
  detected: boolean;
}

export function detectPortSynchronously(): PortDetectionResult {
  if (typeof window === 'undefined') {
    return {
      port: DESTINATION_PORTS[0],
      label: DESTINATION_PORTS[0].country,
      detected: false,
    };
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const tzPort = findPortById(TIMEZONE_TO_PORT_ID[tz]);
    if (tzPort) {
      return {
        port: tzPort,
        label: tzPort.country,
        detected: true,
      };
    }

    if (tz.startsWith('Europe/')) {
      const ukPort = findPortById('southampton');
      if (ukPort) {
        return { port: ukPort, label: 'Europe', detected: true };
      }
    }

    const locale = navigator.language || '';
    const regionPart = locale.includes('-') ? locale.split('-')[1] : '';
    const localePort = getPortByCountryCode(regionPart);
    if (localePort) {
      return {
        port: localePort,
        label: localePort.country,
        detected: true,
      };
    }
  } catch {
    // Ignore browser Intl errors
  }

  return {
    port: DESTINATION_PORTS[0],
    label: DESTINATION_PORTS[0].country,
    detected: false,
  };
}

async function fetchJsonWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function autoDetectDestinationPort(): Promise<PortDetectionResult> {
  if (typeof window === 'undefined') {
    return detectPortSynchronously();
  }

  // 1. Check server/edge geo headers first (/api/location)
  const edgeGeo = await fetchJsonWithTimeout('/api/location', 2000);
  const edgeCountry =
    typeof edgeGeo?.countryCode === 'string' ? edgeGeo.countryCode : null;
  const edgeCity = typeof edgeGeo?.city === 'string' ? edgeGeo.city : null;
  const edgeLat = typeof edgeGeo?.latitude === 'number' ? edgeGeo.latitude : null;
  const edgeLng = typeof edgeGeo?.longitude === 'number' ? edgeGeo.longitude : null;

  if (edgeCountry) {
    const byCountry = getPortByCountryCode(edgeCountry);
    if (byCountry) {
      return {
        port: byCountry,
        label: edgeCity ? `${edgeCity}, ${edgeCountry}` : byCountry.country,
        detected: true,
      };
    }
    if (edgeLat !== null && edgeLng !== null) {
      const nearest = getNearestPortByCoords(edgeLat, edgeLng);
      return {
        port: nearest,
        label: edgeCity ? `${edgeCity}, ${edgeCountry}` : edgeCountry,
        detected: true,
      };
    }
  }

  // 2. Public IP geolocation fallback (useful on local dev or non-Vercel proxies)
  const ipGeo = await fetchJsonWithTimeout('https://ipwho.is/', 2500);
  if (ipGeo && ipGeo.success !== false) {
    const cc = typeof ipGeo.country_code === 'string' ? ipGeo.country_code : null;
    const countryName =
      typeof ipGeo.country === 'string' ? ipGeo.country : null;
    const cityName = typeof ipGeo.city === 'string' ? ipGeo.city : null;
    const lat = typeof ipGeo.latitude === 'number' ? ipGeo.latitude : null;
    const lng = typeof ipGeo.longitude === 'number' ? ipGeo.longitude : null;

    const byCountry = getPortByCountryCode(cc);
    if (byCountry) {
      return {
        port: byCountry,
        label:
          cityName && countryName
            ? `${cityName}, ${countryName}`
            : countryName || byCountry.country,
        detected: true,
      };
    }

    if (lat !== null && lng !== null) {
      const nearest = getNearestPortByCoords(lat, lng);
      return {
        port: nearest,
        label:
          cityName && countryName
            ? `${cityName}, ${countryName}`
            : countryName || nearest.country,
        detected: true,
      };
    }
  }

  // 3. Browser timezone / locale fallback
  return detectPortSynchronously();
}

export async function detectNearestPortWithBrowserGeo(): Promise<PortDetectionResult> {
  if (
    typeof window !== 'undefined' &&
    'geolocation' in navigator &&
    typeof navigator.geolocation.getCurrentPosition === 'function'
  ) {
    const gpsCoords = await new Promise<{ lat: number; lng: number } | null>(
      (resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          () => resolve(null),
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
        );
      }
    );

    if (gpsCoords) {
      const nearest = getNearestPortByCoords(gpsCoords.lat, gpsCoords.lng);
      return {
        port: nearest,
        label: `Nearest to GPS (${nearest.portName})`,
        detected: true,
      };
    }
  }

  return autoDetectDestinationPort();
}
