/**
 * Geospatial utilities for TrueTransit:
 * Haversine formula, distance calculations, bearing, and bounding boxes.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculates great-circle distance between two points in kilometers.
 */
export function calculateDistanceKm(point1: LatLng, point2: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 100) / 100;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimate travel duration in minutes based on distance and mode
 */
export function estimateDurationMinutes(distanceKm: number, mode: 'WALKING' | 'AUTO' | 'CAB' | 'METRO'): number {
  switch (mode) {
    case 'WALKING':
      return Math.round((distanceKm / 4.5) * 60); // 4.5 km/h
    case 'AUTO':
      return Math.round((distanceKm / 22) * 60 + 5); // 22 km/h city traffic + 5 min pickup
    case 'CAB':
      return Math.round((distanceKm / 25) * 60 + 7); // 25 km/h + 7 min pickup
    case 'METRO':
      return Math.round((distanceKm / 35) * 60 + 10); // 35 km/h + access/transit buffer
    default:
      return Math.round((distanceKm / 20) * 60);
  }
}

/**
 * Interpolates intermediate points between two coordinates for simulated route paths
 */
export function interpolateRoute(start: LatLng, end: LatLng, numPoints: number = 5, jitterVariance: number = 0.002): LatLng[] {
  const points: LatLng[] = [start];
  for (let i = 1; i < numPoints - 1; i++) {
    const fraction = i / (numPoints - 1);
    // Add realistic urban curve jitter
    const lat = start.lat + (end.lat - start.lat) * fraction + (Math.sin(fraction * Math.PI) * (Math.random() - 0.5) * jitterVariance);
    const lng = start.lng + (end.lng - start.lng) * fraction + (Math.cos(fraction * Math.PI) * (Math.random() - 0.5) * jitterVariance);
    points.push({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
  }
  points.push(end);
  return points;
}
