import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { cn, getCategoryColor, formatEventDate, truncate, getCapacityMeta } from '../../lib/utils'

/* ── Capacity Bar ─────────────────────────────────────────────────── */
function CapacityBar({ seatsLeft, capacity }) {
  const { pct, barClass, label, labelColor } = getCapacityMeta(seatsLeft, capacity)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-[var(--text-muted)]" />
          <span className={cn('text-xs font-medium', labelColor)}>{label}</span>
        </div>
        <span className="text-xs text-[var(--text-subtle)]">{pct}% free</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── EventCard ────────────────────────────────────────────────────── */
const PLACEHOLDER_GRADIENTS = [
  'from-burg/30 to-navy-mid',
  'from-blue-600/30 to-navy-surface',
  'from-purple-600/30 to-navy-surface',
  'from-teal-600/30 to-navy-surface',
]

export default function EventCard({ event, variant = 'grid', index = 0 }) {
  const seatsLeft = event.seatsLeft ?? 0
  const capacity  = event.capacity  ?? 100

  if (variant === 'featured') {
    return (
      <Link
        to={`/events/${event.id}`}
        className="glass-card flex flex-col sm:flex-row overflow-hidden group block no-underline"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Image */}
        <div className="relative sm:w-2/5 aspect-video sm:aspect-auto min-h-[180px] overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className={cn('absolute inset-0 bg-gradient-to-br flex items-center justify-center', PLACEHOLDER_GRADIENTS[index % 4])}>
              <span className="text-5xl font-black" style={{ color: 'rgba(255,255,255,0.08)' }}>{event.category?.[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 hidden sm:block" />
          <div className="absolute top-3 left-3">
            <span className={cn('text-xs px-2.5 py-1 rounded-full border font-semibold backdrop-blur-sm', getCategoryColor(event.category))}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col justify-between p-5 flex-1 gap-3">
          <div>
            <h3 className="text-lg font-bold line-clamp-2 leading-snug mb-2 transition-colors group-hover:text-burg-bright" style={{ color: 'var(--text)' }}>
              {event.title}
            </h3>
            <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{event.description}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={13} className="text-burg-bright shrink-0" />
              <span>{formatEventDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={13} className="text-burg-bright shrink-0" />
              <span>{truncate(event.location, 40)}</span>
            </div>
            <div className="pt-2">
              <CapacityBar seatsLeft={seatsLeft} capacity={capacity} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/events/${event.id}`}
      className="glass-card flex flex-col overflow-hidden group block no-underline h-full"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={cn('absolute inset-0 bg-gradient-to-br flex items-center justify-center', PLACEHOLDER_GRADIENTS[index % 4])}>
            <span className="text-6xl font-black select-none" style={{ color: 'rgba(255,255,255,0.07)' }}>{event.category?.[0]}</span>
          </div>
        )}

        {/* Layered gradients — bottom heavy for text legibility */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.12) 40%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.22) 100%)' }} />

        {/* Category badge */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className={cn('text-xs px-2.5 py-1 rounded-full border font-semibold backdrop-blur-sm', getCategoryColor(event.category))}>
            {event.category}
          </span>
          {event.status === 'CANCELLED' && (
            <span className="text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm shrink-0" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
              Cancelled
            </span>
          )}
        </div>

        {/* Date chip on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
          <Clock size={11} className="text-burg-bright" />
          <span className="text-xs text-white font-medium">{formatEventDate(event.startDate)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <p className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>
          {event.organizer?.name}{event.organizer?.institution ? ` · ${event.organizer.institution}` : ''}
        </p>

        <h3 className="font-bold text-base line-clamp-2 leading-snug transition-colors group-hover:text-burg-bright" style={{ color: 'var(--text)' }}>
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <MapPin size={13} className="text-burg-bright shrink-0" />
          <span className="truncate">{truncate(event.location, 32)}</span>
        </div>

        <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <CapacityBar seatsLeft={seatsLeft} capacity={capacity} />
        </div>
      </div>
    </Link>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
export function EventCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}>
      <div className="aspect-[16/9]" style={{ background: 'var(--border)' }} />
      <div className="p-4 space-y-3">
        <div className="h-2.5 rounded-full w-1/4" style={{ background: 'var(--border)' }} />
        <div className="h-4 rounded-full w-full" style={{ background: 'var(--border)' }} />
        <div className="h-4 rounded-full w-3/4" style={{ background: 'var(--border)' }} />
        <div className="h-3 rounded-full w-1/2" style={{ background: 'var(--border)' }} />
        <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex justify-between">
            <div className="h-3 rounded-full w-24" style={{ background: 'var(--border)' }} />
            <div className="h-3 rounded-full w-12" style={{ background: 'var(--border)' }} />
          </div>
          <div className="h-1.5 rounded-full w-full" style={{ background: 'var(--border)' }} />
        </div>
      </div>
    </div>
  )
}
