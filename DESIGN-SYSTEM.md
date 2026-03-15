# QuaiPulse Design System — Reusable Instructions

> **How to use:** Copy the relevant sections into your new project's `CLAUDE.md` file.
> Claude will then apply these patterns automatically when building UI.
> Adjust theme colors to match your project, but keep the patterns and philosophy.

---

## Design Philosophy

Build interfaces that feel like a **Bloomberg Terminal's sophisticated cousin** — data-dense, dark-first, keyboard-navigable, with every pixel earning its place. Think Ferrari dashboard, not Toyota Camry.

**Core principles:**
- **Dark mode first.** Light backgrounds are optional, never default.
- **Data density over whitespace.** Every number interactive, every label informative. No decorative padding.
- **Typography does the hierarchy work.** Weight and font family create structure — not giant headings.
- **Color is information, not decoration.** Semantic colors mean something. Accent colors are punctuation.
- **Shadows whisper.** Elevation is suggested through subtle shadows and border lightening, never shouted.
- **Micro-interactions reward attention.** Hover lines, glow halos, staggered fades — small details that compound into premium feel.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript strict
- **Styling:** Tailwind CSS 4 + CSS custom properties for theming
- **UI primitives:** shadcn/ui (new-york style, zinc base)
- **Fonts:** Playfair Display (headings), JetBrains Mono (data/numbers), Inter (UI)
- **Icons:** Lucide React (16px default, 12-14px for dense contexts)
- **Animations:** Framer Motion for entrance, CSS transitions for hover
- **Charts:** Recharts or D3.js with theme-aware colors via CSS vars

### Next.js Font Setup

```tsx
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
```

---

## Theme Architecture

All colors are CSS custom properties set on `[data-theme="..."]` selectors. Components NEVER use hardcoded colors — always reference semantic tokens via Tailwind classes (`text-text-primary`, `bg-bg-secondary`, `text-success`, `border-border-default`).

### CSS Variable Structure

```css
:root, [data-theme="your-theme"] {
  /* Surfaces (darkest → lightest in dark mode) */
  --bg-primary: ...;      /* Page background */
  --bg-secondary: ...;    /* Card/panel background */
  --bg-tertiary: ...;     /* Input backgrounds, nested containers */
  --bg-elevated: ...;     /* Modals, popovers */

  /* Text (brightest → dimmest) */
  --text-primary: ...;    /* Headlines, key data */
  --text-secondary: ...;  /* Body copy, labels */
  --text-tertiary: ...;   /* Timestamps, metadata */
  --text-muted: ...;      /* Placeholders, disabled */

  /* Accent */
  --accent-primary: ...;  /* Buttons, links, focus rings */
  --accent-hover: ...;    /* Hover/pressed state */

  /* Semantic — ALWAYS use these, never raw Tailwind color classes */
  --color-success: ...;   /* Positive outcomes, confirmations */
  --color-warning: ...;   /* Attention needed, caution */
  --color-danger: ...;    /* Errors, destructive actions */
  --color-info: ...;      /* Informational highlights */

  /* Borders */
  --border-default: ...;  /* Card borders, dividers */
  --border-subtle: ...;   /* Faint separators, table rules */

  /* Glass */
  --glass-bg: ...;        /* Header/sidebar frosted glass */
  --glass-border: ...;    /* Glass element borders */

  /* Overlay */
  --overlay-rgb: R, G, B; /* Modal backdrop base (use with rgba()) */

  /* Radius */
  --radius-sm: 6px;       /* Pills, tags */
  --radius-md: 8px;       /* Buttons, inputs */
  --radius-lg: 12px;      /* Cards, panels */
}
```

### Tailwind Theme Bridge (Tailwind CSS 4)

```css
@theme inline {
  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-bg-elevated: var(--bg-elevated);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-muted: var(--text-muted);
  --color-accent-primary: var(--accent-primary);
  --color-accent-hover: var(--accent-hover);
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-danger: var(--color-danger);
  --color-info: var(--color-info);
  --color-border-default: var(--border-default);
  --color-border-subtle: var(--border-subtle);
  --color-text-success: var(--color-success);
  --color-text-warning: var(--color-warning);
  --color-text-danger: var(--color-danger);
  --color-text-info: var(--color-info);
  --font-display: var(--font-playfair);
  --font-mono: var(--font-jetbrains);
  --font-sans: var(--font-inter);
}
```

This enables classes like `bg-bg-primary`, `text-text-secondary`, `border-border-default`, `text-success`, `bg-danger/10`, etc.

---

## Theme Palettes

### Obsidian Gold (Flagship)

True black with warm brown undertones, gold accent. Feels like a luxury watch dashboard.

```css
[data-theme="obsidian"] {
  --bg-primary: #0a0a08;      --bg-secondary: #161412;
  --bg-tertiary: #2a2520;     --bg-elevated: #1c1916;
  --text-primary: #f5f0e8;    --text-secondary: #c4b8a8;
  --text-tertiary: #968878;   --text-muted: #887060;
  --accent-primary: #d4a853;  --accent-hover: #c49840;
  --color-success: #22c55e;   --color-warning: #f5a623;
  --color-danger: #e74c3c;    --color-info: #d4a853;
  --border-default: #2a2520;  --border-subtle: #1c1916;
  --overlay-rgb: 10, 10, 8;
  --glass-bg: rgba(22, 20, 18, 0.7);
  --glass-sidebar-bg: rgba(22, 20, 18, 0.9);
  --glass-border: rgba(212, 168, 83, 0.08);
}
```

**Key:** Backgrounds have warm brown undertones (never blue-gray). Gold accent doubles as info color. Text whites are warm (#f5f0e8). Glass borders tinted with gold at 8%.

### Midnight Blue (Workhorse Dark)

```css
[data-theme="midnight"] {
  --bg-primary: #0f172a;      --bg-secondary: #1e293b;
  --bg-tertiary: #334155;     --bg-elevated: #1e293b;
  --text-primary: #f1f5f9;    --text-secondary: #b0bec5;
  --text-tertiary: #8094a8;   --text-muted: #8094a8;
  --accent-primary: #3b82f6;  --accent-hover: #2563eb;
  --color-success: #22c55e;   --color-warning: #f59e0b;
  --color-danger: #ef4444;    --color-info: #06b6d4;
  --border-default: #334155;  --border-subtle: #1e293b;
  --overlay-rgb: 15, 23, 42;
  --glass-bg: rgba(30, 41, 59, 0.6);
  --glass-sidebar-bg: rgba(30, 41, 59, 0.85);
  --glass-border: rgba(255, 255, 255, 0.06);
}
```

### Swiss Banking (Light)

Inspired by Lombard Odier and Pictet private banking. Warm ivory, deep navy, restrained semantics.

```css
[data-theme="swiss"] {
  --bg-primary: #FAF9F6;      --bg-secondary: #FFFFFF;
  --bg-tertiary: #EBE8E2;     --bg-elevated: #FFFFFF;
  --text-primary: #1A1F36;    --text-secondary: #4A5068;
  --text-tertiary: #74798C;   --text-muted: #9CA0AF;
  --accent-primary: #1B3A6B;  --accent-hover: #142D54;
  --color-success: #2D7A5F;   --color-warning: #A67B2E;
  --color-danger: #9B3B3B;    --color-info: #2E6B96;
  --border-default: #DDD9D0;  --border-subtle: #EBE8E2;
  --overlay-rgb: 10, 18, 36;
  --glass-bg: rgba(250, 249, 246, 0.85);
  --glass-sidebar-bg: rgba(243, 241, 236, 0.92);
  --glass-border: rgba(27, 58, 107, 0.08);
}
```

**Light theme overrides needed:** Elevation shadows use `rgba(10, 18, 36, 0.04-0.12)` instead of black. Card hover uses `border-default` instead of `rgba(255,255,255,0.1)`. Ambient glow opacity reduced to 0.04.

---

## Typography System

### Font Assignments

| Role | Font | CSS Class | Usage |
|------|------|-----------|-------|
| Display headings | Playfair Display | `.font-display` | Page titles, hero headings |
| Numbers & data | JetBrains Mono | `.font-data` | All financial figures, scores, metrics |
| UI text | Inter | (default) | Body, labels, buttons |

### Size Hierarchy (strict)

| Element | Classes | Rendered |
|---------|---------|----------|
| Page h1 | `font-display text-2xl font-bold text-text-primary` | 24px serif |
| Section heading | `text-xs font-semibold uppercase tracking-wider text-text-muted` | 12px CAPS |
| Card title | `text-sm font-semibold text-text-primary` | 14px bold |
| Hero number | `font-data text-4xl font-bold text-accent-primary` | 36px mono |
| Large metric | `font-data text-xl font-bold text-text-primary` | 20px mono |
| Body text | `text-sm text-text-secondary` | 14px |
| Label | `text-[11px] text-text-secondary` | 11px |
| Metadata/hint | `text-[10px] text-text-muted` | 10px |
| **ABSOLUTE MINIMUM** | `text-[10px]` | **10px** |

### Monospace Numbers (Non-Negotiable)

Every financial figure, metric, time value, or score MUST use:
```tsx
<span className="font-data tabular-nums">CHF 12,150</span>
```

`font-data` sets JetBrains Mono + `font-variant-numeric: tabular-nums` — numbers align vertically in columns.

---

## Elevation System

Three levels of depth. Dark themes use `color-mix` for subtle surface lightening + `inset` top highlight.

```css
/* Level 1 — Standard cards, panels */
.elevation-1 {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);
}

/* Level 2 — Featured content, important panels */
.elevation-2 {
  background: linear-gradient(145deg,
    color-mix(in srgb, var(--bg-secondary) 100%, white 2%) 0%,
    var(--bg-secondary) 100%);
  border: 1px solid color-mix(in srgb, var(--border-default) 100%, white 5%);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.3),
    0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03);
}

/* Level 3 — Modals, command palette */
.elevation-3 {
  background: linear-gradient(145deg,
    color-mix(in srgb, var(--bg-secondary) 100%, white 4%) 0%,
    var(--bg-secondary) 100%);
  border: 1px solid color-mix(in srgb, var(--border-default) 100%, white 8%);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.4),
    0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
}
```

The `inset 0 1px 0 rgba(255,255,255,0.03)` creates a subtle top-edge highlight — light hitting the card from above.

---

## Card System

### Base Card
```tsx
<div className="card elevation-1 p-5">
  {/* content */}
</div>
```

### Interactive Card (hover glow + lift + accent line)
```tsx
<div className="card card-interactive elevation-1 p-5 relative overflow-hidden">
  <div className="card-hover-line" />
  {/* content */}
</div>
```

On hover: lifts 1px (`translateY(-1px)`), shadow expands with accent-tinted glow, gradient line fades in at top edge. The `cubic-bezier(0.34, 1.56, 0.64, 1)` gives a slight overshoot bounce.

### Hero Card (image background)
```tsx
<div className="card-hero relative h-48 overflow-hidden">
  <Image src={...} fill className="object-cover" />
  <div className="img-overlay-fade" />
  <div className="relative z-10 p-6">{/* content */}</div>
</div>
```

### Featured Card (accent border)
```tsx
<div className="card elevation-2 p-5 border-l-4 border-accent-primary">
  {/* Important content */}
</div>
```

### Card CSS (copy into globals.css)

```css
.card {
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.15);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-interactive { cursor: pointer; }

.card-interactive:hover {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.25),
    0 0 24px -6px color-mix(in srgb, var(--accent-primary) 15%, transparent);
  transform: translateY(-1px);
}

.card-hover-line {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  opacity: 0; transition: opacity 0.2s;
}
.card-interactive:hover .card-hover-line { opacity: 1; }

.card-hero {
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.03);
  position: relative; overflow: hidden;
}
```

---

## Component Patterns

### Section Header (used on every page)
```tsx
<h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
  <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
  Section Title
  <span className="text-[10px] font-normal normal-case ml-auto text-text-muted">
    optional context on the right
  </span>
</h2>
```

### KPI Card (Big Number + Context)
```tsx
<div className="card elevation-1 p-3 relative overflow-hidden">
  <div className="card-hover-line" />
  <div className="flex items-center gap-1.5">
    <Clock className="h-3 w-3 text-text-muted" />
    <p className="text-[10px] uppercase tracking-wider text-text-muted">Hours (14d)</p>
  </div>
  <div className="flex items-end gap-1.5 mt-1.5">
    <p className="font-data text-2xl font-bold text-accent-primary">7.2</p>
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-data">+0.3</span>
  </div>
  <p className="mt-0.5 text-[10px] text-text-muted">per night</p>
</div>
```

### Stat Row (Label : Value pair)
```tsx
<div className="flex items-center justify-between py-0.5">
  <span className="text-[11px] text-text-secondary">AHV/IV/EO (5.3%)</span>
  <span className="font-data text-xs tabular-nums text-danger">-CHF 648</span>
</div>
```

### Section Divider (with totals)
```tsx
<div className="flex items-center justify-between pt-1.5 pb-0.5 border-t border-border-subtle">
  <span className="text-xs font-semibold text-text-primary">Total Deductions</span>
  <span className="font-data text-sm font-bold tabular-nums text-danger">-CHF 1,892</span>
</div>
```

### Slider Input
```tsx
const SLIDER_CLASSES = "w-full h-1.5 py-3 appearance-none rounded-full bg-bg-tertiary cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:cursor-pointer";

<div>
  <div className="flex items-center justify-between mb-1">
    <span className="text-[11px] text-text-secondary">Monthly gross</span>
    <span className="font-data text-xs text-text-primary tabular-nums">CHF 14,500</span>
  </div>
  <input type="range" min={8000} max={25000} step={100} className={SLIDER_CLASSES} />
</div>
```

Visual: 6px track (h-1.5), 16px thumb (h-4 w-4), py-3 padding = ~40px total touch target.

### Toggle Button Group
```tsx
<div className="flex gap-1.5">
  {options.map((opt) => (
    <button
      key={opt.value}
      onClick={() => setSelected(opt.value)}
      className={`flex-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
        selected === opt.value
          ? "bg-accent-primary text-white"
          : "bg-bg-tertiary text-text-muted hover:text-text-secondary"
      }`}
    >
      {opt.label}
    </button>
  ))}
</div>
```

### Expandable Row (Accordion)
```tsx
<button
  onClick={() => toggle()}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary/30 transition-colors"
>
  <Icon className="h-4 w-4 shrink-0" style={{ color }} />
  <span className="text-sm font-medium text-text-primary">{label}</span>
  <span className="font-data text-xs text-text-muted ml-auto mr-2">{detail}</span>
  {expanded
    ? <ChevronUp className="h-3.5 w-3.5 text-text-muted" />
    : <ChevronDown className="h-3.5 w-3.5 text-text-muted" />}
</button>
```

### Status Badge
```tsx
// Semantic status — bg tint + text + border (always this trio)
<div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] bg-success/10 text-success border border-success/20">
  <CheckCircle className="h-3 w-3 shrink-0" />
  Completed
</div>

// Accent badge — "BEST VALUE", "RECOMMENDED" etc.
<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary font-semibold">
  BEST VALUE
</span>
```

### Delta Badge (Change Indicator)
```tsx
<span className={`inline-flex items-center font-data text-xs px-1.5 py-0.5 rounded ${
  isGood ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
}`}>
  {isPositive ? "+" : ""}{value.toFixed(1)}{suffix}
</span>
```

### Mini Stat Box (centered metric)
```tsx
<div className="rounded-lg bg-bg-primary/50 border border-border-subtle p-3 text-center">
  <p className="text-[10px] uppercase tracking-wider text-text-muted">Savings Rate</p>
  <p className="font-data text-xl font-bold mt-1 text-success">{rate}%</p>
</div>
```

### Form Input
```css
.form-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--border-default);
  background: var(--bg-tertiary);
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--accent-primary); }
.form-input::placeholder { color: var(--text-muted); opacity: 0.5; }
```

---

## Ambient Glow System

Soft, page-contextual color blobs behind content. Creates warmth without distraction.

```css
.ambient-glow {
  position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px; border-radius: 50%;
  filter: blur(100px); opacity: 0.08; pointer-events: none; z-index: 0;
}
.glow-blue   { background: radial-gradient(ellipse, #3b82f6, transparent 70%); }
.glow-cyan   { background: radial-gradient(ellipse, #06b6d4, transparent 70%); }
.glow-green  { background: radial-gradient(ellipse, #22c55e, transparent 70%); }
.glow-pink   { background: radial-gradient(ellipse, #ec4899, transparent 70%); }
.glow-amber  { background: radial-gradient(ellipse, #f59e0b, transparent 70%); }
.glow-purple { background: radial-gradient(ellipse, #8b5cf6, transparent 70%); }
.glow-red    { background: radial-gradient(ellipse, #ef4444, transparent 70%); }
.glow-gold   { background: radial-gradient(ellipse, #d4a853, transparent 70%); }
```

Usage — first child of page container:
```tsx
<div className="space-y-6 relative">
  <div className="ambient-glow glow-purple" />
  {/* page content */}
</div>
```

Mapping: Budget=green, Travel=purple, Finance=amber, AI=purple, Settings=blue, Katie=pink.

---

## Glassmorphism

```css
.glass-header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border-bottom: 1px solid var(--glass-border);
}

.glass-sidebar {
  background: var(--glass-sidebar-bg);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-right: 1px solid var(--glass-border);
}
```

---

## Stacked Bar Chart

```tsx
{/* Bar */}
<div className="h-8 rounded-lg overflow-hidden flex bg-bg-tertiary">
  {segments.map((seg) => {
    const pct = (seg.value / total) * 100;
    return (
      <div
        key={seg.label}
        className="h-full relative group transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: seg.color }}
      >
        {pct > 6 && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-data text-white/90 font-medium">
            {formatCHF(seg.value)}
          </span>
        )}
      </div>
    );
  })}
</div>

{/* Legend */}
<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
  {segments.map((seg) => (
    <div key={seg.label} className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
      <span className="text-[10px] text-text-muted">{seg.label}</span>
    </div>
  ))}
</div>
```

---

## Image Overlays

Four overlay styles for images beneath text, all using `--overlay-rgb` for theme-aware tinting:

```css
.img-overlay-fade   { /* Bottom to top gradient — card thumbnails */ }
.img-overlay-full   { /* Top + bottom darken — hero banners */ }
.img-overlay-bottom { /* Mask bottom half — subtle vignette */ }
.img-overlay-left   { /* Left to right fade — side-panel images */ }
```

---

## Background Textures

### Dot Grid
```css
.bg-dot-pattern {
  background-image: radial-gradient(circle,
    color-mix(in srgb, var(--text-muted) 12%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Noise Texture
```css
.noise::before {
  content: ""; position: absolute; inset: 0; opacity: 0.025;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
  pointer-events: none; mix-blend-mode: overlay;
}
```

---

## Layout Patterns

### Responsive Grids
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">           {/* 2-col */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* 3-col */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">          {/* Asymmetric */}
  <div className="lg:col-span-4">{/* sidebar */}</div>
  <div className="lg:col-span-8">{/* main */}</div>
</div>
```

### Spacing Scale
- **Between page sections:** `space-y-6` (24px)
- **Between cards:** `gap-4` (16px) or `gap-6` (24px)
- **Within a card:** `space-y-3` (12px) or `space-y-1.5` (6px)
- **Dense data rows:** `space-y-0.5` or `space-y-1` (2-4px)
- **Card padding:** `p-5` (20px standard), `p-3` (12px compact)

### Layout Constants
```css
--sidebar-width: 256px;
--sidebar-collapsed-width: 64px;
--header-height: 48px;
--status-bar-height: 32px;
```

---

## Micro-Interactions

### Framer Motion Entrance (Staggered)
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

### Progress Shimmer
```css
.progress-shimmer::after {
  content: ""; position: absolute; inset: 0;
  background-size: 200% 100%;
  background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  animation: progress-shimmer 3s ease-in-out infinite;
  border-radius: inherit;
}
```

### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .progress-shimmer::after, .skeleton { animation: none; }
  * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

---

## Focus & Accessibility

```css
:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 2px; }

kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 22px; padding: 0 5px;
  font-family: var(--font-jetbrains), monospace; font-size: 11px;
  color: var(--text-tertiary); background: var(--bg-tertiary);
  border: 1px solid var(--border-default); border-radius: 4px;
}
```

### Scrollbar
```css
* { scrollbar-width: thin; scrollbar-color: var(--bg-tertiary) transparent; }
```

---

## Data Density Techniques (The "Bloomberg Feel")

What makes this feel data-dense rather than airy:

1. **`text-[10px]` and `text-[11px]`** for labels, metadata, sublabels — pushes information density without sacrificing readability.
2. **`font-data tabular-nums`** on every number — columns of figures align perfectly, creating visual order.
3. **`space-y-0.5` and `space-y-1`** for data rows — tight vertical rhythm keeps rows scannable.
4. **`p-3` compact card padding** — cards feel full, not empty.
5. **Icon size `h-3 w-3` and `h-3.5 w-3.5`** — icons serve as visual anchors, not focal points.
6. **Section headers as `text-xs uppercase tracking-wider`** — Bloomberg-style ALL CAPS labels at 12px.
7. **Colored text for semantics** — `text-success`, `text-danger`, `text-warning` give instant context without reading.
8. **Tinted backgrounds at low opacity** — `bg-success/10`, `bg-danger/10` create zones of meaning.
9. **No empty states** — every card has real or placeholder data. Never "nothing to show here."
10. **Multiple data points per card** — a KPI card has: icon, label, big number, delta badge, subtitle, and optionally a mini bar chart. 6 pieces of info in one compact card.

---

## Rules (Non-Negotiable)

1. **Never use fonts below 10px.** The absolute minimum is `text-[10px]`.
2. **Never use hardcoded Tailwind colors** (`text-red-400`, `bg-emerald-500`). Always use semantic tokens (`text-danger`, `bg-success/10`, `text-warning`).
3. **Every number uses `font-data tabular-nums`.** Financial data, scores, times, percentages — all monospace-aligned.
4. **Dark mode is default.** Light themes are secondary options, never the starting point.
5. **No decorative elements.** Every visual element carries information or provides affordance.
6. **Shadows use theme-tinted bases** — dark themes use black, obsidian uses warm-black, light themes use navy-tinted `rgba(10, 18, 36, ...)`.
7. **Accent color opacity for backgrounds:** `bg-accent-primary/5` through `/20`. Never solid accent backgrounds except buttons.
8. **Semantic status pattern:** `bg-{status}/10 text-{status} border border-{status}/20` — always the trio.
9. **Card hover = translateY(-1px) + shadow expand + optional glow line.** Consistent everywhere.
10. **Section headers are ALWAYS:** icon (h-3.5) + uppercase text-xs + tracking-wider + text-text-muted.

---

## Score Gradient (for data visualization)

```css
--score-1:  #ef4444   /* Poor — red */
--score-3:  #f97316   /* Below average — orange */
--score-5:  #f59e0b   /* Average — amber */
--score-7:  #84cc16   /* Good — lime */
--score-9:  #22c55e   /* Great — green */
--score-10: #10b981   /* Excellent — emerald */
```

Obsidian Gold uses warmer variants. Swiss Banking uses an earthy gradient (burgundy → brass → sage).

---

*This design system was created for Peter Blazsik's projects. Use freely across your applications.*
