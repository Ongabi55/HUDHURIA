import { format, formatDistanceToNow } from 'date-fns'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatEventDate(dateStr) {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'EEE, MMM d · h:mm a')
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function timeFromNow(dateStr) {
  if (!dateStr) return ''
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

export function getCategoryColor(category) {
  const map = {
    Tech:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Culture: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    Sports:  'text-green-400 bg-green-400/10 border-green-400/20',
    Career:  'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Social:  'text-pink-400 bg-pink-400/10 border-pink-400/20',
    Health:  'text-teal-400 bg-teal-400/10 border-teal-400/20',
  }
  return map[category] ?? 'text-[var(--text-muted)] bg-white/5 border-white/10'
}

export function getCapacityMeta(seatsLeft, capacity) {
  const free = capacity > 0 ? Math.round((seatsLeft / capacity) * 100) : 0
  return {
    pct: free,
    barClass: free <= 10 ? 'bar-danger' : free <= 30 ? 'bar-warn' : 'bar-good',
    label:
      seatsLeft === 0
        ? 'Sold Out'
        : free <= 10
        ? `Only ${seatsLeft} left!`
        : `${seatsLeft} / ${capacity} seats`,
    labelColor:
      seatsLeft === 0  ? 'text-red-400'
      : free <= 10     ? 'text-red-400'
      : free <= 30     ? 'text-amber-400'
      : 'text-burg-bright',
  }
}
