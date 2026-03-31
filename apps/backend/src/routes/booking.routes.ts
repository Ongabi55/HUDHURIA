import { Router, Response, NextFunction } from "express";
import * as bookingService from "../services/booking.service";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/bookings — student books an event
router.post("/", requireAuth, requireRole("STUDENT"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { eventId } = req.body;
  if (!eventId) {
    return res.status(400).json({ success: false, message: "eventId is required" });
  }
  const booking = await bookingService.createBooking(req.userId!, eventId);
  res.status(201).json({ success: true, data: booking });
});

// GET /api/bookings/me — student's own bookings
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const bookings = await bookingService.getMyBookings(req.userId!);
  res.json({ success: true, data: bookings });
});

// DELETE /api/bookings/:id — cancel a booking
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  await bookingService.cancelBooking(req.params.id, req.userId!);
  res.json({ success: true });
});

// GET /api/bookings/:id/qr — get QR code
router.get("/:id/qr", requireAuth, async (req: AuthRequest, res: Response) => {
  const result = await bookingService.generateQrCode(req.params.id, req.userId!);
  res.json({ success: true, data: result });
});

// GET /api/bookings/event/:eventId — organizer views attendees
router.get("/event/:eventId", requireAuth, requireRole("ORGANIZER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  const bookings = await bookingService.getEventBookings(req.params.eventId, req.userId!, req.userRole!);
  res.json({ success: true, data: bookings });
});

// POST /api/bookings/checkin — scan QR code to check in
router.post("/checkin", requireAuth, requireRole("ORGANIZER", "ADMIN"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { eventId, qrToken } = req.body;
  if (!eventId || !qrToken) {
    return res.status(400).json({ success: false, message: "eventId and qrToken are required" });
  }
  const booking = await bookingService.checkInBooking(eventId, qrToken, req.userId!, req.userRole!);
  res.json({ success: true, data: booking });
});

export default router;
