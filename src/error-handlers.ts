import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'routing-controllers';
import { ERROR_EVENT } from './constants';

export function HttpNotFoundHandler(req: Request, res: Response): void {
  if (!res.headersSent) throw new HttpError(404, `Could not find this route: ${req.method} ${req.originalUrl}`);
}

export function HttpErrorHandler(
  error: { code?: number; httpCode?: number; message?: string; errors?: unknown[] },
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.app.listenerCount(ERROR_EVENT)) {
    req.app.emit(ERROR_EVENT, error, { req });
  } else {
    // if there is no error listener attached - it is better to log to console than to swallow error silently
    console.error(error);
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || error.httpCode || 500);
  res.json({
    error: error?.message || error || 'An unknown error occurred!',
    errors: error?.errors || [], // validation errors
  });
}
