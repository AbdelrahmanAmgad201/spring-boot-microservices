# JMeter Test Suite — Movie Info Service

Performance comparison: **Cache OFF** vs **Cache ON** for `GET /movies/{movieId}`

## Files

| File | Purpose |
|---|---|
| `movie_ids.csv` | 100 real TMDB movie IDs, recycled endlessly |
| `verification_test.jmx` | 200 users × 50 loops = **10,000 requests** |
| `full_test.jmx` | 200 users × 50,000 loops = **10,000,000 requests** |
| `run_verification.sh` | Run verification test + generate HTML report |
| `run_full_test.sh` | Run full 10M test (pass `cache_off` or `cache_on`) |
| `generate_report.sh` | Re-generate HTML report from an existing JTL file |
| `results/` | All output goes here (JTL files + HTML reports) |

---

## Step 0 — Prerequisites

```bash
# Verify JMeter is installed
jmeter --version
# Should print: Apache JMeter 5.x.x

# If not installed:
# Download from https://jmeter.apache.org/download_jmeter.cgi
# Then add to PATH:
export JMETER_HOME=/path/to/apache-jmeter-5.6.3
export PATH=$JMETER_HOME/bin:$PATH
```

---

## Step 1 — Verification Test (10K requests)

Run this **first** to confirm the system is healthy before committing to the 10M run.

```bash
cd spring-boot-microservices/jmeter
./run_verification.sh
```

**Or manually:**
```bash
cd spring-boot-microservices/jmeter

# Remove stale results
rm -f results/verification_results.jtl
rm -rf results/verification_report

# Run in non-GUI mode, generate HTML report automatically (-e -o)
jmeter -n \
  -t verification_test.jmx \
  -l results/verification_results.jtl \
  -e -o results/verification_report \
  -Djmeter.save.saveservice.output_format=csv \
  -Dsummariser.interval=10

# Open report
xdg-open results/verification_report/index.html
```

✅ **What to verify before the full run:**
- Error rate < 1%
- Average latency is sane (< 2000 ms for cache-off, < 100 ms for cache-on)
- All 10,000 samples completed

---

## Step 2 — Full Test (10,000,000 requests)

### Run 1: Cache OFF

```bash
# 1. Make sure docker-compose has CACHE_ENABLED=false (it's the default)
docker compose up -d movie-info-service

# 2. Run the test
cd spring-boot-microservices/jmeter
./run_full_test.sh cache_off

# Or manually:
rm -f results/cache_off_results.jtl
rm -rf results/cache_off_report

jmeter -n \
  -t full_test.jmx \
  -l results/cache_off_results.jtl \
  -e -o results/cache_off_report \
  -Djmeter.save.saveservice.output_format=csv \
  -Dsummariser.interval=30
```

### Run 2: Cache ON

```bash
# 1. Switch movie-info-service to cache-on mode
docker compose stop movie-info-service
CACHE_ENABLED=true docker compose up -d movie-info-service

# Or edit docker-compose.yml: CACHE_ENABLED: "true" then:
# docker compose up -d movie-info-service

# 2. Flush old cache entries for a clean comparison
docker exec -it mongodb mongosh movieinfo \
  --eval "db.movieCacheEntity.deleteMany({})"

# 3. Run the test
cd spring-boot-microservices/jmeter
./run_full_test.sh cache_on

# Or manually:
rm -f results/cache_on_results.jtl
rm -rf results/cache_on_report

jmeter -n \
  -t full_test.jmx \
  -l results/cache_on_results.jtl \
  -e -o results/cache_on_report \
  -Djmeter.save.saveservice.output_format=csv \
  -Dsummariser.interval=30
```

---

## Step 3 — Re-generate HTML Report (from existing JTL)

```bash
# If the run completed but the HTML step failed:
cd spring-boot-microservices/jmeter

./generate_report.sh results/cache_off_results.jtl results/cache_off_report
./generate_report.sh results/cache_on_results.jtl  results/cache_on_report

# Or manually:
jmeter -g results/cache_off_results.jtl -o results/cache_off_report
jmeter -g results/cache_on_results.jtl  -o results/cache_on_report
```

---

## Key Metrics to Extract

Open `results/cache_off_report/index.html` or `results/cache_on_report/index.html` in a browser.

Navigate to **"Statistics"** tab:

| Metric | Where in HTML report | JMeter term |
|---|---|---|
| Average latency | Statistics → Average | `average` |
| 90th percentile | Statistics → 90% Line | `pct1ResTime` |
| 95th percentile | Statistics → 95% Line | `pct2ResTime` |
| 99th percentile | Statistics → 99% Line | `pct3ResTime` |
| Throughput | Statistics → Throughput | `throughput` (req/sec) |
| Error rate | Statistics → Error % | `errorPct` |

**From console output (during run):**
```
summary +  50000 in 00:00:30 = 1666.7/s  Avg: 119  Min: 2  Max: 2345  Err: 0 (0.00%)
           ^count  ^window    ^RPS         ^avg ms                          ^errors
```

---

## Comparison Table Template

Fill this in after both runs complete:

| Metric | Cache OFF | Cache ON | Improvement |
|---|---|---|---|
| Avg latency (ms) | | | |
| P90 latency (ms) | | | |
| P95 latency (ms) | | | |
| P99 latency (ms) | | | |
| Throughput (req/s) | | | |
| Error rate (%) | | | |
| Total test duration | | | |

---

## Troubleshooting

**"Cannot open JMX file"**
→ Always `cd` into the `jmeter/` directory first so that `movie_ids.csv` path resolves correctly.

**"Results file already exists"**
→ Delete old JTL: `rm results/cache_off_results.jtl`

**"OutOfMemoryError in JMeter"**
→ Increase JMeter heap in `$JMETER_HOME/bin/jmeter` or `jmeter.sh`:
```bash
HEAP="-Xms512m -Xmx1g"
```

**Many 400/500 errors in cache-off run**
→ TMDB API rate limit hit. This is expected for 10M requests — the service should handle errors gracefully and the circuit breaker should trip. Check error messages in the HTML report.

**Docker container OOMKilled**
```bash
docker inspect movie-info-service | grep -A2 OOMKilled
# If true, the 2GB limit was exceeded — check for memory leaks or reduce JMeter threads
```
