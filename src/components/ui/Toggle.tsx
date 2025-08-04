import React from 'react';

interface ToggleProps {
  id?: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Toggle switch component that follows the design system
 * 
 * @param id - HTML ID for the toggle input
 * @param isChecked - Whether the toggle is checked
 * @param onChange - Callback when toggle state changes
 * @param label - Label text for the toggle
 * @param disabled - Whether the toggle is disabled
 * @param className - Additional class names
 */
export const Toggle: React.FC<ToggleProps> = ({
  id,
  isChecked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  // Generate a unique ID if not provided
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
        />
        <label
          htmlFor={toggleId}
          className={`
            block overflow-hidden h-6 rounded-full bg-neutral-300 cursor-pointer
            ${isChecked ? 'bg-primary-500' : 'bg-neutral-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span
            className={`
              block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
              ${isChecked ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </label>
      </div>
      {label && (
        <label 
          htmlFor={toggleId} 
          className={`text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};
