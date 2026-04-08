import React from 'react';
import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className={`switch ${disabled ? 'switch--disabled' : ''}`}>
      <input
        type="checkbox"
        className="switch__input"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="switch__track">
        <span className="switch__thumb" />
      </span>
      {label && <span className="switch__label">{label}</span>}
    </label>
  );
}
