'use client'

import { LANGUAGES } from '@/types'

interface Props {
  value: string
  onChange: (code: string) => void
  label?: string
  disabled?: boolean
}

export function LanguageSelector({ value, onChange, label = 'Language', disabled }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50
                   disabled:cursor-not-allowed appearance-none cursor-pointer"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  )
}
