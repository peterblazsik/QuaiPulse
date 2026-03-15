"use client";

import { useEffect, useRef } from "react";

/**
 * Subscribes to a Zustand store and calls `saveFn` after a debounce delay
 * whenever the store changes. Only activates after `ready` becomes true
 * (i.e., after initial hydration from the server is complete).
 *
 * @param store - Zustand store with a `subscribe` method
 * @param saveFn - Function to call to persist state to the server
 * @param ready - Whether initial hydration is done (prevents saving stale defaults)
 * @param delayMs - Debounce delay in ms (default 1500)
 */
export function useAutoSave(
  store: { subscribe: (listener: () => void) => () => void },
  saveFn: () => void,
  ready: boolean,
  delayMs: number = 1500,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyRef = useRef(false);

  // Track when hydration completes — only start auto-saving after that
  useEffect(() => {
    if (ready && !readyRef.current) {
      // Skip the first tick after becoming ready (that's the hydration write)
      setTimeout(() => {
        readyRef.current = true;
      }, 100);
    }
  }, [ready]);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      if (!readyRef.current) return;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveFn();
      }, delayMs);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [store, saveFn, delayMs]);
}
