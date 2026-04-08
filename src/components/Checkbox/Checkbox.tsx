import React from 'react';
import './Checkbox.css';

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked = false, indeterminate = false, onChange, label, disabled, className = '' }: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`checkbox ${disabled ? 'checkbox--disabled' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span className="checkbox__box" />
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
}
