import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatSession } from '../types';
import * as db from '../utils/db';

interface SessionContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  setCurrentSession: React.Dispatch<React.SetStateAction<ChatSession | null>>;
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  saveSession: (session: ChatSession) => Promise<void>;
  loadSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line
  }, []);

  const loadSessions = async () => {
    const allSessions = await db.getSessions();
    setSessions(allSessions);
    if (allSessions.length > 0) {
      setCurrentSession(allSessions[0]);
    }
  };

  const saveSession = async (session: ChatSession) => {
    // updatedAt MUSS number sein (Timestamp), kein Date-Objekt!
    const updatedSession = { ...session, updatedAt: Date.now() };
    await db.saveSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    setCurrentSession(updatedSession);
  };

  return (
    <SessionContext.Provider value={{ sessions, currentSession, setCurrentSession, setSessions, saveSession, loadSessions }}>
      {children}
    </SessionContext.Provider>
  );
};

export function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSessionContext must be used within a SessionProvider');
  return ctx;
}
