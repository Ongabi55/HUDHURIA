/**
 * Authentication & authorisation middleware.
 */
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

/** Require a valid JWT access token — attaches userId & userRole to req */
export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or malformed Authorization header"));
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
}

/** Guard that only allows specified roles through */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(new AppError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}
