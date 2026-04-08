import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn__icon">{icon}</span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
}
