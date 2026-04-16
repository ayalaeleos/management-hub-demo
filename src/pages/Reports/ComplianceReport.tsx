import { useState, useRef, useContext, createContext, useEffect } from 'react';
import './ComplianceReport.css';
import {
  COMPLIANCE_STATS,
  KEY_IMPROVEMENTS,
  PROVIDER_ANALYSIS_DATA,
  type KeyImprovementRow,
  type ProviderAnalysisRow,
} from '../../data/complianceReport';

// ─── Filter Types & Context ───────────────────────────────────────────────────

interface FilterState {
  timeRange: string;
  organizations: string[];
  businessUnits: string[];
  programs: string[];
  supervisors: string[];
  services: string[];
  providers: string[];
  documentId: string;
}

const DEFAULT_FILTERS: FilterState = {
  timeRange: 'Last quarter',
  organizations: [],
  businessUnits: [],
  programs: [],
  supervisors: [],
  services: [],
  providers: [],
  documentId: '',
};

interface FiltersContextValue {
  applied: FilterState;
  applyFilters: (f: FilterState) => void;
  clearFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue>({
  applied: DEFAULT_FILTERS,
  applyFilters: () => undefined,
  clearFilters: () => undefined,
});

function useFilters(): FilterState {
  return useContext(FiltersContext).applied;
}

// ─── Filter Options ───────────────────────────────────────────────────────────

const TIME_RANGE_OPTIONS = ['Last week', 'Last month', 'Last quarter', 'Last year'];
const ORGANIZATION_OPTIONS = ['Merakey', 'Wyandot BHN', 'PSYgenics', 'CrossWinds', 'Valley Care'];

// Supervisor → organization mapping (used for org filter since JSON data uses generic email domains)
const SUPERVISOR_ORG_MAP: Record<string, string> = {
  'Sarah Mitchell':    'Merakey',
  'James Anderson':    'Merakey',
  'Robert Chen':       'Wyandot BHN',
  'Emily Thompson':    'Wyandot BHN',
  'Michael Johnson':   'PSYgenics',
  'Maria Rodriguez':   'PSYgenics',
  'Kimberly Green':    'CrossWinds',
  'David Brown':       'CrossWinds',
  'Lisa Anderson':     'Valley Care',
  'Jennifer Williams': 'Valley Care',
};

// ─── FilterDropdown Component ─────────────────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}

function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  }

  return (
    <div className="cr-filter-dropdown" ref={containerRef}>
      <button
        className={`cr-filter-dropdown__trigger${selected.length > 0 ? ' cr-filter-dropdown__trigger--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <span style={{ flex: 1 }}>{label}</span>
        {selected.length > 0 && (
          <span className="cr-filter-dropdown__badge">{selected.length}</span>
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="cr-filter-dropdown__panel">
          <input
            className="cr-filter-dropdown__search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="cr-filter-dropdown__list">
            {filtered.map(opt => (
              <label key={opt} className="cr-filter-dropdown__item">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

// ─── Card Icons ───────────────────────────────────────────────────────────────

function CardIcons() {
  return (
    <div className="cr-card-icons">
      <span className="cr-card-icon" title="Filter">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="cr-card-icon-badge">1</span>
      </span>
      <span className="cr-card-icon" title="Info">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6.5 5.5v4M6.5 4h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="cr-card-icon" title="More">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="2.5" r="1" fill="currentColor" />
          <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
          <circle cx="6.5" cy="10.5" r="1" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────

function WelcomeBanner() {
  return (
    <div className="cr-welcome-banner">
      <h2 className="cr-welcome-banner__title">Welcome to your Eleos Compliance Dashboard!</h2>
      <div className="cr-welcome-banner__body">
        <p>
          This is where you can view daily analysis of 100% of your documentation across{' '}
          <strong>7 key compliance checkpoints</strong>.
        </p>
        <p>
          Checkpoints are evaluated by AI models trained on clinically tagged datasets and guided by
          standards defined by our compliance experts.
        </p>
        <p>
          For more detailed checkpoint and scoring definitions, please review the{' '}
          <strong>"Definitions"</strong> tab.
        </p>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  isDate?: boolean;
}

function StatCard({ label, value, sublabel, isDate }: StatCardProps) {
  return (
    <div className="cr-stat-card">
      <div className="cr-stat-card__header">
        <p className="cr-stat-card__label">{label}</p>
        <CardIcons />
      </div>
      <div className={isDate ? 'cr-stat-card__value--date' : 'cr-stat-card__value'}>{value}</div>
      {sublabel && <div className="cr-stat-card__sublabel">{sublabel}</div>}
    </div>
  );
}

// ─── Grouped Bar Chart ────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  item: KeyImprovementRow;
}

function GroupedBarChart({ data }: { data: KeyImprovementRow[] }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activePill, setActivePill] = useState<'all' | 'inv'>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  // Chart layout constants
  const svgW = 800;
  const svgH = 280;
  const marginLeft = 56;
  const marginRight = 16;
  const marginTop = 20;
  const marginBottom = 72; // room for rotated labels

  const chartW = svgW - marginLeft - marginRight;
  const chartH = svgH - marginTop - marginBottom;

  // Y axis: 0% to 100%
  const yMin = 0;
  const yMax = 100;
  const yTicks = [0, 20, 40, 60, 80, 100];

  function yPos(pct: number) {
    return marginTop + chartH - ((pct - yMin) / (yMax - yMin)) * chartH;
  }

  const groupCount = data.length;
  const groupW = chartW / groupCount;
  const barGap = 3;
  const barW = (groupW * 0.55) / 2;

  function groupX(i: number) {
    return marginLeft + i * groupW + groupW / 2;
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>, item: KeyImprovementRow) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      item,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      {/* Legend + pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div className="cr-bar-legend-item">
          <span className="cr-legend-dot" style={{ background: '#3b82f6' }} />
          Eleos Users
        </div>
        <div className="cr-bar-legend-item">
          <span className="cr-legend-dot" style={{ background: '#d1d5db' }} />
          Non Eleos Users
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button
            className={`cr-pill${activePill === 'all' ? ' cr-pill--active' : ''}`}
            onClick={() => setActivePill('all')}
          >
            All
          </button>
          <button
            className={`cr-pill${activePill === 'inv' ? ' cr-pill--active' : ''}`}
            onClick={() => setActivePill('inv')}
          >
            Inv
          </button>
        </div>
      </div>

      {/* SVG chart */}
      <div className="cr-bar-chart-area">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="cr-bar-chart-svg"
          onMouseLeave={() => setTooltip(null)}
          style={{ height: 260 }}
        >
          {/* Y-axis label */}
          <text
            x={12}
            y={marginTop + chartH / 2}
            textAnchor="middle"
            fontSize={10}
            fill="#9ca3af"
            transform={`rotate(-90, 12, ${marginTop + chartH / 2})`}
          >
            performance
          </text>

          {/* Y axis grid lines + ticks */}
          {yTicks.map((tick) => {
            const y = yPos(tick);
            return (
              <g key={tick}>
                <line
                  x1={marginLeft}
                  x2={marginLeft + chartW}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                <text x={marginLeft - 6} y={y + 4} fontSize={10} fill="#9ca3af" textAnchor="end">
                  {tick.toFixed(2)}%
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, i) => {
            const cx = groupX(i);
            const eleoX = cx - barGap / 2 - barW;
            const nonEleoX = cx + barGap / 2;
            const eleoY = yPos(item.eleos);
            const nonEleoY = yPos(item.nonEleos);
            const eleoH = yPos(yMin) - eleoY;
            const nonEleoH = yPos(yMin) - nonEleoY;

            return (
              <g
                key={item.label}
                onMouseMove={(e) => handleMouseMove(e, item)}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'crosshair' }}
              >
                {/* Eleos bar */}
                <rect
                  x={eleoX}
                  y={eleoY}
                  width={barW}
                  height={eleoH}
                  fill="#3b82f6"
                  rx={2}
                />
                <text
                  x={eleoX + barW / 2}
                  y={eleoY - 3}
                  fontSize={8.5}
                  fill="#3b82f6"
                  textAnchor="middle"
                  fontWeight={600}
                >
                  {item.eleos.toFixed(2)}%
                </text>

                {/* Non-Eleos bar */}
                <rect
                  x={nonEleoX}
                  y={nonEleoY}
                  width={barW}
                  height={nonEleoH}
                  fill="#d1d5db"
                  rx={2}
                />
                <text
                  x={nonEleoX + barW / 2}
                  y={nonEleoY - 3}
                  fontSize={8.5}
                  fill="#6b7280"
                  textAnchor="middle"
                  fontWeight={600}
                >
                  {item.nonEleos.toFixed(2)}%
                </text>

                {/* X-axis label (rotated) */}
                <text
                  x={cx}
                  y={yPos(yMin) + 10}
                  fontSize={9.5}
                  fill="#6b7280"
                  textAnchor="end"
                  transform={`rotate(-40, ${cx}, ${yPos(yMin) + 10})`}
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* X axis baseline */}
          <line
            x1={marginLeft}
            x2={marginLeft + chartW}
            y1={yPos(yMin)}
            y2={yPos(yMin)}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        </svg>

        {/* Hover tooltip */}
        {tooltip && (
          <div
            className="cr-chart-tooltip"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y - 60,
            }}
          >
            <div className="cr-chart-tooltip__title">{tooltip.item.label}</div>
            <div className="cr-chart-tooltip__row">
              <span className="cr-chart-tooltip__dot" style={{ background: '#3b82f6' }} />
              Eleos Users
              <strong>{tooltip.item.eleos.toFixed(2)}%</strong>
            </div>
            <div className="cr-chart-tooltip__row">
              <span className="cr-chart-tooltip__dot" style={{ background: '#d1d5db' }} />
              Non Eleos Users
              <strong>{tooltip.item.nonEleos.toFixed(2)}%</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filters Sidebar ──────────────────────────────────────────────────────────

interface FiltersSidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  filterOptions: {
    organizations: string[];
    businessUnits: string[];
    programs: string[];
    supervisors: string[];
    services: string[];
    providers: string[];
  };
}

function FiltersSidebar({ collapsed, onCollapse, filterOptions }: FiltersSidebarProps) {
  const { applyFilters, clearFilters, applied } = useContext(FiltersContext);
  const [staged, setStaged] = useState<FilterState>({ ...applied });

  function handleApply() {
    applyFilters(staged);
  }

  function handleClear() {
    const reset = { ...DEFAULT_FILTERS };
    setStaged(reset);
    clearFilters();
  }

  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setStaged(prev => ({ ...prev, [key]: value }));
  }

  return (
    <aside className={`cr-filters${collapsed ? ' cr-filters--collapsed' : ''}`}>
      <div className="cr-filters__inner">
        <div className="cr-filters__scroll">
        {/* Header */}
        <div className="cr-filters__head">
          <h2 className="cr-filters__title">Filters</h2>
          <div className="cr-filters__head-icons">
            <button className="cr-filters__icon-btn" title="Settings">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 9.5a2 2 0 100-4 2 2 0 000 4z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M12.2 7.5c0-.23-.02-.45-.05-.67l1.44-1.12-1.35-2.34-1.76.71a5.02 5.02 0 00-1.15-.67L9.05 1.5H6.95l-.3 1.91c-.42.17-.8.4-1.15.67l-1.76-.71-1.35 2.34 1.44 1.12c-.03.22-.05.44-.05.67s.02.45.05.67L2.39 9.29l1.35 2.34 1.76-.71c.35.27.73.5 1.15.67l.3 1.91h2.1l.3-1.91c.42-.17.8-.4 1.15-.67l1.76.71 1.35-2.34-1.44-1.12c.03-.22.05-.44.05-.67z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
            </button>
            <button className="cr-filters__icon-btn" title="Collapse" onClick={onCollapse}>
              <span className="cr-filters__collapse-icon">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="3" height="12" viewBox="0 0 3 12" fill="none">
                  <rect x="1" y="0" width="1.5" height="12" rx="0.75" fill="currentColor" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Time Range */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Filter by Time Range:</span>
          <select
            className="cr-filters__input cr-filters__input--select"
            value={staged.timeRange}
            onChange={e => set('timeRange', e.target.value)}
            style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, background: '#fff', cursor: 'pointer' }}
          >
            {TIME_RANGE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Organization */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Organization:</span>
          <FilterDropdown
            label="Organization"
            options={filterOptions.organizations}
            selected={staged.organizations}
            onChange={v => set('organizations', v)}
          />
        </div>

        {/* Business Unit */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Business Unit:</span>
          <FilterDropdown
            label="Business Unit"
            options={filterOptions.businessUnits}
            selected={staged.businessUnits}
            onChange={v => set('businessUnits', v)}
          />
        </div>

        {/* Program */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Program:</span>
          <FilterDropdown
            label="Program"
            options={filterOptions.programs}
            selected={staged.programs}
            onChange={v => set('programs', v)}
          />
        </div>

        {/* Supervisors */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Supervisors:</span>
          <FilterDropdown
            label="Supervisors"
            options={filterOptions.supervisors}
            selected={staged.supervisors}
            onChange={v => set('supervisors', v)}
          />
        </div>

        {/* Service */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Service:</span>
          <FilterDropdown
            label="Service"
            options={filterOptions.services}
            selected={staged.services}
            onChange={v => set('services', v)}
          />
        </div>

        {/* Provider */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Provider:</span>
          <FilterDropdown
            label="Provider"
            options={filterOptions.providers}
            selected={staged.providers}
            onChange={v => set('providers', v)}
          />
        </div>

        {/* Document ID */}
        <div className="cr-filters__group">
          <span className="cr-filters__label">Select Document ID:</span>
          <input
            type="text"
            className="cr-filters__input cr-filters__input--text"
            placeholder="Enter document ID"
            value={staged.documentId}
            onChange={e => set('documentId', e.target.value)}
          />
        </div>

        </div>{/* end cr-filters__scroll */}

        {/* Footer — sticky at bottom */}
        <div className="cr-filters__footer">
          <button className="cr-filters__apply-btn" onClick={handleApply}>Apply filters</button>
          <button className="cr-filters__clear-btn" onClick={handleClear}>Clear all</button>
        </div>
      </div>
    </aside>
  );
}

// ─── Summary Tab ──────────────────────────────────────────────────────────────

function SummaryTab() {
  const { firstDocDate, lastDocDate, documents, providers, timeSaved, costSaved } = COMPLIANCE_STATS;

  return (
    <>
      {/* Welcome banner */}
      <WelcomeBanner />

      {/* Four stat cards */}
      <div className="cr-stats-row">
        <StatCard label="First Document Date:" value={firstDocDate} isDate />
        <StatCard label="Last Document Date:" value={lastDocDate} isDate />
        <StatCard label="Documents" value={fmtNum(documents)} sublabel="analyzed" />
        <StatCard label="Providers" value={fmtNum(providers)} sublabel="analyzed" />
      </div>

      {/* Time Saved + Cost Saved (left) + Key Improvements chart (right) */}
      <div className="cr-mid-row">
        {/* Left column: Time Saved stacked above Cost Saved */}
        <div className="cr-mid-left">
          <div className="cr-chart-card">
            <div className="cr-card-header">
              <p className="cr-chart-card__title">Time Saved</p>
              <CardIcons />
            </div>
            <div className="cr-big-stat">{fmtK(timeSaved)}</div>
            <div className="cr-big-stat__sub">equivalent hours of manual review</div>
          </div>
          <div className="cr-chart-card">
            <div className="cr-card-header">
              <p className="cr-chart-card__title">Cost Saved</p>
              <CardIcons />
            </div>
            <div className="cr-big-stat">$ {fmtK(costSaved)}</div>
            <div className="cr-big-stat__sub">equivalent $ to cover risk manually</div>
          </div>
        </div>

        {/* Key Improvements bar chart */}
        <div className="cr-chart-card cr-mid-chart">
          <div className="cr-card-header">
            <p className="cr-chart-card__title">Key Improvements Eleos Users vs Non Eleos Users</p>
            <CardIcons />
          </div>
          <GroupedBarChart data={KEY_IMPROVEMENTS} />
        </div>
      </div>

      {/* Quality Score Timeline */}
      <QualityScoreTimeline />

      {/* Compliance Rate by Checkpoint */}
      <ComplianceRateChart />

      {/* Performance by Checkpoint */}
      <PerformanceTable />

      {/* Services + Programs Quality Score */}
      <div className="cr-two-col-row">
        <ServicesQualityTable />
        <ProgramsQualityTable />
      </div>

      {/* Supervisors Quality Score */}
      <SupervisorsQualityTable />

      {/* Analysis by Provider */}
      <AnalysisByProviderTable />
    </>
  );
}

// ─── Services / Programs Quality Score Tables ─────────────────────────────────

interface QualityRow {
  name: string;
  documents: number | string;
  qualityScore: number;
  pctChange: number | null;
}

const SERVICES_DATA: QualityRow[] = [
  { name: 'ACT - 15 Min Unit',              documents: 12558, qualityScore: 72.06, pctChange: -0.08 },
  { name: 'N/A',                             documents: 12169, qualityScore: 80.04, pctChange: 1.00  },
  { name: 'Individual Therapy',              documents: 9439,  qualityScore: 90.23, pctChange: 0.29  },
  { name: 'Non-Billable Attempts - 15 Min',  documents: 4640,  qualityScore: 30.93, pctChange: -1.18 },
  { name: 'CCBHC Psychotherapy (OMHSUS)',    documents: 4347,  qualityScore: 83.23, pctChange: 1.06  },
  { name: '.CPST',                           documents: 3569,  qualityScore: 90.03, pctChange: -0.87 },
  { name: 'CTT - 15 Min Unit',              documents: 2059,  qualityScore: 75.03, pctChange: 0.79  },
  { name: 'MH OP Progress Note',            documents: 2035,  qualityScore: 92.77, pctChange: 2.54  },
  { name: 'Targeted Case Management',       documents: 1872,  qualityScore: 68.41, pctChange: -0.55 },
  { name: 'Outpatient MH - Standard',       documents: 1654,  qualityScore: 78.90, pctChange: 1.13  },
  { name: 'Crisis Intervention',            documents: 1201,  qualityScore: 84.15, pctChange: 0.42  },
  { name: 'Peer Support Services',          documents: 980,   qualityScore: 61.22, pctChange: -2.10 },
];

const PROGRAMS_DATA: QualityRow[] = [
  { name: 'Home + Community Based Srvcs - PUCK', documents: 13,  qualityScore: 0.00,  pctChange: -100.00 },
  { name: 'Outpatient MH Services - PUCK',        documents: 9,   qualityScore: 0.00,  pctChange: -100.00 },
  { name: 'Eastside CTT',                         documents: 34,  qualityScore: 21.76, pctChange: 78.78   },
  { name: 'Union Street - DS',                    documents: 233, qualityScore: 24.82, pctChange: 33.02   },
  { name: 'Autumn House - DS',                    documents: 95,  qualityScore: 29.31, pctChange: -27.16  },
  { name: 'Same Day Access - Adult',              documents: 31,  qualityScore: 31.23, pctChange: 14.80   },
  { name: 'WC at Safe Landing',                   documents: 87,  qualityScore: 33.89, pctChange: -41.14  },
  { name: 'WYC-NFMH',                             documents: 77,  qualityScore: 34.81, pctChange: -5.28   },
  { name: 'Adult Residential - Step Down',        documents: 142, qualityScore: 41.20, pctChange: 8.33    },
  { name: 'Crisis Stabilization Unit',            documents: 56,  qualityScore: 45.67, pctChange: -12.40  },
  { name: 'School-Based Mental Health',           documents: 198, qualityScore: 52.34, pctChange: 3.91    },
  { name: 'Wraparound Services',                  documents: 310, qualityScore: 58.90, pctChange: 6.15    },
];

function scoreColor(score: number): string {
  if (score === 0)   return '#fee2e2'; // red
  if (score < 40)    return '#fecaca'; // light red
  if (score < 60)    return '#fde68a'; // yellow
  if (score >= 85)   return '#bbf7d0'; // green
  return '';
}

function changeColor(pct: number | null): string {
  if (pct === null)  return '';
  if (pct <= -50)    return '#fecaca';
  if (pct < 0)       return '#fee2e2';
  if (pct >= 50)     return '#bbf7d0';
  return '';
}

function QualityTable({ title, rows, totalRecords, nameCol }: {
  title: string; rows: QualityRow[]; totalRecords: number; nameCol: string;
}) {
  const [search, setSearch] = useState('');
  const filters = useFilters();
  const filtered = rows
    .filter(r => {
      if (nameCol === 'program' && filters.programs.length > 0 && !filters.programs.includes(r.name)) return false;
      if (nameCol === 'supervisors' && filters.supervisors.length > 0 && !filters.supervisors.includes(r.name)) return false;
      return true;
    })
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="cr-chart-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">{title}</p>
        <CardIcons />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Search</span>
        <input
          className="cr-search-input"
          placeholder={`${totalRecords} records...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className="cr-table">
        <thead>
          <tr>
            <th>{nameCol} <span className="cr-sort-icon">⇅</span></th>
            <th># of documents –<br/>last 30 days <span className="cr-sort-icon">⇅</span></th>
            <th>quality score –<br/>last 30 days <span className="cr-sort-icon">⇅</span></th>
            <th>% change from<br/>previous 30 days <span className="cr-sort-icon">⇅</span></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => {
            const sc = scoreColor(r.qualityScore);
            const cc = changeColor(r.pctChange);
            return (
              <tr key={i} className={i % 2 === 1 ? 'cr-table__row--alt' : ''}>
                <td style={{ color: r.name === 'N/A' ? '#9ca3af' : undefined }}>{r.name}</td>
                <td>{typeof r.documents === 'number' ? r.documents.toLocaleString() : r.documents}</td>
                <td style={{ background: sc || undefined, fontWeight: sc ? 600 : undefined }}>{r.qualityScore.toFixed(2)}</td>
                <td style={{ background: cc || undefined, fontWeight: cc ? 600 : undefined, color: r.pctChange === null ? '#9ca3af' : undefined }}>
                  {r.pctChange === null ? 'N/A' : `${r.pctChange > 0 ? '+' : ''}${r.pctChange.toFixed(2)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Filter Helpers ───────────────────────────────────────────────────────────

// Time range → cutoff date (today = 2026-04-16)
function timeRangeCutoff(range: string): Date | null {
  const today = new Date('2026-04-09');
  if (range === 'Last week')    { const d = new Date(today); d.setDate(d.getDate() - 7);   return d; }
  if (range === 'Last month')   { const d = new Date(today); d.setDate(d.getDate() - 30);  return d; }
  if (range === 'Last quarter') { const d = new Date(today); d.setDate(d.getDate() - 90);  return d; }
  if (range === 'Last year')    { const d = new Date(today); d.setDate(d.getDate() - 365); return d; }
  return null;
}

function matchesProviderFilters(r: ProviderAnalysisRow, filters: FilterState): boolean {
  if (filters.organizations.length > 0 && !filters.organizations.includes(SUPERVISOR_ORG_MAP[r.supervisors] ?? '')) return false;
  if (filters.supervisors.length > 0 && !filters.supervisors.includes(r.supervisors)) return false;
  if (filters.programs.length > 0 && !filters.programs.includes(r.program)) return false;
  if (filters.providers.length > 0 && !filters.providers.includes(r.provider)) return false;
  return true;
}

function matchesDocFilters(r: DocByCheckpointRow, filters: FilterState): boolean {
  if (filters.organizations.length > 0 && !filters.organizations.includes(SUPERVISOR_ORG_MAP[r.supervisors] ?? '')) return false;
  if (filters.businessUnits.length > 0 && !filters.businessUnits.includes(r.businessUnit)) return false;
  if (filters.programs.length > 0 && !filters.programs.includes(r.program)) return false;
  if (filters.supervisors.length > 0 && !filters.supervisors.includes(r.supervisors)) return false;
  if (filters.services.length > 0 && !filters.services.includes(r.serviceName)) return false;
  if (filters.providers.length > 0 && !filters.providers.some(p => r.providerEmail.toLowerCase().includes(p.toLowerCase()))) return false;
  if (filters.documentId && !r.clientDocId.includes(filters.documentId)) return false;
  // Time range filter on docDate
  const cutoff = timeRangeCutoff(filters.timeRange);
  if (cutoff) {
    const docDate = new Date(r.docDate);
    if (docDate < cutoff) return false;
  }
  return true;
}

// ─── Analysis by Provider Table ───────────────────────────────────────────────
// PROVIDER_ANALYSIS_DATA and ProviderAnalysisRow are imported from ../../data/complianceReport

const ABP_SORT_ICON = () => <span className="cr-sort-icon">⇅</span>;

function AnalysisByProviderTable() {
  const TOTAL = 1000;
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const filters = useFilters();

  const filtered = PROVIDER_ANALYSIS_DATA
    .filter(r => matchesProviderFilters(r, filters))
    .filter(r =>
      r.provider.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.program.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(TOTAL / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);
  const pageNums: (number | '...')[] = [];
  for (let i = 1; i <= Math.min(5, totalPages); i++) pageNums.push(i);
  if (totalPages > 6) pageNums.push('...');
  if (totalPages > 5) pageNums.push(totalPages);

  return (
    <div className="cr-chart-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">Analysis by Provider</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="cr-card-icon" title="Filter">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="cr-card-icon-badge">1</span>
          </span>
          <span className="cr-card-icon" title="Warning">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2L1 11h11L6.5 2z" stroke="#f59e0b" strokeWidth="1.2" fill="none"/><path d="M6.5 5.5v3M6.5 9.5h.01" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </span>
          <span className="cr-card-icon" title="More">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="10.5" r="1" fill="currentColor"/></svg>
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span>Show</span>
          <input className="cr-perpage-input" type="number" value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} />
          <span>entries per page</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span>Search</span>
          <input className="cr-search-input" placeholder={`${TOTAL.toLocaleString()} records...`}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {/* Scrollable table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table className="cr-table" style={{ minWidth: 1400 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 140 }}>provider <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 200 }}>provider email <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 140 }}>supervisors <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 160 }}>program <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 90, textAlign: 'right' }}>total number of documents analyzed <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 80, textAlign: 'right' }}>quality score (avg) <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 100, textAlign: 'right' }}>completeness (not empty notes) % <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 110, textAlign: 'right' }}>uniqueness – (not copy/paste) % <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 100, textAlign: 'right' }}>progress mentioned % <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 90, textAlign: 'right' }}>compliant plan % <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 90, textAlign: 'right' }}>golden thread % <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 100, textAlign: 'right' }}>intervention used % <ABP_SORT_ICON /></th>
              <th style={{ minWidth: 110, textAlign: 'right' }}>client response to intervention % <ABP_SORT_ICON /></th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={i} className={i % 2 === 1 ? 'cr-table__row--alt' : ''}>
                <td>{r.provider}</td>
                <td>{r.email}</td>
                <td>{r.supervisors}</td>
                <td>{r.program}</td>
                <td style={{ textAlign: 'right' }}>{r.documents.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>{r.qualityScore.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{r.completeness.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{r.uniqueness.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{r.progressMentioned.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{r.compliantPlan.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{r.goldenThread.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{r.interventionUsed.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{r.clientResponse.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="cr-pagination">
        {pageNums.map((n, i) =>
          n === '...'
            ? <span key={`e${i}`} style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>
            : <button key={n}
                className={`cr-pagination__btn${n === page ? ' cr-pagination__btn--active' : ''}`}
                onClick={() => setPage(n as number)}>{n}</button>
        )}
      </div>
    </div>
  );
}

function ServicesQualityTable() {
  return <QualityTable title="Services – Quality Score" rows={SERVICES_DATA} totalRecords={485} nameCol="service" />;
}

function ProgramsQualityTable() {
  return <QualityTable title="Programs – Quality Score" rows={PROGRAMS_DATA} totalRecords={404} nameCol="program" />;
}

const SUPERVISORS_DATA: QualityRow[] = [
  { name: 'Yizhao Sheng',        documents: 1,   qualityScore: 0.00,  pctChange: null    },
  { name: 'Kirsten Kuns',        documents: 1,   qualityScore: 0.00,  pctChange: -100.00 },
  { name: 'PARRETT, JENNIFER LEA',documents: 23,  qualityScore: 8.00,  pctChange: null    },
  { name: 'GIBE, ALISHA M',      documents: 8,   qualityScore: 21.00, pctChange: -11.76  },
  { name: 'cbuell',              documents: 87,  qualityScore: 25.38, pctChange: -25.23  },
  { name: 'Hillary Scudder',     documents: 6,   qualityScore: 26.00, pctChange: null    },
  { name: 'dpechtel',            documents: 283, qualityScore: 28.35, pctChange: 22.48   },
  { name: 'BPeterson',           documents: 159, qualityScore: 28.73, pctChange: 27.73   },
  { name: 'MYERS, JOSHUA',       documents: 9,   qualityScore: 31.11, pctChange: 17.01   },
  { name: 'Amanda Torres',       documents: 44,  qualityScore: 34.82, pctChange: -8.14   },
  { name: 'LaTronda King',       documents: 201, qualityScore: 38.50, pctChange: 5.32    },
  { name: 'Rachel Monroe',       documents: 118, qualityScore: 42.17, pctChange: null    },
  { name: 'Sandra Choi',         documents: 76,  qualityScore: 47.63, pctChange: -3.90   },
  { name: 'Linda Torres',        documents: 312, qualityScore: 55.40, pctChange: 12.11   },
  { name: 'Brenda Mills',        documents: 255, qualityScore: 61.88, pctChange: 1.44    },
  { name: 'Donna Blake',         documents: 189, qualityScore: 68.22, pctChange: -0.76   },
  { name: 'Karen Wu',            documents: 143, qualityScore: 74.15, pctChange: 2.08    },
  { name: 'JENNIFER OHRMUNDT',   documents: 410, qualityScore: 79.44, pctChange: 0.93    },
  { name: 'Tara Simmons',        documents: 98,  qualityScore: 83.70, pctChange: -1.22   },
  { name: 'Henderson, Tayler',   documents: 527, qualityScore: 89.31, pctChange: 3.15    },
];

function SupervisorsQualityTable() {
  return <QualityTable title="Supervisors – Quality Score" rows={SUPERVISORS_DATA} totalRecords={475} nameCol="supervisor" />;
}

// ─── Compliance Rate by Checkpoint Chart ─────────────────────────────────────

const CHECKPOINTS = [
  { key: 'completeness',     label: 'completeness',     color: '#86efac' },
  { key: 'uniqueness',       label: 'uniqueness',       color: '#d1d5db' },
  { key: 'compliantPlan',    label: 'compliant plan',   color: '#60a5fa' },
  { key: 'intervention',     label: 'intervention used',color: '#fb923c' },
  { key: 'clientResponse',   label: 'client response',  color: '#a78bfa' },
  { key: 'goldenThread',     label: 'golden thread',    color: '#34d399' },
  { key: 'progressMentioned',label: 'progress mentioned',color: '#f472b6' },
];

type OrgRow = {
  org: string;
  completeness: number; uniqueness: number; compliantPlan: number;
  intervention: number; clientResponse: number; goldenThread: number;
  progressMentioned: number;
};

const COMPLIANCE_BY_ORG: OrgRow[] = [
  { org: 'Aurora',         completeness:99.9, uniqueness:95.2, compliantPlan:83.8, intervention:76.6, clientResponse:80.4, goldenThread:85.6, progressMentioned:74.7 },
  { org: 'Centerstone',    completeness:100,  uniqueness:93.0, compliantPlan:80.5, intervention:44.1, clientResponse:59.1, goldenThread:48.3, progressMentioned:62.5 },
  { org: 'Edgewood',       completeness:97.2, uniqueness:95.5, compliantPlan:85.1, intervention:67.6, clientResponse:63.5, goldenThread:58.1, progressMentioned:60.0 },
  { org: 'Gandara',        completeness:100,  uniqueness:94.9, compliantPlan:78.4, intervention:78.6, clientResponse:83.8, goldenThread:83.8, progressMentioned:68.7 },
  { org: 'Gulf Bend',      completeness:100,  uniqueness:90.3, compliantPlan:83.8, intervention:63.7, clientResponse:63.7, goldenThread:54.1, progressMentioned:61.0 },
  { org: 'Hillsides',      completeness:99.7, uniqueness:92.2, compliantPlan:79.1, intervention:30.1, clientResponse:52.2, goldenThread:35.9, progressMentioned:50.7 },
  { org: 'Hope MHC',       completeness:92.2, uniqueness:89.5, compliantPlan:76.7, intervention:58.3, clientResponse:63.5, goldenThread:41.3, progressMentioned:58.3 },
  { org: 'Lighthouse',     completeness:99.5, uniqueness:92.6, compliantPlan:81.2, intervention:76.7, clientResponse:79.1, goldenThread:73.5, progressMentioned:75.4 },
  { org: 'Lumera',         completeness:95.5, uniqueness:88.1, compliantPlan:74.1, intervention:62.9, clientResponse:60.9, goldenThread:63.0, progressMentioned:63.1 },
  { org: 'Metrocare',      completeness:100,  uniqueness:93.6, compliantPlan:84.1, intervention:79.1, clientResponse:81.2, goldenThread:84.1, progressMentioned:75.4 },
  { org: 'Northpoint',     completeness:99.7, uniqueness:92.0, compliantPlan:78.7, intervention:71.4, clientResponse:70.5, goldenThread:62.6, progressMentioned:69.3 },
  { org: 'Peak Behavioral',completeness:88.1, uniqueness:85.1, compliantPlan:67.6, intervention:37.6, clientResponse:52.5, goldenThread:18.5, progressMentioned:41.3 },
  { org: 'Region Ten',     completeness:100,  uniqueness:91.7, compliantPlan:85.1, intervention:83.8, clientResponse:85.1, goldenThread:83.8, progressMentioned:83.8 },
  { org: 'Victor',         completeness:99.7, uniqueness:90.5, compliantPlan:76.7, intervention:63.5, clientResponse:65.3, goldenThread:22.6, progressMentioned:35.0 },
  { org: 'Wyandot',        completeness:100,  uniqueness:96.3, compliantPlan:89.0, intervention:88.1, clientResponse:89.0, goldenThread:85.1, progressMentioned:86.1 },
];

const LEGEND_PAGES = [
  CHECKPOINTS.slice(0, 4),
  CHECKPOINTS.slice(4, 7),
];

function ComplianceRateChart() {
  const [hoveredInfo, setHoveredInfo] = useState<{ org: string; label: string; value: number; x: number; y: number } | null>(null);
  const [activePill, setActivePill] = useState<'all' | 'inv'>('all');
  const [legendPage, setLegendPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const W = 900, H = 320;
  const mL = 58, mR = 10, mT = 80, mB = 50;
  const chartW = W - mL - mR;
  const chartH = H - mT - mB;
  const yMin = 0, yMax = 100;
  const yTicks = [0, 20, 40, 60, 80, 100];

  function yPos(v: number) { return mT + chartH - ((v - yMin) / (yMax - yMin)) * chartH; }

  const nOrgs = COMPLIANCE_BY_ORG.length;
  const nCPs = CHECKPOINTS.length;
  const groupW = chartW / nOrgs;
  const barW = Math.max(3, (groupW * 0.85) / nCPs);
  const groupGap = groupW * 0.15;

  function barX(orgIdx: number, cpIdx: number) {
    return mL + orgIdx * groupW + groupGap / 2 + cpIdx * barW;
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>, org: string, cp: typeof CHECKPOINTS[0], value: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHoveredInfo({ org, label: cp.label, value, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="cr-chart-card" style={{ flex: 1, minWidth: 0 }}>
      <div className="cr-card-header">
        <p className="cr-chart-card__title">Compliance Rate by Checkpoint</p>
        <CardIcons />
      </div>

      {/* Legend with pagination */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {LEGEND_PAGES[legendPage].map(cp => (
          <div key={cp.key} className="cr-bar-legend-item">
            <span className="cr-legend-dot" style={{ background: cp.color }} />
            {cp.label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
          <button className="cr-legend-nav" onClick={() => setLegendPage(p => Math.max(0, p - 1))} disabled={legendPage === 0}>◀</button>
          <span style={{ fontSize: 11, color: '#6b7280' }}>{legendPage + 1}/{LEGEND_PAGES.length}</span>
          <button className="cr-legend-nav" onClick={() => setLegendPage(p => Math.min(LEGEND_PAGES.length - 1, p + 1))} disabled={legendPage === LEGEND_PAGES.length - 1}>▶</button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className={`cr-pill${activePill === 'all' ? ' cr-pill--active' : ''}`} onClick={() => setActivePill('all')}>All</button>
          <button className={`cr-pill${activePill === 'inv' ? ' cr-pill--active' : ''}`} onClick={() => setActivePill('inv')}>Inv</button>
        </div>
      </div>

      <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
        {hoveredInfo && (
          <div className="cr-chart-tooltip" style={{
            position: 'absolute',
            left: Math.min(hoveredInfo.x + 14, (containerRef.current?.offsetWidth ?? 400) - 210),
            top: Math.max(4, hoveredInfo.y - 80),
            zIndex: 20,
            pointerEvents: 'none',
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{hoveredInfo.org}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
              <span>{hoveredInfo.label}</span>
              <span style={{ marginLeft: 8, fontWeight: 700, color: '#111' }}>{hoveredInfo.value.toFixed(2)}%</span>
            </div>
          </div>
        )}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 320, display: 'block' }}
          onMouseLeave={() => setHoveredInfo(null)}>

          {/* Y label */}
          <text x={12} y={mT + chartH / 2} textAnchor="middle" fontSize={9} fill="#9ca3af"
            transform={`rotate(-90, 12, ${mT + chartH / 2})`}>compliance %</text>

          {/* Y grid */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={mL} x2={mL + chartW} y1={yPos(tick)} y2={yPos(tick)} stroke="#e5e7eb" strokeWidth={1} />
              <text x={mL - 5} y={yPos(tick) + 4} fontSize={9} fill="#9ca3af" textAnchor="end">{tick.toFixed(2)}%</text>
            </g>
          ))}

          {/* Bars */}
          {COMPLIANCE_BY_ORG.map((row, oi) => (
            <g key={row.org}>
              {CHECKPOINTS.map((cp, ci) => {
                const val = row[cp.key as keyof OrgRow] as number;
                const x = barX(oi, ci);
                const y = yPos(val);
                const bh = yPos(0) - y;
                return (
                  <g key={cp.key} onMouseMove={e => handleMouseMove(e, row.org, cp, val)} style={{ cursor: 'crosshair' }}>
                    <rect x={x} y={y} width={barW} height={bh} fill={cp.color} rx={1} />
                    {barW > 5 && (
                      <text x={x + barW / 2} y={y - 2} fontSize={5.5} textAnchor="middle" fill="#6b7280">{val.toFixed(2)}%</text>
                    )}
                  </g>
                );
              })}
              {/* Org label */}
              <text x={mL + oi * groupW + groupW / 2} y={yPos(0) + 16} fontSize={8.5}
                fill="#6b7280" textAnchor="middle">{row.org}</text>
            </g>
          ))}

          {/* Baseline */}
          <line x1={mL} x2={mL + chartW} y1={yPos(0)} y2={yPos(0)} stroke="#e5e7eb" strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
}

// ─── Performance by Checkpoint Table ─────────────────────────────────────────

const PERFORMANCE_DATA = [
  { checkpoint: 'Progress Mentioned', notes: '48.7k', complianceRate: 52.82, pctChange: 3.75,   rateHighlight: false, changeHighlight: false },
  { checkpoint: 'Client Response',    notes: '53k',   complianceRate: 57.47, pctChange: 1.61,   rateHighlight: false, changeHighlight: false },
  { checkpoint: 'Golden Thread',      notes: '61.3k', complianceRate: 66.51, pctChange: 17.21,  rateHighlight: false, changeHighlight: true  },
  { checkpoint: 'Compliant Plan',     notes: '66.8k', complianceRate: 72.43, pctChange: 0.13,   rateHighlight: false, changeHighlight: false },
  { checkpoint: 'Intervention Used',  notes: '68.2k', complianceRate: 73.96, pctChange: 3.75,   rateHighlight: false, changeHighlight: false },
  { checkpoint: 'Uniqueness',         notes: '81.1k', complianceRate: 87.95, pctChange: 0.85,   rateHighlight: false, changeHighlight: false },
  { checkpoint: 'Completeness',       notes: '88.2k', complianceRate: 95.72, pctChange: -0.24,  rateHighlight: true,  changeHighlight: false },
];

function PerformanceTable() {
  return (
    <div className="cr-chart-card cr-perf-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">Performance by Checkpoint</p>
        <CardIcons />
      </div>
      <table className="cr-table cr-perf-table">
        <thead>
          <tr>
            <th>checkpoints <span className="cr-sort-icon">⇅</span></th>
            <th># of compliance notes – last 30 days <span className="cr-sort-icon">⇅</span></th>
            <th>compliance rate – last 30 days <span className="cr-sort-icon">⇅</span></th>
            <th>% change from previous 30 days <span className="cr-sort-icon">⇅</span></th>
          </tr>
        </thead>
        <tbody>
          {PERFORMANCE_DATA.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'cr-table__row--alt' : ''}>
              <td>{row.checkpoint}</td>
              <td>{row.notes}</td>
              <td className={row.rateHighlight ? 'cr-cell--green' : ''}>{row.complianceRate.toFixed(2)}%</td>
              <td className={row.changeHighlight ? 'cr-cell--green' : ''}>{row.pctChange > 0 ? '+' : ''}{row.pctChange.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Quality Score Timeline ───────────────────────────────────────────────────

const QUALITY_SCORE_DATA = [
  { label: '8',  date: 'Mon Jan 8',   value: 70.12 },
  { label: '15', date: 'Mon Jan 15',  value: 71.34 },
  { label: '22', date: 'Mon Jan 22',  value: 70.50 },
  { label: '29', date: 'Mon Jan 29',  value: 69.80 },
  { label: 'Feb',date: 'Mon Feb 5',   value: 69.20 },
  { label: '8',  date: 'Mon Feb 8',   value: 70.40 },
  { label: '15', date: 'Mon Feb 15',  value: 70.10 },
  { label: '16', date: 'Mon Feb 16',  value: 72.61 },
  { label: '22', date: 'Mon Feb 22',  value: 71.80 },
  { label: 'Mar',date: 'Mon Mar 1',   value: 71.50 },
  { label: '8',  date: 'Mon Mar 8',   value: 72.30 },
  { label: '15', date: 'Mon Mar 15',  value: 71.90 },
  { label: '22', date: 'Mon Mar 22',  value: 72.10 },
  { label: '29', date: 'Mon Mar 29',  value: 73.00 },
  { label: 'Apr',date: 'Mon Apr 5',   value: 73.42 },
  { label: '8',  date: 'Mon Apr 8',   value: 75.20 },
];

function QualityScoreTimeline() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [activePill, setActivePill] = useState<'all' | 'inv'>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 900, H = 280;
  const mL = 68, mR = 20, mT = 20, mB = 60;
  const chartW = W - mL - mR;
  const chartH = H - mT - mB;

  const yMin = 0, yMax = 80;
  const yTicks = [0, 20, 40, 60, 80];

  const data = QUALITY_SCORE_DATA;
  const n = data.length;

  function xPos(i: number) { return mL + (i / (n - 1)) * chartW; }
  function yPos(v: number) { return mT + chartH - ((v - yMin) / (yMax - yMin)) * chartH; }

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(' ');
  const fillPath = linePath + ` L${xPos(n-1).toFixed(1)},${(mT+chartH).toFixed(1)} L${xPos(0).toFixed(1)},${(mT+chartH).toFixed(1)} Z`;

  // Sparse x-axis labels: show every other or month-markers
  const xLabels = [
    { i: 0,  text: '8' },
    { i: 2,  text: '15' },
    { i: 3,  text: '22' },
    { i: 4,  text: '29' },
    { i: 5,  text: 'Feb', bold: true },
    { i: 7,  text: '8' },
    { i: 8,  text: '15' },
    { i: 9,  text: '22' },
    { i: 9,  text: 'Mar', bold: true },
    { i: 10, text: '8' },
    { i: 11, text: '15' },
    { i: 12, text: '22' },
    { i: 13, text: '29' },
    { i: 14, text: 'Apr', bold: true },
  ];

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="cr-mid-row cr-quality-row">
      {/* Left: Average Quality Score stat */}
      <div className="cr-chart-card">
        <div className="cr-card-header">
          <p className="cr-chart-card__title">Average Quality Score</p>
          <CardIcons />
        </div>
        <div className="cr-quality-stat">73.42</div>
        <div className="cr-big-stat__sub">out of 100</div>
      </div>

      {/* Right: Timeline chart */}
      <div className="cr-chart-card cr-mid-chart">
        <div className="cr-card-header">
          <p className="cr-chart-card__title">Quality Score – Timeline</p>
          <CardIcons />
        </div>

        {/* Legend + pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="24" height="12" viewBox="0 0 24 12">
            <line x1="0" y1="6" x2="24" y2="6" stroke="#60b8d4" strokeWidth="1.5" />
            <circle cx="12" cy="6" r="4" fill="white" stroke="#60b8d4" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: 12, color: '#6b7280' }}>average quality score</span>
          <button className={`cr-pill${activePill === 'all' ? ' cr-pill--active' : ''}`} onClick={() => setActivePill('all')}>All</button>
          <button className={`cr-pill${activePill === 'inv' ? ' cr-pill--active' : ''}`} onClick={() => setActivePill('inv')}>Inv</button>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Tooltip */}
          {hovered && hoverIdx !== null && (
            <div className="cr-chart-tooltip" style={{
              position: 'absolute',
              left: `${Math.min(Math.max((xPos(hoverIdx) / W) * 100, 10), 65)}%`,
              top: `${((yPos(hovered.value) - mT) / chartH) * 100 - 10}%`,
              transform: 'translate(10px, -100%)',
              zIndex: 10,
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{hovered.date}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60b8d4', display: 'inline-block' }} />
                <span>average quality score</span>
                <span style={{ marginLeft: 8, fontWeight: 700, color: '#111' }}>{hovered.value.toFixed(2)}</span>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 280, display: 'block', overflow: 'visible' }}
            onMouseMove={(e) => {
              const rect = svgRef.current?.getBoundingClientRect();
              if (!rect) return;
              const mx = mL + ((e.clientX - rect.left) / rect.width) * (rect.width) * (W / rect.width) - mL;
              const relX = ((e.clientX - rect.left) / rect.width) * chartW;
              let closest = 0, minD = Infinity;
              data.forEach((_, i) => {
                const d = Math.abs(xPos(i) - mL - relX);
                if (d < minD) { minD = d; closest = i; }
              });
              setHoverIdx(closest);
            }}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="qsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60b8d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#60b8d4" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* Y-axis label */}
            <text x={14} y={mT + chartH / 2} textAnchor="middle" fontSize={10} fill="#9ca3af"
              transform={`rotate(-90, 14, ${mT + chartH / 2})`}>average quality score</text>

            {/* Y grid + ticks */}
            {yTicks.map(tick => (
              <g key={tick}>
                <line x1={mL} x2={mL + chartW} y1={yPos(tick)} y2={yPos(tick)} stroke="#e5e7eb" strokeWidth={1} />
                <text x={mL - 6} y={yPos(tick) + 4} fontSize={10} fill="#9ca3af" textAnchor="end">{tick}</text>
              </g>
            ))}

            {/* Fill area */}
            <path d={fillPath} fill="url(#qsGrad)" />

            {/* Line */}
            <path d={linePath} fill="none" stroke="#60b8d4" strokeWidth={1.5} />

            {/* Dots */}
            {data.map((d, i) => (
              <circle key={i} cx={xPos(i)} cy={yPos(d.value)} r={i === hoverIdx ? 5 : 4}
                fill="white" stroke="#60b8d4" strokeWidth={1.5} />
            ))}

            {/* Hover dashed line */}
            {hoverIdx !== null && (
              <line x1={xPos(hoverIdx)} x2={xPos(hoverIdx)} y1={mT} y2={mT + chartH}
                stroke="#2d4ccd" strokeWidth={1} strokeDasharray="4,3" />
            )}

            {/* X-axis labels */}
            {xLabels.map(({ i, text, bold }, idx) => (
              <text key={idx} x={xPos(i)} y={mT + chartH + 18} fontSize={10}
                fill={bold ? '#374151' : '#9ca3af'} textAnchor="middle"
                fontWeight={bold ? 700 : 400}>{text}</text>
            ))}

            {/* X-axis "weeks" label */}
            <text x={mL + chartW / 2} y={H - 4} fontSize={11} fill="#9ca3af" textAnchor="middle">weeks</text>

            {/* Baseline */}
            <line x1={mL} x2={mL + chartW} y1={mT + chartH} y2={mT + chartH} stroke="#e5e7eb" strokeWidth={1} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder Tab Content ──────────────────────────────────────────────────

// ─── Checkpoints Tab ──────────────────────────────────────────────────────────

interface CPQualityRow { name: string; docs: string; pct: number; change: number | null; }

const CP_PROGRAMS: Record<CheckpointTab, CPQualityRow[]> = {
  'Completeness': [
    { name: 'PAC-CM',                      docs: '3.18k', pct: 100.00, change:  0.00 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  79.81, change: -1.82 },
    { name: 'MHOP',                        docs: '2.04k', pct: 100.00, change:  0.00 },
    { name: 'N/A',                         docs: '2.01k', pct: 100.00, change:  0.00 },
    { name: 'RC03',                        docs: '1.6k',  pct: 100.00, change:  0.20 },
    { name: 'School Based',                docs: '1.6k',  pct: 100.00, change:  0.00 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  99.94, change: -0.06 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  88.00, change:  0.54 },
  ],
  'Uniqueness': [
    { name: 'PAC-CM',                      docs: '3.18k', pct:  91.20, change:  0.30 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  85.44, change: -0.92 },
    { name: 'MHOP',                        docs: '2.04k', pct:  93.10, change:  0.15 },
    { name: 'N/A',                         docs: '2.01k', pct:  88.60, change: -0.40 },
    { name: 'RC03',                        docs: '1.6k',  pct:  90.30, change:  0.10 },
    { name: 'School Based',                docs: '1.6k',  pct:  87.50, change: -0.20 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  89.70, change:  0.05 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  82.10, change:  0.44 },
  ],
  'Golden Thread': [
    { name: 'PAC-CM',                      docs: '3.18k', pct:  72.10, change:  0.80 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  61.30, change: -1.20 },
    { name: 'MHOP',                        docs: '2.04k', pct:  68.40, change:  0.55 },
    { name: 'N/A',                         docs: '2.01k', pct:  64.90, change: -0.30 },
    { name: 'RC03',                        docs: '1.6k',  pct:  70.20, change:  0.40 },
    { name: 'School Based',                docs: '1.6k',  pct:  66.80, change: -0.10 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  69.50, change:  0.25 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  58.30, change:  0.60 },
  ],
  'Intervention Used': [
    { name: 'PAC-CM',                      docs: '3.18k', pct:  78.50, change:  0.50 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  69.20, change: -0.80 },
    { name: 'MHOP',                        docs: '2.04k', pct:  75.80, change:  0.30 },
    { name: 'N/A',                         docs: '2.01k', pct:  71.40, change: -0.20 },
    { name: 'RC03',                        docs: '1.6k',  pct:  77.30, change:  0.45 },
    { name: 'School Based',                docs: '1.6k',  pct:  73.90, change: -0.15 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  76.10, change:  0.10 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  65.70, change:  0.55 },
  ],
  'Client Response': [
    { name: 'PAC-CM',                      docs: '3.18k', pct:  62.40, change:  0.70 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  52.10, change: -1.00 },
    { name: 'MHOP',                        docs: '2.04k', pct:  59.70, change:  0.40 },
    { name: 'N/A',                         docs: '2.01k', pct:  55.30, change: -0.25 },
    { name: 'RC03',                        docs: '1.6k',  pct:  61.20, change:  0.35 },
    { name: 'School Based',                docs: '1.6k',  pct:  57.80, change: -0.10 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  60.50, change:  0.15 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  49.60, change:  0.50 },
  ],
  'Progress Mentioned': [
    { name: 'PAC-CM',                      docs: '3.18k', pct:  56.70, change:  0.60 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  46.40, change: -0.90 },
    { name: 'MHOP',                        docs: '2.04k', pct:  54.20, change:  0.35 },
    { name: 'N/A',                         docs: '2.01k', pct:  50.80, change: -0.20 },
    { name: 'RC03',                        docs: '1.6k',  pct:  55.90, change:  0.30 },
    { name: 'School Based',                docs: '1.6k',  pct:  52.30, change: -0.10 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  54.60, change:  0.20 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  44.20, change:  0.45 },
  ],
  'Compliant Plan': [
    { name: 'PAC-CM',                      docs: '3.18k', pct:  76.80, change:  0.40 },
    { name: 'CCBHC - MH Clinic',           docs: '2.74k', pct:  67.50, change: -0.70 },
    { name: 'MHOP',                        docs: '2.04k', pct:  74.30, change:  0.25 },
    { name: 'N/A',                         docs: '2.01k', pct:  70.10, change: -0.15 },
    { name: 'RC03',                        docs: '1.6k',  pct:  75.60, change:  0.35 },
    { name: 'School Based',                docs: '1.6k',  pct:  72.20, change: -0.10 },
    { name: 'WYC-CM',                      docs: '1.57k', pct:  74.90, change:  0.20 },
    { name: '1808 Glenmar Ave-3225581000', docs: '1.3k',  pct:  63.80, change:  0.50 },
  ],
};

const CP_SUPERVISORS: Record<CheckpointTab, CPQualityRow[]> = {
  'Completeness': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  88.19, change:  1.35 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  90.20, change: -0.31 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  95.93, change:  0.54 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  90.52, change: -0.54 },
    { name: 'N/A',               docs: '2.93k', pct:  99.90, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  99.92, change:  0.43 },
    { name: 'TARA RAHRS',        docs: '957',   pct: 100.00, change:  0.00 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct: 100.00, change:  0.00 },
  ],
  'Uniqueness': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  82.40, change:  0.95 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  85.60, change: -0.21 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  90.10, change:  0.44 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  86.30, change: -0.34 },
    { name: 'N/A',               docs: '2.93k', pct:  93.50, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  94.20, change:  0.33 },
    { name: 'TARA RAHRS',        docs: '957',   pct:  97.80, change:  0.10 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct:  96.40, change:  0.20 },
  ],
  'Golden Thread': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  63.20, change:  0.75 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  68.40, change: -0.21 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  72.50, change:  0.34 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  66.80, change: -0.44 },
    { name: 'N/A',               docs: '2.93k', pct:  71.30, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  75.10, change:  0.23 },
    { name: 'TARA RAHRS',        docs: '957',   pct:  78.90, change:  0.10 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct:  77.40, change:  0.15 },
  ],
  'Intervention Used': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  70.50, change:  0.85 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  74.80, change: -0.31 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  79.20, change:  0.44 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  73.60, change: -0.54 },
    { name: 'N/A',               docs: '2.93k', pct:  78.40, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  81.30, change:  0.33 },
    { name: 'TARA RAHRS',        docs: '957',   pct:  85.60, change:  0.10 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct:  84.10, change:  0.20 },
  ],
  'Client Response': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  54.20, change:  0.65 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  58.60, change: -0.21 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  63.40, change:  0.34 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  57.80, change: -0.44 },
    { name: 'N/A',               docs: '2.93k', pct:  62.10, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  65.80, change:  0.23 },
    { name: 'TARA RAHRS',        docs: '957',   pct:  69.50, change:  0.10 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct:  68.20, change:  0.15 },
  ],
  'Progress Mentioned': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  48.70, change:  0.55 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  53.10, change: -0.21 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  57.90, change:  0.34 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  52.30, change: -0.44 },
    { name: 'N/A',               docs: '2.93k', pct:  56.50, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  60.20, change:  0.23 },
    { name: 'TARA RAHRS',        docs: '957',   pct:  64.30, change:  0.10 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct:  62.80, change:  0.15 },
  ],
  'Compliant Plan': [
    { name: 'HEIDI BORDELON',    docs: '7.95k', pct:  68.90, change:  0.75 },
    { name: 'JASMINE PORTER',    docs: '7.17k', pct:  72.40, change: -0.31 },
    { name: 'LEILA SIMMONS',     docs: '3.58k', pct:  77.80, change:  0.44 },
    { name: 'SAMANTHA REESE',    docs: '3.47k', pct:  71.50, change: -0.54 },
    { name: 'N/A',               docs: '2.93k', pct:  76.30, change: -0.07 },
    { name: 'CARRILLO, LUKE I',  docs: '1.27k', pct:  79.60, change:  0.33 },
    { name: 'TARA RAHRS',        docs: '957',   pct:  83.90, change:  0.10 },
    { name: 'MARISOL SALGADO',   docs: '932',   pct:  82.50, change:  0.20 },
  ],
};

const CHECKPOINT_TABS = ['Completeness', 'Uniqueness', 'Golden Thread', 'Intervention Used', 'Client Response', 'Progress Mentioned', 'Compliant Plan'] as const;
type CheckpointTab = typeof CHECKPOINT_TABS[number];

const CHECKPOINT_STATS: Record<CheckpointTab, { compliantDocs: string; compliancePct: string }> = {
  'Completeness':       { compliantDocs: '350,306', compliancePct: '95.95%' },
  'Uniqueness':         { compliantDocs: '321,884', compliancePct: '88.43%' },
  'Golden Thread':      { compliantDocs: '244,512', compliancePct: '67.15%' },
  'Intervention Used':  { compliantDocs: '268,730', compliancePct: '73.83%' },
  'Client Response':    { compliantDocs: '209,174', compliancePct: '57.47%' },
  'Progress Mentioned': { compliantDocs: '192,447', compliancePct: '52.88%' },
  'Compliant Plan':     { compliantDocs: '263,561', compliancePct: '72.41%' },
};

// Per-checkpoint timeline values (weekly, roughly flat near their compliance %)
const CHECKPOINT_TIMELINE: Record<CheckpointTab, { label: string; date: string; value: number }[]> = {
  'Completeness': [
    {label:'8',   date:'Mon Jan 8',   value:97.2},{label:'15',  date:'Mon Jan 15',  value:96.8},
    {label:'22',  date:'Mon Jan 22',  value:97.1},{label:'29',  date:'Mon Jan 29',  value:95.76},
    {label:'Feb', date:'Mon Feb 5',   value:96.3},{label:'8',   date:'Mon Feb 8',   value:95.9},
    {label:'15',  date:'Mon Feb 15',  value:96.5},{label:'22',  date:'Mon Feb 22',  value:96.1},
    {label:'Mar', date:'Mon Mar 1',   value:95.8},{label:'8',   date:'Mon Mar 8',   value:96.2},
    {label:'15',  date:'Mon Mar 15',  value:95.5},{label:'22',  date:'Mon Mar 22',  value:96.0},
    {label:'29',  date:'Mon Mar 29',  value:96.4},{label:'Apr', date:'Mon Apr 5',   value:96.8},
    {label:'8',   date:'Mon Apr 8',   value:97.5},
  ],
  'Uniqueness': [
    {label:'8',   date:'Mon Jan 8',   value:88.1},{label:'15',  date:'Mon Jan 15',  value:87.9},
    {label:'22',  date:'Mon Jan 22',  value:88.5},{label:'29',  date:'Mon Jan 29',  value:87.2},
    {label:'Feb', date:'Mon Feb 5',   value:88.0},{label:'8',   date:'Mon Feb 8',   value:88.3},
    {label:'15',  date:'Mon Feb 15',  value:87.8},{label:'22',  date:'Mon Feb 22',  value:88.6},
    {label:'Mar', date:'Mon Mar 1',   value:88.2},{label:'8',   date:'Mon Mar 8',   value:88.8},
    {label:'15',  date:'Mon Mar 15',  value:87.5},{label:'22',  date:'Mon Mar 22',  value:88.4},
    {label:'29',  date:'Mon Mar 29',  value:89.0},{label:'Apr', date:'Mon Apr 5',   value:88.7},
    {label:'8',   date:'Mon Apr 8',   value:89.2},
  ],
  'Golden Thread': [
    {label:'8',   date:'Mon Jan 8',   value:64.3},{label:'15',  date:'Mon Jan 15',  value:65.1},
    {label:'22',  date:'Mon Jan 22',  value:63.8},{label:'29',  date:'Mon Jan 29',  value:66.2},
    {label:'Feb', date:'Mon Feb 5',   value:65.5},{label:'8',   date:'Mon Feb 8',   value:66.8},
    {label:'15',  date:'Mon Feb 15',  value:65.9},{label:'22',  date:'Mon Feb 22',  value:67.3},
    {label:'Mar', date:'Mon Mar 1',   value:66.4},{label:'8',   date:'Mon Mar 8',   value:68.1},
    {label:'15',  date:'Mon Mar 15',  value:67.0},{label:'22',  date:'Mon Mar 22',  value:68.5},
    {label:'29',  date:'Mon Mar 29',  value:69.2},{label:'Apr', date:'Mon Apr 5',   value:68.9},
    {label:'8',   date:'Mon Apr 8',   value:70.1},
  ],
  'Intervention Used': [
    {label:'8',   date:'Mon Jan 8',   value:72.1},{label:'15',  date:'Mon Jan 15',  value:73.5},
    {label:'22',  date:'Mon Jan 22',  value:71.8},{label:'29',  date:'Mon Jan 29',  value:74.2},
    {label:'Feb', date:'Mon Feb 5',   value:73.0},{label:'8',   date:'Mon Feb 8',   value:74.8},
    {label:'15',  date:'Mon Feb 15',  value:73.6},{label:'22',  date:'Mon Feb 22',  value:75.1},
    {label:'Mar', date:'Mon Mar 1',   value:74.3},{label:'8',   date:'Mon Mar 8',   value:75.6},
    {label:'15',  date:'Mon Mar 15',  value:73.9},{label:'22',  date:'Mon Mar 22',  value:74.5},
    {label:'29',  date:'Mon Mar 29',  value:75.8},{label:'Apr', date:'Mon Apr 5',   value:76.2},
    {label:'8',   date:'Mon Apr 8',   value:75.4},
  ],
  'Client Response': [
    {label:'8',   date:'Mon Jan 8',   value:55.2},{label:'15',  date:'Mon Jan 15',  value:56.8},
    {label:'22',  date:'Mon Jan 22',  value:54.9},{label:'29',  date:'Mon Jan 29',  value:57.4},
    {label:'Feb', date:'Mon Feb 5',   value:56.1},{label:'8',   date:'Mon Feb 8',   value:58.0},
    {label:'15',  date:'Mon Feb 15',  value:57.2},{label:'22',  date:'Mon Feb 22',  value:58.5},
    {label:'Mar', date:'Mon Mar 1',   value:57.8},{label:'8',   date:'Mon Mar 8',   value:59.3},
    {label:'15',  date:'Mon Mar 15',  value:58.1},{label:'22',  date:'Mon Mar 22',  value:59.0},
    {label:'29',  date:'Mon Mar 29',  value:59.7},{label:'Apr', date:'Mon Apr 5',   value:58.8},
    {label:'8',   date:'Mon Apr 8',   value:60.2},
  ],
  'Progress Mentioned': [
    {label:'8',   date:'Mon Jan 8',   value:51.0},{label:'15',  date:'Mon Jan 15',  value:52.3},
    {label:'22',  date:'Mon Jan 22',  value:50.8},{label:'29',  date:'Mon Jan 29',  value:53.1},
    {label:'Feb', date:'Mon Feb 5',   value:51.9},{label:'8',   date:'Mon Feb 8',   value:53.7},
    {label:'15',  date:'Mon Feb 15',  value:52.5},{label:'22',  date:'Mon Feb 22',  value:54.2},
    {label:'Mar', date:'Mon Mar 1',   value:53.0},{label:'8',   date:'Mon Mar 8',   value:54.8},
    {label:'15',  date:'Mon Mar 15',  value:52.8},{label:'22',  date:'Mon Mar 22',  value:53.5},
    {label:'29',  date:'Mon Mar 29',  value:54.5},{label:'Apr', date:'Mon Apr 5',   value:53.9},
    {label:'8',   date:'Mon Apr 8',   value:55.1},
  ],
  'Compliant Plan': [
    {label:'8',   date:'Mon Jan 8',   value:71.0},{label:'15',  date:'Mon Jan 15',  value:72.4},
    {label:'22',  date:'Mon Jan 22',  value:70.8},{label:'29',  date:'Mon Jan 29',  value:73.1},
    {label:'Feb', date:'Mon Feb 5',   value:71.9},{label:'8',   date:'Mon Feb 8',   value:73.6},
    {label:'15',  date:'Mon Feb 15',  value:72.5},{label:'22',  date:'Mon Feb 22',  value:74.0},
    {label:'Mar', date:'Mon Mar 1',   value:73.2},{label:'8',   date:'Mon Mar 8',   value:74.5},
    {label:'15',  date:'Mon Mar 15',  value:72.9},{label:'22',  date:'Mon Mar 22',  value:73.8},
    {label:'29',  date:'Mon Mar 29',  value:74.8},{label:'Apr', date:'Mon Apr 5',   value:75.2},
    {label:'8',   date:'Mon Apr 8',   value:74.6},
  ],
};

const CHECKPOINT_COLOR: Record<CheckpointTab, string> = {
  'Completeness':       '#4ade80',
  'Uniqueness':         '#60a5fa',
  'Golden Thread':      '#34d399',
  'Intervention Used':  '#f472b6',
  'Client Response':    '#fb923c',
  'Progress Mentioned': '#a78bfa',
  'Compliant Plan':     '#38bdf8',
};

function CheckpointTimeline({ cpTab }: { cpTab: CheckpointTab }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [activePill, setActivePill] = useState<'all'|'inv'>('all');
  const svgRef = useRef<SVGSVGElement>(null);

  const data = CHECKPOINT_TIMELINE[cpTab];
  const color = CHECKPOINT_COLOR[cpTab];
  const label = cpTab.toLowerCase();
  const n = data.length;

  const W = 900, H = 280, mL = 70, mR = 20, mT = 20, mB = 60;
  const chartW = W - mL - mR, chartH = H - mT - mB;
  const yMin = 0, yMax = 100;
  const yTicks = [0, 20, 40, 60, 80, 100];

  function xPos(i: number) { return mL + (i / (n - 1)) * chartW; }
  function yPos(v: number) { return mT + chartH - ((v - yMin) / (yMax - yMin)) * chartH; }

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(' ');
  const fillPath = linePath + ` L${xPos(n-1).toFixed(1)},${(mT+chartH).toFixed(1)} L${xPos(0).toFixed(1)},${(mT+chartH).toFixed(1)} Z`;

  const xLabels = [
    {i:0,text:'8'},{i:2,text:'15'},{i:3,text:'22'},{i:4,text:'29'},
    {i:4,text:'Feb',bold:true},{i:6,text:'8'},{i:7,text:'15'},{i:8,text:'22'},
    {i:8,text:'Mar',bold:true},{i:10,text:'8'},{i:11,text:'15'},{i:12,text:'22'},
    {i:13,text:'29'},{i:13,text:'Apr',bold:true},
  ];

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;
  const gradId = `cpGrad-${cpTab.replace(/\s/g,'')}`;

  return (
    <div className="cr-chart-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">{cpTab} Compliance – Timeline</p>
        <CardIcons />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="24" height="12" viewBox="0 0 24 12">
          <line x1="0" y1="6" x2="24" y2="6" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="6" r="4" fill="white" stroke={color} strokeWidth="1.5" />
        </svg>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
        <button className={`cr-pill${activePill==='all'?' cr-pill--active':''}`} onClick={()=>setActivePill('all')}>All</button>
        <button className={`cr-pill${activePill==='inv'?' cr-pill--active':''}`} onClick={()=>setActivePill('inv')}>Inv</button>
      </div>
      <div style={{ position: 'relative' }}>
        {hovered && hoverIdx !== null && (
          <div className="cr-chart-tooltip" style={{
            position: 'absolute',
            left: `${Math.min(Math.max((xPos(hoverIdx)/W)*100, 5), 60)}%`,
            top: `${Math.max(0, ((yPos(hovered.value)-mT)/chartH)*100 - 15)}%`,
            transform: 'translate(10px,-100%)',
            zIndex: 10,
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{hovered.date}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }} />
              <span>{label}</span>
              <span style={{ marginLeft:8, fontWeight:700, color:'#111' }}>{hovered.value.toFixed(2)}%</span>
            </div>
          </div>
        )}
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:300, display:'block', overflow:'visible' }}
          onMouseMove={e => {
            const rect = svgRef.current?.getBoundingClientRect();
            if (!rect) return;
            const relX = ((e.clientX - rect.left) / rect.width) * chartW;
            let closest = 0, minD = Infinity;
            data.forEach((_,i) => { const d = Math.abs(xPos(i) - mL - relX); if (d < minD) { minD=d; closest=i; }});
            setHoverIdx(closest);
          }}
          onMouseLeave={() => setHoverIdx(null)}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <text x={14} y={mT+chartH/2} textAnchor="middle" fontSize={9} fill="#9ca3af"
            transform={`rotate(-90,14,${mT+chartH/2})`}>{label} %</text>
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={mL} x2={mL+chartW} y1={yPos(tick)} y2={yPos(tick)} stroke="#e5e7eb" strokeWidth={1}/>
              <text x={mL-6} y={yPos(tick)+4} fontSize={9} fill="#9ca3af" textAnchor="end">{tick.toFixed(2)}%</text>
            </g>
          ))}
          <path d={fillPath} fill={`url(#${gradId})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />
          {data.map((d,i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(d.value)} r={i===hoverIdx?5:3.5}
              fill="white" stroke={color} strokeWidth={1.5} />
          ))}
          {hoverIdx !== null && (
            <line x1={xPos(hoverIdx)} x2={xPos(hoverIdx)} y1={mT} y2={mT+chartH}
              stroke="#2d4ccd" strokeWidth={1} strokeDasharray="4,3" />
          )}
          {xLabels.map(({i,text,bold},idx) => (
            <text key={idx} x={xPos(i)} y={mT+chartH+18} fontSize={10}
              fill={bold?'#374151':'#9ca3af'} textAnchor="middle" fontWeight={bold?700:400}>{text}</text>
          ))}
          <text x={mL+chartW/2} y={H-4} fontSize={11} fill="#9ca3af" textAnchor="middle">weeks</text>
          <line x1={mL} x2={mL+chartW} y1={mT+chartH} y2={mT+chartH} stroke="#e5e7eb" strokeWidth={1}/>
        </svg>
      </div>
    </div>
  );
}

function CPQualityTable({ title, rows, totalRecords, nameCol }: {
  title: string; rows: CPQualityRow[]; totalRecords: number; nameCol: string;
}) {
  const [search, setSearch] = useState('');
  const filters = useFilters();
  const filtered = rows
    .filter(r => {
      if (nameCol === 'program' && filters.programs.length > 0 && !filters.programs.includes(r.name)) return false;
      if (nameCol === 'supervisors' && filters.supervisors.length > 0 && !filters.supervisors.includes(r.name)) return false;
      return true;
    })
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const pctBg = (v: number) => {
    if (v >= 99) return '#bbf7d0';
    if (v >= 90) return '#d1fae5';
    return undefined;
  };
  const changeBg = (v: number | null) => {
    if (v === null) return undefined;
    if (v > 0) return '#d1fae5';
    if (v < -0.5) return '#fee2e2';
    return undefined;
  };

  return (
    <div className="cr-chart-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">{title}</p>
        <CardIcons />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Search</span>
        <input
          className="cr-search-input"
          placeholder={`${totalRecords} records...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className="cr-table">
        <thead>
          <tr>
            <th>{nameCol} <span className="cr-sort-icon">⇅</span></th>
            <th># complete documents –<br/>last 30 days <span className="cr-sort-icon">⇅</span></th>
            <th>% completeness –<br/>last 30 days <span className="cr-sort-icon">⇅</span></th>
            <th>% change from<br/>previous 30 days <span className="cr-sort-icon">⇅</span></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => {
            const pb = pctBg(r.pct);
            const cb = changeBg(r.change);
            return (
              <tr key={i} className={i % 2 === 1 ? 'cr-table__row--alt' : ''}>
                <td style={{ color: r.name === 'N/A' ? '#9ca3af' : undefined }}>{r.name}</td>
                <td>{r.docs}</td>
                <td style={{ background: pb, fontWeight: pb ? 600 : undefined }}>{r.pct.toFixed(2)}%</td>
                <td style={{ background: cb, fontWeight: cb ? 600 : undefined, color: r.change === null ? '#9ca3af' : undefined }}>
                  {r.change === null ? 'N/A' : `${r.change > 0 ? '+' : ''}${r.change.toFixed(2)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Checkpoint-specific column key per tab
const CP_COLUMN: Record<CheckpointTab, keyof ProviderAnalysisRow> = {
  'Completeness':       'completeness',
  'Uniqueness':         'uniqueness',
  'Golden Thread':      'goldenThread',
  'Intervention Used':  'interventionUsed',
  'Client Response':    'clientResponse',
  'Progress Mentioned': 'progressMentioned',
  'Compliant Plan':     'compliantPlan',
};

function CPProviderTable({ cpTab }: { cpTab: CheckpointTab }) {
  const [search, setSearch]     = useState('');
  const [perPage, setPerPage]   = useState(10);
  const [page, setPage]         = useState(1);
  const colKey                  = CP_COLUMN[cpTab];
  const TOTAL                   = 1000;
  const filters                 = useFilters();

  const filtered = PROVIDER_ANALYSIS_DATA
    .filter(r => matchesProviderFilters(r, filters))
    .filter(r =>
      r.provider.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows       = filtered.slice((page - 1) * perPage, page * perPage);

  const pctBg = (v: number) => {
    if (v >= 99) return '#bbf7d0';
    if (v >= 90) return '#d1fae5';
    return undefined;
  };

  // Build pagination array with ellipsis
  const buildPages = () => {
    if (totalPages <= 8) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1, 2, 3, 4, 5, 6, 7, '…', totalPages];
    return pages;
  };

  return (
    <div className="cr-chart-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">Providers – {cpTab}</p>
        <CardIcons />
      </div>

      {/* Show + Search row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span>Show</span>
          <input
            type="number"
            className="cr-perpage-input"
            value={perPage}
            min={1}
            onChange={e => { setPerPage(Number(e.target.value) || 10); setPage(1); }}
          />
          <span>entries per page</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span>Search</span>
          <input
            className="cr-search-input"
            placeholder={`${TOTAL} records...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="cr-table" style={{ minWidth: 1100 }}>
          <thead>
            <tr>
              <th>provider <span className="cr-sort-icon">⇅</span></th>
              <th>provider email <span className="cr-sort-icon">⇅</span></th>
              <th>supervisors <span className="cr-sort-icon">⇅</span></th>
              <th>program <span className="cr-sort-icon">⇅</span></th>
              <th>total number of documents analyzed <span className="cr-sort-icon">⇅</span></th>
              <th>{cpTab.toLowerCase()} % <span className="cr-sort-icon">⇅</span></th>
              <th>quality score (avg) <span className="cr-sort-icon">⇅</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const cpVal = r[colKey] as number;
              const bg = pctBg(cpVal);
              return (
                <tr key={i} className={i % 2 === 1 ? 'cr-table__row--alt' : ''}>
                  <td>{r.provider}</td>
                  <td>{r.email}</td>
                  <td style={{ color: r.supervisors === 'N/A' ? '#9ca3af' : undefined }}>{r.supervisors}</td>
                  <td style={{ color: r.program === 'N/A' ? '#9ca3af' : undefined }}>{r.program}</td>
                  <td>{r.documents.toLocaleString()}</td>
                  <td style={{ background: bg, fontWeight: bg ? 600 : undefined }}>{cpVal.toFixed(2)}%</td>
                  <td>{r.qualityScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="cr-pagination" style={{ marginTop: 12 }}>
        {buildPages().map((p, idx) =>
          p === '…'
            ? <span key={idx} className="cr-pagination__ellipsis">…</span>
            : <button
                key={idx}
                className={`cr-pagination__btn${page === p ? ' cr-pagination__btn--active' : ''}`}
                onClick={() => setPage(p as number)}
              >{p}</button>
        )}
      </div>
    </div>
  );
}

function CheckpointsTab() {
  const [activeCP, setActiveCP] = useState<CheckpointTab>('Completeness');
  const stats = CHECKPOINT_STATS[activeCP];

  return (
    <div className="cr-section">
      {/* Sub-tabs */}
      <div className="cr-sub-tabs">
        {CHECKPOINT_TABS.map(t => (
          <button key={t}
            className={`cr-sub-tab${activeCP===t?' cr-sub-tab--active':''}`}
            onClick={() => setActiveCP(t)}>{t}</button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="cr-two-col-row">
        <div className="cr-chart-card">
          <div className="cr-card-header">
            <p className="cr-chart-card__title">{activeCP}</p>
            <CardIcons />
          </div>
          <div className="cr-big-stat" style={{ fontSize: 40, marginTop: 16 }}>{stats.compliantDocs}</div>
          <div className="cr-big-stat__sub">compliant documents</div>
        </div>
        <div className="cr-chart-card">
          <div className="cr-card-header">
            <p className="cr-chart-card__title">{activeCP}</p>
            <CardIcons />
          </div>
          <div className="cr-big-stat" style={{ fontSize: 40, marginTop: 16 }}>{stats.compliancePct}</div>
          <div className="cr-big-stat__sub">compliance %</div>
        </div>
      </div>

      {/* Timeline chart */}
      <CheckpointTimeline cpTab={activeCP} />

      {/* Programs + Supervisors tables */}
      <div className="cr-two-col-row">
        <CPQualityTable
          title={`Programs - ${activeCP}`}
          rows={CP_PROGRAMS[activeCP]}
          totalRecords={404}
          nameCol="program"
        />
        <CPQualityTable
          title={`Supervisors - ${activeCP}`}
          rows={CP_SUPERVISORS[activeCP]}
          totalRecords={513}
          nameCol="supervisors"
        />
      </div>

      {/* Providers table */}
      <CPProviderTable cpTab={activeCP} />
    </div>
  );
}

// ─── Document Data Tab ────────────────────────────────────────────────────────

interface DocByCheckpointRow {
  clientDocId: string; docDate: string; providerEmail: string; patientId: string;
  businessUnit: string; program: string; serviceCode: string; serviceName: string;
  supervisors: string; qualityScore: number;
  completeness: string; uniqueness: string; goldenThread: string;
  interventionUsed: string; clientResponse: string; progressMentioned: string;
  compliantPlan: string; treatmentPlan: string; document: string;
}

const DOC_DATA: DocByCheckpointRow[] = [
  {
    clientDocId: '394583', docDate: '2026-02-26', providerEmail: 'ldoussett@psygenics.org',
    patientId: '0000006653', businessUnit: 'N/A', program: 'Speech Therapy',
    serviceCode: '92507', serviceName: 'SPEECH/HEARING THERAPY',
    supervisors: 'Sharon Newson-Dunn', qualityScore: 100.00,
    completeness: 'yes', uniqueness: 'yes', goldenThread: 'yes', interventionUsed: 'yes',
    clientResponse: 'yes', progressMentioned: 'yes', compliantPlan: 'yes',
    treatmentPlan: "Consumer Abilities: Francisco is able to speak Spanish with his family but very little. Francisco reads and writes at school. Francisco is able to navigate his school on his own. Francisco uses the restroom independently. Consumer Needs: Francisco needs to work on increasing his fine motor skills and communication skills. Consumer Preferences: Francisco enjoys riding his bike, books, letters, numbers, colors, shapes, jumping on the trampoline, being outside, and going to water parks. Consumer Strengths: Mom reports Francisco's strengths include not being aggressive towards others and has a good support system.",
    document: "diagnoses:['diagnosis_code': 'F84.0', 'diagnosis_code_name': 'Autism spectrum disorder'],document_subtype:Progress Note,has_significant_health_concerns:N,is_consumer_satisfied:Y,note_field_consumer_satisfaction:yes,note_field_health_focus_of Francisco conducted ST session focusing on free play, with client led activities such as Marble Run and reading Pete the Cat Goes Sc...\\r\\nObjectives:\\r\\n- Francisco will answer wh- questions (i.e., WHEN, WHERE, and WHO) in play, conversation, and/or therapy acti... accuracy given minimal cues.\\r\\nIND 22%. with verbal binary choices accuracy increased to 68%\\r\\n\\r\\nFrancisco continues language difficulties and benefits from continued skilled ST services.",
  },
  {
    clientDocId: '394590', docDate: '2026-03-01', providerEmail: 'jsmith@brightpath.org',
    patientId: '0000007821', businessUnit: 'N/A', program: 'Outpatient MH',
    serviceCode: '90837', serviceName: 'PSYCHOTHERAPY 60 MIN',
    supervisors: 'HEIDI BORDELON', qualityScore: 87.50,
    completeness: 'yes', uniqueness: 'yes', goldenThread: 'no', interventionUsed: 'yes',
    clientResponse: 'yes', progressMentioned: 'yes', compliantPlan: 'no',
    treatmentPlan: 'Client presented with elevated anxiety symptoms. Discussed cognitive restructuring techniques. Client demonstrated understanding of thought challenging. Homework assigned: thought record for next session.',
    document: "session_type:individual,presenting_concerns:anxiety,mood_rating:6/10,interventions_used:CBT cognitive restructuring,client_response:engaged and cooperative,progress:incremental improvement noted,plan:continue weekly sessions",
  },
  {
    clientDocId: '394601', docDate: '2026-03-03', providerEmail: 'mgarcia@valleycare.org',
    patientId: '0000009134', businessUnit: 'CCBHC', program: 'Crisis Services',
    serviceCode: '90839', serviceName: 'PSYCHOTHERAPY CRISIS 60 MIN',
    supervisors: 'JASMINE PORTER', qualityScore: 95.00,
    completeness: 'yes', uniqueness: 'yes', goldenThread: 'yes', interventionUsed: 'yes',
    clientResponse: 'yes', progressMentioned: 'no', compliantPlan: 'yes',
    treatmentPlan: 'Crisis intervention provided. Safety plan reviewed and updated. Client agreed to contact crisis line if symptoms escalate. Family notified per consent.',
    document: "crisis_level:moderate,safety_plan_updated:yes,hospitalization:no,family_contact:yes,follow_up_scheduled:yes,next_appointment:2026-03-05",
  },
  {
    clientDocId: '394618', docDate: '2026-03-05', providerEmail: 'k.chen@eastsidewellness.com',
    patientId: '0000011205', businessUnit: 'N/A', program: 'Residential',
    serviceCode: '99213', serviceName: 'OFFICE/OUTPATIENT VISIT EST',
    supervisors: 'Tina Walsh', qualityScore: 92.30,
    completeness: 'yes', uniqueness: 'yes', goldenThread: 'yes', interventionUsed: 'no',
    clientResponse: 'yes', progressMentioned: 'yes', compliantPlan: 'yes',
    treatmentPlan: 'Medication management review. Client reports improved sleep with current regimen. Side effects minimal. Continue current medications with follow-up in 30 days.',
    document: "medication_review:completed,sleep_quality:improved,side_effects:none reported,adherence:high,next_review:2026-04-05",
  },
  {
    clientDocId: '394629', docDate: '2026-03-08', providerEmail: 'p.nguyen@valleycare.org',
    patientId: '0000013780', businessUnit: 'N/A', program: 'Peer Support',
    serviceCode: 'H0038', serviceName: 'SELF-HELP/PEER SERVICES',
    supervisors: 'N/A', qualityScore: 78.60,
    completeness: 'yes', uniqueness: 'no', goldenThread: 'yes', interventionUsed: 'yes',
    clientResponse: 'no', progressMentioned: 'yes', compliantPlan: 'yes',
    treatmentPlan: 'Peer support session focused on community integration. Discussed employment goals and housing stability. Provided resource list for local job training programs.',
    document: "peer_session_type:community_integration,goals_discussed:employment,housing,resources_provided:yes,client_engagement:moderate",
  },
];

function DocumentDataTab() {
  const [search, setSearch]   = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage]       = useState(1);
  const TOTAL_PAGES           = 5000;
  const TOTAL_RECORDS         = 50000;
  const filters               = useFilters();

  const filtered = DOC_DATA
    .filter(r => matchesDocFilters(r, filters))
    .filter(r =>
      r.clientDocId.includes(search) ||
      r.providerEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.includes(search) ||
      r.serviceName.toLowerCase().includes(search.toLowerCase())
    );

  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  const buildPages = (): (number | '…')[] =>
    [1, 2, 3, 4, 5, 6, 7, '…', TOTAL_PAGES];

  return (
    <div className="cr-chart-card">
      <div className="cr-card-header">
        <p className="cr-chart-card__title">Documents by Checkpoint (50k records limit)</p>
        <CardIcons />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span>Show</span>
          <input type="number" className="cr-perpage-input" value={perPage} min={1}
            onChange={e => { setPerPage(Number(e.target.value) || 10); setPage(1); }} />
          <span>entries per page</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span>Search</span>
          <input className="cr-search-input" style={{ width: 280 }}
            placeholder={`${TOTAL_RECORDS.toLocaleString()} records...`}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="cr-table" style={{ minWidth: 2200, tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 100 }} />{/* client document ID */}
            <col style={{ width: 110 }} />{/* document date */}
            <col style={{ width: 200 }} />{/* provider email */}
            <col style={{ width: 110 }} />{/* patient ID */}
            <col style={{ width: 100 }} />{/* business unit */}
            <col style={{ width: 140 }} />{/* program */}
            <col style={{ width: 100 }} />{/* service code */}
            <col style={{ width: 180 }} />{/* service name */}
            <col style={{ width: 150 }} />{/* supervisors */}
            <col style={{ width: 90 }}  />{/* quality score */}
            <col style={{ width: 120 }} />{/* completeness */}
            <col style={{ width: 130 }} />{/* uniqueness */}
            <col style={{ width: 100 }} />{/* golden thread */}
            <col style={{ width: 120 }} />{/* intervention used */}
            <col style={{ width: 140 }} />{/* client response */}
            <col style={{ width: 130 }} />{/* progress mentioned */}
            <col style={{ width: 110 }} />{/* compliant plan */}
            <col style={{ width: 260 }} />{/* treatment plan */}
            <col style={{ width: 320 }} />{/* document */}
          </colgroup>
          <thead>
            <tr>
              <th>client document ID <span className="cr-sort-icon">⇅</span></th>
              <th>document date <span className="cr-sort-icon">⇅</span></th>
              <th>provider email <span className="cr-sort-icon">⇅</span></th>
              <th>patient ID <span className="cr-sort-icon">⇅</span></th>
              <th>business unit <span className="cr-sort-icon">⇅</span></th>
              <th>program <span className="cr-sort-icon">⇅</span></th>
              <th>service code <span className="cr-sort-icon">⇅</span></th>
              <th>service name <span className="cr-sort-icon">⇅</span></th>
              <th>supervisors <span className="cr-sort-icon">⇅</span></th>
              <th>quality score <span className="cr-sort-icon">⇅</span></th>
              <th>completeness (not empty notes) <span className="cr-sort-icon">⇅</span></th>
              <th>uniqueness - (not copy/paste) <span className="cr-sort-icon">⇅</span></th>
              <th>golden thread <span className="cr-sort-icon">⇅</span></th>
              <th>intervention used <span className="cr-sort-icon">⇅</span></th>
              <th>client response to intervention <span className="cr-sort-icon">⇅</span></th>
              <th>progress mentioned <span className="cr-sort-icon">⇅</span></th>
              <th>compliant plan <span className="cr-sort-icon">⇅</span></th>
              <th>treatment plan <span className="cr-sort-icon">⇅</span></th>
              <th>document <span className="cr-sort-icon">⇅</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 === 1 ? 'cr-table__row--alt' : ''}>
                <td>{r.clientDocId}</td>
                <td>{r.docDate}</td>
                <td style={{ wordBreak: 'break-all' }}>{r.providerEmail}</td>
                <td>{r.patientId}</td>
                <td style={{ color: r.businessUnit === 'N/A' ? '#9ca3af' : undefined }}>{r.businessUnit}</td>
                <td>{r.program}</td>
                <td>{r.serviceCode}</td>
                <td>{r.serviceName}</td>
                <td style={{ color: r.supervisors === 'N/A' ? '#9ca3af' : undefined }}>{r.supervisors}</td>
                <td>{r.qualityScore.toFixed(2)}</td>
                <td>{r.completeness}</td>
                <td>{r.uniqueness}</td>
                <td>{r.goldenThread}</td>
                <td>{r.interventionUsed}</td>
                <td>{r.clientResponse}</td>
                <td>{r.progressMentioned}</td>
                <td>{r.compliantPlan}</td>
                <td style={{ fontSize: 11, whiteSpace: 'normal', lineHeight: 1.4 }}>{r.treatmentPlan}</td>
                <td style={{ fontSize: 11, whiteSpace: 'normal', lineHeight: 1.4, wordBreak: 'break-word' }}>{r.document}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cr-pagination" style={{ marginTop: 12 }}>
        {buildPages().map((p, idx) =>
          p === '…'
            ? <span key={idx} className="cr-pagination__ellipsis">…</span>
            : <button key={idx}
                className={`cr-pagination__btn${page === p ? ' cr-pagination__btn--active' : ''}`}
                onClick={() => setPage(p as number)}>{p}</button>
        )}
      </div>
    </div>
  );
}

// ─── Definitions Tab ─────────────────────────────────────────────────────────

function DefinitionsTab() {
  return (
    <div className="cr-chart-card cr-definitions">
      <h2 className="cr-def__h1">Checkpoints &amp; Criteria Definitions</h2>
      <p className="cr-def__intro">
        Our compliance analysis is divided into <strong>7 Eleos-generated checkpoints</strong>, each with its own criteria and logic. Every document is evaluated against every checkpoint and its associated criteria. Checkpoints and criteria are evaluated by AI models trained on clinically tagged datasets and guided by standards defined by our compliance experts.
      </p>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Completeness (Non Empty) – Critical Checkpoint</h3>
        <p className="cr-def__body">To pass the <strong>Completeness</strong> checkpoint, the document must satisfy the following criterion:</p>
        <ul className="cr-def__list">
          <li>The content of the entire document contains <strong>10 or more words</strong>.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Uniqueness (Non Copy/Paste) – Critical Checkpoint</h3>
        <p className="cr-def__body">To pass the <strong>Uniqueness</strong> checkpoint, the document must satisfy the following criterion:</p>
        <ul className="cr-def__list">
          <li>The content of the entire document is <strong>less than 85% similar</strong> to a previous document written by the same provider.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Progress Mentioned</h3>
        <p className="cr-def__body">To pass the <strong>Progress Mentioned</strong> checkpoint, the document must satisfy the following criterion:</p>
        <ul className="cr-def__list">
          <li>The content of the document includes a statement reflecting <strong>progress, lack of progress, or no change in progress</strong> in treatment.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Golden Thread</h3>
        <p className="cr-def__body">To pass the <strong>Golden Thread</strong> checkpoint, the document must satisfy <strong>at least one</strong> of the following criteria:</p>
        <ul className="cr-def__list">
          <li><strong>Services Match:</strong> The service performed in the document matches the services prescribed in the active treatment plan for that client.</li>
          <li><strong>Goal/Objective Match:</strong> The content of the document reflects the goals and objectives of the active treatment plan for that client.</li>
          <li><strong>Clinical Problem Alignment:</strong> The clinical problem documented in the note is aligned with the clinical problems documented in the active treatment plan for that client.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Intervention Used</h3>
        <p className="cr-def__body">To pass the <strong>Intervention Used</strong> checkpoint, the document must satisfy <strong>all three</strong> of the following criteria:</p>
        <ul className="cr-def__list">
          <li><strong>Action-Oriented:</strong> The document includes an intervention indicating a clinical action performed during the session.</li>
          <li><strong>Scope-Aligned:</strong> The document includes an intervention that is aligned with the scope of service (based on the service code associated with the document).</li>
          <li><strong>Relates to Presenting Need:</strong> The document includes an intervention that relates to the presenting need reflected in the note.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Client Response to Intervention</h3>
        <p className="cr-def__body">To pass the <strong>Client Response to Intervention</strong> checkpoint, the document must satisfy the following criterion:</p>
        <ul className="cr-def__list">
          <li>The content of the document includes a statement describing the client's response to the intervention provided.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Compliant Plan</h3>
        <p className="cr-def__body">To pass the <strong>Compliant Plan</strong> checkpoint, the document must satisfy <strong>at least one</strong> of the following criteria:</p>
        <ul className="cr-def__list">
          <li><strong>Next Steps:</strong> The document includes a statement that the client has specific next steps in their treatment that they can perform between sessions.</li>
          <li><strong>Next Appointment:</strong> The document includes a statement that a next appointment has been scheduled or that there is a plan to schedule the next appointment.</li>
        </ul>
      </section>

      <hr className="cr-def__divider" />

      <section className="cr-def__section">
        <h3 className="cr-def__h2">Quality Score Definition</h3>
        <p className="cr-def__body">The Quality Score ranges from 0 to 100:</p>
        <p className="cr-def__body">If a note fails any critical checkpoint, the quality score is automatically <strong>0</strong>.</p>
        <p className="cr-def__body" style={{ marginBottom: 6 }}>Critical checkpoints:</p>
        <ul className="cr-def__list">
          <li>Completeness (Non-Empty)</li>
          <li>Uniqueness (Non Copy/Paste)</li>
        </ul>
        <p className="cr-def__body">If all critical checkpoints pass, the baseline quality score is <strong>60</strong>.</p>
        <p className="cr-def__body">The remaining 40 points are distributed across the 10 criteria within the 5 non-critical checkpoints. Each criterion is worth <strong>4 points</strong>.</p>
        <p className="cr-def__body">"N/A" results for checkpoints and criteria are treated as failed for the purposes of the quality score.</p>
        <p className="cr-def__body">You can view the quality scores for each document in both the "Documents by Checkpoint" and "Documents by Criteria" tables.</p>
        <p className="cr-def__body" style={{ marginTop: 16 }}>
          To view this information in a pdf, see the document here:{' '}
          <a className="cr-def__link" href="#" onClick={e => e.preventDefault()}>
            Eleos Compliance v2.0 Model Definitions
          </a>
        </p>
      </section>
    </div>
  );
}

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 32px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontSize: 14,
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {name}
      </div>
      Content for this tab is coming soon.
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS = ['Summary', 'Checkpoints', 'Document Data', 'Definitions'] as const;
type Tab = (typeof TABS)[number];

export function ComplianceReport() {
  const [activeTab, setActiveTab] = useState<Tab>('Summary');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });

  const filtersContextValue: FiltersContextValue = {
    applied: appliedFilters,
    applyFilters: (f) => setAppliedFilters(f),
    clearFilters: () => setAppliedFilters({ ...DEFAULT_FILTERS }),
  };

  // Derive filter options from data
  const filterOptions = {
    organizations: ORGANIZATION_OPTIONS,
    businessUnits: Array.from(new Set(DOC_DATA.map(r => r.businessUnit).filter(b => b !== 'N/A'))),
    programs: Array.from(new Set(PROVIDER_ANALYSIS_DATA.map(r => r.program).filter(p => p !== 'N/A'))),
    supervisors: Array.from(new Set(PROVIDER_ANALYSIS_DATA.map(r => r.supervisors).filter(s => s !== 'N/A'))),
    services: Array.from(new Set(DOC_DATA.map(r => r.serviceName))),
    providers: Array.from(new Set(PROVIDER_ANALYSIS_DATA.map(r => r.provider))),
  };

  return (
    <FiltersContext.Provider value={filtersContextValue}>
    <div className="compliance-report-shell">
      {/* Sidebar */}
      <FiltersSidebar
        collapsed={filtersCollapsed}
        onCollapse={() => setFiltersCollapsed(true)}
        filterOptions={filterOptions}
      />

      {/* Main */}
      <main className="compliance-report">
        {/* Page header */}
        <div className="compliance-report__page-header">
          <div className="compliance-report__header">
            <div className="compliance-report__header-left">
              {/* Star icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#f59e0b', flexShrink: 0 }}>
                <path
                  d="M8 1.5l1.8 3.6 4 .58-2.9 2.82.68 3.98L8 10.35l-3.58 1.93.68-3.98L2.2 5.68l4-.58L8 1.5z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="compliance-report__title">Eleos Compliance Dashboard</h1>
              <span className="compliance-report__badge">
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <circle cx="3.5" cy="3.5" r="3.5" fill="#16a34a" />
                </svg>
                Published
              </span>
              <span className="compliance-report__meta">Gabriel Krell Krell</span>
              <span className="compliance-report__meta">2 days ago</span>
            </div>
            <button className="compliance-report__edit-btn">Edit dashboard</button>
          </div>

          {/* Show filters expand button when sidebar collapsed */}
          {filtersCollapsed && (
            <button
              className="cr-filters-expand-btn"
              onClick={() => setFiltersCollapsed(false)}
              style={{ marginTop: 8 }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M5 2.5l4.5 4-4.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="1" y="1" width="1.5" height="11" rx="0.75" fill="currentColor" />
              </svg>
              Filters
            </button>
          )}

          {/* Tabs */}
          <div className="compliance-report__tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`compliance-report__tab${activeTab === tab ? ' compliance-report__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'Summary' && <SummaryTab />}
        {activeTab === 'Checkpoints' && <CheckpointsTab />}
        {activeTab === 'Document Data' && <DocumentDataTab />}
        {activeTab === 'Definitions' && <DefinitionsTab />}
      </main>
    </div>
    </FiltersContext.Provider>
  );
}
