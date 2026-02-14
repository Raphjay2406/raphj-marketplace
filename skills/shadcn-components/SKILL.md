---
name: shadcn-components
description: "Deep knowledge of all shadcn/ui components, variants, props, composition patterns, multi-select tags, inline editable, stepper, timeline, kanban, tree view, color picker, rich text toolbar."
---

Use this skill when the user mentions shadcn, shadcn/ui, UI components, component library, or asks to build with specific shadcn components like Button, Dialog, Card, multi-select, stepper, timeline, tree view, or color picker. Triggers on: shadcn, UI component, Button, Dialog, Card, multi-select, stepper, timeline, tree view, color picker, tag input.

You are an expert in the shadcn/ui component library. You know every component, variant, prop, and composition pattern.

## Import Convention

All shadcn/ui components are imported from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
```

## Component Reference

### Layout & Container
- **Card** - `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Separator** - Horizontal/vertical dividers
- **ScrollArea** - Custom scrollable containers
- **Resizable** - `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`
- **Collapsible** - `CollapsibleTrigger`, `CollapsibleContent`
- **Accordion** - `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- **Tabs** - `TabsList`, `TabsTrigger`, `TabsContent`
- **Sheet** - Slide-out panel: `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`

### Form & Input
- **Button** - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`
- **Input** - Text input with Tailwind styling
- **Textarea** - Multi-line text input
- **Label** - Form labels with proper `htmlFor`
- **Checkbox** - Controlled/uncontrolled checkboxes
- **RadioGroup** - `RadioGroupItem` with labels
- **Switch** - Toggle switches
- **Select** - `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`
- **Slider** - Range slider input
- **Toggle** - `variant: "default" | "outline"`, pressed state
- **ToggleGroup** - Group of toggles, `type: "single" | "multiple"`
- **Calendar** - Date picker calendar
- **DatePicker** - Popover + Calendar combo
- **Form** - react-hook-form integration: `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`
- **InputOTP** - One-time password input: `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`

### Navigation
- **NavigationMenu** - `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`
- **Menubar** - `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarSeparator`
- **Breadcrumb** - `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`
- **Pagination** - `PaginationContent`, `PaginationItem`, `PaginationPrevious`, `PaginationNext`, `PaginationLink`, `PaginationEllipsis`
- **Sidebar** - `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`
- **Command** - Command palette: `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`

### Feedback & Overlay
- **Dialog** - Modal dialogs: `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- **AlertDialog** - Confirmation dialogs: `AlertDialogAction`, `AlertDialogCancel`
- **Popover** - `PopoverTrigger`, `PopoverContent`
- **Tooltip** - `TooltipProvider`, `TooltipTrigger`, `TooltipContent`
- **HoverCard** - `HoverCardTrigger`, `HoverCardContent`
- **DropdownMenu** - `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, `DropdownMenuGroup`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`
- **ContextMenu** - Right-click menus (same sub-components as DropdownMenu)
- **Toast** / **Sonner** - Notification toasts: `toast()` function, `Toaster` component
- **Alert** - `AlertTitle`, `AlertDescription`. Variants: `default`, `destructive`
- **Progress** - Progress bar with `value` prop
- **Skeleton** - Loading placeholder

### Data Display
- **Table** - `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`
- **Badge** - Variants: `default`, `secondary`, `destructive`, `outline`
- **Avatar** - `AvatarImage`, `AvatarFallback`
- **AspectRatio** - Fixed aspect ratio containers
- **Carousel** - `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`
- **Chart** - Recharts wrappers: `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`
- **Drawer** - Mobile-friendly bottom sheet: `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerFooter`

## Composition Patterns

### Dialog with Form
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="John" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Responsive Sheet/Dialog
```tsx
// Sheet on mobile, Dialog on desktop
const isDesktop = useMediaQuery("(min-width: 768px)")

if (isDesktop) {
  return <Dialog>...</Dialog>
}
return <Drawer>...</Drawer>
```

## Multi-Select Tags Input

```tsx
'use client'
import { useState, useRef, useCallback } from 'react'

interface Option { value: string; label: string }

function MultiSelect({ options, selected, onChange }: {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(
    o => !selected.includes(o.value) && o.label.toLowerCase().includes(search.toLowerCase())
  )

  const remove = (value: string) => onChange(selected.filter(v => v !== value))
  const add = (value: string) => { onChange([...selected, value]); setSearch('') }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {selected.map(value => {
            const option = options.find(o => o.value === value)
            return (
              <Badge key={value} variant="secondary" className="gap-1">
                {option?.label}
                <button onClick={(e) => { e.stopPropagation(); remove(value) }} className="ml-0.5 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !search) remove(selected[selected.length - 1])
            }}
            placeholder={selected.length === 0 ? 'Select items...' : ''}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[80px]"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filtered.map(option => (
                <CommandItem key={option.value} onSelect={() => add(option.value)}>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Inline Editable Text

```tsx
'use client'
function InlineEditable({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const save = () => {
    onSave(draft)
    setEditing(false)
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true) }}
        className="group inline-flex items-center gap-1.5 rounded px-1 py-0.5 -mx-1 hover:bg-muted transition-colors"
      >
        <span>{value}</span>
        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
        onBlur={save}
        className="h-8 w-auto"
      />
    </div>
  )
}
```

## Stepper Component

```tsx
interface Step { title: string; description?: string }

function Stepper({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <Fragment key={i}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              i < currentStep ? "bg-primary text-primary-foreground" :
              i === currentStep ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-muted text-muted-foreground"
            )}>
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{step.title}</p>
              {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("h-px flex-1 min-w-8", i < currentStep ? "bg-primary" : "bg-border")} />
          )}
        </Fragment>
      ))}
    </div>
  )
}
```

## Timeline

```tsx
interface TimelineItem {
  title: string
  description: string
  date: string
  icon?: LucideIcon
  variant?: 'default' | 'success' | 'destructive'
}

function Timeline({ items }: { items: TimelineItem[] }) {
  const variantStyles = {
    default: 'bg-primary',
    success: 'bg-green-500',
    destructive: 'bg-destructive',
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-8">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="relative flex gap-6 pl-12">
              <div className={cn(
                "absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background",
                variantStyles[item.variant ?? 'default']
              )}>
                {Icon && <Icon className="h-2.5 w-2.5 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <time className="text-xs text-muted-foreground">{item.date}</time>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

## Tree View

```tsx
interface TreeNode {
  id: string
  label: string
  icon?: LucideIcon
  children?: TreeNode[]
}

function TreeView({ nodes, level = 0 }: { nodes: TreeNode[]; level?: number }) {
  return (
    <div className={cn("space-y-0.5", level > 0 && "ml-4 border-l pl-2")}>
      {nodes.map(node => (
        <TreeItem key={node.id} node={node} level={level} />
      ))}
    </div>
  )
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const Icon = node.icon ?? (hasChildren ? Folder : FileText)

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors",
          !hasChildren && "cursor-default"
        )}
      >
        {hasChildren ? (
          <ChevronRight className={cn("h-3 w-3 transition-transform", expanded && "rotate-90")} />
        ) : (
          <span className="w-3" />
        )}
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{node.label}</span>
      </button>
      {expanded && hasChildren && <TreeView nodes={node.children!} level={level + 1} />}
    </div>
  )
}
```

## Color Picker

```tsx
'use client'
function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const presets = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff']

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[120px] justify-start gap-2">
          <div className="h-4 w-4 rounded-sm border" style={{ backgroundColor: value }} />
          <span className="text-xs font-mono">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3">
        <div className="space-y-3">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-32 w-full cursor-pointer p-1"
          />
          <div className="grid grid-cols-9 gap-1">
            {presets.map(color => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className={cn(
                  "h-6 w-6 rounded-md border transition-transform hover:scale-110",
                  value === color && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="h-8 font-mono text-xs"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## Rich Text Toolbar

```tsx
function RichTextToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-0.5 border-b p-1">
      <ToggleGroup type="multiple" className="gap-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToggleGroup type="single" value={getAlignment(editor)} className="gap-0.5">
        <Toggle size="sm" value="left" onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" value="center" onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" value="right" onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
```

## Best Practices

1. Always use `asChild` on triggers when wrapping custom elements
2. Use `forwardRef` when creating custom components that wrap shadcn components
3. Compose components - shadcn is built for composition, not configuration
4. Use the `cn()` utility from `@/lib/utils` for conditional class merging
5. Prefer controlled components with React state for complex forms
6. Use `TooltipProvider` at the layout level, not per-tooltip
7. Always provide `DialogTitle` and `DialogDescription` for accessibility
8. **Multi-select**: Use Popover + Command + Badge pattern for tag-style selection
9. **Inline editable**: Show edit icon on hover, save on Enter/blur, cancel on Escape
10. **Tree view**: Recursive component with collapse/expand, border-left for nesting
11. **Color picker**: Popover with native color input + preset grid + hex input
12. **Rich text toolbar**: ToggleGroup with Separator dividers, pressed state tracking
