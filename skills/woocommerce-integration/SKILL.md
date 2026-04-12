---
name: "woocommerce-integration"
description: "WooCommerce headless e-commerce patterns via REST API v3. Product sync, cart with CoCart, checkout, complex variations, webhooks, and DNA-styled product UIs."
tier: "domain"
triggers: "woocommerce, woo, wordpress e-commerce, headless wordpress shop"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/woo/**/*.ts"
    - "**/*.ts"
---

## Layer 1: Decision Guidance

### When to Use

- Project sells products and the client uses WooCommerce/WordPress as their commerce backend
- Headless storefront build where WooCommerce manages inventory, orders, and fulfillment
- Existing WordPress/WooCommerce store migrating to a custom Next.js/Astro/React frontend
- Any site that needs product data, cart functionality, or checkout powered by WooCommerce

### When NOT to Use

- Client uses Shopify -- use `shopify-integration` instead
- Fully custom e-commerce with no third-party backend -- use `ecommerce-ui` for UI patterns and build a custom API layer
- WordPress theme development (PHP templates) -- this skill targets headless/decoupled builds only
- Simple WooCommerce with a WordPress theme -- no headless integration needed

### Decision Tree

- **REST API v3 (headless, recommended)** -- Full control over frontend. RESTful endpoints for products, orders, customers, variations. Works with Next.js, Astro, React/Vite. Best for award-caliber custom UIs. Use this for all Genorah projects.
- **WPGraphQL + WooGraphQL** -- GraphQL layer on top of WooCommerce via plugins. Better DX for complex queries (e.g., product + reviews + related in one request). Requires WPGraphQL and WooGraphQL plugins installed on the WordPress backend. Use when the client already has WPGraphQL set up or the data model is deeply relational.
- **CoCart REST API (cart management)** -- Extends WooCommerce REST API with headless cart endpoints. Handles session tokens, guest carts, and cart persistence without cookies. Required for headless cart operations since WooCommerce core cart API relies on PHP sessions.
- **Redirect checkout** -- Simplest checkout approach: build headless catalog + cart, then redirect to WooCommerce's native checkout page for payment. Use when PCI compliance or payment gateway compatibility is a concern.
- **Custom checkout** -- Build a fully custom checkout form in the headless frontend using WooCommerce's order creation API. Requires manual payment gateway integration (Stripe, PayPal). Use when complete design control over checkout is required.

### Authentication

| Credential | Scope | Exposure | Use Case |
|-----------|-------|----------|----------|
| Consumer Key + Secret | Full API access (per-user permissions) | **Server-only** (NEVER client-side) | Product queries, order creation, inventory reads |
| CoCart session token | Cart-scoped, per-session | Client-safe (session header) | Cart add/remove/update, session persistence |
| Application password | WordPress user-scoped | Server-only | WordPress admin operations, media uploads |

**Critical:** WooCommerce consumer key/secret pairs grant full API access based on the user's WordPress role. They MUST be kept server-side. Use Next.js API routes, server actions, or Astro server endpoints as a proxy layer.

### Pipeline Connection

- **Auto-detected:** When e-commerce or shopping is mentioned during `/gen:start-project`, ask: "Shopify Storefront, WooCommerce, or custom backend?"
- **Referenced by:** researcher agent during discovery (store audit, product count, category structure, variation model)
- **Referenced by:** builder during product page, category, and cart section builds
- **Consumed at:** `/gen:execute` wave 0 (API proxy setup), wave 1 (cart provider), wave 2+ (product pages, categories)
- **Related commands:** `/gen:plan` scopes WooCommerce data requirements per section

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: REST API v3 Proxy (Server-Side)

```tsx
// lib/woocommerce.ts -- Server-side WooCommerce REST API client
const WC_BASE_URL = process.env.WOOCOMMERCE_URL!; // e.g., https://store.example.com
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

interface WCResponse<T> {
  data: T;
  headers: Headers;
}

export async function wcFetch<T>(
  endpoint: string,
  params?: Record<string, string>,
  options?: { revalidate?: number; tags?: string[] }
): Promise<WCResponse<T>> {
  const url = new URL(`/wp-json/wc/v3/${endpoint}`, WC_BASE_URL);

  // Auth via query params (simpler) or Basic Auth header
  url.searchParams.set("consumer_key", WC_CONSUMER_KEY);
  url.searchParams.set("consumer_secret", WC_CONSUMER_SECRET);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    next: {
      revalidate: options?.revalidate ?? 300,
      tags: options?.tags ?? ["woocommerce"],
    },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status} ${res.statusText}`);
  }

  const data: T = await res.json();
  return { data, headers: res.headers };
}

// Typed write operations (POST/PUT/DELETE)
export async function wcMutate<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`/wp-json/wc/v3/${endpoint}`, WC_BASE_URL);
  url.searchParams.set("consumer_key", WC_CONSUMER_KEY);
  url.searchParams.set("consumer_secret", WC_CONSUMER_SECRET);

  const res = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`WooCommerce mutation error: ${res.status}`);
  }

  return res.json();
}
```

```tsx
// app/api/products/route.ts -- Next.js API route proxy (keeps credentials server-side)
import { wcFetch } from "@/lib/woocommerce";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "24";
  const category = searchParams.get("category") || "";
  const orderby = searchParams.get("orderby") || "date";

  const params: Record<string, string> = {
    page,
    per_page: perPage,
    orderby,
    status: "publish",
  };
  if (category) params.category = category;

  const { data, headers } = await wcFetch<WCProduct[]>("products", params, {
    tags: ["products"],
  });

  return NextResponse.json({
    products: data,
    total: Number(headers.get("X-WP-Total") || 0),
    totalPages: Number(headers.get("X-WP-TotalPages") || 0),
  });
}
```

#### Pattern 2: Products with ISR + Webhook Revalidation

```tsx
// app/products/[slug]/page.tsx -- Static product page with on-demand revalidation
import { wcFetch } from "@/lib/woocommerce";
import Image from "next/image";
import { notFound } from "next/navigation";
import { VariationSelector } from "./variation-selector";
import { ProductStructuredData } from "./product-structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data: products } = await wcFetch<WCProduct[]>("products", {
    per_page: "100",
    status: "publish",
  });

  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { data: products } = await wcFetch<WCProduct[]>(
    "products",
    { slug },
    { tags: [`product-${slug}`], revalidate: 3600 }
  );

  const product = products[0];
  if (!product) notFound();

  // Fetch variations if variable product
  let variations: WCVariation[] = [];
  if (product.type === "variable") {
    const { data } = await wcFetch<WCVariation[]>(
      `products/${product.id}/variations`,
      { per_page: "100" },
      { tags: [`product-${slug}-variations`] }
    );
    variations = data;
  }

  const images = product.images || [];

  return (
    <>
      <ProductStructuredData product={product} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
              <Image
                src={images[0]?.src}
                alt={images[0]?.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded bg-surface">
                  <Image src={img.src} alt={img.alt || ""} fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
              {product.name}
            </h1>
            <PriceDisplay product={product} />
            {product.type === "variable" && (
              <VariationSelector product={product} variations={variations} />
            )}
            {/* Sanitize HTML server-side before rendering */}
            <div
              className="prose prose-sm text-muted"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function PriceDisplay({ product }: { product: WCProduct }) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: product.meta_data?.find((m) => m.key === "_currency")?.value || "EUR",
  });

  return (
    <div className="flex items-baseline gap-3">
      {product.on_sale && product.regular_price && (
        <span className="text-lg text-muted line-through">
          {formatter.format(Number(product.regular_price))}
        </span>
      )}
      <span className="font-display text-2xl font-bold text-primary">
        {formatter.format(Number(product.price))}
      </span>
    </div>
  );
}
```

#### Pattern 3: Cart with CoCart REST API

```tsx
// lib/cocart.ts -- CoCart headless cart client
const WC_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;

interface CoCartItem {
  item_key: string;
  id: number;
  name: string;
  price: string;
  quantity: { value: number };
  totals: { total: string };
  featured_image: string;
  variation: Record<string, string>;
}

interface CoCartResponse {
  items: Record<string, CoCartItem>;
  totals: {
    subtotal: string;
    total: string;
  };
  item_count: number;
}

class CoCartClient {
  private baseUrl: string;
  private cartKey: string | null = null;

  constructor(storeUrl: string) {
    this.baseUrl = `${storeUrl}/wp-json/cocart/v2`;
    // Restore cart key from localStorage for session persistence
    if (typeof window !== "undefined") {
      this.cartKey = localStorage.getItem("cocart_key");
    }
  }

  private headers(): HeadersInit {
    const h: HeadersInit = { "Content-Type": "application/json" };
    if (this.cartKey) {
      h["X-CoCart-API"] = this.cartKey;
    }
    return h;
  }

  private saveCartKey(response: Response) {
    const key = response.headers.get("X-CoCart-API");
    if (key && typeof window !== "undefined") {
      this.cartKey = key;
      localStorage.setItem("cocart_key", key);
    }
  }

  async getCart(): Promise<CoCartResponse> {
    const res = await fetch(`${this.baseUrl}/cart`, { headers: this.headers() });
    this.saveCartKey(res);
    return res.json();
  }

  async addItem(
    productId: number,
    quantity: number,
    variation?: Record<string, string>
  ): Promise<CoCartResponse> {
    const res = await fetch(`${this.baseUrl}/cart/add-item`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        id: String(productId),
        quantity: String(quantity),
        variation: variation || {},
      }),
    });
    this.saveCartKey(res);
    return res.json();
  }

  async updateItem(itemKey: string, quantity: number): Promise<CoCartResponse> {
    const res = await fetch(`${this.baseUrl}/cart/item/${itemKey}`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ quantity: String(quantity) }),
    });
    return res.json();
  }

  async removeItem(itemKey: string): Promise<CoCartResponse> {
    const res = await fetch(`${this.baseUrl}/cart/item/${itemKey}`, {
      method: "DELETE",
      headers: this.headers(),
    });
    return res.json();
  }

  async clearCart(): Promise<void> {
    await fetch(`${this.baseUrl}/cart/clear`, {
      method: "POST",
      headers: this.headers(),
    });
  }
}

export const cocart = new CoCartClient(WC_BASE_URL);
```

```tsx
// contexts/cart-context.tsx -- React context wrapping CoCart
"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cocart, type CoCartResponse } from "@/lib/cocart";

interface CartContextValue {
  cart: CoCartResponse | null;
  isLoading: boolean;
  addItem: (
    productId: number,
    quantity: number,
    variation?: Record<string, string>
  ) => Promise<void>;
  updateItem: (itemKey: string, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CoCartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cocart
      .getCart()
      .then(setCart)
      .finally(() => setIsLoading(false));
  }, []);

  const addItem = useCallback(
    async (
      productId: number,
      quantity: number,
      variation?: Record<string, string>
    ) => {
      setIsLoading(true);
      const updated = await cocart.addItem(productId, quantity, variation);
      setCart(updated);
      setIsLoading(false);
    },
    []
  );

  const updateItem = useCallback(async (itemKey: string, quantity: number) => {
    const updated = await cocart.updateItem(itemKey, quantity);
    setCart(updated);
  }, []);

  const removeItem = useCallback(async (itemKey: string) => {
    const updated = await cocart.removeItem(itemKey);
    setCart(updated);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        itemCount: cart?.item_count ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
```

#### Pattern 4: Checkout (Redirect to WooCommerce or Custom)

```tsx
// Approach A: Redirect checkout -- simplest, handles payment gateways natively
// components/checkout-redirect.tsx
"use client";

import { useCart } from "@/contexts/cart-context";

export function CheckoutButton() {
  const { cart, isLoading } = useCart();
  const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;

  const handleCheckout = () => {
    // Redirect to WooCommerce native checkout
    // CoCart session key transfers the cart to WordPress
    window.location.href = `${storeUrl}/checkout/?cocart-load-cart=${localStorage.getItem("cocart_key")}`;
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || !cart?.item_count}
      className="w-full rounded-lg bg-primary px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
    >
      Proceed to Checkout
    </button>
  );
}
```

```tsx
// Approach B: Custom checkout form with WooCommerce order creation
// app/checkout/actions.ts
"use server";

import { wcMutate } from "@/lib/woocommerce";

interface CheckoutData {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  line_items: {
    product_id: number;
    quantity: number;
    variation_id?: number;
  }[];
  payment_method: string;
}

export async function createOrder(data: CheckoutData) {
  const order = await wcMutate<WCOrder>("orders", "POST", {
    ...data,
    set_paid: false, // Payment handled separately
    status: "pending",
  });

  // Return order ID for payment processing
  return { orderId: order.id, orderKey: order.order_key };
}
```

#### Pattern 5: Complex Variations (Size x Color x Material)

```tsx
// components/variation-selector.tsx -- Handles WooCommerce's complex variation model
"use client";

import { useState, useMemo } from "react";

interface WCVariation {
  id: number;
  attributes: { name: string; option: string }[];
  price: string;
  regular_price: string;
  stock_status: string;
  image?: { src: string; alt: string };
}

interface Props {
  product: WCProduct;
  variations: WCVariation[];
}

export function VariationSelector({ product, variations }: Props) {
  // Extract all attribute axes from product (e.g., Size, Color, Material)
  const attributes = product.attributes.filter((a) => a.variation);

  // Track selected option per attribute
  const [selected, setSelected] = useState<Record<string, string>>({});

  // Build availability matrix: which options are available given current selections
  const availableOptions = useMemo(() => {
    const matrix: Record<string, Set<string>> = {};

    for (const attr of attributes) {
      matrix[attr.name] = new Set();

      for (const variation of variations) {
        if (variation.stock_status === "outofstock") continue;

        // Check if this variation matches all OTHER selected attributes
        const matchesOthers = Object.entries(selected).every(([key, value]) => {
          if (key === attr.name) return true; // Skip current attribute
          const varAttr = variation.attributes.find((a) => a.name === key);
          // WooCommerce: empty option means "any" (catch-all variation)
          return !varAttr?.option || varAttr.option === value;
        });

        if (matchesOthers) {
          const thisAttr = variation.attributes.find(
            (a) => a.name === attr.name
          );
          if (thisAttr?.option) {
            matrix[attr.name].add(thisAttr.option);
          } else {
            // Empty option = any value is valid
            attr.options.forEach((opt) => matrix[attr.name].add(opt));
          }
        }
      }
    }

    return matrix;
  }, [attributes, variations, selected]);

  // Find the exact matching variation
  const matchedVariation = useMemo(() => {
    if (Object.keys(selected).length !== attributes.length) return null;

    return (
      variations.find((v) =>
        attributes.every((attr) => {
          const varAttr = v.attributes.find((a) => a.name === attr.name);
          return !varAttr?.option || varAttr.option === selected[attr.name];
        })
      ) ?? null
    );
  }, [selected, variations, attributes]);

  const handleSelect = (attrName: string, option: string) => {
    setSelected((prev) => ({ ...prev, [attrName]: option }));
  };

  return (
    <div className="space-y-4">
      {attributes.map((attr) => (
        <div key={attr.name}>
          <label className="mb-2 block font-body text-sm font-medium text-text">
            {attr.name}:{" "}
            <span className="text-muted">{selected[attr.name] || "Select"}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option) => {
              const isAvailable = availableOptions[attr.name]?.has(option);
              const isSelected = selected[attr.name] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(attr.name, option)}
                  disabled={!isAvailable}
                  className={`
                    rounded-md border px-3 py-2 font-body text-sm transition-all
                    ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : isAvailable
                          ? "border-border bg-surface text-text hover:border-primary"
                          : "cursor-not-allowed border-border bg-muted/20 text-muted line-through"
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {matchedVariation && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-display text-xl font-bold text-primary">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "EUR",
            }).format(Number(matchedVariation.price))}
          </p>
          <p className="text-sm text-muted">
            {matchedVariation.stock_status === "instock"
              ? "In stock"
              : "Out of stock"}
          </p>
        </div>
      )}
    </div>
  );
}
```

#### Pattern 6: Webhooks (Revalidation on Product/Order Updates)

```tsx
// app/api/webhooks/woocommerce/route.ts -- Webhook receiver for on-demand ISR
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const WC_WEBHOOK_SECRET = process.env.WC_WEBHOOK_SECRET!;

function verifySignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac("sha256", WC_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-wc-webhook-signature");

  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-wc-webhook-topic");
  const payload = JSON.parse(body);

  switch (topic) {
    case "product.updated":
    case "product.created":
    case "product.deleted":
      revalidateTag(`product-${payload.slug}`);
      revalidateTag("products");
      break;

    case "order.created":
    case "order.updated":
      // Revalidate stock-dependent product pages
      for (const item of payload.line_items || []) {
        revalidateTag(`product-${item.product_id}`);
      }
      revalidateTag("products");
      break;

    default:
      revalidateTag("woocommerce");
  }

  return NextResponse.json({ revalidated: true, topic });
}
```

### Reference Sites

- **Allbirds** (allbirds.com) -- Headless commerce with clean product presentation, simple variation selectors, and premium imagery. DNA-aligned color system and type hierarchy throughout the purchase flow.
- **Rapha** (rapha.cc) -- Complex size/color variation model handled with clear visual selectors and real-time availability. Excellent example of multi-axis variation UX for apparel.
- **Aesop** (aesop.com) -- Award-winning product detail pages with editorial content integration, minimal chrome, and sophisticated image galleries. Strong archetype alignment (Luxury/Fashion).
- **Carhartt WIP** (carhartt-wip.com) -- Data-dense product pages with size guides, material composition, and care instructions alongside clean e-commerce UX. Good balance of information density with visual quality.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `bg`, `surface` | Product card backgrounds, gallery containers, cart drawer |
| `text`, `muted` | Product names, descriptions, secondary info (SKU, stock status) |
| `primary` | Price display, CTA buttons (Add to Cart, Checkout) |
| `accent` | Sale badges, discount percentages, stock warnings |
| `border` | Card outlines, variation selector borders, dividers |
| `font-display` | Product titles, price display |
| `font-body` | Descriptions, attribute labels, cart item details |
| `spacing-*` | Product grid gaps, card padding, section margins |
| `motion-*` | Cart drawer slide, add-to-cart feedback, image gallery transitions |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Luxury/Fashion | Large hero images, minimal UI chrome, serif product titles, generous whitespace between products |
| Brutalist | Raw product photography, bold price typography, exposed grid structure, no rounded corners |
| Warm Artisan | Textured card backgrounds, hand-drawn accent elements, warm color palette for CTAs |
| Neo-Corporate | Clean data tables for specs, structured variation selectors, systematic grid layout |
| Playful/Startup | Animated add-to-cart feedback, colorful badges, bouncy micro-interactions on hover |
| Japanese Minimal | Maximum whitespace, single-column product layout, understated price display |

### Pipeline Stage

- **Input from:** Discovery phase identifies WooCommerce as commerce backend, product count, category structure, variation complexity
- **Output to:** Section builders receive typed API client, product types, cart context provider. SEO skill receives product structured data.

### Related Skills

- `ecommerce-ui` -- UI patterns for product cards, grids, cart drawers, checkout forms. Use alongside this skill for visual layer.
- `seo-meta` -- Product page SEO, canonical URLs, structured data (Product schema)
- `structured-data` -- Product, Offer, AggregateRating schema.org markup
- `image-asset-pipeline` -- WooCommerce image optimization, srcset generation, lazy loading
- `performance-patterns` -- ISR strategies, cache headers, pagination for large catalogs
- `i18n-rtl` -- Multi-currency formatting, locale-aware price display

### Quality Checks

- [ ] Consumer key/secret never appears in client-side code or `NEXT_PUBLIC_` env vars
- [ ] Products use ISR with webhook-triggered revalidation (not client-side fetching)
- [ ] Variation selector handles all combinations including "any" (empty option) catch-all variations
- [ ] Prices formatted with `Intl.NumberFormat` using correct currency from WooCommerce
- [ ] Cart operations use CoCart with session persistence (localStorage cart key)
- [ ] Webhook endpoint validates `x-wc-webhook-signature` before processing
- [ ] Product images use Next.js `<Image>` with correct `sizes` attribute
- [ ] Pagination implemented for product listings (WooCommerce default: 10 per page)

## Layer 4: Anti-Patterns

### Anti-Pattern: Consumer Key/Secret Client-Side (-15)

**What goes wrong:** WooCommerce consumer key and secret are placed in `NEXT_PUBLIC_` environment variables or embedded in client-side JavaScript. These credentials grant full API access (including order creation, customer data reads, and inventory writes) based on the associated WordPress user's role. Exposing them allows anyone to read customer PII, create fraudulent orders, or modify product data.

**Instead:** Always proxy WooCommerce API calls through server-side endpoints (Next.js API routes, server actions, Astro server endpoints). Only the CoCart session token is safe for client-side use.

### Anti-Pattern: Not Handling Variation Complexity (-5)

**What goes wrong:** Variation selector treats WooCommerce variations like simple option lists (e.g., just a color dropdown). WooCommerce's variation model supports multi-axis combinations (size x color x material), "any" catch-all attributes (empty `option` field), per-variation images, per-variation pricing, and out-of-stock individual combinations. Naive implementations break when a product has 50+ variations across 3 axes with partial stock.

**Instead:** Build an availability matrix that cross-references all selected attributes against all variations. Handle the empty `option` field as "matches any value." Disable unavailable combinations rather than showing errors after selection. Update price and image when a complete variation is matched.

### Anti-Pattern: Missing Currency/Tax Formatting Per Locale (-3)

**What goes wrong:** Prices are displayed as raw numbers (e.g., "49.99") without proper currency symbol, decimal separator, or tax indication. WooCommerce stores prices in the shop's base currency but may serve customers in different locales. German customers expect "49,99 EUR" with comma decimal; US customers expect "$49.99".

**Instead:** Use `Intl.NumberFormat` with `style: "currency"` and the currency code from WooCommerce's API response. Display tax information according to the store's tax settings (`prices_include_tax`). For multi-currency setups, use the WooCommerce Multi-Currency plugin's API to get locale-appropriate prices.

### Anti-Pattern: No Fallback for WooCommerce Downtime (-3)

**What goes wrong:** The headless frontend shows blank pages or error screens when the WordPress/WooCommerce backend is unreachable (plugin updates, hosting issues, database maintenance). Unlike SaaS platforms like Shopify, self-hosted WooCommerce instances have more frequent downtime windows.

**Instead:** Implement ISR with long revalidation windows so static pages survive backend downtime. Show stale product data with a "prices may not reflect current availability" banner. Cart operations should use optimistic UI with retry logic. Add health check monitoring for the WooCommerce endpoint.

### Anti-Pattern: Images Without Optimization (-2)

**What goes wrong:** Product images are loaded directly from the WordPress `wp-content/uploads` URL at full resolution. WooCommerce generates multiple image sizes (thumbnail, medium, large, full) but the headless frontend ignores these, loading 2000x2000px originals for 200x200px card thumbnails.

**Instead:** Use WooCommerce's image size variants from the API response (each image includes `src` and WordPress-generated sizes). Better: pass images through Next.js `<Image>` with the WordPress domain in `next.config.js` `images.remotePatterns`. Set appropriate `sizes` attribute for each context (card thumbnail vs. full-width gallery).

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Product list page size | 12 | 48 | items | SOFT -- warn if outside range |
| ISR revalidation interval | 60 | 86400 | seconds | SOFT -- warn if below 60s (rate limits) |
| Variation fetch limit | 1 | 100 | per request | HARD -- WooCommerce API max 100 per page |
| Image thumbnail width | 200 | 600 | px | SOFT -- card thumbnail range |
| Product image quality | 75 | 90 | % | SOFT -- balance quality vs. file size |
| Webhook signature validation | 1 | 1 | boolean | HARD -- always validate signatures |
| Consumer key client exposure | 0 | 0 | boolean | HARD -- never expose to client |
