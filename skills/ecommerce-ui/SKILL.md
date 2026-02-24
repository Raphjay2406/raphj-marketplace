---
name: "ecommerce-ui"
description: "E-commerce UI patterns: product cards, product grids, cart UI, checkout flows, filters, wishlist -- with DNA-driven styling, container queries, and accessible interactions."
tier: "domain"
triggers: "ecommerce, e-commerce, product, cart, checkout, shop, store, wishlist, order, pricing, catalog"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Project includes product catalog, shopping cart, or checkout flow
- Any site selling physical or digital goods that needs award-caliber product presentation
- Portfolio or agency sites with a "shop" section (merch, prints, digital downloads)
- SaaS pricing pages that need product-like card presentation

### When NOT to Use

- Pure dashboard analytics with no commerce -- use `dashboard-patterns` instead
- Blog or content-only sites -- use `blog-patterns` instead
- Portfolio project showcases -- use `portfolio-patterns` instead

### Decision Tree

- Product grid layout? Use container query cards (resize to parent, not viewport)
- Luxury/fashion archetype? Minimal grid, large imagery, restrained UI chrome
- Data-dense products (specs, variants)? Use tabbed product detail with comparison tables
- Quick-add pattern? Hover overlay on desktop, long-press or dedicated button on mobile
- Multi-step checkout? Progressive disclosure with step indicator and per-step validation

### Pipeline Connection

- **Referenced by:** section-builder during product page, shop, and checkout section builds
- **Consumed at:** `/modulo:execute` wave 2+ for commerce sections
- **Related commands:** `/modulo:plan-dev` scopes product page sections

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Container Query Product Card

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

export function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const formattedOriginal = product.originalPrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.originalPrice)
    : null;

  return (
    <article
      className="@container group rounded-lg border border-border bg-surface overflow-hidden"
      aria-label={`${product.name} - ${formattedPrice}`}
    >
      <div className="relative aspect-square overflow-hidden bg-bg">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.originalPrice && (
          <span className="absolute top-2 start-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-bg">
            Sale
          </span>
        )}
        <button
          className="absolute top-2 end-2 grid size-9 place-items-center rounded-full bg-bg/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 motion-safe:transition-opacity focus:opacity-100"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <HeartIcon className="size-4 text-text" />
        </button>
      </div>

      <div className="p-3 @sm:p-4">
        <p className="text-xs text-muted">{product.category}</p>
        <h3 className="mt-1 text-sm font-medium text-text line-clamp-1 @sm:text-base">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-0.5" role="img" aria-label={`${product.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              className={`size-3 ${i < product.rating ? "fill-accent text-accent" : "text-muted"}`}
              aria-hidden="true"
            />
          ))}
          <span className="ms-1 text-xs text-muted">({product.reviewCount})</span>
        </div>

        <div className="mt-3 flex items-center justify-between @sm:mt-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text">{formattedPrice}</span>
            {formattedOriginal && (
              <span className="text-sm text-muted line-through">{formattedOriginal}</span>
            )}
          </div>
          <button
            className="grid size-9 place-items-center rounded-full bg-primary text-bg motion-safe:transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCartIcon className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
```

#### Pattern: Responsive Product Grid

```tsx
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section aria-label="Product catalog">
      <div className="grid grid-cols-2 gap-4 @md:grid-cols-3 @lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

#### Pattern: Accessible Quantity Stepper

```tsx
interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
}: QuantityStepperProps) {
  return (
    <div
      className="inline-flex items-center rounded-md border border-border"
      role="group"
      aria-label={label}
    >
      <button
        className="grid size-9 place-items-center text-text hover:bg-surface disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary rounded-s-md"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-3.5" />
      </button>
      <output
        className="min-w-[2.5rem] px-2 text-center text-sm font-medium text-text tabular-nums"
        aria-live="polite"
      >
        {value}
      </output>
      <button
        className="grid size-9 place-items-center text-text hover:bg-surface disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary rounded-e-md"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
```

#### Pattern: Checkout Progress Indicator

```tsx
interface CheckoutProgressProps {
  steps: string[];
  currentStep: number;
}

export function CheckoutProgress({ steps, currentStep }: CheckoutProgressProps) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-2">
        {steps.map((step, i) => {
          const status = i < currentStep ? "complete" : i === currentStep ? "current" : "upcoming";
          return (
            <li key={step} className="flex items-center gap-2">
              <span
                className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                  status === "complete"
                    ? "bg-primary text-bg"
                    : status === "current"
                      ? "bg-primary text-bg ring-4 ring-primary/20"
                      : "bg-surface text-muted"
                }`}
                aria-current={status === "current" ? "step" : undefined}
              >
                {status === "complete" ? (
                  <CheckIcon className="size-4" aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </span>
              <span className={`text-sm hidden @sm:inline ${status === "upcoming" ? "text-muted" : "text-text"}`}>
                {step}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-8 @sm:w-12 ${status === "complete" ? "bg-primary" : "bg-border"}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

#### Pattern: Cart Drawer with Live Region

```tsx
export function CartDrawer({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Shopping cart, ${items.length} items`}
      className={`fixed inset-y-0 end-0 z-50 w-full max-w-md bg-bg border-s border-border shadow-xl motion-safe:transition-transform ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-text">
            Cart <span className="text-muted">({items.length})</span>
          </h2>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full hover:bg-surface focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Close cart"
          >
            <XIcon className="size-5 text-text" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
          {items.length === 0 ? (
            <p className="text-center text-muted py-12">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-20 rounded-md object-cover bg-surface"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{item.name}</p>
                  <p className="text-xs text-muted">{item.variant}</p>
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.id, q)}
                    label={`Quantity for ${item.name}`}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-bold text-text">{formattedTotal}</span>
            </div>
            <button className="w-full rounded-lg bg-primary py-3 text-center font-semibold text-bg hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Checkout
            </button>
            <p className="text-xs text-center text-muted">Shipping calculated at checkout</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Reference Sites

- **Apple Store** (apple.com/shop) -- Minimal product cards with generous whitespace, container-aware grid that reflows beautifully, accessible quick-look modals
- **Aesop** (aesop.com) -- Archetype reference for Luxury e-commerce: restrained palette, typography-first product pages, elegant hover reveals
- **Rapha** (rapha.cc) -- Athletic e-commerce with bold imagery, progressive disclosure of product details, excellent mobile cart experience

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in E-commerce |
|-----------|-------------------|
| `bg-bg` | Page and card backgrounds |
| `bg-surface` | Elevated product cards, cart drawer background |
| `text-text` | Product names, prices |
| `text-muted` | Category labels, review counts, secondary info |
| `border-border` | Card outlines, dividers, input borders |
| `bg-primary` / `text-bg` | Add-to-cart buttons, active states, checkout CTA |
| `bg-accent` / `text-accent` | Sale badges, star ratings, promotional highlights |
| `--motion-duration` | Hover transitions, cart open/close, add-to-cart feedback |
| `--motion-easing` | Card hover scale, drawer slide, progress animations |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Luxury/Fashion | Minimal grid (1-2 cols), oversized imagery, restrained UI chrome, serif product names |
| Playful/Startup | Dynamic card hover effects, vibrant sale badges, bouncy add-to-cart animation |
| Swiss/International | Clean catalog grid, strict alignment, monospace prices, no decorative elements |
| Neo-Corporate | Polished card shadows, subtle gradients on CTAs, professional metric displays |
| Brutalist | Raw borders, no rounded corners, bold type for prices, stark contrast |
| Japanese Minimal | Generous padding, quiet hover states, muted color palette, minimal badges |
| Data-Dense | Compact cards with specs visible, comparison-table layout, tabular pricing |
| Editorial | Magazine-style product features, large hero products, editorial copy alongside |

### Related Skills

- `tailwind-system` -- DNA token classes, `@container` setup, dark mode variants
- `accessibility` -- Focus indicators, ARIA patterns, keyboard navigation for steppers and galleries
- `cinematic-motion` -- Cart drawer slide animation, add-to-cart micro-interactions, hover effects
- `responsive-design` -- Container query breakpoints, mobile-first grid reflow
- `form-builder` -- Checkout form validation, address input, payment fields
- `seo-meta` -- Product structured data (JSON-LD Product schema), Open Graph for product pages

## Layer 4: Anti-Patterns

### Anti-Pattern: Fixed-Width Product Grids

**What goes wrong:** Using viewport media queries for product card sizing. Cards look wrong when placed in sidebars, modals, or different page layouts because they respond to the window, not their container.
**Instead:** Use `@container` queries on the grid wrapper. Cards adapt to their actual available space: `@container (min-width: 400px) { ... }`. Every card layout works in any container width.

### Anti-Pattern: Inaccessible Quantity Steppers

**What goes wrong:** Stepper buttons have no accessible labels, the current value has no live region, and keyboard users cannot operate the control. Screen readers announce nothing meaningful.
**Instead:** Use `role="group"` with `aria-label` on the wrapper, `aria-label="Decrease quantity"` / `"Increase quantity"` on buttons, and `<output aria-live="polite">` for the value display. Ensure buttons are focusable and operable with Enter/Space.

### Anti-Pattern: Checkout Without Progress Indication

**What goes wrong:** Multi-step checkout with no visual progress. Users cannot tell how many steps remain, cannot navigate back, and abandon the flow due to uncertainty.
**Instead:** Persistent step indicator with `aria-current="step"` on the active step, completed steps visually distinct, and clear step count (e.g., "Step 2 of 4"). Each step validates before advancing.

### Anti-Pattern: Cart Updates Without Feedback

**What goes wrong:** Adding items to cart or changing quantity produces no visible or screen-reader feedback. Users are unsure if their action worked.
**Instead:** Use `aria-live="polite"` on the cart count badge and cart contents area. Provide visual feedback (brief animation on cart icon, toast notification) gated behind `motion-safe:` to respect reduced-motion preferences.
