import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { prisma } from './lib/prisma'
import { AppError } from './utils/AppError'

import authRoutes from './routes/auth.routes'
import eventRoutes from './routes/event.routes'
import bookingRoutes from './routes/booking.routes'
import adminRoutes from './routes/admin.routes'

const app = express()
app.use(cors())
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)

// ── Global error handler ─────────────────────────────────────────────────
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message })
  }
  console.error(err)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

// ── Start ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

async function start() {
  try {
    await prisma.$connect()
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
