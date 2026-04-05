#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  run_full_test.sh — Run the 10M request performance comparison test
#
#  Usage:
#    cd spring-boot-microservices/jmeter
#    chmod +x run_full_test.sh
#
#    # Run 1 — Cache OFF (make sure docker-compose has CACHE_ENABLED=false)
#    ./run_full_test.sh cache_off
#
#    # Run 2 — Cache ON  (restart movie-info-service with CACHE_ENABLED=true)
#    ./run_full_test.sh cache_on
#
#  Outputs per run:
#    results/cache_off_results.jtl   → results/cache_off_report/index.html
#    results/cache_on_results.jtl    → results/cache_on_report/index.html
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Args ─────────────────────────────────────────────────────────────────
MODE="${1:-}"
if [[ "$MODE" != "cache_off" && "$MODE" != "cache_on" ]]; then
  echo "Usage: $0 <cache_off|cache_on>"
  echo ""
  echo "  cache_off — Deploy with CACHE_ENABLED=false, then run this"
  echo "  cache_on  — Deploy with CACHE_ENABLED=true,  then run this"
  exit 1
fi

# ── Config ───────────────────────────────────────────────────────────────
# If JMETER_HOME is set (points to the install dir), use bin/jmeter inside it.
if [[ -n "${JMETER_HOME:-}" ]]; then
  JMETER="$JMETER_HOME/bin/jmeter"
else
  JMETER="jmeter"
fi
PLAN="full_test.jmx"
JTL_FILE="results/${MODE}_results.jtl"
REPORT_DIR="results/${MODE}_report"

# ── Pre-flight ────────────────────────────────────────────────────────────
mkdir -p results

if [[ -f "$JTL_FILE" ]]; then
  echo "⚠  Removing old JTL: $JTL_FILE"
  rm -f "$JTL_FILE"
fi
if [[ -d "$REPORT_DIR" ]]; then
  echo "⚠  Removing old report: $REPORT_DIR"
  rm -rf "$REPORT_DIR"
fi

# ── Remind user to check cache state ─────────────────────────────────────
if [[ "$MODE" == "cache_off" ]]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║  CACHE OFF run — verify before starting:                        ║"
  echo "║  docker compose logs movie-info-service | grep 'cache.enabled'  ║"
  echo "║  Should show: cache.enabled=false                               ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
else
  echo ""
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║  CACHE ON run — verify before starting:                         ║"
  echo "║  docker compose logs movie-info-service | grep 'cache.enabled'  ║"
  echo "║  Should show: cache.enabled=true                                ║"
  echo "║                                                                  ║"
  echo "║  Also flush old MongoDB cache entries:                           ║"
  echo "║  docker exec -it mongodb mongosh movieinfo \\                    ║"
  echo "║    --eval \"db.movieCacheEntity.deleteMany({})\"                  ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
fi

echo ""
read -rp "Press ENTER to start the $MODE test (Ctrl+C to abort)..."
echo ""

START_TIME=$(date +%s)

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Movie Info — Full Test ($MODE)                         ║"
echo "║  200 users × 50,000 loops = 10,000,000 requests         ║"
echo "║  Progress printed every 30 seconds                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Run JMeter ─────────────────────────────────────────────────────────
"$JMETER" \
  -n \
  -t "$PLAN" \
  -l "$JTL_FILE" \
  -e \
  -o "$REPORT_DIR" \
  -Djmeter.save.saveservice.output_format=csv \
  -Dsummariser.interval=30 \
  -JOUTPUT_FILE="$JTL_FILE"

END_TIME=$(date +%s)
ELAPSED=$(( END_TIME - START_TIME ))
HOURS=$(( ELAPSED / 3600 ))
MINUTES=$(( (ELAPSED % 3600) / 60 ))
SECONDS=$(( ELAPSED % 60 ))

echo ""
echo "✅ $MODE test complete!"
echo "   Duration   : ${HOURS}h ${MINUTES}m ${SECONDS}s"
echo "   JTL file   : $SCRIPT_DIR/$JTL_FILE"
echo "   HTML report: $SCRIPT_DIR/$REPORT_DIR/index.html"
echo ""
echo "Quick stats (open the HTML report for full metrics):"
echo "  xdg-open $SCRIPT_DIR/$REPORT_DIR/index.html"
