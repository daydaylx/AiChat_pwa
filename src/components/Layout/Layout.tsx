import { useContext, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { Header } from './Header';
import { SessionManager } from '../Session/SessionManager';
import { ChatView } from '../Chat/ChatView';
import styles from './Layout.module.css';

export const Layout = () => {
  const sessionCtx = useContext(SessionContext);
  const settingsCtx = useContext(SettingsContext);
  const [isSessionManagerOpen, setSessionManagerOpen] = useState(false);

  if (!sessionCtx || !settingsCtx) {
    return <div>Wird geladen...</div>;
  }

  const { activeSession, isLoading } = sessionCtx;

  return (
    <div className={styles.layout}>
      {/* Sidebar / SessionManager */}
      <SessionManager 
        isOpen={isSessionManagerOpen} 
        onClose={() => setSessionManagerOpen(false)} 
      />

      <main className={styles.mainContent}>
        {/* Header */}
        <Header onMenuClick={() => setSessionManagerOpen(true)} />

        {/* Chat */}
        {isLoading ? (
          <div className={styles.centeredMessage}>Lade Chats...</div>
        ) : activeSession ? (
          <ChatView key={activeSession.id} session={activeSession} />
        ) : (
          <div className={styles.centeredMessage}>
            Kein Chat ausgewählt. Erstelle einen neuen Chat!
          </div>
        )}
      </main>
    </div>
  );
};
