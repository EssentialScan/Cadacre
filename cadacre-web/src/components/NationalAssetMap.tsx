"use client";

import { useState, useMemo } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
export interface AssetMapItem {
  id: string;
  reitTicker: string;
  address: string;
  suburb: string | null;
  state: string;
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
}

export function NationalAssetMap({ assets, initialViewState }: NationalAssetMapProps) {
  const [popupInfo, setPopupInfo] = useState<AssetMapItem | null>(null);

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

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/50 rounded-xl">
        <MapPin className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">Mapbox Token Required</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Please add <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your .env.local file to render the interactive map.
        </p>
      </div>
    );
  }

  return (
    <Map
      initialViewState={initialViewState || defaultViewState}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
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
              {popupInfo.suburb}, {popupInfo.state}
            </p>
            <div className="border-t border-border pt-2 mt-2 flex justify-between items-end">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Book Value</span>
              <span className="font-mono-figure font-bold text-foreground text-sm">
                {formatCurrency(popupInfo.bookValue)}
              </span>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
