import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  helperText?: string;
  isFullWidth?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Select component that follows the design system
 * 
 * @param options - Array of options for the select
 * @param label - The label for the select
 * @param error - Error message to display
 * @param helperText - Helper text to display below the select
 * @param isFullWidth - Whether the select should take full width of its container
 * @param onChange - Callback when value changes
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      isFullWidth = true,
      onChange,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    
    // Handle error state styles
    const hasError = !!error;
    
    // Handle change event
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div className={`form-group ${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={`
            form-control
            ${hasError ? 'border-red-500' : ''}
            ${className}
          `}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {hasError && (
          <div id={`${selectId}-error`} className="form-error">
            {error}
          </div>
        )}
        
        {helperText && !hasError && (
          <div id={`${selectId}-helper`} className="form-text">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
