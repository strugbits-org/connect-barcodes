# Setup Guide

## 1. Install dependencies
```bash
cd translator
npm install
```

## 2. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local and fill in all keys
```

## 3. Set up Supabase
1. Create a project at https://supabase.com
2. Open the SQL editor and run the contents of `supabase/schema.sql`
3. Copy your Project URL, anon key, and service role key into `.env.local`

## 4. Get API keys
| Service | Where |
|---------|-------|
| Deepgram | https://console.deepgram.com → API Keys |
| OpenAI | https://platform.openai.com → API Keys |
| ElevenLabs | https://elevenlabs.io → Profile → API Key |

## 5. Run
```bash
npm run dev   # → http://localhost:3001
```

## How it works

```
User A mic → Deepgram (STT) → GPT-4o (translate) → ElevenLabs (TTS)
                                                          ↓
                                              Supabase Realtime broadcast
                                                          ↓
                                                   User B plays audio
```

- **WebRTC** (Supabase Realtime signaling): P2P audio for raw voice
- **Deepgram Nova-2**: Real-time streaming STT with interim results
- **GPT-4o**: Translation with natural speech style
- **ElevenLabs Turbo v2.5**: Low-latency TTS
- **Supabase**: Session/transcript logging + Realtime signaling channel

## Routes
| Path | Description |
|------|-------------|
| `/` | Home — create or join a call |
| `/room/[id]` | The call room |
| `/admin` | Admin dashboard — sessions & transcripts |
| `POST /api/rooms` | Create a room |
| `GET /api/stt` | Get Deepgram short-lived token |
| `POST /api/translate` | Translate text via GPT-4o |
| `POST /api/tts` | Generate speech via ElevenLabs |
| `GET /api/sessions` | All sessions for admin |
