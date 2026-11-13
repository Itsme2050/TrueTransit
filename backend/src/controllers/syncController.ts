import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient';
import { PriceEngine } from '../services/priceEngine';
import { AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const PRICE_CATEGORIES = ['TRANSPORT', 'FOOD', 'COMMODITY', 'SERVICE'] as const;
const SAFETY_CATEGORIES = ['POOR_LIGHTING', 'ISOLATED_AREA', 'HARASSMENT', 'INFRASTRUCTURE_HAZARD', 'SCAM_HOTSPOT'] as const;
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

function asArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [];
}

function isFiniteNumber(value: any): boolean {
  const n = Number(value);
  return Number.isFinite(n);
}

/**
 * Validate a queued price report. Returns the normalized record, or null when the
 * payload is unusable (NaN price, missing item, unknown category, empty id).
 */
function normalizePriceReport(report: any) {
  if (!report || typeof report !== 'object') return null;
  if (typeof report.clientUuid !== 'string' || report.clientUuid.trim() === '') return null;
  if (typeof report.itemName !== 'string' || report.itemName.trim() === '') return null;
  if (!isFiniteNumber(report.quotedPrice) || Number(report.quotedPrice) <= 0) return null;

  const paidPrice = report.paidPrice === undefined || report.paidPrice === null || report.paidPrice === ''
    ? null
    : Number(report.paidPrice);
  if (paidPrice !== null && (!isFiniteNumber(paidPrice) || paidPrice <= 0)) return null;

  const category = PRICE_CATEGORIES.includes(report.category) ? report.category : 'TRANSPORT';
  const localityName = typeof report.localityName === 'string' && report.localityName.trim() !== ''
    ? report.localityName
    : 'Connaught Place';

  return {
    clientUuid: report.clientUuid,
    itemName: report.itemName,
    category,
    localityName,
    quotedPrice: Number(report.quotedPrice),
    paidPrice,
    vendorName: typeof report.vendorName === 'string' ? report.vendorName : null,
    notes: typeof report.notes === 'string' ? report.notes : null,
  };
}

/**
 * Validate a queued safety report. Returns the normalized record, or null when the
 * payload is unusable (missing id, bad coordinates, unknown category).
 */
function normalizeSafetyReport(report: any) {
  if (!report || typeof report !== 'object') return null;
  if (typeof report.clientUuid !== 'string' || report.clientUuid.trim() === '') return null;
  if (!isFiniteNumber(report.latitude) || !isFiniteNumber(report.longitude)) return null;
  if (!SAFETY_CATEGORIES.includes(report.category)) return null;

  return {
    clientUuid: report.clientUuid,
    latitude: Number(report.latitude),
    longitude: Number(report.longitude),
    category: report.category,
    severity: SEVERITIES.includes(report.severity) ? report.severity : 'MEDIUM',
    description: typeof report.description === 'string' && report.description.trim() !== ''
      ? report.description
      : 'Offline observation report',
    localityName: typeof report.localityName === 'string' && report.localityName.trim() !== ''
      ? report.localityName
      : 'Delhi',
  };
}

export class SyncController {
  public static async syncPendingData(req: AuthenticatedRequest, res: Response): Promise<void> {
    const priceReports = asArray(req.body?.priceReports);
    const safetyReports = asArray(req.body?.safetyReports);

    const results = {
      priceReportsSynced: 0,
      safetyReportsSynced: 0,
      skippedDuplicates: 0,
      errors: [] as string[],
    };

    // 1. Process Offline Price Reports
    for (const raw of priceReports) {
      const report = normalizePriceReport(raw);
      if (!report) {
        results.errors.push('Skipped a price report with a missing or invalid payload (id, item, or quoted price).');
        continue;
      }

      try {
        const existing = await prisma.priceReport.findUnique({
          where: { clientUuid: report.clientUuid },
        });

        if (existing) {
          results.skippedDuplicates++;
          continue;
        }

        // Establish locality
        let locality = await prisma.locality.findFirst({
          where: { name: { contains: report.localityName } },
        });
        if (!locality) {
          locality = await prisma.locality.create({
            data: {
              name: report.localityName,
              city: 'Delhi',
              latitude: 28.6315,
              longitude: 77.2167,
            },
          });
        }

        const baseline = PriceEngine.calculateEstimate({
          category: report.category,
          itemName: report.itemName,
        });

        const isOutlier = PriceEngine.detectOutlier(report.quotedPrice, baseline.typicalPrice);

        await prisma.priceReport.create({
          data: {
            userId: req.user?.id && !req.user.isGuest ? req.user.id : null,
            localityId: locality.id,
            category: report.category,
            itemName: report.itemName,
            quotedPrice: report.quotedPrice,
            paidPrice: report.paidPrice,
            vendorName: report.vendorName,
            notes: report.notes,
            isOutlier,
            status: isOutlier ? 'PENDING' : 'APPROVED',
            confidenceScore: isOutlier ? 0.4 : 0.85,
            clientUuid: report.clientUuid,
          },
        });

        results.priceReportsSynced++;
      } catch (err: any) {
        logger.error('Failed to sync price report:', err.message);
        results.errors.push(`Price report error (${report.clientUuid}): ${err.message}`);
      }
    }

    // 2. Process Offline Safety Reports
    for (const raw of safetyReports) {
      const report = normalizeSafetyReport(raw);
      if (!report) {
        results.errors.push('Skipped a safety report with a missing or invalid payload (id, coordinates, or category).');
        continue;
      }

      try {
        const existing = await prisma.safetyReport.findUnique({
          where: { clientUuid: report.clientUuid },
        });

        if (existing) {
          results.skippedDuplicates++;
          continue;
        }

        await prisma.safetyReport.create({
          data: {
            userId: req.user?.id && !req.user.isGuest ? req.user.id : null,
            latitude: report.latitude,
            longitude: report.longitude,
            localityName: report.localityName,
            category: report.category,
            severity: report.severity,
            description: report.description,
            status: 'ACTIVE',
            clientUuid: report.clientUuid,
          },
        });

        results.safetyReportsSynced++;
      } catch (err: any) {
        logger.error('Failed to sync safety report:', err.message);
        results.errors.push(`Safety report error (${report.clientUuid}): ${err.message}`);
      }
    }

    res.json({
      success: true,
      syncSummary: results,
      syncedAt: new Date().toISOString(),
    });
  }
}
