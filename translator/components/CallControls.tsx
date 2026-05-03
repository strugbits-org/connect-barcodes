'use client'

import clsx from 'clsx'

interface Props {
  isListening: boolean
  isMuted: boolean
  onToggleMic: () => void
  onEndCall: () => void
  processing?: boolean
  peerConnected?: boolean
}

export function CallControls({ isListening, isMuted, onToggleMic, onEndCall, processing, peerConnected }: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Mic toggle */}
      <button
        onClick={onToggleMic}
        className={clsx(
          'flex flex-col items-center gap-1 px-4 py-3 rounded-2xl font-medium text-sm transition-all',
          isMuted
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/50'
        )}
      >
        <span className="text-xl">{isMuted ? '🎙️✕' : '🎙️'}</span>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      {/* Listening indicator */}
      <div className="flex flex-col items-center gap-1 px-4">
        <div
          className={clsx(
            'w-4 h-4 rounded-full transition-all',
            isListening && !isMuted
              ? 'bg-green-400 shadow-lg shadow-green-400/50 animate-pulse'
              : 'bg-gray-700'
          )}
        />
        <span className="text-xs text-gray-500">
          {isListening && !isMuted ? 'Live' : 'Idle'}
        </span>
      </div>

      {/* Processing indicator */}
      {processing && (
        <div className="flex flex-col items-center gap-1 px-4">
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="inline-block w-1.5 h-4 bg-brand-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-brand-400">Translating</span>
        </div>
      )}

      {/* Peer status */}
      <div className="flex flex-col items-center gap-1 px-4">
        <div
          className={clsx(
            'w-4 h-4 rounded-full',
            peerConnected ? 'bg-green-400' : 'bg-yellow-500 animate-pulse'
          )}
        />
        <span className="text-xs text-gray-500">{peerConnected ? 'Peer' : 'Waiting'}</span>
      </div>

      {/* End call */}
      <button
        onClick={onEndCall}
        className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-red-600 text-white
                   font-medium text-sm hover:bg-red-500 transition-all shadow-lg shadow-red-900/50"
      >
        <span className="text-xl">📞</span>
        End
      </button>
    </div>
  )
}
