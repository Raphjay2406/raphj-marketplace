---
name: "hubspot-integration"
description: "HubSpot CRM, Marketing, and CMS integration patterns for Next.js and Astro. UTK tracking, Forms API v3, CRM dashboard, headless blog, chat widget, marketing events, GDPR consent."
tier: "domain"
triggers: "hubspot, crm, marketing automation, lead capture, tracking, contact form"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Client mentions HubSpot, CRM, or marketing automation -- activate this skill for integration patterns
- Contact form requirements with lead tracking -- HubSpot Forms API v3 is the correct path
- Blog content managed externally -- HubSpot CMS Blog API with ISR provides headless delivery
- Sales pipeline visibility needed -- CRM Search API with SSR dashboard patterns
- Marketing event tracking -- Custom behavioral events or marketing event registration
- Multi-tenant agency platform -- OAuth 2.0 flow with per-account token management

### When NOT to Use

- Simple contact form with no CRM -- Use a basic email API (Resend, SendGrid) instead
- Static blog with markdown -- Use MDX/content collections instead of HubSpot CMS
- Analytics-only tracking -- Use Vercel Analytics or Plausible instead of HubSpot tracking
- E-commerce transactions -- Use Shopify/Stripe skills; HubSpot is CRM, not payments

### Integration Depth Decision Tree

| Client Need | Pattern | Complexity |
|-------------|---------|------------|
| Contact forms only | Forms API v3 via Route Handler + UTK | Low |
| Forms + tracking | Forms API + tracking script (consent-gated) | Medium |
| Blog from HubSpot | CMS Blog API + ISR (5min revalidate) | Medium |
| CRM dashboard | CRM Search API + SSR + webhooks | High |
| Full marketing suite | All above + chat + custom events | High |
| Multi-tenant (agency) | OAuth 2.0 + per-account tokens | Expert |

### Authentication Strategy

| Method | Use Case | Rate Limit | Setup |
|--------|----------|------------|-------|
| Private App Token | Single HubSpot account, server-side only | 500 req/10s | Portal Settings > Integrations > Private Apps |
| OAuth 2.0 | Multi-tenant, agency platforms, marketplace apps | 100 req/10s | HubSpot Developer Portal > App > Auth |

**Private App Token** -- Best for single-account integrations. Create in portal settings, store as `HUBSPOT_ACCESS_TOKEN` env var. Never expose client-side.

**OAuth 2.0** -- Required for multi-tenant. Implements authorization code flow with refresh tokens. Store tokens per-account in database.

### Data Freshness Strategy

| Data Type | Strategy | TTL | Rationale |
|-----------|----------|-----|-----------|
| Deal pipeline / live CRM | SSR (no cache) | 0 | Sales teams need real-time data |
| Reports / aggregates | ISR | 5 min | Acceptable lag for dashboards |
| Blog posts | ISR | 5 min (300s) | Content updates are infrequent |
| Contact properties | SSR + 60s cache | 60s | Balance freshness with rate limits |
| Webhook-driven data | On-demand revalidation | Event-based | revalidateTag() on webhook receipt |
| Data warehouse sync | Batch (cron) | 1-24 hr | Historical analytics, not real-time |

### Pipeline Connection

- **Auto-detected during:** `/gen:start-project` discovery -- if client mentions HubSpot, ask which products (Marketing Hub, Sales Hub, CMS Hub, Service Hub) and tier (Free, Starter, Professional, Enterprise)
- **Referenced by:** researcher agent for integration scoping, builder agent for implementation patterns
- **Consumed at:** `/gen:plan` for architecture decisions, `/gen:execute` for component generation

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Tracking & UTK (Consent-Gated)

The HubSpot tracking script must be consent-gated for GDPR compliance. Load it only after the user grants marketing consent via your CMP (Consent Management Platform).

```tsx
// components/hubspot-tracker.tsx
"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useConsent } from "@/hooks/use-consent"; // Your CMP hook

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID!;

export function HubSpotTracker() {
  const pathname = usePathname();
  const { marketing } = useConsent(); // true only after user grants consent

  // SPA page view tracking
  useEffect(() => {
    if (!marketing) return;
    const _hsq = (window._hsq = window._hsq || []);
    _hsq.push(["setPath", pathname]);
    _hsq.push(["trackPageView"]);
  }, [pathname, marketing]);

  if (!marketing) return null;

  return (
    <Script
      id="hs-script-loader"
      src={`//js.hs-scripts.com/${PORTAL_ID}.js`}
      strategy="afterInteractive"
    />
  );
}
```

```tsx
// app/layout.tsx -- mount in root layout
import { HubSpotTracker } from "@/components/hubspot-tracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <HubSpotTracker />
      </body>
    </html>
  );
}
```

**UTK server-side read** -- Extract the `hubspotutk` cookie in Route Handlers for form context:

```ts
// lib/hubspot.ts
import { cookies } from "next/headers";

export async function getHutk(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("hubspotutk")?.value;
}
```

#### Pattern 2: Forms API v3 (Server-Side Proxy)

**CRITICAL:** Always submit via server-side Route Handler. Never expose `HUBSPOT_ACCESS_TOKEN` to the client. Always include `hutk`, `pageUri`, and `pageName` in the form context object.

```ts
// app/api/hubspot-form/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID!;
const FORM_ID = process.env.HUBSPOT_FORM_ID!;

const formSchema = z.object({
  email: z.string().email(),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  message: z.string().optional(),
  pageUri: z.string().url(),
  pageName: z.string(),
  // GDPR consent
  consent: z.boolean().refine((v) => v === true, "Consent required"),
  subscriptionTypeId: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = formSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, firstname, lastname, message, pageUri, pageName, subscriptionTypeId } = parsed.data;

  // Read hutk from cookies (set by HubSpot tracking script)
  const cookieStore = await cookies();
  const hutk = cookieStore.get("hubspotutk")?.value;

  // Build fields array -- OMIT empty fields entirely (do not submit empty strings)
  const fields = [
    { objectTypeId: "0-1", name: "email", value: email },
    { objectTypeId: "0-1", name: "firstname", value: firstname },
    { objectTypeId: "0-1", name: "lastname", value: lastname },
    ...(message ? [{ objectTypeId: "0-1", name: "message", value: message }] : []),
  ];

  const submission = {
    fields,
    context: {
      hutk: hutk || undefined, // Link to tracked visitor
      pageUri,
      pageName,
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "I agree to the processing of my personal data.",
        communications: subscriptionTypeId
          ? [
              {
                value: true,
                subscriptionTypeId,
                text: "I agree to receive marketing communications.",
              },
            ]
          : [],
      },
    },
  };

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("[HubSpot Form]", res.status, error);
    return NextResponse.json(
      { error: "Submission failed" },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
```

Client-side form using react-hook-form:

```tsx
// components/contact-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Valid email required"),
  firstname: z.string().min(1, "First name required"),
  lastname: z.string().min(1, "Last name required"),
  message: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    const res = await fetch("/api/hubspot-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        pageUri: window.location.href,
        pageName: document.title,
      }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return <p className="text-primary font-body">Thank you! We will be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register("firstname")} placeholder="First name" className="bg-surface text-text border-border" />
      {errors.firstname && <span className="text-accent">{errors.firstname.message}</span>}

      <input {...register("lastname")} placeholder="Last name" className="bg-surface text-text border-border" />
      {errors.lastname && <span className="text-accent">{errors.lastname.message}</span>}

      <input {...register("email")} type="email" placeholder="Email" className="bg-surface text-text border-border" />
      {errors.email && <span className="text-accent">{errors.email.message}</span>}

      <textarea {...register("message")} placeholder="Message (optional)" className="bg-surface text-text border-border" />

      <label className="flex items-center gap-2 text-muted">
        <input type="checkbox" {...register("consent")} />
        I agree to the processing of my personal data.
      </label>
      {errors.consent && <span className="text-accent">{errors.consent.message}</span>}

      <button type="submit" disabled={status === "loading"} className="bg-primary text-bg">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && <p className="text-accent">Something went wrong. Please try again.</p>}
    </form>
  );
}
```

#### Pattern 3: Headless Blog (CMS Blog API + ISR)

```ts
// lib/hubspot-blog.ts
import DOMPurify from "isomorphic-dompurify";

const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;
const BASE = "https://api.hubapi.com";

export interface HubSpotPost {
  id: string;
  slug: string;
  name: string;
  postBody: string;         // Raw HTML -- MUST sanitize before rendering
  featuredImage: string;
  metaDescription: string;
  publishDate: string;
  authorName: string;
  tagIds: number[];
}

export async function getBlogPosts(limit = 20): Promise<HubSpotPost[]> {
  const res = await fetch(
    `${BASE}/cms/v3/blogs/posts?state=PUBLISHED&sort=-publishDate&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      next: { revalidate: 300 }, // ISR: 5 minutes
    }
  );
  if (!res.ok) throw new Error(`HubSpot Blog API error: ${res.status}`);
  const data = await res.json();
  return data.results;
}

export async function getBlogPostBySlug(slug: string): Promise<HubSpotPost | null> {
  const res = await fetch(
    `${BASE}/cms/v3/blogs/posts?slug=${encodeURIComponent(slug)}&state=PUBLISHED`,
    {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      next: { revalidate: 300 },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.results[0] ?? null;
}

/** Sanitize HubSpot blog HTML to prevent XSS -- REQUIRED before dangerouslySetInnerHTML */
export function sanitizePostBody(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "h1", "h2", "h3", "h4", "a", "img", "ul", "ol", "li",
                   "strong", "em", "blockquote", "code", "pre", "br", "figure",
                   "figcaption", "table", "thead", "tbody", "tr", "th", "td"],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
  });
}
```

```tsx
// app/blog/page.tsx
import { getBlogPosts } from "@/lib/hubspot-blog";
import Link from "next/link";

export const revalidate = 300; // ISR 5 minutes

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <section className="bg-bg text-text py-spacing-5">
      <h1 className="font-display text-scale-7">Blog</h1>
      <div className="grid gap-spacing-3 mt-spacing-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article className="bg-surface border-border rounded-lg p-spacing-3">
              <h2 className="font-display text-scale-5 group-hover:text-primary">
                {post.name}
              </h2>
              <p className="text-muted font-body text-scale-2 mt-2">
                {post.metaDescription}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

```tsx
// app/blog/[slug]/page.tsx
import { getBlogPosts, getBlogPostBySlug, sanitizePostBody } from "@/lib/hubspot-blog";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogPosts(100);
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const sanitizedBody = sanitizePostBody(post.postBody);

  return (
    <article className="bg-bg text-text py-spacing-5 max-w-prose mx-auto">
      <h1 className="font-display text-scale-7">{post.name}</h1>
      <p className="text-muted font-body text-scale-2">
        {post.authorName} &middot; {new Date(post.publishDate).toLocaleDateString()}
      </p>
      <div
        className="prose font-body mt-spacing-4"
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />
    </article>
  );
}
```

#### Pattern 4: CRM Dashboard (SSR + Webhooks)

Architecture: proxy all CRM queries through Route Handlers. Never expose the access token.

```
app/
  dashboard/
    deals/page.tsx       -- SSR, no cache (real-time)
    contacts/page.tsx    -- SSR, 60s cache
    analytics/page.tsx   -- ISR, 5 min revalidate
  api/
    hubspot/
      crm/route.ts       -- Proxy for CRM Search API
      webhook/route.ts   -- Webhook receiver for revalidation
```

```ts
// app/api/hubspot/crm/route.ts
import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  const { objectType, filters, properties, sorts, limit } = await req.json();

  const res = await fetch(
    `https://api.hubapi.com/crm/v3/objects/${objectType}/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filterGroups: [{ filters }],
        properties,
        sorts,
        limit: Math.min(limit || 100, 100),
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "CRM query failed" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
```

```ts
// app/api/hubspot/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";

const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET!;

function verifySignature(req: NextRequest, body: string): boolean {
  const signature = req.headers.get("x-hubspot-signature-v3");
  const timestamp = req.headers.get("x-hubspot-request-timestamp");
  if (!signature || !timestamp) return false;

  const sourceString = `${req.method}${req.url}${body}${timestamp}`;
  const hash = crypto.createHmac("sha256", CLIENT_SECRET).update(sourceString).digest("base64");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  if (!verifySignature(req, body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const events = JSON.parse(body);
  for (const event of events) {
    if (event.subscriptionType.startsWith("deal.")) {
      revalidateTag("deals");
    }
    if (event.subscriptionType.startsWith("contact.")) {
      revalidateTag("contacts");
    }
  }

  return NextResponse.json({ received: true });
}
```

**Important: 10K search cap** -- The CRM Search API returns a maximum of 10,000 results. For larger datasets, narrow filters using date ranges, pipeline stages, or list memberships. Never assume you have all data without checking `total` vs `results.length`.

#### Pattern 5: Chat Widget (Lazy Load)

```tsx
// components/hubspot-chat.tsx
"use client";

import { useState, useCallback } from "react";
import Script from "next/script";

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID!;

export function HubSpotChat() {
  const [loaded, setLoaded] = useState(false);

  const openChat = useCallback(() => {
    if (!loaded) {
      setLoaded(true);
      return; // Script will auto-open after load
    }
    window.HubSpotConversations?.widget.open();
  }, [loaded]);

  return (
    <>
      {loaded && (
        <Script
          id="hs-chat-loader"
          src={`//js.hs-scripts.com/${PORTAL_ID}.js`}
          strategy="lazyOnload"
          onLoad={() => {
            // Configure: do not load immediately, wait for trigger
            window.hsConversationsSettings = {
              loadImmediately: false,
              inlineEmbedSelector: "#hs-chat-container",
            };
            window.HubSpotConversations?.widget.load();
            window.HubSpotConversations?.widget.open();
          }}
        />
      )}
      <div id="hs-chat-container" />
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 bg-primary text-bg rounded-full p-4 shadow-lg z-50"
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
```

For AI-powered chatbot integration, combine HubSpot Conversations API with a streaming LLM to personalize responses based on CRM contact data. Fetch contact properties (lifecycle stage, company, recent activity) server-side and inject into the system prompt for context-aware responses.

#### Pattern 6: HubDB (Structured Content)

Use HubDB for editor-managed structured data: team members, locations, pricing tiers.

```ts
// lib/hubspot-hubdb.ts
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

export async function getHubDBRows(tableId: string) {
  const res = await fetch(
    `https://api.hubapi.com/cms/v3/hubdb/tables/${tableId}/rows/draft?sort=orderBy`,
    {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      next: { revalidate: 300 },
    }
  );
  if (!res.ok) throw new Error(`HubDB error: ${res.status}`);
  const data = await res.json();
  return data.results;
}
```

```tsx
// app/team/page.tsx
import { getHubDBRows } from "@/lib/hubspot-hubdb";

export const revalidate = 300;

export default async function TeamPage() {
  const members = await getHubDBRows(process.env.HUBSPOT_TEAM_TABLE_ID!);

  return (
    <section className="bg-bg text-text py-spacing-5">
      <h1 className="font-display text-scale-7">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-3 mt-spacing-4">
        {members.map((member: any) => (
          <div key={member.id} className="bg-surface border-border rounded-lg p-spacing-3">
            <img src={member.values.photo?.url} alt={member.values.name} className="rounded-full w-24 h-24" />
            <h3 className="font-display text-scale-4 mt-2">{member.values.name}</h3>
            <p className="text-muted font-body">{member.values.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

#### Pattern 7: Marketing Events

```ts
// lib/hubspot-events.ts
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

export async function registerForEvent(eventId: string, contactEmail: string) {
  const res = await fetch(
    `https://api.hubapi.com/marketing/v3/marketing-events/events/${eventId}/attendees/${contactEmail}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: contactEmail,
        interactionDateTime: new Date().toISOString(),
      }),
    }
  );
  if (!res.ok) throw new Error(`Event registration failed: ${res.status}`);
  return res.json();
}

export async function trackAttendance(eventId: string, contactEmail: string) {
  return registerForEvent(eventId, contactEmail);
  // HubSpot uses the same endpoint; attendance state is tracked via workflow triggers
}
```

```ts
// app/api/event-register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { registerForEvent } from "@/lib/hubspot-events";

export async function POST(req: NextRequest) {
  const { eventId, email } = await req.json();
  if (!eventId || !email) {
    return NextResponse.json({ error: "Missing eventId or email" }, { status: 400 });
  }

  try {
    await registerForEvent(eventId, email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
```

#### Pattern 8: Custom Behavioral Events

**Requires Marketing Hub Enterprise.** Server-side event tracking for high-value actions (pricing page view, demo request, feature comparison).

```ts
// lib/hubspot-custom-events.ts
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

export async function trackCustomEvent(
  eventName: string,
  email: string,
  properties: Record<string, string | number>
) {
  const res = await fetch("https://api.hubapi.com/events/v3/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventName, // Format: pe{portalId}_{event_name}
      email,
      properties,
      occurredAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    console.error("[HubSpot Custom Event]", res.status, await res.text());
  }
}
```

```ts
// Usage in a Route Handler
import { trackCustomEvent } from "@/lib/hubspot-custom-events";

// After a pricing page view
await trackCustomEvent(
  `pe${process.env.HUBSPOT_PORTAL_ID}_pricing_page_viewed`,
  userEmail,
  { plan_viewed: "enterprise", source: "comparison_table" }
);
```

### Form Name Enforcement

**CRITICAL RULE:** HubSpot form names must use the GUID from the portal (`HUBSPOT_FORM_ID` env var), never auto-generated identifiers.

**Real-world failure:** CSS class names (`.flex, .flex-col, .gap-4`) were submitted as the form name, creating junk submissions in HubSpot. This happens when developers accidentally pass a className prop or component wrapper string as the form identifier.

Enforcement:
- `HUBSPOT_FORM_ID` must be a valid GUID format (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- Human-readable names in HubSpot portal (e.g., "Contact Us - Homepage", "Newsletter Signup - Footer")
- CSS class names as form names = critical error, reject immediately

### Environment Variables

```env
# Required for all integrations
HUBSPOT_PORTAL_ID=12345678
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Per-form (add as needed)
HUBSPOT_FORM_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Public (safe for client-side, tracking only)
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=12345678

# Optional
HUBSPOT_CLIENT_SECRET=xxxxxxxx     # For webhook signature verification
HUBSPOT_TEAM_TABLE_ID=12345678     # For HubDB
```

---

## Layer 3: Integration Context

### Pipeline Stage

- **Auto-detection:** During `/gen:start-project` discovery, if client mentions HubSpot, CRM, lead capture, or marketing automation, activate this skill. Ask follow-up: "Which HubSpot products do you use? (Marketing Hub, Sales Hub, CMS Hub, Service Hub) and what tier? (Free, Starter, Professional, Enterprise)"
- **Input from:** researcher agent provides HubSpot product list, tier, existing forms/properties, custom objects
- **Output to:** builder agent receives integration pattern selection, Route Handler templates, component boilerplate

### Builder Templates

When this skill is active, the builder agent receives:

1. **UTK component boilerplate** -- `HubSpotTracker` client component (Pattern 1)
2. **Form Route Handler template** -- Server-side proxy with hutk extraction (Pattern 2)
3. **Consent pattern** -- CMP integration hook with conditional script loading
4. **Blog fetcher** -- ISR-enabled data layer with HTML sanitization (Pattern 3)

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `bg`, `surface` | Form container and input backgrounds |
| `text`, `muted` | Form labels, placeholders, helper text |
| `border` | Input borders, form card outlines |
| `primary` | Submit buttons, active states, links |
| `accent` | Error messages, validation states |
| `font-body` | Form inputs, labels, blog prose |
| `font-display` | Blog post titles, dashboard headings |
| `spacing-*` | Form field gaps, section padding |
| `scale-*` | Form text sizes, blog heading hierarchy |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Neo-Corporate | Minimal form styling, clean grid dashboard, muted CTA colors |
| Luxury/Fashion | Elegant form inputs with thin borders, editorial blog layout |
| Playful/Startup | Rounded inputs, animated submit button, conversational chat tone |
| Data-Dense | Compact form layout, dense CRM dashboard tables, metric cards |
| Warm Artisan | Textured form backgrounds, handwritten-feel labels |
| AI-Native | Glassmorphic form cards, AI chat-first contact flow |
| Brutalist | Raw form inputs, monospace labels, no border-radius |
| Editorial | Magazine-style blog layout, pull quotes, large featured images |

### Quality Reviewer Checks

When reviewing HubSpot integrations, the quality reviewer agent verifies:

1. No `HUBSPOT_ACCESS_TOKEN` or `HUBSPOT_CLIENT_SECRET` exposed in client-side code
2. All form submissions include `hutk`, `pageUri`, `pageName` in context
3. Forms API v3 used (not Contacts API) for all user-facing forms
4. Tracking script consent-gated with CMP
5. Blog HTML sanitized before rendering
6. Rate limiting considered (500 req/10s private app, 100 req/10s OAuth)
7. CRM Search queries use narrow filters (10K cap awareness)
8. Form IDs are valid GUIDs, not CSS classes or auto-generated strings

### Related Skills

- **accessibility** -- ARIA labels for form inputs, error announcements, chat widget keyboard support
- **seo** -- Blog post meta tags, structured data (Article schema), canonical URLs from HubSpot
- **performance** -- Lazy-load tracking script, defer chat widget, ISR tuning for blog
- **responsive-design** -- Mobile-first form layout, touch-friendly submit targets

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Token Exposed Client-Side

**What goes wrong:** `HUBSPOT_ACCESS_TOKEN` included in client bundle via `NEXT_PUBLIC_` prefix or direct import in a `"use client"` component. Attackers can read, modify, or delete all CRM data.
**Instead:** Always proxy through Route Handlers (`app/api/`). Only `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` is safe for client-side (tracking script).
**Penalty:** -15

### Anti-Pattern: Missing hutk in Form Context

**What goes wrong:** Form submissions omit the `hutk` (HubSpot user token) cookie value from the context object. HubSpot cannot link the form submission to the anonymous visitor's tracking history, breaking the visitor-to-contact conversion chain. All prior page views, CTA interactions, and session data become orphaned.
**Instead:** Read `hubspotutk` cookie server-side via `cookies().get("hubspotutk")` and pass it in `context.hutk`. Also include `pageUri` and `pageName`.
**Penalty:** -5

### Anti-Pattern: No Consent Before Tracking

**What goes wrong:** HubSpot tracking script loads immediately without GDPR/ePrivacy consent. Violates GDPR Article 6, ePrivacy Directive, and risks fines up to 4% of annual revenue. Also violates Awwwards UX Intelligence criteria.
**Instead:** Consent-gate with CMP hook. Only render `<Script>` after `marketing` consent is `true`. Default to no tracking until explicit opt-in.
**Penalty:** -5

### Anti-Pattern: CSS Classes as Form Names

**What goes wrong:** Developer accidentally passes a CSS class string (e.g., `.flex, .flex-col, .gap-4`) as the HubSpot form name. Submissions appear in HubSpot under a garbage name, breaking reporting and workflows. Often caused by passing a component's className prop as the form identifier.
**Instead:** Use `HUBSPOT_FORM_ID` environment variable containing the GUID from HubSpot portal settings. Validate format at build time.
**Penalty:** -5

### Anti-Pattern: Using Contacts API for User-Facing Forms

**What goes wrong:** Developer creates/updates contacts via the CRM Contacts API (`/crm/v3/objects/contacts`) instead of the Forms API. No form submission event is created, no analytics are recorded, no workflow triggers fire, and no GDPR consent is logged.
**Instead:** Use Forms API v3 (`/submissions/v3/integration/submit/{portalId}/{formId}`) for all user-facing forms. Contacts API is for backend sync only.
**Penalty:** -3

### Anti-Pattern: Synchronous Script Load

**What goes wrong:** HubSpot tracking or chat script loaded without `strategy` prop or with `beforeInteractive`, causing render-blocking. Tanks LCP and TBT, dropping Core Web Vitals below Awwwards threshold.
**Instead:** Use `strategy="afterInteractive"` for tracking (needed for UTK on navigation) and `strategy="lazyOnload"` for chat widget (not needed until user interaction).
**Penalty:** -3

### Anti-Pattern: Submitting Empty Fields

**What goes wrong:** Optional form fields submitted with empty string values. HubSpot may silently reject the submission or overwrite existing contact data with blanks. No error is returned to the user.
**Instead:** Omit optional fields entirely from the `fields` array if the value is empty or undefined. Only include fields with actual values.
**Penalty:** -2

### Anti-Pattern: Unsanitized Blog HTML

**What goes wrong:** Blog post `postBody` rendered via `dangerouslySetInnerHTML` without sanitization. HubSpot blog content can contain arbitrary HTML (editor embeds, custom modules, third-party scripts). XSS attack vector.
**Instead:** Sanitize with DOMPurify or `sanitize-html` using an allowlist of safe tags and attributes. Strip all `<script>`, `<iframe>`, and inline event handlers.
**Penalty:** -3

### Anti-Pattern: Ignoring 10K Search Cap

**What goes wrong:** CRM Search API silently caps results at 10,000. Dashboard shows "1,547 contacts" when there are actually 25,000. Reports and exports are silently incomplete.
**Instead:** Check if `total > results.length`. For large datasets, use narrower date/stage filters, list memberships, or the CRM Export API for batch operations.
**Penalty:** -2

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| ISR blog revalidate | 60 | 600 | seconds | SOFT -- warn if outside range |
| ISR dashboard revalidate | 60 | 300 | seconds | SOFT -- warn if outside range |
| CRM Search limit per request | 1 | 100 | results | HARD -- API enforced |
| CRM Search total cap | -- | 10000 | results | HARD -- API enforced, warn if total exceeds |
| Private App rate limit | -- | 500 | req/10s | HARD -- 429 if exceeded |
| OAuth rate limit | -- | 100 | req/10s | HARD -- 429 if exceeded |
| Form fields per submission | 1 | 1000 | fields | HARD -- API enforced |
| hutk context | required | -- | string | HARD -- reject submission without hutk if tracking active |

## Pre-Delivery Checklist

Before marking any HubSpot integration as complete, verify:

- [ ] All form submissions include `hutk`, `pageUri`, `pageName` in context object
- [ ] No form names contain CSS classes or auto-generated identifiers
- [ ] Forms API v3 used (not Contacts API) for all user-facing forms
- [ ] Tracking script consent-gated and loads with `afterInteractive` strategy
- [ ] `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_ID` are env vars, not hardcoded
- [ ] `HUBSPOT_ACCESS_TOKEN` never exposed in client-side code
- [ ] Blog HTML sanitized before `dangerouslySetInnerHTML`
- [ ] CRM Search queries handle 10K cap with appropriate warnings
- [ ] Webhook endpoints verify `x-hubspot-signature-v3`
- [ ] Chat widget uses `loadImmediately: false` with user-triggered activation
