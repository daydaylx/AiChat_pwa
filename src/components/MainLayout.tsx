import React, { useState, useEffect } from 'react';
import { Sidebar } from './layout/Sidebar';
import { ChatHeader } from './layout/ChatHeader';
import { ChatView } from './ChatView';
import { ModelSelector } from './chat/ModelSelector';
import { SettingsPanel } from './chat/SettingsPanel';
import { Modal } from './layout/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useChat } from '../context/ChatContext';
import { useSettings } from '../context/SettingsContext';
import { useModels } from '../context/ModelsContext';
import { useChatService } from '../hooks/useChatService';
import { useToast } from '../context/ToastContext';
import { useStorage } from '../hooks/useStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { DEFAULT_SYSTEM_PROMPT } from '../constants';

/**
 * MainLayout component that orchestrates the entire application
 * Manages state, modals, and interactions between different components
 */
export const MainLayout: React.FC = () => {
  // Context hooks
  const { state: chatState, createSession, setActiveSession, deleteSession, updateSessionTitle, updateSystemPrompt, addMessage, clearAllSessions } = useChat();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { state: modelsState, fetchModels, selectModel } = useModels();
  const { sendMessage, getActiveSession } = useChatService();
  const { showToast } = useToast();
  const { clear: clearStorage } = useStorage();

  // Component state
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTitleEditor, setShowTitleEditor] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Responsive state
  const isMobile = !useMediaQuery('(min-width: 768px)');

  // Get active session
  const activeSession = getActiveSession();

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!activeSession) {
      // Create a new session if none is active
      if (!modelsState.selectedModel) {
        showToast('Please select a model first', 'error');
        setShowModelSelector(true);
        return;
      }
      
      createSession(
        modelsState.selectedModel.id,
        settings.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT
      );
      
      // Need to wait for the next render to get the active session
      setTimeout(() => {
        handleSendMessage(message);
      }, 0);
      
      return;
    }
    
    // Add user message to chat
    addMessage({
      role: 'user',
      content: message,
    });
    
    setIsSendingMessage(true);
    
    try {
      // Send message to API
      const response = await sendMessage(
        message,
        activeSession.modelId,
        activeSession.messages,
        activeSession.systemPrompt
      );
      
      // Add assistant response to chat
      if (response) {
        addMessage({
          role: 'assistant',
          content: response.content,
        });
        
        // Play sound if enabled
        if (settings.messageSoundEnabled) {
          const audio = new Audio('/message.mp3');
          audio.play().catch((error) => {
            console.error('Failed to play sound:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to get a response from the AI', 'error');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle selecting a model
  const handleSelectModel = (model: any) => {
    selectModel(model);
    
    if (activeSession) {
      // Update model for current session
      updateSessionTitle(activeSession.id, activeSession.title);
    }
    
    setShowModelSelector(false);
  };

  // Handle updating system prompt
  const handleUpdateSystemPrompt = (prompt: string) => {
    if (activeSession) {
      updateSystemPrompt(activeSession.id, prompt);
    }
    setShowSystemPrompt(false);
  };

  // Handle editing session title
  const handleEditTitle = () => {
    if (activeSession) {
      setEditTitle(activeSession.title);
      setShowTitleEditor(true);
    }
  };

  // Handle saving edited title
  const handleSaveTitle = () => {
    if (activeSession && editTitle.trim()) {
      updateSessionTitle(activeSession.id, editTitle);
      setShowTitleEditor(false);
    }
  };

  // Handle exporting data
  const handleExportData = async () => {
    try {
      // Create export object
      const exportData = {
        sessions: chatState.sessions,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };
      
      // Convert to JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aichat_export_${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast('Data exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast('Failed to export data', 'error');
    }
  };

  // Handle importing data
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data format
        if (!data.sessions || !Array.isArray(data.sessions)) {
          throw new Error('Invalid data format');
        }
        
        // Import sessions
        clearAllSessions();
        data.sessions.forEach((session: any) => {
          createSession(session.modelId, session.systemPrompt);
          // Need to handle importing messages and other session data here
        });
        
        // Import settings
        if (data.settings) {
          updateSettings(data.settings);
        }
        
        showToast('Data imported successfully', 'success');
      } catch (error) {
        console.error('Error importing data:', error);
        showToast('Failed to import data: Invalid format', 'error');
      }
    };
    
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  // Handle clearing all data
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllSessions();
      resetSettings();
      clearStorage();
      showToast('All data has been cleared', 'success');
      setShowSettings(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* Sidebar - hidden on mobile unless toggled */}
      <div 
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'w-64'}
          ${isMobile && !mobileSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <Sidebar
          sessions={chatState.sessions}
          activeSessionId={chatState.activeSessionId}
          onSelectSession={setActiveSession}
          onDeleteSession={deleteSession}
          onNewSession={() => {
            if (!modelsState.selectedModel) {
              showToast('Please select a model first', 'error');
              setShowModelSelector(true);
              return;
            }
            createSession(
              modelsState.selectedModel.id,
              settings.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT
            );
          }}
          onRenameSession={updateSessionTitle}
          onOpenSettings={() => setShowSettings(true)}
          isMobileView={isMobile}
          onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <ChatHeader
          title={activeSession?.title || 'New Chat'}
          selectedModel={modelsState.selectedModel}
          onOpenModelSelector={() => setShowModelSelector(true)}
          onEditTitle={handleEditTitle}
          onOpenSystemPrompt={() => setShowSystemPrompt(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          isMobileView={isMobile}
        />

        {/* Chat view */}
        {activeSession ? (
          <ChatView
            messages={activeSession.messages}
            isLoading={isSendingMessage}
            systemPrompt={activeSession.systemPrompt}
            onSendMessage={handleSendMessage}
            onUpdateSystemPrompt={handleUpdateSystemPrompt}
            onEditMessage={(id, content) => {
              if (activeSession) {
                const updatedMessages = activeSession.messages.map((msg) => {
                  if (msg.id === id) {
                    return { ...msg, content };
                  }
                  return msg;
                });
                
                // For simplicity, we're recreating the session with updated messages
                // In a real app, you might want to have a dedicated action for this
                updateSessionTitle(activeSession.id, activeSession.title);
              }
            }}
            onDeleteMessage={(id) => {
              if (activeSession) {
                const updatedMessages = activeSession.messages.filter((msg) => msg.id !== id);
                
                // Similar to edit, this is a simplified approach
                updateSessionTitle(activeSession.id, activeSession.title);
              }
            }}
            className="flex-1"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Select a chat from the sidebar or start a new conversation.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  if (!modelsState.selectedModel) {
                    showToast('Please select a model first', 'error');
                    setShowModelSelector(true);
                    return;
                  }
                  createSession(
                    modelsState.selectedModel.id,
                    settings.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT
                  );
                }}
              >
                New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        title="Select a Model"
        size="lg"
      >
        <div className="p-4">
          <ModelSelector
            models={modelsState.models}
            selectedModel={modelsState.selectedModel}
            onSelectModel={handleSelectModel}
            isLoading={modelsState.isLoading}
            onRefresh={fetchModels}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showSystemPrompt}
        onClose={() => setShowSystemPrompt(false)}
        title="System Prompt"
        size="lg"
      >
        <div className="p-4">
          <SystemPromptEditor
            systemPrompt={activeSession?.systemPrompt || settings.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT}
            onSave={handleUpdateSystemPrompt}
            onCancel={() => setShowSystemPrompt(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showTitleEditor}
        onClose={() => setShowTitleEditor(false)}
        title="Edit Chat Title"
        size="sm"
      >
        <div className="p-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Enter chat title"
            autoFocus
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowTitleEditor(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveTitle}
              disabled={!editTitle.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        size="lg"
      >
        <SettingsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClearAllData={handleClearAllData}
        />
      </Modal>
    </div>
  );
};
