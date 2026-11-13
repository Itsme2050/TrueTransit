import { Request, Response } from 'express';
import { EmergencyService, DELHI_EMERGENCY_BENCHMARKS } from '../services/emergencyService';
import { prisma } from '../services/prismaClient';
import { AuthenticatedRequest } from '../middleware/auth';

export class EmergencyController {
  public static async getResources(req: Request, res: Response): Promise<void> {
    const facilities = await EmergencyService.getNearbyFacilities();

    res.json({
      success: true,
      data: {
        facilities,
        emergencyHotlines: [
          { service: 'National Emergency Support System', number: '112', description: 'Police, Fire, Ambulance 24/7' },
          { service: 'Women Safety Helpline (Delhi Police)', number: '1091', description: 'Immediate response unit' },
          { service: 'Delhi Tourist Police Helpline', number: '8750871111', description: 'Tourist assistance & reporting' },
          { service: 'Medical Emergency Ambulance', number: '102', description: 'Govt & CATS ambulance services' },
          { service: 'Senior Citizen Helpline', number: '14567', description: 'Vulnerable traveler support' },
        ],
      },
    });
  }

  public static async triggerSOS(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { lat, lng, message } = req.body;

    const userEmail = req.user?.email || 'Anonymous Traveler';
    const locationString = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : 'Location unconfirmed';

    // Build emergency SMS text for one-tap native sharing
    const smsContent = `[EMERGENCY SOS via TrueTransit] I need immediate assistance. My coordinates: ${locationString}. ${message || 'Please contact local emergency services immediately.'}`;

    res.json({
      success: true,
      sosInitiatedAt: new Date().toISOString(),
      smsContent,
      directDialNumbers: ['112', '1091'],
      nearestPoliceStation: DELHI_EMERGENCY_BENCHMARKS.find(f => f.type === 'POLICE_STATION'),
      nearestHospital: DELHI_EMERGENCY_BENCHMARKS.find(f => f.type === 'HOSPITAL'),
      notice: 'In a critical emergency, immediately dial 112 from any mobile device without requiring data connectivity.',
    });
  }

  public static async getOfflineBootstrap(req: Request, res: Response): Promise<void> {
    const city = (req.query.city as string) || 'Delhi';
    const pack = EmergencyService.getOfflineBootstrapPack(city);

    res.json({
      success: true,
      data: pack,
    });
  }
}
