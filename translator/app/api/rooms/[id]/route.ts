import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('rooms')
    .select('*, participants(*)')
    .eq('id', params.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body: { status?: string; ended_at?: string | null } = await req.json()
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('rooms')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
export const dynamic = 'force-dynamic'
