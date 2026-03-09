/**
 * Swiss Cantonal & Municipal Tax Estimation
 *
 * Sources:
 * - Steueramt Kanton Zürich — Steuerfüsse 2024/2025
 * - EStV / ESTV Steuerrechner Bund
 * - Statistik Kanton Zürich — Gemeindesteuerfüsse 2024
 *
 * Model: Simplified effective tax rates for a single, Reformed/no-church taxpayer
 * earning CHF 145,800 gross annual (CHF 12,150/mo × 12). Rates include:
 * - Federal income tax (Bundessteuer)
 * - Cantonal income tax (Kantonssteuer)
 * - Municipal tax (Gemeindesteuer)
 * - Personal tax (Personalsteuer) where applicable
 *
 * Excludes: Church tax (user is not church-affiliated), wealth tax (minimal at this income)
 *
 * Note: These are APPROXIMATE effective rates after standard deductions.
 * Actual tax burden depends on deductions (Pillar 3a, commuting, insurance, etc.).
 * Use the official calculator at ssstv.ch/steuerrechner for exact figures.
 *
 * Data freshness: Tax year 2025 Steuerfüsse
 */

export interface LocationTaxData {
  /** Matches neighborhood id in neighborhoods.ts */
  locationId: string;
  /** Municipality name */
  municipality: string;
  /** Steuerfuss (municipal tax multiplier, % of simple cantonal tax) */
  steuerfuss: number;
  /** Approximate effective income tax rate (%) — all levels combined */
  effectiveRate: number;
  /** Estimated annual income tax in CHF for Peter's income */
  estimatedAnnualTax: number;
  /** Estimated monthly tax burden in CHF */
  estimatedMonthlyTax: number;
  /** Brief tax note */
  note: string;
}

// Reference gross for pre-computed estimates (CHF 15,000/mo × 13)
const REFERENCE_GROSS = 195000;

// Helper: calculate monthly from annual
function taxEntry(
  locationId: string,
  municipality: string,
  steuerfuss: number,
  effectiveRate: number,
  note: string,
): LocationTaxData {
  const estimatedAnnualTax = Math.round(REFERENCE_GROSS * (effectiveRate / 100));
  return {
    locationId,
    municipality,
    steuerfuss,
    effectiveRate,
    estimatedAnnualTax,
    estimatedMonthlyTax: Math.round(estimatedAnnualTax / 12),
    note,
  };
}

/**
 * Tax data for all 20 QuaiPulse locations.
 *
 * Zurich city Kreise all share the same municipal Steuerfuss (119%).
 * Lake towns have their own Steuerfüsse which vary significantly.
 */
export const TAX_RATES: LocationTaxData[] = [
  // ─── Zurich City Kreise (Steuerfuss 119%) ──────────────────────────────
  taxEntry("city", "Zürich (Stadt)", 119, 12.3, "Standard city rate. Higher than lake towns but offset by shorter commute/lower transport costs."),
  taxEntry("enge", "Zürich (Stadt)", 119, 12.3, "Same as all Zurich city districts. Close to work = transport savings offset tax premium."),
  taxEntry("wollishofen", "Zürich (Stadt)", 119, 12.3, "City rate. Good value — lower rent than Enge with same municipal services."),
  taxEntry("wiedikon", "Zürich (Stadt)", 119, 12.3, "City rate. Affordable rents + city amenities make this a tax-efficient choice."),
  taxEntry("aussersihl", "Zürich (Stadt)", 119, 12.3, "City rate. Lowest rents in central Zurich, maximizing post-tax-and-rent surplus."),
  taxEntry("seefeld", "Zürich (Stadt)", 119, 12.3, "City rate. Premium rents mean tax is a smaller concern than housing cost."),
  taxEntry("hottingen", "Zürich (Stadt)", 119, 12.3, "City rate. Established residential area, good schools."),
  taxEntry("wipkingen", "Zürich (Stadt)", 119, 12.3, "City rate. Gentrifying — rent may rise but tax stays constant."),
  taxEntry("oerlikon", "Zürich (Stadt)", 119, 12.3, "City rate. Furthest from lake but rent savings compound with standard tax."),
  taxEntry("hard", "Zürich (Stadt)", 119, 12.3, "City rate. Best nightlife district, industrial-chic living."),

  // ─── Gold Coast (Goldküste) ────────────────────────────────────────────
  taxEntry("zollikon", "Zollikon", 82, 10.1, "One of the lowest Steuerfüsse in Canton Zurich. CHF ~3,200/yr less tax than city."),
  taxEntry("kusnacht", "Küsnacht", 77, 9.7, "Ultra-low tax municipality. Popular with high earners. CHF ~3,800/yr less than city."),
  taxEntry("erlenbach", "Erlenbach", 80, 9.9, "Very low tax. Quiet Gold Coast village with excellent lake access."),
  taxEntry("meilen", "Meilen", 91, 10.8, "Moderate Gold Coast rate. Larger town with more amenities than neighbors."),

  // ─── Silver Coast (Pfnüselküste) ──────────────────────────────────────
  taxEntry("kilchberg", "Kilchberg", 82, 10.1, "Same rate as Zollikon. Lindt chocolate factory HQ — well-funded municipality."),
  taxEntry("ruschlikon", "Rüschlikon", 56, 8.5, "Lowest Steuerfuss in the region. Gottfried Duttweiler Institute / Swiss Re campus nearby. CHF ~5,500/yr less than city."),
  taxEntry("thalwil", "Thalwil", 95, 11.0, "Moderate Silver Coast rate. Good S-Bahn connection offsets slightly higher tax vs neighbors."),
  taxEntry("horgen", "Horgen", 99, 11.3, "Close to city rate. Largest Silver Coast town, most urban amenities."),

  // ─── Other ─────────────────────────────────────────────────────────────
  taxEntry("adliswil", "Adliswil", 114, 12.0, "Nearly city-level tax. Benefits from proximity to Zurich without city premium rents."),
  taxEntry("mannedorf", "Männedorf", 93, 10.9, "Moderate tax rate. Furthest east on Gold Coast, quieter and more affordable."),
];

// ─── Utility Functions ───────────────────────────────────────────────────────

const taxMap = new Map(TAX_RATES.map((t) => [t.locationId, t]));

/**
 * Get tax data for a specific location.
 */
export function getTaxDataByLocationId(locationId: string): LocationTaxData | undefined {
  return taxMap.get(locationId);
}

/**
 * Rank locations by tax burden (lowest first).
 */
export function rankByTaxBurden(): LocationTaxData[] {
  return [...TAX_RATES].sort((a, b) => a.estimatedAnnualTax - b.estimatedAnnualTax);
}

/**
 * Calculate tax savings of a location vs Zurich city.
 */
export function taxSavingsVsCity(locationId: string): number {
  const cityTax = taxMap.get("city");
  const locTax = taxMap.get(locationId);
  if (!cityTax || !locTax) return 0;
  return cityTax.estimatedAnnualTax - locTax.estimatedAnnualTax;
}

/**
 * Get the cheapest and most expensive tax municipalities.
 */
export function getTaxExtremes(): { cheapest: LocationTaxData; mostExpensive: LocationTaxData } {
  const sorted = rankByTaxBurden();
  return { cheapest: sorted[0], mostExpensive: sorted[sorted.length - 1] };
}
