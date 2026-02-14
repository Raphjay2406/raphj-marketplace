---
name: multi-tenant-ui
description: "Multi-tenant UI patterns: organization switcher, white-labeling, tenant-aware theming, custom domains, tenant context provider, team management, role-based access. Works with Next.js and Astro."
---

Use this skill when the user mentions multi-tenant, organization switcher, white-label, tenant, team management, workspace, or custom domain. Triggers on: multi-tenant, organization, workspace, white-label, tenant, team, custom domain.

You are an expert at building multi-tenant SaaS UIs with shadcn/ui.

## Organization Switcher

```tsx
'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function OrgSwitcher({ orgs, current, onSwitch, onCreate }: {
  orgs: Org[]; current: Org; onSwitch: (org: Org) => void; onCreate: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[220px] justify-between">
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={current.logo} />
            <AvatarFallback className="text-[10px]">{current.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="truncate">{current.name}</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandGroup heading="Organizations">
              {orgs.map(org => (
                <CommandItem key={org.id} onSelect={() => { onSwitch(org); setOpen(false) }}>
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={org.logo} />
                    <AvatarFallback className="text-[10px]">{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {org.name}
                  {org.id === current.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => { onCreate(); setOpen(false) }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Tenant Context Provider

```tsx
'use client'

import { createContext, useContext } from 'react'

interface TenantConfig {
  id: string; name: string; slug: string; logo: string;
  primaryColor: string; plan: 'free' | 'pro' | 'enterprise'
  features: Record<string, boolean>
}

const TenantContext = createContext<TenantConfig | null>(null)

export function TenantProvider({ tenant, children }: { tenant: TenantConfig; children: React.ReactNode }) {
  return (
    <TenantContext.Provider value={tenant}>
      <div style={{ '--tenant-primary': tenant.primaryColor } as React.CSSProperties}>
        {children}
      </div>
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be inside TenantProvider')
  return ctx
}

// Feature gate component
export function FeatureGate({ feature, children, fallback }: {
  feature: string; children: React.ReactNode; fallback?: React.ReactNode
}) {
  const tenant = useTenant()
  if (!tenant.features[feature]) return fallback ?? null
  return <>{children}</>
}
```

## Team Members Management

```tsx
function TeamMembers({ members, onInvite, onRemove, onRoleChange }: TeamMembersProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button size="sm" onClick={onInvite}><UserPlus className="h-4 w-4 mr-2" /> Invite</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <Select value={member.role} onValueChange={v => onRoleChange(member.id, v)}>
                <SelectTrigger className="w-[110px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive" onClick={() => onRemove(member.id)}>Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

## Tenant-Aware Theming

```css
/* CSS custom properties for tenant branding */
:root {
  --tenant-primary: 221.2 83.2% 53.3%;
}

/* Use in Tailwind config */
/* theme: { extend: { colors: { tenant: 'hsl(var(--tenant-primary))' } } } */
```

```tsx
// Dynamic theme from tenant config
function TenantTheme({ tenant }: { tenant: TenantConfig }) {
  return (
    <style>{`
      :root {
        --tenant-primary: ${tenant.primaryColor};
        --tenant-logo: url(${tenant.logo});
      }
    `}</style>
  )
}
```

## Best Practices

1. Org switcher: Command/Popover with search, create option at bottom
2. Tenant context: provide config via React Context, CSS variables for theming
3. Feature gates: wrap features in `<FeatureGate feature="analytics">` by plan
4. Team management: role select dropdown, invite button, remove via dropdown menu
5. URL patterns: `/org/[slug]/dashboard` or subdomain `[slug].app.com`
6. Custom domains: resolve tenant from hostname in middleware
7. White-labeling: CSS custom properties for colors, logo as config
8. Roles: owner > admin > member > viewer, enforce server-side
9. For Astro: pass tenant config as props to island components
10. Always validate tenant access server-side, never trust client-only checks
