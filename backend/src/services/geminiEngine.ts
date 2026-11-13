/**
 * Gemini-Powered Smart Itinerary Planning Service
 * Integrates Google Gemini API with fallback demo synthesis and programmatic budget validation.
 */

import { config } from '../config';
import { logger } from '../utils/logger';
import { BudgetValidator, BudgetValidationReport, ItineraryStopInput } from './budgetValidator';

export interface GenerateItineraryRequest {
  startingPoint: string;
  destination: string;
  freeHours: number;
  totalBudget: number;
  startTime?: string;
  purpose?: string; // 'MEDICAL' | 'TOURISM' | 'BUSINESS' | 'FOOD_WALK' | 'SHOPPING'
  transportPreference?: 'METRO' | 'AUTO' | 'CAB' | 'WALKING' | 'BALANCED';
  dietaryPreference?: string;
  accessibilityNeeds?: string;
  safetyPriority?: 'HIGH' | 'STANDARD';
  customNotes?: string;
}

// Utility functions for dynamic custom timing
export function formatMinutesToTime(totalMinutes: number): string {
  let mins = Math.round(totalMinutes) % (24 * 60);
  if (mins < 0) mins += 24 * 60;
  const hour24 = Math.floor(mins / 60);
  const minutes = mins % 60;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 10 * 60; // 10:00 AM default
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 10 * 60;
  let hour = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = (match[3] || '').toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + mins;
}

export interface GeneratedItineraryResponse {
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
  validation: BudgetValidationReport;
  stops: ItineraryStopInput[];
  isAIGenerated: boolean;
  modelUsed: string;
  summaryNote: string;
  disclaimer: string;
}

export class GeminiEngine {
  /**
   * Generates a validated itinerary matching input criteria
   */
  public static async generateItinerary(req: GenerateItineraryRequest): Promise<GeneratedItineraryResponse> {
    let stops: ItineraryStopInput[] = [];
    let isAI = false;
    let modelName = 'TrueTransit Local Deterministic Heuristic Engine (Demo Mode)';
    let summary = '';

    // If Gemini API Key is configured and not in forced offline demo mode, call Gemini
    if (config.geminiApiKey && !config.geminiApiKey.startsWith('your_')) {
      try {
        const aiResult = await this.callGeminiAPI(req);
        if (aiResult && aiResult.stops && aiResult.stops.length > 0) {
          stops = aiResult.stops;
          isAI = true;
          modelName = `Google Gemini (${config.geminiModel || 'Flash'})`;
          summary = aiResult.summary || 'AI-generated contextual itinerary optimized for budget and safety.';
        }
      } catch (err: any) {
        logger.warn('Gemini API call failed, falling back to local deterministic engine:', err.message);
      }
    }

    // Fallback: Generate contextual, realistic, high-quality seeded itinerary for Delhi
    if (stops.length === 0) {
      const generated = this.generateDemoItinerary(req);
      stops = generated.stops;
      summary = generated.summary;
    }

    // Deterministically validate and reconcile budget calculations
    const validation = BudgetValidator.validate({
      totalBudget: req.totalBudget,
      freeHours: req.freeHours,
      stops,
    });

    return {
      title: `${req.purpose || 'Trip'} in Delhi: ${req.startingPoint} to ${req.destination}`,
      city: 'Delhi',
      startingPoint: req.startingPoint,
      destination: req.destination,
      totalBudget: req.totalBudget,
      estimatedCost: validation.totalCalculatedCost,
      remainingBudget: validation.remainingBudget,
      durationHours: req.freeHours,
      purpose: req.purpose || 'EXPLORATION',
      transportPreference: req.transportPreference || 'BALANCED',
      validation,
      stops: validation.reconciledStops,
      isAIGenerated: isAI,
      modelUsed: modelName,
      summaryNote: summary,
      disclaimer: 'All estimated costs, transit methods, and safety notes are decision-support guidelines. Please verify venue operating hours and local traffic conditions before departure.',
    };
  }

  /**
   * Invokes Google Gemini REST API using structured output prompt
   */
  private static async callGeminiAPI(req: GenerateItineraryRequest): Promise<{ stops: ItineraryStopInput[]; summary: string } | null> {
    const prompt = `You are TrueTransit's AI Urban Travel Planner for Delhi, India.
Generate a structured, budget-conscious travel itinerary with EXACT realistic Indian Rupee (INR) costs.

USER CONSTRAINTS:
- Starting Point: "${req.startingPoint}"
- Destination: "${req.destination}"
- Available Time: ${req.freeHours} hours
- Maximum Total Budget: ₹${req.totalBudget} INR
- Travel Purpose: ${req.purpose || 'General exploration'}
- Preferred Transport: ${req.transportPreference || 'Balanced (Metro/Auto)'}
- Dietary/Accessibility: ${req.dietaryPreference || 'Standard'}, ${req.accessibilityNeeds || 'None'}

REQUIREMENTS:
1. Provide between 3 to 5 realistic stops.
2. The SUM of all transportCost and activityCost across all stops MUST NOT exceed ₹${req.totalBudget}.
3. Transport costs must reflect real Delhi rates (Metro: ₹20-₹50, Auto: ₹40-₹150).
4. Include practical safety notes for each stop (e.g., lighting, transit crowd advice).
5. Output STRICT JSON ONLY matching this format:
{
  "summary": "Short 2-sentence summary of the plan",
  "stops": [
    {
      "orderIndex": 1,
      "placeName": "Name of location",
      "category": "TRANSIT | FOOD | ATTRACTION | APPOINTMENT",
      "arrivalTime": "10:00 AM",
      "departureTime": "11:00 AM",
      "transportCost": 40,
      "activityCost": 120,
      "travelMethod": "Delhi Metro Yellow Line",
      "safetyNote": "Well-lit station with active CISF security",
      "address": "Delhi"
    }
  ]
}`;

    const model = config.geminiModel || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error status ${response.status}: ${await response.text()}`);
    }

    const json: any = await response.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText);
    return {
      stops: parsed.stops || [],
      summary: parsed.summary || 'AI optimized itinerary.',
    };
  }

  /**
   * Deterministic local itinerary synthesizer for the Delhi demo dataset
   */
  private static generateDemoItinerary(req: GenerateItineraryRequest): { stops: ItineraryStopInput[]; summary: string } {
    const isMedical = (req.purpose || '').toUpperCase().includes('MED') || (req.destination || '').toUpperCase().includes('AIIMS') || (req.destination || '').toUpperCase().includes('HOSPITAL');
    const isShopping = (req.purpose || '').toUpperCase().includes('SHOP') || (req.destination || '').toUpperCase().includes('CHOWK') || (req.destination || '').toUpperCase().includes('MARKET');
    const startMins = parseTimeToMinutes(req.startTime);

    const totalBudget = Math.max(300, req.totalBudget);

    if (isMedical) {
      // Tailored medical scenario (e.g., AIIMS New Delhi appointment with ₹1500 budget and 4 hours)
      const metroFare = 30;
      const autoFare = 60;
      const lunchCost = Math.min(250, Math.round(totalBudget * 0.2));
      const consultBuffer = Math.min(500, Math.round(totalBudget * 0.4));

      return {
        summary: `Optimized clinical visit connecting ${req.startingPoint} to ${req.destination} with reliable low-stress transit, verified hygienic nourishment, and remaining emergency reserves.`,
        stops: [
          {
            orderIndex: 1,
            placeName: `${req.startingPoint} Metro Feeder Station`,
            category: 'TRANSIT',
            arrivalTime: formatMinutesToTime(startMins),
            departureTime: formatMinutesToTime(startMins + 35),
            transportCost: metroFare,
            activityCost: 0,
            travelMethod: 'Delhi Metro Yellow Line (Air-conditioned & CISF guarded)',
            safetyNote: 'Designated women-only front coach and CCTV surveillance on platforms.',
            address: `${req.startingPoint}, New Delhi`,
          },
          {
            orderIndex: 2,
            placeName: `${req.destination} (AIIMS OPD / Healthcare Complex)`,
            category: 'APPOINTMENT',
            arrivalTime: formatMinutesToTime(startMins + 45),
            departureTime: formatMinutesToTime(startMins + 150),
            transportCost: 0,
            activityCost: consultBuffer,
            travelMethod: 'Direct covered subway walkway from Metro Gate 2',
            safetyNote: 'Dedicated institutional security desks and round-the-clock helpdesk counters.',
            address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
          },
          {
            orderIndex: 3,
            placeName: 'Hygienic Dining at Safdarjung Enclave / INA Food Plaza',
            category: 'FOOD',
            arrivalTime: formatMinutesToTime(startMins + 165),
            departureTime: formatMinutesToTime(startMins + 210),
            transportCost: autoFare,
            activityCost: lunchCost,
            travelMethod: 'Pre-paid Delhi Traffic Police Authorized Auto',
            safetyNote: 'Government approved pre-paid booth at hospital gate avoids overcharging disputes.',
            address: 'Dilli Haat / INA Market Food Pavilion, New Delhi',
          },
          {
            orderIndex: 4,
            placeName: 'Quiet Rest & Return Transit via Dilli Haat Crafts Corridor',
            category: 'BREAK',
            arrivalTime: formatMinutesToTime(startMins + 225),
            departureTime: formatMinutesToTime(startMins + 240),
            transportCost: metroFare,
            activityCost: 50,
            travelMethod: 'Delhi Metro Return Link',
            safetyNote: 'Gated tourist craft zone with pedestrian-only walkways and clean restroom facilities.',
            address: 'INA Colony, Kidwai Nagar, New Delhi',
          },
        ],
      };
    }

    if (isShopping) {
      // Chandni Chowk / Heritage walk
      const transportEst = Math.min(100, Math.round(totalBudget * 0.15));
      const foodEst = Math.min(220, Math.round(totalBudget * 0.25));
      const discEst = Math.min(300, Math.round(totalBudget * 0.35));

      return {
        summary: `Vibrant cultural and shopping itinerary from ${req.startingPoint} through Old Delhi's historic corridors with scam-aware street guides and verified local food spots.`,
        stops: [
          {
            orderIndex: 1,
            placeName: `${req.startingPoint} to Chandni Chowk Metro Station`,
            category: 'TRANSIT',
            arrivalTime: formatMinutesToTime(startMins),
            departureTime: formatMinutesToTime(startMins + 35),
            transportCost: transportEst,
            activityCost: 0,
            travelMethod: 'Delhi Metro Yellow Line',
            safetyNote: 'Exit via Town Hall Gate 5 for pedestrianised heritage boulevard.',
            address: 'Chandni Chowk, Old Delhi',
          },
          {
            orderIndex: 2,
            placeName: 'Heritage Walk & Traditional Refreshment (Paranthe Wali Gali)',
            category: 'FOOD',
            arrivalTime: formatMinutesToTime(startMins + 45),
            departureTime: formatMinutesToTime(startMins + 105),
            transportCost: 0,
            activityCost: foodEst,
            travelMethod: 'Pedestrian Boulevard Walk',
            safetyNote: 'Keep valuables zipped in crowded lanes; avoid unofficial touts offering "exclusive gemstone viewings".',
            address: 'Gali Paranthe Wali, Chandni Chowk, Delhi 110006',
          },
          {
            orderIndex: 3,
            placeName: 'Khari Baoli Spice Market & Rooftop Vantage Point',
            category: 'ATTRACTION',
            arrivalTime: formatMinutesToTime(startMins + 120),
            departureTime: formatMinutesToTime(startMins + 195),
            transportCost: 40,
            activityCost: discEst,
            travelMethod: 'E-Rickshaw (Standard ₹20 shared fare)',
            safetyNote: 'Verify shared electric rickshaw rate before boarding; official rate is ₹10-₹20.',
            address: 'Khari Baoli, Old Delhi',
          },
          {
            orderIndex: 4,
            placeName: 'Return Transit via Red Fort Heritage Corridor',
            category: 'TRANSIT',
            arrivalTime: formatMinutesToTime(startMins + 210),
            departureTime: formatMinutesToTime(startMins + 240),
            transportCost: transportEst,
            activityCost: 0,
            travelMethod: 'Heritage Line Metro (Violet Line)',
            safetyNote: 'Spacious pedestrian concourse with round-the-clock tourist police booth.',
            address: 'Netaji Subhash Marg, Chandni Chowk',
          },
        ],
      };
    }

    // Standard city exploration
    const transitBudget = Math.min(120, Math.round(totalBudget * 0.2));
    const foodBudget = Math.min(200, Math.round(totalBudget * 0.3));
    const activityBudget = Math.min(250, Math.round(totalBudget * 0.35));

    return {
      summary: `Balanced exploration from ${req.startingPoint} to ${req.destination} featuring iconic landmarks, transparent transit fares, and well-lit commercial hubs.`,
      stops: [
        {
          orderIndex: 1,
          placeName: `${req.startingPoint} - Transit Hub Departure`,
          category: 'TRANSIT',
          arrivalTime: formatMinutesToTime(startMins),
          departureTime: formatMinutesToTime(startMins + 35),
          transportCost: transitBudget,
          activityCost: 0,
          travelMethod: 'Pre-paid Auto or Metro Link',
          safetyNote: 'Choose pre-paid counter or ensure meter is flagged at ₹30 base.',
          address: req.startingPoint,
        },
        {
          orderIndex: 2,
          placeName: 'Connaught Place Central Park & British Era Colonnade',
          category: 'ATTRACTION',
          arrivalTime: formatMinutesToTime(startMins + 45),
          departureTime: formatMinutesToTime(startMins + 120),
          transportCost: 0,
          activityCost: activityBudget,
          travelMethod: 'Pedestrian Arcade Walk',
          safetyNote: 'Spacious well-lit circular corridors with prominent Delhi Police assistance kiosks.',
          address: 'Connaught Place Inner Circle, New Delhi 110001',
        },
        {
          orderIndex: 3,
          placeName: 'Janpath Heritage Handicrafts & Local Refreshment',
          category: 'FOOD',
          arrivalTime: formatMinutesToTime(startMins + 130),
          departureTime: formatMinutesToTime(startMins + 195),
          transportCost: 30,
          activityCost: foodBudget,
          travelMethod: 'Walking / Short Auto',
          safetyNote: 'Stick to verified street food stalls displaying FSSAI hygiene ratings.',
          address: 'Janpath Lane, Connaught Place, New Delhi',
        },
        {
          orderIndex: 4,
          placeName: `Final Destination: ${req.destination}`,
          category: 'BREAK',
          arrivalTime: formatMinutesToTime(startMins + 210),
          departureTime: formatMinutesToTime(startMins + 240),
          transportCost: transitBudget,
          activityCost: 0,
          travelMethod: 'Metro or Direct Auto',
          safetyNote: 'Arrive before dusk on main thoroughfares.',
          address: req.destination,
        },
      ],
    };
  }
}
