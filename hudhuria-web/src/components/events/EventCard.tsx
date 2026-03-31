'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users } from 'lucide-react'
import { cn, getCategoryColor, getSeatsLabel, formatEventDate, truncate } from '@/lib/utils'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
  variant?: 'grid' | 'featured'
  index?: number
}

export function EventCard({ event, variant = 'grid', index = 0 }: EventCardProps) {
  const seatsPercent = Math.round((event.seatsLeft / event.capacity) * 100)
  const seatsBarColor =
    seatsPercent > 50 ? 'bg-green-400' : seatsPercent > 10 ? 'bg-amber-400' : 'bg-red-400'

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row cursor-pointer group"
      >
        <Link href={`/events/${event.id}`} className="flex flex-col md:flex-row w-full">
          <div className="relative md:w-2/5 aspect-video md:aspect-auto min-h-[200px]">
            {event.imageUrl ? (
              <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-burg/40 to-navy-mid/80 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/20">{event.category[0]}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/60 md:block hidden" />
          </div>
          <div className="flex flex-col justify-between p-6 flex-1">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', getCategoryColor(event.category))}>
                  {event.category}
                </span>
                {event.status === 'CANCELLED' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    Imefutwa
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#F0F4FF] mb-2 group-hover:text-burg-bright transition-colors line-clamp-2">
                {event.title}
              </h3>
              <p className="text-muted text-sm line-clamp-2 mb-4">{event.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted text-xs">
                <Calendar className="w-3.5 h-3.5 text-burg-bright shrink-0" />
                <span>{formatEventDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted text-xs">
                <MapPin className="w-3.5 h-3.5 text-burg-bright shrink-0" />
                <span>{truncate(event.location, 40)}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Users className="w-3.5 h-3.5" />
                  <span>{getSeatsLabel(event.seatsLeft, event.capacity)}</span>
                </div>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', seatsBarColor)}
                    style={{ width: `${100 - seatsPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col"
    >
      <Link href={`/events/${event.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-burg/30 via-navy-mid to-navy flex items-center justify-center">
              <span className="text-5xl font-black text-white/10">{event.category[0]}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium backdrop-blur-sm', getCategoryColor(event.category))}>
              {event.category}
            </span>
          </div>
          {event.status === 'CANCELLED' && (
            <div className="absolute top-3 right-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm">
                Imefutwa
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div>
            <p className="text-muted text-xs mb-1">{event.organizer.name} · {event.organizer.institution}</p>
            <h3 className="font-semibold text-[#F0F4FF] line-clamp-2 leading-snug group-hover:text-burg-bright transition-colors">
              {event.title}
            </h3>
          </div>

          <div className="space-y-1.5 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-burg-bright shrink-0" />
              <span>{formatEventDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-burg-bright shrink-0" />
              <span>{truncate(event.location, 32)}</span>
            </div>
          </div>

          {/* Seats bar */}
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1 text-muted">
                <Users className="w-3 h-3" />
                <span>{getSeatsLabel(event.seatsLeft, event.capacity)}</span>
              </div>
              <span className="text-muted">{seatsPercent}% free</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${seatsPercent}%` }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.6 }}
                className={cn('h-full rounded-full', seatsBarColor)}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/5 rounded-full w-1/3" />
        <div className="h-4 bg-white/5 rounded-full w-full" />
        <div className="h-4 bg-white/5 rounded-full w-2/3" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-white/5 rounded-full w-1/2" />
          <div className="h-3 bg-white/5 rounded-full w-2/3" />
        </div>
        <div className="h-1 bg-white/5 rounded-full w-full mt-3" />
      </div>
    </div>
  )
}
