import type { AquidauanaBranch } from './site-data';

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
