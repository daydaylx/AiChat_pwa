import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './chat/MessageBubble';
import { ChatInput } from './chat/ChatInput';
import { SystemPromptEditor } from './chat/SystemPromptEditor';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './layout/Modal';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  systemPrompt: string;
  onSendMessage: (message: string) => void;
  onUpdateSystemPrompt: (prompt: string) => void;
  onEditMessage?: (id: string, content: string) => void;
  onDeleteMessage?: (id: string) => void;
  className?: string;
}

/**
 * ChatView component for displaying messages and input
 * 
 * @param messages - Array of chat messages
 * @param isLoading - Whether a message is being processed
 * @param systemPrompt - Current system prompt
 * @param onSendMessage - Callback for sending a message
 * @param onUpdateSystemPrompt - Callback for updating the system prompt
 * @param onEditMessage - Callback for editing a message
 * @param onDeleteMessage - Callback for deleting a message
 * @param className - Additional class names
 */
export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  systemPrompt,
  onSendMessage,
  onUpdateSystemPrompt,
  onEditMessage,
  onDeleteMessage,
  className = '',
}) => {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Hide welcome message when messages are present
  useEffect(() => {
    if (messages.length > 0 && showWelcomeMessage) {
      setShowWelcomeMessage(false);
    }
  }, [messages, showWelcomeMessage]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {showWelcomeMessage && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Start a conversation with the AI. Your chats are stored locally on your device.
            </p>
            <div className="flex justify-center mb-4">
              <Button
                variant="primary"
                onClick={() => setShowSystemPrompt(true)}
              >
                Customize System Prompt
              </Button>
            </div>
          </div>
        )}

        {/* Render messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            isLastMessage={index === messages.length - 1}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        placeholder="Type a message..."
      />

      {/* System prompt modal */}
      <Modal
        isOpen={showSystemPrompt}
        onClose={() => setShowSystemPrompt(false)}
        title="System Prompt"
        size="lg"
      >
        <SystemPromptEditor
          systemPrompt={systemPrompt}
          onSave={(prompt) => {
            onUpdateSystemPrompt(prompt);
            setShowSystemPrompt(false);
          }}
          onCancel={() => setShowSystemPrompt(false)}
        />
      </Modal>
    </div>
  );
};
