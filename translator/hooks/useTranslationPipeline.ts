'use client'

import { useCallback, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TranslationPayload, SignalingMessage } from '@/types'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface TranslationEntry {
  id: string
  direction: 'sent' | 'received'
  originalText: string
  translatedText: string
  fromLanguage: string
  toLanguage: string
  timestamp: string
}

const audioQueue: string[] = []
let isPlaying = false

async function playNextInQueue() {
  if (isPlaying || audioQueue.length === 0) return
  isPlaying = true
  const url = audioQueue.shift()!
  const audio = new Audio(url)
  audio.onended = () => {
    URL.revokeObjectURL(url)
    isPlaying = false
    playNextInQueue()
  }
  audio.onerror = () => {
    isPlaying = false
    playNextInQueue()
  }
  await audio.play().catch(() => { isPlaying = false })
}

export function useTranslationPipeline(
  roomId: string,
  participantId: string,
  myLanguage: string,
  peerLanguage: string | null
) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [entries,    setEntries]    = useState<TranslationEntry[]>([])
  const [processing, setProcessing] = useState(false)

  const appendEntry = useCallback((entry: TranslationEntry) => {
    setEntries(prev => [...prev.slice(-99), entry])
  }, [])

  // Subscribe to translation channel to receive peer translations
  const subscribe = useCallback(() => {
    const channel = supabase.channel(`translations:${roomId}`)
    channelRef.current = channel

    channel.on('broadcast', { event: 'translation' }, ({ payload }: { payload: TranslationPayload }) => {
      if (payload.participantId === participantId) return

      if (payload.audioBase64) {
        const bytes  = Uint8Array.from(atob(payload.audioBase64), c => c.charCodeAt(0))
        const blob   = new Blob([bytes], { type: 'audio/mpeg' })
        const url    = URL.createObjectURL(blob)
        audioQueue.push(url)
        playNextInQueue()
      }

      appendEntry({
        id: crypto.randomUUID(),
        direction: 'received',
        originalText:   payload.originalText,
        translatedText: payload.translatedText,
        fromLanguage:   payload.fromLanguage,
        toLanguage:     payload.toLanguage,
        timestamp:      payload.timestamp,
      })
    })

    channel.subscribe()
    return () => { channel.unsubscribe() }
  }, [roomId, participantId, appendEntry])

  // Called when Deepgram returns a final transcript
  const handleTranscript = useCallback(async (text: string) => {
    if (!peerLanguage || !text.trim()) return
    setProcessing(true)

    try {
      // 1. Translate
      const tRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          fromLanguage: myLanguage,
          toLanguage:   peerLanguage,
          roomId,
          participantId,
        }),
      })
      const { translatedText } = await tRes.json()
      if (!translatedText) return

      // 2. TTS
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: translatedText, language: peerLanguage }),
      })
      const audioBuffer = await ttsRes.arrayBuffer()
      const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

      // 3. Broadcast to peer
      const payload: TranslationPayload = {
        originalText:   text,
        translatedText,
        fromLanguage:   myLanguage,
        toLanguage:     peerLanguage,
        audioBase64,
        participantId,
        timestamp:      new Date().toISOString(),
      }

      channelRef.current?.send({ type: 'broadcast', event: 'translation', payload })

      appendEntry({
        id: crypto.randomUUID(),
        direction: 'sent',
        originalText:   text,
        translatedText,
        fromLanguage:   myLanguage,
        toLanguage:     peerLanguage,
        timestamp:      payload.timestamp,
      })
    } catch (err) {
      console.error('Translation pipeline error:', err)
    } finally {
      setProcessing(false)
    }
  }, [peerLanguage, myLanguage, roomId, participantId, appendEntry])

  return { subscribe, handleTranscript, entries, processing }
}
