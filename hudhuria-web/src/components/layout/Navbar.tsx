'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Sun, Moon, Globe, ChevronDown, Check } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useTheme } from '@/contexts/theme'
import { useI18n, type Lang } from '@/contexts/i18n'
import { cn } from '@/lib/utils'

// ── Geometric H Logo SVG ──────────────────────────────────────────────────
function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hLogo" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8B1A4A" />
          <stop offset="100%" stopColor="#C4224D" />
        </linearGradient>
        <linearGradient id="hShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Rounded square bg */}
      <rect width="34" height="34" rx="9" fill="url(#hLogo)" />
      {/* Shine overlay */}
      <rect width="34" height="17" rx="9" fill="url(#hShine)" />
      {/* H letterform — two verticals + angled crossbar */}
      <line x1="9"  y1="8" x2="9"  y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="25" y1="8" x2="25" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Slightly angled crossbar for dynamism */}
      <line x1="9" y1="18" x2="25" y2="16.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ── Language Dropdown ─────────────────────────────────────────────────────
function LangDropdown() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const options: { value: Lang; label: string; native: string }[] = [
    { value: 'en', label: 'English',  native: 'EN' },
    { value: 'sw', label: 'Kiswahili', native: 'SW' },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
          'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]',
          open && 'bg-[var(--border)] text-[var(--text)]'
        )}
        aria-label="Switch language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{lang.toUpperCase()}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 glass-card rounded-xl py-1 z-50 shadow-lg">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setLang(opt.value); setOpen(false) }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
                lang === opt.value
                  ? 'text-burg-bright bg-burg/5'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              )}
            >
              <span>{opt.label}</span>
              {lang === opt.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Theme Toggle ──────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
        'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burg-bright/50'
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark'
        ? <Sun  className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────
export function Navbar() {
  const { isAuthenticated, user } = useAuthStore()
  const { t } = useI18n()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const navLinks = [
    { href: '/discover', label: t('nav_discover') },
    ...(isAuthenticated ? [{ href: '/dashboard', label: t('nav_dashboard') }] : []),
    ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: t('nav_admin') }] : []),
  ]

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Hudhuria home">
          <div className="transition-transform group-hover:scale-105 group-active:scale-95">
            <LogoMark />
          </div>
          <span className="text-base font-black tracking-tight text-[var(--text)] group-hover:text-white transition-colors hidden sm:block">
            Hudhuria
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'text-[var(--text)] bg-[var(--border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
                )}
              >
                {label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-burg-bright" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-1">
          <LangDropdown />
          <ThemeToggle />
          <div className="w-px h-4 bg-[var(--border)] mx-1" />
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-burg to-burg-bright flex items-center justify-center text-white text-xs font-bold ring-2 ring-burg-bright/20 hover:ring-burg-bright/50 transition-all shadow-glow-sm"
              title={user?.name ?? 'Profile'}
            >
              {initials}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
              >
                {t('nav_sign_in')}
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-burg to-burg-bright hover:brightness-110 active:brightness-95 transition-all shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burg-bright/50"
              >
                {t('nav_register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--glass-border)] px-4 py-4 space-y-1 animate-fade-in">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'block px-4 py-2.5 rounded-lg text-sm transition-all',
                pathname === href
                  ? 'text-[var(--text)] bg-[var(--border)] font-medium'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[var(--glass-border)] space-y-2">
            <div className="flex items-center justify-between px-4 py-1">
              <span className="text-xs text-[var(--text-subtle)]">Language</span>
              <LangDropdown />
            </div>
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="block px-4 py-2.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {t('nav_profile')}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-burg to-burg-bright text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav_register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
