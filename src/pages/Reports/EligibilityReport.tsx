import { useState } from 'react';
import './EligibilityReport.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scenario {
  id: string;
  name: string;
  signalTitle: string;
  confidence: string;
  description: string;
  impact: string;
  evidence: string;
  actionText: string;
}

interface Opportunity {
  id: string;
  name: string;
  scenarioId: string | null;
  status: string;
  likelihood: string;
  signal: string;
  action: string;
}

interface CoverageRow {
  id: string;
  clientName: string;
  dob: string;
  clientType: string;
  status: string;
  details: string;
  action: string;
}

interface CodingOpp {
  id: string;
  date: string;
  clinician: string;
  type: string;
  program: string;
  originalCode: string;
  suggestedCode: string;
  confidence: string;
  reason: string;
  details: string;
  impact: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 'income',
    name: 'Income Change',
    signalTitle: 'Employment Status Change',
    confidence: 'Medium',
    description: 'Recent notes indicate potential changes in household income and employment status.',
    impact: 'Client may qualify for Medicaid Expansion based on new income signals.',
    evidence: '"...mentioned that they were let go from their warehouse shift last week..."',
    actionText: 'Review Income Verification',
  },
  {
    id: 'household',
    name: 'Household Size',
    signalTitle: 'Household Composition Change',
    confidence: 'High',
    description: 'Notes suggest an increase in household dependents which may affect FPL calculations.',
    impact: 'Increased household size may lower the income threshold for eligibility.',
    evidence: '"...stated that their sister and two nephews have moved into the apartment permanently..."',
    actionText: 'Update Household Info',
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy',
    signalTitle: 'Multi-Signal: Pregnancy + Income',
    confidence: 'High',
    description: 'Two signals detected:\n1. Pregnancy referenced in session.\n2. Income signals suggest <180% FPL.',
    impact: 'Combined signals indicate high likelihood of Medicaid re-enrollment.',
    evidence: 'Notes confirm pregnancy (due Nov). Financial assessment indicates income below 180% FPL threshold.',
    actionText: 'Initiate Re-enrollment',
  },
];

const OPPORTUNITIES: Opportunity[] = [
  { id: '8921', name: 'Sarah M.', scenarioId: 'income', status: 'Self-Pay', likelihood: 'Medium', signal: 'Income Loss Detected', action: 'Verify Income' },
  { id: '7741', name: 'Maria R.', scenarioId: 'pregnancy', status: 'Self-Pay', likelihood: 'High', signal: 'Pregnancy + <180% FPL', action: 'Re-enrollment' },
  { id: '9932', name: 'David L.', scenarioId: 'household', status: 'Self-Pay', likelihood: 'High', signal: 'Household Size + Income', action: 'Update Dependents' },
  { id: '8822', name: 'James K.', scenarioId: null, status: 'Self-Pay', likelihood: 'Verified', signal: 'Active BCBS Found', action: 'Update Payer' },
  { id: '9110', name: 'Robert T.', scenarioId: null, status: 'Self-Pay', likelihood: 'Low', signal: 'Potential Disability', action: 'Monitor' },
];

const COVERAGE_DATA: CoverageRow[] = [
  { id: '1', clientName: 'Sarah M.', dob: '1982-05-14', clientType: 'Insured', status: 'Payer Switch', details: 'UnitedHealthcare → Aetna', action: 'Update Payer in EHR' },
  { id: 'SP-102', clientName: 'Marcus T.', dob: '1992-02-10', clientType: 'Self-Pay', status: 'New Coverage Found', details: 'Medicaid Active Found', action: 'Bill Insurance' },
  { id: '2', clientName: 'David K.', dob: '1979-11-02', clientType: 'Insured', status: 'Member ID Changed', details: 'Member ID Updated', action: 'Update Member ID' },
  { id: '3', clientName: 'Michael R.', dob: '1990-03-22', clientType: 'Insured', status: 'Coverage Lost', details: 'No active coverage found', action: 'Remove Inactive Coverage' },
  { id: 'SP-105', clientName: 'Elena R.', dob: '1988-11-15', clientType: 'Self-Pay', status: 'New Coverage Found', details: 'BCBS Active Found', action: 'Bill Insurance' },
  { id: '5', clientName: 'James L.', dob: '1975-01-12', clientType: 'Insured', status: 'Active Coverage', details: 'Verified Active (Cigna)', action: 'No Action Needed' },
  { id: '6', clientName: 'Jessica T.', dob: '1995-06-18', clientType: 'Insured', status: 'Payer Switch', details: 'Aetna → BCBS', action: 'Update Payer in EHR' },
  { id: '7', clientName: 'Robert P.', dob: '1968-12-05', clientType: 'Insured', status: 'Member ID Changed', details: 'Member ID Updated', action: 'Update Member ID' },
  { id: 'SP-112', clientName: 'Thomas B.', dob: '1998-04-22', clientType: 'Self-Pay', status: 'Coverage Not Found', details: 'Remains Self-Pay', action: 'No Change' },
];

const CODING_OPPS: CodingOpp[] = [
  { id: 'ENC-8832', date: 'Jan 12, 2026', clinician: 'Dr. Sarah Chen', type: 'Time-Based Undercoding', program: 'Psychotherapy', originalCode: '90832 (30 min)', suggestedCode: '90834 (45 min)', confidence: 'High', reason: 'Threshold Met', details: 'Audio analysis confirms session duration of 39 minutes, qualifying for 45-minute tier.', impact: 'Revenue Lift' },
  { id: 'ENC-9921', date: 'Jan 10, 2026', clinician: 'Dr. Emily Foster', type: 'E/M Level Selection', program: 'Med Management', originalCode: '99213', suggestedCode: '99214', confidence: 'High', reason: 'MDM High Complexity', details: 'Documentation supports high complexity decision making.', impact: 'Level Up' },
  { id: 'ENC-7721', date: 'Jan 11, 2026', clinician: 'Dr. James Wilson', type: 'Psychotherapy Add-on', program: 'Med Management', originalCode: '99214', suggestedCode: '99214 + 90833', confidence: 'Medium', reason: 'Distinct Therapy Service', details: 'Documentation supports 16+ minutes of psychotherapy distinct from medical management.', impact: 'Add-on Revenue' },
  { id: 'ENC-8110', date: 'Jan 09, 2026', clinician: 'Mark Davis, LMFT', type: 'Billable Capture', program: 'Skills Training', originalCode: 'Non-Billable (Admin)', suggestedCode: 'H2014 (Skills)', confidence: 'High', reason: 'Billable Service Criteria', details: 'Note describes skills building intervention rather than administrative coordination.', impact: 'New Billable Event' },
];

const FLOW_STEPS = [
  { num: 1, label: 'Client Intake', desc: 'Client registered as self-pay' },
  { num: 2, label: 'Ongoing Treatment', desc: 'Clinical sessions & notes' },
  { num: 3, label: 'Signal Detection', desc: 'Eleos AI analyzes notes' },
  { num: 4, label: 'Eligibility Insight', desc: 'Coverage opportunity surfaced' },
  { num: 5, label: 'Action Needed', desc: 'Clinician reviews & acts' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
    <path d="M5 3v4" /><path d="M3 5h4" /><path d="M19 17v4" /><path d="M17 19h4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BrainIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function confidenceClass(val: string): string {
  if (val === 'High') return 'er-conf-high';
  if (val === 'Medium') return 'er-conf-medium';
  if (val === 'Verified') return 'er-conf-verified';
  return 'er-conf-low';
}

function statusPillClass(status: string): string {
  if (status === 'New Coverage Found') return 'er-pill-green';
  if (status === 'Payer Switch') return 'er-pill-blue';
  if (status === 'Member ID Changed') return 'er-pill-amber';
  if (status === 'Coverage Lost') return 'er-pill-red';
  if (status === 'Active Coverage') return 'er-pill-slate';
  return 'er-pill-gray';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="er-metric-card">
      <div className="er-metric-card__icon" style={accent ? { background: accent + '18', color: accent } : {}}>
        {icon}
      </div>
      <div className="er-metric-card__body">
        <div className="er-metric-card__value">{value}</div>
        <div className="er-metric-card__label">{label}</div>
        {sub && <div className="er-metric-card__sub">{sub}</div>}
      </div>
    </div>
  );
}

function CoverageOperationsView() {
  return (
    <div className="er-section er-fade-in">
      <div className="er-metrics-grid">
        <MetricCard icon={<UsersIcon />} label="Total Clients Analyzed" value="4,258" sub="Last 30 days" accent="#4f46e5" />
        <MetricCard icon={<SparklesIcon />} label="Self-Pay: New Coverage Found" value="145" sub="Needs billing action" accent="#10b981" />
        <MetricCard icon={<AlertIcon />} label="Insured: Coverage Changes" value="702" sub="Switch / ID change / lost" accent="#f59e0b" />
        <MetricCard icon={<CheckIcon />} label="Active / Verified" value="2,714" sub="No action needed" accent="#6366f1" />
      </div>

      <div className="er-card">
        <div className="er-card__header">
          <h3 className="er-card__title">Coverage Operations Results</h3>
          <span className="er-tag">Real-Time</span>
        </div>
        <div className="er-table-wrap">
          <table className="er-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>DOB</th>
                <th>Type</th>
                <th>Status</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE_DATA.map(row => (
                <tr key={row.id}>
                  <td>
                    <div className="er-client-name">{row.clientName}</div>
                    <div className="er-client-id">ID: {row.id}</div>
                  </td>
                  <td className="er-text-secondary">{row.dob}</td>
                  <td>
                    <span className={`er-type-badge ${row.clientType === 'Self-Pay' ? 'er-type-selfpay' : 'er-type-insured'}`}>
                      {row.clientType}
                    </span>
                  </td>
                  <td><span className={`er-pill ${statusPillClass(row.status)}`}>{row.status}</span></td>
                  <td className="er-text-secondary">{row.details}</td>
                  <td>
                    {row.action !== 'No Action Needed' && row.action !== 'No Change' ? (
                      <button className="er-action-btn">{row.action}</button>
                    ) : (
                      <span className="er-text-muted">{row.action}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExecutiveDashboardView({ onSelectRow }: { onSelectRow: (scenarioId: string) => void }) {
  return (
    <div className="er-section er-fade-in">
      <div className="er-metrics-grid">
        <MetricCard icon={<UsersIcon />} label="Total Self-Pay Clients" value="542" accent="#4f46e5" />
        <MetricCard icon={<ShieldIcon />} label="Active Policies Found" value="145" sub="Potential billing recovery" accent="#10b981" />
        <MetricCard icon={<BrainIcon />} label="Eligibility Signals Detected" value="62" sub="AI-detected re-enrollment signals" accent="#8b5cf6" />
        <MetricCard icon={<DollarIcon />} label="Re-enrollment Opportunities" value="38" sub="Est. $273k revenue" accent="#f59e0b" />
      </div>

      <div className="er-card">
        <div className="er-card__header">
          <h3 className="er-card__title">Re-enrollment Opportunities</h3>
          <span className="er-tag er-tag--purple">AI Detected</span>
        </div>
        <div className="er-table-wrap">
          <table className="er-table er-table--clickable">
            <thead>
              <tr>
                <th>Client</th>
                <th>Status</th>
                <th>Signal Confidence</th>
                <th>Detected Signals</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {OPPORTUNITIES.map(opp => (
                <tr
                  key={opp.id}
                  onClick={() => opp.scenarioId && onSelectRow(opp.scenarioId)}
                  className={opp.scenarioId ? 'er-row-clickable' : ''}
                >
                  <td>
                    <div className="er-client-name">{opp.name}</div>
                    <div className="er-client-id">ID: {opp.id}</div>
                  </td>
                  <td><span className="er-pill er-pill-slate">{opp.status}</span></td>
                  <td>
                    <span className={`er-conf-badge ${confidenceClass(opp.likelihood)}`}>
                      <span className="er-conf-dot" />
                      {opp.likelihood}
                    </span>
                  </td>
                  <td className="er-text-secondary">{opp.signal}</td>
                  <td>
                    {opp.scenarioId ? (
                      <button className="er-action-btn er-action-btn--primary" onClick={e => { e.stopPropagation(); onSelectRow(opp.scenarioId!); }}>
                        {opp.action} <ArrowRightIcon />
                      </button>
                    ) : (
                      <span className="er-text-muted">{opp.action}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="er-table-hint">Click a row to open the Clinician View for that signal</div>
      </div>
    </div>
  );
}

function ClinicianView({
  activeScenarioId,
  setActiveScenarioId,
  activeStep,
  setActiveStep,
}: {
  activeScenarioId: string;
  setActiveScenarioId: (id: string) => void;
  activeStep: number;
  setActiveStep: (n: number) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const scenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <div className="er-clinician-layout er-fade-in">
      {/* Left: flow panel */}
      <div className="er-flow-panel">
        <div className="er-flow-panel__header">
          <div className="er-flow-panel__label">Signal Lifecycle</div>
          <div className="er-scenario-switcher">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                className={`er-scenario-btn ${activeScenarioId === s.id ? 'er-scenario-btn--active' : ''}`}
                onClick={() => { setActiveScenarioId(s.id); setActiveStep(1); }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="er-flow-steps">
          {FLOW_STEPS.map((step, idx) => (
            <div key={step.num} className="er-flow-step-wrap">
              <button
                className={`er-flow-step ${activeStep === step.num ? 'er-flow-step--active' : ''} ${activeStep > step.num ? 'er-flow-step--done' : ''}`}
                onClick={() => setActiveStep(step.num)}
              >
                <div className="er-flow-step__bubble">
                  {activeStep > step.num ? <CheckIcon /> : step.num}
                </div>
                <div className="er-flow-step__text">
                  <div className="er-flow-step__name">{step.label}</div>
                  <div className="er-flow-step__desc">{step.desc}</div>
                </div>
              </button>
              {idx < FLOW_STEPS.length - 1 && <div className={`er-flow-connector ${activeStep > step.num ? 'er-flow-connector--done' : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Right: EHR simulation */}
      <div className="er-ehr-panel">
        <div className="er-ehr-titlebar">
          <span className="er-ehr-dot er-ehr-dot--red" />
          <span className="er-ehr-dot er-ehr-dot--yellow" />
          <span className="er-ehr-dot er-ehr-dot--green" />
          <span className="er-ehr-title">EHR — Patient Record View</span>
        </div>

        <div className="er-ehr-body">
          {/* Step 1: Intake form skeleton */}
          {activeStep === 1 && (
            <div className="er-ehr-intake er-fade-in">
              <div className="er-ehr-section-title">New Client Intake</div>
              <div className="er-ehr-fields">
                <div className="er-ehr-field"><div className="er-ehr-field-label">Name</div><div className="er-ehr-skeleton er-ehr-skeleton--md" /></div>
                <div className="er-ehr-field"><div className="er-ehr-field-label">DOB</div><div className="er-ehr-skeleton er-ehr-skeleton--sm" /></div>
                <div className="er-ehr-field"><div className="er-ehr-field-label">Insurance</div><div className="er-ehr-skeleton er-ehr-skeleton--lg" /></div>
                <div className="er-ehr-field"><div className="er-ehr-field-label">Coverage Status</div><span className="er-pill er-pill-amber">Self-Pay</span></div>
              </div>
              <div className="er-ehr-note">Client registered as Self-Pay. No active insurance on file.</div>
            </div>
          )}

          {/* Steps 2+: Clinical notes appear */}
          {activeStep >= 2 && (
            <div className="er-ehr-notes er-fade-in">
              <div className="er-ehr-section-title">Clinical Session Notes</div>
              <div className="er-ehr-note-block">
                <div className="er-ehr-note-meta">Session — Oct 14, 2025 | Dr. A. Rivera</div>
                <p className="er-ehr-note-text">
                  Client presented with low mood and financial anxiety. {scenario.evidence}
                </p>
              </div>
              <div className="er-ehr-note-block">
                <div className="er-ehr-note-meta">Session — Oct 21, 2025 | Dr. A. Rivera</div>
                <p className="er-ehr-note-text">Client continues to show progress. Follow-up on benefits enrollment discussed.</p>
              </div>
            </div>
          )}

          {/* Step 3: Signal detection toast */}
          {activeStep >= 3 && (
            <div className="er-signal-toast er-fade-in">
              <div className="er-signal-toast__icon"><SparklesIcon /></div>
              <div>
                <div className="er-signal-toast__title">New signal detected</div>
                <div className="er-signal-toast__sub">{scenario.signalTitle}</div>
              </div>
            </div>
          )}

          {/* Step 4+: Eligibility signal card */}
          {activeStep >= 4 && (
            <div className="er-signal-card er-fade-in">
              <div className="er-signal-card__header">
                <div className="er-signal-card__icon"><BrainIcon /></div>
                <div>
                  <div className="er-signal-card__title">{scenario.signalTitle}</div>
                  <span className={`er-conf-badge ${confidenceClass(scenario.confidence)}`}>
                    <span className="er-conf-dot" />
                    {scenario.confidence} Confidence
                  </span>
                </div>
              </div>
              <div className="er-signal-card__body">
                <div className="er-signal-card__row">
                  <span className="er-signal-card__key">Description</span>
                  <span className="er-signal-card__val">{scenario.description}</span>
                </div>
                <div className="er-signal-card__row">
                  <span className="er-signal-card__key">Impact</span>
                  <span className="er-signal-card__val">{scenario.impact}</span>
                </div>
                <div className="er-signal-card__evidence">
                  <div className="er-signal-card__evidence-label">Evidence from notes:</div>
                  <blockquote className="er-signal-card__quote">{scenario.evidence}</blockquote>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review button */}
          {activeStep >= 5 && (
            <div className="er-ehr-action-row er-fade-in">
              <button className="er-btn-primary" onClick={() => setModalOpen(true)}>
                <AlertIcon /> Review &amp; Verify — {scenario.actionText}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {modalOpen && (
        <div className="er-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="er-modal" onClick={e => e.stopPropagation()}>
            <div className="er-modal__header">
              <div>
                <div className="er-modal__title">{scenario.signalTitle}</div>
                <span className={`er-conf-badge ${confidenceClass(scenario.confidence)}`}>
                  <span className="er-conf-dot" />
                  {scenario.confidence} Confidence
                </span>
              </div>
              <button className="er-modal__close" onClick={() => setModalOpen(false)}><XIcon /></button>
            </div>
            <div className="er-modal__body">
              <div className="er-modal__section">
                <div className="er-modal__section-title">Description</div>
                <p className="er-modal__text">{scenario.description}</p>
              </div>
              <div className="er-modal__section">
                <div className="er-modal__section-title">Evidence from Clinical Notes</div>
                <blockquote className="er-signal-card__quote">{scenario.evidence}</blockquote>
              </div>
              <div className="er-modal__section">
                <div className="er-modal__section-title">Revenue Impact</div>
                <p className="er-modal__text er-modal__impact">{scenario.impact}</p>
              </div>
            </div>
            <div className="er-modal__footer">
              <button className="er-btn-secondary" onClick={() => setModalOpen(false)}>Dismiss</button>
              <button className="er-btn-primary" onClick={() => setModalOpen(false)}>
                {scenario.actionText} <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CodingIntegrityView() {
  const [filter, setFilter] = useState<string>('All');
  const [modalOpp, setModalOpp] = useState<CodingOpp | null>(null);

  const filterTypes = ['All', 'Time-Based', 'E/M Level', 'Add-on', 'Billable'];

  const filtered = filter === 'All'
    ? CODING_OPPS
    : CODING_OPPS.filter(o => o.type.includes(filter));

  return (
    <div className="er-section er-fade-in">
      <div className="er-coding-summary">
        <div className="er-coding-summary__item">
          <span className="er-coding-summary__num">{CODING_OPPS.length}</span>
          <span className="er-coding-summary__label">Coding opportunities found</span>
        </div>
        <div className="er-coding-summary__sep" />
        <div className="er-coding-summary__item">
          <span className="er-coding-summary__num er-coding-summary__num--green">$127k</span>
          <span className="er-coding-summary__label">Potential revenue recovery</span>
        </div>
        <div className="er-coding-summary__sep" />
        <div className="er-coding-summary__item">
          <span className="er-coding-summary__num er-coding-summary__num--purple">AI</span>
          <span className="er-coding-summary__label">Powered by Eleos session analysis</span>
        </div>
      </div>

      <div className="er-card">
        <div className="er-card__header">
          <h3 className="er-card__title">Coding Opportunities</h3>
          <div className="er-filter-btns">
            {filterTypes.map(ft => (
              <button
                key={ft}
                className={`er-filter-btn ${filter === ft ? 'er-filter-btn--active' : ''}`}
                onClick={() => setFilter(ft)}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>
        <div className="er-table-wrap">
          <table className="er-table er-table--clickable">
            <thead>
              <tr>
                <th>Encounter</th>
                <th>Clinician</th>
                <th>Type</th>
                <th>Original Code</th>
                <th>Suggested Code</th>
                <th>Confidence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(opp => (
                <tr key={opp.id} className="er-row-clickable" onClick={() => setModalOpp(opp)}>
                  <td>
                    <div className="er-client-name">{opp.id}</div>
                    <div className="er-client-id">{opp.date}</div>
                  </td>
                  <td className="er-text-secondary">{opp.clinician}</td>
                  <td>
                    <span className="er-coding-type-badge">{opp.type}</span>
                  </td>
                  <td className="er-code-cell er-code-cell--old">{opp.originalCode}</td>
                  <td className="er-code-cell er-code-cell--new">{opp.suggestedCode}</td>
                  <td>
                    <span className={`er-conf-badge ${confidenceClass(opp.confidence)}`}>
                      <span className="er-conf-dot" />
                      {opp.confidence}
                    </span>
                  </td>
                  <td>
                    <button className="er-action-btn er-action-btn--primary" onClick={e => { e.stopPropagation(); setModalOpp(opp); }}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coding Detail Modal */}
      {modalOpp && (
        <div className="er-modal-overlay" onClick={() => setModalOpp(null)}>
          <div className="er-modal" onClick={e => e.stopPropagation()}>
            <div className="er-modal__header">
              <div>
                <div className="er-modal__title">{modalOpp.id} — {modalOpp.type}</div>
                <div className="er-modal__subtitle">{modalOpp.clinician} · {modalOpp.date}</div>
              </div>
              <button className="er-modal__close" onClick={() => setModalOpp(null)}><XIcon /></button>
            </div>
            <div className="er-modal__body">
              <div className="er-coding-code-compare">
                <div className="er-coding-code-box er-coding-code-box--old">
                  <div className="er-coding-code-box__label">Original</div>
                  <div className="er-coding-code-box__code">{modalOpp.originalCode}</div>
                </div>
                <ArrowRightIcon />
                <div className="er-coding-code-box er-coding-code-box--new">
                  <div className="er-coding-code-box__label">Suggested</div>
                  <div className="er-coding-code-box__code">{modalOpp.suggestedCode}</div>
                </div>
              </div>
              <div className="er-modal__section">
                <div className="er-modal__section-title">Reason</div>
                <p className="er-modal__text">{modalOpp.reason}</p>
              </div>
              <div className="er-modal__section">
                <div className="er-modal__section-title">Clinical Rationale</div>
                <p className="er-modal__text">{modalOpp.details}</p>
              </div>
              <div className="er-modal__section">
                <div className="er-modal__section-title">Expected Impact</div>
                <p className="er-modal__text er-modal__impact">{modalOpp.impact}</p>
              </div>
            </div>
            <div className="er-modal__footer">
              <button className="er-btn-secondary" onClick={() => setModalOpp(null)}>Dismiss</button>
              <button className="er-btn-primary" onClick={() => setModalOpp(null)}>
                Apply Suggestion <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EligibilityReport() {
  const [activeModule, setActiveModule] = useState<'eligibility' | 'coding'>('eligibility');
  const [eligibilityView, setEligibilityView] = useState<'hygiene' | 'signals'>('hygiene');
  const [viewMode, setViewMode] = useState<'dashboard' | 'clinician'>('dashboard');
  const [activeScenarioId, setActiveScenarioId] = useState('income');
  const [activeStep, setActiveStep] = useState(1);

  function handleSelectRow(scenarioId: string) {
    setActiveScenarioId(scenarioId);
    setViewMode('clinician');
    setActiveStep(4);
  }

  return (
    <div className="er-root">
      {/* Page Header */}
      <div className="er-page-header">
        <div className="er-page-header__left">
          <div className="er-page-header__icon"><SparklesIcon /></div>
          <div>
            <h1 className="er-page-header__title">Revenue Cycle Intelligence Platform</h1>
            <p className="er-page-header__sub">AI-powered eligibility signals and coding optimization</p>
          </div>
        </div>
        <div className="er-module-switcher">
          <button
            className={`er-module-btn ${activeModule === 'eligibility' ? 'er-module-btn--active' : ''}`}
            onClick={() => setActiveModule('eligibility')}
          >
            <ShieldIcon /> Eligibility &amp; Coverage
          </button>
          <button
            className={`er-module-btn ${activeModule === 'coding' ? 'er-module-btn--active' : ''}`}
            onClick={() => setActiveModule('coding')}
          >
            <BrainIcon /> Coding Integrity
          </button>
        </div>
      </div>

      {/* Eligibility sub-tabs */}
      {activeModule === 'eligibility' && (
        <div className="er-subtabs">
          <button
            className={`er-subtab ${eligibilityView === 'hygiene' ? 'er-subtab--active' : ''}`}
            onClick={() => setEligibilityView('hygiene')}
          >
            Coverage Operations
          </button>
          <button
            className={`er-subtab ${eligibilityView === 'signals' ? 'er-subtab--active' : ''}`}
            onClick={() => setEligibilityView('signals')}
          >
            Signal Detection
          </button>
        </div>
      )}

      {/* Signal Detection view mode toggle */}
      {activeModule === 'eligibility' && eligibilityView === 'signals' && (
        <div className="er-view-controls">
          <div className="er-view-toggle">
            <button
              className={`er-view-btn ${viewMode === 'dashboard' ? 'er-view-btn--active' : ''}`}
              onClick={() => setViewMode('dashboard')}
            >
              Executive View
            </button>
            <button
              className={`er-view-btn ${viewMode === 'clinician' ? 'er-view-btn--active' : ''}`}
              onClick={() => setViewMode('clinician')}
            >
              Clinician View
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="er-content">
        {activeModule === 'eligibility' && eligibilityView === 'hygiene' && (
          <CoverageOperationsView />
        )}
        {activeModule === 'eligibility' && eligibilityView === 'signals' && viewMode === 'dashboard' && (
          <ExecutiveDashboardView onSelectRow={handleSelectRow} />
        )}
        {activeModule === 'eligibility' && eligibilityView === 'signals' && viewMode === 'clinician' && (
          <ClinicianView
            activeScenarioId={activeScenarioId}
            setActiveScenarioId={setActiveScenarioId}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        )}
        {activeModule === 'coding' && (
          <CodingIntegrityView />
        )}
      </div>
    </div>
  );
}
