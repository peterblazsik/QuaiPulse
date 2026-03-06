# Zurich Life Navigator — Claude Code Project Brief

## Who I Am (Context for Personalization)

I'm Peter, 49, Hungarian-born, Austrian-based. I just accepted a role as Finance AI & Innovation Lead at Zurich Insurance Group, starting July 1, 2026. I'll be working at the Quai Zurich Campus at Mythenquai (Kreis 2), expected on-site 3-4 days/week.

I'm moving from Amsterdam (deregistering by June 30, 2026) and will maintain my Vienna apartment (Ettingshausengasse, 1190 Wien) where my 9-year-old daughter Katie lives. I'll be arriving in Zurich essentially alone, rebuilding my social life from scratch.

**Key personal constraints:**
- Bilateral meniscus damage + torn ACL left knee. Cannot run. Need gym with machines, cycling, swimming, group strength classes. Gym proximity is a top priority.
- I have a high-protein diet but spend around CHF 1,000/month on food (I eat too much bread, working on it).
- I play chess (decent, not great), make AI-generated music, and I'm deeply embedded in the AI/ML community.
- I speak English and Hungarian natively, understand German well but not fluently.
- I want to build a real social circle. This is my #1 life priority after Katie.
- Sleep is a chronic issue. Apartment should support good sleep (quiet street, good blinds situation).

**Financial picture:**
- CHF 200,000 base salary + 20% STI target (CHF 40k, pro-rata year 1)
- CHF 8,400/year expense allowance (net)
- Estimated net monthly take-home: ~CHF 12,150 (salary + expense allowance)
- Fixed monthly outflows outside Zurich: ~CHF 2,760 (Vienna rent share CHF 1,450 + child support CHF 915 + Vienna utilities/insurance/car club ~CHF 400)
- Target Zurich rent: CHF 2,000-2,800 for a 1-2 bedroom
- No car in Zurich. Public transport + flights to Vienna.

---

## What to Build

A full-stack web application called **"Zurich Life Navigator"** that helps me find the right neighborhood and apartment in Zurich, personalized to my specific profile. This is NOT a generic apartment finder. It's a decision-support tool built around one person's actual life situation.

**Tech stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui components. SQLite (via better-sqlite3 or Drizzle) for local data persistence. Deploy-ready for Vercel.

---

## Architecture

```
zurich-life-navigator/
├── app/
│   ├── layout.tsx                 # Root layout, fonts, metadata
│   ├── page.tsx                   # Dashboard / home
│   ├── neighborhoods/
│   │   ├── page.tsx               # Neighborhood ranking & comparison
│   │   └── [id]/page.tsx          # Individual neighborhood deep-dive
│   ├── budget/
│   │   └── page.tsx               # Interactive budget simulator
│   ├── listings/
│   │   └── page.tsx               # Apartment listings aggregator
│   ├── katie/
│   │   └── page.tsx               # Vienna visit planner
│   ├── social/
│   │   └── page.tsx               # Social infrastructure map
│   └── checklist/
│       └── page.tsx               # Move checklist & dossier prep
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── layout/
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   └── Header.tsx             # Top bar with context
│   ├── neighborhoods/
│   │   ├── NeighborhoodCard.tsx   # Summary card for ranking view
│   │   ├── RadarChart.tsx         # Priority radar visualization
│   │   ├── PrioritySliders.tsx    # Adjustable weight controls
│   │   └── ComparisonTable.tsx    # Side-by-side neighborhood comparison
│   ├── budget/
│   │   ├── BudgetBar.tsx          # Stacked income/expense bar
│   │   ├── ScenarioToggle.tsx     # What-if toggles
│   │   └── SavingsProjection.tsx  # 12-month savings forecast
│   ├── listings/
│   │   ├── ListingCard.tsx        # Individual apartment listing
│   │   ├── ListingFilters.tsx     # Filter controls
│   │   └── ListingMap.tsx         # Map view of listings
│   ├── katie/
│   │   ├── FlightCalendar.tsx     # Visit schedule visualization
│   │   └── CostPerVisit.tsx       # Flight + transport cost calc
│   └── social/
│       ├── VenueCard.tsx          # Gym, club, meetup card
│       └── SocialMap.tsx          # Map of social infrastructure
├── lib/
│   ├── data/
│   │   ├── neighborhoods.ts       # All neighborhood data & scores
│   │   ├── venues.ts              # Gyms, chess clubs, running clubs, AI meetups
│   │   ├── profile.ts             # My profile, priorities, constraints
│   │   └── budget.ts              # Income, fixed costs, variable costs
│   ├── scoring.ts                 # Neighborhood scoring algorithm
│   ├── budget-calculator.ts       # Budget computation engine
│   └── utils.ts                   # Currency conversion, formatting helpers
├── public/
│   └── zurich-districts.geojson   # District boundaries (optional, for map)
└── drizzle/ (or prisma/)
    └── schema.ts                  # For persisting user adjustments, saved listings
```

---

## Feature Specifications

### 1. Dashboard (Home Page)
The landing page shows:
- My profile summary (name, role, company, start date, key constraints)
- Top 3 recommended neighborhoods with scores
- Monthly budget snapshot (income vs. projected expenses, surplus)
- Next actions checklist (apartment search status, documents needed, deadlines)
- Days until July 1 countdown

### 2. Neighborhood Intelligence (Core Feature)

**Data model per neighborhood:**
```typescript
interface Neighborhood {
  id: string;
  name: string;
  kreis: number;
  description: string;          // 2-3 sentence overview
  vibe: string;                 // Personality description, analogies to cities I know
  lat: number;
  lng: number;
  
  // Scores (1-10)
  scores: {
    commute: number;            // Time to Quai Zurich Campus, Mythenquai
    gym: number;                // Quality and proximity of gyms (machines, group classes)
    social: number;             // Density of social venues, expat-friendliness, community
    lake: number;               // Lake/water access for swimming
    airport: number;            // Ease of getting to ZRH for Vienna flights
    food: number;               // Restaurant and grocery quality
    quiet: number;              // Sleep-friendliness, noise levels at night
    transit: number;            // Overall public transport connectivity
  };
  
  // Score explanations
  notes: {
    commute: string;
    gym: string;
    social: string;
    lake: string;
    airport: string;
    food: string;
    quiet: string;
    transit: string;
  };
  
  // Rent ranges in CHF
  rent: {
    studio: [number, number];
    oneBr: [number, number];
    twoBr: [number, number];
  };
  
  // Key venues
  gyms: Venue[];
  restaurants: Venue[];
  socialSpots: Venue[];
}
```

**Neighborhoods to include (with realistic data):**
1. Enge (Kreis 2) — lakefront, walking distance to campus
2. Wollishofen (Kreis 2) — further south, more affordable lakefront
3. Wiedikon (Kreis 3) — foodie district, Idaplatz, social hub
4. Aussersihl / Langstrasse (Kreis 4) — diverse, nightlife, most international
5. Zürich West / Industriequartier (Kreis 5) — tech/creative, BLG Sports, lofts
6. Unterstrass / Oberstrass (Kreis 6) — academic, ETH area, chess clubs
7. Seefeld / Riesbach (Kreis 8) — right bank lakefront, expat-heavy, polished
8. Altstetten (Kreis 9) — affordable, good transport, less character
9. Wipkingen (Kreis 10) — up-and-coming, riverside, young professionals
10. Oerlikon (Kreis 11) — near airport, modern, corporate

**Interactive priority system:**
- Sliders for each dimension (0-10 weight)
- Pre-loaded with my defaults: gym=10, social=10, commute=9, food=8, airport=7, quiet=7, lake=6, transit=6
- Real-time re-ranking as sliders move
- Weighted score = sum(dimension_score * weight) / sum(weights)

**Comparison mode:** Select 2-3 neighborhoods for side-by-side radar chart comparison.

**Deep-dive page per neighborhood:**
- Full radar chart
- Budget simulation (what does my monthly budget look like if I live here?)
- Nearby venues map (gyms, restaurants, social spots)
- Pros/cons written in my voice (direct, honest, no fluff)
- Links to search on homegate.ch, flatfox.ch, immoscout24.ch pre-filtered to this area

### 3. Budget Simulator

**Income section (monthly CHF):**
- Net salary: ~11,450
- Expense allowance: 700
- Total: ~12,150

**Fixed costs outside Zurich:**
- Vienna rent (my share): 1,450
- Child support: 915
- Vienna utilities/internet/mobile: 220
- Car insurance + ÖAMTC (amortized): 175
- Total: ~2,760

**Zurich variable costs (adjustable sliders):**
- Rent: slider from 1,500 to 3,500 (default: 2,400)
- Health insurance: slider from 280 to 500 (default: 350)
- Food & dining: slider from 600 to 1,500 (default: 1,075)
- Transport (ZVV): 85 (fixed)
- Gym membership: slider from 60 to 200 (default: 100)
- Electricity/utilities: slider from 80 to 200 (default: 120)
- Internet + mobile: slider from 80 to 180 (default: 110)
- Zurich-Vienna flights: slider from 300 to 700 (default: 450, based on 2 return trips/month)
- Subscriptions: slider from 100 to 400 (default: 200)
- Misc/unexpected: slider from 100 to 500 (default: 200)

**Outputs:**
- Monthly surplus/deficit with big clear number
- Annual savings projection
- Savings rate percentage
- Stacked bar chart showing expense categories vs. income
- "What-if" toggles: "What if Katie visits 3x/month instead of 2?", "What if I get a 2BR for Katie visits?", "What if I eat out less?"
- Comparison to current Amsterdam/Vienna dual-life costs (show the improvement)

### 4. Apartment Listings Aggregator

**For MVP:** Curated links to search portals pre-filtered:
- homegate.ch — largest Swiss portal
- flatfox.ch — modern, has API
- immoscout24.ch — wide selection
- ronorp.net — community listings, sometimes hidden gems

Each link pre-filtered to: Zurich, 1-2 rooms, CHF 1,800-2,800, specific Kreis numbers based on my top-ranked neighborhoods.

**For V2 (stretch goal):** If flatfox.ch API is accessible, pull actual listings and display them with:
- Price, size, rooms, address
- Neighborhood score overlay
- Commute time to Mythenquai
- "Budget impact" — what happens to my monthly surplus if I take this apartment

### 5. Katie Visit Planner

**Calendar view** showing:
- Optimal visit pattern (every 2-3 weeks, based on 35 days leave + weekends)
- Flight cost estimates per visit (~CHF 200-250 return if booked in advance)
- Annual visit cost projection
- Train alternative: Zurich HB to Wien Hbf, ~7.5 hours, CHF 80-120 with half-fare card (nice for scenic trips with Katie)
- Key dates: Katie's birthday (Jan 17), school holidays, my leave allocation

**Inputs:**
- Visits per month: adjustable (default: 2)
- Average flight cost: adjustable (default: CHF 225)
- Preferred days: Friday evening departure, Sunday evening return
- SBB Half-Fare card: yes/no toggle (CHF 185/year, cuts train costs 50%)

### 6. Social Infrastructure Map

An interactive map showing:
- **Gyms:** BLG Sports, John Reed, Indigo Fitness, Activ Fitness Central, Holmes Place, CrossFit Zurich
- **Chess:** ASK Réti (Thursday evenings), Savoy Chess Corner, Schachgesellschaft Zürich, Club Nimzowitsch
- **Running clubs (for reference/social even if I can't run):** IRC ZRH, Hash House Harriers, On Run Club
- **AI/Tech meetups:** Zürich AI Meetup, ZurichAI (ETH), Global AI Zürich, GenAI Zürich, Swiss Data & AI Meetup
- **Cycling groups:** (to research — my Peloton base transfers to road cycling, which is knee-friendly)
- **Swimming:** Seebad Enge, Strandbad Wollishofen, Obere/Untere Letten (Limmat), Strandbad Tiefenbrunnen
- **Social platforms:** Glocals.com, Meetup groups, City Mates, Social Circle Zürich
- **Expat hubs:** Impact Hub Zurich (co-working + events)

Each venue has: name, type, address, lat/lng, opening hours (if known), website, and a personal note about why it's relevant to me.

Map should show my office (Quai Zurich Campus, Mythenquai) as the anchor point, with distance/time overlays.

### 7. Move Checklist & Dossier Preparation

**Timeline (working backwards from July 1):**

March-April 2026:
- [ ] Start apartment search on homegate.ch, flatfox.ch
- [ ] Prepare Swiss rental dossier (extract from debt register, pay slips, employment contract, reference letters)
- [ ] Research health insurance options (compare on priminfo.ch and comparis.ch)
- [ ] Set up SBB Half-Fare card purchase
- [ ] Notify ING of resignation timeline
- [ ] Begin Amsterdam apartment lease termination process

May 2026:
- [ ] Finalize apartment (sign lease)
- [ ] Choose health insurance provider
- [ ] Book furniture allowance or moving container (CHF 7,500 net allowance or 20ft container)
- [ ] Start packing / selling Amsterdam furniture
- [ ] Cancel NL subscriptions: ONVZ, ziggo, electricity NL

June 2026:
- [ ] Deregister from Amsterdam (Graafschapstraat) by June 30
- [ ] Wrap up 30% ruling in NL
- [ ] Final utility settlements Amsterdam
- [ ] Redirect mail
- [ ] ING final day / handover complete

July 2026:
- [ ] Arrive Zurich, move into temporary housing (1 month provided by Zurich Insurance)
- [ ] Register with local authorities (Kreisbüro) — mandatory within 14 days
- [ ] Activate health insurance
- [ ] Open Swiss bank account (UBS, ZKB, or Swissquote)
- [ ] Register for Pillar 3a (max CHF 7,258/year tax shelter)
- [ ] Get ZVV transport pass (use FlexOptions CHF 800 budget for BonusPass)
- [ ] Join gym
- [ ] Register on Glocals.com (profile already started)
- [ ] Attend first AI meetup
- [ ] First Katie visit

**Swiss rental dossier generator:**
Checklist of required documents with status tracking:
- [ ] Employment contract (Zurich Insurance offer letter)
- [ ] Last 3 pay slips (from ING, will need to explain transition)
- [ ] Extract from debt register (Betreibungsregisterauszug — get from Amsterdam municipality before leaving, and/or from Austrian authorities)
- [ ] Valid ID / passport copy
- [ ] Current landlord reference letter
- [ ] Brief personal introduction letter (who you are, why Zurich, stable employment)

---

## Design Direction

**Aesthetic:** Dark mode, monospace-accented, data-dense but clean. Think Bloomberg terminal meets a well-designed personal dashboard. Not startup-cute, not corporate-boring. Functional elegance.

**Color palette:**
- Background: slate-900 to slate-950
- Primary accent: blue-500 (#3b82f6)
- Success/surplus: green-500
- Warning/stretch: amber-500
- Danger/over-budget: red-500
- Text: slate-100 (primary), slate-400 (secondary), slate-600 (tertiary)

**Typography:**
- Headings: Georgia or Playfair Display (serif, for warmth)
- Body/data: JetBrains Mono or Fira Code (monospace, for precision)
- UI labels: system sans-serif

**Key UX principles:**
- Every number should be interactive or contextual (hover for explanation)
- No empty states — always show something useful
- Mobile-responsive (I'll check this on my iPhone)
- Fast. No loading spinners for local data.
- Keyboard navigable (I'm a power user)

---

## Implementation Order

1. **Phase 1:** Project setup, layout, sidebar navigation, neighborhood data, ranking page with sliders and radar charts
2. **Phase 2:** Budget simulator with all sliders and projections
3. **Phase 3:** Dashboard home page pulling from neighborhood + budget data
4. **Phase 4:** Katie visit planner
5. **Phase 5:** Social infrastructure map (Leaflet or Mapbox)
6. **Phase 6:** Move checklist with local persistence
7. **Phase 7:** Listings aggregator (links first, API integration stretch goal)

---

## Final Notes

- This is a real tool for a real move. Don't over-abstract. Hardcode my data where it makes sense.
- Every neighborhood description should be honest and specific, not generic real estate marketing language.
- Budget numbers should use CHF as primary, with EUR equivalent shown in parentheses where helpful (use ~0.93 EUR/CHF rate).
- I'll iterate on this heavily, so keep components modular and data separate from presentation.
- The scoring algorithm should be transparent — I want to see exactly why a neighborhood ranks where it does.
- When in doubt, optimize for information density over whitespace. I'm a data person.

Start with Phase 1 and work through sequentially. Ask me if any data points are unclear.
