import OpenAI from 'openai'

export function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
}

export async function translateText(
  text: string,
  fromLanguage: string,
  toLanguage: string
): Promise<string> {
  const client = getOpenAIClient()

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a real-time speech translator. Translate the user's speech from ${fromLanguage} to ${toLanguage}. Output ONLY the translated text — no explanations, no quotes, no extra content. Preserve tone and natural speech patterns.`,
      },
      { role: 'user', content: text },
    ],
    max_tokens: 500,
    temperature: 0.3,
  })

  return response.choices[0].message.content?.trim() ?? ''
}
