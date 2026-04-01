import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { authApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(form)
      const { user, accessToken, refreshToken } = res.data.data
      if (refreshToken) localStorage.setItem('hudhuria-refresh', refreshToken)
      setAuth(user, accessToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10" style={{ background: 'var(--bg)' }}>
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full" style={{ background: 'rgba(139,26,74,0.07)', filter: 'blur(140px)' }} />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline group mb-6">
            <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8B1A4A" /><stop offset="100%" stopColor="#C4224D" />
                </linearGradient>
              </defs>
              <rect width="34" height="34" rx="9" fill="url(#lg)" />
              <line x1="9" y1="8" x2="9" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="25" y1="8" x2="25" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="9" y1="18" x2="25" y2="16.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-black" style={{ color: 'var(--text)' }}>Hudhuria</span>
          </Link>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to continue discovering events</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-sm text-red-400 border" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@university.ac.ke"
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Password</label>
                <Link to="/forgot-password" className="text-xs text-burg-bright hover:underline no-underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-base pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--text-subtle)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base mt-2">
              {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-burg-bright font-semibold hover:underline no-underline">Register free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
