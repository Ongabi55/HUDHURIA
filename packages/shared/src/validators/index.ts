/**
 * Hudhuria — Shared Zod Validators
 * Used on both server (request validation) and client (form validation).
 */

import { z } from "zod";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["STUDENT", "ORGANIZER"]).default("STUDENT"),
  institution: z.string().min(2, "Institution is required").max(200),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────

const CreateEventBase = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  category: z.string().min(1, "Category is required"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  location: z.string().min(3, "Location is required").max(300),
  capacity: z
    .number()
    .int()
    .min(1, "Capacity must be at least 1")
    .max(100000),
  imageUrl: z.string().url("Invalid image URL").optional(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags").default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const CreateEventSchema = CreateEventBase.refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: "End date must be after start date", path: ["endDate"] }
);

// Updates allow CANCELLED in addition to DRAFT/PUBLISHED
export const UpdateEventSchema = CreateEventBase
  .omit({ status: true })
  .extend({ status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional() })
  .partial();

export const EventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
  search: z.string().max(200).optional(),
  startAfter: z.string().datetime().optional(),
  startBefore: z.string().datetime().optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .optional(),
});

// ─────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────

export const CreateBookingSchema = z.object({
  eventId: z.string().cuid("Invalid event ID"),
});

export const CheckinSchema = z.object({
  qrToken: z.string().min(1, "QR token is required"),
});

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

export const UpdateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "ORGANIZER", "ADMIN"]),
});

export const AdminUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(["STUDENT", "ORGANIZER", "ADMIN"]).optional(),
  search: z.string().max(200).optional(),
  institution: z.string().optional(),
});

// ─────────────────────────────────────────────
// TYPES INFERRED FROM SCHEMAS
// ─────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
