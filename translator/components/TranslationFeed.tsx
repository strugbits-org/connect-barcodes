'use client'

import { useEffect, useRef } from 'react'
import type { TranslationEntry } from '@/hooks/useTranslationPipeline'
import { LANGUAGES } from '@/types'
import clsx from 'clsx'

function langLabel(code: string) {
  return LANGUAGES.find(l => l.code === code)?.label ?? code
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

interface Props {
  entries: TranslationEntry[]
  interim?: string
  processing?: boolean
}

export function TranslationFeed({ entries, interim, processing }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries, interim])

  if (entries.length === 0 && !interim) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
        Translations will appear here once you start speaking…
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2">
      {entries.map(entry => (
        <div
          key={entry.id}
          className={clsx(
            'animate-fade-in rounded-xl p-3 max-w-[85%]',
            entry.direction === 'sent'
              ? 'ml-auto bg-brand-700/30 border border-brand-600/30'
              : 'mr-auto bg-gray-800/60 border border-gray-700/40'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-400">
              {entry.direction === 'sent' ? 'You' : 'Peer'}
            </span>
            <span className="text-xs text-gray-600">
              {langLabel(entry.fromLanguage)} → {langLabel(entry.toLanguage)}
            </span>
            <span className="text-xs text-gray-700 ml-auto">{formatTime(entry.timestamp)}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{entry.translatedText}</p>
          <p className="text-gray-600 text-xs mt-1 italic">{entry.originalText}</p>
        </div>
      ))}

      {(interim || processing) && (
        <div className="mr-auto bg-gray-800/40 border border-gray-700/30 rounded-xl p-3 max-w-[85%] animate-pulse-slow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-500">You</span>
            {processing && (
              <span className="text-xs text-brand-400 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" />
                translating…
              </span>
            )}
          </div>
          {interim && <p className="text-gray-500 text-sm italic">{interim}</p>}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
