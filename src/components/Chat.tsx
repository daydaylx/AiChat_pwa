import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { sendChatMessage, Message as MessageType } from '../services/api';
interface ChatProps {
settings: {
apiKey: string;
model: string;
endpoint?: string;
};
}
interface MessageData {
id: string;
role: 'user' | 'assistant' | 'system';
content: string;
timestamp: number;
}
const Chat = ({ settings }: ChatProps) => {
const [messages, setMessages] = useState<MessageData[]>([]);
const [isLoading, setIsLoading] = useState(false);
const chatContainerRef = useRef<HTMLDivElement>(null);
// Load messages from localStorage on component mount
useEffect(() => {
const savedMessages = localStorage.getItem('chat_messages');
if (savedMessages) {
try {
setMessages(JSON.parse(savedMessages));
} catch (error) {
console.error('Failed to parse messages:', error);
}
}
}, []);
// Save messages to localStorage whenever they change
useEffect(() => {
localStorage.setItem('chat_messages', JSON.stringify(messages));
}, [messages]);
// Scroll to bottom when messages change
useEffect(() => {
if (chatContainerRef.current) {
chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
}
}, [messages]);
const sendMessage = async (content: string) => {
if (!content.trim()) return;
// Check if we need API key for this model
if (settings.model.startsWith('openrouter/') && !settings.apiKey) {
  alert('Bitte gib einen OpenRouter API-Schlüssel in den Einstellungen an.');
  return;
}

const userMessage: MessageData = {
  id: Date.now().toString(),
  role: 'user',
  content,
  timestamp: Date.now(),
};

setMessages(prevMessages => [...prevMessages, userMessage]);
setIsLoading(true);

try {
  // Get the last few messages for context (adjust as needed)
  const recentMessages = [...messages.slice(-10), userMessage]
    .filter(msg => msg.role !== 'system')
    .map(msg => ({ role: msg.role, content: msg.content })) as MessageType[];

  // Send the message to the API
  const response = await sendChatMessage(recentMessages, settings);
  
  const assistantMessage: MessageData = {
    id: Date.now().toString(),
    role: 'assistant',
    content: response,
    timestamp: Date.now(),
  };
  
  setMessages(prevMessages => [...prevMessages, assistantMessage]);
} catch (error) {
  console.error('Error sending message:', error);
  const errorMessage: MessageData = {
    id: Date.now().toString(),
    role: 'assistant',
    content: 'Fehler beim Senden der Nachricht. Bitte überprüfe deine API-Einstellungen.',
    timestamp: Date.now(),
  };
  
  setMessages(prevMessages => [...prevMessages, errorMessage]);
} finally {
  setIsLoading(false);
}
};
const clearChat = () => {
if (window.confirm('Möchtest du wirklich den gesamten Chatverlauf löschen?')) {
setMessages([]);
localStorage.removeItem('chat_messages');
}
};
// Check if settings are configured
const isConfigured = settings.model === 'local/ollama' || Boolean(settings.apiKey);
return (
<>
<div className="chat-container" ref={chatContainerRef}>
<div className="messages">
{messages.length === 0 && (
<div className="empty-chat">
<div className="empty-chat-icon">💬</div>
<div className="empty-chat-text">
{isConfigured
? 'Keine Nachrichten. Starte eine Unterhaltung!'
: 'Bitte konfiguriere zuerst deine API-Einstellungen ⚙️'}
</div>
</div>
)}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  </div>
  
  <MessageInput 
    onSendMessage={sendMessage} 
    isLoading={isLoading} 
    onClearChat={clearChat}
    disabled={!isConfigured}
  />
</>
);
};
export default Chat;
