import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { Settings, Theme } from '../../types';
import { DEFAULT_SYSTEM_PROMPT } from '../../constants';
import { SystemPromptEditor } from './SystemPromptEditor';

interface SettingsPanelProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onClose?: () => void;
  onExportData?: () => void;
  onImportData?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAllData?: () => void;
  className?: string;
}

/**
 * SettingsPanel component for configuring application settings
 * Includes API key, theme, sound, and data management options
 * 
 * @param settings - Current settings
 * @param onUpdateSettings - Callback for when settings are updated
 * @param onClose - Callback for when the panel is closed
 * @param onExportData - Callback for exporting data
 * @param onImportData - Callback for importing data
 * @param onClearAllData - Callback for clearing all data
 * @param className - Additional class names
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onExportData,
  onImportData,
  onClearAllData,
  className = '',
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'prompt' | 'data'>('general');
  
  // Handle theme change
  const handleThemeChange = (theme: Theme) => {
    onUpdateSettings({ theme });
  };
  
  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ apiKey: e.target.value });
  };
  
  // Handle system prompt change
  const handleSystemPromptChange = (prompt: string) => {
    onUpdateSettings({ defaultSystemPrompt: prompt });
  };
  
  // Handle sound toggle
  const handleSoundToggle = (enabled: boolean) => {
    onUpdateSettings({ messageSoundEnabled: enabled });
  };
  
  // Function to trigger file download
  const downloadFile = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Handle export data
  const handleExportData = () => {
    if (onExportData) {
      onExportData();
    }
  };
  
  return (
    <Card className={`settings-panel ${className}`}>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Settings</h2>
        {onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </CardHeader>
      
      {/* Tabs */}
      <div className="px-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-1 border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`py-2 px-1 border-b-2 transition-colors ${
              activeTab === 'prompt'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
            onClick={() => setActiveTab('prompt')}
          >
            System Prompt
          </button>
          <button
            className={`py-2 px-1 border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>
      </div>
      
      <CardBody>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* API Key */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">OpenRouter API Key</h3>
              <p className="text-sm text-neutral-500">
                Your API key for OpenRouter. This is stored locally and never sent anywhere else.
              </p>
              <div className="relative">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your OpenRouter API key"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-neutral-500"
                    >
                      {showApiKey ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>
              <div className="text-sm text-neutral-500">
                
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline dark:text-primary-400"
                >
                  Get your OpenRouter API key here
                </a>
              </div>
            </div>
            
            {/* Theme */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Theme</h3>
              <p className="text-sm text-neutral-500">
                Choose your preferred theme.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant={settings.theme === 'light' ? 'primary' : 'neutral'}
                  onClick={() => handleThemeChange('light')}
                >
                  Light
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'primary' : 'neutral'}
                  onClick={() => handleThemeChange('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={settings.theme === 'system' ? 'primary' : 'neutral'}
                  onClick={() => handleThemeChange('system')}
                >
                  System
                </Button>
              </div>
            </div>
            
            {/* Sound */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Sound</h3>
              <p className="text-sm text-neutral-500">
                Enable or disable sound notifications.
              </p>
              <Toggle
                isChecked={settings.messageSoundEnabled}
                onChange={handleSoundToggle}
                label="Play sound when messages are received"
              />
            </div>
          </div>
        )}
        
        {/* System Prompt Settings */}
        {activeTab === 'prompt' && (
          <SystemPromptEditor
            systemPrompt={settings.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT}
            onSave={handleSystemPromptChange}
          />
        )}
        
        {/* Data Management */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Export & Import</h3>
              <p className="text-sm text-neutral-500">
                Backup your chats and settings or restore from a previous backup.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={handleExportData}
                >
                  Export Data
                </Button>
                
                <label className="relative">
                  <Button variant="neutral">
                    Import Data
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={onImportData}
                  />
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Clear Data</h3>
              <p className="text-sm text-neutral-500">
                Permanently delete all your chats and settings. This cannot be undone.
              </p>
              <Button
                variant="danger"
                onClick={onClearAllData}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        )}
      </CardBody>
      
      <CardFooter className="flex justify-end">
        {onClose && (
          <Button
            variant="primary"
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
