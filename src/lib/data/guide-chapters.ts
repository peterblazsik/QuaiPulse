import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Wallet,
  Building2,
  CheckSquare,
  Heart,
  Dumbbell,
  Bot,
  TrendingUp,
  CreditCard,
  ArrowLeftRight,
  ShoppingCart,
  Route,
  Plane,
  Users,
  Moon,
  CloudSun,
  Languages,
  FileText,
  LayoutDashboard,
  Target,
  Shield,
  Sparkles,
} from "lucide-react";

export interface GuideStep {
  title: string;
  description: string;
  detail: string;
  href: string;
  icon: LucideIcon;
  /** What the user should DO on this page */
  action: string;
  /** What output/insight they get */
  outcome: string;
  /** How this connects to the next step */
  leadsTo?: string;
}

export interface GuideChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string; // tailwind color class
  /** The real-world question this chapter answers */
  question: string;
  steps: GuideStep[];
}

export const GUIDE_CHAPTERS: GuideChapter[] = [
  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 1: WHERE SHOULD I LIVE?
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "neighborhood",
    number: 1,
    title: "Where Should I Live?",
    subtitle: "Score & rank every Zurich neighborhood by what matters to you",
    icon: MapPin,
    color: "text-blue-400",
    question: "I'm moving to Zurich. Which neighborhood fits my lifestyle?",
    steps: [
      {
        title: "Set Your Priorities",
        description: "Tell QuaiPulse what matters most: gym access, commute, social life, quiet, lake, cost.",
        detail: "12 weighted dimensions drive the scoring engine. Drag sliders from 0 (don't care) to 10 (critical). Your knee condition makes gym access a 10. Your social needs in a new city make social life a 10. Commute to Mythenquai? Also high. These weights reshape every neighborhood's score in real time.",
        href: "/neighborhoods",
        icon: Target,
        action: "Adjust the priority sliders in the left panel. Use J/K keys to navigate neighborhoods, Enter to expand.",
        outcome: "A personalized ranking of 12+ Zurich neighborhoods and lake towns, scored 0-10 against YOUR priorities.",
        leadsTo: "Your top-ranked neighborhood feeds into apartment search filters and budget assumptions.",
      },
      {
        title: "Deep-Dive Neighborhoods",
        description: "Expand any neighborhood to see radar charts, rent ranges, gym proximity, vibe badges, and commute times.",
        detail: "Each neighborhood card shows a radar chart of its scores across all dimensions. Expand it to see: typical rent ranges, closest gyms (with knee-safety ratings), food scene, social venues, commute time to your office, and Hoodmap vibe tags. Click 'Compare' to put 2-4 neighborhoods side-by-side.",
        href: "/neighborhoods",
        icon: MapPin,
        action: "Click any neighborhood to expand its detail view. Select 2-4 neighborhoods and click 'Compare'.",
        outcome: "Clear understanding of which neighborhoods match your lifestyle and why.",
        leadsTo: "Once you have your top picks, move to Budget to verify you can afford them.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 2: CAN I AFFORD IT?
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "finance",
    number: 2,
    title: "Can I Afford It?",
    subtitle: "Simulate your full Swiss financial picture — gross to net to surplus",
    icon: Wallet,
    color: "text-emerald-400",
    question: "What will my finances actually look like in Switzerland?",
    steps: [
      {
        title: "Income Pipeline",
        description: "Enter gross salary, 13th salary, bonuses, and employer benefits to see your true take-home pay.",
        detail: "Switzerland's income pipeline is complex: gross salary → social deductions (AHV 5.3%, IV, EO, ALV, BVG) → tax → take-home. Add employer benefits like expense allowance, insurance contributions, and mobility allowance. The simulator shows every deduction in real time.",
        href: "/budget",
        icon: Wallet,
        action: "Set your gross monthly salary in the left column. Toggle 13th salary. Adjust employer benefits.",
        outcome: "Exact monthly take-home pay after all Swiss deductions.",
        leadsTo: "Adjust expense sliders on the right to see your monthly surplus.",
      },
      {
        title: "Expense Simulation",
        description: "Drag sliders for rent, health insurance, food, transport, gym — watch your surplus update live.",
        detail: "11 expense categories with realistic Zurich defaults. The rent slider directly affects your surplus and savings rate. Vienna fixed costs (apartment, child support, utilities) are factored in separately. Every slider change recalculates the full picture instantly.",
        href: "/budget",
        icon: ShoppingCart,
        action: "Use the expense sliders in the right column. Try different rent amounts to see impact on surplus.",
        outcome: "Monthly surplus (green = saving, red = deficit) and savings rate percentage.",
        leadsTo: "Your rent budget directly filters which apartments you can afford.",
      },
      {
        title: "Swiss Pension System",
        description: "Understand all three pillars: AHV (state), BVG (employer), and Pillar 3a (private).",
        detail: "The Pension Overview shows your monthly deductions across all three pillars. Expand each one to see: contribution breakdowns, your estimated AHV pension (pro-rata for ~16 Swiss years), BVG buyback potential (massive tax optimization), and Pillar 3a provider comparison. Key insight: as a newcomer, BVG buybacks are limited for 5 years — then the real tax optimization begins.",
        href: "/budget",
        icon: Shield,
        action: "Scroll to the Pension Overview card. Click each pillar header to expand details.",
        outcome: "Understanding of your retirement picture and tax optimization opportunities.",
      },
      {
        title: "Tax Intelligence",
        description: "Compare Quellensteuer vs Ordinary taxation. See which saves more with your deductions.",
        detail: "Above CHF 120K gross, ordinary taxation is mandatory — but you should understand the difference. The Tax Comparison shows both methods side-by-side with editable deductions (BVG buyback, commute, meals, insurance). The BVG Buyback Calculator shows a multi-year strategy for maximum tax savings.",
        href: "/budget",
        icon: TrendingUp,
        action: "Review the Tax Method Comparison card. Click 'Adjust deductions' to model different scenarios.",
        outcome: "Tax-optimized strategy for your Swiss income.",
      },
      {
        title: "Subscription Audit",
        description: "Review your current subscriptions. Decide what to keep, cut, or replace with Swiss alternatives.",
        detail: "Every subscription you currently pay for — streaming, software, telecom, fitness — needs a keep/cut/replace decision. Some services don't work in Switzerland, others have better Swiss alternatives. The module shows monthly cost impact of each decision and Swiss replacement options.",
        href: "/subscriptions",
        icon: CreditCard,
        action: "Go through each subscription. Click Keep, Cut, or Replace. Add any custom subscriptions.",
        outcome: "Monthly subscription cost post-move and a clear action list for what to cancel/switch.",
        leadsTo: "Your subscription total feeds into the budget's expense calculation.",
      },
      {
        title: "Price Intelligence",
        description: "Compare cost of living: Zurich vs Amsterdam vs Vienna across 80+ items.",
        detail: "Side-by-side price comparison for groceries, dining, transport, healthcare, and entertainment. See exactly how much more (or less) things cost in Zurich compared to where you live now. Monthly basket estimates show the real impact on your budget.",
        href: "/prices",
        icon: ShoppingCart,
        action: "Browse categories. Focus on items you buy frequently to calibrate your budget expectations.",
        outcome: "Realistic Zurich cost expectations, not just averages.",
      },
      {
        title: "Currency Monitor",
        description: "Track EUR/CHF exchange rate — critical for your Vienna costs and any EUR-denominated income.",
        detail: "Live exchange rate tracking for EUR/CHF. Since you have fixed EUR costs (Vienna apartment, child support), currency fluctuations directly affect your budget. The module shows historical trends and impact on your monthly costs.",
        href: "/currency",
        icon: ArrowLeftRight,
        action: "Check the current EUR/CHF rate. Understand how it affects your Vienna fixed costs.",
        outcome: "Awareness of currency risk on your dual-country budget.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 3: FIND MY APARTMENT
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "apartment",
    number: 3,
    title: "Find My Apartment",
    subtitle: "Discover, analyze, save, and track apartment listings",
    icon: Building2,
    color: "text-purple-400",
    question: "How do I find the right apartment in Zurich's competitive rental market?",
    steps: [
      {
        title: "Live Apartment Feed",
        description: "Scrape Flatfox for real-time listings matching your criteria. Filter by price, size, Kreis.",
        detail: "The Live Feed tab pulls current apartment listings from Flatfox. Filter by price range, size (m²), number of rooms, and Kreis (district). Sort by newest, price, or size. Dismiss listings you don't like. Save promising ones to your pipeline with one click.",
        href: "/apartments",
        icon: Building2,
        action: "Click 'Refresh' to scrape latest listings. Set your filters. Save interesting apartments.",
        outcome: "A curated feed of apartments matching your budget and neighborhood preferences.",
        leadsTo: "Saved apartments appear in the Pipeline tab for tracking.",
      },
      {
        title: "Market Intelligence",
        description: "Analyze the Zurich rental market: price distributions, supply by Kreis, value scores.",
        detail: "Rental Intel merges data from multiple sources (Homegate + Flatfox) to show: median rent by Kreis, price distribution charts, supply/demand analysis, price heatmap, and value scoring. Each listing gets a 0-100 value score based on price/m², Kreis desirability, commute, and budget fit. Toggle between table and map view.",
        href: "/rental-intel",
        icon: TrendingUp,
        action: "Review the market overview. Check the Value Score table for best deals. Use the map to visualize locations.",
        outcome: "Understanding of which Kreise offer best value and where to focus your search.",
      },
      {
        title: "Application Pipeline",
        description: "Track each apartment through stages: Interested → Contacted → Viewing → Applied → Accepted.",
        detail: "The Pipeline tab in Apartments is your CRM for apartment hunting. Each saved listing has a status (new, interested, contacted, viewing, applied, rejected, accepted), notes, and an interaction log. Add manual listings from other portals. Filter by status to focus on active leads.",
        href: "/apartments?tab=pipeline",
        icon: Building2,
        action: "Review your saved apartments. Update statuses as you contact landlords. Add notes after viewings.",
        outcome: "Organized apartment search with nothing falling through the cracks.",
      },
      {
        title: "Portal Links",
        description: "Quick links to all major Swiss rental portals, pre-filtered for your target Kreise.",
        detail: "Direct links to Homegate, ImmoScout24, Flatfox, and Comparis — pre-filtered for your target Kreise and criteria. One click opens the portal with your filters applied.",
        href: "/apartments?tab=portals",
        icon: Building2,
        action: "Open each portal. Set up alerts on Homegate and ImmoScout24 for your criteria.",
        outcome: "Comprehensive coverage across all Swiss rental platforms.",
      },
      {
        title: "Application Dossier",
        description: "Prepare the rental application documents Swiss landlords require.",
        detail: "Swiss landlords expect a complete Bewerbungsdossier: ID, residence permit confirmation, employer reference letter, salary certificates, Betreibungsregister (debt register extract), and a cover letter. Track each document's status: missing, in progress, obtained, or uploaded. Add notes and URLs for each.",
        href: "/dossier",
        icon: FileText,
        action: "Review the list of required documents. Update statuses as you collect each one.",
        outcome: "A complete, ready-to-submit Bewerbungsdossier that sets you apart from other applicants.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 4: PREPARE THE MOVE
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "prepare",
    number: 4,
    title: "Prepare the Move",
    subtitle: "Checklist, documents, language — everything before July 1",
    icon: CheckSquare,
    color: "text-amber-400",
    question: "What do I need to do before I actually move?",
    steps: [
      {
        title: "Master Checklist",
        description: "78 tasks across 5 phases: March-April, May, June, July, August-September.",
        detail: "Every task needed for your relocation, organized by phase and category. Categories include: apartment search, employment contracts, insurance, banking, registration, tax, moving logistics, and lease termination. Each task has an owner (you, HR, relocation agent), estimated days, dependencies, and hard deadlines. Check off completed items. Add custom tasks.",
        href: "/checklist",
        icon: CheckSquare,
        action: "Review tasks phase by phase. Focus on the current phase. Check off completed items.",
        outcome: "Zero surprises — every administrative and logistical task is tracked.",
        leadsTo: "Deadline alerts notify you of approaching due dates.",
      },
      {
        title: "German Language Prep",
        description: "Learn essential German phrases with spaced-repetition flashcards.",
        detail: "120+ practical German phrases for daily life in Zurich: greetings, office, shopping, dining, transit, social situations, and emergencies. Uses SM-2 spaced repetition algorithm — cards you struggle with appear more often. Track your review streak and mastery progress. You understand German but aren't fluent — this fills the gaps for daily interactions.",
        href: "/language",
        icon: Languages,
        action: "Start a review session. Rate each card 0-5 on how well you knew it. Build a daily streak.",
        outcome: "Functional German for Swiss daily life, reinforced through spaced repetition.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 5: LIFE IN ZURICH
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "life",
    number: 5,
    title: "Life in Zurich",
    subtitle: "Katie visits, gym, social, sleep, weather — your daily life toolkit",
    icon: Heart,
    color: "text-rose-400",
    question: "Once I'm there, how do I manage my life?",
    steps: [
      {
        title: "Katie Visit Planner",
        description: "Plan Katie's visits from Vienna: dates, transport (flight vs train), costs, activities.",
        detail: "Schedule every visit with dates, transport mode, and notes. See upcoming visits on a timeline. Track costs per visit and monthly Katie-related expenses. The planner integrates with your budget's Vienna costs section to give a complete financial picture.",
        href: "/katie",
        icon: Heart,
        action: "Add your planned visits. Choose flight vs train for each. Note special events (school holidays, birthdays).",
        outcome: "A clear visit calendar with cost projections.",
      },
      {
        title: "Travel Intelligence",
        description: "Zurich-Vienna transport options: flight schedules, train routes, costs, and time comparisons.",
        detail: "Side-by-side comparison of flight vs train for the Zurich-Vienna route. Airlines, typical fares, travel times, and booking tips. Integrated with Katie visit planning — each visit can be tagged with transport mode and estimated cost.",
        href: "/travel",
        icon: Route,
        action: "Compare flight vs train options. Check fare calendars for your planned visit dates.",
        outcome: "Optimized travel strategy for regular Vienna trips.",
      },
      {
        title: "Gym Finder",
        description: "Find knee-safe gyms near your neighborhood with the right equipment.",
        detail: "Filter gyms by equipment (leg press, cable cross, smith machine), price range, and knee-safety rating. Compare up to 4 gyms side by side. Each gym card shows equipment list, pricing, opening hours, and distance from your target neighborhood. Critical for your bilateral meniscus + torn ACL — the knee-safety filter highlights gyms with low-impact machine options.",
        href: "/gym-finder",
        icon: Dumbbell,
        action: "Filter for knee-safe gyms. Select equipment you need. Compare top picks.",
        outcome: "A shortlist of gyms that work for your knee condition and location.",
      },
      {
        title: "Social Map",
        description: "Chess clubs, AI meetups, swimming, restaurants — find your tribe in Zurich.",
        detail: "Curated venues organized by type: gyms, chess clubs, AI/ML meetups, swimming pools, restaurants, coworking spaces. Each venue has address, description, and category tags. This is your social infrastructure planning — where you'll build your network in a new city.",
        href: "/social",
        icon: Users,
        action: "Browse by category. Note venues near your target neighborhoods.",
        outcome: "A social game plan for building connections in Zurich.",
      },
      {
        title: "Sleep Intelligence",
        description: "Track sleep quality, supplements, interventions — find what works for your sleep.",
        detail: "Log nightly: hours, quality (1-5), supplements taken, interventions used, bedtime, wake time, awakenings. The analytics engine computes: supplement effectiveness (delta vs baseline), intervention hit rates, combo analysis (which supplements work together), and generates a tonight's protocol recommendation. 14-day and 30-day trend analysis.",
        href: "/sleep",
        icon: Moon,
        action: "Log your sleep each morning. Review the analytics dashboard weekly.",
        outcome: "Data-driven sleep optimization based on YOUR response to supplements and interventions.",
      },
      {
        title: "Weather Dashboard",
        description: "Zurich weather forecast with comparison to Vienna and Amsterdam.",
        detail: "Current conditions and multi-day forecast for Zurich, with comparisons to your origin cities. Useful for planning Katie visits, outdoor activities, and understanding Zurich's climate patterns.",
        href: "/weather",
        icon: CloudSun,
        action: "Check weekly. Compare Zurich weather patterns to what you're used to in Amsterdam.",
        outcome: "Climate awareness for your new city.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 6: AI ASSISTANT
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "ai",
    number: 6,
    title: "Ask Pulse Anything",
    subtitle: "AI assistant with full context of your situation, data, and progress",
    icon: Bot,
    color: "text-cyan-400",
    question: "I need specific advice about my situation — who do I ask?",
    steps: [
      {
        title: "Chat with Pulse",
        description: "AI assistant that knows your profile, budget, neighborhoods, and Swiss systems.",
        detail: "Pulse is powered by Gemini and has full context of your situation: salary, neighborhood scores, budget, priorities, and health constraints. Ask anything — 'What's the best gym in Wiedikon for bad knees?', 'Should I do a BVG buyback in year 1?', 'How much will my AHV pension be?'. Pulse gives direct, data-rich answers, not generic advice. It reads your live store data for personalized responses.",
        href: "/ai",
        icon: Bot,
        action: "Ask specific questions about your relocation. Reference your budget numbers, neighborhood picks, or Swiss systems.",
        outcome: "Personalized, expert-level advice grounded in your actual data.",
      },
    ],
  },
];

export const GUIDE_STORAGE_KEY = "quaipulse-guide-progress";

export interface GuideProgress {
  currentChapter: number;
  completedSteps: string[]; // "chapter-id:step-index"
  dismissed: boolean;
  lastVisited: string; // ISO date
}

export const DEFAULT_GUIDE_PROGRESS: GuideProgress = {
  currentChapter: 0,
  completedSteps: [],
  dismissed: false,
  lastVisited: new Date().toISOString(),
};
