import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { prisma } from './lib/prisma'

const app = express()
app.use(cors())
app.use(express.json())

// Basic health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok' })
})

// Simple events endpoint (public)
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        startDate: true,
        endDate: true,
        location: true,
        capacity: true,
        status: true,
      },
      orderBy: { startDate: 'asc' },
      take: 50,
    })
    res.json({ success: true, data: events })
  } catch (err) {
    console.error('Error fetching events', err)
    res.status(500).json({ success: false, message: 'Failed to fetch events' })
  }
})

// Fallback error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, message: err?.message ?? 'Internal server error' })
})

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
