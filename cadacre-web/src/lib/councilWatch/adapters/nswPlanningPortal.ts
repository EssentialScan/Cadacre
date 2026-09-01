import * as cheerio from "cheerio";
import type { CouncilSourceAdapter, ScrapedApplication } from "./types";
import { PLANNING_PORTAL_LGA_VALUES } from "./nswPlanningPortalLgaMap";
import suburbData from "@/data/generated/nswSuburbs.json";

// Real, live Phase 2 source (AGENTS.md §5m): the NSW Planning Portal's own
// public "DA Exhibitions" listing (planningportal.nsw.gov.au/daexhibitions),
// found and verified 2026-09-01 —
//  - no login, no API key, filterable by LGA via a plain GET query param
//    (a Drupal Views exposed filter), ~15,800 real DA records spanning
//    determined/on-exhibition/under-consideration statuses across every NSW
//    council that participates in the portal
//  - robots.txt doesn't disallow /daexhibitions or /daex/*
//  - the department's own copyright/disclaimer page licenses "all
//    department material available on this website" under CC BY 4.0, with
//    no bulk-download/scraping restriction and no non-commercial carve-out
//    — a materially different situation from Google News RSS (personal/
//    non-commercial only, ruled out in §5f) and NSW Valuer General PSI
//    (CC BY-NC-ND, dashboard-only per §5h)
// Coverage is genuinely uneven per council — some (Cessnock, Camden,
// Woollahra) publish plenty; some (Parramatta, Blacktown in a spot check)
// publish almost nothing through this particular portal, presumably
// because they run their own separate DA tracker. That's the source's own
// real coverage, reported as-is — never padded or guessed.
const BASE_URL = "https://www.planningportal.nsw.gov.au";
const LIST_PATH = "/daexhibitions";
const USER_AGENT = "Cadacre/1.0 (public planning-application research tool)";

// Bounds one cron run's request volume regardless of how many LGAs get
// watched — same "space requests out, cap the burst" lesson AGENTS.md §5e
// already learned the hard way against Overpass. A large LGA (Canterbury-
// Bankstown alone has 400+ pages at 9 results/page) is only ever partially
// synced per run; the ingest step's upsert-by-(source,externalId) means
// later runs pick up more of the backlog over time rather than losing it.
const MAX_PAGES_PER_LGA = 2;
const MAX_DETAIL_FETCHES_PER_RUN = 60;
const REQUEST_DELAY_MS = 200;

type SuburbRecord = { name: string };
const SUBURB_NAMES = new Set(
  (suburbData as SuburbRecord[]).map((s) => normalizeForMatch(s.name))
);

function normalizeForMatch(name: string): string {
  return name
    .toUpperCase()
    .replace(/\(NSW\)/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Real street addresses from this source come back as one run-on string
// with no delimiter between the street and the suburb, e.g.
// "24 North Avenue Cessnock 2325" — so the suburb is recovered by checking
// whether the words immediately before the trailing postcode match a real
// NSW locality name (longest phrase first), never guessed positionally.
function resolveSuburbFromAddress(address: string): string | undefined {
  const match = address.match(/^(.*\S)\s+(\d{4})\s*$/);
  if (!match) return undefined;
  const words = match[1].trim().split(/\s+/);
  for (let n = Math.min(3, words.length); n >= 1; n--) {
    const candidate = words.slice(-n).join(" ");
    if (SUBURB_NAMES.has(normalizeForMatch(candidate))) return candidate;
  }
  return undefined;
}

function extractPostcode(address: string): string | undefined {
  const match = address.match(/(\d{4})\s*$/);
  return match ? match[1] : undefined;
}

async function politeFetch(path: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, { headers: { "User-Agent": USER_AGENT } });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
  }
}

type ListRow = {
  pan?: string;
  daNumber?: string;
  applicationType?: string;
  title?: string;
  status?: string;
  detailPath?: string;
};

function parseListPage(html: string): ListRow[] {
  const $ = cheerio.load(html);
  const rows: ListRow[] = [];

  $(".card__content").each((_, el) => {
    const card = $(el);
    const row: ListRow = {};

    card.find(".row--small").each((__, r) => {
      const text = $(r).text().replace(/\s+/g, " ").trim();
      if (text.startsWith("PAN Number:")) row.pan = text.replace("PAN Number:", "").trim();
      else if (text.startsWith("DA Number:")) row.daNumber = text.replace("DA Number:", "").trim();
      else if (text.startsWith("Type:")) row.applicationType = text.replace("Type:", "").trim();
    });

    row.status = card.find(".tag").first().text().replace(/\s+/g, " ").trim() || undefined;
    row.title = card.find(".card__title").first().text().replace(/\s+/g, " ").trim() || undefined;
    row.detailPath = card.find(".field-node-link a[href]").first().attr("href") || undefined;

    if (row.pan && row.detailPath) rows.push(row);
  });

  return rows;
}

function parseDetailPage(html: string): { address?: string; decisionDate?: string } {
  const $ = cheerio.load(html);
  let address: string | undefined;
  let decisionDate: string | undefined;

  $(".row--small").each((_, el) => {
    const label = $(el).find("b").first().text().trim().toLowerCase();
    if (!label) return;
    if (label.includes("address")) {
      const value = $(el).find("div").last().text().replace(/\s+/g, " ").trim();
      if (value) address = value;
    } else if (label.includes("determination date")) {
      const iso = $(el).find("time").first().attr("datetime");
      if (iso) decisionDate = iso.slice(0, 10);
    }
  });

  return { address, decisionDate };
}

async function fetchLgaApplications(
  ourLgaKey: string,
  detailFetchBudget: { remaining: number }
): Promise<ScrapedApplication[]> {
  const drupalValue = PLANNING_PORTAL_LGA_VALUES[ourLgaKey];
  if (!drupalValue) return [];

  const results: ScrapedApplication[] = [];

  for (let page = 0; page < MAX_PAGES_PER_LGA; page++) {
    const qs = `?field_local_government_area_value=${encodeURIComponent(drupalValue)}${page > 0 ? `&page=${page}` : ""}`;
    const html = await politeFetch(`${LIST_PATH}${qs}`);
    if (!html) break;

    const rows = parseListPage(html);
    if (rows.length === 0) break;

    for (const row of rows) {
      if (!row.pan || !row.detailPath) continue;
      if (detailFetchBudget.remaining <= 0) break;
      detailFetchBudget.remaining -= 1;

      const detailHtml = await politeFetch(row.detailPath);
      if (!detailHtml) continue; // no fabricated fallback address — skip this row honestly
      const detail = parseDetailPage(detailHtml);
      if (!detail.address) continue;

      results.push({
        externalId: row.pan,
        lgaName: ourLgaKey,
        councilName: drupalValue,
        address: detail.address,
        suburb: resolveSuburbFromAddress(detail.address),
        postcode: extractPostcode(detail.address),
        description: row.title,
        applicationType: row.applicationType,
        status: row.status,
        decisionDate: detail.decisionDate,
        sourceUrl: `${BASE_URL}${row.detailPath}`,
        raw: { ...row, address: detail.address },
      });
    }

    if (rows.length < 9 || detailFetchBudget.remaining <= 0) break; // last page, or budget exhausted
  }

  return results;
}

export const nswPlanningPortalAdapter: CouncilSourceAdapter = {
  key: "nsw-planning-portal",
  label: "NSW Planning Portal — DA Exhibitions (planningportal.nsw.gov.au)",
  coversLgas: Object.keys(PLANNING_PORTAL_LGA_VALUES),
  async fetchApplications({ watchedLgas }): Promise<ScrapedApplication[]> {
    const budget = { remaining: MAX_DETAIL_FETCHES_PER_RUN };
    const results: ScrapedApplication[] = [];

    for (const lgaKey of watchedLgas) {
      if (budget.remaining <= 0) break;
      if (!PLANNING_PORTAL_LGA_VALUES[lgaKey]) continue; // not covered — never guess
      results.push(...(await fetchLgaApplications(lgaKey, budget)));
    }

    return results;
  },
};
