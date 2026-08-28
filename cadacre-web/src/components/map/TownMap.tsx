"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import type { Town } from "@/data/towns";
import { SmallPlacesLayer } from "@/components/map/SmallPlacesLayer";

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

const selectedPinIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border:3px solid #f6f2e9;border-radius:50%;background:#1f4741;box-shadow:0 2px 8px rgba(18,22,28,.5)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Roughly centers the visible NSW regional towns in this dataset.
const NSW_CENTER: [number, number] = [-32.5, 150.0];

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (event) => onMapClick?.(event.latlng.lat, event.latlng.lng) });
  return null;
}

export function TownMap({
  towns,
  budget,
  onMapClick,
  selectedLocation,
  selectedContextTown,
  fullScreen,
  onSelectTown,
}: {
  towns: Town[];
  budget?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  selectedContextTown?: Town | null;
  fullScreen?: boolean;
  onSelectTown: (townId: string) => void;
}) {
  return (
    <MapContainer
      center={NSW_CENTER}
      zoom={6}
      scrollWheelZoom={false}
      className={fullScreen ? "h-full min-h-[620px] w-full" : "h-[420px] w-full md:h-[520px]"}
    >
      <MapClickHandler onMapClick={onMapClick} />
      <SmallPlacesLayer towns={towns} />
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={selectedPinIcon}>
          <Popup>
            <strong>Selected location</strong>
            <br />
            {selectedContextTown ? (
              <>
                {selectedContextTown.name} area median: {selectedContextTown.medianPrice.value === null ? "not available" : `$${selectedContextTown.medianPrice.value.toLocaleString("en-AU")}`}
                <br />
                Gross yield: {selectedContextTown.grossYieldPct.value === null ? "not available" : `${selectedContextTown.grossYieldPct.value.toFixed(1)}%`}
              </>
            ) : "No Cadacre area benchmark mapped"}
            <br />
            <small>Area benchmark only, not this property&apos;s value.</small>
          </Popup>
        </Marker>
      )}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {towns.map((town) => (
        <Marker
          key={town.id}
          position={[town.coordinates.lat, town.coordinates.lng]}
          icon={
            budget === undefined || town.medianPrice.value === null || town.medianPrice.value <= budget
              ? pinIcon
              : L.divIcon({
                  className: "opacity-40 grayscale",
                  html: pinIcon.options.html,
                  iconSize: [28, 28],
                  iconAnchor: [14, 26],
                  tooltipAnchor: [0, -20],
                })
          }
          eventHandlers={{
            click: (event) => {
              L.DomEvent.stopPropagation(event.originalEvent);
              onSelectTown(town.id);
            },
          }}
        >
          <Tooltip permanent direction="top" offset={[0, -20]} className="town-map-tooltip">
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
