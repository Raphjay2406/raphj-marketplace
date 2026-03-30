---
name: "[skill-name]"
description: "[One-line: what this skill provides to agents and builders]"
tier: "[core | domain | utility]"
triggers: "[comma-separated phrases that activate this skill]"
version: "2.0.0"
---

<!-- TEMPLATE: Copy this file to skills/{skill-name}/SKILL.md and fill in each section.
     Target length: 300-600 lines. Each layer serves a distinct purpose. -->

## Layer 1: Decision Guidance

<!-- When and why to use this skill. Conditions, triggers, decision trees.
     This layer helps agents decide IF and HOW to apply this skill. -->

### When to Use

<!-- List the conditions/triggers that indicate this skill is needed. -->

- [Condition A] -- [What this skill provides in that situation]
- [Condition B] -- [Guidance for this trigger]

### When NOT to Use

<!-- Redirect to other skills when this one is the wrong choice. -->

- [Situation] -- Use [other-skill] instead because [reason]

### Decision Tree

<!-- Key branching decisions within this skill's domain. -->

- If [scenario X], use [approach A]
- If [scenario Y], use [approach B]
- If [scenario Z], combine with [related-skill]

### Pipeline Connection

<!-- Which commands/agents reference this skill, at which stage. -->

- **Referenced by:** [agent-name] during [pipeline stage]
- **Consumed at:** [command] workflow step [N]

## Layer 2: Award-Winning Examples

<!-- BOTH copy-paste code blocks AND curated reference sites.
     Code shows HOW. References show WHY. -->

### Code Patterns

#### Pattern: [Pattern Name]

<!-- Copy-paste ready TSX. Include DNA token usage, archetype awareness. -->

```tsx
// Example: Replace with real implementation
export function ExampleComponent() {
  return (
    <section className="bg-bg text-text">
      {/* Uses DNA tokens: bg, text */}
    </section>
  );
}
```

#### Pattern: [Second Pattern Name]

```tsx
// Second common pattern for this skill's domain
```

### Reference Sites

<!-- 3-5 award-winning sites with annotations on what makes them excellent
     in THIS skill's domain. -->

- **[Site Name]** ([url]) -- [What makes it award-winning for this skill: specific technique, visual quality, interaction pattern]
- **[Site Name]** ([url]) -- [Annotation]
- **[Site Name]** ([url]) -- [Annotation]

## Layer 3: Integration Context

<!-- How this skill connects to the rest of the Genorah system.
     DNA mappings, archetype variants, pipeline position, related skills. -->

### DNA Connection

<!-- Which DNA tokens this skill maps to and how. -->

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| [token] | [How this skill uses the token] |
| [token] | [How this skill uses the token] |

### Archetype Variants

<!-- How this skill's behavior changes per archetype. Not every archetype
     needs an entry -- only those with meaningful differences. -->

| Archetype | Adaptation |
|-----------|-----------|
| [archetype] | [Specific change to this skill's behavior] |
| [archetype] | [Specific change] |

### Pipeline Stage

- **Input from:** [What this skill receives from earlier pipeline stages]
- **Output to:** [What this skill produces for later stages]

### Related Skills

- [skill-name] -- [How they connect: shared tokens, sequential usage, etc.]
- [skill-name] -- [Relationship]

## Layer 4: Anti-Patterns

<!-- 3-5 common mistakes specific to this skill's domain.
     Structure: Name, What goes wrong, Instead (correct approach). -->

### Anti-Pattern: [Name]

**What goes wrong:** [Description of the mistake and its impact]
**Instead:** [Correct approach with brief rationale]

### Anti-Pattern: [Name]

**What goes wrong:** [Description]
**Instead:** [Correction]

### Anti-Pattern: [Name]

**What goes wrong:** [Description]
**Instead:** [Correction]

## Optional: Resource Constraints

Skills can declare resource constraints in their YAML frontmatter to restrict what tools and paths are available when the skill is active. The `pre-tool-use` hook enforces these constraints at runtime.

```yaml
constraints:
  allowed_tools: [Read, Write, Edit, Grep, Glob]
  restricted_tools: [Bash]
  max_file_ops: 50
  allowed_paths: ["src/components/", "src/app/"]
  restricted_paths: [".env*", "node_modules/", ".git/"]
  timeout: 300
```

| Field | Type | Description |
|-------|------|-------------|
| `allowed_tools` | string[] | Whitelist of tools this skill permits. If set, only these tools are allowed when the skill is matched. *(Future: not yet enforced)* |
| `restricted_tools` | string[] | Blacklist of tools this skill forbids. Blocked even if otherwise allowed. *(Future: not yet enforced)* |
| `max_file_ops` | integer | Maximum number of Write/Edit operations per session when this skill is active. *(Future: not yet enforced)* |
| `allowed_paths` | string[] | Glob patterns for paths that Write/Edit may target. If set, only matching paths are permitted. *(Future: not yet enforced)* |
| `restricted_paths` | string[] | Glob patterns for paths that Write/Edit must not target. Matches are blocked with a reason message. **Enforced by `pre-tool-use.mjs`.** |
| `timeout` | integer | Maximum seconds for any single tool invocation under this skill. *(Future: not yet enforced)* |

Only `restricted_paths` is currently enforced. Other fields are parsed but reserved for future iterations.

## Machine-Readable Constraints

<!-- OPTIONAL: Only include this section for skills with enforceable parameters.
     Agents extract values from this table for automated checking. -->

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| [param] | [min] | [max] | [unit] | HARD -- reject if outside range |
| [param] | [min] | [max] | [unit] | SOFT -- warn if outside range |
