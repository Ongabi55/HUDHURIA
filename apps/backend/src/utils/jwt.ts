/**
 * JWT utility functions for Hudhuria.
 *
 * Access tokens:  15 min expiry, signed with JWT_ACCESS_SECRET
 * Refresh tokens: 7 day expiry,  signed with JWT_REFRESH_SECRET
 *
 * Errors from jsonwebtoken (JsonWebTokenError, TokenExpiredError) are NOT
 * caught here — callers or the global error handler handle them.
 */
import jwt from "jsonwebtoken";
import type { Role } from "@hudhuria/shared";

export interface AccessTokenPayload extends jwt.JwtPayload {
  sub: string;
  role: Role;
}

export interface RefreshTokenPayload extends jwt.JwtPayload {
  sub: string;
}

const accessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
  return secret;
};

const refreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
  return secret;
};

/**
 * Sign a short-lived access token (15 minutes).
 * @param userId - The user's database ID (cuid)
 * @param role   - The user's role (STUDENT | ORGANIZER | ADMIN)
 */
export function signAccessToken(userId: string, role: Role): string {
  return jwt.sign({ sub: userId, role }, accessSecret(), {
    expiresIn: "15m",
    algorithm: "HS256",
  });
}

/**
 * Sign a long-lived refresh token (7 days).
 * @param userId - The user's database ID (cuid)
 */
export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, refreshSecret(), {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

/**
 * Verify an access token and return its decoded payload.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 * @param token - Raw JWT string from the Authorization header
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, accessSecret());
  if (typeof decoded === "string") {
    throw new jwt.JsonWebTokenError("Unexpected token format");
  }
  return decoded as AccessTokenPayload;
}

/**
 * Verify a refresh token and return its decoded payload.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 * @param token - Raw JWT string from the request body
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, refreshSecret());
  if (typeof decoded === "string") {
    throw new jwt.JsonWebTokenError("Unexpected token format");
  }
  return decoded as RefreshTokenPayload;
}

/** 7 days in milliseconds — used when calculating RefreshToken.expiresAt */
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
