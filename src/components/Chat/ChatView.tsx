import { useRef, useEffect, useContext, useState } from 'react';
import { ChatSession, Message } from '../../types';
import { SessionContext } from '../../contexts/SessionContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { MessageInput } from './MessageInput';
import { streamOpenRouterResponse } from '../../services/openRouter';

export function ChatView({ session }: { session: ChatSession }) {
  const ctx = useContext(SessionContext);
  const settings = useContext(SettingsContext);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [session.messages, isTyping]);

  if (!ctx || !settings) return null;
  const { addMessage } = ctx;
  const { apiKey, model, noFilter } = settings;

  // KI-Antworten generieren und als Stream anzeigen
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);

    if (!apiKey) {
      setError('API-Key fehlt!');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    addMessage(userMessage);
    setIsTyping(true);

    const aiMessageId = crypto.randomUUID();
    const aiMsg: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    addMessage(aiMsg);

    try {
      const context = [...session.messages.slice(-15), userMessage];
      let full = '';
      for await (const chunk of streamOpenRouterResponse(context, apiKey, model, noFilter)) {
        full += chunk;
        aiMsg.content = full;
        addMessage({ ...aiMsg });
      }
    } catch (e: any) {
      setError('KI-Antwort fehlgeschlagen.');
      aiMsg.content = '[Fehler: Keine Antwort von KI]';
      addMessage({ ...aiMsg });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {session.messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#007aff' : '#f2f2f7',
              color: msg.role === 'user' ? '#fff' : '#222',
              borderRadius: 16,
              padding: '0.75rem 1.25rem',
              maxWidth: '75%',
              whiteSpace: 'pre-wrap',
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              animation: 'fadeIn .3s',
            }}
          >{msg.content}</div>
        ))}
        {isTyping && <div style={{ alignSelf: 'flex-start', color: '#999' }}>…schreibt</div>}
        <div ref={chatEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
      {error && <div style={{ color: 'red', textAlign: 'center', margin: 12 }}>{error}</div>}
    </div>
  );
}
