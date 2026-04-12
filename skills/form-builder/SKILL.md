---
name: "form-builder"
description: "Form UI patterns: accessible form layouts, validation feedback, multi-step forms, DNA-styled inputs, error states with ARIA live regions, container query layouts -- using react-hook-form, zod, and native HTML validation."
tier: "utility"
triggers: "form, input, validation, zod, react-hook-form, error state, multi-step, checkout form, contact form, signup, login"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/form/**/*.tsx"
    - "**/*.tsx"
---

## Layer 1: Decision Guidance

### When to Use

- Any page with user input: contact forms, signup/login, checkout, settings, search filters
- Multi-step flows: onboarding wizards, checkout processes, profile setup
- Complex validation needs: conditional fields, cross-field validation, async validation

### When NOT to Use

- Search/filter controls embedded in dashboards -- simpler inline patterns, though still reference this skill for accessible input patterns
- CMS content editing -- typically uses the CMS's built-in editor, not custom forms

### Decision Tree

- Form library? `react-hook-form` with `zod` resolver for React/Next.js; native HTML validation for Astro static forms
- Multi-step? Use `form.trigger(stepFields)` for per-step validation before advancing
- Server validation? Combine client-side zod with server action validation; show server errors alongside client errors
- File upload? `z.instanceof(File)` with size/type refinements; show preview before submit
- Form layout? Container query forms adapt to their parent width (sidebar vs full-width)

### Pipeline Connection

- **Referenced by:** builder for contact, signup, checkout, and settings sections
- **Consumed at:** `/gen:execute` wave 2+ for form-heavy sections
- **Related commands:** `/gen:plan` for form section planning; uses `ecommerce-ui` for checkout form patterns

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Accessible Form with Validation

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    await submitContactForm(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="@container space-y-6"
      noValidate
    >
      <div className="grid gap-6 @sm:grid-cols-2">
        <FormField
          label="Name"
          error={errors.name?.message}
          required
        >
          <input
            {...register("name")}
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : "name-description"}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary aria-[invalid=true]:border-red-500"
            placeholder="Your name"
          />
        </FormField>

        <FormField
          label="Email"
          error={errors.email?.message}
          required
        >
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary aria-[invalid=true]:border-red-500"
            placeholder="you@example.com"
          />
        </FormField>
      </div>

      <FormField
        label="Message"
        error={errors.message?.message}
        description="Tell us how we can help."
        required
      >
        <textarea
          {...register("message")}
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={
            [errors.message && "message-error", "message-description"]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary aria-[invalid=true]:border-red-500 resize-y"
          placeholder="Your message..."
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-bg hover:bg-primary/90 disabled:opacity-50 motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isSubmitting ? (
          <>
            <LoaderIcon className="me-2 size-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
```

#### Pattern: Reusable Form Field Wrapper

```tsx
interface FormFieldProps {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  description,
  required,
  children,
}: FormFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-text"
      >
        {label}
        {required && <span className="text-red-500 ms-0.5" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>

      {/* Clone child to inject id */}
      <div>{children}</div>

      {description && !error && (
        <p id={`${id}-description`} className="text-xs text-muted">
          {description}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
```

#### Pattern: Multi-Step Form with Progress

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const step1Schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
});

const step2Schema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "ZIP code is required"),
});

const fullSchema = step1Schema.merge(step2Schema);
type FormData = z.infer<typeof fullSchema>;

const stepSchemas = [step1Schema, step2Schema] as const;
const stepLabels = ["Personal Info", "Address", "Review"];

export function MultiStepForm() {
  const [step, setStep] = useState(0);
  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
  });

  async function goNext() {
    const schema = stepSchemas[step];
    if (!schema) return;
    const fields = Object.keys(schema.shape) as (keyof FormData)[];
    const valid = await form.trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Step indicator */}
      <nav aria-label="Form progress" className="mb-8">
        <ol className="flex items-center gap-2">
          {stepLabels.map((label, i) => {
            const status = i < step ? "complete" : i === step ? "current" : "upcoming";
            return (
              <li key={label} className="flex items-center gap-2">
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
                <span className={`text-sm hidden sm:inline ${status === "upcoming" ? "text-muted" : "text-text"}`}>
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div className={`h-px w-8 ${status === "complete" ? "bg-primary" : "bg-border"}`} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {step === 0 && <Step1Fields register={form.register} errors={form.formState.errors} />}
        {step === 1 && <Step2Fields register={form.register} errors={form.formState.errors} />}
        {step === 2 && <ReviewStep values={form.getValues()} />}

        <div className="mt-6 flex justify-between">
          {step > 0 && (
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm text-text hover:bg-surface motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              className="ms-auto rounded-md bg-primary px-4 py-2 text-sm font-semibold text-bg hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={goNext}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="ms-auto inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-semibold text-bg hover:bg-primary/90 disabled:opacity-50 motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {form.formState.isSubmitting ? (
                <>
                  <LoaderIcon className="me-2 size-4 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

#### Pattern: DNA-Styled Input Components

```tsx
// Base input styles using DNA tokens
const inputStyles =
  "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed aria-[invalid=true]:border-red-500";

const labelStyles = "text-sm font-medium text-text";

const descriptionStyles = "text-xs text-muted";

const errorStyles = "text-xs text-red-600 dark:text-red-400";

// Select input
export function SelectField({
  label,
  options,
  error,
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelStyles}>{label}</label>
      <select
        id={id}
        className={inputStyles}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className={errorStyles} role="alert" aria-live="polite">{error}</p>
      )}
    </div>
  );
}
```

### Reference Sites

- **Linear** (linear.app) -- Clean form design with immediate validation feedback, DNA-consistent styling, excellent keyboard navigation
- **Stripe Checkout** (stripe.com) -- Best-in-class multi-step form: clear progress, per-step validation, accessible error announcements, loading states
- **Typeform** (typeform.com) -- One-question-at-a-time pattern with smooth transitions, strong focus management, engaging validation feedback

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Forms |
|-----------|---------------|
| `bg-bg` | Input field backgrounds |
| `bg-surface` | Form card containers, selected/hover states |
| `text-text` | Labels, input text, button text |
| `text-muted` | Placeholders, descriptions, helper text |
| `border-border` | Input borders, form card outlines |
| `bg-primary` / `text-bg` | Submit buttons, active radio/checkbox fills |
| `--motion-duration` | Validation fade-in, step transition, button loading spin |
| `--motion-easing` | Form field focus ring transition |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Swiss/International | Clean aligned forms, generous spacing, no decorative elements, strict label positioning |
| Brutalist | Raw unstyled inputs, no border-radius, bold labels, stark error colors |
| Luxury/Fashion | Minimal floating labels, thin borders, refined typography, subtle focus rings |
| Playful/Startup | Rounded inputs, colorful focus rings, bouncy validation feedback |
| Neo-Corporate | Polished inputs with subtle shadows, professional spacing, clean step indicators |
| Japanese Minimal | Quiet inputs, generous whitespace, understated validation states |

### Related Skills

- `tailwind-system` -- DNA token classes for input styling, container queries for form layout
- `accessibility` -- Label association, error announcements, focus management, keyboard operation
- `ecommerce-ui` -- Checkout form patterns, address inputs, payment field layouts
- `i18n-rtl` -- Logical properties for RTL form layouts, `dir="auto"` on text inputs
- `cinematic-motion` -- Form step transitions, validation micro-animations (gated behind `motion-safe:`)

## Layer 4: Anti-Patterns

### Anti-Pattern: Placeholder as Label

**What goes wrong:** Input fields use placeholder text as the only label. When the user starts typing, the label disappears. Users with cognitive disabilities, screen readers without placeholder support, and anyone who tabs away forget what the field is for.
**Instead:** Always use a visible `<label>` associated with `htmlFor`/`id`. Placeholders provide examples only (e.g., label: "Email", placeholder: "you@example.com"). If space is constrained, use floating labels that animate above the input on focus.

### Anti-Pattern: Error Messages Without ARIA Live

**What goes wrong:** Validation errors appear visually but screen readers do not announce them. Users relying on assistive technology submit the form repeatedly without knowing what's wrong.
**Instead:** Error messages use `role="alert"` and `aria-live="polite"` so screen readers announce them immediately. Connect errors to fields with `aria-describedby`. The input itself has `aria-invalid="true"` when in error state.

### Anti-Pattern: Color-Only Error Indication

**What goes wrong:** Errors indicated only by a red border or red text color. Users with color blindness (protanopia, deuteranopia) cannot distinguish error states from normal states.
**Instead:** Combine color with at least one other indicator: error icon, error text message, `aria-invalid` attribute. The error message itself provides the information, not just the color change.

### Anti-Pattern: Submit Button Without Loading State

**What goes wrong:** Submit button has no disabled state or loading indicator during submission. Users click multiple times, creating duplicate submissions. No feedback on progress.
**Instead:** Disable the button during submission (`disabled={isSubmitting}`), show a spinner with descriptive text ("Sending..."), and use `opacity-50` + `cursor-not-allowed` for visual disabled state. Announce loading state to screen readers.
