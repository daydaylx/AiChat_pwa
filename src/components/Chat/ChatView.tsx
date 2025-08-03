import React from 'react';
import { Message } from '../../types';

interface ChatViewProps {
  messages: Message[];
  onFeedback: (id: string, feedback: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onFeedback }) => {
  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={msg.id || idx}>
          <div>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
          <div>
            <button onClick={() => onFeedback(msg.id, "helpful")}>👍</button>
            <button onClick={() => onFeedback(msg.id, "unclear")}>🤨</button>
            <button onClick={() => onFeedback(msg.id, "reformulate")}>🔁</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatView;
