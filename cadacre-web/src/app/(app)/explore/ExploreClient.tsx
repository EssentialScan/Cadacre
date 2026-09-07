"use client";

import { useState, useMemo } from "react";
import { NationalAssetMap } from "@/components/NationalAssetMap";
import { AssetMapItem } from "@/components/NationalAssetMap";

interface ExploreClientProps {
  assets: AssetMapItem[];
}

export function ExploreClient({ assets }: ExploreClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedReits, setSelectedReits] = useState<string[]>([]);

  // Get unique property types and REITs for filters
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    assets.forEach(a => {
      if (a.propertyType) types.add(a.propertyType);
    });
    return Array.from(types).sort();
  }, [assets]);

  const uniqueReits = useMemo(() => {
    const reits = new Set<string>();
    assets.forEach(a => {
      if (a.reitTicker) reits.add(a.reitTicker);
    });
    return Array.from(reits).sort();
  }, [assets]);

  // Filter assets based on selections
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchType = selectedTypes.length === 0 || (asset.propertyType && selectedTypes.includes(asset.propertyType));
      const matchReit = selectedReits.length === 0 || (asset.reitTicker && selectedReits.includes(asset.reitTicker));
      return matchType && matchReit;
    });
  }, [assets, selectedTypes, selectedReits]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleReit = (reit: string) => {
    setSelectedReits(prev => 
      prev.includes(reit) ? prev.filter(r => r !== reit) : [...prev, reit]
    );
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] relative w-full">
      <NationalAssetMap 
        assets={filteredAssets} 
        uniqueTypes={uniqueTypes}
        uniqueReits={uniqueReits}
        selectedTypes={selectedTypes}
        selectedReits={selectedReits}
        toggleType={toggleType}
        toggleReit={toggleReit}
      />
    </div>
  );
}
