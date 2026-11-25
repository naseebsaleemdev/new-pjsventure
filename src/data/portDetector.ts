import { DestinationPort } from '../types/vehicle';
import { DESTINATION_PORTS } from './ports';

const REGIONAL_FALLBACK_PORT_ID: Record<string, string> = {
  // East Africa gateway (Mombasa)
  UG: 'mombasa',
  RW: 'mombasa',
  BI: 'mombasa',
  SS: 'mombasa',
  ET: 'djibouti',
  SO: 'mombasa',
  ER: 'djibouti',

  // Central / East Africa corridor (Dar es Salaam / Beira)
  ZM: 'dar-es-salaam',
  MW: 'beira',
  CD: 'dar-es-salaam',

  // Southern Africa gateway (Durban / Walvis Bay)
  ZW: 'durban',
  BW: 'durban',
  SZ: 'durban',
  LS: 'durban',

  // West Africa landlocked
  BF: 'tema',
  ML: 'dakar',
  NE: 'cotonou',
  TD: 'douala',
  CF: 'douala',

  // South Asia
  AF: 'karachi',
  NP: 'chattogram',
  BT: 'chattogram',
  IN: 'colombo',

  // Middle East
  KW: 'dammam',
  BH: 'dammam',

  // Caribbean
  KY: 'kingston',
  TC: 'kingston',
  HT: 'santo-domingo',
  LC: 'bridgetown',
  GD: 'port-of-spain',
  VC: 'port-of-spain',
  AG: 'bridgetown',
  DM: 'bridgetown',
  KN: 'bridgetown',
  BZ: 'puerto-cortes',

  // Oceania
  VU: 'suva',

  // Europe landlocked / nearby
  AT: 'hamburg',
  CH: 'rotterdam',
  CZ: 'hamburg',
  SK: 'gdansk',
  HU: 'rijeka',
  LU: 'antwerp',
};

const TIMEZONE_TO_PORT_ID: Record<string, string> = {
  'Asia/Karachi': 'karachi',
  'Asia/Kabul': 'karachi',
  'Asia/Colombo': 'colombo',
  'Asia/Dhaka': 'chattogram',
  'Asia/Kathmandu': 'chattogram',
  'Asia/Kolkata': 'colombo',
  'Asia/Calcutta': 'colombo',
  'Asia/Bangkok': 'laem-chabang',
  'Asia/Singapore': 'singapore',
  'Asia/Kuala_Lumpur': 'port-klang',
  'Asia/Jakarta': 'jakarta',
  'Asia/Manila': 'manila',
  'Asia/Yangon': 'yangon',
  'Asia/Rangoon': 'yangon',
  'Asia/Hong_Kong': 'hong-kong',
  'Asia/Taipei': 'kaohsiung',
  'Asia/Shanghai': 'qingdao',
  'Asia/Seoul': 'busan',
  'Asia/Dubai': 'jebel-ali',
  'Asia/Muscat': 'sohar',
  'Asia/Qatar': 'doha',
  'Asia/Riyadh': 'dammam',
  'Asia/Kuwait': 'dammam',
  'Asia/Bahrain': 'dammam',
  'Asia/Amman': 'aqaba',
  'Asia/Beirut': 'beirut',
  'Asia/Baghdad': 'umm-qasr',
  'Asia/Jerusalem': 'ashdod',
  'Asia/Aden': 'aden',
  'Asia/Vladivostok': 'vladivostok',

  'Africa/Nairobi': 'mombasa',
  'Africa/Kampala': 'mombasa',
  'Africa/Kigali': 'mombasa',
  'Africa/Bujumbura': 'mombasa',
  'Africa/Juba': 'mombasa',
  'Africa/Addis_Ababa': 'djibouti',
  'Africa/Djibouti': 'djibouti',
  'Africa/Mogadishu': 'mombasa',
  'Africa/Dar_es_Salaam': 'dar-es-salaam',
  'Africa/Lusaka': 'dar-es-salaam',
  'Africa/Blantyre': 'beira',
  'Africa/Lubumbashi': 'dar-es-salaam',
  'Africa/Johannesburg': 'durban',
  'Africa/Harare': 'durban',
  'Africa/Gaborone': 'durban',
  'Africa/Maputo': 'maputo',
  'Africa/Windhoek': 'walvis-bay',
  'Africa/Mbabane': 'durban',
  'Africa/Maseru': 'durban',
  'Africa/Luanda': 'luanda',
  'Africa/Lagos': 'lagos',
  'Africa/Accra': 'tema',
  'Africa/Abidjan': 'abidjan',
  'Africa/Dakar': 'dakar',
  'Africa/Douala': 'douala',
  'Africa/Libreville': 'libreville',
  'Africa/Monrovia': 'monrovia',
  'Africa/Freetown': 'freetown',
  'Africa/Conakry': 'conakry',
  'Africa/Banjul': 'banjul',
  'Africa/Lome': 'lome',
  'Africa/Porto-Novo': 'cotonou',
  'Africa/Cairo': 'alexandria',
  'Africa/Casablanca': 'casablanca',
  'Africa/Algiers': 'algiers',
  'Africa/Tunis': 'tunis',
  'Africa/Tripoli': 'tripoli',
  'Africa/Khartoum': 'port-sudan',
  'Indian/Mauritius': 'port-louis',
  'Indian/Antananarivo': 'toamasina',

  'Europe/London': 'southampton',
  'Europe/Dublin': 'dublin',
  'Europe/Amsterdam': 'rotterdam',
  'Europe/Brussels': 'antwerp',
  'Europe/Berlin': 'hamburg',
  'Europe/Paris': 'marseille',
  'Europe/Madrid': 'valencia',
  'Europe/Lisbon': 'lisbon',
  'Europe/Stockholm': 'gothenburg',
  'Europe/Oslo': 'oslo',
  'Europe/Warsaw': 'gdansk',
  'Europe/Vilnius': 'klaipeda',
  'Europe/Tallinn': 'tallinn',
  'Europe/Athens': 'piraeus',
  'Europe/Bucharest': 'constanta',
  'Europe/Zagreb': 'rijeka',
  'Europe/Istanbul': 'istanbul',

  'America/Jamaica': 'kingston',
  'America/Nassau': 'nassau',
  'America/Port_of_Spain': 'port-of-spain',
  'America/Barbados': 'bridgetown',
  'America/Guyana': 'georgetown',
  'America/Santo_Domingo': 'santo-domingo',
  'America/Havana': 'havana',
  'America/Paramaribo': 'paramaribo',
  'America/Curacao': 'willemstad',
  'America/Los_Angeles': 'long-beach',
  'America/Vancouver': 'vancouver',
  'America/New_York': 'newark',
  'America/Toronto': 'montreal',
  'America/Halifax': 'halifax',
  'America/Chicago': 'savannah',
  'America/Mexico_City': 'veracruz',
  'America/Panama': 'manzanillo-pa',
  'America/Costa_Rica': 'puerto-limon',
  'America/Tegucigalpa': 'puerto-cortes',
  'America/Bogota': 'cartagena',
  'America/Guayaquil': 'guayaquil',
  'America/Lima': 'callao',
  'America/Santiago': 'valparaiso',
  'America/Sao_Paulo': 'santos',
  'America/Buenos_Aires': 'buenos-aires',
  'America/Argentina/Buenos_Aires': 'buenos-aires',
  'America/Montevideo': 'montevideo',

  'Pacific/Fiji': 'suva',
  'Pacific/Auckland': 'auckland',
  'Pacific/Port_Moresby': 'port-moresby',
  'Pacific/Apia': 'apia',
  'Pacific/Tongatapu': 'nukualofa',
  'Pacific/Guadalcanal': 'honiara',
  'Pacific/Noumea': 'noumea',
  'Pacific/Tahiti': 'papeete',
  'Pacific/Pago_Pago': 'pago-pago',
  'Australia/Sydney': 'sydney',
  'Australia/Melbourne': 'melbourne',
  'Australia/Brisbane': 'brisbane',
  'Australia/Adelaide': 'adelaide',
  'Australia/Perth': 'fremantle',
};

function findPortById(portId: string | undefined): DestinationPort | undefined {
  if (!portId) return undefined;
  return DESTINATION_PORTS.find((p) => p.id === portId);
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

export function getNearestPortFromList(
  ports: DestinationPort[],
  lat: number,
  lng: number
): DestinationPort {
  let best = ports[0] || DESTINATION_PORTS[0];
  let bestDist = Infinity;

  for (const port of ports) {
    if (typeof port.lat !== 'number' || typeof port.lng !== 'number') continue;
    const dist = haversineKm(lat, lng, port.lat, port.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = port;
    }
  }

  return best;
}

export function getNearestPortByCoords(lat: number, lng: number): DestinationPort {
  return getNearestPortFromList(DESTINATION_PORTS, lat, lng);
}

export function getPortByCountryCode(
  countryCode: string | null | undefined,
  lat?: number | null,
  lng?: number | null
): DestinationPort | null {
  if (!countryCode) return null;
  const code = countryCode.trim().toUpperCase();
  const normalized = code === 'UK' ? 'GB' : code;

  const sameCountryPorts = DESTINATION_PORTS.filter(
    (p) => p.countryCode?.toUpperCase() === normalized
  );
  if (sameCountryPorts.length > 0) {
    if (typeof lat === 'number' && typeof lng === 'number') {
      return getNearestPortFromList(sameCountryPorts, lat, lng);
    }
    return sameCountryPorts[0];
  }

  const regionalId = REGIONAL_FALLBACK_PORT_ID[normalized];
  return findPortById(regionalId) ?? null;
}

export interface PortDetectionResult {
  port: DestinationPort;
  label: string;
  detected: boolean;
}

function getDefaultFallbackPort(): DestinationPort {
  return findPortById('mombasa') || DESTINATION_PORTS[0];
}

export function detectPortSynchronously(): PortDetectionResult {
  const fallback = getDefaultFallbackPort();
  if (typeof window === 'undefined') {
    return {
      port: fallback,
      label: fallback.country,
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
      const euPort = findPortById('rotterdam') || findPortById('southampton');
      if (euPort) {
        return { port: euPort, label: 'Europe', detected: true };
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
    port: fallback,
    label: fallback.country,
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
    const byCountry = getPortByCountryCode(edgeCountry, edgeLat, edgeLng);
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

  // 2. Public IP geolocation fallback (local dev / non-Vercel proxies)
  const ipGeo = await fetchJsonWithTimeout('https://ipwho.is/', 2500);
  if (ipGeo && ipGeo.success !== false) {
    const cc = typeof ipGeo.country_code === 'string' ? ipGeo.country_code : null;
    const countryName =
      typeof ipGeo.country === 'string' ? ipGeo.country : null;
    const cityName = typeof ipGeo.city === 'string' ? ipGeo.city : null;
    const lat = typeof ipGeo.latitude === 'number' ? ipGeo.latitude : null;
    const lng = typeof ipGeo.longitude === 'number' ? ipGeo.longitude : null;

    const byCountry = getPortByCountryCode(cc, lat, lng);
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
        label: `Nearest (${nearest.portName})`,
        detected: true,
      };
    }
  }

  return autoDetectDestinationPort();
}
