/**
 * Hudhuria — Database Seed Script
 *
 * Creates:
 *   - 1 Admin user
 *   - 2 Organizer users
 *   - 5 Student users
 *   - 6 Event tags
 *   - 10 Sample events (mix of PUBLISHED + DRAFT)
 *   - 8 Sample bookings
 */

import { PrismaClient, Role, EventStatus, BookingStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;
const DEFAULT_PASSWORD = "Password123!";

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

async function main() {
  console.log("🌱  Starting Hudhuria seed...");

  // ── Cleanup ──────────────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.organizerFollow.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.event.deleteMany(),
    prisma.eventTag.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const hash = await hashPassword(DEFAULT_PASSWORD);

  // ── Users ────────────────────────────────────────────────────────────
  console.log("  Creating users...");

  const admin = await prisma.user.create({
    data: {
      name: "Amina Ochieng",
      email: "admin@hudhuria.co.ke",
      passwordHash: hash,
      role: Role.ADMIN,
      institution: "Hudhuria HQ",
    },
  });

  const organizer1 = await prisma.user.create({
    data: {
      name: "Brian Kamau",
      email: "brian@uon.ac.ke",
      passwordHash: hash,
      role: Role.ORGANIZER,
      institution: "University of Nairobi",
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      name: "Cynthia Wanjiku",
      email: "cynthia@strathmore.edu",
      passwordHash: hash,
      role: Role.ORGANIZER,
      institution: "Strathmore University",
    },
  });

  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: "David Otieno",
        email: "david@student.uon.ac.ke",
        passwordHash: hash,
        role: Role.STUDENT,
        institution: "University of Nairobi",
        attendanceStreak: 3,
      },
    }),
    prisma.user.create({
      data: {
        name: "Esther Mwangi",
        email: "esther@student.strathmore.edu",
        passwordHash: hash,
        role: Role.STUDENT,
        institution: "Strathmore University",
        attendanceStreak: 7,
      },
    }),
    prisma.user.create({
      data: {
        name: "Felix Ndung'u",
        email: "felix@student.kenyatta.ac.ke",
        passwordHash: hash,
        role: Role.STUDENT,
        institution: "Kenyatta University",
        attendanceStreak: 1,
      },
    }),
    prisma.user.create({
      data: {
        name: "Grace Akinyi",
        email: "grace@student.uon.ac.ke",
        passwordHash: hash,
        role: Role.STUDENT,
        institution: "University of Nairobi",
        attendanceStreak: 0,
      },
    }),
    prisma.user.create({
      data: {
        name: "Hassan Abdi",
        email: "hassan@student.strathmore.edu",
        passwordHash: hash,
        role: Role.STUDENT,
        institution: "Strathmore University",
        attendanceStreak: 12,
      },
    }),
  ]);

  console.log(`  ✓ ${3 + students.length} users created`);

  // ── Tags ─────────────────────────────────────────────────────────────
  console.log("  Creating tags...");

  const tagNames = ["Tech", "Culture", "Sports", "Career", "Social", "Health"];
  const tags = await Promise.all(
    tagNames.map((name) => prisma.eventTag.create({ data: { name } }))
  );

  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t]));
  console.log(`  ✓ ${tags.length} tags created`);

  // ── Events ───────────────────────────────────────────────────────────
  console.log("  Creating events...");

  const now = new Date();
  const d = (daysFromNow: number, hour = 9) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + daysFromNow);
    dt.setHours(hour, 0, 0, 0);
    return dt;
  };

  const eventsData = [
    {
      title: "HackNairobi 2025",
      description:
        "Kenya's biggest student hackathon. 24 hours of hacking, mentorship from top engineers, and KES 200k in prizes. All majors welcome.",
      category: "Tech",
      startDate: d(7, 8),
      endDate: d(8, 20),
      location: "UoN Towers, Upper Kabete Campus",
      capacity: 300,
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
      organizerId: organizer1.id,
      status: EventStatus.PUBLISHED,
      tags: ["Tech"],
    },
    {
      title: "Strathmore Career Fair 2025",
      description:
        "Connect with 50+ top employers hiring fresh graduates and interns. Bring printed CVs and dress professionally.",
      category: "Career",
      startDate: d(10, 9),
      endDate: d(10, 17),
      location: "Strathmore University Sports Complex",
      capacity: 500,
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
      organizerId: organizer2.id,
      status: EventStatus.PUBLISHED,
      tags: ["Career"],
    },
    {
      title: "Afrobeats & Spoken Word Night",
      description:
        "A night of live music, spoken word poetry, and art installations celebrating East African creative expression.",
      category: "Culture",
      startDate: d(5, 18),
      endDate: d(5, 23),
      location: "Freedom Corner, Uhuru Park Nairobi",
      capacity: 200,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      organizerId: organizer1.id,
      status: EventStatus.PUBLISHED,
      tags: ["Culture", "Social"],
    },
    {
      title: "Inter-University 5K Fun Run",
      description:
        "Compete against students from 12 Nairobi universities. Route runs through Karura Forest. Medal for all finishers.",
      category: "Sports",
      startDate: d(14, 6),
      endDate: d(14, 10),
      location: "Karura Forest Gate A",
      capacity: 400,
      imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
      organizerId: organizer2.id,
      status: EventStatus.PUBLISHED,
      tags: ["Sports", "Health"],
    },
    {
      title: "AI & the Future of Africa Workshop",
      description:
        "Panel discussion + hands-on workshop on how AI is reshaping agriculture, healthcare, and fintech across Africa.",
      category: "Tech",
      startDate: d(3, 10),
      endDate: d(3, 16),
      location: "iHub, Ngong Road",
      capacity: 120,
      imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
      organizerId: organizer1.id,
      status: EventStatus.PUBLISHED,
      tags: ["Tech", "Career"],
    },
    {
      title: "Mental Health Awareness Day",
      description:
        "Free counselling sessions, wellness yoga, and mindfulness talks. No judgment — just support.",
      category: "Health",
      startDate: d(21, 9),
      endDate: d(21, 17),
      location: "Strathmore Wellness Centre",
      capacity: 150,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      organizerId: organizer2.id,
      status: EventStatus.PUBLISHED,
      tags: ["Health", "Social"],
    },
    {
      title: "Entrepreneurship Boot Camp",
      description:
        "3-day intensive for student founders. Topics: ideation, pitching, legal basics, and fundraising. Applications open.",
      category: "Career",
      startDate: d(28, 8),
      endDate: d(30, 18),
      location: "KEPSA Centre, Nairobi CBD",
      capacity: 80,
      imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
      organizerId: organizer1.id,
      status: EventStatus.PUBLISHED,
      tags: ["Career", "Tech"],
    },
    {
      title: "Swahili Film Festival",
      description:
        "Screening of 10 short films by East African student filmmakers. Q&A with directors after each block.",
      category: "Culture",
      startDate: d(45, 14),
      endDate: d(45, 22),
      location: "Kenya Cultural Centre, Nairobi",
      capacity: 250,
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      organizerId: organizer2.id,
      status: EventStatus.DRAFT,
      tags: ["Culture"],
    },
    {
      title: "Basketball Tournament — Street Edition",
      description:
        "3-on-3 street ball. Register your squad of 4. Cash prizes and branded gear for the top 3 teams.",
      category: "Sports",
      startDate: d(18, 7),
      endDate: d(18, 20),
      location: "UoN Main Campus Courts",
      capacity: 160,
      imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
      organizerId: organizer1.id,
      status: EventStatus.PUBLISHED,
      tags: ["Sports"],
    },
    {
      title: "Science & Innovation Expo",
      description:
        "Showcase your research project or prototype. Open to undergrad and postgrad students from all institutions.",
      category: "Tech",
      startDate: d(35, 9),
      endDate: d(36, 17),
      location: "JKUAT Innovation Hub, Juja",
      capacity: 350,
      imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
      organizerId: organizer2.id,
      status: EventStatus.DRAFT,
      tags: ["Tech", "Culture"],
    },
  ];

  const events: { [key: string]: any } = {};

  for (const eventData of eventsData) {
    const { tags: eventTags, ...rest } = eventData;
    const event = await prisma.event.create({
      data: {
        ...rest,
        tags: {
          connect: eventTags.map((tagName) => ({ id: tagMap[tagName].id })),
        },
      },
    });
    events[event.title] = event;
  }

  console.log(`  ✓ ${eventsData.length} events created`);

  // ── Bookings ─────────────────────────────────────────────────────────
  console.log("  Creating bookings...");

  const publishedEvents = Object.values(events).filter(
    (e) => e.status === EventStatus.PUBLISHED
  );

  const bookingsData = [
    { userId: students[0].id, eventId: publishedEvents[0].id, status: BookingStatus.CONFIRMED, checkedIn: true, checkedInAt: new Date() },
    { userId: students[0].id, eventId: publishedEvents[1].id, status: BookingStatus.CONFIRMED, checkedIn: false },
    { userId: students[1].id, eventId: publishedEvents[0].id, status: BookingStatus.CONFIRMED, checkedIn: false },
    { userId: students[1].id, eventId: publishedEvents[2].id, status: BookingStatus.CONFIRMED, checkedIn: true, checkedInAt: new Date() },
    { userId: students[2].id, eventId: publishedEvents[3].id, status: BookingStatus.CONFIRMED, checkedIn: false },
    { userId: students[3].id, eventId: publishedEvents[4].id, status: BookingStatus.WAITLISTED, checkedIn: false },
    { userId: students[4].id, eventId: publishedEvents[0].id, status: BookingStatus.CONFIRMED, checkedIn: false },
    { userId: students[4].id, eventId: publishedEvents[5].id, status: BookingStatus.CANCELLED, checkedIn: false },
  ];

  for (const bData of bookingsData) {
    await prisma.booking.create({
      data: {
        ...bData,
        qrToken: randomUUID(),
      },
    });
  }

  console.log(`  ✓ ${bookingsData.length} bookings created`);

  // ── Notifications ────────────────────────────────────────────────────
  console.log("  Creating sample notifications...");

  await prisma.notification.createMany({
    data: [
      {
        userId: students[0].id,
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed",
        body: "You're going to HackNairobi 2025! Your QR ticket is ready.",
        read: false,
      },
      {
        userId: students[1].id,
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed",
        body: "You're going to Afrobeats & Spoken Word Night!",
        read: true,
      },
      {
        userId: students[4].id,
        type: "BOOKING_CANCELLED",
        title: "Booking Cancelled",
        body: "Your booking for Mental Health Awareness Day has been cancelled.",
        read: false,
      },
    ],
  });

  console.log("  ✓ 3 notifications created");

  // ── OrganizerFollows ─────────────────────────────────────────────────
  await prisma.organizerFollow.createMany({
    data: [
      { studentId: students[0].id, organizerId: organizer1.id },
      { studentId: students[1].id, organizerId: organizer1.id },
      { studentId: students[1].id, organizerId: organizer2.id },
      { studentId: students[4].id, organizerId: organizer2.id },
    ],
  });

  console.log("  ✓ 4 organizer follows created");

  // ── Summary ──────────────────────────────────────────────────────────
  console.log("\n✅  Seed complete!\n");
  console.log("Test accounts (all use password: Password123!):");
  console.log(`  Admin:      admin@hudhuria.co.ke`);
  console.log(`  Organizer:  brian@uon.ac.ke`);
  console.log(`  Organizer:  cynthia@strathmore.edu`);
  console.log(`  Student:    david@student.uon.ac.ke`);
  console.log(`  Student:    esther@student.strathmore.edu`);
  console.log(`  Student:    hassan@student.strathmore.edu  (streak: 12)`);
}

main()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
