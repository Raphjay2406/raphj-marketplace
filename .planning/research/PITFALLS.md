# Domain Pitfalls: SEO/GEO, Sitemap, IndexNow & API Integration

**Domain:** SEO/GEO optimization, sitemap generation, IndexNow, and API integration for a Claude Code design plugin
**Researched:** 2026-02-25
**Confidence:** HIGH (SEO/sitemap/canonical), MEDIUM (IndexNow/GEO), HIGH (API security), HIGH (framework-specific), HIGH (plugin architecture)
**Scope:** v1.5 milestone pitfalls -- what can go wrong when adding these capabilities to Genorah 2.0

---

## Critical Pitfalls

Mistakes that cause search engine penalties, security breaches, or fundamental skill quality collapse.

---

### PITFALL C1: Structured Data Mismatch -- Schema Claims What the Page Doesn't Show

**What goes wrong:** JSON-LD structured data describes content that doesn't match what's visible on the page. The schema says "Product" with price "$29" but the visible page shows "$39" (price changed, schema wasn't updated). Or FAQ schema marks up questions that exist only in the JSON-LD, not in the rendered HTML. Google's policy is explicit: "Don't mark up content that is not visible to readers of the page."

**Why it happens in Genorah's context:** Builders generate JSON-LD from PLAN.md data and page content from CONTENT.md independently. If content changes during iteration (price update, FAQ rewrite, feature list edit), the JSON-LD is often not updated in sync. The schema is "set and forget" -- it's generated once in Wave 0-1 and never re-verified against actual page content after iterations.

**Consequences:**
- Google manual action for "Spammy Structured Markup" -- page loses rich result eligibility
- Rich snippets showing wrong information (wrong price, outdated hours) erodes user trust
- Manual actions don't affect core ranking directly, but loss of rich results drops CTR significantly
- Recovery from manual actions requires filing a reconsideration request, which takes weeks

**Warning signs:**
- JSON-LD generated in a different wave than the page content it describes
- No post-iteration step that re-validates schema against visible content
- Schema contains hardcoded values instead of referencing the same data source as the UI
- Multiple schema blocks on a page with overlapping scope

**Prevention:**
1. **Single source of truth for schema data** -- JSON-LD and visible UI must derive from the same data object. The skill must teach: "Never hardcode values in schema that are computed or variable in the UI. Extract a shared data constant."
2. **Post-iteration schema audit** -- Any content change that touches prices, dates, FAQs, or product details must trigger a schema re-check. Add this to the iterate command's blast radius analysis.
3. **Validate before deploy** -- The skill must include Google's Rich Results Test URL and Schema.org Validator as mandatory pre-deployment steps, not optional suggestions.
4. **Only mark up what's visible** -- Explicit rule in the skill: "Every `@type` in your JSON-LD must correspond to content the user can see and read on the page."

**Phase mapping:** Core SEO skill (structured data section), iterate command (blast radius for schema)
**Confidence:** HIGH -- Google's structured data policies are explicit and well-documented.

**Sources:**
- [Google Structured Data Policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Fixing JSON-LD Issues in GSC](https://salt.agency/blog/fixing-common-json-ld-structured-data-issues-in-google-search-console/)
- [Schema Markup Errors That Kill Rankings](https://robertcelt95.medium.com/common-schema-markup-errors-that-kill-your-seo-rankings-cc64a83480af)

---

### PITFALL C2: Canonical URL Misconfiguration -- Silent Duplicate Content Disaster

**What goes wrong:** Canonical URLs are wrong, missing, or contradictory. Common failures: (a) relative canonical URLs instead of absolute, (b) canonical pointing to a different page's content, (c) paginated pages all canonicalized to page 1, (d) canonical in `<body>` instead of `<head>` (Google ignores it), (e) trailing slash inconsistency creating two "different" URLs for the same content.

**Why it happens in Genorah's context:** The current `seo-meta` skill shows canonical URL patterns, but builders often hardcode canonical URLs as strings rather than generating them dynamically. When routes change during iteration, stale canonicals persist. Multi-page sites with similar content (product variants, localized pages) are especially vulnerable. Additionally, framework differences in URL handling (Next.js uses `metadataBase` + relative, Astro uses `Astro.url.href`, React/Vite has no built-in canonical) create inconsistency.

**Consequences:**
- Google indexes the wrong URL version, splitting link equity
- Duplicate content dilutes ranking signals -- Google picks one "preferred" version and may ignore the other
- Crawl budget wasted on duplicate URLs
- Bing December 2025 research confirms: duplicate content hurts both traditional SEO and AI search visibility

**Warning signs:**
- Canonical URLs using relative paths (`href="/about"` instead of full URL)
- Multiple `<link rel="canonical">` tags on one page
- Canonical URL doesn't match the actual page URL
- Trailing slash handled inconsistently across routes
- No `metadataBase` set in Next.js root layout

**Prevention:**
1. **Always absolute URLs** -- The skill must enforce: "Canonical URLs must be absolute with protocol and domain. Never use relative paths."
2. **Dynamic generation, never hardcoded** -- Canonical must be derived from the current route. Next.js: `alternates.canonical` relative to `metadataBase`. Astro: `Astro.url.href`. React/Vite: construct from `window.location.origin + pathname`.
3. **Trailing slash policy** -- Pick one (with or without) and enforce it site-wide via framework config (`trailingSlash` in `next.config.js` and `astro.config.mjs`).
4. **One canonical per page** -- Explicit rule: "Never have more than one `<link rel="canonical">`. If layout and page both set canonical, the page wins."
5. **Self-referencing canonical as default** -- Every page's canonical should point to itself unless there's an explicit reason to point elsewhere.

**Phase mapping:** Core SEO skill (canonical URL section), framework patterns (per-framework canonical implementation)
**Confidence:** HIGH -- Google's canonical documentation is definitive.

**Sources:**
- [Google Canonical URL Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Canonical Tags Explained](https://www.straightnorth.com/blog/canonical-tags-explained-how-to-prevent-duplicate-content-and-protect-rankings/)
- [Bing on Duplicate Content and AI Search](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)

---

### PITFALL C3: API Key Exposure in Client-Side Code

**What goes wrong:** Environment variables containing API keys (IndexNow keys, CRM API keys, analytics tokens) are accidentally exposed to the browser. In Next.js, any variable prefixed with `NEXT_PUBLIC_` is bundled into client JavaScript and visible to anyone viewing page source. In Astro, `PUBLIC_` prefix does the same. In React/Vite, `VITE_` prefix exposes to client. Developers prefix variables for convenience without understanding the security implications.

**Why it happens in Genorah's context:** Builders need API keys for IndexNow submission endpoints, CRM integrations, and external API calls. The most common mistake: putting a secret API key in `NEXT_PUBLIC_HUBSPOT_API_KEY` because the component "needs it" on the client side. Additionally, a critical CVE-2025-66478 in Next.js (CVSS 10.0) demonstrated that even server-side secrets can leak through Server Function source code exposure.

**Consequences:**
- API keys scraped from client bundles, used for unauthorized access
- Rate limits exhausted by malicious actors using stolen keys
- Financial exposure if keys have billing implications (cloud APIs, SaaS services)
- Security breach of connected systems (CRM data, customer records)
- Compliance violations (GDPR, SOC 2) if customer data is accessible via exposed keys

**Warning signs:**
- Any `NEXT_PUBLIC_`, `PUBLIC_`, or `VITE_` variable containing "KEY", "SECRET", "TOKEN", or "API"
- API calls made directly from client-side components to external services
- `.env` files with sensitive values and public prefixes
- No server-side proxy pattern for external API calls

**Prevention:**
1. **Server-side proxy pattern as the default** -- The skill must teach: "Never call external APIs directly from client components. Always route through server actions (Next.js), API routes (Next.js/Astro), or server endpoints (Astro). The server holds the secret; the client calls your server."
2. **Prefix audit rule** -- Explicit checklist in the skill: "Audit every `NEXT_PUBLIC_` / `PUBLIC_` / `VITE_` variable. If it contains a secret, it MUST NOT have a public prefix."
3. **Framework-specific env patterns** -- Provide correct patterns for each framework:
   - Next.js: Use server actions or Route Handlers; access `process.env.SECRET` only in server code
   - Astro: Use server endpoints (`src/pages/api/`); access `import.meta.env.SECRET` only in server code
   - React/Vite: Use a separate backend proxy; Vite has no server-side runtime
4. **React Taint APIs** -- For Next.js, mention `experimental_taintObjectReference` and `experimental_taintUniqueValue` as additional safeguards.
5. **IndexNow key is NOT a secret** -- Clarify that the IndexNow API key is public by design (it's hosted in a public `.txt` file). It doesn't need the proxy pattern. This distinction prevents over-engineering.

**Phase mapping:** API integration skill (env handling section), IndexNow skill (key management section)
**Confidence:** HIGH -- Next.js CVE-2025-66478 and env prefix behavior are well-documented.

**Sources:**
- [Next.js Data Security Guide](https://nextjs.org/docs/app/guides/data-security)
- [CVE-2025-66478 Security Advisory](https://nextjs.org/blog/CVE-2025-66478)
- [Astro Environment Variables Docs](https://docs.astro.build/en/guides/environment-variables/)
- [Astro Issue #13960: Non-PUBLIC_ vars exposed](https://github.com/withastro/astro/issues/13960)

---

### PITFALL C4: React/Vite SPA Invisibility to Search Engines

**What goes wrong:** A React/Vite project renders an empty `<div id="root">` to crawlers. All content, metadata, structured data, and even the `<title>` tag are injected client-side via JavaScript. Google's Web Rendering Service can execute JS, but it's a secondary crawl that happens later (sometimes days later) and is resource-constrained. Bing and AI crawlers (GPTBot, ClaudeBot) may not execute JS at all. The site is functionally invisible to search.

**Why it happens in Genorah's context:** Genorah targets Next.js, Astro, and React/Vite. The first two have server rendering built in. React/Vite does not. Builders following the same patterns across frameworks will produce client-rendered metadata in Vite projects. The current `seo-meta` skill shows `react-helmet-async` for Vite, which only works client-side -- crawlers see nothing.

**Consequences:**
- Zero indexing for React/Vite projects (no content visible to crawlers)
- SSR-indexed pages show 96% indexing stability; CSR pages are unreliable
- JSON-LD structured data rendered client-side may not be parsed by Google
- `react-helmet-async` meta tags are invisible until JS executes
- Sitemap and robots.txt are fine, but linked pages have no content to index

**Warning signs:**
- React/Vite project with no pre-rendering strategy
- View-source showing only `<div id="root"></div>` with no content
- `react-helmet-async` used without SSR setup (no `HelmetProvider` on server)
- No discussion of pre-rendering in the project plan

**Prevention:**
1. **Framework-specific SEO capability matrix** -- The skill must include a clear table:

   | Feature | Next.js | Astro | React/Vite |
   |---------|---------|-------|------------|
   | Server-rendered meta tags | Yes (built-in) | Yes (built-in) | NO (requires pre-render) |
   | Server-rendered JSON-LD | Yes | Yes | NO |
   | Static sitemap generation | Yes (`app/sitemap.ts`) | Yes (`@astrojs/sitemap`) | Manual or build plugin |
   | IndexNow server endpoint | Yes (Route Handler) | Yes (server endpoint) | NO (needs external service) |
   | Dynamic OG images | Yes (`ImageResponse`) | Manual | NO |

2. **Pre-rendering guidance for Vite** -- If the project is React/Vite and needs SEO, recommend: (a) switch to Astro or Next.js, or (b) add `vite-plugin-ssr` / `vite-ssg` for pre-rendering, or (c) accept that the site will have limited SEO capability.
3. **Honest limitation disclosure** -- The skill must state plainly: "React/Vite SPAs cannot achieve full SEO parity with server-rendered frameworks. If SEO is a primary goal, use Next.js or Astro."
4. **Tauri/Electron exemption** -- Desktop apps (Tauri, Electron) don't need SEO at all. The skill should detect this and skip SEO guidance entirely.

**Phase mapping:** Core SEO skill (framework capability matrix), decision guidance layer
**Confidence:** HIGH -- CSR SEO limitations are well-established and widely documented.

**Sources:**
- [How to Fix Technical SEO on Client-Side React Apps](https://searchengineland.com/how-to-fix-technical-seo-issues-on-client-side-react-apps-455124)
- [React SEO Best Practices](https://ahrefs.com/blog/react-seo/)
- [SPA SEO Optimization](https://www.wedowebapps.com/spa-seo-optimize-single-page-applications/)

---

## Major Pitfalls

Mistakes that cause search engine validation failures, broken indexing, or significant rework.

---

### PITFALL M1: Sitemap XML Validation Failures

**What goes wrong:** The generated sitemap fails GSC or Bing Webmaster Tools validation. Common failures: (a) unescaped special characters in URLs (`&` instead of `&amp;`), (b) invalid date formats (not W3C Datetime), (c) sitemap exceeds 50MB uncompressed or 50,000 URL limit, (d) including `noindex` pages in the sitemap, (e) HTTP/HTTPS protocol mismatch, (f) URLs returning 404 or 301 redirects.

**Why it happens in Genorah's context:** The current skill shows `changeFrequency` and `priority` fields in sitemap examples, but Google and Bing have publicly stated they ignore both. This is wasted effort that signals the skill is outdated. Additionally, Next.js's `sitemap.ts` convention generates valid XML, but Astro's `@astrojs/sitemap` requires the `site` field in config -- if it's missing, the build succeeds but no sitemap is generated (silent failure). For React/Vite, there's no built-in sitemap generation at all.

**32% of submitted sitemaps contain errors** that prevent proper processing, according to Google Search Console data.

**Consequences:**
- GSC reports "Couldn't fetch" or "Sitemap has errors"
- Pages not discovered or indexed despite being in the sitemap
- Wasted crawl budget on 404 URLs in sitemap
- Large sites hit the 50K limit without sitemap index splitting

**Warning signs:**
- Sitemap examples using `changeFrequency` or `priority` (Google/Bing ignore these)
- `lastmod` dates set to `new Date()` (always today) instead of actual content modification date
- No sitemap index strategy for sites with 100+ pages
- Astro config missing `site` field
- URLs in sitemap not matching canonical URLs

**Prevention:**
1. **Drop `changeFrequency` and `priority`** -- The skill must not include these deprecated fields. Google explicitly ignores them. Bing "largely disregards" them. Remove from all examples.
2. **Accurate `lastmod` only** -- Use actual content modification dates, not build dates. If the real date isn't available, omit `lastmod` entirely rather than using a fake date. Bing specifically values accurate `lastmod`.
3. **URL escaping** -- Teach the 5 XML-required escape codes: `&` to `&amp;`, `'` to `&apos;`, `"` to `&quot;`, `<` to `&lt;`, `>` to `&gt;`. Framework sitemap generators handle this, but custom implementations often miss `&` in query strings.
4. **Sitemap index for scale** -- If the site could grow beyond 50K URLs, generate a sitemap index from day one. The pattern is cheap and future-proof.
5. **Canonical-sitemap alignment** -- Every URL in the sitemap must be the canonical version. No `noindex` pages. No redirecting URLs. No HTTP URLs if site is HTTPS.
6. **Framework-specific gotchas**:
   - Next.js: `app/sitemap.ts` works but [reported issue #75836](https://github.com/vercel/next.js/issues/75836) -- "Couldn't fetch" errors with Vercel edge functions. Test after deployment.
   - Astro: Must set `site` in `astro.config.mjs` or sitemap silently fails. In SSR mode, the official sitemap integration can't discover dynamic content -- need a custom endpoint.
   - React/Vite: No built-in solution. Generate static `sitemap.xml` at build time via script.

**Phase mapping:** Sitemap skill (generation patterns), framework-specific sections, verification checklist
**Confidence:** HIGH -- Google's sitemap specification and Bing's lastmod documentation are authoritative.

**Sources:**
- [Google Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Bing on Importance of lastmod](https://blogs.bing.com/webmaster/february-2023/The-Importance-of-Setting-the-lastmod-Tag-in-Your-Sitemap)
- [Next.js Sitemap GSC Issue #75836](https://github.com/vercel/next.js/issues/75836)
- [Fixing Astro Sitemap in SSR Mode](https://colinmcnamara.com/blog/fixing-astro-sitemap-ssr-mode)
- [Sitemap XML Errors That Hurt SEO](https://www.gtechme.com/insights/fix-xml-sitemap-errors-for-better-seo/)

---

### PITFALL M2: IndexNow Key Management and Verification Failures

**What goes wrong:** IndexNow submissions silently fail because: (a) the key file isn't hosted at the root of the domain, (b) the key file content doesn't exactly match the key used in API calls, (c) the key file is blocked by robots.txt or returns wrong MIME type, (d) developers treat the IndexNow key as a secret and don't host the verification file, (e) batch submissions exceed rate limits and get 429 errors without proper retry logic.

**Why it happens in Genorah's context:** IndexNow is a newer protocol that most developers haven't used. Its verification model (public key file at domain root) is unusual -- it's the opposite of typical API key secrecy. Builders coming from a "hide all keys" mindset will either not host the verification file or put it behind authentication. Additionally, each framework has a different mechanism for serving static files from the root (Next.js `public/`, Astro `public/`, Vite `public/`) and different API route patterns for the submission endpoint.

**Consequences:**
- IndexNow submissions rejected silently (no error page, just ignored)
- URLs not indexed despite believing they were submitted
- 429 rate limit errors with no retry logic cause permanent submission gaps
- Key rotation without updating the hosted file breaks all future submissions

**Warning signs:**
- Key file not accessible at `https://domain.com/{key}.txt`
- Key file returning HTML instead of plain text
- API submission endpoint on client side (exposes submission logic unnecessarily)
- No retry logic for 429 responses
- No `Retry-After` header handling
- Submitting same URLs repeatedly without content changes

**Prevention:**
1. **Verification-first setup** -- The skill must teach setup in order: (1) generate key, (2) host key file in `public/` directory, (3) verify file is accessible via browser, (4) then implement submission endpoint. Not the reverse.
2. **Key format rules** -- Key must be 8-128 characters, hexadecimal plus dashes. The key file must be UTF-8 encoded plain text with only the key as content. Filename must be `{key}.txt` exactly.
3. **Framework-specific file hosting**:
   - Next.js: Place `{key}.txt` in `public/` directory. It will be served at root automatically.
   - Astro: Place `{key}.txt` in `public/` directory. Same behavior.
   - React/Vite: Place in `public/` directory. Vite serves it at root in dev; build copies it to `dist/`.
4. **Submission endpoint patterns**:
   - Next.js: Route Handler at `app/api/indexnow/route.ts` -- server-side POST
   - Astro: Server endpoint at `src/pages/api/indexnow.ts`
   - React/Vite: External service or build-time submission script (no server runtime)
5. **Rate limiting discipline** -- Teach: submit only changed URLs, batch up to 10,000 per POST, wait 10+ minutes before resubmitting the same URL, implement exponential backoff on 429 responses with `Retry-After` header respect.
6. **IndexNow key is public** -- Explicitly state: "Unlike API keys for external services, the IndexNow key is designed to be public. It's a domain ownership proof, not an authentication secret. Do NOT treat it as a secret."

**Phase mapping:** IndexNow skill (setup, submission, troubleshooting sections)
**Confidence:** MEDIUM -- Official IndexNow documentation is authoritative but sparse on edge cases. Rate limits are "undisclosed" per search engine.

**Sources:**
- [IndexNow Official Documentation](https://www.indexnow.org/documentation)
- [IndexNow FAQ](https://www.indexnow.org/faq)
- [Common IndexNow Challenges](https://www.navishark.com/en/kb/6vm98r/common-challenges-and-solutions-when-adopting-indexnow)
- [IndexNow Protocol SEO Guide](https://gracker.ai/seo-101/indexnow-protocol-seo-guide)

---

### PITFALL M3: GEO Over-Optimization Cannibalizing Traditional SEO

**What goes wrong:** In pursuit of AI search visibility (Google AI Overviews, Bing Copilot, Perplexity), content is restructured in ways that hurt traditional search rankings. Specific failures: (a) stuffing pages with statistics and citations that feel unnatural to human readers, (b) adding FAQ schemas for questions nobody actually asks, (c) restructuring content for "quotability" at the expense of readability, (d) blocking AI crawlers (GPTBot, ClaudeBot) out of fear they'll "steal" content, then wondering why the site doesn't appear in AI answers.

**Why it happens in Genorah's context:** Genorah sites target premium design and brand presence. GEO optimization can clash with design intent -- adding verbose FAQ sections, citation-heavy paragraphs, and stat-laden blocks to a minimalist Brutalist or Japanese Minimal site destroys the aesthetic. The skill must balance SEO/GEO effectiveness with design integrity.

**The data is stark:** When AI-generated answers appear on Google, organic click-through rates dropped 61% (from 1.76% to 0.61%) as of September 2025. Being cited IN the AI answer becomes critical. But the research also shows: "Statistics Addition" and "Quotation Addition" improve visibility by 28-41%, while "Keyword Stuffing" performs worse.

**Consequences:**
- Content restructured for AI quotability reads poorly for human visitors
- FAQ schemas added where no real questions exist trigger spam signals
- Blocking AI crawlers means zero AI search visibility
- Over-optimization creates a "content farm" feel that contradicts premium brand positioning
- Traditional SEO rankings drop because content quality degrades

**Warning signs:**
- FAQ schema on pages where there are no actual FAQs in the UI (schema-only markup)
- robots.txt blocking GPTBot, ClaudeBot, PerplexityBot
- Content rewritten to be "AI-parseable" at the expense of brand voice
- Statistics added to every paragraph regardless of relevance
- GEO and SEO treated as separate strategies with different content

**Prevention:**
1. **Unified SEO+GEO strategy** -- The skill must teach: "There is no separate GEO content. Good SEO content IS good GEO content. Clear structure, authoritative citations, and factual accuracy serve both."
2. **Archetype-aware GEO** -- GEO elements must respect the archetype:
   - Brutalist/Japanese Minimal: Fewer FAQ blocks, focus on clear headings and concise statements
   - Editorial/Data-Dense: Natural fit for statistics and citations
   - Luxury/Neo-Corporate: Case studies and testimonials serve as natural "quotable" content
3. **Schema only for real content** -- "Never add FAQ schema unless there are actual FAQ questions visible on the page. Never add HowTo schema unless there are actual steps. The schema must describe what exists."
4. **Allow AI crawlers by default** -- robots.txt should allow GPTBot, ClaudeBot, Google-Extended unless the client explicitly requests otherwise. Being cited in AI answers is the new backlink.
5. **Measure both** -- Track traditional search rankings AND AI citation appearances. If traditional rankings drop after GEO changes, roll back.

**Phase mapping:** GEO optimization skill, robots.txt configuration, content strategy integration
**Confidence:** MEDIUM -- GEO is an emerging field (the foundational paper is from 2023). Best practices are evolving rapidly. Statistics are from 2025 studies that may shift.

**Sources:**
- [GEO Research Paper (arXiv)](https://arxiv.org/pdf/2311.09735)
- [GEO vs SEO Guide (Strapi)](https://strapi.io/blog/generative-engine-optimization-vs-traditional-seo-guide)
- [GEO Best Practices 2026 (WordStream)](https://www.wordstream.com/blog/generative-engine-optimization)
- [GEO Best Practices (First Page Sage)](https://firstpagesage.com/seo-blog/generative-engine-optimization-best-practices/)
- [Mastering GEO in 2026 (Search Engine Land)](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)

---

### PITFALL M4: Next.js Metadata API Misuse Across Router Boundaries

**What goes wrong:** Builders use Pages Router metadata patterns (`import Head from 'next/head'`) in App Router projects, or vice versa. The `Head` component does nothing in App Router -- metadata is silently missing, pages have no title, no description, no OG tags. The page looks fine in the browser but is invisible to social sharing and has degraded SEO.

**Additionally in Next.js 15+:** `params` became a Promise and must be awaited in `generateMetadata`. Old patterns that destructure params directly cause runtime errors. Streaming metadata (15.2+) means metadata may not be in the initial HTML for bots that don't execute JS.

**Why it happens in Genorah's context:** The current `seo-meta` skill already warns about this (Layer 4, Anti-Pattern 1). But the skill needs to be updated for Next.js 15+ async params and streaming metadata behavior. Builders trained on Next.js 14 patterns will write `generateMetadata({ params: { slug } })` which fails in Next.js 15+ where params is a Promise.

**Consequences:**
- Silent metadata absence (no error, just empty tags)
- Social sharing shows blank preview or site name only
- SEO ranking drops due to missing titles and descriptions
- `generateMetadata` crashes with unhelpful async errors

**Warning signs:**
- `import Head from 'next/head'` in any App Router file
- `generateMetadata` destructuring params directly without `await`
- No `metadataBase` set in root layout
- Static `metadata` export used where dynamic data is needed

**Prevention:**
1. **Router detection in the skill** -- App Router: use `metadata` export or `generateMetadata`. Pages Router: use `<Head>`. Never mix.
2. **Next.js 15+ async params pattern** -- Update all examples to: `const { slug } = await params;`
3. **`metadataBase` as mandatory** -- Every Next.js project must set `metadataBase` in root `layout.tsx`. Without it, relative OG image URLs break.
4. **Streaming metadata awareness** -- Note that social media bots (facebookexternalhit) can't execute JS, so metadata must be in initial HTML for social sharing. Streaming metadata works for browsers but may fail for HTML-limited bots.
5. **Remove outdated patterns** -- The existing `seo-meta` skill shows `changeFrequency` in sitemap examples. This must be removed in the replacement skill.

**Phase mapping:** Core SEO skill (Next.js metadata section), framework-specific patterns
**Confidence:** HIGH -- Next.js metadata API is well-documented. Streaming metadata behavior verified via official docs.

**Sources:**
- [Next.js generateMetadata Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Metadata and OG Images Guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Streaming Metadata in Next.js 15.2](https://dev.to/melvinprince/a-comprehensive-introduction-to-streaming-metadata-in-nextjs-152-3gho)
- [Fix Metadata Generation Errors](https://oneuptime.com/blog/post/2026-01-24-fix-nextjs-metadata-generation-errors/view)

---

### PITFALL M5: CORS Blocking and Missing Error Handling in API Integrations

**What goes wrong:** External API calls fail silently or with cryptic CORS errors. Common failures: (a) browser-side fetch to a third-party API blocked by CORS (no `Access-Control-Allow-Origin` header), (b) API errors caught but not surfaced to the user (empty loading state forever), (c) rate limit 429 responses not handled (app keeps retrying, gets blocked), (d) network failures show blank screen instead of error state, (e) API response shape changes and TypeScript types are stale.

**43% of web applications experienced security breaches due to insufficient origin checks in 2025**, per industry surveys. Over 70% of applications encounter CORS-related issues.

**Why it happens in Genorah's context:** Genorah teaches frontend patterns. When builders add API integration (HubSpot, CRMs, payment APIs), they write `fetch('https://api.hubspot.com/...')` directly in a client component. This fails due to CORS. The fix is server-side proxying, but builders unfamiliar with API integration don't know this. Additionally, Genorah's quality gates focus on visual quality (anti-slop gate, design review) but have no gates for API reliability.

**Consequences:**
- API integration appears broken on the user's site
- Blank loading states that never resolve
- Sensitive error details (API keys, internal URLs) exposed in browser console
- Rate-limited APIs cause cascading failures
- Forms submit but nothing happens (silent API failure)

**Warning signs:**
- `fetch()` calls to external domains in client components
- No `try/catch` around API calls
- Loading states without timeout or error fallback
- No rate limiting or retry logic
- Error boundaries missing around API-dependent components

**Prevention:**
1. **Server-side proxy as the default pattern** -- The API integration skill must teach: "All external API calls go through your server. Client -> Your API Route -> External API. Never client -> External API directly."
2. **Three-state UI pattern** -- Every API-dependent component must handle: loading, success, error. No component should show a permanent loading spinner. Teach timeout patterns (if no response in 10s, show error).
3. **Error boundary wrapping** -- API-dependent sections should be wrapped in React Error Boundaries so a failed API call doesn't crash the whole page.
4. **Typed responses** -- Generate TypeScript types from API responses. Validate response shape at runtime (Zod schemas) to catch API contract changes.
5. **Rate limit handling** -- Teach exponential backoff with jitter for retries. Respect `Retry-After` headers. Show user-friendly "please try again" rather than infinite retry loops.
6. **Framework-specific proxy patterns**:
   - Next.js: Server Actions or Route Handlers (`app/api/[service]/route.ts`)
   - Astro: Server endpoints (`src/pages/api/[service].ts`)
   - React/Vite: Separate backend needed; `vite.config.ts` proxy for development only

**Phase mapping:** API integration skill (proxy patterns, error handling, typed clients)
**Confidence:** HIGH -- CORS behavior is well-established. Error handling patterns are standard practice.

**Sources:**
- [CORS Explained: Best Practices & Pitfalls](https://www.stackhawk.com/blog/what-is-cors/)
- [Effective CORS Error Handling](https://moldstud.com/articles/p-effective-solutions-and-best-practices-for-handling-cors-errors-in-apis)
- [Protecting API Keys with Next.js](https://dev.to/ivanms1/protecting-your-api-keys-with-next-js-21ej)

---

## Moderate Pitfalls

Mistakes that cause delays, degraded functionality, or technical debt.

---

### PITFALL D1: Schema Markup Over-Application -- Marking Up Everything

**What goes wrong:** Enthusiastic builders add structured data to everything -- Product schema on non-product pages, Article schema on landing pages, FAQ schema on every page, Organization schema duplicated on every page instead of just the homepage. Google's response to over-markup ranges from ignoring it to issuing manual actions.

**Google removed support for 7 structured data types in 2025** as part of simplification. The trend is toward fewer, more meaningful schemas, not more coverage.

**Prevention:**
- Schema should match page purpose: Article for blog posts, Product for product pages, Organization on homepage only, FAQ only where real FAQs exist
- Provide a decision matrix in the skill: "Page type X should use schemas Y and Z. No more."
- One `@context` block per schema type per page maximum
- Test with Rich Results Test before deploying -- "No result" means the schema isn't useful for that page

**Warning signs:** More than 3 JSON-LD blocks on a single page. Schema types that don't match the page's primary content. Organization schema on every page.

**Phase mapping:** Core SEO skill (structured data decision guidance)
**Confidence:** HIGH

**Sources:**
- [Google Removes Structured Data Features 2025](https://www.relevantaudience.com/seo/google-removes-structured-data-2025-guide-for-websites/)
- [Structured Data Mistakes to Avoid](https://www.searchenginejournal.com/structured-data-mistakes/276127/)

---

### PITFALL D2: Astro Sitemap Silent Failure in SSR Mode

**What goes wrong:** The official `@astrojs/sitemap` integration works well for static sites but fails silently in SSR mode. Dynamic routes (blog posts from a CMS, product pages from an API) are not discovered because the integration only knows about routes at build time. The sitemap generates successfully but contains only static routes, missing all dynamic content.

**Additionally:** If the `site` field is not configured in `astro.config.mjs`, the sitemap integration silently produces nothing -- no error, no warning, just no sitemap file in the build output.

**Prevention:**
- For SSR Astro sites, teach the custom sitemap endpoint pattern: a server route that queries the CMS/database and generates XML dynamically
- Make `site` configuration a mandatory first step in any Astro SEO setup
- Provide a verification step: "After build, check `dist/sitemap-index.xml` exists and contains expected URLs"
- For hybrid mode, document which routes need to be pre-rendered for sitemap discovery

**Warning signs:** `@astrojs/sitemap` in config but sitemap missing from build output. Sitemap exists but contains far fewer URLs than the site has pages.

**Phase mapping:** Sitemap skill (Astro-specific section), framework patterns
**Confidence:** MEDIUM -- Based on Astro docs and community reports, but SSR sitemap edge cases may vary.

**Sources:**
- [Astro Sitemap Integration Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Fixing Astro Sitemap in SSR Mode](https://colinmcnamara.com/blog/fixing-astro-sitemap-ssr-mode)

---

### PITFALL D3: OG Image Missing or Wrong Dimensions

**What goes wrong:** Pages shared on social media show: (a) no preview image, (b) a randomly scraped image from the page (usually a logo or icon), (c) an image with wrong aspect ratio (distorted or cropped), or (d) a fallback image that doesn't match the page content. This is the #1 user-visible SEO failure because it's immediately noticeable when sharing links.

**Prevention:**
- Every page type must have a default og:image at 1200x630px (Facebook/LinkedIn standard)
- Always set `og:image:width` and `og:image:height` meta tags for instant rendering
- Article/blog pages should use the cover image as og:image
- Next.js `ImageResponse` API for dynamic OG image generation (branded template with page title)
- Astro: Manual OG image generation via `@vercel/og` or `satori` at build time
- React/Vite: Pre-generated static OG images or external OG image service
- Test with Facebook Sharing Debugger and Twitter Card Validator before launch

**Warning signs:** No `og:image` meta tag in page source. `og:image` pointing to a relative path without `metadataBase`. Image dimensions not 1200x630. No `og:image:width`/`og:image:height` tags.

**Phase mapping:** Core SEO skill (OG image section), dynamic OG image generation pattern
**Confidence:** HIGH

---

### PITFALL D4: robots.txt Blocking Essential Crawlers or Paths

**What goes wrong:** The robots.txt is too restrictive. Common failures: (a) blocking `/_next/` in Next.js which prevents CSS/JS needed for rendering, (b) blocking `/api/` which blocks the sitemap or IndexNow endpoint, (c) blocking AI crawlers (GPTBot, ClaudeBot) when GEO visibility is a goal, (d) not referencing the sitemap URL, (e) using robots.txt to handle canonicalization (Google says don't do this).

**Prevention:**
- Default allow-all with specific blocks only for genuinely private paths (`/admin/`, `/dashboard/`)
- Never block static assets (`/_next/static/`, `/_astro/`) -- crawlers need these to render
- Reference sitemap URL: `Sitemap: https://domain.com/sitemap.xml`
- AI crawler policy: allow GPTBot, ClaudeBot, Google-Extended by default unless client requests otherwise
- Never use robots.txt for canonicalization -- use `<link rel="canonical">` instead
- Framework-specific paths to block:
  - Next.js: `/api/` (if internal-only), `/_next/data/` (avoid), never `/_next/static/`
  - Astro: Generally minimal blocking needed
  - React/Vite: No server paths to block

**Warning signs:** `Disallow: /` in robots.txt (blocks everything). AI crawlers disallowed. No `Sitemap:` directive. Blocking paths that contain CSS/JS resources.

**Phase mapping:** Core SEO skill (robots.txt section)
**Confidence:** HIGH

---

### PITFALL D5: Context7 MCP Over-Reliance and Stale Fallbacks

**What goes wrong:** The API integration skill tells builders to "look up API docs via Context7" but Context7 may not have the library, may have an older version, or may be unavailable. Without fallback guidance, the builder either (a) halts and asks the user, breaking flow, or (b) falls back to training data and generates outdated API patterns.

**Prevention:**
- Context7 is a tool, not a guarantee. The skill must provide: "If Context7 doesn't have docs for this API, use the official documentation URL directly."
- Include curated links for common APIs (HubSpot, Stripe, Resend, etc.) as fallbacks
- Version-pin API examples in the skill itself as a baseline, with Context7 as the freshness upgrade
- Builder workflow: (1) Try Context7, (2) If unavailable, use skill baseline examples, (3) If API is unfamiliar, surface to user for documentation URL

**Warning signs:** Skill relies exclusively on Context7 with no hardcoded examples. No version information in API patterns. Builder generates API calls without checking current docs.

**Phase mapping:** API integration skill (Context7 integration strategy)
**Confidence:** MEDIUM -- Context7 library coverage and uptime are not guaranteed.

---

### PITFALL D6: Skill Bloat from SEO/GEO/API Addition

**What goes wrong:** Adding SEO, GEO, sitemap, IndexNow, and API integration creates 5+ new skills. Combined with the existing 70+ skills, the metadata scanning overhead grows. More critically, builders must now reference SEO skills AND design skills AND framework skills for every page, exceeding practical context budgets. Related: existing PITFALL M2 from the v1 research (Skill Bloat -- Knowledge Base Becomes Noise).

**The context window is a public good.** Each skill uses approximately 100 tokens during metadata scanning. With 75+ skills, that's 7,500+ tokens just for skill discovery -- before any skill content loads.

**Prevention:**
1. **Consolidate, don't proliferate** -- Instead of separate skills for SEO meta, sitemap, robots.txt, IndexNow, and GEO, create ONE comprehensive SEO skill with clear sections. The builder loads one skill, not five.
2. **Embed critical SEO rules in the builder agent** -- The 5 most important rules (canonical URLs, JSON-LD sync, no client-side metadata in SPAs, og:image required, sitemap validation) should be embedded directly in the section-builder spawn prompt, not require a skill read.
3. **API integration as one skill** -- Server proxy pattern, env handling, error states, and typed clients in one skill, not four.
4. **Tier appropriately** -- SEO and API skills should be **Utility** tier (loaded on-demand), not Core. They're not needed for every project (Tauri/Electron apps don't need SEO).
5. **Stay under 500 lines per skill** -- The comprehensive SEO skill can be up to 500 lines with all sections. If it exceeds this, split by concern (SEO-technical vs SEO-content) not by feature (meta vs sitemap vs robots).

**Warning signs:** More than 3 new skills added for this milestone. Any skill exceeding 500 lines. Builder needing to read 3+ skills for a single task.

**Phase mapping:** Skill architecture phase, all skill creation phases
**Confidence:** HIGH -- Based on Claude Code plugin architecture analysis and existing v1 pitfalls research.

**Sources:**
- [Claude Code Plugin Architecture](https://github.com/anthropics/claude-code/blob/main/plugins/README.md)
- [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)

---

## Minor Pitfalls

Mistakes that cause annoyance but are quickly fixable.

---

### PITFALL N1: Missing Hreflang for Multi-Language Sites

**What goes wrong:** Multi-language sites don't set `hreflang` alternate links. Google shows the wrong language version to users. Each language version competes with the others instead of being treated as alternates.

**Prevention:** The SEO skill should reference the existing `i18n-rtl` skill for hreflang implementation. Don't duplicate i18n guidance -- just link to the right skill.

**Phase mapping:** Core SEO skill (cross-reference section)
**Confidence:** HIGH

---

### PITFALL N2: IndexNow Submitting Unchanged URLs

**What goes wrong:** The IndexNow endpoint fires on every deployment, submitting all URLs regardless of whether content changed. Search engines see this as spammy behavior and may throttle or ignore submissions.

**Prevention:** Track content hashes or `lastmod` dates. Only submit URLs where content has actually changed since the last submission. Provide a build-time diff strategy.

**Phase mapping:** IndexNow skill (submission strategy)
**Confidence:** MEDIUM

---

### PITFALL N3: JSON-LD Syntax Errors from Template Interpolation

**What goes wrong:** JSON-LD strings contain unescaped quotes, newlines, or special characters from CMS content. A blog post title like `He said "hello"` breaks the JSON-LD when interpolated without escaping. `JSON.stringify()` handles this correctly, but manual template interpolation does not.

**Prevention:** The skill must enforce: "Always use `JSON.stringify()` to generate JSON-LD content. Never manually construct JSON strings with template literals." The current skill's `JsonLd` component pattern is correct -- keep it.

**Phase mapping:** Core SEO skill (JSON-LD patterns)
**Confidence:** HIGH

---

### PITFALL N4: Social Media Card Preview Caching

**What goes wrong:** OG tags are updated but social media platforms show the old preview. Facebook, LinkedIn, and Twitter cache OG images and metadata. Developers think their changes are broken when they're actually just cached.

**Prevention:** Include cache-busting instructions: Facebook Sharing Debugger (click "Scrape Again"), Twitter Card Validator, LinkedIn Post Inspector. Mention that cache clearing can take 24-48 hours for some platforms.

**Phase mapping:** Core SEO skill (verification and debugging section)
**Confidence:** HIGH

---

### PITFALL N5: Google Search Console / Bing Webmaster Verification Confusion

**What goes wrong:** Site verification fails because (a) the verification meta tag is in the wrong place, (b) DNS TXT verification has propagation delays, (c) HTML file verification conflicts with framework routing, (d) developers don't realize GSC and Bing Webmaster Tools are separate systems requiring separate verification.

**Prevention:** Provide a step-by-step verification checklist for both GSC and Bing Webmaster Tools. Recommend meta tag verification as the simplest method for both (Next.js `metadata.verification`, Astro `<meta>` in layout). Note that DNS verification takes 24-72 hours for propagation.

**Phase mapping:** Submission workflow skill (verification section)
**Confidence:** HIGH

---

## Phase-Specific Warnings

| Phase/Topic | Likely Pitfall | Mitigation | Severity |
|-------------|---------------|------------|----------|
| SEO Skill Architecture | D6: Skill bloat | Consolidate into 1-2 skills, not 5+ | Major |
| Structured Data Patterns | C1: Schema-content mismatch | Single source of truth, post-iteration audit | Critical |
| Canonical URL Implementation | C2: Misconfigured canonicals | Dynamic generation, absolute URLs, trailing slash policy | Critical |
| Sitemap Generation | M1: XML validation failures | Drop deprecated fields, accurate lastmod, escape characters | Major |
| IndexNow Setup | M2: Key verification failures | Verification-first setup order, public key understanding | Major |
| GEO Optimization | M3: Cannibalized traditional SEO | Unified strategy, archetype-aware GEO, schema-for-real-content-only | Major |
| Next.js Metadata | M4: Router boundary confusion | Async params, metadataBase, no Head in App Router | Major |
| API Integration | M5: CORS and error handling | Server proxy default, three-state UI, error boundaries | Major |
| React/Vite SEO | C4: SPA invisibility | Framework capability matrix, honest limitation disclosure | Critical |
| API Key Security | C3: Client-side key exposure | Server proxy, prefix audit, framework-specific env patterns | Critical |
| OG Images | D3: Missing/wrong OG images | 1200x630 default, dimensions in meta, per-page images | Moderate |
| robots.txt | D4: Over-restrictive blocking | Allow-all default, AI crawler inclusion, sitemap reference | Moderate |
| Context7 Integration | D5: Over-reliance without fallback | Fallback chain: Context7 -> skill baseline -> user docs | Moderate |
| Multi-language | N1: Missing hreflang | Cross-reference i18n-rtl skill | Minor |
| IndexNow Efficiency | N2: Submitting unchanged URLs | Content hash tracking, only submit changed | Minor |

---

## Existing Skill Gap Analysis

The current `seo-meta` skill (v2.0.0) has the following specific issues that the replacement must fix:

| Current Issue | Severity | Fix |
|---------------|----------|-----|
| Shows `changeFrequency` and `priority` in sitemap examples | Medium | Remove -- Google/Bing ignore these fields |
| No GEO optimization guidance | High | Add AI search optimization section |
| No IndexNow patterns | High | Add full IndexNow setup and submission |
| No framework capability matrix | High | Add clear SEO capabilities per framework |
| No sitemap validation guidance | Medium | Add GSC/Bing validation checklist |
| No robots.txt AI crawler configuration | Medium | Add GPTBot/ClaudeBot allow rules |
| No API integration patterns | High | New skill needed for server proxy, env handling |
| No error handling for API-dependent components | High | Add three-state UI pattern |
| Uses correct `JSON.stringify` for JSON-LD | None | Keep this pattern -- it's correct |
| Has good framework-specific meta tag patterns | None | Keep and update for Next.js 15+ async params |
| Warns about `next/head` in App Router | None | Keep this anti-pattern warning |

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| SEO Structured Data | HIGH | Google's official structured data policies are definitive |
| Canonical URLs | HIGH | Google and Bing canonical documentation is authoritative |
| Sitemap Validation | HIGH | Sitemap protocol specification is well-defined; GSC error data available |
| IndexNow | MEDIUM | Official docs are sparse on edge cases; rate limits are "undisclosed" per engine |
| GEO Optimization | MEDIUM | Emerging field; best practices from 2025 research may evolve |
| API Key Security | HIGH | CVE-2025-66478, Next.js docs, and Astro issue #13960 provide concrete evidence |
| Framework-Specific SEO | HIGH | Official framework docs for Next.js, Astro, React/Vite are well-maintained |
| Plugin Architecture | HIGH | Direct analysis of Genorah codebase + Claude Code plugin docs |
| CORS / Error Handling | HIGH | Well-established web standards with extensive documentation |

---

## Sources

### Official Documentation
- [Google Structured Data Policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Canonical URL Consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [IndexNow Official Documentation](https://www.indexnow.org/documentation)
- [IndexNow FAQ](https://www.indexnow.org/faq)
- [Next.js generateMetadata Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Data Security Guide](https://nextjs.org/docs/app/guides/data-security)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)

### Security Advisories
- [CVE-2025-66478 Next.js Security Advisory](https://nextjs.org/blog/CVE-2025-66478)
- [Next.js Security Update December 2025](https://nextjs.org/blog/security-update-2025-12-11)
- [Astro Issue #13960: Non-PUBLIC_ vars exposed](https://github.com/withastro/astro/issues/13960)

### Research & Analysis
- [GEO Research Paper (arXiv 2311.09735)](https://arxiv.org/pdf/2311.09735)
- [Bing on Duplicate Content and AI Search (Dec 2025)](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)
- [Bing on lastmod Importance (2023)](https://blogs.bing.com/webmaster/february-2023/The-Importance-of-Setting-the-lastmod-Tag-in-Your-Sitemap)
- [GEO vs SEO in 2025 (Strapi)](https://strapi.io/blog/generative-engine-optimization-vs-traditional-seo-guide)
- [Mastering GEO in 2026 (Search Engine Land)](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)

### Community & Practical
- [Next.js Sitemap GSC Issue #75836](https://github.com/vercel/next.js/issues/75836)
- [Fixing Astro Sitemap in SSR Mode](https://colinmcnamara.com/blog/fixing-astro-sitemap-ssr-mode)
- [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [CORS Best Practices & Pitfalls](https://www.stackhawk.com/blog/what-is-cors/)
- [Common IndexNow Challenges](https://www.navishark.com/en/kb/6vm98r/common-challenges-and-solutions-when-adopting-indexnow)
