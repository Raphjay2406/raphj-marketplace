---
name: awwwards-scoring
description: "Awwwards-aligned 4-axis scoring rubric: Design, Usability, Creativity, Content. Detailed criteria per level, SOTD prediction, and competitive benchmark process."
---

Use this skill during verification to score sites against Awwwards standards, or when the user wants to understand what makes a site award-worthy. Triggers on: awwwards, SOTD, site of the day, award, scoring, quality score, competitive benchmark, award-worthy, design quality.

You are an Awwwards jury member evaluating sites for Site of the Day. You score ruthlessly but fairly across all 4 axes. A score below 8.0 average means the site isn't competitive. A score below 7 on any single axis is a dealbreaker.

## The 4-Axis Rubric

### Axis 1: Design (/10)
Visual quality, aesthetic coherence, and craft.

| Score | Level | Criteria |
|-------|-------|----------|
| 1-3 | **Template** | Default Tailwind colors, Inter font, uniform spacing, no visual personality. Looks AI-generated. No depth, no signature element. |
| 4-6 | **Competent** | Custom palette but safe choices. Typography has some hierarchy. Spacing varies but isn't rhythmic. Some depth (shadows) but no layering. One or two nice details but nothing memorable. |
| 7-8 | **Award-worthy** | Distinctive palette with personality. Typography has clear character (display font, varied weights, tuned tracking). Spatial rhythm creates breathing. Multiple depth levels (shadows, glass, overlaps). Signature element present. Would be at home on Dribbble Popular. |
| 9-10 | **Exceptional** | Every pixel intentional. Color palette tells a story. Typography is ART. Spatial relationships create tension and release. Depth creates a physical sense of layering. The signature element alone is screenshot-worthy. Sets a new visual standard. |

**Key indicators for 8+:**
- Color palette has at least one unexpected/bold choice
- Typography uses a distinctive display font with tight tracking on headlines
- At least one grid-breaking element (overlap, asymmetry, full-bleed)
- Depth through 3+ techniques (shadow layers, glass, gradients, overlaps)
- Micro-details visible on close inspection (noise texture, gradient borders, custom selection color)

### Axis 2: Usability (/10)
How well does the site actually WORK for users?

| Score | Level | Criteria |
|-------|-------|----------|
| 1-3 | **Broken** | Horizontal overflow. Missing mobile layout. No hover states. Buttons without clear affordance. Inaccessible (no keyboard nav, no ARIA labels). |
| 4-6 | **Functional** | Works on desktop and mobile. Basic hover states. Navigation works. Some accessibility. But no delight — interactions feel generic. |
| 7-8 | **Polished** | Smooth responsive behavior across all breakpoints. Rich hover/focus/active states. Navigation has current indicator. Forms have inline validation. Loading states present. Keyboard accessible. Touch targets 44px. Content hierarchy guides the eye. |
| 9-10 | **Delightful** | Every interaction has micro-feedback (100ms response). Progressive disclosure manages complexity. Navigation shrinks/transforms on scroll. Skeleton loading. Optimistic UI. Anchor navigation for long pages. Every state handled (empty, error, loading, success). Reduced motion respected. |

**Key indicators for 8+:**
- Navigation: sticky, shrinks, current indicator, mobile overlay
- Buttons: immediate active state feedback (< 100ms)
- Forms: labels above, inline errors, outcome-driven button text
- Content flow: F-pattern or Z-pattern, scroll indicators, anchor links
- Accessibility: keyboard navigable, ARIA labels, contrast AA+

### Axis 3: Creativity (/10)
Is this original? Does it push boundaries?

| Score | Level | Criteria |
|-------|-------|----------|
| 1-3 | **Generic** | Seen this 100 times before. Hero + features + testimonials + CTA with no twist. Every section looks like every other SaaS landing page. |
| 4-6 | **Decent** | One or two interesting choices (unusual color, nice animation) but the overall structure is conventional. No wow moment. No creative tension. |
| 7-8 | **Inventive** | At least one stop-scrolling moment. Creative tension present (unexpected scale, material collision, interaction shock). Layout has at least one unconventional section. Motion choreography (not just fade-in). Emotional arc has variety — not flat. |
| 9-10 | **Groundbreaking** | Multiple wow moments that feel fresh. Creative tension throughout (2-3 per page). Layout breaks conventions while remaining usable. Motion tells a story. You haven't seen this exact combination before. Makes you want to build something. |

**Key indicators for 8+:**
- At least one creative tension moment (scale violence, material collision, etc.)
- At least one wow moment (cursor-responsive, scroll-driven, interactive)
- Emotional arc with beat variation (not all BUILD beats)
- Section layout diversity (no two adjacent sections share the same pattern)
- Something you'd screenshot and send to a designer friend

### Axis 4: Content (/10)
Is the copy/content quality matching the design quality?

| Score | Level | Criteria |
|-------|-------|----------|
| 1-3 | **Placeholder** | Lorem ipsum. "Feature 1, Feature 2." "Submit" buttons. Stock photo descriptions. |
| 4-6 | **Adequate** | Real copy but generic. "Learn More" everywhere. Headlines don't grab. No personality in the voice. Descriptions are functional but forgettable. |
| 7-8 | **Compelling** | Headlines create emotional response. Button copy describes outcomes. Voice matches the archetype/brand personality. Social proof is specific (names, companies, metrics). Empty states are helpful. |
| 9-10 | **Exceptional** | Every word earns its place. Headlines are quotable. Micro-copy has personality. Error messages are helpful AND charming. The copy alone tells a complete story of the product. You remember specific phrases after leaving the site. |

**Key indicators for 8+:**
- Hook headline creates immediate emotional response (< 8 words)
- No "Submit", "Learn More", or "Click Here" on any button
- CTA text describes outcomes ("Start Building Free" not "Sign Up")
- Social proof is specific (company names, real metrics, named testimonials)
- Friction reducers present ("No credit card", "2-min setup")

---

## SOTD Prediction

### Scoring Thresholds

| Average Score | Verdict |
|--------------|---------|
| 8.5+ | **Strong SOTD contender** — top 10% of submissions |
| 8.0-8.4 | **SOTD competitive** — will be considered, may win |
| 7.5-7.9 | **Honorable Mention** range — good but not SOTD |
| 7.0-7.4 | **Developer Award** possible — technically good, needs creative push |
| Below 7.0 | **Not competitive** — needs significant iteration |

### Hard Rules
- **No dimension below 7** — a 10/10 in Design can't save a 5/10 in Usability
- **Minimum 8.0 average** across all 4 axes for SOTD consideration
- **Design + Creativity ≥ 17** — visual impact is table stakes

### Score Adjustment Factors
- **Mobile excellence** adds +0.5 to Usability (if mobile experience is as good as desktop)
- **Performance issues** subtract -1 from Usability (if Lighthouse < 80)
- **Broken interactions** subtract -2 from Creativity (impressive ideas that don't work)
- **Placeholder content** caps Content at 4 (regardless of other quality)

---

## Competitive Benchmark Process

Before building, benchmark against current SOTD winners:

### Step 1: Capture References
Identify 3-5 recent SOTD winners in the same category (SaaS, portfolio, e-commerce, etc.). Note:
- Color palette approach and uniqueness
- Typography choices and hierarchy
- Layout patterns and grid-breaking moments
- Motion/animation approach and intensity
- Signature interaction or visual element
- Content quality and copywriting style

### Step 2: Identify the Bar
From the references, determine:
- **Minimum techniques required** to be competitive (e.g., "all winners use custom cursors")
- **Common patterns to AVOID** (if all winners do X, doing X won't stand out)
- **Opportunity gaps** (something none of the winners do, but would be impressive)

### Step 3: Set Target Scores
Based on the benchmark, set minimum scores per axis:
- Design: 8+ (this is non-negotiable for SOTD)
- Usability: 8+ (broken usability is an instant disqualifier)
- Creativity: 8+ (the differentiator — this is where you win or lose)
- Content: 7+ (content quality often forgotten — competitive advantage)

### Step 4: Score During Verification
During `/modulo:verify`, run the full 4-axis scoring on the completed site. Report each axis score, overall average, and SOTD prediction.

## Scoring Report Template

```markdown
## Awwwards Scoring Assessment

### Design: [X]/10
[2-3 sentence justification]
- Strength: [what's strong]
- Gap: [what's weak]

### Usability: [X]/10
[2-3 sentence justification]
- Strength: [what's strong]
- Gap: [what's weak]

### Creativity: [X]/10
[2-3 sentence justification]
- Strength: [what's strong]
- Gap: [what's weak]

### Content: [X]/10
[2-3 sentence justification]
- Strength: [what's strong]
- Gap: [what's weak]

### Overall: [X.X]/10 average
**SOTD Prediction:** [Strong contender / Competitive / Honorable Mention / Not competitive]

### Priority Improvements for SOTD
1. [Most impactful change for score improvement]
2. [Second most impactful]
3. [Third most impactful]
```
