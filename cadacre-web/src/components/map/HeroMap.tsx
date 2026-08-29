"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl } from "react-leaflet";
import { useRouter } from "next/navigation";
import type { Town } from "@/data/towns";

// Deliberately lighter than map/TownMap.tsx: no NswSuburbsLayer/SmallPlacesLayer
// (the ~1.4MB generated dataset + OSM-place layer built for the full dashboard),
// no filter props, no drawer wiring — just real curated towns, a brand pin, and
// a click-through into the real dashboard map. See the hero-map plan for why.
const pinIcon = L.divIcon({
  className: "",
  html: `
    <svg width="24" height="24" viewBox="0 0 16 16" style="filter: drop-shadow(0 3px 4px rgba(18,22,28,0.35))">
      <path
        d="M8 14.5S13 9.8 13 6.3a5 5 0 1 0-10 0C3 9.8 8 14.5 8 14.5Z"
        fill="var(--survey-brass)"
        stroke="var(--ink-navy)"
        stroke-width="1"
        stroke-linejoin="round"
      />
      <circle cx="8" cy="6.3" r="1.7" fill="var(--ink-navy)" />
    </svg>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 22],
  tooltipAnchor: [0, -18],
});

const NSW_CENTER: [number, number] = [-32.5, 150.0];

export function HeroMap({ towns }: { towns: Town[] }) {
  const router = useRouter();

  return (
    <MapContainer
      center={NSW_CENTER}
      zoom={5.5}
      minZoom={5}
      maxZoom={10}
      scrollWheelZoom
      zoomSnap={0.5}
      zoomControl={false}
      className="h-full w-full"
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {towns.map((town) => (
        <Marker
          key={town.id}
          position={[town.coordinates.lat, town.coordinates.lng]}
          icon={pinIcon}
          eventHandlers={{
            click: () => router.push("/dashboard"),
          }}
        >
          <Tooltip direction="top" offset={[0, -16]} className="town-map-tooltip">
            <span className="town-map-label">
              <strong>{town.name}</strong>
              <small>
                {town.medianPrice.value === null
                  ? "Median unavailable"
                  : `$${town.medianPrice.value.toLocaleString("en-AU")} median`}
              </small>
            </span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
