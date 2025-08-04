import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { SettingsProvider } from './SettingsContext';
import { ChatProvider } from './ChatContext';
import { ModelsProvider } from './ModelsContext';
import { ToastProvider } from './ToastContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ToastProvider>
          <ModelsProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </ModelsProvider>
        </ToastProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};
