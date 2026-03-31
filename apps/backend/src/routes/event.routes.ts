import { Router, Request, Response, NextFunction } from "express";
import * as eventService from "../services/event.service";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";
import {
  EventsQuerySchema,
  CreateEventSchema,
  UpdateEventSchema,
} from "@hudhuria/shared";

const router = Router();

// GET /api/events — public, paginated, filterable
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const parsed = EventsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }
  const result = await eventService.listEvents(parsed.data);
  res.json({ success: true, data: result });
});

// GET /api/events/:id — public
router.get("/:id", async (req: Request, res: Response) => {
  const event = await eventService.getEvent(req.params.id);
  res.json({ success: true, data: event });
});

// POST /api/events — organizer or admin only
router.post("/", requireAuth, requireRole("ORGANIZER", "ADMIN"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = CreateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }
  const event = await eventService.createEvent(req.userId!, parsed.data);
  res.status(201).json({ success: true, data: event });
});

// PATCH /api/events/:id — organizer (own) or admin
router.patch("/:id", requireAuth, requireRole("ORGANIZER", "ADMIN"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = UpdateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }
  const event = await eventService.updateEvent(req.params.id, req.userId!, req.userRole!, parsed.data);
  res.json({ success: true, data: event });
});

// DELETE /api/events/:id — organizer (own) or admin
router.delete("/:id", requireAuth, requireRole("ORGANIZER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  await eventService.deleteEvent(req.params.id, req.userId!, req.userRole!);
  res.json({ success: true });
});

// GET /api/events/organizer/me — own events
router.get("/organizer/me", requireAuth, requireRole("ORGANIZER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  const events = await eventService.getOrganizerEvents(req.userId!);
  res.json({ success: true, data: events });
});

export default router;
