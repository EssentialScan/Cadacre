import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { rankTowns } from "@/lib/rankTowns";
import type { HazardFlag } from "@/data/towns";

export const runtime = "nodejs";

const DISCLAIMER =
  "Cadacre provides general information based on public data (ABS, SQM Research, NSW RFS, NSW SES, and other public sources) and is not personalised financial, investment, or legal advice. Cadacre is not a licensed financial advisor, real estate agency, or lending platform. Bushfire and flood indicators are Cadacre's own town-level characterization, derived from published state emergency service mapping and disaster-declaration history — neither NSW RFS nor NSW SES issues a single official Low/Moderate/High rating per town, and these figures are not a property-specific assessment. Always do your own research, verify the exact address independently (including the NSW RFS Bush Fire Prone Land map and NSW SES flood data for that address), and consider speaking with a licensed professional before making an investment decision.";

const CHECKLIST = [
  "Confirm the exact address's bushfire and flood risk with the local council (e.g. a NSW Section 10.7 planning certificate) — the flags in this report are town-level only, not property-specific.",
  "Get a full building and pest inspection before exchanging contracts.",
  "Get insurance quotes before you commit — flood- or bushfire-exposed addresses can carry higher premiums or, in some cases, be difficult to insure.",
  "Verify the rental appraisal with two or three local property managers, not just the town's headline yield figure.",
  "Check the property's zoning and any publicly listed development applications nearby via the council planning portal.",
  "If buying strata or community title, review the body corporate records and recent levies.",
  "Speak with a licensed financial adviser, conveyancer, or solicitor before signing anything.",
];

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  meta: { fontSize: 9, color: "#555555", marginBottom: 16 },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1B2430",
    color: "#FAF7F0",
    padding: 6,
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#C9C2B4",
    padding: 6,
  },
  colTown: { width: "30%" },
  colFigure: { width: "17%" },
  colHazard: { width: "19%" },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1B2430",
  },
  infraTown: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginTop: 8 },
  infraLine: { fontSize: 9, color: "#2A2A28", marginTop: 2 },
  infraNone: { fontSize: 9, color: "#8a8578", marginTop: 2 },
  checklistItem: { flexDirection: "row", marginTop: 8 },
  checklistBox: {
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: "#1B2430",
    marginRight: 8,
    marginTop: 1.5,
  },
  checklistText: { fontSize: 9.5, color: "#2A2A28", flex: 1, lineHeight: 1.4 },
  disclaimer: { marginTop: 20, fontSize: 8, color: "#555555", lineHeight: 1.4 },
});

function money(value: number | null): string {
  if (value === null) return "unavailable";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "unavailable";
  return `${value.toFixed(1)}%`;
}

function hazardText(flag: HazardFlag): string {
  return flag.level ?? "Not mapped";
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (user.privateMetadata?.unlocked !== true) {
    return NextResponse.json({ error: "Report not unlocked." }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const budget = Number(searchParams.get("budget"));
  const targetYieldPct = Number(searchParams.get("yield"));

  if (!Number.isFinite(budget) || budget <= 0 || !Number.isFinite(targetYieldPct)) {
    return NextResponse.json({ error: "Invalid budget or yield." }, { status: 400 });
  }

  const ranked = rankTowns({ budget, targetYieldPct });
  const generatedDate = new Date().toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Cadacre Rentvesting Shortlist</Text>
        <Text style={styles.meta}>
          Generated {generatedDate} — budget {money(budget)}, target gross
          yield {pct(targetYieldPct)}. {ranked.length} town
          {ranked.length === 1 ? "" : "s"} matched.
        </Text>

        <View style={styles.headerRow}>
          <Text style={styles.colTown}>Town</Text>
          <Text style={styles.colFigure}>Median price</Text>
          <Text style={styles.colFigure}>Gross yield</Text>
          <Text style={styles.colFigure}>Vacancy rate</Text>
          <Text style={styles.colHazard}>Bushfire / Flood</Text>
        </View>

        {ranked.map(({ rank, town }) => (
          <View style={styles.row} key={town.id}>
            <Text style={styles.colTown}>
              {rank}. {town.name}, {town.state}
            </Text>
            <Text style={styles.colFigure}>{money(town.medianPrice.value)}</Text>
            <Text style={styles.colFigure}>{pct(town.grossYieldPct.value)}</Text>
            <Text style={styles.colFigure}>{pct(town.vacancyRatePct.value)}</Text>
            <Text style={styles.colHazard}>
              {hazardText(town.bushfireRisk)} / {hazardText(town.floodRisk)}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Infrastructure notes</Text>
        <Text style={{ fontSize: 8.5, color: "#555555" }}>
          Publicly announced projects near each town, sourced from state
          budget papers, Infrastructure Australia, or council websites.
          Town-level only — not a guarantee of timeline or delivery.
        </Text>
        {ranked.map(({ town }) => (
          <View key={town.id} wrap={false}>
            <Text style={styles.infraTown}>
              {town.name}, {town.state}
            </Text>
            {town.infrastructureProjects.length > 0 ? (
              town.infrastructureProjects.map((project, i) => (
                <Text style={styles.infraLine} key={i}>
                  &bull; {project.text}
                </Text>
              ))
            ) : (
              <Text style={styles.infraNone}>
                No publicly announced project on file for this town.
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Before you proceed</Text>
        <Text style={{ fontSize: 8.5, color: "#555555" }}>
          This report ranks towns, not properties. Before acting on it,
          verify these independently for the specific address you&apos;re
          considering.
        </Text>
        {CHECKLIST.map((item, i) => (
          <View style={styles.checklistItem} key={i}>
            <View style={styles.checklistBox} />
            <Text style={styles.checklistText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cadacre-shortlist.pdf"',
    },
  });
}
