import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Users, Zap, Shield, TrendingUp, Star } from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import EventCard from '../components/events/EventCard'
import { useEffect, useState } from 'react'
import { eventsApi } from '../lib/api'

const STATS = [
  { key: 'stat_students', value: '1,200+', Icon: Users },
  { key: 'stat_events',   value: '50+',    Icon: Calendar },
  { key: 'stat_campuses', value: '12',     Icon: MapPin },
  { key: 'stat_satisfaction', value: '98%', Icon: Star },
]

const CATEGORIES = [
  { name: 'Tech',    emoji: '💻', grad: 'from-blue-500/20 to-cyan-500/20',   border: 'border-blue-500/25' },
  { name: 'Culture', emoji: '🎭', grad: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/25' },
  { name: 'Sports',  emoji: '⚽', grad: 'from-green-500/20 to-emerald-500/20',border: 'border-green-500/25' },
  { name: 'Career',  emoji: '💼', grad: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/25' },
  { name: 'Health',  emoji: '🏃', grad: 'from-rose-500/20 to-red-500/20',    border: 'border-rose-500/25' },
  { name: 'Social',  emoji: '🎵', grad: 'from-indigo-500/20 to-violet-500/20',border: 'border-indigo-500/25' },
]

const HOW_STEPS = [
  { Icon: Zap,        key_label: 'STEP 01', key_title: 'Create Account',   key_desc: 'Sign up for free in seconds. No credit card required.' },
  { Icon: TrendingUp, key_label: 'STEP 02', key_title: 'Discover Events',  key_desc: 'Browse events from universities across Kenya.' },
  { Icon: Shield,     key_label: 'STEP 03', key_title: 'Book & Attend',    key_desc: 'Save your spot instantly and get your digital ticket.' },
]

export default function Home() {
  const { t } = useI18n()
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    eventsApi.list({ pageSize: 3, status: 'PUBLISHED' })
      .then(res => setFeatured(res.data?.data?.items ?? []))
      .catch(() => {})
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-8 pb-20">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'var(--bg)' }} />
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full" style={{ background: 'rgba(139,26,74,0.07)', filter: 'blur(140px)' }} />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(26,47,111,0.25)', filter: 'blur(120px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full" style={{ background: 'rgba(196,34,77,0.04)', filter: 'blur(80px)' }} />
          <div className="absolute inset-0 grid-overlay opacity-20" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full border border-burg-bright/20 text-sm mb-10 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2 h-2 rounded-full bg-burg-bright" style={{ animation: 'pulse 2s ease infinite' }} />
          Campus Events Platform — Kenya
        </div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto mb-8 animate-slide-up">
          <h1 className="font-black tracking-tight leading-[1] mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <span className="block mb-2" style={{ color: 'var(--text)' }}>{t('hero_line1')}</span>
            <span className="block mb-2" style={{ color: 'var(--text)' }}>{t('hero_line2')}</span>
            <span className="block" style={{ background: 'linear-gradient(135deg,#8B1A4A,#C4224D,#ff6b8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t('hero_line3')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('hero_sub')}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link to="/register" className="btn-primary text-base px-8 py-3 rounded-xl">{t('cta_start')} <ArrowRight size={16} /></Link>
          <Link to="/discover" className="btn-glass text-base px-8 py-3 rounded-xl"><Calendar size={16} /> {t('cta_explore')}</Link>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs animate-fade-in" style={{ color: 'var(--text-subtle)', animationDelay: '0.3s' }}>
          {['✓ Free to join', '✓ Digital Ticket', '✓ QR Check-in', '✓ All Kenya'].map(item => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ key, value, Icon }) => (
            <div key={key} className="glass-card p-6 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(139,26,74,0.1)', border: '1px solid rgba(139,26,74,0.2)' }}>
                <Icon size={18} className="text-burg-bright" />
              </div>
              <p className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>{value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">Event Categories</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--text)' }}>Everything You Love</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(({ name, emoji, grad, border }) => (
              <Link
                key={name}
                to={`/discover?category=${name}`}
                className={`glass-card p-5 text-center group border bg-gradient-to-br ${grad} ${border} block no-underline`}
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="text-xs font-semibold group-hover:text-white transition-colors" style={{ color: 'var(--text)' }}>{name}</p>
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
              <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">Upcoming</p>
              <h2 className="text-3xl font-black" style={{ color: 'var(--text)' }}>Trending Events 🔥</h2>
            </div>
            <Link to="/discover" className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-burg-bright no-underline" style={{ color: 'var(--text-muted)' }}>
              See all <ArrowRight size={14} />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="text-5xl mb-4">🎪</div>
              <p className="font-medium mb-6" style={{ color: 'var(--text-muted)' }}>Events will appear here soon</p>
              <Link to="/discover" className="btn-glass">Discover Events</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('section_how')}</p>
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text)' }}>{t('section_how_title')}</h2>
            <p className="max-w-md mx-auto text-sm" style={{ color: 'var(--text-muted)' }}>
              No friction. Sign up, discover, and attend — all in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map(({ Icon, key_label, key_title, key_desc }, i) => (
              <div key={i} className="glass-card p-7 relative overflow-hidden">
                <div className="absolute top-5 right-5 text-6xl font-black select-none" style={{ color: 'rgba(255,255,255,0.025)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(139,26,74,0.15)', border: '1px solid rgba(139,26,74,0.2)' }}>
                  <Icon size={22} className="text-burg-bright" />
                </div>
                <div className="text-xs font-bold text-burg-bright mb-2 tracking-widest">{key_label}</div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>{key_title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{key_desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="px-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg,rgba(139,26,74,0.1),transparent,rgba(196,34,77,0.05))' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{ background: 'linear-gradient(to right,transparent,rgba(196,34,77,0.4),transparent)' }} />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight" style={{ color: 'var(--text)' }}>
                Don't Miss Another Event
              </h2>
              <p className="mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Join a community of students discovering the best campus events in Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-base px-10 py-3 rounded-xl">
                  {t('sign_up_free')} <ArrowRight size={16} />
                </Link>
                <Link to="/discover" className="btn-glass text-base px-10 py-3 rounded-xl">
                  <Calendar size={16} /> {t('cta_explore')}
                </Link>
              </div>
              <p className="text-xs mt-6" style={{ color: 'var(--text-subtle)' }}>Free · No credit card · 30-second signup</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
