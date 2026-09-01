export type LatLng = { lat: number; lng: number };

// Flat-plane (equirectangular) approximation — accurate enough at the
// sub-10km scale this app uses it at (nearby-building lookups, DA radius
// matching). Shared by api/nearby/route.ts and councilWatch/match.ts so
// there's one distance calculation in the codebase, not two.
export function distanceKm(first: LatLng, second: LatLng): number {
  const latDistance = (first.lat - second.lat) * 111;
  const lngDistance = (first.lng - second.lng) * 111 * Math.cos((first.lat * Math.PI) / 180);
  return Math.sqrt(latDistance ** 2 + lngDistance ** 2);
}
