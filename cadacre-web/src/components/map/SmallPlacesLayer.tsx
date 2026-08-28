"use client";

import { useEffect, useState } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Town } from "@/data/towns";

type SmallPlace = { id: number; name: string; type: string; lat: number; lng: number };

const smallPlaceIcon = L.divIcon({
  className: "",
  html: '<span class="small-place-dot"></span>',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

export function SmallPlacesLayer({ towns }: { towns: Town[] }) {
  const map = useMap();
  const [places, setPlaces] = useState<SmallPlace[]>([]);
  const [zoom, setZoom] = useState(map.getZoom());
  const [mapCenter, setMapCenter] = useState(() => map.getCenter());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
    moveend: () => setMapCenter(map.getCenter()),
  });

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => fetch(`/api/places?lat=${mapCenter.lat}&lng=${mapCenter.lng}`)
      .then((response) => response.json() as Promise<{ places?: SmallPlace[] }>)
      .then((result) => {
        if (!cancelled) {
          const townNames = new Set(towns.map((town) => town.name.toLowerCase()));
          setPlaces(
            (result.places ?? []).filter(
              (place) =>
                !townNames.has(place.name.toLowerCase()) &&
                ["village", "hamlet", "locality", "isolated_dwelling"].includes(place.type)
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) setPlaces([]);
      }), 500);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [map, mapCenter.lat, mapCenter.lng, towns]);

  const visiblePlaces = places
          .filter((place) => map.getBounds().contains([place.lat, place.lng]))
        .slice(0, zoom < 8 ? 12 : 35);
  return (
    <>
      {visiblePlaces.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]} icon={smallPlaceIcon} interactive={false}>
          <Tooltip permanent direction="right" offset={[7, 0]} className="small-place-tooltip">
            <span className="small-place-label">
              <strong>{place.name}</strong>
              <small>Market record unavailable</small>
            </span>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}