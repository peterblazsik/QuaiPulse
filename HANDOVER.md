# Session Handover

**Date:** 2026-03-15
**Branch:** main
**Last Commit:** `5444c36` feat(checklist): add 14 items for lease termination, moving, and multi-country tax

---

## What Was Done

### 1. Full Database Backend Migration (Neon Postgres + tRPC + Drizzle)
- Installed drizzle-orm, @neondatabase/serverless, @trpc/server v11, @trpc/client v11, @trpc/react-query v11, @tanstack/react-query, nanoid, superjson
- Created `src/server/db/schema.ts` — 16 pgTables with jsonb columns, timestamps, cascade deletes, userId scoping
- Created `src/server/db/index.ts` — lazy Proxy-based Neon connection (avoids build-time initialization crashes)
- Created `src/server/trpc.ts` — tRPC init with session context type
- Created 13 tRPC routers in `src/server/routers/` (budget, priority, checklist, dossier, subscription, gymFilter, apartmentFeedPrefs, apartments, katie, sleep, chat, language, profile)
- Created `src/app/api/trpc/[trpc]/route.ts` — Next.js route handler with `force-dynamic` + `await headers()` for auth context
- Created `src/lib/trpc/client.ts` — React tRPC client with superjson
- Created 12 sync hooks in `src/lib/hooks/` for localStorage→DB migration
- Created `src/components/sync-provider.tsx` — invisible sync trigger component
- Updated `src/app/providers.tsx` — added tRPC, React Query, SyncProvider, OnboardingGate
- Updated `src/lib/auth.ts` — JWT callback upserts user in DB, userId in session, fallback to token.sub
- Updated `middleware.ts` — allow `/api/trpc` routes
- Schema pushed to Neon Postgres (eu-central-1) via `pnpm db:push`

### 2. Multi-User Profile & Onboarding System
- Added `user_profile` table to schema (identity, relocation, employment, family, financial, health, languages, onboardingComplete flag)
- Created `src/server/routers/profile.ts` — get/upsert with partial field updates
- Created `src/components/layout/onboarding-interview.tsx` — 6-step full-screen interview (welcome, move, employment, family, budget, summary)
- Created `src/components/onboarding-gate.tsx` — blocks app until profile complete, auto-detects existing localStorage users, shows sign-out button on 401 errors
- Created `scripts/seed-peter-profile.ts` — seeds Peter's profile data (ran successfully: userId `GGRshrr91sSjRF0oE5iak`)

### 3. Cost of Living Comparison Page
- Created `src/lib/data/price-comparison.ts` — 83 items across 11 categories (Vienna Billa Corso, Zurich Globus, Zurich Migros, Amsterdam Albert Heijn), all EUR prices
- Created `src/app/prices/page.tsx` — hero banner, monthly basket cards with store images, collapsible category tables with color-coded cheapest/priciest, key insights, basket composition bars
- Generated 4 AI images via Gemini Imagen 4.0: hero market, Vienna deli, Zurich gourmet hall, Amsterdam produce
- Added to navigation (constants.ts + sidebar.tsx)

### 4. Relocation Research → 14 New Checklist Items (cl-65 to cl-78)
- **Lease** (3 items): diplomatic clause review, termination letter (March 31 deadline), Juridisch Loket fallback
- **Move** (3 items): get 3 quotes, book by May 15, customs inventory list
- **Tax** (8 items): Deloitte meeting, 2025 return, M-form prep, 30% ruling, NL→CH handoff, tax treaty docs, AOW freeze, box 3 review

### 5. Initially started with Turso/SQLite, then switched to Neon Postgres
- User preferred Neon (already used in other projects, better for multi-user)
- Swapped @libsql/client → @neondatabase/serverless
- Changed schema from sqliteTable → pgTable, text JSON → jsonb, SQLite .get()/.all() → Postgres .limit(1)/array returns

## What Worked and What Didn't

### Successes
- Schema design with jsonb columns for Tier A config stores (single-row per user, upsert pattern) was clean — routers can just spread input objects
- Lazy DB Proxy pattern elegantly solved build-time initialization crashes
- Gemini Imagen 4.0 generated 4 excellent photographic images in parallel (3/4 on first try)
- All 517 tests continued passing through every change
- Parallel agent usage for router creation + onboarding interview saved significant time

### Issues Encountered
- **tRPC 401 errors on Vercel** — `auth()` from NextAuth v5 beta.30 returned null session in tRPC route handler. Root cause: the route handler wasn't in a proper Next.js dynamic context. Fixed by adding `export const dynamic = "force-dynamic"` and `await headers()` before `auth()`. Also moved session resolution into the route handler itself rather than a separate `createContext` function.
- **Black screen on first deploy** — OnboardingGate showed "Loading..." indefinitely because profile.get returned 401, which wasn't handled as an error state. Fixed by adding `retry: false`, `isError` check, and a sign-out button.
- **Peter saw onboarding interview after sign-in** — localStorage data was on localhost:3000, not quaipulse.vercel.app (different domains). The auto-detect couldn't find it. Seeded profile manually via script.
- **drizzle.config.ts type error** — authToken doesn't exist on sqlite dialect's dbCredentials type. Fixed by using turso dialect conditionally, then removed entirely when switching to Neon.
- **Zod schema mismatches** — Agent-generated router zod schemas didn't match actual TypeScript types (e.g. ChecklistItemData fields). Fixed by using `z.unknown()` for complex JSON fields.

## Key Decisions

- **Neon over Turso** — User has experience with Neon, better for multi-user concurrent writes, Postgres native jsonb support, generous free tier, Vercel native integration available
- **Zustand kept as in-memory cache** — `buildStoreContext()` in `src/lib/ai/store-context.ts` calls `.getState()` synchronously on 9 stores. Removing Zustand would break AI context. Stores hydrated from server on load.
- **Lazy DB connection via Proxy** — Avoids `DATABASE_URL!` crash during static page generation at build time. Connection only established on first actual query.
- **OnboardingGate with localStorage auto-detect** — Existing users with localStorage data auto-skip the interview. New users must complete all 6 steps. Prevents data loss for Peter.
- **Session.user.id fallback to token.sub** — If JWT callback DB write fails, fall back to OAuth provider ID so users aren't locked out entirely.
- **jsonb columns instead of text** — Postgres native JSON support means no manual JSON.stringify/parse needed. Drizzle handles serialization.

## Lessons Learned & Gotchas

- **NextAuth v5 beta.30 + tRPC on Vercel**: `auth()` needs `force-dynamic` export and `await headers()` in the route handler. Without this, the function runs in a static context where cookies aren't available.
- **Existing JWT tokens don't have userId**: Users who signed in before the DB migration have JWTs without `userId`. They must sign out and back in to trigger the `jwt` callback with `trigger === "signIn"`. The fallback to `token.sub` handles this gracefully.
- **localStorage is per-domain**: Data at localhost:3000 is invisible to quaipulse.vercel.app. The auto-detect only works if the user accesses from the same domain where they originally stored data.
- **Drizzle neon-http has no .get()/.all()**: SQLite-specific methods. Use `.limit(1)` + `rows[0]` for single-row queries, and just await for arrays.
- **Postgres timestamp columns return Date objects**: Sync hooks that map server data to Zustand stores with string dates need `instanceof Date ? .toISOString() : value` conversion.
- **`src/app/api/debug-session/route.ts` still exists** — temporary debug endpoint, should be removed.

## Current State

- **Tests:** 517 passing, 0 failing (16 test files)
- **Build:** Clean (`pnpm build` succeeds)
- **App runs:** Yes — `pnpm dev` locally, deployed at https://quaipulse.vercel.app
- **Database:** Neon Postgres eu-central-1, all 16 tables created, Peter's profile seeded
- **Uncommitted changes:** `DESIGN-SYSTEM.md` and `HANDOVER.md` (docs only)
- **Known bugs:**
  - Peter currently sees the onboarding interview on Vercel (needs to hard-refresh after profile seed — may need to sign out/in again)
  - `src/app/api/debug-session/route.ts` should be deleted (temporary)
  - Stores still have `persist()` middleware writing to localStorage — should be removed once server sync is confirmed working
  - Hardcoded personal references (Peter, Amsterdam, Katie, Mythenquai) throughout UI text are not yet dynamized from user_profile

## File Map

| File | Purpose |
|------|---------|
| `src/server/db/schema.ts` | All 16 Postgres tables (users, 7 Tier A config, 7 Tier B entity, user_profile, user_language_meta) |
| `src/server/db/index.ts` | Lazy Neon connection via Proxy |
| `src/server/trpc.ts` | tRPC init, Context type, protectedProcedure with userId |
| `src/server/routers/_app.ts` | Root router merging all 13 domain routers |
| `src/server/routers/profile.ts` | User profile get/upsert |
| `src/app/api/trpc/[trpc]/route.ts` | tRPC fetch handler with force-dynamic + auth() |
| `src/lib/trpc/client.ts` | React tRPC client with superjson |
| `src/lib/hooks/use-sync-all.ts` | Master sync hook orchestrating all 12 store syncs |
| `src/components/sync-provider.tsx` | Invisible component triggering sync on auth |
| `src/components/onboarding-gate.tsx` | Blocks app until profile.onboardingComplete = true |
| `src/components/layout/onboarding-interview.tsx` | 6-step new user interview |
| `src/app/prices/page.tsx` | Cost of living comparison (83 items, 4 stores, AI images) |
| `src/lib/data/price-comparison.ts` | Price data + helper functions |
| `src/lib/data/checklist-items.ts` | 78 checklist items (was 64, added 14 for lease/move/tax) |
| `src/lib/auth.ts` | NextAuth with JWT user upsert + fallback userId |
| `scripts/seed-peter-profile.ts` | One-time seed for Peter's user_profile |
| `drizzle.config.ts` | Drizzle Kit config for Neon Postgres |

## Next Steps

1. **Fix Peter's onboarding gate** — He may still see the interview. Options: (a) have him sign out at `/api/auth/signout` and back in, then hard refresh; (b) if profile seed worked but gate still triggers, debug the profile.get query response
2. **Remove debug endpoint** — Delete `src/app/api/debug-session/route.ts`
3. **Remove localStorage `persist()` from stores** — Once server sync is confirmed working, remove `persist()` middleware from all 12 Zustand stores (keep ui-store and compare-store as-is per plan)
4. **Dynamize hardcoded personal references** — Read from `user_profile` instead of hardcoded strings. Priority files: `src/app/api/chat/route.ts` (system prompt), `src/app/page.tsx` (greeting), `src/app/settings/page.tsx` (profile fields), `src/lib/constants.ts` (OFFICE_COORDS, MOVE_DATE)
5. **Remove ALLOWED_EMAIL restriction** — Once multi-user is confirmed working, remove from Vercel env vars to allow other Google accounts
6. **Wire save functions into page components** — Each sync hook returns a `saveXxx()` function. Call debounced after Zustand mutations (e.g. budget slider changes)
7. **Add "Export my data" + "Delete account"** to settings page
8. **Research real grocery prices** — Current price-comparison data uses estimated prices. Could scrape or manually verify against actual store websites.

## Continuation Prompt

```
I'm continuing work on QuaiPulse (/Users/peterblazsik/DevApps/QuaiPulse), a personal Zurich relocation navigator (Next.js 16 + TypeScript + Zustand + Tailwind + Neon Postgres + tRPC v11 + Drizzle).

Last session was a massive DB migration + multi-user feature sprint:

DATABASE BACKEND (complete):
- Neon Postgres (eu-central-1) with Drizzle ORM, 16 tables, jsonb columns
- tRPC v11 with 13 routers (src/server/routers/), React Query integration
- 12 sync hooks (src/lib/hooks/) for localStorage→DB migration
- SyncProvider + OnboardingGate wired into providers.tsx
- Peter's profile seeded (userId: GGRshrr91sSjRF0oE5iak, email: peterblazsik@gmail.com)

KNOWN ISSUES:
- Peter may still see onboarding interview on Vercel — profile is seeded but gate might not be picking it up. Debug profile.get response.
- src/app/api/debug-session/route.ts is temporary — delete it
- Stores still have persist() middleware — should be removed once sync works
- Hardcoded personal references (Peter, Amsterdam, Katie, Mythenquai) not yet dynamized

NEW FEATURES:
- Cost of living comparison page (src/app/prices/page.tsx) — 83 items, 4 stores, 4 AI images
- 14 new checklist items (cl-65 to cl-78) for lease termination, moving company, Deloitte tax coordination

TECH STACK: Next.js 16.1.6, Neon Postgres, Drizzle ORM, tRPC v11, React Query, Zustand (as cache), NextAuth v5 beta.30

All 517 tests pass. Build clean. Deployed at https://quaipulse.vercel.app.

Priority: Fix the onboarding gate so Peter sees his dashboard, then start dynamizing hardcoded personal references from user_profile.
```
