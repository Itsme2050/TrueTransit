import { Router } from 'express';
import { ItineraryController } from '../controllers/itineraryController';
import { optionalAuthenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/generate', asyncHandler(optionalAuthenticate), asyncHandler(ItineraryController.generate));
router.post('/validate', asyncHandler(ItineraryController.validatePlan));
router.get('/:id', asyncHandler(ItineraryController.getById));

export default router;
