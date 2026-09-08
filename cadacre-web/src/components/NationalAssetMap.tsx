"use client";

import { useState, useMemo } from "react";
import Map, { Marker, Popup, NavigationControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Lock, Filter, X, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AssetMapItem {
  id: string;
  reitTicker: string;
  address: string;
  suburb: string | null;
  lat: number | null;
  lng: number | null;
  propertyType: string | null;
  bookValue: number | null;
  occupancyRate?: number | null;
  wale?: number | null;
  capRate?: number | null;
  gla?: number | null;
  majorTenant?: string | null;
}

interface NationalAssetMapProps {
  assets: AssetMapItem[];
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  isLockedSample?: boolean;
  uniqueTypes?: string[];
  uniqueReits?: string[];
  selectedTypes?: string[];
  selectedReits?: string[];
  toggleType?: (t: string) => void;
  toggleReit?: (r: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  "Retail": "text-orange-500",
  "Office": "text-brand-blue",
  "Industrial": "text-emerald-500",
  "Diversified": "text-purple-500",
  "Specialized": "text-pink-500",
};

const TYPE_BG_COLORS: Record<string, string> = {
  "Retail": "bg-orange-500",
  "Office": "bg-brand-blue",
  "Industrial": "bg-emerald-500",
  "Diversified": "bg-purple-500",
  "Specialized": "bg-pink-500",
};

export function NationalAssetMap({ 
  assets, 
  initialViewState, 
  isLockedSample = false,
  uniqueTypes = [],
  uniqueReits = [],
  selectedTypes = [],
  selectedReits = [],
  toggleType,
  toggleReit
}: NationalAssetMapProps) {
  const [popupInfo, setPopupInfo] = useState<AssetMapItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"type" | "reit">("type");

  const pins = useMemo(
    () =>
      assets.map((asset, index) => {
        if (asset.lat == null || asset.lng == null) return null;
        
        const typeColorClass = (asset.propertyType && TYPE_COLORS[asset.propertyType]) || "text-slate-500";
        const typeBgClass = (asset.propertyType && TYPE_BG_COLORS[asset.propertyType]) || "bg-slate-500";

        return (
          <Marker
            key={`marker-${asset.id || index}`}
            longitude={asset.lng}
            latitude={asset.lat}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(asset);
            }}
          >
            <div className="cursor-pointer group relative">
              <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full opacity-20 group-hover:opacity-40 group-hover:scale-150 transition-all duration-300", typeBgClass)}></div>
              <MapPin className={cn("fill-white relative z-10 drop-shadow-md transition-transform group-hover:-translate-y-1", typeColorClass)} size={32} strokeWidth={1.5} />
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

  const totalValue = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.bookValue || 0), 0);
  }, [assets]);

  const defaultViewState = {
    longitude: 133.7751,
    latitude: -25.2744,
    zoom: 4,
  };

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (!MAPTILER_KEY) {
    return (
      <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/50 rounded-xl">
        <MapPin className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">MapTiler Key Required</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Please add <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_MAPTILER_KEY</code> to your .env.local file to render the interactive map.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, borderRadius: "inherit" }}>
      <Map
        initialViewState={initialViewState || defaultViewState}
        maxBounds={[
          [110.0, -45.0],
          [155.0, -9.0]
        ] as any}
        mapStyle={`https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`}
        style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      >
        <NavigationControl position="top-right" />
        {pins}

        {popupInfo && isLockedSample && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.lng)}
            latitude={Number(popupInfo.lat)}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="rounded-xl overflow-hidden shadow-sm z-50"
            maxWidth="300px"
          >
            <div className="p-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {popupInfo.reitTicker}
                </span>
                <span className={cn("text-xs font-bold truncate", (popupInfo.propertyType && TYPE_COLORS[popupInfo.propertyType]) || "text-slate-500")}>
                  {popupInfo.propertyType || "Unknown"}
                </span>
              </div>
              <h4 className="font-display font-bold text-foreground text-sm mb-1 leading-tight">
                {popupInfo.address}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                {popupInfo.suburb}
              </p>
              <div className="border-t border-border pt-2 mt-2 flex justify-between items-end">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Book Value</span>
                <Link href="/explore" className="group flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded transition-colors cursor-pointer">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-700">Premium Only</span>
                </Link>
              </div>
            </div>
          </Popup>
        )}

        {/* Sidebar Overlay for Property Details */}
        {popupInfo && !isLockedSample && (
          <div className="absolute right-6 top-6 bottom-6 w-96 bg-white shadow-md border border-slate-200 rounded-lg z-50 flex flex-col animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-600 border border-slate-200/60 shadow-sm">
                    {popupInfo.reitTicker}
                  </span>
                  <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm", (popupInfo.propertyType && TYPE_COLORS[popupInfo.propertyType]) || "text-slate-500")}>
                    {popupInfo.propertyType || "Unknown"}
                  </span>
                </div>
                <button 
                  onClick={() => setPopupInfo(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="font-display font-bold text-slate-900 text-2xl mb-3 leading-tight">
                {popupInfo.address}
              </h3>
              <p className="text-sm text-slate-500 mb-10 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {popupInfo.suburb} {popupInfo.state}
              </p>

              <div className="space-y-6">
                
                {/* Core Metrics Grid */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Financials & Leases</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm col-span-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Book Value</span>
                      <span className="font-mono-figure font-bold text-brand-blue text-2xl leading-none block">
                        {formatCurrency(popupInfo.bookValue)}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Cap Rate</span>
                      <span className="font-mono-figure font-bold text-slate-800 text-xl leading-none block">
                        {popupInfo.capRate ? `${popupInfo.capRate.toFixed(2)}%` : "-"}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Occupancy</span>
                      <span className="font-mono-figure font-bold text-slate-800 text-xl leading-none block">
                        {popupInfo.occupancyRate ? `${popupInfo.occupancyRate.toFixed(1)}%` : "-"}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">WALE</span>
                      <span className="font-mono-figure font-bold text-slate-800 text-xl leading-none block">
                        {popupInfo.wale ? `${popupInfo.wale.toFixed(1)} yrs` : "-"}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">GLA</span>
                      <span className="font-mono-figure font-bold text-slate-800 text-xl leading-none block">
                        {popupInfo.gla ? `${popupInfo.gla.toLocaleString()} sqm` : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Major Tenant */}
                {popupInfo.majorTenant && (
                  <div className="bg-brand-blue/5 rounded-lg p-4 border border-brand-blue/10">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue/70 block mb-1">Major Tenant</span>
                    <span className="font-display font-semibold text-brand-blue text-lg block">
                      {popupInfo.majorTenant}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Location Details</h4>
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">Latitude</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">{popupInfo.lat?.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">Longitude</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">{popupInfo.lng?.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Quick Actions</h4>
                  <div className="flex flex-col gap-3">
                    <Link href={`/reit/${popupInfo.reitTicker}`} className="w-full py-2.5 px-4 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue/90 transition-all text-center shadow-sm">
                      View REIT Profile
                    </Link>
                    <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-all text-center">
                      Add to Shortlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Filter Controls Overlay */}
        {!isLockedSample && toggleType && toggleReit && (
          <div className="absolute top-6 left-6 z-10 flex flex-col items-start gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white  px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all font-medium text-sm text-slate-700 hover:text-slate-900"
            >
              <Filter className="w-4 h-4 text-brand-blue" />
              {showFilters ? "Close Filters" : "Filter Assets"}
              {(selectedTypes.length > 0 || selectedReits.length > 0) && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-[10px] font-bold text-white">
                  {selectedTypes.length + selectedReits.length}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="bg-white  rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 w-[280px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex border-b border-slate-100">
                  <button 
                    onClick={() => setActiveFilterTab("type")}
                    className={cn("flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-colors", activeFilterTab === "type" ? "text-brand-blue border-b-2 border-brand-blue" : "text-slate-400 hover:text-slate-600")}
                  >
                    Asset Type
                  </button>
                  <button 
                    onClick={() => setActiveFilterTab("reit")}
                    className={cn("flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-colors", activeFilterTab === "reit" ? "text-brand-blue border-b-2 border-brand-blue" : "text-slate-400 hover:text-slate-600")}
                  >
                    REIT
                  </button>
                </div>
                
                <div className="p-2 max-h-[300px] overflow-y-auto">
                  {activeFilterTab === "type" ? (
                    uniqueTypes.map(type => (
                      <button 
                        key={type}
                        onClick={() => toggleType(type)}
                        className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                      >
                        <span className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <span className={cn("w-2 h-2 rounded-full", TYPE_BG_COLORS[type] || "bg-slate-400")}></span>
                          {type}
                        </span>
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", selectedTypes.includes(type) ? "bg-brand-blue border-brand-blue" : "border-slate-300 group-hover:border-slate-400")}>
                          {selectedTypes.includes(type) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    ))
                  ) : (
                    uniqueReits.map(reit => (
                      <button 
                        key={reit}
                        onClick={() => toggleReit(reit)}
                        className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                      >
                        <span className="text-sm text-slate-700 font-medium font-mono">
                          {reit}
                        </span>
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", selectedReits.includes(reit) ? "bg-brand-blue border-brand-blue" : "border-slate-300 group-hover:border-slate-400")}>
                          {selectedReits.includes(reit) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    ))
                  )}
                </div>
                
                {(selectedTypes.length > 0 || selectedReits.length > 0) && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button 
                      onClick={() => {
                        selectedTypes.forEach(t => toggleType(t));
                        selectedReits.forEach(r => toggleReit(r));
                      }}
                      className="w-full py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}



        {/* Summary Statistics Overlay */}
        {!isLockedSample && (
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-10 pointer-events-none">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col items-start min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Assets</span>
              <span className="font-display font-bold text-slate-900 text-3xl leading-none">
                {assets.length}
              </span>
            </div>
            
            {totalValue > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col items-start min-w-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Book Value</span>
                <span className="font-mono-figure font-bold text-brand-blue text-xl leading-none">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            )}
          </div>
        )}

      </Map>
    </div>
  );
}
