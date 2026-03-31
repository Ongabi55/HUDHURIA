import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Calendar, MapPin } from 'lucide-react'
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
  { value: '1,200+', label: 'Wanafunzi', icon: Users },
  { value: '50+',    label: 'Matukio',   icon: Calendar },
  { value: '12',     label: 'Vyuo',      icon: MapPin },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Jiunge',    desc: 'Fungua akaunti yako kwa sekunde chache.' },
  { step: '02', title: 'Gundua',   desc: 'Tafuta na chagua matukio yanayokuvutia.' },
  { step: '03', title: 'Hudhuria', desc: 'Hifadhi kiti na uhudhirie tukio lako.' },
]

const FLOAT_TAGS = ['Tech', 'Culture', 'Sports', 'Career', 'Social', 'Health']

export default async function LandingPage() {
  const featured = await getFeaturedEvents()

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-24">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-navy" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-burg/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-mid/40 rounded-full blur-[100px]" />
          {/* Blueprint grid */}
          <div className="absolute inset-0 grid-overlay opacity-30" />
        </div>

        {/* Floating category tags */}
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none hidden lg:block">
          {FLOAT_TAGS.map((tag, i) => (
            <div
              key={tag}
              className="absolute glass px-3 py-1.5 rounded-full text-xs text-muted border border-white/10 animate-float"
              style={{
                top: `${15 + i * 12}%`,
                left: i % 2 === 0 ? `${4 + i * 2}%` : 'auto',
                right: i % 2 !== 0 ? `${4 + i * 2}%` : 'auto',
                animationDelay: `${i * 0.6}s`,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10 text-sm text-muted mb-8">
            <Sparkles className="w-3.5 h-3.5 text-burg-bright" />
            <span>Platform ya Matukio ya Campus Kenya</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
            <span className="block text-[#F0F4FF]">Karibu</span>
            <span className="block bg-gradient-to-r from-burg to-burg-bright bg-clip-text text-transparent">
              Hudhuria
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Gundua matukio ya campus, hifadhi kiti lako, na uhudhirie tukio
            zako favourite — yote mahali pamoja.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/discover">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Gundua Matukio
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Jiunge Sasa — Bure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-6 text-center">
              <Icon className="w-5 h-5 text-burg-bright mx-auto mb-3" />
              <p className="text-3xl font-black text-[#F0F4FF]">{value}</p>
              <p className="text-sm text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-burg-bright text-sm font-medium mb-1 uppercase tracking-widest">Yanayokuja</p>
              <h2 className="text-3xl font-bold text-[#F0F4FF]">Matukio Maarufu 🔥</h2>
            </div>
            <Link href="/discover" className="text-sm text-muted hover:text-burg-bright transition-colors flex items-center gap-1">
              Tazama yote <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map((event, i) => (
                <FeaturedEventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-muted">Angalia matukio yote kwenye ukurasa wa Gundua</p>
              <Link href="/discover" className="mt-4 inline-block">
                <Button variant="glass">Gundua Matukio</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-burg-bright text-sm font-medium mb-2 uppercase tracking-widest">Jinsi Inavyofanya Kazi</p>
            <h2 className="text-3xl font-bold text-[#F0F4FF]">Rahisi. Haraka. Yenye Nguvu.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.04]">{step}</div>
                <div className="w-8 h-8 rounded-lg bg-burg/20 border border-burg/30 flex items-center justify-center mb-4">
                  <span className="text-burg-bright text-xs font-bold">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#F0F4FF] mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-burg/10 via-transparent to-burg/10 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-burg-bright/40 to-transparent" />
            <p className="text-burg-bright text-sm font-medium mb-3 uppercase tracking-widest">Anza Leo</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F0F4FF] mb-4">
              Usikose Tukio Lolote
            </h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Jiunge na wanafunzi zaidi ya 1,200 wanaotumia Hudhuria kugundua na kuhudhuria matukio ya campus.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Anza Bure <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeaturedEventCard({ event, index }: { event: Event; index: number }) {
  return (
    <Link href={`/events/${event.id}`} className="glass-card rounded-2xl overflow-hidden group block hover:-translate-y-1 transition-transform duration-300">
      <div className="relative aspect-[16/9]">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-burg/30 to-navy-mid flex items-center justify-center">
            <span className="text-4xl font-black text-white/10">{event.category[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-burg/30 border border-burg/40 text-burg-bright backdrop-blur-sm">
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#F0F4FF] line-clamp-2 mb-2 group-hover:text-burg-bright transition-colors text-sm">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="w-3 h-3 text-burg-bright" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </Link>
  )
}
