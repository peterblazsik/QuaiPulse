"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useChecklistStore } from "@/lib/stores/checklist-store";
import { searchIndex, type SearchResult } from "@/lib/search-index";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const customItems = useChecklistStore((s) => s.customItems);
  const triggerRef = useRef<Element | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(
    () => searchIndex(query, customItems),
    [query, customItems]
  );

  // Group results for rendering
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      const arr = map.get(r.group) ?? [];
      arr.push(r);
      map.set(r.group, arr);
    }
    return map;
  }, [results]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Reset query on close
  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  // Cmd+K toggle
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!commandPaletteOpen) {
          triggerRef.current = document.activeElement;
        }
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus trap
  useEffect(() => {
    if (!commandPaletteOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
  }, [commandPaletteOpen]);

  // Restore focus on close
  useEffect(() => {
    if (!commandPaletteOpen && triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [commandPaletteOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setCommandPaletteOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      selectResult(results[selectedIndex]);
    }
  };

  const selectResult = (result: SearchResult) => {
    router.push(result.href);
    setCommandPaletteOpen(false);
  };

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector("[data-selected=true]");
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!commandPaletteOpen) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Site-wide search"
      ref={dialogRef}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />
      {/* Palette */}
      <div className="flex items-start justify-center pt-[15vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-2xl"
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border-default px-4">
            <Search className="h-4 w-4 text-text-muted shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, tasks, neighborhoods, phrases..."
              className="w-full bg-transparent py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="shrink-0 text-[10px] text-text-muted hover:text-text-secondary border border-border-default rounded px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-text-tertiary">No results found</p>
                <p className="text-[10px] text-text-muted mt-1">
                  Try searching for a neighborhood, checklist task, or phrase
                </p>
              </div>
            ) : (
              Array.from(grouped.entries()).map(([group, items]) => (
                <div key={group} className="mb-2">
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    {group}
                    <span className="ml-1.5 text-text-muted/50">{items.length}</span>
                  </div>
                  {items.map((result) => {
                    flatIndex++;
                    const isSelected = flatIndex === selectedIndex;
                    const Icon = result.icon;
                    const currentIndex = flatIndex;
                    return (
                      <button
                        key={result.id}
                        data-selected={isSelected}
                        onClick={() => selectResult(result)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          isSelected
                            ? "bg-accent-primary/10 text-accent-primary"
                            : "text-text-secondary hover:bg-bg-tertiary/50"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">
                            {result.label}
                          </p>
                          {result.sublabel && (
                            <p className="text-[10px] text-text-muted truncate">
                              {result.sublabel}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <CornerDownLeft className="h-3 w-3 shrink-0 text-text-muted" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border-default px-4 py-2">
            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center min-w-[18px] h-4 rounded border border-border-default bg-bg-primary px-1 text-[10px] font-data">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center min-w-[18px] h-4 rounded border border-border-default bg-bg-primary px-1 text-[10px] font-data">
                  ↵
                </kbd>
                Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center min-w-[18px] h-4 rounded border border-border-default bg-bg-primary px-1 text-[10px] font-data">
                  esc
                </kbd>
                Close
              </span>
            </div>
            <span className="font-data text-[10px] text-text-muted">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
