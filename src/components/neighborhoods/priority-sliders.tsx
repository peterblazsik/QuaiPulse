"use client";

import { useState } from "react";
import { usePriorityStore, BUILT_IN_PROFILES } from "@/lib/stores/priority-store";
import { SCORE_DIMENSIONS } from "@/lib/constants";
import type { ScoreDimension } from "@/lib/types";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { Tip } from "@/components/ui/tooltip";

const DIMENSION_TIPS: Record<string, string> = {
  commute: "Minutes to Quai Zurich Campus (Mythenquai) by public transit",
  gym: "Number and proximity of quality gyms within walking distance",
  social: "Bars, restaurants, and nightlife density",
  lake: "Walking distance to Lake Zurich shore access",
  airport: "Travel time to Zurich Airport (ZRH)",
  food: "Grocery stores, restaurants, and food variety",
  quiet: "Noise levels — traffic, nightlife, flight paths",
  transit: "Public transit connections (tram, bus, S-Bahn frequency)",
  cost: "Average rent and cost of living relative to city average",
  safety: "Crime statistics and perceived safety",
  flightNoise: "Aircraft noise exposure from Zurich Airport approaches",
  parking: "On-street and garage parking availability",
};

export function PrioritySliders() {
  const weights = usePriorityStore((s) => s.weights);
  const setWeight = usePriorityStore((s) => s.setWeight);
  const resetWeights = usePriorityStore((s) => s.resetWeights);
  const profiles = usePriorityStore((s) => s.profiles);
  const saveProfile = usePriorityStore((s) => s.saveProfile);
  const loadProfile = usePriorityStore((s) => s.loadProfile);
  const deleteProfile = usePriorityStore((s) => s.deleteProfile);

  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  const allProfileNames = [...Object.keys(BUILT_IN_PROFILES), ...Object.keys(profiles)];

  function handleSave() {
    const name = newProfileName.trim();
    if (!name) return;
    saveProfile(name);
    setNewProfileName("");
    setShowSaveInput(false);
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Priority Weights
        </h3>
        <Tip content="Reset to defaults">
        <button
          onClick={() => {
            if (window.confirm("Reset priority weights to defaults?")) resetWeights();
          }}
          className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
        </Tip>
      </div>

      {/* Profile selector */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <select
            onChange={(e) => {
              if (e.target.value) loadProfile(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            className="flex-1 text-[10px] rounded border border-border-default bg-bg-tertiary px-2 py-1.5 text-text-secondary focus:outline-none focus:border-accent-primary"
          >
            <option value="" disabled>Load profile...</option>
            <optgroup label="Built-in">
              {Object.keys(BUILT_IN_PROFILES).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
            {Object.keys(profiles).length > 0 && (
              <optgroup label="Saved">
                {Object.keys(profiles).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <Tip content="Save current as profile">
          <button
            onClick={() => setShowSaveInput(!showSaveInput)}
            className="shrink-0 rounded p-1.5 text-[10px] text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
          >
            <Save className="h-3 w-3" />
          </button>
          </Tip>
        </div>

        {showSaveInput && (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              placeholder="Profile name..."
              className="flex-1 text-[10px] rounded border border-border-default bg-bg-tertiary px-2 py-1.5 text-text-secondary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="text-[10px] px-2 py-1 rounded bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25 transition-colors"
            >
              Save
            </button>
          </div>
        )}

        {/* Delete user profiles */}
        {Object.keys(profiles).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.keys(profiles).map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted"
              >
                {name}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete profile "${name}"?`)) deleteProfile(name);
                  }}
                  className="hover:text-danger transition-colors"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {SCORE_DIMENSIONS.map((dim) => {
        const key = dim.key as ScoreDimension;
        const value = weights[key];
        return (
          <div key={key} className="group flex items-center gap-2 py-1">
            {/* Color dot */}
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: dim.color }}
            />
            {/* Label */}
            <Tip content={DIMENSION_TIPS[key] ?? dim.label}>
            <span
              className="w-20 text-xs text-text-secondary truncate group-hover:overflow-visible group-hover:whitespace-nowrap group-hover:relative group-hover:z-10"
              tabIndex={0}
            >
              {dim.label}
            </span>
            </Tip>
            {/* Slider */}
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={value}
              onChange={(e) => setWeight(key, Number(e.target.value))}
              aria-label={dim.label}
              className="flex-1 h-1.5 appearance-none rounded-full bg-bg-tertiary cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125"
              style={{
                // @ts-expect-error -- CSS custom property for thumb color
                "--thumb-color": dim.color,
              }}
            />
            {/* Value */}
            <Tip content="Weight 0 = ignored, 10 = maximum priority">
            <span className="w-5 text-right font-data text-xs text-text-secondary tabular-nums" tabIndex={0}>
              {value}
            </span>
            </Tip>
          </div>
        );
      })}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background: var(--thumb-color, var(--accent-primary));
        }
      `}</style>
    </div>
  );
}
