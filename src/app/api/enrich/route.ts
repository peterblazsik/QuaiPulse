import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_DOMAINS = ["flatfox.ch", "homegate.ch", "immoscout24.ch", "comparis.ch"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FIRECRAWL_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Domain allowlist to prevent SSRF
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!ALLOWED_DOMAINS.some((d) => urlObj.hostname.endsWith(d))) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 400 });
    }

    // Dynamic import to avoid bundling issues when no API key
    const { default: FirecrawlApp } = await import("@mendable/firecrawl-js");
    const firecrawl = new FirecrawlApp({ apiKey });

    const result = await firecrawl.scrape(url, {
      formats: ["markdown"],
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Enrichment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
