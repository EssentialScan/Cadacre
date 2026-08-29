// One-time aggregation: NSW Valuer General PSI sales (tmp/psi_sales.csv) +
// ABS SAL suburb boundaries (tmp/sal_nsw.ndjson) -> src/data/generated/nswSuburbs.json
//
// Run after scripts/fetch-abs-sal.sh and scripts/fetch-valuer-general-psi.sh
// have populated the tmp/ directory. See AGENTS.md §5h for the full pipeline
// and the licensing constraints on the PSI-derived `growthHistory` field.
const fs = require("fs");
const path = require("path");

const HERE = __dirname;
const TMP = path.join(HERE, "..", "tmp");
const psiPath = path.join(TMP, "psi_sales.csv");
const salPath = path.join(TMP, "sal_nsw.ndjson");
const outPath = path.join(HERE, "..", "src", "data", "generated", "nswSuburbs.json");

function normalizeName(name) {
  return name
    .toUpperCase()
    .replace(/\(NSW\)/g, "")
    .replace(/\s*-\s*/g, " ")
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

const salLines = fs.readFileSync(salPath, "utf8").split("\n").filter(Boolean);
const suburbs = [];
const seenNorm = new Set();
for (const line of salLines) {
  const rec = JSON.parse(line);
  if (rec.lat === null || rec.lng === null) continue;
  const norm = normalizeName(rec.name);
  if (!norm || seenNorm.has(norm)) continue;
  seenNorm.add(norm);
  suburbs.push({
    id: rec.code,
    name: rec.name,
    norm,
    coordinates: { lat: rec.lat, lng: rec.lng },
  });
}
console.error(`Loaded ${suburbs.length} unique-name NSW SAL suburbs`);

const bySuburbYear = new Map();
const psiRaw = fs.readFileSync(psiPath, "utf8");
let lineCount = 0;
const len = psiRaw.length;
let lineStart = psiRaw.indexOf("\n") + 1;
while (lineStart < len) {
  let lineEnd = psiRaw.indexOf("\n", lineStart);
  if (lineEnd === -1) lineEnd = len;
  const line = psiRaw.slice(lineStart, lineEnd);
  lineStart = lineEnd + 1;
  if (!line) continue;
  lineCount++;
  const commaIdx = [];
  for (let i = 0; i < line.length; i++) if (line[i] === ",") commaIdx.push(i);
  if (commaIdx.length < 4) continue;
  const suburb = line.slice(0, commaIdx[0]);
  const year = line.slice(commaIdx[1] + 1, commaIdx[2]);
  const price = Number(line.slice(commaIdx[2] + 1, commaIdx[3]));
  if (!suburb || !year || !Number.isFinite(price) || price <= 0) continue;
  const norm = normalizeName(suburb);
  const key = norm + "|" + year;
  if (!bySuburbYear.has(key)) bySuburbYear.set(key, []);
  bySuburbYear.get(key).push(price);
}
console.error(`Parsed ${lineCount} PSI sale rows`);

const MIN_SALES = 5;
let withHistory = 0;
for (const suburb of suburbs) {
  const history = [];
  for (let year = 2016; year <= 2025; year++) {
    const prices = bySuburbYear.get(suburb.norm + "|" + year);
    if (prices && prices.length >= MIN_SALES) {
      history.push({ year, medianSalePrice: median(prices), saleCount: prices.length });
    }
  }
  if (history.length >= 2) {
    suburb.growthHistory = history;
    withHistory++;
  }
  delete suburb.norm;
}
console.error(`${withHistory} / ${suburbs.length} suburbs have a real >=2-point PSI growth series (>=${MIN_SALES} sales/year)`);

fs.writeFileSync(outPath, JSON.stringify(suburbs));
console.error(`Wrote ${outPath}`);
