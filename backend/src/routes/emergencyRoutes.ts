import { Router } from 'express';
import { EmergencyController } from '../controllers/emergencyController';
import { optionalAuthenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/resources', asyncHandler(EmergencyController.getResources));
router.post('/sos', asyncHandler(optionalAuthenticate), asyncHandler(EmergencyController.triggerSOS));
router.get('/bootstrap', asyncHandler(EmergencyController.getOfflineBootstrap));

export default router;
