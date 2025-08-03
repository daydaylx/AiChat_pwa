import { useContext, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';
import { SettingsModal } from '../Settings/SettingsModal';
import { MenuIcon, SettingsIcon } from '../../assets/icons';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const sessionCtx = useContext(SessionContext);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const activeSessionTitle = sessionCtx?.activeSession?.title || 'PersonaChat';

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.iconButton}
          onClick={onMenuClick}
          aria-label="Öffne Chat-Menü"
        >
          <MenuIcon />
        </button>
        <h1 className={styles.title}>{activeSessionTitle}</h1>
        <button
          className={styles.iconButton}
          onClick={() => setSettingsOpen(true)}
          aria-label="Öffne Einstellungen"
        >
          <SettingsIcon />
        </button>
      </header>
      {isSettingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
};
