import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, QrCode, ArrowRight } from 'lucide-react'
import { bookingsApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { formatEventDate, truncate, cn } from '../lib/utils'

const STATUS_CONFIG = {
  CONFIRMED:  { label: 'Confirmed',  cls: 'text-green-400 bg-green-400/10 border-green-400/20' },
  CANCELLED:  { label: 'Cancelled',  cls: 'text-red-400   bg-red-400/10   border-red-400/20'   },
  WAITLISTED: { label: 'Waitlisted', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
}

export default function Dashboard() {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    bookingsApi.myBookings({ page: 1, pageSize: 10 })
      .then(res => setBookings(res.data?.data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 rounded-full border-2 border-burg-bright/30 border-t-burg-bright" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen px-4 pt-10 pb-20">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black flex-shrink-0" style={{ background: 'linear-gradient(135deg,#8B1A4A,#C4224D)' }}>
            {initials}
          </div>
          <div>
            <p className="text-burg-bright text-xs font-bold uppercase tracking-[0.2em] mb-1">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.institution}</p>
          </div>
        </div>

        {/* Bookings */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>My Bookings</h2>
          <Link to="/discover" className="flex items-center gap-1.5 text-sm text-burg-bright hover:underline no-underline font-medium">
            Find Events <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-4 rounded-full w-2/3 mb-3" style={{ background: 'var(--border)' }} />
                <div className="h-3 rounded-full w-1/2" style={{ background: 'var(--border)' }} />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-16 text-center rounded-3xl">
            <div className="text-5xl mb-4">🎟️</div>
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>No bookings yet</p>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Discover events and save your spot!</p>
            <Link to="/discover" className="btn-primary">Discover Events</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const ev = booking.event
              const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.CONFIRMED
              return (
                <div key={booking.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {ev?.imageUrl && (
                    <img src={ev.imageUrl} alt={ev.title} className="w-full sm:w-24 h-20 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <span className={cn('text-xs px-2.5 py-1 rounded-full border font-semibold', cfg.cls)}>{cfg.label}</span>
                    </div>
                    <h3 className="font-bold text-base line-clamp-1 mb-2" style={{ color: 'var(--text)' }}>{ev?.title ?? 'Event'}</h3>
                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {ev?.startDate && (
                        <span className="flex items-center gap-1"><Calendar size={11} className="text-burg-bright" />{formatEventDate(ev.startDate)}</span>
                      )}
                      {ev?.location && (
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-burg-bright" />{truncate(ev.location, 28)}</span>
                      )}
                    </div>
                  </div>
                  {booking.status === 'CONFIRMED' && (
                    <Link to={`/bookings/${booking.id}/qr`} className="btn-glass text-xs px-3 py-2 flex-shrink-0">
                      <QrCode size={13} /> View QR
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
