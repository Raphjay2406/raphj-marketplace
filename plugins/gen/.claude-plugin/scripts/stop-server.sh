#!/usr/bin/env bash
# Genorah Visual Companion — Stop Server
set -euo pipefail

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
INFO_FILE="${SCREEN_DIR}/.server-info"

if [ ! -f "$INFO_FILE" ]; then
  echo '{"type":"not-running","message":"No server info file found"}'
  exit 0
fi

INFO=$(cat "$INFO_FILE")
PID=$(printf '%s' "$INFO" | grep -o '"pid":[0-9]*' | head -1 | sed 's/"pid"://')

if [ -z "$PID" ]; then
  echo '{"type":"not-running","message":"No PID in server info"}'
  rm -f "$INFO_FILE"
  exit 0
fi

if kill -0 "$PID" 2>/dev/null; then
  kill "$PID" 2>/dev/null || true
  for i in 1 2 3; do
    kill -0 "$PID" 2>/dev/null || break
    sleep 1
  done
  if kill -0 "$PID" 2>/dev/null; then
    kill -9 "$PID" 2>/dev/null || true
  fi
fi

rm -f "$INFO_FILE"
echo '{"type":"server-stopped","pid":'"$PID"'}'
