import { ChatSession } from '../types';
import { db } from '../services/db';

/**
 * Exportiert alle Chat-Sessions als JSON-Blob.
 */
export async function exportAllChats(): Promise<Blob> {
  const sessions = await db.getAllSessions();
  const json = JSON.stringify(sessions, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Importiert mehrere Chat-Sessions aus einem JSON-File.
 */
export async function importChatsFromFile(file: File): Promise<void> {
  const text = await file.text();
  const sessions: ChatSession[] = JSON.parse(text);

  if (!Array.isArray(sessions)) throw new Error('Invalid format');
  for (const session of sessions) {
    if (!session.id || !session.messages) continue;
    await db.saveSession(session);
  }
}
