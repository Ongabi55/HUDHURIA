'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { cn, getCategoryColor, formatEventDate, truncate } from '@/lib/utils'
import type { Event } from '@/types'

// ── Gradient Progress Bar ─────────────────────────────────────────────────
function CapacityBar({ seatsLeft, capacity, index }: { seatsLeft: number; capacity: number; index: number }) {
  const filled = Math.max(0, Math.min(100, Math.round(((capacity - seatsLeft) / capacity) * 100)))
  const free   = 100 - filled

  const barClass =
    seatsLeft === 0        ? 'progress-bar-gradient-danger'
    : free <= 10           ? 'progress-bar-gradient-danger'
    : free <= 30           ? 'progress-bar-gradient-warn'
    :                        'progress-bar-gradient'

  const labelColor =
    seatsLeft === 0        ? 'text-red-400'
    : free <= 10           ? 'text-red-400'
    : free <= 30           ? 'text-amber-400'
    :                        'text-burg-bright'

  const label =
    seatsLeft === 0
      ? 'Sold Out'
      : free <= 10
      ? `Only ${seatsLeft} left!`
      : `${seatsLeft} / ${capacity} seats`

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3 text-[var(--text-muted)]" />
          <span className={cn('text-xs font-medium', labelColor)}>{label}</span>
        </div>
        <span className="text-xs text-[var(--text-subtle)]">{free}% free</span>
      </div>
      {/* Track */}
      <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${free}%` }}
          transition={{ delay: index * 0.05 + 0.3, duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ── Category Badge ────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={cn(
      'text-xs px-2.5 py-1 rounded-full border font-semibold backdrop-blur-sm',
      getCategoryColor(category)
    )}>
      {category}
    </span>
  )
}

// ── EventCard ─────────────────────────────────────────────────────────────
interface EventCardProps {
  event: Event
  variant?: 'grid' | 'featured'
  index?: number
}

export function EventCard({ event, variant = 'grid', index = 0 }: EventCardProps) {
  const seatsLeft  = event.seatsLeft  ?? 0
  const capacity   = event.capacity   ?? 100

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="glass-card rounded-2xl overflow-hidden group"
      >
        <Link href={`/events/${event.id}`} className="flex flex-col md:flex-row w-full">
          {/* Image */}
          <div className="relative md:w-2/5 aspect-video md:aspect-auto min-h-[200px] overflow-hidden">
            {event.imageUrl ? (
              <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-burg/40 to-navy-mid/80 flex items-center justify-center">
                <span className="text-5xl font-black text-white/10">{event.category[0]}</span>
              </div>
            )}
            {/* Gradient overlay — bottom to top for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 hidden md:block" />
            <div className="absolute top-3 left-3">
              <CategoryBadge category={event.category} />
            </div>
            {event.status === 'CANCELLED' && (
              <div className="absolute top-3 right-3">
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm font-medium">
                  Cancelled
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-col justify-between p-6 flex-1 gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-burg-bright transition-colors line-clamp-2 leading-snug">
                {event.title}
              </h3>
              <p className="text-[var(--text-muted)] text-sm line-clamp-2 leading-relaxed">{event.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                <Calendar className="w-3.5 h-3.5 text-burg-bright shrink-0" />
                <span>{formatEventDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                <MapPin className="w-3.5 h-3.5 text-burg-bright shrink-0" />
                <span>{truncate(event.location, 40)}</span>
              </div>
              <div className="pt-2">
                <CapacityBar seatsLeft={seatsLeft} capacity={capacity} index={index} />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Grid variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-2xl overflow-hidden group h-full flex flex-col cursor-pointer"
    >
      <Link href={`/events/${event.id}`} className="flex flex-col h-full">

        {/* Image with layered gradient overlay */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-108"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-burg/30 via-navy-mid to-navy flex items-center justify-center">
              <span className="text-6xl font-black text-white/[0.07] select-none">{event.category[0]}</span>
            </div>
          )}

          {/* Strong bottom gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />

          {/* Status badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <CategoryBadge category={event.category} />
            {event.status === 'CANCELLED' && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm font-medium shrink-0">
                Cancelled
              </span>
            )}
          </div>

          {/* Date chip overlaid on image bottom */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-burg-bright" />
            <span className="text-xs text-white font-medium">{formatEventDate(event.startDate)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Organizer */}
          <p className="text-[var(--text-subtle)] text-xs truncate">
            {event.organizer?.name}
            {event.organizer?.institution ? ` · ${event.organizer.institution}` : ''}
          </p>

          {/* Title */}
          <h3 className="font-bold text-[var(--text)] text-base line-clamp-2 leading-snug group-hover:text-burg-bright transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <MapPin className="w-3.5 h-3.5 text-burg-bright shrink-0" />
            <span className="truncate">{truncate(event.location, 32)}</span>
          </div>

          {/* Capacity bar */}
          <div className="mt-auto pt-3 border-t border-[var(--glass-border)]">
            <CapacityBar seatsLeft={seatsLeft} capacity={capacity} index={index} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────
export function EventCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-[var(--border)]" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-[var(--border)] rounded-full w-1/4" />
        <div className="h-4 bg-[var(--border)] rounded-full w-full" />
        <div className="h-4 bg-[var(--border)] rounded-full w-3/4" />
        <div className="h-3 bg-[var(--border)] rounded-full w-1/2 mt-1" />
        <div className="pt-3 border-t border-[var(--glass-border)] space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-[var(--border)] rounded-full w-24" />
            <div className="h-3 bg-[var(--border)] rounded-full w-12" />
          </div>
          <div className="h-1.5 bg-[var(--border)] rounded-full w-full" />
        </div>
      </div>
    </div>
  )
}
