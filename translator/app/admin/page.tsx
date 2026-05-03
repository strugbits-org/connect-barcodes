'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Room, Participant, Transcript } from '@/types'
import { LANGUAGES } from '@/types'
import clsx from 'clsx'

interface SessionData {
  rooms: (Room & { participants: Participant[] })[]
  transcripts: Transcript[]
}

function langLabel(code: string) {
  return LANGUAGES.find(l => l.code === code)?.label ?? code
}

function statusColor(status: Room['status']) {
  return { waiting: 'bg-yellow-500', active: 'bg-green-500', ended: 'bg-gray-600' }[status]
}

function formatDuration(start: string, end: string | null) {
  if (!end) return 'ongoing'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const s  = Math.floor(ms / 1000)
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

export default function AdminPage() {
  const [data,          setData]          = useState<SessionData | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [selectedRoom,  setSelectedRoom]  = useState<string | null>(null)
  const [searchText,    setSearchText]    = useState('')
  const [filterStatus,  setFilterStatus]  = useState<string>('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sessions')
      setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filteredRooms = (data?.rooms ?? []).filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false
    if (searchText && !r.id.includes(searchText)) return false
    return true
  })

  const roomTranscripts = data?.transcripts.filter(t => t.room_id === selectedRoom) ?? []

  const stats = {
    total:   data?.rooms.length ?? 0,
    active:  data?.rooms.filter(r => r.status === 'active').length ?? 0,
    ended:   data?.rooms.filter(r => r.status === 'ended').length ?? 0,
    messages: data?.transcripts.length ?? 0,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Translation Admin</h1>
          <p className="text-xs text-gray-500 mt-0.5">Session & transcript logs</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400">← App</a>
          <button
            onClick={load}
            disabled={loading}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium disabled:opacity-50"
          >
            {loading ? '⟳ Loading…' : '⟳ Refresh'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-b border-gray-800">
        {[
          { label: 'Total Rooms',  value: stats.total },
          { label: 'Active',       value: stats.active,   accent: 'text-green-400' },
          { label: 'Ended',        value: stats.ended },
          { label: 'Translations', value: stats.messages, accent: 'text-brand-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className={clsx('text-2xl font-bold', s.accent ?? 'text-white')}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex h-[calc(100vh-220px)]">
        {/* Room list */}
        <div className="w-72 border-r border-gray-800 flex flex-col">
          <div className="p-4 space-y-2 border-b border-gray-800">
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search room ID…"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs
                         placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs
                         focus:outline-none appearance-none"
            >
              <option value="all">All statuses</option>
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredRooms.length === 0 ? (
              <p className="text-xs text-gray-600 text-center p-8">No rooms found</p>
            ) : (
              filteredRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={clsx(
                    'w-full text-left px-4 py-3 border-b border-gray-800/60 hover:bg-gray-900 transition-colors',
                    selectedRoom === room.id && 'bg-gray-900 border-l-2 border-l-brand-500'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx('w-2 h-2 rounded-full', statusColor(room.status))} />
                    <span className="text-xs font-mono text-gray-300">{room.id.slice(0, 12)}…</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(room.created_at).toLocaleDateString()} ·{' '}
                    {room.participants.length} participant{room.participants.length !== 1 ? 's' : ''} ·{' '}
                    {formatDuration(room.created_at, room.ended_at)}
                  </div>
                  {room.participants.length > 0 && (
                    <div className="text-xs text-gray-700 mt-0.5">
                      {room.participants.map(p => langLabel(p.language)).join(' ↔ ')}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Transcript panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedRoom ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-700">
              <span className="text-4xl mb-3">💬</span>
              <p>Select a room to view transcripts</p>
            </div>
          ) : (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-300 text-sm font-mono">
                  Room {selectedRoom.slice(0, 8)}…
                </h2>
                <span className="text-xs text-gray-600">{roomTranscripts.length} messages</span>
              </div>

              {roomTranscripts.length === 0 ? (
                <p className="text-sm text-gray-600">No transcripts logged for this room.</p>
              ) : (
                roomTranscripts.map(t => (
                  <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-400">
                        {langLabel(t.speaker_language)} → {langLabel(t.target_language)}
                      </span>
                      <span className="text-xs text-gray-700 ml-auto">
                        {new Date(t.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{t.translated_text}</p>
                    <p className="text-xs text-gray-600 italic">Original: {t.original_text}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
