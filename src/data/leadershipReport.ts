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

export const ACTIVITY_TYPE_DATA: ActivityTypePoint[] = [
  { week: "Apr'25", individual: 860, other: 286, caseManagement: 143, peerSupport: 86, psychiatry: 55 },
  { week: 'May', individual: 1300, other: 433, caseManagement: 216, peerSupport: 130, psychiatry: 87 },
  { week: 'May', individual: 3060, other: 1020, caseManagement: 510, peerSupport: 306, psychiatry: 204 },
  { week: 'Jun', individual: 2474, other: 825, caseManagement: 412, peerSupport: 247, psychiatry: 166 },
  { week: 'Jun', individual: 2850, other: 950, caseManagement: 475, peerSupport: 285, psychiatry: 190 },
  { week: 'Jul', individual: 3282, other: 1094, caseManagement: 547, peerSupport: 328, psychiatry: 219 },
  { week: 'Jul', individual: 3514, other: 1171, caseManagement: 586, peerSupport: 351, psychiatry: 234 },
  { week: 'Aug', individual: 4788, other: 1596, caseManagement: 798, peerSupport: 479, psychiatry: 319 },
  { week: 'Aug', individual: 4818, other: 1606, caseManagement: 803, peerSupport: 482, psychiatry: 321 },
  { week: 'Sep', individual: 6288, other: 2096, caseManagement: 1048, peerSupport: 629, psychiatry: 419 },
  { week: 'Sep', individual: 5302, other: 1767, caseManagement: 884, peerSupport: 530, psychiatry: 354 },
  { week: 'Oct', individual: 5891, other: 1964, caseManagement: 982, peerSupport: 589, psychiatry: 393 },
  { week: 'Oct', individual: 5749, other: 1916, caseManagement: 958, peerSupport: 575, psychiatry: 383 },
  { week: 'Nov', individual: 6491, other: 2164, caseManagement: 1082, peerSupport: 649, psychiatry: 433 },
  { week: 'Nov', individual: 7284, other: 2428, caseManagement: 1214, peerSupport: 728, psychiatry: 486 },
  { week: 'Dec', individual: 8490, other: 2830, caseManagement: 1415, peerSupport: 849, psychiatry: 566 },
  { week: 'Dec', individual: 2706, other: 902, caseManagement: 451, peerSupport: 271, psychiatry: 180 },
  { week: "Jan'26", individual: 10188, other: 3396, caseManagement: 1698, peerSupport: 1019, psychiatry: 679 },
  { week: 'Jan', individual: 14556, other: 4852, caseManagement: 2426, peerSupport: 1456, psychiatry: 970 },
  { week: 'Feb', individual: 12138, other: 4046, caseManagement: 2023, peerSupport: 1214, psychiatry: 809 },
  { week: 'Feb', individual: 13980, other: 4660, caseManagement: 2330, peerSupport: 1398, psychiatry: 932 },
  { week: 'Mar', individual: 16440, other: 5480, caseManagement: 2740, peerSupport: 1644, psychiatry: 1096 },
  { week: 'Mar', individual: 22860, other: 7620, caseManagement: 3810, peerSupport: 2286, psychiatry: 1524 },
  { week: 'Apr', individual: 24900, other: 8300, caseManagement: 4150, peerSupport: 2490, psychiatry: 1660 },
  { week: 'Apr', individual: 20880, other: 6960, caseManagement: 3480, peerSupport: 2088, psychiatry: 1392 },
  { week: 'May', individual: 25560, other: 8520, caseManagement: 4260, peerSupport: 2556, psychiatry: 1704 },
  { week: 'May', individual: 34440, other: 11480, caseManagement: 5740, peerSupport: 3444, psychiatry: 2296 },
  { week: 'Jun', individual: 27420, other: 9140, caseManagement: 4570, peerSupport: 2742, psychiatry: 1828 },
  { week: 'Jun', individual: 32580, other: 10860, caseManagement: 5430, peerSupport: 3258, psychiatry: 2172 },
  { week: 'Jul', individual: 34320, other: 11440, caseManagement: 5720, peerSupport: 3432, psychiatry: 2288 },
  { week: 'Jul', individual: 37440, other: 12480, caseManagement: 6240, peerSupport: 3744, psychiatry: 2496 },
  { week: 'Aug', individual: 33840, other: 11280, caseManagement: 5640, peerSupport: 3384, psychiatry: 2256 },
  { week: 'Aug', individual: 40020, other: 13340, caseManagement: 6670, peerSupport: 4002, psychiatry: 2668 },
  { week: 'Sep', individual: 41820, other: 13940, caseManagement: 6970, peerSupport: 4182, psychiatry: 2788 },
  { week: 'Sep', individual: 44640, other: 14880, caseManagement: 7440, peerSupport: 4464, psychiatry: 2976 },
  { week: 'Oct', individual: 48240, other: 16080, caseManagement: 8040, peerSupport: 4824, psychiatry: 3216 },
  { week: 'Oct', individual: 51480, other: 17160, caseManagement: 8580, peerSupport: 5148, psychiatry: 3432 },
  { week: 'Nov', individual: 46560, other: 15520, caseManagement: 7760, peerSupport: 4656, psychiatry: 3104 },
  { week: 'Nov', individual: 49500, other: 16500, caseManagement: 8250, peerSupport: 4950, psychiatry: 3300 },
  { week: 'Dec', individual: 59220, other: 19740, caseManagement: 9870, peerSupport: 5922, psychiatry: 3948 },
  { week: 'Dec', individual: 63600, other: 21200, caseManagement: 10600, peerSupport: 6360, psychiatry: 4240 },
  { week: "Jan'26", individual: 63600, other: 21200, caseManagement: 10600, peerSupport: 6360, psychiatry: 4240 },
  { week: 'Jan', individual: 72600, other: 24200, caseManagement: 12100, peerSupport: 7260, psychiatry: 4840 },
  { week: 'Feb', individual: 77400, other: 25800, caseManagement: 12900, peerSupport: 7740, psychiatry: 5160 },
  { week: 'Feb', individual: 78000, other: 26000, caseManagement: 13000, peerSupport: 7800, psychiatry: 5200 },
  { week: 'Mar', individual: 74400, other: 24800, caseManagement: 12400, peerSupport: 7440, psychiatry: 4960 },
  { week: 'Mar', individual: 80400, other: 26800, caseManagement: 13400, peerSupport: 8040, psychiatry: 5360 },
  { week: 'Apr', individual: 80400, other: 26800, caseManagement: 13400, peerSupport: 8040, psychiatry: 5360 },
  { week: 'Apr', individual: 458, other: 153, caseManagement: 76, peerSupport: 46, psychiatry: 31 },
];

export const NOTES_PER_PROVIDER: { week: string; avg: number }[] = [
  { week: "Apr'25", avg: 9.82 }, { week: 'May', avg: 10.26 },
  { week: 'May', avg: 9.52 }, { week: 'Jun', avg: 10.26 },
  { week: 'Jun', avg: 8.69 }, { week: 'Jul', avg: 9.64 },
  { week: 'Jul', avg: 9.64 }, { week: 'Aug', avg: 9.36 },
  { week: 'Aug', avg: 8.34 }, { week: 'Sep', avg: 9.47 },
  { week: 'Sep', avg: 8.65 }, { week: 'Oct', avg: 8.32 },
  { week: 'Oct', avg: 10.23 }, { week: 'Nov', avg: 9.96 },
  { week: 'Nov', avg: 10.37 }, { week: 'Dec', avg: 10.75 },
  { week: 'Dec', avg: 9.64 }, { week: "Jan'26", avg: 10.37 },
  { week: 'Jan', avg: 9.96 }, { week: 'Feb', avg: 10.69 },
  { week: 'Feb', avg: 6.9 }, { week: 'Mar', avg: 11.11 },
  { week: 'Mar', avg: 11.42 }, { week: 'Apr', avg: 11.37 },
  { week: 'Apr', avg: 11.82 }, { week: 'May', avg: 11.43 },
  { week: 'May', avg: 9.7 }, { week: 'Jun', avg: 7.94 },
  { week: 'Jun', avg: 8.33 }, { week: 'Jul', avg: 10.67 },
  { week: 'Jul', avg: 9.9 }, { week: 'Aug', avg: 11.42 },
  { week: 'Aug', avg: 11.86 }, { week: 'Sep', avg: 11.91 },
  { week: 'Sep', avg: 12.44 }, { week: 'Oct', avg: 11.46 },
  { week: 'Oct', avg: 12.42 }, { week: 'Nov', avg: 11.1 },
  { week: 'Nov', avg: 12.03 }, { week: 'Dec', avg: 12.79 },
  { week: 'Dec', avg: 12.29 }, { week: "Jan'26", avg: 12.4 },
  { week: 'Jan', avg: 11.1 }, { week: 'Feb', avg: 7.14 },
  { week: 'Feb', avg: 8.33 }, { week: 'Mar', avg: 10.67 },
  { week: 'Mar', avg: 9.9 }, { week: 'Apr', avg: 11.42 },
  { week: 'Apr', avg: 3.6 },
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

export const POWER_PROVIDERS: PowerProviderRow[] = [
  { email: 'JHenri@sweetser.org', name: 'Jacqueline Henri', profession: 'CM', programName: 'Saco Sweetser School', site: 'Sweetser', supervisor: 'Kimberly Holmes', notesLast7Days: 16, notesLast30Days: 63, notesLast90Days: 161 },
  { email: 'Janice.Webster@wellpower.org', name: 'Janice Webster', profession: 'LPC', programName: '222 – Humboldt OPT', site: 'Wellpower', supervisor: 'Kim Riddle', notesLast7Days: 36, notesLast30Days: 100, notesLast90Days: 357 },
  { email: 'jamie.bennett@centerstone.org', name: 'Jamie Bennett', profession: 'LCSW', programName: 'N/A', site: 'Centerstone Scribe: TN Eastern Time Zone', supervisor: 'N/A', notesLast7Days: 9, notesLast30Days: 96, notesLast90Days: 224 },
  { email: 'sydney.koontz@centerstone.org', name: 'Sydney Koontz', profession: 'CM', programName: 'N/A', site: 'Centerstone Scribe: TN Central Time Zone', supervisor: 'N/A', notesLast7Days: 27, notesLast30Days: 169, notesLast90Days: 403 },
  { email: 'r.patel@meridianhealth.org', name: 'Ravi Patel', profession: 'LCSW', programName: 'Adult Outpatient', site: 'Meridian Health', supervisor: 'Sandra Cho', notesLast7Days: 22, notesLast30Days: 88, notesLast90Days: 278 },
  { email: 'tmorgan@pathwaysmhc.com', name: 'Tina Morgan', profession: 'MFT', programName: 'ACT Team', site: 'Pathways MHC', supervisor: 'David Reyes', notesLast7Days: 31, notesLast30Days: 124, notesLast90Days: 389 },
  { email: 'elena.v@sunrisecare.org', name: 'Elena Vasquez', profession: 'LPC', programName: '310 – Crisis OPT', site: 'Sunrise Care', supervisor: 'Mark Griffin', notesLast7Days: 18, notesLast30Days: 72, notesLast90Days: 198 },
  { email: 'brian.ochoa@hopecenter.net', name: 'Brian Ochoa', profession: 'LPCC', programName: 'N/A', site: 'Hope Center West', supervisor: 'N/A', notesLast7Days: 14, notesLast30Days: 61, notesLast90Days: 175 },
  { email: 'ksmith@valleymhc.org', name: 'Karen Smith', profession: 'CM', programName: 'Substance Use', site: 'Valley MHC', supervisor: 'Julie Torres', notesLast7Days: 29, notesLast30Days: 113, notesLast90Days: 341 },
  { email: 'nathaniel.h@bridgeway.com', name: 'Nathaniel Hall', profession: 'Psychiatrist', programName: 'Inpatient', site: 'Bridgeway Hospital', supervisor: 'Dr. Lisa Park', notesLast7Days: 41, notesLast30Days: 158, notesLast90Days: 462 },
  { email: 'cwright@lakemhc.org', name: 'Christine Wright', profession: 'LMFT', programName: '115 – Child & Fam', site: 'Lake MHC', supervisor: 'Robert Simmons', notesLast7Days: 12, notesLast30Days: 51, notesLast90Days: 148 },
  { email: 'j.espinoza@crestview.net', name: 'Juan Espinoza', profession: 'CADC', programName: 'Recovery Support', site: 'Crestview Center', supervisor: 'Angela Wu', notesLast7Days: 24, notesLast30Days: 95, notesLast90Days: 272 },
  { email: 'mwilliams@northstarmh.org', name: 'Maria Williams', profession: 'LPC', programName: 'Outpatient', site: 'North Star MH', supervisor: 'Thomas King', notesLast7Days: 19, notesLast30Days: 76, notesLast90Days: 220 },
  { email: 'derek.b@encompasscare.com', name: 'Derek Barnes', profession: 'LCSW', programName: 'N/A', site: 'Encompass Care', supervisor: 'N/A', notesLast7Days: 33, notesLast30Days: 131, notesLast90Days: 376 },
  { email: 'priya.m@harmonyhealth.org', name: 'Priya Mehta', profession: 'MFT', programName: '408 – OPT Adult', site: 'Harmony Health', supervisor: 'Carol Jensen', notesLast7Days: 25, notesLast30Days: 102, notesLast90Days: 308 },
  { email: 'alex.ruiz@cornerstone.org', name: 'Alex Ruiz', profession: 'CM', programName: 'ACT', site: 'Cornerstone Behavioral', supervisor: 'Frank Dell', notesLast7Days: 17, notesLast30Days: 68, notesLast90Days: 192 },
  { email: 'sarah.fn@mountainview.net', name: 'Sarah Nguyen', profession: 'LPCC', programName: 'N/A', site: 'Mountain View Scribe: CO', supervisor: 'N/A', notesLast7Days: 38, notesLast30Days: 148, notesLast90Days: 421 },
  { email: 'c.johnson@risingstar.org', name: 'Calvin Johnson', profession: 'LPC', programName: 'Crisis Stabilization', site: 'Rising Star MHC', supervisor: 'Nancy Moore', notesLast7Days: 21, notesLast30Days: 84, notesLast90Days: 241 },
  { email: 'diana.k@peakwellness.com', name: 'Diana Kim', profession: 'Psychiatrist', programName: 'Inpatient', site: 'Peak Wellness', supervisor: 'Dr. James Ortiz', notesLast7Days: 44, notesLast30Days: 172, notesLast90Days: 498 },
  { email: 'tom.brady@cedarsmh.org', name: 'Tom Brady', profession: 'LCSW', programName: 'Dual Diagnosis', site: 'Cedars MH', supervisor: 'Rachel Stone', notesLast7Days: 28, notesLast30Days: 110, notesLast90Days: 322 },
];

export const AWAITING_FIRST_USE: PowerProviderRow[] = [
  { email: 'cdecato@hcrs.org', name: 'Christine Decato', profession: 'CM', programName: 'Developmental Services', site: 'HCRS', supervisor: 'Charles Tripp', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'Julissa.Castro@victor.org', name: 'Julissa Castro', profession: 'OUTREACH_CASE_MANAGER', programName: 'VCSS Fairfield (61)', site: 'Victor', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'Maricela.Gonzalez@victor.org', name: 'Maricela Gonzalez', profession: 'OUTREACH_CASE_MANAGER', programName: 'VCSS Hemet (47)', site: 'Victor', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'rfoerster@newportmh.org', name: 'Robert Foerster', profession: 'COUNSELOR', programName: 'Team S', site: 'Newport', supervisor: 'Jill McLeish', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'p.nguyen@advancedmh.org', name: 'Peter Nguyen', profession: 'LCSW', programName: 'N/A', site: 'Advanced MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'tamara.jones@wellbridge.net', name: 'Tamara Jones', profession: 'CM', programName: 'Dual Diagnosis', site: 'Wellbridge', supervisor: 'Karen Hill', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'l.hernandez@pacificmhc.org', name: 'Luis Hernandez', profession: 'COUNSELOR', programName: 'VCSS North (12)', site: 'Pacific MHC', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'amelia.w@riverbendcare.com', name: 'Amelia Walsh', profession: 'LPC', programName: 'Outpatient Adult', site: 'Riverbend Care', supervisor: 'Marcus Bell', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'dsmith@communitybridge.org', name: 'Derrick Smith', profession: 'OUTREACH_CASE_MANAGER', programName: 'N/A', site: 'Community Bridge', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'f.morales@sunshinerecovery.net', name: 'Felix Morales', profession: 'CADC', programName: 'Recovery Program', site: 'Sunshine Recovery', supervisor: 'Diane Ross', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'nadia.k@lakeviewmhc.org', name: 'Nadia Khan', profession: 'MFT', programName: 'Family Services', site: 'Lakeview MHC', supervisor: 'George Evans', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'bthomas@canyoncare.com', name: 'Blake Thomas', profession: 'LMFT', programName: 'N/A', site: 'Canyon Care', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'irene.p@horizonbh.org', name: 'Irene Park', profession: 'CM', programName: 'VCSS San Diego (8)', site: 'Horizon BH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'oscar.f@summitmh.net', name: 'Oscar Flores', profession: 'COUNSELOR', programName: 'Residential', site: 'Summit MH', supervisor: 'Patricia Lane', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'grace.l@clearwatermhc.org', name: 'Grace Liu', profession: 'LPCC', programName: 'Child & Family', site: 'Clearwater MHC', supervisor: 'Steven Park', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'marcus.d@pathfinder.org', name: 'Marcus Diaz', profession: 'LPC', programName: 'N/A', site: 'Pathfinder', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'v.chen@starbrightmh.com', name: 'Victoria Chen', profession: 'LCSW', programName: 'ACT Team B', site: 'Starbright MH', supervisor: 'Robert Banks', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'h.okafor@unityhealth.org', name: 'Henry Okafor', profession: 'COUNSELOR', programName: 'Substance Use', site: 'Unity Health', supervisor: 'Sandra White', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'isabelle.r@novamhc.net', name: 'Isabelle Reed', profession: 'MFT', programName: 'N/A', site: 'Nova MHC', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'j.washington@brightpath.org', name: 'Jerome Washington', profession: 'CM', programName: 'Crisis Residential', site: 'Bright Path', supervisor: 'Angela Foster', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
];

export const ONBOARDING_SLOW_START: PowerProviderRow[] = [
  { email: 'CrystalR@ccsww.org', name: 'Crystal Richey', profession: 'OUTREACH_CASE_MANAGER', programName: 'N/A', site: 'Catholic Community Services of Western Washington', supervisor: 'N/A', notesLast7Days: 1, notesLast30Days: 9, notesLast90Days: 9 },
  { email: 'shwilliams@lighthouseok.com', name: 'Shannon Williams', profession: 'LCSW', programName: 'N/A', site: 'Lighthouse', supervisor: 'JENNIFER OHRMUNDT', notesLast7Days: 6, notesLast30Days: 14, notesLast90Days: 14 },
  { email: 'Irland.Breceda@metrocareservices.org', name: 'Irland Breceda', profession: 'LCSW', programName: '344-MH Satellite Clinics', site: 'Metrocare', supervisor: 'LaTronda King', notesLast7Days: 2, notesLast30Days: 3, notesLast90Days: 3 },
  { email: 'tbushe@gandaracenter.org', name: 'Bushe Tariro', profession: 'CM', programName: '706140-CSA WORCESTER', site: 'Gandara', supervisor: 'Doucette, Christina', notesLast7Days: 0, notesLast30Days: 2, notesLast90Days: 2 },
  { email: 'maria.santos@hopemhc.org', name: 'Maria Santos', profession: 'LMFT', programName: 'N/A', site: 'Hope MHC', supervisor: 'N/A', notesLast7Days: 3, notesLast30Days: 7, notesLast90Days: 7 },
  { email: 'j.okafor@communityreach.net', name: 'James Okafor', profession: 'CM', programName: '201-Adult Outpatient', site: 'Community Reach', supervisor: 'Brenda Mills', notesLast7Days: 1, notesLast30Days: 4, notesLast90Days: 4 },
  { email: 'patricia.l@valleycare.org', name: 'Patricia Lim', profession: 'COUNSELOR', programName: 'N/A', site: 'Valley Care', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 3, notesLast90Days: 3 },
  { email: 'derek.ng@bridgecenter.com', name: 'Derek Ng', profession: 'LCSW', programName: '512-Crisis Services', site: 'Bridge Center', supervisor: 'Rachel Monroe', notesLast7Days: 4, notesLast30Days: 11, notesLast90Days: 11 },
  { email: 'aisha.b@sunriserecovery.org', name: 'Aisha Brown', profession: 'OUTREACH_CASE_MANAGER', programName: 'N/A', site: 'Sunrise Recovery', supervisor: 'N/A', notesLast7Days: 2, notesLast30Days: 6, notesLast90Days: 6 },
  { email: 'tom.w@peakbehavioral.net', name: 'Tom Walters', profession: 'LPCC', programName: '800-Residential', site: 'Peak Behavioral', supervisor: 'Sandra Choi', notesLast7Days: 1, notesLast30Days: 5, notesLast90Days: 5 },
  { email: 'nina.r@clearskymh.org', name: 'Nina Rodriguez', profession: 'CM', programName: 'N/A', site: 'Clear Sky MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 2, notesLast90Days: 2 },
  { email: 'c.evans@northpointcare.com', name: 'Calvin Evans', profession: 'LCSW', programName: '100-Child & Family', site: 'Northpoint Care', supervisor: 'Linda Torres', notesLast7Days: 3, notesLast30Days: 8, notesLast90Days: 8 },
];

export const DROPPED_OFF: PowerProviderRow[] = [
  { email: 'jkyle@grandmh.com', name: 'Joshua Kyle', profession: 'CM', programName: 'N/A', site: 'Grand Lake', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'PJ.Brooks@caslinc.org', name: 'Phillip Brooks', profession: 'CM', programName: 'N/A', site: 'Community Assisted and Supported Living', supervisor: 'Scott.Eller@caslinc.org', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'lfitzpatrick@grandmh.com', name: 'Leah Fitzpatrick', profession: 'CM', programName: 'N/A', site: 'Grand Lake', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'brandi.goff@regionten.org', name: 'Brandi Goff', profession: 'CM', programName: 'MH CM', site: 'Region Ten CSB', supervisor: 'Charlie Fawcett', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'melody.wallace@fccinc.org', name: 'Melody Wallace', profession: 'CM', programName: 'Piedmont Youth - Sugar', site: 'FCC Behavioral Health', supervisor: 'Adrienne Barton', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'teresa.m@brightfutures.org', name: 'Teresa Morgan', profession: 'LCSW', programName: 'N/A', site: 'Bright Futures', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'd.shaw@horizonbh.net', name: 'Darrell Shaw', profession: 'CM', programName: 'N/A', site: 'Horizon BH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'kim.a@clearwatermh.com', name: 'Kimberly Adams', profession: 'LMFT', programName: 'N/A', site: 'Clearwater MH', supervisor: 'Ryan Scott', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'r.bell@summitcs.org', name: 'Raymond Bell', profession: 'CM', programName: 'N/A', site: 'Summit CS', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'angela.w@maplecrest.net', name: 'Angela Wilkins', profession: 'COUNSELOR', programName: 'N/A', site: 'Maple Crest', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'h.young@riverpointcare.org', name: 'Harold Young', profession: 'LCSW', programName: 'N/A', site: 'Riverpoint Care', supervisor: 'Donna Blake', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'lisa.p@newdawnmh.com', name: 'Lisa Patterson', profession: 'CM', programName: 'N/A', site: 'New Dawn MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'e.harris@oaklandclinic.org', name: 'Evan Harris', profession: 'PSYCHIATRIST', programName: 'N/A', site: 'Oakland Clinic', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'c.martin@pinewoodcs.net', name: 'Christine Martin', profession: 'LPCC', programName: 'N/A', site: 'Pinewood CS', supervisor: 'Gerald Fox', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'wayne.r@valleymhc.org', name: 'Wayne Robinson', profession: 'CM', programName: 'N/A', site: 'Valley MHC', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'grace.t@cedarmh.com', name: 'Grace Turner', profession: 'LCSW', programName: 'N/A', site: 'Cedar MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'b.james@easthillcs.org', name: 'Bruce James', profession: 'CM', programName: 'N/A', site: 'East Hill CS', supervisor: 'Tara Simmons', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'nancy.c@westviewmh.net', name: 'Nancy Collins', profession: 'OUTREACH_CASE_MANAGER', programName: 'N/A', site: 'Westview MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'j.ward@springfieldcs.org', name: 'Jeffrey Ward', profession: 'LMFT', programName: 'N/A', site: 'Springfield CS', supervisor: 'Paula Grant', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
  { email: 'm.cooper@bluehillmh.com', name: 'Martha Cooper', profession: 'CM', programName: 'N/A', site: 'Blue Hill MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 0 },
];

export const LOW_ENGAGEMENT: PowerProviderRow[] = [
  { email: 'nburks@grandmh.com', name: 'Nicole Burks', profession: 'CM', programName: 'N/A', site: 'Grand Lake', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 2 },
  { email: 'r.mcdaniel@lumerahealthcare.com', name: 'Randy McDaniel', profession: 'LCSW', programName: 'N/A', site: 'Lumera Healthcare', supervisor: 'Hannah Klein', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 1 },
  { email: 'kniedt@interborough.org', name: 'Katie Niedt', profession: 'PSYCHIATRIST', programName: 'N/A', site: 'Interborough Developmental & Consultation Center Inc', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 17 },
  { email: 'violet.jones@wcenters.org', name: 'Violet Jones', profession: 'CM', programName: 'N/A', site: 'WoodlandOutpatient', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 1 },
  { email: 'b.harris@centerpoint.org', name: 'Bernard Harris', profession: 'LMFT', programName: 'N/A', site: 'Centerpoint', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 3 },
  { email: 'laura.p@stepsforward.com', name: 'Laura Patel', profession: 'CM', programName: 'N/A', site: 'Steps Forward', supervisor: 'Derek Olson', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 4 },
  { email: 'c.nguyen@hopewellmh.org', name: 'Carol Nguyen', profession: 'COUNSELOR', programName: 'N/A', site: 'Hopewell MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 2 },
  { email: 'marvin.t@lakesideclinic.net', name: 'Marvin Torres', profession: 'LCSW', programName: 'N/A', site: 'Lakeside Clinic', supervisor: 'Amy Reyes', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 5 },
  { email: 'p.brooks@sunvalleycare.org', name: 'Patricia Brooks', profession: 'OUTREACH_CASE_MANAGER', programName: 'N/A', site: 'Sun Valley Care', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 1 },
  { email: 'gene.w@riverviewmh.com', name: 'Gene Watkins', profession: 'CM', programName: 'N/A', site: 'Riverview MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 6 },
  { email: 'diana.m@pinecrest.org', name: 'Diana Moore', profession: 'LPCC', programName: 'N/A', site: 'Pinecrest', supervisor: 'James Carter', notesLast7Days: 0, notesLast30Days: 1, notesLast90Days: 8 },
  { email: 'f.reed@valleyhope.net', name: 'Frank Reed', profession: 'LCSW', programName: 'N/A', site: 'Valley Hope', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 3 },
  { email: 'alice.j@midcitymh.org', name: 'Alice Johnson', profession: 'CM', programName: 'N/A', site: 'Mid-City MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 2 },
  { email: 'r.chen@eastsidewellness.com', name: 'Robert Chen', profession: 'PSYCHIATRIST', programName: 'N/A', site: 'Eastside Wellness', supervisor: 'Karen Wu', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 9 },
  { email: 's.flores@communitymhc.org', name: 'Sofia Flores', profession: 'COUNSELOR', programName: 'N/A', site: 'Community MHC', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 4 },
  { email: 'ben.k@westgateclinic.net', name: 'Benjamin Kim', profession: 'LMFT', programName: 'N/A', site: 'Westgate Clinic', supervisor: 'Tina Walsh', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 7 },
  { email: 'helen.o@northstarcs.org', name: 'Helen Owens', profession: 'CM', programName: 'N/A', site: 'Northstar CS', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 1 },
  { email: 'j.price@horizonbh.com', name: 'Jerome Price', profession: 'LCSW', programName: 'N/A', site: 'Horizon BH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 5 },
  { email: 'miranda.v@bluepointmh.org', name: 'Miranda Vance', profession: 'OUTREACH_CASE_MANAGER', programName: 'N/A', site: 'Bluepoint MH', supervisor: 'N/A', notesLast7Days: 0, notesLast30Days: 0, notesLast90Days: 2 },
  { email: 'c.stone@silverlakecs.net', name: 'Carl Stone', profession: 'CM', programName: 'N/A', site: 'Silver Lake CS', supervisor: 'Marie Lopez', notesLast7Days: 0, notesLast30Days: 1, notesLast90Days: 10 },
];

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
  { name: 'Bertha Montes', email: 'baliciam@tccsc.org', siteName: 'Tessie Cleveland Community Services Corporation', siteSegmentation: 'LACDMH', jobTitle: 'WrapAround Parent Partner/Peer Specialist', supervisor: 'Henderson, Tayler', program: 'Wraparound 6', noteCreationTime: '2026-04-09 01:23:56', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Nancy Vieyra', email: 'nancy.vieyra@victor.org', siteName: 'Victor', siteSegmentation: 'N/A', jobTitle: 'Clinician', supervisor: 'N/A', program: 'VCSS Perris (42)', noteCreationTime: '2026-04-09 04:12:29', activityType: 'No Session Type', isMobile: 'Yes', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Agostina Vanacore', email: 'avanacore@hillsides.org', siteName: 'Hillsides', siteSegmentation: 'N/A', jobTitle: 'N/A', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 04:11:45', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Irene Gonzalez', email: 'irenego@edgewood.org', siteName: 'Edgewood Center', siteSegmentation: 'N/A', jobTitle: 'Bi-lingual Clinician', supervisor: 'Sarah Pizer-Bush', program: 'TURN CY', noteCreationTime: '2026-04-09 01:53:57', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Quan Truong', email: 'Quan.Truong@victor.org', siteName: 'Victor', siteSegmentation: 'N/A', jobTitle: 'FSC-Mental Health Specialist', supervisor: 'N/A', program: 'VCSS Hemet (47)', noteCreationTime: '2026-04-09 04:35:46', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Kelloe Cordrey', email: 'kcordrey@zepfcenter.org', siteName: 'Zepf', siteSegmentation: 'Central', jobTitle: 'Case Manager', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 00:43:13', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Elizabeth Ybarra', email: 'EYbarra@ccsww.org', siteName: 'Catholic Community Services of Western Washington', siteSegmentation: 'N/A', jobTitle: 'N/A', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 01:47:52', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Marcus Webb', email: 'm.webb@hopewellmh.org', siteName: 'Hopewell MH', siteSegmentation: 'N/A', jobTitle: 'Case Manager', supervisor: 'Linda Torres', program: 'Adult Outpatient', noteCreationTime: '2026-04-09 02:11:00', activityType: 'Individual', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Diane Fuller', email: 'd.fuller@bridgecenter.com', siteName: 'Bridge Center', siteSegmentation: 'N/A', jobTitle: 'Clinician', supervisor: 'Rachel Monroe', program: 'Crisis Services', noteCreationTime: '2026-04-09 03:02:45', activityType: 'No Session Type', isMobile: 'Yes', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Paul Nguyen', email: 'p.nguyen@valleycare.org', siteName: 'Valley Care', siteSegmentation: 'N/A', jobTitle: 'Peer Support Specialist', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 00:58:33', activityType: 'Peer Support', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Sandra Price', email: 's.price@clearskymh.org', siteName: 'Clear Sky MH', siteSegmentation: 'N/A', jobTitle: 'LCSW', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 05:14:22', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Tony Marshall', email: 't.marshall@peakbehavioral.net', siteName: 'Peak Behavioral', siteSegmentation: 'N/A', jobTitle: 'LPCC', supervisor: 'Sandra Choi', program: 'Residential', noteCreationTime: '2026-04-09 01:39:10', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Helen Chase', email: 'h.chase@communityreach.net', siteName: 'Community Reach', siteSegmentation: 'N/A', jobTitle: 'CM', supervisor: 'Brenda Mills', program: 'Adult Outpatient', noteCreationTime: '2026-04-09 06:05:17', activityType: 'Case Management', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Robert Osei', email: 'r.osei@northpointcare.com', siteName: 'Northpoint Care', siteSegmentation: 'N/A', jobTitle: 'LCSW', supervisor: 'Linda Torres', program: 'Child & Family', noteCreationTime: '2026-04-09 02:47:55', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Carla Jensen', email: 'c.jensen@sunriserecovery.org', siteName: 'Sunrise Recovery', siteSegmentation: 'N/A', jobTitle: 'OUTREACH_CASE_MANAGER', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 03:55:44', activityType: 'Outreach', isMobile: 'Yes', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'James Hollis', email: 'j.hollis@metrocareservices.org', siteName: 'Metrocare', siteSegmentation: 'N/A', jobTitle: 'LCSW', supervisor: 'LaTronda King', program: 'MH Satellite Clinics', noteCreationTime: '2026-04-09 07:12:03', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Yolanda Cruz', email: 'y.cruz@hopemhc.org', siteName: 'Hope MHC', siteSegmentation: 'N/A', jobTitle: 'LMFT', supervisor: 'N/A', program: 'N/A', noteCreationTime: '2026-04-09 04:33:29', activityType: 'No Session Type', isMobile: 'No', noteRating: '5', noteFeedback: 'Great tool!' },
  { name: 'Frank Dumas', email: 'f.dumas@gandara.org', siteName: 'Gandara', siteSegmentation: 'N/A', jobTitle: 'CM', supervisor: 'Doucette, Christina', program: 'CSA Worcester', noteCreationTime: '2026-04-09 05:48:51', activityType: 'Case Management', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Alice Thornton', email: 'a.thornton@lighthouseok.com', siteName: 'Lighthouse', siteSegmentation: 'N/A', jobTitle: 'LCSW', supervisor: 'JENNIFER OHRMUNDT', program: 'N/A', noteCreationTime: '2026-04-09 06:29:07', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
  { name: 'Derek Pham', email: 'd.pham@regionten.org', siteName: 'Region Ten CSB', siteSegmentation: 'N/A', jobTitle: 'CM', supervisor: 'Charlie Fawcett', program: 'MH CM', noteCreationTime: '2026-04-09 03:17:40', activityType: 'No Session Type', isMobile: 'No', noteRating: 'No Rating', noteFeedback: 'No Feedback' },
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
  { noteCreatedDate: '2026-04-08 00:00:00', name: 'Mahagany Whitmill', email: 'mahagany.whitmill@wyandotbhn.org', profession: 'CM', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-08 00:00:00', name: 'Raven Moss', email: 'rmoss@centralalabamawellness.org', profession: 'CM', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-08 00:00:00', name: 'Sarah Brincks-Kimiri', email: 'sbrincks-kimiri@twi.org', profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-08 00:00:00', name: 'Mark Hurt', email: 'm.hurt@lumerahealthcare.com', profession: 'LCSW', noteRating: 4, noteFeedback: '' },
  { noteCreatedDate: '2026-04-08 00:00:00', name: 'Omari Bynum', email: 'obynum@commall.org', profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-07 00:00:00', name: 'Tanya Osei', email: 'tosei@hopewellmh.org', profession: 'LMFT', noteRating: 5, noteFeedback: 'Very accurate and saved me a lot of time.' },
  { noteCreatedDate: '2026-04-07 00:00:00', name: 'Carlos Reyes', email: 'c.reyes@valleycare.org', profession: 'CM', noteRating: 4, noteFeedback: 'Good overall, minor tweaks needed.' },
  { noteCreatedDate: '2026-04-07 00:00:00', name: 'Patricia Lim', email: 'p.lim@bridgecenter.com', profession: 'COUNSELOR', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-07 00:00:00', name: 'Derek Ng', email: 'derek.ng@bridgecenter.com', profession: 'LCSW', noteRating: 5, noteFeedback: 'Excellent summary of session.' },
  { noteCreatedDate: '2026-04-07 00:00:00', name: 'Aisha Brown', email: 'aisha.b@sunriserecovery.org', profession: 'OUTREACH_CASE_MANAGER', noteRating: 3, noteFeedback: 'Missed some key points discussed.' },
  { noteCreatedDate: '2026-04-06 00:00:00', name: 'Tom Walters', email: 'tom.w@peakbehavioral.net', profession: 'LPCC', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-06 00:00:00', name: 'Nina Rodriguez', email: 'nina.r@clearskymh.org', profession: 'CM', noteRating: 4, noteFeedback: 'Mostly accurate.' },
  { noteCreatedDate: '2026-04-06 00:00:00', name: 'Calvin Evans', email: 'c.evans@northpointcare.com', profession: 'LCSW', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-06 00:00:00', name: 'Maria Santos', email: 'maria.santos@hopemhc.org', profession: 'LMFT', noteRating: 5, noteFeedback: 'Loved how it captured the goals.' },
  { noteCreatedDate: '2026-04-06 00:00:00', name: 'James Okafor', email: 'j.okafor@communityreach.net', profession: 'CM', noteRating: 4, noteFeedback: '' },
  { noteCreatedDate: '2026-04-05 00:00:00', name: 'Shannon Williams', email: 'shwilliams@lighthouseok.com', profession: 'LCSW', noteRating: 5, noteFeedback: 'Perfect note, nothing to change.' },
  { noteCreatedDate: '2026-04-05 00:00:00', name: 'Irland Breceda', email: 'Irland.Breceda@metrocareservices.org', profession: 'LCSW', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-05 00:00:00', name: 'Crystal Richey', email: 'CrystalR@ccsww.org', profession: 'OUTREACH_CASE_MANAGER', noteRating: 4, noteFeedback: 'Good but could improve structure.' },
  { noteCreatedDate: '2026-04-05 00:00:00', name: 'Roberta Vega', email: 'roberta5652@gulfbend.org', profession: 'CM', noteRating: 5, noteFeedback: '' },
  { noteCreatedDate: '2026-04-05 00:00:00', name: 'Helen Richardson', email: 'helen.r@ccsww.org', profession: 'LCSW', noteRating: 5, noteFeedback: 'Comprehensive and well organized.' },
];

export const TOP_TEN_PROVIDERS = [
  { name: 'Helen Richardson', notes: 2060 },
  { name: 'JADE GONZALES', notes: 1870 },
  { name: 'SARAH GARCIA', notes: 1810 },
  { name: 'Harlan Felix', notes: 1760 },
  { name: 'ARGENTA JEFFREY', notes: 680 },
  { name: 'JANET PROCTOR SMITH', notes: 1660 },
  { name: 'Sonya Yarbrough', notes: 1570 },
  { name: 'Lara Ware', notes: 1570 },
  { name: 'Jonathan Marx', notes: 1550 },
  { name: 'Kristen Beamer', notes: 1530 },
];

export const PROVIDER_DATA: ProviderRow[] = [
  { name: 'Roberta Vega', mail: 'roberta5652@gulfbend.org', profession: 'CM', programName: 'MH C&A', site: 'Gulf Bend Center', supervisor: 'Jessica Blaylock', configuredToSidebar: '2026-03-14', status: 'Successful Onboarding', generatedNotes: 27, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-03-16', latestNoteDate: '2026-04-02', averageNoteRating: 5, notesWithFeedback: 1, hoursSaved: null, avgMinutesSavedPerNote: null },
  { name: 'Kelly Meszaros', mail: 'kmeszaros@grandmh.com', profession: 'LCSW', programName: 'N/A', site: 'Grand Lake', supervisor: 'N/A', configuredToSidebar: '2025-09-25', status: 'Successful Onboarding', generatedNotes: 21, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-03-09', latestNoteDate: '2026-03-31', averageNoteRating: null, notesWithFeedback: 0, hoursSaved: 0.9583, avgMinutesSavedPerNote: 2.74 },
  { name: 'Marcus Allen', mail: 'marcus.allen@healthnet.org', profession: 'LPC', programName: 'Outpatient', site: 'North Campus', supervisor: 'Diana Cruz', configuredToSidebar: '2025-11-10', status: 'Active', generatedNotes: 134, mobile: 'Has Mobile Notes', firstNoteDate: '2025-11-15', latestNoteDate: '2026-04-05', averageNoteRating: 4.3, notesWithFeedback: 28, hoursSaved: 18.2, avgMinutesSavedPerNote: 8.15 },
  { name: 'Sandra Kim', mail: 'skim@wellnesscenter.com', profession: 'MFT', programName: 'ACT', site: 'Downtown Clinic', supervisor: 'Robert Hayes', configuredToSidebar: '2025-08-20', status: 'Power Provider', generatedNotes: 312, mobile: 'Has Mobile Notes', firstNoteDate: '2025-08-25', latestNoteDate: '2026-04-06', averageNoteRating: 4.7, notesWithFeedback: 89, hoursSaved: 44.1, avgMinutesSavedPerNote: 8.48 },
  { name: 'Thomas Wright', mail: 'twright@bhnetwork.org', profession: 'LCSW', programName: 'MH/SUD', site: 'Westside Center', supervisor: 'Patricia Moore', configuredToSidebar: '2025-10-05', status: 'Active', generatedNotes: 87, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-10-12', latestNoteDate: '2026-03-28', averageNoteRating: 4.1, notesWithFeedback: 15, hoursSaved: 11.6, avgMinutesSavedPerNote: 7.99 },
  { name: 'Angela Davis', mail: 'adavis@cmhc.org', profession: 'LPCC', programName: 'Adult Services', site: 'Main Street', supervisor: 'Kevin Johnson', configuredToSidebar: '2025-09-14', status: 'Successful Onboarding', generatedNotes: 45, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-02-10', latestNoteDate: '2026-04-01', averageNoteRating: 4.5, notesWithFeedback: 7, hoursSaved: 5.4, avgMinutesSavedPerNote: 7.2 },
  { name: 'James Rivera', mail: 'jrivera@hcs.net', profession: 'Psychiatrist', programName: 'N/A', site: 'Central Hospital', supervisor: 'Dr. Susan Lee', configuredToSidebar: '2025-07-18', status: 'Power Provider', generatedNotes: 418, mobile: 'Has Mobile Notes', firstNoteDate: '2025-07-22', latestNoteDate: '2026-04-07', averageNoteRating: 4.8, notesWithFeedback: 122, hoursSaved: 63.8, avgMinutesSavedPerNote: 9.15 },
  { name: 'Linda Thompson', mail: 'lthompson@familycare.org', profession: 'CM', programName: 'Child & Adolescent', site: 'East End', supervisor: 'Mark Stevens', configuredToSidebar: '2025-12-01', status: 'Onboarding – First Week', generatedNotes: 3, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-04-01', latestNoteDate: '2026-04-04', averageNoteRating: null, notesWithFeedback: 0, hoursSaved: null, avgMinutesSavedPerNote: null },
  { name: 'David Park', mail: 'd.park@recoveryalliance.com', profession: 'CADC', programName: 'Substance Use', site: 'Harbor House', supervisor: 'Lisa Chen', configuredToSidebar: '2025-08-30', status: 'Active', generatedNotes: 76, mobile: 'Has Mobile Notes', firstNoteDate: '2025-09-05', latestNoteDate: '2026-04-03', averageNoteRating: 4.2, notesWithFeedback: 19, hoursSaved: 9.8, avgMinutesSavedPerNote: 7.74 },
  { name: 'Michelle Foster', mail: 'mfoster@pathways.org', profession: 'LMFT', programName: 'Outpatient', site: 'North Campus', supervisor: 'Diana Cruz', configuredToSidebar: '2025-06-15', status: 'Power Provider', generatedNotes: 287, mobile: 'Has Mobile Notes', firstNoteDate: '2025-06-20', latestNoteDate: '2026-04-06', averageNoteRating: 4.6, notesWithFeedback: 74, hoursSaved: 39.5, avgMinutesSavedPerNote: 8.25 },
  { name: 'Carlos Mendez', mail: 'cmendez@sunrisemhc.org', profession: 'LCSW', programName: 'ACT', site: 'Sunrise Center', supervisor: 'Robert Hayes', configuredToSidebar: '2025-11-22', status: 'Active', generatedNotes: 62, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-12-01', latestNoteDate: '2026-04-02', averageNoteRating: 4.0, notesWithFeedback: 11, hoursSaved: 7.9, avgMinutesSavedPerNote: 7.65 },
  { name: 'Patricia Gibson', mail: 'pgibson@communitymh.org', profession: 'LPC', programName: 'Crisis Stabilization', site: 'Crisis Center', supervisor: 'Andrew Hill', configuredToSidebar: '2025-10-18', status: 'Low Engagement', generatedNotes: 8, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-10-25', latestNoteDate: '2026-01-15', averageNoteRating: 3.8, notesWithFeedback: 2, hoursSaved: 0.8, avgMinutesSavedPerNote: 6.0 },
  { name: 'Richard Torres', mail: 'rtorres@valleymh.net', profession: 'LPCC', programName: 'Adult Services', site: 'Valley Clinic', supervisor: 'Kevin Johnson', configuredToSidebar: '2025-09-02', status: 'Active', generatedNotes: 109, mobile: 'Has Mobile Notes', firstNoteDate: '2025-09-08', latestNoteDate: '2026-04-05', averageNoteRating: 4.4, notesWithFeedback: 31, hoursSaved: 14.7, avgMinutesSavedPerNote: 8.09 },
  { name: 'Jennifer Nguyen', mail: 'j.nguyen@hopehealth.com', profession: 'MFT', programName: 'MH C&A', site: 'Hope Center', supervisor: 'Jessica Blaylock', configuredToSidebar: '2025-08-05', status: 'Power Provider', generatedNotes: 341, mobile: 'Has Mobile Notes', firstNoteDate: '2025-08-10', latestNoteDate: '2026-04-07', averageNoteRating: 4.7, notesWithFeedback: 98, hoursSaved: 48.2, avgMinutesSavedPerNote: 8.48 },
  { name: 'Brian Jackson', mail: 'bjackson@bhsolutions.org', profession: 'CADC', programName: 'Substance Use', site: 'Harbor House', supervisor: 'Lisa Chen', configuredToSidebar: '2025-12-10', status: 'Successful Onboarding', generatedNotes: 19, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-01-05', latestNoteDate: '2026-03-30', averageNoteRating: 4.2, notesWithFeedback: 4, hoursSaved: 2.1, avgMinutesSavedPerNote: 6.63 },
  { name: 'Susan Martinez', mail: 'smartinez@wellpath.org', profession: 'LCSW', programName: 'MH/SUD', site: 'Westside Center', supervisor: 'Patricia Moore', configuredToSidebar: '2025-07-30', status: 'Active', generatedNotes: 156, mobile: 'Has Mobile Notes', firstNoteDate: '2025-08-04', latestNoteDate: '2026-04-06', averageNoteRating: 4.5, notesWithFeedback: 44, hoursSaved: 21.3, avgMinutesSavedPerNote: 8.19 },
  { name: 'Kevin White', mail: 'kwhite@northstaremh.com', profession: 'LPC', programName: 'Outpatient', site: 'North Star Clinic', supervisor: 'Diana Cruz', configuredToSidebar: '2025-11-05', status: 'Dropped Off', generatedNotes: 34, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-11-12', latestNoteDate: '2026-01-03', averageNoteRating: 3.9, notesWithFeedback: 6, hoursSaved: 3.8, avgMinutesSavedPerNote: 6.71 },
  { name: 'Nancy Robinson', mail: 'nrobinson@carefirst.org', profession: 'Psychiatrist', programName: 'N/A', site: 'Medical Plaza', supervisor: 'Dr. Susan Lee', configuredToSidebar: '2025-06-28', status: 'Power Provider', generatedNotes: 395, mobile: 'Has Mobile Notes', firstNoteDate: '2025-07-02', latestNoteDate: '2026-04-07', averageNoteRating: 4.8, notesWithFeedback: 116, hoursSaved: 58.7, avgMinutesSavedPerNote: 8.92 },
  { name: 'Daniel Clark', mail: 'dclark@empowermhc.net', profession: 'CM', programName: 'Child & Adolescent', site: 'East End', supervisor: 'Mark Stevens', configuredToSidebar: '2025-10-12', status: 'Active', generatedNotes: 91, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-10-18', latestNoteDate: '2026-04-04', averageNoteRating: 4.3, notesWithFeedback: 22, hoursSaved: 12.4, avgMinutesSavedPerNote: 8.17 },
  { name: 'Jessica Hall', mail: 'jhall@riversidemh.org', profession: 'LMFT', programName: 'ACT', site: 'Riverside', supervisor: 'Robert Hayes', configuredToSidebar: '2025-08-15', status: 'Active', generatedNotes: 123, mobile: 'Has Mobile Notes', firstNoteDate: '2025-08-20', latestNoteDate: '2026-04-05', averageNoteRating: 4.4, notesWithFeedback: 35, hoursSaved: 16.8, avgMinutesSavedPerNote: 8.2 },
  { name: 'Christopher Lewis', mail: 'clewis@bhpartners.com', profession: 'LPCC', programName: 'Adult Services', site: 'Main Street', supervisor: 'Kevin Johnson', configuredToSidebar: '2025-09-22', status: 'Successful Onboarding', generatedNotes: 38, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-02-18', latestNoteDate: '2026-04-02', averageNoteRating: 4.1, notesWithFeedback: 5, hoursSaved: 4.2, avgMinutesSavedPerNote: 6.63 },
  { name: 'Amanda Young', mail: 'ayoung@brightfuture.org', profession: 'LCSW', programName: 'MH C&A', site: 'Gulf Bend Center', supervisor: 'Jessica Blaylock', configuredToSidebar: '2025-07-08', status: 'Power Provider', generatedNotes: 278, mobile: 'Has Mobile Notes', firstNoteDate: '2025-07-14', latestNoteDate: '2026-04-06', averageNoteRating: 4.6, notesWithFeedback: 81, hoursSaved: 37.9, avgMinutesSavedPerNote: 8.18 },
  { name: 'Matthew Scott', mail: 'mscott@integracmh.org', profession: 'CADC', programName: 'Substance Use', site: 'Harbor House', supervisor: 'Lisa Chen', configuredToSidebar: '2025-11-30', status: 'Active', generatedNotes: 67, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-12-08', latestNoteDate: '2026-04-03', averageNoteRating: 4.0, notesWithFeedback: 14, hoursSaved: 8.5, avgMinutesSavedPerNote: 7.61 },
  { name: 'Rebecca Adams', mail: 'radams@mountainmh.net', profession: 'LPC', programName: 'Outpatient', site: 'Valley Clinic', supervisor: 'Diana Cruz', configuredToSidebar: '2025-10-25', status: 'Active', generatedNotes: 88, mobile: 'Has Mobile Notes', firstNoteDate: '2025-11-01', latestNoteDate: '2026-04-05', averageNoteRating: 4.2, notesWithFeedback: 20, hoursSaved: 11.9, avgMinutesSavedPerNote: 8.11 },
  { name: 'Anthony Baker', mail: 'abaker@communitylink.org', profession: 'CM', programName: 'Crisis Stabilization', site: 'Crisis Center', supervisor: 'Andrew Hill', configuredToSidebar: '2025-08-08', status: 'Low Engagement', generatedNotes: 12, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-08-15', latestNoteDate: '2026-02-10', averageNoteRating: 3.7, notesWithFeedback: 3, hoursSaved: 1.1, avgMinutesSavedPerNote: 5.5 },
  { name: 'Sharon Nelson', mail: 'snelson@healingpath.com', profession: 'MFT', programName: 'ACT', site: 'Sunrise Center', supervisor: 'Robert Hayes', configuredToSidebar: '2025-06-05', status: 'Power Provider', generatedNotes: 356, mobile: 'Has Mobile Notes', firstNoteDate: '2025-06-10', latestNoteDate: '2026-04-07', averageNoteRating: 4.7, notesWithFeedback: 105, hoursSaved: 51.4, avgMinutesSavedPerNote: 8.67 },
  { name: 'Ryan Carter', mail: 'rcarter@pinnaclemhc.org', profession: 'LCSW', programName: 'MH/SUD', site: 'Westside Center', supervisor: 'Patricia Moore', configuredToSidebar: '2025-12-15', status: 'Onboarding – First Week', generatedNotes: 5, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-04-02', latestNoteDate: '2026-04-06', averageNoteRating: null, notesWithFeedback: 0, hoursSaved: null, avgMinutesSavedPerNote: null },
  { name: 'Kimberly Turner', mail: 'kturner@spectrumcare.net', profession: 'LPCC', programName: 'Adult Services', site: 'North Campus', supervisor: 'Kevin Johnson', configuredToSidebar: '2025-09-18', status: 'Active', generatedNotes: 102, mobile: 'Has Mobile Notes', firstNoteDate: '2025-09-24', latestNoteDate: '2026-04-04', averageNoteRating: 4.3, notesWithFeedback: 27, hoursSaved: 13.9, avgMinutesSavedPerNote: 8.18 },
  { name: 'George Phillips', mail: 'gphillips@lakesidemh.org', profession: 'Psychiatrist', programName: 'N/A', site: 'Lakeside Hospital', supervisor: 'Dr. Susan Lee', configuredToSidebar: '2025-07-25', status: 'Power Provider', generatedNotes: 407, mobile: 'Has Mobile Notes', firstNoteDate: '2025-07-30', latestNoteDate: '2026-04-07', averageNoteRating: 4.8, notesWithFeedback: 119, hoursSaved: 60.2, avgMinutesSavedPerNote: 8.88 },
  { name: 'Lisa Campbell', mail: 'lcampbell@riverbend.com', profession: 'CM', programName: 'Child & Adolescent', site: 'East End', supervisor: 'Mark Stevens', configuredToSidebar: '2025-11-18', status: 'Successful Onboarding', generatedNotes: 24, mobile: 'No Mobile Notes Yet', firstNoteDate: '2026-01-20', latestNoteDate: '2026-04-01', averageNoteRating: 4.4, notesWithFeedback: 5, hoursSaved: 2.8, avgMinutesSavedPerNote: 7.0 },
  { name: 'Kenneth Evans', mail: 'kevans@sierramhc.org', profession: 'CADC', programName: 'Substance Use', site: 'Harbor House', supervisor: 'Lisa Chen', configuredToSidebar: '2025-08-22', status: 'Active', generatedNotes: 79, mobile: 'No Mobile Notes Yet', firstNoteDate: '2025-08-28', latestNoteDate: '2026-04-03', averageNoteRating: 4.1, notesWithFeedback: 17, hoursSaved: 10.3, avgMinutesSavedPerNote: 7.82 },
];
