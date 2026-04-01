import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Users, Zap, Star, Shield, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Event, ApiResponse, PaginatedResponse } from '@/types'

async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'}/events?pageSize=3&status=PUBLISHED`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const json: ApiResponse<PaginatedResponse<Event>> = await res.json()
    return json.data?.items ?? []
  } catch {
    return []
  }
}

const STATS = [
  { value: '1,200+', label: 'Wanafunzi Waliojiunga', icon: Users },
  { value: '50+',    label: 'Matukio Yaliyopita',    icon: Calendar },
  { value: '12',     label: 'Vyuo Washirika',         icon: MapPin },
  { value: '98%',    label: 'Kuridhika kwa Watumiaji', icon: Star },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Zap,
    title: 'Jisajili Haraka',
    desc: 'Fungua akaunti yako bila malipo kwa sekunde chache tu. Hakuna kadi ya benki inayohitajika.',
  },
  {
    step: '02',
    icon: TrendingUp,
    title: 'Gundua Matukio',
    desc: 'Tafuta na kuchagua matukio yanayokuvutia kutoka vyuo mbalimbali Kenya.',
  },
  {
    step: '03',
    icon: Shield,
    title: 'Hifadhi & Hudhuria',
    desc: 'Hifadhi kiti lako kwa sekunde moja na upokee tiketi yako ya kidijitali mara moja.',
  },
]

const CATEGORIES = [
  { name: 'Teknolojia', emoji: '💻', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
  { name: 'Utamaduni',  emoji: '🎭', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
  { name: 'Michezo',    emoji: '⚽', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
  { name: 'Kazi',       emoji: '💼', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30' },
  { name: 'Afya',       emoji: '🏃', color: 'from-rose-500/20 to-red-500/20 border-rose-500/30' },
  { name: 'Burudani',   emoji: '🎵', color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30' },
]

export default async function LandingPage() {
  const featured = await getFeaturedEvents()

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-8 pb-20">
        {/* Ambient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-navy" />
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-burg/8 rounded-full blur-[140px]" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-navy-mid/30 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-burg-bright/5 rounded-full blur-[80px]" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full border border-burg/20 text-sm text-muted mb-10 shadow-glow-sm">
          <span className="w-2 h-2 rounded-full bg-burg-bright animate-pulse-slow" />
          <span>Platform #1 ya Matukio ya Campus Kenya</span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1] mb-6">
            <span className="block text-[#F0F4FF] mb-2">Gundua.</span>
            <span className="block text-[#F0F4FF] mb-2">Hifadhi.</span>
            <span className="block bg-gradient-to-r from-burg via-burg-bright to-burg-mid bg-clip-text text-transparent">
              Hudhuria.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Matukio yote ya campus Kenya mahali pamoja. Jiunge na wanafunzi zaidi ya
            <span className="text-burg-bright font-semibold"> 1,200</span> wanaotumia Hudhuria kila siku.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
          <Link href="/register">
            <Button size="lg" className="gap-2 px-8 shadow-glow-burg">
              Anza Bure Leo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="glass" size="lg" className="gap-2 px-8">
              <Calendar className="w-4 h-4" />
              Tazama Matukio
            </Button>
          </Link>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
          {['✓ Bila Malipo', '✓ Tiketi ya Kidijitali', '✓ QR Code Check-in', '✓ Matukio yote Kenya'].map(item => (
            <span key={item} className="flex items-center gap-1.5">{item}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass-card p-6 text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-burg/10 border border-burg/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-burg/20 transition-colors">
                  <Icon className="w-5 h-5 text-burg-bright" />
                </div>
                <p className="text-3xl font-black text-[#F0F4FF] mb-1">{value}</p>
                <p className="text-xs text-muted leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">Aina za Matukio</p>
            <h2 className="text-3xl font-black text-[#F0F4FF]">Kila Kitu Unachopenda</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(({ name, emoji, color }) => (
              <Link
                key={name}
                href={`/discover?category=${name}`}
                className={`glass-card p-5 text-center group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${color} border`}
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="text-xs font-semibold text-[#F0F4FF] group-hover:text-white transition-colors">{name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">Yanayokuja</p>
              <h2 className="text-3xl font-black text-[#F0F4FF]">Matukio Maarufu 🔥</h2>
            </div>
            <Link
              href="/discover"
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted hover:text-burg-bright transition-colors font-medium"
            >
              Tazama yote <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((event, i) => (
                <FeaturedCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="text-5xl mb-4">🎪</div>
              <p className="text-muted mb-2 font-medium">Matukio yataonekana hapa hivi karibuni</p>
              <p className="text-sm text-muted/60 mb-6">Angalia ukurasa wa Gundua kwa matukio yote</p>
              <Link href="/discover">
                <Button variant="glass">Gundua Matukio</Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/discover">
              <Button variant="outline" className="gap-2">
                Tazama Matukio Yote <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">Jinsi Inavyofanya Kazi</p>
            <h2 className="text-3xl font-black text-[#F0F4FF]">Rahisi kama 1-2-3</h2>
            <p className="text-muted mt-3 max-w-md mx-auto text-sm">
              Hakuna utata. Jiunge, gundua, na uhudhirie — yote kwa dakika chache.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="relative">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-burg/30 to-transparent z-10 -translate-x-6" />
                )}
                <div className="glass-card p-7 h-full relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute top-5 right-5 text-6xl font-black text-white/[0.03] select-none">{step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burg/20 to-burg-bright/10 border border-burg/20 flex items-center justify-center mb-5 group-hover:border-burg/40 transition-colors">
                    <Icon className="w-6 h-6 text-burg-bright" />
                  </div>
                  <div className="text-xs font-bold text-burg-bright mb-2 tracking-widest">HATUA {step}</div>
                  <h3 className="text-lg font-bold text-[#F0F4FF] mb-3">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="px-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card rounded-3xl p-12 sm:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-burg/10 via-transparent to-burg-bright/5 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-burg-bright/40 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-burg/30 to-transparent" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-burg/10 rounded-full blur-[80px]" />

            <div className="relative">
              <div className="text-4xl mb-4">🚀</div>
              <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-4">Anza Leo</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F0F4FF] mb-4 leading-tight">
                Usikose Tukio<br />Lolote Tena
              </h2>
              <p className="text-muted mb-8 max-w-md mx-auto leading-relaxed">
                Jiunge na jamii ya wanafunzi wanaotumia Hudhuria kugundua matukio bora ya campus Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="gap-2 px-10 shadow-glow-burg">
                    Jisajili Sasa — Bure <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button variant="glass" size="lg" className="gap-2 px-10">
                    <Calendar className="w-4 h-4" /> Tazama Matukio
                  </Button>
                </Link>
              </div>
              <p className="text-muted/50 text-xs mt-6">Bila malipo • Bila kadi ya benki • Jisajili sekunde 30</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

function FeaturedCard({ event, index }: { event: Event; index: number }) {
  const gradients = [
    'from-burg/30 to-navy-mid',
    'from-blue-600/30 to-navy',
    'from-purple-600/30 to-navy',
  ]

  return (
    <Link
      href={`/events/${event.id}`}
      className="glass-card group block overflow-hidden hover:-translate-y-1.5 transition-all duration-300 hover:shadow-glow-sm"
    >
      {/* Image / Gradient cover */}
      <div className="relative h-48 overflow-hidden">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradients[index % 3]} flex items-center justify-center`}>
            <span className="text-5xl font-black text-white/10 select-none">{event.category?.[0] ?? 'H'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-burg/40 border border-burg-bright/30 text-burg-bright backdrop-blur-sm font-medium">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-[#F0F4FF] line-clamp-2 mb-3 group-hover:text-burg-bright transition-colors leading-snug">
          {event.title}
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Calendar className="w-3.5 h-3.5 text-burg-bright shrink-0" />
            <span>{event.startDate ? new Date(event.startDate).toLocaleDateString('sw-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <MapPin className="w-3.5 h-3.5 text-burg-bright shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        {event.seatsLeft != null && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-muted">
              {event.seatsLeft} spots remaining
            </span>
            <span className="text-xs font-semibold text-burg-bright group-hover:underline">
              View →
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
