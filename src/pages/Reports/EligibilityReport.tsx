import './EligibilityReport.css';

export function EligibilityReport() {
  return (
    <div className="eligibility-report">
      <div className="eligibility-report__header">
        <div className="eligibility-report__header-left">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#f59e0b', flexShrink: 0 }}>
            <path d="M8 1.5l1.8 3.6 4 .58-2.9 2.82.68 3.98L8 10.35l-3.58 1.93.68-3.98L2.2 5.68l4-.58L8 1.5z" fill="currentColor" />
          </svg>
          <h1 className="eligibility-report__title">Eleos Eligibility Report</h1>
          <span className="eligibility-report__badge">
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
              <circle cx="3.5" cy="3.5" r="3.5" fill="#f59e0b" />
            </svg>
            Coming Soon
          </span>
        </div>
      </div>

      <div className="eligibility-report__empty">
        <div className="eligibility-report__empty-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="38" rx="3" stroke="#d1d5db" strokeWidth="2"/>
            <path d="M16 16h16M16 22h16M16 28h10" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 9.5V13h4" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="eligibility-report__empty-title">Eligibility Report Coming Soon</h2>
        <p className="eligibility-report__empty-body">
          This report will provide insights into member eligibility status, verification outcomes, and payer data across your organization.
        </p>
      </div>
    </div>
  );
}
