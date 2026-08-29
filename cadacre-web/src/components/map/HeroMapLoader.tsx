"use client";

import dynamic from "next/dynamic";
import type { Town } from "@/data/towns";

const HeroMap = dynamic(() => import("@/components/map/HeroMap").then((m) => m.HeroMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-white/30">
      <span className="font-mono-figure text-xs text-charcoal/50">Loading map…</span>
    </div>
  ),
});

export function HeroMapLoader({ towns }: { towns: Town[] }) {
  return <HeroMap towns={towns} />;
}
