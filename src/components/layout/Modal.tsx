import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Modal component for displaying content in a dialog
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback for when the modal is closed
 * @param children - Content of the modal
 * @param title - Title of the modal
 * @param size - Size of the modal
 * @param className - Additional class names
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Determine modal width based on size
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'max-w-sm';
      break;
    case 'md':
      sizeClass = 'max-w-md';
      break;
    case 'lg':
      sizeClass = 'max-w-lg';
      break;
    case 'xl':
      sizeClass = 'max-w-xl';
      break;
    default:
      sizeClass = 'max-w-md';
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className={`
          bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full ${sizeClass} 
          transform transition-all slide-in-up
          ${className}
        `}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className={title ? '' : 'pt-4'}>
          {children}
        </div>
      </div>
    </div>
  );
};
