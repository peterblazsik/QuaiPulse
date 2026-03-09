import type { DossierStatus } from "@/lib/types";

export interface DossierDocument {
  id: string;
  category: DossierCategory;
  title: string;
  description: string;
  required: boolean;
  /** Where/how to obtain this document */
  source: string;
  /** Typical processing time */
  processingTime?: string;
  /** Estimated cost */
  costCHF?: number;
  /** External link for more info */
  url?: string;
  /** Depends on these documents being obtained first */
  dependsOn?: string[];
  /** Tips for Swiss landlords/authorities */
  tips?: string;
}

export type DossierCategory =
  | "rental"
  | "employment"
  | "identity"
  | "financial"
  | "insurance"
  | "registration";

export const DOSSIER_CATEGORIES: Record<DossierCategory, { label: string; color: string }> = {
  rental: { label: "Rental Application", color: "#3b82f6" },
  employment: { label: "Employment", color: "#22c55e" },
  identity: { label: "Identity & Visa", color: "#f59e0b" },
  financial: { label: "Financial", color: "#e879f9" },
  insurance: { label: "Insurance", color: "#ef4444" },
  registration: { label: "Registration", color: "#06b6d4" },
};

export const DOSSIER_DOCUMENTS: DossierDocument[] = [
  // ── Rental Application ──
  {
    id: "doc-passport",
    category: "identity",
    title: "Valid Passport",
    description: "Current passport with min. 6 months validity beyond move date",
    required: true,
    source: "Hungarian consulate if renewal needed",
    tips: "Swiss landlords always request a copy. Color scan, both sides.",
  },
  {
    id: "doc-permit",
    category: "identity",
    title: "Work/Residence Permit (B Permit)",
    description: "Aufenthaltsbewilligung B — issued by cantonal migration office after arrival",
    required: true,
    source: "Zurich Migrationsamt — employer initiates the process",
    processingTime: "2-4 weeks after registration",
    tips: "For apartment search pre-arrival, the employment contract serves as proof of future permit.",
  },
  {
    id: "doc-employment-contract",
    category: "employment",
    title: "Employment Contract",
    description: "Signed contract from Zurich Insurance showing position, salary, start date",
    required: true,
    source: "Zurich Insurance HR",
    tips: "Landlords want to see CHF income. Request an English + German version.",
  },
  {
    id: "doc-payslips",
    category: "employment",
    title: "Last 3 Payslips",
    description: "Recent salary statements from current employer",
    required: true,
    source: "Current employer HR / payroll system",
    tips: "If switching countries, explain the currency difference. Include the new Swiss salary in cover letter.",
  },
  {
    id: "doc-betreibung",
    category: "financial",
    title: "Debt Register Extract (Betreibungsregisterauszug)",
    description: "Proof of no outstanding debts — Swiss equivalent of credit check",
    required: true,
    source: "Betreibungsamt of current municipality. For foreigners moving in: home country equivalent + sworn translation.",
    processingTime: "2-3 weeks",
    costCHF: 17,
    tips: "Critical document. Order ASAP — landlords reject applications without it. Dutch/Austrian equivalent accepted initially.",
  },
  {
    id: "doc-landlord-ref",
    category: "rental",
    title: "Landlord Reference Letter",
    description: "Confirmation from current landlord of good tenancy, timely payments, no damages",
    required: true,
    source: "Current landlord / property management",
    processingTime: "1-2 weeks",
    tips: "Ask for it in English. Include: duration of tenancy, payment history, no complaints.",
  },
  {
    id: "doc-intro-letter",
    category: "rental",
    title: "Personal Introduction Letter",
    description: "Cover letter to landlord: who you are, why Zurich, stable employment, clean record",
    required: true,
    source: "Self-written",
    tips: "Keep it professional but personal. Mention Zurich Insurance, single professional, no pets. 1 page max.",
  },
  {
    id: "doc-rental-dossier",
    category: "rental",
    title: "Complete Rental Dossier PDF",
    description: "Combined PDF with all rental documents: passport, contract, payslips, Betreibung, landlord ref, intro letter",
    required: true,
    source: "Self-compiled from all other documents",
    dependsOn: ["doc-passport", "doc-employment-contract", "doc-payslips", "doc-betreibung", "doc-landlord-ref", "doc-intro-letter"],
    tips: "Professional formatting matters. Use a clean template. Include table of contents. Max 10-12 pages.",
  },
  {
    id: "doc-tax-id",
    category: "financial",
    title: "Swiss Tax Number (Steuernummer)",
    description: "Assigned by cantonal tax office after Anmeldung",
    required: false,
    source: "Kantonales Steueramt Zürich — automatic after registration",
    processingTime: "2-4 weeks after Anmeldung",
    dependsOn: ["doc-anmeldung"],
  },
  {
    id: "doc-anmeldung",
    category: "registration",
    title: "Residence Registration (Anmeldung)",
    description: "Register at Kreisbüro within 14 days of arrival",
    required: true,
    source: "Kreisbüro (district office) of your neighborhood",
    processingTime: "Same day",
    dependsOn: ["doc-passport", "doc-employment-contract"],
    tips: "Book appointment online in advance. Bring passport, employment contract, and rental agreement.",
    url: "https://www.stadt-zuerich.ch/prd/de/index/bevoelkerungsamt/umziehenmelden/anmelden.html",
  },
  {
    id: "doc-health-insurance",
    category: "insurance",
    title: "Health Insurance (Grundversicherung)",
    description: "Mandatory Swiss health insurance — must be arranged within 3 months of arrival",
    required: true,
    source: "Swiss health insurers: CSS, Helsana, Swica, Assura, etc.",
    processingTime: "1-2 weeks",
    tips: "Compare on comparis.ch. Higher franchise = lower premiums. CHF 2,500 franchise is the sweet spot for healthy adults.",
    url: "https://www.comparis.ch/krankenkassen/grundversicherung",
  },
  {
    id: "doc-liability-insurance",
    category: "insurance",
    title: "Personal Liability Insurance (Privathaftpflicht)",
    description: "Covers accidental damage to third parties. Virtually mandatory in Switzerland.",
    required: false,
    source: "Same provider as health insurance, or standalone (Mobiliar, AXA, Zurich)",
    costCHF: 10,
    tips: "CHF 8-15/month. Most landlords expect tenants to have it. Often bundled with household insurance.",
  },
  {
    id: "doc-household-insurance",
    category: "insurance",
    title: "Household Insurance (Hausratversicherung)",
    description: "Covers belongings against fire, water, theft",
    required: false,
    source: "Insurance providers (Mobiliar, AXA, Zurich, Helvetia)",
    costCHF: 15,
    tips: "Often bundled with liability. Landlords may require proof.",
  },
  {
    id: "doc-bank-account",
    category: "financial",
    title: "Swiss Bank Account",
    description: "CHF salary account — needed for payroll, rent payments, daily banking",
    required: true,
    source: "UBS, ZKB, PostFinance, Neon, Yuh",
    processingTime: "1-2 weeks",
    dependsOn: ["doc-passport", "doc-anmeldung"],
    tips: "ZKB (Zürcher Kantonalbank) is the local choice. Neon/Yuh for digital-first. Open before first salary.",
  },
  {
    id: "doc-ahv",
    category: "registration",
    title: "AHV Number (Social Security)",
    description: "Swiss social security number — needed for employment, insurance, taxes",
    required: true,
    source: "SVA Zürich — employer usually handles this",
    processingTime: "1-2 weeks",
    dependsOn: ["doc-anmeldung"],
    tips: "Employer submits the application. You receive an AHV card by mail.",
  },
  {
    id: "doc-driving-license",
    category: "identity",
    title: "Swiss Driving License Exchange",
    description: "Exchange EU license for Swiss Führerausweis within 12 months",
    required: false,
    source: "Strassenverkehrsamt Kanton Zürich",
    processingTime: "2-4 weeks",
    costCHF: 80,
    dependsOn: ["doc-anmeldung"],
    tips: "Must exchange within 12 months. No exam required for EU/EFTA licenses. Bring eye test (Fielmann, CHF 15).",
    url: "https://www.stva.zh.ch/de/fahren/fuehrerausweis/umtausch.html",
  },
];

/** Default initial status for all documents */
export function getDefaultDossierStatuses(): Record<string, DossierStatus> {
  const statuses: Record<string, DossierStatus> = {};
  for (const doc of DOSSIER_DOCUMENTS) {
    statuses[doc.id] = "missing";
  }
  return statuses;
}
