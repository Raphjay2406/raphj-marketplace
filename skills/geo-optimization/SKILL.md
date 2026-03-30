---
name: "geo-optimization"
description: "Generative Engine Optimization for AI search visibility. llms.txt, AI crawler management, BLUF content patterns, citation optimization, E-E-A-T signals, and platform-specific strategies."
tier: "core"
triggers: "geo, ai search, llms.txt, ai visibility, citation, perplexity, chatgpt search, ai overviews, generative engine"
version: "2.0.0"
---

## Layer 1: Decision Guidance

Generative Engine Optimization (GEO) is the practice of structuring content so AI-powered search engines can extract, cite, and surface it in generated answers. Unlike traditional SEO which optimizes for ranked blue links, GEO optimizes for citation -- being the source an AI engine references when answering a user's query.

### The AI Search Landscape

AI search is not a future consideration -- it is a present reality with explosive growth:

- **ChatGPT:** 2.5 billion prompts per day, ChatGPT Search launched as default for all users
- **Google AI Overviews:** Appears on 30-40% of US search queries, expanding globally
- **Perplexity:** 15+ million monthly active users, fastest-growing AI search engine
- **Microsoft Copilot:** Integrated into Bing, Edge, Windows, and Office
- **Claude:** Web search capability via Claude-SearchBot and Claude-User agents
- **Gemini:** Google's AI assistant with deep search integration
- **Apple Intelligence:** Siri powered by Apple's AI with web retrieval via Applebot

**Year-over-year growth:** AI search referral traffic grew 527% YoY (Ahrefs, 2025). Sites not optimized for GEO are losing an accelerating share of visibility.

### How GEO Differs from SEO

| Dimension | Traditional SEO | GEO |
|-----------|----------------|-----|
| Goal | Rank higher in blue links | Get cited in AI answers |
| Success metric | Position, CTR, impressions | Citation frequency, mention rate |
| Content format | Keyword-optimized pages | Fact-dense, quotable paragraphs |
| Discovery | Crawl + index + rank | Crawl + extract + cite |
| Attribution | Link to your page | Named citation with optional link |
| Rich results | Schema triggers visual cards | Schema makes AI extraction more accurate |
| Freshness signal | Moderate weight | High weight (AI engines prefer recent) |

**Key insight:** GEO and SEO are complementary, not competing. Pages that rank well in traditional search are more likely to be cited in AI answers. The `seo-technical` skill handles discoverability; this skill handles citability.

### When to Use

- **Every public-facing website** -- baseline GEO (llms.txt, AI crawler management) applies universally
- **Content-heavy sites (blogs, documentation, guides)** -- full GEO implementation with BLUF, question headings, fact density, quotable statements
- **Service/product pages with substantial copy** -- moderate GEO with entity disambiguation and E-E-A-T signals
- **Sites in competitive niches** -- GEO is a differentiator when traditional SERP positions are saturated
- **Sites targeting informational queries** -- AI engines primarily answer informational queries; transactional less so (for now)

### When NOT to Use

- **Private dashboards behind authentication** -- AI engines cannot access gated content
- **Tauri/Electron desktop apps** -- no web crawling occurs
- **Purely visual pages (portfolios, galleries)** -- minimal text content means minimal GEO opportunity; focus on image SEO instead
- **For technical SEO infrastructure (sitemaps, meta tags)** -- use `seo-technical` skill
- **For JSON-LD structured data** -- use `structured-data-v2` skill (though structured data amplifies GEO)

### Decision Tree

1. **Does the page have 300+ words of substantive content?**
   - Yes: apply full GEO patterns (BLUF, question headings, fact density, quotable statements)
   - No: apply minimal GEO (llms.txt inclusion, entity markup, basic E-E-A-T)

2. **Is the content informational or transactional?**
   - Informational (how-to, explainer, comparison): highest GEO value -- apply all patterns
   - Transactional (product, pricing, checkout): moderate GEO -- focus on product facts and entity disambiguation
   - Navigational (homepage, contact): minimal GEO -- focus on Organization entity and llms.txt

3. **Does the site have an established brand?**
   - Yes: entity disambiguation is critical -- consistent Organization + Person schema across all pages, sameAs linking
   - No: build E-E-A-T signals from scratch -- author bios, original research, case studies

4. **Is the site multi-author?**
   - Yes: individual author pages with Person schema, credentials, social links
   - No: site-level authority signals sufficient

### Pipeline Connection

- **Referenced by:** researcher during discovery (auto-ask about AI search goals), content specialist during content planning, builder during implementation
- **Consumed at:** `/modulo:start-project` discovery includes GEO questions; `/modulo:plan-dev` generates GEO content guidelines; `/modulo:execute` implements llms.txt and content patterns

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: llms.txt

The `llms.txt` file is a structured markdown file placed at your site's root (`/llms.txt`) that helps AI engines quickly understand what your site is about, what content is available, and where to find it. Think of it as a human-and-machine-readable alternative to sitemap.xml specifically designed for language models.

**Format specification:**
- H1 (required): site/project name
- Blockquote: brief summary of what the site offers
- H2 sections: group links by topic
- Links: `- [Page Name](url): Brief description of what this page covers`
- Optional section: clearly marked with `## Optional` for supplementary content

```markdown
# Example SaaS Company

> Example SaaS is a project management platform for distributed teams.
> We help teams ship faster with async collaboration, automated workflows,
> and real-time analytics.

## Core Product

- [Features](https://example.com/features): Complete feature overview including task management, time tracking, and reporting
- [Pricing](https://example.com/pricing): Plans from free tier to enterprise, per-seat pricing model
- [Integrations](https://example.com/integrations): 200+ integrations with Slack, GitHub, Jira, Figma, and more
- [API Documentation](https://example.com/docs/api): REST API reference with authentication, endpoints, and rate limits

## Company

- [About Us](https://example.com/about): Founded 2019, 150+ employees, Series B funded, headquartered in Berlin
- [Careers](https://example.com/careers): Open positions across engineering, design, and customer success
- [Blog](https://example.com/blog): Product updates, engineering insights, and remote work best practices
- [Contact](https://example.com/contact): Support channels, sales inquiries, and partnership requests

## Resources

- [Getting Started Guide](https://example.com/docs/getting-started): 15-minute setup tutorial for new teams
- [Case Studies](https://example.com/case-studies): Customer success stories from teams of 10 to 10,000
- [Changelog](https://example.com/changelog): Weekly product updates and release notes
- [Status Page](https://status.example.com): Real-time system uptime and incident history

## Optional

- [Press Kit](https://example.com/press): Logos, brand guidelines, executive bios, and media contacts
- [Security](https://example.com/security): SOC 2 Type II certified, GDPR compliant, data encryption details
- [Terms of Service](https://example.com/terms): Legal terms governing platform use
- [Privacy Policy](https://example.com/privacy): How we collect, use, and protect user data
```

**Placement:** `https://example.com/llms.txt` (site root, next to robots.txt)

**Next.js implementation:**
```ts
// app/llms.txt/route.ts
export async function GET() {
  const content = `# Your Site Name

> Brief description of your site.

## Main Section

- [Page Name](https://example.com/page): Description
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
```

**Astro implementation:**
```ts
// src/pages/llms.txt.ts
export async function GET() {
  const content = `# Your Site Name
> Brief description.
## Pages
- [Home](https://example.com): Description
`;
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

#### Pattern: llms-full.txt

The companion file `llms-full.txt` provides the complete content of your site in a single markdown document. AI engines can consume this to deeply understand your entire offering without crawling every page.

```ts
// scripts/generate-llms-full.ts
// Run at build time to auto-generate from sitemap + page content
import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import matter from "gray-matter";

async function generateLlmsFull() {
  const contentDir = "./src/content";
  const files = glob.sync(`${contentDir}/**/*.{md,mdx}`);
  const sections: string[] = [];

  sections.push("# Example Company - Complete Content\n");
  sections.push("> Full content export for AI consumption.\n");

  for (const file of files) {
    const raw = readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    sections.push(`## ${data.title}\n`);
    sections.push(`*Published: ${data.date} | Author: ${data.author}*\n`);
    sections.push(content.trim());
    sections.push("\n---\n");
  }

  writeFileSync("./public/llms-full.txt", sections.join("\n"));
}

generateLlmsFull();
```

**Placement:** `https://example.com/llms-full.txt`

#### Pattern: AI Crawler Management (3-Tier robots.txt Strategy)

The full bot identification table for GEO. Cross-reference with `seo-technical` skill for the robots.txt implementation.

| Provider | Training Bot (BLOCK) | Search/Retrieval Bot (ALLOW) | User-Action Bot (ALLOW) |
|----------|---------------------|------------------------------|------------------------|
| OpenAI | GPTBot | OAI-SearchBot | ChatGPT-User |
| Anthropic | ClaudeBot | Claude-SearchBot | Claude-User |
| Perplexity | -- | PerplexityBot | Perplexity-User |
| Google | Google-Extended | Googlebot | -- |
| Meta | Meta-ExternalAgent | -- | -- |
| Apple | -- | Applebot | -- |
| ByteDance | Bytespider | -- | -- |
| Amazon | Amazonbot | -- | -- |
| Common Crawl | CCBot | -- | -- |

**Strategy rationale:**
- **Training bots consume your content into model weights** -- you get no attribution, no link, no traffic. Block them.
- **Search/retrieval bots fetch content to answer specific queries** -- you get citation, attribution, and often a link. Allow them.
- **User-action bots browse on behalf of a specific user** -- blocking them degrades the user experience of people trying to access your content through AI tools. Allow them.

#### Pattern: BLUF Content (Bottom Line Up Front)

BLUF is the single most validated GEO tactic. AI engines extract the first 40-60 words after a heading as the likely answer to the query implied by that heading.

**Structure:** Answer first, then context, then depth.

```markdown
## How much does project management software cost?

Project management software costs $0-30 per user per month for most teams.
Free tiers cover basic task management for up to 10 users. Mid-range plans
($10-15/user) add automation, reporting, and integrations. Enterprise plans
($20-30/user) include SSO, audit logs, and dedicated support.

### Detailed pricing breakdown

[Extended content follows the BLUF opening...]
```

**Wrong (non-BLUF):**
```markdown
## How much does project management software cost?

When evaluating project management tools, there are many factors to consider.
The market has evolved significantly over the past decade, with numerous
options available for teams of all sizes. Let's explore the various pricing
models and what they mean for your budget...
```

**Rules:**
- First 40-60 words after every H2 must contain the direct answer
- Include at least one specific number, date, or named entity in the BLUF
- Follow BLUF with structured supporting content (lists, tables, sub-headings)
- This pattern works for all informational content regardless of archetype

#### Pattern: Question-as-Heading

AI engines match user queries to headings. Headings phrased as questions dramatically increase the chance of content being extracted as an answer.

```markdown
## What is generative engine optimization?

GEO is the practice of structuring content for citation in AI-generated
answers. Unlike SEO which targets ranked links, GEO targets being the
source an AI references...

## How does GEO differ from traditional SEO?

Traditional SEO optimizes for position in search results. GEO optimizes
for citation frequency in AI answers. The key difference is...

## Which AI search engines should I optimize for?

The six major AI search engines in 2026 are Google AI Overviews (largest
reach), ChatGPT Search (fastest growing), Perplexity (highest citation
quality), Microsoft Copilot, Claude, and Gemini...
```

**Rules:**
- Use natural question phrasing that matches how people query AI
- Common patterns: "What is X?", "How does X work?", "How much does X cost?", "What are the best X for Y?"
- Follow every question heading with BLUF content
- Do not force questions where they feel unnatural (hero sections, CTAs)

#### Pattern: Fact Density and Named Citations

AI engines prefer content with verifiable data points. Princeton research found that named citations increase AI visibility by 30-40%.

```markdown
## The ROI of remote work tools

Companies using integrated project management platforms report 23% higher
team productivity (Asana Anatomy of Work Index, 2025). Remote teams with
async-first workflows ship 31% more features per quarter compared to
meeting-heavy teams (GitLab Remote Work Report, 2024).

The average enterprise spends $4,200 per employee annually on SaaS
collaboration tools (Gartner IT Spending Forecast, Q3 2025), with
project management accounting for 12-18% of that budget.
```

**Rules:**
- Include a verifiable statistic every 150-200 words
- Name the source explicitly: "(Source Name, Year)" format
- Use specific numbers, not vague claims ("23% higher" not "significantly higher")
- Dates increase credibility -- include the year for every citation
- Internal data counts: "Based on analysis of 10,000 customer accounts..."

#### Pattern: Quotable Statements

Craft statements that can stand alone as AI citations. These are self-contained, precise, and include numbers or named entities.

**Good (quotable):**
```markdown
Example SaaS reduces average project delivery time by 34% for teams
of 50-200 people, based on analysis of 2,800 customer accounts in 2025.
```

**Bad (not quotable):**
```markdown
Our platform helps teams work better and deliver projects faster,
making everyone more productive and happier.
```

**Rules:**
- Include at least one number, date, or named entity
- Must make sense without surrounding context
- Avoid subjective claims ("best", "leading", "innovative")
- Avoid first-person marketing language where possible
- Each quotable statement should be 1-2 sentences max

#### Pattern: E-E-A-T Signals

E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is Google's quality framework, and AI engines use similar signals to determine source reliability.

**Experience:**
- Case studies with specific outcomes and named clients
- Original research with methodology disclosure
- First-person accounts of processes and results
- Screenshots, videos, and artifacts from real work

**Expertise:**
- Author bios with credentials, certifications, years of experience
- Author pages with Person schema (linked via `sameAs` to LinkedIn, personal site)
- Technical depth that demonstrates domain knowledge
- Peer citations and references to established frameworks

**Authoritativeness:**
- Backlinks from recognized industry sources
- Consistent entity naming across all platforms (site, social, directories)
- Wikipedia/Wikidata presence for the organization
- Speaking engagements, publications, awards

**Trustworthiness:**
- HTTPS everywhere (non-negotiable)
- Clear sourcing for all claims
- Correction/update notices on older content
- Contact information visible and accessible
- Privacy policy and terms of service

#### Pattern: Entity Disambiguation

AI engines must correctly identify which "Example Company" you are. Consistent entity signals across your site and the web prevent confusion with similarly-named entities.

```tsx
// Organization schema with sameAs for entity linking
const organizationSchema = {
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  name: "Example SaaS Inc.",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
  sameAs: [
    "https://www.linkedin.com/company/example-saas",
    "https://twitter.com/examplesaas",
    "https://github.com/example-saas",
    "https://www.crunchbase.com/organization/example-saas",
    "https://en.wikipedia.org/wiki/Example_SaaS",
    "https://www.wikidata.org/wiki/Q123456789",
  ],
  founder: {
    "@type": "Person",
    name: "Jane Doe",
    sameAs: [
      "https://www.linkedin.com/in/janedoe",
      "https://twitter.com/janedoe",
    ],
  },
};
```

**Rules:**
- Use the exact same entity name on every page, every platform, every directory
- Link to 3+ authoritative profiles via `sameAs`
- Wikipedia/Wikidata are the strongest disambiguation signals
- Person entities need the same treatment as Organization entities
- Include `founder`, `employee`, or `member` relationships where applicable

#### Pattern: Platform-Specific Optimization

Each AI search platform has different content preferences:

| Platform | Content Preference | Optimization Focus |
|----------|-------------------|-------------------|
| **Google AI Overviews** | Top-ranking pages + strong E-E-A-T | Rank first in traditional search + comprehensive content |
| **ChatGPT Search** | Encyclopedic, comprehensive coverage | Long-form content, clear structure, exhaustive topic coverage |
| **Perplexity** | Recency + community examples + citations | Fresh content, real-world examples, named sources |
| **Microsoft Copilot** | Bing-indexed content + structured data | Bing SEO + rich schema markup |
| **Gemini** | Strong E-E-A-T + Google Knowledge Graph | Authority signals, entity consistency, topic depth |
| **Claude** | Well-structured, factual, nuanced content | Clear headings, balanced perspectives, cited claims |

#### Pattern: Speakable Schema

Mark content that works well when read aloud by voice assistants:

```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [
      ".article-summary",
      ".key-takeaway",
      ".bluf-paragraph"
    ]
  }
}
```

**Use for:** BLUF paragraphs, key takeaways, FAQ answers -- any content that is self-contained and makes sense spoken aloud.

#### Pattern: GEO Monitoring Tools

Track your AI search visibility with these platforms:

| Tool | What It Tracks | Pricing |
|------|---------------|---------|
| **Profound** | Citation tracking across ChatGPT, Perplexity, Gemini | Enterprise |
| **Otterly AI** | AI search mention monitoring, competitor analysis | From $49/mo |
| **SE Ranking** | AI Visibility metric alongside traditional rankings | From $65/mo |
| **Ahrefs Brand Radar** | Brand mentions in AI-generated answers | Included in Ahrefs |
| **Scrunch AI** | AI search share of voice, citation analysis | From $99/mo |
| **Peec AI** | Real-time AI citation tracking | From $39/mo |

**Manual monitoring:** Regularly search your brand name and key topics in ChatGPT, Perplexity, and Gemini. Note whether your content is cited, how accurately, and which competitors appear alongside you.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `text`, `bg` | Content readability affects AI extraction quality |
| `display-font` | llms.txt and content structure are text-only; font choice is irrelevant for GEO |
| `primary` | N/A for GEO -- AI engines do not see colors |

GEO is primarily a content-structure skill. Design DNA affects GEO indirectly through readability and content hierarchy, but AI engines extract text, not visual presentation.

### Archetype Variants

GEO patterns must be styled to match the project archetype. The content principles are universal; the visual presentation adapts.

| Archetype | GEO Intensity | Adaptation |
|-----------|--------------|------------|
| Neo-Corporate, Data-Dense | Full | All GEO patterns, prominent FAQ sections, dense fact tables |
| Editorial, Dark Academia | Full | Scholarly tone in BLUF, academic citation style, long-form depth |
| Playful/Startup | Moderate | Conversational BLUF, question headings feel natural, facts with personality |
| Organic, Warm Artisan | Moderate | Gentler fact presentation, story-driven BLUF, handcrafted FAQ styling |
| Neubrutalism, AI-Native | Moderate | Bold question headings, stark fact presentation, visually distinctive FAQ |
| Retro-Future, Vaporwave | Moderate | Facts with retro framing, question headings with era-appropriate tone |
| Brutalist, Kinetic | Light | Minimal FAQ (if any), facts embedded in manifesto-style content |
| Ethereal, Glassmorphism | Light | Soft BLUF, facts woven into narrative, subtle FAQ accordion |
| Japanese Minimal | Light | Precise facts, minimal question headings, zen-like FAQ |
| Luxury/Fashion | Light | Curated facts, editorial question headings, premium FAQ presentation |

### Pipeline Stage

- **Input from:** Discovery phase (GEO goals, target AI platforms, competitor AI visibility), content planning (topic clusters, keyword research)
- **Output to:** Content guidelines in PLAN.md, llms.txt generation during Wave 0, content patterns enforced during builder execution

### Pipeline Integration Detail

**During `/modulo:start-project`:**
- Discovery questionnaire auto-includes: "Are you targeting AI search engines (ChatGPT, Perplexity, Google AI Overviews)?"
- If yes: GEO audit of current site, competitor AI visibility analysis

**During `/modulo:plan-dev`:**
- Content specialist generates GEO content guidelines per section
- PLAN.md includes content pattern requirements (BLUF, question headings, fact density targets)

**During `/modulo:execute`:**
- Wave 0: generate `llms.txt` and `llms-full.txt`
- Wave 0: configure robots.txt with 3-tier AI strategy
- Content sections: apply BLUF, question headings, fact density per PLAN.md

**During `/modulo:iterate`:**
- Verify GEO patterns in content review
- Update llms.txt if pages were added/changed

### Related Skills

- `seo-technical` -- handles crawlability, meta tags, and indexing; this skill handles content optimization for AI engines
- `structured-data-v2` -- JSON-LD schema amplifies GEO (FAQPage is 3.2x more likely to appear in AI Overviews); both skills should be applied together
- `accessibility` -- accessible content structure (headings, alt text, semantic HTML) also improves AI extraction
- `emotional-arc` -- GEO patterns (BLUF, question headings) must work within the emotional arc; PROOF beats are natural GEO integration points

## Layer 4: Anti-Patterns

### Anti-Pattern: Blocking AI Search Bots

**What goes wrong:** Site blocks all AI bots in robots.txt without distinguishing between training bots and search/retrieval bots. This removes the site from ChatGPT Search, Perplexity, and Claude search results. The site becomes invisible to the fastest-growing search channel while gaining nothing -- training bots are separate user-agents.
**Instead:** Use the 3-tier strategy. Block training bots (GPTBot, ClaudeBot, Google-Extended, Meta-ExternalAgent, CCBot). Allow search bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot). See the bot table in Layer 2.

### Anti-Pattern: No llms.txt File

**What goes wrong:** Site relies solely on sitemap.xml for AI engine discovery. While AI engines can crawl sitemaps, llms.txt provides structured context that helps AI engines understand what your site offers and which pages are most important. Without it, AI engines must infer site structure from crawling alone.
**Instead:** Create llms.txt at site root with H1, summary blockquote, H2 sections, and descriptive link lists. Generate llms-full.txt at build time for comprehensive content access. Both files are simple to create and maintain.

### Anti-Pattern: Thin Content Without Facts

**What goes wrong:** Pages have 200+ words of generic marketing copy without a single verifiable fact, statistic, named source, or specific claim. AI engines deprioritize thin content because there is nothing worth citing. "We are a leading provider of innovative solutions" gives an AI engine nothing to extract.
**Instead:** Include a verifiable statistic every 150-200 words. Name sources explicitly. Use specific numbers instead of vague claims. Even service pages can include concrete data: team size, years in business, number of clients, specific outcomes.

### Anti-Pattern: Ignoring Entity Disambiguation

**What goes wrong:** Organization and person names are inconsistent across the site and external platforms. LinkedIn says "Example Inc.", the site says "Example", Twitter says "ExampleHQ", and Google Business Profile says "Example LLC". AI engines cannot confidently associate these as the same entity, fragmenting your authority signals.
**Instead:** Use the exact same entity name everywhere. Add Organization and Person schema with sameAs links to all authoritative profiles. Register on Wikipedia/Wikidata if eligible. Audit all external profiles for name consistency.

### Anti-Pattern: Forcing GEO on Visual Pages

**What goes wrong:** Builder forces BLUF paragraphs, question headings, and FAQ sections onto portfolio pages, hero sections, and landing pages where the emotional arc drives the experience. The result feels like a Wikipedia article wearing a tuxedo -- technically optimized but experientially broken.
**Instead:** Apply GEO intensity per archetype (see Layer 3 table). Visual-first pages get minimal GEO (entity markup, llms.txt inclusion). Content-heavy pages get full GEO. Let the emotional arc lead; GEO patterns serve the content, not the other way around.

### Anti-Pattern: Outdated AI Bot List

**What goes wrong:** robots.txt was written in 2023 and only blocks GPTBot. New AI training bots (Bytespider, Amazonbot, Meta-ExternalAgent) and new search bots (Claude-SearchBot, OAI-SearchBot) are not accounted for. The site blocks the wrong bots and allows the wrong ones.
**Instead:** Review and update the bot list quarterly. The AI ecosystem is evolving rapidly. Check provider documentation for current user-agent strings. The bot table in Layer 2 is current as of version 2.0.0.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| bluf_word_count | 40 | 60 | words | SOFT -- warn if BLUF opening exceeds 60 words |
| fact_density_interval | 100 | 200 | words | SOFT -- warn if no verifiable fact within 200 words |
| llms_txt_present | 1 | 1 | file | HARD -- must exist at site root |
| question_headings_ratio | 0.3 | 1.0 | ratio | SOFT -- at least 30% of H2s should be questions on content pages |
| eeat_author_bio_present | 1 | 1 | per author | HARD -- every named author must have a bio |
| entity_sameAs_links | 3 | 10 | links | SOFT -- at least 3 sameAs links per Organization entity |
| ai_search_bots_allowed | 1 | 1 | boolean | HARD -- AI search bots must not be blocked in robots.txt |
| ai_training_bots_blocked | 1 | 1 | boolean | HARD -- AI training bots must be blocked in robots.txt |
