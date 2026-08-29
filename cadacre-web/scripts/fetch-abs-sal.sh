#!/usr/bin/env bash
# One-time fetch of ABS Digital Boundary Files — Suburbs and Localities (SAL),
# CC BY 4.0 Licence — filtered to New South Wales. Paginates the ArcGIS
# FeatureServer (2,000-record page limit) and writes one JSON object per
# suburb (code, name, centroid lat/lng) as newline-delimited JSON.
#
# See AGENTS.md §5h for the full pipeline this feeds into
# (scripts/aggregate-nsw-suburbs.js).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${1:-$HERE/../tmp}"
mkdir -p "$OUT_DIR"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
OUT="$OUT_DIR/sal_nsw.ndjson"
> "$OUT"

OFFSET=0
PAGE=2000
while true; do
  URL="https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SAL/FeatureServer/0/query?where=STATE_NAME_2021%3D%27New+South+Wales%27&outFields=SAL_CODE_2021,SAL_NAME_2021&returnGeometry=false&returnCentroid=true&outSR=4326&f=json&resultOffset=$OFFSET&resultRecordCount=$PAGE"
  echo "fetching offset $OFFSET ..." >&2
  curl -sL -A "$UA" "$URL" -o "$OUT_DIR/sal_page.json"
  COUNT=$(node -e "const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')); console.log((d.features||[]).length);" "$OUT_DIR/sal_page.json")
  echo "  got $COUNT features" >&2
  node -e "
    const d = JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
    const fs = require('fs');
    const lines = (d.features||[]).map(f => JSON.stringify({
      code: f.attributes.sal_code_2021,
      name: f.attributes.sal_name_2021,
      lat: f.centroid ? f.centroid.y : null,
      lng: f.centroid ? f.centroid.x : null,
    }));
    fs.appendFileSync(process.argv[2], lines.join('\n') + (lines.length ? '\n' : ''));
  " "$OUT_DIR/sal_page.json" "$OUT"
  if [ "$COUNT" -lt "$PAGE" ]; then
    break
  fi
  OFFSET=$((OFFSET + PAGE))
done

rm -f "$OUT_DIR/sal_page.json"
echo "done, total lines: $(wc -l < "$OUT")" >&2
