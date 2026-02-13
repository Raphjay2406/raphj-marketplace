---
name: dashboard-patterns
description: "Dashboard layout patterns including sidebars, stat cards, charts, data grids, command palettes, and admin interfaces."
---

Use this skill when the user mentions dashboard, admin panel, analytics page, stat cards, sidebar navigation, chart layout, or admin interface.

You are an expert at building polished dashboard interfaces with shadcn/ui.

## Dashboard Shell

```tsx
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
```

## Stat Cards Row

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, CreditCard, Activity } from 'lucide-react'

const stats = [
  { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", trend: "up", icon: DollarSign },
  { title: "Subscriptions", value: "+2,350", change: "+180.1%", trend: "up", icon: Users },
  { title: "Sales", value: "+12,234", change: "+19%", trend: "up", icon: CreditCard },
  { title: "Active Now", value: "+573", change: "-2%", trend: "down", icon: Activity },
]

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {stats.map((stat) => (
    <Card key={stat.title}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
        <stat.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className={cn("flex items-center text-xs", stat.trend === "up" ? "text-green-600" : "text-red-600")}>
          {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {stat.change} from last month
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

## Chart + Activity Layout

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
  <Card className="lg:col-span-4">
    <CardHeader>
      <CardTitle>Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>You have 265 events this month.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback>{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.name}</p>
              <p className="text-xs text-muted-foreground">{activity.action}</p>
            </div>
            <span className="text-sm text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>
```

## Page Header with Actions

```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
    <p className="text-muted-foreground">Welcome back, here's your overview.</p>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
    <Button size="sm"><Plus className="mr-2 h-4 w-4" />Create</Button>
  </div>
</div>
```

## Tabs Navigation

```tsx
<Tabs defaultValue="overview" className="space-y-4">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="space-y-4">
    {/* Stat cards, charts, tables */}
  </TabsContent>
</Tabs>
```

## Command Palette (Ctrl+K)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command'

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o) }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button variant="outline" className="text-muted-foreground" onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" />Search...<kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Users</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem>Create new...</CommandItem>
            <CommandItem>Export data</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

## User Nav Dropdown

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/avatar.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56" align="end">
    <DropdownMenuLabel>
      <p className="text-sm font-medium">John Doe</p>
      <p className="text-xs text-muted-foreground">john@example.com</p>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Best Practices

1. Use `SidebarProvider` from shadcn for collapsible sidebar
2. Place stat cards in a 4-column grid that collapses to 2 on tablet, 1 on mobile
3. Use `lg:col-span-4` / `lg:col-span-3` for chart + activity split
4. Add Ctrl+K command palette for power users
5. Include page header with title, description, and action buttons
6. Use tabs for sub-navigation within dashboard sections
7. Keep the sidebar persistent, header sticky
