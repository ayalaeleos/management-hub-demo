import React, { useState, useEffect, useRef } from 'react';
import { TextField, SelectField, MultiSelectField } from '../FormFields/FormFields';
import { XIcon } from '../icons';
import { User } from '../../data/users';
import './EditUserPanel.css';

const ROLE_OPTIONS = ['Admin', 'Supervisor', 'Clinician'];
const PROFESSION_OPTIONS = ['Therapist', 'Psychiatrist', 'Case Manager', 'Social Worker', 'Counselor'];
const SITE_OPTIONS = ['Westside Main Campus', 'Eastside Clinic', 'Northside Center', 'Southside Office'];
const PROGRAM_OPTIONS = ['Adult Outpatient', 'Intensive Outpatient', 'Child & Adolescent', 'Crisis Stabilization', 'Substance Use'];

interface EditUserPanelProps {
  user: User | null;
  onClose: () => void;
  onSave: (updated: User) => void;
}

interface FormState {
  name: string;
  roles: string[];
  email: string;
  phone: string;
  profession: string;
  site: string;
  program: string;
}

function formFromUser(u: User): FormState {
  return {
    name: u.name,
    roles: [...u.roles],
    email: u.email,
    phone: '',
    profession: u.profession,
    site: u.site,
    program: u.program,
  };
}

function isDirty(original: User, form: FormState): boolean {
  return (
    form.name !== original.name ||
    form.email !== original.email ||
    form.profession !== original.profession ||
    form.site !== original.site ||
    form.program !== original.program ||
    form.roles.length !== original.roles.length ||
    form.roles.some(r => !original.roles.includes(r))
  );
}

function isValid(form: FormState): boolean {
  return (
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.roles.length > 0 &&
    form.profession !== '' &&
    form.site !== '' &&
    form.program !== ''
  );
}

export function EditUserPanel({ user, onClose, onSave }: EditUserPanelProps) {
  const [form, setForm] = useState<FormState>(() =>
    user ? formFromUser(user) : { name: '', roles: [], email: '', phone: '', profession: '', site: '', program: '' }
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) setForm(formFromUser(user));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [user]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!user) return null;

  function set<K extends keyof FormState>(key: K) {
    return (val: FormState[K]) => setForm(f => ({ ...f, [key]: val }));
  }

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...user!,
      name: form.name,
      roles: form.roles,
      email: form.email,
      profession: form.profession,
      site: form.site,
      program: form.program,
    });
    onClose();
  }

  const canSave = isDirty(user, form) && isValid(form);

  const primaryRole = user.roles[0] ?? '';

  return (
    <>
      <div className="edit-panel-overlay" onClick={onClose} />
      <div className="edit-panel" role="dialog" aria-modal="true" aria-labelledby="edit-panel-name">
        {/* Header */}
        <div className="edit-panel__header">
          <div className="edit-panel__close-row">
            <button className="edit-panel__close" onClick={onClose} aria-label="Close">
              <XIcon size={20} color="currentColor" />
            </button>
          </div>

          <div className="edit-panel__identity">
            <div>
              <div className="edit-panel__name-row">
                <span id="edit-panel-name" className="edit-panel__name">{user.name}</span>
                {primaryRole && (
                  <span className="edit-panel__badge">
                    <span className="edit-panel__badge-text">{primaryRole}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="edit-panel__menu-wrapper" ref={menuRef}>
              <button
                className="edit-panel__more-btn"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="More options"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="16" r="1.5" fill="currentColor" />
                </svg>
              </button>
              {menuOpen && (
                <div className="edit-panel__menu">
                  <button
                    className="edit-panel__menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Reset password
                  </button>
                  <button
                    className="edit-panel__menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    {user.active ? 'Deactivate user' : 'Activate user'}
                  </button>
                  <button
                    className="edit-panel__menu-item edit-panel__menu-item--danger"
                    onClick={() => setMenuOpen(false)}
                  >
                    Delete user
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="edit-panel__email">{user.email}</p>
          <div className="edit-panel__separator" />
        </div>

        {/* Scrollable body */}
        <div className="edit-panel__body">
          <TextField
            label="Full Name"
            value={form.name}
            onChange={set('name')}
            placeholder="Full name"
          />

          <MultiSelectField
            label="Role"
            hint="You can select more than one role"
            options={ROLE_OPTIONS}
            selected={form.roles}
            onChange={set('roles')}
            placeholder="Select Role"
          />

          <TextField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="Email address"
          />

          <TextField
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="Enter phone number"
          />

          <SelectField
            label="Profession"
            hint="This impacts the terminology and phrasing used in Eleos suggestions"
            options={PROFESSION_OPTIONS}
            value={form.profession}
            onChange={set('profession')}
            placeholder="Select profession"
          />

          <SelectField
            label="Site"
            options={SITE_OPTIONS}
            value={form.site}
            onChange={set('site')}
            placeholder="Select site"
          />

          <SelectField
            label="Program"
            options={PROGRAM_OPTIONS}
            value={form.program}
            onChange={set('program')}
            placeholder="Select program"
          />
        </div>

        {/* Footer */}
        <div className="edit-panel__footer">
          <button className="edit-panel__btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`edit-panel__btn-save${canSave ? ' edit-panel__btn-save--enabled' : ''}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
