#!/usr/bin/env bash
# Genorah Visual Companion — Start Server
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --project-dir) PROJECT_DIR="$2"; shift 2 ;;
    *) shift ;;
  esac
done

if [ -z "$PROJECT_DIR" ]; then
  echo '{"type":"error","message":"--project-dir is required"}' >&2
  exit 1
fi

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
      exit 0
    fi
  fi
fi

IS_WINDOWS=false
if [[ "${OSTYPE:-}" == msys* ]] || [[ "${OSTYPE:-}" == cygwin* ]] || [[ -n "${MSYSTEM:-}" ]]; then
  IS_WINDOWS=true
fi

SERVER_SCRIPT="${SCRIPT_DIR}/server.cjs"

if [ "$IS_WINDOWS" = true ]; then
  exec node "$SERVER_SCRIPT" --screen-dir "$SCREEN_DIR"
else
  nohup node "$SERVER_SCRIPT" --screen-dir "$SCREEN_DIR" > /dev/null 2>&1 &
  CHILD_PID=$!
  sleep 1
  if [ -f "${SCREEN_DIR}/.server-info" ]; then
    cat "${SCREEN_DIR}/.server-info"
  else
    echo "{\"type\":\"error\",\"message\":\"Server failed to start\",\"pid\":${CHILD_PID}}"
    exit 1
  fi
fi
