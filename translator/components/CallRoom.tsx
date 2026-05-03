'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useWebRTC }             from '@/hooks/useWebRTC'
import { useDeepgram }           from '@/hooks/useDeepgram'
import { useTranslationPipeline } from '@/hooks/useTranslationPipeline'
import { TranslationFeed }       from './TranslationFeed'
import { CallControls }          from './CallControls'
import { LanguageSelector }      from './LanguageSelector'
import { supabase }              from '@/lib/supabase'
import { LANGUAGES }             from '@/types'

interface Props {
  roomId: string
}

export function CallRoom({ roomId }: Props) {
  const [participantId] = useState(() => crypto.randomUUID())
  const [myLanguage,   setMyLanguage]   = useState('en')
  const [peerLanguage, setPeerLanguage] = useState<string | null>(null)
  const [isMuted,      setIsMuted]      = useState(false)
  const [micStream,    setMicStream]    = useState<MediaStream | null>(null)
  const [phase,        setPhase]        = useState<'lobby' | 'call'>('lobby')
  const [shareUrl,     setShareUrl]     = useState('')
  const [copied,       setCopied]       = useState(false)
  const deepgramStarted = useRef(false)

  const { connected, peerCount, sendSignal } = useWebRTC(roomId, participantId)

  const { subscribe, handleTranscript, entries, processing } = useTranslationPipeline(
    roomId, participantId, myLanguage, peerLanguage
  )

  const onFinalTranscript = useCallback((text: string) => {
    handleTranscript(text)
  }, [handleTranscript])

  const { start: startDg, stop: stopDg, isListening, interim } = useDeepgram(myLanguage, onFinalTranscript)

  // Build share URL
  useEffect(() => {
    setShareUrl(`${window.location.origin}/room/${roomId}`)
  }, [roomId])

  // Listen for peer language via Supabase presence broadcast
  useEffect(() => {
    const channel = supabase.channel(`lang:${roomId}`)
    channel.on('broadcast', { event: 'language' }, ({ payload }: { payload: { participantId: string; language: string } }) => {
      if (payload.participantId !== participantId) {
        setPeerLanguage(payload.language)
      }
    }).subscribe()
    return () => { channel.unsubscribe() }
  }, [roomId, participantId])

  // Broadcast my language whenever it changes
  useEffect(() => {
    if (phase !== 'call') return
    supabase.channel(`lang:${roomId}`).send({
      type: 'broadcast', event: 'language',
      payload: { participantId, language: myLanguage },
    })
  }, [myLanguage, phase, roomId, participantId])

  const handleJoin = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      setMicStream(stream)

      // Register participant in DB
      await supabase.from('participants').insert({ room_id: roomId, language: myLanguage })
      // Mark room active
      await supabase.from('rooms').update({ status: 'active' }).eq('id', roomId)

      setPhase('call')
      subscribe()

      // Broadcast my language
      setTimeout(() => {
        supabase.channel(`lang:${roomId}`).send({
          type: 'broadcast', event: 'language',
          payload: { participantId, language: myLanguage },
        })
      }, 1000)
    } catch (err) {
      alert('Microphone access is required. Please allow it and try again.')
      console.error(err)
    }
  }, [roomId, myLanguage, participantId, subscribe])

  // Start Deepgram once we have the mic stream and are in a call
  useEffect(() => {
    if (phase === 'call' && micStream && !deepgramStarted.current) {
      deepgramStarted.current = true
      startDg(micStream).catch(console.error)
    }
  }, [phase, micStream, startDg])

  const toggleMic = useCallback(() => {
    if (!micStream) return
    micStream.getAudioTracks().forEach(t => { t.enabled = isMuted })
    setIsMuted(prev => !prev)
  }, [micStream, isMuted])

  const endCall = useCallback(async () => {
    stopDg()
    micStream?.getTracks().forEach(t => t.stop())
    await supabase.from('rooms').update({ status: 'ended', ended_at: new Date().toISOString() }).eq('id', roomId)
    window.location.href = '/'
  }, [stopDg, micStream, roomId])

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [shareUrl])

  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Translation Call</h1>
            <p className="text-gray-400 text-sm mt-1">Room ID: <code className="text-brand-400">{roomId.slice(0, 8)}…</code></p>
          </div>

          <LanguageSelector value={myLanguage} onChange={setMyLanguage} label="Your language" />

          <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-400">Share this link with the other person:</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono truncate"
              />
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium transition-all"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={handleJoin}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold
                       transition-all shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2"
          >
            <span>🎙️</span> Join Call
          </button>

          <p className="text-xs text-gray-600 text-center">
            Microphone access will be requested when you join.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
          <span className="text-sm font-medium text-gray-300">
            {peerCount === 2 ? 'Call active' : 'Waiting for peer…'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector value={myLanguage} onChange={setMyLanguage} disabled={false} />
          {peerLanguage && (
            <span className="text-xs text-gray-500">
              Peer: {LANGUAGES.find(l => l.code === peerLanguage)?.label ?? peerLanguage}
            </span>
          )}
        </div>
      </div>

      {/* Translation feed */}
      <div className="flex-1 flex flex-col px-4 py-2 overflow-hidden max-w-2xl w-full mx-auto">
        <TranslationFeed entries={entries} interim={interim} processing={processing} />
      </div>

      {/* Controls */}
      <div className="border-t border-gray-800 bg-gray-900 px-4 py-4">
        <CallControls
          isListening={isListening}
          isMuted={isMuted}
          onToggleMic={toggleMic}
          onEndCall={endCall}
          processing={processing}
          peerConnected={connected && peerCount === 2}
        />
      </div>
    </div>
  )
}
