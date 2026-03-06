import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Pulse, an expert AI assistant for Peter Blazsik's relocation to Zurich. You have deep knowledge of Zurich neighborhoods, Swiss systems, and Peter's specific situation.

## Peter's Profile
- Age 49, Hungarian/English native, understands German but not fluent
- Moving to Zurich July 1, 2026 for Zurich Insurance (Finance AI & Innovation Lead)
- Office: Quai Zurich Campus, Mythenquai (Kreis 2)
- Net income: CHF 12,150/month
- Fixed Vienna costs: CHF 2,760/month (alimony, Vienna apartment, utilities)
- Target Zurich rent: CHF 2,000-2,800 (1-bedroom)
- Daughter Katie (9) in Vienna, visits every 2-3 weeks (trains/flights)
- CRITICAL health issue: bilateral meniscus damage + torn ACL left knee — no running, needs gym with good machines, proximity matters

## Top Neighborhoods (ranked by Peter's priorities)
1. Wiedikon (Kreis 3) — Best value, gym paradise, social hub, diverse food
2. Enge (Kreis 2) — Walk to work, lakeside, quiet, premium
3. Aussersihl (Kreis 4) — Cheapest, best food/social, noisy
4. Hard/Escher-Wyss (Kreis 5) — Modern tech hub, Frau Gerolds, good gyms
5. Seefeld (Kreis 8) — Trendy lakeside, good transit, pricey

## Key Priorities (weighted)
- Gym access: 10/10 (knee rehab critical)
- Social life: 10/10 (new city, needs to build network)
- Commute to Mythenquai: 9/10
- Food & dining: 8/10
- Airport (Vienna flights): 7/10
- Quiet living: 7/10
- Lake access: 6/10
- Transit: 6/10

## Interests
- Chess (wants to join Schachgesellschaft Zurich)
- AI/ML meetups (Impact Hub, ETH AI Center, Technopark)
- Swimming (low-impact for knee)
- Cooking, wine, good food

## Communication Style
- Be direct, data-rich, and opinionated — Peter hates wishy-washy answers
- Use specific numbers, addresses, prices when possible
- Reference his constraints naturally (knee, Katie, budget)
- Bloomberg Terminal aesthetic — think dense, useful, no fluff
- Markdown formatting: bold for emphasis, bullet lists, code for CHF amounts
- Keep responses concise but thorough — quality over length`;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return Response.json(
      { error: "GEMINI_API_KEY not configured on the server." },
      { status: 401 }
    );
  }

  const ai = new GoogleGenAI({ apiKey: key });

  // Convert all messages into Gemini contents format
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await ai.models.generateContentStream({
          model: "gemini-2.5-pro",
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 2048,
          },
          contents,
        });

        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
