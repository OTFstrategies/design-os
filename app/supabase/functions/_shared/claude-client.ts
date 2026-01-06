import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0'

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
})

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string | Array<{ type: 'text' | 'image'; text?: string; source?: { type: 'base64'; media_type: string; data: string } }>
}

export interface ClaudeOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface ClaudeResult {
  content: string
  inputTokens: number
  outputTokens: number
}

export async function callClaude(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): Promise<ClaudeResult> {
  const {
    model = 'claude-sonnet-4-20250514',
    maxTokens = 4096,
    temperature = 0.3,
    systemPrompt,
  } = options

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[],
  })

  const textContent = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')

  return {
    content: textContent,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}

export async function callClaudeWithImages(
  systemPrompt: string,
  userPrompt: string,
  images: Array<{ base64: string; mediaType: string }>
): Promise<ClaudeResult> {
  const imageContent = images.map((img) => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: img.mediaType,
      data: img.base64,
    },
  }))

  const messages: ClaudeMessage[] = [
    {
      role: 'user',
      content: [
        ...imageContent,
        { type: 'text', text: userPrompt },
      ],
    },
  ]

  return callClaude(messages, { systemPrompt })
}

export async function callClaudeWithDocuments(
  systemPrompt: string,
  userPrompt: string,
  documents: Array<{ base64: string; mediaType: string; filename: string }>
): Promise<ClaudeResult> {
  // Build content array with document blocks followed by text prompt
  // Claude API expects: type: "document" with source.type: "base64", media_type, and data
  const contentBlocks: Array<Record<string, unknown>> = []

  for (const doc of documents) {
    // Try the standard document block format per Anthropic docs
    contentBlocks.push({
      type: 'document',
      source: {
        type: 'base64',
        media_type: doc.mediaType,
        data: doc.base64,
      },
      // Add cache control for better performance on repeated calls
      cache_control: { type: 'ephemeral' },
    })
  }

  contentBlocks.push({ type: 'text', text: userPrompt })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    temperature: 0.3,
    system: systemPrompt,
    // @ts-ignore - document type is valid but not in older SDK types
    messages: [{ role: 'user', content: contentBlocks }],
  })

  const textContent = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')

  return {
    content: textContent,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}
