#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  run_verification.sh — Run the 10K verification test in non-GUI mode
#
#  Usage:
#    cd spring-boot-microservices/jmeter
#    chmod +x run_verification.sh
#    ./run_verification.sh
#
#  Outputs:
#    results/verification_results.jtl   — raw JTL data
#    results/verification_report/       — HTML dashboard report
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Config ──────────────────────────────────────────────────────────────
# If JMETER_HOME is set (points to the install dir), use bin/jmeter inside it.
# Otherwise fall back to 'jmeter' on PATH.
if [[ -n "${JMETER_HOME:-}" ]]; then
  JMETER="$JMETER_HOME/bin/jmeter"
else
  JMETER="jmeter"
fi
PLAN="verification_test.jmx"
JTL_FILE="results/verification_results.jtl"
REPORT_DIR="results/verification_report"

# ── Pre-flight ──────────────────────────────────────────────────────────
mkdir -p results

# Remove old results to avoid "Dashboard already exists" error
if [[ -f "$JTL_FILE" ]]; then
  echo "⚠  Removing old JTL: $JTL_FILE"
  rm -f "$JTL_FILE"
fi
if [[ -d "$REPORT_DIR" ]]; then
  echo "⚠  Removing old report: $REPORT_DIR"
  rm -rf "$REPORT_DIR"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Movie Info — Verification Test (10,000 requests)       ║"
echo "║  200 users × 50 loops  |  Target: localhost:8082        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Run JMeter ──────────────────────────────────────────────────────────
"$JMETER" \
  -n \
  -t "$PLAN" \
  -l "$JTL_FILE" \
  -e \
  -o "$REPORT_DIR" \
  -Djmeter.save.saveservice.output_format=csv \
  -Dsummariser.interval=10

echo ""
echo "✅ Done!"
echo "   JTL file : $SCRIPT_DIR/$JTL_FILE"
echo "   HTML report: $SCRIPT_DIR/$REPORT_DIR/index.html"
echo ""
echo "Key metrics (from the Aggregate Report in the HTML report):"
echo "  - Average latency"
echo "  - 90th percentile latency"
echo "  - Throughput (req/sec)"
echo "  - Error rate"
