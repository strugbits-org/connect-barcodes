import { LANGUAGES } from '@/types'

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1'

export async function textToSpeech(
  text: string,
  languageCode: string
): Promise<Buffer> {
  const lang = LANGUAGES.find(l => l.code === languageCode)
  const voiceId = lang?.elevenlabsVoiceId ?? 'EXAVITQu4vr4xnSDxMaL'

  const response = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`ElevenLabs TTS failed: ${err}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
