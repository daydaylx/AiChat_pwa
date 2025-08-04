import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button component that follows the design system
 * 
 * @param variant - The visual style of the button
 * @param size - The size of the button
 * @param isFullWidth - Whether the button should take full width of its container
 * @param isLoading - Whether to show a loading spinner
 * @param leftIcon - Icon to display on the left side
 * @param rightIcon - Icon to display on the right side
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  // Combine class names based on props
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    isFullWidth && 'btn-full',
    (disabled || isLoading) && 'btn-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className={`loader loader-${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} mr-2`} />
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      {children}
      
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
