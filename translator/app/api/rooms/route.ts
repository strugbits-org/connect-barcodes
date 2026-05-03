import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const db = supabaseAdmin()
  const { data, error } = await db.from('rooms').insert({ status: 'waiting' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('rooms')
    .select('*, participants(*), transcripts(count)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
export const dynamic = 'force-dynamic'
