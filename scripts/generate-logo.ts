/**
 * QuaiPulse Logo Generator
 * Uses Google Gemini Imagen 4.0
 * Run: GEMINI_API_KEY=xxx npx tsx scripts/generate-logo.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set GEMINI_API_KEY environment variable");
  process.exit(1);
}
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

const OUTPUT_DIR = join(process.cwd(), "public/images/logo");

interface LogoSpec {
  filename: string;
  prompt: string;
  aspectRatio: string;
}

const LOGOS: LogoSpec[] = [
  {
    filename: "logo-icon.png",
    aspectRatio: "1:1",
    prompt: `Minimalist modern app icon logo on a pure black background. A stylized letter "Q" formed by a single continuous geometric line that also suggests a pulse/heartbeat wave — the tail of the Q becomes an ECG/pulse line that rises in a sharp peak before settling. The stroke is a luminous electric blue (#3b82f6) with a subtle cyan glow. Clean vector-style, no texture, no gradients — just the glowing line mark on black. Professional, tech-forward, instantly recognizable at 32x32px. No text, no words, no additional elements.`,
  },
  {
    filename: "logo-icon-alt.png",
    aspectRatio: "1:1",
    prompt: `Premium minimalist app icon on solid black (#0f172a) background. Abstract geometric mark combining a location pin silhouette with a pulse/heartbeat line cutting through its center horizontally. The pin shape is suggested by negative space, the pulse line is a sharp electric blue (#3b82f6) zigzag. Ultra-clean, single color, works at favicon size. Feels like a Bloomberg or fintech brand mark. No text, no words, no letters.`,
  },
  {
    filename: "logo-icon-v3.png",
    aspectRatio: "1:1",
    prompt: `Ultra-minimal tech logo icon on pure black background. A perfect circle outline in electric blue (#3b82f6), with a single sharp pulse/heartbeat wave cutting through the circle horizontally — like an ECG line inside a radar or compass. The line enters from the left, spikes up sharply once in the center, then exits right. Thin geometric strokes, subtle blue glow, no fill. Inspired by Bloomberg Terminal aesthetics. No text, no words.`,
  },
];

async function generateLogo(spec: LogoSpec, index: number): Promise<void> {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const filepath = join(OUTPUT_DIR, spec.filename);
  if (existsSync(filepath)) {
    console.log(`[${index + 1}/${LOGOS.length}] SKIP (exists): ${spec.filename}`);
    return;
  }

  console.log(`[${index + 1}/${LOGOS.length}] Generating: ${spec.filename}...`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: spec.prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: spec.aspectRatio,
          personGeneration: "DONT_ALLOW",
          safetyFilterLevel: "BLOCK_ONLY_HIGH",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  ERROR ${response.status}: ${errorText.slice(0, 200)}`);
      return;
    }

    const result = await response.json();

    if (!result.predictions || result.predictions.length === 0) {
      console.error(`  ERROR: No image generated (safety filter?)`);
      return;
    }

    const base64 = result.predictions[0].bytesBase64Encoded;
    const buffer = Buffer.from(base64, "base64");
    writeFileSync(filepath, buffer);
    console.log(`  OK: ${filepath} (${(buffer.length / 1024).toFixed(0)}KB)`);
  } catch (err) {
    console.error(`  ERROR: ${err}`);
  }
}

async function main() {
  console.log(`\nQuaiPulse Logo Generator`);
  console.log(`========================`);
  console.log(`Generating ${LOGOS.length} logo variants via Gemini Imagen 4.0\n`);

  for (let i = 0; i < LOGOS.length; i++) {
    await generateLogo(LOGOS[i], i);
    if (i < LOGOS.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! Logos saved to ${OUTPUT_DIR}`);
  console.log(`Review them and pick your favorite.`);
}

main();
