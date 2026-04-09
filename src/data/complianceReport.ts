// ── Compliance Report Data ──────────────────────────────────────────────────

export const COMPLIANCE_STATS = {
  firstDocDate: '2026-01-09',
  lastDocDate: '2026-04-08',
  documents: 363995,
  providers: 2884,
  timeSaved: 30300, // hours
  costSaved: 910000, // dollars
};

export interface KeyImprovementRow {
  label: string;
  eleos: number;
  nonEleos: number;
}

export const KEY_IMPROVEMENTS: KeyImprovementRow[] = [
  { label: 'client response', eleos: 66.31, nonEleos: 57.89 },
  { label: 'compliant plan', eleos: 94.70, nonEleos: 87.64 },
  { label: 'compliant plan', eleos: 81.47, nonEleos: 66.45 },
  { label: 'intervention used', eleos: 59.66, nonEleos: 52.43 },
  { label: 'intervention used', eleos: 79.89, nonEleos: 70.49 },
  { label: 'uniqueness', eleos: 57.28, nonEleos: 45.29 },
  { label: 'uniqueness', eleos: 89.01, nonEleos: 77.48 },
];
