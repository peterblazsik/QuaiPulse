"use client";

import { Palette } from "lucide-react";
import { useUIStore, THEMES, type ThemeId } from "@/lib/stores/ui-store";

export function ThemeSelector({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useUIStore();

  const cycle = () => {
    const idx = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.id);
  };

  const current = THEMES.find((t) => t.id === theme)!;

  if (collapsed) {
    return (
      <button
        onClick={cycle}
        className="flex h-10 w-full items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
        title={`Theme: ${current.label}`}
      >
        <Palette className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5 px-1">
        Theme
      </p>
      <div className="flex gap-1.5">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-all ${
              theme === t.id
                ? "ring-1 ring-accent-primary/50 bg-bg-tertiary/40 text-text-primary"
                : "bg-bg-primary/40 text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/20"
            }`}
          >
            {/* Color preview dots */}
            <div className="flex gap-0.5 shrink-0">
              {t.preview.map((color, i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full border border-border-default"
                  style={{ background: color }}
                />
              ))}
            </div>
            <span className="truncate text-[11px]">{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
