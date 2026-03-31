import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventDate(dateStr: string): string {
  return format(new Date(dateStr), 'EEE, MMM d · h:mm a')
}

export function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function timeFromNow(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function isEventUpcoming(startDate: string): boolean {
  return isAfter(new Date(startDate), new Date())
}

export function isEventPast(endDate: string): boolean {
  return isBefore(new Date(endDate), new Date())
}

export function getSeatsLabel(seatsLeft: number, capacity: number): string {
  const pct = (seatsLeft / capacity) * 100
  if (seatsLeft === 0) return 'Imejaa'
  if (pct <= 10) return `Viti ${seatsLeft} vilivyobaki!`
  return `${seatsLeft} / ${capacity} viti`
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Tech: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Culture: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    Sports: 'text-green-400 bg-green-400/10 border-green-400/20',
    Career: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Social: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    Health: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  }
  return colors[category] ?? 'text-muted bg-white/5 border-white/10'
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}
