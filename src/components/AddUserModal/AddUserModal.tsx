import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XIcon } from '../icons';
import './AddUserModal.css';

const ROLE_OPTIONS = ['Admin', 'Supervisor', 'Clinician'];
const PROFESSION_OPTIONS = ['Therapist', 'Psychiatrist', 'Case Manager', 'Social Worker', 'Counselor'];
const SITE_OPTIONS = ['Westside Main Campus', 'Eastside Clinic', 'Northside Center', 'Southside Office'];
const PROGRAM_OPTIONS = ['Adult Outpatient', 'Intensive Outpatient', 'Child & Adolescent', 'Crisis Stabilization', 'Substance Use'];

interface FormState {
  fullName: string;
  roles: string[];
  email: string;
  phone: string;
  profession: string;
  site: string;
  program: string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: FormState) => void;
}

// Multi-select dropdown component
function MultiSelectField({
  label,
  hint,
  options,
  selected,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggleOption(opt: string) {
    onChange(
      selected.includes(opt) ? selected.filter(r => r !== opt) : [...selected, opt]
    );
  }

  const displayValue = selected.length > 0 ? selected.join(', ') : null;

  return (
    <div className="form-field">
      <div className="form-field__label-block">
        <span className="form-field__label">{label}</span>
        {hint && <span className="form-field__hint">{hint}</span>}
      </div>
      <div className="form-select-wrapper" ref={wrapperRef}>
        <button
          type="button"
          className={`form-select-trigger${open ? ' form-select-trigger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={`form-select-trigger__value${displayValue ? ' form-select-trigger__value--filled' : ''}`}>
            {displayValue ?? placeholder}
          </span>
          <span className={`form-select-trigger__chevron${open ? ' form-select-trigger__chevron--open' : ''}`}>
            <ChevronDownIcon size={20} color="currentColor" />
          </span>
        </button>
        {open && (
          <div className="form-select-dropdown" role="listbox" aria-multiselectable="true">
            {options.map(opt => (
              <div
                key={opt}
                className={`form-select-option${selected.includes(opt) ? ' form-select-option--selected' : ''}`}
                role="option"
                aria-selected={selected.includes(opt)}
                onClick={() => toggleOption(opt)}
              >
                <span className="form-select-option__check" />
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Single-select native dropdown
function SelectField({
  label,
  hint,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  return (
    <div className="form-field">
      <div className="form-field__label-block">
        <span className="form-field__label">{label}</span>
        {hint && <span className="form-field__hint">{hint}</span>}
      </div>
      <div className="form-select-native-wrapper">
        <select
          className="form-select-native"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ color: value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="form-select-native__chevron">
          <ChevronDownIcon size={20} color="currentColor" />
        </span>
      </div>
    </div>
  );
}

// Text input field
function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="form-field">
      <div className="form-field__label-block">
        <span className="form-field__label">{label}{required ? ' *' : ''}</span>
        {hint && <span className="form-field__hint">{hint}</span>}
      </div>
      <input
        className="form-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function AddUserModal({ open, onClose, onSave }: AddUserModalProps) {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    roles: [],
    email: '',
    phone: '',
    profession: '',
    site: '',
    program: '',
  });

  // Reset form on open
  useEffect(() => {
    if (open) {
      setForm({ fullName: '', roles: [], email: '', phone: '', profession: '', site: '', program: '' });
    }
  }, [open]);

  // Block body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isValid =
    form.fullName.trim() !== '' &&
    form.roles.length > 0 &&
    form.email.trim() !== '' &&
    form.profession !== '' &&
    form.site !== '' &&
    form.program !== '';

  function set<K extends keyof FormState>(key: K) {
    return (val: FormState[K]) => setForm(f => ({ ...f, [key]: val }));
  }

  function handleSave() {
    if (!isValid) return;
    onSave(form);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="add-user-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="add-user-modal" role="dialog" aria-modal="true" aria-labelledby="add-user-title">

        {/* Header */}
        <div className="add-user-modal__header">
          <div className="add-user-modal__close-row">
            <button className="add-user-modal__close" onClick={onClose} aria-label="Close">
              <XIcon size={20} color="currentColor" />
            </button>
          </div>
          <h2 id="add-user-title" className="add-user-modal__title">Add New User</h2>
          <p className="add-user-modal__subtitle">Enter the user's details below to add them to the system.</p>
        </div>

        {/* Scrollable fields */}
        <div className="add-user-modal__body">
          <TextField
            label="Full Name *"
            value={form.fullName}
            onChange={set('fullName')}
            placeholder="Sarah Johnson"
            required={false}
          />

          <MultiSelectField
            label="Role *"
            hint="You can select more than one role"
            options={ROLE_OPTIONS}
            selected={form.roles}
            onChange={set('roles')}
            placeholder="Select Role"
          />

          <TextField
            label="Email Address *"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder=""
            required={false}
          />

          <TextField
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="Enter phone number"
          />

          <SelectField
            label="Profession *"
            hint="This impacts the terminology and phrasing used in Eleos suggestions"
            options={PROFESSION_OPTIONS}
            value={form.profession}
            onChange={set('profession')}
            placeholder="Therapist"
          />

          <SelectField
            label="Site *"
            options={SITE_OPTIONS}
            value={form.site}
            onChange={set('site')}
            placeholder="Westside Main Campus"
          />

          <SelectField
            label="Program *"
            options={PROGRAM_OPTIONS}
            value={form.program}
            onChange={set('program')}
            placeholder="Adult Outpatient"
          />
        </div>

        {/* Footer */}
        <div className="add-user-modal__footer">
          <button className="add-user-modal__btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`add-user-modal__btn-save${isValid ? ' add-user-modal__btn-save--enabled' : ''}`}
            onClick={handleSave}
            disabled={!isValid}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
