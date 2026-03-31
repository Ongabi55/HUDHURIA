/**
 * Auth Service — all authentication business logic.
 *
 * Controllers are thin wrappers; this layer owns:
 *   - Password hashing & comparison
 *   - Token signing & rotation
 *   - RefreshToken persistence
 *   - Mapping Prisma rows → public User shapes
 */
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_TTL_MS,
} from "../utils/jwt";
import { AppError } from "../utils/AppError";
import type {
  User,
  LoginResponse,
  RefreshResponse,
  RegisterInput,
  LoginInput,
} from "@hudhuria/shared";
import type { User as PrismaUser } from "@prisma/client";

const BCRYPT_ROUNDS = 10;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Strip sensitive fields and convert Prisma DateTime objects to ISO strings,
 * producing the public User shape defined in @hudhuria/shared.
 */
function mapToPublicUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as User["role"],
    institution: user.institution,
    profileImage: user.profileImage,
    attendanceStreak: user.attendanceStreak,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * Persist a refresh token to the database.
 * Called after both register and login.
 */
async function storeRefreshToken(
  userId: string,
  token: string
): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
}

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Register a new user account.
 *
 * - Rejects duplicate emails with 409 before Prisma's unique constraint fires.
 * - Hashes the password with bcrypt (10 rounds per NFR-03).
 * - Returns a full LoginResponse so the client is immediately authenticated.
 *
 * @param input - Validated registration payload (name, email, password, role, institution)
 */
export async function register(input: RegisterInput): Promise<LoginResponse> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      institution: input.institution,
    },
  });

  const accessToken = signAccessToken(user.id, user.role as User["role"]);
  const refreshToken = signRefreshToken(user.id);
  await storeRefreshToken(user.id, refreshToken);

  return { user: mapToPublicUser(user), accessToken, refreshToken };
}

/**
 * Authenticate a user with email and password.
 *
 * - Uses a generic "Invalid credentials" message for both wrong email and
 *   wrong password to prevent user-enumeration attacks.
 * - Returns a full LoginResponse on success.
 *
 * @param input - Validated login payload (email, password)
 */
export async function login(input: LoginInput): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    throw new AppError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(user.id, user.role as User["role"]);
  const refreshToken = signRefreshToken(user.id);
  await storeRefreshToken(user.id, refreshToken);

  return { user: mapToPublicUser(user), accessToken, refreshToken };
}

/**
 * Rotate a refresh token and issue a new access token.
 *
 * Token rotation: the old refresh token is deleted and a new one is issued
 * atomically. A stolen token can only be used once — subsequent use will
 * fail with 401 because the DB record no longer exists.
 *
 * @param oldRefreshToken - The refresh token sent in the request body
 */
export async function refresh(
  oldRefreshToken: string
): Promise<RefreshResponse> {
  // Verify the JWT signature first (fast, no DB call)
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }

  // Check the token exists in the database (rotation check)
  const stored = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
  });
  if (!stored) {
    throw new AppError(401, "Refresh token has been revoked");
  }

  // Check DB-level expiry (belt-and-suspenders alongside JWT expiry)
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new AppError(401, "Refresh token has expired");
  }

  // Fetch the user to get current role (it may have changed since token was issued)
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new AppError(401, "User not found");
  }

  const newAccessToken = signAccessToken(user.id, user.role as User["role"]);
  const newRefreshToken = signRefreshToken(user.id);

  // Rotate atomically: delete old, create new
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: stored.id } }),
    prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    }),
  ]);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

/**
 * Revoke a refresh token, effectively logging the user out.
 *
 * Idempotent — if the token is not found in the database (already revoked),
 * no error is thrown. This is correct behaviour for logout.
 *
 * @param refreshToken - The refresh token sent in the request body
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
  } catch {
    // P2025: record not found — token already revoked, ignore
  }
}
