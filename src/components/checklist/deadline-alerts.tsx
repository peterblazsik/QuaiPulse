"use client";

import { useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, AlertTriangle, Clock } from "lucide-react";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import {
  getUpcomingDeadlines,
  getPhaseLabel,
  type Urgency,
} from "@/lib/engines/notification-engine";
import { useNotifications } from "@/lib/hooks/use-notifications";

const URGENCY_STYLES: Record<
  Urgency,
  { border: string; bg: string; text: string; badge: string; badgeBg: string }
> = {
  overdue: {
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "text-red-300",
    badgeBg: "bg-red-500/20",
  },
  critical: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "text-amber-300",
    badgeBg: "bg-amber-500/20",
  },
  warning: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/8",
    text: "text-yellow-400",
    badge: "text-yellow-300",
    badgeBg: "bg-yellow-500/15",
  },
  upcoming: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    text: "text-blue-400",
    badge: "text-blue-300",
    badgeBg: "bg-blue-500/15",
  },
};

const URGENCY_LABELS: Record<Urgency, string> = {
  overdue: "OVERDUE",
  critical: "CRITICAL",
  warning: "WARNING",
  upcoming: "UPCOMING",
};

function formatCountdown(daysUntil: number): string {
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d overdue`;
  if (daysUntil === 0) return "Due today";
  return `${daysUntil}d left`;
}

export function DeadlineAlerts() {
  const completedIds = useChecklistStore((s) => s.completedIds);
  const { permission, requestPermission, checkAndNotify } = useNotifications();
  const hasNotified = useRef(false);

  const alerts = useMemo(
    () => getUpcomingDeadlines(completedIds),
    [completedIds]
  );

  // Fire browser notifications once on mount (or when permission changes to granted)
  useEffect(() => {
    if (permission === "granted" && !hasNotified.current) {
      hasNotified.current = true;
      checkAndNotify(completedIds);
    }
  }, [permission, completedIds, checkAndNotify]);

  if (alerts.length === 0) return null;

  const hasOverdueOrCritical = alerts.some(
    (a) => a.urgency === "overdue" || a.urgency === "critical"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border-subtle bg-bg-secondary p-4"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasOverdueOrCritical ? (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          ) : (
            <Clock className="h-4 w-4 text-yellow-400" />
          )}
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Deadline Alerts
          </h3>
          <span className="rounded-full bg-bg-tertiary px-1.5 py-0.5 font-data text-[10px] text-text-muted">
            {alerts.length}
          </span>
        </div>

        {/* Notification permission toggle */}
        {permission !== "unsupported" && (
          <button
            onClick={requestPermission}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
              permission === "granted"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : permission === "denied"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed"
                  : "bg-bg-tertiary text-text-muted hover:text-text-secondary border border-border-subtle hover:border-border-default"
            }`}
            disabled={permission === "denied"}
            title={
              permission === "granted"
                ? "Browser notifications enabled"
                : permission === "denied"
                  ? "Notifications blocked -- enable in browser settings"
                  : "Enable browser notifications for deadline alerts"
            }
          >
            {permission === "granted" ? (
              <>
                <Bell className="h-3 w-3" />
                Notifications on
              </>
            ) : permission === "denied" ? (
              <>
                <BellOff className="h-3 w-3" />
                Blocked
              </>
            ) : (
              <>
                <Bell className="h-3 w-3" />
                Enable notifications
              </>
            )}
          </button>
        )}
      </div>

      {/* Alert list */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => {
            const style = URGENCY_STYLES[alert.urgency];
            return (
              <motion.div
                key={alert.item.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${style.border} ${style.bg}`}
              >
                {/* Urgency badge */}
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badgeBg} ${style.badge}`}
                >
                  {URGENCY_LABELS[alert.urgency]}
                </span>

                {/* Item info */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {alert.item.title}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {getPhaseLabel(alert.item.phase)} -- {alert.item.category}
                  </p>
                </div>

                {/* Countdown */}
                <span
                  className={`shrink-0 font-data text-xs font-semibold ${style.text}`}
                >
                  {formatCountdown(alert.daysUntil)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
