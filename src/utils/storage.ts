export function getStoredSessions(): any[] {
  const stored = localStorage.getItem('chat-sessions');
  return stored ? JSON.parse(stored) : [];
}

export function storeSessions(sessions: any[]): void {
  localStorage.setItem('chat-sessions', JSON.stringify(sessions));
}

export function clearStoredSessions(): void {
  localStorage.removeItem('chat-sessions');
}

export function loadApiKey(): string | null {
  return localStorage.getItem('openai-api-key');
}

export function saveApiKey(key: string): void {
  localStorage.setItem('openai-api-key', key);
}

export function clearApiKey(): void {
  localStorage.removeItem('openai-api-key');
}
