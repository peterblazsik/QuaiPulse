# QuaiPulse Image Generation Strategy

## Visual Style Guide for All Generated Images

### Master Style Definition

Every image generated for QuaiPulse must adhere to a single, cohesive visual language. This is not a lifestyle app. This is a Bloomberg Terminal meets cinematic editorial photography. Every image should feel like it was shot for a Monocle magazine feature about a man rebuilding his life in one of the world's most precise cities.

**Mood:** Cinematic, contemplative, precise. Think: the quiet tension of a Villeneuve film, the editorial quality of Cereal magazine, the data-obsessed soul of a Bloomberg terminal.

**Lighting:** Golden hour, blue hour, or controlled interior light. Strong directional light with deep shadows. Never flat, never stock-photo-bright. Light should feel earned, not given.

**Color Temperature:** Cool-dominant (to match the slate-900/slate-950 UI backgrounds), with warm accent light sources (lamps, sunsets, reflections on water). Every image must sit comfortably on `#0f172a` and `#1e293b` backgrounds without jarring contrast.

**Color Palette Constraints:**
- Dominant tones: Deep blues (#0f172a - #1e3a5f), slate grays (#334155 - #64748b), charcoal blacks
- Accent warmth: Amber/gold (#f59e0b range), copper, warm tungsten light
- Accent cool: Cyan (#06b6d4 range), electric blue (#3b82f6), teal water
- Forbidden: Saturated reds, neon greens, hot pinks, pure white backgrounds, anything that reads "stock photo"

**Depth of Field:** Shallow where subjects are involved (f/1.4 - f/2.8 look), deeper for architecture and landscapes but with atmospheric haze or fog.

**Post-Processing Feel:** Desaturated by 20-30%, lifted blacks (never pure black in the image, leave that to the UI), subtle grain (ISO 800-1600 texture), slight teal-orange color grade.

**Aspect Ratios:**
- Hero banners: 16:9 (1440x810 or 1920x1080)
- Neighborhood cards: 3:2 (720x480)
- Category headers: 4:1 (1200x300)
- Square thumbnails: 1:1 (400x400)
- Tall cards: 2:3 (480x720)

**Overlay Strategy (critical for dark UI integration):**
Every image in the UI will have a CSS gradient overlay to ensure text legibility and seamless blending with the dark interface. Images should be generated knowing they will be partially obscured:
- Bottom gradient: `linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0.8) 30%, transparent 70%)`
- Full scrim: `linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,0.9) 100%)`
- Side gradient (for text-left layouts): `linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 40%, transparent 70%)`

---

## Complete Image Inventory

### 1. DASHBOARD PAGE (`src/app/page.tsx`)

#### 1.1 Dashboard Hero Background
- **Placement:** Full-width banner behind the 4 hero stat cards at top of page
- **Dimensions:** 1920x400 (cropped to container height, responsive)
- **Type:** Photo-realistic
- **Prompt:** `Aerial twilight photograph of Zurich lakefront at blue hour, looking south from above Quaibrucke bridge. Lake Zurich stretches into distant Alps, city lights beginning to glow amber and blue along Mythenquai. Grossmunster silhouette against deep indigo sky. Reflections on perfectly still water. Shot at f/8, long exposure, slight mist over the lake. Desaturated, cinematic color grade, deep shadows, cool blue dominant with warm tungsten accent lights from buildings. Monocle magazine editorial quality.`
- **Filename:** `public/images/dashboard/hero-zurich-twilight.webp`
- **CSS Treatment:** Bottom gradient fade to `--bg-primary`, opacity 0.3-0.4 base to keep stat card text fully legible

#### 1.2 Dashboard Mission Card Accent
- **Placement:** Background accent in the "Mission / Peter Blazsik" card (4th hero card)
- **Dimensions:** 400x300
- **Type:** Abstract / geometric
- **Prompt:** `Abstract geometric composition of overlapping translucent planes in deep navy blue and slate gray, with a single thin line of electric blue (#3b82f6) cutting diagonally through the composition. Minimal, architectural, inspired by Sol LeWitt wall drawings. Dark background, barely visible edges. Suitable for overlaying white text.`
- **Filename:** `public/images/dashboard/mission-accent.webp`
- **CSS Treatment:** opacity 0.15, positioned absolute behind text content

---

### 2. NEIGHBORHOODS PAGE (`src/app/neighborhoods/page.tsx`, `src/components/neighborhoods/neighborhood-card.tsx`)

Each neighborhood needs a signature image. These appear in the expanded card view and potentially as card header backgrounds.

#### 2.1 Enge (Kreis 2)
- **Placement:** Expanded neighborhood card header, 16:9 banner inside card
- **Dimensions:** 720x480 (3:2)
- **Type:** Photo-realistic
- **Prompt:** `Mythenquai lakeside promenade in Zurich's Enge district at golden hour. Elegant tree-lined path along Lake Zurich, wooden benches, a lone cyclist in the distance. Zurich Insurance campus visible softly in background. Alps on the horizon with pink-gold light. Shallow depth of field on foreground plane trees, lake reflections catching last light. Desaturated editorial style, deep shadows, warm-cool contrast. Shot on medium format, f/4.`
- **Filename:** `public/images/neighborhoods/enge.webp`

#### 2.2 Wiedikon (Kreis 3)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Evening street scene on Birmensdorferstrasse in Zurich's Wiedikon district. Warm light spilling from restaurant windows and cafe terraces onto rain-wet cobblestones. A tram passes, its lights streaking. Diverse crowd at outdoor tables. Neon signs reflected in puddles. Gritty but inviting urban energy. Cinematic shallow depth of field, shot at f/1.8. Desaturated with lifted blacks, teal-orange color grade.`
- **Filename:** `public/images/neighborhoods/wiedikon.webp`

#### 2.3 Seefeld (Kreis 8)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Seefeldquai promenade at sunset looking west across Lake Zurich. Elegant apartment buildings with art nouveau facades on the right, lake and distant mountains on the left. Young professionals walking along the waterfront, cafe umbrellas, a small sailboat on the water. Golden hour backlighting creating long shadows and lens flare. Editorial fashion photography quality. Desaturated, grain, warm highlights against cool shadow tones.`
- **Filename:** `public/images/neighborhoods/seefeld.webp`

#### 2.4 Aussersihl (Kreis 4)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Langstrasse at night, Zurich's Aussersihl district. Neon signs in multiple languages reflecting off wet pavement. Narrow street with eclectic mix of bars, kebab shops, and vintage stores. Overhead tram wires cutting across a moody sky. Street-level perspective, slight Dutch angle. High ISO grain, shallow depth of field on a blurred pedestrian. Cyberpunk-adjacent but real. Cool blue shadows, warm neon accents in amber and pink.`
- **Filename:** `public/images/neighborhoods/aussersihl.webp`

#### 2.5 Wipkingen (Kreis 10)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Im Viadukt market hall in Zurich's Wipkingen area, photographed through one of the arched railway viaduct openings. Warm interior light from artisan food stalls contrasts with blue twilight outside. Brick archways frame the scene. A few people browsing produce and crafts. Architectural depth, medium format look. Desaturated with warm tungsten tones inside, cool blue outside. Village-in-the-city atmosphere.`
- **Filename:** `public/images/neighborhoods/wipkingen.webp`

#### 2.6 Hottingen (Kreis 7)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Quiet tree-lined residential street in Zurich's Hottingen district, autumn. Elegant 19th-century villas behind iron fences, mature chestnut trees with golden leaves, cobblestone sidewalk. Morning mist, soft diffused light filtering through canopy. A single person walking in the distance. The Kunsthaus museum barely visible through the trees. Serene, intellectual, old-money atmosphere. Shot on Hasselblad, f/5.6. Desaturated, lifted blacks, green-gold-gray palette.`
- **Filename:** `public/images/neighborhoods/hottingen.webp`

#### 2.7 Oerlikon (Kreis 11)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `MFO Park in Zurich Oerlikon at blue hour, the striking metal-frame open-air structure covered in climbing plants, illuminated from within by warm string lights. Modern apartment towers in background. Clean, geometric, forward-looking. A few people sitting inside the living structure. Industrial materials (steel, concrete) softened by greenery and warm light. Architectural photography style, f/8, deep focus, slightly desaturated.`
- **Filename:** `public/images/neighborhoods/oerlikon.webp`

#### 2.8 Wollishofen (Kreis 2)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Landiwiese park at Lake Zurich in Wollishofen on a quiet summer evening. Wide green lawn stretching to the water's edge, a few people having a picnic in the distance. The Rote Fabrik cultural venue visible to the left with its distinctive red facade. Gentle lake water, Alps silhouetted against peach-colored sky. Pastoral, suburban peace. Shot at f/4, golden hour sidelight. Desaturated, warm-cool split toning, documentary style.`
- **Filename:** `public/images/neighborhoods/wollishofen.webp`

#### 2.9 City / Altstadt (Kreis 1)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Lindenhof viewpoint overlooking old town Zurich at dusk. Limmat river below, Grossmunster twin towers and Fraumunster spire silhouetted against deep blue sky. Historic buildings along the riverbank lit by warm interior light. A lone figure stands at the stone balustrade looking out. Long exposure: smooth water, slight light trails from passing boats. Masterful landscape photography. Deep, moody, reverent. Cool dominant, warm accent points.`
- **Filename:** `public/images/neighborhoods/city.webp`

#### 2.10 Hard / Escher-Wyss (Kreis 5)
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Prime Tower and Hardbrucke area in Zurich's Kreis 5 at blue hour. Modern glass and steel architecture reflecting the sky. The converted industrial Frau Gerolds Garten visible below with its container architecture and string lights. Tram tracks in foreground, a tram passing with motion blur. Industrial-chic: cranes, new construction, river in background. Shot at f/5.6, wide angle. Architectural editorial quality. Steel blue and warm amber contrast. Slightly desaturated, urban grain.`
- **Filename:** `public/images/neighborhoods/hard.webp`

---

### 3. APARTMENTS PAGE (`src/app/apartments/page.tsx`)

#### 3.1 Apartments Page Hero
- **Placement:** Above the "Search Portals" section, full-width banner
- **Dimensions:** 1440x400
- **Type:** Photo-realistic
- **Prompt:** `Interior of a modern Zurich apartment at twilight, shot through a floor-to-ceiling window. City lights visible outside, deep blue sky. Inside: minimal Scandinavian furniture, warm table lamp casting amber cone of light on an oak desk. Herringbone parquet floor. Moving boxes stacked neatly in one corner, suggesting arrival. One chair, one coffee cup. Solitary but intentional. Shot at f/2, shallow focus on the lamp and desk, city blurred beyond. Deep shadows, cinematic, quiet anticipation.`
- **Filename:** `public/images/apartments/hero-interior.webp`

#### 3.2 Apartment Card Placeholder Image
- **Placement:** Left side of each apartment listing card (future: actual photos)
- **Dimensions:** 200x150
- **Type:** Abstract / illustration
- **Prompt:** `Minimal architectural line drawing of a Zurich apartment building facade on a pure dark navy background (#0f172a). Fine white lines (1px weight) depicting windows, balconies, and a pitched roof in isometric perspective. One window glows warm amber. Clean, technical, blueprint-like. No background detail, just the building floating in dark space.`
- **Filename:** `public/images/apartments/placeholder-building.webp`

---

### 4. KATIE VISIT PLANNER (`src/app/katie/page.tsx`)

#### 4.1 Katie Page Hero/Header
- **Placement:** Full-width banner at top of page, behind the header text
- **Dimensions:** 1440x350
- **Type:** Photo-realistic, emotionally resonant
- **Prompt:** `A father and young daughter (around 9 years old) walking hand-in-hand along a European train station platform, seen from behind. Long perspective vanishing point. Warm tungsten platform lights overhead, distant train in soft blur. The girl's hair catches a rim of golden light. Their shadows stretch long in front of them. Atmospheric, emotional, documentary style. Shallow depth of field at f/2. Desaturated, lifted blacks, teal-amber split tone. No faces visible, privacy-preserving. Evokes journey, connection, anticipation.`
- **Filename:** `public/images/katie/hero-station.webp`

#### 4.2 Vienna-Zurich Travel Card Image
- **Placement:** Potential accent image in the cost breakdown card
- **Dimensions:** 400x300
- **Type:** Photo-realistic
- **Prompt:** `Aerial view of a Railjet train crossing a dramatic alpine bridge or viaduct between Austria and Switzerland, seen from above. Lush green valleys below, mountains in soft atmospheric haze. The red-and-gray OBB train is a small precise detail in vast landscape. Dawn light, volumetric mist in the valley. Desaturated with lifted blacks, cool blue atmosphere with warm light hitting the eastern mountain faces. National Geographic quality landscape.`
- **Filename:** `public/images/katie/vienna-zurich-rail.webp`

#### 4.3 Father-Daughter Activity Image
- **Placement:** Potential special visit label enhancement
- **Dimensions:** 400x400 (1:1)
- **Type:** Photo-realistic
- **Prompt:** `Overhead view of a board game being played on a wooden table. Two pairs of hands visible: adult male hands and small child's hands reaching for game pieces. Warm table lamp light, shallow depth of field. Coffee cup at one edge, juice glass at the other. Intimate, domestic, cozy. Shot at f/1.8 from above. Desaturated, warm tones, grain texture. The board game could be chess. No faces.`
- **Filename:** `public/images/katie/activity-together.webp`

---

### 5. SOCIAL INFRASTRUCTURE (`src/app/social/page.tsx`)

Category header images for each venue type:

#### 5.1 Gym Category Header
- **Dimensions:** 1200x300 (4:1)
- **Type:** Photo-realistic
- **Prompt:** `Interior of an upscale Swiss gym at early morning, 6am quality light. Rows of dumbbells on a rack catching light from floor-to-ceiling windows. A single person in silhouette doing cable exercises in the background. Clean concrete floor, minimal equipment, industrial-modern interior. Cool blue morning light mixing with warm overhead spots. Deep shadows, high contrast. Athletic, serious, not flashy. Shot at f/2.8, shallow focus on the weight rack.`
- **Filename:** `public/images/social/gym-header.webp`

#### 5.2 Chess Category Header
- **Dimensions:** 1200x300
- **Type:** Photo-realistic
- **Prompt:** `Close-up of a chess board mid-game in a European cafe setting. Carved wooden pieces, one knight in sharp focus. Background: blurred warm cafe interior with a coffee cup and someone's hand hovering over the board. Amber table lamp light, dark wood surfaces. Intellectual tension. Shot at f/1.4, razor-thin depth of field. Desaturated, warm tones, grain. Old-world cafe atmosphere. Moody, contemplative.`
- **Filename:** `public/images/social/chess-header.webp`

#### 5.3 AI/Tech Meetup Category Header
- **Dimensions:** 1200x300
- **Type:** Photo-realistic
- **Prompt:** `A tech meetup at Impact Hub Zurich: a speaker presenting in front of a projection screen showing code or neural network visualizations. Audience silhouettes in foreground, laptop screens glowing blue-white. Modern industrial coworking space, exposed brick, hanging Edison bulbs. The screen's blue-white light washes over the speaker. Atmospheric, knowledge-sharing energy. Shot at f/2, shallow depth. Cool dominant with warm accent bulbs. Slight grain, desaturated.`
- **Filename:** `public/images/social/ai-meetup-header.webp`

#### 5.4 Swimming Category Header
- **Dimensions:** 1200x300
- **Type:** Photo-realistic
- **Prompt:** `Badi (public lake swimming area) in Zurich at golden hour. Wooden jetty extending into Lake Zurich, calm turquoise-blue water. A lone swimmer doing laps in a marked lane, their wake catching gold light. Mountains in soft haze beyond. Traditional Zurich Badi architecture: white-painted wooden changing cabins. Serene, meditative. Shot at f/5.6, medium focal length. Desaturated, teal water dominant, warm golden light on wood surfaces. Swiss precision meets natural beauty.`
- **Filename:** `public/images/social/swimming-header.webp`

#### 5.5 Food/Restaurant Category Header
- **Dimensions:** 1200x300
- **Type:** Photo-realistic
- **Prompt:** `A long communal table in a Zurich restaurant, shot from table level. Beautifully plated dishes, wine glasses, and candles create warm pools of light along dark wood surface. Depth of field falls off sharply: sharp foreground plate, blurred table stretching into distance. Multiple cuisines visible (Swiss, Asian, Mediterranean). Warm tungsten glow, dark moody atmosphere. Food editorial photography. Shot at f/2. Desaturated, amber-dominant, lifted blacks.`
- **Filename:** `public/images/social/food-header.webp`

#### 5.6 Social/Community Category Header
- **Dimensions:** 1200x300
- **Type:** Photo-realistic
- **Prompt:** `Evening gathering at Frau Gerolds Garten in Zurich Kreis 5. Shipping container architecture, string lights overhead creating warm bokeh. Diverse group of people at communal tables, animated conversation. Urban garden setting with green plants. Summer evening light mixing with string lights. Shot from slightly above, f/2.8. Festive but not chaotic. Desaturated, warm amber dominant, cool blue twilight sky above. Documentary style, candid energy.`
- **Filename:** `public/images/social/social-header.webp`

#### 5.7 Coworking Category Header
- **Dimensions:** 1200x300
- **Type:** Photo-realistic
- **Prompt:** `Interior of a Swiss coworking space at night. A single person working at a clean desk with a large monitor, seen from behind. Floor-to-ceiling windows show Zurich city lights. Minimal Scandinavian furniture, concrete walls, one plant. The monitor casts blue-white light on the person's silhouette. Empty desks around them. Late-night focus energy. Shot at f/2. Cool dominant, warm desk lamp as accent. Desaturated, grain, contemplative solitude.`
- **Filename:** `public/images/social/coworking-header.webp`

---

### 6. WEATHER PAGE (`src/app/weather/page.tsx`)

#### 6.1 Zurich Weather Hero — Clear Day
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Panoramic view of Lake Zurich on a crystal-clear day from Uetliberg mountain. The entire city spread below, lake stretching to the Alps which are razor-sharp on the horizon. Deep blue sky, small white clouds. Sailboats as white dots on the lake. The air itself feels crisp and clean. Shot on medium format, f/11, deep focus. Desaturated by 20%, cool blue dominant, white highlights preserved. Swiss tourism board quality but moodier.`
- **Filename:** `public/images/weather/zurich-clear.webp`

#### 6.2 Zurich Weather — Overcast/Fog
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Zurich Nebelmeer (sea of fog) from above. Church spires and rooftops poke through thick white fog layer. Above the fog: golden sunrise, blue sky. Below: the city completely hidden in dense mist. Dramatic atmospheric phenomenon. Shot from elevated position, f/8. Ethereal, otherworldly. Desaturated, silver-gold-blue palette. Long exposure feel. Atmospheric perspective creates natural depth.`
- **Filename:** `public/images/weather/zurich-fog.webp`

#### 6.3 Vienna Weather Accent
- **Dimensions:** 720x480
- **Type:** Photo-realistic
- **Prompt:** `Vienna's Stephansdom cathedral spire emerging through morning fog, seen from a distance across Danube canal. Soft, diffused light. Bare winter trees in foreground frame the composition. Muted color palette: grays, soft lavenders, pale gold from weak winter sun. Nostalgic, European, historic. Shot at f/4, medium telephoto compression. Desaturated, cool dominant, painterly quality. A city left behind but still loved.`
- **Filename:** `public/images/weather/vienna-mood.webp`

#### 6.4 Seasonal Guide Images (4 images)
- **Dimensions:** 400x300 each
- **Type:** Photo-realistic

**Spring:**
- **Prompt:** `Cherry blossoms along Zurich's Limmatquai in April. Pink petals against dark medieval buildings, bright green new leaves. Tram passing through a tunnel of blossoms. Fresh, bright, optimistic. Shot at f/2.8, shallow depth. Desaturated by 15%, pink-green dominant, cool shadows.`
- **Filename:** `public/images/weather/season-spring.webp`

**Summer:**
- **Prompt:** `Packed Zurich Badi on a hot summer day. Turquoise lake water, wooden decks with sunbathers, diving platforms. Alps visible in heat haze. Golden hour evening light. Joy, freedom, warmth. Shot at f/5.6. Desaturated, teal-gold dominant, vintage summer feeling.`
- **Filename:** `public/images/weather/season-summer.webp`

**Autumn:**
- **Prompt:** `Zurichberg forest in autumn. Golden-orange beech trees, misty path, single person walking away from camera. Soft diffused light filtering through canopy. Fallen leaves on wet path. Melancholic beauty. Shot at f/2.8, shallow depth. Desaturated, amber-green-gray palette, lifted blacks, grain.`
- **Filename:** `public/images/weather/season-autumn.webp`

**Winter:**
- **Prompt:** `Zurich Bahnhofstrasse Christmas market at night. Twinkling lights overhead forming a canopy, warm-lit market stalls, light snow falling. Shoppers as blurred silhouettes. Grossmunster visible in background against dark sky. Festive warmth against winter cold. Shot at f/1.8, shallow depth, bokeh lights. Desaturated, warm amber dominant, cool blue shadows, magical but not saccharine.`
- **Filename:** `public/images/weather/season-winter.webp`

---

### 7. BUDGET PAGE (`src/app/budget/page.tsx`)

#### 7.1 Budget Page Accent Background
- **Placement:** Subtle background behind the surplus display hero card
- **Dimensions:** 800x400
- **Type:** Abstract
- **Prompt:** `Abstract data visualization art: flowing lines representing financial data streams on a deep navy background (#0f172a). Thin luminous lines in electric blue (#3b82f6), emerald green (#22c55e), and amber (#f59e0b) flow horizontally like a Bloomberg terminal turned into art. Lines have varying opacity and thickness, some crossing, creating a sense of financial flow and balance. Minimal, precise, mathematical beauty. No text, no numbers, pure abstract data art.`
- **Filename:** `public/images/budget/accent-dataflow.webp`

#### 7.2 Lifestyle Cost Context Image
- **Placement:** Potential accent for the "What If" cards section
- **Dimensions:** 400x300
- **Type:** Photo-realistic
- **Prompt:** `A Zurich tram stop at dusk, shot from street level. Digital fare display shows SBB pricing. Rain-wet platform reflects blue and amber lights. A person checking their phone under a modern glass shelter. Swiss precision infrastructure. The everyday cost of Swiss life made tangible. Shot at f/2.8. Desaturated, cool dominant, warm screen light as accent. Documentary realism.`
- **Filename:** `public/images/budget/zurich-transit-cost.webp`

---

### 8. CHECKLIST PAGE (`src/app/checklist/page.tsx`)

#### 8.1 Checklist Hero / Progress Header
- **Placement:** Above the phase timeline bar
- **Dimensions:** 1440x300
- **Type:** Photo-realistic
- **Prompt:** `Neatly organized moving boxes and a partially packed suitcase in a bright room with large windows overlooking a city (Vienna). Late afternoon side light creating long shadows from the boxes. A checklist on a clipboard sits on top of one box, pen beside it. Organized chaos of a planned departure. A few items carefully laid out: passport, Swiss documents, a small framed photo face-down. Bittersweet, methodical. Shot at f/4. Desaturated, warm-cool contrast, documentary intimacy.`
- **Filename:** `public/images/checklist/hero-packing.webp`

#### 8.2 Phase Milestone Images (4 images)
- **Dimensions:** 300x200 each
- **Type:** Abstract / illustration

**March-April (Research Phase):**
- **Prompt:** `Minimal abstract composition: a magnifying glass icon shape formed by thin luminous blue (#3b82f6) lines on deep navy background. Concentric circles emanating from it like sonar. Clean, geometric, data-search feel. Subtle gradient glow. Dark, technical, precise.`
- **Filename:** `public/images/checklist/phase-research.webp`

**May (Preparation Phase):**
- **Prompt:** `Minimal abstract composition: interlocking gear shapes formed by thin luminous amber (#f59e0b) lines on deep navy background. Gears turning, progress in motion. Mechanical precision. Subtle glow at connection points. Dark, technical, purposeful.`
- **Filename:** `public/images/checklist/phase-prepare.webp`

**June (Execution Phase):**
- **Prompt:** `Minimal abstract composition: an arrow shape accelerating rightward, formed by thin luminous orange (#f97316) lines on deep navy background. Speed lines trailing behind. Dynamic, forward momentum. Subtle particle trail effect. Dark, energetic, decisive.`
- **Filename:** `public/images/checklist/phase-execute.webp`

**July (Arrival Phase):**
- **Prompt:** `Minimal abstract composition: a location pin shape formed by thin luminous green (#22c55e) lines on deep navy background. Radiating circles beneath like a beacon. Arrival, destination reached. Celebratory glow. Dark, triumphant, complete.`
- **Filename:** `public/images/checklist/phase-arrive.webp`

---

## Image Inventory Summary

| # | Image | Page | Dimensions | Type | Filename |
|---|-------|------|-----------|------|----------|
| 1 | Dashboard Hero | Dashboard | 1920x400 | Photo | dashboard/hero-zurich-twilight.webp |
| 2 | Mission Accent | Dashboard | 400x300 | Abstract | dashboard/mission-accent.webp |
| 3 | Enge | Neighborhoods | 720x480 | Photo | neighborhoods/enge.webp |
| 4 | Wiedikon | Neighborhoods | 720x480 | Photo | neighborhoods/wiedikon.webp |
| 5 | Seefeld | Neighborhoods | 720x480 | Photo | neighborhoods/seefeld.webp |
| 6 | Aussersihl | Neighborhoods | 720x480 | Photo | neighborhoods/aussersihl.webp |
| 7 | Wipkingen | Neighborhoods | 720x480 | Photo | neighborhoods/wipkingen.webp |
| 8 | Hottingen | Neighborhoods | 720x480 | Photo | neighborhoods/hottingen.webp |
| 9 | Oerlikon | Neighborhoods | 720x480 | Photo | neighborhoods/oerlikon.webp |
| 10 | Wollishofen | Neighborhoods | 720x480 | Photo | neighborhoods/wollishofen.webp |
| 11 | City/Altstadt | Neighborhoods | 720x480 | Photo | neighborhoods/city.webp |
| 12 | Hard/Escher-Wyss | Neighborhoods | 720x480 | Photo | neighborhoods/hard.webp |
| 13 | Apartments Hero | Apartments | 1440x400 | Photo | apartments/hero-interior.webp |
| 14 | Building Placeholder | Apartments | 200x150 | Illustration | apartments/placeholder-building.webp |
| 15 | Katie Hero | Katie | 1440x350 | Photo | katie/hero-station.webp |
| 16 | Vienna-Zurich Rail | Katie | 400x300 | Photo | katie/vienna-zurich-rail.webp |
| 17 | Activity Together | Katie | 400x400 | Photo | katie/activity-together.webp |
| 18 | Gym Header | Social | 1200x300 | Photo | social/gym-header.webp |
| 19 | Chess Header | Social | 1200x300 | Photo | social/chess-header.webp |
| 20 | AI Meetup Header | Social | 1200x300 | Photo | social/ai-meetup-header.webp |
| 21 | Swimming Header | Social | 1200x300 | Photo | social/swimming-header.webp |
| 22 | Food Header | Social | 1200x300 | Photo | social/food-header.webp |
| 23 | Social Header | Social | 1200x300 | Photo | social/social-header.webp |
| 24 | Coworking Header | Social | 1200x300 | Photo | social/coworking-header.webp |
| 25 | Zurich Clear | Weather | 720x480 | Photo | weather/zurich-clear.webp |
| 26 | Zurich Fog | Weather | 720x480 | Photo | weather/zurich-fog.webp |
| 27 | Vienna Mood | Weather | 720x480 | Photo | weather/vienna-mood.webp |
| 28 | Season Spring | Weather | 400x300 | Photo | weather/season-spring.webp |
| 29 | Season Summer | Weather | 400x300 | Photo | weather/season-summer.webp |
| 30 | Season Autumn | Weather | 400x300 | Photo | weather/season-autumn.webp |
| 31 | Season Winter | Weather | 400x300 | Photo | weather/season-winter.webp |
| 32 | Budget Dataflow | Budget | 800x400 | Abstract | budget/accent-dataflow.webp |
| 33 | Transit Cost | Budget | 400x300 | Photo | budget/zurich-transit-cost.webp |
| 34 | Checklist Hero | Checklist | 1440x300 | Photo | checklist/hero-packing.webp |
| 35 | Phase Research | Checklist | 300x200 | Abstract | checklist/phase-research.webp |
| 36 | Phase Prepare | Checklist | 300x200 | Abstract | checklist/phase-prepare.webp |
| 37 | Phase Execute | Checklist | 300x200 | Abstract | checklist/phase-execute.webp |
| 38 | Phase Arrive | Checklist | 300x200 | Abstract | checklist/phase-arrive.webp |

**Total: 38 images**

---

## Implementation Approach

### 1. Folder Structure

```
public/
  images/
    dashboard/
      hero-zurich-twilight.webp
      mission-accent.webp
    neighborhoods/
      enge.webp
      wiedikon.webp
      seefeld.webp
      aussersihl.webp
      wipkingen.webp
      hottingen.webp
      oerlikon.webp
      wollishofen.webp
      city.webp
      hard.webp
    apartments/
      hero-interior.webp
      placeholder-building.webp
    katie/
      hero-station.webp
      vienna-zurich-rail.webp
      activity-together.webp
    social/
      gym-header.webp
      chess-header.webp
      ai-meetup-header.webp
      swimming-header.webp
      food-header.webp
      social-header.webp
      coworking-header.webp
    weather/
      zurich-clear.webp
      zurich-fog.webp
      vienna-mood.webp
      season-spring.webp
      season-summer.webp
      season-autumn.webp
      season-winter.webp
    budget/
      accent-dataflow.webp
      zurich-transit-cost.webp
    checklist/
      hero-packing.webp
      phase-research.webp
      phase-prepare.webp
      phase-execute.webp
      phase-arrive.webp
```

### 2. Image Optimization with next/image

All images should use the Next.js `<Image>` component for automatic optimization:

```tsx
import Image from "next/image";

// Hero banner pattern (used in dashboard, apartments, katie, checklist)
function HeroBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1440px"
        priority // for above-the-fold heroes
        quality={85}
      />
      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
    </div>
  );
}

// Neighborhood card image pattern
function NeighborhoodImage({ id, name }: { id: string; name: string }) {
  return (
    <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
      <Image
        src={`/images/neighborhoods/${id}.webp`}
        alt={`${name} neighborhood in Zurich`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 720px"
        loading="lazy"
        quality={80}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
    </div>
  );
}

// Category header pattern (used in social page)
function CategoryHeader({ type, label }: { type: string; label: string }) {
  return (
    <div className="relative w-full h-[120px] md:h-[150px] rounded-xl overflow-hidden mb-4">
      <Image
        src={`/images/social/${type}-header.webp`}
        alt={`${label} venues in Zurich`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
        loading="lazy"
        quality={80}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/50 to-transparent" />
      <div className="absolute inset-0 flex items-center p-6">
        <h2 className="font-display text-xl font-bold text-text-primary">
          {label}
        </h2>
      </div>
    </div>
  );
}
```

### 3. CSS Overlay Patterns

Create reusable overlay utility classes in `globals.css`:

```css
/* Image overlay gradients for text-over-image legibility */
.img-overlay-bottom {
  background: linear-gradient(
    to top,
    var(--bg-primary) 0%,
    color-mix(in srgb, var(--bg-primary) 80%, transparent) 30%,
    transparent 70%
  );
}

.img-overlay-full {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--bg-primary) 70%, transparent) 0%,
    color-mix(in srgb, var(--bg-primary) 40%, transparent) 50%,
    color-mix(in srgb, var(--bg-primary) 90%, transparent) 100%
  );
}

.img-overlay-left {
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--bg-primary) 95%, transparent) 0%,
    color-mix(in srgb, var(--bg-primary) 60%, transparent) 40%,
    transparent 70%
  );
}

.img-overlay-vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    color-mix(in srgb, var(--bg-primary) 40%, transparent) 70%,
    var(--bg-primary) 100%
  );
}
```

### 4. Loading States

Use the existing skeleton shimmer pattern from globals.css for image loading:

```tsx
// Image with skeleton loading state
function LoadableImage({
  src, alt, fill, className, sizes, priority, quality
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
```

### 5. Responsive Image Sizing

The `sizes` attribute is critical for serving correctly-sized images:

| Context | sizes Value |
|---------|-------------|
| Full-width hero | `100vw` |
| Neighborhood card (in grid) | `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 720px` |
| Category header | `(max-width: 768px) 100vw, 1200px` |
| Weather card (in 2-col grid) | `(max-width: 768px) 100vw, 50vw` |
| Season thumbnail (in 4-col grid) | `(max-width: 768px) 50vw, 25vw` |
| Apartment placeholder | `200px` |
| Small accent images | `400px` |

---

## Integration Points: Component Modifications

### Dashboard (`src/app/page.tsx`)
- **Add:** Hero banner image behind the top 4 stat cards. Wrap the hero row `<div className="grid grid-cols-1 ...">` in a `<div className="relative">` with the image absolutely positioned behind it and an overlay gradient on top.
- **Add:** Background accent on the Quick Profile card (mission-accent.webp at opacity 0.15).

### Neighborhood Card (`src/components/neighborhoods/neighborhood-card.tsx`)
- **Add:** Image band at the top of the expanded view. In the `{isExpanded && ...}` block, add a neighborhood image before the description paragraph. The `NeighborhoodData` type in `src/lib/data/neighborhoods.ts` already has `id` which maps to the filename.
- **CSS:** The image container gets `relative w-full h-[200px] rounded-lg overflow-hidden` with `img-overlay-bottom` div on top.

### Katie Page (`src/app/katie/page.tsx`)
- **Add:** Full-width hero banner behind the page header. Wrap the header `<div>` in a relative container with the station image behind it.
- **Consider:** Adding the train image as an accent inside the cost breakdown sidebar card.

### Social Page (`src/app/social/page.tsx`)
- **Add:** Category headers when filtering by type. When `activeFilter !== "all"`, show the category-specific header image above the venue grid. When filter is "all", show no category header (the grid is already grouped by neighborhood).
- **Alternative:** Always show a small image accent in each category group header regardless of filter state.

### Weather Page (`src/app/weather/page.tsx`)
- **Add:** Background image behind the Zurich current weather card (zurich-clear.webp or zurich-fog.webp based on condition). The card already has a structure that supports it -- add the image with a strong overlay behind the temperature and condition display.
- **Add:** Vienna mood image behind the Vienna weather card.
- **Add:** Season images inside each seasonal note card in the "Zurich Seasonal Guide" section. Each `<div>` in the grid gets a small image at the top.

### Budget Page (`src/app/budget/page.tsx`)
- **Add:** Subtle abstract dataflow background behind the surplus display hero card. Position absolutely at low opacity (0.1-0.15).
- **Consider:** Transit cost image as an accent in the What-If Cards section.

### Checklist Page (`src/app/checklist/page.tsx`)
- **Add:** Hero banner behind the header and progress ring area.
- **Add:** Phase icons/images next to each phase header in the timeline. The abstract phase illustrations are small (300x200) and can sit beside the phase title.

### Apartments Page (`src/app/apartments/page.tsx`)
- **Add:** Hero image behind the page header.
- **Add:** Placeholder building illustration on each apartment card's left edge (future: replace with actual listing photos). Modify the apartment card layout from single-column text to a left-image + right-content split.

---

## Generation Priority Order

Generate images in this order based on visual impact per effort:

1. **10 Neighborhood images** -- highest ROI, these transform the most-used page
2. **Dashboard hero** -- the first thing users see
3. **Katie hero** -- emotional anchor of the app
4. **7 Social category headers** -- transforms the social page from a list to an experience
5. **4 Weather seasonal images** + 3 weather backgrounds
6. **Checklist hero** + 4 phase abstracts
7. **Budget abstracts**
8. **Apartments hero** + placeholder

---

## Next.js Configuration Note

Ensure `next.config.ts` has image optimization configured for local files:

```ts
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [375, 640, 768, 1024, 1200, 1440, 1920],
    imageSizes: [200, 300, 400, 480, 720],
  },
};
```

All images served from `/public/images/` will be automatically optimized by Next.js `<Image>` component -- no external loader configuration needed.
