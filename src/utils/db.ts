import { ChatSession, Message } from '../types';

class DatabaseService {
  private sessions: ChatSession[] = [];

  async saveSession(session: ChatSession): Promise<void> {
    const index = this.sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      this.sessions[index] = { ...session, updatedAt: new Date() };
    } else {
      this.sessions.push({ ...session, updatedAt: new Date() });
    }
    this.persistSessions();
  }

  async getSession(id: string): Promise<ChatSession | null> {
    return this.sessions.find(s => s.id === id) || null;
  }

  async getAllSessions(): Promise<ChatSession[]> {
    return [...this.sessions];
  }

  async deleteSession(id: string): Promise<void> {
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.persistSessions();
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = new Date();
      this.persistSessions();
    }
  }

  private persistSessions(): void {
    localStorage.setItem('chat-sessions', JSON.stringify(this.sessions));
  }

  private loadSessions(): void {
    const stored = localStorage.getItem('chat-sessions');
    if (stored) {
      this.sessions = JSON.parse(stored);
    }
  }

  constructor() {
    this.loadSessions();
  }
}

const db = new DatabaseService();
export default db;

// Named exports for compatibility
export const saveSession = db.saveSession.bind(db);
export const getSession = db.getSession.bind(db);
export const getAllSessions = db.getAllSessions.bind(db);
export const deleteSession = db.deleteSession.bind(db);
export const addMessage = db.addMessage.bind(db);
