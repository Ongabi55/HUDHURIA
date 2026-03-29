import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // TODO: implement fetching from Prisma
  return NextResponse.json({ success: true, data: [] })
}

export async function POST(request: Request) {
  // TODO: implement event creation with auth and validation
  return NextResponse.json({ success: true, data: null })
}
