import React from 'react';
import { SessionsList } from '../chat/SessionsList';
import { Button } from '../ui/Button';
import { ChatSession } from '../../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onRenameSession: (sessionId: string, title: string) => void;
  onOpenSettings: () => void;
  isMobileView?: boolean;
  onCloseMobileSidebar?: () => void;
  className?: string;
}

/**
 * Sidebar component for navigation and session management
 * 
 * @param sessions - Array of chat sessions
 * @param activeSessionId - ID of the active session
 * @param onSelectSession - Callback for when a session is selected
 * @param onDeleteSession - Callback for when a session is deleted
 * @param onNewSession - Callback for when a new session is created
 * @param onRenameSession - Callback for when a session is renamed
 * @param onOpenSettings - Callback for opening settings
 * @param isMobileView - Whether the sidebar is displayed on mobile
 * @param onCloseMobileSidebar - Callback for closing mobile sidebar
 * @param className - Additional class names
 */
export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  onRenameSession,
  onOpenSettings,
  isMobileView = false,
  onCloseMobileSidebar,
  className = '',
}) => {
  return (
    <aside 
      className={`
        flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800
        ${className}
      `}
    >
      {/* Header with title and close button for mobile */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Chat</h1>
        
        {isMobileView && onCloseMobileSidebar && (
          <Button
            variant="ghost"
            onClick={onCloseMobileSidebar}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
      
      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-4">
        <SessionsList
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(sessionId) => {
            onSelectSession(sessionId);
            if (isMobileView && onCloseMobileSidebar) {
              onCloseMobileSidebar();
            }
          }}
          onDeleteSession={onDeleteSession}
          onNewSession={onNewSession}
          onRenameSession={onRenameSession}
        />
      </div>
      
      {/* Footer with settings button */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <Button
          variant="ghost"
          isFullWidth
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          onClick={() => {
            onOpenSettings();
            if (isMobileView && onCloseMobileSidebar) {
              onCloseMobileSidebar();
            }
          }}
        >
          Settings
        </Button>
      </div>
    </aside>
  );
};
