/**
 * DMRC Metro & Multimodal Feeder Transport Service (Backend API)
 */

export interface MetroStation {
  name: string;
  line: string;
  lat: number;
  lng: number;
}

export const DMRC_STATIONS: MetroStation[] = [
  // Yellow Line
  { name: 'Samaypur Badli', line: 'Yellow Line', lat: 28.7454, lng: 77.1353 },
  { name: 'Vishwa Vidyalaya (DU North Campus)', line: 'Yellow Line', lat: 28.6946, lng: 77.2144 },
  { name: 'Kashmere Gate', line: 'Yellow / Red / Violet Line', lat: 28.6667, lng: 77.2285 },
  { name: 'Chandni Chowk', line: 'Yellow Line', lat: 28.6578, lng: 77.2301 },
  { name: 'New Delhi Railway Station', line: 'Yellow / Airport Express', lat: 28.6429, lng: 77.2201 },
  { name: 'Rajiv Chowk (Connaught Place)', line: 'Yellow / Blue Line', lat: 28.6328, lng: 77.2195 },
  { name: 'Patel Chowk', line: 'Yellow Line', lat: 28.6231, lng: 77.2139 },
  { name: 'Central Secretariat', line: 'Yellow / Violet Line', lat: 28.6146, lng: 77.2119 },
  { name: 'Dilli Haat INA', line: 'Yellow / Pink Line', lat: 28.5744, lng: 77.2085 },
  { name: 'AIIMS New Delhi', line: 'Yellow Line', lat: 28.5672, lng: 77.2100 },
  { name: 'Hauz Khas', line: 'Yellow / Magenta Line', lat: 28.5432, lng: 77.2063 },
  { name: 'Saket', line: 'Yellow Line', lat: 28.5204, lng: 77.2014 },
  { name: 'Qutub Minar', line: 'Yellow Line', lat: 28.5133, lng: 77.1856 },
  { name: 'Millennium City Centre (HUDA Gurugram)', line: 'Yellow Line', lat: 28.4595, lng: 77.0725 },

  // Blue Line
  { name: 'Dwarka Sector 21', line: 'Blue / Airport Express', lat: 28.5522, lng: 77.0585 },
  { name: 'Janakpuri West', line: 'Blue / Magenta Line', lat: 28.6294, lng: 77.0777 },
  { name: 'Rajouri Garden', line: 'Blue / Pink Line', lat: 28.6492, lng: 77.1228 },
  { name: 'Karol Bagh', line: 'Blue Line', lat: 28.6441, lng: 77.1906 },
  { name: 'Mandi House', line: 'Blue / Violet Line', lat: 28.6258, lng: 77.2343 },
  { name: 'Akshardham', line: 'Blue Line', lat: 28.6177, lng: 77.2798 },
  { name: 'Botanical Garden (Noida)', line: 'Blue / Magenta Line', lat: 28.5642, lng: 77.3345 },
  { name: 'Noida Sector 18', line: 'Blue Line', lat: 28.5708, lng: 77.3218 },
  { name: 'Noida Sector 52', line: 'Blue / Aqua Line', lat: 28.5885, lng: 77.3689 },
  { name: 'Noida Electronic City', line: 'Blue Line', lat: 28.6256, lng: 77.3644 },

  // Aqua Line
  { name: 'Noida Sector 51', line: 'Aqua Line', lat: 28.5898, lng: 77.3712 },
  { name: 'Noida Sector 76', line: 'Aqua Line', lat: 28.5662, lng: 77.3828 },
  { name: 'Noida Sector 101', line: 'Aqua Line', lat: 28.5562, lng: 77.3888 },
  { name: 'Pari Chowk (Greater Noida)', line: 'Aqua Line', lat: 28.4651, lng: 77.5105 },

  // Airport Express & Rapid Metro
  { name: 'Delhi Airport Terminal 3 (IGI)', line: 'Airport Express', lat: 28.5562, lng: 77.1000 },
  { name: 'Delhi Aerocity', line: 'Airport Express', lat: 28.5490, lng: 77.1215 },
  { name: 'DLF Cyber City', line: 'Rapid Metro', lat: 28.4986, lng: 77.0878 },
];

function calcDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function findNearestMetro(lat: number, lng: number): { station: MetroStation; distanceKm: number } {
  let nearest = DMRC_STATIONS[0];
  let min = Number.MAX_VALUE;
  for (const s of DMRC_STATIONS) {
    const d = calcDistKm(lat, lng, s.lat, s.lng);
    if (d < min) {
      min = d;
      nearest = s;
    }
  }
  return { station: nearest, distanceKm: min };
}

export function getMetroSlabFare(distanceKm: number): number {
  if (distanceKm <= 2) return 10;
  if (distanceKm <= 5) return 20;
  if (distanceKm <= 12) return 30;
  if (distanceKm <= 21) return 40;
  if (distanceKm <= 32) return 50;
  return 60;
}
