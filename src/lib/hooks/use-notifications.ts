"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getUpcomingDeadlines,
  getPhaseLabel,
  type DeadlineAlert,
} from "@/lib/engines/notification-engine";
import { getAllChecklistItems, type ChecklistItemData } from "@/lib/data/checklist-items";

const THROTTLE_MS = 4 * 60 * 60 * 1000; // 4 hours
const STORAGE_KEY = "quaipulse-notif-last-sent";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

interface NotificationHook {
  permission: PermissionState;
  requestPermission: () => Promise<void>;
  checkAndNotify: (completedIds: string[], customItems?: ChecklistItemData[]) => void;
}

function getLastNotifiedMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLastNotified(itemId: string, timestamp: number): void {
  try {
    const map = getLastNotifiedMap();
    map[itemId] = timestamp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable -- silently degrade
  }
}

function shouldNotify(itemId: string): boolean {
  const map = getLastNotifiedMap();
  const last = map[itemId];
  if (!last) return true;
  return Date.now() - last >= THROTTLE_MS;
}

function formatAlertBody(alert: DeadlineAlert): string {
  const phase = getPhaseLabel(alert.item.phase);
  if (alert.daysUntil < 0) {
    return `OVERDUE by ${Math.abs(alert.daysUntil)} day(s) -- [${phase}] ${alert.item.title}`;
  }
  if (alert.daysUntil === 0) {
    return `DUE TODAY -- [${phase}] ${alert.item.title}`;
  }
  return `${alert.daysUntil} day(s) left -- [${phase}] ${alert.item.title}`;
}

export function useNotifications(): NotificationHook {
  const [permission, setPermission] = useState<PermissionState>("default");
  const hasAutoChecked = useRef(false);

  // Sync permission state from browser on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as PermissionState);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result as PermissionState);
  }, []);

  const checkAndNotify = useCallback(
    (completedIds: string[], customItems: ChecklistItemData[] = []) => {
      if (permission !== "granted") return;

      const allItems = getAllChecklistItems(customItems);
      const alerts = getUpcomingDeadlines(completedIds, allItems);
      const now = Date.now();
      const lastMap = getLastNotifiedMap();

      // Only push browser notifications for overdue + critical items
      const toUpdate: string[] = [];
      for (const alert of alerts) {
        if (alert.urgency !== "overdue" && alert.urgency !== "critical") continue;
        const last = lastMap[alert.item.id];
        if (last && now - last < THROTTLE_MS) continue;

        const body = formatAlertBody(alert);
        try {
          new Notification("QuaiPulse -- Deadline Alert", {
            body,
            icon: "/icon-192.png",
            tag: `qp-deadline-${alert.item.id}`,
          });
        } catch {
          // Notification constructor can throw in some environments
        }
        lastMap[alert.item.id] = now;
        toUpdate.push(alert.item.id);
      }

      // Single localStorage write for all notifications
      if (toUpdate.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(lastMap));
        } catch {
          // localStorage unavailable
        }
      }
    },
    [permission]
  );

  // Auto-check once on mount when permission is already granted
  // We need completedIds from the caller, so we expose checkAndNotify
  // and let the component call it. But we track the auto-check flag
  // so the component can trigger it exactly once.
  useEffect(() => {
    if (permission === "granted" && !hasAutoChecked.current) {
      hasAutoChecked.current = true;
    }
  }, [permission]);

  return { permission, requestPermission, checkAndNotify };
}
