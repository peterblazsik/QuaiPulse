# QuaiPulse Design System — Obsidian Dark Theme

A premium, data-dense dark-mode design system inspired by Bloomberg Terminal aesthetics.
Built for Next.js + Tailwind CSS 4 + Framer Motion.

---

## Quick Start

1. Copy `globals.css` theme variables into your project
2. Add the `@theme inline` block for Tailwind 4 bridge
3. Install fonts: Inter, JetBrains Mono, Playfair Display
4. Use the CSS utility classes and Tailwind tokens documented below

---

## 1. Color Tokens

### Midnight Blue (Default)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0f172a` | Page background |
| `--bg-secondary` | `#1e293b` | Cards, panels |
| `--bg-tertiary` | `#334155` | Hover states, inputs, sliders |
| `--bg-elevated` | `#1e293b` | Modals, popovers |
| `--text-primary` | `#f1f5f9` | Headings, key data |
| `--text-secondary` | `#b0bec5` | Body text |
| `--text-tertiary` | `#8094a8` | Supporting text |
| `--text-muted` | `#607080` | Labels, captions |
| `--accent-primary` | `#3b82f6` | CTA buttons, links, focus rings |
| `--accent-hover` | `#2563eb` | Hover state for accent |
| `--border-default` | `#334155` | Card borders, dividers |
| `--border-subtle` | `#1e293b` | Subtle separators |

### Obsidian Gold (Alternate)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0a0a08` | True black base |
| `--bg-secondary` | `#161412` | Warm dark panels |
| `--bg-tertiary` | `#2a2520` | Warm hover states |
| `--text-primary` | `#f5f0e8` | Warm white text |
| `--text-secondary` | `#c4b8a8` | Warm body text |
| `--accent-primary` | `#d4a853` | Gold accent |
| `--accent-hover` | `#c49840` | Gold hover |
| `--border-default` | `#2a2520` | Warm borders |

### Semantic Colors

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#22c55e` | Positive states, gains |
| `--color-warning` | `#f59e0b` | Caution states |
| `--color-danger` | `#ef4444` | Errors, losses, destructive |
| `--color-info` | `#06b6d4` | Informational |

### Score Gradient (for data visualization)

```
--score-1:  #ef4444  (Poor)
--score-3:  #f97316  (Below average)
--score-5:  #f59e0b  (Average)
--score-7:  #84cc16  (Good)
--score-9:  #22c55e  (Great)
--score-10: #10b981  (Excellent)
```

---

## 2. Typography

### Font Stack

| Role | Font | CSS Class | Usage |
|---|---|---|---|
| Display | Playfair Display | `.font-display` | Page titles, hero headings |
| Data | JetBrains Mono | `.font-data` | Numbers, scores, monetary values |
| UI | Inter | (default) | Body text, labels, buttons |

### Next.js Font Setup

```tsx
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
```

### Type Scale

| Element | Size | Weight | Class |
|---|---|---|---|
| Page title | `text-2xl` / `text-3xl` | `font-bold` | `.font-display` |
| Section header | `text-xs` | `font-semibold` | `uppercase tracking-wider text-text-muted` |
| Card title | `text-sm` | `font-semibold` | `text-text-primary` |
| Body text | `text-sm` | normal | `text-text-secondary` |
| Caption/label | `text-[10px]` | `font-semibold` | `uppercase tracking-wider text-text-muted` |
| Micro label | `text-[9px]` | normal | `text-text-muted` |
| Data/number | `text-lg` to `text-5xl` | `font-bold` / `font-black` | `.font-data` |

---

## 3. Spacing & Layout

### Layout Constants

```css
--sidebar-width: 256px;
--sidebar-collapsed-width: 64px;
--header-height: 48px;
--status-bar-height: 32px;
```

### Border Radius

```css
--radius-sm: 6px;    /* Pills, tags */
--radius-md: 8px;    /* Buttons, inputs */
--radius-lg: 12px;   /* Cards, panels */
```

### Common Spacing Pattern

- Page padding: `p-6`
- Card padding: `p-4` or `p-5`
- Section gap: `space-y-6`
- Grid gap: `gap-3` or `gap-4`
- Inline element gap: `gap-2`

---

## 4. Elevation System

Three elevation levels, inspired by Material Design 3 dark mode:

```css
/* Level 1 — Cards, panels */
.elevation-1 {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);
}

/* Level 2 — Dropdowns, popovers */
.elevation-2 {
  background: linear-gradient(145deg, color-mix(in srgb, var(--bg-secondary) 100%, white 2%), var(--bg-secondary));
  border: 1px solid color-mix(in srgb, var(--border-default) 100%, white 5%);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03);
}

/* Level 3 — Modals, command palette */
.elevation-3 {
  /* Strongest lift with subtle white blend */
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.4), 0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
}
```

---

## 5. Card System

### Base Card

```html
<div class="card p-5">Content</div>
```

```css
.card {
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.15);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
```

### Interactive Card (with hover lift + accent glow)

```html
<div class="card card-interactive relative p-5">
  <div class="card-hover-line" />
  Content
</div>
```

On hover: lifts 1px, gets accent glow shadow, shows top gradient line.

### Hero Card (with image background)

```html
<div class="card-hero relative h-48 overflow-hidden rounded-xl">
  <Image src={...} fill class="object-cover" />
  <div class="img-overlay-full" />
  <div class="relative z-10 p-6">Content over image</div>
</div>
```

---

## 6. Glassmorphism

```css
/* Header bar */
.glass-header {
  background: var(--glass-bg);             /* rgba(30,41,59,0.6) */
  backdrop-filter: blur(20px) saturate(1.5);
  border-bottom: 1px solid var(--glass-border); /* rgba(255,255,255,0.06) */
}

/* Sidebar */
.glass-sidebar {
  background: var(--glass-sidebar-bg);     /* rgba(30,41,59,0.85) */
  backdrop-filter: blur(12px) saturate(1.3);
  border-right: 1px solid var(--glass-border);
}
```

---

## 7. Background Patterns

### Dot Grid

```css
.bg-dot-pattern {
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--text-muted) 12%, transparent) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

### Noise Texture Overlay

```css
.noise::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

---

## 8. Image Overlays

Four overlay styles for images beneath text:

| Class | Direction | Use case |
|---|---|---|
| `.img-overlay-full` | Top + bottom darken | Hero banners |
| `.img-overlay-fade` | Bottom to top fade | Card thumbnails |
| `.img-overlay-bottom` | Mask bottom half | Subtle vignette |
| `.img-overlay-left` | Left to right fade | Side-panel images |

All use `--overlay-rgb` for theme-aware tinting.

---

## 9. Ambient Glows

Soft page-context color blobs behind content:

```html
<div class="ambient-glow glow-blue" />
```

Available: `glow-blue`, `glow-cyan`, `glow-green`, `glow-pink`, `glow-amber`, `glow-purple`, `glow-red`, `glow-gold`

---

## 10. Animation Patterns

### Framer Motion — Staggered card entrance

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

### MotionConfig wrapper

```tsx
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

### Progress bar shimmer

```css
.progress-shimmer::after {
  animation: progress-shimmer 3s ease-in-out infinite;
  background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
}
```

### Skeleton loading

```css
.skeleton {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 11. Component Patterns

### Section Header

```html
<h2 class="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
  Section Title
</h2>
```

### Metric Display

```html
<div class="text-center py-3">
  <p class="text-[10px] uppercase tracking-wider text-text-muted mb-1">Label</p>
  <p class="font-data text-5xl font-black text-success">CHF 3,200</p>
  <p class="text-xs text-text-tertiary mt-1">per year</p>
</div>
```

### Status Badge

```html
<span class="text-[9px] px-1.5 py-0.5 rounded font-medium"
  style="color: #3b82f6; background: color-mix(in srgb, #3b82f6 15%, transparent)">
  Active
</span>
```

### Filter Pill

```html
<button class="text-[10px] px-2.5 py-1 rounded-lg border
  border-accent-primary/50 bg-accent-primary/10 text-accent-primary">
  Selected
</button>
```

### Score Bar

```html
<div class="flex items-center gap-2">
  <div class="h-2.5 w-2.5 rounded-full" style="background: #3b82f6" />
  <span class="text-xs text-text-secondary w-24">Label</span>
  <div class="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
    <div class="h-full rounded-full" style="width: 75%; background: #3b82f6" />
  </div>
  <span class="font-data text-sm font-semibold w-8 text-right">7.5</span>
</div>
```

### KBD Key

```html
<kbd>⌘K</kbd>
```

---

## 12. Focus & Accessibility

```css
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

Keyboard patterns:
- `role="dialog"` + `aria-modal="true"` on modals
- `role="listbox"` + `role="option"` on custom dropdowns
- Arrow keys + Home/End for list navigation
- Escape to close overlays
- Focus trap in command palette / modals

---

## 13. Scrollbar

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--bg-tertiary) transparent;
}
```

---

## 14. Tailwind 4 Bridge

Map CSS variables to Tailwind utility classes:

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
  --font-display: var(--font-playfair);
  --font-mono: var(--font-jetbrains);
  --font-sans: var(--font-inter);
}
```

This enables classes like `bg-bg-primary`, `text-text-secondary`, `border-border-default`, `text-success`, etc.

---

## 15. Full CSS Variables (copy-paste ready)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-elevated: #1e293b;

  /* Text */
  --text-primary: #f1f5f9;
  --text-secondary: #b0bec5;
  --text-tertiary: #8094a8;
  --text-muted: #607080;

  /* Accent */
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #06b6d4;

  /* Borders */
  --border-default: #334155;
  --border-subtle: #1e293b;

  /* Overlay */
  --overlay-rgb: 15, 23, 42;

  /* Glass */
  --glass-bg: rgba(30, 41, 59, 0.6);
  --glass-sidebar-bg: rgba(30, 41, 59, 0.85);
  --glass-border: rgba(255, 255, 255, 0.06);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

---

## License

This design system was created for Peter Blazsik's personal projects. Use freely across your applications.
