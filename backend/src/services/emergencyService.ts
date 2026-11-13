/**
 * Emergency & Panic Assistance Service for TrueTransit
 * Provides emergency facility lookup, emergency contact management,
 * and offline bootstrap data packages.
 */

import { prisma } from './prismaClient';
import { calculateDistanceKm } from '../utils/geoUtils';

export interface EmergencyResource {
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

export const DELHI_EMERGENCY_BENCHMARKS: EmergencyResource[] = [
  {
    id: 'fac-aiims',
    name: 'AIIMS (All India Institute of Medical Sciences) New Delhi',
    type: 'HOSPITAL',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    phone: '011-26588500',
    latitude: 28.5672,
    longitude: 77.2100,
    is24Hours: true,
  },
  {
    id: 'fac-safdarjung',
    name: 'Vardhman Mahavir Medical College & Safdarjung Hospital',
    type: 'HOSPITAL',
    address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
    phone: '011-26165060',
    latitude: 28.5705,
    longitude: 77.2072,
    is24Hours: true,
  },
  {
    id: 'fac-lnjp',
    name: 'Lok Nayak Jai Prakash Narayan (LNJP) Hospital',
    type: 'HOSPITAL',
    address: 'Jawaharlal Nehru Marg, Delhi Gate, New Delhi 110002',
    phone: '011-23233000',
    latitude: 28.6375,
    longitude: 77.2405,
    is24Hours: true,
  },
  {
    id: 'fac-cp-police',
    name: 'Delhi Police Station - Connaught Place',
    type: 'POLICE_STATION',
    address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
    phone: '112',
    latitude: 28.6295,
    longitude: 77.2140,
    is24Hours: true,
  },
  {
    id: 'fac-paharganj-police',
    name: 'Delhi Police Station - Paharganj',
    type: 'POLICE_STATION',
    address: 'Desh Bandhu Gupta Road, Paharganj, New Delhi 110055',
    phone: '011-23588231',
    latitude: 28.6465,
    longitude: 77.2130,
    is24Hours: true,
  },
  {
    id: 'fac-tourist-police',
    name: 'Delhi Tourist Police Assistance Unit (HQ)',
    type: 'POLICE_STATION',
    address: 'Janpath Toll Booth, Connaught Place, New Delhi',
    phone: '8750871111',
    latitude: 28.6270,
    longitude: 77.2185,
    is24Hours: true,
  },
  {
    id: 'fac-apollo-pharmacy-cp',
    name: 'Apollo 24/7 Pharmacy - Connaught Place',
    type: 'PHARMACY',
    address: 'Block E, Radial Road 3, Connaught Place, New Delhi',
    phone: '1860-500-0101',
    latitude: 28.6330,
    longitude: 77.2190,
    is24Hours: true,
  },
];

export class EmergencyService {
  /**
   * Retrieves nearest emergency facilities ranked by distance
   */
  public static async getNearbyFacilities(lat?: number, lng?: number, type?: string): Promise<EmergencyResource[]> {
    let facilities: EmergencyResource[] = [];

    try {
      const dbFacilities = await prisma.emergencyFacility.findMany({
        where: type ? { type } : undefined,
      });

      if (dbFacilities.length > 0) {
        facilities = dbFacilities.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type as any,
          address: f.address,
          phone: f.phone,
          latitude: f.latitude,
          longitude: f.longitude,
          is24Hours: f.is24Hours,
        }));
      } else {
        facilities = [...DELHI_EMERGENCY_BENCHMARKS];
      }
    } catch {
      facilities = [...DELHI_EMERGENCY_BENCHMARKS];
    }

    if (type) {
      facilities = facilities.filter(f => f.type === type);
    }

    if (lat !== undefined && lng !== undefined) {
      facilities = facilities.map(f => ({
        ...f,
        distanceKm: calculateDistanceKm({ lat, lng }, { lat: f.latitude, lng: f.longitude }),
      })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return facilities;
  }

  /**
   * Generates the offline city data bootstrap bundle for complete offline operation
   */
  public static getOfflineBootstrapPack(cityName: string = 'Delhi') {
    return {
      cityName,
      version: '2026.1',
      generatedAt: new Date().toISOString(),
      emergencyNumbers: {
        police: '112',
        womenHelpline: '1091',
        ambulance: '102',
        touristPolice: '8750871111',
        disasterManagement: '1077',
      },
      emergencyFacilities: DELHI_EMERGENCY_BENCHMARKS,
      offlineFareRules: {
        autoRickshaw: {
          baseFare: 30,
          baseKm: 1.5,
          perKm: 11,
          nightSurchargePct: 25,
          luggageCharge: 10,
        },
        taxiStandard: {
          baseFare: 40,
          baseKm: 1.0,
          perKm: 17,
          nightSurchargePct: 25,
        },
      },
      offlineSafetyAdvice: [
        'At night, prefer well-illuminated main radial corridors over unlit back-alleys.',
        'Use designated prepaid auto/taxi counters at railway stations and airport terminals to avoid meter refusal.',
        'Emergency SOS features work offline by generating direct phone call links and local SMS templates.',
        'In case of tout harassment, seek immediate help at any CISF Metro security post or Tourist Police kiosk.',
      ],
    };
  }
}
