import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers'
import { Navbar } from '@/components/layout/Navbar'
import { THEME_SCRIPT } from '@/contexts/theme'

export const metadata: Metadata = {
  title: 'Hudhuria — Discover Campus Events',
  description: 'Discover and book university events across Kenya. The #1 campus events platform.',
  themeColor: '#060B1A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] antialiased min-h-screen transition-colors duration-300">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
