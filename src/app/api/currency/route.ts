import { NextResponse } from "next/server";

const BASE_URL = "https://api.frankfurter.dev";

export async function GET() {
  try {
    // Fetch latest rates with CHF as base
    const [latestRes, yesterdayRes] = await Promise.all([
      fetch(`${BASE_URL}/latest?from=CHF&to=EUR,HUF`),
      fetch(
        `${BASE_URL}/${getYesterday()}?from=CHF&to=EUR,HUF`
      ),
    ]);

    if (!latestRes.ok || !yesterdayRes.ok) {
      throw new Error("Failed to fetch rates");
    }

    const latest = await latestRes.json();
    const yesterday = await yesterdayRes.json();

    const chfEur = latest.rates.EUR;
    const chfHuf = latest.rates.HUF;
    const prevChfEur = yesterday.rates.EUR;
    const prevChfHuf = yesterday.rates.HUF;

    const rates = {
      "CHF/EUR": {
        rate: chfEur,
        change: chfEur - prevChfEur,
        trend: getTrend(chfEur, prevChfEur),
      },
      "CHF/HUF": {
        rate: chfHuf,
        change: chfHuf - prevChfHuf,
        trend: getTrend(chfHuf, prevChfHuf),
      },
      "EUR/HUF": {
        rate: chfHuf / chfEur,
        change: chfHuf / chfEur - prevChfHuf / prevChfEur,
        trend: getTrend(chfHuf / chfEur, prevChfHuf / prevChfEur),
      },
      "EUR/CHF": {
        rate: 1 / chfEur,
        change: 1 / chfEur - 1 / prevChfEur,
        trend: getTrend(1 / chfEur, 1 / prevChfEur),
      },
    };

    // Fetch 30-day history for sparklines
    const thirtyDaysAgo = getDateDaysAgo(30);
    const historyRes = await fetch(
      `${BASE_URL}/${thirtyDaysAgo}..?from=CHF&to=EUR,HUF`
    );

    let sparklines: Record<string, number[]> = {};
    if (historyRes.ok) {
      const history = await historyRes.json();
      const dates = Object.keys(history.rates).sort();
      sparklines = {
        "CHF/EUR": dates.map((d) => history.rates[d].EUR),
        "CHF/HUF": dates.map((d) => history.rates[d].HUF),
        "EUR/CHF": dates.map((d) => 1 / history.rates[d].EUR),
      };
    }

    return NextResponse.json(
      { rates, sparklines, updatedAt: latest.date },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (err) {
    console.error("Currency API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch currency rates" },
      { status: 502 }
    );
  }
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  // Skip weekends (no forex data)
  if (d.getDay() === 0) d.setDate(d.getDate() - 2);
  if (d.getDay() === 6) d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function getTrend(current: number, previous: number): "up" | "down" | "flat" {
  const diff = current - previous;
  if (Math.abs(diff) < 0.0001) return "flat";
  return diff > 0 ? "up" : "down";
}
