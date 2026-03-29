import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
