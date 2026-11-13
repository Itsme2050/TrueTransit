import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Require ADMIN or MODERATOR role
router.use(asyncHandler(authenticate), asyncHandler(requireRole(['ADMIN', 'MODERATOR'])));

router.get('/overview', asyncHandler(AdminController.getOverview));
router.get('/reports', asyncHandler(AdminController.getReports));
router.patch('/reports/price/:id', asyncHandler(AdminController.moderatePrice));
router.patch('/reports/safety/:id', asyncHandler(AdminController.moderateSafety));

export default router;
