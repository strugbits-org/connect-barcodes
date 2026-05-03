'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface DeepgramResult {
  transcript: string
  isFinal: boolean
  confidence: number
}

export function useDeepgram(
  language: string,
  onFinalTranscript: (text: string) => void
) {
  const wsRef        = useRef<WebSocket | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const contextRef   = useRef<AudioContext | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [interim,     setInterim]     = useState('')

  const stop = useCallback(() => {
    processorRef.current?.disconnect()
    contextRef.current?.close()
    wsRef.current?.close()
    setIsListening(false)
    setInterim('')
  }, [])

  const start = useCallback(async (stream: MediaStream) => {
    // Get short-lived Deepgram token
    const res = await fetch('/api/stt')
    const { token, error } = await res.json()
    if (error) throw new Error(error)

    const dgLang = language === 'zh' ? 'zh-CN'
                 : language === 'pt' ? 'pt-BR'
                 : language

    const url = new URL('wss://api.deepgram.com/v1/listen')
    url.searchParams.set('model', 'nova-2')
    url.searchParams.set('language', dgLang)
    url.searchParams.set('encoding', 'linear16')
    url.searchParams.set('sample_rate', '16000')
    url.searchParams.set('interim_results', 'true')
    url.searchParams.set('utterance_end_ms', '1000')
    url.searchParams.set('vad_events', 'true')
    url.searchParams.set('smart_format', 'true')
    url.searchParams.set('punctuate', 'true')

    const ws = new WebSocket(url.toString(), ['token', token])
    wsRef.current = ws

    ws.onopen = () => setIsListening(true)

    ws.onmessage = e => {
      const data = JSON.parse(e.data)
      if (data.type !== 'Results') return
      const alt = data.channel?.alternatives?.[0]
      if (!alt) return
      const text: string = alt.transcript?.trim()
      if (!text) return

      if (data.is_final) {
        setInterim('')
        onFinalTranscript(text)
      } else {
        setInterim(text)
      }
    }

    ws.onerror  = () => setIsListening(false)
    ws.onclose  = () => setIsListening(false)

    // Pipe mic audio → Deepgram
    const ctx = new AudioContext({ sampleRate: 16000 })
    contextRef.current = ctx
    const source    = ctx.createMediaStreamSource(stream)
    const processor = ctx.createScriptProcessor(4096, 1, 1)
    processorRef.current = processor

    processor.onaudioprocess = e => {
      if (ws.readyState !== WebSocket.OPEN) return
      const input  = e.inputBuffer.getChannelData(0)
      const int16  = new Int16Array(input.length)
      for (let i = 0; i < input.length; i++) {
        int16[i] = Math.max(-32768, Math.min(32767, input[i] * 32768))
      }
      ws.send(int16.buffer)
    }

    source.connect(processor)
    processor.connect(ctx.destination)
  }, [language, onFinalTranscript])

  useEffect(() => () => stop(), [stop])

  return { start, stop, isListening, interim }
}
