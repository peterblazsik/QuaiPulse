# QuaiPulse Code Quality Audit Report

**Date:** 2026-03-06
**Auditor:** Claude Opus 4.6
**Codebase:** QuaiPulse (Next.js 16, React 19, TypeScript)
**Mode:** BIG CHANGE (interactive, section-by-section)

---

## Executive Summary

- **Overall Grade: B- (74/100)**
- **Risk Level:** Medium (was High before fixes)
- **Top 3 Priorities (FIXED):**
  1. ~~XSS via dangerouslySetInnerHTML in AI chat~~ FIXED
  2. ~~No input validation on /api/chat~~ FIXED
  3. ~~No error boundaries~~ FIXED

## Component Grades

| Category | Score | Grade | Notes |
|----------|-------|-------|-------|
| **Security** | 72/100 | C+ | XSS + validation fixed. No auth or rate limiting still. |
| **Code Quality** | 75/100 | B- | Some type casting smells, non-null assertions, but solid overall. |
| **Architecture** | 70/100 | C+ | DRY violations (5 instances), large pages (5 > 300 lines). |
| **Testing** | 10/100 | F | Zero tests. No test framework installed. |
| **Best Practices** | 80/100 | B | Good patterns overall, proper env var handling, gitignore. |
| **Overall** | **74/100** | **B-** | |

---

## Findings Summary

### FIXED in This Session

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| S1 | CRITICAL | XSS via `dangerouslySetInnerHTML` in AI chat | Replaced with `react-markdown` |
| S2 | HIGH | No input validation on `/api/chat` | Added Zod schema validation |
| S6 | MEDIUM | Error messages leaking internal details | Generic error to client, full log server-side |
| A1 | HIGH | No error boundaries anywhere | Added global `error.tsx` |
| A4 | MEDIUM | Checklist state lost on refresh | Zustand persist middleware |

### Open: Should Fix (Prioritized)

| # | Severity | Category | Issue | File(s) |
|---|----------|----------|-------|---------|
| S3 | HIGH | Security | No rate limiting on `/api/chat` | `api/chat/route.ts` |
| S4 | MEDIUM | Security | No authentication (personal data in system prompt exposed) | All routes |
| S5 | MEDIUM | Security | No CSP or security headers | `next.config.ts` |
| A2a | MEDIUM | Architecture | Duplicated `RentCard` component (2 implementations) | `neighborhood-card.tsx`, `[slug]/page.tsx` |
| A2b | MEDIUM | Architecture | Duplicated radar chart logic (`OverlaidRadar` vs `RadarChart`) | `compare/page.tsx`, `radar-chart.tsx` |
| A2c | MEDIUM | Architecture | Venue type config in 3 files | `[slug]/page.tsx`, `social/page.tsx`, `venue-map.tsx` |
| A2d | LOW | Architecture | Portal links hardcoded (data file exists) | `[slug]/page.tsx` |
| A2e | LOW | Architecture | Office coords duplicated | `venue-map.tsx`, `constants.ts` |
| A3 | MEDIUM | Architecture | 5 page components > 300 lines | compare, [slug], katie, apartments, ai |

### Open: Consider Improving

| # | Severity | Category | Issue |
|---|----------|----------|-------|
| Q1 | LOW | Code Quality | 30+ non-null assertions in compare page |
| Q2 | LOW | Code Quality | Unsafe `as unknown as Record<string, number>` casts (3 files) |
| Q3 | LOW | Code Quality | Import after default export in compare page |
| Q4 | INFO | Code Quality | Unnecessary `"use client"` on store files |
| T1 | HIGH | Testing | Zero tests. No Vitest/Playwright installed. |
| P1 | LOW | Performance | `useSearchParams` without Suspense in compare page |
| P2 | LOW | Performance | Missing `sizes` prop on `<Image fill>` components |
| P3 | LOW | Performance | `Math.random()` in currency sparkline (hydration risk) |

---

## Recommended Next Actions

### P0 - This Week
1. **Add rate limiting** to `/api/chat` (e.g., `@upstash/ratelimit`)
2. **Enable Vercel password protection** or add basic auth gate
3. **Add security headers** in `next.config.ts` (CSP, X-Frame-Options, etc.)

### P1 - This Month
4. **Install Vitest** and write unit tests for `scoring.ts`, `budget-calculator.ts`, `utils.ts`
5. **Extract shared components**: `RentCard`, venue type config, portal links
6. **Extend `RadarChart`** to support overlay mode instead of separate `OverlaidRadar`

### P2 - This Quarter
7. **Split large page components** into sub-components
8. **Fix type casts**: make `calculateBudget` accept `BudgetValues` directly
9. **Add Suspense boundary** around compare page for `useSearchParams`
10. **Wire up apartment form** (currently non-functional)

---

## Positive Observations

- **Clean TypeScript** — strict mode, well-typed stores and data files
- **Excellent design system** — consistent CSS custom properties, two themes, elevation system
- **Smart state management** — Zustand with persist middleware, proper store separation
- **Good gitignore** — `.env*` excluded, no secrets committed (after key rotation)
- **Build always passes** — zero TypeScript errors across 16 routes
- **Proper env var handling** — server-side only GEMINI_API_KEY, no NEXT_PUBLIC_ exposure
