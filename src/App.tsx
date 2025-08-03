import { useContext } from 'react';
import { SettingsContext } from './contexts/SettingsContext';
import { SessionContext } from './contexts/SessionContext';
import { Layout } from './components/Layout/Layout';

export function App() {
  // (Später für Routing, Theme-Reset etc. – jetzt reicht blank)
  return <Layout />;
}
