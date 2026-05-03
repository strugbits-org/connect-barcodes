export interface Room {
  id: string
  created_at: string
  status: 'waiting' | 'active' | 'ended'
  ended_at: string | null
}

export interface Participant {
  id: string
  room_id: string
  language: string
  joined_at: string
  left_at: string | null
}

export interface Transcript {
  id: string
  room_id: string
  participant_id: string | null
  speaker_language: string
  original_text: string
  translated_text: string
  target_language: string
  created_at: string
}

export interface Language {
  code: string
  label: string
  deepgramModel: string
  elevenlabsVoiceId: string
}

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English',    deepgramModel: 'nova-2', elevenlabsVoiceId: 'EXAVITQu4vr4xnSDxMaL' },
  { code: 'es', label: 'Spanish',    deepgramModel: 'nova-2', elevenlabsVoiceId: 'VR6AewLTigWG4xSOukaG' },
  { code: 'fr', label: 'French',     deepgramModel: 'nova-2', elevenlabsVoiceId: 'MF3mGyEYCl7XYWbV9V6O' },
  { code: 'de', label: 'German',     deepgramModel: 'nova-2', elevenlabsVoiceId: 'AZnzlk1XvdvUeBnXmlld' },
  { code: 'it', label: 'Italian',    deepgramModel: 'nova-2', elevenlabsVoiceId: 'IKne3meq5aSn9XLyUdCD' },
  { code: 'pt', label: 'Portuguese', deepgramModel: 'nova-2', elevenlabsVoiceId: 'onwK4e9ZLuTAKqWW03F9' },
  { code: 'ja', label: 'Japanese',   deepgramModel: 'nova-2', elevenlabsVoiceId: 'pNInz6obpgDQGcFmaJgB' },
  { code: 'zh', label: 'Chinese',    deepgramModel: 'nova-2', elevenlabsVoiceId: 'yoZ06aMxZJJ28mfd3POQ' },
  { code: 'ko', label: 'Korean',     deepgramModel: 'nova-2', elevenlabsVoiceId: 'pqHfZKP75CvOlQylNhV4' },
  { code: 'ar', label: 'Arabic',     deepgramModel: 'nova-2', elevenlabsVoiceId: 'g5CIjZEefAph4nQFvHAz' },
  { code: 'hi', label: 'Hindi',      deepgramModel: 'nova-2', elevenlabsVoiceId: 'jBpfuIE2acCO8z3wKNLl' },
  { code: 'ru', label: 'Russian',    deepgramModel: 'nova-2', elevenlabsVoiceId: 'GBv7mTt0atIp3Br8iCZE' },
]

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left' | 'translation'
  from: string
  payload: unknown
}

export interface TranslationPayload {
  originalText: string
  translatedText: string
  fromLanguage: string
  toLanguage: string
  audioBase64?: string
  participantId: string
  timestamp: string
}
