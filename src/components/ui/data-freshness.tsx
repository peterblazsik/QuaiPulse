import { CalendarDays } from "lucide-react";
import { DATA_FRESHNESS } from "@/lib/constants";

export function DataFreshness() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
      <CalendarDays className="h-3 w-3" />
      Data as of {DATA_FRESHNESS}
    </span>
  );
}
