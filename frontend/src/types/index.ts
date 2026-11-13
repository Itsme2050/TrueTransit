export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  preferredLanguage: string;
  emergencyNote?: string;
  bloodGroup?: string;
}

export interface FairPriceEstimate {
  category: string;
  itemName: string;
  minPrice: number;
  maxPrice: number;
  typicalPrice: number;
  currency: string;
  pricingModel: string;
  breakdown: Record<string, any>;
  confidence: number;
  freshness: string;
  source: string;
  disclaimer: string;
  comparison?: {
    quotedPrice: number;
    differenceAmount: number;
    differencePercentage: number;
    verdict: 'FAIR' | 'SLIGHTLY_ABOVE' | 'SIGNIFICANTLY_ABOVE' | 'BELOW_TYPICAL';
    verdictLabel: string;
    advice: string;
  };
}

export interface PriceSearchMeta {
  isDemoData: boolean;
  isCommunityReport: boolean;
  city: string;
  demoMode: boolean;
  queriedAt: string;
}

export interface RouteAlternative {
  id: string;
  name: string;
  type: 'FASTEST' | 'SAFEST' | 'BALANCED';
  distanceKm: number;
  durationMinutes: number;
  safetyScore: number;
  safetyLevel: 'LOWER_CONCERN' | 'CAUTION' | 'ELEVATED_CONCERN';
  waypoints: { lat: number; lng: number }[];
  keyStreets: string[];
  tradeOffSummary: string;
  lightingQuality: 'EXCELLENT' | 'MODERATE' | 'POOR';
  transitAccessibility: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedHours: string;
  rationale: string;
}

export interface SafetyHeatPoint {
  name: string;
  zoneType: string;
  hour: number;
  safetyScore: number;
  level: 'LOWER_CONCERN' | 'CAUTION' | 'ELEVATED_CONCERN';
  colorCode: string;
  lat: number;
  lng: number;
  breakdown: {
    streetLighting: number;
    pedestrianVitality: number;
    transitProximity: number;
    infrastructure: number;
    surveillanceAndSecurity: number;
    timeOfDayModifier: number;
    incidentDeductions: number;
  };
  evidenceRationale: string[];
  disclaimer: string;
}

export interface ItineraryStop {
  orderIndex: number;
  placeName: string;
  category: string;
  arrivalTime: string;
  departureTime: string;
  activityCost: number;
  transportCost: number;
  travelMethod: string;
  safetyNote?: string;
  address?: string;
}

export interface GeneratedItinerary {
  title: string;
  city: string;
  startingPoint: string;
  destination: string;
  totalBudget: number;
  estimatedCost: number;
  remainingBudget: number;
  durationHours: number;
  purpose: string;
  transportPreference: string;
  validation: {
    isValid: boolean;
    totalBudget: number;
    totalCalculatedCost: number;
    remainingBudget: number;
    varianceAmount: number;
    isOverBudget: boolean;
    totalDurationMinutes: number;
    availableMinutes: number;
    isOverTime: boolean;
    warnings: string[];
    adjustmentsMade: string[];
    itemizedCosts?: {
      transportTotal: number;
      activityTotal: number;
    };
  };
  stops: ItineraryStop[];
  isAIGenerated: boolean;
  modelUsed: string;
  summaryNote: string;
  disclaimer: string;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'POLICE_STATION' | 'PHARMACY' | 'EMBASSY';
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  is24Hours: boolean;
  distanceKm?: number;
}
