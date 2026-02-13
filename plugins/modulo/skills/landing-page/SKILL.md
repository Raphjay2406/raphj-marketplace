---
name: landing-page
description: "Landing page patterns including hero sections, CTAs, feature grids, testimonials, pricing tables, and marketing layouts."
---

Use this skill when the user mentions landing page, hero section, CTA, pricing page, features section, testimonials, marketing page, or homepage design.

You are an expert at building high-converting, visually stunning landing pages.

## Hero Section

```tsx
<section className="relative overflow-hidden py-20 md:py-32">
  <div className="container mx-auto px-4 text-center">
    <Badge variant="secondary" className="mb-4">New Release</Badge>
    <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
      Build beautiful products{" "}
      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">faster than ever</span>
    </h1>
    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
      The modern development platform that helps teams ship polished products in record time.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button size="lg">Get Started Free</Button>
      <Button size="lg" variant="outline">
        <Play className="mr-2 h-4 w-4" /> Watch Demo
      </Button>
    </div>
    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-600" />Free tier</span>
      <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-600" />No credit card</span>
      <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-600" />Cancel anytime</span>
    </div>
  </div>
</section>
```

## Feature Grid

```tsx
const features = [
  { icon: Zap, title: "Lightning Fast", description: "Built for speed with optimized performance." },
  { icon: Shield, title: "Secure by Default", description: "Enterprise-grade security out of the box." },
  { icon: Puzzle, title: "Extensible", description: "Customize everything with our plugin system." },
  { icon: Globe, title: "Global CDN", description: "Deploy to 200+ edge locations worldwide." },
  { icon: BarChart3, title: "Analytics", description: "Real-time insights into your application." },
  { icon: Headphones, title: "24/7 Support", description: "Expert help whenever you need it." },
]

<section className="py-20 bg-muted/50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
      <p className="mt-4 text-lg text-muted-foreground">All the tools and features to build at scale.</p>
    </div>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="border-0 shadow-none bg-transparent">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

## Pricing Table

```tsx
const plans = [
  { name: "Starter", price: "$0", period: "/month", description: "For individuals", features: ["5 projects", "1GB storage", "Community support"], cta: "Get Started", popular: false },
  { name: "Pro", price: "$29", period: "/month", description: "For teams", features: ["Unlimited projects", "100GB storage", "Priority support", "Custom domains", "Analytics"], cta: "Start Free Trial", popular: true },
  { name: "Enterprise", price: "Custom", period: "", description: "For organizations", features: ["Everything in Pro", "SSO/SAML", "Dedicated support", "SLA guarantee", "Custom integrations"], cta: "Contact Sales", popular: false },
]

<section className="py-20">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
      <p className="mt-4 text-lg text-muted-foreground">No hidden fees. Cancel anytime.</p>
    </div>
    <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.name} className={cn("relative", plan.popular && "border-primary shadow-lg scale-105")}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Most Popular</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />{feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
</section>
```

## Testimonials

```tsx
<section className="py-20 bg-muted/50">
  <div className="container mx-auto px-4">
    <h2 className="text-center text-3xl font-bold tracking-tight mb-12">Loved by developers</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.name}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{`"${t.quote}"`}</p>
            <div className="flex items-center gap-3">
              <Avatar><AvatarImage src={t.avatar} /><AvatarFallback>{t.initials}</AvatarFallback></Avatar>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} at {t.company}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

## CTA Section

```tsx
<section className="py-20">
  <div className="container mx-auto px-4">
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="flex flex-col items-center text-center py-12 px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get started?</h2>
        <p className="mt-4 max-w-xl text-primary-foreground/80">Join thousands of developers building better products.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="secondary">Start Building</Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">Talk to Sales</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</section>
```

## Footer

```tsx
<footer className="border-t py-12">
  <div className="container mx-auto px-4">
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <h3 className="font-semibold mb-4">Product</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
          <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
          <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
        </ul>
      </div>
      {/* Repeat for Company, Resources, Legal */}
    </div>
    <Separator className="my-8" />
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>&copy; 2026 Company. All rights reserved.</p>
      <div className="flex gap-4">{/* Social icons */}</div>
    </div>
  </div>
</footer>
```

## Best Practices

1. Hero: One clear headline, one CTA, trust signals below
2. Features: Icons + short titles + descriptions in a 3-column grid
3. Pricing: Highlight popular plan with scale/border, list features with check marks
4. Testimonials: Real names, roles, company, star ratings
5. CTA: Contrasting background, two buttons (primary + secondary)
6. Keep sections alternating between white and `bg-muted/50` backgrounds
7. Use `container mx-auto px-4` consistently for content width
8. All sections should be `py-20` for generous vertical spacing
