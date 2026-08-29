#!/usr/bin/env bash
# One-time fetch + parse of NSW Valuer General Bulk Property Sales
# Information (PSI) — LICENCE WARNING: CC BY-NC-ND 4.0 (Non-Commercial,
# No-Derivatives). Per an explicit founder decision, data derived from this
# script is dashboard-only in Cadacre and must never reach the paid $39
# report — see the `psiGrowthHistory` field comment in src/data/towns.ts
# and AGENTS.md §5h. If the founder later obtains NSW Valuer General Bulk
# Land Value data (CC BY 4.0, no licence conflict — requires an emailed
# request, see AGENTS.md §5h), prefer that source instead and retire this
# script.
#
# Downloads one yearly ZIP per year (statewide, self-service, no
# registration — https://www.valuergeneral.nsw.gov.au/__psi/yearly/<year>.zip),
# extracts the nested weekly ZIPs, parses the "B" (sale) records in each
# fixed-format .DAT file, filters to Nature of Property == "R" (residential
# dwelling sales — houses, units, and townhouses combined; not separable
# from this field alone), and appends suburb,postcode,year,price,contract_date
# rows to a single CSV. Deletes extracted files after each year to bound
# disk usage — only the aggregate CSV persists.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${1:-$HERE/../tmp}"
START_YEAR="${2:-2016}"
END_YEAR="${3:-2025}"
mkdir -p "$OUT_DIR"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
OUT="$OUT_DIR/psi_sales.csv"
if [ ! -f "$OUT" ]; then
  echo "suburb,postcode,year,price,contract_date" > "$OUT"
fi

for year in $(seq "$START_YEAR" "$END_YEAR"); do
  echo "== $year ==" >&2
  ZIP="$OUT_DIR/py_$year.zip"
  WORK="$OUT_DIR/py_${year}_work"
  rm -rf "$WORK"
  mkdir -p "$WORK"
  curl -sL -A "$UA" "https://www.valuergeneral.nsw.gov.au/__psi/yearly/$year.zip" -o "$ZIP"
  unzip -o -q "$ZIP" -d "$WORK"
  for wz in "$WORK"/*.zip; do
    [ -f "$wz" ] || continue
    unzip -o -q "$wz" -d "$WORK" 2>/dev/null
    rm -f "$wz"
  done
  # Field numbers below are 1-indexed (awk convention) into the ";"-delimited
  # "B" (sale) record: $10 suburb, $11 postcode, $14 contract date,
  # $16 purchase price, $18 Nature of Property code ("R" = residential).
  grep -h "^B;" "$WORK"/*.DAT 2>/dev/null | awk -F';' -v yr="$year" '
    $18 == "R" && $10 != "" && $16 != "" {
      suburb = $10; postcode = $11; price = $16; cdate = $14;
      gsub(/^[ \t]+|[ \t]+$/, "", suburb);
      if (price ~ /^[0-9]+$/ && price+0 > 0) {
        print suburb "," postcode "," yr "," price "," cdate
      }
    }
  ' >> "$OUT"
  rm -rf "$WORK" "$ZIP"
  echo "  rows so far: $(wc -l < "$OUT")" >&2
done

echo "done" >&2
