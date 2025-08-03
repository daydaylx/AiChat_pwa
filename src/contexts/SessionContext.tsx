import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatSession, Message } from '../types';
import { uuidv4 } from '../utils/uuid';  // Changed: direct function import
import db from '../utils/db';

interface SessionContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  createSession: (title: string) => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (message: Message) => void;
  updateSessionTitle: (id: string, title: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const allSessions = await db.getAllSessions();
    setSessions(allSessions);
  };

  const createSession = async (title: string) => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.saveSession(newSession);
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const selectSession = async (id: string) => {
    const session = await db.getSession(id);
    setCurrentSession(session);
  };

  const deleteSession = async (id: string) => {
    await db.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSession?.id === id) {
      setCurrentSession(null);
    }
  };

  const addMessage = async (message: Message) => {
    if (!currentSession) return;
    
    await db.addMessage(currentSession.id, message);
    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      updatedAt: new Date()
    } : null);
    
    loadSessions(); // Refresh sessions list
  };

  const updateSessionTitle = async (id: string, title: string) => {
    const session = await db.getSession(id);
    if (session) {
      const updatedSession = { ...session, title, updatedAt: new Date() };
      await db.saveSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === id ? updatedSession : s));
      if (currentSession?.id === id) {
        setCurrentSession(updatedSession);
      }
    }
  };

  return (
    <SessionContext.Provider value={{
      sessions,
      currentSession,
      createSession,
      selectSession,
      deleteSession,
      addMessage,
      updateSessionTitle,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
