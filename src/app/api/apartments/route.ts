import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scrapeFlatfox } from "@/lib/engines/flatfox-scraper";
import type { ScrapeOptions } from "@/lib/engines/flatfox-scraper";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const opts: ScrapeOptions = {
    minSurface: Number(searchParams.get("minSqm")) || 45,
    maxSurface: Number(searchParams.get("maxSqm")) || 72,
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    count: Number(searchParams.get("count")) || 500,
  };

  try {
    const apartments = await scrapeFlatfox(opts);

    return NextResponse.json({
      source: "flatfox",
      count: apartments.length,
      scrapedAt: new Date().toISOString(),
      apartments,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
