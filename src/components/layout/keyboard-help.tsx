"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const SHORTCUT_GROUPS = [
  {
    title: "Navigation (G + key chord)",
    shortcuts: [
      { keys: ["G", "D"], label: "Dashboard" },
      { keys: ["G", "N"], label: "Neighborhoods" },
      { keys: ["G", "B"], label: "Budget" },
      { keys: ["G", "A"], label: "Apartments" },
      { keys: ["G", "K"], label: "Katie Planner" },
      { keys: ["G", "S"], label: "Social Map" },
      { keys: ["G", "C"], label: "Checklist" },
      { keys: ["G", "I"], label: "AI Chat" },
    ],
  },
  {
    title: "Global",
    shortcuts: [
      { keys: ["\u2318", "K"], label: "Command palette" },
      { keys: ["["], label: "Toggle sidebar" },
      { keys: ["?"], label: "Keyboard shortcuts" },
      { keys: ["Esc"], label: "Close overlay" },
    ],
  },
];

interface KeyboardHelpProps {
  registerToggle: (fn: (open: boolean) => void) => void;
}

export function KeyboardHelp({ registerToggle }: KeyboardHelpProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    registerToggle(setOpen);
  }, [registerToggle]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="flex items-start justify-center pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-accent-primary" />
                  <h2 className="text-sm font-semibold text-text-primary">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
                {SHORTCUT_GROUPS.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                      {group.title}
                    </h3>
                    <div className="space-y-1.5">
                      {group.shortcuts.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-xs text-text-secondary">
                            {s.label}
                          </span>
                          <div className="flex items-center gap-1">
                            {s.keys.map((k, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {i > 0 && (
                                  <span className="text-[10px] text-text-muted">
                                    then
                                  </span>
                                )}
                                <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded border border-border-default bg-bg-primary text-[11px] font-data text-text-secondary shadow-sm">
                                  {k}
                                </kbd>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <p className="text-[10px] text-text-muted text-center pt-2 border-t border-border-subtle">
                  Press <kbd className="px-1 rounded border border-border-default bg-bg-primary text-[10px]">?</kbd> to toggle this overlay
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
