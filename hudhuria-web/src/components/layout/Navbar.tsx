'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <header className={cn('glass-nav sticky top-0 z-50 w-full')}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#F0F4FF] hover:text-white transition-colors"
        >
          <span className="text-burg-bright">H</span>udhuria
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/events"
            className="text-sm text-muted hover:text-[#F0F4FF] transition-colors"
          >
            Matukio
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-[#F0F4FF] transition-colors"
            >
              Dashibodi
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="text-sm text-muted hover:text-[#F0F4FF] transition-colors"
            >
              Msimamizi
            </Link>
          )}
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-burg text-xs font-semibold text-white ring-1 ring-burg-bright/30 transition-shadow hover:ring-burg-bright/60"
              title={user?.name ?? 'Profile'}
            >
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-muted hover:text-[#F0F4FF] transition-colors"
              >
                Ingia
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-burg px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-burg-mid focus:outline-none focus:ring-2 focus:ring-burg-bright/50"
              >
                Jisajili
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
