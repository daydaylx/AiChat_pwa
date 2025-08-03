import React from 'react';
import Layout from './components/Layout/Layout';  // Changed: default import
import { SessionProvider } from './contexts/SessionContext';
import { SettingsProvider } from './contexts/SettingsContext';

export default function App() {  // Changed: default export
  return (
    <SettingsProvider>
      <SessionProvider>
        <Layout />
      </SessionProvider>
    </SettingsProvider>
  );
}
