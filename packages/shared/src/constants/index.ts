/**
 * Hudhuria — Shared Constants
 */

export const EVENT_CATEGORIES = [
  "Tech",
  "Culture",
  "Sports",
  "Career",
  "Social",
  "Health",
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];

export const INTEREST_TAGS = EVENT_CATEGORIES;

export const BOOKING_STATUSES = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  WAITLISTED: "WAITLISTED",
} as const;

export const USER_ROLES = {
  STUDENT: "STUDENT",
  ORGANIZER: "ORGANIZER",
  ADMIN: "ADMIN",
} as const;

export const EVENT_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

/** Design tokens — mirrors the NativeWind config in mobile */
export const COLORS = {
  background: "#060B1A",
  surface: "#0D1635",
  accent: "#C4224D",
  accent2: "#8B1538",
  textPrimary: "#FFFFFF",
  textMuted: "#8899BB",
  success: "#4ADE80",
  warning: "#EF9F27",
  error: "#F87171",
  border: "rgba(255,255,255,0.12)",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;
