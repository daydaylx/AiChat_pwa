import { ChatSession } from '../types';
import { saveSession } from '../services/db';

/**
 * Exportiert alle Chats als JSON-String.
 * @param sessions Liste der zu exportierenden Sitzungen
 * @returns JSON-String zur Speicherung
 */
export function exportChats(sessions: ChatSession[]): string {
  return JSON.stringify(sessions, null, 2);
}

/**
 * Importiert eine Liste von Sitzungen aus JSON.
 * @param jsonString JSON-Inhalt
 * @returns Anzahl importierter Sitzungen
 */
export async function importChats(jsonString: string): Promise<number> {
  const sessions: ChatSession[] = JSON.parse(jsonString);
  let importedCount = 0;

  for (const session of sessions) {
    if (session.id && session.messages && Array.isArray(session.messages)) {
      await saveSession(session);
      importedCount++;
    }
  }

  return importedCount;
}
