import React, { createContext, useState, useEffect, useContext } from "react";
import { ChatSession, Message } from "../types";
import { getAllSessions, saveSession, deleteSession, deleteAllSessions } from "../services/db";
import { v4 as uuidv4 } from "../utils/uuid";

interface SessionContextProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: (id: string) => void;
  addSession: (session?: Partial<ChatSession>) => void;
  updateSession: (session: ChatSession) => void;
  removeSession: (id: string) => void;
  clearSessions: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    getAllSessions().then(setSessions);
  }, []);

  const addSession = (partial?: Partial<ChatSession>) => {
    const id = uuidv4();
    const session: ChatSession = {
      id,
      title: partial?.title || "",
      createdAt: Date.now(),
      messages: partial?.messages || [],
      model: partial?.model || "",
    };
    saveSession(session).then(() => getAllSessions().then(setSessions));
    setCurrentSessionId(id);
  };

  const updateSession = (session: ChatSession) => {
    saveSession(session).then(() => getAllSessions().then(setSessions));
  };

  const removeSession = (id: string) => {
    deleteSession(id).then(() => getAllSessions().then(setSessions));
    if (currentSessionId === id) setCurrentSessionId(null);
  };

  const clearSessions = () => {
    deleteAllSessions().then(() => getAllSessions().then(setSessions));
    setCurrentSessionId(null);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSessionId,
        setCurrentSessionId,
        addSession,
        updateSession,
        removeSession,
        clearSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
