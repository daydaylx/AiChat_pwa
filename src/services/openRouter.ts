import { Message } from "../types";

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'\;

/**
 * Streamt die KI-Antwort von der OpenRouter-API.
 * Gibt einen asynchronen Generator zurück, der Text-Chunks liefert.
 */
export async function* streamOpenRouterResponse(
  messages: Message[],
  apiKey: string,
  modelId: string
): AsyncGenerator<string, void, undefined> {

  const apiMessages = messages.map(({ role, content }) => ({ role, content }));

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: apiMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    let errorMsg = '';
    try {
      const errorBody = await response.json();
      errorMsg = errorBody?.error?.message || JSON.stringify(errorBody);
    } catch {
      errorMsg = `API request failed with status ${response.status}`;
    }
    throw new Error(errorMsg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Failed to get response reader');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonString = line.slice(6);
        if (jsonString === '[DONE]') return;
        try {
          const parsed = JSON.parse(jsonString);
          const content = parsed.choices[0]?.delta?.content;
          if (content) yield content;
        } catch (e) {
          // Ignoriere fehlerhafte Chunks
        }
      }
    }
  }
}
