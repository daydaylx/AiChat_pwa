import React from 'react';
import { ChatSession } from '../../types';
import styles from './SessionItem.module.css';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({ session, isActive, onClick }) => (
  <div
    className={`${styles.sessionItem} ${isActive ? styles.active : ''}`}
    onClick={onClick}
  >
    <span className={styles.avatar}>{session.avatar ? session.avatar : '💬'}</span>
    <span className={styles.title}>{session.title}</span>
  </div>
);
