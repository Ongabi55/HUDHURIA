'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Flame, Calendar, CheckCircle, User } from 'lucide-react'
import Link from 'next/link'
import { bookingsApi, eventsApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { StatsWidget } from '@/components/dashboard/StatsWidget'
import { BookingCard } from '@/components/dashboard/BookingCard'
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { isEventUpcoming, isEventPast } from '@/lib/utils'
import type { Booking } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: isAuthenticated,
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', { status: 'PUBLISHED', pageSize: 3 }],
    queryFn: () => eventsApi.list({ status: 'PUBLISHED', pageSize: 3 }),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) return <PageLoader />

  const allBookings: Booking[] = (bookingsData?.data as any)?.items ?? bookingsData?.data ?? []
  const upcoming  = allBookings.filter(b => b.status === 'CONFIRMED' && b.event?.startDate && isEventUpcoming(b.event.startDate))
  const past      = allBookings.filter(b => b.event?.endDate && isEventPast(b.event.endDate))
  const checkedIn = allBookings.filter(b => b.checkedIn).length
  const recommended = eventsData?.data?.items ?? []

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Welcome */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-muted text-sm mb-1">Karibu tena,</p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4FF]">
              {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-muted mt-1">{user?.institution}</p>
          </div>
          {(user?.attendanceStreak ?? 0) > 0 && (
            <div className="glass-card rounded-2xl px-5 py-3 flex items-center gap-3">
              <Flame className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-xl font-black text-[#F0F4FF]">{user?.attendanceStreak}</p>
                <p className="text-xs text-muted">Mfululizo</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatsWidget label="Yanayokuja"      value={upcoming.length}  icon={<Calendar className="w-5 h-5" />}      color="burg"  index={0} />
          <StatsWidget label="Uliyohudhuria"   value={checkedIn}        icon={<CheckCircle className="w-5 h-5" />}   color="green" index={1} />
          <StatsWidget label="Mfululizo"       value={user?.attendanceStreak ?? 0} icon={<Flame className="w-5 h-5" />} color="amber" index={2} />
          <StatsWidget label="Hali ya Akaunti" value={user?.role ?? ''} icon={<User className="w-5 h-5" />}          color="blue"  index={3} />
        </div>

        {/* Upcoming bookings */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#F0F4FF]">Matukio Yanayokuja</h2>
            <Link href="/discover" className="text-sm text-muted hover:text-burg-bright transition-colors">
              Gundua zaidi →
            </Link>
          </div>
          {bookingsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="glass-card rounded-2xl h-24 animate-pulse" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-10 h-10" />}
              title="Hakuna matukio yanayokuja"
              description="Gundua na uhifadhi matukio yanayokuvutia."
              action={<Link href="/discover"><Button>Gundua Matukio</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)}
            </div>
          )}
        </section>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#F0F4FF] mb-5">Inayopendekezwa Kwako</h2>
            {eventsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommended.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
              </div>
            )}
          </section>
        )}

        {/* History */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#F0F4FF] mb-5">Historia ya Matukio</h2>
            <div className="space-y-3">
              {past.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
