'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/discover', label: 'Gundua' },
]

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burg to-burg-bright flex items-center justify-center shadow-glow-burg group-hover:shadow-lg transition-shadow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-[#F0F4FF] group-hover:text-white transition-colors">
            Hudh<span className="text-burg-bright">uria</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                pathname === href
                  ? 'text-[#F0F4FF] bg-white/8'
                  : 'text-muted hover:text-[#F0F4FF] hover:bg-white/5'
              )}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                pathname === '/dashboard'
                  ? 'text-[#F0F4FF] bg-white/8'
                  : 'text-muted hover:text-[#F0F4FF] hover:bg-white/5'
              )}
            >
              Dashibodi
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-burg to-burg-bright flex items-center justify-center text-white text-xs font-bold ring-2 ring-burg-bright/30 hover:ring-burg-bright/60 transition-all shadow-glow-burg"
              title={user?.name ?? 'Wasifu'}
            >
              {initials}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-[#F0F4FF] transition-colors px-3 py-2"
              >
                Ingia
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-gradient-to-r from-burg to-burg-bright px-4 py-2 rounded-lg hover:brightness-110 transition-all shadow-glow-sm"
              >
                Jisajili Bure
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted hover:text-[#F0F4FF] transition-colors"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-4 space-y-1">
          <Link href="/discover" className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-[#F0F4FF] hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Gundua Matukio</Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-[#F0F4FF] hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Dashibodi</Link>
          )}
          <div className="pt-2 border-t border-white/[0.06] space-y-2">
            {isAuthenticated ? (
              <Link href="/profile" className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-[#F0F4FF] hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Wasifu Wangu</Link>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2.5 rounded-lg text-sm text-muted hover:text-[#F0F4FF] hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Ingia</Link>
                <Link href="/register" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-burg to-burg-bright text-center" onClick={() => setMobileOpen(false)}>Jisajili Bure</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
