---
name: form-builder
description: "Build complex forms with react-hook-form, zod validation, and shadcn/ui form components."
---

Use this skill when the user mentions forms, form validation, zod schemas, react-hook-form, input validation, or form building.

You are an expert at building production-grade forms with react-hook-form, zod, and shadcn/ui.

## Setup Pattern

```tsx
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof formSchema>

export default function Component() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "" },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Common Zod Schemas

```tsx
// String validations
z.string().min(1, "Required")
z.string().email("Invalid email")
z.string().url("Invalid URL")
z.string().regex(/^[a-z]+$/, "Lowercase only")

// Number
z.coerce.number().min(0).max(100)

// Date
z.coerce.date().min(new Date(), "Must be in the future")

// Enum / Select
z.enum(["admin", "user", "guest"], { required_error: "Select a role" })

// Optional
z.string().optional()
z.string().nullable()

// Conditional / Refinement
z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Array
z.array(z.string()).min(1, "Select at least one item")

// File upload
z.instanceof(File).refine((f) => f.size < 5_000_000, "Max 5MB")
```

## Field Types with shadcn

### Select
```tsx
<FormField control={form.control} name="role" render={({ field }) => (
  <FormItem>
    <FormLabel>Role</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />
```

### Checkbox
```tsx
<FormField control={form.control} name="terms" render={({ field }) => (
  <FormItem className="flex items-center space-x-2">
    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
    <FormLabel className="font-normal">Accept terms and conditions</FormLabel>
    <FormMessage />
  </FormItem>
)} />
```

### Textarea
```tsx
<FormField control={form.control} name="bio" render={({ field }) => (
  <FormItem>
    <FormLabel>Bio</FormLabel>
    <FormControl><Textarea placeholder="Tell us about yourself" {...field} /></FormControl>
    <FormMessage />
  </FormItem>
)} />
```

### Switch
```tsx
<FormField control={form.control} name="notifications" render={({ field }) => (
  <FormItem className="flex items-center justify-between rounded-lg border p-4">
    <div className="space-y-0.5">
      <FormLabel>Notifications</FormLabel>
      <FormDescription>Receive email notifications</FormDescription>
    </div>
    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
  </FormItem>
)} />
```

### Date Picker
```tsx
<FormField control={form.control} name="date" render={({ field }) => (
  <FormItem className="flex flex-col">
    <FormLabel>Date</FormLabel>
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
            {field.value ? format(field.value, "PPP") : "Pick a date"}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
      </PopoverContent>
    </Popover>
    <FormMessage />
  </FormItem>
)} />
```

## Multi-Step Forms

```tsx
const [step, setStep] = useState(1)

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {step === 1 && <PersonalInfoFields control={form.control} />}
      {step === 2 && <AddressFields control={form.control} />}
      {step === 3 && <ReviewStep values={form.getValues()} />}

      <div className="flex justify-between mt-6">
        {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>}
        {step < 3 ? (
          <Button type="button" onClick={async () => {
            const valid = await form.trigger(stepFields[step])
            if (valid) setStep(s => s + 1)
          }}>Next</Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </div>
    </form>
  </Form>
)
```

## Submission States

```tsx
const [isPending, startTransition] = useTransition()

function onSubmit(values: FormValues) {
  startTransition(async () => {
    await submitForm(values)
    toast.success("Form submitted!")
  })
}

<Button type="submit" disabled={isPending}>
  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit"}
</Button>
```

## Best Practices

1. Always use `zodResolver` for type-safe validation
2. Set `defaultValues` for all fields to avoid uncontrolled-to-controlled warnings
3. Use `FormMessage` on every field for error display
4. Use `form.trigger()` for per-step validation in multi-step forms
5. Show loading state on submit button with `useTransition`
6. Use `FormDescription` to guide users on expected input
7. Use `z.infer<typeof schema>` for type derivation - never duplicate types
