'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Flame, Calendar, CheckCircle, LogOut, Mail, Building } from 'lucide-react'
import { bookingsApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { cn, formatShortDate } from '@/lib/utils'
import type { Booking } from '@/types'

const statusConfig = {
  CONFIRMED: { label: 'Imethibitishwa', cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
  WAITLISTED: { label: 'Foleni',         cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  CANCELLED:  { label: 'Imefutwa',       cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  const { data: bookingsData } = useQuery({
    queryKey: ['my-bookings'],
    queryFn:  () => bookingsApi.getMyBookings(),
    enabled:  isAuthenticated,
  })

  if (!isAuthenticated || !user) return <PageLoader />

  const bookings: Booking[] = (bookingsData?.data as any)?.items ?? bookingsData?.data ?? []
  const attended = bookings.filter(b => b.checkedIn).length

  function handleLogout() {
    clearAuth()
    router.push('/')
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile card */}
        <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-burg via-burg-bright to-burg" />

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-burg to-burg-bright flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-glow-burg">
            {initials}
          </div>

          <h1 className="text-2xl font-black text-[#F0F4FF] mb-1">{user.name}</h1>

          <span className={cn(
            'inline-block text-xs px-3 py-1 rounded-full border font-medium mb-4',
            user.role === 'ADMIN' ? 'bg-burg/10 text-burg-bright border-burg/20' :
            user.role === 'ORGANIZER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'bg-green-500/10 text-green-400 border-green-500/20'
          )}>
            {user.role}
          </span>

          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-burg-bright" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building className="w-4 h-4 text-burg-bright" />
              <span>{user.institution}</span>
            </div>
          </div>

          {user.attendanceStreak > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-amber-500/20">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm">Mfululizo wa {user.attendanceStreak}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Jumla ya Nafasi', value: bookings.length, icon: Calendar, color: 'text-burg-bright' },
            { label: 'Ulizohudhuria',   value: attended,        icon: CheckCircle, color: 'text-green-400' },
            { label: 'Mfululizo',       value: user.attendanceStreak, icon: Flame, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center">
              <Icon className={cn('w-5 h-5 mx-auto mb-2', color)} />
              <p className="text-2xl font-black text-[#F0F4FF]">{value}</p>
              <p className="text-xs text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Booking history */}
        {bookings.length > 0 && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="font-bold text-[#F0F4FF]">Historia ya Matukio</h2>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {bookings.map((b) => {
                const st = statusConfig[b.status]
                return (
                  <div key={b.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F0F4FF] truncate">
                        {b.event?.title ?? 'Tukio'}
                      </p>
                      {b.event?.startDate && (
                        <p className="text-xs text-muted mt-0.5">{formatShortDate(b.event.startDate)}</p>
                      )}
                    </div>
                    <span className={cn('text-xs px-2.5 py-1 rounded-full border shrink-0 font-medium', st.cls)}>
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Account actions */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-bold text-[#F0F4FF] mb-4">Akaunti</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#F0F4FF]">Barua pepe</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Toka Akaunti
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
