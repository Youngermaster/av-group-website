#!/usr/bin/env bash
# ============================================================
# ORÜZ pitch deck — headless-Chrome PDF export.
#
# Boots a local http.server (so Google Fonts and WAAPI behave the
# same as in a real browser) and prints the deck to PDF at 16:9.
#
# Usage:
#   ./slides/export-pdf.sh                       # → slides/oruz_pitch_deck.pdf
#   ./slides/export-pdf.sh path/to/output.pdf    # custom output path
# ============================================================
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_HTML="oruz_pitch_deck.html"
OUTPUT="${1:-$DIR/oruz_pitch_deck.pdf}"

# --- Locate a Chromium-family browser -----------------------------------------
CHROME=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "$(command -v google-chrome 2>/dev/null || true)" \
  "$(command -v chromium 2>/dev/null || true)" \
  "$(command -v chrome 2>/dev/null || true)"
do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then
    CHROME="$candidate"
    break
  fi
done

if [ -z "$CHROME" ]; then
  cat >&2 <<EOF
Error: no Chromium-family browser found.

Install Google Chrome:
  https://www.google.com/chrome/

Or pass a path explicitly:
  CHROME=/path/to/chrome ./slides/export-pdf.sh
EOF
  exit 1
fi

# --- Boot a temp static server so file:// quirks don't bite us ----------------
PORT="${PORT:-8767}"

# If the port is busy, pick a random high one.
if lsof -iTCP:"$PORT" -sTCP:LISTEN -nP >/dev/null 2>&1; then
  PORT=$((30000 + RANDOM % 30000))
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$DIR" >/dev/null 2>&1 &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

# Wait until the server answers (max ~5s).
for _ in $(seq 1 25); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/$INPUT_HTML"; then
    break
  fi
  sleep 0.2
done

# ?print=1 puts the deck in static export mode: WAAPI animations are
# cancelled and every element is snapped to its final state. Without this,
# the print snapshot can catch mid-animation states and produce blur on
# slides 2–8.
URL="http://127.0.0.1:$PORT/$INPUT_HTML?print=1"

echo "→ Browser : $CHROME"
echo "→ Source  : $URL"
echo "→ Output  : $OUTPUT"

# --- Render -------------------------------------------------------------------
# --virtual-time-budget gives WAAPI animations + webfonts time to settle
# before the print snapshot is taken.
"$CHROME" \
  --headless=new \
  --no-pdf-header-footer \
  --hide-scrollbars \
  --disable-gpu \
  --no-sandbox \
  --virtual-time-budget=15000 \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf="$OUTPUT" \
  "$URL" \
  >/dev/null 2>&1

if [ ! -s "$OUTPUT" ]; then
  echo "Error: Chrome produced an empty PDF." >&2
  exit 1
fi

SIZE=$(wc -c < "$OUTPUT" | tr -d ' ')
echo "✓ PDF written ($SIZE bytes)"
