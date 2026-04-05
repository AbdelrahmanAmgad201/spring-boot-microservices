#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  generate_report.sh — Re-generate the HTML report from an existing JTL
#
#  Useful if the JMeter run finished but HTML generation failed, or if
#  you want to regenerate after the test is done.
#
#  Usage:
#    ./generate_report.sh results/cache_off_results.jtl results/cache_off_report
#    ./generate_report.sh results/cache_on_results.jtl  results/cache_on_report
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ -n "${JMETER_HOME:-}" ]]; then
  JMETER="$JMETER_HOME/bin/jmeter"
else
  JMETER="jmeter"
fi
JTL_FILE="${1:-}"
REPORT_DIR="${2:-}"

if [[ -z "$JTL_FILE" || -z "$REPORT_DIR" ]]; then
  echo "Usage: $0 <path-to.jtl> <output-report-dir>"
  exit 1
fi

if [[ ! -f "$JTL_FILE" ]]; then
  echo "❌ JTL file not found: $JTL_FILE"
  exit 1
fi

if [[ -d "$REPORT_DIR" ]]; then
  echo "⚠  Removing existing report dir: $REPORT_DIR"
  rm -rf "$REPORT_DIR"
fi

echo "Generating HTML report..."
"$JMETER" -g "$JTL_FILE" -o "$REPORT_DIR"

echo ""
echo "✅ Report generated: $SCRIPT_DIR/$REPORT_DIR/index.html"
echo "   xdg-open $SCRIPT_DIR/$REPORT_DIR/index.html"
