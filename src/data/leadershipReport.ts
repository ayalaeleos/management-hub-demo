export interface ProgramRow {
  program: string;
  activatedProviders: number;
  generatedNotes: number;
  ratedNotes: number;
  averageNoteRating: number;
  hoursSaved: number;
  avgMinutesSavedPerNote: number;
}

export interface WeeklyDataPoint {
  week: string;
  notes: number;
}

export interface ActivityTypePoint {
  week: string;
  individual: number;
  caseManagement: number;
  peerSupport: number;
  psychiatry: number;
  other: number;
}

export const IMPACT_STATS = {
  notesGenerated: 2430000,
  hoursSaved: 408000,
  timeSavedPerNote: 10.1,
  averageNoteRating: 4.1,
};

export const ADOPTION_STATS = {
  licensesIssued: 24200,
  configuredProviders: 24600,
  activatedProviders: 16000,
  licenseUtilization: 101.5,
  awaitingFirstUse: 8540,
};

export const ONBOARDING_DONUT = [
  { label: 'Onboarding – First Week', value: 420, color: '#4DB6AC' },
  { label: 'Successful Onboarding', value: 1100, color: '#26C6DA' },
  { label: 'Onboarding – Slow Start', value: 380, color: '#283593' },
];

export const ONGOING_DONUT = [
  { label: 'Power Provider', value: 5200, color: '#283593' },
  { label: 'Active', value: 5800, color: '#26C6DA' },
  { label: 'Low Engagement', value: 1700, color: '#4DB6AC' },
  { label: 'Dropped Off', value: 1100, color: '#EF6C00' },
  { label: 'Re-Engaged', value: 300, color: '#78909C' },
];

export const WEEKLY_NOTES: WeeklyDataPoint[] = [
  { week: 'Apr\'25', notes: 1430 }, { week: 'May', notes: 2166 },
  { week: 'May', notes: 5100 }, { week: 'Jun', notes: 4124 },
  { week: 'Jun', notes: 4750 }, { week: 'Jul', notes: 5470 },
  { week: 'Jul', notes: 5856 }, { week: 'Aug', notes: 7980 },
  { week: 'Aug', notes: 8030 }, { week: 'Sep', notes: 10480 },
  { week: 'Sep', notes: 8837 }, { week: 'Oct', notes: 9819 },
  { week: 'Oct', notes: 9582 }, { week: 'Nov', notes: 10819 },
  { week: 'Nov', notes: 12140 }, { week: 'Dec', notes: 14150 },
  { week: 'Dec', notes: 4510 }, { week: 'Jan\'26', notes: 16980 },
  { week: 'Jan', notes: 24260 }, { week: 'Feb', notes: 20230 },
  { week: 'Feb', notes: 23300 }, { week: 'Mar', notes: 27400 },
  { week: 'Mar', notes: 38100 }, { week: 'Apr', notes: 41500 },
  { week: 'Apr', notes: 34800 }, { week: 'May', notes: 42600 },
  { week: 'May', notes: 57400 }, { week: 'Jun', notes: 45700 },
  { week: 'Jun', notes: 54300 }, { week: 'Jul', notes: 57200 },
  { week: 'Jul', notes: 62400 }, { week: 'Aug', notes: 56400 },
  { week: 'Aug', notes: 66700 }, { week: 'Sep', notes: 69700 },
  { week: 'Sep', notes: 74400 }, { week: 'Oct', notes: 80400 },
  { week: 'Oct', notes: 85800 }, { week: 'Nov', notes: 77600 },
  { week: 'Nov', notes: 82500 }, { week: 'Dec', notes: 98700 },
  { week: 'Dec', notes: 106000 }, { week: 'Jan\'26', notes: 106000 },
  { week: 'Jan', notes: 121000 }, { week: 'Feb', notes: 129000 },
  { week: 'Feb', notes: 130000 }, { week: 'Mar', notes: 124000 },
  { week: 'Mar', notes: 134000 }, { week: 'Apr', notes: 134000 },
  { week: 'Apr', notes: 764 },
];

export const PROGRAM_DATA: ProgramRow[] = [
  { program: 'Not Assigned to Program', activatedProviders: 5930, generatedNotes: 957000, ratedNotes: 13900, averageNoteRating: 4.4, hoursSaved: 125000, avgMinutesSavedPerNote: 7.83 },
  { program: 'Outpatient', activatedProviders: 301, generatedNotes: 32100, ratedNotes: 851, averageNoteRating: 4.51, hoursSaved: 4160, avgMinutesSavedPerNote: 7.78 },
  { program: '340999 Child Community Based', activatedProviders: 284, generatedNotes: 33200, ratedNotes: 194, averageNoteRating: 4.74, hoursSaved: 4940, avgMinutesSavedPerNote: 8.93 },
  { program: 'ACT', activatedProviders: 251, generatedNotes: 48000, ratedNotes: 331, averageNoteRating: 4.6, hoursSaved: 7370, avgMinutesSavedPerNote: 9.21 },
  { program: 'Adult Services', activatedProviders: 180, generatedNotes: 23300, ratedNotes: 195, averageNoteRating: 4.27, hoursSaved: 3330, avgMinutesSavedPerNote: 8.55 },
  { program: '220999 Adult Comm Support Services', activatedProviders: 153, generatedNotes: 19200, ratedNotes: 273, averageNoteRating: 4.35, hoursSaved: 2410, avgMinutesSavedPerNote: 7.55 },
  { program: 'MH/SUD', activatedProviders: 116, generatedNotes: 47900, ratedNotes: 481, averageNoteRating: 4.42, hoursSaved: 7450, avgMinutesSavedPerNote: 9.33 },
  { program: 'Child & Adolescent', activatedProviders: 98, generatedNotes: 12400, ratedNotes: 142, averageNoteRating: 4.38, hoursSaved: 1820, avgMinutesSavedPerNote: 8.81 },
  { program: 'Crisis Stabilization', activatedProviders: 87, generatedNotes: 9800, ratedNotes: 203, averageNoteRating: 4.55, hoursSaved: 1540, avgMinutesSavedPerNote: 9.43 },
  { program: 'Substance Use', activatedProviders: 74, generatedNotes: 8200, ratedNotes: 118, averageNoteRating: 4.29, hoursSaved: 1210, avgMinutesSavedPerNote: 8.86 },
];
