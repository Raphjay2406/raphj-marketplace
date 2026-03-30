# Search Visibility: AI Crawler Taxonomy

> Last verified: 2026-02-25 | Review cadence: Quarterly
> Extends Phase 14 seo-meta AI bot taxonomy with preset system and updated bot list

## Purpose

This appendix provides the complete AI crawler taxonomy for robots.txt generation with three business-context presets. The search-visibility skill's Layer 2 robots.txt patterns reference this file for the full bot list and preset templates. Phase 14's seo-meta skill provides the base robots.txt foundation (crawl directives for `/api/`, `/admin/`, `/_next/`, sitemap reference); this appendix extends it with AI-specific preset rules.

## Why Three Presets

Different businesses have different AI visibility goals. A media company protecting exclusive content has different needs than a SaaS startup wanting maximum AI search exposure. The three presets represent equal, valid business choices -- not a spectrum from wrong to right. There is no universally correct answer. The user's business context determines the correct preset -- maximizing reach, protecting content, or finding a middle ground are all legitimate strategies with documented trade-offs.

## Three-Tier Bot Classification

### AI Search Bots (ALLOW in Open and Selective presets)

These bots power AI-enhanced search experiences. Blocking them removes the site from AI search results (ChatGPT search, Perplexity answers, DuckAssist, Gemini Deep Research, etc.).

| User-Agent | Operator | Purpose | Respects robots.txt | Last Verified |
|------------|----------|---------|---------------------|---------------|
| `OAI-SearchBot` | OpenAI | ChatGPT search -- fetches content for real-time search answers | Yes | 2026-02-25 |
| `ChatGPT-User` | OpenAI | ChatGPT user-initiated browsing -- fetches URLs when a user shares a link or asks to "read this page" | Yes | 2026-02-25 |
| `PerplexityBot` | Perplexity | Perplexity AI search engine -- indexes content for Perplexity search results | Yes | 2026-02-25 |
| `DuckAssistBot` | DuckDuckGo | DuckDuckGo AI-assisted answers -- fetches content for DuckAssist feature | Yes | 2026-02-25 |
| `Claude-SearchBot` | Anthropic | Claude search -- fetches content for Claude's real-time search feature | Yes | 2026-02-25 |
| `Applebot` | Apple | Siri, Spotlight, and Safari suggestions -- also serves traditional search; dual purpose as both AI and traditional search bot | Yes | 2026-02-25 |
| `Gemini-Deep-Research` | Google | Gemini Deep Research feature (Dec 2025) -- fetches content when users trigger deep research mode in Gemini | Yes | 2026-02-25 |

### AI Training Bots (BLOCK in Selective and Restrictive presets)

These bots scrape content for model training. Blocking them prevents content from entering training datasets without consent. Allowing them may improve future AI model quality with the site's content.

| User-Agent | Operator | Purpose | Respects robots.txt | Last Verified |
|------------|----------|---------|---------------------|---------------|
| `GPTBot` | OpenAI | Model training -- highest traffic volume among AI training bots; crawls broadly for GPT training data | Yes | 2026-02-25 |
| `Google-Extended` | Google | Gemini model training -- opt-out mechanism for Google's Gemini/Bard training data collection | Yes | 2026-02-25 |
| `ClaudeBot` | Anthropic | Claude model training -- replaces deprecated `anthropic-ai` and `claude-web` user agents (July 2024) | Yes | 2026-02-25 |
| `CCBot` | Common Crawl | Open training datasets -- provides the Common Crawl corpus used by many AI labs for model training | Yes | 2026-02-25 |
| `Meta-ExternalAgent` | Meta | Meta AI training -- entered the market at 19% of AI bot traffic share; crawls for Meta's AI model training | Yes | 2026-02-25 |
| `Bytespider` | ByteDance | TikTok AI training -- crawls content for ByteDance's AI models including those powering TikTok features | Yes | 2026-02-25 |
| `cohere-ai` | Cohere | Cohere model training -- crawls content for Cohere's enterprise AI models | Yes | 2026-02-25 |
| `Amazonbot` | Amazon | Amazon AI features -- crawls content for Alexa, Amazon search, and other AI-powered Amazon services | Yes | 2026-02-25 |
| `Applebot-Extended` | Apple | Extended Apple AI training -- goes beyond search indexing to collect data for Apple Intelligence features | Yes | 2026-02-25 |

### User-Triggered Fetchers (ALLOW in Open and Selective, varies in Restrictive)

These bots fetch content when a specific user requests it (e.g., "summarize this page" in an AI chat). Blocking them degrades user experience for people actively trying to access the site's content through AI tools.

| User-Agent | Operator | Purpose | Known Issues | Last Verified |
|------------|----------|---------|--------------|---------------|
| `Claude-User/1.0` | Anthropic | User-initiated web access in Claude -- fetches pages when a user explicitly asks Claude to read a URL | None reported | 2026-02-25 |
| `Perplexity-User/1.0` | Perplexity | User-triggered fetching in Perplexity -- fetches pages when a user's query requires live content | FLAG: Reported to sometimes ignore robots.txt directives. Include in robots.txt anyway -- partial compliance is better than none. | 2026-02-25 |
| `ChatGPT-User` | OpenAI | Dual-purpose: also listed under AI Search Bots. When a ChatGPT user shares a URL or asks to browse, this bot fetches the content. | None reported | 2026-02-25 |

### Emerging/Niche Bots (monitor)

These bots may shift categories as their purpose becomes clearer. Check quarterly.

| User-Agent | Operator | Purpose | Notes |
|------------|----------|---------|-------|
| `Timpibot` | Timpi | Decentralized search engine crawler | Small market share; watch for growth |
| `Diffbot` | Diffbot | Structured data extraction for AI applications | Used by multiple AI platforms; category may split |
| `Webzio-Extended` | Webz.io | Web data collection for AI training | Growing presence; may warrant promotion to training bots |
| `YouBot` | You.com | You.com AI search engine | Small but growing AI search platform |
| `Kangaroo Bot` | Kangaroo LLM | AI search and training | Emerging; purpose not fully documented |
| `ImagesiftBot` | Imagesift | AI-powered image search and analysis | Niche; image-focused crawling |

## Deprecated Bot Names

- `anthropic-ai` -- replaced by `ClaudeBot` (July 2024)
- `claude-web` -- replaced by `ClaudeBot` (July 2024)

Note: ClaudeBot still honors rules set for the deprecated names for backwards compatibility. However, use `ClaudeBot` in all new robots.txt configurations.

## Three Preset Templates

All three presets are equal options. The correct choice depends entirely on the site's business goals, content licensing strategy, and AI visibility preferences.

### Open Preset (Maximize AI Visibility)

**Who should choose this:** Sites that benefit from maximum AI exposure -- open-source documentation, public knowledge bases, marketing sites wanting AI search citations, startups seeking discoverability, educational content, community projects.

**Trade-off:** Your content may be used for AI model training without compensation. Training bots generally respect robots.txt, but allowing them is a one-way door -- once content is in a training dataset, it cannot be removed.

```
# =============================================================================
# robots.txt -- Open Preset (Maximize AI Visibility)
# All crawlers welcome -- search, training, and user-triggered
# =============================================================================

# Standard crawlers -- allow everything except private paths
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# No AI-specific blocks -- all AI bots inherit the wildcard Allow: / rule
# This means search bots, training bots, and user-triggered fetchers
# all have full access to public content

Sitemap: https://example.com/sitemap.xml
```

### Selective Preset (Allow Search, Block Training)

**Who should choose this:** Sites that want AI search visibility (appear in ChatGPT search, Perplexity answers, etc.) but want to prevent content from being scraped for model training. Most content publishers fall here.

**Trade-off:** Reduced future AI model quality with your content. Training bots generally respect robots.txt, but compliance is voluntary -- not legally enforced. Some content may still enter training datasets through other channels (Common Crawl archives, third-party aggregators).

```
# =============================================================================
# robots.txt -- Selective Preset (Allow Search, Block Training)
# AI search bots welcome -- training bots blocked
# =============================================================================

# Standard crawlers -- allow everything except private paths
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# ---------------------------------------------------------------------------
# AI Search Bots -- ALLOW (appear in AI-powered search results)
# ---------------------------------------------------------------------------
# These bots power ChatGPT search, Perplexity, DuckAssist, Gemini, etc.
# Blocking them removes the site from AI search results entirely.

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Gemini-Deep-Research
Allow: /

# ---------------------------------------------------------------------------
# AI Training Bots -- BLOCK (prevent content from entering training datasets)
# ---------------------------------------------------------------------------
# These bots scrape content for model training, not for serving search results.
# Blocking them does NOT affect AI search visibility.

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

### Restrictive Preset (Block All AI Bots)

**Who should choose this:** Sites with exclusive or premium content, paywalled publications, sites with strict content licensing agreements, or sites that want zero AI interaction of any kind.

**Trade-off:** Site is invisible in ALL AI-powered search (ChatGPT search, Perplexity answers, DuckAssist, Gemini Deep Research). Only traditional search engines (Google organic, Bing organic) see content. Users who try to share your URL with an AI assistant will get "I can't access that page" responses.

```
# =============================================================================
# robots.txt -- Restrictive Preset (Block All AI Bots)
# No AI interaction -- search, training, or user-triggered
# =============================================================================

# Standard crawlers -- allow everything except private paths
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# ---------------------------------------------------------------------------
# Block ALL AI bots -- search, training, and user-triggered
# ---------------------------------------------------------------------------
# This removes the site from all AI-powered experiences.
# Only traditional search engines (Google, Bing organic) will see content.

# OpenAI bots (training + search + user browsing)
User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

# Google AI bots (training + deep research)
User-agent: Google-Extended
Disallow: /

User-agent: Gemini-Deep-Research
Disallow: /

# Anthropic bots (training + search + user access)
User-agent: ClaudeBot
Disallow: /

User-agent: Claude-SearchBot
Disallow: /

User-agent: Claude-User
Disallow: /

# Perplexity bots (search + user-triggered)
User-agent: PerplexityBot
Disallow: /

User-agent: Perplexity-User
Disallow: /

# DuckDuckGo AI
User-agent: DuckAssistBot
Disallow: /

# Training-only bots
User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Amazonbot
Disallow: /

# Apple AI (extended training -- note: blocking Applebot-Extended does NOT
# block Applebot, which is Apple's search/Siri bot)
User-agent: Applebot-Extended
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

## Next.js robots.ts Implementation

The programmatic TypeScript implementation generates robots.txt dynamically based on an environment variable. This is the framework-native approach for Next.js projects -- it produces the same output as the static templates above but allows switching presets per environment (e.g., Open in staging, Selective in production).

```typescript
// app/robots.ts -- generates robots.txt with AI crawler presets
import type { MetadataRoute } from 'next'

type AIPreset = 'open' | 'selective' | 'restrictive'

// Configure via environment variable: AI_ROBOTS_PRESET=open|selective|restrictive
const AI_PRESET: AIPreset = (process.env.AI_ROBOTS_PRESET as AIPreset) ?? 'selective'

const AI_SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'DuckAssistBot',
  'Claude-SearchBot',
  'Applebot',
  'Gemini-Deep-Research',
]

const AI_TRAINING_BOTS = [
  'GPTBot',
  'Google-Extended',
  'ClaudeBot',
  'CCBot',
  'Meta-ExternalAgent',
  'Bytespider',
  'cohere-ai',
  'Amazonbot',
  'Applebot-Extended',
]

const AI_USER_TRIGGERED = [
  'Claude-User',
  'Perplexity-User',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
  ]

  if (AI_PRESET === 'selective') {
    // Allow AI search bots explicitly
    for (const bot of AI_SEARCH_BOTS) {
      rules.push({ userAgent: bot, allow: '/' })
    }
    // Block AI training bots
    for (const bot of AI_TRAINING_BOTS) {
      rules.push({ userAgent: bot, disallow: '/' })
    }
    // User-triggered fetchers inherit wildcard Allow
  } else if (AI_PRESET === 'restrictive') {
    // Block ALL AI bots (search + training + user-triggered)
    for (const bot of [...AI_SEARCH_BOTS, ...AI_TRAINING_BOTS, ...AI_USER_TRIGGERED]) {
      rules.push({ userAgent: bot, disallow: '/' })
    }
  }
  // 'open' preset: no additional rules -- wildcard Allow covers all bots

  return { rules, sitemap: `${baseUrl}/sitemap.xml` }
}
```

**Astro note:** Astro uses static `public/robots.txt` files. Copy the appropriate preset template from the sections above into `public/robots.txt`. For Astro SSR projects that need dynamic preset switching, create an API endpoint at `src/pages/robots.txt.ts` following the same logic.

## Market Context (Feb 2026)

- GPTBot traffic grew from 5% to 30% of all AI bot traffic (May 2024 to May 2025)
- Meta-ExternalAgent entered the market at 19% traffic share, immediately becoming a top-3 AI training bot
- 560,000+ sites now have AI-bot-specific robots.txt rules (up from ~50,000 in early 2024)
- Perplexity-User robots.txt non-compliance remains a known industry issue -- multiple sources report it sometimes fetches content despite `Disallow: /` directives
- Google-Extended (training) and Gemini-Deep-Research (search) are now distinct bots with different purposes -- blocking one does not affect the other
- ClaudeBot replaced both `anthropic-ai` and `claude-web` in July 2024; the old names are still honored for backwards compatibility

## Review Protocol

1. Check this taxonomy quarterly against current AI crawler reports (Cloudflare Bot Radar, Search Engine Journal AI crawler list, individual operator documentation)
2. When a new bot appears: identify the operator, classify as search/training/user-triggered, add to the appropriate table, and update all three preset templates
3. When an existing bot changes purpose (search <-> training): move it to the correct category and update all three preset templates
4. Update the "Last verified" date at the top of this file
5. Re-verify deprecated bot name handling quarterly (check if old names are still honored)
6. Check Perplexity-User compliance status -- if resolved, remove the FLAG notation
7. Review Emerging/Niche Bots for promotion to a main category
