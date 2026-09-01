import type { Town } from "@/data/towns";

// Cadacre subscriber feature — composes fields already shown individually in the
// drawer (employment, amenities, climate, population, crime) into one
// synthesized-but-still-descriptive summary. Deliberately no scoring or
// "recommended for you" framing (AGENTS.md §4) — just plain sentences
// stating what's on file, same "Not available" convention as the rest of
// the drawer. Explicitly excludes psiGrowthHistory (licence-restricted).
export function RelocationReadinessPack({ town }: { town: Town }) {
  const lines: string[] = [];

  if (town.employment?.value) {
    lines.push(
      `Unemployment rate ${town.employment.value.unemploymentRatePct.toFixed(1)}%, labour force participation ${town.employment.value.participationRatePct.toFixed(1)}% (LGA, as of ${town.employment.asOf ?? "not stated"}).`
    );
  }
  if (town.amenities?.value) {
    lines.push(
      `${town.amenities.value.schools} school${town.amenities.value.schools === 1 ? "" : "s"}, ${town.amenities.value.hospitals} hospital${town.amenities.value.hospitals === 1 ? "" : "s"}, and ${town.amenities.value.supermarkets} supermarket${town.amenities.value.supermarkets === 1 ? "" : "s"} within ${town.amenities.value.radiusKm}km.`
    );
    lines.push(
      `${town.amenities.value.gyms} gym${town.amenities.value.gyms === 1 ? "" : "s"}, ${town.amenities.value.parks} park${town.amenities.value.parks === 1 ? "" : "s"}, and ${town.amenities.value.pharmacies} pharmac${town.amenities.value.pharmacies === 1 ? "y" : "ies"} within ${town.amenities.value.radiusKm}km.`
    );
  }
  if (town.transportProximity?.value) {
    const { nearestMainRoadKm, nearestRailStationKm, nearestAirportKm } = town.transportProximity.value;
    const parts: string[] = [];
    if (nearestMainRoadKm !== null) parts.push(`nearest main road ${nearestMainRoadKm}km away`);
    if (nearestRailStationKm !== null) parts.push(`nearest rail station ${nearestRailStationKm}km away`);
    if (nearestAirportKm !== null) parts.push(`nearest airport ${nearestAirportKm}km away`);
    if (parts.length > 0) {
      lines.push(`Transport: ${parts.join(", ")}.`);
    }
  }
  if (town.climate?.value) {
    lines.push(
      `Average summer max ${town.climate.value.avgSummerMaxC.toFixed(1)}°C, winter min ${town.climate.value.avgWinterMinC.toFixed(1)}°C, ${town.climate.value.annualRainfallMm.toLocaleString("en-AU")}mm rain a year.`
    );
  }
  if (town.population?.value) {
    lines.push(
      `LGA population ${town.population.value.estimate.toLocaleString("en-AU")}${
        town.population.value.growthPct !== undefined
          ? `, ${town.population.value.growthPct >= 0 ? "+" : ""}${town.population.value.growthPct.toFixed(1)}% over 5 years`
          : ""
      }.`
    );
  }
  if (town.crimeRate?.value) {
    lines.push(
      `${town.crimeRate.value.propertyOffencesPer100k.toLocaleString("en-AU")} property offences per 100k residents (${town.crimeRate.value.period}).`
    );
  }

  return (
    <div className="mt-6 border border-faded-rule">
      <div className="border-b border-faded-rule px-4 py-3">
        <span className="font-display text-sm font-semibold text-ink-navy">
          Relocation readiness pack <span className="text-charcoal/40">(Subscriber)</span>
        </span>
      </div>
      <div className="p-4">
        {lines.length > 0 ? (
          <ul className="space-y-2 text-sm leading-relaxed text-charcoal/75">
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-charcoal/50">Not enough public data on file for this town.</p>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-charcoal/50">
          General public-data summary, not a relocation recommendation — every figure above is
          already shown individually in this panel; this section just gathers them in one place
          for a &quot;should I actually move here&quot; read.
        </p>
      </div>
    </div>
  );
}
