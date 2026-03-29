import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // TODO: only ADMIN — return users list
  return NextResponse.json({ success: true, data: [] })
}

export async function PATCH(request: Request, { params }: { params: { id?: string } }) {
  // TODO: change role
  return NextResponse.json({ success: true })
}
