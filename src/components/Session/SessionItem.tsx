import { ChatSession } from '../../types';
import styles from './SessionItem.module.css';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
}

export const SessionItem = ({ session, isActive, onSelect }: SessionItemProps) => {
  return (
    <button
      className={`${styles.sessionItem} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
      role="menuitem"
      aria-current={isActive}
    >
      <span className={styles.avatar}>{session.avatar}</span>
      <span className={styles.title}>{session.title}</span>
    </button>
  );
};
