/**
 * DMRC Metro Network Database & Multimodal Transport Calculator
 * Supports DMRC Yellow, Blue, Red, Violet, Magenta, Pink, Airport Express, and Aqua Line stations.
 * Computes statutory DMRC fare + First-Mile & Last-Mile feeder costs.
 */

export interface MetroStation {
  name: string;
  line: string;
  lat: number;
  lng: number;
  interchange?: boolean;
}

export const DMRC_STATIONS: MetroStation[] = [
  // Yellow Line (North to South Central)
  { name: 'Samaypur Badli', line: 'Yellow Line', lat: 28.7454, lng: 77.1353 },
  { name: 'Vishwa Vidyalaya (DU North Campus)', line: 'Yellow Line', lat: 28.6946, lng: 77.2144 },
  { name: 'Kashmere Gate', line: 'Yellow / Red / Violet Line', lat: 28.6667, lng: 77.2285, interchange: true },
  { name: 'Chandni Chowk', line: 'Yellow Line', lat: 28.6578, lng: 77.2301 },
  { name: 'New Delhi Railway Station', line: 'Yellow / Airport Express', lat: 28.6429, lng: 77.2201, interchange: true },
  { name: 'Rajiv Chowk (Connaught Place)', line: 'Yellow / Blue Line', lat: 28.6328, lng: 77.2195, interchange: true },
  { name: 'Patel Chowk', line: 'Yellow Line', lat: 28.6231, lng: 77.2139 },
  { name: 'Central Secretariat', line: 'Yellow / Violet Line', lat: 28.6146, lng: 77.2119, interchange: true },
  { name: 'Udyog Bhawan', line: 'Yellow Line', lat: 28.6111, lng: 77.2125 },
  { name: 'Lok Kalyan Marg', line: 'Yellow Line', lat: 28.5997, lng: 77.2105 },
  { name: 'Jor Bagh', line: 'Yellow Line', lat: 28.5889, lng: 77.2119 },
  { name: 'Dilli Haat INA', line: 'Yellow / Pink Line', lat: 28.5744, lng: 77.2085, interchange: true },
  { name: 'AIIMS New Delhi', line: 'Yellow Line', lat: 28.5672, lng: 77.2100 },
  { name: 'Green Park', line: 'Yellow Line', lat: 28.5589, lng: 77.2064 },
  { name: 'Hauz Khas', line: 'Yellow / Magenta Line', lat: 28.5432, lng: 77.2063, interchange: true },
  { name: 'Malviya Nagar', line: 'Yellow Line', lat: 28.5283, lng: 77.2063 },
  { name: 'Saket', line: 'Yellow Line', lat: 28.5204, lng: 77.2014 },
  { name: 'Qutub Minar', line: 'Yellow Line', lat: 28.5133, lng: 77.1856 },
  { name: 'Millennium City Centre (HUDA City Centre Gurugram)', line: 'Yellow Line', lat: 28.4595, lng: 77.0725 },

  // Blue Line (East - West Arterial)
  { name: 'Dwarka Sector 21', line: 'Blue / Airport Express', lat: 28.5522, lng: 77.0585, interchange: true },
  { name: 'Dwarka Sector 10', line: 'Blue Line', lat: 28.5815, lng: 77.0570 },
  { name: 'Janakpuri West', line: 'Blue / Magenta Line', lat: 28.6294, lng: 77.0777, interchange: true },
  { name: 'Rajouri Garden', line: 'Blue / Pink Line', lat: 28.6492, lng: 77.1228, interchange: true },
  { name: 'Karol Bagh', line: 'Blue Line', lat: 28.6441, lng: 77.1906 },
  { name: 'Mandi House', line: 'Blue / Violet Line', lat: 28.6258, lng: 77.2343, interchange: true },
  { name: 'Supreme Court (Pragati Maidan)', line: 'Blue Line', lat: 28.6225, lng: 77.2435 },
  { name: 'Yamuna Bank', line: 'Blue Line', lat: 28.6247, lng: 77.2611, interchange: true },
  { name: 'Akshardham', line: 'Blue Line', lat: 28.6177, lng: 77.2798 },
  { name: 'Mayur Vihar Phase-1', line: 'Blue / Pink Line', lat: 28.6074, lng: 77.2952, interchange: true },
  { name: 'Noida Sector 15', line: 'Blue Line', lat: 28.5815, lng: 77.3135 },
  { name: 'Noida Sector 16', line: 'Blue Line', lat: 28.5772, lng: 77.3168 },
  { name: 'Noida Sector 18 (Atta Market)', line: 'Blue Line', lat: 28.5708, lng: 77.3218 },
  { name: 'Botanical Garden (Noida)', line: 'Blue / Magenta Line', lat: 28.5642, lng: 77.3345, interchange: true },
  { name: 'Noida City Centre', line: 'Blue Line', lat: 28.5746, lng: 77.3562 },
  { name: 'Noida Sector 52', line: 'Blue Line / Aqua Line Link', lat: 28.5885, lng: 77.3689, interchange: true },
  { name: 'Noida Electronic City', line: 'Blue Line', lat: 28.6256, lng: 77.3644 },

  // Aqua Line (Noida - Greater Noida Link)
  { name: 'Noida Sector 51 (Aqua Line)', line: 'Aqua Line', lat: 28.5898, lng: 77.3712, interchange: true },
  { name: 'Noida Sector 76', line: 'Aqua Line', lat: 28.5662, lng: 77.3828 },
  { name: 'Noida Sector 101', line: 'Aqua Line', lat: 28.5562, lng: 77.3888 },
  { name: 'Noida Sector 137', line: 'Aqua Line', lat: 28.5135, lng: 77.4085 },
  { name: 'Pari Chowk (Greater Noida)', line: 'Aqua Line', lat: 28.4651, lng: 77.5105 },
  { name: 'Knowledge Park II', line: 'Aqua Line', lat: 28.4590, lng: 77.4980 },

  // Red Line
  { name: 'Rithala', line: 'Red Line', lat: 28.7208, lng: 77.1072 },
  { name: 'Netaji Subhash Place', line: 'Red / Pink Line', lat: 28.6953, lng: 77.1528, interchange: true },
  { name: 'Tis Hazari', line: 'Red Line', lat: 28.6672, lng: 77.2166 },
  { name: 'Dilshad Garden', line: 'Red Line', lat: 28.6759, lng: 77.3215 },

  // Violet Line
  { name: 'Khan Market', line: 'Violet Line', lat: 28.6003, lng: 77.2270 },
  { name: 'JLN Stadium', line: 'Violet Line', lat: 28.5866, lng: 77.2345 },
  { name: 'Lajpat Nagar', line: 'Violet / Pink Line', lat: 28.5705, lng: 77.2372, interchange: true },
  { name: 'Kalkaji Mandir', line: 'Violet / Magenta Line', lat: 28.5492, lng: 77.2588, interchange: true },

  // Airport Express Line
  { name: 'Delhi Aerocity', line: 'Airport Express', lat: 28.5490, lng: 77.1215 },
  { name: 'Delhi Airport Terminal 3 (IGI)', line: 'Airport Express', lat: 28.5562, lng: 77.1000 },

  // Rapid Metro Gurugram
  { name: 'DLF Phase 2 (Rapid Metro)', line: 'Rapid Metro', lat: 28.4891, lng: 77.0886 },
  { name: 'DLF Cyber City (Rapid Metro)', line: 'Rapid Metro', lat: 28.4986, lng: 77.0878 },
  { name: 'DLF Phase 3 (Rapid Metro)', line: 'Rapid Metro', lat: 28.4950, lng: 77.0920 },
];

/**
 * Calculates Haversine distance in kilometers between two coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
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

/**
 * Finds the nearest metro station to a given coordinate
 */
export function findNearestMetroStation(lat: number, lng: number): {
  station: MetroStation;
  distanceKm: number;
} {
  let nearest = DMRC_STATIONS[0];
  let minDistance = Number.MAX_VALUE;

  for (const stn of DMRC_STATIONS) {
    const d = calculateDistanceKm(lat, lng, stn.lat, stn.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = stn;
    }
  }

  return {
    station: nearest,
    distanceKm: minDistance,
  };
}

/**
 * Computes official DMRC ticket fare according to statutory distance slabs
 */
export function getDmrcStatutoryFare(distanceKm: number, isAirportExpress = false): number {
  if (isAirportExpress) {
    if (distanceKm <= 5) return 20;
    if (distanceKm <= 12) return 50;
    return 60;
  }

  if (distanceKm <= 2) return 10;
  if (distanceKm <= 5) return 20;
  if (distanceKm <= 12) return 30;
  if (distanceKm <= 21) return 40;
  if (distanceKm <= 32) return 50;
  return 60;
}

export interface FeederSegment {
  mode: 'WALK' | 'E_RICKSHAW' | 'AUTO';
  distanceKm: number;
  durationMinutes: number;
  cost: number;
  isFreeWalk: boolean;
  label: string;
  advice: string;
}

/**
 * Calculates First-Mile or Last-Mile feeder transport:
 * If <= 0.8 km (approx. 10 min walk): Walking (₹0 Free)
 * If 0.8 - 3.5 km: E-Rickshaw / Shared Shuttle (₹10 - ₹20)
 * If > 3.5 km: Metered Auto-Rickshaw (₹30 base + ₹11/km)
 */
export function calculateFeederLeg(
  distanceKm: number,
  legType: 'FIRST_MILE' | 'LAST_MILE',
  stationName: string
): FeederSegment {
  const dist = Math.max(0.1, Math.round(distanceKm * 10) / 10);

  // Under 0.8 km is comfortably under 10 minutes walk
  if (dist <= 0.8) {
    const mins = Math.max(2, Math.round((dist / 4.8) * 60)); // 4.8 km/h walking speed
    return {
      mode: 'WALK',
      distanceKm: dist,
      durationMinutes: mins,
      cost: 0,
      isFreeWalk: true,
      label: `🚶 Walk to ${stationName}`,
      advice: `Station is only ${dist} km away (approx. ${mins} min walk). No local transport fare needed.`,
    };
  }

  // 0.8 km to 3.5 km: Typical E-Rickshaw / Shared Metro Feeder
  if (dist <= 3.5) {
    const fare = dist <= 2.0 ? 10 : 20;
    const mins = Math.round(dist * 4 + 3);
    return {
      mode: 'E_RICKSHAW',
      distanceKm: dist,
      durationMinutes: mins,
      cost: fare,
      isFreeWalk: false,
      label: `🛺 Shared E-Rickshaw / Feeder to ${stationName}`,
      advice: `Standard fixed battery e-rickshaw or DMRC feeder shuttle (₹${fare} flat fare). Avoid private unmetered cabs.`,
    };
  }

  // > 3.5 km: Metered Auto-Rickshaw
  let autoFare = 30; // base for 1.5 km
  if (dist > 1.5) {
    autoFare += (dist - 1.5) * 11;
  }
  const roundedFare = Math.round(autoFare);
  const mins = Math.round(dist * 3 + 5);

  return {
    mode: 'AUTO',
    distanceKm: dist,
    durationMinutes: mins,
    cost: roundedFare,
    isFreeWalk: false,
    label: `🛺 Metered Auto-Rickshaw to ${stationName}`,
    advice: `Station is ${dist} km away. Official meter fare is ₹${roundedFare}. Request meter before boarding.`,
  };
}

export interface MultimodalTripEstimate {
  originName: string;
  destName: string;
  totalDirectDistanceKm: number;
  firstMile: FeederSegment;
  originMetroStation: MetroStation;
  destMetroStation: MetroStation;
  metroDistanceKm: number;
  metroFare: number;
  metroDurationMinutes: number;
  metroLineRecommendation: string;
  lastMile: FeederSegment;
  totalCombinedCost: number;
  minPrice: number;
  maxPrice: number;
  totalCombinedMinutes: number;
  directCabCost: number;
  directAutoCost: number;
  savingsVsDirectCab: number;
  disclaimer: string;
}

/**
 * Computes complete DMRC Metro + Local Feeder Multimodal Journey
 */
export function calculateMultimodalJourney(
  originName: string,
  originCoords: { lat: number; lng: number },
  destName: string,
  destCoords: { lat: number; lng: number }
): MultimodalTripEstimate {
  const directDist = calculateDistanceKm(
    originCoords.lat,
    originCoords.lng,
    destCoords.lat,
    destCoords.lng
  );

  // 1. Find nearest metro to origin
  const originStnMatch = findNearestMetroStation(originCoords.lat, originCoords.lng);
  const firstMile = calculateFeederLeg(
    originStnMatch.distanceKm,
    'FIRST_MILE',
    originStnMatch.station.name
  );

  // 2. Find nearest metro to destination
  const destStnMatch = findNearestMetroStation(destCoords.lat, destCoords.lng);
  const lastMile = calculateFeederLeg(
    destStnMatch.distanceKm,
    'LAST_MILE',
    destStnMatch.station.name
  );

  // 3. Metro leg
  const metroDist = Math.max(
    1.2,
    calculateDistanceKm(
      originStnMatch.station.lat,
      originStnMatch.station.lng,
      destStnMatch.station.lat,
      destStnMatch.station.lng
    ) * 1.15
  );

  const isAirport =
    originStnMatch.station.line.includes('Airport') ||
    destStnMatch.station.line.includes('Airport');

  const metroFare = getDmrcStatutoryFare(metroDist, isAirport);
  const metroMins = Math.round((metroDist / 34) * 60 + 4); // DMRC average commercial speed ~34 km/h

  let lineInfo = `${originStnMatch.station.line}`;
  if (originStnMatch.station.line !== destStnMatch.station.line) {
    lineInfo = `${originStnMatch.station.line} ➔ ${destStnMatch.station.line}`;
  }

  // 4. Combined totals
  const totalCost = firstMile.cost + metroFare + lastMile.cost;
  const totalMins = firstMile.durationMinutes + metroMins + lastMile.durationMinutes;

  // Direct Cab & Auto cost benchmarks for comparison
  let directAuto = 30;
  if (directDist > 1.5) directAuto += (directDist - 1.5) * 11;
  directAuto = Math.round(directAuto);

  let directCab = 40;
  if (directDist > 1.0) directCab += (directDist - 1.0) * 17;
  directCab = Math.round(directCab * 1.1);

  const savings = Math.max(0, directCab - totalCost);

  return {
    originName,
    destName,
    totalDirectDistanceKm: directDist,
    firstMile,
    originMetroStation: originStnMatch.station,
    destMetroStation: destStnMatch.station,
    metroDistanceKm: Math.round(metroDist * 10) / 10,
    metroFare,
    metroDurationMinutes: metroMins,
    metroLineRecommendation: lineInfo,
    lastMile,
    totalCombinedCost: totalCost,
    minPrice: totalCost,
    maxPrice: Math.round(totalCost * 1.15),
    totalCombinedMinutes: totalMins,
    directCabCost: directCab,
    directAutoCost: directAuto,
    savingsVsDirectCab: savings,
    disclaimer:
      'DMRC fares adhere to statutory DMRC ticketing slabs. First/last-mile walk is 100% free if under 0.8 km (~10 mins); longer feeder legs use regulated E-Rickshaw (₹10-20) or metered auto rates.',
  };
}
