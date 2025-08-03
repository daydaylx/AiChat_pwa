import Dexie, { Table } from 'dexie';
import { ChatSession } from '../types';

/**
 * Definiert die Datenbank-Klasse, die von Dexie erbt.
 */
export class PersonaChatDB extends Dexie {
  sessions!: Table<ChatSession, string>;
  constructor() {
    super('PersonaChatDB');
    this.version(1).stores({
      sessions: '&id, createdAt'
    });
  }
}

export const db = new PersonaChatDB();

/**
 * Ruft alle Chat-Sitzungen ab.
 */
export const getAllSessions = async (): Promise<ChatSession[]> => {
  return db.sessions.orderBy('createdAt').reverse().toArray();
};

/**
 * Fügt eine neue Chat-Sitzung hinzu oder aktualisiert eine bestehende.
 */
export const saveSession = async (session: ChatSession): Promise<string> => {
  return db.sessions.put(session);
};

/**
 * Löscht eine Chat-Sitzung anhand ihrer ID.
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  return db.sessions.delete(sessionId);
};

/**
 * Löscht alle Chat-Sitzungen.
 */
export const deleteAllSessions = async (): Promise<void> => {
  return db.sessions.clear();
};
