import {
  LayoutDashboard,
  MapPin,
  Wallet,
  Building2,
  Heart,
  Users,
  CheckSquare,
  Bot,
  Dumbbell,
  Moon,
  Plane,
  Languages,
  CreditCard,
  ArrowLeftRight,
  CloudSun,
  FileText,
  Settings,
  Map,
  Pill,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { ALL_LOCATIONS } from "@/lib/data/neighborhoods";
import { VENUES } from "@/lib/data/venues";
import {
  CHECKLIST_ITEMS,
  getAllChecklistItems,
  type ChecklistItemData,
} from "@/lib/data/checklist-items";
import { DOSSIER_DOCUMENTS } from "@/lib/data/dossier-items";
import { PHRASES } from "@/lib/data/phrases";
import { DEFAULT_SUBSCRIPTIONS } from "@/lib/data/subscriptions";
import { SUPPLEMENTS } from "@/lib/data/sleep-defaults";

export interface SearchResult {
  id: string;
  group: string;
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  href: string;
  /** All searchable text joined for filtering */
  keywords: string;
}

// ─── Navigation commands ───────────────────────────────────────────────

const NAV_COMMANDS: SearchResult[] = [
  { id: "nav-dashboard", group: "Navigate", icon: LayoutDashboard, label: "Dashboard", href: "/", keywords: "dashboard home overview" },
  { id: "nav-neighborhoods", group: "Navigate", icon: MapPin, label: "Neighborhoods", href: "/neighborhoods", keywords: "neighborhoods kreis zurich areas map" },
  { id: "nav-budget", group: "Navigate", icon: Wallet, label: "Budget Simulator", href: "/budget", keywords: "budget simulator money salary income expenses" },
  { id: "nav-apartments", group: "Navigate", icon: Building2, label: "Apartments", href: "/apartments", keywords: "apartments rental housing flat wohnung" },
  { id: "nav-katie", group: "Navigate", icon: Heart, label: "Katie Planner", href: "/katie", keywords: "katie planner daughter visits vienna" },
  { id: "nav-social", group: "Navigate", icon: Users, label: "Social Map", href: "/social", keywords: "social map venues meetups clubs" },
  { id: "nav-checklist", group: "Navigate", icon: CheckSquare, label: "Move Checklist", href: "/checklist", keywords: "move checklist tasks todo" },
  { id: "nav-ai", group: "Navigate", icon: Bot, label: "AI Chat", href: "/ai", keywords: "ai chat assistant claude" },
  { id: "nav-gym", group: "Navigate", icon: Dumbbell, label: "Gym Finder", href: "/gym-finder", keywords: "gym finder fitness exercise knee" },
  { id: "nav-sleep", group: "Navigate", icon: Moon, label: "Sleep Intelligence", href: "/sleep", keywords: "sleep intelligence tracker quality" },
  { id: "nav-flights", group: "Navigate", icon: Plane, label: "Flight Scanner", href: "/flights", keywords: "flight scanner vienna zurich travel" },
  { id: "nav-language", group: "Navigate", icon: Languages, label: "Language Prep", href: "/language", keywords: "language prep german swiss deutsch" },
  { id: "nav-subscriptions", group: "Navigate", icon: CreditCard, label: "Subscriptions", href: "/subscriptions", keywords: "subscriptions services monthly costs" },
  { id: "nav-dossier", group: "Navigate", icon: FileText, label: "Dossier Tracker", href: "/dossier", keywords: "dossier tracker documents rental application" },
  { id: "nav-currency", group: "Navigate", icon: ArrowLeftRight, label: "Currency Dashboard", href: "/currency", keywords: "currency dashboard eur chf exchange rate" },
  { id: "nav-weather", group: "Navigate", icon: CloudSun, label: "Weather", href: "/weather", keywords: "weather forecast zurich temperature" },
  { id: "nav-settings", group: "Navigate", icon: Settings, label: "Settings", href: "/settings", keywords: "settings preferences theme" },
];

// ─── Build search index from all data sources ──────────────────────────

function buildStaticIndex(): SearchResult[] {
  const results: SearchResult[] = [...NAV_COMMANDS];

  // Neighborhoods
  for (const n of ALL_LOCATIONS) {
    results.push({
      id: `hood-${n.id}`,
      group: "Neighborhoods",
      icon: Map,
      label: n.name,
      sublabel: `Kreis ${n.kreis} — ${n.vibe}`,
      href: `/neighborhoods/${n.slug}`,
      keywords: `${n.name} kreis ${n.kreis} ${n.vibe} ${n.description} ${n.pros.join(" ")} ${n.cons.join(" ")}`.toLowerCase(),
    });
  }

  // Checklist items (static only — custom merged at query time)
  for (const item of CHECKLIST_ITEMS) {
    results.push(checklistToResult(item));
  }

  // Venues
  for (const v of VENUES) {
    results.push({
      id: `venue-${v.id}`,
      group: "Venues",
      icon: v.type === "gym" ? Dumbbell : v.type === "swimming" || v.type === "cycling" ? Dumbbell : Users,
      label: v.name,
      sublabel: `${v.type} — ${v.address}`,
      href: `/social?venue=${v.id}`,
      keywords: `${v.name} ${v.type} ${v.address} ${v.tags.join(" ")} ${v.personalNote ?? ""}`.toLowerCase(),
    });
  }

  // Dossier documents
  for (const d of DOSSIER_DOCUMENTS) {
    results.push({
      id: `doc-${d.id}`,
      group: "Documents",
      icon: FileText,
      label: d.title,
      sublabel: `${d.category} — ${d.source}`,
      href: "/dossier",
      keywords: `${d.title} ${d.description} ${d.category} ${d.source} ${d.tips ?? ""}`.toLowerCase(),
    });
  }

  // German phrases
  for (const p of PHRASES) {
    results.push({
      id: `phrase-${p.id}`,
      group: "German Phrases",
      icon: Languages,
      label: p.swiss,
      sublabel: p.english,
      href: "/language",
      keywords: `${p.swiss} ${p.standardGerman} ${p.english} ${p.category} ${p.culturalNote ?? ""}`.toLowerCase(),
    });
  }

  // Subscriptions
  for (const s of DEFAULT_SUBSCRIPTIONS) {
    results.push({
      id: `sub-${s.id}`,
      group: "Subscriptions",
      icon: CreditCard,
      label: s.name,
      sublabel: `${s.category} — €${s.monthlyCostEUR}/mo`,
      href: "/subscriptions",
      keywords: `${s.name} ${s.category} ${s.notes ?? ""} ${s.swissAlternative ?? ""}`.toLowerCase(),
    });
  }

  // Sleep supplements
  for (const s of SUPPLEMENTS) {
    results.push({
      id: `supp-${s.id}`,
      group: "Supplements",
      icon: Pill,
      label: s.name,
      sublabel: `${s.category} — ${s.doseLow}–${s.doseHigh} ${s.form}`,
      href: "/sleep/protocol",
      keywords: `${s.name} ${s.category} ${s.form} ${s.mechanism} sleep supplement`.toLowerCase(),
    });
  }

  return results;
}

function checklistToResult(item: ChecklistItemData): SearchResult {
  return {
    id: `cl-${item.id}`,
    group: "Checklist",
    icon: item.id.startsWith("custom-") ? Tag : CheckSquare,
    label: item.title,
    sublabel: `${item.phase} — ${item.category}`,
    href: "/checklist",
    keywords: `${item.title} ${item.description ?? ""} ${item.category} ${item.phase} checklist task`.toLowerCase(),
  };
}

// Singleton static index (built once)
let _staticIndex: SearchResult[] | null = null;

function getStaticIndex(): SearchResult[] {
  if (!_staticIndex) {
    _staticIndex = buildStaticIndex();
  }
  return _staticIndex;
}

/**
 * Get the full search index including custom checklist items.
 */
export function getSearchIndex(customChecklistItems: ChecklistItemData[] = []): SearchResult[] {
  const base = getStaticIndex();
  if (customChecklistItems.length === 0) return base;

  // Append custom checklist items
  return [...base, ...customChecklistItems.map(checklistToResult)];
}

/**
 * Search the index. Returns results grouped and scored.
 * Empty query returns navigation commands only.
 */
export function searchIndex(
  query: string,
  customChecklistItems: ChecklistItemData[] = [],
  maxPerGroup = 5
): SearchResult[] {
  const index = getSearchIndex(customChecklistItems);

  if (!query.trim()) {
    return index.filter((r) => r.group === "Navigate");
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Score each result
  const scored = index
    .map((result) => {
      let score = 0;
      const labelLower = result.label.toLowerCase();

      for (const term of terms) {
        // Exact label match (highest weight)
        if (labelLower === term) {
          score += 100;
        } else if (labelLower.startsWith(term)) {
          score += 50;
        } else if (labelLower.includes(term)) {
          score += 25;
        }

        // Sublabel match
        if (result.sublabel?.toLowerCase().includes(term)) {
          score += 10;
        }

        // Keywords match (broadest)
        if (result.keywords.includes(term)) {
          score += 5;
        }
      }

      return { result, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Group and limit per group
  const groupCounts: Record<string, number> = {};
  const filtered: SearchResult[] = [];

  for (const { result } of scored) {
    const count = groupCounts[result.group] ?? 0;
    if (count < maxPerGroup) {
      filtered.push(result);
      groupCounts[result.group] = count + 1;
    }
  }

  return filtered;
}
