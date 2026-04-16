// ── Leadership / Documentation Report Data ────────────────────────────────────
// Sources: demo_export/documentation_data.json, demo_export/weekly_series_data.json

import docData from './demo_export/documentation_data.json';
import weeklyData from './demo_export/weekly_series_data.json';

// ── Internal Helpers ──────────────────────────────────────────────────────────

function daysBetween(d1: string, d2: string): number {
  return Math.max(1, Math.round((new Date(d2).getTime() - new Date(d1).getTime()) / 86400000));
}

/** Parse "X.X-Y.Y (random)" → midpoint, "0.0 (no time saved)" → 0 */
function parseMidpoint(range: string): number {
  if (range.startsWith('0.0')) return 0;
  const m = range.match(/^([\d.]+)-([\d.]+)/);
  return m ? (parseFloat(m[1]) + parseFloat(m[2])) / 2 : 9.0;
}

/** Derive site name from program name using siteDerivationRules */
function deriveSite(program: string): string {
  const rules = docData.siteDerivationRules as Record<string, string>;
  for (const [pattern, site] of Object.entries(rules)) {
    if (pattern === 'default') continue;
    if (new RegExp(pattern).test(program)) return site;
  }
  return rules.default;
}

/** Strip time component from datetime string */
function dateOnly(dt: string): string {
  return dt.split(' ')[0];
}

/** Flatten an array of { month, weekValues } into labeled data points */
function flattenMonthly(
  series: Array<{ month: string; weekValues: number[] }>
): Array<{ week: string; value: number }> {
  return series.flatMap(({ month, weekValues }) =>
    weekValues.map((value) => ({ week: month, value }))
  );
}

// ── Headline Stats ─────────────────────────────────────────────────────────────

const hm = docData.headlineMetrics;
const providers = docData.providers;

const totalNotes = providers.reduce((s, p) => s + p.generatedNotes, 0);

const ratedEntries = providers.filter(p => p.averageNoteRating !== null && p.notesWithFeedback > 0);
const weightedRatingSum = ratedEntries.reduce((s, p) => s + (p.averageNoteRating! * p.notesWithFeedback), 0);
const totalRatedNotes = ratedEntries.reduce((s, p) => s + p.notesWithFeedback, 0);
const avgNoteRating = totalRatedNotes > 0 ? Math.round((weightedRatingSum / totalRatedNotes) * 10) / 10 : 4.5;

// Estimate org-wide hours saved using per-provider midpoint savings
const totalMinutesSaved = providers.reduce((s, p) => s + p.generatedNotes * parseMidpoint(p.minutesSavedRange), 0);
const hoursSaved = Math.round(totalMinutesSaved / 60);
const timeSavedPerNote = Math.round((totalMinutesSaved / totalNotes) * 10) / 10;

export const IMPACT_STATS = {
  notesGenerated: totalNotes,
  hoursSaved,
  timeSavedPerNote,
  averageNoteRating: avgNoteRating,
};

export const ADOPTION_STATS = {
  licensesIssued: hm.licensesIssued,
  configuredProviders: hm.configuredProviders,
  activatedProviders: hm.activatedProviders,
  licenseUtilization: hm.licenseUtilization,
  awaitingFirstUse: hm.licensesIssued - hm.activatedProviders,
};

// ── Onboarding & Ongoing Donut Data ───────────────────────────────────────────
// Derived from known segment counts, scaled to 200-license demo org.

const segs = docData.syntheticProviderSegments;
const powerCount   = providers.filter(p => p.status === 'Power Provider').length;
const succCount    = providers.filter(p => p.status === 'Successful Onboarding').length;
const slowCount    = segs.onboardingSlowStart.length;
const lowCount     = segs.lowEngagement.length;
const droppedCount = segs.droppedOff.length;
const awaitCount   = segs.awaitingFirstUse.length;
const firstWeekCount = Math.max(3, Math.round(hm.licensesIssued * 0.05));
const activeCount  = hm.activatedProviders - powerCount - succCount - slowCount - lowCount - droppedCount - firstWeekCount;

export const ONBOARDING_DONUT = [
  { label: 'Onboarding – First Week',  value: firstWeekCount, color: '#4DB6AC' },
  { label: 'Successful Onboarding',    value: succCount,      color: '#26C6DA' },
  { label: 'Onboarding – Slow Start',  value: slowCount,      color: '#283593' },
];

export const ONGOING_DONUT = [
  { label: 'Power Provider',  value: powerCount,               color: '#283593' },
  { label: 'Active',          value: Math.max(0, activeCount), color: '#26C6DA' },
  { label: 'Low Engagement',  value: lowCount,                 color: '#4DB6AC' },
  { label: 'Dropped Off',     value: droppedCount,             color: '#EF6C00' },
  { label: 'Awaiting',        value: awaitCount,               color: '#78909C' },
];

// ── Weekly Chart Series ────────────────────────────────────────────────────────

export interface WeeklyDataPoint {
  week: string;
  notes: number;
}

export const WEEKLY_NOTES: WeeklyDataPoint[] = flattenMonthly(
  weeklyData.weeklyNotesGenerated.data
).map(({ week, value }) => ({ week, notes: value }));

// ── Activity Type Data ─────────────────────────────────────────────────────────

export interface ActivityTypePoint {
  week: string;
  individual: number;
  caseManagement: number;
  peerSupport: number;
  playTherapy: number;
  armhs: number;
  earlyChildhood: number;
  psychiatry: number;
  other: number;
}

const actRatios = weeklyData.weeklyActivityType.distributionRatios;
const psychiatryRatio =
  1 -
  actRatios.individual -
  actRatios.other -
  actRatios.caseManagement -
  actRatios.peerSupport -
  actRatios.playTherapy -
  actRatios.armhs -
  actRatios.earlyChildhood;

export const ACTIVITY_TYPE_DATA: ActivityTypePoint[] = flattenMonthly(
  weeklyData.weeklyActivityType.data
).map(({ week, value: total }) => ({
  week,
  individual:     Math.round(total * actRatios.individual),
  other:          Math.round(total * actRatios.other),
  caseManagement: Math.round(total * actRatios.caseManagement),
  peerSupport:    Math.round(total * actRatios.peerSupport),
  playTherapy:    Math.round(total * actRatios.playTherapy),
  armhs:          Math.round(total * actRatios.armhs),
  earlyChildhood: Math.round(total * actRatios.earlyChildhood),
  psychiatry:     Math.round(total * psychiatryRatio),
}));

export const NOTES_PER_PROVIDER: { week: string; avg: number }[] = flattenMonthly(
  weeklyData.weeklyNotesPerProvider.data
).map(({ week, value }) => ({ week, avg: value }));

// ── Program Data ───────────────────────────────────────────────────────────────

export interface ProgramRow {
  program: string;
  activatedProviders: number;
  generatedNotes: number;
  ratedNotes: number;
  averageNoteRating: number;
  hoursSaved: number;
  avgMinutesSavedPerNote: number;
}

const programMap = new Map<string, { notes: number; ratedNotes: number; ratingSum: number; minSaved: number; count: number }>();
for (const p of providers) {
  const key = p.program;
  const avg = parseMidpoint(p.minutesSavedRange);
  const existing = programMap.get(key);
  if (existing) {
    existing.notes += p.generatedNotes;
    existing.ratedNotes += p.notesWithFeedback;
    existing.ratingSum += (p.averageNoteRating ?? 0) * p.notesWithFeedback;
    existing.minSaved += p.generatedNotes * avg;
    existing.count++;
  } else {
    programMap.set(key, {
      notes: p.generatedNotes,
      ratedNotes: p.notesWithFeedback,
      ratingSum: (p.averageNoteRating ?? 0) * p.notesWithFeedback,
      minSaved: p.generatedNotes * avg,
      count: 1,
    });
  }
}

export const PROGRAM_DATA: ProgramRow[] = Array.from(programMap.entries())
  .sort((a, b) => b[1].notes - a[1].notes)
  .map(([program, d]) => {
    const avgMin = d.notes > 0 ? d.minSaved / d.notes : 0;
    return {
      program,
      activatedProviders: d.count,
      generatedNotes: d.notes,
      ratedNotes: d.ratedNotes,
      averageNoteRating: d.ratedNotes > 0 ? Math.round((d.ratingSum / d.ratedNotes) * 100) / 100 : 0,
      hoursSaved: Math.round(d.minSaved / 60),
      avgMinutesSavedPerNote: Math.round(avgMin * 100) / 100,
    };
  });

// ── Provider Table ─────────────────────────────────────────────────────────────

export interface ProviderRow {
  name: string;
  mail: string;
  profession: string;
  programName: string;
  site: string;
  supervisor: string;
  configuredToSidebar: string;
  status: string;
  generatedNotes: number;
  mobile: string;
  firstNoteDate: string;
  latestNoteDate: string;
  averageNoteRating: number | null;
  notesWithFeedback: number;
  hoursSaved: number | null;
  avgMinutesSavedPerNote: number | null;
}

export const PROVIDER_DATA: ProviderRow[] = providers.map(p => {
  const avgMin = parseMidpoint(p.minutesSavedRange);
  return {
    name: p.name,
    mail: p.email,
    profession: p.profession,
    programName: p.program,
    site: deriveSite(p.program),
    supervisor: p.supervisor,
    configuredToSidebar: dateOnly(p.configuredDate),
    status: p.status,
    generatedNotes: p.generatedNotes,
    mobile: p.mobileUser ? 'Has Mobile Notes' : 'No Mobile Notes Yet',
    firstNoteDate: dateOnly(p.firstNoteDate),
    latestNoteDate: dateOnly(p.latestNoteDate),
    averageNoteRating: p.averageNoteRating,
    notesWithFeedback: p.notesWithFeedback,
    hoursSaved: avgMin > 0 ? Math.round((p.generatedNotes * avgMin / 60) * 10) / 10 : null,
    avgMinutesSavedPerNote: avgMin > 0 ? Math.round(avgMin * 100) / 100 : null,
  };
});

// ── Power Providers ────────────────────────────────────────────────────────────

export interface PowerProviderRow {
  email: string;
  name: string;
  profession: string;
  programName: string;
  site: string;
  supervisor: string;
  notesLast7Days: number;
  notesLast30Days: number;
  notesLast90Days: number;
}

export const POWER_PROVIDERS: PowerProviderRow[] = providers
  .filter(p => p.status === 'Power Provider')
  .map(p => {
    const activeDays = daysBetween(dateOnly(p.firstNoteDate), dateOnly(p.latestNoteDate));
    const rate = p.generatedNotes / activeDays;
    return {
      email: p.email,
      name: p.name,
      profession: p.profession,
      programName: p.program,
      site: deriveSite(p.program),
      supervisor: p.supervisor,
      notesLast7Days:  Math.min(p.generatedNotes, Math.round(rate * 7)),
      notesLast30Days: Math.min(p.generatedNotes, Math.round(rate * 30)),
      notesLast90Days: Math.min(p.generatedNotes, Math.round(rate * 90)),
    };
  });

// ── Engagement Segments ────────────────────────────────────────────────────────

const toRow = (s: (typeof segs.awaitingFirstUse)[number]): PowerProviderRow => ({
  email:         s.email,
  name:          s.name,
  profession:    s.profession,
  programName:   s.programName,
  site:          s.site,
  supervisor:    s.supervisor,
  notesLast7Days:  s.notesLast7,
  notesLast30Days: s.notesLast30,
  notesLast90Days: s.notesLast90,
});

export const AWAITING_FIRST_USE:    PowerProviderRow[] = segs.awaitingFirstUse.map(toRow);
export const ONBOARDING_SLOW_START: PowerProviderRow[] = segs.onboardingSlowStart.map(toRow);
export const LOW_ENGAGEMENT:        PowerProviderRow[] = segs.lowEngagement.map(toRow);
export const DROPPED_OFF:           PowerProviderRow[] = segs.droppedOff.map(toRow);

// ── Top Ten Providers ──────────────────────────────────────────────────────────

export const TOP_TEN_PROVIDERS = [...providers]
  .sort((a, b) => b.generatedNotes - a.generatedNotes)
  .slice(0, 10)
  .map(p => ({ name: p.name, notes: p.generatedNotes }));

// ── Note Data & Feedback ───────────────────────────────────────────────────────
// Not present in new JSON source — retained from prior demo data.

export interface NoteDataRow {
  name: string;
  email: string;
  siteName: string;
  siteSegmentation: string;
  jobTitle: string;
  supervisor: string;
  program: string;
  noteCreationTime: string;
  activityType: string;
  isMobile: string;
  noteRating: string;
  noteFeedback: string;
}

export const NOTE_DATA: NoteDataRow[] = [
  { name: 'Felicia Henderson',  email: 'felicia.henderson@eleos.org',  siteName: 'Eleos Main',          siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Sarah Mitchell',     program: 'Older Adults',                    noteCreationTime: '2026-03-25 09:12:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Evelyn Mitchell',    email: 'evelyn.mitchell@eleos.org',    siteName: 'Eleos Main',          siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Kevin King',         program: 'Older Adults',                    noteCreationTime: '2026-03-25 09:45:00', activityType: 'Individual',       isMobile: 'No',  noteRating: '4',         noteFeedback: 'Good session summary.' },
  { name: 'Karen Stewart',      email: 'karen.stewart@eleos.org',      siteName: 'Northeast Campus',    siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'David Brown',        program: 'SBS-APS Northeast',               noteCreationTime: '2026-03-25 10:02:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Susan Walsh',        email: 'susan.walsh@eleos.org',        siteName: 'Southeast Site',      siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Robert Chen',        program: 'Southeast Adults',                noteCreationTime: '2026-03-26 08:30:00', activityType: 'Individual',       isMobile: 'No',  noteRating: '5',         noteFeedback: 'Excellent.' },
  { name: 'Harold Carter',      email: 'harold.carter@eleos.org',      siteName: 'Autism & I/DD Center',siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Jennifer Williams',  program: 'AICC-Y Autism & I/DD Counseling', noteCreationTime: '2026-03-25 11:15:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Brian Nelson',       email: 'brian.nelson@eleos.org',       siteName: 'Northeast Campus',    siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'James Anderson',     program: 'SBS - APS Northeast',             noteCreationTime: '2026-03-25 13:00:00', activityType: 'Individual',       isMobile: 'No',  noteRating: '5',         noteFeedback: 'Very thorough.' },
  { name: 'Pamela Adams',       email: 'pamela.adams@eleos.org',       siteName: 'Southeast Site',      siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Matthew Lee',        program: 'Southeast Adults',                noteCreationTime: '2026-03-19 14:20:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Diana Taylor',       email: 'diana.taylor@eleos.org',       siteName: 'Southeast Site',      siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Brandon Hall',       program: 'Southeast Adults',                noteCreationTime: '2026-03-25 15:10:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Daniel Pierce',      email: 'daniel.pierce@eleos.org',      siteName: 'Autism & I/DD Center',siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Maria Rodriguez',    program: 'AICC-Y Autism & I/DD Counseling', noteCreationTime: '2026-03-25 16:05:00', activityType: 'Individual',       isMobile: 'Yes', noteRating: '5',         noteFeedback: 'Perfect.' },
  { name: 'Rachel Martinez',    email: 'rachel.martinez@eleos.org',    siteName: 'Recovery Center',     siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Sarah Johnson',      program: 'Reset: Recovery Services',        noteCreationTime: '2026-03-25 08:00:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Christopher Reed',   email: 'christopher.reed@eleos.org',   siteName: 'Northeast Campus',    siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Jennifer Martinez',  program: 'SBS-APS Northeast',               noteCreationTime: '2026-03-25 09:00:00', activityType: 'Case Management',  isMobile: 'No',  noteRating: '5',         noteFeedback: 'Spot on.' },
  { name: 'Gregory Bell',       email: 'gregory.bell@eleos.org',       siteName: 'Charter School Hub',  siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Michael Johnson',    program: 'SBS - CCSD Charter Schools East', noteCreationTime: '2026-03-25 10:30:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Vincent Ross',       email: 'vincent.ross@eleos.org',       siteName: 'Child & Family Center',siteSegmentation:'N/A', jobTitle: 'Counselor',  supervisor: 'Kimberly Green',     program: 'Child & Family Outpatient North', noteCreationTime: '2026-03-25 11:45:00', activityType: 'Individual',       isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Gerald Wright',      email: 'gerald.wright@eleos.org',      siteName: 'West Vanguard',       siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Rebecca Wright',     program: 'West Vanguard',                   noteCreationTime: '2026-03-25 13:30:00', activityType: 'Individual',       isMobile: 'No',  noteRating: '4',         noteFeedback: 'Mostly accurate.' },
  { name: 'Brandon Turner',     email: 'brandon.turner@eleos.org',     siteName: 'Southeast Site',      siteSegmentation: 'N/A', jobTitle: 'Counselor',  supervisor: 'Ashley Harris',      program: 'Southeast Adults',                noteCreationTime: '2026-03-25 14:00:00', activityType: 'Peer Support',     isMobile: 'No',  noteRating: 'No Rating', noteFeedback: 'No Feedback' },
];

export interface FeedbackRow {
  noteCreatedDate: string;
  name: string;
  email: string;
  profession: string;
  noteRating: number;
  noteFeedback: string;
}

export const PROVIDER_FEEDBACK: FeedbackRow[] = [
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Susan Walsh',      email: 'susan.walsh@eleos.org',      profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Excellent.' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Daniel Pierce',    email: 'daniel.pierce@eleos.org',    profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Perfect.' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Brian Nelson',     email: 'brian.nelson@eleos.org',     profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Very thorough.' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Gregory Bell',     email: 'gregory.bell@eleos.org',     profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Paul Scott',       email: 'paul.scott@eleos.org',       profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Christopher Reed', email: 'christopher.reed@eleos.org', profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Spot on.' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Evelyn Mitchell',  email: 'evelyn.mitchell@eleos.org',  profession: 'COUNSELOR', noteRating: 4, noteFeedback: 'Good session summary.' },
  { noteCreatedDate: '2026-03-25 00:00:00', name: 'Natalie Brooks',   email: 'natalie.brooks@eleos.org',   profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-03-24 00:00:00', name: 'Gerald Wright',    email: 'gerald.wright@eleos.org',    profession: 'COUNSELOR', noteRating: 4, noteFeedback: 'Mostly accurate.' },
  { noteCreatedDate: '2026-03-24 00:00:00', name: 'Brian Nelson',     email: 'brian.nelson@eleos.org',     profession: 'COUNSELOR', noteRating: 4, noteFeedback: '' },
  { noteCreatedDate: '2026-03-23 00:00:00', name: 'Evelyn Mitchell',  email: 'evelyn.mitchell@eleos.org',  profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Great capture of goals.' },
  { noteCreatedDate: '2026-03-23 00:00:00', name: 'Daniel Pierce',    email: 'daniel.pierce@eleos.org',    profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-03-22 00:00:00', name: 'Susan Walsh',      email: 'susan.walsh@eleos.org',      profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Saved so much time.' },
  { noteCreatedDate: '2026-03-22 00:00:00', name: 'Gerald Wright',    email: 'gerald.wright@eleos.org',    profession: 'COUNSELOR', noteRating: 3, noteFeedback: 'Missed some key points.' },
  { noteCreatedDate: '2026-03-21 00:00:00', name: 'Brian Nelson',     email: 'brian.nelson@eleos.org',     profession: 'COUNSELOR', noteRating: 4, noteFeedback: '' },
  { noteCreatedDate: '2026-03-21 00:00:00', name: 'Paul Scott',       email: 'paul.scott@eleos.org',       profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Comprehensive.' },
  { noteCreatedDate: '2026-03-20 00:00:00', name: 'Natalie Brooks',   email: 'natalie.brooks@eleos.org',   profession: 'COUNSELOR', noteRating: 4, noteFeedback: '' },
  { noteCreatedDate: '2026-03-19 00:00:00', name: 'Evelyn Mitchell',  email: 'evelyn.mitchell@eleos.org',  profession: 'COUNSELOR', noteRating: 4, noteFeedback: 'Good overall.' },
  { noteCreatedDate: '2026-03-18 00:00:00', name: 'Susan Walsh',      email: 'susan.walsh@eleos.org',      profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-03-17 00:00:00', name: 'Daniel Pierce',    email: 'daniel.pierce@eleos.org',    profession: 'COUNSELOR', noteRating: 5, noteFeedback: 'Very accurate.' },
];
