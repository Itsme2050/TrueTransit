import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { standardRateLimiter } from './middleware/rateLimiter';

const app = express();

// Safety net: controllers are wrapped with asyncHandler, so this should be rare.
// Log (instead of terminating) so one bad request cannot take the API offline.
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', { reason: reason instanceof Error ? reason.message : String(reason) });
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // allow map tiles and scripts
}));

// CORS setup
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing with safe size limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global rate limiting
app.use(standardRateLimiter);

// Request audit logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl !== '/api/v1/health') {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Root welcome info
app.get('/', (req, res) => {
  res.json({
    application: 'TrueTransit',
    tagline: 'More than maps. Your true local guardian.',
    version: '1.0.0',
    documentation: '/api/v1/health',
    status: 'ACTIVE',
  });
});

// Mount API v1
app.use('/api/v1', apiRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 TrueTransit Server running at http://localhost:${config.port}`);
  logger.info(`📍 Mode: ${config.nodeEnv.toUpperCase()} | Demo Seeded: ${config.demoMode ? 'ENABLED' : 'DISABLED'}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${config.port} is already in use. Free the port or set PORT in backend/.env`);
  } else {
    logger.error('Server failed to start:', err);
  }
  process.exit(1);
});

export default app;
