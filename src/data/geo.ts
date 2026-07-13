// Geographic helpers for the quiz's location filter.

export type LatLng = { lat: number; lng: number };

// Predefined city centers (Métropole Européenne de Lille + surroundings).
export const CITY_COORDS: Record<string, LatLng> = {
  "Lille": { lat: 50.6292, lng: 3.0573 },
  "Tourcoing": { lat: 50.7239, lng: 3.1612 },
  "Roubaix": { lat: 50.6942, lng: 3.1746 },
  "Villeneuve-d'Ascq": { lat: 50.6199, lng: 3.1479 },
  "Wattrelos": { lat: 50.7061, lng: 3.2153 },
  "Marcq-en-Barœul": { lat: 50.6689, lng: 3.0975 },
  "Marcq-en-Baroeul": { lat: 50.6689, lng: 3.0975 },
  "Lambersart": { lat: 50.6494, lng: 3.0316 },
  "Armentières": { lat: 50.6867, lng: 2.8814 },
  "Armentieres": { lat: 50.6867, lng: 2.8814 },
  "Loos": { lat: 50.6122, lng: 3.0139 },
  "La Madeleine": { lat: 50.6567, lng: 3.0736 },
  "Wasquehal": { lat: 50.6706, lng: 3.1300 },
};

export function getCityCoords(name?: string | null): LatLng | null {
  if (!name) return null;
  const key = name.trim();
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  // Case-insensitive fallback
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (k.toLowerCase() === lower) return v;
  }
  return null;
}

// Haversine distance in kilometers.
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Free geocoding via OpenStreetMap Nominatim (no key required).
export async function geocodeCity(query: string): Promise<LatLng | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "Accept-Language": "fr" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const { lat, lon } = data[0];
    const latN = parseFloat(lat);
    const lngN = parseFloat(lon);
    if (Number.isNaN(latN) || Number.isNaN(lngN)) return null;
    return { lat: latN, lng: lngN };
  } catch {
    return null;
  }
}

// Extract the city portion from an address string like "12 Rue X, Lille".
export function cityFromAddress(address: string): string | null {
  if (!address) return null;
  const parts = address.split(",");
  const last = parts[parts.length - 1]?.trim();
  return last || null;
}
