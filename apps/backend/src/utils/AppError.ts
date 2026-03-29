/**
 * AppError — operational HTTP error class used throughout the backend.
 *
 * Distinguishes expected business errors (isOperational = true, e.g. 401, 404)
 * from unexpected programmer errors so the global error handler can respond
 * appropriately without leaking internal details.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
