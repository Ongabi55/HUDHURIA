/**
 * Booking Service — business logic for event bookings, cancellations,
 * waitlisting, and QR-based check-in.
 *
 * Event-driven side effects (emails, notifications) are emitted here
 * and handled by listeners in src/events/.
 */
import { randomUUID } from "crypto";
import QRCode from "qrcode";
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { bookingEmitter } from "../events/booking.events";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Map a Prisma booking row to a clean public shape */
function mapBooking(raw: any) {
  return {
    id: raw.id,
    userId: raw.userId,
    eventId: raw.eventId,
    status: raw.status,
    qrToken: raw.qrToken,
    checkedIn: raw.checkedIn,
    checkedInAt: raw.checkedInAt?.toISOString() ?? null,
    event: raw.event
      ? {
          ...raw.event,
          startDate: raw.event.startDate.toISOString(),
          endDate: raw.event.endDate.toISOString(),
          createdAt: raw.event.createdAt.toISOString(),
          updatedAt: raw.event.updatedAt.toISOString(),
        }
      : undefined,
    user: raw.user,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

const bookingSelect = {
  id: true,
  userId: true,
  eventId: true,
  status: true,
  qrToken: true,
  checkedIn: true,
  checkedInAt: true,
  createdAt: true,
  updatedAt: true,
  event: {
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      location: true,
      imageUrl: true,
      capacity: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  user: {
    select: { id: true, name: true, email: true, profileImage: true },
  },
};

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Book a student into an event.
 *
 * Rules:
 *   - Event must be PUBLISHED and in the future
 *   - Student cannot book the same event twice
 *   - If capacity is full, books as WAITLISTED (FR-10)
 *   - Emits booking.confirmed or booking.waitlisted event
 *
 * @param userId  - The authenticated student's ID
 * @param eventId - The event to book
 */
export async function createBooking(userId: string, eventId: string) {
  // Load event and count confirmed bookings atomically
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: { select: { bookings: { where: { status: "CONFIRMED" } } } },
    },
  });

  if (!event) throw new AppError(404, "Event not found");
  if (event.status !== "PUBLISHED") {
    throw new AppError(400, "This event is not available for booking");
  }
  if (new Date(event.startDate) < new Date()) {
    throw new AppError(400, "This event has already started");
  }

  // Check for duplicate booking
  const existing = await prisma.booking.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) {
    if (existing.status === "CANCELLED") {
      // Allow re-booking after cancellation by updating the record
      const confirmedCount = event._count.bookings;
      const isWaitlisted = confirmedCount >= event.capacity;

      const updated = await prisma.booking.update({
        where: { id: existing.id },
        data: {
          status: isWaitlisted ? "WAITLISTED" : "CONFIRMED",
          qrToken: randomUUID(),
          checkedIn: false,
          checkedInAt: null,
        },
        select: bookingSelect,
      });

      bookingEmitter.emit(
        isWaitlisted ? "booking.waitlisted" : "booking.confirmed",
        { booking: updated, event }
      );

      return mapBooking(updated);
    }
    throw new AppError(409, "You have already booked this event");
  }

  const confirmedCount = event._count.bookings;
  const isWaitlisted = confirmedCount >= event.capacity;

  const booking = await prisma.booking.create({
    data: {
      userId,
      eventId,
      status: isWaitlisted ? "WAITLISTED" : "CONFIRMED",
      qrToken: randomUUID(),
    },
    select: bookingSelect,
  });

  bookingEmitter.emit(
    isWaitlisted ? "booking.waitlisted" : "booking.confirmed",
    { booking, event }
  );

  return mapBooking(booking);
}

/**
 * Return all bookings for the authenticated student.
 * Sorted by event start date ascending (upcoming first).
 *
 * @param userId - The authenticated student's ID
 */
export async function getMyBookings(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    select: bookingSelect,
    orderBy: { event: { startDate: "asc" } },
  });
  return bookings.map(mapBooking);
}

/**
 * Cancel a booking.
 *
 * Rules:
 *   - Student may only cancel their own booking
 *   - Cannot cancel after event has started
 *   - Promotes the next WAITLISTED student on cancellation
 *   - Emits booking.cancelled event
 *
 * @param bookingId - The booking's cuid
 * @param userId    - The authenticated student's ID
 */
export async function cancelBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { event: true },
  });

  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.userId !== userId) {
    throw new AppError(403, "You can only cancel your own bookings");
  }
  if (booking.status === "CANCELLED") {
    throw new AppError(400, "Booking is already cancelled");
  }
  if (new Date(booking.event.startDate) < new Date()) {
    throw new AppError(400, "Cannot cancel a booking after the event has started");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  // Promote next waitlisted student if this was a confirmed booking
  if (booking.status === "CONFIRMED") {
    const nextWaitlisted = await prisma.booking.findFirst({
      where: { eventId: booking.eventId, status: "WAITLISTED" },
      orderBy: { createdAt: "asc" },
      include: { user: true, event: true },
    });

    if (nextWaitlisted) {
      const promoted = await prisma.booking.update({
        where: { id: nextWaitlisted.id },
        data: { status: "CONFIRMED" },
        select: bookingSelect,
      });
      bookingEmitter.emit("booking.waitlist_promoted", {
        booking: promoted,
        event: booking.event,
      });
    }
  }

  bookingEmitter.emit("booking.cancelled", { booking, event: booking.event });
}

/**
 * Mark a student as checked in via QR code scan.
 *
 * Rules:
 *   - Only the event organizer (or admin) may check students in
 *   - The QR token must belong to a CONFIRMED booking for this event
 *   - Cannot check in twice
 *   - Emits checkin.completed event
 *
 * @param eventId     - The event being scanned at
 * @param qrToken     - The token from the student's QR code
 * @param requesterId - The organizer's user ID (for ownership check)
 * @param role        - The requester's role
 */
export async function checkInBooking(
  eventId: string,
  qrToken: string,
  requesterId: string,
  role: string
) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError(404, "Event not found");

  if (role !== "ADMIN" && event.organizerId !== requesterId) {
    throw new AppError(403, "Only the event organizer can check students in");
  }

  const booking = await prisma.booking.findUnique({
    where: { qrToken },
    include: { user: true },
  });

  if (!booking) throw new AppError(404, "Invalid QR code");
  if (booking.eventId !== eventId) throw new AppError(400, "QR code is for a different event");
  if (booking.status !== "CONFIRMED") throw new AppError(400, "Booking is not confirmed");
  if (booking.checkedIn) throw new AppError(409, "Student is already checked in");

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { checkedIn: true, checkedInAt: new Date() },
    select: bookingSelect,
  });

  bookingEmitter.emit("checkin.completed", { booking: updated, event });

  return mapBooking(updated);
}

/**
 * Generate a QR code image (data URL) for a booking's token.
 * The QR encodes a JSON payload the scanner app can verify offline.
 *
 * @param bookingId - The booking's cuid
 * @param userId    - Must match the booking's owner
 */
export async function generateQrCode(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: bookingSelect,
  });

  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.userId !== userId) throw new AppError(403, "Not your booking");
  if (booking.status !== "CONFIRMED") {
    throw new AppError(400, "QR code is only available for confirmed bookings");
  }

  const payload = JSON.stringify({
    token: booking.qrToken,
    bookingId: booking.id,
    eventId: booking.eventId,
  });

  const qrDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#060B1A", light: "#FFFFFF" },
  });

  return {
    qrCode: qrDataUrl,
    qrToken: booking.qrToken,
    booking: mapBooking(booking),
  };
}

/**
 * Return all bookings for a specific event (organizer view).
 *
 * @param eventId     - The event's cuid
 * @param requesterId - Must be the event organizer or admin
 * @param role        - The requester's role
 */
export async function getEventBookings(
  eventId: string,
  requesterId: string,
  role: string
) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError(404, "Event not found");

  if (role !== "ADMIN" && event.organizerId !== requesterId) {
    throw new AppError(403, "Only the event organizer can view attendees");
  }

  const bookings = await prisma.booking.findMany({
    where: { eventId },
    select: bookingSelect,
    orderBy: { createdAt: "asc" },
  });

  return bookings.map(mapBooking);
}
