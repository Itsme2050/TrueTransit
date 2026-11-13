export interface TravelPurposeInfo {
  name: string;
  category: 'Healthcare' | 'Tourism' | 'Food' | 'Shopping' | 'Business' | 'Spiritual' | 'Culture' | 'Transit';
  desc: string;
  icon: string;
  aliases: string[];
}

export const TRAVEL_PURPOSES: TravelPurposeInfo[] = [
  {
    name: 'Medical Appointment & Lunch',
    category: 'Healthcare',
    desc: 'Specialist consultation, diagnostics & hygienic nearby dining',
    icon: '🏥',
    aliases: ['medical', 'doctor', 'aiims', 'hospital', 'clinic', 'opd', 'checkup', 'treatment', 'health', 'consultation'],
  },
  {
    name: 'Historic Monuments & Heritage Sightseeing',
    category: 'Tourism',
    desc: 'UNESCO architecture, Mughal forts & iconic national memorials',
    icon: '🏛️',
    aliases: ['tourism', 'tourist', 'monuments', 'history', 'red fort', 'india gate', 'qutub minar', 'sightseeing', 'heritage'],
  },
  {
    name: 'Street Food Walk & Culinary Tasting',
    category: 'Food',
    desc: 'Famous Old Delhi street specialties, paranthas & traditional desserts',
    icon: '🍲',
    aliases: ['food', 'lunch', 'dinner', 'street food', 'chaat', 'eating', 'taste', 'restaurant', 'paranthe', 'culinary'],
  },
  {
    name: 'Bazaar Shopping & Handicrafts Hunt',
    category: 'Shopping',
    desc: 'Famous apparel flea markets, ethnic jewelry & export bargains',
    icon: '🛍️',
    aliases: ['shopping', 'clothes', 'sarojini', 'market', 'bazaar', 'souvenirs', 'handicrafts', 'bargain', 'buy'],
  },
  {
    name: 'Business Meetings & Corporate Hub Visit',
    category: 'Business',
    desc: 'Corporate appointments, tech parks & quiet cafe workspaces',
    icon: '💼',
    aliases: ['business', 'work', 'corporate', 'meeting', 'cyber city', 'conference', 'office', 'client'],
  },
  {
    name: 'Spiritual Pilgrimage & Peaceful Shrines',
    category: 'Spiritual',
    desc: 'Historic Gurudwaras, grand temples & tranquil prayer grounds',
    icon: '🛕',
    aliases: ['temple', 'spiritual', 'prayer', 'gurudwara', 'mosque', 'peace', 'worship', 'akshardham', 'lotus temple'],
  },
  {
    name: 'Museums, Art & Cultural Exploration',
    category: 'Culture',
    desc: 'National museums, contemporary art galleries & street murals',
    icon: '🎨',
    aliases: ['art', 'museum', 'exhibition', 'gallery', 'culture', 'crafts', 'national museum', 'lodhi'],
  },
  {
    name: 'Airport Layover & Express City Highlights',
    category: 'Transit',
    desc: 'Time-bounded express sightseeing safely timed for connecting flights',
    icon: '✈️',
    aliases: ['transit', 'layover', 'airport', 'flight', 'stopover', 'short trip', 'connecting'],
  },
];

export interface PurposeSuggestionResult {
  purpose: TravelPurposeInfo;
  score: number;
  matchType: 'exact' | 'starts_with' | 'word_starts_with' | 'alias' | 'substring';
}

export function getPurposeSuggestions(
  query: string,
  categoryFilter?: TravelPurposeInfo['category'] | 'ALL',
  limit: number = 6
): { suggestions: PurposeSuggestionResult[]; bestGuess: TravelPurposeInfo | null } {
  const cleanQuery = query.trim().toLowerCase();

  let pool = TRAVEL_PURPOSES;
  if (categoryFilter && categoryFilter !== 'ALL') {
    pool = pool.filter((p) => p.category === categoryFilter);
  }

  // 1. If empty query: return default popular list
  if (!cleanQuery) {
    return {
      suggestions: pool.slice(0, limit).map((purpose) => ({
        purpose,
        score: 100,
        matchType: 'starts_with',
      })),
      bestGuess: null,
    };
  }

  // 2. Query is typed: calculate relevance score
  const scored: PurposeSuggestionResult[] = [];

  for (const p of pool) {
    const nameLower = p.name.toLowerCase();
    const descLower = p.desc.toLowerCase();
    const catLower = p.category.toLowerCase();
    const words = nameLower.split(/\s+/);

    let score = 0;
    let matchType: PurposeSuggestionResult['matchType'] = 'substring';

    if (nameLower === cleanQuery) {
      score = 1000;
      matchType = 'exact';
    } else if (nameLower.startsWith(cleanQuery)) {
      score = 500 + (50 - nameLower.length);
      matchType = 'starts_with';
    } else if (words.some((w) => w.startsWith(cleanQuery))) {
      score = 350;
      matchType = 'word_starts_with';
    } else {
      const aliasMatch = p.aliases.find((a) => a.startsWith(cleanQuery) || a === cleanQuery);
      if (aliasMatch) {
        score = 320;
        matchType = 'alias';
      } else if (p.aliases.some((a) => a.includes(cleanQuery))) {
        score = 220;
        matchType = 'alias';
      } else if (nameLower.includes(cleanQuery)) {
        score = 200;
        matchType = 'substring';
      } else if (descLower.includes(cleanQuery) || catLower.includes(cleanQuery)) {
        score = 100;
        matchType = 'substring';
      }
    }

    if (score > 0) {
      scored.push({
        purpose: p,
        score,
        matchType,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const topResults = scored.slice(0, limit);
  const bestGuess = topResults.length > 0 && cleanQuery.length >= 2 ? topResults[0].purpose : null;

  return {
    suggestions: topResults,
    bestGuess,
  };
}
