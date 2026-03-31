'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, Clock, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { eventsApi, bookingsApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { cn, formatEventDate, getSeatsLabel, getCategoryColor, isEventPast } from '@/lib/utils'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const { isAuthenticated, user } = useAuthStore()
  const [booked, setBooked] = useState(false)
  const [error, setError]   = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.get(id),
    enabled: !!id,
  })

  const event = data?.data

  const { mutate: book, isPending } = useMutation({
    mutationFn: () => bookingsApi.create(id),
    onSuccess: () => {
      setBooked(true)
      qc.invalidateQueries({ queryKey: ['event', id] })
      qc.invalidateQueries({ queryKey: ['my-bookings'] })
    },
    onError: (e: Error) => setError(e.message),
  })

  if (isLoading) return <PageLoader />
  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted mb-4">Tukio halipatikani</p>
        <Link href="/discover"><Button variant="glass">← Rudi</Button></Link>
      </div>
    </div>
  )

  const isPast        = isEventPast(event.endDate)
  const isFull        = event.seatsLeft === 0
  const seatsPercent  = Math.round((event.seatsLeft / event.capacity) * 100)
  const seatsBarColor = seatsPercent > 50 ? 'bg-green-400' : seatsPercent > 10 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-burg/40 via-navy-mid to-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-4 flex items-center gap-2 glass px-3 py-2 rounded-full text-sm text-[#F0F4FF] hover:bg-white/10 transition-colors border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rudi</span>
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-4 right-4 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium backdrop-blur-sm', getCategoryColor(event.category))}>
              {event.category}
            </span>
            {event.tags.map(tag => (
              <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-muted backdrop-blur-sm">
                {tag.name}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Organizer */}
          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-burg/20 border border-burg/30 flex items-center justify-center text-burg-bright font-bold text-lg shrink-0">
              {event.organizer.name[0]}
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Mratibu</p>
              <p className="font-semibold text-[#F0F4FF]">{event.organizer.name}</p>
              <p className="text-xs text-muted">{event.organizer.institution}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-burg-bright shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted mb-0.5">Tarehe na Wakati</p>
                <p className="text-[#F0F4FF] font-medium">{formatEventDate(event.startDate)}</p>
                <p className="text-muted text-sm">Hadi {formatEventDate(event.endDate)}</p>
              </div>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-burg-bright shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted mb-0.5">Mahali</p>
                <p className="text-[#F0F4FF] font-medium">{event.location}</p>
              </div>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-burg-bright shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted mb-0.5">Uwezo</p>
                <p className="text-[#F0F4FF] font-medium">{getSeatsLabel(event.seatsLeft, event.capacity)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-[#F0F4FF] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-burg-bright" /> Maelezo
            </h2>
            <p className="text-muted leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-[#F0F4FF]">Hifadhi Kiti</h2>

            {/* Seats */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">{getSeatsLabel(event.seatsLeft, event.capacity)}</span>
                <span className="text-[#F0F4FF] font-medium">{seatsPercent}% baki</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${seatsPercent}%` }}
                  transition={{ duration: 0.8 }}
                  className={cn('h-full rounded-full', seatsBarColor)}
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {booked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Umefanikiwa!</p>
                    <p className="text-xs text-green-400/70">Kiti kimehifadhiwa</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            {isPast ? (
              <div className="flex items-center gap-2 text-muted text-sm bg-white/5 rounded-xl px-4 py-3">
                <Clock className="w-4 h-4" />
                <span>Tukio Limekwisha</span>
              </div>
            ) : event.status === 'CANCELLED' ? (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">
                Tukio Limefutwa
              </div>
            ) : !isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-muted text-sm text-center">Ingia ili uhifadhi kiti</p>
                <Link href="/login" className="block">
                  <Button className="w-full">Ingia ili Uhifadhi</Button>
                </Link>
              </div>
            ) : booked ? (
              <Link href="/dashboard">
                <Button variant="glass" className="w-full">Angalia Dashibodi →</Button>
              </Link>
            ) : isFull ? (
              <Button disabled className="w-full">Imejaa</Button>
            ) : user?.role === 'STUDENT' ? (
              <Button
                className="w-full"
                onClick={() => { setError(''); book() }}
                disabled={isPending}
              >
                {isPending ? 'Inasajili...' : 'Hifadhi Kiti'}
              </Button>
            ) : (
              <div className="text-sm text-muted text-center bg-white/5 rounded-xl px-4 py-3">
                Wanafunzi pekee wanaweza kuhifadhi viti
              </div>
            )}

            {!isFull && !isPast && event.status !== 'CANCELLED' && (
              <p className="text-xs text-muted text-center">
                Viti {event.seatsLeft} vilivyobaki kati ya {event.capacity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
