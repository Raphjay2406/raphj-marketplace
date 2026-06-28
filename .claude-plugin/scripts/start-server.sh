#!/usr/bin/env bash
# Genorah Visual Companion — Start Server
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR=""
OPEN_BROWSER=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --project-dir) PROJECT_DIR="$2"; shift 2 ;;
    --open) OPEN_BROWSER=true; shift ;;
    *) shift ;;
  esac
done

if [ -z "$PROJECT_DIR" ]; then
  echo '{"type":"error","message":"--project-dir is required"}' >&2
  exit 1
fi

IS_WINDOWS=false
if [[ "${OSTYPE:-}" == msys* ]] || [[ "${OSTYPE:-}" == cygwin* ]] || [[ -n "${MSYSTEM:-}" ]]; then
  IS_WINDOWS=true
fi

open_url() {
  local url="$1"
  if [ "$OPEN_BROWSER" != true ] || [ -z "$url" ]; then return 0; fi
  if [ "$IS_WINDOWS" = true ]; then
    cmd.exe /c start "" "$url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  fi
  return 0
}

SCREEN_DIR="${PROJECT_DIR}/.planning/genorah/companion"
mkdir -p "$SCREEN_DIR"

# Check if already running
if [ -f "${SCREEN_DIR}/.server-info" ]; then
  INFO=$(cat "${SCREEN_DIR}/.server-info")
  TYPE=$(printf '%s' "$INFO" | grep -o '"type":"[^"]*"' | head -1 | sed 's/.*"type":"//;s/"//')
  if [ "$TYPE" = "server-started" ]; then
    PID=$(printf '%s' "$INFO" | grep -o '"pid":[0-9]*' | head -1 | sed 's/"pid"://')
    if kill -0 "$PID" 2>/dev/null; then
      echo "$INFO"
      URL=$(printf '%s' "$INFO" | grep -o '"url":"[^"]*"' | head -1 | sed 's/.*"url":"//;s/"//')
      open_url "$URL"
      exit 0
    fi
  fi
fi

SERVER_SCRIPT="${SCRIPT_DIR}/server.cjs"

if [ "$IS_WINDOWS" = true ]; then
  if [ "$OPEN_BROWSER" = true ]; then
    ( for _ in 1 2 3 4 5 6 7 8 9 10; do
        if [ -f "${SCREEN_DIR}/.server-info" ]; then
          U=$(grep -o '"url":"[^"]*"' "${SCREEN_DIR}/.server-info" | head -1 | sed 's/.*"url":"//;s/"//')
          [ -n "$U" ] && { cmd.exe /c start "" "$U" >/dev/null 2>&1 || true; break; }
        fi
        sleep 0.5
      done ) &
  fi
  exec node "$SERVER_SCRIPT" --screen-dir "$SCREEN_DIR"
else
  nohup node "$SERVER_SCRIPT" --screen-dir "$SCREEN_DIR" > /dev/null 2>&1 &
  CHILD_PID=$!
  sleep 1
  if [ -f "${SCREEN_DIR}/.server-info" ]; then
    INFO=$(cat "${SCREEN_DIR}/.server-info")
    echo "$INFO"
    URL=$(printf '%s' "$INFO" | grep -o '"url":"[^"]*"' | head -1 | sed 's/.*"url":"//;s/"//')
    open_url "$URL"
  else
    echo "{\"type\":\"error\",\"message\":\"Server failed to start\",\"pid\":${CHILD_PID}}"
    exit 1
  fi
fi
