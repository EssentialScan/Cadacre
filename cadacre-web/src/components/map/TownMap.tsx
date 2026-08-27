"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import type { Town } from "@/data/towns";

// Custom brand pin — avoids Leaflet's default marker icon, which breaks
// under bundlers since its image paths are relative to the CSS file.
const pinIcon = L.divIcon({
  className: "",
  html: `
    <svg width="28" height="28" viewBox="0 0 16 16" style="filter: drop-shadow(0 3px 4px rgba(18,22,28,0.35))">
      <path
        d="M8 14.5S13 9.8 13 6.3a5 5 0 1 0-10 0C3 9.8 8 14.5 8 14.5Z"
        fill="#c6992f"
        stroke="#12161c"
        stroke-width="1"
        stroke-linejoin="round"
      />
      <circle cx="8" cy="6.3" r="1.7" fill="#12161c" />
    </svg>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 26],
  tooltipAnchor: [0, -20],
});

// Roughly centers the visible NSW regional towns in this dataset.
const NSW_CENTER: [number, number] = [-32.5, 150.0];

export function TownMap({
  towns,
  onSelectTown,
}: {
  towns: Town[];
  onSelectTown: (townId: string) => void;
}) {
  return (
    <MapContainer
      center={NSW_CENTER}
      zoom={6}
      scrollWheelZoom={false}
      className="h-[420px] w-full md:h-[520px]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {towns.map((town) => (
        <Marker
          key={town.id}
          position={[town.coordinates.lat, town.coordinates.lng]}
          icon={pinIcon}
          eventHandlers={{ click: () => onSelectTown(town.id) }}
        >
          <Tooltip direction="top" offset={[0, -20]} className="town-map-tooltip">
            {town.name}, {town.state}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
