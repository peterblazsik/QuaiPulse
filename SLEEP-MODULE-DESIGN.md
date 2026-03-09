# Sleep Module — Comprehensive Design Document

## Overview
QuaiPulse Sleep Module: a research-backed, data-dense sleep optimization system built for a 49-year-old male with chronic sleep problems, bilateral knee damage, relocating to Zurich (47.4N latitude).

## Architecture

### Data Layer (`src/lib/data/sleep-defaults.ts`)
- **20 supplements** across 3 evidence tiers with doses, forms, timing, mechanisms, interactions, cycling
- **4 stacking protocols** (beginner/intermediate/advanced/recovery) with monthly costs
- **15 interventions** across 7 categories (exercise, breathing, meditation, environment, nutrition, technology, CBT-i)
- **Evening routine timeline** with minute-by-minute protocol

### Store (`src/lib/stores/sleep-store.ts`)
Enhanced SleepEntry with:
- `interventions[]` — track which interventions were done
- `bedtime` / `waketime` — precise timing
- `sleepLatency` — minutes to fall asleep
- `awakenings` — number of night wake-ups

### Pages
- `/sleep` — Enhanced tracker with 6 KPI cards (hours, quality, latency, awakenings, best location, best supplement), intervention correlation panel, supplement impact panel
- `/sleep/protocol` — Protocol library with filterable supplement database, stacking protocol cards, intervention library, evening routine timeline

## Research Sources (6 agents, ~2200 lines of research)

### 1. Supplements (Tier 1-3)
- Magnesium (glycinate, threonate, taurate), Melatonin (micro-dose 0.3-0.5mg), Glycine (3g), L-Theanine
- Apigenin, Phosphatidylserine, Tart Cherry, Ashwagandha, CBD, Zinc, Vitamin D, Omega-3
- Magnolia Bark, Lemon Balm, PEA, Valerian, GABA
- 4 stacking levels with specific doses and timing
- Interaction matrix and cycling schedules

### 2. Exercise/Training (Knee-safe)
- Morning resistance training (hip thrusts, upper body, leg curls — tempo eccentrics)
- Swimming/aqua jogging (zero impact, thermoregulatory effect)
- Yoga Nidra/NSDR (highest-ROI practice, 65% dopamine increase)
- Evening walks (Shinrin-yoku at Uetliberg/Sihlwald)
- Stretching/foam rolling protocol

### 3. Stress & Meditation
- Yoga Nidra/NSDR protocols (10/20/30/45 min)
- Vipassana noting technique for rumination
- Cognitive Shuffle (Beaudoin technique)
- CBT-I (sleep restriction + stimulus control)
- HRV biofeedback training
- Vagus nerve stimulation techniques

### 4. Nutrition
- Meal timing (finish 3h before bed)
- Tryptophan-insulin-BBB mechanism (carb:protein 3:1 at dinner)
- Sleep foods: kiwi (+35% latency reduction), tart cherry (+84 min), salmon, honey
- Anti-sleep foods: caffeine (noon cutoff), alcohol, tyramine, dark chocolate after 2pm
- Micronutrient deficiencies: Mg, Zn, Fe (ferritin >75), B6, D, Omega-3
- Gut-sleep axis: specific probiotic strains

### 5. Technology & Unconventional
- Oura Ring + Eight Sleep Pod (recommended stack)
- Sleep apnea screening (WatchPAT ONE)
- Mouth taping (3M Micropore)
- Red light therapy (630-660nm)
- Chronotype optimization
- Age-49 medical considerations (testosterone-sleep cycle, GH during N3)

### 6. Environment & Circadian
- Light engineering: 10,000+ lux morning, block 420-530nm evening, dawn simulation
- Temperature: 18-19C bedroom, warm bath paradox, Eight Sleep
- Sound: pink noise (+25% slow-wave), binaural beats (delta 1-4Hz)
- Air quality: CO2 <1000ppm, humidity 40-60%
- Mattress/position for knee injuries

## Key Metrics Tracked
- Sleep duration (hours)
- Subjective quality (1-5)
- Sleep onset latency (minutes)
- Night awakenings (count)
- Bedtime/wake time consistency
- Location impact
- Supplement correlation (with/without delta)
- Intervention correlation (with/without delta)
