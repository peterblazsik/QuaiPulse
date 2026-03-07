"use client";

import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { VenueData } from "@/lib/data/venues";
import type { VenueType } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { OFFICE_COORDS } from "@/lib/constants";
import { formatCHF } from "@/lib/utils";
import { VENUE_TYPE_COLORS, VENUE_TYPE_SHORT_LABELS } from "@/lib/data/venue-config";
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
    const officeInner = document.createElement("div");
    officeInner.style.cssText = "width:28px;height:28px;border-radius:50%;background:#3b82f6;border:3px solid #1e3a5f;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(59,130,246,0.5);";
    const officeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    officeSvg.setAttribute("width", "14");
    officeSvg.setAttribute("height", "14");
    officeSvg.setAttribute("viewBox", "0 0 24 24");
    officeSvg.setAttribute("fill", "none");
    officeSvg.setAttribute("stroke", "white");
    officeSvg.setAttribute("stroke-width", "2.5");
    officeSvg.setAttribute("stroke-linecap", "round");
    officeSvg.setAttribute("stroke-linejoin", "round");
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("d", "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z");
    const svgPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    svgPolyline.setAttribute("points", "9 22 9 12 15 12 15 22");
    officeSvg.appendChild(svgPath);
    officeSvg.appendChild(svgPolyline);
    officeInner.appendChild(officeSvg);
    officeEl.appendChild(officeInner);

    const officePopupContent = document.createElement("div");
    const officeTitle = document.createElement("div");
    officeTitle.style.cssText = "font-size:11px;font-weight:600;color:#3b82f6;";
    officeTitle.textContent = "Quai Zurich Campus";
    const officeSubtitle = document.createElement("div");
    officeSubtitle.style.cssText = "font-size:10px;color:#94a3b8;";
    officeSubtitle.textContent = "Mythenquai — Your office";
    officePopupContent.appendChild(officeTitle);
    officePopupContent.appendChild(officeSubtitle);

    const officePopup = new maplibregl.Popup({ offset: 18, closeButton: false })
      .setDOMContent(officePopupContent);

    new maplibregl.Marker({ element: officeEl })
      .setLngLat([OFFICE_COORDS.lng, OFFICE_COORDS.lat])
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
      const color = VENUE_TYPE_COLORS[venue.type];
      const el = document.createElement("div");
      el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.15s;box-shadow:0 0 6px ${color}40;`;
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.4)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const neighborhoodName = NEIGHBORHOODS.find((n) => n.id === venue.neighborhoodId)?.name ?? "";

      // Build popup DOM safely (no innerHTML / setHTML)
      const popupRoot = document.createElement("div");
      popupRoot.style.cssText = "font-family:system-ui;padding:2px;";

      const headerRow = document.createElement("div");
      headerRow.style.cssText = "display:flex;align-items:center;gap:4px;";

      const colorDot = document.createElement("div");
      colorDot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;`;
      headerRow.appendChild(colorDot);

      const typeLabel = document.createElement("span");
      typeLabel.style.cssText = `font-size:10px;color:${color};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;`;
      typeLabel.textContent = VENUE_TYPE_SHORT_LABELS[venue.type];
      headerRow.appendChild(typeLabel);

      if (venue.rating) {
        const ratingSpan = document.createElement("span");
        ratingSpan.style.cssText = "color:#fbbf24;font-size:10px;margin-left:6px;";
        ratingSpan.textContent = `★ ${venue.rating}`;
        headerRow.appendChild(ratingSpan);
      }

      popupRoot.appendChild(headerRow);

      const nameDiv = document.createElement("div");
      nameDiv.style.cssText = "font-size:12px;font-weight:600;color:#e2e8f0;margin-top:4px;";
      nameDiv.textContent = venue.name;
      popupRoot.appendChild(nameDiv);

      const addressDiv = document.createElement("div");
      addressDiv.style.cssText = "font-size:10px;color:#64748b;margin-top:1px;";
      addressDiv.textContent = `${neighborhoodName} — ${venue.address}`;
      popupRoot.appendChild(addressDiv);

      if (venue.monthlyPrice) {
        const priceDiv = document.createElement("div");
        priceDiv.style.cssText = "font-size:10px;color:#94a3b8;margin-top:2px;";
        priceDiv.textContent = `${formatCHF(venue.monthlyPrice)}/mo`;
        popupRoot.appendChild(priceDiv);
      }

      if (venue.personalNote) {
        const noteDiv = document.createElement("div");
        noteDiv.style.cssText = "font-size:10px;color:#8094a8;margin-top:4px;font-style:italic;max-width:200px;";
        noteDiv.textContent = venue.personalNote;
        popupRoot.appendChild(noteDiv);
      }

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false, maxWidth: "240px" })
        .setDOMContent(popupRoot);

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
