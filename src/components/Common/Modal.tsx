import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../assets/icons';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, onClose, children }: ModalProps) => {
  // `createPortal` rendert das Modal außerhalb der normalen DOM-Hierarchie,
  // um z-index-Probleme zu vermeiden.
  return createPortal(
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Schließen">
            <CloseIcon />
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body // Das Modal wird direkt in den `body` eingefügt.
  );
};
