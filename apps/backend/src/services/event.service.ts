/**
 * Event Service — business logic for event management.
 *
 * Handles:
 *   - Paginated, filterable event listing
 *   - Single event retrieval with booking counts
 *   - Create / update / delete (organizer-scoped)
 */
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { eventEmitter } from "../events/event.events";
import type {
  CreateEventInput,
  UpdateEventInput,
  EventsQuery,
} from "@hudhuria/shared";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Build a reusable event select shape that includes organizer info,
 * tags, and computed booking count.
 */
const eventSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  startDate: true,
  endDate: true,
  location: true,
  capacity: true,
  imageUrl: true,
  status: true,
  organizerId: true,
  createdAt: true,
  updatedAt: true,
  organizer: {
    select: { id: true, name: true, profileImage: true, institution: true },
  },
  tags: { select: { id: true, name: true } },
  _count: { select: { bookings: { where: { status: "CONFIRMED" as const } } } },
};

/** Map a raw Prisma event row to the public Event shape with seatsLeft */
function mapEvent(raw: any) {
  const bookingCount = raw._count?.bookings ?? 0;
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    startDate: raw.startDate.toISOString(),
    endDate: raw.endDate.toISOString(),
    location: raw.location,
    capacity: raw.capacity,
    imageUrl: raw.imageUrl,
    status: raw.status,
    organizerId: raw.organizerId,
    organizer: raw.organizer,
    tags: raw.tags,
    bookingCount,
    seatsLeft: Math.max(0, raw.capacity - bookingCount),
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Return a paginated, filtered list of events.
 * Public route — only PUBLISHED events are returned unless the caller
 * is the organizer or an admin (handled at controller level via status filter).
 *
 * @param query - Validated query params (page, pageSize, category, search, etc.)
 */
export async function listEvents(query: EventsQuery) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (query.status) {
    where.status = query.status;
  } else {
    where.status = "PUBLISHED";
  }

  if (query.category) where.category = query.category;

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { location: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.startAfter) where.startDate = { ...where.startDate, gte: new Date(query.startAfter) };
  if (query.startBefore) where.startDate = { ...where.startDate, lte: new Date(query.startBefore) };

  if (query.tags?.length) {
    where.tags = { some: { name: { in: query.tags } } };
  }

  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      select: eventSelect,
      orderBy: { startDate: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    items: items.map(mapEvent),
    total,
    page,
    pageSize,
    hasNextPage: skip + items.length < total,
  };
}

/**
 * Return a single event by ID, including attendee count and seats left.
 * Throws 404 if not found.
 *
 * @param id - The event's cuid
 */
export async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    select: eventSelect,
  });

  if (!event) throw new AppError(404, "Event not found");
  return mapEvent(event);
}

/**
 * Create a new event. Only ORGANIZER and ADMIN roles may call this.
 * Tags are connected by name — created on the fly if they don't exist.
 *
 * @param organizerId - The authenticated user's ID
 * @param input       - Validated event creation payload
 */
export async function createEvent(organizerId: string, input: CreateEventInput) {
  const { tags, ...rest } = input;

  // Upsert tags so organisers can use existing or new tag names freely
  const tagConnections = await Promise.all(
    tags.map((name) =>
      prisma.eventTag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const event = await prisma.event.create({
    data: {
      ...rest,
      startDate: new Date(rest.startDate),
      endDate: new Date(rest.endDate),
      organizerId,
      tags: { connect: tagConnections.map((t) => ({ id: t.id })) },
    },
    select: eventSelect,
  });

  if (event.status === "PUBLISHED") {
    eventEmitter.emit("event.published", { event: mapEvent(event), organizerId });
  }

  return mapEvent(event);
}

/**
 * Update an existing event.
 * Organizers may only edit their own events; admins may edit any.
 *
 * @param id          - The event's cuid
 * @param requesterId - The authenticated user's ID
 * @param role        - The authenticated user's role
 * @param input       - Partial validated event update payload
 */
export async function updateEvent(
  id: string,
  requesterId: string,
  role: string,
  input: UpdateEventInput
) {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Event not found");

  if (role !== "ADMIN" && existing.organizerId !== requesterId) {
    throw new AppError(403, "You can only edit your own events");
  }

  const { tags, ...rest } = input;

  const data: any = {
    ...rest,
    ...(rest.startDate && { startDate: new Date(rest.startDate) }),
    ...(rest.endDate && { endDate: new Date(rest.endDate) }),
  };

  if (tags !== undefined) {
    const tagConnections = await Promise.all(
      tags.map((name) =>
        prisma.eventTag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );
    data.tags = { set: tagConnections.map((t) => ({ id: t.id })) };
  }

  const event = await prisma.event.update({
    where: { id },
    data,
    select: eventSelect,
  });

  const mapped = mapEvent(event);

  // Notify followers if event was just published
  if (rest.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    eventEmitter.emit("event.published", { event: mapped, organizerId: existing.organizerId });
  }

  // Notify attendees if event was cancelled
  if (rest.status === "CANCELLED" && existing.status !== "CANCELLED") {
    eventEmitter.emit("event.cancelled", { event: mapped });
  }

  return mapped;
}

/**
 * Delete an event.
 * Organizers may only delete their own events; admins may delete any.
 * Cannot delete an event that has confirmed bookings.
 *
 * @param id          - The event's cuid
 * @param requesterId - The authenticated user's ID
 * @param role        - The authenticated user's role
 */
export async function deleteEvent(
  id: string,
  requesterId: string,
  role: string
) {
  const existing = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } },
  });

  if (!existing) throw new AppError(404, "Event not found");

  if (role !== "ADMIN" && existing.organizerId !== requesterId) {
    throw new AppError(403, "You can only delete your own events");
  }

  if (existing._count.bookings > 0) {
    throw new AppError(
      409,
      "Cannot delete an event with confirmed bookings. Cancel the event instead."
    );
  }

  await prisma.event.delete({ where: { id } });
}

/**
 * Return all events created by a specific organizer.
 *
 * @param organizerId - The organizer's user ID
 */
export async function getOrganizerEvents(organizerId: string) {
  const events = await prisma.event.findMany({
    where: { organizerId },
    select: eventSelect,
    orderBy: { createdAt: "desc" },
  });
  return events.map(mapEvent);
}
