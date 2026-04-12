---
name: "shopify-integration"
description: "Shopify headless e-commerce patterns using Storefront API. Product catalog, collections, cart, checkout, metafields, customer accounts, and DNA-styled product UIs."
tier: "domain"
triggers: "shopify, e-commerce, storefront, product catalog, shopping cart, online store"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/shopify/**/*.ts"
    - "**/*.ts"
---

## Layer 1: Decision Guidance

### When to Use

- Project sells products and the client uses Shopify as their commerce backend
- Headless storefront build where Shopify manages inventory, orders, and fulfillment
- Existing Shopify store migrating to a custom Next.js/Astro/React frontend
- Any site that needs product data, cart functionality, or checkout powered by Shopify

### When NOT to Use

- Client uses WooCommerce -- use WordPress/WooCommerce integration patterns instead
- Fully custom e-commerce with no third-party backend -- use `ecommerce-ui` for UI patterns and build a custom API layer
- Shopify theme development (Liquid templates) -- this skill targets headless/decoupled builds only
- Simple "Buy Button" embed on an otherwise static site -- use Shopify Buy SDK (see decision tree below)

### Decision Tree

- **Storefront API (headless, recommended)** -- Full control over frontend. GraphQL API for products, collections, cart, checkout. Works with Next.js, Astro, React/Vite. Best for award-caliber custom UIs. Use this for all Genorah projects.
- **Hydrogen (Shopify's React framework)** -- Shopify's own React meta-framework built on Remix. Opinionated routing and data loading. Use only if client explicitly requires Hydrogen or needs Shopify's managed hosting (Oxygen). Not recommended for Genorah projects -- limits design freedom.
- **Buy SDK (lightweight embed)** -- JavaScript SDK that renders Shopify buy buttons and cart widget into any page. Use for blogs, portfolios, or content sites that need a minimal "buy this item" capability without a full storefront. No custom UI control.
- **Admin API** -- Server-side only. For order management, inventory sync, discount creation, customer data writes. Never expose to the client. Use in API routes or server actions.

### Authentication

| Token Type | Scope | Exposure | Use Case |
|-----------|-------|----------|----------|
| Storefront API token | Public, read-only + cart mutations | Safe for client-side (`NEXT_PUBLIC_`) | Product queries, cart operations, checkout URL |
| Admin API token | Full read/write | Server-only (never `NEXT_PUBLIC_`) | Order management, inventory, discounts, customer writes |
| Customer Account API token | Customer-scoped | Server-only with session | Login, order history, saved addresses |

### Pipeline Connection

- **Auto-detected:** When e-commerce or shopping is mentioned during `/gen:start-project`, ask: "Shopify Storefront, WooCommerce, or custom backend?"
- **Referenced by:** researcher agent during discovery (store audit, product count, collection structure)
- **Referenced by:** builder during product page, collection, and cart section builds
- **Consumed at:** `/gen:execute` wave 0 (API client setup), wave 1 (cart provider), wave 2+ (product pages, collections)
- **Related commands:** `/gen:plan` scopes Shopify data requirements per section

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Storefront API Client Setup

```tsx
// lib/shopify.ts -- Typed GraphQL client for Shopify Storefront API
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`;

interface ShopifyResponse<T> {
  data: T;
  errors?: { message: string }[];
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json: ShopifyResponse<T> = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data;
}
```

```tsx
// lib/shopify-queries.ts -- Typed GraphQL fragments and queries
export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    seo {
      title
      description
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GET_PRODUCTS = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int = 24, $after: String, $sortKey: ProductSortKeys = BEST_SELLING) {
    products(first: $first, after: $after, sortKey: $sortKey) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;
```

#### Pattern 2: Product Page with Variant Selector

```tsx
// app/products/[handle]/page.tsx -- SSG product page with ISR
import { shopifyFetch } from "@/lib/shopify";
import { GET_PRODUCT_BY_HANDLE, GET_ALL_PRODUCT_HANDLES } from "@/lib/shopify-queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { VariantSelector } from "./variant-selector";
import { ProductStructuredData } from "./product-structured-data";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const { products } = await shopifyFetch<{
    products: { edges: { node: { handle: string } }[] };
  }>(GET_ALL_PRODUCT_HANDLES);

  return products.edges.map(({ node }) => ({ handle: node.handle }));
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const { product } = await shopifyFetch<{ product: ShopifyProduct | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle }
  );

  if (!product) notFound();

  const images = product.images.edges.map(({ node }) => node);

  return (
    <>
      <ProductStructuredData product={product} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
              <Image
                src={images[0]?.url}
                alt={images[0]?.altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((image, i) => (
                <button
                  key={image.url}
                  className="relative aspect-square overflow-hidden rounded-md bg-surface ring-2 ring-transparent hover:ring-primary focus-visible:ring-primary motion-safe:transition-[box-shadow]"
                  aria-label={`View image ${i + 2} of ${images.length}`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} image ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-text lg:text-4xl">
                {product.title}
              </h1>
              <p className="mt-2 text-2xl font-semibold text-text">
                {formatMoney(product.priceRange.minVariantPrice)}
              </p>
            </div>

            <VariantSelector product={product} />

            {/* NOTE: descriptionHtml comes from Shopify's rich text editor
                (trusted CMS content). For user-generated content, sanitize
                with DOMPurify before rendering. */}
            <div
              className="prose prose-sm text-muted"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function formatMoney(money: { amount: string; currencyCode: string }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}
```

```tsx
// app/products/[handle]/variant-selector.tsx -- URL-synced variant state
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface Props {
  product: ShopifyProduct;
}

export function VariantSelector({ product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variants = product.variants.edges.map(({ node }) => node);

  // Group options by name (e.g., "Size", "Color")
  const options = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const variant of variants) {
      for (const opt of variant.selectedOptions) {
        if (!map.has(opt.name)) map.set(opt.name, new Set());
        map.get(opt.name)!.add(opt.value);
      }
    }
    return Array.from(map, ([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [variants]);

  // Get selected options from URL
  const selectedOptions = useMemo(() => {
    const selected: Record<string, string> = {};
    for (const opt of options) {
      selected[opt.name] = searchParams.get(opt.name) || opt.values[0];
    }
    return selected;
  }, [options, searchParams]);

  // Find matching variant
  const selectedVariant = useMemo(() => {
    return variants.find((v) =>
      v.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    );
  }, [variants, selectedOptions]);

  const updateOption = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <fieldset key={option.name}>
          <legend className="text-sm font-medium text-text">
            {option.name}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              // Check if this option + value combination is available
              const isAvailable = variants.some(
                (v) =>
                  v.availableForSale &&
                  v.selectedOptions.some(
                    (o) => o.name === option.name && o.value === value
                  )
              );

              return (
                <button
                  key={value}
                  onClick={() => updateOption(option.name, value)}
                  disabled={!isAvailable}
                  className={`rounded-md border px-4 py-2 text-sm font-medium motion-safe:transition-colors
                    ${isSelected
                      ? "border-primary bg-primary text-bg"
                      : isAvailable
                        ? "border-border bg-bg text-text hover:border-primary"
                        : "border-border bg-surface text-muted line-through opacity-60 cursor-not-allowed"
                    }`}
                  aria-pressed={isSelected}
                  aria-label={`${option.name}: ${value}${!isAvailable ? " (out of stock)" : ""}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* Add to Cart */}
      <button
        disabled={!selectedVariant?.availableForSale}
        className="w-full rounded-lg bg-primary py-3.5 text-center font-semibold text-bg hover:bg-primary/90 disabled:bg-muted disabled:text-bg disabled:cursor-not-allowed motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={
          selectedVariant?.availableForSale
            ? `Add ${product.title} to cart`
            : "Out of stock"
        }
      >
        {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}
```

```tsx
// app/products/[handle]/product-structured-data.tsx -- SEO JSON-LD
export function ProductStructuredData({ product }: { product: ShopifyProduct }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

#### Pattern 3: Collections & Filtering

```tsx
// app/collections/[handle]/page.tsx -- Collection page with faceted filtering
import { shopifyFetch } from "@/lib/shopify";
import { GET_COLLECTION_BY_HANDLE } from "@/lib/shopify-queries";
import { ProductGrid } from "@/components/product-grid";
import { CollectionFilters } from "./collection-filters";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { handle } = await params;
  const filters = await searchParams;

  const sortKey = filters.sort || "BEST_SELLING";
  const reverse = filters.order === "desc";

  const { collection } = await shopifyFetch<{ collection: ShopifyCollection }>(
    GET_COLLECTION_BY_HANDLE,
    { handle, first: 24, sortKey, reverse }
  );

  if (!collection) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2 text-muted">{collection.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <CollectionFilters />
        </aside>
        <div className="flex-1">
          <ProductGrid products={collection.products.edges.map(({ node }) => node)} />
        </div>
      </div>
    </section>
  );
}
```

```tsx
// app/collections/[handle]/collection-filters.tsx -- URL-synced sort & filter
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Best Selling", value: "BEST_SELLING" },
  { label: "Price: Low to High", value: "PRICE", order: "asc" },
  { label: "Price: High to Low", value: "PRICE", order: "desc" },
  { label: "Newest", value: "CREATED_AT", order: "desc" },
  { label: "A-Z", value: "TITLE", order: "asc" },
];

export function CollectionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateSort(sortValue: string, order?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    if (order) params.set("order", order);
    else params.delete("order");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-text">Sort by</legend>
        <div className="mt-2 space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateSort(opt.value, opt.order)}
              className={`block w-full rounded-md px-3 py-2 text-start text-sm motion-safe:transition-colors ${
                searchParams.get("sort") === opt.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-text hover:bg-surface"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
```

#### Pattern 4: Cart Context with Storefront Cart API

```tsx
// lib/cart-context.tsx -- Cart provider using Shopify Storefront Cart API
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { shopifyFetch } from "@/lib/shopify";
import {
  CREATE_CART,
  ADD_CART_LINES,
  UPDATE_CART_LINES,
  REMOVE_CART_LINES,
  GET_CART,
} from "@/lib/shopify-cart-queries";

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string; featuredImage: { url: string; altText: string } };
    price: { amount: string; currencyCode: string };
    selectedOptions: { name: string; value: string }[];
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: CartLine }[] };
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_ID_KEY = "shopify_cart_id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      shopifyFetch<{ cart: Cart }>(GET_CART, { cartId })
        .then(({ cart: fetchedCart }) => {
          if (fetchedCart) setCart(fetchedCart);
          else localStorage.removeItem(CART_ID_KEY);
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY));
    }
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true);
      try {
        if (!cart) {
          // Create new cart
          const { cartCreate } = await shopifyFetch<{
            cartCreate: { cart: Cart };
          }>(CREATE_CART, {
            lines: [{ merchandiseId: variantId, quantity }],
          });
          setCart(cartCreate.cart);
          localStorage.setItem(CART_ID_KEY, cartCreate.cart.id);
        } else {
          // Add to existing cart
          const { cartLinesAdd } = await shopifyFetch<{
            cartLinesAdd: { cart: Cart };
          }>(ADD_CART_LINES, {
            cartId: cart.id,
            lines: [{ merchandiseId: variantId, quantity }],
          });
          setCart(cartLinesAdd.cart);
        }
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setLoading(true);
      try {
        const { cartLinesUpdate } = await shopifyFetch<{
          cartLinesUpdate: { cart: Cart };
        }>(UPDATE_CART_LINES, {
          cartId: cart.id,
          lines: [{ id: lineId, quantity }],
        });
        setCart(cartLinesUpdate.cart);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setLoading(true);
      try {
        const { cartLinesRemove } = await shopifyFetch<{
          cartLinesRemove: { cart: Cart };
        }>(REMOVE_CART_LINES, {
          cartId: cart.id,
          lineIds: [lineId],
        });
        setCart(cartLinesRemove.cart);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const value = useMemo(
    () => ({ cart, loading, addItem, updateItem, removeItem }),
    [cart, loading, addItem, updateItem, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
```

#### Pattern 5: Checkout Redirect

```tsx
// components/checkout-button.tsx -- Redirect to Shopify-hosted checkout
"use client";

import { useCart } from "@/lib/cart-context";

export function CheckoutButton() {
  const { cart, loading } = useCart();

  if (!cart || cart.totalQuantity === 0) return null;

  return (
    <a
      href={cart.checkoutUrl}
      className="block w-full rounded-lg bg-primary py-3.5 text-center font-semibold text-bg hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label="Proceed to checkout"
    >
      {loading ? "Updating..." : "Checkout"}
    </a>
  );
}
```

```tsx
// app/thank-you/page.tsx -- Post-checkout confirmation
// Shopify redirects here after successful checkout.
// The order ID comes from Shopify checkout redirect URL params.
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-primary/10">
        <CheckIcon className="size-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-text">Thank You!</h1>
      <p className="mt-3 text-muted">
        Your order has been placed. You will receive a confirmation email shortly.
      </p>
      <a
        href="/"
        className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-bg hover:bg-primary/90 motion-safe:transition-colors"
      >
        Continue Shopping
      </a>
    </section>
  );
}
```

#### Pattern 6: Metafields & Custom Content

```tsx
// Extend product query to include metafields
export const GET_PRODUCT_WITH_METAFIELDS = /* GraphQL */ `
  query GetProductWithMetafields($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
      metafields(identifiers: [
        { namespace: "custom", key: "ingredients" },
        { namespace: "custom", key: "sizing_chart" },
        { namespace: "custom", key: "care_instructions" },
        { namespace: "custom", key: "material" }
      ]) {
        key
        value
        type
      }
    }
  }
`;
```

```tsx
// components/product-metafields.tsx -- DNA-styled metafield renderer
interface Metafield {
  key: string;
  value: string;
  type: string;
}

const METAFIELD_LABELS: Record<string, string> = {
  ingredients: "Ingredients",
  sizing_chart: "Sizing Chart",
  care_instructions: "Care Instructions",
  material: "Material",
};

export function ProductMetafields({ metafields }: { metafields: (Metafield | null)[] }) {
  const validFields = metafields.filter(Boolean) as Metafield[];
  if (validFields.length === 0) return null;

  return (
    <div className="space-y-4 border-t border-border pt-6">
      {validFields.map((field) => (
        <details
          key={field.key}
          className="group rounded-lg border border-border"
        >
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-text hover:bg-surface motion-safe:transition-colors">
            {METAFIELD_LABELS[field.key] || field.key}
            <ChevronDownIcon className="size-4 text-muted motion-safe:transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 text-sm text-muted">
            {/* Metafield content comes from Shopify CMS (trusted merchant input).
                For user-generated content, sanitize with DOMPurify. */}
            {field.type === "rich_text_field" ? (
              <div dangerouslySetInnerHTML={{ __html: field.value }} />
            ) : field.type === "json" ? (
              <SizingChart data={JSON.parse(field.value)} />
            ) : (
              <p>{field.value}</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

function SizingChart({ data }: { data: Record<string, string>[] }) {
  if (!data.length) return null;
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-start font-semibold text-text">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {headers.map((h) => (
                <td key={h} className="px-3 py-2 text-muted">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Reference Sites

- **Allbirds** (allbirds.com) -- Headless Shopify storefront with smooth variant selection, DNA-quality color system, and accessible product pages with proper structured data
- **Gymshark** (gymshark.com) -- High-performance Shopify headless build with fast collection filtering, image-heavy product grids, and polished cart drawer
- **Aesop** (aesop.com) -- Luxury archetype reference on Shopify: restrained palette, typography-driven product pages, metafield-powered ingredient lists
- **Allpress Coffee** (allpresscoffee.com) -- Clean e-commerce with Shopify backend, excellent product metafield usage for origin/tasting notes, well-structured collections

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Shopify Integration |
|-----------|-------------------|
| `bg-bg` | Product page backgrounds, checkout areas |
| `bg-surface` | Product cards, variant selector chips (inactive), cart drawer |
| `text-text` | Product titles, prices, headings |
| `text-muted` | Descriptions, secondary info, compare-at prices, metafield content |
| `border-border` | Card outlines, variant chips, metafield accordion borders |
| `bg-primary` / `text-bg` | Add-to-cart CTA, selected variant chip, checkout button |
| `bg-accent` | Sale badges, out-of-stock indicators, promotional tags |
| `--motion-duration` | Variant selection transitions, cart drawer open/close |
| `--motion-easing` | Image gallery transitions, hover states on product cards |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Luxury/Fashion | Full-bleed product imagery, minimal chrome, serif product titles, generous whitespace between elements |
| Playful/Startup | Vibrant variant chips, bouncy add-to-cart feedback, colorful sale badges, playful empty-cart illustration |
| Swiss/International | Grid-strict collection layouts, monospace prices, no rounded corners on cards, systematic spacing |
| Neo-Corporate | Polished card shadows, subtle gradient on checkout CTA, professional product specs table |
| Brutalist | Raw borders on product cards, oversized price typography, stark black/white variant chips |
| Japanese Minimal | Extra padding around product images, quiet hover states, whisper-weight borders, muted badges |
| Editorial | Magazine-style product features with editorial copy alongside, large hero product shots |
| Warm Artisan | Textured card backgrounds, hand-drawn-style icons, warm color palette for CTAs |

### Pipeline Stage

- **Input from:** Discovery phase identifies Shopify store domain, product count, collection structure, metafield types
- **Output to:** Section builders receive typed Shopify client, product/collection queries, cart context provider, and DNA-styled component patterns

### Related Skills

- `ecommerce-ui` -- Generic e-commerce UI patterns (product cards, grids, cart drawer, checkout progress); Shopify skill provides the data layer, ecommerce-ui provides the presentation layer
- `seo-meta` -- Product structured data (JSON-LD), Open Graph tags for product sharing, collection page meta
- `accessibility` -- ARIA patterns for variant selectors, cart live regions, focus management in modals
- `cinematic-motion` -- Cart drawer slide animation, add-to-cart micro-interactions, image gallery transitions
- `responsive-design` -- Container query product grids, mobile cart sheet vs. desktop drawer
- `performance` -- ISR strategy for product/collection pages, image optimization, prefetching

## Layer 4: Anti-Patterns

### Anti-Pattern: Admin API Token Exposed Client-Side

**What goes wrong:** Using `NEXT_PUBLIC_SHOPIFY_ADMIN_TOKEN` or including the Admin API token in client-side code. This grants full read/write access to the store -- orders, customer PII, inventory, discounts. Attackers can steal customer data, manipulate prices, or delete products.
**Instead:** Admin API tokens must only be used in server-side code (API routes, server actions, server components that never serialize the token). Use the Storefront API token (public, read-only + cart mutations) for all client-side operations. **Penalty: -15**

### Anti-Pattern: Fetching All Products Without Pagination

**What goes wrong:** Querying `products(first: 250)` to get the entire catalog in one request. Shopify caps at 250 per query, response payloads become massive, and pages take seconds to build. For stores with 1000+ products, data is silently truncated.
**Instead:** Use cursor-based pagination with `first: 24` and `after: endCursor`. Implement "Load More" or infinite scroll. For SSG, paginate during `generateStaticParams`. Always check `pageInfo.hasNextPage`. **Penalty: -5**

### Anti-Pattern: Missing Inventory/Variant State Handling

**What goes wrong:** Showing "Add to Cart" for out-of-stock variants, or not indicating which size/color combinations are unavailable. Users add items that cannot be fulfilled, leading to frustration and cart errors.
**Instead:** Check `variant.availableForSale` for each variant. Disable or visually strike through unavailable options. Show "Out of Stock" instead of "Add to Cart" when the selected variant is unavailable. Cross-reference options: if Size M + Color Red is unavailable, indicate it. **Penalty: -3**

### Anti-Pattern: No Product Structured Data

**What goes wrong:** Product pages lack JSON-LD `Product` schema. Google cannot display rich results (price, availability, rating stars). Products are invisible in Shopping tab and miss significant organic traffic.
**Instead:** Include `<script type="application/ld+json">` with Product schema on every product page. Include name, description, image, offers (price, currency, availability), and brand. Use `AggregateOffer` for products with price ranges. **Penalty: -3**

### Anti-Pattern: Cart State Lost on Page Refresh

**What goes wrong:** Cart stored only in React state or context with no persistence layer. Any page refresh, navigation, or tab close loses the entire cart. Users must re-add items.
**Instead:** Persist `cart.id` in `localStorage` (or a cookie for SSR access). On mount, re-fetch the cart from Shopify using the stored ID. If the cart is expired or invalid, clear storage and start fresh. Shopify carts persist server-side for ~10 days. **Penalty: -3**

### Anti-Pattern: Images Without next/image Optimization

**What goes wrong:** Using raw `<img>` tags with Shopify CDN URLs. No responsive srcset, no lazy loading, no format negotiation. Large unoptimized images tank Core Web Vitals (LCP).
**Instead:** Use `next/image` with Shopify CDN URLs. Shopify CDN supports `_WIDTHx` URL transforms for responsive sizes. Configure `images.remotePatterns` in `next.config.js` for `cdn.shopify.com`. Set proper `sizes` attribute for each usage context. **Penalty: -2**

### Anti-Pattern: Hardcoded Currency Symbol

**What goes wrong:** Displaying prices as `$${price}` instead of using the currency code from the API. Breaks for non-USD stores, shows wrong symbol for international customers, and fails for currencies with non-trivial formatting (JPY has no decimals, EUR uses comma).
**Instead:** Always use `Intl.NumberFormat` with the `currencyCode` from the Shopify API response. Never hardcode `$` or any currency symbol. Format: `new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(amount)`. **Penalty: -2**

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Products per page query | 1 | 50 | items | HARD -- Shopify pagination limit per request, use cursor for more |
| ISR revalidation for product pages | 60 | 3600 | seconds | SOFT -- below 60s is wasteful, above 3600s risks stale prices |
| Product image sizes attribute | - | - | - | HARD -- every `next/image` must have a `sizes` prop |
| Storefront API version | 2024-04 | 2025-01 | version | SOFT -- use latest stable, avoid deprecated versions |
| Cart persistence | - | - | - | HARD -- cart ID must be persisted in localStorage or cookie |
| Currency formatting | - | - | - | HARD -- must use Intl.NumberFormat with API-provided currencyCode |
| Structured data per product page | 1 | 1 | JSON-LD block | HARD -- every product page must have Product schema |


---

## v3.3 Addendum: Shopify Storefront API 2025-01 + Hydrogen 2025 (CRITICAL)

### API version migration

**Storefront API 2024-10 DEPRECATED Jan 2025.** New projects MUST target `2025-01` or later.

```ts
// BEFORE:
const client = createStorefrontClient({ apiVersion: '2024-10' });

// AFTER:
const client = createStorefrontClient({ apiVersion: '2025-01' });
```

Shopify maintains 4 concurrent API versions (release + 3 prior quarters).

### Hydrogen 2025

- Hydrogen 2025.1 — Remix-based, Vite 6+ option available
- **Customer Account API v2025-01** replaces Multipass for customer auth
- **B2B Storefront** — separate B2B scope for quote/net-terms workflows

### Shopify Functions (Rust/JS)

- Cart transform — runtime cart manipulation (bundles, tiered pricing)
- Selling Plans — subscription pricing
- Bundles API — composite products
- Deploy via `shopify app deploy`

### Checkout Extensibility (CRITICAL for Plus)

**checkout.liquid DEPRECATED — full removal Aug 2025 for Plus merchants.** All custom checkout logic via Checkout UI Extensions (React sandbox). Plus merchants must migrate before Aug 2025.

### DNA-themed cart drawer (Hydrogen)

```tsx
<CartProvider>
  <CartDrawer className="bg-[var(--color-bg)] text-[var(--color-text)]">
    <CartLineItem className="border-b border-[var(--color-border)]" />
  </CartDrawer>
</CartProvider>
```

### Removed / deprecated (2025)

- checkout.liquid → Checkout Extensibility
- Multipass → Customer Account API
- Cart attributes via URL → Cart API attributes
- Storefront API 2024-10 and earlier
