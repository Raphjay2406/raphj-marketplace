---
name: shadcn-components
description: "Deep knowledge of all shadcn/ui components, variants, props, and composition patterns for building polished UIs."
---

Use this skill when the user mentions shadcn, shadcn/ui, UI components, component library, or asks to build with specific shadcn components like Button, Dialog, Card, etc.

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

### Command Palette (Ctrl+K)
```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem><Calendar className="mr-2 h-4 w-4" /> Calendar</CommandItem>
      <CommandItem><Search className="mr-2 h-4 w-4" /> Search</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
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

## Best Practices

1. Always use `asChild` on triggers when wrapping custom elements
2. Use `forwardRef` when creating custom components that wrap shadcn components
3. Compose components - shadcn is built for composition, not configuration
4. Use the `cn()` utility from `@/lib/utils` for conditional class merging
5. Prefer controlled components with React state for complex forms
6. Use `TooltipProvider` at the layout level, not per-tooltip
7. Always provide `DialogTitle` and `DialogDescription` for accessibility
