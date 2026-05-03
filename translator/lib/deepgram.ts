import { createClient } from '@deepgram/sdk'

export function getDeepgramClient() {
  return createClient(process.env.DEEPGRAM_API_KEY!)
}

export async function createShortLivedToken(): Promise<string> {
  const deepgram = getDeepgramClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { result, error } = await (deepgram.auth as any).grantToken()
  if (error || !result) throw new Error('Failed to create Deepgram token')
  // SDK may return key or access_token depending on version
  return result.key ?? result.access_token ?? ''
}
