export interface LandmarkInfo {
  name: string;
  lat: number;
  lng: number;
  desc: string;
  category: 'Transit' | 'Monument' | 'Shopping' | 'Healthcare' | 'Corporate' | 'Spiritual' | 'Dining' | 'Education' | 'Culture';
  isFamous?: boolean;
  aliases?: string[];
}

export const LANDMARKS_DATA: LandmarkInfo[] = [
  // Transit Gateways
  {
    name: 'New Delhi Railway Station',
    lat: 28.6429,
    lng: 77.2201,
    desc: 'Major Northern Transit Hub & Airport Express Metro',
    category: 'Transit',
    isFamous: true,
    aliases: ['NDLS', 'New Delhi Station', 'Paharganj Station', 'Ajmeri Gate'],
  },
  {
    name: 'Delhi Airport Terminal 3 (IGI)',
    lat: 28.5562,
    lng: 77.1000,
    desc: 'Indira Gandhi International Airport Terminal 3',
    category: 'Transit',
    isFamous: true,
    aliases: ['IGI', 'T3', 'Airport', 'Indira Gandhi Airport', 'International Airport'],
  },
  {
    name: 'Delhi Airport Terminal 1 (Domestic)',
    lat: 28.5700,
    lng: 77.1120,
    desc: 'Domestic Flight Terminal (IndiGo / SpiceJet)',
    category: 'Transit',
    isFamous: true,
    aliases: ['T1', 'Domestic Airport', 'Terminal 1'],
  },
  {
    name: 'Old Delhi Railway Station',
    lat: 28.6619,
    lng: 77.2280,
    desc: 'Historic Delhi Junction Station & Chandni Chowk Metro',
    category: 'Transit',
    isFamous: true,
    aliases: ['DLI', 'Old Delhi Station', 'Delhi Junction'],
  },
  {
    name: 'Hazrat Nizamuddin Railway Station',
    lat: 28.5898,
    lng: 77.2530,
    desc: 'Southbound & Rajdhani Transit Terminal',
    category: 'Transit',
    isFamous: true,
    aliases: ['NZM', 'Nizamuddin Station', 'Sarai Kale Khan'],
  },
  {
    name: 'Kashmere Gate ISBT',
    lat: 28.6667,
    lng: 77.2285,
    desc: 'Interstate Bus Terminal & Triple-Line Metro Interchange',
    category: 'Transit',
    isFamous: true,
    aliases: ['ISBT', 'Kashmere Gate Bus Stand', 'Inter State Bus Terminal'],
  },
  {
    name: 'Anand Vihar ISBT & Railway Station',
    lat: 28.6469,
    lng: 77.3160,
    desc: 'East Delhi Mega Transit Terminal & Blue Line Metro',
    category: 'Transit',
    isFamous: false,
    aliases: ['Anand Vihar Terminal', 'ANVT', 'East Delhi ISBT'],
  },

  // Historic Monuments & Attractions
  {
    name: 'India Gate',
    lat: 28.6129,
    lng: 77.2295,
    desc: 'Historic War Memorial & Kartavya Path Promenade',
    category: 'Monument',
    isFamous: true,
    aliases: ['Kartavya Path', 'Rajpath', 'National War Memorial'],
  },
  {
    name: 'Red Fort (Lal Qila)',
    lat: 28.6562,
    lng: 77.2410,
    desc: 'Mughal Historic Citadel & UNESCO World Heritage Site',
    category: 'Monument',
    isFamous: true,
    aliases: ['Lal Qila', 'Red Fort', 'Lal Kila'],
  },
  {
    name: 'Qutub Minar',
    lat: 28.5244,
    lng: 77.1855,
    desc: 'UNESCO World Heritage 73m Minaret & Mehrauli Complex',
    category: 'Monument',
    isFamous: true,
    aliases: ['Qutab Minar', 'Mehrauli Archaeological Park', 'Iron Pillar'],
  },
  {
    name: 'Humayun\'s Tomb',
    lat: 28.5933,
    lng: 77.2507,
    desc: 'UNESCO Mughal Garden Tomb & Sunder Nursery',
    category: 'Monument',
    isFamous: true,
    aliases: ['Humayun Ka Maqbara', 'Sunder Nursery', 'Nizamuddin Tomb'],
  },
  {
    name: 'Lotus Temple (Baháʼí)',
    lat: 28.5535,
    lng: 77.2588,
    desc: 'Iconic Lotus-Shaped Baháʼí House of Worship',
    category: 'Spiritual',
    isFamous: true,
    aliases: ['Lotus Temple', 'Bahai Temple', 'Kalkaji Temple'],
  },
  {
    name: 'Akshardham Temple',
    lat: 28.6127,
    lng: 77.2773,
    desc: 'Grand Hindu Cultural Campus & Sahaj Anand Water Show',
    category: 'Spiritual',
    isFamous: true,
    aliases: ['Swaminarayan Akshardham', 'Akshardham Mandir'],
  },
  {
    name: 'Jama Masjid (Old Delhi)',
    lat: 28.6507,
    lng: 77.2334,
    desc: 'Grand 17th Century Historic Mughal Mosque',
    category: 'Spiritual',
    isFamous: true,
    aliases: ['Jama Masjid', 'Old Delhi Mosque', 'Shahjahanabad'],
  },
  {
    name: 'Gurudwara Bangla Sahib',
    lat: 28.6263,
    lng: 77.2090,
    desc: 'Historic Sikh Shrine & Community Kitchen (Langar)',
    category: 'Spiritual',
    isFamous: true,
    aliases: ['Bangla Sahib', 'Gurudwara', 'CP Gurudwara'],
  },

  // City Centre & Commercial Hubs
  {
    name: 'Connaught Place',
    lat: 28.6315,
    lng: 77.2167,
    desc: 'Central Business District, Rajiv Chowk & Georgian Colonnade',
    category: 'Corporate',
    isFamous: true,
    aliases: ['CP', 'Rajiv Chowk', 'Central Delhi', 'Inner Circle', 'Outer Circle'],
  },
  {
    name: 'DLF Cyber Hub (Gurugram)',
    lat: 28.4986,
    lng: 77.0878,
    desc: 'NCR Premier Corporate Dining & Social Boulevard',
    category: 'Dining',
    isFamous: true,
    aliases: ['Cyber Hub', 'CyberHub', 'Gurugram Cyber Hub', 'DLF Hub'],
  },
  {
    name: 'DLF Cyber City (Gurugram)',
    lat: 28.4986,
    lng: 77.0878,
    desc: 'NCR Premier Tech Hub & Rapid Metro Corridor',
    category: 'Corporate',
    isFamous: true,
    aliases: ['Cyber City', 'DLF CyberCity', 'Gurgaon Tech Park'],
  },
  {
    name: 'Aerocity Hospitality Hub',
    lat: 28.5490,
    lng: 77.1215,
    desc: 'Airport Luxury Hotel District, Worldmark & Global Dining',
    category: 'Dining',
    isFamous: true,
    aliases: ['Aerocity', 'Worldmark Aerocity', 'Airport Hotels'],
  },
  {
    name: 'Hauz Khas Village',
    lat: 28.5534,
    lng: 77.1945,
    desc: 'Bohemian Urban Village, Medieval Fort & Lakeside Cafes',
    category: 'Dining',
    isFamous: true,
    aliases: ['HKV', 'Hauz Khas Fort', 'Deer Park'],
  },

  // Famous Markets & Bazaars
  {
    name: 'Chandni Chowk Heritage',
    lat: 28.6562,
    lng: 77.2309,
    desc: 'Historic Market, Street Food, Paranthe Wali Gali & Spices',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Chandni Chowk', 'Paranthe Wali Gali', 'Khari Baoli', 'Dariba Kalan'],
  },
  {
    name: 'Sarojini Nagar Market',
    lat: 28.5762,
    lng: 77.1983,
    desc: 'Renowned Apparel, Fashion & Export Surplus Bazaar',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Sarojini', 'SN Market', 'Babu Market'],
  },
  {
    name: 'Dilli Haat INA',
    lat: 28.5744,
    lng: 77.2085,
    desc: 'Open-Air Traditional Craft & Regional Culinary Bazaar',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Dilli Haat', 'INA Market', 'Craft Bazaar'],
  },
  {
    name: 'Khan Market',
    lat: 28.6003,
    lng: 77.2270,
    desc: 'Upscale Boutique Dining, Bookstores & Designer Retail',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Khan Market', 'Middle Lane Khan Market'],
  },
  {
    name: 'Lajpat Nagar Central Market',
    lat: 28.5679,
    lng: 77.2433,
    desc: 'Ethnic Wear, Bridal Shopping & Street Delicacies',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Lajpat Nagar', 'Central Market', 'Lajpat Market'],
  },
  {
    name: 'Karol Bagh Market',
    lat: 28.6517,
    lng: 77.1906,
    desc: 'Traditional Jewelry, Garments & Ghaffar Electronics Market',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Karol Bagh', 'Gaffar Market', 'Ajmal Khan Road'],
  },
  {
    name: 'Select CITYWALK (Saket)',
    lat: 28.5284,
    lng: 77.2185,
    desc: 'South Delhi Premier Shopping Mall & Entertainment Plaza',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Saket Mall', 'Citywalk', 'DLF Avenue Saket'],
  },
  {
    name: 'DLF Mall of India (Noida Sector 18)',
    lat: 28.5678,
    lng: 77.3211,
    desc: 'Largest Multi-Storey Retail & Entertainment Mall in NCR',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Mall of India', 'Noida Mall', 'Sector 18 Mall'],
  },
  {
    name: 'DLF Promenade (Vasant Kunj)',
    lat: 28.5416,
    lng: 77.1558,
    desc: 'South Delhi Luxury Mall & Cinema Complex',
    category: 'Shopping',
    isFamous: false,
    aliases: ['Promenade', 'Vasant Kunj Mall'],
  },
  {
    name: 'DLF Emporio (Vasant Kunj)',
    lat: 28.5422,
    lng: 77.1569,
    desc: 'Ultra-Luxury Fashion, Haute Couture & Boutiques',
    category: 'Shopping',
    isFamous: false,
    aliases: ['Emporio', 'DLF Luxury Mall'],
  },
  {
    name: 'Paharganj Main Bazaar',
    lat: 28.6432,
    lng: 77.2135,
    desc: 'Budget Backpacker Hub, Leather Goods & Rooftop Cafes',
    category: 'Shopping',
    isFamous: true,
    aliases: ['Paharganj', 'Backpacker Street', 'Main Bazaar'],
  },
  {
    name: 'Majnu Ka Tilla',
    lat: 28.7001,
    lng: 77.2275,
    desc: 'Tibetan Colony, Monasteries, Cafes & Laphing Delicacies',
    category: 'Culture',
    isFamous: true,
    aliases: ['MKT', 'Tibetan Market', 'Little Tibet'],
  },

  // Healthcare Precincts
  {
    name: 'AIIMS New Delhi',
    lat: 28.5672,
    lng: 77.2100,
    desc: 'All India Institute of Medical Sciences (Apex Medical Centre)',
    category: 'Healthcare',
    isFamous: true,
    aliases: ['AIIMS', 'All India Institute', 'AIIMS Hospital', 'Ansari Nagar'],
  },
  {
    name: 'Safdarjung Hospital',
    lat: 28.5701,
    lng: 77.2078,
    desc: 'Government Multi-Specialty Hospital & Emergency Wing',
    category: 'Healthcare',
    isFamous: true,
    aliases: ['Safdarjang Hospital', 'Safdarjung Emergency'],
  },
  {
    name: 'Max Super Speciality Hospital (Saket)',
    lat: 28.5280,
    lng: 77.2120,
    desc: 'Tertiary Care Super Speciality Hospital',
    category: 'Healthcare',
    isFamous: false,
    aliases: ['Max Saket', 'Max Hospital'],
  },
  {
    name: 'Fortis Escorts Heart Institute (Okhla)',
    lat: 28.5601,
    lng: 77.2830,
    desc: 'Cardiac Care & Advanced Surgery Hospital',
    category: 'Healthcare',
    isFamous: false,
    aliases: ['Fortis Escorts', 'Fortis Okhla'],
  },

  // Education & Culture
  {
    name: 'Delhi University North Campus',
    lat: 28.6892,
    lng: 77.2096,
    desc: 'Academic Corridor, St. Stephen\'s, SRCC, Hindu College',
    category: 'Education',
    isFamous: true,
    aliases: ['DU North Campus', 'Delhi University', 'Vishwa Vidyalaya'],
  },
  {
    name: 'Jawaharlal Nehru University (JNU)',
    lat: 28.5398,
    lng: 77.1665,
    desc: 'South Delhi University Campus & Research Institute',
    category: 'Education',
    isFamous: true,
    aliases: ['JNU', 'Jawaharlal Nehru University'],
  },
  {
    name: 'IIT Delhi (Hauz Khas)',
    lat: 28.5450,
    lng: 77.1926,
    desc: 'Indian Institute of Technology Premier Engineering Campus',
    category: 'Education',
    isFamous: true,
    aliases: ['IIT', 'IIT Delhi', 'Hauz Khas IIT'],
  },
  {
    name: 'Lodhi Art District & Garden',
    lat: 28.5916,
    lng: 77.2215,
    desc: 'Public Open-Air Mural Art District & Historic Tombs Garden',
    category: 'Culture',
    isFamous: true,
    aliases: ['Lodhi Garden', 'Lodhi Art District', 'Lodi Gardens'],
  },
];

// Helper mapping for lookup by exact name
export const LANDMARKS_BY_NAME: Record<string, LandmarkInfo> = {};
LANDMARKS_DATA.forEach((lm) => {
  LANDMARKS_BY_NAME[lm.name] = lm;
});

// Category Icons & Badges
export const CATEGORY_ICONS: Record<LandmarkInfo['category'], string> = {
  Transit: '🚆',
  Monument: '🏛️',
  Shopping: '🛍️',
  Healthcare: '🏥',
  Corporate: '🏢',
  Spiritual: '🛕',
  Dining: '🍽️',
  Education: '🎓',
  Culture: '🎨',
};

export interface PlaceSuggestionResult {
  landmark: LandmarkInfo;
  score: number;
  matchType: 'exact' | 'starts_with' | 'word_starts_with' | 'alias' | 'substring' | 'famous_default';
  matchedSubstr?: string;
}

/**
 * Intelligent guess and suggestion engine.
 * When query is empty: returns curated famous places.
 * When query is typed: ranks results by match quality and identifies the "Best Guess".
 */
export function getPlaceSuggestions(
  query: string,
  categoryFilter?: LandmarkInfo['category'] | 'ALL',
  limit: number = 8
): { suggestions: PlaceSuggestionResult[]; bestGuess: LandmarkInfo | null } {
  const cleanQuery = query.trim().toLowerCase();

  let pool = LANDMARKS_DATA;
  if (categoryFilter && categoryFilter !== 'ALL') {
    pool = pool.filter((lm) => lm.category === categoryFilter);
  }

  // 1. If empty query: return famous places prioritized
  if (!cleanQuery) {
    const famous = pool
      .filter((lm) => lm.isFamous)
      .slice(0, limit)
      .map((landmark) => ({
        landmark,
        score: 100,
        matchType: 'famous_default' as const,
      }));
    return {
      suggestions: famous,
      bestGuess: null,
    };
  }

  // 2. Query is typed: calculate relevance score
  const scored: PlaceSuggestionResult[] = [];

  for (const lm of pool) {
    const nameLower = lm.name.toLowerCase();
    const descLower = lm.desc.toLowerCase();
    const catLower = lm.category.toLowerCase();
    const words = nameLower.split(/\s+/);

    let score = 0;
    let matchType: PlaceSuggestionResult['matchType'] = 'substring';

    if (nameLower === cleanQuery) {
      score = 1000;
      matchType = 'exact';
    } else if (nameLower.startsWith(cleanQuery)) {
      score = 500 + (100 - nameLower.length);
      matchType = 'starts_with';
    } else if (words.some((w) => w.startsWith(cleanQuery))) {
      score = 350 + (50 - words.findIndex((w) => w.startsWith(cleanQuery)) * 10);
      matchType = 'word_starts_with';
    } else {
      // Check aliases
      const matchingAlias = lm.aliases?.find((a) => a.toLowerCase().startsWith(cleanQuery) || a.toLowerCase() === cleanQuery);
      if (matchingAlias) {
        score = 300 + (matchingAlias.toLowerCase() === cleanQuery ? 100 : 0);
        matchType = 'alias';
      } else if (nameLower.includes(cleanQuery)) {
        score = 200;
        matchType = 'substring';
      } else if (lm.aliases?.some((a) => a.toLowerCase().includes(cleanQuery))) {
        score = 150;
        matchType = 'alias';
      } else if (descLower.includes(cleanQuery) || catLower.includes(cleanQuery)) {
        score = 80;
        matchType = 'substring';
      }
    }

    // Boost famous spots slightly
    if (lm.isFamous && score > 0) {
      score += 25;
    }

    if (score > 0) {
      scored.push({
        landmark: lm,
        score,
        matchType,
      });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const topResults = scored.slice(0, limit);
  const bestGuess = topResults.length > 0 && cleanQuery.length >= 2 ? topResults[0].landmark : null;

  return {
    suggestions: topResults,
    bestGuess,
  };
}

/**
 * Resolve coordinates for any place name.
 */
export function resolvePlaceCoordinates(name: string): { lat: number; lng: number } {
  const normalized = name.trim();
  if (LANDMARKS_BY_NAME[normalized]) {
    return { lat: LANDMARKS_BY_NAME[normalized].lat, lng: LANDMARKS_BY_NAME[normalized].lng };
  }

  for (const lm of LANDMARKS_DATA) {
    if (
      lm.name.toLowerCase() === normalized.toLowerCase() ||
      lm.name.toLowerCase().includes(normalized.toLowerCase()) ||
      normalized.toLowerCase().includes(lm.name.toLowerCase()) ||
      lm.aliases?.some((a) => a.toLowerCase() === normalized.toLowerCase())
    ) {
      return { lat: lm.lat, lng: lm.lng };
    }
  }

  // Fallback: deterministic coordinate derivation for Delhi-NCR
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 200) - 100) / 1000;
  const lngOffset = ((Math.abs(hash >> 3) % 200) - 100) / 1000;
  return {
    lat: 28.6139 + latOffset,
    lng: 77.2090 + lngOffset,
  };
}
