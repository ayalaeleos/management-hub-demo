import { useState } from 'react';
import './LeadershipReport.css';
import {
  IMPACT_STATS,
  ADOPTION_STATS,
  ONBOARDING_DONUT,
  ONGOING_DONUT,
  WEEKLY_NOTES,
  PROGRAM_DATA,
  type ProgramRow,
} from '../../data/leadershipReport';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.?0+$/, '') + 'k';
  return String(n);
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ color = '#4caf50' }: { color?: string }) {
  const points = [1, 1.1, 1.05, 1.2, 1.15, 1.3, 1.25, 1.4, 1.35, 1.5];
  const w = 120, h = 32, pad = 2;
  const min = Math.min(...points), max = Math.max(...points);
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(v => h - pad - ((v - min) / (max - min + 0.001)) * (h - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const fillD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
    + ` L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <path d={fillD} fill={color} fillOpacity={0.15} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

interface DonutSlice { label: string; value: number; color: string }

function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const r = 54, cx = 70, cy = 70, strokeW = 22;
  const circumference = 2 * Math.PI * r;
  const sum = slices.reduce((a, s) => a + s.value, 0);
  let cumulativeDash = 0;

  return (
    <svg width={140} height={140} viewBox="0 0 140 140" className="lr-donut-svg">
      {slices.map((s, i) => {
        const dash = (s.value / sum) * circumference;
        const gap = circumference - dash;
        // rotate so first slice starts at top (−90°)
        const rotation = -90 + (cumulativeDash / circumference) * 360;
        cumulativeDash += dash;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" className="lr-donut-center-label">
        Total: {fmt(sum)}
      </text>
    </svg>
  );
}

// ─── Bar Charts ───────────────────────────────────────────────────────────────

function FullBarChart() {
  const data = WEEKLY_NOTES;
  const max = Math.max(...data.map(d => d.notes));
  const svgW = 600, svgH = 140;
  const barW = svgW / data.length;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="lr-bar-chart-svg" preserveAspectRatio="none" style={{ height: 160, width: '100%' }}>
      {data.map((d, i) => {
        const barH = Math.max((d.notes / max) * svgH, 1);
        return (
          <rect
            key={i}
            x={i * barW + 0.5}
            y={svgH - barH}
            width={Math.max(barW - 1, 1)}
            height={barH}
            fill="#26C6DA"
            rx={0.5}
          />
        );
      })}
    </svg>
  );
}

function MiniBarChart() {
  const data = WEEKLY_NOTES.filter((_, i) => i % 2 === 0).slice(0, 28);
  const max = Math.max(...data.map(d => d.notes));
  const svgW = 600, svgH = 120;
  const barW = svgW / data.length;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="lr-bar-chart-svg" preserveAspectRatio="none" style={{ height: 120, width: '100%' }}>
      {data.map((d, i) => {
        const barH = Math.max((d.notes / max) * svgH, 1);
        return (
          <rect
            key={i}
            x={i * barW + 0.5}
            y={svgH - barH}
            width={Math.max(barW - 1, 1)}
            height={barH}
            fill="#26C6DA"
            rx={0.5}
          />
        );
      })}
    </svg>
  );
}

// ─── Program Table ────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 10;

function ProgramTable({ rows }: { rows: ProgramRow[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
  const visible = rows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const pageNums: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) pageNums.push(i);

  return (
    <div className="lr-table-card">
      <div className="lr-table-card__header">
        <h3 className="lr-table-card__title">Program View</h3>
        <span className="lr-table-card__meta">{rows.length} records</span>
      </div>
      <table className="lr-table">
        <thead>
          <tr>
            <th>Program Name</th>
            <th>Activated Providers</th>
            <th>Generated Notes</th>
            <th>Rated Notes</th>
            <th>Avg Note Rating</th>
            <th>Hours Saved</th>
            <th>Avg Min Saved / Note</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => (
            <tr key={i}>
              <td>{row.program}</td>
              <td>{fmt(row.activatedProviders)}</td>
              <td>{fmt(row.generatedNotes)}</td>
              <td>{fmt(row.ratedNotes)}</td>
              <td>{row.averageNoteRating.toFixed(2)}</td>
              <td>{fmt(row.hoursSaved)}</td>
              <td>{row.avgMinutesSavedPerNote.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="lr-table-pagination">
          {pageNums.map((p) =>
            p === '…' ? (
              <span key="ellipsis" className="lr-table-pagination__btn">…</span>
            ) : (
              <button
                key={p}
                className={`lr-table-pagination__btn${page === p ? ' lr-table-pagination__btn--active' : ''}`}
                onClick={() => setPage(p as number)}
              >
                {p}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Filters Sidebar ─────────────────────────────────────────────────────────

const FILTER_GROUPS = [
  { label: 'Filter by Date', type: 'date', placeholder: 'No filter' },
  { label: 'Filter by Organization', type: 'select', placeholder: '250 options' },
  { label: 'Filter by Site Segmentation', type: 'select', placeholder: '1000 options' },
  { label: 'Filter by Site', type: 'select', placeholder: '267 options' },
  { label: 'Filter By Provider', type: 'select', placeholder: '1000 options' },
  { label: 'Filter by Profession', type: 'select', placeholder: '18 options' },
  { label: 'Filter by Supervisor', type: 'select', placeholder: '1000 options' },
  { label: 'Filter by Program Name', type: 'select', placeholder: '1000 options' },
];

function FiltersSidebar({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: () => void }) {
  return (
    <aside className={`lr-filters${collapsed ? ' lr-filters--collapsed' : ''}`}>
      <div className="lr-filters__inner">
        <div className="lr-filters__head">
          <h2 className="lr-filters__title">Filters</h2>
          <div className="lr-filters__head-icons">
            {/* Gear icon */}
            <button className="lr-filters__icon-btn" title="Filter settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            {/* Pipe + arrow collapse icon */}
            <button className="lr-filters__icon-btn" title="Collapse filters" onClick={onCollapse}>
              <svg width="18" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* pipe */}
                <line x1="21" y1="1" x2="21" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                {/* arrow left */}
                <line x1="1" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="7,2 1,8 7,14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {FILTER_GROUPS.map(g => (
          <div key={g.label} className="lr-filters__group">
            <span className="lr-filters__label">{g.label}</span>
            <div className={`lr-filters__input${g.type === 'select' ? ' lr-filters__input--select' : ''}`}>
              <span style={{ flex: 1 }}>{g.placeholder}</span>
              {g.type === 'date' ? (
                <svg className="lr-filters__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ) : (
                <svg className="lr-filters__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
            </div>
          </div>
        ))}

        <div className="lr-filters__group">
          <span className="lr-filters__label lr-filters__label--muted">Excluded Users</span>
        </div>

        <div className="lr-filters__footer">
          <button className="lr-filters__apply-btn">Apply filters</button>
          <button className="lr-filters__clear-btn" style={{ textAlign: 'center', width: '100%' }}>Clear all</button>
        </div>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Provider View', 'Voice of the Provider', 'Raw Data'];

export function LeadershipReport() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  return (
    <div className="leadership-report-shell">
      <FiltersSidebar collapsed={filtersCollapsed} onCollapse={() => setFiltersCollapsed(true)} />
      <div className="leadership-report" style={{ position: 'relative' }}>
        {filtersCollapsed && (
          <button
            className="lr-filters-expand-btn"
            title="Show filters"
            onClick={() => setFiltersCollapsed(false)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="17" y2="12"/>
              <polyline points="11 6 17 12 11 18"/>
              <line x1="3" y1="4" x2="3" y2="20"/>
            </svg>
            Filters
          </button>
        )}
      {/* Sticky header: title + tabs */}
      <div className="leadership-report__page-header">
        <div className="leadership-report__header">
          <h1 className="leadership-report__title">Leadership Report</h1>
        </div>
        <div className="leadership-report__tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`leadership-report__tab${activeTab === tab ? ' leadership-report__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Impact Overview ── */}
      <div className="lr-section">
        <h2 className="lr-section__title">Impact Overview</h2>
        <div className="lr-stats-row">
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Notes Generated</span>
            <span className="lr-stat-card__value">{fmt(IMPACT_STATS.notesGenerated)}</span>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Hours Saved</span>
            <span className="lr-stat-card__value">{fmt(IMPACT_STATS.hoursSaved)}</span>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Time Saved per Note (Minutes)</span>
            <span className="lr-stat-card__value">{IMPACT_STATS.timeSavedPerNote}</span>
            <div className="lr-stat-card__sparkline"><Sparkline color="#4caf50" /></div>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Average Note Rating (Out of 5)</span>
            <span className="lr-stat-card__value">{IMPACT_STATS.averageNoteRating}</span>
            <div className="lr-stat-card__sparkline"><Sparkline color="#4caf50" /></div>
          </div>
        </div>
      </div>

      {/* ── Adoption & Engagement ── */}
      <div className="lr-section">
        <h2 className="lr-section__title">Adoption &amp; Engagement</h2>

        {/* Stat cards */}
        <div className="lr-stats-row">
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Licenses Issued</span>
            <span className="lr-stat-card__value">{fmt(ADOPTION_STATS.licensesIssued)}</span>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Configured Providers</span>
            <span className="lr-stat-card__value">{fmt(ADOPTION_STATS.configuredProviders)}</span>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Activated Providers</span>
            <span className="lr-stat-card__value">{fmt(ADOPTION_STATS.activatedProviders)}</span>
            <div className="lr-stat-card__sparkline"><Sparkline color="#4caf50" /></div>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">License Utilization</span>
            <span className="lr-stat-card__value">{ADOPTION_STATS.licenseUtilization}%</span>
          </div>
        </div>

        {/* Onboarding row: Awaiting stat | Donut | Legend */}
        <div className="lr-charts-row">
          <div className="lr-chart-card">
            <p className="lr-chart-card__title">Awaiting First Use</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, paddingTop: 16 }}>
              <span className="lr-big-stat">{fmt(ADOPTION_STATS.awaitingFirstUse)}</span>
            </div>
          </div>

          <div className="lr-chart-card">
            <p className="lr-chart-card__title">Onboarding Providers – Created First Note In Past 30 Days</p>
            <div className="lr-donut-wrapper">
              <DonutChart slices={ONBOARDING_DONUT} />
            </div>
            <div className="lr-legend">
              {ONBOARDING_DONUT.map(s => (
                <div key={s.label} className="lr-legend-item">
                  <div className="lr-legend-dot" style={{ background: s.color }} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lr-chart-card">
            <p className="lr-chart-card__title">Onboarding Period – Up to 30 Days After First Note</p>
            <div className="lr-legend" style={{ gap: 10 }}>
              <div className="lr-legend-item" style={{ alignItems: 'flex-start' }}>
                <div className="lr-legend-dot" style={{ background: '#4DB6AC', marginTop: 3 }} />
                <span><strong>Onboarding – First Week</strong> – Providers in their first week after activation.</span>
              </div>
              <div className="lr-legend-item" style={{ alignItems: 'flex-start' }}>
                <div className="lr-legend-dot" style={{ background: '#26C6DA', marginTop: 3 }} />
                <span><strong>Successful Onboarding</strong> – Providers less than 30 days after activation, who created 5 notes or more in their first week. These providers are more likely to continue using Eleos consistently.</span>
              </div>
              <div className="lr-legend-item" style={{ alignItems: 'flex-start' }}>
                <div className="lr-legend-dot" style={{ background: '#283593', marginTop: 3 }} />
                <span><strong>Onboarding – Slow Start</strong> – Providers less than 30 days after activation, who created fewer than 5 notes in their first week.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing row: spacer | Donut | Legend */}
        <div className="lr-charts-row">
          <div style={{ visibility: 'hidden' }} className="lr-chart-card" aria-hidden="true" />

          <div className="lr-chart-card">
            <p className="lr-chart-card__title">Providers in Ongoing Usage – More Than 30 Days After Their First Note</p>
            <div className="lr-donut-wrapper">
              <DonutChart slices={ONGOING_DONUT} />
            </div>
            <div className="lr-legend">
              {ONGOING_DONUT.map(s => (
                <div key={s.label} className="lr-legend-item">
                  <div className="lr-legend-dot" style={{ background: s.color }} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lr-chart-card">
            <p className="lr-chart-card__title">Ongoing Usage – Over 30 Days After First Note</p>
            <div className="lr-legend" style={{ gap: 10 }}>
              {[
                { color: '#283593', label: 'Power Provider', desc: 'Providers who created 60 notes or more in the past 30 days.' },
                { color: '#26C6DA', label: 'Active', desc: 'Providers who created 1–59 notes in the past 30 days.' },
                { color: '#4DB6AC', label: 'Low Engagement', desc: 'Providers who created no notes in the past 30 days.' },
                { color: '#EF6C00', label: 'Dropped Off', desc: 'Providers who created no notes in the past 90 days.' },
                { color: '#78909C', label: 'Re-Engaged', desc: 'Providers who previously dropped off but resumed activity in the past 30 days.' },
              ].map(s => (
                <div key={s.label} className="lr-legend-item" style={{ alignItems: 'flex-start' }}>
                  <div className="lr-legend-dot" style={{ background: s.color, marginTop: 3 }} />
                  <span><strong>{s.label}</strong> – {s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Notes Generated by Week ── */}
      <div className="lr-bar-card">
        <h3 className="lr-bar-card__title">Notes Generated by Week</h3>
        <div className="lr-bar-legend">
          <div className="lr-bar-legend-item">
            <div className="lr-bar-legend-swatch" style={{ background: '#26C6DA' }} />
            <span>Notes</span>
          </div>
        </div>
        <FullBarChart />
      </div>

      {/* ── Activity Types + Notes Per Provider ── */}
      <div className="lr-charts-row-2">
        <div className="lr-bar-card">
          <h3 className="lr-bar-card__title">Activity Types by Week</h3>
          <div className="lr-bar-legend">
            {[
              { label: 'Individual', color: '#26C6DA' },
              { label: 'Other', color: '#283593' },
              { label: 'Case Management', color: '#4DB6AC' },
              { label: 'Peer Support', color: '#EF6C00' },
              { label: 'Psychiatry', color: '#607D8B' },
            ].map(s => (
              <div key={s.label} className="lr-bar-legend-item">
                <div className="lr-bar-legend-swatch" style={{ background: s.color }} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <MiniBarChart />
        </div>

        <div className="lr-bar-card">
          <h3 className="lr-bar-card__title">Notes Per Provider by Week</h3>
          <div className="lr-bar-legend">
            <div className="lr-bar-legend-item">
              <div className="lr-bar-legend-swatch" style={{ background: '#26C6DA' }} />
              <span>Average Notes Per Provider</span>
            </div>
          </div>
          <MiniBarChart />
        </div>
      </div>

      {/* ── Program Table ── */}
      <ProgramTable rows={PROGRAM_DATA} />
    </div>
    </div>
  );
}
