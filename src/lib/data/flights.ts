export interface AirlineRoute {
  id: string;
  airline: string;
  route: string; // "ZRH-VIE" or "ZRH-BUD"
  avgPrice: number; // EUR
  minPrice: number;
  maxPrice: number;
  durationMin: number; // minutes
  frequency: string; // "3x daily" etc
  baggage: string;
  bookingUrl: string;
  logo: string; // emoji placeholder
}

export interface DayPricing {
  day: string;
  avgPrice: number;
  rating: "cheap" | "moderate" | "expensive";
}

export interface BookingWindow {
  weeksAhead: number;
  label: string;
  savingsPct: number;
  tip: string;
}

export interface MonthPricing {
  month: string;
  avgPrice: number;
  demand: "low" | "medium" | "high";
}

export const AIRLINES: AirlineRoute[] = [
  // ZRH-VIE routes (for Katie visits)
  {
    id: "swiss-vie",
    airline: "SWISS",
    route: "ZRH-VIE",
    avgPrice: 185,
    minPrice: 89,
    maxPrice: 350,
    durationMin: 95,
    frequency: "3x daily",
    baggage: "1x23kg included",
    bookingUrl: "https://www.swiss.com",
    logo: "\u{1F1E8}\u{1F1ED}",
  },
  {
    id: "austrian-vie",
    airline: "Austrian Airlines",
    route: "ZRH-VIE",
    avgPrice: 165,
    minPrice: 79,
    maxPrice: 320,
    durationMin: 90,
    frequency: "3x daily",
    baggage: "1x23kg included",
    bookingUrl: "https://www.austrian.com",
    logo: "\u{1F1E6}\u{1F1F9}",
  },
  {
    id: "easyjet-vie",
    airline: "easyJet",
    route: "ZRH-VIE",
    avgPrice: 65,
    minPrice: 29,
    maxPrice: 180,
    durationMin: 100,
    frequency: "1x daily",
    baggage: "Cabin only (15kg extra ~CHF 30)",
    bookingUrl: "https://www.easyjet.com",
    logo: "\u{1F7E0}",
  },
  {
    id: "wizz-vie",
    airline: "Wizz Air",
    route: "ZRH-VIE", // actually BSL-VIE but close enough
    avgPrice: 45,
    minPrice: 19,
    maxPrice: 150,
    durationMin: 105,
    frequency: "4x weekly",
    baggage: "Small bag free (cabin bag ~CHF 35)",
    bookingUrl: "https://www.wizzair.com",
    logo: "\u{1F7E3}",
  },
  // ZRH-BUD as alternative (train to Vienna from BUD)
  {
    id: "wizz-bud",
    airline: "Wizz Air",
    route: "ZRH-BUD",
    avgPrice: 40,
    minPrice: 15,
    maxPrice: 120,
    durationMin: 100,
    frequency: "Daily",
    baggage: "Small bag free (cabin bag ~CHF 35)",
    bookingUrl: "https://www.wizzair.com",
    logo: "\u{1F7E3}",
  },
  {
    id: "swiss-bud",
    airline: "SWISS",
    route: "ZRH-BUD",
    avgPrice: 170,
    minPrice: 85,
    maxPrice: 310,
    durationMin: 95,
    frequency: "1x daily",
    baggage: "1x23kg included",
    bookingUrl: "https://www.swiss.com",
    logo: "\u{1F1E8}\u{1F1ED}",
  },
];

export const DAY_PRICING: DayPricing[] = [
  { day: "Monday", avgPrice: 75, rating: "cheap" },
  { day: "Tuesday", avgPrice: 65, rating: "cheap" },
  { day: "Wednesday", avgPrice: 85, rating: "moderate" },
  { day: "Thursday", avgPrice: 90, rating: "moderate" },
  { day: "Friday", avgPrice: 130, rating: "expensive" },
  { day: "Saturday", avgPrice: 110, rating: "moderate" },
  { day: "Sunday", avgPrice: 120, rating: "expensive" },
];

export const BOOKING_WINDOWS: BookingWindow[] = [
  { weeksAhead: 1, label: "Last minute", savingsPct: -30, tip: "Avoid unless emergency. Prices spike." },
  { weeksAhead: 2, label: "2 weeks", savingsPct: -10, tip: "Still expensive. Book earlier if possible." },
  { weeksAhead: 3, label: "3 weeks", savingsPct: 5, tip: "Decent prices starting to appear." },
  { weeksAhead: 4, label: "1 month", savingsPct: 15, tip: "Sweet spot for budget airlines." },
  { weeksAhead: 6, label: "6 weeks", savingsPct: 25, tip: "Best prices. Book Katie visits here." },
  { weeksAhead: 8, label: "2 months", savingsPct: 20, tip: "Still good. Premium carriers drop prices." },
  { weeksAhead: 12, label: "3 months", savingsPct: 10, tip: "Prices stabilize. Good for holiday planning." },
];

export const MONTH_PRICING: MonthPricing[] = [
  { month: "Jan", avgPrice: 65, demand: "low" },
  { month: "Feb", avgPrice: 60, demand: "low" },
  { month: "Mar", avgPrice: 75, demand: "medium" },
  { month: "Apr", avgPrice: 90, demand: "medium" },
  { month: "May", avgPrice: 85, demand: "medium" },
  { month: "Jun", avgPrice: 110, demand: "high" },
  { month: "Jul", avgPrice: 130, demand: "high" },
  { month: "Aug", avgPrice: 125, demand: "high" },
  { month: "Sep", avgPrice: 80, demand: "medium" },
  { month: "Oct", avgPrice: 70, demand: "low" },
  { month: "Nov", avgPrice: 55, demand: "low" },
  { month: "Dec", avgPrice: 140, demand: "high" },
];
