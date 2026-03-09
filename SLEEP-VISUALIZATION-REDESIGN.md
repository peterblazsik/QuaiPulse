# Sleep Module Visualization Redesign

## Current State: What's Wrong

Every chart on the sleep page is a flat-color bar or progress bar with no gradients, no hover interactions, no tooltips, and no animation. The page reads like a spreadsheet with colors, not a premium health terminal.

**Specific issues:**
1. **TrendChart** — flat bars with uniform 0.7 opacity, quality line is a plain polyline, no area fill, no crosshair tooltip
2. **LocationBars** — solid flat colors, no gradients, no hover states
3. **InterventionDelta** — hardcoded emerald/amber h-2 bars, no interaction
4. **SupplementBars** — flat fill with opacity, no rounded edges, no tooltips
5. **No bedtime/waketime visualization** despite collecting the data
6. **No composite sleep score** — user must mentally synthesize 6 KPIs
7. **All correlation panels look identical** — same horizontal bar pattern for 3 different question types

---

## Redesign: Bloomberg Terminal x Oura Ring

### Design Philosophy
- **Garmin's data density** + **Oura's glow/polish** on a **Bloomberg Terminal foundation**
- Every number gets a delta comparison to previous period
- Every chart gets hover crosshair + tooltip
- JetBrains Mono for ALL numeric values
- Gradient fills, not flat colors
- Three levels of progressive disclosure: glance (card header) > hover (tooltip) > expand (full view)

---

## New Visualizations (Priority Order)

### 1. Sleep Score Ring (Critical — Visual Anchor)

Inspired by Oura's concentric ring. Computed from: duration (30%), quality (25%), latency (20%), awakenings (15%), consistency (10%).

**Spec:**
- 270-degree SVG arc (gap at bottom-center)
- Stroke-width: 8px, rounded linecap
- Background track: `#1e293b`
- Fill: gradient stroke mapped to score (red < 40, amber < 60, blue < 80, green >= 80)
- Glow on arc tip: `drop-shadow(0 0 8px [accent-at-40%])`
- Center: Score in JetBrains Mono 48px weight-300, "Sleep Score" label below
- Animation: Arc draws from 0 to target over 1200ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- Number counts up simultaneously

**Score gradient stops:**
- Excellent (80-100): `#22C55E` to `#34D399`
- Good (60-79): `#3B82F6` to `#60A5FA`
- Fair (40-59): `#F59E0B` to `#FBBF24`
- Poor (0-39): `#EF4444` to `#F87171`

---

### 2. Sleep Window Chart (Critical — Unique Differentiator)

**The single most impactful new visualization.** You already collect bedtime and waketime. This is what makes someone say "this is serious."

**Spec:**
- Horizontal range chart, each row = one night (14-21 days)
- X-axis: 20:00 to 10:00 (spanning midnight)
- Each bar: rounded rectangle from bedtime to waketime
- Color: mapped to quality (1-5 using quality gradient)
- Vertical dashed lines at target bedtime (22:30) and waketime (06:00)
- Height per row: 16px, gap: 4px
- Date labels on Y-axis: JetBrains Mono, 10px, `#64748B`
- Hover: bar brightens, tooltip shows all metrics for that night

**What it reveals instantly:**
- Schedule consistency (aligned bars = consistent)
- Weekend vs weekday patterns
- Correlation between consistency and quality (via color)
- Schedule drift (bars sliding later over time)

---

### 3. Gradient Area Trend Chart (Critical — Hero Visualization)

Replace the flat bar chart with a gradient area chart.

**Spec:**
- Area chart for sleep duration with vertical gradient fill:
  ```
  <linearGradient id="sleepAreaGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
  </linearGradient>
  ```
- Crisp 2px line at the top edge of the area
- Horizontal reference band (7h-9h optimal range) in `rgba(59, 130, 246, 0.06)`
- 7-day moving average as thin dashed line in brighter accent
- **Quality as a separate sparkline** beneath (NOT overlaid — reduces visual noise)
- **Crosshair tooltip on hover**: vertical line + floating card showing date, hours, quality, latency, awakenings, supplements
- **Click/tap to pin** tooltip (important for mobile)

---

### 4. KPI Cards with Sparklines (High)

Add 14-day micro-trend sparklines inside each of the 6 KPI cards.

**Spec:**
- Tiny area sparkline (40x20px) in the bottom-right of each card
- Gradient fill matching the card's semantic color
- No axes, no labels — pure shape
- Delta badge showing change from previous 14 days: `+0.3h` in green or `-0.5` in red
- Badge style: `bg-rgba(color, 0.1), text-color, border-radius: 4px, padding: 2px 6px`

---

### 5. Differentiated Correlation Panels (High)

Each panel should use a DIFFERENT chart type:

**Location Quality — Keep horizontal bars, add embedded sparklines:**
- Horizontal bar per location (existing pattern)
- BUT add a tiny sparkline (60x16px) next to each bar showing the quality trend for that location over time
- Gradient fill on bars instead of flat color

**Supplement Impact — Dumbbell Chart (Cleveland Dot Plot):**
- Two dots connected by a line per supplement
- Left dot: avg quality WITHOUT (muted color, `#64748B`)
- Right dot: avg quality WITH (supplement's color)
- Line between = the effect
- Green line if positive effect, amber if negative
- Sort by effect size descending
- Far more information-dense than paired bars

**Intervention Impact — Diverging Bar Chart:**
- Centered on zero
- Bars extend RIGHT for positive delta, LEFT for negative
- Emerald for positive, red for negative
- Sort by absolute effect size
- Add opacity reduction for interventions with < 5 data points (low confidence)

---

### 6. Calendar Heatmap (Medium)

Inspired by GitHub contribution graph + Eight Sleep temperature mapping.

**Spec:**
- 7 rows (Mon-Sun) x N columns (weeks)
- Cell: 28x28px, border-radius 4px, gap 2px
- Color mapping by quality score:
  - 5 (Excellent): `#22C55E`
  - 4 (Good): `#3B82F6`
  - 3 (Fair): `#F59E0B`
  - 2 (Poor): `#F97316`
  - 1 (Terrible): `#EF4444`
  - No data: `#1e293b`
- Day labels on Y-axis: JetBrains Mono, 10px
- Hover: cell expands to 32x32px (spring animation, 150ms), tooltip with full details
- Header: streak counter ("12-day streak above quality 4")

---

### 7. Latency & Awakenings Sparkline Row (Medium)

Paired sparklines beneath the main trend chart, sharing the same time axis.

**Latency (left):**
- Area sparkline, inverted (lower = better, so lower values appear higher)
- Gradient: emerald at low values, amber at medium, red at high
- Reference line at 20 min (clinical threshold)

**Awakenings (right):**
- Stem plot (vertical lines from baseline with dots at top)
- Discrete visual for count data (0, 1, 2, 3)
- Color: green for 0, amber for 1-2, red for 3+

---

## Future: Apple Health Integration Placeholders

### Sleep Stages Hypnogram
- Full-width area chart spanning 8-10h of sleep
- Y-axis inverted: Awake (top) > REM > Light > Deep (bottom)
- Smooth `curveMonotoneX` interpolation (Oura-style, not stepped)
- Stage fills:
  - Deep: `rgba(99, 102, 241, 0.25)` (indigo)
  - Light: `rgba(129, 140, 248, 0.15)` (light indigo)
  - REM: `rgba(167, 139, 250, 0.20)` (violet)
  - Awake: `rgba(248, 113, 113, 0.15)` (red)
- Crisp 2px stroke at top of each zone
- Bloomberg touch: minimap bar below (20px tall) showing compressed full night

### Heart Rate Timeline
- Range area chart (Apple Health style): min-max band + average line
- Band fill: `rgba(239, 68, 68, 0.08)`
- Average line: `#EF4444`, 2px solid
- Resting HR: `#06B6D4`, 1px dashed
- Zone background coloring at 3-4% opacity:
  - < 60 BPM: `rgba(6, 182, 212, 0.04)` (resting)
  - 60-100: `rgba(34, 197, 94, 0.04)` (normal)
  - 100-140: `rgba(245, 158, 11, 0.04)` (elevated)
  - 140+: `rgba(239, 68, 68, 0.04)` (high)
- Persistent BPM badge in top-right: JetBrains Mono, 28px

### HRV Trend
- Individual measurements as dots (`#34D399`, 4px, opacity 0.6)
- 7-day rolling average as smooth line (`#10B981`, 2px)
- Confidence band: `rgba(52, 211, 153, 0.08)`
- Population reference range: dashed `#475569` lines
- Mini stat row above: Current, 7d Avg, 30d Avg, Trend arrow

---

## Sleep Stage & Heart Rate Color Tokens

```css
/* Sleep Stages */
--sleep-deep: #6366F1;    /* indigo-500 */
--sleep-light: #818CF8;   /* indigo-400 */
--sleep-rem: #A78BFA;     /* violet-400 */
--sleep-awake: #F87171;   /* red-400 */
--sleep-restless: #FBBF24; /* amber-400 */

/* Heart Rate Zones */
--hr-resting: #06B6D4;    /* cyan/info */
--hr-normal: #22C55E;     /* green/success */
--hr-elevated: #F59E0B;   /* amber/warning */
--hr-high: #EF4444;       /* red/danger */
--hr-peak: #A855F7;       /* purple */

/* HRV */
--hrv-primary: #34D399;   /* emerald-400 */
--hrv-average: #10B981;   /* emerald-500 */
--hrv-band: rgba(52, 211, 153, 0.08);
```

---

## Animation Timing Standards

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Score ring draw | 1200ms | `[0.16, 1, 0.3, 1]` (expo-out) | On mount |
| Chart line draw | 800ms | `[0.33, 1, 0.68, 1]` (ease-out) | On mount |
| Number count-up | 1000ms | `[0.16, 1, 0.3, 1]` | With ring/bar |
| Tooltip appear | 150ms | `[0.4, 0, 0.2, 1]` | On hover |
| Heatmap cell expand | 150ms | spring(400, 25) | On hover |
| Bar gauge fill | 800ms | `[0.33, 1, 0.68, 1]` | On mount |
| Sparkline fade-in | 400ms | ease-out | On mount |

---

## Recommended Page Layout

```
Row 1 (Hero):
  [Sleep Score Ring: 3 cols] [Sleep Window Chart: 5 cols] [Calendar Heatmap: 4 cols]

Row 2 (Trends):
  [Gradient Area Trend Chart: 8 cols] [Entry Form: 4 cols]

Row 3 (Micro-trends):
  [Latency Sparkline: 6 cols] [Awakenings Stem Plot: 6 cols]

Row 4 (Recent):
  [Recent Entries: 12 cols]

Row 5 (Correlation):
  [Location Bars + Sparklines: 4 cols] [Supplement Dumbbell: 4 cols] [Intervention Diverging: 4 cols]
```

---

## Implementation Order

1. Sleep Score Ring + animated arc (new component)
2. Gradient Area Trend Chart (rewrite TrendChart)
3. Sleep Window Chart (new component, uses existing bedtime/waketime data)
4. KPI sparklines (enhance existing cards)
5. Differentiated correlation panels (rewrite 3 components)
6. Calendar Heatmap (new component)
7. Latency/Awakenings sparklines (new component)
8. Add CSS tokens for sleep stages + HR zones (future Apple Health prep)

---

*Sources: Oura Ring, WHOOP, Apple Health, Eight Sleep, Sleep Cycle, Garmin Connect*
*Design principle: Garmin density + Oura polish + Bloomberg interactivity*
