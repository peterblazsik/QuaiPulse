"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/stores/ui-store";

const CHORD_MAP: Record<string, string> = {
  d: "/",
  n: "/neighborhoods",
  b: "/budget",
  a: "/apartments",
  k: "/katie",
  s: "/social",
  c: "/checklist",
  i: "/ai",
  f: "/gym-finder",
  z: "/sleep",
  l: "/flights",
  p: "/language",
  u: "/subscriptions",
};

const CHORD_TIMEOUT = 800;

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { toggleSidebar, setCommandPaletteOpen } = useUIStore();
  const gPendingRef = useRef(false);
  const gTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const helpOpenRef = useRef(false);
  const setHelpOpen = useRef<((open: boolean) => void) | null>(null);

  const registerHelpToggle = useCallback((fn: (open: boolean) => void) => {
    setHelpOpen.current = fn;
  }, []);

  useEffect(() => {
    function isInputFocused() {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if ((el as HTMLElement).isContentEditable) return true;
      return false;
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Skip if inside input/textarea or if modifier keys (except shift) are held
      if (isInputFocused()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // ? — toggle help overlay
      if (e.key === "?" || (e.shiftKey && key === "/")) {
        e.preventDefault();
        helpOpenRef.current = !helpOpenRef.current;
        setHelpOpen.current?.(helpOpenRef.current);
        return;
      }

      // Escape — close help
      if (key === "escape") {
        if (helpOpenRef.current) {
          helpOpenRef.current = false;
          setHelpOpen.current?.(false);
        }
        return;
      }

      // [ — toggle sidebar
      if (key === "[") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // G chord navigation
      if (key === "g" && !gPendingRef.current) {
        gPendingRef.current = true;
        if (gTimerRef.current) clearTimeout(gTimerRef.current);
        gTimerRef.current = setTimeout(() => {
          gPendingRef.current = false;
        }, CHORD_TIMEOUT);
        return;
      }

      if (gPendingRef.current) {
        gPendingRef.current = false;
        if (gTimerRef.current) clearTimeout(gTimerRef.current);

        const href = CHORD_MAP[key];
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, toggleSidebar, setCommandPaletteOpen]);

  return { registerHelpToggle };
}
