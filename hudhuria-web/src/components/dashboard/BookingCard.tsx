'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, QrCode } from 'lucide-react'
import { cn, formatEventDate, truncate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Booking } from '@/types'

interface BookingCardProps {
  booking: Booking
  index?: number
}

const statusConfig = {
  CONFIRMED: { label: 'Imethibitishwa', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  WAITLISTED: { label: 'Foleni', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  CANCELLED:  { label: 'Imefutwa',     className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export function BookingCard({ booking, index = 0 }: BookingCardProps) {
  const event = booking.event
  const status = statusConfig[booking.status]

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/5">
        {event?.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title ?? ''} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-burg/30 to-navy-mid flex items-center justify-center">
            <span className="text-2xl font-black text-white/20">
              {event?.title?.[0] ?? 'H'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#F0F4FF] text-sm leading-snug truncate">
            {event?.title ?? 'Tukio'}
          </h3>
          <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium shrink-0', status.className)}>
            {status.label}
          </span>
        </div>
        {event?.startDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
            <Calendar className="w-3 h-3 text-burg-bright" />
            <span>{formatEventDate(event.startDate)}</span>
          </div>
        )}
        {event?.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="w-3 h-3 text-burg-bright" />
            <span>{truncate(event.location, 35)}</span>
          </div>
        )}
      </div>

      {/* Action */}
      {booking.status === 'CONFIRMED' && (
        <Link href={`/bookings/${booking.id}/qr`} className="shrink-0">
          <Button variant="glass" size="sm" className="gap-1.5">
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR</span>
          </Button>
        </Link>
      )}
    </motion.div>
  )
}
