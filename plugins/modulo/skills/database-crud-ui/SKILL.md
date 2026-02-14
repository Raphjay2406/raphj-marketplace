# Database CRUD UI

Admin CRUD interfaces, data management tables, bulk operations, and ORM integration patterns with Prisma and Drizzle.

## CRUD Data Table with Server Actions

```tsx
// app/admin/items/page.tsx
import { Suspense } from "react";
import { db } from "@/lib/db";
import { ItemsTable } from "./items-table";
import { CreateItemDialog } from "./create-item-dialog";
import { TableSkeleton } from "@/components/skeletons";

interface SearchParams {
  page?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const limit = 20;

  const where = params.search
    ? { name: { contains: params.search, mode: "insensitive" as const } }
    : {};

  const [items, total] = await Promise.all([
    db.item.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: params.sort
        ? { [params.sort]: params.order ?? "asc" }
        : { createdAt: "desc" },
    }),
    db.item.count({ where }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <CreateItemDialog />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ItemsTable
          items={items}
          total={total}
          page={page}
          limit={limit}
        />
      </Suspense>
    </div>
  );
}
```

## CRUD Actions

```ts
// app/admin/items/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  price: z.coerce.number().min(0).optional(),
});

export async function createItem(formData: FormData) {
  const parsed = itemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.item.create({ data: parsed.data });
  revalidatePath("/admin/items");
  return { success: true };
}

export async function updateItem(id: string, formData: FormData) {
  const parsed = itemSchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.item.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/items");
  return { success: true };
}

export async function deleteItem(id: string) {
  await db.item.delete({ where: { id } });
  revalidatePath("/admin/items");
  return { success: true };
}

export async function bulkDelete(ids: string[]) {
  await db.item.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/items");
  return { success: true, count: ids.length };
}

export async function bulkUpdateStatus(ids: string[], status: string) {
  await db.item.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
  revalidatePath("/admin/items");
  return { success: true, count: ids.length };
}
```

## Inline Edit Cell

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

interface InlineEditCellProps {
  value: string;
  onSave: (value: string) => Promise<void>;
}

export function InlineEditCell({ value, onSave }: InlineEditCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function handleSave() {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="w-full text-left hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1"
      >
        {value}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        disabled={saving}
        className="h-7 text-sm"
      />
      <button onClick={handleSave} disabled={saving} className="text-green-600 hover:text-green-700">
        <Check className="h-4 w-4" />
      </button>
      <button onClick={() => { setDraft(value); setEditing(false); }} className="text-red-600 hover:text-red-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
```

## Bulk Actions Toolbar

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { bulkDelete, bulkUpdateStatus } from "./actions";

interface BulkActionsProps {
  selectedIds: string[];
  onComplete: () => void;
}

export function BulkActions({ selectedIds, onComplete }: BulkActionsProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
      <span className="text-sm font-medium">
        {selectedIds.length} selected
      </span>

      <Select
        onValueChange={async (status) => {
          await bulkUpdateStatus(selectedIds, status);
          onComplete();
        }}
      >
        <SelectTrigger className="w-[160px] h-8">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Set Draft</SelectItem>
          <SelectItem value="active">Set Active</SelectItem>
          <SelectItem value="archived">Set Archived</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await bulkDelete(selectedIds);
                onComplete();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

## Create/Edit Dialog with Form

```tsx
"use client";

import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createItem } from "./actions";

export function CreateItemDialog() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createItem(formData),
    null
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
            {state?.error?.name && (
              <p className="text-sm text-destructive">{state.error.name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="draft">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## Prisma Schema Example

```prisma
model Item {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("draft")
  price       Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status])
  @@index([createdAt])
}
```

## Key Rules

- Always validate with Zod in Server Actions before database writes
- Use `revalidatePath` after mutations to refresh cached data
- Implement inline editing for quick single-field updates
- Bulk operations need confirmation dialogs for destructive actions
- Use optimistic updates for status toggles and simple changes
- Add search with URL params (`searchParams`) for shareable filtered views
- Always paginate — never fetch unbounded result sets
- Use `Promise.all` for parallel count + data queries
