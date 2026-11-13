import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.post('/guest', asyncHandler(AuthController.guest));
router.get('/me', asyncHandler(authenticate), asyncHandler(AuthController.getProfile));

export default router;
