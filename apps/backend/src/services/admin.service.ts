/**
 * Admin Service — platform-wide analytics and user management.
 *
 * All functions here require ADMIN role, enforced at the route level.
 */
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import type { PlatformStats } from "@hudhuria/shared";

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Return platform-wide analytics for the admin dashboard.
 *
 * Includes totals, monthly figures, and the overall check-in rate.
 * All queries run in a single $transaction for consistency.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalEvents,
    totalBookings,
    activeEvents,
    newUsersThisMonth,
    bookingsThisMonth,
    checkedInCount,
    confirmedCount,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.event.count(),
    prisma.booking.count(),
    prisma.event.count({
      where: { status: "PUBLISHED", endDate: { gte: new Date() } },
    }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.booking.count({ where: { checkedIn: true } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
  ]);

  const checkInRate =
    confirmedCount > 0
      ? Math.round((checkedInCount / confirmedCount) * 100)
      : 0;

  return {
    totalUsers,
    totalEvents,
    totalBookings,
    activeEvents,
    newUsersThisMonth,
    bookingsThisMonth,
    checkInRate,
  };
}

/**
 * Return a paginated, searchable list of all users.
 *
 * @param page     - Page number (1-based)
 * @param pageSize - Results per page
 * @param role     - Optional role filter
 * @param search   - Optional search string (name or email)
 */
export async function listUsers(
  page: number,
  pageSize: number,
  role?: string,
  search?: string
) {
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { institution: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institution: true,
        profileImage: true,
        attendanceStreak: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { bookings: true, organizedEvents: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      bookingCount: u._count.bookings,
      eventCount: u._count.organizedEvents,
    })),
    total,
    page,
    pageSize,
    hasNextPage: skip + users.length < total,
  };
}

/**
 * Change a user's role.
 * An admin cannot demote themselves (safety guard).
 *
 * @param targetUserId - The user whose role is being changed
 * @param requesterId  - The admin making the change
 * @param newRole      - The role to assign
 */
export async function updateUserRole(
  targetUserId: string,
  requesterId: string,
  newRole: string
) {
  if (targetUserId === requesterId) {
    throw new AppError(400, "You cannot change your own role");
  }

  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError(404, "User not found");

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      institution: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

/**
 * Return all events for admin review, including organizer info and booking counts.
 *
 * @param page     - Page number
 * @param pageSize - Results per page
 * @param status   - Optional status filter
 */
export async function listAllEvents(
  page: number,
  pageSize: number,
  status?: string
) {
  const skip = (page - 1) * pageSize;
  const where: any = status ? { status } : {};

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        startDate: true,
        capacity: true,
        createdAt: true,
        organizer: { select: { id: true, name: true, institution: true } },
        _count: {
          select: { bookings: { where: { status: "CONFIRMED" } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    items: events.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      status: e.status,
      startDate: e.startDate.toISOString(),
      capacity: e.capacity,
      bookingCount: e._count.bookings,
      occupancyRate: Math.round((e._count.bookings / e.capacity) * 100),
      organizer: e.organizer,
      createdAt: e.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    hasNextPage: skip + events.length < total,
  };
}
