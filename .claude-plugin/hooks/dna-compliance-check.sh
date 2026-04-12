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

# Exclude test fixtures from PII scanning
PII_FILES=$(echo "$STAGED_FILES" | grep -v '__fixtures__\|__mocks__\|\.test\.\|\.spec\.\|\.example' || true)

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
check_pattern 'text-gray-[0-9]\+' "Using text-gray-XXX — use DNA text color tokens instead"

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

# --- v3.1: Typography-rules checks (Butterick) on user-visible strings ---
# Double-hyphen as em-dash substitute in .md/.mdx/prose
# Excludes: CLI flags (--flag), inline backtick code (`--no-verify`), fenced blocks, HTML comments
for file in $(echo "$STAGED_FILES" | grep -E '\.(md|mdx)$'); do
  [ -z "$file" ] && continue
  # v3.1.1 hardened filter: strip fenced code blocks + inline backticks + HTML comments before scan
  stripped=$(awk '
    /^```/ { in_fence = !in_fence; next }
    !in_fence {
      gsub(/`[^`]*`/, "")           # strip inline backtick content
      gsub(/<!--[^>]*-->/, "")      # strip HTML comments
      print
    }' "$file" 2>/dev/null)
  bad_emdash=$(echo "$stripped" | grep -nE '(^|[^-])--[^->a-zA-Z0-9]' 2>/dev/null || true)
  if [ -n "$bad_emdash" ]; then
    VIOLATIONS="${VIOLATIONS}\n[TYPOGRAPHY] Double-hyphen in prose (use em dash U+2014 —): ${file}\n${bad_emdash}\n"
    VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  fi
done

# Double-space-after-period in visible strings
check_pattern '\.  [A-Z]' "Double space after period — use single space"

# Layout-triggering animations (anchored to bracket close to avoid false positives on names containing 'width'/'height')
check_pattern 'animate-\[[^]]*width\]' "Animating width — use transform instead"
check_pattern 'animate-\[[^]]*height\]' "Animating height — use transform instead"

# --- Project-Specific DNA Patterns (if DNA exists) ---

DNA_FILE=".planning/genorah/DESIGN-DNA.md"
if [ -f "$DNA_FILE" ]; then
  # Check for Inter/Roboto as display font (unless DNA explicitly allows)
  if ! grep -q "Inter\|Roboto" "$DNA_FILE" 2>/dev/null; then
    check_pattern "'Inter'" "Using Inter font — DNA specifies a different display font"
    check_pattern "'Roboto'" "Using Roboto font — DNA specifies a different display font"
  fi
fi

# --- NEW v2.0: Animation absence detection ---
# Uses JSX detection (<ComponentName) instead of 'return' to identify components
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if echo "$file" | grep -qE '\.(tsx|jsx)$'; then
    has_motion=$(grep -cE 'animate-|motion\.|gsap|ScrollTrigger|transition-|@keyframes|(motion/react|framer-motion)|data-motion|useSpring|useScroll|animation-timeline' "$file" 2>/dev/null || echo "0")
    has_jsx=$(grep -cE '<[A-Z]' "$file" 2>/dev/null || echo "0")
    if [ "$has_motion" = "0" ] && [ "$has_jsx" -gt 0 ]; then
      is_component=$(echo "$file" | grep -qE 'components|sections|app/' && echo "yes" || echo "no")
      if [ "$is_component" = "yes" ]; then
        VIOLATIONS="${VIOLATIONS}\n[WARNING] No animation/motion detected in component: ${file}\n  Genorah v2.0 requires entrance animation and interaction states.\n"
      fi
    fi
  fi
done <<< "$STAGED_FILES"

# --- NEW v2.0: Responsive absence detection ---
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if echo "$file" | grep -qE '\.(tsx|jsx|css)$'; then
    has_responsive=$(grep -cE '@media|@container|sm:|md:|lg:|xl:|max-w-|min-w-|container-type' "$file" 2>/dev/null || echo "0")
    has_jsx=$(grep -cE '<[A-Z]' "$file" 2>/dev/null || echo "0")
    if [ "$has_responsive" = "0" ] && [ "$has_jsx" -gt 0 ]; then
      is_component=$(echo "$file" | grep -qE 'components|sections|app/' && echo "yes" || echo "no")
      if [ "$is_component" = "yes" ]; then
        VIOLATIONS="${VIOLATIONS}\n[WARNING] No responsive styles detected in: ${file}\n  Genorah v2.0 requires 4-breakpoint responsive design (375, 768, 1024, 1440).\n"
      fi
    fi
  fi
done <<< "$STAGED_FILES"

# --- NEW v2.0: Compatibility tier feature warnings ---
check_pattern 'container-type:\s*inline-size' "Using container queries -- ensure @supports fallback for Broad/Legacy tiers"
check_pattern ':has(' "Using :has() selector -- ensure fallback for Broad/Legacy tiers"
check_pattern 'oklch(' "Using oklch() colors -- ensure hsl() fallback for Broad/Legacy tiers"
check_pattern 'subgrid' "Using subgrid -- ensure fallback for Broad/Legacy tiers"

# --- PII / Secret Detection (BLOCK severity) ---
# Uses PII_FILES (excludes test fixtures, mocks, and example files)
check_pii_pattern() {
  local pattern="$1"
  local message="$2"
  local matches

  if [ -z "$PII_FILES" ]; then return; fi

  matches=$(echo "$PII_FILES" | xargs grep -Hn "$pattern" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    VIOLATIONS="${VIOLATIONS}\n[BLOCK] ${message}\n${matches}\n"
    VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
  fi
}

check_pii_pattern 'sk_live_[a-zA-Z0-9]\{20,\}' "Stripe LIVE secret key detected in source code"
check_pii_pattern 'sk_test_[a-zA-Z0-9]\{20,\}' "Stripe TEST secret key detected -- use env var STRIPE_SECRET_KEY"
check_pii_pattern 'AKIA[0-9A-Z]\{16,20\}' "AWS access key detected in source code"
check_pii_pattern 'ghp_[a-zA-Z0-9]\{36,\}' "GitHub personal access token detected"
check_pii_pattern 'gho_[a-zA-Z0-9]\{36,\}' "GitHub OAuth token detected"
check_pii_pattern 'xox[bpars]-[a-zA-Z0-9]\{10,\}' "Slack token detected in source code"
check_pii_pattern 'glpat-[a-zA-Z0-9_-]\{20,\}' "GitLab personal access token detected"

# --- Report ---

if [ $VIOLATION_COUNT -gt 0 ]; then
  echo ""
  echo "=========================================="
  echo " DNA COMPLIANCE CHECK — ${VIOLATION_COUNT} violation(s) found"
  echo "=========================================="
  printf '%b\n' "$VIOLATIONS"
  echo ""
  echo "Fix these violations before committing."
  echo "Reference: .planning/genorah/DESIGN-DNA.md"
  echo "=========================================="
  echo ""
  echo "BLOCKED: Commit blocked by DNA compliance hook."
  echo "To bypass (not recommended): git commit --no-verify"
  exit 1
fi

exit 0
