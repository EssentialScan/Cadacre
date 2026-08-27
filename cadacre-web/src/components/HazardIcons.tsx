import type { HazardFlag, HazardLevel } from "@/data/towns";

const LEVEL_COLOR: Record<HazardLevel, string> = {
  Low: "text-deep-forest",
  Moderate: "text-survey-brass",
  High: "text-survey-brass",
  "Very High": "text-red-700",
  Extreme: "text-red-700",
};

function hazardTitle(kind: "Bushfire" | "Flood", flag: HazardFlag): string {
  if (!flag.level) return `${kind} risk: not mapped (no credible source found)`;
  const sourceBit = flag.source ? ` — source: ${flag.source}${flag.asOf ? `, ${flag.asOf}` : ""}` : "";
  return `${kind} risk (town-level, Cadacre's own characterization — not an official agency rating): ${flag.level}${sourceBit}`;
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 1.5c1 2 3.2 3.1 3.2 6a3.2 3.2 0 0 1-6.4 0c0-1 .4-1.7.9-2.3.1.9.6 1.4 1.1 1.4.6 0 .8-.5.6-1.2C6.9 4 7.2 2.7 8 1.5Z" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 1.8s4 4.6 4 7.5a4 4 0 1 1-8 0c0-2.9 4-7.5 4-7.5Z" />
    </svg>
  );
}

export function HazardIcons({
  bushfireRisk,
  floodRisk,
  className,
}: {
  bushfireRisk: HazardFlag;
  floodRisk: HazardFlag;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span title={hazardTitle("Bushfire", bushfireRisk)} className="inline-flex">
        <FlameIcon
          className={`h-4 w-4 ${bushfireRisk.level ? LEVEL_COLOR[bushfireRisk.level] : "text-charcoal/25"}`}
        />
      </span>
      <span title={hazardTitle("Flood", floodRisk)} className="inline-flex">
        <DropletIcon
          className={`h-4 w-4 ${floodRisk.level ? LEVEL_COLOR[floodRisk.level] : "text-charcoal/25"}`}
        />
      </span>
    </div>
  );
}
