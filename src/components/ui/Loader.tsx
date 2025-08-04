import React from 'react';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  className?: string;
  label?: string;
}

/**
 * Loader/spinner component that follows the design system
 * 
 * @param size - Size of the loader
 * @param className - Additional class names
 * @param label - Accessible label for screen readers
 */
export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  className = '',
  label = 'Loading...',
}) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`loader loader-${size} ${className}`}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};
