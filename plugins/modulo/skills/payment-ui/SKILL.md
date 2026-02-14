---
name: payment-ui
description: "Payment UI patterns: Stripe Elements, payment forms, pricing calculators, subscription management, invoice display, billing history, payment method cards. Works with Next.js and Astro."
---

Use this skill when the user mentions payment, Stripe, checkout form, billing, subscription, invoice, pricing calculator, or payment method. Triggers on: payment, Stripe, billing, subscription, invoice, checkout, pricing, credit card.

You are an expert at building payment and billing UIs with shadcn/ui and Stripe.

## Stripe Elements Payment Form

```tsx
'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    })

    if (error) setError(error.message ?? 'Payment failed')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={!stripe || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Pay Now
      </Button>
    </form>
  )
}

export function PaymentPage({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutForm />
        </CardContent>
      </Card>
    </Elements>
  )
}
```

## Order Summary

```tsx
function OrderSummary({ items, subtotal, tax, shipping, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Saved Payment Methods

```tsx
function PaymentMethods({ methods, onDelete }: { methods: PaymentMethod[]; onDelete: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {methods.map(method => (
        <div key={method.id} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="h-8 w-12 rounded bg-muted flex items-center justify-center text-xs font-bold">
            {method.brand.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">•••• •••• •••• {method.last4}</p>
            <p className="text-xs text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
          </div>
          {method.isDefault && <Badge variant="secondary">Default</Badge>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Set as default</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(method.id)}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
```

## Subscription Management

```tsx
function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{subscription.planName}</CardTitle>
            <CardDescription>
              ${subscription.amount}/{subscription.interval}
            </CardDescription>
          </div>
          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current period</span>
            <span>{subscription.currentPeriodStart} - {subscription.currentPeriodEnd}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next billing</span>
            <span>{subscription.nextBilling}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Change Plan</Button>
          <Button variant="outline" size="sm" className="text-destructive">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Billing History Table

```tsx
function BillingHistory({ invoices }: { invoices: Invoice[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Invoice</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(inv => (
          <TableRow key={inv.id}>
            <TableCell>{inv.date}</TableCell>
            <TableCell>{inv.description}</TableCell>
            <TableCell>${inv.amount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'pending' ? 'secondary' : 'destructive'}>
                {inv.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <a href={inv.pdfUrl} download><Download className="h-4 w-4" /></a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Best Practices

1. Use Stripe Elements (`PaymentElement`) — never build custom card inputs
2. Always create PaymentIntent server-side, pass clientSecret to client
3. Order summary: show line items, subtotal, tax, shipping, total
4. Saved payment methods: show brand, last4, expiry, default badge
5. Subscription cards: show plan, price/interval, status, next billing date
6. Billing history: sortable table with status badges and PDF download
7. Loading states: disable pay button + show spinner during processing
8. Error messages: show inline below payment form, red text
9. Success: redirect to `/checkout/success` with order confirmation
10. For Astro: mount Stripe Elements as React island with `client:load`
