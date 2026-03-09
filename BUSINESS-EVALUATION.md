# QuaiPulse - Comprehensive Application Description
## For Business Evaluation

---

## 1. Executive Summary

**QuaiPulse** is a personal life-management command center built for international relocation. Currently configured for a single user (Peter Blazsik, 49, relocating from Vienna to Zurich for Zurich Insurance Group), it functions as a Bloomberg Terminal-grade personal dashboard that unifies neighborhood intelligence, financial planning, family logistics, health optimization, social integration, and administrative task management into one keyboard-driven, data-dense web application.

The application demonstrates a full-stack product concept: **an AI-powered relocation intelligence platform** that could be generalized into a SaaS product for corporate relocation programs, expat communities, or individual professionals moving internationally.

**Key Numbers:**
- 19 pages / modules
- 5 proprietary calculation engines
- 12 data files with 500+ curated data points
- 11 persistent state stores
- 334 automated tests
- 30+ Zurich neighborhoods scored across 12 dimensions
- 150+ venues mapped and categorized
- 100+ Swiss German phrases with spaced repetition
- 80+ move checklist items with dependency graphs

---

## 2. Product Vision & Problem Statement

### The Problem
International relocation is one of life's most complex logistical undertakings. A professional moving to a new city faces dozens of parallel decision streams: where to live, how to budget in a new currency, how to maintain family relationships across borders, how to build a social network from zero, how to navigate unfamiliar administrative systems, and how to maintain physical and mental health during the transition. These decisions are deeply interconnected - your neighborhood choice affects your commute, gym access, social life, and rent, which affects your budget, which affects how often you can visit family.

No existing tool addresses this holistically. People use spreadsheets, Google Maps, WhatsApp groups, and scattered websites - losing the connections between decisions.

### The Vision
A single intelligent platform where every relocation decision is interconnected, data-driven, and optimized for the individual's specific constraints and priorities. Every number is interactive. Every recommendation is personalized. Every trade-off is made visible.

---

## 3. Feature Inventory

### 3.1 Dashboard (Mission Control)
The entry point surfaces a move countdown, key performance indicators (monthly surplus, savings rate, mission readiness), top-ranked neighborhoods based on real-time priority weights, budget snapshot, and quick links to active workflows. Functions as a single-screen executive summary of the entire relocation.

### 3.2 Neighborhood Intelligence Engine
The flagship module. 30+ Zurich neighborhoods scored across 12 weighted dimensions (commute, gym access, social life, lake proximity, airport access, food scene, quiet living, public transit, affordability, safety, flight noise, parking). Users adjust priority sliders in real-time and watch neighborhood rankings recompute instantly. Each neighborhood has:
- Radar chart visualization of all 12 dimensions
- Rent ranges by apartment size (studio, 1BR, 2BR)
- Pros/cons analysis
- Nearby venues by category
- Pre-filtered links to 4 major Swiss apartment portals (ImmoScout24, Homegate, Flatfox, Immobilio)
- Vim-style keyboard navigation (J/K to navigate, Enter to expand)

A **comparison mode** allows side-by-side analysis of 2-4 neighborhoods with overlaid radar charts, dimension-by-dimension animated bars, rent tables, and a pros/cons matrix.

### 3.3 Budget Simulator
Interactive financial planning with CHF 12,150/month net income modeling. Features:
- 10 adjustable expense categories with real-time surplus recalculation
- Fixed cross-border costs (Vienna rent, child support, utilities, car insurance)
- 12-month cumulative savings projection chart
- 5 pre-built what-if scenarios (e.g., "Katie visits 3x/month", "upgrade to 2BR", "frugal mode")
- CSV export for financial records

### 3.4 Apartment Pipeline Tracker
A personal CRM for apartment hunting with a Kanban-style workflow (New > Interested > Contacted > Viewing > Applied > Rejected > Accepted). Includes pre-filtered portal search links by target neighborhoods and a structured listing form.

### 3.5 Flight Optimizer (Katie Visits)
Flight cost optimization for regular Vienna visits. Features a 12-month price heatmap colored by demand level, booking window analysis with savings percentages, airline comparison table (6 carriers), day-of-week pricing analysis, and an overlay showing planned visit dates. Supports ZRH-VIE and ZRH-BUD routes.

### 3.6 Gym Finder
Specialized gym discovery with a **knee-safety scoring system** - each gym's equipment is rated for knee-friendliness (safe/caution/avoid), critical for the user's bilateral meniscus damage and torn ACL. Side-by-side comparison of up to 3 gyms, filtering by equipment, price range, and knee-safe mode.

### 3.7 Sleep Optimization System
A research-backed sleep tracking and protocol library system. Two interconnected modules:

**Sleep Tracker:** 6 rolling KPI cards (hours, quality, latency, awakenings, best location, best supplement), 30-day trend chart, multi-factor entry logging (supplements, interventions, bedtime, latency, awakenings), and three correlation analysis panels showing the impact of location, supplements, and interventions on sleep quality with delta scoring.

**Protocol Library:** Evidence-tiered supplement database (18 supplements across 3 evidence tiers), 4 pre-built stacking protocols with monthly CHF costs, 15 non-supplement interventions across 7 categories (exercise, breathing, meditation, environment, nutrition, technology, CBT-i), and a visual evening routine timeline from T-180 to T-0. Every recommendation includes mechanism of action, dosage, evidence citations, interaction warnings, and cycling requirements.

### 3.8 Language Preparation
Swiss German flashcard system using the SM-2 spaced repetition algorithm. 100+ phrases across 9 categories (greetings, office, shopping, dining, transit, social, emergency, culture, smalltalk), each with Swiss German, Standard German, English translation, pronunciation guide, and cultural context notes. Daily phrase of the day, mastery tracking, and category-based practice sessions.

### 3.9 Subscription Manager
Austria-to-Switzerland subscription cost triage. 25+ subscriptions across 8 categories displayed in a Kanban board (Keep/Cut/Replace/Undecided). Each subscription shows current EUR cost, projected CHF cost, Swiss alternatives with pricing, and the delta. Includes category-level donut chart spending visualization and total savings projections.

### 3.10 Social Infrastructure Map
Dual list/map view of 150+ venues (gyms, chess clubs, AI/tech meetups, swimming, restaurants, coworking spaces) with category filtering, star ratings, personal notes, and neighborhood grouping. Map view uses MapLibre GL JS with venue clustering.

### 3.11 Katie Visit Planner
Daughter visit planning and cost projection for 8 pre-planned visits (July-December 2026). Interactive calendar view, transport mode selection (flight vs. train), Halbtax half-fare toggle for Swiss rail discounts, per-visit and monthly cost breakdowns, and special occasion labeling.

### 3.12 Move Checklist
80+ items across 4 phases (Mar-Apr, May, Jun, Jul) with a full dependency graph engine. Features critical path analysis, phase gate blocking (can't proceed to next phase until prerequisites met), hard deadline tracking, dual view (list and timeline), and clickable external links to relevant services. Items include visa applications, rental dossier preparation, utility setup, bank accounts, and Anmeldung registration.

### 3.13 Pulse AI (Chat Assistant)
Context-aware AI chat powered by Google Gemini with streaming responses. The assistant has access to the user's full profile, priorities, budget constraints, and neighborhood preferences. Supports Markdown rendering, message persistence, suggestion chips for first-time users, and conversation clearing. Server-sent events for real-time streaming.

### 3.14 Settings & Configuration
User profile display, theme switching (dark/light/system), API key management, keyboard shortcut reference, data management (reset individual stores), and multi-format export (Budget CSV, Rankings CSV, Katie visits iCalendar, full JSON backup).

### 3.15 Supporting Modules
- **Currency Converter:** Real-time EUR/CHF conversion via Frankfurter API
- **Weather Dashboard:** Zurich weather conditions via Open-Meteo API

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, file-based routing, SSE streaming |
| Language | TypeScript 5 (strict) | Full type safety, zero `any` usage |
| Styling | Tailwind CSS 4 + CSS custom properties | Design token system, dark-mode-first |
| UI Components | Radix primitives + custom components | Accessible, unstyled building blocks |
| State Management | Zustand 5 + persist middleware | 11 stores with localStorage persistence |
| Charts | Recharts 3 + custom SVG | Data visualization, trend charts, radar charts |
| Maps | MapLibre GL JS | Vector tile maps, venue clustering |
| Command Palette | cmdk | Keyboard-first navigation (Cmd+K) |
| Animations | Framer Motion 12 | Layout animations, staggered entrances, gesture support |
| AI Integration | Google Gemini API | Streaming chat, context-aware responses |
| Markdown | react-markdown | Rich text rendering in AI chat |
| Validation | Zod 4 | Runtime type validation |
| Date Handling | date-fns 4 | Date formatting, calculations |
| Testing | Vitest 4 + Testing Library | 334 unit tests, JSDOM environment |
| Icons | Lucide React | Tree-shakeable icon library |
| Package Manager | pnpm | Fast, disk-efficient |

### 4.2 Application Architecture

```
src/
  app/                    # 19 route pages (Next.js App Router)
    page.tsx              # Dashboard
    neighborhoods/        # 3 pages: list, detail [slug], compare
    budget/page.tsx       # Budget simulator
    apartments/page.tsx   # Apartment pipeline
    flights/page.tsx      # Flight optimizer
    gym-finder/page.tsx   # Knee-safe gym search
    sleep/                # 2 pages: tracker, protocol library
    language/page.tsx     # Swiss German flashcards
    subscriptions/page.tsx # Subscription triage
    social/page.tsx       # Venue discovery + map
    katie/page.tsx        # Visit planner
    checklist/page.tsx    # Move checklist + dependency graph
    ai/page.tsx           # AI chat assistant
    settings/page.tsx     # Configuration + exports
    currency/page.tsx     # EUR/CHF converter
    weather/page.tsx      # Weather dashboard

  components/
    layout/               # AppShell, Header, Sidebar, StatusBar, CommandPalette, KeyboardHelp, ThemeSelector, ErrorBoundary
    neighborhoods/        # NeighborhoodCard, RadarChart, ScoreBadge, ScoreBreakdown, PrioritySliders, VenueCard, CompareHeroCards, ProsConsMatrix, RentComparisonTable
    budget/               # IncomeSection, ExpenseSliders, SurplusDisplay, StackedBar, SavingsProjection, WhatIfCards
    apartments/           # ApartmentCard, AddListingForm
    katie/                # CalendarGrid
    social/               # VenueMap (lazy-loaded MapLibre)
    shared/               # RentCard

  lib/
    engines/              # 5 calculation engines
      scoring.ts          # 12-dimension weighted neighborhood ranking
      budget-calculator.ts # Income/expense/surplus/projection calculator
      flight-recommender.ts # Multi-factor flight booking optimizer
      spaced-repetition.ts # SM-2 algorithm for language learning
      checklist-engine.ts  # Dependency graph + critical path analysis

    stores/               # 11 Zustand persistent stores
      priority-store.ts   # Neighborhood dimension weights
      budget-store.ts     # Expense values
      apartment-store.ts  # Apartment listings + pipeline status
      sleep-store.ts      # Sleep entries with supplements/interventions
      language-store.ts   # Flashcard states + spaced repetition
      checklist-store.ts  # Item completion tracking
      subscription-store.ts # Subscription triage decisions
      katie-store.ts      # Visit calendar + costs
      chat-store.ts       # AI message history
      compare-store.ts    # Neighborhood comparison selection
      ui-store.ts         # Sidebar, command palette state

    data/                 # 12 curated data files
      neighborhoods.ts    # 30+ neighborhoods with 12-dimension scores
      gyms.ts             # 12+ gyms with knee-safety equipment ratings
      venues.ts           # 150+ venues across 8 categories
      flights.ts          # 6 airlines, pricing data, booking windows
      sleep-defaults.ts   # 18 supplements, 15 interventions, 4 stacks, evening routine
      checklist-items.ts  # 80+ items, 4 phases, dependency graph
      phrases.ts          # 100+ Swiss German phrases with pronunciation
      subscriptions.ts    # 25+ subscriptions with AT/CH cost comparison
      katie-visits.ts     # 8 planned visits with cost defaults
      portal-urls.ts      # 4 apartment portals with kreis filters
      venue-config.ts     # Venue type configuration
      images.ts           # Hero and category image references

  hooks/
    use-keyboard-shortcuts.ts  # Vim-style chords (G+letter), single keys, input awareness
```

### 4.3 State Management Pattern

All client state follows a consistent pattern:
1. **Zustand store** with TypeScript interface
2. **persist middleware** writing to localStorage (survives page reloads)
3. **Demo/seed data** generated on first load for immediate usability
4. **CRUD operations** (add, remove, update) exposed as store actions
5. **Pure calculation engines** consume store data without side effects
6. **Components** subscribe to stores with selector functions (minimal re-renders)

### 4.4 Design System ("Obsidian Dark")

A comprehensive, custom design system documented in 500 lines:

- **Color Tokens:** 20+ CSS custom properties for backgrounds, text, accents, semantic colors, and a 10-point score gradient
- **Two Themes:** Midnight Blue (default) and Obsidian Gold (alternate), plus light mode
- **Typography:** Three-font system - Playfair Display (display headings), JetBrains Mono (data/numbers), Inter (UI text)
- **Elevation System:** 3 levels inspired by Material Design 3 dark mode, with glassmorphism for header and sidebar
- **Card System:** Base, Interactive (hover lift + accent glow), and Hero (image background) variants
- **Background Patterns:** Dot grid overlay and noise texture for depth
- **Ambient Glows:** 8 color variants for page-context atmospheric lighting
- **Animations:** Framer Motion staggered entrances, progress bar shimmer, skeleton loading, with `prefers-reduced-motion` support

### 4.5 Keyboard-First UX

The application is designed for power users:
- **Chord navigation:** Press G then a letter to jump to any page (G+N = Neighborhoods, G+B = Budget, etc.) - 13 chord shortcuts
- **Command palette:** Cmd+K opens a searchable command palette (cmdk library) with all 16 navigable pages
- **Vim-style list navigation:** J/K keys to move through neighborhood list, Enter to expand
- **Sidebar toggle:** `[` key
- **Help overlay:** `?` key shows all keyboard shortcuts
- **Input awareness:** Shortcuts are automatically disabled when typing in form fields

### 4.6 Testing

- **334 automated tests** across 13 test files
- **Vitest** test runner with JSDOM environment
- Test coverage includes:
  - All 5 calculation engines (scoring, budget, flights, spaced repetition, checklist)
  - All data file integrity (neighborhoods, venues, checklist items, sleep defaults, gyms)
  - All store CRUD operations (sleep, apartments, katie, chat, gym filter, checklist, subscriptions)
  - Export functions (CSV, JSON)
  - Utility functions

### 4.7 Accessibility

- Skip-to-content link
- Focus-visible rings on all interactive elements
- ARIA roles on custom components (dialog, listbox, option)
- Focus trap in modals and command palette
- `prefers-reduced-motion` media query respected
- Semantic HTML throughout
- Color contrast ratios meeting WCAG guidelines
- Screen reader-friendly labels

---

## 5. UI/UX Design Philosophy

### 5.1 Design Principles

1. **Data Density Over Minimalism:** Inspired by Bloomberg Terminal and financial trading dashboards. Every pixel carries information. White space is deliberate, not filler.

2. **Every Number Is Interactive:** Scores, costs, dates, and metrics are hoverable, clickable, or adjustable. No static displays - the user can always drill deeper or adjust.

3. **Keyboard-First, Mouse-Compatible:** Power users navigate entirely by keyboard (chords, Vim keys, command palette). Mouse/touch works naturally for casual use.

4. **Dark Mode as Default:** Optimized for extended use sessions. Reduced eye strain. Premium aesthetic. Light mode available as secondary option.

5. **Transparent Algorithms:** The neighborhood scoring formula is fully visible. Users see exactly which weights produce which rankings. No black boxes.

6. **Contextual Intelligence:** Data flows between modules. Flight prices integrate with Katie visit dates. Neighborhood scores affect apartment search. Budget reflects real-time slider changes.

### 5.2 Layout Architecture

- **App Shell:** Fixed sidebar (collapsible) + fixed header (glassmorphism) + scrollable main content + status bar
- **Three-Column Layouts:** Heavy data pages (Budget, Neighborhoods) use sticky sidebars for controls with scrollable center content
- **Card Grid System:** Responsive CSS Grid layouts that adapt from 1 column (mobile) to 2-4 columns (desktop)
- **Dot Grid Background:** Subtle pattern behind all content for visual depth
- **Ambient Glow:** Each page has a contextual color glow (blue for neighborhoods, green for budget, purple for sleep) creating visual identity per module

### 5.3 Interaction Patterns

- **Real-time Computation:** Slider drags trigger instant recalculation (no submit buttons)
- **Staggered Animations:** Cards enter with 50ms delays creating a cascade effect
- **Hover Lift:** Interactive cards rise 1px with accent glow on hover
- **Expandable Cards:** Click to reveal detail panels with smooth height animation
- **Toggle Filters:** Pill-style filter buttons for categories, tiers, and statuses
- **Inline Editing:** Edit/delete actions appear on hover for sleep entries and apartment listings

---

## 6. Business Concept & Market Opportunity

### 6.1 Current State: Personal Tool
QuaiPulse is currently a single-user application with hardcoded personal data (income, family situation, health constraints). It demonstrates the concept at maximum depth for one use case.

### 6.2 Generalized Product Vision: "QuaiPulse for Everyone"

**Target Market:** The global corporate relocation industry is valued at $20+ billion annually. 3.5 million professionals relocate internationally each year. Corporate HR departments spend $50,000-$100,000+ per employee relocation.

**Product Tiers:**

| Tier | Target | Pricing Model | Features |
|---|---|---|---|
| **Free** | Individual expats | Freemium | Basic neighborhood scoring, budget calculator, checklist template |
| **Pro** | Professionals relocating | $29/month or $199/year | Full feature set, AI assistant, custom priorities, data export, multiple cities |
| **Enterprise** | Corporate HR / relocation firms | Per-seat licensing ($99/employee) | Bulk provisioning, company-specific data, policy compliance, reporting dashboards, API access |

### 6.3 Generalization Path

To transform from single-user to multi-user SaaS:

1. **City Database:** Replace hardcoded Zurich data with a multi-city database (Zurich, London, Singapore, NYC, Berlin, Dubai, etc.). Each city: neighborhoods, venues, rent data, transit scores, safety indices.

2. **User Profiles:** Replace hardcoded personal data with user onboarding flow: income, family situation, health constraints, priorities, origin city, destination city, move date.

3. **Dynamic Scoring Engine:** The 12-dimension weighted scoring engine already works generically. Feed it any city's neighborhood data and it produces personalized rankings.

4. **Authentication & Multi-tenancy:** Add Clerk/Auth.js authentication, Postgres/Turso database, per-user data isolation.

5. **Corporate Features:** Admin dashboards, batch employee provisioning, relocation policy guardrails (e.g., "rent must be < 30% of gross salary"), compliance checklists by country, expense reporting integration.

6. **API Layer:** Expose neighborhood scoring, budget calculation, and checklist engines as APIs for integration with existing HR platforms (SAP SuccessFactors, Workday, etc.).

### 6.4 Competitive Landscape

| Competitor | What They Do | QuaiPulse Advantage |
|---|---|---|
| **Numbeo** | Cost-of-living comparison | QuaiPulse adds personalized scoring, not just averages |
| **Expatica** | Expat guides and articles | QuaiPulse is interactive and data-driven, not editorial |
| **Relocity** | Corporate relocation services | QuaiPulse is self-service, lower cost, always available |
| **Movinga** | Moving logistics only | QuaiPulse covers the full lifecycle, not just the physical move |
| **Google Maps** | Venue and transit info | QuaiPulse integrates venues into a scoring and decision framework |
| **Notion/Spreadsheets** | Generic project management | QuaiPulse has domain-specific engines (scoring, budget, flight optimization) |

**Key Differentiators:**
1. **Interconnected intelligence** - neighborhood choice flows into budget, which flows into savings projections, which informs flight frequency
2. **Personalized weighted scoring** - not "best neighborhoods" but "best neighborhoods *for you*"
3. **Health constraint awareness** - knee-safe gym finder, sleep optimization for medical conditions
4. **Family logistics integration** - visit planning with cost optimization built in
5. **Keyboard-first power UX** - Bloomberg Terminal grade, not consumer-app simplicity

### 6.5 Revenue Projections (Illustrative)

| Year | Users | ARR | Notes |
|---|---|---|---|
| Year 1 | 5,000 free / 500 Pro / 2 Enterprise | $180K | Launch with Zurich + 5 major cities |
| Year 2 | 25,000 free / 2,500 Pro / 15 Enterprise | $1.1M | 20 cities, API marketplace |
| Year 3 | 100,000 free / 10,000 Pro / 50 Enterprise | $4.5M | 50 cities, corporate partnerships |

### 6.6 Moat & Defensibility

1. **Curated local data** - neighborhood scores, venue databases, and local knowledge are expensive to replicate at quality
2. **Proprietary engines** - the weighted scoring, budget simulation, and dependency graph engines encode domain expertise
3. **Network effects** - user-contributed venue reviews and neighborhood insights improve data quality over time
4. **Enterprise switching costs** - once integrated into corporate relocation workflows, switching is expensive
5. **AI context accumulation** - the AI assistant learns from user interactions across the platform

---

## 7. Technical Quality Indicators

| Metric | Value |
|---|---|
| Test count | 334 passing |
| Test coverage areas | Engines, stores, data integrity, exports, utilities |
| Type safety | TypeScript strict mode, zero `any` |
| Build status | Clean (zero warnings) |
| Accessibility | Skip-to-content, focus rings, ARIA roles, reduced motion |
| Performance | Lazy-loaded maps, code-split routes, Suspense boundaries |
| Security | Zod input validation, sanitized API keys, CSP-ready |
| Code organization | 19 pages, 29 components, 5 engines, 11 stores, 12 data files |
| Design system | 500-line documented system with 2 themes |
| Keyboard shortcuts | 13 chord shortcuts + command palette + Vim navigation |

---

## 8. Summary

QuaiPulse is a Ferrari-grade personal command center that demonstrates what a data-driven, AI-enhanced relocation platform can be. It combines the analytical depth of a Bloomberg Terminal with the personal specificity of a bespoke consulting engagement - all running as a modern web application.

As a personal tool, it solves a real and complex problem comprehensively. As a business concept, it sits at the intersection of a $20B+ corporate relocation market with no dominant software player. The technical architecture (weighted scoring engines, dependency graph analysis, spaced repetition algorithms, multi-factor optimization) is generalizable to any city and any user profile.

The application represents approximately 15,000+ lines of production TypeScript across 80+ files, with a custom design system, 5 proprietary calculation engines, and 334 automated tests - demonstrating both the depth of the domain solution and the engineering quality required to scale it.

---

*Document generated from codebase analysis of QuaiPulse v0.1.0*
*19 pages | 5 engines | 11 stores | 334 tests | 30+ neighborhoods | 150+ venues | 100+ phrases*
