/**
 * Hudhuria — Shared TypeScript Types
 * Single source of truth for domain models used by both backend and mobile.
 */

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export type Role = "STUDENT" | "ORGANIZER" | "ADMIN";
export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
export type BookingStatus = "CONFIRMED" | "CANCELLED" | "WAITLISTED";
export type NotificationType =
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "EVENT_PUBLISHED"
  | "EVENT_CANCELLED"
  | "CHECKIN_COMPLETED"
  | "WAITLIST_PROMOTED"
  | "GENERAL";

// ─────────────────────────────────────────────
// DOMAIN MODELS
// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  institution: string;
  profileImage?: string | null;
  attendanceStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventTag {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  imageUrl?: string | null;
  organizerId: string;
  organizer?: Pick<User, "id" | "name" | "profileImage" | "institution">;
  status: EventStatus;
  tags: EventTag[];
  bookingCount?: number;
  seatsLeft?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: BookingStatus;
  qrToken: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  event?: Event;
  user?: Pick<User, "id" | "name" | "email" | "profileImage">;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// API REQUEST / RESPONSE SHAPES
// ─────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// Auth
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Events
export interface EventsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  status?: EventStatus;
  search?: string;
  startAfter?: string;
  startBefore?: string;
  tags?: string[];
}

// Admin stats
export interface PlatformStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  activeEvents: number;
  newUsersThisMonth: number;
  bookingsThisMonth: number;
  checkInRate: number;
}
