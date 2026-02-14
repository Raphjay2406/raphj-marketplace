---
name: dashboard-patterns
description: "Dashboard layout patterns including sidebars, stat cards, charts, data grids, command palettes, admin interfaces, settings pages, onboarding wizard, notification center, activity feeds, breadcrumbs, role-based UI."
---

Use this skill when the user mentions dashboard, admin panel, analytics page, stat cards, sidebar navigation, chart layout, admin interface, settings page, onboarding, activity feed, or breadcrumbs. Triggers on: dashboard, admin, analytics, stat card, sidebar, chart layout, settings, onboarding, activity feed, breadcrumb, role.

You are an expert at building polished, full-featured dashboard interfaces with shadcn/ui.

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

## Page Header with Breadcrumbs

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'

function PageHeader({ breadcrumbs, title, description, actions }: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => (
            <Fragment key={crumb.label}>
              <BreadcrumbItem>
                {i < breadcrumbs.length - 1 ? (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
```

## Settings Page

```tsx
function SettingsPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Settings" description="Manage your account settings." />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 mt-6">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationSettings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{setting.label}</Label>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Onboarding Wizard

```tsx
function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const steps = [
    { title: 'Welcome', description: 'Tell us about yourself' },
    { title: 'Team', description: 'Set up your workspace' },
    { title: 'Preferences', description: 'Customize your experience' },
    { title: 'Done', description: 'You\'re all set!' },
  ]

  return (
    <div className="mx-auto max-w-lg">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <Fragment key={i}>
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
              i < step ? "bg-primary text-primary-foreground" :
              i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-muted text-muted-foreground"
            )}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 flex-1", i < step ? "bg-primary" : "bg-muted")} />
            )}
          </Fragment>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step-specific content */}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
            Back
          </Button>
          <Button onClick={() => setStep(s => s + 1)} disabled={step === steps.length - 1}>
            {step === steps.length - 2 ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
```

## Activity Feed

```tsx
function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {activities.map(activity => (
              <div key={activity.id} className="relative flex gap-4 pl-10">
                <div className={cn(
                  "absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-background",
                  activity.type === 'create' && "bg-green-500",
                  activity.type === 'update' && "bg-blue-500",
                  activity.type === 'delete' && "bg-red-500",
                  activity.type === 'comment' && "bg-yellow-500",
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Role-Based UI

```tsx
// Conditional rendering based on user role
function RoleGate({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user || !allowedRoles.includes(user.role)) return null
  return <>{children}</>
}

// Usage
<RoleGate allowedRoles={['admin', 'manager']}>
  <Button variant="destructive">Delete All</Button>
</RoleGate>

// Sidebar with role-based items
const sidebarItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard', roles: ['*'] },
  { label: 'Users', icon: Users, href: '/users', roles: ['admin'] },
  { label: 'Settings', icon: Settings, href: '/settings', roles: ['admin', 'manager'] },
  { label: 'Analytics', icon: BarChart3, href: '/analytics', roles: ['admin', 'analyst'] },
  { label: 'Billing', icon: CreditCard, href: '/billing', roles: ['admin', 'billing'] },
]

function AppSidebar() {
  const { user } = useAuth()
  const filtered = sidebarItems.filter(
    item => item.roles.includes('*') || item.roles.includes(user?.role ?? '')
  )
  // render filtered items...
}
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
        <Search className="mr-2 h-4 w-4" />Search...<kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Ctrl+K</kbd>
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
5. Include page header with breadcrumbs, title, description, and action buttons
6. Use tabs for sub-navigation within dashboard sections
7. Keep the sidebar persistent, header sticky
8. **Settings**: Tab-based layout, danger zone at bottom with red border
9. **Onboarding**: Step indicator + card-based wizard, back/next navigation
10. **Activity feed**: Timeline with colored dots per action type
11. **Role-based UI**: Filter navigation and actions by user.role
12. **Breadcrumbs**: Always show current location in the app hierarchy
