export type Role = 'STUDENT' | 'ORGANIZER' | 'ADMIN'

export interface User {
  id: string
  name?: string | null
  email: string
  role: Role
  institution?: string | null
}

export interface Event {
  id: string
  title: string
  description?: string | null
  category?: string | null
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  capacity?: number | null
}

export interface Booking {
  id: string
  eventId: string
  userId: string
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED'
}
