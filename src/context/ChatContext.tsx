import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession, Message } from '../types';
import { useStorage } from '../hooks/useStorage';
import { DEFAULT_SYSTEM_PROMPT } from '../constants';

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'CREATE_SESSION'; payload: { modelId: string; systemPrompt?: string } }
  | { type: 'SET_ACTIVE_SESSION'; payload: string }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'UPDATE_SESSION_TITLE'; payload: { sessionId: string; title: string } }
  | { type: 'UPDATE_SYSTEM_PROMPT'; payload: { sessionId: string; systemPrompt: string } }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_SESSIONS'; payload: ChatSession[] }
  | { type: 'CLEAR_ALL_SESSIONS' };

interface ChatContextType {
  state: ChatState;
  createSession: (modelId: string, systemPrompt?: string) => void;
  setActiveSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  updateSystemPrompt: (sessionId: string, systemPrompt: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearAllSessions: () => void;
}

const initialState: ChatState = {
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'CREATE_SESSION': {
      const newSession: ChatSession = {
        id: uuidv4(),
        title: 'New Chat',
        messages: [],
        modelId: action.payload.modelId,
        systemPrompt: action.payload.systemPrompt || DEFAULT_SYSTEM_PROMPT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        activeSessionId: newSession.id,
      };
    }
    
    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSessionId: action.payload,
      };
      
    case 'DELETE_SESSION': {
      const newSessions = state.sessions.filter(
        (session) => session.id !== action.payload
      );
      
      // If we deleted the active session, set a new active session
      let newActiveId = state.activeSessionId;
      if (state.activeSessionId === action.payload) {
        newActiveId = newSessions.length > 0 ? newSessions[0].id : null;
      }
      
      return {
        ...state,
        sessions: newSessions,
        activeSessionId: newActiveId,
      };
    }
    
    case 'UPDATE_SESSION_TITLE': {
      const updatedSessions = state.sessions.map((session) => {
        if (session.id === action.payload.sessionId) {
          return {
            ...session,
            title: action.payload.title,
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      return {
        ...state,
        sessions: updatedSessions,
      };
    }
    
    case 'UPDATE_SYSTEM_PROMPT': {
      const updatedSessions = state.sessions.map((session) => {
        if (session.id === action.payload.sessionId) {
          return {
            ...session,
            systemPrompt: action.payload.systemPrompt,
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      return {
        ...state,
        sessions: updatedSessions,
      };
    }
    
    case 'ADD_MESSAGE': {
      const { sessionId, message } = action.payload;
      
      const updatedSessions = state.sessions.map((session) => {
        if (session.id === sessionId) {
          // Update session title based on first user message if still "New Chat"
          let title = session.title;
          if (
            title === 'New Chat' && 
            message.role === 'user' && 
            session.messages.filter(m => m.role === 'user').length === 0
          ) {
            // Use first 30 chars of user message as title
            title = message.content.length > 30 
              ? `${message.content.substring(0, 30)}...` 
              : message.content;
          }
          
          return {
            ...session,
            title,
            messages: [...session.messages, message],
            updatedAt: Date.now(),
          };
        }
        return session;
      });
      
      return {
        ...state,
        sessions: updatedSessions,
      };
    }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
      
    case 'LOAD_SESSIONS':
      return {
        ...state,
        sessions: action.payload,
        activeSessionId: action.payload.length > 0 ? action.payload[0].id : null,
      };
      
    case 'CLEAR_ALL_SESSIONS':
      return {
        ...state,
        sessions: [],
        activeSessionId: null,
      };
      
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getItem, setItem } = useStorage();
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  // Load sessions from storage on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const savedSessions = await getItem<ChatSession[]>('chatSessions');
        
        if (savedSessions && savedSessions.length > 0) {
          dispatch({ type: 'LOAD_SESSIONS', payload: savedSessions });
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    };
    
    loadSessions();
  }, [getItem]);
  
  // Save sessions to storage when they change
  useEffect(() => {
    if (state.sessions.length > 0) {
      setItem('chatSessions', state.sessions);
    }
  }, [state.sessions, setItem]);
  
  const createSession = (modelId: string, systemPrompt?: string) => {
    dispatch({ 
      type: 'CREATE_SESSION', 
      payload: { modelId, systemPrompt } 
    });
  };
  
  const setActiveSession = (sessionId: string) => {
    dispatch({ type: 'SET_ACTIVE_SESSION', payload: sessionId });
  };
  
  const deleteSession = (sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: sessionId });
  };
  
  const updateSessionTitle = (sessionId: string, title: string) => {
    dispatch({ 
      type: 'UPDATE_SESSION_TITLE', 
      payload: { sessionId, title } 
    });
  };
  
  const updateSystemPrompt = (sessionId: string, systemPrompt: string) => {
    dispatch({ 
      type: 'UPDATE_SYSTEM_PROMPT', 
      payload: { sessionId, systemPrompt } 
    });
  };
  
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!state.activeSessionId) return;
    
    const fullMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { 
        sessionId: state.activeSessionId, 
        message: fullMessage 
      } 
    });
  };
  
  const clearAllSessions = () => {
    dispatch({ type: 'CLEAR_ALL_SESSIONS' });
  };
  
  // Set loading state
  const setLoading = (isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  };
  
  // Set error state
  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };
  
  return (
    <ChatContext.Provider
      value={{
        state,
        createSession,
        setActiveSession,
        deleteSession,
        updateSessionTitle,
        updateSystemPrompt,
        addMessage,
        clearAllSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
