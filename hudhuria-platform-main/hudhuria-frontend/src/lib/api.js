import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

const http = axios.create({ baseURL: BASE_URL })

// Attach auth token to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('hudhuria-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('hudhuria-refresh')
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh })
        localStorage.setItem('hudhuria-token', data.data.accessToken)
        localStorage.setItem('hudhuria-refresh', data.data.refreshToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return http(original)
      } catch {
        localStorage.removeItem('hudhuria-token')
        localStorage.removeItem('hudhuria-refresh')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data)  => http.post('/auth/register', data),
  login:    (data)  => http.post('/auth/login', data),
  logout:   ()      => http.post('/auth/logout'),
  refresh:  (token) => http.post('/auth/refresh', { refreshToken: token }),
  me:       ()      => http.get('/auth/me'),
}

export const eventsApi = {
  list:   (params) => http.get('/events', { params }),
  get:    (id)     => http.get(`/events/${id}`),
  create: (data)   => http.post('/events', data),
  update: (id, data) => http.put(`/events/${id}`, data),
  delete: (id)     => http.delete(`/events/${id}`),
}

export const bookingsApi = {
  create:    (eventId)    => http.post('/bookings', { eventId }),
  cancel:    (id)         => http.patch(`/bookings/${id}/cancel`),
  myBookings: (params)    => http.get('/bookings/my', { params }),
  qr:        (id)         => http.get(`/bookings/${id}/qr`),
}
