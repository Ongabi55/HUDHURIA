import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, Globe, ChevronDown, Check } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

/* ── Geometric H Logo ─────────────────────────────────────────────── */
function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8B1A4A" />
          <stop offset="100%" stopColor="#C4224D" />
        </linearGradient>
        <linearGradient id="hs" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="9" fill="url(#hg)" />
      <rect width="34" height="17" rx="9" fill="url(#hs)" />
      <line x1="9"  y1="8" x2="9"  y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="25" y1="8" x2="25" y2="26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="9"  y1="18" x2="25" y2="16.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ── Language Dropdown ────────────────────────────────────────────── */
function LangDropdown() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
          'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
        )}
      >
        <Globe size={14} />
        <span>{lang.toUpperCase()}</span>
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 glass-card rounded-xl py-1 z-50">
          {[
            { value: 'en', label: 'English' },
            { value: 'sw', label: 'Kiswahili' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { setLang(opt.value); setOpen(false) }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors',
                lang === opt.value
                  ? 'text-burg-bright'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              )}
            >
              <span>{opt.label}</span>
              {lang === opt.value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Theme Toggle ─────────────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}

/* ── Navbar ───────────────────────────────────────────────────────── */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const linkClass = ({ isActive }) => cn(
    'px-4 py-2 rounded-lg text-sm font-medium transition-all relative',
    isActive
      ? 'text-[var(--text)] bg-[var(--border)]'
      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
  )

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-105 group-active:scale-95">
            <LogoMark />
          </div>
          <span className="hidden sm:block text-base font-black tracking-tight text-[var(--text)]">
            Hudhuria
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          <NavLink to="/discover" className={linkClass}>{t('nav_discover')}</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClass}>{t('nav_dashboard')}</NavLink>
          )}
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-1">
          <LangDropdown />
          <ThemeToggle />
          <div className="w-px h-4 bg-[var(--border)] mx-1" />
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-burg to-burg-bright flex items-center justify-center text-white text-xs font-bold ring-2 ring-[rgba(196,34,77,0.2)] hover:ring-[rgba(196,34,77,0.5)] transition-all"
              title={user?.name}
            >
              {initials}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-all">
                {t('nav_sign_in')}
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-1.5">
                {t('nav_register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--glass-border)] px-4 py-4 space-y-1 animate-fade-in">
          <NavLink to="/discover" className={linkClass} onClick={() => setMobileOpen(false)}>
            {t('nav_discover')}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
              {t('nav_dashboard')}
            </NavLink>
          )}
          <div className="pt-3 border-t border-[var(--glass-border)] space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-[var(--text-subtle)]">Language</span>
              <LangDropdown />
            </div>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
                  {t('nav_profile')}
                </NavLink>
                <button
                  onClick={() => { logout(); navigate('/'); setMobileOpen(false) }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setMobileOpen(false)}>
                  {t('nav_sign_in')}
                </NavLink>
                <Link
                  to="/register"
                  className="block btn-primary text-center"
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
