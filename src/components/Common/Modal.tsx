import React, { ReactNode, useEffect, useRef } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: number | string;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title, width = 400 }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        tabIndex={-1}
        ref={modalRef}
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <span className={styles.title}>{title}</span>}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >×</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
