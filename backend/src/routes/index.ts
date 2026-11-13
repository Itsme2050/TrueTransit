import { Router } from 'express';
import authRoutes from './authRoutes';
import priceRoutes from './priceRoutes';
import safetyRoutes from './safetyRoutes';
import itineraryRoutes from './itineraryRoutes';
import emergencyRoutes from './emergencyRoutes';
import syncRoutes from './syncRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/prices', priceRoutes);
router.use('/safety', safetyRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/sync', syncRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'TrueTransit Master API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    supportedCity: 'Delhi, India',
    mode: 'Production / Hackathon Seeded Demonstration',
  });
});

export default router;
