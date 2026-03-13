"use client";

import { useEffect, useRef, useState } from "react";
import type { UnifiedListing } from "@/lib/types";
import { formatCHF } from "@/lib/utils";

interface Props {
  listings: UnifiedListing[];
  onSelect: (id: string) => void;
}

// Zurich center coordinates
const ZURICH_CENTER: [number, number] = [8.541, 47.377];
const ZURICH_ZOOM = 12.5;

function scoreToColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function ListingMap({ listings, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    let map: maplibregl.Map | null = null;

    async function init() {
      const maplibregl = await import("maplibre-gl");

      // Load CSS dynamically
      if (!document.querySelector('link[href*="maplibre-gl"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/maplibre-gl@5.19.0/dist/maplibre-gl.css";
        document.head.appendChild(link);
      }

      if (!containerRef.current) return;

      map = new maplibregl.Map({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: ZURICH_CENTER,
        zoom: ZURICH_ZOOM,
        maxZoom: 17,
        minZoom: 10,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      map.on("load", () => {
        mapRef.current = map;
        setMapLoaded(true);
      });
    }

    init();

    return () => {
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when listings or map changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    for (const marker of markersRef.current) {
      marker.remove();
    }
    markersRef.current = [];

    async function addMarkers() {
      const maplibregl = await import("maplibre-gl");
      if (!mapRef.current) return;

      const withCoords = listings.filter(
        (l) => l.latitude != null && l.longitude != null
      );

      for (const listing of withCoords) {
        const color = scoreToColor(listing.valueScore);

        // Custom marker element
        const el = document.createElement("div");
        el.style.cssText = `
          width: 28px; height: 28px; border-radius: 50%;
          background: ${color}; border: 2px solid ${color}44;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #000;
          cursor: pointer; transition: transform 0.15s;
          font-family: ui-monospace, monospace;
          box-shadow: 0 2px 8px ${color}40;
        `;
        el.textContent = String(listing.valueScore);
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.3)";
          el.style.zIndex = "10";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
          el.style.zIndex = "0";
        });

        const popup = new maplibregl.Popup({
          offset: 20,
          closeButton: false,
          maxWidth: "240px",
        }).setHTML(`
          <div style="font-family: -apple-system, sans-serif; font-size: 12px; color: #e2e8f0; background: #1a2035; padding: 10px; border-radius: 8px; border: 1px solid #334155;">
            <div style="font-weight: 700; margin-bottom: 4px; color: #f1f5f9;">${listing.title}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">${listing.address}</div>
            <div style="display: flex; gap: 12px; font-family: ui-monospace, monospace;">
              <span style="color: #3b82f6; font-weight: 700;">${formatCHF(listing.rent)}/mo</span>
              <span style="color: ${color}; font-weight: 700;">Score: ${listing.valueScore}</span>
            </div>
            ${listing.rooms ? `<div style="color: #64748b; font-size: 10px; margin-top: 4px;">${listing.rooms} rooms · ${listing.sqm ?? "—"} m² · K${listing.kreis}</div>` : ""}
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([listing.longitude!, listing.latitude!])
          .setPopup(popup)
          .addTo(mapRef.current!);

        el.addEventListener("click", () => {
          onSelect(listing.id);
        });

        markersRef.current.push(marker);
      }
    }

    addMarkers();
  }, [listings, mapLoaded, onSelect]);

  const withCoords = listings.filter((l) => l.latitude != null && l.longitude != null);
  const withoutCoords = listings.length - withCoords.length;

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
      <div ref={containerRef} className="w-full h-[500px]" />
      <div className="px-4 py-2 flex items-center justify-between text-[10px] text-[var(--text-tertiary)] border-t border-[var(--border-default)]">
        <span>{withCoords.length} listings mapped · {withoutCoords} without coordinates</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 70+
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 50-69
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> &lt;50
          </span>
        </div>
      </div>
    </div>
  );
}
