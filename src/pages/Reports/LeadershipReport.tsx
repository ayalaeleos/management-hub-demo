import { useState, useRef } from 'react';
import './LeadershipReport.css';
import {
  IMPACT_STATS,
  ADOPTION_STATS,
  ONBOARDING_DONUT,
  ONGOING_DONUT,
  WEEKLY_NOTES,
  ACTIVITY_TYPE_DATA,
  NOTES_PER_PROVIDER,
  PROGRAM_DATA,
  TOP_TEN_PROVIDERS,
  POWER_PROVIDERS,
  AWAITING_FIRST_USE,
  ONBOARDING_SLOW_START,
  LOW_ENGAGEMENT,
  DROPPED_OFF,
  PROVIDER_FEEDBACK,
  type FeedbackRow,
  NOTE_DATA,
  type NoteDataRow,
  type ProgramRow,
  PROVIDER_DATA,
  type ProviderRow,
  type PowerProviderRow,
} from '../../data/leadershipReport';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 2): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(decimals).replace(/\.?0+$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(decimals).replace(/\.?0+$/, '') + 'k';
  return String(n);
}

function CardIcons() {
  return (
    <div className="lr-card-icons">
      <span className="lr-card-icon" title="Filter">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <span className="lr-card-icon-badge">1</span>
      </span>
      <span className="lr-card-icon" title="Info">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 5.5v4M6.5 4h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </span>
      <span className="lr-card-icon" title="More">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="10.5" r="1" fill="currentColor"/></svg>
      </span>
    </div>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

const SPARKLINE_WEEKS = [
  { week: '2025-09-29 — 2025-10-05', value: 9.4 },
  { week: '2025-10-06 — 2025-10-12', value: 9.6 },
  { week: '2025-10-13 — 2025-10-19', value: 9.7 },
  { week: '2025-10-20 — 2025-10-26', value: 9.8 },
  { week: '2025-10-27 — 2025-11-02', value: 9.99 },
  { week: '2025-11-03 — 2025-11-09', value: 10.1 },
  { week: '2025-11-10 — 2025-11-16', value: 10.0 },
  { week: '2025-11-17 — 2025-11-23', value: 10.2 },
  { week: '2025-11-24 — 2025-11-30', value: 10.15 },
  { week: '2025-12-01 — 2025-12-07', value: 10.1 },
];

const SPARKLINE_RATING_WEEKS = [
  { week: '2025-09-29 — 2025-10-05', value: 4.20 },
  { week: '2025-10-06 — 2025-10-12', value: 4.25 },
  { week: '2025-10-13 — 2025-10-19', value: 4.28 },
  { week: '2025-10-20 — 2025-10-26', value: 4.30 },
  { week: '2025-10-27 — 2025-11-02', value: 4.31 },
  { week: '2025-11-03 — 2025-11-09', value: 4.33 },
  { week: '2025-11-10 — 2025-11-16', value: 4.35 },
  { week: '2025-11-17 — 2025-11-23', value: 4.37 },
  { week: '2025-11-24 — 2025-11-30', value: 4.38 },
  { week: '2025-12-01 — 2025-12-07', value: 4.39 },
];

const VOTP_RATING_WEEKS = [
  { week: '2025-10-06 — 2025-10-12', value: 4.22 },
  { week: '2025-10-13 — 2025-10-19', value: 4.24 },
  { week: '2025-10-20 — 2025-10-26', value: 4.23 },
  { week: '2025-10-27 — 2025-11-02', value: 4.26 },
  { week: '2025-11-03 — 2025-11-09', value: 4.28 },
  { week: '2025-11-10 — 2025-11-16', value: 4.27 },
  { week: '2025-11-17 — 2025-11-23', value: 4.30 },
  { week: '2025-11-24 — 2025-11-30', value: 4.32 },
  { week: '2025-12-01 — 2025-12-07', value: 4.31 },
  { week: '2025-12-08 — 2025-12-14', value: 4.33 },
  { week: '2025-12-15 — 2025-12-21', value: 4.34 },
  { week: '2025-12-22 — 2025-12-28', value: 4.35 },
  { week: '2025-12-29 — 2026-01-04', value: 4.36 },
  { week: '2026-01-05 — 2026-01-11', value: 4.38 },
  { week: '2026-01-12 — 2026-01-18', value: 4.45 },
  { week: '2026-01-19 — 2026-01-25', value: 4.40 },
  { week: '2026-01-26 — 2026-02-01', value: 4.41 },
  { week: '2026-02-02 — 2026-02-08', value: 4.42 },
  { week: '2026-02-09 — 2026-02-15', value: 4.39 },
  { week: '2026-02-16 — 2026-02-22', value: 4.39 },
];

const VOTP_FEEDBACK_WEEKS = [
  { week: '2025-10-06 — 2025-10-12', value: 18 },
  { week: '2025-10-13 — 2025-10-19', value: 22 },
  { week: '2025-10-20 — 2025-10-26', value: 19 },
  { week: '2025-10-27 — 2025-11-02', value: 25 },
  { week: '2025-11-03 — 2025-11-09', value: 30 },
  { week: '2025-11-10 — 2025-11-16', value: 28 },
  { week: '2025-11-17 — 2025-11-23', value: 35 },
  { week: '2025-11-24 — 2025-11-30', value: 32 },
  { week: '2025-12-01 — 2025-12-07', value: 40 },
  { week: '2025-12-08 — 2025-12-14', value: 38 },
  { week: '2025-12-15 — 2025-12-21', value: 45 },
  { week: '2025-12-22 — 2025-12-28', value: 42 },
  { week: '2025-12-29 — 2026-01-04', value: 50 },
  { week: '2026-01-05 — 2026-01-11', value: 55 },
  { week: '2026-01-12 — 2026-01-18', value: 60 },
  { week: '2026-01-19 — 2026-01-25', value: 65 },
  { week: '2026-01-26 — 2026-02-01', value: 70 },
  { week: '2026-02-02 — 2026-02-08', value: 75 },
  { week: '2026-02-09 — 2026-02-15', value: 72 },
  { week: '2026-02-16 — 2026-02-22', value: 78 },
];

function Sparkline({
  color = '#4caf50',
  data = SPARKLINE_WEEKS,
  label = 'Average Time Saved',
}: {
  color?: string;
  data?: { week: string; value: number }[];
  label?: string;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 160, H = 60, padX = 4, padY = 8;

  const values = data.map(d => d.value);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;

  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * (W - padX * 2));
  const ys = values.map(v => H - padY - ((v - min) / range) * (H - padY * 2));

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fillPath = linePath + ` L${xs[xs.length - 1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;
  const hx = hoverIdx !== null ? xs[hoverIdx] : 0;
  const hy = hoverIdx !== null ? ys[hoverIdx] : 0;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let minDist = Infinity;
    xs.forEach((x, i) => { const d = Math.abs(x - mx); if (d < minDist) { minDist = d; closest = i; } });
    setHoverIdx(closest);
  };

  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      {hovered && (
        <div className="lr-sparkline-tooltip" style={{ left: `${Math.min(Math.max((hx / W) * 100, 0), 55)}%` }}>
          <div className="lr-sparkline-tooltip__date">{hovered.week}</div>
          <div className="lr-sparkline-tooltip__row">
            <span>{label}</span>
            <span style={{ marginLeft: 12, fontWeight: 600 }}>{hovered.value.toFixed(2)}</span>
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        width="100%" height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible', display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={`sparkGrad-${label.replace(/[^a-zA-Z0-9]/g,'')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#sparkGrad-${label.replace(/[^a-zA-Z0-9]/g,'')})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {hoverIdx !== null && (
          <>
            <line x1={hx} y1={0} x2={hx} y2={H} stroke="#2d4ccd" strokeWidth={1} strokeDasharray="3,3" />
            <circle cx={hx} cy={hy} r={5} fill={color} stroke="white" strokeWidth={2} />
          </>
        )}
        {/* invisible hover areas */}
        {xs.map((x, i) => (
          <rect key={i} x={x - (W / data.length / 2)} y={0} width={W / data.length} height={H}
            fill="transparent" onMouseEnter={() => setHoverIdx(i)} />
        ))}
      </svg>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

interface DonutSlice { label: string; value: number; color: string }

function DonutChart({ slices, withLabels = false }: { slices: DonutSlice[]; withLabels?: boolean }) {
  const r = 54, cx = 100, cy = 100, strokeW = 22;
  const circumference = 2 * Math.PI * r;
  const sum = slices.reduce((a, s) => a + s.value, 0);
  let cumulative = 0;

  // label anchor positions (elbow lines from midpoint of each arc)
  const labelData = slices.map((s) => {
    const startAngle = -90 + (cumulative / sum) * 360;
    const sliceAngle = (s.value / sum) * 360;
    const midAngle = startAngle + sliceAngle / 2;
    cumulative += s.value;
    const rad = (midAngle * Math.PI) / 180;
    const labelR = r + strokeW / 2 + 14; // end of arc outward
    const x1 = cx + labelR * Math.cos(rad);
    const y1 = cy + labelR * Math.sin(rad);
    const extR = labelR + 18;
    const x2 = cx + extR * Math.cos(rad);
    const y2 = cy + extR * Math.sin(rad);
    const isRight = x2 > cx;
    const x3 = isRight ? x2 + 22 : x2 - 22;
    const y3 = y2;
    return { ...s, x1, y1, x2, y2, x3, y3, isRight, midAngle };
  });

  cumulative = 0;

  return (
    <svg width={200} height={200} viewBox="0 0 200 200" className="lr-donut-svg" style={withLabels ? { overflow: 'visible' } : undefined}>
      {slices.map((s, i) => {
        const dash = (s.value / sum) * circumference;
        const gap = circumference - dash;
        const rotation = -90 + (cumulative / circumference) * 360;
        cumulative += dash;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" className="lr-donut-center-label">Total:</text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="lr-donut-center-label">{fmt(sum, 1)}</text>

      {withLabels && labelData.map((d, i) => (
        <g key={i}>
          <polyline
            points={`${d.x1},${d.y1} ${d.x2},${d.y2} ${d.x3},${d.y3}`}
            fill="none" stroke={d.color} strokeWidth={1} opacity={0.7}
          />
          <text
            x={d.isRight ? d.x3 + 4 : d.x3 - 4}
            y={d.y3 + 4}
            textAnchor={d.isRight ? 'start' : 'end'}
            fontSize={9.5}
            fill="#444"
            fontFamily="Poppins, sans-serif"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Bar Charts ───────────────────────────────────────────────────────────────

function FullBarChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const data = WEEKLY_NOTES;
  const svgW = 600, svgH = 130;
  const barW = svgW / data.length;
  const Y_MAX = 1500;
  const yTicks = [300, 600, 900, 1200, 1500];
  const toY = (v: number) => svgH - (v / Y_MAX) * svgH;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * svgW;
    const idx = Math.floor(x / barW);
    setHoveredIndex(idx >= 0 && idx < data.length ? idx : null);
  };

  // Derive X-axis tick positions: show label when month name changes
  const xTicks: { i: number; label: string }[] = [];
  data.forEach((d, i) => {
    if (i === 0 || d.week !== data[i - 1].week || d.week.includes("'")) {
      xTicks.push({ i, label: d.week });
    }
  });
  // Keep only every ~8 weeks to avoid crowding
  const sparseX = xTicks.filter((_, ti) => ti % 2 === 0);

  // Tooltip position as percentage of chart width
  const tooltipPct = hoveredIndex !== null ? ((hoveredIndex + 0.5) / data.length) * 100 : null;

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Y-axis labels */}
      <div style={{ width: 44, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 24, paddingTop: 0, alignItems: 'flex-end' }}>
        {[...yTicks].reverse().map(t => (
          <span key={t} style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8, lineHeight: 1 }}>{fmt(t, 0)}</span>
        ))}
        <span style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8 }}></span>
      </div>

      {/* Chart + x-axis */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          style={{ height: 180, width: '100%', display: 'block', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Gridlines */}
          {yTicks.map(t => (
            <line key={t} x1={0} y1={toY(t)} x2={svgW} y2={toY(t)} stroke="#e5e7eb" strokeWidth={0.6} />
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const barH = Math.max((d.notes / Y_MAX) * svgH, 1);
            return (
              <rect
                key={i}
                x={i * barW + 0.5}
                y={svgH - barH}
                width={Math.max(barW - 1, 1)}
                height={barH}
                fill={hoveredIndex === i ? '#1aa8c0' : '#26C6DA'}
                rx={0.5}
              />
            );
          })}

          {/* Hover dashed vertical line */}
          {hoveredIndex !== null && (
            <line
              x1={(hoveredIndex + 0.5) * barW}
              y1={0}
              x2={(hoveredIndex + 0.5) * barW}
              y2={svgH}
              stroke="#26C6DA"
              strokeWidth={0.8}
              strokeDasharray="3 2"
              opacity={0.8}
            />
          )}

          {/* Value labels above bars */}
          {data.map((d, i) => {
            const barH = (d.notes / Y_MAX) * svgH;
            return (
              <text
                key={i}
                x={(i + 0.5) * barW}
                y={svgH - barH - 2}
                textAnchor="middle"
                fontSize={5}
                fill="#6b7280"
                fontFamily="Poppins, sans-serif"
              >
                {fmt(d.notes, 0)}
              </text>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div style={{ position: 'relative', height: 20 }}>
          {sparseX.map(({ i, label }) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${((i + 0.5) / data.length) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: 11,
                whiteSpace: 'nowrap',
                fontWeight: label.includes("'") || label.includes('26') ? 600 : 400,
                color: label.includes("'") || label.includes('26') ? '#374151' : '#9ca3af',
              } as React.CSSProperties}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredIndex !== null && tooltipPct !== null && (
          <div
            className="lr-chart-tooltip"
            style={{
              left: `clamp(0px, calc(${tooltipPct}% - 60px), calc(100% - 130px))`,
              top: 20,
            }}
          >
            <div className="lr-chart-tooltip__date">{data[hoveredIndex].week}</div>
            <div className="lr-chart-tooltip__row">
              <span className="lr-chart-tooltip__dot" style={{ background: '#26C6DA' }} />
              <span>Notes</span>
              <strong>{fmt(data[hoveredIndex].notes, 0)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ACTIVITY_COLORS = [
  { key: 'individual' as const,     color: '#26C6DA', label: 'Individual' },
  { key: 'other' as const,          color: '#283593', label: 'Other' },
  { key: 'caseManagement' as const, color: '#4DB6AC', label: 'Case Management' },
  { key: 'peerSupport' as const,    color: '#EF6C00', label: 'Peer Support' },
  { key: 'playTherapy' as const,    color: '#AB47BC', label: 'Play Therapy' },
  { key: 'armhs' as const,          color: '#66BB6A', label: 'ARMHS' },
  { key: 'earlyChildhood' as const, color: '#FFA726', label: 'Early Childhood' },
  { key: 'psychiatry' as const,     color: '#607D8B', label: 'Psychiatry' },
];

function ActivityTypesChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const data = ACTIVITY_TYPE_DATA;
  const svgW = 600, svgH = 130;
  const barW = svgW / data.length;
  const Y_MAX = 1500;
  const yTicks = [300, 600, 900, 1200, 1500];
  const toY = (v: number) => svgH - (v / Y_MAX) * svgH;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * svgW;
    const idx = Math.floor(x / barW);
    setHoveredIndex(idx >= 0 && idx < data.length ? idx : null);
  };

  // X-axis ticks (sparse)
  const xTicks: { i: number; label: string }[] = [];
  data.forEach((d, i) => {
    if (i === 0 || d.week !== data[i - 1].week || d.week.includes("'")) {
      xTicks.push({ i, label: d.week });
    }
  });
  const sparseX = xTicks.filter((_, ti) => ti % 2 === 0);

  const tooltipPct = hoveredIndex !== null ? ((hoveredIndex + 0.5) / data.length) * 100 : null;

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Y-axis labels */}
      <div style={{ width: 44, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 24, alignItems: 'flex-end' }}>
        {[...yTicks].reverse().map(t => (
          <span key={t} style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8, lineHeight: 1 }}>{fmt(t, 0)}</span>
        ))}
        <span style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8 }}></span>
      </div>

      {/* Chart + x-axis */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          style={{ height: 180, width: '100%', display: 'block', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Gridlines */}
          {yTicks.map(t => (
            <line key={t} x1={0} y1={toY(t)} x2={svgW} y2={toY(t)} stroke="#e5e7eb" strokeWidth={0.6} />
          ))}

          {/* Stacked bars */}
          {data.map((d, i) => {
            const total = d.individual + d.other + d.caseManagement + d.peerSupport + d.playTherapy + d.armhs + d.earlyChildhood + d.psychiatry;
            const segments = [
              { value: d.individual,     color: '#26C6DA' },
              { value: d.other,          color: '#283593' },
              { value: d.caseManagement, color: '#4DB6AC' },
              { value: d.peerSupport,    color: '#EF6C00' },
              { value: d.playTherapy,    color: '#AB47BC' },
              { value: d.armhs,          color: '#66BB6A' },
              { value: d.earlyChildhood, color: '#FFA726' },
              { value: d.psychiatry,     color: '#607D8B' },
            ];
            let cumY = svgH; // start from bottom
            return (
              <g key={i} opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.7 : 1}>
                {segments.map((seg, si) => {
                  const segH = Math.max((seg.value / Y_MAX) * svgH, 0);
                  cumY -= segH;
                  return (
                    <rect
                      key={si}
                      x={i * barW + 0.5}
                      y={cumY}
                      width={Math.max(barW - 1, 1)}
                      height={segH}
                      fill={seg.color}
                      rx={si === segments.length - 1 ? 0.5 : 0}
                    />
                  );
                })}
                {/* value label above bar */}
                <text
                  x={(i + 0.5) * barW}
                  y={svgH - (total / Y_MAX) * svgH - 2}
                  textAnchor="middle"
                  fontSize={5}
                  fill="#6b7280"
                  fontFamily="Poppins, sans-serif"
                >
                  {fmt(total, 0)}
                </text>
              </g>
            );
          })}

          {/* Hover dashed line */}
          {hoveredIndex !== null && (
            <line
              x1={(hoveredIndex + 0.5) * barW}
              y1={0}
              x2={(hoveredIndex + 0.5) * barW}
              y2={svgH}
              stroke="#26C6DA"
              strokeWidth={0.8}
              strokeDasharray="3 2"
              opacity={0.8}
            />
          )}
        </svg>

        {/* X-axis labels */}
        <div style={{ position: 'relative', height: 20 }}>
          {sparseX.map(({ i, label }) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${((i + 0.5) / data.length) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: 11,
                color: label.includes("'") || label === '2026' ? '#374151' : '#9ca3af',
                fontWeight: label.includes("'") || label === '2026' ? 600 : 400,
                whiteSpace: 'nowrap',
              } as React.CSSProperties}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredIndex !== null && tooltipPct !== null && (
          <div
            className="lr-chart-tooltip"
            style={{
              left: `clamp(0px, calc(${tooltipPct}% - 60px), calc(100% - 140px))`,
              top: 20,
            }}
          >
            <div className="lr-chart-tooltip__date">{data[hoveredIndex].week}</div>
            {ACTIVITY_COLORS.map(({ key, color, label }) => (
              <div key={key} className="lr-chart-tooltip__row">
                <span className="lr-chart-tooltip__dot" style={{ background: color }} />
                <span>{label}</span>
                <strong>{fmt(data[hoveredIndex][key], 0)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotesPerProviderChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const data = NOTES_PER_PROVIDER;
  const svgW = 600, svgH = 130;
  const barW = svgW / data.length;
  const Y_MAX = 20;
  const yTicks = [5, 10, 15, 20];
  const toY = (v: number) => svgH - (v / Y_MAX) * svgH;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * svgW;
    const idx = Math.floor(x / barW);
    setHoveredIndex(idx >= 0 && idx < data.length ? idx : null);
  };

  const xTicks: { i: number; label: string }[] = [];
  data.forEach((d, i) => {
    if (i === 0 || d.week !== data[i - 1].week || d.week.includes("'")) {
      xTicks.push({ i, label: d.week });
    }
  });
  const sparseX = xTicks.filter((_, ti) => ti % 2 === 0);

  const tooltipPct = hoveredIndex !== null ? ((hoveredIndex + 0.5) / data.length) * 100 : null;

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* Y-axis labels */}
      <div style={{ width: 32, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 24, alignItems: 'flex-end' }}>
        {[...yTicks].reverse().map(t => (
          <span key={t} style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8, lineHeight: 1 }}>{t}</span>
        ))}
        <span style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8 }}></span>
      </div>

      {/* Chart + x-axis */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          style={{ height: 180, width: '100%', display: 'block', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Gridlines */}
          {yTicks.map(t => (
            <line key={t} x1={0} y1={toY(t)} x2={svgW} y2={toY(t)} stroke="#e5e7eb" strokeWidth={0.6} />
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const barH = Math.max((d.avg / Y_MAX) * svgH, 1);
            return (
              <rect
                key={i}
                x={i * barW + 0.5}
                y={svgH - barH}
                width={Math.max(barW - 1, 1)}
                height={barH}
                fill={hoveredIndex === i ? '#1aa8c0' : '#26C6DA'}
                rx={0.5}
              />
            );
          })}

          {/* Value labels */}
          {data.map((d, i) => {
            const barH = (d.avg / Y_MAX) * svgH;
            return (
              <text
                key={i}
                x={(i + 0.5) * barW}
                y={svgH - barH - 2}
                textAnchor="middle"
                fontSize={5}
                fill="#6b7280"
                fontFamily="Poppins, sans-serif"
              >
                {d.avg.toFixed(2)}
              </text>
            );
          })}

          {/* Hover dashed line */}
          {hoveredIndex !== null && (
            <line
              x1={(hoveredIndex + 0.5) * barW}
              y1={0}
              x2={(hoveredIndex + 0.5) * barW}
              y2={svgH}
              stroke="#26C6DA"
              strokeWidth={0.8}
              strokeDasharray="3 2"
              opacity={0.8}
            />
          )}
        </svg>

        {/* X-axis labels */}
        <div style={{ position: 'relative', height: 20 }}>
          {sparseX.map(({ i, label }) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${((i + 0.5) / data.length) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: 11,
                color: label.includes("'") || label === '2026' ? '#374151' : '#9ca3af',
                fontWeight: label.includes("'") || label === '2026' ? 600 : 400,
                whiteSpace: 'nowrap',
              } as React.CSSProperties}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredIndex !== null && tooltipPct !== null && (
          <div
            className="lr-chart-tooltip"
            style={{
              left: `clamp(0px, calc(${tooltipPct}% - 60px), calc(100% - 130px))`,
              top: 20,
            }}
          >
            <div className="lr-chart-tooltip__date">{data[hoveredIndex].week}</div>
            <div className="lr-chart-tooltip__row">
              <span className="lr-chart-tooltip__dot" style={{ background: '#26C6DA' }} />
              <span>Avg</span>
              <strong>{data[hoveredIndex].avg.toFixed(2)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Program Table ────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 7;
const TOTAL_RECORDS = 1811;

type SortKey = keyof ProgramRow;

function SortIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle', opacity: 0.5 }}>
      <path d="M5 2L2 5h6L5 2zm0 6L2 5h6L5 8z" fill="currentColor" />
    </svg>
  );
}

function ProgramTable({ rows }: { rows: ProgramRow[] }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(200);
  const [sortKey, setSortKey] = useState<SortKey>('program');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const effectivePerPage = Math.max(1, perPage);
  const totalPages = Math.ceil(sorted.length / effectivePerPage);
  const visible = sorted.slice((page - 1) * effectivePerPage, page * effectivePerPage);

  // Pagination: show first, last, current ±1, and ellipsis
  const pageNums: (number | '…')[] = (() => {
    if (totalPages <= 8) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums: (number | '…')[] = [1, 2, 3, 4, 5, 6, 7, '…', totalPages];
    return nums;
  })();

  const COLS: { label: string; key: SortKey; align?: string }[] = [
    { label: 'Program Name', key: 'program', align: 'left' },
    { label: 'Activated Providers', key: 'activatedProviders' },
    { label: 'Generated Notes', key: 'generatedNotes' },
    { label: 'Rated Notes', key: 'ratedNotes' },
    { label: 'Average Note Rating', key: 'averageNoteRating' },
    { label: 'Hours Saved', key: 'hoursSaved' },
    { label: 'Average Minutes Saved Per Note', key: 'avgMinutesSavedPerNote' },
  ];

  return (
    <div className="lr-table-card">
      <div className="lr-table-card__header">
        <h3 className="lr-table-card__title">Program View</h3>
        <CardIcons />
      </div>
      <div className="lr-table-controls">
        <div className="lr-table-controls__left">
          <span>Show</span>
          <input
            className="lr-table-controls__input"
            type="number"
            value={perPage}
            min={1}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          />
          <span>entries per page</span>
        </div>
        <div className="lr-table-controls__right">
          <span>Search</span>
          <input
            className="lr-table-controls__search"
            type="text"
            placeholder={`${TOTAL_RECORDS} records...`}
          />
        </div>
      </div>
      <table className="lr-table">
        <thead>
          <tr>
            {COLS.map(col => (
              <th
                key={col.key}
                style={{ textAlign: col.align === 'left' ? 'left' : 'right', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => toggleSort(col.key)}
              >
                {col.label}<SortIcon />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: 'left' }}>{row.program}</td>
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
          {pageNums.map((p, idx) =>
            p === '…' ? (
              <span key={`ellipsis-${idx}`} className="lr-table-pagination__btn">…</span>
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

// ─── Provider Table ───────────────────────────────────────────────────────────

// ─── Top Ten Providers Chart ──────────────────────────────────────────────────

function TopTenProvidersChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const data = TOP_TEN_PROVIDERS;
  const svgW = 600, svgH = 130;
  const barW = svgW / data.length;
  const Y_MAX = 2500;
  const yTicks = [500, 1000, 1500, 2000, 2500];
  const toY = (v: number) => svgH - (v / Y_MAX) * svgH;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * svgW;
    setHoveredIndex(Math.floor(x / barW));
  };

  const tooltipPct = hoveredIndex !== null ? ((hoveredIndex + 0.5) / data.length) * 100 : null;

  return (
    <div className="lr-bar-card" style={{ marginTop: 0 }}>
      <div className="lr-card-header">
        <h3 className="lr-bar-card__title">Top Ten Providers</h3>
        <div className="lr-card-icons">
          <span className="lr-card-icon" title="Filter">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="lr-card-icon-badge">1</span>
          </span>
          <span className="lr-card-icon" title="Warning" style={{ color: '#f59e0b' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L1.5 12h11L7 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v3M7 10.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </span>
          <span className="lr-card-icon" title="More">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="10.5" r="1" fill="currentColor"/></svg>
          </span>
        </div>
      </div>
      <div className="lr-bar-legend">
        <div className="lr-bar-legend-item">
          <div className="lr-bar-legend-swatch" style={{ background: '#26C6DA' }} />
          <span>Total Notes</span>
        </div>
        <button className="lr-pill">All</button>
        <button className="lr-pill">Inv</button>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* Y-axis */}
        <div style={{ width: 44, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 64, alignItems: 'flex-end' }}>
          {[...yTicks].reverse().map(t => (
            <span key={t} style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8, lineHeight: 1 }}>
              {t >= 1000 ? `${t / 1000}k` : t}
            </span>
          ))}
          <span style={{ fontSize: 11, color: '#9ca3af', paddingRight: 8 }}>0</span>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgW} ${svgH}`}
            preserveAspectRatio="none"
            style={{ height: 180, width: '100%', display: 'block', overflow: 'visible', cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Gridlines */}
            {yTicks.map(t => (
              <line key={t} x1={0} y1={toY(t)} x2={svgW} y2={toY(t)} stroke="#e5e7eb" strokeWidth={0.6} />
            ))}
            {/* Zero line */}
            <line x1={0} y1={svgH} x2={svgW} y2={svgH} stroke="#e5e7eb" strokeWidth={0.6} />

            {/* Bars */}
            {data.map((d, i) => {
              const barH = Math.max((d.notes / Y_MAX) * svgH, 1);
              return (
                <rect
                  key={i}
                  x={i * barW + barW * 0.1}
                  y={svgH - barH}
                  width={barW * 0.8}
                  height={barH}
                  fill={hoveredIndex === i ? '#1aa8c0' : '#26C6DA'}
                  rx={1}
                />
              );
            })}

            {/* Value labels above bars */}
            {data.map((d, i) => {
              const barH = (d.notes / Y_MAX) * svgH;
              return (
                <text key={i} x={(i + 0.5) * barW} y={svgH - barH - 3}
                  textAnchor="middle" fontSize={5.5} fill="#6b7280" fontFamily="Poppins, sans-serif">
                  {fmt(d.notes, 0)}
                </text>
              );
            })}

            {/* Hover dashed line */}
            {hoveredIndex !== null && (
              <line
                x1={(hoveredIndex + 0.5) * barW} y1={0}
                x2={(hoveredIndex + 0.5) * barW} y2={svgH}
                stroke="#26C6DA" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.8}
              />
            )}
          </svg>

          {/* X-axis: rotated provider names */}
          <div style={{ position: 'relative', height: 60 }}>
            {data.map((d, i) => (
              <span key={i} style={{
                position: 'absolute',
                left: `${((i + 0.5) / data.length) * 100}%`,
                top: 8,
                transformOrigin: 'top center',
                transform: 'translateX(-50%) rotate(-40deg)',
                fontSize: 11,
                color: '#6b7280',
                whiteSpace: 'nowrap',
              }}>
                {d.name}
              </span>
            ))}
          </div>

          {/* Tooltip */}
          {hoveredIndex !== null && tooltipPct !== null && (
            <div className="lr-chart-tooltip" style={{
              left: `clamp(0px, calc(${tooltipPct}% - 60px), calc(100% - 140px))`,
              top: 20,
            }}>
              <div className="lr-chart-tooltip__date">{data[hoveredIndex].name}</div>
              <div className="lr-chart-tooltip__row">
                <span className="lr-chart-tooltip__dot" style={{ background: '#26C6DA' }} />
                <span>Total Notes</span>
                <strong>{fmt(data[hoveredIndex].notes, 0)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Power Providers Table ────────────────────────────────────────────────────

type PowerSortKey = keyof PowerProviderRow;

function PowerProvidersTable({ rows }: { rows: PowerProviderRow[] }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [sortKey, setSortKey] = useState<PowerSortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: PowerSortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const visible = sorted.slice((page - 1) * perPage, page * perPage);

  const pageNums: (number | '…')[] = totalPages <= 8
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [1, 2, 3, 4, 5, 6, 7, '…', totalPages];

  const COLS: { label: string | JSX.Element; key: PowerSortKey; right?: boolean }[] = [
    { label: 'Email', key: 'email' },
    { label: 'Name', key: 'name' },
    { label: 'Profession', key: 'profession' },
    { label: 'Program Name', key: 'programName' },
    { label: 'Site', key: 'site' },
    { label: 'Supervisor', key: 'supervisor' },
    { label: <span>Generated<br />Notes – Last 7<br />Days</span>, key: 'notesLast7Days', right: true },
    { label: <span>Generated<br />Notes – Last 30<br />Days</span>, key: 'notesLast30Days', right: true },
    { label: <span>Generated<br />Notes Last 90<br />Days</span>, key: 'notesLast90Days', right: true },
  ];

  return (
    <div className="lr-table-card">
      <div className="lr-table-card__header">
        <h3 className="lr-table-card__title">Power Providers</h3>
        <div className="lr-card-icons">
          <span className="lr-card-icon" title="Filter">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="lr-card-icon-badge">1</span>
          </span>
          <span className="lr-card-icon" title="Warning" style={{ color: '#f59e0b' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L1.5 12h11L7 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v3M7 10.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </span>
          <span className="lr-card-icon" title="More">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="10.5" r="1" fill="currentColor"/></svg>
          </span>
        </div>
      </div>
      <div className="lr-table-controls">
        <div className="lr-table-controls__left">
          <span>Show</span>
          <input className="lr-table-controls__input" type="number" value={perPage} min={1}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} />
          <span>entries per page</span>
        </div>
      </div>
      <div className="lr-table-scroll">
        <table className="lr-table lr-table--provider">
          <thead>
            <tr>
              {COLS.map((col, ci) => (
                <th key={ci}
                  style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'left', verticalAlign: 'bottom', whiteSpace: 'normal', minWidth: 80 }}
                  onClick={() => toggleSort(col.key)}>
                  {col.label}<SortIcon />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                <td>{row.email}</td>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td>{row.profession}</td>
                <td>{row.programName}</td>
                <td>{row.site}</td>
                <td>{row.supervisor}</td>
                <td style={{ textAlign: 'left' }}>{row.notesLast7Days}</td>
                <td style={{ textAlign: 'left' }}>{row.notesLast30Days}</td>
                <td style={{ textAlign: 'left' }}>{row.notesLast90Days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="lr-table-pagination">
          {pageNums.map((p, idx) =>
            p === '…' ? (
              <span key={`e-${idx}`} className="lr-table-pagination__btn">…</span>
            ) : (
              <button key={p}
                className={`lr-table-pagination__btn${page === p ? ' lr-table-pagination__btn--active' : ''}`}
                onClick={() => setPage(p as number)}>{p}</button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Flagged Provider Table (reusable) ───────────────────────────────────────

function FlaggedProviderTable({ title, rows, totalRecords }: { title: string; rows: PowerProviderRow[]; totalRecords: number }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [sortKey, setSortKey] = useState<PowerSortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: PowerSortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const visible = sorted.slice((page - 1) * perPage, page * perPage);

  const pageNums: (number | '…')[] = totalPages <= 8
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [1, 2, 3, 4, 5, 6, 7, '…', totalPages];

  const COLS: { label: string | JSX.Element; key: PowerSortKey; right?: boolean }[] = [
    { label: 'Email', key: 'email' },
    { label: 'Name', key: 'name' },
    { label: 'Profession', key: 'profession' },
    { label: 'Program Name', key: 'programName' },
    { label: 'Site', key: 'site' },
    { label: 'Supervisor', key: 'supervisor' },
    { label: <span>Generated<br />Notes – Last 7<br />Days</span>, key: 'notesLast7Days', right: true },
    { label: <span>Generated<br />Notes – Last 30<br />Days</span>, key: 'notesLast30Days', right: true },
    { label: <span>Generated<br />Notes – Last 90<br />Days</span>, key: 'notesLast90Days', right: true },
  ];

  return (
    <div className="lr-table-card">
      <div className="lr-table-card__header">
        <h3 className="lr-table-card__title">{title}</h3>
        <div className="lr-card-icons">
          <span className="lr-card-icon" title="Filter">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="lr-card-icon-badge">1</span>
          </span>
          <span className="lr-card-icon" title="Warning" style={{ color: '#f59e0b' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L1.5 12h11L7 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v3M7 10.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </span>
          <span className="lr-card-icon" title="More">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="10.5" r="1" fill="currentColor"/></svg>
          </span>
        </div>
      </div>
      <div className="lr-table-controls">
        <div className="lr-table-controls__left">
          <span>Show</span>
          <input className="lr-table-controls__input" type="number" value={perPage} min={1}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} />
          <span>entries per page</span>
        </div>
        <div className="lr-table-controls__right">
          <span>Search</span>
          <input className="lr-table-controls__search" type="text" placeholder={`${totalRecords.toLocaleString()} records...`} />
        </div>
      </div>
      <div className="lr-table-scroll">
        <table className="lr-table lr-table--provider">
          <thead>
            <tr>
              {COLS.map((col, ci) => (
                <th key={ci}
                  style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'left', verticalAlign: 'bottom', whiteSpace: 'normal', minWidth: 80 }}
                  onClick={() => toggleSort(col.key)}>
                  {col.label}<SortIcon />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                <td>{row.email}</td>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td>{row.profession}</td>
                <td>{row.programName}</td>
                <td>{row.site}</td>
                <td>{row.supervisor}</td>
                <td style={{ textAlign: 'left' }}>{row.notesLast7Days}</td>
                <td style={{ textAlign: 'left' }}>{row.notesLast30Days}</td>
                <td style={{ textAlign: 'left' }}>{row.notesLast90Days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="lr-table-pagination">
          {pageNums.map((p, idx) =>
            p === '…' ? (
              <span key={`e-${idx}`} className="lr-table-pagination__btn">…</span>
            ) : (
              <button key={p}
                className={`lr-table-pagination__btn${page === p ? ' lr-table-pagination__btn--active' : ''}`}
                onClick={() => setPage(p as number)}>{p}</button>
            )
          )}
        </div>
      )}
    </div>
  );
}

const PROVIDER_ROWS_PER_PAGE = 7;
const PROVIDER_TOTAL_RECORDS = 10000;

type ProviderSortKey = keyof ProviderRow;

function ProviderTable({ rows }: { rows: ProviderRow[] }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [sortKey, setSortKey] = useState<ProviderSortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: ProviderSortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const effectivePerPage = Math.max(1, perPage);
  const totalPages = Math.ceil(sorted.length / effectivePerPage);
  const visible = sorted.slice((page - 1) * effectivePerPage, page * effectivePerPage);

  const pageNums: (number | '…')[] = (() => {
    if (totalPages <= 8) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, 4, 5, 6, 7, '…', totalPages];
  })();

  const COLS: { label: string; key: ProviderSortKey }[] = [
    { label: 'Name', key: 'name' },
    { label: 'Mail', key: 'mail' },
    { label: 'Profession', key: 'profession' },
    { label: 'Program Name', key: 'programName' },
    { label: 'Site', key: 'site' },
    { label: 'Supervisor', key: 'supervisor' },
    { label: 'Configured to Sidebar', key: 'configuredToSidebar' },
    { label: 'Status', key: 'status' },
    { label: 'Generated Notes', key: 'generatedNotes' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'First Note Date', key: 'firstNoteDate' },
    { label: 'Latest Note Date', key: 'latestNoteDate' },
    { label: 'Average Note Rating', key: 'averageNoteRating' },
    { label: 'Notes with Feedback', key: 'notesWithFeedback' },
    { label: 'Hours Saved', key: 'hoursSaved' },
    { label: 'Avg Minutes Saved Per Note', key: 'avgMinutesSavedPerNote' },
  ];

  const na = (v: number | null, decimals = 2) => v == null ? 'N/A' : v.toFixed(decimals);

  return (
    <div className="lr-table-card">
      <div className="lr-table-card__header">
        <h3 className="lr-table-card__title">Provider View</h3>
        <div className="lr-card-icons">
          <span className="lr-card-icon" title="Filter">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h10M3 6h6M5 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="lr-card-icon-badge">1</span>
          </span>
          <span className="lr-card-icon" title="Warning" style={{ color: '#f59e0b' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L1.5 12h11L7 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6v3M7 10.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </span>
          <span className="lr-card-icon" title="More">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="10.5" r="1" fill="currentColor"/></svg>
          </span>
        </div>
      </div>
      <div className="lr-table-controls">
        <div className="lr-table-controls__left">
          <span>Show</span>
          <input
            className="lr-table-controls__input"
            type="number"
            value={perPage}
            min={1}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          />
          <span>entries per page</span>
        </div>
        <div className="lr-table-controls__right">
          <span>Search</span>
          <input
            className="lr-table-controls__search"
            type="text"
            placeholder={`${PROVIDER_TOTAL_RECORDS.toLocaleString()} records...`}
          />
        </div>
      </div>
      <div className="lr-table-scroll">
        <table className="lr-table lr-table--provider">
          <thead>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'left', whiteSpace: 'normal', verticalAlign: 'bottom' }}
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}<SortIcon />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td>{row.mail}</td>
                <td>{row.profession}</td>
                <td>{row.programName}</td>
                <td>{row.site}</td>
                <td>{row.supervisor}</td>
                <td>{row.configuredToSidebar}</td>
                <td>{row.status}</td>
                <td style={{ textAlign: 'left' }}>{row.generatedNotes}</td>
                <td>{row.mobile}</td>
                <td>{row.firstNoteDate}</td>
                <td>{row.latestNoteDate}</td>
                <td style={{ textAlign: 'left' }}>{na(row.averageNoteRating, 0)}</td>
                <td style={{ textAlign: 'left' }}>{row.notesWithFeedback}</td>
                <td style={{ textAlign: 'left' }}>{na(row.hoursSaved, 4)}</td>
                <td style={{ textAlign: 'left' }}>{na(row.avgMinutesSavedPerNote, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="lr-table-pagination">
          {pageNums.map((p, idx) =>
            p === '…' ? (
              <span key={`ellipsis-${idx}`} className="lr-table-pagination__btn">…</span>
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

// ─── Note Data Table (Raw Data tab) ──────────────────────────────────────────

function NoteDataTable({ rows }: { rows: NoteDataRow[] }) {
  const TOTAL_RECORDS = 50000;
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.siteName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(TOTAL_RECORDS / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  // Pagination: show first 7, ellipsis, last
  const visiblePages: (number | '...')[] = [];
  for (let i = 1; i <= Math.min(7, totalPages); i++) visiblePages.push(i);
  if (totalPages > 8) visiblePages.push('...');
  if (totalPages > 7) visiblePages.push(totalPages);

  return (
    <div className="lr-chart-card lr-table-card">
      <div className="lr-card-header">
        <span className="lr-chart-card__title">Note Data</span>
        <div className="lr-card-icons"><CardIcons /></div>
      </div>
      <div className="lr-table-controls">
        <div className="lr-table-controls__left">
          <span>Show</span>
          <input
            className="lr-table-controls__input"
            type="number"
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          />
          <span>entries per page</span>
        </div>
        <div className="lr-table-controls__right">
          <span>Search</span>
          <input
            className="lr-table-controls__search"
            placeholder={`${TOTAL_RECORDS.toLocaleString()} records...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>
      <div className="lr-table-scroll">
        <table className="lr-table lr-table--notedata">
          <thead>
            <tr>
              <th>Name <SortIcon /></th>
              <th>Email <SortIcon /></th>
              <th>Site Name <SortIcon /></th>
              <th>Site<br/>Segmentation <SortIcon /></th>
              <th>Job Title <SortIcon /></th>
              <th>Supervisor <SortIcon /></th>
              <th>Program <SortIcon /></th>
              <th>Note Creation<br/>Time <SortIcon /></th>
              <th>Activity<br/>Type <SortIcon /></th>
              <th>Is<br/>Mobile? <SortIcon /></th>
              <th>Note<br/>Rating <SortIcon /></th>
              <th>Note<br/>Feedback <SortIcon /></th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.siteName}</td>
                <td>{r.siteSegmentation}</td>
                <td>{r.jobTitle}</td>
                <td>{r.supervisor}</td>
                <td>{r.program}</td>
                <td>{r.noteCreationTime}</td>
                <td>{r.activityType}</td>
                <td>{r.isMobile}</td>
                <td>{r.noteRating}</td>
                <td>{r.noteFeedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lr-table-pagination">
        {visiblePages.map((n, i) =>
          n === '...'
            ? <span key={`ellipsis-${i}`} className="lr-table-pagination__ellipsis">…</span>
            : <button
                key={n}
                className={`lr-table-pagination__btn${n === page ? ' lr-table-pagination__btn--active' : ''}`}
                onClick={() => setPage(n as number)}
              >{n}</button>
        )}
      </div>
    </div>
  );
}

// ─── Feedback Themes Word Cloud ───────────────────────────────────────────────

const WORD_CLOUD_WORDS = [
  { text: 'Incredible', size: 32, color: '#e8a838', x: 3, y: 8, rotate: 0 },
  { text: 'This was not our session.', size: 15, color: '#9b59b6', x: 18, y: 4, rotate: 0 },
  { text: 'Good', size: 34, color: '#f0c040', x: 55, y: 8, rotate: 0 },
  { text: 'could be more concise', size: 20, color: '#a855f7', x: 5, y: 18, rotate: 0 },
  { text: 'it worked.', size: 18, color: '#aab0b8', x: 48, y: 20, rotate: 0 },
  { text: 'names of others', size: 20, color: '#e67e22', x: 64, y: 14, rotate: 90 },
  { text: 'tes', size: 16, color: '#888', x: 72, y: 10, rotate: 90 },
  { text: 'ELLENT!!', size: 18, color: '#2ecc71', x: 78, y: 8, rotate: 90 },
  { text: 'tail!', size: 15, color: '#e74c3c', x: 83, y: 12, rotate: 90 },
  { text: 'THIS!', size: 15, color: '#9b59b6', x: 87, y: 8, rotate: 90 },
  { text: 'BOARD!', size: 16, color: '#e67e22', x: 91, y: 6, rotate: 90 },
  { text: 'estions', size: 15, color: '#3498db', x: 95, y: 5, rotate: 90 },
  { text: 'Love this p', size: 22, color: '#2c3e50', x: 78, y: 4, rotate: 0 },
  { text: 'Great!!!!!', size: 36, color: '#9b59b6', x: 2, y: 28, rotate: 0 },
  { text: 'love the new setup', size: 24, color: '#e91e8c', x: 36, y: 30, rotate: 0 },
  { text: 'iis tool!', size: 20, color: '#27ae60', x: 75, y: 18, rotate: 90 },
  { text: 'The verb', size: 20, color: '#7f8c8d', x: 85, y: 18, rotate: 0 },
  { text: 'Note wasn\'t saved', size: 30, color: '#e67e22', x: 4, y: 40, rotate: 0 },
  { text: 'Does not have nursing as a asses', size: 18, color: '#16a085', x: 58, y: 36, rotate: 0 },
  { text: 'CATS not C', size: 18, color: '#3498db', x: 82, y: 30, rotate: 0 },
  { text: 's are running a lot smoother and quicker!', size: 20, color: '#2c3e50', x: 0, y: 54, rotate: 0 },
  { text: 'information sometimes', size: 18, color: '#e91e8c', x: 2, y: 66, rotate: 0 },
  { text: 'Nailed it!', size: 26, color: '#27ae60', x: 38, y: 64, rotate: 0 },
  { text: 't was accurate.', size: 22, color: '#f39c12', x: 60, y: 28, rotate: 90 },
  { text: 'The system keeps shutting dow', size: 28, color: '#2c3e50', x: 58, y: 48, rotate: 0, weight: 700 },
  { text: 'please eliminate the use of word p', size: 20, color: '#3498db', x: 58, y: 62, rotate: 0 },
  { text: 'of has.', size: 28, color: '#e74c3c', x: 0, y: 78, rotate: 0, weight: 700 },
  { text: 'This is a phone call note. However, it is broken down into assessment c', size: 20, color: '#16a085', x: 12, y: 80, rotate: 0 },
];

function FeedbackThemesCloud() {
  return (
    <div className="lr-chart-card lr-word-cloud-card">
      <div className="lr-card-header">
        <span className="lr-chart-card__title">Feedback Themes</span>
        <div className="lr-card-icons"><CardIcons /></div>
      </div>
      <div className="lr-word-cloud">
        {WORD_CLOUD_WORDS.map((w, i) => (
          <span
            key={i}
            className="lr-word-cloud__word"
            style={{
              left: `${w.x}%`,
              top: `${w.y}%`,
              fontSize: `${w.size}px`,
              color: w.color,
              fontWeight: (w as { weight?: number }).weight ?? 400,
              transform: w.rotate ? `rotate(${w.rotate}deg)` : undefined,
              transformOrigin: 'top left',
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Provider Feedback Table ──────────────────────────────────────────────────

function ProviderFeedbackTable({ rows }: { rows: FeedbackRow[] }) {
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.profession.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  const pageNums: number[] = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) pageNums.push(i);

  return (
    <div className="lr-chart-card lr-table-card">
      <div className="lr-card-header">
        <span className="lr-chart-card__title">Provider Feedback</span>
        <div className="lr-card-icons"><CardIcons /></div>
      </div>
      <div className="lr-table-controls">
        <div className="lr-table-controls__left">
          <span>Show</span>
          <input
            className="lr-table-controls__input"
            type="number"
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          />
          <span>entries per page</span>
        </div>
        <div className="lr-table-controls__right">
          <span>Search</span>
          <input
            className="lr-table-controls__search"
            placeholder={`${rows.length} records...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>
      <table className="lr-table">
        <thead>
          <tr>
            <th>Note Created<br/>Date <SortIcon /></th>
            <th>Name <SortIcon /></th>
            <th>Email <SortIcon /></th>
            <th>Profession <SortIcon /></th>
            <th style={{ textAlign: 'right' }}>Note<br/>Rating <SortIcon /></th>
            <th>Note Feedback <SortIcon /></th>
          </tr>
        </thead>
        <tbody>
          {slice.map((r, i) => (
            <tr key={i}>
              <td>{r.noteCreatedDate}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.profession}</td>
              <td style={{ textAlign: 'right' }}>{r.noteRating}</td>
              <td>{r.noteFeedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="lr-table-pagination">
        {pageNums.map(n => (
          <button
            key={n}
            className={`lr-table-pagination__btn${n === page ? ' lr-table-pagination__btn--active' : ''}`}
            onClick={() => setPage(n)}
          >{n}</button>
        ))}
      </div>
    </div>
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
          <h1 className="leadership-report__title">Eleos Documentation Dashboard (NDE)</h1>
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

      {activeTab === 'Overview' && (
      <>
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
            <div className="lr-stat-card__sparkline"><Sparkline color="#4caf50" data={SPARKLINE_WEEKS} label="Average Time Saved" /></div>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">Average Note Rating (Out of 5)</span>
            <span className="lr-stat-card__value">{IMPACT_STATS.averageNoteRating}</span>
            <div className="lr-stat-card__sparkline"><Sparkline color="#4caf50" data={SPARKLINE_RATING_WEEKS} label="Average Note Rating" /></div>
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
            <div className="lr-stat-card__sparkline"><Sparkline color="#4caf50" data={SPARKLINE_WEEKS.map(w => ({ week: w.week, value: Math.round(w.value * 150) }))} label="Activated Providers" /></div>
          </div>
          <div className="lr-stat-card">
            <span className="lr-stat-card__label">License Utilization</span>
            <span className="lr-stat-card__value">{ADOPTION_STATS.licenseUtilization}%</span>
          </div>
        </div>

        {/* Onboarding row: Awaiting stat | Donut | Legend */}
        <div className="lr-charts-row">
          <div className="lr-chart-card">
            <div className="lr-card-header">
              <p className="lr-chart-card__title">Awaiting First Use</p>
              <CardIcons />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, paddingTop: 16 }}>
              <span className="lr-big-stat">{fmt(ADOPTION_STATS.awaitingFirstUse)}</span>
            </div>
          </div>

          <div className="lr-chart-card">
            <div className="lr-card-header">
              <p className="lr-chart-card__title">Onboarding Providers – Created First Note In Past 30 Days</p>
              <CardIcons />
            </div>
            <div className="lr-donut-wrapper">
              <DonutChart slices={ONBOARDING_DONUT} withLabels />
            </div>
          </div>

          <div className="lr-chart-card">
            <div className="lr-card-header">
              <p className="lr-chart-card__title">Onboarding Period – Up to 30 Days After First Note</p>
              <CardIcons />
            </div>
            <ul className="lr-bullet-list">
              <li><div className="lr-legend-dot" style={{ background: '#4DB6AC' }} /><span><strong>Onboarding – First Week</strong> – Providers in their first week after activation.</span></li>
              <li><div className="lr-legend-dot" style={{ background: '#26C6DA' }} /><span><strong>Successful Onboarding</strong> – Providers less than 30 days after activation, who created 5 notes or more in their first week. These providers are more likely to continue using Eleos consistently.</span></li>
              <li><div className="lr-legend-dot" style={{ background: '#283593' }} /><span><strong>Onboarding – Slow Start</strong> – Providers less than 30 days after activation, who created fewer than 5 notes in their first week.</span></li>
            </ul>
          </div>
        </div>

        {/* Ongoing row: Donut (2 cols) | Legend */}
        <div className="lr-charts-row">
          <div className="lr-chart-card lr-chart-card--span2">
            <div className="lr-card-header">
              <p className="lr-chart-card__title">Providers in Ongoing Usage – More Than 30 Days After Their First Note</p>
              <CardIcons />
            </div>
            <div className="lr-donut-wrapper">
              <DonutChart slices={ONGOING_DONUT} withLabels />
            </div>
          </div>

          <div className="lr-chart-card">
            <div className="lr-card-header">
              <p className="lr-chart-card__title">Ongoing Usage – Over 30 Days After First Note</p>
              <CardIcons />
            </div>
            <ul className="lr-bullet-list">
              <li><div className="lr-legend-dot" style={{ background: '#283593' }} /><span><strong>Power Provider</strong> – Providers who created 60 notes or more in the past 30 days.</span></li>
              <li><div className="lr-legend-dot" style={{ background: '#26C6DA' }} /><span><strong>Active</strong> – Providers who created 1–59 notes in the past 30 days.</span></li>
              <li><div className="lr-legend-dot" style={{ background: '#4DB6AC' }} /><span><strong>Low Engagement</strong> – Providers who created no notes in the past 30 days.</span></li>
              <li><div className="lr-legend-dot" style={{ background: '#EF6C00' }} /><span><strong>Dropped Off</strong> – Providers who created no notes in the past 90 days.</span></li>
              <li><div className="lr-legend-dot" style={{ background: '#78909C' }} /><span><strong>Re-Engaged</strong> – Providers who previously dropped off but resumed activity in the past 30 days.</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Notes Generated by Week ── */}
      <div className="lr-bar-card">
        <div className="lr-card-header">
          <h3 className="lr-bar-card__title">Notes Generated by Week</h3>
          <CardIcons />
        </div>
        <div className="lr-bar-legend">
          <div className="lr-bar-legend-item">
            <div className="lr-bar-legend-swatch" style={{ background: '#26C6DA' }} />
            <span>Notes</span>
          </div>
          <button className="lr-pill">All</button>
          <button className="lr-pill">Inv</button>
        </div>
        <FullBarChart />
      </div>

      {/* ── Activity Types + Notes Per Provider ── */}
      <div className="lr-charts-row-2">
        <div className="lr-bar-card">
          <div className="lr-card-header">
            <h3 className="lr-bar-card__title">Activity Types by Week</h3>
            <CardIcons />
          </div>
          <div className="lr-bar-legend">
            {ACTIVITY_COLORS.map(s => (
              <div key={s.label} className="lr-bar-legend-item">
                <div className="lr-bar-legend-swatch" style={{ background: s.color }} />
                <span>{s.label}</span>
              </div>
            ))}
            <button className="lr-pill">All</button>
            <button className="lr-pill">Inv</button>
          </div>
          <ActivityTypesChart />
        </div>

        <div className="lr-bar-card">
          <div className="lr-card-header">
            <h3 className="lr-bar-card__title">Notes Per Provider by Week</h3>
            <CardIcons />
          </div>
          <div className="lr-bar-legend">
            <div className="lr-bar-legend-item">
              <div className="lr-bar-legend-swatch" style={{ background: '#26C6DA' }} />
              <span>Average Notes Per Provider</span>
            </div>
            <button className="lr-pill">All</button>
            <button className="lr-pill">Inv</button>
          </div>
          <NotesPerProviderChart />
        </div>
      </div>

      {/* ── Program Table ── */}
      <ProgramTable rows={PROGRAM_DATA} />
      </>
      )}

      {activeTab === 'Provider View' && (
        <>
          <ProviderTable rows={PROVIDER_DATA} />
          <TopTenProvidersChart />
          <PowerProvidersTable rows={POWER_PROVIDERS} />
          <div className="lr-flagged-section">
            <h2 className="lr-section__title">Flagged Providers for Follow-Up</h2>
            <FlaggedProviderTable title="Awaiting First Use" rows={AWAITING_FIRST_USE} totalRecords={1000} />
            <FlaggedProviderTable title="Onboarding – Slow Start" rows={ONBOARDING_SLOW_START} totalRecords={300} />
            <FlaggedProviderTable title="Low Engagement" rows={LOW_ENGAGEMENT} totalRecords={500} />
            <FlaggedProviderTable title="Dropped Off" rows={DROPPED_OFF} totalRecords={400} />
          </div>
        </>
      )}

      {activeTab === 'Voice of the Provider' && (
        <>
          <div className="lr-charts-row lr-votp-row">
            {/* Average Note Rating card */}
            <div className="lr-chart-card lr-votp-card">
              <div className="lr-card-header">
                <span className="lr-chart-card__title">Average Note Rating (Out of 5)</span>
                <div className="lr-card-icons">
                  <CardIcons />
                </div>
              </div>
              <div className="lr-votp-stat">4.39</div>
              <div className="lr-votp-sparkline">
                <Sparkline color="#4a9aaa" data={VOTP_RATING_WEEKS} label="avg(note_rating)" />
              </div>
            </div>

            {/* Notes Submitted with Feedback card */}
            <div className="lr-chart-card lr-votp-card">
              <div className="lr-card-header">
                <span className="lr-chart-card__title">Notes Submitted with Feedback</span>
                <div className="lr-card-icons">
                  <CardIcons />
                </div>
              </div>
              <div className="lr-votp-stat">957</div>
              <div className="lr-votp-sparkline">
                <Sparkline color="#4a9aaa" data={VOTP_FEEDBACK_WEEKS} label="Notes with Feedback" />
              </div>
            </div>
          </div>
          <ProviderFeedbackTable rows={PROVIDER_FEEDBACK} />
          <FeedbackThemesCloud />
        </>
      )}

      {activeTab === 'Raw Data' && (
        <>
          <NoteDataTable rows={NOTE_DATA} />
        </>
      )}
    </div>
    </div>
  );
}
