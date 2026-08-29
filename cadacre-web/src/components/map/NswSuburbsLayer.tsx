"use client";

import { useMemo, useState } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { NswSuburb } from "@/data";
import { PriceTrendChart } from "@/components/dashboard/PriceTrendChart";

// Full NSW suburb coverage (~4,500 localities, ABS SAL boundaries) beyond
// the curated Town[] dataset — see AGENTS.md §5h. Rendered as light dots,
// viewport-and-zoom capped the same way SmallPlacesLayer.tsx already caps
// its OSM-sourced places, since a few thousand individual DOM markers
// would not perform well otherwise. Clicking one opens a popup with the
// suburb's real PSI-derived sale-price growth chart, where one exists.
const suburbDotIcon = L.divIcon({
  className: "",
  html: '<span class="small-place-dot"></span>',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

export function NswSuburbsLayer({ suburbs }: { suburbs: NswSuburb[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [bounds, setBounds] = useState(() => map.getBounds());

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
      setBounds(map.getBounds());
    },
    moveend: () => setBounds(map.getBounds()),
  });

  const visibleSuburbs = useMemo(() => {
    if (zoom < 9) return [];
    const inView = suburbs.filter((s) => bounds.contains([s.coordinates.lat, s.coordinates.lng]));
    const cap = zoom < 11 ? 80 : zoom < 13 ? 250 : 600;
    return inView.slice(0, cap);
  }, [suburbs, bounds, zoom]);

  return (
    <>
      {visibleSuburbs.map((suburb) => (
        <Marker key={suburb.id} position={[suburb.coordinates.lat, suburb.coordinates.lng]} icon={suburbDotIcon}>
          <Popup>
            <strong>{suburb.name}</strong>
            <br />
            <small>Not in Cadacre&apos;s curated price/yield dataset yet.</small>
            {suburb.growthHistory && suburb.growthHistory.length >= 2 ? (
              <div style={{ width: 220, marginTop: 6 }}>
                <PriceTrendChart
                  history={suburb.growthHistory.map((h) => ({ year: h.year, value: h.medianSalePrice }))}
                  valueLabel="Median sale price"
                />
                <p style={{ fontSize: 10, color: "rgba(27,29,33,0.5)", marginTop: 4 }}>
                  NSW Valuer General bulk sale-price records — all residential dwellings combined.
                  Free dashboard only, per that data source&apos;s non-commercial licence terms.
                </p>
              </div>
            ) : (
              <p style={{ fontSize: 11, marginTop: 4 }}>Not enough public sale-price data for a trend.</p>
            )}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
