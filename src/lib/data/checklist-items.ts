export interface ChecklistItemData {
  id: string;
  phase: "mar-apr" | "may" | "jun" | "jul";
  category: string;
  title: string;
  description?: string;
  dueDate?: string;
  url?: string;
  /** Internal module link (e.g., "/apartments", "/budget") */
  moduleLink?: string;
  moduleLinkLabel?: string;
  sortOrder: number;
  dependsOn?: string[];
  hardDeadline?: string;
  estimatedDays?: number;
}

export const CHECKLIST_ITEMS: ChecklistItemData[] = [
  // === MARCH-APRIL ===
  {
    id: "cl-01",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Set up alerts on Homegate, Flatfox, ImmoScout24",
    description: "Pre-filter for Kreis 2,3,4,5,8 — 1-2 rooms, CHF 1,800-2,800",
    moduleLink: "/apartments",
    moduleLinkLabel: "Live Feed",
    sortOrder: 1,
  },
  {
    id: "cl-02",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Create rental dossier PDF",
    description: "Employment contract, 3 payslips, debt register extract, passport, intro letter",
    moduleLink: "/dossier",
    moduleLinkLabel: "Dossier",
    sortOrder: 2,
    dependsOn: ["cl-03", "cl-04", "cl-05"],
    estimatedDays: 3,
  },
  {
    id: "cl-03",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Request debt register extract (Betreibungsregisterauszug)",
    description: "From Amsterdam municipality — takes 2-3 weeks",
    sortOrder: 3,
    estimatedDays: 21,
  },
  {
    id: "cl-04",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Get landlord reference letter from current apartment",
    sortOrder: 4,
    estimatedDays: 7,
  },
  {
    id: "cl-05",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Write personal intro letter (Bewerbungsschreiben)",
    description: "Who you are, why Zurich, stable income, single professional — use AI to polish",
    sortOrder: 5,
    estimatedDays: 2,
  },
  {
    id: "cl-06",
    phase: "mar-apr",
    category: "Administration",
    title: "Apply for Swiss work permit (L or B permit)",
    description: "HR should handle this — confirm with Zurich Insurance HR",
    sortOrder: 6,
    estimatedDays: 30,
  },
  {
    id: "cl-07",
    phase: "mar-apr",
    category: "Administration",
    title: "Research health insurance options (KVG basic)",
    description: "Compare: Helsana, CSS, SWICA, Sanitas. Cheapest basic ~CHF 280-350/mo",
    moduleLink: "/budget",
    moduleLinkLabel: "Budget",
    sortOrder: 7,
    estimatedDays: 5,
  },
  {
    id: "cl-08",
    phase: "mar-apr",
    category: "Social",
    title: "Join Schachgesellschaft Zurich online / register interest",
    moduleLink: "/social",
    moduleLinkLabel: "Social Map",
    sortOrder: 8,
  },
  {
    id: "cl-09",
    phase: "mar-apr",
    category: "Social",
    title: "Sign up for Zurich AI Meetup / GenAI Zurich on Meetup.com",
    sortOrder: 9,
  },

  // === MAY ===
  {
    id: "cl-10",
    phase: "may",
    category: "Apartment Search",
    title: "Schedule apartment viewings (aim for 5-10)",
    description: "Book a long weekend or take a few days off for Zurich apartment hunting trip",
    moduleLink: "/apartments?tab=pipeline",
    moduleLinkLabel: "Pipeline",
    sortOrder: 10,
    dependsOn: ["cl-02"],
    estimatedDays: 3,
  },
  {
    id: "cl-11",
    phase: "may",
    category: "Apartment Search",
    title: "Apply to top 3 apartments",
    description: "Send dossier immediately after viewing. Speed matters in Zurich.",
    sortOrder: 11,
    dependsOn: ["cl-10"],
    estimatedDays: 5,
  },
  {
    id: "cl-12",
    phase: "may",
    category: "Insurance",
    title: "Choose health insurance provider and plan",
    description: "Must register within 3 months of arrival. Can choose before moving.",
    sortOrder: 12,
    dependsOn: ["cl-07"],
    estimatedDays: 3,
  },
  {
    id: "cl-13",
    phase: "may",
    category: "Administration",
    title: "Open Swiss bank account (if possible remotely)",
    description: "UBS, ZKB, or Neon (digital). Some allow pre-opening before residence.",
    sortOrder: 13,
    estimatedDays: 14,
  },
  {
    id: "cl-14",
    phase: "may",
    category: "Administration",
    title: "Research SBB Half-Fare card (Halbtax)",
    description: "CHF 185/year — 50% off all public transport. Essential for Vienna trips by train.",
    sortOrder: 14,
  },
  {
    id: "cl-15",
    phase: "may",
    category: "Move",
    title: "Get moving quotes (Amsterdam to Zurich)",
    description: "Compare 3 international movers. Budget ~CHF 3,000-5,000 for a studio/1BR.",
    sortOrder: 15,
    estimatedDays: 7,
  },

  // === JUNE ===
  {
    id: "cl-16",
    phase: "jun",
    category: "Apartment Search",
    title: "Sign apartment lease",
    description: "Review contract carefully. Check Kaution (deposit) = 3 months rent typically.",
    sortOrder: 16,
    dependsOn: ["cl-11"],
    estimatedDays: 1,
    hardDeadline: "2026-06-15",
  },
  {
    id: "cl-17",
    phase: "jun",
    category: "Move",
    title: "Book moving company / schedule move date",
    description: "Aim for last week of June to settle before July 1 start.",
    sortOrder: 17,
    dependsOn: ["cl-16", "cl-15"],
    estimatedDays: 3,
    hardDeadline: "2026-06-20",
  },
  {
    id: "cl-18",
    phase: "jun",
    category: "Move",
    title: "Cancel / transfer Amsterdam utilities",
    description: "Electricity, internet, water. Give 1 month notice.",
    sortOrder: 18,
    dependsOn: ["cl-16"],
    estimatedDays: 2,
  },
  {
    id: "cl-19",
    phase: "jun",
    category: "Administration",
    title: "Deregister from Amsterdam municipality",
    description: "BRP uitschrijving — do this in the last week before moving.",
    sortOrder: 19,
    dependsOn: ["cl-16"],
    estimatedDays: 1,
    hardDeadline: "2026-06-28",
  },
  {
    id: "cl-20",
    phase: "jun",
    category: "Insurance",
    title: "Cancel Dutch health insurance (after Swiss coverage confirmed)",
    sortOrder: 20,
    dependsOn: ["cl-12"],
    estimatedDays: 2,
  },
  {
    id: "cl-21",
    phase: "jun",
    category: "Move",
    title: "Set up mail forwarding (PostNL to Swiss address)",
    sortOrder: 21,
    dependsOn: ["cl-16"],
    estimatedDays: 2,
  },
  {
    id: "cl-22",
    phase: "jun",
    category: "Social",
    title: "Farewell events with Amsterdam friends",
    sortOrder: 22,
  },

  // === JULY ===
  {
    id: "cl-23",
    phase: "jul",
    category: "Setup",
    title: "Register at Kreisburo (residents registration)",
    description: "Must register within 14 days of arrival. Bring passport, work permit, lease.",
    sortOrder: 23,
    dependsOn: ["cl-16", "cl-06"],
    hardDeadline: "2026-07-14",
    estimatedDays: 1,
  },
  {
    id: "cl-24",
    phase: "jul",
    category: "Setup",
    title: "Buy ZVV BonusPass (monthly transport)",
    description: "CHF 85/mo for zone 110. Or annual for savings.",
    sortOrder: 24,
    dependsOn: ["cl-23"],
    estimatedDays: 1,
  },
  {
    id: "cl-25",
    phase: "jul",
    category: "Setup",
    title: "Set up internet at new apartment",
    description: "Swisscom, Sunrise, or Salt. Book 2 weeks ahead for installation.",
    sortOrder: 25,
    dependsOn: ["cl-16"],
    estimatedDays: 14,
  },
  {
    id: "cl-26",
    phase: "jul",
    category: "Setup",
    title: "Join a gym",
    description: "Based on neighborhood ranking — PureGym (budget), Kieser (rehab), Holmes Place (premium).",
    moduleLink: "/gym",
    moduleLinkLabel: "Gym Finder",
    sortOrder: 26,
    dependsOn: ["cl-23"],
    estimatedDays: 1,
  },
  {
    id: "cl-27",
    phase: "jul",
    category: "Setup",
    title: "Buy SBB Half-Fare card",
    sortOrder: 27,
    dependsOn: ["cl-23"],
    estimatedDays: 1,
  },
  {
    id: "cl-28",
    phase: "jul",
    category: "Social",
    title: "Attend first chess club evening",
    sortOrder: 28,
  },
  {
    id: "cl-29",
    phase: "jul",
    category: "Social",
    title: "Attend first AI meetup",
    sortOrder: 29,
  },
  {
    id: "cl-30",
    phase: "jul",
    category: "Setup",
    title: "First day at Zurich Insurance — Quai Zurich Campus",
    dueDate: "2026-07-01",
    sortOrder: 30,
    hardDeadline: "2026-07-01",
  },

  // === CRIMINAL RECORD CERTIFICATES ===
  {
    id: "cl-31",
    phase: "mar-apr",
    category: "Administration",
    title: "Request Austrian Strafregisterbescheinigung (criminal record certificate)",
    description:
      "Apply online via oesterreich.gv.at (€8.60, instant) — requires ID Austria login. If needed for employer, get apostille from BMEIA. Valid ~3 months.",
    sortOrder: 31,
    estimatedDays: 14,
  },
  {
    id: "cl-32",
    phase: "mar-apr",
    category: "Administration",
    title: "Request Dutch VOG (Verklaring Omtrent het Gedrag)",
    description:
      "Email non-resident application to vog.np.rni@justis.nl (€41.35). Need: passport copy, application form from justis.nl. Takes 4-8 weeks. Get apostille from Dutch district court for Swiss use.",
    sortOrder: 32,
    estimatedDays: 56,
    hardDeadline: "2026-05-31",
  },
  {
    id: "cl-33",
    phase: "jul",
    category: "Setup",
    title: "Request Swiss Strafregisterauszug",
    description:
      "CHF 17 at post office or online via e-service.admin.ch. Apply after Kreisbüro registration.",
    sortOrder: 33,
    dependsOn: ["cl-23"],
    estimatedDays: 7,
  },

  // === REGISTRATION & PERMITS (Post-Arrival) ===
  {
    id: "cl-34",
    phase: "jul",
    category: "Setup",
    title: "Book biometrics appointment at Migrationsamt",
    description:
      "After Kreisbüro registration, book via kanton website for biometric data capture. ~1-2 weeks wait. Required for B-permit card.",
    sortOrder: 34,
    dependsOn: ["cl-23"],
    estimatedDays: 14,
  },
  {
    id: "cl-35",
    phase: "jul",
    category: "Setup",
    title: "Collect B-permit card and deliver copy to HR",
    description:
      "Pick up residence permit card from Migrationsamt after biometrics. Provide copy to Zurich Insurance HR immediately.",
    sortOrder: 35,
    dependsOn: ["cl-34"],
    estimatedDays: 7,
  },
  {
    id: "cl-36",
    phase: "jul",
    category: "Administration",
    title: "Convert driving license to Swiss license",
    description:
      "Must convert within 12 months of arrival. Need: eye exam (CHF 25 from certified optician), passport photo, Dutch license, Swiss permit copy. Visit Strassenverkehrsamt.",
    sortOrder: 36,
    dependsOn: ["cl-23"],
    estimatedDays: 30,
    hardDeadline: "2027-06-30",
  },

  // === INSURANCE ===
  {
    id: "cl-37",
    phase: "mar-apr",
    category: "Insurance",
    title: "Apply for VVG supplementary health insurance (before move!)",
    description:
      "Apply BEFORE moving to avoid pre-existing knee condition exclusions. Compare SWICA, Helsana, CSS for physio coverage. Health questionnaire applies.",
    sortOrder: 37,
    estimatedDays: 14,
  },
  {
    id: "cl-38",
    phase: "jun",
    category: "Insurance",
    title: "Get Privathaftpflicht (personal liability insurance)",
    description:
      "CHF 10-20/mo. Many landlords require proof before lease signing. Compare Mobiliar, AXA, Zurich, Baloise.",
    sortOrder: 38,
    dependsOn: ["cl-16"],
    estimatedDays: 3,
  },
  {
    id: "cl-39",
    phase: "jul",
    category: "Insurance",
    title: "Arrange Hausratversicherung (household contents insurance)",
    description:
      "CHF 15-40/mo. Covers theft, fire, water damage. Often bundled with liability. Activate on lease start date.",
    sortOrder: 39,
    dependsOn: ["cl-16"],
    estimatedDays: 3,
  },
  {
    id: "cl-40",
    phase: "jul",
    category: "Insurance",
    title: "Confirm UVG coverage details with Zurich Insurance HR",
    description:
      "Verify non-occupational accident (NBUVG) coverage starts on day 1. Check deduction rate on payslip. UVG covers medical costs 100% for accidents.",
    sortOrder: 40,
    dependsOn: ["cl-30"],
    estimatedDays: 2,
  },

  // === PENSION & TAX ===
  {
    id: "cl-41",
    phase: "mar-apr",
    category: "Finance",
    title: "Request Vorsorgereglement from Zurich Insurance HR",
    description:
      "Pension plan rules document — defines BVG contribution rates, risk benefits, conversion rate, and buy-in potential. Critical for financial planning.",
    sortOrder: 41,
    estimatedDays: 7,
  },
  {
    id: "cl-42",
    phase: "may",
    category: "Finance",
    title: "Choose Pillar 3a provider and open account",
    description:
      "Investment-based: VIAC, finpension, or frankly (ZKB). At 49, equity-heavy funds appropriate. Max CHF 7,258/yr. Open before July to contribute from first paycheck.",
    moduleLink: "/budget",
    moduleLinkLabel: "Budget",
    sortOrder: 42,
    estimatedDays: 7,
  },
  {
    id: "cl-43",
    phase: "may",
    category: "Finance",
    title: "Request Austrian pension statement (Pensionskonto) from PVA",
    description:
      "Contact Austrian PVA for contribution years summary. Under EU bilateral agreement, Austrian years count toward Swiss eligibility. Needed for combined projection.",
    sortOrder: 43,
    estimatedDays: 21,
  },
  {
    id: "cl-44",
    phase: "jun",
    category: "Finance",
    title: "Discuss Expatriate tax status with employer",
    description:
      "Foreign specialist assigned by employer may qualify for Expatriate ruling with Zurich cantonal tax office. If approved: Amsterdam housing costs during transition become deductible.",
    sortOrder: 44,
    estimatedDays: 14,
  },
  {
    id: "cl-45",
    phase: "jul",
    category: "Finance",
    title: "Review Quellensteuer tariff code on first payslip",
    description:
      "Verify correct code (B0 or B1 depending on Katie's recognition as dependent). Income >CHF 120K = mandatory ordinary taxation. Quellensteuer is credited against final tax.",
    sortOrder: 45,
    dependsOn: ["cl-30"],
    estimatedDays: 1,
  },
  {
    id: "cl-46",
    phase: "jul",
    category: "Finance",
    title: "Request BVG Einkaufspotenzial (buy-in potential) calculation",
    description:
      "After 6 months at employer, request from pension fund. Late start at 49 = large buy-in potential (CHF 200-400K+). Buy-ins are fully tax-deductible. First 5 years: limited to 20% of regulatory contributions.",
    sortOrder: 46,
    dependsOn: ["cl-41"],
    estimatedDays: 14,
  },

  // === MOVE PREPARATION ===
  {
    id: "cl-47",
    phase: "jun",
    category: "Move",
    title: "Collect moving cost receipts for tax deduction",
    description:
      "Relocation costs are deductible in the year of move (2026). Keep all receipts: shipping, travel, temporary accommodation. Especially important if Expatriate status is approved.",
    sortOrder: 47,
    estimatedDays: 1,
  },
  {
    id: "cl-48",
    phase: "jul",
    category: "Setup",
    title: "Register with a GP (Hausarzt) for physio referrals",
    description:
      "Not legally required but practically essential. KVG covers 9 physio sessions per doctor's prescription (renewable). Knee rehab needs ongoing referrals.",
    sortOrder: 48,
    dependsOn: ["cl-12"],
    estimatedDays: 7,
  },
];

/**
 * Merge static items with custom user-added items, sorted by sortOrder.
 */
export function getAllChecklistItems(
  customItems: ChecklistItemData[]
): ChecklistItemData[] {
  return [...CHECKLIST_ITEMS, ...customItems].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

/**
 * Check if an item ID belongs to a user-created custom item.
 */
export function isCustomItem(id: string): boolean {
  return id.startsWith("custom-");
}
