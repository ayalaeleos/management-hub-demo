export interface Site {
  id: number;
  name: string;
  timezone: string;
  userCount: number;
  active: boolean;
}

export const MOCK_SITES: Site[] = [
  {
    id: 1,
    name: 'Westside Main Campus',
    timezone: 'America/Los_Angeles',
    userCount: 4,
    active: true,
  },
  {
    id: 2,
    name: 'Eastside Clinic',
    timezone: 'America/Los_Angeles',
    userCount: 3,
    active: true,
  },
  {
    id: 3,
    name: 'Northside Center',
    timezone: 'America/Chicago',
    userCount: 2,
    active: true,
  },
  {
    id: 4,
    name: 'Southside Office',
    timezone: 'America/New_York',
    userCount: 1,
    active: true,
  },
];
