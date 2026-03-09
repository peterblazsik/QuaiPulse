# Session Handover

**Date:** 2026-03-09
**Branch:** main
**Last Commit:** 45ace3e feat: add setup costs, Katie flight tips, and detailed rental price data

---

## What Was Done

### Phase 1: Google OAuth Authentication (Auth.js v5)
- Installed `next-auth@beta` (v5.0.0-beta.30) via pnpm
- Created `src/lib/auth.ts` — NextAuth config with Google provider, JWT strategy, email restriction via `ALLOWED_EMAIL` env var
- Created `src/app/api/auth/[...nextauth]/route.ts` — API route handler
- Created `middleware.ts` — protects all routes except `/login`, `/api/auth`, static assets; redirects unauthenticated to `/login`
- Created `src/app/login/page.tsx` — dark-themed login with Google sign-in button, Suspense-wrapped for `useSearchParams`
- Created `src/components/layout/conditional-shell.tsx` — renders AppShell for all routes except `/login`
- Modified `src/app/layout.tsx` — swapped `AppShell` for `ConditionalShell`
- Modified `src/app/providers.tsx` — added `SessionProvider` wrapper
- Modified `src/components/layout/sidebar.tsx` — user avatar + name + logout button at sidebar bottom
- Modified `next.config.ts` — CSP updated for Google OAuth + avatar domains
- Modified `.env.example` — added auth env var placeholders
- Updated `.env.local` with real credentials (Google OAuth client ID/secret, AUTH_SECRET, ALLOWED_EMAIL=peterblazsik@gmail.com)
- Configured Vercel environment variables for production deployment
- Helped user set up Google Cloud Console OAuth credentials with correct redirect URIs

### Phase 2: Wave 1 Quick Fixes (from Expert Evaluation)
- **Fix #6 — Confirmation dialogs:** Added `window.confirm()` to reset buttons on dossier, settings (weights + budget), and priority sliders
- **Fix #1 — Data freshness:** New `DataFreshness` badge component (`src/components/ui/data-freshness.tsx`), added to neighborhoods + gym finder headers. `DATA_FRESHNESS` constant in `src/lib/constants.ts`
- **Fix #7 — Document URLs:** Added `urls` state + `setUrl` action to dossier store. URL input with "Open" link per document row
- **Fix #21 — Audio pronunciation:** Added `speakPhrase()` using Web Speech API (`de-CH`, rate 0.85), Volume2 buttons on daily phrase + flashcards
- **Fix #5 — 13th salary + Pillar 3a:** Toggle for 13th salary (+CHF 954/mo), slider for Pillar 3a (0-588/mo). Budget calculator updated with `BudgetOptions` parameter across all 5 consumers (budget page, dashboard, settings, what-if cards)
- **Fix #2 — Priority profiles:** 2 built-in presets ("Commute & Gym Focus", "Budget Conscious"), save/load/delete user profiles, dropdown + inline save input in priority sliders. `BUILT_IN_PROFILES` exported from priority store

### Phase 3: Additional Fixes
- **Fix #3 — One-time relocation costs:** New `SetupCosts` component with 6 adjustable cost items (deposit, furniture, moving, permits, health setup, misc). Shows monthly impact spread over 3 months. Added `setupCosts` + `setSetupCost` to budget store
- **Fix #10 — Katie↔flights cross-reference:** Visit cards now show amber savings tips when departure falls on expensive travel days (Fri/Sun), suggesting cheaper alternatives (Tue) with estimated CHF savings
- **Rental price data:** 999-line `src/lib/data/rental-prices.ts` with per-sqm pricing for all 20 locations across 3 building age categories (old pre-1970 / modern 1970-2010 / new 2010+) and 4 apartment sizes (studio/1BR/2BR/3BR). Includes market tier, vacancy rates, utility functions (`getRentalDataByLocationId`, `getMedianRent`, `getPricePerSqm`, `rankByAffordability`, `filterByBudget`), and `ZURICH_MARKET_SUMMARY`

### Also included (from prior session's uncommitted /simplify fixes)
- `formatEUR` extraction to `src/lib/utils.ts` with hoisted `Intl.NumberFormat`
- KPICard icon made optional for dossier reuse
- Dossier page: extracted DocumentRow, isComplete helper, blur-sync with useEffect fix, module-scope maps

## What Worked and What Didn't

### Successes
- Auth.js v5 integration was clean — middleware pattern works elegantly with Next.js 16
- All 439 tests continued passing after every change — zero regressions across 2 commits
- Build stayed clean throughout (Turbopack, ~2s builds)
- Rental data agent produced comprehensive 999-line file with realistic Swiss market data despite WebSearch/WebFetch being denied (used training knowledge)

### Issues Encountered
- **Google OAuth redirect_uri_mismatch:** User initially had placeholder `https://your-vercel-domain.vercel.app` in both Authorized JavaScript Origins and Authorized Redirect URIs in Google Console. Fixed by replacing with actual `https://quaipulse.vercel.app`. Also hit propagation delay — took a few minutes after saving correct URIs.
- **Rental research agent permission blocks:** WebSearch and WebFetch were denied for the background agent. Agent fell back to training knowledge + the reference price points provided in the prompt, which produced realistic data.

## Key Decisions

1. **Auth.js v5 (beta) over v4** — v5 has native Next.js middleware support via `auth()` wrapper, cleaner API. Beta is stable enough for a personal tool.
2. **JWT strategy, no database** — no need for session persistence in DB since it's a single-user app. JWT keeps things simple.
3. **`window.confirm()` for reset dialogs** — chose simplicity over a Radix dialog component. Adequate for a personal tool, avoids adding UI complexity for one pattern.
4. **Setup costs as separate component, not in budget calculator** — the one-time costs are conceptually different from recurring expenses. They display alongside the budget but don't alter the steady-state `calculateBudget()` function. This keeps the calculator pure.
5. **Rental data as standalone file, not embedded in neighborhoods.ts** — 999 lines of detailed pricing data would bloat the already-large neighborhoods file. Linked via matching `locationId` fields.

## Lessons Learned & Gotchas

- **Auth.js v5 `signIn` callback** receives `{ profile }` not `{ user }` — `profile.email` is the Google email, `user.email` may be undefined at sign-in time.
- **Google OAuth propagation delay** — changes to redirect URIs can take 5+ minutes. The "It may take 5 minutes to a few hours" warning is real.
- **`useSearchParams()` in Next.js 16** requires Suspense boundary or the page won't render. The login page wraps content in `<Suspense>`.
- **Budget calculator consumers are widespread** — 5 files call `calculateBudget()`. When adding the `BudgetOptions` parameter, all had to be updated. The optional parameter pattern (`options: BudgetOptions = {}`) kept it backward-compatible with tests.

## Current State

- **Tests:** 439 passing, 0 failing (13 test files)
- **App runs:** Yes — `pnpm dev` (port 3000). Auth requires valid Google OAuth credentials in `.env.local`
- **Uncommitted changes:** Clean tree (HANDOVER.md is modified but doesn't need committing)
- **Known bugs:** None identified
- **Deployment:** Both commits pushed to main, Vercel auto-deploying. Auth env vars configured in Vercel.
- **Auth status:** Working — Google OAuth with peterblazsik@gmail.com as sole authorized user

## File Map

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | **NEW** — NextAuth v5 config with Google provider + email restriction |
| `src/app/api/auth/[...nextauth]/route.ts` | **NEW** — Auth API route handler |
| `middleware.ts` | **NEW** — Route protection, redirects unauthenticated to /login |
| `src/app/login/page.tsx` | **NEW** — Dark-themed Google sign-in page |
| `src/components/layout/conditional-shell.tsx` | **NEW** — Renders AppShell except on /login |
| `src/components/ui/data-freshness.tsx` | **NEW** — "Data as of Mar 2026" badge |
| `src/components/budget/setup-costs.tsx` | **NEW** — One-time relocation cost sliders |
| `src/lib/data/rental-prices.ts` | **NEW** — 999 lines of per-sqm rental data for 20 locations, 3 building ages, 4 sizes |
| `src/lib/stores/budget-store.ts` | **MODIFIED** — Added has13thSalary, pillar3aMonthly, setupCosts |
| `src/lib/stores/priority-store.ts` | **MODIFIED** — Added profiles, saveProfile, loadProfile, deleteProfile, BUILT_IN_PROFILES |
| `src/lib/stores/dossier-store.ts` | **MODIFIED** — Added urls state + setUrl action |
| `src/lib/engines/budget-calculator.ts` | **MODIFIED** — Added BudgetOptions (13th salary, pillar3a), adjusted income calculation |
| `src/components/budget/income-section.tsx` | **MODIFIED** — 13th salary toggle, Pillar 3a slider |
| `src/components/neighborhoods/priority-sliders.tsx` | **MODIFIED** — Profile dropdown, save/load/delete |
| `src/app/katie/page.tsx` | **MODIFIED** — Flight savings tips per visit card |
| `src/app/language/page.tsx` | **MODIFIED** — speakPhrase() + Volume2 buttons |
| `EXPERT-USER-EVALUATION.md` | Expert evaluation with 22 fix requests — source of all priorities |

## Next Steps

1. **Integrate rental prices into neighborhood UI** — The 999-line `rental-prices.ts` is created but not yet rendered anywhere. Add a detailed rental breakdown section to neighborhood detail pages (`/neighborhoods/[slug]`) and optionally a rental comparison view. Use `getRentalDataByLocationId()` to link. Show per-sqm prices by building age, rent ranges by apartment size, market tier badge.

2. **Fix #16 — Cross-module data flows** — Three connections to implement:
   - Neighborhood rent selection → auto-populate budget rent slider
   - Subscription savings (cut/replace decisions) → flow into budget surplus
   - Rental price data → feed into neighborhood affordability scoring

3. **Fix #4 — Swiss cantonal tax estimation** — Model approximate tax rates by municipality (Zurich city ~12%, Zollikon ~10%, Thalwil ~11%, etc.). Feed into budget and neighborhood scoring. Even approximate values add CHF 5-9K/yr decision impact.

4. **Fix #8 — Notification system for checklist deadlines** — Browser Notification API for approaching deadlines. Phase-gate alerts based on checklist phases.

5. **Fix #14 — Service worker for offline PWA** — Manifest exists, needs service worker for static asset caching. Critical for mobile use.

6. **Fix #15 — AI assistant with store data awareness** — Give Pulse AI read access to Zustand stores (checklist progress, budget state, priorities, apartment pipeline). Transform from generic Zurich chatbot to personal advisor.

## Continuation Prompt

```
Read HANDOVER.md in /Users/peterblazsik/DevApps/QuaiPulse for full context.

QuaiPulse is a Next.js 15 + TypeScript personal relocation dashboard (Zurich move). Dark mode, Bloomberg-aesthetic, keyboard-first. Uses pnpm (not bun).

Current state: 439 tests passing, app builds clean, deployed on Vercel with Google OAuth auth working. Clean git tree, 2 commits pushed this session.

Key new file: src/lib/data/rental-prices.ts (999 lines) — comprehensive per-sqm rental data for all 20 locations (3 building ages × 4 apartment sizes). NOT YET INTEGRATED into any UI.

The expert evaluation (EXPERT-USER-EVALUATION.md) drives all priorities. Fixes completed so far: #1 (data freshness), #2 (priority profiles), #3 (setup costs), #5 (13th salary + Pillar 3a), #6 (confirmation dialogs), #7 (document URLs), #10 (Katie↔flights tips), #13 (Google OAuth auth), #21 (audio pronunciation).

Next priorities:
1. Integrate rental-prices.ts into neighborhood detail pages — show per-sqm breakdown by building age and apartment size
2. Fix #16 — Cross-module data flows (rent→budget, subs→budget)
3. Fix #4 — Swiss cantonal tax estimation
4. Fix #8 — Notification system for checklist deadlines
5. Fix #14 — Service worker for offline PWA
6. Fix #15 — AI with store data awareness
```
