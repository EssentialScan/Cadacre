"use client";

import { useEffect, useState } from "react";

type NearbyData = {
  address: string;
  locationName: string;
  postcode: string | null;
  buildings: number;
  addressedBuildings: number;
  places: { name?: string; type?: string }[];
  radiusMetres: number;
  coverage: string;
  nearestBuilding: { distanceMetres: number; type: string; address: string | null } | null;
  source: string;
};

export type NearbyResearchData = Omit<NearbyData, "locationKey">;

export function NearbyContext({
  lat,
  lng,
  onLocationResolved,
  onContextResolved,
}: {
  lat: number;
  lng: number;
  onLocationResolved?: (location: { name: string; address: string; postcode: string | null }) => void;
  onContextResolved?: (context: NearbyResearchData) => void;
}) {
  const locationKey = `${lat},${lng}`;
  const [data, setData] = useState<(NearbyData & { locationKey: string }) | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/nearby?lat=${lat}&lng=${lng}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Nearby lookup failed");
        return response.json() as Promise<NearbyData>;
      })
      .then((result) => {
        setData({ ...result, locationKey });
        onLocationResolved?.({ name: result.locationName, address: result.address, postcode: result.postcode });
        onContextResolved?.(result);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setErrorKey(locationKey);
      });
    return () => controller.abort();
  }, [lat, lng, locationKey, onLocationResolved, onContextResolved]);

  const currentData = data?.locationKey === locationKey ? data : null;
  const currentError = errorKey === locationKey;

  return (
    <section className="mt-6 border-t border-faded-rule pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-ink-navy">Nearby mapped context</h3>
        <span className="font-mono-figure text-[10px] uppercase tracking-wide text-charcoal/40">{data?.radiusMetres ? `${data.radiusMetres / 1000} km radius` : "checking coverage"}</span>
      </div>
      {!currentData && !currentError && <p className="mt-2 text-sm text-charcoal/50">Reading the nearby map record…</p>}
      {currentError && <p className="mt-2 text-sm text-charcoal/50">Nearby map data is temporarily unavailable.</p>}
      {currentData && (
        <>
          <p className="mt-2 text-xs leading-relaxed text-charcoal/60">{currentData.address}</p>
          <p className="mt-1 font-mono-figure text-[10px] text-charcoal/40">PIN {lat.toFixed(6)}, {lng.toFixed(6)}</p>
          {currentData.nearestBuilding && (
            <div className="mt-4 border border-deep-forest/30 bg-deep-forest/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-base font-semibold text-ink-navy">Mapped structure at this pin</p>
                <span className="font-mono-figure text-[10px] text-deep-forest">{currentData.nearestBuilding.distanceMetres}m away</span>
              </div>
              <p className="mt-2 text-xs text-charcoal/65">
                {currentData.nearestBuilding.address || `${currentData.nearestBuilding.type} footprint`}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-charcoal/50">This confirms a mapped structure nearby. It does not provide ownership, condition, bedrooms, sale price, or a valuation.</p>
            </div>
          )}
          {currentData.coverage === "No mapped features found" && (
            <p className="mt-3 border border-survey-brass/40 bg-survey-brass/10 p-3 text-xs leading-relaxed text-charcoal/70">
              This area has sparse OpenStreetMap coverage. Zero means no mapped
              features were returned, not that the area has no properties.
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="border border-faded-rule bg-white/30 p-3">
              <p className="font-mono-figure text-xl text-ink-navy">{currentData.buildings}</p>
              <p className="mt-1 text-[11px] text-charcoal/60">mapped buildings</p>
            </div>
            <div className="border border-faded-rule bg-white/30 p-3">
              <p className="font-mono-figure text-xl text-ink-navy">{currentData.addressedBuildings}</p>
              <p className="mt-1 text-[11px] text-charcoal/60">addressed buildings</p>
            </div>
          </div>
          {currentData.places.length > 0 && (
            <ul className="mt-4 space-y-2">
              {currentData.places.map((place) => (
                <li key={`${place.type}-${place.name}`} className="flex justify-between gap-3 text-xs text-charcoal/75">
                  <span>{place.name}</span><span className="text-charcoal/40">{place.type}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[10px] text-charcoal/40">Map context source: {currentData.source}. Building footprints are not property listings or valuations.</p>
        </>
      )}
    </section>
  );
}