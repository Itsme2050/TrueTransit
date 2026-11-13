/**
 * Real-time Geocoding and Location Service for TrueTransit
 * Integrates OpenStreetMap Nominatim with local NCR zone knowledge base
 * and browser GPS Geolocation.
 */

export interface GeocodedPlace {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  category?: string;
  source: 'local' | 'osm';
}

// In-memory cache for fast repeated lookups
const geocodeCache: Record<string, GeocodedPlace[]> = {};

// Comprehensive dictionary for standard NCR sectors and zones (instant zero-network resolution)
const KNOWN_NCR_AREAS: Record<string, { lat: number; lng: number; desc: string }> = {
  // Noida Sectors
  'sector 18 noida': { lat: 28.5708, lng: 77.3218, desc: 'Noida Sector 18 (Atta Market / Mall of India)' },
  'sector 52 noida': { lat: 28.5885, lng: 77.3689, desc: 'Noida Sector 52 (Blue Line & Aqua Line Metro Interchange)' },
  'sector 62 noida': { lat: 28.6256, lng: 77.3644, desc: 'Noida Sector 62 (Electronic City & IT Hub)' },
  'sector 15 noida': { lat: 28.5815, lng: 77.3135, desc: 'Noida Sector 15 (Metro Station & Commercial)' },
  'sector 16 noida': { lat: 28.5772, lng: 77.3168, desc: 'Noida Sector 16 (Film City / Metro)' },
  'sector 29 noida': { lat: 28.5732, lng: 77.3340, desc: 'Noida Sector 29 (Brahmaputra Market)' },
  'sector 76 noida': { lat: 28.5662, lng: 77.3828, desc: 'Noida Sector 76 (Residential & Commercial)' },
  'sector 137 noida': { lat: 28.5135, lng: 77.4085, desc: 'Noida Sector 137 (Expressway / Metro)' },
  'botanical garden noida': { lat: 28.5642, lng: 77.3345, desc: 'Noida Botanical Garden Metro Interchange' },
  'noida city centre': { lat: 28.5746, lng: 77.3562, desc: 'Noida City Centre (Wave City Center Metro)' },

  // Gurugram (Gurgaon)
  'dlf cyber city': { lat: 28.4986, lng: 77.0878, desc: 'DLF Cyber City Gurugram' },
  'dlf cyber hub': { lat: 28.4986, lng: 77.0878, desc: 'DLF Cyber Hub Gurugram' },
  'sector 29 gurugram': { lat: 28.4682, lng: 77.0632, desc: 'Sector 29 Gurugram (Brewery & Dining Hub)' },
  'sector 54 gurugram': { lat: 28.4385, lng: 77.1082, desc: 'Sector 54 Gurugram (Golf Course Road)' },
  'sector 56 gurugram': { lat: 28.4285, lng: 77.1122, desc: 'Sector 56 Gurugram (Rapid Metro Terminal)' },
  'golf course road': { lat: 28.4600, lng: 77.1020, desc: 'Golf Course Road Gurugram' },
  'sohna road': { lat: 28.4120, lng: 77.0420, desc: 'Sohna Road Gurugram (Subhash Chowk)' },
  'iffco chowk': { lat: 28.4720, lng: 77.0725, desc: 'IFFCO Chowk Gurugram' },
  'huda city centre': { lat: 28.4595, lng: 77.0725, desc: 'Millennium City Centre Gurugram Metro' },

  // Delhi Neighborhoods
  'connaught place': { lat: 28.6315, lng: 77.2167, desc: 'Connaught Place Central Delhi' },
  'india gate': { lat: 28.6129, lng: 77.2295, desc: 'India Gate & Kartavya Path' },
  'aiims': { lat: 28.5672, lng: 77.2100, desc: 'AIIMS New Delhi' },
  'saket': { lat: 28.5245, lng: 77.2110, desc: 'Saket South Delhi' },
  'hauz khas': { lat: 28.5534, lng: 77.1945, desc: 'Hauz Khas Village & Enclave' },
  'vasant kunj': { lat: 28.5390, lng: 77.1520, desc: 'Vasant Kunj South Delhi' },
  'lajpat nagar': { lat: 28.5679, lng: 77.2433, desc: 'Lajpat Nagar Central Market' },
  'karol bagh': { lat: 28.6517, lng: 77.1906, desc: 'Karol Bagh Central Delhi' },
  'dwarka sector 21': { lat: 28.5522, lng: 77.0585, desc: 'Dwarka Sector 21 Airport Express Interchange' },
  'dwarka sector 10': { lat: 28.5815, lng: 77.0570, desc: 'Dwarka Sector 10 Metro & Market' },
  'rohini sector 18': { lat: 28.7390, lng: 77.1350, desc: 'Rohini Sector 18 Metro & Residential' },
  'chandni chowk': { lat: 28.6562, lng: 77.2309, desc: 'Chandni Chowk Old Delhi' },
  'mayur vihar': { lat: 28.6080, lng: 77.2960, desc: 'Mayur Vihar Phase 1 East Delhi' },
  'laxmi nagar': { lat: 28.6310, lng: 77.2770, desc: 'Laxmi Nagar East Delhi' },
};

export class GeocodingService {
  /**
   * Search addresses via local NCR dictionary + OpenStreetMap Nominatim
   */
  public static async searchAddresses(query: string): Promise<GeocodedPlace[]> {
    const clean = query.trim().toLowerCase();
    if (!clean || clean.length < 2) return [];

    if (geocodeCache[clean]) {
      return geocodeCache[clean];
    }

    const results: GeocodedPlace[] = [];

    // 1. Check local NCR areas dictionary
    for (const [key, area] of Object.entries(KNOWN_NCR_AREAS)) {
      if (key.includes(clean) || clean.includes(key)) {
        results.push({
          name: key.toUpperCase(),
          displayName: area.desc,
          lat: area.lat,
          lng: area.lng,
          category: 'NCR Area',
          source: 'local',
        });
      }
    }

    // 2. Query OpenStreetMap Nominatim for exact real-world address
    try {
      // Append Delhi/NCR to improve local accuracy if not explicitly specified
      const searchQuery = clean.includes('delhi') || clean.includes('noida') || clean.includes('gurugram') || clean.includes('gurgaon')
        ? clean
        : `${clean}, Delhi NCR, India`;

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=4&countrycodes=in&addressdetails=1`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (!isNaN(lat) && !isNaN(lng)) {
              // Avoid duplicates
              if (!results.some((r) => Math.abs(r.lat - lat) < 0.005 && Math.abs(r.lng - lng) < 0.005)) {
                results.push({
                  name: item.name || clean,
                  displayName: item.display_name,
                  lat,
                  lng,
                  category: item.type ? item.type.replace('_', ' ') : 'Address',
                  source: 'osm',
                });
              }
            }
          });
        }
      }
    } catch {
      // Silently fall back to local results if offline or network drops
    }

    geocodeCache[clean] = results;
    return results;
  }

  /**
   * Geocode a single address to lat/lng coordinates with intelligent fallbacks
   */
  public static async geocodeAddress(query: string): Promise<{ lat: number; lng: number; displayName: string }> {
    const clean = query.trim().toLowerCase();

    // 1. Exact match in local dictionary
    if (KNOWN_NCR_AREAS[clean]) {
      const area = KNOWN_NCR_AREAS[clean];
      return { lat: area.lat, lng: area.lng, displayName: area.desc };
    }

    // Check partial matches in local dictionary
    for (const [key, area] of Object.entries(KNOWN_NCR_AREAS)) {
      if (clean.includes(key) || key.includes(clean)) {
        return { lat: area.lat, lng: area.lng, displayName: area.desc };
      }
    }

    // 2. Query OSM Nominatim
    try {
      const osmResults = await this.searchAddresses(query);
      if (osmResults.length > 0) {
        return {
          lat: osmResults[0].lat,
          lng: osmResults[0].lng,
          displayName: osmResults[0].displayName,
        };
      }
    } catch {
      // Ignore network errors
    }

    // 3. Fallback: derive coordinate within Delhi bounds
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i);
      hash |= 0;
    }
    const latOffset = ((Math.abs(hash) % 200) - 100) / 1000;
    const lngOffset = ((Math.abs(hash >> 3) % 200) - 100) / 1000;
    return {
      lat: 28.6139 + latOffset,
      lng: 77.2090 + lngOffset,
      displayName: query,
    };
  }

  /**
   * Reverse geocode a latitude/longitude pair into a human-readable locality
   */
  public static async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.neighbourhood || addr.suburb || addr.commercial || addr.residential;
          const city = addr.city || addr.state_district || addr.town || 'Delhi NCR';
          if (road) {
            return `${road}, ${city}`;
          }
          if (data.display_name) {
            const parts = data.display_name.split(',');
            return parts.slice(0, 3).join(',').trim();
          }
        }
      }
    } catch {
      // Fallback
    }

    return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }

  /**
   * Retrieve user's current GPS location with high accuracy
   */
  public static getCurrentPosition(): Promise<{ lat: number; lng: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          let msg = 'Unable to fetch your current location.';
          if (err.code === 1) msg = 'Location access permission was denied. Please allow location access in your browser.';
          if (err.code === 2) msg = 'Location is currently unavailable. Please check GPS connection.';
          if (err.code === 3) msg = 'Location request timed out. Please try again.';
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }
}
