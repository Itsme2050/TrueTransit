import { Router } from 'express';
import { SyncController } from '../controllers/syncController';
import { optionalAuthenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/', asyncHandler(optionalAuthenticate), asyncHandler(SyncController.syncPendingData));

export default router;
