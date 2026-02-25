# SEO Meta: AI Crawler Taxonomy

> Last verified: 2026-02-25 | Review cadence: Quarterly
> Source: Cloudflare AI Bot Report, Momentic Marketing, multiple SEO sources

## Purpose

This appendix provides the complete AI crawler taxonomy for robots.txt generation. The `seo-meta` skill's robots.txt patterns reference this file for the full bot list. The recommended strategy is **BLOCKLIST**: allow all bots by default, explicitly block known training bots.

## Why Distinguish Search vs Training Bots

AI crawlers serve two fundamentally different purposes. **Search bots** fetch your content to display it in AI-powered search results (ChatGPT search, Perplexity answers, Bing Copilot summaries) -- blocking them hides your site from a growing traffic channel. **Training bots** scrape your content to train language models -- blocking them protects your intellectual property from being absorbed into model weights without consent. The distinction is critical: a blanket "block all AI bots" rule sacrifices visibility in AI search to protect against training, when you can achieve both goals by blocking selectively.

## Bot Categories

### Search Bots (ALLOW)

These bots fetch your content to surface it in AI-powered search results. Blocking them removes your site from AI answer engines -- equivalent to blocking Googlebot for traditional search.

| User-Agent | Operator | Purpose | Why Allow | Respects robots.txt |
|---|---|---|---|---|
| `Googlebot` | Google | Traditional search indexing + AI Overviews | Primary search traffic source; also powers Google AI Overviews (SGE) | Yes |
| `Bingbot` | Microsoft | Bing search + Copilot answers | Powers Bing search results and Microsoft Copilot AI answers | Yes |
| `OAI-SearchBot` | OpenAI | ChatGPT search results | Surfaces your content when users search within ChatGPT; growing traffic channel | Yes |
| `ChatGPT-User` | OpenAI | User-triggered page fetches in ChatGPT | Fetches pages when users share links or ask ChatGPT to read a URL; user-initiated, not crawling | Yes |
| `PerplexityBot` | Perplexity | Perplexity AI search | Powers Perplexity answer engine; cites your content with source links | Yes |
| `DuckAssistBot` | DuckDuckGo | DuckAssist AI answers | Provides AI-generated answers in DuckDuckGo search results with source attribution | Yes |
| `Applebot` | Apple | Siri, Spotlight, Safari suggestions | Powers Apple's search features across iOS, macOS, and Safari; large mobile audience | Yes |
| `YandexBot` | Yandex | Yandex search | Primary search engine in Russia and CIS countries; relevant for international sites | Yes |

### Training Bots (BLOCK by default)

These bots scrape your content to train AI language models. Blocking them does not affect your search visibility -- it only prevents your content from being used as training data. The default recommendation is to block these bots. If a site owner explicitly wants to contribute to AI training (open-source projects, public datasets, etc.), they can remove specific blocks.

| User-Agent | Operator | Purpose | Why Block | Respects robots.txt |
|---|---|---|---|---|
| `GPTBot` | OpenAI | GPT model training data collection | Content used to train GPT models without compensation or consent; 30% of AI bot traffic as of May 2025 | Yes |
| `Google-Extended` | Google | Gemini AI model training | Separates Gemini training from Google Search indexing; blocking this does not affect search rankings | Yes |
| `ClaudeBot` | Anthropic | Claude model training data | Content used to train Claude models; separate from Claude's search functionality | Yes |
| `anthropic-ai` | Anthropic | Anthropic general data collection | Broader Anthropic data collection agent; training-focused | Yes |
| `CCBot` | Common Crawl | Open dataset used by many AI companies | Common Crawl dataset is a primary training source for most large language models; widely used | Yes |
| `Meta-ExternalAgent` | Meta | LLM training data for Meta AI | Entered at 19% market share; collects data for Meta's Llama models and AI products | Yes |
| `Bytespider` | ByteDance | AI model training for TikTok/Douyin | ByteDance's aggressive crawler for training AI models; high crawl volume reported | Yes |
| `cohere-ai` | Cohere | Cohere model training | Training data for Cohere's enterprise LLM products | Yes |
| `Amazonbot` | Amazon | AI and search data collection | Collects data for Amazon's AI services and Alexa; dual-purpose but primarily training | Yes |
| `FacebookBot` | Meta | Content indexing for Meta platforms | Indexes content for Facebook/Instagram link previews and Meta AI features | Yes |

### User-Triggered Fetchers (ALLOW)

These bots fetch pages on-demand when a user explicitly requests it (shares a link, clicks a citation, asks an AI to read a page). They are not autonomous crawlers -- they only visit pages a human pointed them at. Allow them for the same reason you allow any user's browser.

| User-Agent | Operator | Purpose | Notes | Respects robots.txt |
|---|---|---|---|---|
| `ChatGPT-User` | OpenAI | Fetches page when user shares link in ChatGPT | Also listed under Search Bots; dual role as both search and user-triggered | Yes |
| `Perplexity-User` | Perplexity | Fetches page when user clicks citation in Perplexity | **Known issue: generally ignores robots.txt.** This is a documented industry concern -- Perplexity has been criticized for not respecting disallow rules. Blocking in robots.txt may not be effective. | Generally no |
| `MistralAI-User` | Mistral | Fetches content for Le Chat citation display | Relatively new; user-triggered only when Le Chat cites a source | Unknown |
| `claude-web` | Anthropic | Fetches recent web content for Claude conversations | Activated when Claude needs current web information for a user query | Unknown |
| `Claude-SearchBot` | Anthropic | Claude search results | Fetches pages for Anthropic's search-augmented Claude responses | Yes |

### Emerging/Niche Bots (monitor)

These bots are relatively new or serve niche purposes. They may shift categories as their operators clarify usage. Monitor them quarterly and recategorize as needed.

| User-Agent | Operator | Purpose | Current Assessment |
|---|---|---|---|
| `Applebot-Extended` | Apple | Apple Intelligence training data | Likely training-focused; may warrant blocking once Apple clarifies usage. Separate from regular `Applebot` (search). |
| `AI2Bot` | Allen Institute for AI | Research AI training data | Academic/research crawler; lower volume. Block if protecting content from any training use. |
| `YouBot` | You.com | You.com AI search engine | Primarily search-focused; may belong in Search Bots category as You.com grows. |
| `PhindBot` | Phind | Developer-focused AI search | Developer search tool; fetches documentation and code content. Allow for developer-facing sites. |
| `ExaBot` | Exa | Exa AI search engine | Semantic search engine for AI applications. Monitor for volume and purpose clarity. |

## Market Trends

These trends inform the urgency of maintaining an up-to-date robots.txt:

- **GPTBot:** Surged from 5% to 30% of all AI bot traffic between May 2024 and May 2025
- **Meta-ExternalAgent:** Entered the market at 19% share -- aggressive data collection for Llama models
- **560,000+ sites** now have AI-bot-specific robots.txt rules (up from near-zero in 2023)
- **Perplexity-User:** robots.txt non-compliance is a known and documented industry issue -- multiple publishers have reported Perplexity fetching content despite `Disallow` rules
- **Google-Extended:** Google's solution for separating search indexing (Googlebot) from AI training (Google-Extended) -- blocking Google-Extended does NOT affect search rankings

## Complete robots.txt Template

This is the comprehensive version with all bots from all categories. The `seo-meta` SKILL.md shows abbreviated versions for each framework -- this appendix has the complete list with inline comments explaining each rule.

```
# =============================================================================
# robots.txt -- Complete AI Crawler Taxonomy
# Generated by Modulo seo-meta skill
# Last verified: 2026-02-25 | Review quarterly
# Strategy: BLOCKLIST (allow all, explicitly block training bots)
# =============================================================================

# -----------------------------------------------------------------------------
# STANDARD CRAWLERS -- ALLOW with exclusions
# -----------------------------------------------------------------------------
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# -----------------------------------------------------------------------------
# SEARCH BOTS -- ALLOW for visibility in search results
# These bots surface your content in traditional and AI-powered search.
# Blocking them is equivalent to de-indexing your site from that platform.
# -----------------------------------------------------------------------------

# Google Search + AI Overviews
User-agent: Googlebot
Allow: /

# Bing Search + Microsoft Copilot
User-agent: Bingbot
Allow: /

# ChatGPT search results
User-agent: OAI-SearchBot
Allow: /

# User-shared links in ChatGPT
User-agent: ChatGPT-User
Allow: /

# Perplexity AI search
User-agent: PerplexityBot
Allow: /

# DuckDuckGo AI answers
User-agent: DuckAssistBot
Allow: /

# Apple Siri, Spotlight, Safari
User-agent: Applebot
Allow: /

# Yandex search (Russia/CIS)
User-agent: YandexBot
Allow: /

# Anthropic Claude search
User-agent: Claude-SearchBot
Allow: /

# -----------------------------------------------------------------------------
# USER-TRIGGERED FETCHERS -- ALLOW (on-demand, not autonomous crawling)
# These only visit pages when a human explicitly requests it.
# -----------------------------------------------------------------------------

# Mistral Le Chat citation fetch
User-agent: MistralAI-User
Allow: /

# Anthropic Claude web content fetch
User-agent: claude-web
Allow: /

# Note: Perplexity-User generally ignores robots.txt (documented issue).
# Including a rule anyway for completeness, but enforcement is unreliable.
User-agent: Perplexity-User
Allow: /

# -----------------------------------------------------------------------------
# TRAINING BOTS -- BLOCK to protect content from model training
# Blocking these does NOT affect search visibility.
# Remove specific Disallow rules if you want to opt in to training.
# -----------------------------------------------------------------------------

# OpenAI GPT training (30% of AI bot traffic)
User-agent: GPTBot
Disallow: /

# Google Gemini training (does NOT affect Google Search)
User-agent: Google-Extended
Disallow: /

# Anthropic Claude training
User-agent: ClaudeBot
Disallow: /

# Anthropic data collection
User-agent: anthropic-ai
Disallow: /

# Common Crawl (primary training dataset for most LLMs)
User-agent: CCBot
Disallow: /

# Meta Llama training (19% market share)
User-agent: Meta-ExternalAgent
Disallow: /

# ByteDance AI training
User-agent: Bytespider
Disallow: /

# Cohere model training
User-agent: cohere-ai
Disallow: /

# Amazon AI/Alexa data collection
User-agent: Amazonbot
Disallow: /

# Meta content indexing
User-agent: FacebookBot
Disallow: /

# -----------------------------------------------------------------------------
# EMERGING BOTS -- monitor quarterly, recategorize as needed
# Currently not blocked; assess during quarterly review.
# -----------------------------------------------------------------------------

# Apple Intelligence training (may warrant blocking)
# User-agent: Applebot-Extended
# Disallow: /

# Allen Institute research AI
# User-agent: AI2Bot
# Disallow: /

# You.com AI search (likely search, not training)
# User-agent: YouBot
# Allow: /

# Phind developer AI search
# User-agent: PhindBot
# Allow: /

# Exa semantic search
# User-agent: ExaBot
# Allow: /

# -----------------------------------------------------------------------------
# SITEMAP -- Required. Update URL to match your domain.
# -----------------------------------------------------------------------------
Sitemap: https://example.com/sitemap.xml
```

## Opting In to Training

The default recommendation blocks training bots because most site owners have not explicitly consented to their content being used as AI training data. However, this is a **business decision, not a technical one**. If a site owner wants to allow training:

1. **Opt in to specific bots:** Remove the `Disallow: /` rule for the specific training bot(s) you want to allow
2. **Opt in to all training:** Remove the entire "TRAINING BOTS" section, leaving only the standard crawler and search bot rules
3. **Partial opt-in:** Allow training bots access to specific directories (e.g., `Allow: /blog/` for blog content only) while blocking access to proprietary pages

Common reasons to opt in: open-source projects, academic publications, public datasets, content creators who want broader AI distribution, companies that have licensing agreements with AI providers.

## Review Protocol

1. **Check quarterly** (March, June, September, December) against current AI crawler reports
2. **Sources to monitor:**
   - Cloudflare Bot Radar (cloudflare.com/radar) -- real-time bot traffic data
   - web.dev announcements -- Google's crawler and indexing updates
   - OpenAI, Anthropic, Meta developer docs -- new bot announcements
   - SEO industry publications (Search Engine Land, Ahrefs Blog) -- ecosystem changes
3. **When a new bot appears:** Categorize as search / training / user-triggered based on the operator's documentation. Add to the appropriate table with rationale.
4. **Update the "Last verified" date** at the top of this file after each review
5. **If a bot changes category** (training bot becomes search bot, or vice versa): Move it to the correct table, update the robots.txt template, and note the change in the SKILL.md changelog
6. **Track market share shifts** -- if a training bot becomes dominant (like GPTBot's 5% to 30% surge), note it in Market Trends for context