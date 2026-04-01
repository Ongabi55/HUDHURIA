import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [token, setToken]             = useState(() => localStorage.getItem('hudhuria-token'))
  const [isAuthenticated, setIsAuth]  = useState(false)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('hudhuria-user')
    const storedToken = localStorage.getItem('hudhuria-token')
    if (stored && storedToken) {
      try {
        setUser(JSON.parse(stored))
        setToken(storedToken)
        setIsAuth(true)
      } catch {
        localStorage.removeItem('hudhuria-user')
        localStorage.removeItem('hudhuria-token')
      }
    }
    setLoading(false)
  }, [])

  function setAuth(userData, accessToken) {
    setUser(userData)
    setToken(accessToken)
    setIsAuth(true)
    localStorage.setItem('hudhuria-user', JSON.stringify(userData))
    localStorage.setItem('hudhuria-token', accessToken)
  }

  async function logout() {
    try { await authApi.logout() } catch { /* ignore */ }
    setUser(null)
    setToken(null)
    setIsAuth(false)
    localStorage.removeItem('hudhuria-user')
    localStorage.removeItem('hudhuria-token')
    localStorage.removeItem('hudhuria-refresh')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
