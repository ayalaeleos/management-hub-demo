import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
}

export function Input({
  label,
  prefixIcon,
  suffixIcon,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''} ${className}`}>
      {label && <label className="input-label" htmlFor={inputId}>{label}</label>}
      <div className="input-field">
        {prefixIcon && <span className="input-icon input-icon--prefix">{prefixIcon}</span>}
        <input
          id={inputId}
          className="input-element"
          {...props}
        />
        {suffixIcon && <span className="input-icon input-icon--suffix">{suffixIcon}</span>}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
