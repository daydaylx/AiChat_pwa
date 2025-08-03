const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function fetchChatCompletion(apiKey: string, model: string, messages: any[], maxTokens = 2048) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ki-chat-pwa-nofilter'
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchModels(apiKey: string) {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ki-chat-pwa-nofilter'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch models: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

