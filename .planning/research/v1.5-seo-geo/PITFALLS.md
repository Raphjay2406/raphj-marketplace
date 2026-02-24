# Domain Pitfalls: SEO/GEO v1.5 Milestone

**Domain:** SEO, GEO, Sitemaps, IndexNow, AI Search Visibility
**Researched:** 2026-02-25

---

## Critical Pitfalls

Mistakes that cause sites to be invisible to search engines or penalized.

### Pitfall 1: `next/head` in App Router

**What goes wrong:** Using `import Head from 'next/head'` in Next.js App Router projects. The `Head` component is Pages Router only. In App Router, it silently fails -- metadata is completely missing from the rendered HTML with no error or warning.
**Why it happens:** Tutorials and Stack Overflow answers from the Pages Router era still rank highly. LLMs trained on older data generate this pattern.
**Consequences:** Zero metadata in the page `<head>`. No title, no description, no OG tags. Complete SEO failure.
**Prevention:** The skill must explicitly flag this as the #1 Next.js SEO mistake. Use `metadata` export (static) or `generateMetadata` (dynamic) ONLY.
**Detection:** View page source in browser. If `<title>` is missing or shows the default Next.js title, this is likely the cause.

### Pitfall 2: react-helmet-async in React 19

**What goes wrong:** Installing `react-helmet-async` in a React 19 project fails due to peer dependency mismatch. Developers use `--force` or `--legacy-peer-deps` to bypass, creating a fragile dependency.
**Why it happens:** `react-helmet-async` has not been updated for React 19. Neither has the original `react-helmet`. Most React SEO tutorials still recommend these.
**Consequences:** Build failures, runtime errors, or silently broken metadata management.
**Prevention:** Use React 19 native metadata hoisting (`<title>`, `<meta>`, `<link>` auto-hoist to `<head>`). For complex cases, use `@dr.pogodin/react-helmet` (actively maintained fork).
**Detection:** Check `package.json` for `react-helmet-async` or `react-helmet`. If present with React 19, flag for replacement.

### Pitfall 3: Non-Canonical URLs in Sitemap

**What goes wrong:** Sitemap contains URLs that differ from canonical URLs (trailing slash mismatch, www vs non-www, HTTP vs HTTPS, or pages with `rel="canonical"` pointing elsewhere).
**Why it happens:** Sitemap generators often enumerate all discoverable URLs without checking canonical tags.
**Consequences:** As of November 2025, Google Search Console flags "non-canonical pages in XML sitemap" as an **Error** (upgraded from Notice). This actively hurts crawl budget and indexing.
**Prevention:** Sitemap must ONLY contain canonical URLs. Validate that every URL in the sitemap matches its own canonical tag. Enforce trailing slash consistency (pick one approach, apply everywhere).
**Detection:** Submit sitemap to Google Search Console. Check for "Non-canonical pages in XML sitemap" errors.

### Pitfall 4: Blocking AI Search Bots

**What goes wrong:** Site blocks all AI bots in robots.txt (common copy-paste pattern), inadvertently blocking AI SEARCH bots like `OAI-SearchBot` and `PerplexityBot` along with training bots like `GPTBot`.
**Why it happens:** "Block AI bots" advice conflates training bots and search bots. Developers add blanket blocks without understanding the distinction.
**Consequences:** Site becomes invisible in ChatGPT search results, Perplexity answers, and other AI search platforms. With 50%+ of users using AI search, this is a major visibility loss.
**Prevention:** Distinguish between AI training bots (GPTBot, Google-Extended, ClaudeBot -- block if desired) and AI search bots (OAI-SearchBot, ChatGPT-User, PerplexityBot -- allow for visibility). The skill must teach this distinction explicitly.
**Detection:** Check robots.txt for blanket AI bot blocks. Verify that search-specific bots are allowed.

### Pitfall 5: Missing or Invalid JSON-LD

**What goes wrong:** Structured data is syntactically valid JSON but semantically invalid Schema.org (wrong property names, missing required fields, values that don't match visible content).
**Why it happens:** Developers write JSON-LD by hand without type checking. Property names are case-sensitive and easy to misspell. Required fields vary by schema type.
**Consequences:** Rich results do not appear. Google's Rich Results Test shows warnings or errors. AI engines cannot extract structured information.
**Prevention:** Use `schema-dts` TypeScript types to catch errors at compile time. Always validate with Google's Rich Results Test. Ensure JSON-LD data matches visible page content (Google requires this explicitly).
**Detection:** Run Google Rich Results Test. Check Google Search Console for structured data errors.

---

## Moderate Pitfalls

Mistakes that cause degraded SEO performance or missed opportunities.

### Pitfall 6: Missing FAQ Schema (GEO Impact)

**What goes wrong:** Content pages with FAQ-style content (question/answer sections) lack `FAQPage` JSON-LD schema.
**Why it happens:** FAQ schema is often considered optional or low-priority.
**Consequences:** Missing 3.2x higher appearance rate in Google AI Overviews. Missing FAQ rich results in traditional search. Significant GEO opportunity cost.
**Prevention:** Add `FAQPage` JSON-LD to ANY page that has question/answer content. This is the single highest-impact structured data for GEO.

### Pitfall 7: Hardcoded Canonical URLs

**What goes wrong:** Canonical URLs are string literals that become stale when routes change, domains change, or staging URLs leak into production.
**Why it happens:** Copy-paste from documentation examples without parameterizing.
**Consequences:** Duplicate content issues. Canonical points to non-existent page. Staging URLs indexed by Google.
**Prevention:** Generate canonical URLs dynamically. In Next.js, use `metadataBase` + relative `alternates.canonical`. In Astro, use `Astro.url.href`. Never hardcode absolute URLs in component code.

### Pitfall 8: Missing og:image

**What goes wrong:** Pages share on social media with blank previews or random scraped images.
**Why it happens:** Developers focus on title/description and forget the image. No fallback configured.
**Consequences:** Dramatically lower click-through rates from social sharing. Lost brand opportunity.
**Prevention:** Every page type needs a default og:image (1200x630px). Article pages use cover images. Landing pages use branded templates. Set `og:image:width` and `og:image:height` for instant rendering.

### Pitfall 9: Broken hreflang (Missing Return Links)

**What goes wrong:** Page A declares Page B as an alternate language version, but Page B does not declare Page A back. Google ignores the hreflang declaration.
**Why it happens:** Developers add hreflang to new pages but forget to update existing pages with return links.
**Consequences:** Google ignores hreflang. Users see wrong language version in search results. Multi-language SEO fails silently.
**Prevention:** hreflang is bidirectional. Every declaration must be reciprocal. Automate with `generateMetadata` that reads all available locales. Test with Google Search Console International Targeting report.

### Pitfall 10: IndexNow Key File Missing from Build

**What goes wrong:** IndexNow key verification file is not in `public/` directory, or is excluded from build output. IndexNow API returns 403.
**Why it happens:** Key file is created during setup but not committed to source control, or CI/CD pipeline strips it.
**Consequences:** IndexNow submissions fail silently. URLs are not indexed by Bing.
**Prevention:** Add key file to `public/` directory (Next.js) or `public/` (Astro). Commit to source control. Verify file is accessible at `https://domain.com/{key}.txt` after deployment.

---

## Minor Pitfalls

Mistakes that cause annoyance or suboptimal results but are easily fixable.

### Pitfall 11: Sitemap `lastmod` with Static Dates

**What goes wrong:** All sitemap entries have `lastModified: new Date()` (build time), making every URL appear freshly modified on every deploy.
**Consequences:** Search engines lose trust in `lastmod` signal. Eventually ignored entirely.
**Prevention:** Use actual content modification dates. For CMS-backed content, use the content's `updatedAt` timestamp. For static pages, use git commit dates or manual dates.

### Pitfall 12: Duplicate Meta Tags from Layout + Page

**What goes wrong:** Both layout and page define the same meta tags, producing duplicates in HTML.
**Consequences:** Search engines may pick the wrong one. Inconsistent social sharing previews.
**Prevention:** Next.js metadata merges automatically (page overrides layout). In Astro, pass metadata as props to layout `<SEOHead>`. In React 19, later-rendered tags override earlier ones.

### Pitfall 13: Generic Meta Descriptions

**What goes wrong:** All pages use the same meta description (from the layout default) or builder generates "Learn more about [topic]" descriptions.
**Consequences:** Lower CTR from search results. Google may generate its own description instead (which may be worse).
**Prevention:** Every page needs a unique, compelling meta description (120-160 characters). Tie to copy intelligence system. Description should match the page's emotional arc beat.

### Pitfall 14: Sitemap URL Encoding Errors

**What goes wrong:** Sitemap contains unescaped special characters (`&`, `<`, `>`, `'`, `"`). XML parsing fails.
**Consequences:** Search engines cannot parse the sitemap. All URLs in that sitemap are not discovered.
**Prevention:** Framework-native sitemap generators handle encoding correctly. If generating manually, use XML entity escaping for all URL characters.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Meta tag modernization | Pitfall 1 (`next/head` in App Router) | Explicit anti-pattern in skill Layer 4 |
| Meta tag modernization | Pitfall 2 (react-helmet-async + React 19) | Update React/Vite patterns to React 19 native |
| Structured data / GEO | Pitfall 5 (invalid JSON-LD) | Teach `schema-dts` types, link to Rich Results Test |
| Structured data / GEO | Pitfall 6 (missing FAQ schema) | Make FAQ schema a primary teaching focus |
| Proactive indexing | Pitfall 10 (IndexNow key missing) | Include deployment checklist in skill |
| Proactive indexing | Pitfall 4 (blocking AI search bots) | Teach training vs search bot distinction |
| Dynamic OG images | Pitfall 8 (missing og:image) | DNA-integrated OG image as default |
| Sitemap generation | Pitfall 3 (non-canonical URLs) | Validate canonical consistency |
| Sitemap generation | Pitfall 14 (URL encoding) | Use framework-native generators |

---

## Sources

- [Google Search Console sitemap validation](https://support.google.com/webmasters/answer/7451001?hl=en) -- sitemap requirements and error types
- [Semrush canonical URL guide](https://www.semrush.com/blog/canonical-url-guide/) -- canonical pitfalls documentation
- [Frase.io FAQ Schema + GEO](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) -- FAQ schema 3.2x impact data
- [Cloudflare AI Crawler Report](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/) -- AI bot landscape
- [React 19 Release Blog](https://react.dev/blog/2024/12/05/react-19) -- native metadata hoisting
- [Medium: react-helmet React 19 compatibility](https://medium.com/@dimterion/react-helmet-updates-react-19-compatibility-and-possible-alternatives-24d49da6607c) -- react-helmet deprecation
- Existing `seo-meta` skill analysis -- current patterns and gaps

---
*Research completed: 2026-02-25*
