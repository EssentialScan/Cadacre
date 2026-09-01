import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { requireSubscriberApi } from "@/lib/apiAuth";
import { getSydneyMetroTowns } from "@/data";

export const runtime = "nodejs";

const DISCLAIMER =
  "This letter is general information based on public data (median rent figures sourced and dated per suburb) and is not legal advice. Cadacre is not a tenants' advocate, solicitor, or law firm. For a formal rent dispute, contact the NSW Rental Commissioner, the NSW Civil and Administrative Tribunal (NCAT), or a licensed tenants' advocacy service.";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.5 },
  title: { fontSize: 16, marginBottom: 16, fontFamily: "Helvetica-Bold" },
  paragraph: { marginBottom: 12 },
  disclaimer: { marginTop: 24, fontSize: 8, color: "#555555", lineHeight: 1.4 },
});

function money(value: number): string {
  return `$${value.toLocaleString("en-AU")}/week`;
}

export async function GET(request: NextRequest) {
  const gate = await requireSubscriberApi("The negotiation-letter generator");
  if ("response" in gate) return gate.response;

  const { searchParams } = request.nextUrl;
  const suburbId = searchParams.get("suburbId");
  const currentRent = Number(searchParams.get("currentRent"));
  const proposedRent = Number(searchParams.get("proposedRent"));

  if (!suburbId || !Number.isFinite(currentRent) || currentRent <= 0 || !Number.isFinite(proposedRent) || proposedRent <= 0) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const suburb = getSydneyMetroTowns().find((t) => t.id === suburbId);
  if (!suburb || suburb.medianRent.value === null) {
    return NextResponse.json({ error: "Suburb not found or missing a median rent figure." }, { status: 404 });
  }

  const increasePct = ((proposedRent - currentRent) / currentRent) * 100;
  const generatedDate = new Date().toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Re: Proposed rent increase</Text>
        <Text style={styles.paragraph}>Date: {generatedDate}</Text>
        <Text style={styles.paragraph}>
          I am writing regarding the proposed rent increase for my tenancy in {suburb.name},{" "}
          {suburb.state}, from {money(currentRent)} to {money(proposedRent)} — an increase of{" "}
          {increasePct >= 0 ? "+" : ""}
          {increasePct.toFixed(1)}%.
        </Text>
        <Text style={styles.paragraph}>
          For comparison, the current sourced median rent for {suburb.name} is{" "}
          {money(suburb.medianRent.value)}
          {suburb.medianRent.asOf ? ` (as of ${suburb.medianRent.asOf})` : ""}
          {suburb.medianRent.source ? `, source: ${suburb.medianRent.source}` : ""}. I would
          appreciate the opportunity to discuss this increase in light of that figure before it
          takes effect.
        </Text>
        <Text style={styles.paragraph}>
          I look forward to your response.
        </Text>

        <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cadacre-negotiation-letter.pdf"',
    },
  });
}
