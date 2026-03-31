'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Herufi 8+', ok: password.length >= 8 },
    { label: 'Herufi kubwa', ok: /[A-Z]/.test(password) },
    { label: 'Nambari', ok: /[0-9]/.test(password) },
  ]
  return (
    <div className="flex gap-2 mt-2">
      {checks.map(({ label, ok }) => (
        <div key={label} className="flex items-center gap-1">
          <div className={cn('w-1.5 h-1.5 rounded-full', ok ? 'bg-green-400' : 'bg-white/20')} />
          <span className={cn('text-xs', ok ? 'text-green-400' : 'text-muted')}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [institution, setInstitution] = useState('')
  const [role,        setRole]        = useState<Role>('STUDENT')
  const [showPw,      setShowPw]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  function validate(): string {
    if (!name.trim())        return 'Jina linahitajika'
    if (!email.includes('@')) return 'Barua pepe si sahihi'
    if (password.length < 8) return 'Nywila lazima iwe herufi 8+'
    if (!/[A-Z]/.test(password)) return 'Nywila lazima iwe na herufi kubwa moja'
    if (!/[0-9]/.test(password)) return 'Nywila lazima iwe na nambari moja'
    if (!institution.trim()) return 'Chuo kinahitajika'
    return ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')
    setLoading(true)
    try {
      const res = await authApi.register({ name, email, password, institution, role })
      const { user, accessToken, refreshToken } = res.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('hudhuria_access_token', accessToken)
      }
      setAuth(user, accessToken, refreshToken)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Imeshindwa kusajili')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-burg/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-overlay opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-burg to-burg-bright bg-clip-text text-transparent mb-1">
              HUDHURIA
            </h1>
            <h2 className="text-xl font-bold text-[#F0F4FF]">Jiunge Sasa</h2>
            <p className="text-muted text-sm mt-1">Fungua akaunti yako bure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="text-xs text-muted uppercase tracking-wider block mb-2">Mimi ni</label>
              <div className="grid grid-cols-2 gap-3">
                {(['STUDENT', 'ORGANIZER'] as Role[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      'h-11 rounded-xl text-sm font-medium border transition-all',
                      role === r
                        ? 'bg-gradient-burg text-white border-burg-bright/50'
                        : 'bg-white/5 text-muted border-white/10 hover:bg-white/10'
                    )}
                  >
                    {r === 'STUDENT' ? '🎓 Mwanafunzi' : '🎪 Mratibu'}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Jina Kamili</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Amina Ochieng"
                required
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-[#F0F4FF] placeholder:text-muted focus:outline-none focus:border-burg-bright/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Barua Pepe</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jina@chuo.ac.ke"
                required
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-[#F0F4FF] placeholder:text-muted focus:outline-none focus:border-burg-bright/50 transition-colors"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Chuo</label>
              <input
                type="text"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="University of Nairobi"
                required
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-[#F0F4FF] placeholder:text-muted focus:outline-none focus:border-burg-bright/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Nywila</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 pr-11 text-sm text-[#F0F4FF] placeholder:text-muted focus:outline-none focus:border-burg-bright/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#F0F4FF] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && <PasswordStrength password={password} />}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Inasajili...' : 'Jiunge Sasa'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Una akaunti tayari?{' '}
            <Link href="/login" className="text-burg-bright hover:underline font-medium">
              Ingia
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
