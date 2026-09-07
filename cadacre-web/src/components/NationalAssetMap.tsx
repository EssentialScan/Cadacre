"use client";

import { useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import Map, { Marker, Popup, NavigationControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Lock } from "lucide-react";
import Link from "next/link";
export interface AssetMapItem {
  id: string;
  reitTicker: string;
  address: string;
  suburb: string | null;
  state?: string | null;
  lat: number | null;
  lng: number | null;
  propertyType: string | null;
  bookValue: number | null;
}

interface NationalAssetMapProps {
  assets: AssetMapItem[];
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  isLockedSample?: boolean;
}

export function NationalAssetMap({ assets, initialViewState, isLockedSample = false }: NationalAssetMapProps) {
  const [popupInfo, setPopupInfo] = useState<AssetMapItem | null>(null);
  console.log("NationalAssetMap rendered with assets:", assets);

  const pins = useMemo(
    () =>
      assets.map((asset, index) => {
        // Skip markers without lat/lng
        if (asset.lat == null || asset.lng == null) return null;
        
        return (
          <Marker
            key={`marker-${index}`}
            longitude={asset.lng}
            latitude={asset.lat}
          anchor="bottom"
          onClick={(e: any) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(asset);
          }}
        >
          <div className="cursor-pointer group relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-blue rounded-full opacity-20 group-hover:opacity-40 group-hover:scale-150 transition-all duration-300"></div>
            <MapPin className="text-brand-blue fill-white relative z-10 drop-shadow-md" size={32} strokeWidth={1.5} />
          </div>
        </Marker>
      );
    }),
    [assets]
  );

  const formatCurrency = (val: number | null) => {
    if (val == null) return "-";
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const defaultViewState = {
    longitude: 151.2093, // Sydney CBD
    latitude: -33.8688,
    zoom: 10,
  };

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (!MAPTILER_KEY) {
    return (
      <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/50 rounded-xl">
        <MapPin className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">MapTiler Key Required</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Please add <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_MAPTILER_KEY</code> to your .env.local file to render the interactive map. You can get a free one from maptiler.com.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, borderRadius: "inherit" }}>
      <Map
        initialViewState={initialViewState || defaultViewState}
        maxBounds={[
          [110.0, -45.0], // Southwest coordinates (approximate Australia bounds)
          [155.0, -9.0]   // Northeast coordinates
        ]}
        mapStyle={`https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`}
        style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      >
        <NavigationControl position="top-right" />
        {pins}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.lng)}
          latitude={Number(popupInfo.lat)}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          className="rounded-xl overflow-hidden shadow-premium"
          maxWidth="300px"
        >
          <div className="p-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {popupInfo.reitTicker}
              </span>
              <span className="text-xs font-medium text-brand-blue truncate">
                {popupInfo.propertyType}
              </span>
            </div>
            <h4 className="font-display font-bold text-foreground text-sm mb-1 leading-tight">
              {popupInfo.address}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {popupInfo.suburb}{popupInfo.state ? `, ${popupInfo.state}` : ""}
            </p>
            <div className="border-t border-border pt-2 mt-2 flex justify-between items-end">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Book Value</span>
              {isLockedSample ? (
                <Link href="/explore" className="group flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded transition-colors cursor-pointer">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-700">Premium Only</span>
                </Link>
              ) : (
                <span className="font-mono-figure font-bold text-foreground text-sm">
                  {formatCurrency(popupInfo.bookValue)}
                </span>
              )}
            </div>
          </div>
        </Popup>
      )}
    </Map>
    </div>
  );
}
