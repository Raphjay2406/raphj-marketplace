#!/usr/bin/env bash
# DNA Compliance Check — runs as PreToolUse hook on Bash tool
# Reads JSON from stdin, checks if command is `git commit`,
# then greps staged files for common anti-slop violations.
# Zero context window cost — pure static enforcement.

set -euo pipefail

# --- Read tool input from stdin (Claude Code hook protocol) ---
INPUT=$(cat)

# Extract the command from the tool input JSON
COMMAND=$(printf '%s' "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"command"[[:space:]]*:[[:space:]]*"//;s/"$//' || true)

# Only run on git commit commands — exit silently for everything else
if ! printf '%s' "$COMMAND" | grep -q 'git commit'; then
  exit 0
fi

VIOLATIONS=""
VIOLATION_COUNT=0

# Get staged files (only .tsx, .jsx, .ts, .css files)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '\.(tsx?|jsx?|css)$' || true)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

check_pattern() {
  local pattern="$1"
  local message="$2"
  local matches

  matches=$(echo "$STAGED_FILES" | xargs grep -Hn "$pattern" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    VIOLATIONS="${VIOLATIONS}\n[VIOLATION] ${message}\n${matches}\n"
    VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  fi
}

# --- Generic Anti-Slop Patterns (always active) ---

# Default shadow classes (should use DNA shadow system)
check_pattern 'shadow-md\b' "Using shadow-md — use DNA shadow tokens instead"
check_pattern 'shadow-lg\b' "Using shadow-lg — use DNA shadow tokens instead"
check_pattern 'shadow-xl\b' "Using shadow-xl — use DNA shadow tokens instead"

# Default rounded classes without DNA variable
check_pattern 'rounded-lg\b' "Using rounded-lg — use DNA radius tokens instead"

# Default gray text (should use DNA text tokens)
check_pattern 'text-gray-[0-9]' "Using text-gray-XXX — use DNA text color tokens instead"

# Default font-sans without DNA variable
check_pattern 'font-sans\b' "Using font-sans — use DNA font variable instead"

# AI-slop default colors
check_pattern 'bg-blue-500\b' "Using bg-blue-500 — use DNA color tokens instead"
check_pattern 'bg-indigo-500\b' "Using bg-indigo-500 — use DNA color tokens instead"
check_pattern 'bg-violet-500\b' "Using bg-violet-500 — use DNA color tokens instead"
check_pattern 'text-blue-500\b' "Using text-blue-500 — use DNA color tokens instead"
check_pattern 'text-indigo-500\b' "Using text-indigo-500 — use DNA color tokens instead"

# Forbidden button text
check_pattern '"Submit"' "Button text 'Submit' found — use outcome-driven copy"
check_pattern '"Learn More"' "Button text 'Learn More' found — use specific action copy"
check_pattern '"Click Here"' "Button text 'Click Here' found — use descriptive action copy"

# Layout-triggering animations
check_pattern 'animate-\[.*width' "Animating width — use transform instead"
check_pattern 'animate-\[.*height' "Animating height — use transform instead"

# --- Project-Specific DNA Patterns (if DNA exists) ---

DNA_FILE=".planning/modulo/DESIGN-DNA.md"
if [ -f "$DNA_FILE" ]; then
  # Check for Inter/Roboto as display font (unless DNA explicitly allows)
  if ! grep -q "Inter\|Roboto" "$DNA_FILE" 2>/dev/null; then
    check_pattern "'Inter'" "Using Inter font — DNA specifies a different display font"
    check_pattern "'Roboto'" "Using Roboto font — DNA specifies a different display font"
  fi
fi

# --- Report ---

if [ $VIOLATION_COUNT -gt 0 ]; then
  echo ""
  echo "=========================================="
  echo " DNA COMPLIANCE CHECK — ${VIOLATION_COUNT} violation(s) found"
  echo "=========================================="
  printf '%b\n' "$VIOLATIONS"
  echo ""
  echo "Fix these violations before committing."
  echo "Reference: .planning/modulo/DESIGN-DNA.md"
  echo "=========================================="
  echo ""
  echo "BLOCKED: Commit blocked by DNA compliance hook."
  echo "To bypass (not recommended): git commit --no-verify"
  exit 1
fi

exit 0
