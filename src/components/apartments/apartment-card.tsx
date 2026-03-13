"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ExternalLink, Trash2, ChevronDown } from "lucide-react";
import { formatCHF } from "@/lib/utils";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import type { ApartmentStatus } from "@/lib/types";
import type { SavedApartment } from "@/lib/stores/apartment-store";
import { InteractionTimeline, InteractionCountBadge } from "./interaction-timeline";

const STATUS_CONFIG: { key: ApartmentStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#64748b" },
  { key: "interested", label: "Interested", color: "#3b82f6" },
  { key: "contacted", label: "Contacted", color: "#f59e0b" },
  { key: "viewing_scheduled", label: "Viewing", color: "#8b5cf6" },
  { key: "applied", label: "Applied", color: "#06b6d4" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
  { key: "accepted", label: "Accepted", color: "#22c55e" },
];

interface ApartmentCardProps {
  apt: SavedApartment;
  onStatusChange: (status: ApartmentStatus) => void;
  onRemove: () => void;
}

export function ApartmentCard({ apt, onStatusChange, onRemove }: ApartmentCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusConf = STATUS_CONFIG.find((s) => s.key === apt.status)!;
  const neighborhood = NEIGHBORHOODS.find((n) => n.kreis === apt.kreis);

  const currentIndex = STATUS_CONFIG.findIndex((s) => s.key === apt.status);

  const openMenu = useCallback(() => {
    setShowStatusMenu(true);
    setFocusedIndex(currentIndex);
  }, [currentIndex]);

  const selectItem = useCallback(
    (index: number) => {
      onStatusChange(STATUS_CONFIG[index].key);
      setShowStatusMenu(false);
    },
    [onStatusChange]
  );

  useEffect(() => {
    if (!showStatusMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showStatusMenu]);

  useEffect(() => {
    if (!showStatusMenu || !menuRef.current) return;
    const buttons = menuRef.current.querySelectorAll<HTMLButtonElement>("[role='option']");
    buttons[focusedIndex]?.focus();
  }, [focusedIndex, showStatusMenu]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showStatusMenu) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % STATUS_CONFIG.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((i) => (i - 1 + STATUS_CONFIG.length) % STATUS_CONFIG.length);
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(STATUS_CONFIG.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) selectItem(focusedIndex);
        break;
      case "Escape":
        e.preventDefault();
        setShowStatusMenu(false);
        break;
    }
  };

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-accent-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {apt.title}
            </h3>
            <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
              <button
                onClick={() => (showStatusMenu ? setShowStatusMenu(false) : openMenu())}
                aria-expanded={showStatusMenu}
                aria-haspopup="listbox"
                className="shrink-0 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors hover:opacity-80"
                style={{
                  color: statusConf.color,
                  backgroundColor: `color-mix(in srgb, ${statusConf.color} 15%, transparent)`,
                }}
              >
                {statusConf.label}
                <ChevronDown className="h-2.5 w-2.5" />
              </button>
              {showStatusMenu && (
                <div
                  ref={menuRef}
                  role="listbox"
                  aria-label="Status"
                  className="absolute top-full left-0 mt-1 z-20 rounded-lg border border-border-default bg-bg-secondary shadow-lg py-1 min-w-[120px]"
                >
                  {STATUS_CONFIG.map((s, i) => (
                    <button
                      key={s.key}
                      role="option"
                      aria-selected={apt.status === s.key}
                      tabIndex={focusedIndex === i ? 0 : -1}
                      onClick={() => selectItem(i)}
                      onMouseEnter={() => setFocusedIndex(i)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-1.5 text-[10px] transition-colors ${
                        apt.status === s.key ? "font-semibold" : ""
                      } ${focusedIndex === i ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"}`}
                    >
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <InteractionCountBadge count={apt.interactions?.length ?? 0} />
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">{apt.address}</p>
        </div>

        <div className="shrink-0 flex items-start gap-3">
          <div className="text-right">
            <p className="font-data text-lg font-bold text-text-primary">
              {formatCHF(apt.rent)}
            </p>
            <p className="text-[10px] text-text-muted">/month</p>
          </div>
          <button
            onClick={onRemove}
            className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            title="Remove listing"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-[10px] text-text-muted">
        <span>
          {apt.rooms} rooms | {apt.sqm}m²
        </span>
        <span>Kreis {apt.kreis}</span>
        {neighborhood && (
          <span className="text-text-tertiary">({neighborhood.name})</span>
        )}
        {apt.sourceUrl && (
          <a
            href={apt.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-accent-primary hover:underline"
          >
            Source <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>

      {apt.notes && (
        <p className="text-[10px] text-text-tertiary mt-2 italic leading-snug">
          {apt.notes}
        </p>
      )}

      {/* Interaction Timeline */}
      <InteractionTimeline
        apartmentId={apt.id}
        interactions={apt.interactions ?? []}
      />
    </div>
  );
}
