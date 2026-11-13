import { Router } from 'express';
import { PriceController } from '../controllers/priceController';
import { optionalAuthenticate } from '../middleware/auth';
import { reportRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/search', asyncHandler(PriceController.searchPrices));
router.post('/compare', asyncHandler(PriceController.comparePrice));
router.post('/reports', reportRateLimiter, asyncHandler(optionalAuthenticate), asyncHandler(PriceController.submitReport));
router.get('/categories', asyncHandler(PriceController.getCategories));

export default router;
