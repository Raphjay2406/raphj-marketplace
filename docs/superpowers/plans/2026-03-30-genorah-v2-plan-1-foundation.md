# Plan 1: Foundation & Infrastructure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the plugin from Modulo to Genorah, set up the 4-hook system, and build the visual companion server -- establishing the infrastructure all other plans depend on.

**Architecture:** Rename all references, create hook scripts (.mjs) and companion server (.cjs/.sh/.html/.js) using Node.js built-ins only (zero dependencies). Hooks follow Claude Code's hook protocol (JSON stdin -> JSON stdout).

**Tech Stack:** Markdown, Node.js (ESM for hooks, CJS for server), Bash

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-design.md`

---

## File Map

### Files to Modify
- `.claude-plugin/plugin.json` -- rename, bump version, add hook entries
- `.claude-plugin/marketplace.json` -- rename, update description
- `.claude-plugin/hooks/dna-compliance-check.sh` -- add new grep patterns
- `CLAUDE.md` -- rebrand + document new architecture
- `README.md` -- rebrand

### Files to Create
- `.claude-plugin/hooks/session-start.mjs` -- SessionStart hook
- `.claude-plugin/hooks/pre-tool-use.mjs` -- PreToolUse hook
- `.claude-plugin/hooks/user-prompt.mjs` -- UserPromptSubmit hook
- `.claude-plugin/scripts/server.cjs` -- Visual companion server
- `.claude-plugin/scripts/start-server.sh` -- Platform-aware startup
- `.claude-plugin/scripts/stop-server.sh` -- Graceful shutdown
- `.claude-plugin/scripts/frame-template.html` -- Themed frame
- `.claude-plugin/scripts/helper.js` -- Client-side WebSocket
- `agents/protocols/visual-companion.md` -- Protocol document

### Bulk Operations
- All files in `commands/`, `agents/`, `skills/` -- replace modulo with genorah

---

### Task 1: Create integration branch

**Files:** None (git operation)

- [ ] **Step 1: Create branch**
```bash
git checkout -b genorah-v2
```

- [ ] **Step 2: Verify**
```bash
git branch --show-current
```
Expected: `genorah-v2`

---

### Task 2: Rebrand plugin.json

**Files:**
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Update plugin.json**

Replace entire content with:
```json
{
  "name": "genorah",
  "description": "Premium frontend design system for Claude Code. Award-caliber websites through Design DNA, 19 archetypes, 72-point quality gate, emotional arc, creative tension, visual companion, and pipeline agent architecture. Next.js, Astro, React/Vite, Tauri, Electron.",
  "version": "2.0.0-dev",
  "author": {
    "name": "raphj"
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs\""
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/pre-tool-use.mjs\""
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/pre-tool-use.mjs\""
          },
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/dna-compliance-check.sh"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/user-prompt.mjs\""
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Validate JSON**
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); console.log('Valid JSON')"
```
Expected: `Valid JSON`

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/plugin.json
git commit -m "feat: rebrand plugin.json to genorah v2.0.0-dev with 4-hook system"
```

---

### Task 3: Bulk rename modulo to genorah

**Files:** All `.md` files in commands/, agents/, skills/, root

- [ ] **Step 1: Replace /modulo: with /gen:**
```bash
find . -name "*.md" -not -path "./.git/*" -not -path "./node_modules/*" | xargs sed -i 's/\/modulo:/\/gen:/g'
```

- [ ] **Step 2: Replace .planning/modulo with .planning/genorah**
```bash
find . -name "*.md" -not -path "./.git/*" -not -path "./node_modules/*" | xargs sed -i 's/\.planning\/modulo/\.planning\/genorah/g'
```

- [ ] **Step 3: Replace Modulo (capitalized) with Genorah**
```bash
find . -name "*.md" -not -path "./.git/*" -not -path "./node_modules/*" | xargs sed -i 's/Modulo/Genorah/g'
```

- [ ] **Step 4: Replace modulo (lowercase) with genorah**
```bash
find . -name "*.md" -not -path "./.git/*" -not -path "./node_modules/*" | xargs sed -i 's/\bmodulo\b/genorah/g'
```

- [ ] **Step 5: Update shell hook**
```bash
sed -i 's/\.planning\/modulo/\.planning\/genorah/g; s/Modulo/Genorah/g; s/\bmodulo\b/genorah/g' .claude-plugin/hooks/dna-compliance-check.sh
```

- [ ] **Step 6: Verify no remaining modulo references**
```bash
grep -r "modulo" --include="*.md" --include="*.sh" --include="*.json" -l . | grep -v ".git/" | grep -v "node_modules/" | grep -v "docs/superpowers/"
```
Expected: No results (design spec intentionally references old name)

- [ ] **Step 7: Rename command files**
```bash
cd commands && mv lets-discuss.md discuss.md && mv plan-dev.md plan.md && mv execute.md build.md && mv bug-fix.md bugfix.md && cd ..
```

- [ ] **Step 8: Rename agent files**
```bash
cd agents/pipeline && mv build-orchestrator.md orchestrator.md 2>/dev/null; mv section-builder.md builder.md 2>/dev/null; mv section-planner.md planner.md 2>/dev/null; cd ../..
```

- [ ] **Step 9: Commit**
```bash
git add -A
git commit -m "feat: bulk rebrand modulo -> genorah, rename commands and agents"
```

---

### Task 4: Create session-start.mjs hook

**Files:**
- Create: `.claude-plugin/hooks/session-start.mjs`

- [ ] **Step 1: Write the hook**

The hook reads `.planning/genorah/CONTEXT.md` on startup/resume and injects compressed project state. If no project, injects getting-started guidance. Detects companion server. On resume, suggests canary check.

Key implementation details:
- Read JSON from stdin (hook protocol)
- Check for `.planning/genorah/CONTEXT.md`, `STATE.md`, `DESIGN-DNA.md`
- Check `.planning/genorah/companion/.server-info` for running companion
- Output JSON with `additionalContext` field to stdout

See `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Section 4 for full specification.

- [ ] **Step 2: Test**
```bash
echo '{"event":"startup"}' | node .claude-plugin/hooks/session-start.mjs
```
Expected: JSON with `additionalContext` containing "No Genorah Project"

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/session-start.mjs
git commit -m "feat: add session-start hook for context injection"
```

---

### Task 5: Create pre-tool-use.mjs hook

**Files:**
- Create: `.claude-plugin/hooks/pre-tool-use.mjs`

- [ ] **Step 1: Write the hook**

The hook fires on Write/Edit/Bash and handles:
1. Smart skill injection (match file paths against skill frontmatter pathPatterns)
2. Artifact name validation (check references against CONTEXT.md registry)
3. Session dedup (each skill injected once per session via temp file)
4. Priority cap (max 3 skills, 18KB budget)

Key implementation details:
- Read JSON from stdin: `{tool_name, tool_input, session_id}`
- For Write/Edit: extract `file_path`, match against skill pathPatterns
- For Bash: extract `command`, match against skill bashPatterns
- Dedup via SHA-256 hashed session ID temp file in os.tmpdir()
- Output JSON with `additionalContext` (concatenated skill contents)

See `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Section 4 for full specification.

- [ ] **Step 2: Test**
```bash
echo '{"tool_name":"Write","tool_input":{"file_path":"test.tsx"},"session_id":"test"}' | node .claude-plugin/hooks/pre-tool-use.mjs
```
Expected: JSON output (empty `{}` or with matched skills)

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/pre-tool-use.mjs
git commit -m "feat: add pre-tool-use hook for skill injection and validation"
```

---

### Task 6: Create user-prompt.mjs hook

**Files:**
- Create: `.claude-plugin/hooks/user-prompt.mjs`

- [ ] **Step 1: Write the hook**

The hook fires on every user message and handles:
1. Stale reference translation (old command names, flags, artifact paths)
2. Flow state awareness (read STATE.md, suggest correct next command)
3. Lost user detection (signals like "what now", "stuck", "help")

Stale reference map:
- `/modulo:execute` -> `/gen:build`
- `/modulo:lets-discuss` -> `/gen:discuss`
- `/modulo:plan-dev` -> `/gen:plan`
- `/modulo:bug-fix` -> `/gen:bugfix`
- `--from-gaps` -> removed (auto-reads GAP-FIX.md)
- `.planning/modulo` -> `.planning/genorah`

See `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Section 4 for full specification.

- [ ] **Step 2: Test with stale reference**
```bash
echo '{"user_message":"/modulo:execute --from-gaps"}' | node .claude-plugin/hooks/user-prompt.mjs
```
Expected: JSON with migration hints for both stale references

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/user-prompt.mjs
git commit -m "feat: add user-prompt hook for intent routing and stale reference translation"
```

---

### Task 7: Enhance dna-compliance-check.sh

**Files:**
- Modify: `.claude-plugin/hooks/dna-compliance-check.sh`

- [ ] **Step 1: Add new patterns before the violation reporting section**

Append these check blocks:

1. Animation absence detection: check if staged .tsx/.jsx component files have zero animation/motion classes (animate-, motion., gsap, scroll-trigger, transition-, keyframes, framer-motion, data-motion). Flag as WARNING.

2. Responsive absence detection: check if staged files have zero responsive styles (@media, @container, sm:, md:, lg:, xl:, max-w-, min-w-). Flag as WARNING.

3. Compatibility tier violations: check for container-type and :has( without @supports. Flag as WARNING.

Use existing `check_pattern` function for the compatibility checks. For animation/responsive, iterate staged files and count matches.

- [ ] **Step 2: Commit**
```bash
git add .claude-plugin/hooks/dna-compliance-check.sh
git commit -m "feat: enhance DNA compliance hook with animation, responsive, and compat checks"
```

---

### Task 8: Create visual companion server (server.cjs)

**Files:**
- Create: `.claude-plugin/scripts/server.cjs`

- [ ] **Step 1: Write zero-dependency HTTP + WebSocket server**

~300 lines, Node.js built-ins only (http, crypto, fs, path).

HTTP routes:
- `GET /` -> serve newest .html file from screen dir, auto-wrap fragments in frame template, inject helper.js
- `GET /files/*` -> static file serving with MIME lookup
- Everything else -> 404

WebSocket (RFC 6455):
- Handshake: validate Sec-WebSocket-Key, compute Accept hash
- Frame decode: handle TEXT (0x01), CLOSE (0x08), PING (0x09)
- On TEXT: parse JSON, if event has `choice` property -> append to `.events` file
- Broadcast reload to all clients when new screen file detected

File watcher:
- fs.watch on screen directory
- New .html file -> clear .events, broadcast reload
- 100ms debounce per filename

Lifecycle:
- 30-minute idle timeout (no HTTP requests -> exit)
- Write `.server-info` JSON on startup
- Clean up `.server-info` on SIGTERM/SIGINT

See `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Section 7 for full specification.

- [ ] **Step 2: Test server starts**
```bash
node .claude-plugin/scripts/server.cjs --screen-dir /tmp/genorah-test --port 54321 &
SERVER_PID=$!
sleep 1
curl -s http://localhost:54321 | grep -o "Waiting for Genorah"
kill $SERVER_PID 2>/dev/null
rm -rf /tmp/genorah-test
```
Expected: `Waiting for Genorah`

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/scripts/server.cjs
git commit -m "feat: add visual companion server (zero-dep HTTP + WebSocket)"
```

---

### Task 9: Create start-server.sh

**Files:**
- Create: `.claude-plugin/scripts/start-server.sh`

- [ ] **Step 1: Write platform-aware startup**

The script:
- Accepts `--project-dir` argument
- Creates `.planning/genorah/companion/` directory
- Checks if server already running via `.server-info`
- Detects Windows (MSYS/Cygwin) vs macOS/Linux
- Windows: runs foreground (caller uses run_in_background)
- macOS/Linux: nohup backgrounds, waits 1s, outputs .server-info JSON
- Returns JSON: `{type, port, host, url, screen_dir, pid}`

- [ ] **Step 2: Make executable**
```bash
chmod +x .claude-plugin/scripts/start-server.sh
```

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/scripts/start-server.sh
git commit -m "feat: add visual companion start script (platform-aware)"
```

---

### Task 10: Create stop-server.sh

**Files:**
- Create: `.claude-plugin/scripts/stop-server.sh`

- [ ] **Step 1: Write graceful shutdown**

The script:
- Accepts `--project-dir` argument
- Reads PID from `.server-info`
- Sends SIGTERM, waits 3s, escalates to SIGKILL
- Removes `.server-info`
- Returns JSON: `{type: "server-stopped", pid}`

- [ ] **Step 2: Make executable**
```bash
chmod +x .claude-plugin/scripts/stop-server.sh
```

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/scripts/stop-server.sh
git commit -m "feat: add visual companion stop script"
```

---

### Task 11: Create frame-template.html

**Files:**
- Create: `.claude-plugin/scripts/frame-template.html`

- [ ] **Step 1: Write themed frame**

Dark/light theme via `prefers-color-scheme`. Genorah branding header. Scrollable content area with `<!-- CONTENT -->` placeholder. Fixed indicator bar at bottom.

CSS classes for agents to use:
- `.options` / `.option` with `data-choice` -- A/B/C picker
- `.cards` / `.card` -- grid layout
- `.split` -- side-by-side comparison
- `.palette` / `.swatch` -- color swatches
- `.score-bar` / `.fill` -- progress bars
- `.subtitle` -- muted description text

Color tokens: --bg, --surface, --border, --text, --text-muted, --accent, --success, --warning, --error

See `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Section 7 for visual companion design.

- [ ] **Step 2: Commit**
```bash
git add .claude-plugin/scripts/frame-template.html
git commit -m "feat: add visual companion frame template (dark/light theme)"
```

---

### Task 12: Create helper.js

**Files:**
- Create: `.claude-plugin/scripts/helper.js`

- [ ] **Step 1: Write client-side WebSocket handler**

Vanilla JS IIFE (~80 lines):
- Connect WebSocket to `ws://` + location.host
- On reload message: `window.location.reload()`
- Click handler on `[data-choice]` elements: toggle `.selected` class, send JSON event
- Single-select by default, multi-select if container has `data-multiselect`
- Update indicator bar text using `textContent` (NOT innerHTML -- use DOM manipulation for styled text)
- Auto-reconnect on close (1s delay)
- Event queue for messages sent before connection established

Important: Use `textContent` and DOM element creation for indicator updates, not string-based HTML insertion.

- [ ] **Step 2: Commit**
```bash
git add .claude-plugin/scripts/helper.js
git commit -m "feat: add visual companion client helper (WebSocket + click tracking)"
```

---

### Task 13: Create visual-companion protocol document

**Files:**
- Create: `agents/protocols/visual-companion.md`

- [ ] **Step 1: Write protocol**

Document for agents explaining:
- How to start/stop the companion
- How to push HTML screens (Write fragments to .planning/genorah/companion/)
- Available CSS classes and patterns (options, cards, split, scores)
- How to read user choices from .events file
- When to use visual vs terminal
- Fallback behavior when companion is not running
- Screen naming conventions (semantic, never reuse)

- [ ] **Step 2: Commit**
```bash
git add agents/protocols/visual-companion.md
git commit -m "feat: add visual companion protocol document"
```

---

### Task 14: Update marketplace.json

**Files:**
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Update name, description, version, skill count, keywords**

Change "modulo" to "genorah" throughout. Skills: "90+". Commands: 11. Add keywords: visual-companion, hubspot, stripe, shopify, obsidian, ai-ui.

- [ ] **Step 2: Validate JSON**
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); console.log('Valid')"
```

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/marketplace.json
git commit -m "feat: update marketplace.json for genorah v2.0"
```

---

### Task 15: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite for Genorah v2.0**

Update: project name, commands (11 /gen:*), agents (15 with ai-ui-specialist), hooks (4), quality gate (72-point), skills (90+), workflow chain, visual companion section, integration skills section. Replace all .planning/modulo with .planning/genorah.

- [ ] **Step 2: Commit**
```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for genorah v2.0 architecture"
```

---

### Task 16: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update plugin table**

Name: genorah. Skills: 90+. Commands: 11. Agents: 15. Description updated for v2.0.

- [ ] **Step 2: Commit**
```bash
git add README.md
git commit -m "docs: update README for genorah v2.0"
```

---

### Task 17: Validation pass

- [ ] **Step 1: Check no stale modulo references in infrastructure**
```bash
grep -r "modulo" .claude-plugin/ --include="*.mjs" --include="*.sh" --include="*.cjs" --include="*.json" --include="*.html" --include="*.js" -l
```
Expected: No results

- [ ] **Step 2: Check command/agent files for old names**
```bash
grep -r "/modulo:" commands/ agents/ -l
```
Expected: No results

- [ ] **Step 3: Verify plugin.json structure**
```bash
node -e "const p=JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8'));console.log('Name:',p.name);console.log('Version:',p.version);console.log('Hooks:',Object.keys(p.hooks).join(', '))"
```
Expected: Name: genorah, Version: 2.0.0-dev, Hooks: SessionStart, PreToolUse, UserPromptSubmit

- [ ] **Step 4: Verify all hooks execute**
```bash
echo '{}' | node .claude-plugin/hooks/session-start.mjs && echo "session-start: OK"
echo '{"tool_name":"Write","tool_input":{},"session_id":"t"}' | node .claude-plugin/hooks/pre-tool-use.mjs && echo "pre-tool-use: OK"
echo '{"user_message":"hi"}' | node .claude-plugin/hooks/user-prompt.mjs && echo "user-prompt: OK"
```
Expected: All three OK

- [ ] **Step 5: Final commit**
```bash
git add -A
git commit -m "chore: plan 1 complete -- foundation and infrastructure validated"
```

---

## Plan 1 Summary

17 tasks delivering:
- Plugin rebranded to "genorah" with /gen:* commands
- 4 hooks (session-start, pre-tool-use, user-prompt, dna-compliance)
- Visual companion server + scripts + frame + helper + protocol
- Updated CLAUDE.md, README.md, marketplace.json

**Next:** Plan 2 (Pipeline Core) -- rewrite agents and commands with Agent Teams, TodoWrite, PlanMode
