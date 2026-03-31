'use client'

import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Event,
  Booking,
  PlatformStats,
  LoginResponse,
  EventsQuery,
  Role,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('hudhuria_access_token')
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const body = (await response.json()) as { message?: string; error?: string }
      message = body.message ?? body.error ?? message
    } catch {
      // ignore JSON parse error, use default message
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

interface RegisterData {
  name: string
  email: string
  password: string
  institution: string
  role?: Role
}

interface LoginData {
  email: string
  password: string
}

export const authApi = {
  register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  logout(refreshToken: string): Promise<ApiResponse<null>> {
    return apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },

  refresh(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    return apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },
}

// ─── Events ───────────────────────────────────────────────────────────────────

function buildQuery(params: Record<string, unknown>): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, String(v)))
    } else {
      qs.set(key, String(value))
    }
  }
  const str = qs.toString()
  return str ? `?${str}` : ''
}

type CreateEventData = Omit<
  Event,
  | 'id'
  | 'organizerId'
  | 'organizer'
  | 'tags'
  | 'bookingCount'
  | 'seatsLeft'
  | 'createdAt'
  | 'updatedAt'
> & { tags?: string[] }

type UpdateEventData = Partial<CreateEventData>

export const eventsApi = {
  list(query: EventsQuery = {}): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const qs = buildQuery(query as Record<string, unknown>)
    return apiFetch(`/events${qs}`)
  },

  get(id: string): Promise<ApiResponse<Event>> {
    return apiFetch(`/events/${id}`)
  },

  create(data: CreateEventData): Promise<ApiResponse<Event>> {
    return apiFetch('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update(id: string, data: UpdateEventData): Promise<ApiResponse<Event>> {
    return apiFetch(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete(id: string): Promise<ApiResponse<null>> {
    return apiFetch(`/events/${id}`, {
      method: 'DELETE',
    })
  },

  getOrganizerEvents(): Promise<ApiResponse<PaginatedResponse<Event>>> {
    return apiFetch('/events/my')
  },
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  create(eventId: string): Promise<ApiResponse<Booking>> {
    return apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    })
  },

  getMyBookings(): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    return apiFetch('/bookings/me')
  },

  cancel(id: string): Promise<ApiResponse<Booking>> {
    return apiFetch(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    })
  },

  getQrCode(id: string): Promise<ApiResponse<{ qrCodeDataUrl: string }>> {
    return apiFetch(`/bookings/${id}/qr`)
  },

  getEventBookings(eventId: string): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    return apiFetch(`/events/${eventId}/bookings`)
  },

  checkIn(eventId: string, qrToken: string): Promise<ApiResponse<Booking>> {
    return apiFetch(`/events/${eventId}/checkin`, {
      method: 'POST',
      body: JSON.stringify({ qrToken }),
    })
  },
}

// ─── Admin ────────────────────────────────────────────────────────────────────

interface AdminUsersParams {
  page?: number
  pageSize?: number
  search?: string
  role?: Role
}

interface AdminEventsParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}

export const adminApi = {
  getStats(): Promise<ApiResponse<PlatformStats>> {
    return apiFetch('/admin/stats')
  },

  getUsers(params: AdminUsersParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const qs = buildQuery(params as Record<string, unknown>)
    return apiFetch(`/admin/users${qs}`)
  },

  updateUserRole(id: string, role: Role): Promise<ApiResponse<User>> {
    return apiFetch(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  },

  getEvents(params: AdminEventsParams = {}): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const qs = buildQuery(params as Record<string, unknown>)
    return apiFetch(`/admin/events${qs}`)
  },
}
