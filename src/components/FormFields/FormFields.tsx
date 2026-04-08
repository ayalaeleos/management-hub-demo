import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XIcon } from '../icons';
import './FormFields.css';

// ── Text input ────────────────────────────────────────────────────────────────
interface TextFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextField({ label, hint, value, onChange, placeholder, type = 'text' }: TextFieldProps) {
  return (
    <div className="ff-field">
      <div className="ff-field__label-block">
        <span className="ff-field__label">{label}</span>
        {hint && <span className="ff-field__hint">{hint}</span>}
      </div>
      <input
        className="ff-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// ── Single select ─────────────────────────────────────────────────────────────
interface SelectFieldProps {
  label: string;
  hint?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SelectField({ label, hint, options, value, onChange, placeholder }: SelectFieldProps) {
  return (
    <div className="ff-field">
      <div className="ff-field__label-block">
        <span className="ff-field__label">{label}</span>
        {hint && <span className="ff-field__hint">{hint}</span>}
      </div>
      <div className="ff-select-wrapper">
        <select
          className="ff-select"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ color: value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <span className="ff-select-chevron">
          <ChevronDownIcon size={20} color="currentColor" />
        </span>
      </div>
    </div>
  );
}

// ── Multi-select with chips ───────────────────────────────────────────────────
interface MultiSelectFieldProps {
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

export function MultiSelectField({ label, hint, options, selected, onChange, placeholder = 'Select...' }: MultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(r => r !== opt) : [...selected, opt]);
  }

  function removeChip(opt: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(selected.filter(r => r !== opt));
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();
    onChange([]);
  }

  return (
    <div className="ff-field">
      <div className="ff-field__label-block">
        <span className="ff-field__label">{label}</span>
        {hint && <span className="ff-field__hint">{hint}</span>}
      </div>
      <div className="ff-dropdown-wrapper" ref={ref}>
        <button
          type="button"
          className={`ff-multi-trigger${open ? ' ff-multi-trigger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          {selected.length === 0 ? (
            <span className="ff-multi-placeholder">{placeholder}</span>
          ) : (
            <div className="ff-chips">
              {selected.map(opt => (
                <span key={opt} className="ff-chip">
                  <span className="ff-chip__label">{opt}</span>
                  <button className="ff-chip__remove" onClick={e => removeChip(opt, e)} aria-label={`Remove ${opt}`}>
                    <XIcon size={10} color="currentColor" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="ff-multi-actions">
            {selected.length > 0 && (
              <button className="ff-multi-clear" onClick={clearAll}>Clear all</button>
            )}
            <span className={`ff-multi-chevron${open ? ' ff-multi-chevron--open' : ''}`}>
              <ChevronDownIcon size={16} color="currentColor" />
            </span>
          </div>
        </button>

        {open && (
          <div className="ff-dropdown" role="listbox" aria-multiselectable="true">
            {options.map(opt => (
              <div
                key={opt}
                className={`ff-dropdown-option${selected.includes(opt) ? ' ff-dropdown-option--selected' : ''}`}
                role="option"
                aria-selected={selected.includes(opt)}
                onClick={() => toggle(opt)}
              >
                <span className="ff-check" />
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
