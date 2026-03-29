import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // TODO: fetch event by id from prisma
  return NextResponse.json({ success: true, data: null })
}
