import { Response } from 'express';
import { z } from 'zod';
import { ModerationService } from '../services/moderationService';
import { AuthenticatedRequest } from '../middleware/auth';

const moderatePriceSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED', 'EXPIRED']),
  reason: z.string().optional(),
});

const moderateSafetySchema = z.object({
  action: z.enum(['ACTIVE', 'RESOLVED', 'REJECTED', 'EXPIRED']),
  reason: z.string().optional(),
});

export class AdminController {
  public static async getOverview(req: AuthenticatedRequest, res: Response): Promise<void> {
    const metrics = await ModerationService.getSystemMetrics();
    res.json({
      success: true,
      data: metrics,
    });
  }

  public static async getReports(req: AuthenticatedRequest, res: Response): Promise<void> {
    const reports = await ModerationService.getPendingReports();
    res.json({
      success: true,
      data: reports,
    });
  }

  public static async moderatePrice(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { action, reason } = moderatePriceSchema.parse(req.body);

    const moderatorId = req.user?.id || 'admin-system';
    const updated = await ModerationService.moderatePriceReport(id, moderatorId, action, reason);

    res.json({
      success: true,
      message: `Price report status updated to ${action}`,
      data: updated,
    });
  }

  public static async moderateSafety(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { action, reason } = moderateSafetySchema.parse(req.body);

    const moderatorId = req.user?.id || 'admin-system';
    const updated = await ModerationService.moderateSafetyReport(id, moderatorId, action, reason);

    res.json({
      success: true,
      message: `Safety report status updated to ${action}`,
      data: updated,
    });
  }
}
