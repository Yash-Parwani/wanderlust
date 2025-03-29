import { NextResponse } from 'next/server'

export async function GET() {
  // Only return the token if the request is from our own domain
  const token = process.env.MAPBOX_TOKEN
  
  if (!token) {
    return new NextResponse('Mapbox token not configured', { status: 500 })
  }

  return NextResponse.json({ token })
} 