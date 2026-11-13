import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { config } from '../config';

/**
 * Centralized error middleware.
 * Routes are wrapped with asyncHandler, so rejected promises land here too.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Zod validation failures are client errors
  if (err instanceof ZodError) {
    logger.warn(`Validation error on ${req.method} ${req.originalUrl}`);
    res.status(400).json({
      success: false,
      message: 'Validation error: Invalid input data format',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Malformed JSON body
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ success: false, message: 'Malformed JSON request body.' });
    return;
  }

  logger.error('Unhandled request error:', {
    message: err?.message,
    stack: err?.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Prisma known request errors: map to sane HTTP statuses
  const prismaCode: string | undefined = typeof err?.code === 'string' ? err.code : undefined;
  if (prismaCode === 'P2025') {
    res.status(404).json({ success: false, message: 'Resource not found.' });
    return;
  }
  if (prismaCode && prismaCode.startsWith('P20')) {
    res.status(400).json({ success: false, message: 'Invalid database request.' });
    return;
  }

  const statusCode = err?.statusCode || err?.status || 500;
  const message =
    err?.isOperational || statusCode < 500
      ? err?.message
      : config.nodeEnv === 'production'
      ? 'An internal server error occurred.'
      : err?.message || 'An internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv !== 'production' && err?.stack ? { stack: err.stack } : {}),
  });
}
