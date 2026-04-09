# Management Hub Demo

An internal analytics dashboard demo built for **Eleos Health**, showcasing two interactive reporting dashboards: the **Leadership Report** and the **Compliance Dashboard**.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (dev server & build)
- **React Router v7**
- Plain **CSS** (no UI framework) with design tokens and component-scoped class prefixes (`lr-` for Leadership, `cr-` for Compliance)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Project Structure

```
src/
├── data/
│   ├── leadershipReport.ts     # Mock data for Leadership Report
│   └── complianceReport.ts     # Mock data for Compliance Dashboard
├── pages/
│   └── Reports/
│       ├── LeadershipReport.tsx / .css   # Leadership Report page
│       └── ComplianceReport.tsx / .css   # Compliance Dashboard page
└── ...
```

## Dashboards

### Eleos Documentation Dashboard (Leadership Report)

Tracks provider documentation activity and quality across the organization.

**Tabs:**
- **Summary** — Notes generated over time, activity breakdown by type, notes per provider, top/power providers
- **Provider View** — Full provider table, flagged provider segments (Awaiting First Use, Onboarding Slow Start, Low Engagement, Dropped Off)
- **Voice of the Provider** — Average note rating sparkline, provider feedback table, feedback themes word cloud
- **Raw Data** — Full note-level data table with 50k+ records, pagination, and search

### Eleos Compliance Dashboard

Tracks documentation compliance across 7 AI-evaluated checkpoints.

**Tabs:**
- **Summary** — Key stats (documents, providers, time/cost saved), key improvements chart, quality score timeline, compliance rate by checkpoint, performance table, quality scores by service/program/supervisor, analysis by provider
- **Checkpoints** — 7 sub-tabs (Completeness, Uniqueness, Golden Thread, Intervention Used, Client Response, Progress Mentioned, Compliant Plan), each with stat cards, compliance timeline chart, and filtered programs/supervisors/providers tables
- **Document Data** — 19-column raw document table (50k record limit) with horizontal scroll and pagination
- **Definitions** — Full checkpoint & criteria definitions including Quality Score formula

**Filter Panel** (left sidebar):
- Time Range, Organization, Business Unit, Program, Supervisors, Service, Provider, Document ID
- Custom multi-select dropdowns with search + checkboxes
- Staged apply/clear pattern — changes apply only on "Apply filters"
- Organization filter derived from provider email domain mapping
- Filters propagate via React Context to all relevant tables

## Key Features

- Interactive SVG charts with hover tooltips (line charts, bar charts, grouped bar charts)
- Gradient fills and animated hover states on all chart cards
- Paginated tables with ellipsis pagination (e.g. `1 2 3 4 5 6 7 … N`)
- Color-coded cells (green highlight for high scores, red for negative change)
- Collapsible filter sidebar
- Responsive sub-tab navigation within tabs
