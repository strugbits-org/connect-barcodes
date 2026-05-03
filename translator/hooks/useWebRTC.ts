'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { SignalingMessage } from '@/types'
import { RealtimeChannel } from '@supabase/supabase-js'

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

export function useWebRTC(roomId: string, participantId: string) {
  const pcRef        = useRef<RTCPeerConnection | null>(null)
  const channelRef   = useRef<RealtimeChannel | null>(null)
  const localStream  = useRef<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [connected, setConnected]       = useState(false)
  const [peerCount,  setPeerCount]      = useState(0)
  const isInitiator  = useRef(false)

  const sendSignal = useCallback((msg: SignalingMessage) => {
    channelRef.current?.send({ type: 'broadcast', event: 'signal', payload: msg })
  }, [])

  const createPeerConnection = useCallback((stream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    pcRef.current = pc

    stream.getTracks().forEach(t => pc.addTrack(t, stream))

    const remote = new MediaStream()
    setRemoteStream(remote)

    pc.ontrack = e => {
      e.streams[0].getTracks().forEach(t => remote.addTrack(t))
    }

    pc.onicecandidate = e => {
      if (e.candidate) {
        sendSignal({ type: 'ice-candidate', from: participantId, payload: e.candidate })
      }
    }

    pc.onconnectionstatechange = () => {
      setConnected(pc.connectionState === 'connected')
    }

    return pc
  }, [participantId, sendSignal])

  const startCall = useCallback(async () => {
    if (!localStream.current || !pcRef.current) return
    const offer = await pcRef.current.createOffer()
    await pcRef.current.setLocalDescription(offer)
    sendSignal({ type: 'offer', from: participantId, payload: offer })
  }, [participantId, sendSignal])

  useEffect(() => {
    let mounted = true

    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      localStream.current = stream

      const channel = supabase.channel(`room:${roomId}`, {
        config: { presence: { key: participantId } },
      })
      channelRef.current = channel

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState()
          const count = Object.keys(state).length
          if (!mounted) return
          setPeerCount(count)

          // Second user to join becomes the non-initiator and triggers the call
          if (count === 2 && isInitiator.current && pcRef.current) {
            startCall()
          }
        })
        .on('presence', { event: 'join' }, ({ key }) => {
          if (key !== participantId && pcRef.current && isInitiator.current) {
            setTimeout(startCall, 500)
          }
        })
        .on('broadcast', { event: 'signal' }, async ({ payload: msg }: { payload: SignalingMessage }) => {
          if (!mounted || msg.from === participantId) return
          const pc = pcRef.current
          if (!pc) return

          if (msg.type === 'offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.payload as RTCSessionDescriptionInit))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            sendSignal({ type: 'answer', from: participantId, payload: answer })
          } else if (msg.type === 'answer') {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.payload as RTCSessionDescriptionInit))
          } else if (msg.type === 'ice-candidate') {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(msg.payload as RTCIceCandidateInit))
            } catch {
              // may arrive before remote description — harmless
            }
          }
        })

      await channel.subscribe(async status => {
        if (status !== 'SUBSCRIBED') return
        const state = channel.presenceState()
        const existing = Object.keys(state).length

        // First joiner is the initiator
        isInitiator.current = existing === 0
        await channel.track({ participantId, joinedAt: Date.now() })

        if (!mounted) return
        createPeerConnection(stream)
      })
    }

    init().catch(console.error)

    return () => {
      mounted = false
      pcRef.current?.close()
      channelRef.current?.unsubscribe()
      localStream.current?.getTracks().forEach(t => t.stop())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, participantId])

  return { localStream: localStream.current, remoteStream, connected, peerCount, sendSignal }
}
