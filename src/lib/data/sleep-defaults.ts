export type SleepLocation = "zurich" | "vienna" | "travel" | "other";
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export const LOCATIONS: { value: SleepLocation; label: string }[] = [
  { value: "zurich", label: "Zurich" },
  { value: "vienna", label: "Vienna (Katie visit)" },
  { value: "travel", label: "Travel / Hotel" },
  { value: "other", label: "Other" },
];

export const QUALITY_LABELS: Record<SleepQuality, { label: string; color: string }> = {
  1: { label: "Terrible", color: "#ef4444" },
  2: { label: "Poor", color: "#f97316" },
  3: { label: "Fair", color: "#f59e0b" },
  4: { label: "Good", color: "#22c55e" },
  5: { label: "Excellent", color: "#10b981" },
};

// === SUPPLEMENTS (comprehensive sleep science database) ===
export type SupplementTier = 1 | 2 | 3;

export interface Supplement {
  id: string;
  name: string;
  color: string;
  tier: SupplementTier;
  category: "mineral" | "amino" | "herb" | "hormone" | "lipid" | "other";
  doseLow: string;
  doseHigh: string;
  form: string;
  timing: string;
  mechanism: string;
  evidence: string;
  interactions: string[];
  cycleRequired: boolean;
  cyclePattern?: string;
}

// Tier 1: Strong evidence (multiple RCTs)
// Tier 2: Moderate evidence (some RCTs)
// Tier 3: Emerging/experimental

export const SUPPLEMENTS: Supplement[] = [
  // ── TIER 1 — Strong Evidence ──────────────────────────────────────────
  {
    id: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    color: "#3b82f6",
    tier: 1,
    category: "mineral",
    doseLow: "200mg",
    doseHigh: "400mg",
    form: "Bisglycinate",
    timing: "30-60 min before bed",
    mechanism: "GABA-B receptor activation, NMDA blockade, cortisol reduction, melatonin cofactor",
    evidence: "Abbasi et al. 2012 — improved sleep time, efficiency, melatonin, cortisol",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "magnesium-threonate",
    name: "Magnesium L-Threonate",
    color: "#60a5fa",
    tier: 1,
    category: "mineral",
    doseLow: "1000mg",
    doseHigh: "2000mg",
    form: "Magtein",
    timing: "30-60 min before bed",
    mechanism: "Crosses BBB, increases brain Mg2+ specifically",
    evidence: "Slutsky et al. 2010 — enhanced synaptic density in animal models",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "melatonin",
    name: "Melatonin (micro-dose)",
    color: "#8b5cf6",
    tier: 1,
    category: "hormone",
    doseLow: "0.3mg",
    doseHigh: "0.5mg",
    form: "IR or ER depending on issue",
    timing: "1-2 hours before desired sleep",
    mechanism: "MT1/MT2 receptor agonist, circadian phase signaling",
    evidence: "Ferracioli-Oda et al. 2013 meta-analysis of 19 RCTs",
    interactions: ["ashwagandha"],
    cycleRequired: false,
  },
  {
    id: "glycine",
    name: "Glycine",
    color: "#06b6d4",
    tier: 1,
    category: "amino",
    doseLow: "3g",
    doseHigh: "3g",
    form: "L-Glycine powder",
    timing: "30-60 min before bed",
    mechanism: "NMDA receptor → peripheral vasodilation → core temp drop 0.5C",
    evidence: "Inagawa 2006, Bannai 2012 — improved quality, faster SWS onset, no tolerance",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "l-theanine",
    name: "L-Theanine",
    color: "#10b981",
    tier: 1,
    category: "amino",
    doseLow: "200mg",
    doseHigh: "400mg",
    form: "Suntheanine",
    timing: "30-60 min before bed",
    mechanism: "Alpha wave promotion, GABA/serotonin/dopamine increase, glutamate blockade",
    evidence: "Hidese et al. 2019 — improved PSQI sleep quality scores",
    interactions: [],
    cycleRequired: false,
  },

  // ── TIER 2 — Moderate Evidence ────────────────────────────────────────
  {
    id: "apigenin",
    name: "Apigenin",
    color: "#f59e0b",
    tier: 2,
    category: "herb",
    doseLow: "50mg",
    doseHigh: "100mg",
    form: "Extract (from chamomile)",
    timing: "30-60 min before bed",
    mechanism: "GABA-A benzodiazepine site binding + CD38 inhibition (NAD+ preservation)",
    evidence: "Zick 2011, Chang & Chen 2016 — chamomile extract studies",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "phosphatidylserine",
    name: "Phosphatidylserine",
    color: "#ec4899",
    tier: 2,
    category: "lipid",
    doseLow: "100mg",
    doseHigh: "200mg",
    form: "Sunflower-derived",
    timing: "With dinner (~3h before bed)",
    mechanism: "Blunts ACTH → cortisol response; addresses elevated evening cortisol",
    evidence: "Monteleone 1992, Starks 2008 — cortisol reduction",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "tart-cherry",
    name: "Tart Cherry Extract",
    color: "#ef4444",
    tier: 2,
    category: "other",
    doseLow: "500mg",
    doseHigh: "500mg",
    form: "Montmorency extract (capsule preferred)",
    timing: "1 hour before bed",
    mechanism: "Natural melatonin + IDO inhibition → more tryptophan for serotonin/melatonin",
    evidence: "Howatson 2012, Losso 2018 — +84 min sleep in older adults",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    color: "#a855f7",
    tier: 2,
    category: "herb",
    doseLow: "300mg",
    doseHigh: "600mg",
    form: "KSM-66 or Sensoril",
    timing: "Sensoril at bedtime; KSM-66 morning + evening",
    mechanism: "Withanolides → GABAergic agonism, cortisol reduction 23-30%",
    evidence: "Langade et al. 2019 — improved onset, quality, anxiety (RCT)",
    interactions: ["melatonin"],
    cycleRequired: true,
    cyclePattern: "8 weeks on, 2-4 weeks off",
  },
  {
    id: "cbd",
    name: "CBD Oil",
    color: "#84cc16",
    tier: 2,
    category: "lipid",
    doseLow: "50mg",
    doseHigh: "150mg",
    form: "Full-spectrum sublingual",
    timing: "60 min before bed",
    mechanism: "GABA modulation, 5-HT1A agonism, cortisol reduction at higher doses",
    evidence: "Shannon et al. 2019 — 66.7% improved sleep",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "zinc",
    name: "Zinc",
    color: "#64748b",
    tier: 2,
    category: "mineral",
    doseLow: "15mg",
    doseHigh: "30mg",
    form: "Zinc picolinate or glycinate",
    timing: "With dinner",
    mechanism: "GABA/glutamate modulation, melatonin synthesis, adenosine metabolism",
    evidence: "Rondanelli 2011 — Mg+Zn+melatonin combo improved PSQI",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "vitamin-d",
    name: "Vitamin D3 + K2",
    color: "#fbbf24",
    tier: 2,
    category: "other",
    doseLow: "2000 IU",
    doseHigh: "5000 IU",
    form: "D3 + K2 (MK-7)",
    timing: "MORNING ONLY — never evening (suppresses melatonin)",
    mechanism: "VDR-clock gene interaction; deficiency → 50% higher poor sleep risk",
    evidence: "Gao 2018 meta-analysis; Majid 2018 — improved PSQI",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "omega3",
    name: "Omega-3 (DHA)",
    color: "#0ea5e9",
    tier: 2,
    category: "lipid",
    doseLow: "1g",
    doseHigh: "2g",
    form: "High-DHA fish oil or algal oil",
    timing: "Morning or lunch (with fat)",
    mechanism: "Pinealocyte membrane component → enhances melatonin synthesis; neuroinflammation reduction",
    evidence: "Montgomery 2014 — +58 min sleep, -7 awakenings/week in children",
    interactions: [],
    cycleRequired: false,
  },

  // ── TIER 3 — Emerging/Experimental ────────────────────────────────────
  {
    id: "magnolia-bark",
    name: "Magnolia Bark",
    color: "#78716c",
    tier: 3,
    category: "herb",
    doseLow: "200mg",
    doseHigh: "400mg",
    form: "Standardized >90% honokiol+magnolol",
    timing: "30 min before bed",
    mechanism: "Potent GABA-A positive allosteric modulator (benzodiazepine site)",
    evidence: "Kalman 2008 (Relora) — cortisol reduction; animal sleep studies",
    interactions: ["cbd", "gaba"],
    cycleRequired: false,
  },
  {
    id: "lemon-balm",
    name: "Lemon Balm",
    color: "#22c55e",
    tier: 3,
    category: "herb",
    doseLow: "300mg",
    doseHigh: "600mg",
    form: "Cyracos extract",
    timing: "30-60 min before bed",
    mechanism: "Rosmarinic acid inhibits GABA transaminase → more synaptic GABA",
    evidence: "Cases 2011 — 42% insomnia reduction (open-label)",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "pea",
    name: "PEA (Palmitoylethanolamide)",
    color: "#f97316",
    tier: 3,
    category: "lipid",
    doseLow: "300mg",
    doseHigh: "600mg",
    form: "Micronized (OptiPEA/Levagen+)",
    timing: "1-2 hours before bed",
    mechanism: "PPARa activation → neuroinflammation reduction; endocannabinoid tone",
    evidence: "Multiple pain RCTs; sleep-specific limited but mechanistically strong",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "valerian",
    name: "Valerian Root",
    color: "#059669",
    tier: 3,
    category: "herb",
    doseLow: "300mg",
    doseHigh: "600mg",
    form: "Standardized 0.8% valerenic acid",
    timing: "30-120 min before bed (needs 2-4 weeks)",
    mechanism: "Valerenic acid inhibits GABA breakdown (GABA transaminase)",
    evidence: "Mixed meta-analyses; requires 28+ days to evaluate",
    interactions: [],
    cycleRequired: false,
  },
  {
    id: "gaba",
    name: "GABA (PharmaGABA)",
    color: "#6366f1",
    tier: 3,
    category: "amino",
    doseLow: "100mg",
    doseHigh: "300mg",
    form: "PharmaGABA (fermented)",
    timing: "30 min before bed, empty stomach",
    mechanism: "Vagus nerve signaling from gut receptors; possible minor BBB penetration",
    evidence: "Boonstra 2015 — EEG changes suggest some central effects",
    interactions: ["magnolia-bark"],
    cycleRequired: false,
  },
];

// === STACKING PROTOCOLS ===
export interface SupplementStack {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "recovery";
  description: string;
  monthlyCostCHF: number;
  supplements: { supplementId: string; dose: string; timing: string }[];
}

export const SUPPLEMENT_STACKS: SupplementStack[] = [
  {
    id: "beginner",
    name: "Beginner Stack",
    level: "beginner",
    description:
      "Addresses 3 most common sleep disruptors: Mg deficiency, hyperarousal, core temp. Zero interactions, zero tolerance.",
    monthlyCostCHF: 35,
    supplements: [
      { supplementId: "magnesium-glycinate", dose: "400mg compound", timing: "45 min before bed" },
      { supplementId: "l-theanine", dose: "200mg", timing: "45 min before bed" },
      { supplementId: "glycine", dose: "3g powder", timing: "30 min before bed" },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate Stack",
    level: "intermediate",
    description:
      "Adds cortisol management, brain Mg, GABA-A modulation, and precise circadian signaling. Essentially the Huberman stack + PS.",
    monthlyCostCHF: 70,
    supplements: [
      { supplementId: "phosphatidylserine", dose: "200mg", timing: "With dinner (~3h before bed)" },
      { supplementId: "magnesium-glycinate", dose: "400mg compound", timing: "45-60 min before bed" },
      { supplementId: "magnesium-threonate", dose: "2000mg compound", timing: "45-60 min before bed" },
      { supplementId: "l-theanine", dose: "200-400mg", timing: "45-60 min before bed" },
      { supplementId: "apigenin", dose: "50mg", timing: "45-60 min before bed" },
      { supplementId: "glycine", dose: "3g powder", timing: "30 min before bed" },
      { supplementId: "melatonin", dose: "0.3-0.5mg", timing: "30 min before bed" },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Stack",
    level: "advanced",
    description:
      "Full protocol for stubborn chronic insomnia. Includes morning supplements, evening cortisol blunting, and targeted CBD.",
    monthlyCostCHF: 120,
    supplements: [
      { supplementId: "vitamin-d", dose: "4000 IU D3 + 100mcg K2", timing: "Morning with breakfast" },
      { supplementId: "ashwagandha", dose: "300mg KSM-66", timing: "Morning" },
      { supplementId: "phosphatidylserine", dose: "200mg", timing: "With dinner" },
      { supplementId: "tart-cherry", dose: "500mg", timing: "With dinner" },
      { supplementId: "ashwagandha", dose: "300mg KSM-66", timing: "With dinner" },
      { supplementId: "cbd", dose: "50-100mg full-spectrum", timing: "60 min before bed" },
      { supplementId: "magnesium-glycinate", dose: "400mg compound", timing: "45 min before bed" },
      { supplementId: "magnesium-threonate", dose: "2000mg compound", timing: "45 min before bed" },
      { supplementId: "l-theanine", dose: "400mg", timing: "45 min before bed" },
      { supplementId: "apigenin", dose: "50mg", timing: "45 min before bed" },
      { supplementId: "glycine", dose: "3g", timing: "30 min before bed" },
      { supplementId: "melatonin", dose: "0.5mg ER", timing: "30 min before bed" },
    ],
  },
  {
    id: "recovery",
    name: "Recovery Night",
    level: "recovery",
    description:
      "Use the night AFTER a terrible sleep. Higher doses, added magnolia bark. Not for nightly use.",
    monthlyCostCHF: 0,
    supplements: [
      { supplementId: "magnesium-glycinate", dose: "600mg compound (higher)", timing: "60 min before bed" },
      { supplementId: "glycine", dose: "3g", timing: "45 min before bed" },
      { supplementId: "l-theanine", dose: "400mg (max)", timing: "45 min before bed" },
      { supplementId: "melatonin", dose: "1mg ER (one-time higher)", timing: "45 min before bed" },
      { supplementId: "magnolia-bark", dose: "300mg", timing: "30 min before bed" },
      { supplementId: "tart-cherry", dose: "500mg", timing: "30 min before bed" },
    ],
  },
];

// === SLEEP INTERVENTIONS (non-supplement) ===
export type InterventionCategory =
  | "exercise"
  | "breathing"
  | "meditation"
  | "environment"
  | "nutrition"
  | "technology"
  | "cbt-i";

export interface SleepIntervention {
  id: string;
  name: string;
  category: InterventionCategory;
  timing: string;
  duration: string;
  evidenceLevel: "high" | "moderate" | "low";
  description: string;
  protocol: string;
  keyStudy: string;
}

export const INTERVENTIONS: SleepIntervention[] = [
  // Exercise
  {
    id: "resistance-training",
    name: "Morning Resistance Training",
    category: "exercise",
    timing: "7-9 AM (never after 6 PM)",
    duration: "45-75 min",
    evidenceLevel: "high",
    description:
      "Compound movements increase adenosine/GH demand → more slow-wave sleep. Knee-safe: hip thrusts, upper body.",
    protocol:
      "3-5 sets, 6-12 reps, RPE 7-8. Tempo eccentrics (3-4 sec negatives). Avoid RPE 10 (excess cortisol).",
    keyStudy: "Kovacevic 2018, Alley 2015 — morning RT = +45 min total sleep",
  },
  {
    id: "swimming",
    name: "Evening Swimming",
    category: "exercise",
    timing: "4-7 PM",
    duration: "30-45 min",
    evidenceLevel: "high",
    description:
      "Zero knee impact + post-swim cooling cascade triggers sleep onset. Best exercise for knee injuries.",
    protocol:
      "Freestyle/backstroke (avoid breaststroke kick). Moderate intensity. End with easy backstroke cool-down.",
    keyStudy: "Horne & Reid 1985; Sung & Tochihara 2000",
  },

  // Breathing
  {
    id: "physiological-sigh",
    name: "Physiological Sigh",
    category: "breathing",
    timing: "Anytime, especially pre-bed",
    duration: "5 min",
    evidenceLevel: "high",
    description:
      "Double nasal inhale + long exhale. Stanford RCT proved it beats meditation for calming.",
    protocol:
      "Two quick nasal inhales (second tops off lungs) → one long mouth exhale. 5 min of cycles.",
    keyStudy: "Balban et al. 2023, Cell Reports Medicine (Stanford)",
  },
  {
    id: "resonance-breathing",
    name: "Resonance Frequency Breathing",
    category: "breathing",
    timing: "60-90 min before bed",
    duration: "10-20 min",
    evidenceLevel: "high",
    description:
      "Breathe at ~5.5 breaths/min to maximize HRV. Most powerful voluntary HRV intervention.",
    protocol:
      "5.5 sec inhale, 5.5 sec exhale. Use biofeedback app (Elite HRV + Polar H10 strap). 20 min daily.",
    keyStudy: "Lehrer & Gevirtz 2014 meta-analysis; 2019 study -50% insomnia severity",
  },

  // Meditation
  {
    id: "yoga-nidra",
    name: "Yoga Nidra / NSDR",
    category: "meditation",
    timing: "Before bed or in bed",
    duration: "20-30 min",
    evidenceLevel: "high",
    description:
      "Guided body scan producing theta/delta brainwaves. 65% dopamine increase (Datta 2021).",
    protocol:
      "Lie flat, follow guided audio. Body rotation → breath counting → visualization. Free: Huberman NSDR on YouTube.",
    keyStudy: "Datta et al. 2021, PLOS ONE; Moszeik et al. 2020",
  },

  // Environment
  {
    id: "morning-light",
    name: "Morning Bright Light (10,000 lux)",
    category: "environment",
    timing: "Within 30 min of waking",
    duration: "20-30 min",
    evidenceLevel: "high",
    description:
      "Anchors circadian phase, triggers cortisol awakening response. Critical Oct-Mar in Zurich.",
    protocol:
      "SAD lamp 40-60cm from face. Or outdoor walk (even overcast = 1000-5000 lux). DO NOT wear sunglasses.",
    keyStudy: "Zeitzer et al. 2000; multiple SAD therapy reviews (Level 1 evidence)",
  },
  {
    id: "evening-light-block",
    name: "Evening Blue Light Blocking",
    category: "environment",
    timing: "2-3 hours before bed",
    duration: "Ongoing",
    evidenceLevel: "high",
    description:
      "Block 420-530nm wavelengths. Even 100 lux room light = 50% max circadian disruption.",
    protocol:
      "Amber/red glasses (Ra Optics, UVEX SCT-Orange). Dim lights to <50 lux. Red/amber bulbs only.",
    keyStudy: "Zeitzer et al. 2000 (100 lux finding); Cajochen et al. 2011 (screen light)",
  },
  {
    id: "bedroom-temp",
    name: "Bedroom Temperature (18-19C)",
    category: "environment",
    timing: "All night",
    duration: "All night",
    evidenceLevel: "high",
    description:
      "Core body temp must drop 1-1.5C for sleep onset. Bedroom 18-19C is optimal.",
    protocol:
      "Set thermostat to 18-19C. Consider Eight Sleep Pod for active cooling. Warm socks for feet (vasodilation paradox).",
    keyStudy: "Okamoto-Mizuno & Mizuno 2012 review; Eight Sleep internal data +32% deep sleep",
  },
  {
    id: "cold-shower",
    name: "Cold Exposure (Shower/Plunge)",
    category: "environment",
    timing: "60-90 min before bed (NOT closer)",
    duration: "2-5 min",
    evidenceLevel: "moderate",
    description:
      "Initial vasoconstriction → rebound vasodilation → rapid core temp drop → sleep onset.",
    protocol:
      "Last 2-3 min of shower on coldest. Focus upper back/neck. 90 min before bed minimum.",
    keyStudy: "Haghayegh 2019 meta-analysis; 2024 EJP study +18% deep sleep",
  },

  // Technology
  {
    id: "mouth-taping",
    name: "Mouth Taping",
    category: "technology",
    timing: "During sleep",
    duration: "All night",
    evidenceLevel: "moderate",
    description:
      "Ensures nasal breathing during sleep. Nasal NO improves O2 absorption 10-15%. Reduces snoring.",
    protocol:
      "3M Micropore tape vertical over lips. Start during day. Rule out sleep apnea first.",
    keyStudy: "Nestor 2020 Stanford self-study; 2022 Healthcare study -50% snoring",
  },
  {
    id: "red-light",
    name: "Red Light Therapy (630-660nm)",
    category: "technology",
    timing: "1-2 hours before bed",
    duration: "15-30 min",
    evidenceLevel: "moderate",
    description:
      "Does NOT suppress melatonin. May stimulate it. Enhances mitochondrial ATP production.",
    protocol:
      "Panel at 6-18 inches. 660nm + 850nm. All other lights off. Creates sunset simulation.",
    keyStudy: "Zhao 2012 — improved PSQI, serum melatonin in athletes",
  },

  // CBT-I
  {
    id: "sleep-restriction",
    name: "Sleep Restriction Therapy",
    category: "cbt-i",
    timing: "Daily schedule",
    duration: "4-8 weeks",
    evidenceLevel: "high",
    description:
      "Gold standard CBT-I component. Restrict time in bed to actual sleep time. Builds massive sleep pressure.",
    protocol:
      "Calculate avg sleep time → set window to match (min 5h) → fixed wake time → expand 15 min when >85% efficient.",
    keyStudy: "ACP 2016 first-line rec; 2021 Cochrane review; 70-80% improvement rate",
  },
  {
    id: "stimulus-control",
    name: "Stimulus Control",
    category: "cbt-i",
    timing: "Ongoing behavioral rule",
    duration: "Continuous",
    evidenceLevel: "high",
    description:
      "Bed = sleep + sex only. If awake >20 min, leave bed. Fixed wake time 7 days/week.",
    protocol:
      "Only to bed when sleepy (not tired). Up if awake >20 min. Boring activity in dim light. Return when sleepy.",
    keyStudy: "Bootzin technique — decades of CBT-I RCT evidence",
  },
  {
    id: "cognitive-shuffle",
    name: "Cognitive Shuffle",
    category: "cbt-i",
    timing: "In bed at lights out",
    duration: "5-15 min",
    evidenceLevel: "moderate",
    description:
      "Visualize random, unrelated objects for each letter of a word. Mimics pre-sleep hypnagogic mentation.",
    protocol:
      "Pick a word (e.g. GARDEN). For G: giraffe, grape, guitar... For A: airplane, avocado... 3-5 sec per image.",
    keyStudy: "Beaudoin 2013/2017, SFU — directly competes with rumination",
  },
  {
    id: "worry-journal",
    name: "Worry Journal + To-Do List",
    category: "cbt-i",
    timing: "2 hours before bed (NOT in bedroom)",
    duration: "15-20 min",
    evidenceLevel: "moderate",
    description:
      "Write worries + one next action each. To-do list reduces sleep latency by 9 min (Scullin 2018).",
    protocol:
      "Specific chair/desk, not bedroom. Timer 15 min. Every worry → one concrete next step. Close notebook.",
    keyStudy: "Scullin & Bliwise 2018, J Exp Psych; Pennebaker expressive writing",
  },
];

// === EVENING ROUTINE PROTOCOL ===
export interface RoutineStep {
  minutesBefore: number;
  activity: string;
  interventionId?: string;
  supplementIds?: string[];
}

export const EVENING_ROUTINE: RoutineStep[] = [
  { minutesBefore: 180, activity: "Last meal (sleep-optimized dinner)", interventionId: undefined },
  { minutesBefore: 120, activity: "Worry journal + tomorrow's to-do list", interventionId: "worry-journal" },
  { minutesBefore: 90, activity: "Cold shower (last 2-3 min cold)", interventionId: "cold-shower" },
  { minutesBefore: 90, activity: "Put on blue-blocking glasses", interventionId: "evening-light-block" },
  { minutesBefore: 60, activity: "Resonance breathing (with biofeedback)", interventionId: "resonance-breathing" },
  { minutesBefore: 60, activity: "Evening supplements (CBD if using)", supplementIds: ["cbd"] },
  {
    minutesBefore: 45,
    activity: "Main supplement stack",
    supplementIds: ["magnesium-glycinate", "magnesium-threonate", "l-theanine", "apigenin"],
  },
  { minutesBefore: 30, activity: "Glycine + melatonin", supplementIds: ["glycine", "melatonin"] },
  { minutesBefore: 30, activity: "Dim all lights. No screens. Read fiction.", interventionId: undefined },
  { minutesBefore: 0, activity: "NSDR/Yoga Nidra OR Cognitive Shuffle", interventionId: "yoga-nidra" },
];
