import React, { useState, useEffect } from 'react';
import { TextField, SelectField } from '../FormFields/FormFields';
import { XIcon } from '../icons';
import { Site } from '../../data/sites';
import '../EditUserPanel/EditUserPanel.css';
import './EditSitePanel.css';

const TIMEZONE_OPTIONS = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Phoenix',
  'America/Chicago',
  'America/New_York',
  'America/Anchorage',
  'Pacific/Honolulu',
];

interface EditSitePanelProps {
  site: Site | null;
  onClose: () => void;
  onSave: (updated: Site) => void;
}

interface FormState {
  name: string;
  timezone: string;
}

function formFromSite(s: Site): FormState {
  return { name: s.name, timezone: s.timezone };
}

function isDirty(original: Site, form: FormState): boolean {
  return form.name !== original.name || form.timezone !== original.timezone;
}

function isValid(form: FormState): boolean {
  return form.name.trim() !== '' && form.timezone !== '';
}

export function EditSitePanel({ site, onClose, onSave }: EditSitePanelProps) {
  const [form, setForm] = useState<FormState>(() =>
    site ? formFromSite(site) : { name: '', timezone: '' }
  );

  useEffect(() => {
    if (site) setForm(formFromSite(site));
  }, [site]);

  useEffect(() => {
    if (!site) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [site]);

  if (!site) return null;

  function set<K extends keyof FormState>(key: K) {
    return (val: FormState[K]) => setForm(f => ({ ...f, [key]: val }));
  }

  const canSave = isDirty(site, form) && isValid(form);

  function handleSave() {
    if (!canSave) return;
    onSave({ ...site!, name: form.name, timezone: form.timezone });
    onClose();
  }

  return (
    <>
      <div className="edit-panel-overlay" onClick={onClose} />
      <div className="edit-panel edit-site-panel" role="dialog" aria-modal="true" aria-labelledby="edit-site-title">
        {/* Header */}
        <div className="edit-site-panel__header">
          <div className="edit-panel__close-row">
            <button className="edit-panel__close" onClick={onClose} aria-label="Close">
              <XIcon size={20} color="currentColor" />
            </button>
          </div>
          <div className="edit-site-panel__title-block">
            <h2 id="edit-site-title" className="edit-site-panel__title">Edit Site</h2>
            <p className="edit-site-panel__subtitle">Update the site details</p>
          </div>
          <div className="edit-panel__separator" />
        </div>

        {/* Body */}
        <div className="edit-panel__body">
          <TextField
            label="Site Name *"
            value={form.name}
            onChange={set('name')}
            placeholder="Site name"
          />
          <SelectField
            label="Timezone *"
            options={TIMEZONE_OPTIONS}
            value={form.timezone}
            onChange={set('timezone')}
            placeholder="Select timezone"
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
