import { useContext } from 'react';
import { SessionContext } from '../../contexts/SessionContext';
import { SessionItem } from './SessionItem';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '../../assets/icons';
import styles from './SessionManager.module.css';

interface SessionManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionManager = ({ isOpen, onClose }: SessionManagerProps) => {
  const { t } = useTranslation();
  const sessionCtx = useContext(SessionContext);
  if (!sessionCtx) return null;

  const { sessions, activeSessionId, createNewSession, setActiveSessionId } = sessionCtx;
  
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    onClose(); // Schließt die Sidebar nach Auswahl auf Mobile
  };

  return (
    <>
      <aside className={`${styles.sessionManager} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>{t('session_manager_title')}</h2>
          <button onClick={createNewSession} className={styles.newChatButton}>
            <AddIcon />
            {t('new_chat_button')}
          </button>
        </div>
        <div className={styles.sessionList}>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onSelect={() => handleSelectSession(session.id)}
              />
            ))
          ) : (
            <p className={styles.noSessions}>{t('default_session_title')}</p>
          )}
        </div>
      </aside>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
    </>
  );
};
