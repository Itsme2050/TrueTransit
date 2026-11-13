import { Router } from 'express';
import { SafetyController } from '../controllers/safetyController';
import { optionalAuthenticate } from '../middleware/auth';
import { reportRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/heatmap', asyncHandler(SafetyController.getHeatmap));
router.post('/routes', asyncHandler(SafetyController.calculateRoutes));
router.post('/reports', reportRateLimiter, asyncHandler(optionalAuthenticate), asyncHandler(SafetyController.submitReport));
router.get('/emergency-facilities', asyncHandler(SafetyController.getEmergencyFacilities));

export default router;
