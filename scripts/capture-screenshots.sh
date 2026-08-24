#!/usr/bin/env bash
set -euo pipefail
BASE="${SHOT_BASE:-http://127.0.0.1:3000}"
OUT="${SHOT_OUT:-docs/screenshots}"
CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="${CHROME_PROFILE:-/tmp/ricedax-chrome-profile}"
mkdir -p "$OUT"
rm -rf "$PROFILE"

shot() {
  local path="$1"
  local file="$2"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$PROFILE" --window-size=1440,900 \
    --screenshot="$OUT/$file" "$BASE$path" >/dev/null
  echo "wrote $file"
}

shot "/login" "01-login.png"
shot "/api/demo-login?password=${DEMO_PASSWORD:-pacific}&next=/" "00-auth.png"
shot "/" "02-cockpit.png"
shot "/inventory" "03-inventory.png"
shot "/recommendation/rec_vietnam_jasmine_001" "04-recommendation.png"
shot "/copilot" "05-copilot.png"
shot "/network" "06-network.png"
shot "/rfq/rfq_pacific_001" "07-rfq.png"
shot "/scorecard" "08-scorecard.png"
shot "/ingest" "09-data.png"
rm -f "$OUT/00-auth.png"
echo "done"
