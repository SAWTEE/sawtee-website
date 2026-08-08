#!/usr/bin/env bash
# Optional helper to start Inertia SSR on a host that can run a persistent Node process.
# Not used by staging/production cPanel deploys (INERTIA_SSR_ENABLED=false).
# Local Vite dev does NOT need this — `@inertiajs/vite` handles SSR via `npm run dev`.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PID_FILE="${SSR_PID_FILE:-storage/framework/ssr.pid}"
LOG_FILE="${SSR_LOG_FILE:-storage/logs/ssr.log}"
mkdir -p "$(dirname "$PID_FILE")" "$(dirname "$LOG_FILE")"

if [[ ! -d bootstrap/ssr ]]; then
  echo "SSR bundle missing at bootstrap/ssr — run: npm run build:ssr"
  exit 1
fi

if ! command -v node >/dev/null 2>&1 && ! command -v php >/dev/null 2>&1; then
  echo "Neither node nor php found in PATH"
  exit 1
fi

stop_existing() {
  if [[ -f "$PID_FILE" ]]; then
    old_pid="$(cat "$PID_FILE" || true)"
    if [[ -n "${old_pid}" ]] && kill -0 "$old_pid" 2>/dev/null; then
      echo "Stopping SSR pid $old_pid"
      kill "$old_pid" 2>/dev/null || true
      sleep 1
      kill -9 "$old_pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
  # Best-effort cleanup of stray inertia SSR processes for this app
  pkill -f "inertia:start-ssr" 2>/dev/null || true
}

stop_existing

echo "Starting Inertia SSR..."
# Prefer artisan helper so Laravel resolves the correct bundle path.
nohup php artisan inertia:start-ssr >>"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
sleep 2

if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "✅ SSR running (pid $(cat "$PID_FILE")), log: $LOG_FILE"
  exit 0
fi

echo "❌ SSR failed to stay up — check $LOG_FILE"
exit 1
