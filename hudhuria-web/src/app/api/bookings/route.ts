import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // TODO: implement booking creation using prisma.$transaction and validation
  return NextResponse.json({ success: true, data: null })
}

export async function GET(request: Request) {
  // TODO: return student's bookings (auth required)
  return NextResponse.json({ success: true, data: [] })
}
