import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isFullWidth?: boolean;
  isResizable?: boolean;
}

/**
 * TextArea component that follows the design system
 * 
 * @param label - The label for the textarea
 * @param error - Error message to display
 * @param helperText - Helper text to display below the textarea
 * @param isFullWidth - Whether the textarea should take full width of its container
 * @param isResizable - Whether the textarea should be resizable
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      isFullWidth = true,
      isResizable = true,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    
    // Handle error state styles
    const hasError = !!error;
    
    return (
      <div className={`form-group ${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            form-control
            ${hasError ? 'border-red-500' : ''}
            ${!isResizable ? 'resize-none' : ''}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...rest}
        />
        
        {hasError && (
          <div id={`${textareaId}-error`} className="form-error">
            {error}
          </div>
        )}
        
        {helperText && !hasError && (
          <div id={`${textareaId}-helper`} className="form-text">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
