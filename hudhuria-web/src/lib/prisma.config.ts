import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config({ path: process.env.PRISMA_DOTENV_PATH || '.env.local' })

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

export const prisma = new PrismaClient({ datasources: { db: { url } } })
