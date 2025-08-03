import { ChatSession } from '../types';

const STORAGE_KEY = 'chat_sessions';

export async function getSessions(): Promise<ChatSession[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveSession(session: ChatSession): Promise<void> {
  const sessions = await getSessions();
  const index = sessions.findIndex((s: ChatSession) => s.id === session.id);
  if (index !== -1) {
    sessions[index] = { ...session, updatedAt: Date.now() };
  } else {
    sessions.push({ ...session, updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  const filtered = sessions.filter((s: ChatSession) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
