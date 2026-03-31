'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      const { user, accessToken, refreshToken } = res.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('hudhuria_access_token', accessToken)
      }
      setAuth(user, accessToken, refreshToken)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Imeshindwa kuingia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-burg/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-overlay opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-burg to-burg-bright bg-clip-text text-transparent mb-1">
              HUDHURIA
            </h1>
            <h2 className="text-xl font-bold text-[#F0F4FF]">Karibu Tena</h2>
            <p className="text-muted text-sm mt-1">Ingia katika akaunti yako</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Inaingia...' : 'Ingia'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Bado huna akaunti?{' '}
            <Link href="/register" className="text-burg-bright hover:underline font-medium">
              Jiunge Bure
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
