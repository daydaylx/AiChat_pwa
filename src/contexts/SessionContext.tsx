import { createContext, useState, useEffect, ReactNode } from 'react';
import { db, getAllSessions, saveSession, deleteSession } from '../services/db';
import type { ChatSession, Message } from '../types';

interface SessionContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  activeSession: ChatSession | null;
  newSession: () => void;
  deleteSession: (id: string) => void;
  addMessage: (msg: Message) => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    getAllSessions().then(list => {
      setSessions(list);
      if (list.length && !activeSessionId) setActiveSessionId(list[0].id);
    });
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const newSession = () => {
    const newS: ChatSession = {
      id: crypto.randomUUID(),
      title: 'Neuer Chat',
      avatar: '💬',
      model: '',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newS, ...prev]);
    setActiveSessionId(newS.id);
    saveSession(newS);
  };

  const deleteS = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
    deleteSession(id);
  };

  const addMessage = (msg: Message) => {
    if (!activeSession) return;
    const updatedSession = { ...activeSession, messages: [...activeSession.messages, msg] };
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    saveSession(updatedSession);
  };

  return (
    <SessionContext.Provider value={{
      sessions,
      activeSessionId,
      setActiveSessionId,
      activeSession,
      newSession,
      deleteSession: deleteS,
      addMessage,
    }}>
      {children}
    </SessionContext.Provider>
  );
}
