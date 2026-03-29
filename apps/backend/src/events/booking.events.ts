/**
 * Booking EventEmitter — event-driven side effects for booking lifecycle.
 *
 * Current: stubs that log to console + send email via Nodemailer.
 * Future:  swap emitter for BullMQ/Redis queue for production reliability.
 *
 * Events:
 *   booking.confirmed      → confirmation email + notification
 *   booking.cancelled      → cancellation email + free seat
 *   booking.waitlisted     → waitlist confirmation email
 *   booking.waitlist_promoted → notify student they got off waitlist
 *   checkin.completed      → log attendance
 */
import { EventEmitter } from "events";
import nodemailer from "nodemailer";

export const bookingEmitter = new EventEmitter();

// ── Email transport (Ethereal stub for dev) ────────────────────────────
function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });
}

async function sendMail(to: string, subject: string, html: string) {
  try {
    const transport = getTransport();
    await transport.sendMail({
      from: process.env.EMAIL_FROM ?? "no-reply@hudhuria.co.ke",
      to,
      subject,
      html,
    });
  } catch {
    // Email failure should never crash the request — log and move on
    console.warn("[email] Failed to send:", subject, "to", to);
  }
}

// ── Listeners ──────────────────────────────────────────────────────────

bookingEmitter.on("booking.confirmed", async ({ booking, event }) => {
  console.log(
    `[event] booking.confirmed — user ${booking.userId} → event "${event.title}"`
  );

  if (booking.user?.email) {
    await sendMail(
      booking.user.email,
      `Your ticket for ${event.title} is confirmed!`,
      `
        <h2>You're going to ${event.title}!</h2>
        <p>Your booking is confirmed. Show your QR code at the entrance.</p>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${event.location ?? ""}</p>
        <p style="color:#8899BB;font-size:12px">Powered by Hudhuria</p>
      `
    );
  }
});

bookingEmitter.on("booking.cancelled", async ({ booking, event }) => {
  console.log(
    `[event] booking.cancelled — user ${booking.userId} → event "${event.title}"`
  );

  if (booking.user?.email) {
    await sendMail(
      booking.user.email,
      `Booking cancelled — ${event.title}`,
      `
        <h2>Booking Cancelled</h2>
        <p>Your booking for <strong>${event.title}</strong> has been cancelled.</p>
        <p>If this was a mistake, you can re-book from the app.</p>
        <p style="color:#8899BB;font-size:12px">Powered by Hudhuria</p>
      `
    );
  }
});

bookingEmitter.on("booking.waitlisted", async ({ booking, event }) => {
  console.log(
    `[event] booking.waitlisted — user ${booking.userId} → event "${event.title}"`
  );

  if (booking.user?.email) {
    await sendMail(
      booking.user.email,
      `You're on the waitlist for ${event.title}`,
      `
        <h2>You're on the waitlist!</h2>
        <p>The event <strong>${event.title}</strong> is currently full.</p>
        <p>We'll email you immediately if a spot opens up.</p>
        <p style="color:#8899BB;font-size:12px">Powered by Hudhuria</p>
      `
    );
  }
});

bookingEmitter.on("booking.waitlist_promoted", async ({ booking, event }) => {
  console.log(
    `[event] booking.waitlist_promoted — user ${booking.userId} → event "${event.title}"`
  );

  if (booking.user?.email) {
    await sendMail(
      booking.user.email,
      `Great news — you're in! ${event.title}`,
      `
        <h2>A spot opened up!</h2>
        <p>You've been moved from the waitlist to <strong>confirmed</strong> for
        <strong>${event.title}</strong>.</p>
        <p>Your QR ticket is ready in the Hudhuria app.</p>
        <p style="color:#8899BB;font-size:12px">Powered by Hudhuria</p>
      `
    );
  }
});

bookingEmitter.on("checkin.completed", ({ booking, event }) => {
  console.log(
    `[event] checkin.completed — user ${booking.userId} checked into "${event.title}" at ${new Date().toISOString()}`
  );
});
