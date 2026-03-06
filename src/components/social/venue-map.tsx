"use client";

import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { VenueData } from "@/lib/data/venues";
import type { VenueType } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { formatCHF } from "@/lib/utils";

const VENUE_COLORS: Record<VenueType, string> = {
  gym: "#ef4444",
  chess: "#8b5cf6",
  ai_meetup: "#3b82f6",
  swimming: "#06b6d4",
  cycling: "#84cc16",
  restaurant: "#f97316",
  social: "#f59e0b",
  coworking: "#22c55e",
};

const VENUE_LABELS: Record<VenueType, string> = {
  gym: "Gym",
  chess: "Chess",
  ai_meetup: "AI/Tech",
  swimming: "Swimming",
  cycling: "Cycling",
  restaurant: "Food",
  social: "Social",
  coworking: "Coworking",
};

// Zurich office location
const OFFICE = { lat: 47.3629, lng: 8.5318 };
// Map center — slightly north of office to center all venues
const MAP_CENTER = { lat: 47.375, lng: 8.535 };

// Free tile style — OpenFreeMap dark
const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

interface VenueMapProps {
  venues: VenueData[];
  activeFilter: VenueType | "all";
  className?: string;
}

export function VenueMap({ venues, activeFilter, className = "" }: VenueMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [MAP_CENTER.lng, MAP_CENTER.lat],
      zoom: 12.5,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.on("load", () => {
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when venues or filter changes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupRef.current?.remove();

    // Add office marker
    const officeEl = document.createElement("div");
    officeEl.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:#3b82f6;border:3px solid #1e3a5f;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(59,130,246,0.5);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>`;

    const officePopup = new maplibregl.Popup({ offset: 18, closeButton: false })
      .setHTML(`<div style="font-size:11px;font-weight:600;color:#3b82f6;">Quai Zurich Campus</div><div style="font-size:10px;color:#94a3b8;">Mythenquai — Your office</div>`);

    new maplibregl.Marker({ element: officeEl })
      .setLngLat([OFFICE.lng, OFFICE.lat])
      .setPopup(officePopup)
      .addTo(mapRef.current!);

    // Add neighborhood label markers
    NEIGHBORHOODS.forEach((n) => {
      const el = document.createElement("div");
      el.style.cssText = "font-size:9px;color:#64748b;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;pointer-events:none;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.8);";
      el.textContent = n.name;

      new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([n.lng, n.lat])
        .addTo(mapRef.current!);
    });

    // Add venue markers
    venues.forEach((venue) => {
      const color = VENUE_COLORS[venue.type];
      const el = document.createElement("div");
      el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.15s;box-shadow:0 0 6px ${color}40;`;
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.4)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const neighborhoodName = NEIGHBORHOODS.find((n) => n.id === venue.neighborhoodId)?.name ?? "";
      const priceHtml = venue.monthlyPrice ? `<div style="font-size:10px;color:#94a3b8;margin-top:2px;">${formatCHF(venue.monthlyPrice)}/mo</div>` : "";
      const ratingHtml = venue.rating ? `<span style="color:#fbbf24;font-size:10px;margin-left:6px;">★ ${venue.rating}</span>` : "";
      const noteHtml = venue.personalNote ? `<div style="font-size:10px;color:#8094a8;margin-top:4px;font-style:italic;max-width:200px;">${venue.personalNote}</div>` : "";

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false, maxWidth: "240px" })
        .setHTML(`
          <div style="font-family:system-ui;padding:2px;">
            <div style="display:flex;align-items:center;gap:4px;">
              <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></div>
              <span style="font-size:10px;color:${color};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">${VENUE_LABELS[venue.type]}</span>
              ${ratingHtml}
            </div>
            <div style="font-size:12px;font-weight:600;color:#e2e8f0;margin-top:4px;">${venue.name}</div>
            <div style="font-size:10px;color:#64748b;margin-top:1px;">${neighborhoodName} — ${venue.address}</div>
            ${priceHtml}
            ${noteHtml}
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([venue.lng, venue.lat])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [venues, activeFilter, mapReady]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border-default ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <div className="h-3 w-3 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
}
