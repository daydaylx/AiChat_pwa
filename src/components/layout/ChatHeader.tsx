import React from 'react';
import { Button } from '../ui/Button';
import { AIModel } from '../../types';

interface ChatHeaderProps {
  title: string;
  selectedModel: AIModel | null;
  onOpenModelSelector: () => void;
  onEditTitle: () => void;
  onOpenSystemPrompt: () => void;
  onToggleSidebar: () => void;
  isMobileView?: boolean;
  className?: string;
}

/**
 * ChatHeader component for displaying the current chat title and actions
 * 
 * @param title - Title of the current chat
 * @param selectedModel - Currently selected AI model
 * @param onOpenModelSelector - Callback for opening model selector
 * @param onEditTitle - Callback for editing the chat title
 * @param onOpenSystemPrompt - Callback for opening system prompt editor
 * @param onToggleSidebar - Callback for toggling the sidebar
 * @param isMobileView - Whether displayed on mobile
 * @param className - Additional class names
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  selectedModel,
  onOpenModelSelector,
  onEditTitle,
  onOpenSystemPrompt,
  onToggleSidebar,
  isMobileView = false,
  className = '',
}) => {
  return (
    <header 
      className={`
        flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800
        ${className}
      `}
    >
      <div className="flex items-center">
        {isMobileView && (
          <Button
            variant="ghost"
            className="mr-2"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        )}
        
        <div className="flex items-center">
          <h2 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-xs">
            {title}
          </h2>
          <button
            onClick={onEditTitle}
            className="ml-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Edit title"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSystemPrompt}
          aria-label="System prompt"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="ml-1 hidden sm:inline">Prompt</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenModelSelector}
          aria-label="Select model"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="ml-1 hidden sm:inline">
            {selectedModel ? (
              <span className="truncate max-w-[100px] inline-block align-bottom">
                {selectedModel.name}
              </span>
            ) : (
              'Model'
            )}
          </span>
        </Button>
      </div>
    </header>
  );
};
