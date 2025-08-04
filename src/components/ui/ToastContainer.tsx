import React from 'react';
import { Toast as ToastComponent } from './Toast';
import { useToast } from '../../context/ToastContext';

/**
 * Container for displaying toast notifications
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  
  if (toasts.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};
