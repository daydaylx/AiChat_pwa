// API-Service für verschiedene LLM-Anbieter
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ApiConfig {
  apiKey: string;
  model: string;
  endpoint?: string;
}

export async function sendChatMessage(messages: Message[], config: ApiConfig): Promise<string> {
  if (config.model.startsWith('openrouter/')) {
    return sendOpenRouterMessage(messages, config);
  } else if (config.model === 'local/ollama') {
    return sendOllamaMessage(messages, config);
  } else {
    throw new Error('Unbekannter Modellanbieter');
  }
}

async function sendOpenRouterMessage(messages: Message[], config: ApiConfig): Promise<string> {
  const modelId = config.model.replace('openrouter/', '');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Private Chat PWA'
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Fehler bei der Anfrage an OpenRouter');
    }
    
    return data.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
}

async function sendOllamaMessage(messages: Message[], config: ApiConfig): Promise<string> {
  const ollamaModel = config.endpoint?.split('/').pop() || 'mistral';
  const endpoint = config.endpoint || "http://localhost:11434/api/chat";
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Fehler bei der Anfrage an Ollama: ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content || '';
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw error;
  }
}
