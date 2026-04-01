import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight } from 'lucide-react'
import { authApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

const ROLES = [
  { value: 'STUDENT',   label: '🎓 Student',   desc: 'Discover & attend events' },
  { value: 'ORGANIZER', label: '📋 Organizer',  desc: 'Create & manage events' },
]

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-400']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i < score ? colors[score - 1] : 'bg-[var(--border)]')} />
        ))}
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Password strength: <span className={score >= 3 ? 'text-green-400' : 'text-amber-400'}>{labels[score - 1] ?? 'Too short'}</span>
      </p>
    </div>
  )
}

export default function Register() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', institution: '', role: 'STUDENT' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authApi.register(form)
      const { user, accessToken, refreshToken } = res.data.data
      if (refreshToken) localStorage.setItem('hudhuria-refresh', refreshToken)
      setAuth(user, accessToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="fixed inset-0 -z-10" style={{ background: 'var(--bg)' }}>
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full" style={{ background: 'rgba(139,26,74,0.06)', filter: 'blur(140px)' }} />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-6">
            <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8B1A4A" /><stop offset="100%" stopColor="#C4224D" />
                </linearGradient>
              </defs>
              <rect width="34" height="34" rx="9" fill="url(#rg)" />
              <line x1="9" y1="8" x2="9" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="25" y1="8" x2="25" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="9" y1="18" x2="25" y2="16.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-black" style={{ color: 'var(--text)' }}>Hudhuria</span>
          </Link>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Create your account</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Free forever · No credit card required</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-sm text-red-400 border" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: r.value }))}
                className={cn(
                  'p-3.5 rounded-xl border text-left transition-all',
                  form.role === r.value
                    ? 'border-burg-bright/50 bg-burg/10'
                    : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--border-strong)]'
                )}
              >
                <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{r.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                <input type="text" required value={form.name} onChange={set('name')} placeholder="Your full name" className="input-base pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@university.ac.ke" className="input-base pl-10" />
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>University / Institution</label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                <input type="text" required value={form.institution} onChange={set('institution')} placeholder="University of Nairobi" className="input-base pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-subtle)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min 8 characters"
                  className="input-base pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base mt-2">
              {loading
                ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                : <>Create Account <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-burg-bright font-semibold hover:underline no-underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
