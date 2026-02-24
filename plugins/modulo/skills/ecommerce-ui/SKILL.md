---
name: ecommerce-ui
description: "E-commerce UI patterns: product cards, product gallery, shopping cart drawer, checkout flow, filters/facets, wishlist, order tracking, quantity selector, size picker, review stars. Works with Next.js and Astro."
---

Use this skill when the user mentions e-commerce, product page, shopping cart, checkout, product card, wishlist, order tracking, product gallery, or store. Triggers on: ecommerce, e-commerce, product, cart, checkout, shop, store, wishlist, order.

You are an expert at building polished e-commerce UIs with shadcn/ui.

## Product Card

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star } from 'lucide-react'

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <Badge className="absolute top-2 left-2" variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}>
            {product.badge}
          </Badge>
        )}
        <Button
          variant="ghost" size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <h3 className="font-medium mt-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn('h-3 w-3', i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted')} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
          <Button size="sm"><ShoppingCart className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Product Image Gallery

```tsx
'use client'

import { useState } from 'react'

function ProductGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              'shrink-0 rounded-md border-2 overflow-hidden w-16 h-16 md:w-20 md:h-20',
              i === selected ? 'border-primary' : 'border-transparent'
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {/* Main image */}
      <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-muted">
        <img src={images[selected]} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
```

## Cart Drawer

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { items, total, updateQuantity, removeItem } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon={ShoppingCart} title="Cart is empty" description="Add items to get started." />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <QuantitySelector value={item.quantity} onChange={q => updateQuantity(item.id, q)} />
                      <span className="ml-auto font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            <Separator />
            <SheetFooter className="pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span><span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg">Checkout</Button>
              <p className="text-xs text-center text-muted-foreground">Shipping calculated at checkout</p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

## Quantity Selector

```tsx
function QuantitySelector({ value, onChange, min = 1, max = 99 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div className="flex items-center border rounded-md">
      <button
        className="px-2 py-1 text-sm hover:bg-accent disabled:opacity-50"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{value}</span>
      <button
        className="px-2 py-1 text-sm hover:bg-accent disabled:opacity-50"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}
```

## Size Picker

```tsx
function SizePicker({ sizes, selected, onSelect }: {
  sizes: { label: string; available: boolean }[]; selected: string; onSelect: (s: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size.label}
          onClick={() => size.available && onSelect(size.label)}
          disabled={!size.available}
          className={cn(
            'h-10 min-w-[2.5rem] px-3 rounded-md border text-sm font-medium transition-colors',
            selected === size.label ? 'border-primary bg-primary text-primary-foreground' :
            size.available ? 'hover:border-foreground' : 'opacity-30 cursor-not-allowed line-through'
          )}
        >
          {size.label}
        </button>
      ))}
    </div>
  )
}
```

## Astro Product Page

```astro
---
// src/pages/products/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const products = await getCollection('products');
  return products.map(p => ({ params: { slug: p.slug }, props: { product: p } }));
}

const { product } = Astro.props;
---

<BaseLayout title={product.data.name} description={product.data.description}>
  <div class="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
    <ProductGallery client:load images={product.data.images} />
    <div>
      <h1 class="text-3xl font-bold">{product.data.name}</h1>
      <p class="text-2xl font-bold mt-2">${product.data.price}</p>
      <SizePicker client:load sizes={product.data.sizes} />
      <AddToCartButton client:load productId={product.slug} />
    </div>
  </div>
</BaseLayout>
```

## Best Practices

1. Product cards: hover to reveal quick actions (wishlist, add to cart)
2. Gallery: thumbnail strip on left (desktop) / bottom (mobile), zoom on hover
3. Cart drawer: Sheet from right, show item count in trigger badge
4. Quantity selector: min 1, disable minus at min, disable plus at max
5. Size picker: crossed-out unavailable sizes, selected = primary color fill
6. Star ratings: filled yellow for rated, muted for unrated, show count
7. Price: bold current price, line-through original price for sales
8. Mobile: product grid 2 columns, cart as full Sheet
9. For Astro: hydrate interactive parts (gallery, cart, size picker) as React islands
10. Always show "Shipping calculated at checkout" to set expectations
