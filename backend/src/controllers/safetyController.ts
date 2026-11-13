import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prismaClient';
import { SafetyEngine, DELHI_ZONES } from '../services/safetyEngine';
import { EmergencyService } from '../services/emergencyService';
import { AuthenticatedRequest } from '../middleware/auth';

const heatmapQuerySchema = z.object({
  city: z.string().optional().default('Delhi'),
  hour: z.coerce.number().min(0).max(23).optional().default(new Date().getHours()),
});

const routeQuerySchema = z.object({
  originName: z.string().min(1),
  originLat: z.coerce.number(),
  originLng: z.coerce.number(),
  destName: z.string().min(1),
  destLat: z.coerce.number(),
  destLng: z.coerce.number(),
  hour: z.coerce.number().min(0).max(23).optional().default(new Date().getHours()),
});

const safetyReportSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  localityName: z.string().optional(),
  category: z.enum(['POOR_LIGHTING', 'ISOLATED_AREA', 'HARASSMENT', 'INFRASTRUCTURE_HAZARD', 'SCAM_HOTSPOT']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  description: z.string().min(5),
  clientUuid: z.string().optional(),
});

export class SafetyController {
  public static async getHeatmap(req: Request, res: Response): Promise<void> {
    const { hour } = heatmapQuerySchema.parse(req.query);

    // Fetch active community reports
    const recentReports = await prisma.safetyReport.findMany({
      where: { status: 'ACTIVE' },
      take: 100,
    });

    // Generate score nodes for each known city zone at the requested hour
    const features = DELHI_ZONES.map(zone => {
      const nearbyIncidents = recentReports.filter(r => {
        const dLat = Math.abs(r.latitude - zone.lat);
        const dLng = Math.abs(r.longitude - zone.lng);
        return dLat < 0.015 && dLng < 0.015;
      }).length;

      const scoreResult = SafetyEngine.calculateChronoScore(
        zone.lat,
        zone.lng,
        hour,
        nearbyIncidents,
        zone.type
      );

      return {
        type: 'Feature',
        properties: {
          name: zone.name,
          zoneType: zone.type,
          hour,
          safetyScore: scoreResult.score,
          level: scoreResult.level,
          colorCode: scoreResult.colorCode,
          breakdown: scoreResult.breakdown,
          evidenceRationale: scoreResult.evidenceRationale,
          disclaimer: scoreResult.disclaimer,
        },
        geometry: {
          type: 'Point',
          coordinates: [zone.lng, zone.lat],
        },
      };
    });

    res.json({
      success: true,
      hour,
      activeReportsCount: recentReports.length,
      geoJson: {
        type: 'FeatureCollection',
        features,
      },
    });
  }

  public static async calculateRoutes(req: Request, res: Response): Promise<void> {
    const query = routeQuerySchema.parse(req.body);

    const routes = SafetyEngine.generateRouteAlternatives(
      { name: query.originName, lat: query.originLat, lng: query.originLng },
      { name: query.destName, lat: query.destLat, lng: query.destLng },
      query.hour
    );

    res.json({
      success: true,
      origin: { name: query.originName, lat: query.originLat, lng: query.originLng },
      destination: { name: query.destName, lat: query.destLat, lng: query.destLng },
      hour: query.hour,
      routes,
      disclaimer: 'Routes provide comparative evidence-based assessments. Always stay alert and prioritize personal intuition.',
    });
  }

  public static async submitReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = safetyReportSchema.parse(req.body);

    const report = await prisma.safetyReport.create({
      data: {
        userId: req.user?.id && !req.user.isGuest ? req.user.id : null,
        latitude: data.latitude,
        longitude: data.longitude,
        localityName: data.localityName,
        category: data.category,
        severity: data.severity,
        description: data.description,
        status: 'ACTIVE',
        clientUuid: data.clientUuid || `safety-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Safety observation recorded. Thank you for helping keep fellow travelers safe.',
      report: {
        id: report.id,
        category: report.category,
        severity: report.severity,
        reportedAt: report.reportedAt,
      },
    });
  }

  public static async getEmergencyFacilities(req: Request, res: Response): Promise<void> {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
    const type = req.query.type as string | undefined;

    const facilities = await EmergencyService.getNearbyFacilities(lat, lng, type);

    res.json({
      success: true,
      facilities,
    });
  }
}
