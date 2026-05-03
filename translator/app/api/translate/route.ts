import { NextRequest, NextResponse } from 'next/server'
import { translateText } from '@/lib/openai'
import { supabaseAdmin } from '@/lib/supabase'
import { LANGUAGES } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { text, fromLanguage, toLanguage, roomId, participantId } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const fromLabel = LANGUAGES.find(l => l.code === fromLanguage)?.label ?? fromLanguage
    const toLabel   = LANGUAGES.find(l => l.code === toLanguage)?.label ?? toLanguage

    const translatedText = await translateText(text, fromLabel, toLabel)

    if (roomId) {
      const db = supabaseAdmin()
      await db.from('transcripts').insert({
        room_id: roomId,
        participant_id: participantId ?? null,
        speaker_language: fromLanguage,
        original_text: text,
        translated_text: translatedText,
        target_language: toLanguage,
      })
    }

    return NextResponse.json({ translatedText })
  } catch (err) {
    console.error('Translation error:', err)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
