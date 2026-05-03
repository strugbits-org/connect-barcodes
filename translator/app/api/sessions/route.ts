import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = supabaseAdmin()

  const [roomsRes, transcriptsRes] = await Promise.all([
    db
      .from('rooms')
      .select('*, participants(*)')
      .order('created_at', { ascending: false })
      .limit(50),
    db
      .from('transcripts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  if (roomsRes.error) return NextResponse.json({ error: roomsRes.error.message }, { status: 500 })

  return NextResponse.json({
    rooms: roomsRes.data ?? [],
    transcripts: transcriptsRes.data ?? [],
  })
}
export const dynamic = 'force-dynamic'
