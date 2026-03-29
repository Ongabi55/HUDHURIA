// @ts-ignore: Temporary fix for missing Next.js types in this environment
import { NextResponse } from 'next/server'

// Simple middleware skeleton — protects routes by role.
// TODO: Replace with auth() from NextAuth and real session checks.
export function middleware(req: any) {
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // Allow public routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next()
  }

  // TODO: read session & role from NextAuth and redirect accordingly
  // For now, allow navigation (keeps site accessible) — implement protection next
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)']
}
