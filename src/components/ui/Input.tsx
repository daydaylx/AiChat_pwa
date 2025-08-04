import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isFullWidth?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

/**
 * Input component that follows the design system
 * 
 * @param label - The label for the input
 * @param error - Error message to display
 * @param helperText - Helper text to display below the input
 * @param isFullWidth - Whether the input should take full width of its container
 * @param leftElement - Element to display on the left side of the input
 * @param rightElement - Element to display on the right side of the input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isFullWidth = true,
      leftElement,
      rightElement,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    // Handle error state styles
    const hasError = !!error;
    
    return (
      <div className={`form-group ${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {leftElement}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              form-control
              ${hasError ? 'border-red-500' : ''}
              ${leftElement ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
          
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        
        {hasError && (
          <div id={`${inputId}-error`} className="form-error">
            {error}
          </div>
        )}
        
        {helperText && !hasError && (
          <div id={`${inputId}-helper`} className="form-text">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
