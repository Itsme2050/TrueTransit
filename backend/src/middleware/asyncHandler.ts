import { Request, Response, NextFunction } from 'express';

type Handler<TReq> = (req: TReq, res: Response, next: NextFunction) => unknown;

/**
 * Express 4 only catches errors thrown synchronously from route handlers.
 * Wrapping every controller with this helper forwards rejected promises to the
 * centralized error middleware instead of crashing the process
 * (Node >= 15 terminates on unhandled promise rejections).
 */
export function asyncHandler<TReq extends Request>(handler: Handler<TReq>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = (handler as (r: Request, s: Response, n: NextFunction) => unknown)(req, res, next);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        (result as Promise<unknown>).catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}
