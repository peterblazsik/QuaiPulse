import type { SavedApartment } from "@/lib/stores/apartment-store";
import type { ScoredNeighborhood } from "@/lib/engines/scoring";
import type { BudgetBreakdown, ExpenseItem } from "@/lib/engines/budget-calculator";
import type { BudgetValues } from "@/lib/stores/budget-store";
import type { KatieVisitData } from "@/lib/data/katie-visits";

function csvEscape(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  // Guard against formula injection in spreadsheets
  if (/^[=+\-@\t\r]/.test(value)) {
    return `"'${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function csvRow(cells: string[]): string {
  return cells.map(csvEscape).join(",");
}

// ---- CSV Export (Budget) ----

export function exportBudgetCSV(
  breakdown: BudgetBreakdown,
  expenses: ExpenseItem[],
  values: BudgetValues | Record<string, number>
) {
  const rows = [
    csvRow(["Category", "Amount (CHF)"]),
    csvRow(["--- GROSS INCOME ---", ""]),
    csvRow(["Monthly Gross Salary", String(breakdown.grossMonthlySalary)]),
    csvRow(["Annual Gross", String(breakdown.grossAnnualSalary)]),
    csvRow(["", ""]),
    csvRow(["--- PAYROLL DEDUCTIONS ---", ""]),
    csvRow(["AHV/IV/EO", String(-breakdown.ahvMonthly)]),
    csvRow(["ALV", String(-breakdown.alvMonthly)]),
    csvRow(["BVG (2nd Pillar)", String(-breakdown.bvgMonthly)]),
    csvRow(["Total Social Deductions", String(-breakdown.totalSocialMonthly)]),
    csvRow(["Monthly Tax", String(-breakdown.monthlyTax)]),
    csvRow(["", ""]),
    csvRow(["--- NET INCOME ---", ""]),
    csvRow(["Net Monthly Salary", String(breakdown.netMonthlySalary)]),
    csvRow(["Expense Allowance", String(breakdown.expenseAllowance)]),
    csvRow(["Insurance Contribution", String(breakdown.employerInsuranceContrib)]),
    csvRow(["Mobility Allowance", String(breakdown.mobilityAllowance)]),
    csvRow(["Relocation (amortized)", String(breakdown.relocationMonthly)]),
    csvRow(["Total Take-home", String(breakdown.totalMonthlyIncome)]),
    csvRow(["", ""]),
    csvRow(["--- FIXED OUTSIDE ---", ""]),
    ...breakdown.viennaBreakdown.map((item) =>
      csvRow([item.label, String(-item.value)])
    ),
    csvRow(["Total Vienna", String(-breakdown.fixedOutside)]),
    csvRow(["", ""]),
    csvRow(["--- ZURICH EXPENSES ---", ""]),
    ...expenses.map((e) =>
      csvRow([e.label, String((values as Record<string, number>)[e.key] ?? e.value)])
    ),
    csvRow(["Total Zurich", String(breakdown.zurichCosts)]),
    csvRow(["Pillar 3a", String(breakdown.pillar3aMonthly)]),
    csvRow(["", ""]),
    csvRow(["--- SUMMARY ---", ""]),
    csvRow(["Total Expenses", String(breakdown.totalExpenses)]),
    csvRow(["Monthly Surplus", String(breakdown.surplus)]),
    csvRow(["Savings Rate", `${breakdown.savingsRate.toFixed(1)}%`]),
    csvRow(["Annual Surplus", String(breakdown.annualSurplus)]),
  ];

  const csv = rows.join("\n");
  downloadFile(csv, "quaipulse-budget.csv", "text/csv");
}

// ---- ICS Export (Katie Visits) ----

function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function exportKatieICS(visits: KatieVisitData[]) {
  const events = visits.map((v) => {
    const dtStart = v.startDate.replace(/-/g, "");
    const dtEnd = incrementDate(v.endDate).replace(/-/g, "");
    const summary = v.isSpecial
      ? `Katie Visit - ${v.specialLabel}`
      : "Katie Visit";
    const description = [
      v.transportMode === "flight" ? "Flight ZRH-VIE" : "Train (Railjet/NightJet)",
      v.notes ?? "",
    ]
      .filter(Boolean)
      .join("\\n");

    return [
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:${icsEscape(summary)}`,
      `DESCRIPTION:${icsEscape(description)}`,
      `UID:${v.id}@quaipulse`,
      "END:VEVENT",
    ].join("\r\n");
  });

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//QuaiPulse//Katie Visits//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  downloadFile(ics, "katie-visits.ics", "text/calendar");
}

function incrementDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ---- JSON Backup ----

export function exportFullBackup(data: {
  apartments: SavedApartment[];
  budgetValues: BudgetValues | Record<string, number>;
  neighborhoods: ScoredNeighborhood[];
  completedChecklistIds: string[];
}) {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: "0.1.0",
    ...data,
  };

  const json = JSON.stringify(backup, null, 2);
  downloadFile(json, "quaipulse-backup.json", "application/json");
}

// ---- Neighborhood Rankings CSV ----

export function exportRankingsCSV(neighborhoods: ScoredNeighborhood[]) {
  const headers = [
    "Rank",
    "Name",
    "Kreis",
    "Score",
    "Commute",
    "Gym",
    "Social",
    "Lake",
    "Airport",
    "Food",
    "Quiet",
    "Transit",
    "1BR Min",
    "1BR Max",
    "Vibe",
  ];

  const rows = neighborhoods.map((n) =>
    csvRow([
      String(n.rank),
      n.name,
      String(n.kreis),
      n.weightedScore.toFixed(2),
      String(n.scores.commute),
      String(n.scores.gym),
      String(n.scores.social),
      String(n.scores.lake),
      String(n.scores.airport),
      String(n.scores.food),
      String(n.scores.quiet),
      String(n.scores.transit),
      String(n.rentOneBrMin),
      String(n.rentOneBrMax),
      n.vibe,
    ])
  );

  const csv = [csvRow(headers), ...rows].join("\n");
  downloadFile(csv, "quaipulse-neighborhoods.csv", "text/csv");
}

// ---- Helper ----

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
