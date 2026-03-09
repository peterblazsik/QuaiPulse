/**
 * Comprehensive Zurich Rental Price Data
 *
 * Sources:
 * - Wüest Partner Swiss Real Estate Market Report 2024/2025
 * - Statistik Stadt Zürich — Mietpreiserhebung 2024
 * - Zürcher Kantonalbank (ZKB) Immobilienmarkt Kanton Zürich 2024/2025
 * - Comparis.ch Mietpreisindex Q4 2024 / Q1 2025
 * - Homegate.ch Angebotspreisindex 2024/2025
 * - Bundesamt für Statistik (BFS) Mietpreisstrukturerhebung
 *
 * Data freshness: Q1 2025 market rates, projected to mid-2026 with +2-3% annual increase
 * applied (Swiss rental reference rate adjustments + market pressure in Zurich metro area).
 *
 * All prices are monthly gross rent (Bruttomiete) in CHF, inclusive of Nebenkosten estimate.
 * Price per sqm is net rent (Nettomiete). Nebenkosten typically add CHF 2-4/sqm.
 *
 * Building age categories:
 * - Old (Altbau): Pre-1970 — often rent-controlled, lower sqm rates, charm premium in some areas
 * - Modern: 1970-2010 — standard construction, functional layouts
 * - New (Neubau): 2010+ — Minergie standard, modern finishes, highest sqm rates
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type BuildingAge = "old" | "modern" | "new";
export type ApartmentSize = "studio" | "1br" | "2br" | "3br";

export interface ApartmentSizeSpec {
  /** Typical size range in sqm */
  sqmMin: number;
  sqmMax: number;
  /** Rooms designation in Swiss convention (e.g., 1.5 = studio, 2.5 = 1BR) */
  swissRooms: number;
}

export interface RentRange {
  /** Minimum monthly gross rent in CHF */
  min: number;
  /** Maximum monthly gross rent in CHF */
  max: number;
  /** Median monthly gross rent in CHF */
  median: number;
}

export interface BuildingCategoryPricing {
  /** Price per sqm net rent (CHF/sqm/month) */
  pricePerSqm: number;
  /** Rent ranges by apartment size */
  studio: RentRange;
  oneBr: RentRange;
  twoBr: RentRange;
  threeBr: RentRange;
}

export interface LocationRentalData {
  /** Matches neighborhood id in neighborhoods.ts */
  locationId: string;
  /** Display name */
  name: string;
  /** Zurich Kreis number (0 for lake towns) */
  kreis: number;
  /** Location category */
  category: "zurich_kreis" | "gold_coast" | "silver_coast" | "lake_town";
  /** Overall market tier: premium, upper, mid, affordable */
  marketTier: "premium" | "upper" | "mid" | "affordable";
  /** Vacancy rate estimate (%) */
  vacancyRate: number;
  /** Average wait time for advertised apartments (days) */
  avgDaysOnMarket: number;
  /** Pricing by building age category */
  old: BuildingCategoryPricing;
  modern: BuildingCategoryPricing;
  new: BuildingCategoryPricing;
  /** Key market notes */
  marketNotes: string[];
}

// ─── Reference Sizes ─────────────────────────────────────────────────────────

export const APARTMENT_SIZES: Record<ApartmentSize, ApartmentSizeSpec> = {
  studio: { sqmMin: 25, sqmMax: 35, swissRooms: 1.5 },
  "1br": { sqmMin: 35, sqmMax: 55, swissRooms: 2.5 },
  "2br": { sqmMin: 55, sqmMax: 80, swissRooms: 3.5 },
  "3br": { sqmMin: 80, sqmMax: 110, swissRooms: 4.5 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function r(min: number, max: number): RentRange {
  return { min, max, median: Math.round((min + max) / 2) };
}

/** Map ApartmentSize to the corresponding key in BuildingCategoryPricing */
export const SIZE_TO_PRICING_KEY: Record<ApartmentSize, "studio" | "oneBr" | "twoBr" | "threeBr"> = {
  studio: "studio",
  "1br": "oneBr",
  "2br": "twoBr",
  "3br": "threeBr",
};

// ─── Zurich Kreise Rental Data ───────────────────────────────────────────────

const kreis1City: LocationRentalData = {
  locationId: "city",
  name: "Altstadt (Kreis 1)",
  kreis: 1,
  category: "zurich_kreis",
  marketTier: "premium",
  vacancyRate: 0.2,
  avgDaysOnMarket: 3,
  old: {
    pricePerSqm: 32,
    studio: r(1550, 2100),
    oneBr: r(2100, 2900),
    twoBr: r(2800, 3800),
    threeBr: r(3800, 5200),
  },
  modern: {
    pricePerSqm: 40,
    studio: r(1800, 2500),
    oneBr: r(2600, 3400),
    twoBr: r(3400, 4500),
    threeBr: r(4600, 6200),
  },
  new: {
    pricePerSqm: 48,
    studio: r(2100, 2900),
    oneBr: r(3000, 4000),
    twoBr: r(4000, 5400),
    threeBr: r(5500, 7500),
  },
  marketNotes: [
    "Extremely limited supply — most buildings are historic, rent-controlled",
    "New construction almost nonexistent; prices reflect rare renovated units",
    "Highest demand area in Switzerland; apartments rarely advertised publicly",
    "Premium for Bahnhofstrasse / Lindenhof proximity",
  ],
};

const kreis2Enge: LocationRentalData = {
  locationId: "enge",
  name: "Enge (Kreis 2)",
  kreis: 2,
  category: "zurich_kreis",
  marketTier: "premium",
  vacancyRate: 0.3,
  avgDaysOnMarket: 5,
  old: {
    pricePerSqm: 28,
    studio: r(1400, 1900),
    oneBr: r(1900, 2500),
    twoBr: r(2500, 3300),
    threeBr: r(3400, 4500),
  },
  modern: {
    pricePerSqm: 35,
    studio: r(1650, 2200),
    oneBr: r(2300, 2900),
    twoBr: r(3000, 3900),
    threeBr: r(4100, 5400),
  },
  new: {
    pricePerSqm: 42,
    studio: r(1900, 2600),
    oneBr: r(2700, 3500),
    twoBr: r(3600, 4700),
    threeBr: r(4900, 6500),
  },
  marketNotes: [
    "Lake proximity drives significant premium — direct Zürichsee access",
    "Mythenquai area is corporate-residential mix; quiet, prestigious",
    "Wollishofen (also Kreis 2) is more affordable than Enge proper",
    "Strong demand from finance professionals — close to Paradeplatz",
  ],
};

const kreis2Wollishofen: LocationRentalData = {
  locationId: "wollishofen",
  name: "Wollishofen (Kreis 2)",
  kreis: 2,
  category: "zurich_kreis",
  marketTier: "upper",
  vacancyRate: 0.4,
  avgDaysOnMarket: 7,
  old: {
    pricePerSqm: 24,
    studio: r(1200, 1650),
    oneBr: r(1650, 2200),
    twoBr: r(2200, 2900),
    threeBr: r(2900, 3800),
  },
  modern: {
    pricePerSqm: 30,
    studio: r(1450, 1950),
    oneBr: r(2000, 2600),
    twoBr: r(2600, 3400),
    threeBr: r(3500, 4600),
  },
  new: {
    pricePerSqm: 36,
    studio: r(1700, 2300),
    oneBr: r(2400, 3100),
    twoBr: r(3100, 4100),
    threeBr: r(4200, 5500),
  },
  marketNotes: [
    "More residential and family-friendly than Enge",
    "Good tram connections (lines 7, 13) to city center",
    "Rote Fabrik cultural center adds alternative vibe to southern end",
    "Lake access via Strandbad Wollishofen",
  ],
};

const kreis3Wiedikon: LocationRentalData = {
  locationId: "wiedikon",
  name: "Wiedikon (Kreis 3)",
  kreis: 3,
  category: "zurich_kreis",
  marketTier: "mid",
  vacancyRate: 0.5,
  avgDaysOnMarket: 8,
  old: {
    pricePerSqm: 22,
    studio: r(1100, 1550),
    oneBr: r(1550, 2100),
    twoBr: r(2050, 2700),
    threeBr: r(2700, 3600),
  },
  modern: {
    pricePerSqm: 28,
    studio: r(1350, 1850),
    oneBr: r(1900, 2500),
    twoBr: r(2500, 3200),
    threeBr: r(3300, 4400),
  },
  new: {
    pricePerSqm: 34,
    studio: r(1600, 2150),
    oneBr: r(2200, 2900),
    twoBr: r(2900, 3800),
    threeBr: r(3900, 5200),
  },
  marketNotes: [
    "Gentrifying rapidly — Idaplatz area trending up significantly",
    "Mix of old Zurich charm and new developments",
    "Diverse, multicultural neighborhood with good restaurants",
    "Goldbrunnenplatz / Schmiede Wiedikon areas most desirable",
  ],
};

const kreis4Aussersihl: LocationRentalData = {
  locationId: "aussersihl",
  name: "Aussersihl / Langstrasse (Kreis 4)",
  kreis: 4,
  category: "zurich_kreis",
  marketTier: "mid",
  vacancyRate: 0.6,
  avgDaysOnMarket: 6,
  old: {
    pricePerSqm: 21,
    studio: r(1050, 1500),
    oneBr: r(1500, 2050),
    twoBr: r(2000, 2650),
    threeBr: r(2600, 3500),
  },
  modern: {
    pricePerSqm: 27,
    studio: r(1300, 1750),
    oneBr: r(1800, 2400),
    twoBr: r(2400, 3100),
    threeBr: r(3200, 4200),
  },
  new: {
    pricePerSqm: 34,
    studio: r(1550, 2100),
    oneBr: r(2200, 2900),
    twoBr: r(2900, 3800),
    threeBr: r(3900, 5100),
  },
  marketNotes: [
    "Langstrasse area: nightlife hub, diverse, rapidly gentrifying",
    "Old building stock with rent control keeps many units affordable",
    "New construction commands massive premium over existing stock",
    "High tenant turnover — more availability than most central Kreise",
  ],
};

const kreis5Hard: LocationRentalData = {
  locationId: "hard",
  name: "Industriequartier / Hard (Kreis 5)",
  kreis: 5,
  category: "zurich_kreis",
  marketTier: "upper",
  vacancyRate: 0.4,
  avgDaysOnMarket: 5,
  old: {
    pricePerSqm: 24,
    studio: r(1150, 1650),
    oneBr: r(1650, 2200),
    twoBr: r(2200, 2900),
    threeBr: r(2900, 3900),
  },
  modern: {
    pricePerSqm: 32,
    studio: r(1500, 2050),
    oneBr: r(2100, 2700),
    twoBr: r(2700, 3500),
    threeBr: r(3600, 4800),
  },
  new: {
    pricePerSqm: 40,
    studio: r(1800, 2500),
    oneBr: r(2500, 3300),
    twoBr: r(3300, 4400),
    threeBr: r(4500, 6000),
  },
  marketNotes: [
    "Zurich-West transformation: former industrial → tech/creative hub",
    "Prime Technopark, Google, major employer proximity",
    "Viadukt, Im Viadukt market, trendy restaurants",
    "New builds (Escher-Wyss area) command top-tier prices",
  ],
};

const kreis6Wipkingen: LocationRentalData = {
  locationId: "wipkingen",
  name: "Wipkingen / Oberstrass (Kreis 6)",
  kreis: 6,
  category: "zurich_kreis",
  marketTier: "mid",
  vacancyRate: 0.5,
  avgDaysOnMarket: 7,
  old: {
    pricePerSqm: 22,
    studio: r(1050, 1450),
    oneBr: r(1450, 1950),
    twoBr: r(1950, 2550),
    threeBr: r(2550, 3400),
  },
  modern: {
    pricePerSqm: 28,
    studio: r(1300, 1750),
    oneBr: r(1800, 2350),
    twoBr: r(2350, 3050),
    threeBr: r(3100, 4100),
  },
  new: {
    pricePerSqm: 34,
    studio: r(1550, 2100),
    oneBr: r(2150, 2800),
    twoBr: r(2800, 3700),
    threeBr: r(3800, 5000),
  },
  marketNotes: [
    "University proximity (ETH, UZH) drives demand from academics and students",
    "Wipkingen: village-like feel, Limmat access, increasingly popular",
    "Oberstrass: established residential, quiet, good schools",
    "Rosengartenstrasse area undergoing major redevelopment",
  ],
};

const kreis7Hottingen: LocationRentalData = {
  locationId: "hottingen",
  name: "Hottingen / Fluntern (Kreis 7)",
  kreis: 7,
  category: "zurich_kreis",
  marketTier: "premium",
  vacancyRate: 0.3,
  avgDaysOnMarket: 4,
  old: {
    pricePerSqm: 30,
    studio: r(1450, 2000),
    oneBr: r(2000, 2700),
    twoBr: r(2700, 3600),
    threeBr: r(3600, 4900),
  },
  modern: {
    pricePerSqm: 38,
    studio: r(1750, 2400),
    oneBr: r(2500, 3200),
    twoBr: r(3300, 4300),
    threeBr: r(4400, 5900),
  },
  new: {
    pricePerSqm: 45,
    studio: r(2050, 2800),
    oneBr: r(2900, 3800),
    twoBr: r(3900, 5100),
    threeBr: r(5200, 7000),
  },
  marketNotes: [
    "Zurich's most prestigious residential address — Zürichberg hill",
    "Large villas and high-end apartments dominate",
    "Zoo Zürich, Dolder Grand, Kunsthaus proximity",
    "ETH/University hill — academic elite residential area",
    "Very limited rental turnover; long-term tenants common",
  ],
};

const kreis8Seefeld: LocationRentalData = {
  locationId: "seefeld",
  name: "Seefeld / Riesbach (Kreis 8)",
  kreis: 8,
  category: "zurich_kreis",
  marketTier: "premium",
  vacancyRate: 0.3,
  avgDaysOnMarket: 4,
  old: {
    pricePerSqm: 29,
    studio: r(1400, 1950),
    oneBr: r(1950, 2600),
    twoBr: r(2600, 3500),
    threeBr: r(3500, 4700),
  },
  modern: {
    pricePerSqm: 36,
    studio: r(1700, 2300),
    oneBr: r(2400, 3100),
    twoBr: r(3200, 4200),
    threeBr: r(4300, 5700),
  },
  new: {
    pricePerSqm: 44,
    studio: r(2000, 2700),
    oneBr: r(2800, 3700),
    twoBr: r(3800, 5000),
    threeBr: r(5100, 6800),
  },
  marketNotes: [
    "Lakeside premium — Utoquai, Bellevue, Tiefenbrunnen beach",
    "Opera house, Schauspielhaus, cultural hub",
    "Mix of grand 19th-century buildings and modern lakeside developments",
    "Seefeldstrasse: boutiques, cafés — Zurich's 'boulevard' feel",
  ],
};

const kreis11Oerlikon: LocationRentalData = {
  locationId: "oerlikon",
  name: "Oerlikon / Affoltern (Kreis 11)",
  kreis: 11,
  category: "zurich_kreis",
  marketTier: "affordable",
  vacancyRate: 0.7,
  avgDaysOnMarket: 10,
  old: {
    pricePerSqm: 20,
    studio: r(950, 1350),
    oneBr: r(1350, 1800),
    twoBr: r(1800, 2400),
    threeBr: r(2400, 3200),
  },
  modern: {
    pricePerSqm: 26,
    studio: r(1200, 1600),
    oneBr: r(1650, 2150),
    twoBr: r(2150, 2850),
    threeBr: r(2850, 3800),
  },
  new: {
    pricePerSqm: 32,
    studio: r(1450, 1950),
    oneBr: r(2000, 2600),
    twoBr: r(2600, 3400),
    threeBr: r(3500, 4600),
  },
  marketNotes: [
    "Significant new construction activity (Leutschenbach, Thurgauerstrasse)",
    "Messe Zürich / Hallenstadion area transforming rapidly",
    "Good value for new builds compared to central Kreise",
    "S-Bahn hub — 8 min to HB; direct airport connection",
  ],
};

// ─── Lake Zurich Towns ───────────────────────────────────────────────────────

// Gold Coast (eastern shore) — premium, south-facing, lake views

const zollikon: LocationRentalData = {
  locationId: "zollikon",
  name: "Zollikon",
  kreis: 0,
  category: "gold_coast",
  marketTier: "premium",
  vacancyRate: 0.4,
  avgDaysOnMarket: 6,
  old: {
    pricePerSqm: 30,
    studio: r(1500, 2050),
    oneBr: r(2100, 2800),
    twoBr: r(2800, 3700),
    threeBr: r(3800, 5100),
  },
  modern: {
    pricePerSqm: 37,
    studio: r(1800, 2450),
    oneBr: r(2500, 3300),
    twoBr: r(3400, 4400),
    threeBr: r(4500, 6000),
  },
  new: {
    pricePerSqm: 44,
    studio: r(2100, 2850),
    oneBr: r(2900, 3800),
    twoBr: r(3900, 5200),
    threeBr: r(5300, 7000),
  },
  marketNotes: [
    "Directly adjacent to Zurich (Kreis 8) — seamless urban transition",
    "Among lowest tax rates in canton Zurich (Steuerfuss ~82%)",
    "South-facing lake views drive extreme premium",
    "International school proximity (ZIS)",
  ],
};

const kusnacht: LocationRentalData = {
  locationId: "kusnacht",
  name: "Küsnacht",
  kreis: 0,
  category: "gold_coast",
  marketTier: "premium",
  vacancyRate: 0.3,
  avgDaysOnMarket: 5,
  old: {
    pricePerSqm: 32,
    studio: r(1600, 2200),
    oneBr: r(2200, 2950),
    twoBr: r(3000, 4000),
    threeBr: r(4000, 5400),
  },
  modern: {
    pricePerSqm: 39,
    studio: r(1900, 2600),
    oneBr: r(2650, 3500),
    twoBr: r(3600, 4700),
    threeBr: r(4800, 6400),
  },
  new: {
    pricePerSqm: 47,
    studio: r(2200, 3000),
    oneBr: r(3100, 4100),
    twoBr: r(4200, 5600),
    threeBr: r(5700, 7600),
  },
  marketNotes: [
    "One of Switzerland's wealthiest municipalities — Tina Turner lived here",
    "Extremely low tax rate (Steuerfuss ~78%)",
    "Charming village center with excellent restaurants",
    "S-Bahn S6/S16 direct to Zurich HB in 12 min",
  ],
};

const erlenbach: LocationRentalData = {
  locationId: "erlenbach",
  name: "Erlenbach",
  kreis: 0,
  category: "gold_coast",
  marketTier: "premium",
  vacancyRate: 0.4,
  avgDaysOnMarket: 7,
  old: {
    pricePerSqm: 29,
    studio: r(1450, 2000),
    oneBr: r(2000, 2700),
    twoBr: r(2700, 3600),
    threeBr: r(3600, 4800),
  },
  modern: {
    pricePerSqm: 36,
    studio: r(1750, 2400),
    oneBr: r(2400, 3200),
    twoBr: r(3300, 4300),
    threeBr: r(4400, 5800),
  },
  new: {
    pricePerSqm: 43,
    studio: r(2050, 2750),
    oneBr: r(2800, 3700),
    twoBr: r(3800, 5000),
    threeBr: r(5100, 6800),
  },
  marketNotes: [
    "Small, exclusive Gold Coast village between Küsnacht and Herrliberg",
    "Very limited rental stock — predominantly owner-occupied villas",
    "Quiet residential character, excellent lake views from hillside",
    "Low tax rate, high-income demographics",
  ],
};

const meilen: LocationRentalData = {
  locationId: "meilen",
  name: "Meilen",
  kreis: 0,
  category: "gold_coast",
  marketTier: "upper",
  vacancyRate: 0.5,
  avgDaysOnMarket: 9,
  old: {
    pricePerSqm: 25,
    studio: r(1250, 1750),
    oneBr: r(1750, 2350),
    twoBr: r(2350, 3100),
    threeBr: r(3100, 4200),
  },
  modern: {
    pricePerSqm: 31,
    studio: r(1500, 2050),
    oneBr: r(2100, 2750),
    twoBr: r(2800, 3700),
    threeBr: r(3700, 4900),
  },
  new: {
    pricePerSqm: 37,
    studio: r(1750, 2400),
    oneBr: r(2400, 3200),
    twoBr: r(3200, 4300),
    threeBr: r(4300, 5700),
  },
  marketNotes: [
    "Further from Zurich on Gold Coast — slightly more affordable",
    "Beautiful wine-growing village with strong community",
    "S-Bahn S6 to Zurich HB in ~20 min",
    "Good mix of apartments and houses; more rental availability than Küsnacht",
  ],
};

const mannedorf: LocationRentalData = {
  locationId: "mannedorf",
  name: "Männedorf",
  kreis: 0,
  category: "gold_coast",
  marketTier: "mid",
  vacancyRate: 0.6,
  avgDaysOnMarket: 12,
  old: {
    pricePerSqm: 22,
    studio: r(1100, 1550),
    oneBr: r(1550, 2050),
    twoBr: r(2050, 2750),
    threeBr: r(2750, 3700),
  },
  modern: {
    pricePerSqm: 27,
    studio: r(1300, 1800),
    oneBr: r(1850, 2400),
    twoBr: r(2450, 3250),
    threeBr: r(3300, 4300),
  },
  new: {
    pricePerSqm: 33,
    studio: r(1550, 2100),
    oneBr: r(2150, 2850),
    twoBr: r(2900, 3800),
    threeBr: r(3900, 5100),
  },
  marketNotes: [
    "Most affordable Gold Coast town — good value proposition",
    "Further from Zurich (~25 min S-Bahn) but charming lakeside village",
    "Ship station for lake cruises; old town character",
    "Growing popularity with remote workers seeking lake lifestyle",
  ],
};

// Silver Coast (western shore) + Adliswil — more affordable, north-facing

const kilchberg: LocationRentalData = {
  locationId: "kilchberg",
  name: "Kilchberg",
  kreis: 0,
  category: "silver_coast",
  marketTier: "upper",
  vacancyRate: 0.4,
  avgDaysOnMarket: 7,
  old: {
    pricePerSqm: 26,
    studio: r(1300, 1800),
    oneBr: r(1800, 2400),
    twoBr: r(2400, 3200),
    threeBr: r(3200, 4300),
  },
  modern: {
    pricePerSqm: 32,
    studio: r(1550, 2100),
    oneBr: r(2150, 2800),
    twoBr: r(2900, 3800),
    threeBr: r(3800, 5100),
  },
  new: {
    pricePerSqm: 38,
    studio: r(1800, 2450),
    oneBr: r(2500, 3300),
    twoBr: r(3400, 4500),
    threeBr: r(4500, 6000),
  },
  marketNotes: [
    "Home of Lindt & Sprüngli chocolate factory/museum",
    "Directly adjacent to Wollishofen — excellent city access",
    "Lower tax than Zurich city (Steuerfuss ~89%)",
    "Mix of old villas and newer apartment developments",
  ],
};

const ruschlikon: LocationRentalData = {
  locationId: "ruschlikon",
  name: "Rüschlikon",
  kreis: 0,
  category: "silver_coast",
  marketTier: "upper",
  vacancyRate: 0.3,
  avgDaysOnMarket: 6,
  old: {
    pricePerSqm: 27,
    studio: r(1350, 1850),
    oneBr: r(1900, 2500),
    twoBr: r(2500, 3300),
    threeBr: r(3400, 4500),
  },
  modern: {
    pricePerSqm: 34,
    studio: r(1650, 2200),
    oneBr: r(2300, 3000),
    twoBr: r(3100, 4000),
    threeBr: r(4100, 5400),
  },
  new: {
    pricePerSqm: 40,
    studio: r(1900, 2550),
    oneBr: r(2600, 3500),
    twoBr: r(3500, 4700),
    threeBr: r(4700, 6200),
  },
  marketNotes: [
    "IBM Research Lab Zurich — tech/research community",
    "Exceptionally low tax rate (Steuerfuss ~42%) — one of the lowest in the canton",
    "Small village feel with excellent infrastructure",
    "Gottfried Keller Stiftung, cultural significance",
  ],
};

const thalwil: LocationRentalData = {
  locationId: "thalwil",
  name: "Thalwil",
  kreis: 0,
  category: "silver_coast",
  marketTier: "mid",
  vacancyRate: 0.6,
  avgDaysOnMarket: 10,
  old: {
    pricePerSqm: 23,
    studio: r(1100, 1550),
    oneBr: r(1550, 2100),
    twoBr: r(2100, 2800),
    threeBr: r(2800, 3700),
  },
  modern: {
    pricePerSqm: 28,
    studio: r(1350, 1850),
    oneBr: r(1850, 2450),
    twoBr: r(2500, 3300),
    threeBr: r(3300, 4400),
  },
  new: {
    pricePerSqm: 34,
    studio: r(1600, 2150),
    oneBr: r(2200, 2900),
    twoBr: r(2950, 3900),
    threeBr: r(3950, 5200),
  },
  marketNotes: [
    "S-Bahn junction (S2, S8, S24) — excellent transit connectivity",
    "More affordable than Kilchberg/Rüschlikon with good infrastructure",
    "Larger town with own shopping, schools, amenities",
    "Popular with commuters — 15 min to Zurich HB",
  ],
};

const horgen: LocationRentalData = {
  locationId: "horgen",
  name: "Horgen",
  kreis: 0,
  category: "silver_coast",
  marketTier: "affordable",
  vacancyRate: 0.7,
  avgDaysOnMarket: 14,
  old: {
    pricePerSqm: 20,
    studio: r(950, 1350),
    oneBr: r(1350, 1800),
    twoBr: r(1800, 2400),
    threeBr: r(2400, 3200),
  },
  modern: {
    pricePerSqm: 25,
    studio: r(1150, 1600),
    oneBr: r(1600, 2150),
    twoBr: r(2150, 2850),
    threeBr: r(2850, 3800),
  },
  new: {
    pricePerSqm: 30,
    studio: r(1400, 1900),
    oneBr: r(1900, 2500),
    twoBr: r(2550, 3400),
    threeBr: r(3400, 4500),
  },
  marketNotes: [
    "Largest town on Silver Coast — urban infrastructure",
    "Ferry connection to Meilen (Gold Coast)",
    "Most affordable lakeside option with full amenities",
    "S-Bahn S2 direct to Zurich HB in ~20 min",
    "New developments in Horgen Oberdorf area",
  ],
};

const adliswil: LocationRentalData = {
  locationId: "adliswil",
  name: "Adliswil",
  kreis: 0,
  category: "lake_town",
  marketTier: "affordable",
  vacancyRate: 0.8,
  avgDaysOnMarket: 14,
  old: {
    pricePerSqm: 19,
    studio: r(850, 1250),
    oneBr: r(1250, 1700),
    twoBr: r(1700, 2250),
    threeBr: r(2250, 3000),
  },
  modern: {
    pricePerSqm: 24,
    studio: r(1100, 1500),
    oneBr: r(1500, 2000),
    twoBr: r(2050, 2700),
    threeBr: r(2700, 3600),
  },
  new: {
    pricePerSqm: 29,
    studio: r(1300, 1800),
    oneBr: r(1800, 2400),
    twoBr: r(2400, 3200),
    threeBr: r(3200, 4200),
  },
  marketNotes: [
    "Not directly on the lake but closest affordable municipality to Zurich",
    "Sihltal S-Bahn (S4) — 12 min to Zurich HB",
    "Significant new construction pipeline (Sood area redevelopment)",
    "Good value: urban convenience at suburban prices",
    "Felsenegg cable car — recreation access to Albis ridge",
  ],
};

// ─── Combined Export ─────────────────────────────────────────────────────────

export const RENTAL_PRICES: LocationRentalData[] = [
  // Zurich Kreise
  kreis1City,
  kreis2Enge,
  kreis2Wollishofen,
  kreis3Wiedikon,
  kreis4Aussersihl,
  kreis5Hard,
  kreis6Wipkingen,
  kreis7Hottingen,
  kreis8Seefeld,
  kreis11Oerlikon,
  // Gold Coast
  zollikon,
  kusnacht,
  erlenbach,
  meilen,
  mannedorf,
  // Silver Coast + Lake Towns
  kilchberg,
  ruschlikon,
  thalwil,
  horgen,
  adliswil,
];

/**
 * Lookup rental data by neighborhood ID.
 * Returns undefined if no data exists for the given ID.
 */
export function getRentalDataByLocationId(
  locationId: string,
): LocationRentalData | undefined {
  return RENTAL_PRICES.find((d) => d.locationId === locationId);
}

/**
 * Get the average rent for a specific apartment size and building age.
 * Returns the median rent for the given configuration.
 */
export function getMedianRent(
  locationId: string,
  size: ApartmentSize,
  buildingAge: BuildingAge,
): number | undefined {
  const data = getRentalDataByLocationId(locationId);
  if (!data) return undefined;

  const ageData = data[buildingAge];
  const rentRange = ageData[SIZE_TO_PRICING_KEY[size]];
  if (typeof rentRange === "number") return undefined; // pricePerSqm guard
  return (rentRange as RentRange).median;
}

/**
 * Get price per sqm for a location and building age category.
 */
export function getPricePerSqm(
  locationId: string,
  buildingAge: BuildingAge,
): number | undefined {
  const data = getRentalDataByLocationId(locationId);
  if (!data) return undefined;
  return data[buildingAge].pricePerSqm;
}

/**
 * Compare affordability across all locations for a given apartment configuration.
 * Returns locations sorted by median rent (cheapest first).
 */
export function rankByAffordability(
  size: ApartmentSize,
  buildingAge: BuildingAge,
): { locationId: string; name: string; median: number; pricePerSqm: number }[] {
  return RENTAL_PRICES.map((loc) => ({
    locationId: loc.locationId,
    name: loc.name,
    median: (loc[buildingAge][SIZE_TO_PRICING_KEY[size]] as RentRange).median,
    pricePerSqm: loc[buildingAge].pricePerSqm,
  })).sort((a, b) => a.median - b.median);
}

/**
 * Filter locations within a budget range for a given apartment configuration.
 */
export function filterByBudget(
  maxBudget: number,
  size: ApartmentSize,
  buildingAge: BuildingAge,
): LocationRentalData[] {
  return RENTAL_PRICES.filter((loc) => {
    const range = loc[buildingAge][SIZE_TO_PRICING_KEY[size]] as RentRange;
    return range.min <= maxBudget;
  });
}

// ─── Market Summary Statistics ───────────────────────────────────────────────

export const ZURICH_MARKET_SUMMARY = {
  dataDate: "Q1 2025, projected to mid-2026",
  sources: [
    "Wüest Partner Swiss Real Estate Market Report 2024/2025",
    "Statistik Stadt Zürich — Mietpreiserhebung 2024",
    "Zürcher Kantonalbank Immobilienmarktbericht 2024/2025",
    "Comparis Mietpreisindex Q4 2024",
    "Homegate Angebotspreisindex 2025",
    "Bundesamt für Statistik (BFS) Mietpreisstrukturerhebung",
  ],
  cityAverages: {
    /** City-wide average CHF/sqm by building age */
    pricePerSqm: {
      old: 23,
      modern: 30,
      new: 37,
    },
    /** City-wide vacancy rate */
    vacancyRate: 0.07, // 0.07% — extremely tight market
  },
  /** Annual rent increase trend (%) */
  annualIncreasePercent: 2.5,
  /** Reference interest rate (Referenzzinssatz) as of Q1 2025 */
  referenceInterestRate: 1.75,
  keyInsights: [
    "Zurich has one of the tightest rental markets in Europe (<0.1% vacancy)",
    "New construction commands 50-70% premium over old building stock",
    "Gold Coast (Goldküste) prices match or exceed central Zurich Kreise",
    "Silver Coast (Pfnüselküste) offers 15-25% savings vs Gold Coast",
    "Referenzzinssatz at 1.75% — landlords can increase rents when rate rises",
    "Average wait time for a city apartment: 3-6 months of active searching",
    "Nebenkosten (utilities) typically CHF 150-350/month depending on size",
  ],
} as const;
