# Search Visibility: Webmaster Tools Submission Workflows

> Covers: Google Search Console, Bing Webmaster Tools, Yandex Webmaster, Naver Search Advisor
> All verification methods documented equally -- choose based on your access level

## Before You Begin

Prerequisites:

1. Site is deployed and publicly accessible (verification files must be reachable)
2. Sitemap is generated and accessible at a known URL (e.g., `/sitemap.xml` or `/sitemap-index.xml`)
3. `robots.txt` references the sitemap URL via the `Sitemap:` directive
4. You have DNS access (for DNS verification methods) or deploy access (for file/meta tag methods)

---

## Google Search Console

### Step 1: Add Property

1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Choose property type:
   - **Domain property** (recommended): Covers all subdomains, protocols, and paths. Requires DNS verification only.
   - **URL prefix property**: Covers exact URL prefix only (e.g., `https://example.com`). Offers more verification options (see below).

### Step 2: Verify Ownership

| Method | Steps | Best For |
|--------|-------|----------|
| **HTML file upload** | Download `google*.html`, place in `public/` or site root. Deploy. Click Verify. | Full server access |
| **HTML meta tag** | Copy meta tag, add to `<head>` of all pages. Deploy. Click Verify. | CMS or framework projects |
| **DNS TXT record** | Copy TXT record value, add to DNS provider. Wait for propagation (up to 72 hours). Click Verify. | Domain-level verification (required for Domain property) |
| **Google Analytics** | Auto-detected if GA tracking code is present on site. Click Verify. | Sites with GA installed |
| **Google Tag Manager** | Auto-detected if GTM container is present on site. Click Verify. | Sites with GTM installed |

**Next.js verification shortcut (meta tag method):**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  verification: {
    google: 'your-google-verification-code',
  },
}
```

This renders `<meta name="google-site-verification" content="your-google-verification-code">` in the `<head>` of all pages automatically.

### Step 3: Submit Sitemap

1. Navigate to **Sitemaps** in the left sidebar
2. Enter your sitemap URL (e.g., `sitemap.xml` or `sitemap-index.xml`)
3. Click **Submit**
4. Wait for processing (may take hours to days for first submission)

**Important:** Google sitemap ping (`google.com/ping?sitemap=...`) was deprecated June 2023 and returns 404. The ONLY paths for Google are: sitemap reference in `robots.txt` + GSC submission. Do NOT implement sitemap ping code for Google.

### Step 4: Monitor

1. Check **"Pages"** report (formerly "Coverage") for indexing errors
2. Check **"Sitemaps"** report for submission status (Success / Has errors / Couldn't fetch)
3. Use **URL Inspection** tool for individual page status
4. Set up email alerts: **Settings > Email preferences > Enable all notifications**
5. Common issues to watch:
   - `404` errors -- broken URLs in sitemap
   - `Excluded` pages -- canonicalized or noindexed pages (may be intentional)
   - `Discovered - currently not indexed` -- Google chose not to index (quality or crawl budget issue)
   - `Crawled - currently not indexed` -- Google fetched but decided not to index

---

## Bing Webmaster Tools

### Step 1: Add Site

1. Go to [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Sign in with a Microsoft, Google, or Facebook account
3. Click **"Add Site"**
4. Enter your site URL

### Step 2: Verify Ownership

| Method | Steps | Best For |
|--------|-------|----------|
| **XML file upload** | Download `BingSiteAuth.xml`, place in `public/` or site root. Deploy. Click Verify. | Full server access |
| **HTML meta tag** | Copy meta tag, add to `<head>`. Deploy. Click Verify. | CMS or framework projects |
| **CNAME DNS record** | Add CNAME record to DNS provider. Wait for propagation. Click Verify. | Domain-level verification |
| **Import from GSC** | If already verified in Google Search Console, click "Import from GSC" for automatic verification. | Sites already verified in GSC |

**Next.js verification shortcut (meta tag method):**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  verification: {
    other: { 'msvalidate.01': 'your-bing-verification-code' },
  },
}
```

This renders `<meta name="msvalidate.01" content="your-bing-verification-code">` in the `<head>`.

### Step 3: Submit Sitemap

1. Navigate to **Sitemaps** in the left sidebar
2. Enter your sitemap URL, click **Submit**
3. Bing crawls submitted sitemaps at least once per day

### Step 4: Configure IndexNow (Bing-Specific Bonus)

1. Navigate to the **IndexNow** section in Bing Webmaster Tools
2. Generate an API key (or use an existing key from your IndexNow setup)
3. Verify the key file is accessible at `https://yoursite.com/{key}.txt`
4. Monitor submission history: Bing WMT shows IndexNow submission logs with URL counts and timestamps

This step is optional if you have already set up IndexNow via the `search-visibility` skill's IndexNow patterns (Layer 2A). The Bing WMT dashboard provides additional monitoring beyond what your endpoint logs capture.

### Step 5: Monitor

1. Check **"Site Scan"** for crawl issues
2. Use **"URL Inspection"** for individual page status
3. Monitor IndexNow submissions via the **IndexNow dashboard**
4. Check **"SEO Reports"** for on-page optimization suggestions

---

## Yandex Webmaster

### Step 1: Add Site

1. Go to [https://webmaster.yandex.com](https://webmaster.yandex.com)
2. Sign in with a Yandex account (create one if needed)
3. Click **"Add site"**, enter your URL

### Step 2: Verify Ownership

| Method | Steps | Best For |
|--------|-------|----------|
| **HTML file upload** | Download `yandex_*.html`, place in `public/` or site root. Deploy. Click Check. | Full server access |
| **HTML meta tag** | Copy meta tag, add to `<head>`. Deploy. Click Check. | CMS or framework projects |
| **DNS TXT record** | Add TXT record to DNS provider. Wait for propagation. Click Check. | Domain-level verification |
| **WHOIS verification** | Auto-verify via domain WHOIS record. Only works for `.ru` domains. | .ru domain owners |

**Next.js verification shortcut (meta tag method):**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  verification: {
    yandex: 'your-yandex-verification-code',
  },
}
```

This renders `<meta name="yandex-verification" content="your-yandex-verification-code">` in the `<head>`.

### Step 3: Submit Sitemap

1. Navigate to **Indexing > Sitemap files**
2. Enter your sitemap URL, click **Add**
3. Processing takes up to 2 weeks for initial submission

### Step 4: Monitor

1. Check **"Indexing"** reports for crawl status and indexed page counts
2. Check **"Diagnostics"** for site issues (broken links, server errors)
3. Yandex supports IndexNow -- monitor via IndexNow submission logs in Yandex Webmaster
4. Check **"Search queries"** for keyword performance in Yandex search

---

## Naver Search Advisor

### Step 1: Add Site

1. Go to [https://searchadvisor.naver.com](https://searchadvisor.naver.com)
2. Sign in with a Naver account (create one if needed -- Korean language interface, but English translations available)
3. Navigate to the **"Site"** section, click **"Add Site"**
4. Enter your URL

### Step 2: Verify Ownership

| Method | Steps | Best For |
|--------|-------|----------|
| **HTML file upload** | Download `naver-site-verification` file, place in `public/` or site root. Deploy. Click Verify. | Full server access |
| **HTML meta tag** | Copy meta tag, add to `<head>`. Deploy. Click Verify. | CMS or framework projects |

**Next.js verification shortcut (meta tag method):**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  verification: {
    other: { 'naver-site-verification': 'your-naver-verification-code' },
  },
}
```

This renders `<meta name="naver-site-verification" content="your-naver-verification-code">` in the `<head>`.

### Step 3: Submit Sitemap

1. Navigate to **Request > Submit Sitemap**
2. Enter your sitemap URL, click **Add**
3. Limits: max 50,000 URLs per sitemap, max 10MB file size
4. Indexing takes up to 14 days

### Step 4: Monitor

1. Check indexing status in the Naver Search Advisor dashboard
2. Naver supports IndexNow -- instant submissions via `api.indexnow.org` reach Naver automatically

**Note:** Naver is primarily relevant for Korean market visibility. Non-Korean language sites will be indexed but may receive limited search exposure within Naver. Include Naver in your workflow if your project targets Korean-speaking users or the Korean market.

---

## Unified Next.js Verification Shortcut

For Next.js projects, all verification codes can go in one place. This is the most efficient approach -- a single `metadata` export handles all four platforms:

```tsx
// app/layout.tsx -- consolidate all verification codes
import type { Metadata } from 'next'

export const metadata: Metadata = {
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
}
```

This renders four `<meta>` verification tags in the `<head>` of every page. Replace each placeholder with the actual verification code from the respective platform's dashboard.

For Astro projects, add the equivalent meta tags manually to your base layout's `<head>`:

```html
<!-- src/layouts/BaseLayout.astro -- inside <head> -->
<meta name="google-site-verification" content="your-google-verification-code" />
<meta name="msvalidate.01" content="your-bing-verification-code" />
<meta name="yandex-verification" content="your-yandex-verification-code" />
<meta name="naver-site-verification" content="your-naver-verification-code" />
```

---

## Submission Checklist (All Platforms)

Quick reference for the complete submission flow:

- [ ] Site deployed and publicly accessible
- [ ] Sitemap generated and accessible at `/sitemap.xml`
- [ ] `robots.txt` has `Sitemap: https://yoursite.com/sitemap.xml`
- [ ] Google Search Console: property added, verified, sitemap submitted
- [ ] Bing Webmaster Tools: site added, verified, sitemap submitted, IndexNow configured
- [ ] Yandex Webmaster: site added, verified, sitemap submitted
- [ ] Naver Search Advisor: site added, verified, sitemap submitted (if targeting Korean market)
- [ ] IndexNow endpoint deployed and key verification file accessible
- [ ] Email alerts enabled in GSC and Bing WMT
- [ ] All verification methods remain in place (do not remove verification files/tags after verifying)
