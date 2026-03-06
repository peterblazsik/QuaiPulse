# QuaiPulse - Ferrari-Grade Architecture & Planning Document

> Personal Zurich Life Navigator for Peter Blazsik
> Moving to Zurich Insurance (Quai Zurich Campus, Mythenquai) | July 1, 2026

---

## 1. Vision

QuaiPulse is not an apartment finder. It's a **personal command center** for relocating your entire life to Zurich. Think Bloomberg Terminal meets a life dashboard — data-dense, dark-mode, keyboard-driven, and absurdly overengineered for a single user. Every pixel serves a purpose. Every interaction feels like driving a Ferrari.

---

## 2. Tech Stack (The Engine)

### Core Framework
| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | Server Components, streaming, parallel routes, intercepting routes |
| **Language** | TypeScript 5.x (strict mode) | Type safety everywhere, no `any` allowed |
| **Runtime** | Node.js 22 LTS | Latest stable, native fetch, performance |
| **Package Manager** | pnpm | Fast, disk-efficient, strict |

### Frontend
| Layer | Technology | Why |
|-------|-----------|-----|
| **Styling** | Tailwind CSS 4 + CSS variables | Dark mode first, design tokens via CSS custom properties |
| **Components** | shadcn/ui + Radix primitives | Accessible, unstyled primitives you own |
| **Icons** | Lucide React | Consistent, tree-shakeable |
| **Animation** | Framer Motion 12 | Layout animations, gesture support, exit animations |
| **Charts** | Recharts + D3.js (custom) | Recharts for standard charts, D3 for radar/custom viz |
| **Maps** | MapLibre GL JS + react-map-gl | Free (no Mapbox token needed), vector tiles, 3D |
| **Command Palette** | cmdk (pacocoursey) | The backbone of keyboard-first UX |
| **Tables** | TanStack Table v8 | Headless, sortable, filterable, virtualizable |
| **Forms** | React Hook Form + Zod | Validated forms with type inference |
| **Dates** | date-fns | Lightweight, tree-shakeable date manipulation |
| **Drag & Drop** | dnd-kit | For checklist reordering, priority ranking |

### Backend & Data
| Layer | Technology | Why |
|-------|-----------|-----|
| **Database** | SQLite via Turso (cloud) + libSQL (local) | Edge-fast, zero ops, embedded DB with cloud sync |
| **ORM** | Drizzle ORM | Type-safe, SQL-like, fastest ORM, perfect SQLite support |
| **API Layer** | tRPC v11 | End-to-end type safety, no codegen, React Query integration |
| **Auth** | None needed (single user) | Local-first, no auth overhead |
| **File Storage** | Local filesystem + Vercel Blob (dossier docs) | Simple, cost-effective |
| **Cron/Background** | Vercel Cron Functions | Apartment scraping, price checks, currency updates |
| **AI** | Anthropic Claude API (claude-sonnet-4-5-20250514) | Chat assistant, apartment analysis, recommendations |

### DevOps & Quality
| Layer | Technology | Why |
|-------|-----------|-----|
| **Deployment** | Vercel | Native Next.js support, edge functions, cron |
| **CI/CD** | GitHub Actions | Lint, type-check, test, deploy on push |
| **Testing** | Vitest + Playwright | Unit/integration + E2E |
| **Linting** | Biome | Fast, replaces ESLint + Prettier |
| **Error Tracking** | Sentry | Production error monitoring |
| **Analytics** | PostHog (self-hosted or cloud) | Privacy-first, feature flags, session replay |
| **Monitoring** | Vercel Analytics + Speed Insights | Core Web Vitals tracking |

---

## 3. Architecture Overview

```
quaipulse/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, test
│       └── deploy.yml                # Vercel deployment
├── public/
│   ├── fonts/
│   │   ├── JetBrainsMono[wght].woff2
│   │   └── PlayfairDisplay[wght].woff2
│   ├── geojson/
│   │   └── zurich-kreise.geojson     # District boundaries
│   ├── icons/                         # PWA icons
│   └── manifest.json                  # PWA manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root: fonts, providers, sidebar, command palette
│   │   ├── page.tsx                   # Dashboard home
│   │   ├── loading.tsx                # Global loading skeleton
│   │   ├── not-found.tsx              # 404 with style
│   │   ├── neighborhoods/
│   │   │   ├── page.tsx               # Ranking view with interactive sliders
│   │   │   ├── compare/
│   │   │   │   └── page.tsx           # Side-by-side comparison (up to 3)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx           # Deep-dive: radar, budget impact, venues, links
│   │   │       └── loading.tsx
│   │   ├── budget/
│   │   │   ├── page.tsx               # Interactive budget simulator
│   │   │   └── scenarios/
│   │   │       └── page.tsx           # Saved what-if scenarios
│   │   ├── apartments/
│   │   │   ├── page.tsx               # Listings aggregator + saved listings
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx           # Individual apartment analysis
│   │   │   └── search/
│   │   │       └── page.tsx           # Portal links with pre-filtered URLs
│   │   ├── katie/
│   │   │   ├── page.tsx               # Visit planner calendar
│   │   │   └── costs/
│   │   │       └── page.tsx           # Annual cost projection
│   │   ├── social/
│   │   │   ├── page.tsx               # Interactive venue map
│   │   │   └── [category]/
│   │   │       └── page.tsx           # Filtered view (gyms, chess, ai-meetups, etc.)
│   │   ├── checklist/
│   │   │   ├── page.tsx               # Move checklist with timeline
│   │   │   └── dossier/
│   │   │       └── page.tsx           # Document vault & status tracker
│   │   ├── currency/
│   │   │   └── page.tsx               # CHF/EUR/HUF dashboard with trends
│   │   ├── weather/
│   │   │   └── page.tsx               # Zurich weather + Vienna comparison
│   │   ├── ai/
│   │   │   └── page.tsx               # AI chat assistant (Claude-powered)
│   │   ├── settings/
│   │   │   └── page.tsx               # Profile, preferences, API keys
│   │   └── api/
│   │       └── trpc/
│   │           └── [trpc]/
│   │               └── route.ts       # tRPC HTTP handler
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── layout/
│   │   │   ├── app-shell.tsx          # Main layout wrapper
│   │   │   ├── sidebar.tsx            # Navigation sidebar with collapse
│   │   │   ├── header.tsx             # Top bar: breadcrumbs, search, countdown
│   │   │   ├── command-palette.tsx    # Global cmd+k palette
│   │   │   └── status-bar.tsx         # Bottom: days until move, surplus, top neighborhood
│   │   ├── dashboard/
│   │   │   ├── profile-card.tsx       # Peter's profile summary
│   │   │   ├── countdown-timer.tsx    # Days until July 1
│   │   │   ├── top-neighborhoods.tsx  # Top 3 ranked cards
│   │   │   ├── budget-snapshot.tsx    # Income vs expenses mini chart
│   │   │   ├── next-actions.tsx       # Priority action items
│   │   │   ├── apartment-pulse.tsx    # Latest saved listings status
│   │   │   └── quick-stats.tsx        # KPI row: surplus, savings rate, visits planned
│   │   ├── neighborhoods/
│   │   │   ├── neighborhood-card.tsx  # Summary card for ranking
│   │   │   ├── radar-chart.tsx        # D3-powered radar visualization
│   │   │   ├── priority-sliders.tsx   # Weight adjustment controls
│   │   │   ├── comparison-table.tsx   # Side-by-side data table
│   │   │   ├── comparison-radar.tsx   # Overlaid radar charts
│   │   │   ├── score-badge.tsx        # Colored score indicator
│   │   │   ├── score-breakdown.tsx    # Detailed scoring explanation
│   │   │   ├── venue-list.tsx         # Nearby venues for a neighborhood
│   │   │   ├── rent-range-bar.tsx     # Visual rent range indicator
│   │   │   └── portal-links.tsx       # Pre-filtered search portal links
│   │   ├── budget/
│   │   │   ├── income-section.tsx     # Income breakdown
│   │   │   ├── expense-sliders.tsx    # Adjustable expense controls
│   │   │   ├── surplus-display.tsx    # Big surplus/deficit number
│   │   │   ├── stacked-bar.tsx        # Category breakdown chart
│   │   │   ├── savings-projection.tsx # 12-month forecast chart
│   │   │   ├── scenario-toggle.tsx    # What-if toggles
│   │   │   ├── scenario-card.tsx      # Saved scenario comparison
│   │   │   └── amsterdam-compare.tsx  # Before/after life cost comparison
│   │   ├── apartments/
│   │   │   ├── listing-card.tsx       # Individual listing display
│   │   │   ├── listing-filters.tsx    # Filter controls
│   │   │   ├── listing-map.tsx        # Map view of saved listings
│   │   │   ├── listing-score.tsx      # Auto-scored badge overlay
│   │   │   ├── budget-impact.tsx      # "If you take this apartment..." calculator
│   │   │   └── listing-form.tsx       # Manual listing entry form
│   │   ├── katie/
│   │   │   ├── visit-calendar.tsx     # Monthly calendar with visit markers
│   │   │   ├── cost-per-visit.tsx     # Flight vs train cost card
│   │   │   ├── annual-projection.tsx  # Yearly visit cost chart
│   │   │   ├── transport-toggle.tsx   # Flight vs train comparison
│   │   │   └── key-dates.tsx          # Birthday, holidays, school breaks
│   │   ├── social/
│   │   │   ├── venue-card.tsx         # Individual venue display
│   │   │   ├── venue-map.tsx          # MapLibre interactive map
│   │   │   ├── category-filter.tsx    # Gym, chess, AI, swimming, cycling tabs
│   │   │   ├── distance-badge.tsx     # Distance from office/home
│   │   │   └── social-score.tsx       # Neighborhood social density indicator
│   │   ├── checklist/
│   │   │   ├── timeline-view.tsx      # Visual timeline March-July
│   │   │   ├── checklist-item.tsx     # Individual task with status
│   │   │   ├── phase-group.tsx        # Grouped by month/phase
│   │   │   ├── dossier-tracker.tsx    # Document status grid
│   │   │   └── progress-ring.tsx      # Overall completion indicator
│   │   ├── currency/
│   │   │   ├── rate-card.tsx          # Current rate display
│   │   │   ├── trend-sparkline.tsx    # Mini trend chart
│   │   │   └── converter.tsx          # Quick conversion tool
│   │   ├── ai/
│   │   │   ├── chat-interface.tsx     # Full chat UI
│   │   │   ├── chat-message.tsx       # Individual message bubble
│   │   │   ├── suggestion-chips.tsx   # Pre-built question suggestions
│   │   │   └── ai-insight-card.tsx    # Inline AI recommendations
│   │   └── shared/
│   │       ├── sparkline.tsx          # Mini inline chart
│   │       ├── kpi-card.tsx           # Standard KPI display
│   │       ├── data-table.tsx         # Reusable TanStack table
│   │       ├── empty-state.tsx        # Styled empty states (but we avoid them)
│   │       ├── loading-skeleton.tsx   # Shimmer loading states
│   │       ├── keyboard-hint.tsx      # Keyboard shortcut indicator
│   │       ├── tooltip-number.tsx     # Hover-to-explain number
│   │       ├── currency-display.tsx   # CHF with EUR parenthetical
│   │       └── section-header.tsx     # Consistent section headings
│   ├── lib/
│   │   ├── trpc/
│   │   │   ├── client.ts             # tRPC React client
│   │   │   ├── server.ts             # tRPC server setup
│   │   │   ├── context.ts            # Request context (DB connection)
│   │   │   └── router.ts             # Root router combining all routers
│   │   ├── routers/
│   │   │   ├── neighborhoods.ts      # Neighborhood CRUD + scoring
│   │   │   ├── budget.ts             # Budget calculations + scenarios
│   │   │   ├── apartments.ts         # Listing management + scoring
│   │   │   ├── katie.ts              # Visit planning + cost calc
│   │   │   ├── social.ts             # Venue management
│   │   │   ├── checklist.ts          # Task management + dossier
│   │   │   ├── currency.ts           # Exchange rate fetching
│   │   │   ├── weather.ts            # Weather data
│   │   │   └── ai.ts                 # Claude API integration
│   │   ├── db/
│   │   │   ├── index.ts              # Database connection (Turso/libSQL)
│   │   │   ├── schema.ts             # Drizzle schema definitions
│   │   │   ├── migrations/           # SQL migration files
│   │   │   └── seed.ts               # Initial data: neighborhoods, venues, profile
│   │   ├── data/
│   │   │   ├── neighborhoods.ts      # Hardcoded neighborhood data (10 areas)
│   │   │   ├── venues.ts             # All venues: gyms, chess, AI meetups, pools
│   │   │   ├── profile.ts            # Peter's profile, constraints, preferences
│   │   │   ├── budget-defaults.ts    # Default income/expense values
│   │   │   ├── checklist-items.ts    # All checklist tasks by phase
│   │   │   └── portal-urls.ts        # Pre-filtered apartment portal URLs
│   │   ├── engines/
│   │   │   ├── scoring.ts            # Weighted neighborhood scoring algorithm
│   │   │   ├── apartment-scorer.ts   # Auto-score apartments vs criteria
│   │   │   ├── budget-calculator.ts  # Monthly/annual budget computation
│   │   │   ├── visit-planner.ts      # Optimal visit schedule calculator
│   │   │   └── commute-calculator.ts # Travel time estimation
│   │   ├── ai/
│   │   │   ├── client.ts             # Anthropic SDK setup
│   │   │   ├── prompts.ts            # System prompts for different contexts
│   │   │   └── tools.ts              # Function calling tools for Claude
│   │   ├── hooks/
│   │   │   ├── use-keyboard-shortcuts.ts
│   │   │   ├── use-budget-calculator.ts
│   │   │   ├── use-neighborhood-scores.ts
│   │   │   ├── use-command-palette.ts
│   │   │   ├── use-local-storage.ts
│   │   │   └── use-currency-rates.ts
│   │   ├── stores/
│   │   │   ├── priority-store.ts     # Zustand: neighborhood weight preferences
│   │   │   ├── budget-store.ts       # Zustand: budget slider values
│   │   │   ├── ui-store.ts           # Zustand: sidebar state, theme, view prefs
│   │   │   └── filter-store.ts       # Zustand: apartment/venue filters
│   │   ├── utils/
│   │   │   ├── currency.ts           # CHF/EUR/HUF conversion
│   │   │   ├── formatting.ts         # Number, date, distance formatting
│   │   │   ├── colors.ts             # Score-to-color mapping
│   │   │   ├── geo.ts                # Distance calculations, bounding boxes
│   │   │   └── export.ts             # PDF generation helpers
│   │   ├── constants.ts              # App-wide constants
│   │   └── types.ts                  # Shared TypeScript types
│   └── styles/
│       └── globals.css               # Tailwind base + custom properties + fonts
├── drizzle/
│   └── migrations/                    # Generated migration SQL files
├── scripts/
│   ├── seed-db.ts                    # Database seeding script
│   ├── scrape-apartments.ts          # Apartment listing scraper (cron)
│   └── fetch-currency.ts             # Currency rate updater (cron)
├── .env.local                         # Local env vars (API keys)
├── .env.example                       # Template for env vars
├── biome.json                         # Biome config (lint + format)
├── drizzle.config.ts                  # Drizzle ORM config
├── next.config.ts                     # Next.js config
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts                 # Tailwind with custom design tokens
├── tsconfig.json                      # Strict TypeScript
├── vercel.json                        # Vercel config + cron jobs
└── vitest.config.ts                   # Test config
```

---

## 4. Data Models (Drizzle Schema)

```typescript
// src/lib/db/schema.ts

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ============================================================
// NEIGHBORHOODS
// ============================================================

export const neighborhoods = sqliteTable('neighborhoods', {
  id: text('id').primaryKey(),           // e.g., 'enge', 'wiedikon'
  name: text('name').notNull(),
  kreis: integer('kreis').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  vibe: text('vibe').notNull(),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  // Scores (1-10)
  scoreCommute: real('score_commute').notNull(),
  scoreGym: real('score_gym').notNull(),
  scoreSocial: real('score_social').notNull(),
  scoreLake: real('score_lake').notNull(),
  scoreAirport: real('score_airport').notNull(),
  scoreFood: real('score_food').notNull(),
  scoreQuiet: real('score_quiet').notNull(),
  scoreTransit: real('score_transit').notNull(),
  // Score notes
  noteCommute: text('note_commute'),
  noteGym: text('note_gym'),
  noteSocial: text('note_social'),
  noteLake: text('note_lake'),
  noteAirport: text('note_airport'),
  noteFood: text('note_food'),
  noteQuiet: text('note_quiet'),
  noteTransit: text('note_transit'),
  // Rent ranges (stored as JSON strings for flexibility)
  rentStudioMin: integer('rent_studio_min'),
  rentStudioMax: integer('rent_studio_max'),
  rentOneBrMin: integer('rent_one_br_min'),
  rentOneBrMax: integer('rent_one_br_max'),
  rentTwoBrMin: integer('rent_two_br_min'),
  rentTwoBrMax: integer('rent_two_br_max'),
  // Metadata
  prosJson: text('pros_json'),           // JSON array of strings
  consJson: text('cons_json'),           // JSON array of strings
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// ============================================================
// VENUES (gyms, chess clubs, AI meetups, pools, restaurants)
// ============================================================

export const venues = sqliteTable('venues', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),          // 'gym' | 'chess' | 'ai_meetup' | 'swimming' | 'cycling' | 'restaurant' | 'social' | 'coworking'
  neighborhoodId: text('neighborhood_id').references(() => neighborhoods.id),
  address: text('address'),
  lat: real('lat'),
  lng: real('lng'),
  website: text('website'),
  openingHours: text('opening_hours'),
  personalNote: text('personal_note'),    // Why this matters to Peter
  monthlyPrice: real('monthly_price'),    // If applicable
  rating: real('rating'),                 // Personal rating 1-10
  tags: text('tags'),                     // JSON array: ['machines', 'group_classes', 'pool']
});

// ============================================================
// APARTMENTS (saved listings)
// ============================================================

export const apartments = sqliteTable('apartments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  address: text('address'),
  neighborhoodId: text('neighborhood_id').references(() => neighborhoods.id),
  kreis: integer('kreis'),
  rooms: real('rooms'),
  sqm: real('sqm'),
  rent: integer('rent'),                 // Monthly CHF
  utilities: integer('utilities'),        // Nebenkosten
  totalRent: integer('total_rent'),       // Rent + utilities
  floor: integer('floor'),
  hasBalcony: integer('has_balcony', { mode: 'boolean' }),
  hasElevator: integer('has_elevator', { mode: 'boolean' }),
  hasDishwasher: integer('has_dishwasher', { mode: 'boolean' }),
  availableFrom: text('available_from'),
  sourcePortal: text('source_portal'),    // 'homegate' | 'flatfox' | 'immoscout24' | 'ronorp'
  sourceUrl: text('source_url'),
  lat: real('lat'),
  lng: real('lng'),
  // Auto-generated scores
  overallScore: real('overall_score'),
  commuteMinutes: integer('commute_minutes'),
  nearestGym: text('nearest_gym'),
  nearestGymMinutes: integer('nearest_gym_minutes'),
  // Status tracking
  status: text('status').default('new'), // 'new' | 'interested' | 'contacted' | 'viewing_scheduled' | 'applied' | 'rejected' | 'accepted'
  notes: text('notes'),
  viewingDate: text('viewing_date'),
  // Timestamps
  savedAt: integer('saved_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// ============================================================
// BUDGET SCENARIOS
// ============================================================

export const budgetScenarios = sqliteTable('budget_scenarios', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  // All values in CHF
  rent: integer('rent').default(2400),
  healthInsurance: integer('health_insurance').default(350),
  foodDining: integer('food_dining').default(1075),
  transport: integer('transport').default(85),
  gym: integer('gym').default(100),
  electricity: integer('electricity').default(120),
  internet: integer('internet').default(110),
  flights: integer('flights').default(450),
  subscriptions: integer('subscriptions').default(200),
  misc: integer('misc').default(200),
  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

// ============================================================
// KATIE VISITS
// ============================================================

export const katieVisits = sqliteTable('katie_visits', {
  id: text('id').primaryKey(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  transportMode: text('transport_mode').default('flight'), // 'flight' | 'train'
  estimatedCost: integer('estimated_cost'),
  actualCost: integer('actual_cost'),
  notes: text('notes'),
  isConfirmed: integer('is_confirmed', { mode: 'boolean' }).default(false),
  calendarEventId: text('calendar_event_id'), // Google Calendar sync
});

// ============================================================
// CHECKLIST ITEMS
// ============================================================

export const checklistItems = sqliteTable('checklist_items', {
  id: text('id').primaryKey(),
  phase: text('phase').notNull(),        // 'mar-apr' | 'may' | 'jun' | 'jul'
  category: text('category'),            // 'apartment' | 'admin' | 'insurance' | 'move' | 'setup'
  title: text('title').notNull(),
  description: text('description'),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  dueDate: text('due_date'),
  sortOrder: integer('sort_order').default(0),
  url: text('url'),                      // Relevant link
});

// ============================================================
// DOSSIER DOCUMENTS
// ============================================================

export const dossierDocuments = sqliteTable('dossier_documents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),          // 'employment_contract' | 'payslip' | 'debt_register' | 'id' | 'reference' | 'intro_letter'
  status: text('status').default('missing'), // 'missing' | 'in_progress' | 'obtained' | 'uploaded'
  filePath: text('file_path'),
  notes: text('notes'),
  obtainedAt: integer('obtained_at', { mode: 'timestamp' }),
});

// ============================================================
// CURRENCY RATES (cached)
// ============================================================

export const currencyRates = sqliteTable('currency_rates', {
  id: text('id').primaryKey(),
  pair: text('pair').notNull(),          // 'CHF/EUR' | 'CHF/HUF' | 'EUR/HUF'
  rate: real('rate').notNull(),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' }),
});

// ============================================================
// AI CHAT HISTORY
// ============================================================

export const chatMessages = sqliteTable('chat_messages', {
  id: text('id').primaryKey(),
  role: text('role').notNull(),          // 'user' | 'assistant'
  content: text('content').notNull(),
  contextType: text('context_type'),     // 'neighborhood' | 'budget' | 'apartment' | 'general'
  contextId: text('context_id'),         // e.g., neighborhood slug
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

// ============================================================
// USER PREFERENCES
// ============================================================

export const preferences = sqliteTable('preferences', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),        // JSON-encoded
});
```

---

## 5. Feature Specifications (Ferrari Edition)

### 5.1 Dashboard (Home) - "Mission Control"
The nerve center. One glance tells you everything.

**Layout:** 4-column grid on desktop, responsive stack on mobile
- **Row 1:** Profile card | Countdown timer (days/hours/minutes to July 1) | Monthly surplus (big green number) | Savings rate gauge
- **Row 2:** Top 3 neighborhoods (mini radar charts) | Budget snapshot (stacked bar) | Apartment search pipeline (kanban-style: new/contacted/viewing/applied)
- **Row 3:** Next actions (top 5 unchecked items from checklist) | Next Katie visit countdown | Weather in Zurich now | CHF/EUR rate + 7-day sparkline
- **Status bar (persistent):** "118 days to Zurich | CHF 4,850/mo surplus | #1: Enge (8.7) | 3 apartments saved"

### 5.2 Neighborhood Intelligence - "The Oracle"
The core decision engine.

**Ranking View:**
- Left panel: Priority sliders (8 dimensions, 0-10 weight each)
  - Defaults: gym=10, social=10, commute=9, food=8, airport=7, quiet=7, lake=6, transit=6
  - Real-time re-ranking with animated position changes (Framer Motion layout animations)
- Main area: Ranked list of neighborhood cards
  - Each card: name, Kreis, weighted score, mini radar chart, rent range, top venue
  - Click to expand inline or navigate to deep-dive
- Right panel: Quick comparison (pin up to 3 neighborhoods)

**Comparison Mode:**
- Overlaid radar charts (D3 with transitions)
- Side-by-side table for every dimension
- Rent comparison chart (box plot showing ranges)
- "Winner" highlight per dimension

**Deep-Dive Page:**
- Full-width radar chart with score explanations on hover
- "If you live here" budget simulation (auto-fills rent with neighborhood median)
- MapLibre map showing: your apartment search radius, gyms, restaurants, social spots, office commute line
- Pros/cons in Peter's voice (direct, no fluff)
- One-click links to apartment portals pre-filtered for this Kreis
- AI insight: "Claude, what should I know about living in Enge?"

**Scoring Algorithm:**
```
weightedScore = sum(dimensionScore[i] * weight[i]) / sum(weight[i])
```
Transparent: show the math. Every number clickable to see breakdown.

### 5.3 Budget Simulator - "The Cockpit"

**Income Section (fixed):**
| Item | Monthly CHF |
|------|------------|
| Net salary | 11,450 |
| Expense allowance | 700 |
| **Total** | **12,150** |

**Fixed Costs Outside Zurich (read-only but visible):**
| Item | CHF |
|------|-----|
| Vienna rent share | 1,450 |
| Child support | 915 |
| Vienna utilities | 220 |
| Car insurance + OAMTC | 175 |
| **Subtotal** | **2,760** |

**Zurich Variable Costs (interactive sliders):**
- Rent: 1,500-3,500 (default 2,400) -- linked to neighborhood if selected
- Health insurance: 280-500 (default 350)
- Food & dining: 600-1,500 (default 1,075)
- ZVV transport: 85 (fixed, with note about BonusPass)
- Gym: 60-200 (default 100)
- Electricity/utilities: 80-200 (default 120)
- Internet + mobile: 80-180 (default 110)
- Zurich-Vienna flights: 300-700 (default 450)
- Subscriptions: 100-400 (default 200)
- Misc/unexpected: 100-500 (default 200)

**Outputs:**
- Giant surplus number (green/amber/red based on amount)
- Annual savings projection with compound interest toggle
- Savings rate percentage with gauge
- Stacked bar chart (income left, expenses right, surplus gap)
- 12-month forecast line chart
- What-if scenario cards:
  - "Katie visits 3x/month" -> shows flight cost impact
  - "2BR apartment for Katie visits" -> rent bump + comfort gain
  - "Eat out less (CHF 800/mo food)" -> savings boost
  - "Premium gym (Holmes Place CHF 180)" -> quality of life investment
- Amsterdam comparison: "Your old life cost X, your new life costs Y, you save Z more"
- Save scenario button -> persist to DB with name

### 5.4 Apartment Listings - "The Hangar"

**V1 - Portal Links:**
Pre-filtered URLs for each portal, based on top-ranked neighborhoods:
- homegate.ch: filtered by Kreis, 1-2 rooms, CHF 1,800-2,800
- flatfox.ch: same filters
- immoscout24.ch: same filters
- ronorp.net: community listings

**V1.5 - Manual Entry:**
- Form to manually save interesting apartments you find
- Fields: title, address, Kreis, rent, rooms, sqm, URL, notes
- Auto-assigns neighborhood based on Kreis
- Auto-calculates commute time (straight-line + transit estimate)
- Auto-calculates nearest gym

**V2 - Apartment Scoring Engine:**
Each saved apartment gets auto-scored:
```
apartmentScore = (
  neighborhoodScore * 0.4 +
  budgetFit * 0.2 +          // How well rent fits budget
  commuteFit * 0.15 +        // Minutes to Mythenquai
  gymProximity * 0.15 +      // Minutes to nearest quality gym
  amenityBonus * 0.1          // Balcony, elevator, dishwasher, floor
)
```

**V3 - Scraper (Stretch):**
- Cron job on Vercel (runs every 6 hours)
- Scrapes flatfox.ch (if API available) or uses RSS feeds
- Matches against criteria
- Sends notification if score > threshold

**Pipeline View:**
Kanban columns: New -> Interested -> Contacted -> Viewing -> Applied -> Result
- Drag & drop between columns
- Date tracking per stage
- Success/rejection rate dashboard

### 5.5 Katie Visit Planner - "The Bridge"

**Calendar View:**
- 6-month calendar (July-December 2026)
- Click to add visit blocks (typically Fri evening - Sun evening)
- Auto-calculates: visit count, total cost, average interval

**Cost Calculator:**
- Flight: avg CHF 200-250 return (adjustable)
- Train: CHF 80-120 with SBB Half-Fare (CHF 185/year)
  - Toggle: "Own SBB Half-Fare card?" -> applies 50% discount
- Airport transfer: included in ZVV pass
- Annual projection: visits * avg cost

**Key Dates Integration:**
- Katie's birthday: January 17 (mandatory visit, highlight)
- Austrian school holidays (pre-loaded)
- Peter's leave allocation: 35 days
- Swiss public holidays (shown as potential long-weekend visits)

**Optimization Engine:**
- Suggest optimal visit cadence to minimize cost while maximizing frequency
- Flag: "You have 4 weeks between visits in October - consider adding one"

### 5.6 Social Infrastructure Map - "The Grid"

**Interactive MapLibre Map:**
- Center: Quai Zurich Campus (office marker, always visible)
- Home marker: updates when apartment is selected/saved
- Category layers (toggle on/off):
  - Gyms (red): BLG Sports, John Reed, Indigo, Activ Fitness, Holmes Place, CrossFit Zurich
  - Chess (purple): ASK Reti, Savoy Chess Corner, Schachgesellschaft Zurich, Club Nimzowitsch
  - AI/Tech (blue): Zurich AI Meetup, ZurichAI (ETH), Global AI Zurich, GenAI Zurich, Swiss Data & AI
  - Swimming (cyan): Seebad Enge, Strandbad Wollishofen, Obere/Untere Letten, Strandbad Tiefenbrunnen
  - Cycling (green): TBD groups
  - Social/Expat (orange): Glocals, Impact Hub, City Mates, Social Circle Zurich
- Isochrone overlays: 5/10/15 minute walking radius from office or home
- Click venue -> popup with details, website link, personal note, distance

**Venue Detail Cards:**
Each venue includes:
- Name, type, address
- Opening hours (if known)
- Website link
- Personal note: "This has the cable machines and group classes I need"
- Distance from office (walking + transit)
- Monthly cost (if applicable)
- Tags: searchable in command palette

### 5.7 Move Checklist - "The Launchpad"

**Timeline View:**
- Horizontal timeline: March -> April -> May -> June -> July
- Vertical task lists per month
- Progress ring showing overall completion %
- Color coding: overdue (red), due soon (amber), on track (green), completed (muted)

**Tasks organized by category:**
- Apartment Search
- Administration & Legal
- Insurance
- Physical Move
- Zurich Setup
- Social & Life

**Dossier Document Tracker:**
Visual grid of required documents:
| Document | Status | Action |
|----------|--------|--------|
| Employment contract | Obtained | View |
| Last 3 pay slips | In Progress | Upload from ING |
| Debt register extract | Missing | Request from Amsterdam |
| Passport copy | Obtained | View |
| Landlord reference | Missing | Request from current landlord |
| Personal intro letter | Missing | Generate with AI |

AI Feature: "Generate intro letter" button -> Claude drafts a personalized landlord introduction letter based on Peter's profile.

### 5.8 AI Chat Assistant - "Pulse"

**Contextual AI powered by Claude:**
- Floating chat button (bottom right) or dedicated page
- Context-aware: knows what page you're on
  - On neighborhood page: "Tell me more about nightlife in Kreis 4"
  - On budget page: "What if I switch to a cheaper gym?"
  - On apartment page: "Analyze this listing description for red flags"
- Pre-built suggestion chips:
  - "Compare Enge vs Wiedikon for my lifestyle"
  - "Draft an apartment application email in German"
  - "What's the best strategy for apartment hunting in Zurich?"
  - "Explain the Swiss rental dossier process"
  - "Suggest a weekend itinerary for Katie's first visit"

**System prompt includes:**
- Peter's full profile, constraints, preferences
- Current top neighborhoods and scores
- Current budget state
- Saved apartment list

### 5.9 Command Palette (cmd+K) - "The Throttle"

Quick access to everything:
- **Navigation:** "Go to budget", "Open Enge", "Show checklist"
- **Actions:** "Add apartment", "New budget scenario", "Plan Katie visit"
- **Search:** "Find gyms near Wiedikon", "Chess clubs", "AI meetups"
- **Calculations:** "What's 2400 CHF in EUR?", "Commute from Wipkingen"
- **AI:** "Ask Pulse about..." -> opens AI chat with context
- **Shortcuts panel:** "?" shows all keyboard shortcuts

### 5.10 Weather Widget
- Current Zurich weather (OpenWeatherMap or MeteoSwiss)
- 7-day forecast
- Comparison: Zurich vs Vienna (for Katie visit planning)
- Seasonal context: "Lake swimming season: May-September"

### 5.11 Currency Dashboard
- Real-time CHF/EUR and CHF/HUF rates
- 30-day trend sparklines
- Quick converter (amount in any currency -> others)
- Alert: "EUR/CHF crossed 0.94 — favorable for Vienna transfers"
- Impact on budget: shows Vienna costs in current CHF equivalent

### 5.12 PWA & Offline Support
- Service worker for offline access to all data
- Installable on iPhone home screen
- Push notifications for:
  - New apartment matching criteria (V3)
  - Checklist deadline reminders
  - Currency rate alerts
  - Katie visit reminders

### 5.13 Export Engine
- PDF generation for apartment viewings:
  - Neighborhood comparison sheet
  - Budget summary
  - Personal dossier cover page
- CSV export for budget data
- Calendar export (.ics) for Katie visits

---

## 6. Design System

### Color Tokens (CSS Custom Properties)
```css
:root {
  /* Base - Slate dark */
  --bg-primary: #0f172a;       /* slate-900+ */
  --bg-secondary: #1e293b;     /* slate-800 */
  --bg-tertiary: #334155;      /* slate-700 */
  --bg-elevated: #1e293b;      /* cards, modals */

  /* Text */
  --text-primary: #f1f5f9;     /* slate-100 */
  --text-secondary: #94a3b8;   /* slate-400 */
  --text-tertiary: #64748b;    /* slate-500 */
  --text-muted: #475569;       /* slate-600 */

  /* Accent */
  --accent-primary: #3b82f6;   /* blue-500 - main brand */
  --accent-hover: #2563eb;     /* blue-600 */

  /* Semantic */
  --color-success: #22c55e;    /* green-500 - surplus, good scores */
  --color-warning: #f59e0b;    /* amber-500 - caution, medium scores */
  --color-danger: #ef4444;     /* red-500 - deficit, low scores, overdue */
  --color-info: #06b6d4;       /* cyan-500 - neutral info */

  /* Score gradient (1-10) */
  --score-1: #ef4444;
  --score-3: #f97316;
  --score-5: #f59e0b;
  --score-7: #84cc16;
  --score-9: #22c55e;
  --score-10: #10b981;

  /* Chart colors (8 dimensions) */
  --chart-commute: #3b82f6;
  --chart-gym: #ef4444;
  --chart-social: #f59e0b;
  --chart-lake: #06b6d4;
  --chart-airport: #8b5cf6;
  --chart-food: #f97316;
  --chart-quiet: #22c55e;
  --chart-transit: #ec4899;

  /* Borders */
  --border-default: #334155;
  --border-subtle: #1e293b;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Typography
```css
/* Headings: Warm serif */
.font-display {
  font-family: 'Playfair Display', Georgia, serif;
}

/* Data/numbers: Precise monospace */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* UI/body: Clean sans */
.font-sans {
  font-family: -apple-system, 'Inter', system-ui, sans-serif;
}
```

### Key Design Patterns
1. **Numbers are king:** Every number uses monospace font. Hover reveals context.
2. **Score badges:** Colored circles (1-10) with background gradient matching score.
3. **Sparklines everywhere:** Mini 7-day trends next to any time-series value.
4. **Card-based layout:** Consistent card component with subtle border, slight elevation.
5. **Keyboard hints:** Small kbd tags showing shortcuts next to interactive elements.
6. **Loading:** Skeleton shimmer animations matching exact content layout.
7. **Transitions:** Framer Motion layout animations for list reordering, page transitions.
8. **Data tables:** Alternating row backgrounds, sticky headers, sortable columns.
9. **Status indicators:** Dot + label (green=good, amber=attention, red=action needed).
10. **Bloomberg feel:** Dense grid, no wasted space, information-rich above the fold.

---

## 7. External APIs & Data Sources

### Apartment Portals (V1: Links, V2+: Integration)
| Portal | Access | Notes |
|--------|--------|-------|
| flatfox.ch | Public API exists (api.flatfox.ch) | Best API access of Swiss portals. JSON REST API, no auth for public listings |
| homegate.ch | No public API | Pre-filtered URL links only. Owned by SMG Swiss Marketplace Group |
| immoscout24.ch | No public API | Pre-filtered URL links. Also SMG |
| ronorp.net | No API | Community forum, manual only |
| comparis.ch | No public API | Comparison portal, good for research |

### Swiss Open Data
| Source | URL | Data |
|--------|-----|------|
| Zurich Open Data | data.stadt-zuerich.ch | Noise maps, demographics, district boundaries, POIs |
| Swiss Transport API | transport.opendata.ch | SBB/ZVV connections, real-time departures. Free, no auth. |
| Swisstopo | api3.geo.admin.ch | Swiss geodata, boundaries, elevation |
| BFS (Federal Statistics) | bfs.admin.ch | Demographics, cost of living indices |

### Other APIs
| Service | Purpose | Access |
|---------|---------|--------|
| OpenWeatherMap | Weather data | Free tier: 1000 calls/day |
| ExchangeRate-API | CHF/EUR/HUF | Free tier: 1500 calls/month |
| Anthropic Claude API | AI assistant | Pay-per-use, ~$3/MTok input for Sonnet |
| MapLibre + OpenFreeMap | Map tiles | Free, self-hosted tiles available |
| Google Calendar API | Katie visit sync | OAuth, free |

### Zurich GeoJSON
- District boundaries: Available from Zurich Open Data portal (data.stadt-zuerich.ch)
- Dataset: "Statistische Quartiere" or "Stadtkreise"
- Format: GeoJSON, freely downloadable

---

## 8. Implementation Phases

### Phase 0: Foundation (Day 1)
- [ ] Initialize Next.js 15 project with TypeScript strict
- [ ] Configure pnpm, Biome, Tailwind CSS 4
- [ ] Install and configure shadcn/ui
- [ ] Set up Drizzle ORM with libSQL (local SQLite)
- [ ] Configure tRPC with React Query
- [ ] Set up project structure (all folders)
- [ ] Create design tokens (CSS custom properties)
- [ ] Load fonts (JetBrains Mono, Playfair Display)
- [ ] Build app shell: sidebar + header + status bar
- [ ] Implement command palette (cmdk)
- [ ] Git init + first commit

### Phase 1: Neighborhoods (Core Feature)
- [ ] Seed 10 neighborhoods with realistic data and scores
- [ ] Build priority sliders component
- [ ] Implement weighted scoring engine
- [ ] Create radar chart (D3.js)
- [ ] Build neighborhood cards with ranking
- [ ] Animated re-ranking on slider change
- [ ] Comparison mode (select 2-3, overlaid radars)
- [ ] Deep-dive page per neighborhood
- [ ] Pre-filtered portal links

### Phase 2: Budget Simulator
- [ ] Build income section (static)
- [ ] Build expense sliders (interactive)
- [ ] Implement budget calculation engine
- [ ] Create surplus display component
- [ ] Build stacked bar chart (Recharts)
- [ ] 12-month projection chart
- [ ] What-if scenario toggles
- [ ] Save/load scenarios (DB persistence)
- [ ] Amsterdam comparison view

### Phase 3: Dashboard
- [ ] Compose dashboard from neighborhood + budget data
- [ ] Profile card
- [ ] Countdown timer (real-time)
- [ ] Quick stats KPI row
- [ ] Top 3 neighborhoods mini cards
- [ ] Budget snapshot
- [ ] Next actions from checklist
- [ ] Weather widget (OpenWeatherMap integration)
- [ ] Currency rate card with sparkline

### Phase 4: Katie Visit Planner
- [ ] Build calendar component
- [ ] Visit cost calculator
- [ ] Flight vs train toggle
- [ ] Annual projection chart
- [ ] Key dates integration
- [ ] SBB Half-Fare toggle

### Phase 5: Social Infrastructure Map
- [ ] Integrate MapLibre GL JS
- [ ] Load Zurich GeoJSON boundaries
- [ ] Seed venue data (all venues from prompt)
- [ ] Build category filter tabs
- [ ] Venue popup cards
- [ ] Distance calculations from office
- [ ] Isochrone overlays (walking radius)

### Phase 6: Move Checklist & Dossier
- [ ] Seed all checklist items
- [ ] Build timeline view
- [ ] Task completion tracking (DB persistence)
- [ ] Dossier document tracker
- [ ] Progress ring component
- [ ] Drag & drop reordering (dnd-kit)

### Phase 7: Apartments Aggregator
- [ ] Build manual listing entry form
- [ ] Listing cards with score badges
- [ ] Apartment scoring engine
- [ ] Budget impact calculator per listing
- [ ] Pipeline/kanban view
- [ ] Map view of saved listings

### Phase 8: AI Integration
- [ ] Set up Anthropic SDK
- [ ] Build chat interface
- [ ] Context-aware system prompts
- [ ] Suggestion chips
- [ ] AI intro letter generator
- [ ] AI apartment analysis

### Phase 9: Polish & Extras
- [ ] Full keyboard shortcut system
- [ ] PWA manifest + service worker
- [ ] PDF export engine
- [ ] Currency dashboard page
- [ ] Sentry error tracking
- [ ] PostHog analytics
- [ ] Performance optimization
- [ ] Mobile responsive polish
- [ ] Deploy to Vercel

---

## 9. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `G then D` | Go to Dashboard |
| `G then N` | Go to Neighborhoods |
| `G then B` | Go to Budget |
| `G then A` | Go to Apartments |
| `G then K` | Go to Katie planner |
| `G then S` | Go to Social map |
| `G then C` | Go to Checklist |
| `G then I` | Go to AI Chat |
| `?` | Show all shortcuts |
| `[` | Collapse sidebar |
| `/` | Focus search |
| `1-3` | Pin neighborhood to comparison (on rankings page) |
| `Esc` | Close modal/palette |
| `J/K` | Navigate list items |
| `Enter` | Open selected item |

---

## 10. Environment Variables

```env
# Database
DATABASE_URL=file:./local.db
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Maps
MAPLIBRE_STYLE_URL=https://tiles.openfreemap.org/styles/liberty

# Weather
OPENWEATHER_API_KEY=your-key

# Currency
EXCHANGE_RATE_API_KEY=your-key

# Calendar (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Analytics (optional)
POSTHOG_KEY=phc_...
SENTRY_DSN=https://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 2.0s |
| Cumulative Layout Shift | < 0.05 |
| Interaction to Next Paint | < 100ms |
| Bundle size (initial) | < 150KB gzipped |
| Lighthouse score | 95+ |
| Time to Interactive | < 2.5s |

---

## 12. What Makes This a Ferrari

1. **Command Palette:** Navigate the entire app without touching the mouse
2. **AI Assistant:** Claude knows your entire life situation and gives personalized advice
3. **Real-time Scoring:** Move a slider, watch 10 neighborhoods re-rank with smooth animations
4. **Budget Impact:** See exactly how any apartment choice ripples through your entire financial picture
5. **Data Density:** More useful information per pixel than any dashboard you've used
6. **Offline First:** Works without internet (PWA + local SQLite)
7. **Bloomberg Aesthetic:** Dark, precise, monospace numbers, sparklines everywhere
8. **Export Engine:** Generate PDF dossier materials, comparison sheets for viewings
9. **Pipeline Tracking:** Kanban board for apartment applications, never lose track
10. **Everything Connected:** Budget links to neighborhoods links to apartments links to social venues — one change propagates everywhere
