/**
 * Add 12 new events to the Hudhuria database without wiping existing data.
 * Run from apps/backend: node scripts/add-events.js
 */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ORGANIZER_1 = 'cmned5e7m0001gtx5xvbr3rno'  // Brian Kamau — UoN
const ORGANIZER_2 = 'cmned5e7o0002gtx5q43lp587'  // Cynthia Wanjiku — Strathmore

const now = new Date()
const d = (daysFromNow, hour = 9) => {
  const dt = new Date(now)
  dt.setDate(dt.getDate() + daysFromNow)
  dt.setHours(hour, 0, 0, 0)
  return dt
}

const NEW_EVENTS = [
  // ── Tech ──────────────────────────────────────────────────────────────
  {
    title: 'Web3 & Blockchain Summit Nairobi',
    description: 'Explore how blockchain is transforming payments, land registries, and identity in Africa. Keynotes from Safaricom, Celo Foundation, and local DeFi builders. Hands-on wallet workshop included.',
    category: 'Tech',
    startDate: d(4, 9),
    endDate: d(4, 18),
    location: 'Radisson Blu Hotel, Upper Hill, Nairobi',
    capacity: 250,
    imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800',
    organizerId: ORGANIZER_1,
    status: 'PUBLISHED',
  },
  {
    title: 'Open Source Contributor Day',
    description: "Spend the day contributing to real open-source projects with guidance from maintainers. Beginners welcome — we'll help you land your first pull request. Lunch and swag provided.",
    category: 'Tech',
    startDate: d(9, 10),
    endDate: d(9, 17),
    location: 'Nairobi Garage, Westlands',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
    organizerId: ORGANIZER_2,
    status: 'PUBLISHED',
  },
  {
    title: 'Cybersecurity CTF Challenge',
    description: 'Capture The Flag competition open to all Kenyan university students. Test your skills in web exploitation, reverse engineering, forensics, and cryptography. Top 3 teams win internship interviews.',
    category: 'Tech',
    startDate: d(12, 8),
    endDate: d(12, 22),
    location: 'KCA University, Ruaraka',
    capacity: 180,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    organizerId: ORGANIZER_1,
    status: 'PUBLISHED',
  },

  // ── Culture ────────────────────────────────────────────────────────────
  {
    title: 'East African Fashion Week — Campus Edition',
    description: 'Student designers from across Kenya showcase original collections inspired by Kenyan and East African heritage. Live runway, photography stations, and panel on sustainable fashion.',
    category: 'Culture',
    startDate: d(16, 14),
    endDate: d(16, 21),
    location: 'KICC Rooftop, Nairobi CBD',
    capacity: 300,
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
    organizerId: ORGANIZER_2,
    status: 'PUBLISHED',
  },
  {
    title: 'Photography Walk: Nairobi Unseen',
    description: 'Guided photography tour through Nairobi neighbourhoods rarely seen in mainstream media. Expert photographer leads, critiques your shots live, and helps you build your portfolio.',
    category: 'Culture',
    startDate: d(6, 7),
    endDate: d(6, 13),
    location: 'Kibera — Meet at Nairobi Dam Gate',
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    organizerId: ORGANIZER_1,
    status: 'PUBLISHED',
  },

  // ── Sports ─────────────────────────────────────────────────────────────
  {
    title: 'Inter-Campus Football League — Finals',
    description: 'The final showdown of the 2025 Inter-Campus Football League. 8 universities, 1 champion. Free entry for spectators. Food stalls and live DJ on the sidelines.',
    category: 'Sports',
    startDate: d(20, 13),
    endDate: d(20, 20),
    location: 'Nyayo National Stadium, Nairobi',
    capacity: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    organizerId: ORGANIZER_2,
    status: 'PUBLISHED',
  },
  {
    title: 'Swimming Gala — East Africa Varsity Cup',
    description: 'Compete in 50m, 100m, and relay events. Open to registered university students with valid student ID. Medals for top 3 in each category.',
    category: 'Sports',
    startDate: d(25, 8),
    endDate: d(25, 17),
    location: 'Strathmore University Pool',
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800',
    organizerId: ORGANIZER_2,
    status: 'PUBLISHED',
  },

  // ── Career ─────────────────────────────────────────────────────────────
  {
    title: 'Women in Tech Kenya Meetup',
    description: 'Monthly meetup celebrating and supporting women building careers in technology. Lightning talks, mentorship matching, and a networking dinner. All genders welcome.',
    category: 'Career',
    startDate: d(8, 17),
    endDate: d(8, 21),
    location: 'Microsoft Africa Development Centre, Waiyaki Way',
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
    organizerId: ORGANIZER_1,
    status: 'PUBLISHED',
  },
  {
    title: 'LinkedIn Profile Bootcamp',
    description: 'Get your LinkedIn profile reviewed by recruiters from top Kenyan companies. Headshot booth, cover letter workshop, and live mock interviews. Walk out job-search ready.',
    category: 'Career',
    startDate: d(13, 9),
    endDate: d(13, 16),
    location: 'Strathmore University, Learning Resource Centre',
    capacity: 90,
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    organizerId: ORGANIZER_2,
    status: 'PUBLISHED',
  },

  // ── Social ─────────────────────────────────────────────────────────────
  {
    title: 'Campus Trivia Night',
    description: 'Form teams of 4 and compete across rounds of tech, pop culture, history, and Kenyan current affairs trivia. Prizes for top 2 teams. Free drinks for the last-place team.',
    category: 'Social',
    startDate: d(2, 19),
    endDate: d(2, 22),
    location: 'Java House, Kenyatta Avenue Branch',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800',
    organizerId: ORGANIZER_1,
    status: 'PUBLISHED',
  },
  {
    title: 'International Students Mixer',
    description: 'Connect with students from 30+ countries studying in Nairobi. Cultural food stalls, language exchange tables, and live music. Make friends and build your global network.',
    category: 'Social',
    startDate: d(11, 16),
    endDate: d(11, 21),
    location: 'UoN Main Campus, Taifa Hall Grounds',
    capacity: 350,
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    organizerId: ORGANIZER_2,
    status: 'PUBLISHED',
  },

  // ── Health ─────────────────────────────────────────────────────────────
  {
    title: 'Free HIV & Cancer Screening Drive',
    description: 'Free, confidential health screenings including HIV tests, cervical cancer screening, blood pressure, and blood sugar checks. Provided by Kenya Red Cross and Kenyatta National Hospital.',
    category: 'Health',
    startDate: d(15, 8),
    endDate: d(15, 16),
    location: 'Kenyatta University, Student Centre',
    capacity: 500,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    organizerId: ORGANIZER_1,
    status: 'PUBLISHED',
  },
]

async function main() {
  console.log('🌱  Adding events to database...')

  // Get or create tags
  const tagNames = ['Tech', 'Culture', 'Sports', 'Career', 'Social', 'Health']
  const tags = await Promise.all(
    tagNames.map(name =>
      prisma.eventTag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )
  const tagMap = Object.fromEntries(tags.map(t => [t.name, t]))

  let created = 0
  for (const ev of NEW_EVENTS) {
    await prisma.event.create({
      data: {
        ...ev,
        tags: {
          connect: [{ id: tagMap[ev.category].id }],
        },
      },
    })
    console.log(`  ✓ "${ev.title}"`)
    created++
  }

  const total = await prisma.event.count()
  console.log(`\n✅  Done! Added ${created} events. Total in DB: ${total}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
