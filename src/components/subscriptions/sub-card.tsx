import {
  Check,
  Scissors,
  RefreshCw,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { CATEGORY_CONFIG, type SubscriptionData, type SubAction } from "@/lib/data/subscriptions";
import { formatCHF, formatEUR } from "@/lib/utils";

function ActionButton({
  label,
  active,
  color,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border transition-all duration-150 ${
        active
          ? "font-medium"
          : "border-border-default bg-bg-tertiary text-text-muted hover:text-text-secondary"
      }`}
      style={
        active
          ? {
              borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
              color,
            }
          : undefined
      }
    >
      {icon}
      {label}
    </button>
  );
}

export function SubCard({
  sub,
  action,
  setDecision,
  compact = false,
  onDelete,
}: {
  sub: SubscriptionData;
  action: SubAction;
  setDecision: (id: string, action: SubAction) => void;
  compact?: boolean;
  onDelete?: () => void;
}) {
  const cat = CATEGORY_CONFIG[sub.category];
  const borderColor =
    action === "keep"
      ? "border-green-500/30"
      : action === "cut"
        ? "border-red-500/30"
        : action === "replace"
          ? "border-blue-500/30"
          : "border-border-default";

  const bgColor =
    action === "keep"
      ? "bg-green-500/5"
      : action === "cut"
        ? "bg-red-500/5"
        : action === "replace"
          ? "bg-blue-500/5"
          : "bg-bg-secondary";

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-3 transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-text-primary truncate">
              {sub.name}
            </h4>
            {sub.essential && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium shrink-0">
                Essential
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{
                backgroundColor: `color-mix(in srgb, ${cat.color} 12%, transparent)`,
                color: cat.color,
              }}
            >
              {cat.label}
            </span>
            <span className="font-data text-[10px] text-text-muted">
              {sub.monthlyCostEUR > 0 ? formatEUR(sub.monthlyCostEUR) : formatCHF(sub.monthlyCostCHF)}
              /mo
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!compact && sub.monthlyCostCHF > 0 && (
            <div className="text-right">
              <p className="font-data text-xs text-text-primary">{formatCHF(sub.monthlyCostCHF)}</p>
              <p className="text-[10px] text-text-muted">in CH</p>
            </div>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Remove custom subscription"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      {!compact && sub.notes && (
        <p className="text-[10px] text-text-tertiary mt-2 leading-snug italic">
          {sub.notes}
        </p>
      )}

      {/* Swiss alternative */}
      {!compact && sub.swissAlternative && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px]">
          <ArrowRight className="h-2.5 w-2.5 text-accent-primary" />
          <span className="text-text-secondary">
            {sub.swissAlternative}
            {sub.swissAlternativeCostCHF != null && (
              <span className="font-data text-text-primary ml-1">
                {formatCHF(sub.swissAlternativeCostCHF)}/mo
              </span>
            )}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border-subtle">
        <ActionButton
          label="Keep"
          active={action === "keep"}
          color="#22c55e"
          onClick={() => setDecision(sub.id, action === "keep" ? "undecided" : "keep")}
          icon={<Check className="h-3 w-3" />}
        />
        <ActionButton
          label="Cut"
          active={action === "cut"}
          color="#ef4444"
          onClick={() => setDecision(sub.id, action === "cut" ? "undecided" : "cut")}
          icon={<Scissors className="h-3 w-3" />}
        />
        {sub.swissAlternative && (
          <ActionButton
            label="Replace"
            active={action === "replace"}
            color="#3b82f6"
            onClick={() => setDecision(sub.id, action === "replace" ? "undecided" : "replace")}
            icon={<RefreshCw className="h-3 w-3" />}
          />
        )}
      </div>
    </div>
  );
}
