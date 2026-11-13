import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prismaClient';
import { PriceEngine, DELHI_ITEM_BENCHMARKS } from '../services/priceEngine';
import { AuthenticatedRequest } from '../middleware/auth';
import { config } from '../config';

const searchSchema = z.object({
  category: z.enum(['TRANSPORT', 'FOOD', 'COMMODITY', 'SERVICE']).optional().default('TRANSPORT'),
  itemName: z.string().min(1),
  distanceKm: z.coerce.number().optional(),
  durationMinutes: z.coerce.number().optional(),
  timeOfDay: z.enum(['DAY', 'NIGHT']).optional().default('DAY'),
  localityName: z.string().optional().default('Connaught Place'),
  quantity: z.coerce.number().optional().default(1),
  quotedPrice: z.coerce.number().optional(),
});

const reportSchema = z.object({
  category: z.string(),
  itemName: z.string(),
  localityName: z.string().optional().default('Connaught Place'),
  quotedPrice: z.number().positive(),
  paidPrice: z.number().positive().optional(),
  vendorName: z.string().optional(),
  receiptUrl: z.string().optional(),
  notes: z.string().optional(),
  timeOfDay: z.string().optional(),
  clientUuid: z.string().optional(),
});

export class PriceController {
  public static async searchPrices(req: Request, res: Response): Promise<void> {
    const params = searchSchema.parse(req.query);
    const estimate = PriceEngine.calculateEstimate(params);

    res.json({
      success: true,
      data: estimate,
      metadata: {
        isDemoData: estimate.pricingModel === 'ESTIMATED_RANGE',
        isCommunityReport: false,
        city: 'Delhi',
        demoMode: config.demoMode,
        queriedAt: new Date().toISOString(),
      },
    });
  }

  public static async comparePrice(req: Request, res: Response): Promise<void> {
    const params = searchSchema.parse(req.body);
    const estimate = PriceEngine.calculateEstimate(params);

    res.json({
      success: true,
      data: estimate,
    });
  }

  public static async submitReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = reportSchema.parse(req.body);

    // Look up or establish locality
    let locality = await prisma.locality.findFirst({
      where: { name: { contains: data.localityName } },
    });

    if (!locality) {
      locality = await prisma.locality.create({
        data: {
          name: data.localityName,
          city: 'Delhi',
          latitude: 28.6315,
          longitude: 77.2167,
          zoneType: 'COMMERCIAL',
        },
      });
    }

    // Estimate baseline to detect outliers
    const baseline = PriceEngine.calculateEstimate({
      category: data.category as any,
      itemName: data.itemName,
    });

    const isOutlier = PriceEngine.detectOutlier(data.quotedPrice, baseline.typicalPrice);

    // Create report
    const report = await prisma.priceReport.create({
      data: {
        userId: req.user?.id && !req.user.isGuest ? req.user.id : null,
        localityId: locality.id,
        category: data.category,
        itemName: data.itemName,
        quotedPrice: data.quotedPrice,
        paidPrice: data.paidPrice,
        vendorName: data.vendorName,
        receiptUrl: data.receiptUrl,
        notes: data.notes,
        timeOfDay: data.timeOfDay || 'DAY',
        isOutlier,
        status: isOutlier ? 'PENDING' : 'APPROVED',
        confidenceScore: isOutlier ? 0.4 : 0.85,
        clientUuid: data.clientUuid || `report-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
    });

    res.status(201).json({
      success: true,
      message: isOutlier
        ? 'Price observation submitted! Flagged for brief community moderation due to variance from local baselines.'
        : 'Thank you for contributing to fair price transparency!',
      report: {
        id: report.id,
        itemName: report.itemName,
        quotedPrice: report.quotedPrice,
        status: report.status,
        isOutlier: report.isOutlier,
      },
    });
  }

  public static async getCategories(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      categories: [
        {
          id: 'TRANSPORT',
          label: 'Local Transportation',
          description: 'Auto-rickshaw, Cabs, Taxis, and Metro connections with official meter formulas',
          examples: ['Delhi Auto-Rickshaw Ride', 'Standard AC Cab', 'Airport Express Taxi'],
        },
        {
          id: 'FOOD',
          label: 'Street Food & Dining',
          description: 'Locality-specific baseline benchmarks for heritage and street foods',
          examples: ['Chole Bhature', 'Tea / Chai (Kulhad)', 'Tender Coconut Water'],
        },
        {
          id: 'COMMODITY',
          label: 'Essential Packaged Goods',
          description: 'Statutory MRP and standard tourist retail pricing',
          examples: ['Packaged Drinking Water (1L)', 'SIM Card Tourist Pack (30 days)'],
        },
        {
          id: 'SERVICE',
          label: 'Local Services',
          description: 'Luggage cloakrooms, guide rates, shoe-keeping at monuments',
          examples: ['Luggage Cloakroom (Railway/Metro)', 'Shoe Keeping at Monument'],
        },
      ],
      benchmarks: Object.entries(DELHI_ITEM_BENCHMARKS).map(([name, b]) => ({
        itemName: name,
        typicalPrice: b.typical,
        range: [b.min, b.max],
        unit: b.unit,
        source: b.source,
      })),
    });
  }
}
