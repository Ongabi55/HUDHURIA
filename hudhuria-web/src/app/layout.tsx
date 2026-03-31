import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Hudhuria — Gundua Matukio ya Campus',
  description:
    'Discover and book university events across Kenya. Karibu Hudhuria.',
  themeColor: '#060B1A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <body className="bg-navy text-[#F0F4FF] antialiased min-h-screen">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
