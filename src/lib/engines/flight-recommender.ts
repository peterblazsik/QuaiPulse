import { DAY_PRICING, BOOKING_WINDOWS, MONTH_PRICING, AIRLINES } from "@/lib/data/flights";

export function getBestDay() {
  return DAY_PRICING.reduce((a, b) => (a.avgPrice < b.avgPrice ? a : b));
}

export function getBestWindow() {
  return BOOKING_WINDOWS.reduce((a, b) => (a.savingsPct > b.savingsPct ? a : b));
}

export function getCheapestMonth() {
  return MONTH_PRICING.reduce((a, b) => (a.avgPrice < b.avgPrice ? a : b));
}

export function getCheapestAirline(route: string = "ZRH-VIE") {
  return AIRLINES.filter((a) => a.route === route).reduce((a, b) => (a.avgPrice < b.avgPrice ? a : b));
}

export function getRecommendation() {
  const bestDay = getBestDay();
  const bestWindow = getBestWindow();
  const cheapest = getCheapestAirline();
  const bestMonth = getCheapestMonth();

  return {
    summary: `Fly ${cheapest.airline} on ${bestDay.day}s, book ${bestWindow.label} ahead. Cheapest month: ${bestMonth.month}.`,
    estimatedSaving: `~CHF ${Math.round(185 * (bestWindow.savingsPct / 100) + (185 - cheapest.avgPrice))} per trip vs. SWISS last-minute`,
    bestDay,
    bestWindow,
    cheapest,
    bestMonth,
  };
}
