---
name: "figma-integration"
description: "Figma design import via MCP tools, DNA token translation, Code Connect mapping, visual QA overlay diff"
tier: "domain"
triggers: "figma, design import, figma-to-code, visual QA, figma mcp, design translation"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **User has a Figma design to implement** -- Use this skill to import the design through Figma MCP tools and translate it into PLAN.md files for the normal execute pipeline
- **`/modulo:start-design --figma` is invoked** -- The entry point for Figma-based projects; this skill drives the entire import workflow
- **Figma is the visual reference for QA** -- During `/modulo:verify`, use this skill's visual QA overlay diff to compare the built page against the original Figma design
- **Code Connect components exist in the project** -- Use this skill to detect existing component mappings and reuse them instead of generating new code
- **Multi-page Figma files** -- Use this skill's page-by-page import protocol to handle complex Figma files with multiple pages or frames

### When NOT to Use

- **Building from scratch (no Figma file)** -- Use the normal `/modulo:start-design` flow with research agents, archetype selection, and DNA generation
- **Figma file is a rough wireframe** -- If there is no visual styling (just boxes and text placeholders), treat the wireframe as inspiration input to the normal discovery flow, not as an import source
- **Updating existing sections** -- Once code is built, use `/modulo:iterate` for changes. Only re-import from Figma if the design has fundamentally changed

### MCP Tool Selection Decision Tree

This is the critical reference for choosing which Figma MCP tool to use in each situation. The Figma MCP server provides 13 tools. Using the wrong tool wastes context tokens and may produce truncated or irrelevant output.

#### Primary Import Tools

| Situation | Tool | Why | Key Parameters |
|-----------|------|-----|----------------|
| First look at any Figma file | `get_metadata` | Returns sparse XML overview of node structure (IDs, names, types, positions) without exceeding token limits | fileKey, nodeId (optional) |
| Understanding a specific section/frame | `get_design_context` | Returns full layout, styles, and component data for a single node -- the primary data extraction tool | fileKey, nodeId |
| Large frame returns truncated data | Break into child nodes, `get_design_context` per child | Avoids token limit truncation by querying smaller subtrees | Individual child nodeIds from get_metadata |
| Extracting design tokens (colors, spacing, type) | `get_variable_defs` | Returns Figma variables -- the closest thing to a design token system | fileKey, nodeId (optional) |
| Capturing visual reference for QA | `get_screenshot` | Renders the design as an image for pixel-level comparison | fileKey, nodeId |
| Checking for component-to-code mappings | `get_code_connect_map` | Returns components already linked to codebase implementations via Code Connect | fileKey |
| Finding potential new mappings | `get_code_connect_suggestions` | Auto-detects components that could be mapped to code | fileKey |

#### Secondary Tools

| Situation | Tool | Why |
|-----------|------|-----|
| Creating a new component-to-code mapping | `add_code_connect_map` | Registers a codebase component against a Figma component for future imports |
| Confirming auto-suggested mappings | `send_code_connect_mappings` | Batch-confirms multiple Code Connect suggestions at once |
| Pushing code as design layers to Figma | `generate_figma_design` | Reverse direction: code-to-Figma sync. Rare -- used for design handoff back to designers |
| Creating FigJam diagrams | `generate_diagram` | Converts Mermaid diagram syntax into FigJam boards. Used for architecture visualization, not design import |
| Reading FigJam boards | `get_figjam` | Extracts FigJam metadata and screenshots. Used for whiteboarding context, not design import |
| Generating design system rules | `create_design_system_rules` | Produces rule files that constrain future Figma design. Used post-build, not during import |
| Checking authenticated user | `whoami` | Returns authenticated user info. Diagnostic tool -- use when MCP connection seems wrong |

#### Tool Selection Flowchart

```
Start: "I have a Figma file URL"
  |
  v
[1] Call get_metadata with fileKey
  |-- Returns sparse XML with node IDs, names, types
  |-- If file has multiple pages: present page list to user for selection
  |
  v
[2] For each section node in the selected page:
  |
  |-- [2a] Call get_design_context with nodeId
  |     |-- If response is complete: proceed to token extraction
  |     |-- If response is truncated: break into child nodes, query each
  |
  |-- [2b] Call get_screenshot with nodeId
  |     |-- Save to .planning/modulo/figma-references/[section-name].png
  |
  v
[3] Call get_variable_defs (once per file, not per node)
  |-- Returns all Figma variables (colors, spacing, typography)
  |-- Apply hybrid DNA-Figma token resolution (see Pattern 2)
  |
  v
[4] Call get_code_connect_map (once per file)
  |-- Returns existing component mappings
  |-- For mapped components: use codebase implementation directly
  |-- For unmapped components: generate new or map to closest existing
  |
  v
[5] Generate PLAN.md files (one per section)
  |-- Standard format for the execute pipeline
  |-- Include Figma screenshot reference for visual QA
```

### Pipeline Connection

- **Referenced by:** `figma-translator` agent during the Figma import workflow
- **Referenced by:** `quality-reviewer` agent during visual QA verify step (overlay diff)
- **Referenced by:** `section-planner` agent when generating PLAN.md files from Figma data
- **Consumed at:** `/modulo:start-design --figma` workflow steps 4-8
- **Consumed at:** `/modulo:verify` visual QA overlay diff step

### Critical Rule

**Figma import ALWAYS produces PLAN.md files.** The output of this skill is never direct code. PLAN.md files flow through the normal `/modulo:execute` pipeline where builders generate code, creative director reviews quality, and the anti-slop gate enforces standards. Skipping the plan step bypasses user review and quality enforcement.

---

## Layer 2: Award-Winning Examples

### Pattern 1: Complete Figma Import Workflow

The full 7-step workflow for importing a Figma design into the Modulo pipeline. Each step builds on the previous step's output.

#### Step 1: Get Page Structure

```markdown
## Figma Import: Step 1 -- Page Structure

Call `get_metadata` with the Figma file URL to get an overview of the entire file.

### MCP Tool Call
Tool: get_metadata
Parameters:
  fileKey: "abc123XYZ"      (extracted from Figma URL)
  nodeId: null               (omit to get full file overview)

### Expected Output (sparse XML)
<document name="Agency Landing Page">
  <page name="Home" id="0:1">
    <frame name="Hero Section" id="123:456" x="0" y="0" w="1440" h="900" />
    <frame name="Services Grid" id="123:789" x="0" y="900" w="1440" h="800" />
    <frame name="Testimonials" id="124:100" x="0" y="1700" w="1440" h="600" />
    <frame name="Contact CTA" id="124:200" x="0" y="2300" w="1440" h="500" />
    <frame name="Footer" id="124:300" x="0" y="2800" w="1440" h="400" />
  </page>
  <page name="About" id="0:2">
    <frame name="About Hero" id="200:100" x="0" y="0" w="1440" h="700" />
    <frame name="Team Grid" id="200:200" x="0" y="700" w="1440" h="900" />
  </page>
</document>

### Next Step
Present page list to user. For multi-page files, import one page at a time.
User selects: "Home" page
```

#### Step 2: User Selects Target Page/Frame

```markdown
## Figma Import: Step 2 -- Page Selection

For multi-page Figma files, present the page structure and let the user choose.

### Prompt to User
"This Figma file has 2 pages:
1. **Home** -- 5 sections (Hero, Services Grid, Testimonials, Contact CTA, Footer)
2. **About** -- 2 sections (About Hero, Team Grid)

Which page should I import first? Each page becomes a separate build cycle.
Shared components (nav, footer) will be detected across imports."

### User Response
"Start with the Home page"

### Result
Import targets: nodes 123:456, 123:789, 124:100, 124:200, 124:300
```

#### Step 3: Get Design Context Per Section

```markdown
## Figma Import: Step 3 -- Section Data Extraction

Call `get_design_context` on EACH section node individually. Do NOT call it
on the full page -- that risks token truncation.

### MCP Tool Call (per section)
Tool: get_design_context
Parameters:
  fileKey: "abc123XYZ"
  nodeId: "123:456"          (Hero Section)

### Expected Output (React + Tailwind representation)
The tool returns a structured representation of the section including:
- Layout structure (flex/grid, dimensions, gaps)
- Component hierarchy (what contains what)
- Style data (colors as hex, typography as font/size/weight, spacing as px)
- Component references (Figma component instances with their names)

### Important: Truncation Handling
If get_design_context returns incomplete data (missing children, cut-off styles):
1. Get the child nodes from the get_metadata output
2. Call get_design_context on each child separately
3. Reconstruct the section from child data

### Repeat for Each Section
- 123:456 (Hero Section)
- 123:789 (Services Grid)
- 124:100 (Testimonials)
- 124:200 (Contact CTA)
- 124:300 (Footer)
```

#### Step 4: Extract Design Tokens with Hybrid Resolution

```markdown
## Figma Import: Step 4 -- Token Extraction

Call `get_variable_defs` ONCE for the entire file to get all design tokens.

### MCP Tool Call
Tool: get_variable_defs
Parameters:
  fileKey: "abc123XYZ"

### Expected Output
Returns Figma variables organized by collection:
- Color variables: background, text, accent, border values
- Spacing variables: section, block, element values
- Typography variables: font families, sizes, weights, line heights

### Apply Hybrid Resolution (see Pattern 2 for full protocol)
For each Figma token:
1. Figma Variable exists -> Map to DNA token by semantic role
2. Figma Style only -> Map to nearest DNA token by value
3. Raw hex (no variable) -> FLAG for user decision
4. Missing from Figma -> DNA provides (motion, interactions, signature element)
```

#### Step 5: Capture Visual References

```markdown
## Figma Import: Step 5 -- Visual Reference Screenshots

Call `get_screenshot` for each section to capture the design as-rendered.
These screenshots serve as the reference target for visual QA.

### MCP Tool Call (per section)
Tool: get_screenshot
Parameters:
  fileKey: "abc123XYZ"
  nodeId: "123:456"          (Hero Section)

### Save Location
.planning/modulo/figma-references/
  01-hero.png
  02-services-grid.png
  03-testimonials.png
  04-contact-cta.png
  05-footer.png

### Usage
- Referenced in each section's PLAN.md as the visual target
- Used during /modulo:verify for overlay diff comparison
- Named with numeric prefix to match section ordering
```

#### Step 6: Check Code Connect Mappings

```markdown
## Figma Import: Step 6 -- Code Connect Component Check

Call `get_code_connect_map` to find components already linked to codebase code.

### MCP Tool Call
Tool: get_code_connect_map
Parameters:
  fileKey: "abc123XYZ"

### Expected Output
Returns a list of Figma components with their code mappings:

| Figma Component | Code Component | File Path |
|-----------------|---------------|-----------|
| Button/Primary  | <Button variant="primary"> | src/components/ui/Button.tsx |
| Card/Default    | <Card> | src/components/ui/Card.tsx |
| Icon/Arrow      | <ArrowIcon> | src/components/icons/Arrow.tsx |

### Decision Matrix
- Component HAS Code Connect mapping -> Use the mapped component directly in PLAN.md
- Component has NO mapping but similar exists -> Claude maps to closest existing component
- Component has NO mapping and nothing similar -> Generate new component (document in PLAN.md tasks)

### Optional: Register New Mappings
After building, call `add_code_connect_map` to register new component mappings
for future imports of the same Figma file.
```

#### Step 7: Generate PLAN.md Files

```markdown
## Figma Import: Step 7 -- PLAN.md Generation

For each section, generate a PLAN.md that follows the standard format
used by the /modulo:execute pipeline.

See Pattern 3 for a complete PLAN.md example.
```

---

### Pattern 2: Hybrid DNA-Figma Token Resolution Protocol

When Figma tokens exist, they inform the implementation. When they do not exist, DNA fills the gap. This protocol defines the priority order and the flagging mechanism for unmapped values.

#### Resolution Priority

```
Priority 1: Figma Variable (via get_variable_defs)
  |-- Variable exists with semantic name (e.g., "color/accent/primary")
  |-- Map to corresponding DNA token (e.g., --color-accent)
  |-- Use Figma value, store mapping in PLAN.md
  |
Priority 2: Figma Style (via get_design_context)
  |-- No variable, but consistent style applied to components
  |-- Match style value to nearest DNA token by value proximity
  |-- Document the mapping decision in PLAN.md
  |
Priority 3: Raw hex/value (not in Figma variables or styles)
  |-- FLAG for user decision with 3 options:
  |   a) Map to existing DNA token (closest match)
  |   b) Add as new DNA token (extends the palette)
  |   c) Keep as-is with documented deviation
  |
Priority 4: Not in Figma at all
  |-- DNA provides entirely
  |-- Applies to: motion tokens, interaction patterns, forbidden patterns,
  |   signature element, emotional arc, creative tension
```

#### Concrete Example: Resolving an Accent Color

```markdown
## Token Resolution Example

### Figma Data
Component: Hero CTA Button
Background color: #FF6F3C (applied via Figma style "Brand/Accent")
No Figma variable defined for this color.

### DNA Token System
--color-accent: #ff4d00   (DNA accent-1, delta: 34 hue units)
--color-secondary: #00d4ff (DNA secondary, completely different)
--color-signature: #a855f7  (DNA signature, completely different)

### Resolution
Priority 2 applies: Figma style exists but no variable.
Nearest DNA token by value: --color-accent (#ff4d00)
Delta: #FF6F3C vs #ff4d00 -- similar warm orange family, 34 hue units apart.

### Decision Point
Delta exceeds threshold (> 15 hue units) -> FLAG for user:

"The Figma design uses #FF6F3C for the hero CTA button background.
Your DNA accent token is #ff4d00 (similar warm orange, slightly more red).

Options:
(a) Map to DNA --color-accent (#ff4d00) -- keeps DNA consistent, slight visual shift
(b) Add #FF6F3C as a new DNA token --color-accent-warm -- extends palette
(c) Keep #FF6F3C as-is -- documented deviation from DNA"

### User Chooses (a)
PLAN.md uses: className="bg-accent" (maps to --color-accent)
```

#### Flag Format for Unmapped Colors

When a raw hex value cannot be automatically resolved, present it in this format:

```markdown
### Unmapped Colors Requiring Decision

| Figma Color | Used In | Nearest DNA Token | Delta | Recommendation |
|-------------|---------|-------------------|-------|----------------|
| #FF6F3C | Hero CTA bg | --color-accent (#ff4d00) | ~34 hue | Map to accent |
| #1E3A5F | Card bg | --color-surface (#141414) | Major | Add new token |
| #C8B8A0 | Divider | None close | -- | Add or keep as-is |

**For each color, choose:**
(a) Map to [nearest DNA token]
(b) Add as new DNA token named [suggested-name]
(c) Keep as-is (deviation documented)
```

#### What DNA Always Provides (Regardless of Figma)

Even when Figma provides comprehensive visual tokens, these always come from DNA:

| Domain | Why DNA, Not Figma |
|--------|--------------------|
| Motion tokens (8+ tokens) | Figma is static -- no motion data to extract |
| Interaction patterns | Figma shows states but not transition behavior |
| Forbidden patterns | Archetype constraints live in DNA, not Figma |
| Signature element | Per-archetype creative identity from DNA |
| Emotional arc beats | Section sequencing is a Modulo concept, not a Figma concept |
| Creative tension | Controlled rule-breaking comes from the archetype system |
| Anti-slop enforcement | Quality gate thresholds are DNA + archetype driven |

---

### Pattern 3: PLAN.md Generation from Figma Data

A complete example of a PLAN.md generated from Figma import data. This file follows the standard format consumed by `/modulo:execute`.

```markdown
---
section: hero
beat: HOOK
builder_type: section
layout_pattern: full-bleed-split
figma_reference: .planning/modulo/figma-references/01-hero.png
---

# Section: Hero

## Visual Specification (from Figma)

### Layout
- Full-bleed split: 55% content left, 45% visual right
- Content area: 48px left padding, vertically centered
- Visual area: edge-to-edge image/3D element with overlay gradient

### Typography (mapped to DNA)
- Headline: DNA display-1 (Figma: Inter Bold 72px -> DNA --font-display at --text-display-1)
- Subheadline: DNA body-lg (Figma: Inter Regular 20px -> DNA --font-body at --text-body-lg)
- CTA text: DNA body-md bold (Figma: Inter SemiBold 16px -> DNA --font-body at --text-body-md)

### Colors (mapped to DNA)
- Background: DNA bg-primary (Figma variable: "color/bg/primary" #0a0a0a)
- Headline text: DNA text-primary (Figma variable: "color/text/primary" #f5f5f5)
- CTA button bg: DNA accent (Figma style: "Brand/Accent" #ff4d00 -> mapped by user)
- Overlay gradient: DNA bg-primary at 0.7 opacity (no Figma variable -- DNA provides)

### Components
- CTA Button: Code Connect mapped to `<Button variant="primary">` (src/components/ui/Button.tsx)
- Navigation: Code Connect mapped to `<Nav>` (src/components/layout/Nav.tsx)
- Hero Image: New component needed (no Code Connect mapping)

### Spacing (mapped to DNA)
- Section padding: DNA spacing-section (Figma: 96px -> DNA --spacing-section)
- Content gap: DNA spacing-block (Figma: 48px -> DNA --spacing-block)
- Button margin-top: DNA spacing-element (Figma: 24px -> DNA --spacing-element)

## Beat: HOOK

### Emotional Arc Parameters
- Whitespace: >= 40% (HARD constraint)
- Element count: <= 5 (HARD constraint)
- Viewport height: >= 90vh
- Animation: Entrance reveal with DNA motion tokens (not in Figma -- DNA provides)

## Tasks

### Task 1: Create Hero component shell
- Create `src/components/sections/Hero.tsx`
- Implement full-bleed split layout (55/45)
- Apply DNA spacing tokens

### Task 2: Add typography and content
- Apply DNA type scale mappings
- Use headline from Figma content or placeholder
- Match Figma text hierarchy

### Task 3: Integrate mapped components
- Use Code Connect `<Button variant="primary">` for CTA
- Use Code Connect `<Nav>` for navigation
- Create new HeroImage component for the visual area

### Task 4: Add motion and interactions
- HOOK beat entrance animation (DNA motion tokens)
- Scroll-driven parallax on visual area (DNA provides -- not in Figma)
- Button hover/press states (DNA interaction patterns)

### Task 5: Responsive adaptations
- Stack to single column below 768px
- Adjust type scale per DNA responsive rules
- Visual area becomes full-width background on mobile

## Figma Reference
Visual QA target: `.planning/modulo/figma-references/01-hero.png`
Compare at 1440px viewport width for desktop accuracy.
```

---

### Pattern 4: Visual QA Overlay Diff

The overlay diff workflow compares the built page against the Figma design at pixel level. This runs during the `/modulo:verify` step, not during import.

#### Workflow

```
Step 1: Get Figma Reference Screenshot
  |-- Tool: get_screenshot
  |-- Parameters: fileKey, nodeId (specific section)
  |-- Output: Image data for the section as designed in Figma
  |-- Save to: .planning/modulo/figma-references/[section-name].png
  |   (may already exist from import step)
  |
Step 2: Get Built Page Screenshot
  |-- Tool: Playwright MCP screenshot
  |-- Navigate to the built page URL
  |-- Set viewport to match Figma frame dimensions (e.g., 1440x900)
  |-- Capture section screenshot (scroll to section, clip to bounds)
  |-- Save to: .planning/modulo/qa-screenshots/[section-name]-built.png
  |
Step 3: Pixel-Level Comparison
  |-- Load both images as raw pixel data
  |-- Run pixelmatch comparison:
  |     const numDiffPixels = pixelmatch(
  |       figmaPixels, builtPixels, diffOutput,
  |       width, height,
  |       { threshold: 0.15, includeAA: false }
  |     );
  |-- threshold 0.15: tolerates minor anti-aliasing and subpixel differences
  |-- includeAA: false: ignores anti-aliased edge differences
  |
Step 4: Generate Diff Report
  |-- Calculate diff percentage: (numDiffPixels / totalPixels) * 100
  |-- Save diff overlay image: .planning/modulo/qa-screenshots/[section-name]-diff.png
  |-- Classify result:
  |     < 2% diff: PASS (minor rendering differences)
  |     2-10% diff: REVIEW (notable differences, may be intentional)
  |     > 10% diff: FAIL (significant deviation from design)
  |
Step 5: Present to User
  |-- Show: original Figma screenshot, built page screenshot, diff overlay
  |-- Highlight regions with significant differences
  |-- Note: some differences are expected (motion states, interactive elements,
  |   font rendering differences between Figma and browser)
```

#### Implementation Note

The exact screenshot exchange format between Figma MCP and Playwright MCP depends on runtime capabilities. Two approaches:

**Approach A: Direct MCP-to-MCP (preferred if supported)**
Both MCP tools return image data that can be passed to pixelmatch directly.

**Approach B: File-based fallback (reliable)**
1. Save Figma screenshot to disk via `get_screenshot` (save to file)
2. Save Playwright screenshot to disk via Playwright MCP (save to file)
3. Load both with `sharp` or `canvas` library
4. Extract raw pixel data (Uint8Array)
5. Run pixelmatch on the raw pixel arrays
6. Save diff overlay to disk

The file-based approach is always reliable regardless of MCP tool output format. Use it as the default implementation.

#### pixelmatch Configuration

```javascript
// Recommended pixelmatch settings for design QA
const options = {
  threshold: 0.15,       // Color difference threshold (0 = exact, 1 = any)
  includeAA: false,      // Skip anti-aliased pixels in diff count
  alpha: 0.1,            // Opacity of original image in diff output
  aaColor: [255, 255, 0],   // Yellow for anti-aliasing differences
  diffColor: [255, 0, 0],   // Red for actual differences
  diffColorAlt: [0, 255, 0], // Green for orphan pixels (only in one image)
};

// Diff percentage thresholds
const PASS_THRESHOLD = 2;    // < 2% = acceptable rendering variation
const REVIEW_THRESHOLD = 10; // 2-10% = needs human review
                              // > 10% = significant deviation
```

---

### Pattern 5: Code Connect Component Reuse

Code Connect links Figma components to actual codebase implementations. When these mappings exist, builders should use the mapped components directly instead of generating new ones.

#### Detection Workflow

```markdown
## Code Connect Detection

### Step 1: Check Existing Mappings
Tool: get_code_connect_map
Parameters: fileKey: "abc123XYZ"

### Step 2: Evaluate Coverage
For each Figma component instance found in get_design_context:
  - IF component has a CodeConnectSnippet: USE the mapped code directly
  - IF component has no mapping but a similar codebase component exists:
    Claude maps to the closest match and documents the decision
  - IF component has no mapping and nothing similar exists:
    Generate new component as a PLAN.md task

### Step 3: Check for Auto-Suggestions
Tool: get_code_connect_suggestions
Parameters: fileKey: "abc123XYZ"

Review auto-detected mapping opportunities. Accept good suggestions,
reject false positives.

### Step 4: Register New Mappings (Post-Build)
After /modulo:execute completes, register new component mappings:
Tool: add_code_connect_map
Parameters:
  fileKey: "abc123XYZ"
  mappings: [
    { figmaNodeId: "456:789", codeComponent: "<TestimonialCard>", filePath: "src/components/ui/TestimonialCard.tsx" }
  ]
```

#### Example: Using a Code Connect Component in PLAN.md

```markdown
## Task 3: Integrate CTA Section Components

### Components from Code Connect (USE DIRECTLY)
- `<Button variant="primary">` from src/components/ui/Button.tsx
  Figma component: "Button/Primary" (node 300:100)
  Props from Figma: { children: "Get Started", size: "lg" }

- `<Card>` from src/components/ui/Card.tsx
  Figma component: "Card/Default" (node 300:200)
  Props from Figma: { variant: "elevated" }

### New Components to Generate
- `<PricingTable>` -- No Code Connect mapping, no similar component exists
  Figma component: "Pricing/Table" (node 300:300)
  Specification: 3-column grid, highlight middle column, DNA spacing tokens

### Mapped by Claude (No Code Connect, Similar Exists)
- `<Badge>` from src/components/ui/Badge.tsx (mapped to Figma "Tag/Default")
  Reason: Figma "Tag" component matches Badge in structure and styling
  Props adaptation: Figma "status" prop -> Badge "variant" prop
```

---

### Pattern 6: Multi-Page Figma File Handling

For Figma files with multiple pages, each page is imported as a separate build cycle. Shared components are detected across imports.

```markdown
## Multi-Page Import Protocol

### Step 1: Present Page Overview
After get_metadata, show all pages with section counts:
"This Figma file has 4 pages:
1. Home (6 sections) -- recommended first import
2. About (3 sections)
3. Services (4 sections)
4. Contact (2 sections)"

### Step 2: User Selects Import Order
User picks one page at a time. Recommended order:
1. Start with the page that has the most shared components (usually Home)
2. Import pages with shared nav/footer next (reuses Code Connect mappings)
3. Import standalone pages last

### Step 3: Shared Component Detection
After first page import:
- Code Connect mappings from page 1 carry forward to page 2+
- Nav, Footer, Button, Card, etc. are already mapped
- Subsequent imports skip re-generating shared components

### Step 4: Cross-Page Beat Validation
When importing page 2+, validate emotional arc:
- Each page gets its own emotional arc (HOOK -> CLOSE)
- Cross-page navigation follows the multi-page architecture skill
- Shared components maintain consistent styling via DNA tokens
```

---

## Layer 3: Integration Context

### DNA Connection

The relationship between Figma data and DNA tokens is hybrid: Figma provides where it has data, DNA fills every gap.

| DNA Domain | Figma Provides | DNA Provides |
|------------|---------------|--------------|
| 12 color tokens (8 semantic + 4 expressive) | Figma variables/styles -> map to DNA tokens | Expressive tokens (glow, tension, highlight, signature) rarely in Figma |
| Display/body/mono fonts | Figma typography -> map to DNA font families | Font loading strategy, fallback stacks |
| 8-level type scale | Figma font sizes -> map to DNA scale levels | Fluid scaling behavior (clamp formulas) |
| 5-level spacing scale | Figma spacing values -> map to DNA scale | Responsive spacing adjustments |
| 8+ motion tokens | Nothing -- Figma is static | All motion: duration, easing, stagger, spring config |
| Signature element | Nothing -- this is a Modulo concept | Full signature element definition and usage rules |
| Forbidden patterns | Nothing -- this is archetype-driven | All forbidden patterns from the selected archetype |
| Creative tension | Nothing -- this is archetype-driven | Tension types, techniques, and placement rules |

### Archetype Relationship

The Figma import does NOT change or select the archetype. The archetype is set during `/modulo:start-design` (before Figma import or alongside it). The import workflow respects the archetype:

- **Figma visual elements that match archetype**: Proceed normally
- **Figma visual elements that conflict with archetype forbidden patterns**: FLAG for user -- "Your Figma design uses a carousel, but the Editorial archetype forbids carousels. Options: (a) Remove carousel, use editorial scroll layout instead (b) Override archetype rule for this element (tension override with documented rationale)"
- **Missing archetype-required elements**: DNA provides -- "Your Figma design doesn't include a signature element. The Brutalist archetype requires a raw concrete texture overlay. Adding to PLAN.md."

### Pipeline Stage

```
Input:
  - Figma file URL (from user)
  - DESIGN-DNA.md (from /modulo:start-design)
  - Design archetype (selected during start-design)

Process:
  - Figma MCP tools extract design data
  - Hybrid resolution maps Figma tokens to DNA tokens
  - Sections are identified and assigned emotional arc beats
  - Code Connect mappings are checked for component reuse

Output:
  - PLAN.md files (one per section, standard format for /modulo:execute)
  - Figma reference screenshots (for visual QA during /modulo:verify)
  - Unmapped color flags (for user decision before execution)
  - Code Connect mapping report (what's reused vs. generated)
```

### Related Skills

- **design-dna** -- Token mapping target for all Figma color, typography, and spacing values. DNA is the source of truth; Figma values are mapped TO DNA tokens.
- **emotional-arc** -- Beat assignment for sections. Claude assigns beats based on section position and content type; Figma provides visual data but not emotional arc metadata.
- **quality-gate-protocol** -- Visual QA overlay diff during verify step. The quality gate uses Figma screenshots as reference targets for pixel-level comparison.
- **live-testing (testing-patterns)** -- Playwright screenshots for the built page side of the overlay diff. Used during visual QA to capture what the browser renders.
- **design-archetypes** -- Archetype constraints that override Figma when conflicts arise. Forbidden patterns from the archetype take precedence over Figma design choices.
- **multi-page-architecture** -- Page-by-page import protocol for multi-page Figma files. Each page follows the multi-page architecture skill's wave structure.
- **compositional-diversity** -- Layout pattern assignment during PLAN.md generation. Even when Figma specifies layouts, diversity rules ensure variety across sections.

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Direct Code Generation from Figma

**What goes wrong:** Generating React/TSX code directly from Figma data instead of producing PLAN.md files. This bypasses the entire Modulo quality pipeline -- no user review of the plan, no creative director assessment, no beat validation, no anti-slop gate enforcement, no layout diversity check.

**Instead:** Always produce PLAN.md files that flow through `/modulo:execute`. The PLAN.md includes all Figma-derived visual specifications, but code generation happens through the normal builder pipeline with all quality gates intact. The user reviews the plan before any code is written.

### Anti-Pattern 2: Calling get_design_context on Full Pages

**What goes wrong:** Calling `get_design_context` on an entire page node (the root frame). For any non-trivial design, this exceeds the token output limit, causing truncated responses with missing components, incomplete styles, and lost hierarchy data. The builder then generates code from incomplete information.

**Instead:** Call `get_metadata` first to get the full node structure. Then call `get_design_context` on individual section-level nodes. If even a section is too large, break into its child nodes. The goal is complete data for each query, not one massive query that truncates.

### Anti-Pattern 3: Hardcoding Figma Colors Over DNA Tokens

**What goes wrong:** Using raw hex values from Figma (e.g., `bg-[#FF6F3C]`) instead of mapping to DNA tokens (e.g., `bg-accent`). This breaks theming, dark mode, DNA enforcement, and archetype consistency. The anti-slop gate will flag arbitrary hex values as non-compliant.

**Instead:** Map every Figma color to a DNA token using the hybrid resolution protocol (Pattern 2). If a color cannot be mapped, FLAG it for user decision with three options: map to existing token, add as new token, or keep as documented deviation. Never silently hardcode a Figma hex value.

### Anti-Pattern 4: Trusting get_variable_defs Alias Chains

**What goes wrong:** Assuming `get_variable_defs` returns the full alias chain (semantic -> primitive references). As of Feb 2026, this tool returns resolved final values, not the alias structure. Building a token hierarchy from this data produces incorrect semantic relationships.

**Instead:** Use `get_variable_defs` output as raw values only. Cross-reference with the DNA token system to reconstruct semantic relationships. When a Figma value matches a DNA token value, map by semantic role (not just value matching). Flag ambiguous matches for user decision.

### Anti-Pattern 5: Ignoring Code Connect Mappings

**What goes wrong:** Generating new components for everything without checking for existing Code Connect mappings. This wastes builder effort, creates duplicate components that drift from the original implementations, and misses project-specific component APIs and behaviors.

**Instead:** Always call `get_code_connect_map` before generating PLAN.md task lists. For components with existing Code Connect mappings, reference the mapped component directly -- the builder uses it as-is. Only generate new components for truly unmapped Figma elements.

### Anti-Pattern 6: Visual QA Without Matching Viewports

**What goes wrong:** Comparing a Figma screenshot captured at one viewport size (e.g., Figma frame width 1440px) with a Playwright screenshot captured at a different viewport (e.g., 1280px or 1920px). Every pixel is shifted, and the diff is 100% noise -- it measures viewport mismatch, not design accuracy.

**Instead:** Match viewport dimensions exactly. Read the Figma frame dimensions from `get_metadata` (the `w` and `h` attributes). Set the Playwright viewport to the same dimensions before capturing. For responsive comparisons, capture at the exact breakpoints defined in the Figma file.

### Anti-Pattern 7: Skipping Emotional Arc During Import

**What goes wrong:** Translating Figma sections into PLAN.md files without assigning emotional arc beats. The sections become a flat sequence of content blocks with no dramatic structure, failing the emotional arc validation and producing a monotonous page that scores poorly on the creativity axis.

**Instead:** Even though Figma does not encode emotional arc data, Claude must assign beats during PLAN.md generation. Analyze each section's content and position: the first visible section is typically HOOK, client logos are PROOF, pricing is BUILD or PEAK, the final section is CLOSE. Apply emotional arc constraints (whitespace %, element count, viewport height) from the emotional-arc skill.

---

## Machine-Readable Constraints

| Parameter | Required | Value | Enforcement |
|-----------|----------|-------|-------------|
| get_metadata before get_design_context | Yes | Always call metadata first for any new file | HARD -- prevents truncation, required for node IDs |
| get_design_context per section (not page) | Yes | One call per section node, not full page | HARD -- prevents truncation |
| Non-token color flagging | Yes | All raw hex values without Figma variables flagged | HARD -- user must decide mapping |
| PLAN.md output (not direct code) | Yes | Every import produces PLAN.md files | HARD -- pipeline integrity requirement |
| Visual QA viewport match | Yes | Same pixel dimensions for both screenshots | HARD -- diff is meaningless otherwise |
| Code Connect check before generation | Yes | get_code_connect_map called before PLAN.md tasks | SOFT -- should check, can skip if project has no Code Connect setup |
| Emotional arc beat assignment | Yes | Every section gets a beat in PLAN.md | HARD -- required for anti-slop gate and creative quality |
| User page selection for multi-page | Yes | User chooses which page to import | HARD -- no auto-importing all pages |
| Screenshot save location | Yes | .planning/modulo/figma-references/ | SOFT -- standard location, can vary |
| Figma variable alias awareness | Yes | Treat get_variable_defs as resolved values only | HARD -- alias chains not reliable |
