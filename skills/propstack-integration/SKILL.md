---
name: "propstack-integration"
description: "Propstack real estate CRM integration. Property listings, lead capture, expose PDF generation, search/filter with map, and DNA-styled property UIs."
tier: "domain"
triggers: "propstack, real estate, property listings, immobilien, makler"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/propstack/**/*.ts"
    - "**/*.ts"
---

## Layer 1: Decision Guidance

### When to Use

- Project is a real estate agency or brokerage website that uses Propstack as their CRM
- Property listings need to be displayed from Propstack's property database
- Lead capture forms should feed directly into Propstack's lead management pipeline
- Expose/property PDF generation is needed for property marketing materials
- Interactive map with property markers is required for property search

### When NOT to Use

- Client uses a different real estate CRM (FlowFact, onOffice, OpenImmo) -- build a custom integration layer following the same patterns
- Pure portfolio site showcasing past projects -- use `portfolio-patterns` instead
- Property management dashboard (tenant portals, maintenance) -- use `dashboard-patterns` with a custom API layer
- Static property pages with no CRM backend -- hardcode data or use a headless CMS

### Decision Tree

- **Listings display only** -- Simplest integration. ISR pages pulling property data from Propstack API. Webhook revalidation when properties change. Good for small agencies with <100 properties.
- **Listings + lead capture** -- Most common. Property display plus contact forms that create leads in Propstack with the property reference ID attached. Requires server-side API proxy for lead creation.
- **Full CRM dashboard** -- Advanced. Customer portal with saved searches, favorites, viewing appointments, and document access. Requires Propstack authentication tokens and user-scoped API access. Rare for public-facing sites.
- **Hybrid with OpenImmo** -- Some agencies export from Propstack to OpenImmo XML format. If the client provides XML feeds instead of API access, parse OpenImmo XML server-side and map to the same component interfaces.

### Authentication

| Credential | Scope | Exposure | Use Case |
|-----------|-------|----------|----------|
| API Key (Bearer token) | Full read/write per account | **Server-only** (NEVER client-side) | Property queries, lead creation, document access |
| Webhook secret | Webhook signature verification | Server-only | Verify incoming property update webhooks |

**Critical:** Propstack API keys grant full account access including customer data, internal notes, and commission details. They MUST be kept server-side. Use Next.js API routes, server actions, or Astro server endpoints as a proxy layer.

### Pipeline Connection

- **Auto-detected:** When real estate, property listings, or "Immobilien" is mentioned during `/gen:start-project`, ask: "Which real estate CRM? Propstack, FlowFact, onOffice, or custom?"
- **Referenced by:** researcher agent during discovery (property count, category types, geographic coverage, image quality audit)
- **Referenced by:** builder during property listing, detail page, and search section builds
- **Consumed at:** `/gen:execute` wave 0 (API client setup), wave 1 (search/filter infrastructure), wave 2+ (listing pages, detail pages, lead forms)
- **Related commands:** `/gen:plan` scopes Propstack data requirements per section

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Property Listings (ISR + Grid/Map Dual View)

```tsx
// lib/propstack.ts -- Server-side Propstack API client
const PROPSTACK_API_URL = process.env.PROPSTACK_API_URL!; // e.g., https://api.propstack.de/v1
const PROPSTACK_API_KEY = process.env.PROPSTACK_API_KEY!;

interface PropstackResponse<T> {
  data: T;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function propstackFetch<T>(
  endpoint: string,
  params?: Record<string, string>,
  options?: { revalidate?: number; tags?: string[] }
): Promise<PropstackResponse<T>> {
  const url = new URL(endpoint, PROPSTACK_API_URL);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${PROPSTACK_API_KEY}`,
      Accept: "application/json",
    },
    next: {
      revalidate: options?.revalidate ?? 300,
      tags: options?.tags ?? ["propstack"],
    },
  });

  if (!res.ok) {
    throw new Error(`Propstack API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function propstackMutate<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>
): Promise<T> {
  const url = new URL(endpoint, PROPSTACK_API_URL);

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${PROPSTACK_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Propstack mutation error: ${res.status}`);
  }

  return res.json();
}
```

```tsx
// types/property.ts -- Typed property interface matching Propstack's data model
export interface Property {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  type: "apartment" | "house" | "commercial" | "land" | "other";
  marketing_type: "sale" | "rent";
  status: "active" | "reserved" | "sold" | "rented" | "draft";
  address: {
    street: string;
    house_number: string;
    zip_code: string;
    city: string;
    district?: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  pricing: {
    purchase_price?: number;
    rent_cold?: number;
    rent_warm?: number;
    additional_costs?: number;
    currency: string;
    price_per_sqm?: number;
  };
  areas: {
    living_area?: number;
    plot_area?: number;
    usable_area?: number;
    balcony_area?: number;
  };
  rooms: {
    total: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  features: {
    floor?: number;
    total_floors?: number;
    year_built?: number;
    last_renovation?: number;
    heating_type?: string;
    energy_certificate?: {
      type: "demand" | "consumption";
      value: number;
      class: string;
      valid_until: string;
    };
    parking?: string[];
    equipment?: string[];
  };
  images: {
    id: string;
    url: string;
    title?: string;
    type: "photo" | "floor_plan" | "energy_certificate" | "map";
    order: number;
  }[];
  documents: {
    id: string;
    url: string;
    title: string;
    type: string;
  }[];
  agent: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    image_url?: string;
  };
  created_at: string;
  updated_at: string;
}
```

```tsx
// app/properties/page.tsx -- Property listings with grid/map toggle
import { propstackFetch } from "@/lib/propstack";
import type { Property } from "@/types/property";
import { PropertyGrid } from "@/components/property-grid";
import { PropertyMap } from "@/components/property-map";
import { SearchFilters } from "@/components/search-filters";
import { ViewToggle } from "@/components/view-toggle";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;

  const apiParams: Record<string, string> = {
    page: params.page || "1",
    per_page: "24",
    status: "active",
  };

  // Map URL search params to Propstack API filters
  if (params.type) apiParams["filter[type]"] = params.type;
  if (params.marketing_type) apiParams["filter[marketing_type]"] = params.marketing_type;
  if (params.city) apiParams["filter[city]"] = params.city;
  if (params.price_min) apiParams["filter[price_min]"] = params.price_min;
  if (params.price_max) apiParams["filter[price_max]"] = params.price_max;
  if (params.rooms_min) apiParams["filter[rooms_min]"] = params.rooms_min;
  if (params.area_min) apiParams["filter[living_area_min]"] = params.area_min;

  const { data: properties, meta } = await propstackFetch<Property[]>(
    "/properties",
    apiParams,
    { tags: ["properties"], revalidate: 300 }
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-text">
          {meta.total} {params.marketing_type === "rent" ? "Mietobjekte" : "Immobilien"}
        </h1>
        <ViewToggle />
      </div>

      <SearchFilters currentParams={params} />

      {/* Grid and map views -- toggled client-side */}
      <PropertyGrid properties={properties} />
      <PropertyMap properties={properties} />

      {/* Pagination */}
      {meta.last_page > 1 && (
        <Pagination currentPage={meta.current_page} totalPages={meta.last_page} />
      )}
    </section>
  );
}
```

#### Pattern 2: Detail Pages (Gallery, Floor Plans, Energy Certificate, Map)

```tsx
// app/properties/[id]/page.tsx -- Property detail page
import { propstackFetch } from "@/lib/propstack";
import type { Property } from "@/types/property";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageGallery } from "./image-gallery";
import { PropertyMap } from "./property-map";
import { ContactForm } from "./contact-form";
import { EnergyCertificate } from "./energy-certificate";
import { PropertyStructuredData } from "./property-structured-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { data: properties } = await propstackFetch<Property[]>(
    "/properties",
    { per_page: "500", status: "active" }
  );
  return properties.map((p) => ({ id: p.id }));
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: property } = await propstackFetch<Property>(
    `/properties/${id}`,
    undefined,
    { tags: [`property-${id}`], revalidate: 3600 }
  );

  if (!property) notFound();

  const photos = property.images.filter((i) => i.type === "photo").sort((a, b) => a.order - b.order);
  const floorPlans = property.images.filter((i) => i.type === "floor_plan");

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: property.pricing.currency || "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <>
      <PropertyStructuredData property={property} />

      {/* Full-width Image Gallery with Lightbox */}
      <ImageGallery images={photos} propertyTitle={property.title} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content -- 2 columns */}
          <div className="space-y-10 lg:col-span-2">
            {/* Header */}
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {property.marketing_type === "rent" ? "Zur Miete" : "Zum Kauf"}
                </span>
                <span className="text-sm text-muted">Ref: {property.reference_number}</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-text lg:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 text-lg text-muted">
                {property.address.street} {property.address.house_number}, {property.address.zip_code} {property.address.city}
              </p>
            </div>

            {/* Key Facts */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Fact label="Wohnflache" value={`${property.areas.living_area} m2`} />
              <Fact label="Zimmer" value={String(property.rooms.total)} />
              <Fact label="Baujahr" value={String(property.features.year_built || "k.A.")} />
              <Fact
                label={property.marketing_type === "rent" ? "Kaltmiete" : "Kaufpreis"}
                value={formatter.format(
                  property.pricing.purchase_price || property.pricing.rent_cold || 0
                )}
                highlight
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-text">Beschreibung</h2>
              <div className="prose prose-sm max-w-none text-muted">
                <p>{property.description}</p>
              </div>
            </div>

            {/* Floor Plans */}
            {floorPlans.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-xl font-bold text-text">Grundrisse</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {floorPlans.map((fp) => (
                    <div key={fp.id} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
                      <Image src={fp.url} alt={fp.title || "Grundriss"} fill className="object-contain p-4" sizes="(max-width: 640px) 100vw, 50vw" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Energy Certificate (legally required in EU) */}
            {property.features.energy_certificate && (
              <EnergyCertificate data={property.features.energy_certificate} />
            )}

            {/* Location Map */}
            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-text">Lage</h2>
              <PropertyMap
                latitude={property.address.latitude}
                longitude={property.address.longitude}
                address={`${property.address.street}, ${property.address.city}`}
              />
            </div>
          </div>

          {/* Sidebar -- Contact Form + Agent */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <p className="font-display text-3xl font-bold text-primary">
                  {formatter.format(property.pricing.purchase_price || property.pricing.rent_cold || 0)}
                </p>
                {property.pricing.rent_warm && (
                  <p className="mt-1 text-sm text-muted">
                    Warmmiete: {formatter.format(property.pricing.rent_warm)}
                  </p>
                )}
              </div>

              {/* Contact Form */}
              <ContactForm
                propertyId={property.id}
                propertyTitle={property.title}
                agentName={property.agent.name}
                agentEmail={property.agent.email}
                agentPhone={property.agent.phone}
                agentImage={property.agent.image_url}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold ${highlight ? "text-primary" : "text-text"}`}>
        {value}
      </p>
    </div>
  );
}
```

#### Pattern 3: Lead Capture (Contact Form -> Propstack Lead API)

```tsx
// app/properties/[id]/contact-form.tsx
"use client";

import { useActionState } from "react";
import { submitLead } from "./actions";
import Image from "next/image";

interface Props {
  propertyId: string;
  propertyTitle: string;
  agentName: string;
  agentEmail: string;
  agentPhone?: string;
  agentImage?: string;
}

export function ContactForm({ propertyId, propertyTitle, agentName, agentEmail, agentPhone, agentImage }: Props) {
  const [state, formAction, isPending] = useActionState(submitLead, { success: false, error: null });

  if (state.success) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="font-display text-lg font-bold text-text">Vielen Dank!</p>
        <p className="mt-2 text-sm text-muted">
          Ihre Anfrage wurde an {agentName} weitergeleitet. Sie erhalten in Kurze eine Ruckmeldung.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      {/* Agent Info */}
      <div className="mb-6 flex items-center gap-4">
        {agentImage && (
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image src={agentImage} alt={agentName} fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div>
          <p className="font-body font-semibold text-text">{agentName}</p>
          {agentPhone && <p className="text-sm text-muted">{agentPhone}</p>}
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="propertyId" value={propertyId} />
        <input type="hidden" name="propertyTitle" value={propertyTitle} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-text">Vorname</label>
            <input id="firstName" name="firstName" type="text" required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-text">Nachname</label>
            <input id="lastName" name="lastName" type="text" required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">E-Mail</label>
          <input id="email" name="email" type="email" required className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-text">Telefon</label>
          <input id="phone" name="phone" type="tel" className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-text">Nachricht</label>
          <textarea id="message" name="message" rows={4} defaultValue={`Ich interessiere mich fur das Objekt "${propertyTitle}" und bitte um weitere Informationen.`} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        {state.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Wird gesendet..." : "Anfrage senden"}
        </button>
      </form>
    </div>
  );
}
```

```tsx
// app/properties/[id]/actions.ts
"use server";

import { propstackMutate } from "@/lib/propstack";

interface LeadState {
  success: boolean;
  error: string | null;
}

export async function submitLead(
  prevState: LeadState,
  formData: FormData
): Promise<LeadState> {
  const propertyId = formData.get("propertyId") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!firstName || !lastName || !email) {
    return { success: false, error: "Bitte fullen Sie alle Pflichtfelder aus." };
  }

  try {
    await propstackMutate("/leads", "POST", {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || undefined,
      message,
      property_id: propertyId,
      source: "website",
    });

    return { success: true, error: null };
  } catch (err) {
    console.error("Lead creation failed:", err);
    return { success: false, error: "Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut." };
  }
}
```

#### Pattern 4: Search/Filter (Faceted, URL-Synced)

```tsx
// components/search-filters.tsx -- URL-synced faceted search
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface Props {
  currentParams: Record<string, string>;
}

export function SearchFilters({ currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  return (
    <div className="mb-8 space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Property Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Objekttyp</label>
          <select
            value={currentParams.type || ""}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          >
            <option value="">Alle Typen</option>
            <option value="apartment">Wohnung</option>
            <option value="house">Haus</option>
            <option value="commercial">Gewerbe</option>
            <option value="land">Grundstuck</option>
          </select>
        </div>

        {/* Marketing Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Art</label>
          <select
            value={currentParams.marketing_type || ""}
            onChange={(e) => updateFilter("marketing_type", e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          >
            <option value="">Kaufen & Mieten</option>
            <option value="sale">Kaufen</option>
            <option value="rent">Mieten</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Preis bis</label>
          <select
            value={currentParams.price_max || ""}
            onChange={(e) => updateFilter("price_max", e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          >
            <option value="">Keine Grenze</option>
            <option value="200000">200.000 EUR</option>
            <option value="500000">500.000 EUR</option>
            <option value="1000000">1.000.000 EUR</option>
            <option value="2000000">2.000.000 EUR</option>
          </select>
        </div>

        {/* Rooms */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Zimmer ab</label>
          <select
            value={currentParams.rooms_min || ""}
            onChange={(e) => updateFilter("rooms_min", e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          >
            <option value="">Beliebig</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      {/* Active filters indicator and clear button */}
      {Object.keys(currentParams).filter((k) => k !== "page").length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted">
            {Object.keys(currentParams).filter((k) => k !== "page").length} Filter aktiv
          </p>
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Alle Filter zurucksetzen
          </button>
        </div>
      )}

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Wird geladen...
        </div>
      )}
    </div>
  );
}
```

#### Pattern 5: Expose PDF (Server-Side Generation with DNA Styling)

```tsx
// app/api/properties/[id]/expose/route.tsx -- PDF expose generation
import { propstackFetch } from "@/lib/propstack";
import type { Property } from "@/types/property";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { ExposeDocument } from "./expose-document";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const { data: property } = await propstackFetch<Property>(
    `/properties/${id}`
  );

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <ExposeDocument property={property} />
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="expose-${property.reference_number}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

```tsx
// app/api/properties/[id]/expose/expose-document.tsx -- react-pdf document with DNA styling
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { Property } from "@/types/property";

// Map DNA tokens to PDF-safe values (loaded from DESIGN-DNA.md at build time or hardcoded)
const dna = {
  primary: "#1a1a2e",
  text: "#111827",
  muted: "#6b7280",
  bg: "#ffffff",
  surface: "#f9fafb",
  fontDisplay: "Helvetica-Bold",
  fontBody: "Helvetica",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: dna.fontBody, color: dna.text, backgroundColor: dna.bg },
  header: { marginBottom: 30, borderBottom: `2px solid ${dna.primary}`, paddingBottom: 20 },
  title: { fontSize: 24, fontFamily: dna.fontDisplay, color: dna.primary, marginBottom: 8 },
  subtitle: { fontSize: 12, color: dna.muted },
  heroImage: { width: "100%", height: 300, objectFit: "cover", borderRadius: 8, marginBottom: 20 },
  factsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  factBox: { width: "23%", padding: 12, backgroundColor: dna.surface, borderRadius: 6 },
  factLabel: { fontSize: 8, color: dna.muted, textTransform: "uppercase", letterSpacing: 1 },
  factValue: { fontSize: 14, fontFamily: dna.fontDisplay, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontFamily: dna.fontDisplay, marginBottom: 8, marginTop: 20 },
  bodyText: { fontSize: 10, lineHeight: 1.6, color: dna.text },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: dna.muted, textAlign: "center", borderTop: `1px solid ${dna.surface}`, paddingTop: 10 },
});

export function ExposeDocument({ property }: { property: Property }) {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: property.pricing.currency || "EUR",
    maximumFractionDigits: 0,
  });

  const mainImage = property.images.find((i) => i.type === "photo");
  const floorPlan = property.images.find((i) => i.type === "floor_plan");

  return (
    <Document title={`Expose - ${property.title}`} author="Powered by Genorah">
      {/* Page 1: Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.subtitle}>
            {property.address.street} {property.address.house_number}, {property.address.zip_code} {property.address.city}
          </Text>
          <Text style={styles.subtitle}>Ref: {property.reference_number}</Text>
        </View>

        {mainImage && <Image src={mainImage.url} style={styles.heroImage} />}

        <View style={styles.factsGrid}>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>Kaufpreis</Text>
            <Text style={styles.factValue}>
              {formatter.format(property.pricing.purchase_price || property.pricing.rent_cold || 0)}
            </Text>
          </View>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>Wohnflache</Text>
            <Text style={styles.factValue}>{property.areas.living_area || "k.A."} m2</Text>
          </View>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>Zimmer</Text>
            <Text style={styles.factValue}>{property.rooms.total}</Text>
          </View>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>Baujahr</Text>
            <Text style={styles.factValue}>{property.features.year_built || "k.A."}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Beschreibung</Text>
        <Text style={styles.bodyText}>{property.description}</Text>

        <View style={styles.footer}>
          <Text>Alle Angaben ohne Gewahr. Irrtumer und Zwischenverkauf vorbehalten.</Text>
        </View>
      </Page>

      {/* Page 2: Floor Plan + Energy Certificate */}
      {(floorPlan || property.features.energy_certificate) && (
        <Page size="A4" style={styles.page}>
          {floorPlan && (
            <>
              <Text style={styles.sectionTitle}>Grundriss</Text>
              <Image src={floorPlan.url} style={{ width: "100%", height: 400, objectFit: "contain" }} />
            </>
          )}

          {property.features.energy_certificate && (
            <View style={{ marginTop: 30 }}>
              <Text style={styles.sectionTitle}>Energieausweis</Text>
              <View style={styles.factsGrid}>
                <View style={styles.factBox}>
                  <Text style={styles.factLabel}>Typ</Text>
                  <Text style={styles.factValue}>
                    {property.features.energy_certificate.type === "demand" ? "Bedarfsausweis" : "Verbrauchsausweis"}
                  </Text>
                </View>
                <View style={styles.factBox}>
                  <Text style={styles.factLabel}>Kennwert</Text>
                  <Text style={styles.factValue}>{property.features.energy_certificate.value} kWh/(m2a)</Text>
                </View>
                <View style={styles.factBox}>
                  <Text style={styles.factLabel}>Klasse</Text>
                  <Text style={styles.factValue}>{property.features.energy_certificate.class}</Text>
                </View>
                <View style={styles.factBox}>
                  <Text style={styles.factLabel}>Gultig bis</Text>
                  <Text style={styles.factValue}>{property.features.energy_certificate.valid_until}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text>Alle Angaben ohne Gewahr. Irrtumer und Zwischenverkauf vorbehalten.</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
```

#### Pattern 6: Map Integration (Clustered Markers, Interactive Popups)

```tsx
// components/property-map.tsx -- Mapbox GL with clustered property markers
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Property } from "@/types/property";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Props {
  properties: Property[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
}

export function PropertyMapView({ properties, center, zoom = 10 }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert properties to GeoJSON
  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: properties
      .filter((p) => p.address.latitude && p.address.longitude)
      .map((p) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [p.address.longitude, p.address.latitude],
        },
        properties: {
          id: p.id,
          title: p.title,
          price: p.pricing.purchase_price || p.pricing.rent_cold || 0,
          type: p.type,
          rooms: p.rooms.total,
          area: p.areas.living_area,
          image: p.images[0]?.url || "",
          marketing_type: p.marketing_type,
        },
      })),
  };

  // Calculate default center from properties
  const defaultCenter: [number, number] = center || (() => {
    const coords = geojson.features.map(
      (f) => (f.geometry as GeoJSON.Point).coordinates
    );
    if (coords.length === 0) return [10.0, 51.0]; // Germany center
    const avgLng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const avgLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    return [avgLng, avgLat];
  })();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: defaultCenter,
      zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      const m = map.current!;

      // Add clustered source
      m.addSource("properties", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      m.addLayer({
        id: "clusters",
        type: "circle",
        source: "properties",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "var(--color-primary, #1a1a2e)",
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 50, 40],
          "circle-opacity": 0.85,
        },
      });

      // Cluster count labels
      m.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "properties",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 14,
        },
        paint: { "text-color": "#ffffff" },
      });

      // Individual markers
      m.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "properties",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "var(--color-primary, #1a1a2e)",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Click on cluster -> zoom in
      m.on("click", "clusters", (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = m.getSource("properties") as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !zoom) return;
          m.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
            zoom,
          });
        });
      });

      // Click on marker -> popup with property preview
      m.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties!;
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

        const formatter = new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        });

        new mapboxgl.Popup({ offset: 15, maxWidth: "280px" })
          .setLngLat(coords)
          .setHTML(`
            <div style="font-family: system-ui; cursor: pointer;" onclick="window.location.href='/properties/${props.id}'">
              ${props.image ? `<img src="${props.image}" style="width:100%;height:140px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />` : ""}
              <strong style="font-size:14px;display:block;margin-bottom:4px;">${props.title}</strong>
              <span style="font-size:16px;font-weight:bold;color:var(--color-primary, #1a1a2e);">
                ${formatter.format(props.price)}
              </span>
              <span style="font-size:12px;color:#6b7280;display:block;margin-top:4px;">
                ${props.rooms} Zimmer &middot; ${props.area} m&sup2;
              </span>
            </div>
          `)
          .addTo(m);
      });

      // Cursor styles
      m.on("mouseenter", "clusters", () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", "clusters", () => { m.getCanvas().style.cursor = ""; });
      m.on("mouseenter", "unclustered-point", () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", "unclustered-point", () => { m.getCanvas().style.cursor = ""; });

      setIsLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update source data when properties change
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    const source = map.current.getSource("properties") as mapboxgl.GeoJSONSource;
    if (source) source.setData(geojson);
  }, [properties, isLoaded]);

  return (
    <div
      ref={mapContainer}
      className="h-[500px] w-full overflow-hidden rounded-xl border border-border"
    />
  );
}
```

### Reference Sites

- **Engel & Volkers** (engelvoelkers.com) -- Premium real estate presentation with full-bleed property photography, clean typographic hierarchy, and sophisticated map integration. Strong Luxury archetype alignment.
- **Fantastic Frank** (fantasticfrank.com) -- Award-winning real estate site with editorial-quality property photography, minimal chrome, and storytelling-driven property descriptions. Exemplary image gallery UX.
- **The Agency** (theagencyre.com) -- Luxury real estate with map-driven property search, elegant detail pages, and seamless lead capture. Good reference for DNA-styled property cards.
- **Sotheby's International Realty** (sothebysrealty.com) -- Data-rich property detail pages with energy information, floor plans, and neighborhood context alongside premium visual design.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `bg`, `surface` | Property card backgrounds, filter panel, detail page sections |
| `text`, `muted` | Property titles, addresses, secondary details (reference number, status) |
| `primary` | Price display, CTA buttons (Contact Agent, Download Expose), map markers |
| `accent` | Status badges (new, reserved, sold), feature highlights |
| `border` | Card outlines, filter panel borders, fact box borders |
| `font-display` | Property titles, price display, section headings |
| `font-body` | Descriptions, filter labels, form fields, fact labels |
| `spacing-*` | Property grid gaps, card padding, detail page section margins |
| `motion-*` | Gallery lightbox transitions, map marker hover, filter panel open/close |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Luxury/Fashion | Full-bleed hero galleries, serif property titles, generous whitespace, gold/cream accent tones |
| Neo-Corporate | Structured fact grids, systematic filter layout, clean data presentation, minimal decorative elements |
| Warm Artisan | Textured backgrounds, warm photography tones, handwritten accent fonts for headings |
| Editorial | Magazine-style property spreads, large typography, story-driven descriptions alongside data |
| Swiss/International | Grid-perfect card layouts, Helvetica-style type, maximum information clarity |
| Japanese Minimal | Single property per viewport, generous breathing room, understated price display |

### Pipeline Stage

- **Input from:** Discovery phase identifies Propstack as CRM, property count, geographic coverage, required languages, lead routing rules
- **Output to:** Section builders receive typed API client, property types, search filter configuration. SEO skill receives property structured data (RealEstateListing schema).

### Related Skills

- `map-location` -- Map rendering patterns (Mapbox, Google Maps). Use alongside for map implementation details.
- `search-ui` -- Advanced search and filter patterns. Use alongside for complex faceted search.
- `form-builder` -- Form validation, multi-step forms. Use alongside for complex lead capture and qualification.
- `print-pdf` -- PDF generation patterns. Use alongside for expose document styling.
- `structured-data` -- RealEstateListing, Place, PostalAddress schema.org markup.
- `image-asset-pipeline` -- Property photo optimization, srcset, lazy loading for large galleries.
- `seo-meta` -- Property page SEO, canonical URLs, hreflang for multi-language sites.
- `i18n-rtl` -- Multi-language property descriptions, locale-aware number formatting.

### Quality Checks

- [ ] API key never appears in client-side code or `NEXT_PUBLIC_` env vars
- [ ] Property listings use ISR with webhook-triggered revalidation
- [ ] Search filters are URL-synced (shareable filtered views, survive refresh)
- [ ] Prices formatted with `Intl.NumberFormat` using correct locale and currency
- [ ] Energy certificate displayed on detail pages (legally required in EU)
- [ ] RealEstateListing structured data on detail pages
- [ ] Property images use Next.js `<Image>` with correct `sizes` attribute
- [ ] Pagination implemented for large property sets
- [ ] Lead form includes property reference ID for Propstack association
- [ ] Map markers are clustered to handle dense urban areas

## Layer 4: Anti-Patterns

### Anti-Pattern: API Credentials Client-Side (-15)

**What goes wrong:** Propstack API key is placed in `NEXT_PUBLIC_` environment variables or embedded in client-side JavaScript. The API key grants full account access including customer data, internal notes, commission details, and the ability to modify or delete listings. Exposing it allows anyone to access sensitive business data.

**Instead:** Always proxy Propstack API calls through server-side endpoints (Next.js API routes, server actions, Astro server endpoints). No Propstack credentials should ever reach the browser.

### Anti-Pattern: No Pagination for Large Property Sets (-5)

**What goes wrong:** All properties are fetched in a single API call and rendered at once. Agencies with 200+ active listings hit API rate limits, experience slow page loads (fetching all images), and cause memory issues on mobile devices rendering hundreds of cards.

**Instead:** Implement server-side pagination using Propstack's `page` and `per_page` parameters. Show 12-24 properties per page with pagination controls. For map view, fetch only visible viewport bounds or use clustering for the full set.

### Anti-Pattern: Missing Image Optimization for Property Photos (-3)

**What goes wrong:** Property photos are loaded directly from Propstack's CDN at original resolution. Real estate photography is typically 4000x3000px JPEG files at 3-8MB each. A listing grid with 24 properties loads 72+ MB of images before any user interaction.

**Instead:** Use Next.js `<Image>` with Propstack's domain in `images.remotePatterns`. Set appropriate `sizes` (e.g., `300px` for grid cards, `50vw` for detail gallery). Use `priority` only for above-fold hero images. Implement blur placeholder with a low-quality image preview.

### Anti-Pattern: No RealEstateListing Structured Data (-3)

**What goes wrong:** Property detail pages lack schema.org `RealEstateListing` markup. Search engines cannot extract price, location, room count, or area from the page. The property does not appear in Google's property search panels or rich results.

**Instead:** Add `RealEstateListing` (or `Residence`/`Apartment`/`House` as appropriate) structured data with `offers` (price), `address` (PostalAddress), `floorSize`, `numberOfRooms`, and `photo`. Use JSON-LD in the page head. Validate with Google's Rich Results Test.

### Anti-Pattern: Search Filters Not URL-Synced (-3)

**What goes wrong:** Search filters are stored only in React state. When users share a filtered property search URL, recipients see the unfiltered default view. Browser back/forward navigation loses filter state. Bookmarking a search result is impossible.

**Instead:** Sync all filter values to URL search parameters. Use `useSearchParams` and `router.push` to update the URL on every filter change. Parse search params server-side in the page component to apply filters to the Propstack API call. Reset to page 1 when filters change.

### Anti-Pattern: Missing Energy Certificate Display (-2)

**What goes wrong:** Property detail pages omit the energy certificate information (Energieausweis). In Germany and many EU countries, displaying the energy efficiency class and consumption/demand value is legally required in property advertisements. Missing it can result in fines for the agency.

**Instead:** Always display the energy certificate section on detail pages when the data is available from Propstack. Show the certificate type (demand vs. consumption), the kWh/(m2a) value, the energy class (A+ through H), and the validity date. Include it in the expose PDF as well.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Property list page size | 12 | 48 | items | SOFT -- warn if outside range |
| ISR revalidation interval | 60 | 86400 | seconds | SOFT -- warn if below 60s |
| Gallery images preloaded | 1 | 3 | count | SOFT -- only preload above-fold images |
| Map cluster radius | 30 | 80 | pixels | SOFT -- balance density vs. readability |
| Lead form required fields | 3 | 3 | count | HARD -- first name, last name, email minimum |
| Energy certificate display | 1 | 1 | boolean | HARD -- legally required when data available |
| API key client exposure | 0 | 0 | boolean | HARD -- never expose to client |
| Structured data presence | 1 | 1 | boolean | HARD -- RealEstateListing on all detail pages |
