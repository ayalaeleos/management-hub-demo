// ── Compliance Report Data ─────────────────────────────────────────────────────
// Source: demo_export/compliance_data.json

import complianceData from './demo_export/compliance_data.json';

// ── Headline Stats ─────────────────────────────────────────────────────────────

export const COMPLIANCE_STATS = {
  firstDocDate: complianceData.headlineMetrics.firstDocumentDate,
  lastDocDate: '4/16/2026',
  documents: complianceData.headlineMetrics.documentsAnalyzed,
  providers: complianceData.headlineMetrics.providersAnalyzed,
  timeSaved: 4700,    // hours saved org-wide
  costSaved: 141000,  // dollars saved org-wide
};

// ── Provider Records ───────────────────────────────────────────────────────────

export interface ComplianceProviderRow {
  name: string;
  email: string;
  supervisor: string;
  program: string;
  totalDocuments: number;
  completeness: number;
  uniqueness: number;
  progressMentioned: number;
  goldenThread: number;
  interventionUsed: number;
  clientResponse: number;
  compliantPlan: number;
  barriersAddressed: number;
  serviceCodeMatch: number;
  qualityScore: number;
}

const weights = complianceData.qualityScoreWeights;

function computeQualityScore(p: (typeof complianceData.providers)[number]): number {
  const score =
    p.completeness * weights.completeness +
    (100 - p.uniqueness) * weights.uniqueness +
    p.progressMentioned * weights.progressMentioned +
    p.goldenThread * weights.goldenThread +
    p.interventionUsed * weights.interventionUsed +
    p.clientResponse * weights.clientResponse +
    p.compliantPlan * weights.compliantPlan +
    p.barriersAddressed * weights.barriersAddressed +
    p.serviceCodeMatch * weights.serviceCodeMatch;
  return Math.round(score * 10) / 10;
}

export const COMPLIANCE_PROVIDERS: ComplianceProviderRow[] = complianceData.providers.map(p => ({
  ...p,
  qualityScore: computeQualityScore(p),
}));

// ── ProviderAnalysisRow — shape used by ComplianceReport.tsx tables ────────────

export interface ProviderAnalysisRow {
  provider: string;
  email: string;
  supervisors: string;
  program: string;
  documents: number;
  qualityScore: number;
  completeness: number;
  uniqueness: number;
  progressMentioned: number;
  compliantPlan: number;
  goldenThread: number;
  interventionUsed: number;
  clientResponse: number;
}

export const PROVIDER_ANALYSIS_DATA: ProviderAnalysisRow[] = complianceData.providers.map(p => ({
  provider: p.name,
  email: p.email,
  supervisors: p.supervisor,
  program: p.program,
  documents: p.totalDocuments,
  qualityScore: computeQualityScore(p),
  completeness: p.completeness,
  uniqueness: p.uniqueness,
  progressMentioned: p.progressMentioned,
  compliantPlan: p.compliantPlan,
  goldenThread: p.goldenThread,
  interventionUsed: p.interventionUsed,
  clientResponse: p.clientResponse,
}));

// ── Key Improvements (Eleos vs non-Eleos comparison) ──────────────────────────
// Pre-computed comparison data not available in source JSON — kept as reference values.

export interface KeyImprovementRow {
  label: string;
  eleos: number;
  nonEleos: number;
}

export const KEY_IMPROVEMENTS: KeyImprovementRow[] = [
  { label: 'client response',   eleos: 66.31, nonEleos: 57.89 },
  { label: 'compliant plan',    eleos: 94.70, nonEleos: 87.64 },
  { label: 'compliant plan',    eleos: 81.47, nonEleos: 66.45 },
  { label: 'intervention used', eleos: 59.66, nonEleos: 52.43 },
  { label: 'intervention used', eleos: 79.89, nonEleos: 70.49 },
  { label: 'uniqueness',        eleos: 57.28, nonEleos: 45.29 },
  { label: 'uniqueness',        eleos: 89.01, nonEleos: 77.48 },
];
