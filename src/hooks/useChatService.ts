import { useCallback } from 'react';
import { Message, OpenRouterCompletionRequest } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { useChat } from '../context/ChatContext';

export const useChatService = () => {
  const { settings } = useSettings();
  const { showToast } = useToast();
  const { state: chatState } = useChat();

  const sendMessage = useCallback(
    async (
      userMessage: string,
      modelId: string,
      messageHistory: Message[],
      systemPrompt: string
    ): Promise<Message | null> => {
      if (!settings.apiKey) {
        showToast('API key is required. Please add your OpenRouter API key in settings.', 'error');
        return null;
      }

      try {
        // Prepare messages for API request
        const messages = [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messageHistory.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: userMessage },
        ];

        // Prepare request body
        const requestBody: OpenRouterCompletionRequest = {
          model: modelId,
          messages: messages,
          max_tokens: 4000, // Default, will be overridden by model's max if lower
          temperature: 0.7,
          top_p: 1,
          stream: false,
        };

        // Make API request
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AiChat PWA',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to get response');
        }

        const data = await response.json();

        // Extract assistant response
        if (data.choices && data.choices.length > 0) {
          const assistantMessage = data.choices[0].message;
          return {
            id: data.id,
            role: assistantMessage.role,
            content: assistantMessage.content,
            timestamp: Date.now(),
          };
        } else {
          throw new Error('No response from assistant');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send message';
        showToast(message, 'error');
        console.error('Error sending message:', error);
        return null;
      }
    },
    [settings.apiKey, showToast]
  );

  const getActiveSession = useCallback(() => {
    if (!chatState.activeSessionId) {
      return null;
    }
    return chatState.sessions.find((s) => s.id === chatState.activeSessionId) || null;
  }, [chatState.activeSessionId, chatState.sessions]);

  return {
    sendMessage,
    getActiveSession,
  };
};
