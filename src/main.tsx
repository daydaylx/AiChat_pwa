import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { SessionProvider } from './contexts/SessionContext';
import './styles/global.css';
import './styles/themes.css';

const root = document.getElementById('root');
if (!root) throw new Error('Kein #root-Element gefunden!');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <SettingsProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </SettingsProvider>
  </React.StrictMode>
);
