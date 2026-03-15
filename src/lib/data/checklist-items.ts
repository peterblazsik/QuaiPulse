import type { ChecklistOwner } from "@/lib/types";

export interface ChecklistItemData {
  id: string;
  phase: "mar-apr" | "may" | "jun" | "jul" | "aug-sep";
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
  owner?: ChecklistOwner;
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
    owner: "self",
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
    owner: "self",
  },
  {
    id: "cl-03",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Request debt register extract (Betreibungsregisterauszug)",
    description: "From Amsterdam municipality — takes 2-3 weeks",
    sortOrder: 3,
    estimatedDays: 21,
    owner: "self",
  },
  {
    id: "cl-04",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Get landlord reference letter from current apartment",
    sortOrder: 4,
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-05",
    phase: "mar-apr",
    category: "Apartment Search",
    title: "Write personal intro letter (Bewerbungsschreiben)",
    description: "Who you are, why Zurich, stable income, single professional — use AI to polish",
    sortOrder: 5,
    estimatedDays: 2,
    owner: "self",
  },
  {
    id: "cl-06",
    phase: "mar-apr",
    category: "Administration",
    title: "Apply for Swiss work permit (L or B permit)",
    description: "HR should handle this — confirm with Zurich Insurance HR",
    sortOrder: 6,
    estimatedDays: 30,
    owner: "hr",
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
    owner: "self",
  },
  {
    id: "cl-08",
    phase: "mar-apr",
    category: "Social",
    title: "Join Schachgesellschaft Zurich online / register interest",
    moduleLink: "/social",
    moduleLinkLabel: "Social Map",
    sortOrder: 8,
    owner: "self",
  },
  {
    id: "cl-09",
    phase: "mar-apr",
    category: "Social",
    title: "Sign up for Zurich AI Meetup / GenAI Zurich on Meetup.com",
    sortOrder: 9,
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
  },
  {
    id: "cl-13",
    phase: "may",
    category: "Administration",
    title: "Open Swiss bank account (if possible remotely)",
    description: "UBS, ZKB, or Neon (digital). Some allow pre-opening before residence.",
    sortOrder: 13,
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-14",
    phase: "may",
    category: "Administration",
    title: "Research SBB Half-Fare card (Halbtax)",
    description: "CHF 185/year — 50% off all public transport. Essential for Vienna trips by train.",
    sortOrder: 14,
    owner: "self",
  },
  {
    id: "cl-15",
    phase: "may",
    category: "Move",
    title: "Get moving quotes (Amsterdam to Zurich)",
    description: "Compare 3 international movers. Budget ~CHF 3,000-5,000 for a studio/1BR.",
    sortOrder: 15,
    estimatedDays: 7,
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
  },
  {
    id: "cl-20",
    phase: "jun",
    category: "Insurance",
    title: "Cancel Dutch health insurance (after Swiss coverage confirmed)",
    sortOrder: 20,
    dependsOn: ["cl-12"],
    estimatedDays: 2,
    owner: "self",
  },
  {
    id: "cl-21",
    phase: "jun",
    category: "Move",
    title: "Set up mail forwarding (PostNL to Swiss address)",
    sortOrder: 21,
    dependsOn: ["cl-16"],
    estimatedDays: 2,
    owner: "self",
  },
  {
    id: "cl-22",
    phase: "jun",
    category: "Social",
    title: "Farewell events with Amsterdam friends",
    sortOrder: 22,
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
  },
  {
    id: "cl-27",
    phase: "jul",
    category: "Setup",
    title: "Buy SBB Half-Fare card",
    sortOrder: 27,
    dependsOn: ["cl-23"],
    estimatedDays: 1,
    owner: "self",
  },
  {
    id: "cl-28",
    phase: "jul",
    category: "Social",
    title: "Attend first chess club evening",
    sortOrder: 28,
    owner: "self",
  },
  {
    id: "cl-29",
    phase: "jul",
    category: "Social",
    title: "Attend first AI meetup",
    sortOrder: 29,
    owner: "self",
  },
  {
    id: "cl-30",
    phase: "jul",
    category: "Setup",
    title: "First day at Zurich Insurance — Quai Zurich Campus",
    dueDate: "2026-07-01",
    sortOrder: 30,
    hardDeadline: "2026-07-01",
    owner: "employer",
  },

  // === CRIMINAL RECORD CERTIFICATES ===
  {
    id: "cl-31",
    phase: "mar-apr",
    category: "Administration",
    title: "Request Austrian Strafregisterbescheinigung (criminal record certificate)",
    description:
      "Apply online via oesterreich.gv.at (EUR 8.60, instant) — requires ID Austria login. If needed for employer, get apostille from BMEIA. Valid ~3 months.",
    sortOrder: 31,
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-32",
    phase: "mar-apr",
    category: "Administration",
    title: "Request Dutch VOG (Verklaring Omtrent het Gedrag)",
    description:
      "Email non-resident application to vog.np.rni@justis.nl (EUR 41.35). Need: passport copy, application form from justis.nl. Takes 4-8 weeks. Get apostille from Dutch district court for Swiss use.",
    sortOrder: 32,
    estimatedDays: 56,
    hardDeadline: "2026-05-31",
    owner: "self",
  },
  {
    id: "cl-33",
    phase: "jul",
    category: "Setup",
    title: "Request Swiss Strafregisterauszug",
    description:
      "CHF 17 at post office or online via e-service.admin.ch. Apply after Kreisburo registration.",
    sortOrder: 33,
    dependsOn: ["cl-23"],
    estimatedDays: 7,
    owner: "self",
  },

  // === REGISTRATION & PERMITS (Post-Arrival) ===
  {
    id: "cl-34",
    phase: "jul",
    category: "Setup",
    title: "Book biometrics appointment at Migrationsamt",
    description:
      "After Kreisburo registration, book via kanton website for biometric data capture. ~1-2 weeks wait. Required for B-permit card.",
    sortOrder: 34,
    dependsOn: ["cl-23"],
    estimatedDays: 14,
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "hr",
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
    owner: "hr",
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
    owner: "self",
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
    owner: "self",
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
    owner: "employer",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
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
    owner: "self",
  },

  // === FINANCE EXECUTIVE ITEMS (across phases) ===
  {
    id: "cl-49",
    phase: "mar-apr",
    category: "Finance",
    title: "Research Swiss tax advisors specializing in expat taxation",
    description:
      "Find a Treuhänder who handles Quellensteuer-to-ordinary transitions, cross-border deductions, and double-taxation treaty (AT-CH, NL-CH). Budget CHF 500-1,500 for first-year setup.",
    sortOrder: 49,
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-50",
    phase: "may",
    category: "Finance",
    title: "Identify private banking / wealth management options",
    description:
      "Compare ZKB, UBS, Credit Suisse (now UBS), and digital options (Selma, True Wealth). Consider custody vs advisory. Minimum CHF 100K typically for advisory.",
    sortOrder: 50,
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-51",
    phase: "aug-sep",
    category: "Finance",
    title: "Join CFA Society Switzerland chapter",
    description:
      "Networking with finance professionals in Zurich. Monthly events, career development. Good for building local professional network beyond employer.",
    sortOrder: 51,
    owner: "self",
  },
  {
    id: "cl-52",
    phase: "aug-sep",
    category: "Finance",
    title: "Select Pillar 3a investment strategy and make first contribution",
    description:
      "Max equity allocation (97-99% at VIAC/finpension). Contribute CHF 7,258 from July salary. Tax deduction reduces 2026 tax bill by ~CHF 1,800-2,200.",
    sortOrder: 52,
    dependsOn: ["cl-42"],
    owner: "self",
  },
  {
    id: "cl-53",
    phase: "aug-sep",
    category: "Finance",
    title: "Review FIRE strategy for Swiss context",
    description:
      "Recalculate financial independence target accounting for Swiss pension system (AHV + BVG + 3a), higher cost of living, and wealth tax. Consider tax-optimized withdrawal sequences.",
    sortOrder: 53,
    owner: "self",
  },

  // === AUGUST-SEPTEMBER (Post-Move Phase) ===
  {
    id: "cl-54",
    phase: "aug-sep",
    category: "Administration",
    title: "Confirm Kreisburo registration is complete",
    description:
      "Verify Anmeldungsbestätigung received. Needed for bank account, insurance, and tax purposes. Check Einwohnerkontrolle status online.",
    sortOrder: 54,
    dependsOn: ["cl-23"],
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-55",
    phase: "aug-sep",
    category: "Administration",
    title: "Register for eUmzug / eGovernment portal",
    description:
      "Set up ZurichID or eGov account for online municipality services. Needed for tax filing, address changes, and official correspondence.",
    sortOrder: 55,
    dependsOn: ["cl-23"],
    estimatedDays: 3,
    owner: "self",
  },
  {
    id: "cl-56",
    phase: "aug-sep",
    category: "Finance",
    title: "Apply for Swiss tax number (Steuernummer)",
    description:
      "Automatically assigned after Kreisburo registration. Confirm receipt by letter. Required for Steuererklärung and Pillar 3a deductions.",
    sortOrder: 56,
    dependsOn: ["cl-23"],
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-57",
    phase: "aug-sep",
    category: "Finance",
    title: "Review first payslip in detail",
    description:
      "Verify: AHV/IV/EO deduction (5.3%), ALV (1.1%), NBUVG (~1.5%), BVG contribution, Quellensteuer tariff code. Compare net to budget model. Flag any discrepancies to HR.",
    sortOrder: 57,
    dependsOn: ["cl-30"],
    estimatedDays: 1,
    owner: "self",
  },
  {
    id: "cl-58",
    phase: "aug-sep",
    category: "Finance",
    title: "Receive and review BVG Vorsorgeausweis",
    description:
      "Pension certificate from employer's pension fund. Shows: insured salary, annual contributions, projected retirement capital, risk benefits (death/disability). Key document for buy-in planning.",
    sortOrder: 58,
    dependsOn: ["cl-30"],
    estimatedDays: 30,
    owner: "employer",
  },
  {
    id: "cl-59",
    phase: "aug-sep",
    category: "Finance",
    title: "Set up eBill for recurring payments",
    description:
      "Register rent, health insurance, utilities, and subscriptions on eBill via your bank. Reduces risk of missed payments and late fees.",
    sortOrder: 59,
    dependsOn: ["cl-13"],
    estimatedDays: 3,
    owner: "self",
  },
  {
    id: "cl-60",
    phase: "aug-sep",
    category: "Setup",
    title: "Register for Billag/Serafe (radio/TV tax)",
    description:
      "CHF 335/year per household. Automatic enrollment after Kreisburo registration. Verify first bill is correct and set up eBill.",
    sortOrder: 60,
    dependsOn: ["cl-23"],
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-61",
    phase: "aug-sep",
    category: "Setup",
    title: "Arrange for Post forwarding to expire correctly",
    description:
      "Verify PostNL forwarding from NL is working. Set up Swiss Post redirect if you change address. Update all subscriptions with new Swiss address.",
    sortOrder: 61,
    dependsOn: ["cl-21"],
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-62",
    phase: "aug-sep",
    category: "Health",
    title: "Schedule initial physio assessment for knee",
    description:
      "Get GP referral (Verordnung) for physiotherapy. KVG covers 9 sessions per prescription. Find a physio near home or office specializing in ACL/meniscus rehab.",
    sortOrder: 62,
    dependsOn: ["cl-48"],
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-63",
    phase: "aug-sep",
    category: "Social",
    title: "Explore Quartierverein (neighborhood association)",
    description:
      "Most Kreise have active neighborhood associations with events, markets, and community projects. Great way to meet locals and integrate.",
    sortOrder: 63,
    owner: "self",
  },
  {
    id: "cl-64",
    phase: "aug-sep",
    category: "Finance",
    title: "Engage tax advisor for 2026 Steuererklärung preparation",
    description:
      "First-year tax return is complex: partial-year, cross-border income, relocation deductions, Quellensteuer credit. Treuhänder appointment in Sep ensures timely prep.",
    sortOrder: 64,
    dependsOn: ["cl-49"],
    estimatedDays: 7,
    owner: "self",
  },

  // === AMSTERDAM LEASE & MOVING (from relocation research) ===
  {
    id: "cl-65",
    phase: "mar-apr",
    category: "Lease",
    title: "Review Amsterdam lease for diplomatic clause (diplomatieke clausule)",
    description:
      "Check rental contract for early termination rights. A diplomatic clause allows breaking the lease if employer relocates you 50-75km+ away. If present, invoke it with Zurich Insurance employment contract as proof.",
    url: "https://www.gmw.nl/en/blog/law-matters-the-diplomatic-clause-in-rental-contracts-a-way-in-or-a-way-out/",
    sortOrder: 65,
    estimatedDays: 1,
    owner: "self",
  },
  {
    id: "cl-66",
    phase: "mar-apr",
    category: "Lease",
    title: "Send lease termination letter (aangetekende brief)",
    description:
      "Send registered letter to landlord with employment contract attached. Under Dutch law, tenants can always terminate with 1-3 month notice — minimum period restrictions apply to landlords, not tenants. If sent by end March, lease ends by June 30.",
    url: "https://huurteamnederland.nl/en/boete-bij-vroegtijdig-opzeggen-van-het-huurcontract/",
    sortOrder: 66,
    dependsOn: ["cl-65"],
    hardDeadline: "2026-03-31",
    estimatedDays: 3,
    owner: "self",
  },
  {
    id: "cl-67",
    phase: "mar-apr",
    category: "Lease",
    title: "If landlord disputes: contact Juridisch Loket or Huurteam Amsterdam",
    description:
      "Free legal advice for tenants. Dutch rental law strongly favors tenant termination rights. Since July 2024 (Wet vaste huurcontracten), most fixed-term contracts are illegal, further strengthening your position.",
    url: "https://www.juridischloket.nl/",
    sortOrder: 67,
    dependsOn: ["cl-66"],
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-68",
    phase: "mar-apr",
    category: "Move",
    title: "Get 3 international moving quotes (Amsterdam → Zurich)",
    description:
      "Contact Atlas International Movers (offices in NL + Zurich), Mondial Movers, and Voerman International. Budget EUR 2,500-4,500 for 1BR. Request in-home or video survey. Book by mid-May for July move.",
    url: "https://atlas-movers.com/",
    sortOrder: 68,
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-69",
    phase: "may",
    category: "Move",
    title: "Book international moving company",
    description:
      "Confirm date (last week of June), insurance coverage, and customs handling. Mover provides Zollerklärung (customs declaration) for Swiss border. Prepare inventory list (Übersiedlungsgut) — goods must be owned 6+ months.",
    sortOrder: 69,
    dependsOn: ["cl-68"],
    hardDeadline: "2026-05-15",
    estimatedDays: 3,
    owner: "self",
  },
  {
    id: "cl-70",
    phase: "jun",
    category: "Move",
    title: "Prepare customs inventory list (Übersiedlungsgut)",
    description:
      "Detailed list of all items being moved, with approximate values. Swiss customs requires this to waive import duties. Your moving company will provide the form. No duties for personal belongings owned 6+ months.",
    sortOrder: 70,
    dependsOn: ["cl-69"],
    estimatedDays: 3,
    owner: "self",
  },

  // === DELOITTE / MULTI-COUNTRY TAX ===
  {
    id: "cl-71",
    phase: "mar-apr",
    category: "Tax",
    title: "Schedule relocation tax planning meeting with Deloitte",
    description:
      "Discuss: 2025 standard NL return, 2026 M-form (migration year), NL-CH tax treaty application, 30% ruling termination implications, and warm handoff to Deloitte Zurich office for Swiss-side filing.",
    sortOrder: 71,
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-72",
    phase: "may",
    category: "Tax",
    title: "Confirm 2025 NL tax return filing with Deloitte",
    description:
      "Standard full-year Dutch resident return. Ensure all deductions claimed (hypotheekrente if applicable, pension premiums, etc). This is your last clean 12-month NL tax year.",
    sortOrder: 72,
    dependsOn: ["cl-71"],
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-73",
    phase: "may",
    category: "Tax",
    title: "Discuss M-form (migratiebiljet) preparation for 2026",
    description:
      "The M-form splits 2026 into resident period (Jan-Jun, taxed in NL) and non-resident period (Jul-Dec, taxed in CH). Deloitte needs exact departure date, final NL payslip, and Swiss employment contract. File deadline: typically July of following year.",
    url: "https://www.orangetax.com/tax-blog/income-tax/2026-01-22-m-form-netherlands-2025-migration-year/",
    sortOrder: 73,
    dependsOn: ["cl-71"],
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-74",
    phase: "may",
    category: "Tax",
    title: "Check 30% ruling status and termination implications",
    description:
      "If you currently have the 30% ruling, it terminates on departure from NL. Verify: any clawback on employer-paid benefits? Impact on box 3 (wealth tax) for final NL period? Confirm with Deloitte.",
    sortOrder: 74,
    dependsOn: ["cl-71"],
    estimatedDays: 3,
    owner: "self",
  },
  {
    id: "cl-75",
    phase: "jun",
    category: "Tax",
    title: "Request Deloitte warm handoff to Zurich tax team",
    description:
      "Deloitte has a Zurich office. Request introduction to their Swiss expat tax team for continuity. They handle: Quellensteuer-to-ordinary transition, NL-CH treaty relief, cross-border deduction optimization.",
    sortOrder: 75,
    dependsOn: ["cl-71"],
    estimatedDays: 14,
    owner: "self",
  },
  {
    id: "cl-76",
    phase: "jun",
    category: "Tax",
    title: "Gather NL-CH tax treaty documentation",
    description:
      "Download the NL-CH Double Taxation Agreement from Swiss FTA. Key articles: Art 15 (employment income), Art 18 (pensions), Art 23 (elimination of double taxation). Share with both NL and CH tax advisors.",
    url: "https://www.estv.admin.ch/estv/en/home/international-fiscal-law/international-by-country/sif/netherlands.html",
    sortOrder: 76,
    estimatedDays: 1,
    owner: "self",
  },
  {
    id: "cl-77",
    phase: "jun",
    category: "Tax",
    title: "Verify Dutch pension rights (AOW) freeze status",
    description:
      "Dutch AOW pension rights freeze on departure. Request AOW overzicht from SVB showing accumulated years. Under EU/EFTA bilateral agreements, Dutch years count toward Swiss AHV eligibility. Keep SVB informed of address change.",
    sortOrder: 77,
    estimatedDays: 7,
    owner: "self",
  },
  {
    id: "cl-78",
    phase: "jun",
    category: "Tax",
    title: "Review Dutch box 3 (wealth tax) position for partial year",
    description:
      "If you have Dutch investments or savings above the threshold, NL taxes deemed income (box 3) for the resident period (Jan-Jun 2026). Coordinate with Deloitte on Peildatum (reference date) and what assets to report.",
    sortOrder: 78,
    dependsOn: ["cl-71"],
    estimatedDays: 3,
    owner: "self",
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
