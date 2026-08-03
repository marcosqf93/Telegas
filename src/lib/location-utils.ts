import type { AquidauanaBranch } from './site-data';
import type { CityKey } from './site-data';

const CITY_CENTERS: Record<CityKey, { lat: number; lng: number }> = {
  aquidauana: { lat: -20.4745, lng: -55.7869 },
  anastacio: { lat: -20.4748, lng: -55.8057 },
  miranda: { lat: -20.2368, lng: -56.3745 }
};

export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const r = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * r * Math.asin(Math.sqrt(h));
}

export function nearestBranch(user: { lat: number; lng: number }, branches: AquidauanaBranch[]) {
  return branches
    .map((branch) => ({ branch, distance: distanceMeters(user, branch.coords) }))
    .sort((a, b) => a.distance - b.distance)[0]?.branch ?? branches[0];
}

export function nearestCity(user: { lat: number; lng: number }) {
  return (Object.entries(CITY_CENTERS) as Array<[CityKey, { lat: number; lng: number }]>)
    .map(([city, coords]) => ({ city, distance: distanceMeters(user, coords) }))
    .sort((a, b) => a.distance - b.distance)[0]?.city ?? 'aquidauana';
}
