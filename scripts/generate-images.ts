/**
 * QuaiPulse Image Generator
 * Uses Google Gemini Imagen 4.0 to generate contextual images
 * Run: npx tsx scripts/generate-images.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const API_KEY = "AIzaSyAVHhuAB27mIpeDxrjbMcoqxLGguLKPPhU";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

const PUBLIC_DIR = join(process.cwd(), "public/images");

interface ImageSpec {
  filename: string;
  prompt: string;
  aspectRatio: string;
  subfolder: string;
}

const STYLE_PREFIX = `Cinematic editorial photograph, desaturated by 25%, lifted blacks, subtle grain (ISO 800 texture), teal-orange color grade. Deep shadows, cool blue dominant with warm tungsten accent lights. Monocle magazine quality. No text, no watermarks.`;

const IMAGES: ImageSpec[] = [
  // === DASHBOARD ===
  {
    subfolder: "dashboard",
    filename: "hero-zurich-twilight.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} Aerial twilight photograph of Zurich lakefront at blue hour, looking south from above Quaibrucke bridge. Lake Zurich stretches into distant Alps, city lights glowing amber and blue along Mythenquai. Grossmunster silhouette against deep indigo sky. Reflections on perfectly still water. Long exposure, slight mist over the lake.`,
  },

  // === NEIGHBORHOODS ===
  {
    subfolder: "neighborhoods",
    filename: "enge.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Mythenquai lakeside promenade in Zurich's Enge district at golden hour. Elegant tree-lined path along Lake Zurich, wooden benches, a lone cyclist in the distance. Alps on the horizon with pink-gold light. Shallow depth of field on foreground plane trees, lake reflections catching last light.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "wiedikon.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Evening street scene on Birmensdorferstrasse in Zurich's Wiedikon district. Warm light from restaurant windows onto rain-wet cobblestones. A tram passes, lights streaking. Diverse crowd at outdoor tables. Neon signs reflected in puddles. Gritty but inviting urban energy. Shot at f/1.8.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "seefeld.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Seefeldquai promenade at sunset looking west across Lake Zurich. Elegant apartment buildings with art nouveau facades, lake and distant mountains. Young professionals walking along waterfront, cafe umbrellas, a small sailboat. Golden hour backlighting creating long shadows and lens flare.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "aussersihl.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Langstrasse at night in Zurich's Kreis 4. Neon signs in multiple languages reflecting off wet pavement. Narrow street with eclectic bars and vintage stores. Overhead tram wires cutting across a moody sky. Street-level perspective. High ISO grain, shallow depth of field. Cool blue shadows, warm neon accents in amber.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "wipkingen.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Im Viadukt market hall in Zurich's Wipkingen, photographed through an arched railway viaduct opening. Warm interior light from artisan food stalls contrasts with blue twilight outside. Brick archways frame the scene. A few people browsing produce. Village-in-the-city atmosphere.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "hottingen.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Quiet tree-lined residential street in Zurich's Hottingen district, autumn. Elegant 19th-century villas behind iron fences, mature chestnut trees with golden leaves, cobblestone sidewalk. Morning mist, soft diffused light filtering through canopy. Serene, intellectual atmosphere.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "oerlikon.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} MFO Park in Zurich Oerlikon at blue hour, the striking metal-frame open-air structure covered in climbing plants, illuminated from within by warm string lights. Modern apartment towers in background. Industrial materials softened by greenery and warm light.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "wollishofen.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Landiwiese park at Lake Zurich in Wollishofen on a quiet summer evening. Wide green lawn stretching to water's edge, a few people having a picnic in the distance. Gentle lake water, Alps silhouetted against peach-colored sky. Pastoral suburban peace. Golden hour sidelight.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "city.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Lindenhof viewpoint overlooking old town Zurich at dusk. Limmat river below, Grossmunster twin towers and Fraumunster spire silhouetted against deep blue sky. Historic buildings lit by warm interior light. Long exposure smooth water, light trails from passing boats. Deep, moody, reverent.`,
  },
  {
    subfolder: "neighborhoods",
    filename: "hard.png",
    aspectRatio: "3:4",
    prompt: `${STYLE_PREFIX} Prime Tower and Hardbrucke area in Zurich's Kreis 5 at blue hour. Modern glass and steel architecture reflecting the sky. Frau Gerolds Garten visible below with container architecture and string lights. Tram tracks in foreground with motion blur. Industrial-chic, steel blue and warm amber contrast.`,
  },

  // === KATIE ===
  {
    subfolder: "katie",
    filename: "hero-station.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} A father and young daughter walking hand-in-hand along a European train station platform, seen from behind. Long perspective vanishing point. Warm tungsten platform lights overhead, distant train in soft blur. The girl's hair catches a rim of golden light. Their shadows stretch long. Atmospheric, emotional. No faces visible.`,
  },

  // === APARTMENTS ===
  {
    subfolder: "apartments",
    filename: "hero-interior.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} Interior of a modern Zurich apartment at twilight, shot through floor-to-ceiling window. City lights visible outside. Inside: minimal Scandinavian furniture, warm table lamp casting amber light on oak desk. Herringbone parquet floor. Moving boxes in one corner. Solitary but intentional. Shallow focus on lamp.`,
  },

  // === SOCIAL CATEGORIES ===
  {
    subfolder: "social",
    filename: "gym-header.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} Interior of an upscale Swiss gym at early morning. Rows of dumbbells on a rack catching light from floor-to-ceiling windows. Clean concrete floor, minimal equipment, industrial-modern interior. Cool blue morning light mixing with warm overhead spots. Deep shadows, high contrast. Athletic, serious.`,
  },
  {
    subfolder: "social",
    filename: "chess-header.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} Close-up of a chess board mid-game in a European cafe setting. Carved wooden pieces, one knight in sharp focus. Background: blurred warm cafe interior with coffee cup. Amber table lamp light, dark wood surfaces. Intellectual tension. Razor-thin depth of field.`,
  },
  {
    subfolder: "social",
    filename: "ai-meetup-header.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} A tech meetup in a modern coworking space: a speaker presenting in front of a projection screen showing data visualizations. Audience silhouettes in foreground, laptop screens glowing blue-white. Exposed brick, hanging Edison bulbs. Cool dominant with warm accent bulbs.`,
  },
  {
    subfolder: "social",
    filename: "swimming-header.png",
    aspectRatio: "16:9",
    prompt: `${STYLE_PREFIX} Public lake swimming area (Badi) in Zurich at golden hour. Wooden jetty extending into calm turquoise-blue lake water. Mountains in soft haze beyond. Traditional wooden changing cabins. Serene, meditative. Teal water dominant, warm golden light on wood surfaces.`,
  },
];

async function generateImage(spec: ImageSpec, index: number): Promise<void> {
  const dir = join(PUBLIC_DIR, spec.subfolder);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const filepath = join(dir, spec.filename);
  if (existsSync(filepath)) {
    console.log(`[${index + 1}/${IMAGES.length}] SKIP (exists): ${spec.subfolder}/${spec.filename}`);
    return;
  }

  console.log(`[${index + 1}/${IMAGES.length}] Generating: ${spec.subfolder}/${spec.filename}...`);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: spec.prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: spec.aspectRatio,
          personGeneration: "ALLOW_ADULT",
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
  console.log(`\nQuaiPulse Image Generator`);
  console.log(`========================`);
  console.log(`Generating ${IMAGES.length} images via Gemini Imagen 4.0\n`);

  for (let i = 0; i < IMAGES.length; i++) {
    await generateImage(IMAGES[i], i);
    // Rate limit: wait 3s between requests
    if (i < IMAGES.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! Images saved to ${PUBLIC_DIR}`);
}

main();
