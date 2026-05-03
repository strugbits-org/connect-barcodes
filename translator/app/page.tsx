'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router   = useRouter()
  const [loading, setLoading] = useState(false)
  const [joinId,  setJoinId]  = useState('')

  async function createRoom() {
    setLoading(true)
    try {
      const res  = await fetch('/api/rooms', { method: 'POST' })
      const room = await res.json()
      router.push(`/room/${room.id}`)
    } catch (err) {
      alert('Failed to create room. Check your Supabase config.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function joinRoom() {
    const id = joinId.trim()
    if (!id) return
    // Accept full URLs or just the UUID
    const match = id.match(/([0-9a-f-]{36})/i)
    if (match) router.push(`/room/${match[1]}`)
    else alert('Invalid room ID or link')
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-8">
      {/* Hero */}
      <div className="text-center space-y-3 max-w-lg">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Real-time Translation Calls</h1>
        <p className="text-gray-400">
          Speak in your language. Your partner hears you in theirs — instantly.
          Powered by Deepgram, GPT-4o, and ElevenLabs.
        </p>
      </div>

      {/* Action cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        {/* Create */}
        <button
          onClick={createRoom}
          disabled={loading}
          className="flex-1 flex flex-col items-center gap-3 p-6 bg-brand-700/20 hover:bg-brand-700/30
                     border border-brand-600/40 rounded-2xl transition-all group disabled:opacity-60"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">📞</span>
          <span className="font-semibold text-white">
            {loading ? 'Creating…' : 'New Call'}
          </span>
          <span className="text-xs text-gray-500">Create a room and share the link</span>
        </button>

        {/* Join */}
        <div className="flex-1 flex flex-col items-center gap-3 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
          <span className="text-3xl">🔗</span>
          <span className="font-semibold text-white">Join a Call</span>
          <input
            value={joinId}
            onChange={e => setJoinId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            placeholder="Paste link or room ID…"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
                       text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={joinRoom}
            className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm
                       font-medium transition-all"
          >
            Join
          </button>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
        {['Deepgram Nova-2 STT', 'GPT-4o Translation', 'ElevenLabs TTS', 'WebRTC P2P', '12 Languages'].map(f => (
          <span key={f} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">{f}</span>
        ))}
      </div>

      <a href="/admin" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
        Admin Dashboard →
      </a>
    </main>
  )
}
