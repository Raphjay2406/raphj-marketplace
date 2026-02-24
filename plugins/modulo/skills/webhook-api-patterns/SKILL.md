# Webhook & API Patterns

API route design, webhook handling, middleware chains, rate limiting, and backend integration patterns for Next.js and Astro.

## Next.js API Route — RESTful CRUD

```ts
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    db.item.findMany({ skip: offset, take: limit, orderBy: { createdAt: "desc" } }),
    db.item.count(),
  ]);

  return NextResponse.json({
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const item = await db.item.create({ data: parsed.data });
  return NextResponse.json({ data: item }, { status: 201 });
}
```

## Dynamic Route with Params

```ts
// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await db.item.findUnique({ where: { id } });

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: item });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const item = await db.item.update({ where: { id }, data: body });
  return NextResponse.json({ data: item });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.item.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
```

## Webhook Receiver with Signature Verification

```ts
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSucceeded(invoice);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancelled(subscription);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

## Generic Webhook with HMAC Verification

```ts
// lib/webhook-verify.ts
import { createHmac, timingSafeEqual } from "crypto";

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm = "sha256"
): boolean {
  const expected = createHmac(algorithm, secret).update(payload).digest("hex");
  const sig = signature.replace(`${algorithm}=`, "");

  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// app/api/webhooks/github/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";

  if (!verifyWebhookSignature(body, signature, process.env.GITHUB_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  const payload = JSON.parse(body);

  // process event...
  return NextResponse.json({ received: true });
}
```

## Middleware — Auth + Rate Limiting

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Auth check for protected routes
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
```

## Server Action with Validation

```ts
// app/actions/items.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function createItem(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.item.create({ data: parsed.data });
  revalidatePath("/items");
  return { success: true };
}

export async function deleteItem(id: string) {
  await db.item.delete({ where: { id } });
  revalidatePath("/items");
}
```

## Astro — Server Endpoints

```ts
// src/pages/api/items.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const items = await db.item.findMany({
    skip: (page - 1) * 20,
    take: 20,
  });

  return new Response(JSON.stringify({ data: items }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const item = await db.item.create({ data: body });

  return new Response(JSON.stringify({ data: item }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
```

## Astro — Middleware Chain

```ts
// src/middleware.ts
import { defineMiddleware, sequence } from "astro:middleware";

const logger = defineMiddleware(async ({ request, url }, next) => {
  const start = performance.now();
  const response = await next();
  const duration = Math.round(performance.now() - start);
  console.log(`${request.method} ${url.pathname} ${response.status} ${duration}ms`);
  return response;
});

const auth = defineMiddleware(async ({ request, url, redirect }, next) => {
  if (url.pathname.startsWith("/admin")) {
    const token = request.headers.get("authorization");
    if (!token) return redirect("/login");
  }
  return next();
});

export const onRequest = sequence(logger, auth);
```

## Error Response Helper

```ts
// lib/api-response.ts
export function apiError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status }
  );
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

// Usage
export async function GET() {
  try {
    const items = await db.item.findMany();
    return apiSuccess(items);
  } catch (error) {
    return apiError("Failed to fetch items", 500);
  }
}
```

## Key Rules

- Always validate request bodies with Zod before processing
- Use `request.text()` for webhooks (not `.json()`) to verify signatures against raw body
- Use timing-safe comparison for HMAC signature verification
- Rate limit API routes in middleware — never in individual handlers
- Return consistent error shapes: `{ error: string, details?: unknown }`
- Webhook handlers must return 200 quickly — offload heavy processing to queues
- Use Server Actions for mutations from forms, API routes for external consumers
- Astro: use `sequence()` for middleware chains, export named HTTP methods for endpoints
