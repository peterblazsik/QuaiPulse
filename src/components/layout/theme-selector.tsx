"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useUIStore, THEMES, type ThemeId } from "@/lib/stores/ui-store";

export function ThemeSelector({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useUIStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = THEMES.find((t) => t.id === theme)!;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (collapsed) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-full items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
          title={`Theme: ${current.label}`}
        >
          <Palette className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute left-full bottom-0 ml-2 w-48 rounded-lg border border-border-default bg-bg-secondary shadow-lg z-50 py-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                  theme === t.id
                    ? "text-text-primary bg-bg-tertiary/50"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30"
                }`}
              >
                <div className="flex gap-0.5 shrink-0">
                  {t.preview.map((color, i) => (
                    <div
                      key={i}
                      className="h-2.5 w-2.5 rounded-full border border-border-default"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <span className="flex-1 text-left">{t.label}</span>
                {theme === t.id && <Check className="h-3 w-3 text-accent-primary shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-3 py-2 relative" ref={ref}>
      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5 px-1">
        Theme
      </p>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-all bg-bg-primary/40 hover:bg-bg-tertiary/30 text-text-secondary hover:text-text-primary border border-border-subtle"
      >
        <div className="flex gap-0.5 shrink-0">
          {current.preview.map((color, i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 rounded-full border border-border-default"
              style={{ background: color }}
            />
          ))}
        </div>
        <span className="flex-1 text-left text-[11px]">{current.label}</span>
        <Palette className="h-3 w-3 text-text-muted shrink-0" />
      </button>

      {open && (
        <div className="absolute left-3 right-3 bottom-full mb-1 rounded-lg border border-border-default bg-bg-secondary shadow-lg z-50 py-1">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                theme === t.id
                  ? "text-text-primary bg-bg-tertiary/50"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30"
              }`}
            >
              <div className="flex gap-0.5 shrink-0">
                {t.preview.map((color, i) => (
                  <div
                    key={i}
                    className="h-2.5 w-2.5 rounded-full border border-border-default"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.id && <Check className="h-3 w-3 text-accent-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
