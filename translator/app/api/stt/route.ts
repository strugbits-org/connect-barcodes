import { NextResponse } from 'next/server'
import { createShortLivedToken } from '@/lib/deepgram'

export async function GET() {
  try {
    const token = await createShortLivedToken()
    return NextResponse.json({ token })
  } catch (err) {
    console.error('Deepgram token error:', err)
    return NextResponse.json({ error: 'Failed to get STT token' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
