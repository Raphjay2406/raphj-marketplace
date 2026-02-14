# Admin Panel

Admin dashboard patterns for user management, role-based access, audit logs, content moderation, and system settings.

## Admin Layout with Sidebar Navigation

```tsx
// app/admin/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  FileText,
  Bell,
  ClipboardList,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/roles", label: "Roles & Permissions", icon: Shield },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/audit-log", label: "Audit Log", icon: ClipboardList },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Admin</h2>
        </div>
        <nav className="space-y-1 px-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

## User Management Table

```tsx
// app/admin/users/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Shield, Ban, Trash2 } from "lucide-react";
import { updateUserRole, suspendUser, deleteUser } from "./actions";

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  admin: "default",
  moderator: "secondary",
  user: "outline",
  suspended: "destructive",
};

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-muted-foreground">
          {users.length} total users
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={roleBadgeVariant[user.role] ?? "outline"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    user.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm capitalize">{user.status}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateUserRole(user.id, "admin")}>
                      <Shield className="mr-2 h-4 w-4" />
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => suspendUser(user.id)}
                      className="text-yellow-600"
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteUser(user.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

## Audit Log

```tsx
// app/admin/audit-log/page.tsx
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditEntry {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  actor: { name: string; email: string };
  metadata: Record<string, unknown>;
  createdAt: string;
  ip: string;
}

const actionColors: Record<string, string> = {
  create: "bg-green-500/10 text-green-700 border-green-500/20",
  update: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  delete: "bg-red-500/10 text-red-700 border-red-500/20",
  login: "bg-purple-500/10 text-purple-700 border-purple-500/20",
};

export default async function AuditLogPage() {
  const entries = await getAuditLog();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Audit Log</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {new Date(entry.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={actionColors[entry.action]}>
                  {entry.action}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">
                  {entry.resource}/{entry.resourceId}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {entry.actor.name}
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {entry.ip}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

## Audit Logger Utility

```ts
// lib/audit.ts
export async function logAudit({
  action,
  resource,
  resourceId,
  actorId,
  metadata,
  ip,
}: {
  action: "create" | "update" | "delete" | "login" | "logout";
  resource: string;
  resourceId: string;
  actorId: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}) {
  await db.auditLog.create({
    data: {
      action,
      resource,
      resourceId,
      actorId,
      metadata: metadata ?? {},
      ip: ip ?? "unknown",
    },
  });
}

// Usage in Server Actions
export async function updateUserRole(userId: string, role: string) {
  "use server";
  const admin = await getCurrentUser();
  await db.user.update({ where: { id: userId }, data: { role } });
  await logAudit({
    action: "update",
    resource: "user",
    resourceId: userId,
    actorId: admin.id,
    metadata: { field: "role", newValue: role },
  });
  revalidatePath("/admin/users");
}
```

## Role & Permission Management

```tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const allPermissions: Permission[] = [
  { id: "users.read", name: "View Users", description: "View user list and profiles" },
  { id: "users.write", name: "Manage Users", description: "Create, edit, delete users" },
  { id: "content.read", name: "View Content", description: "View all content" },
  { id: "content.write", name: "Manage Content", description: "Create, edit, publish content" },
  { id: "content.delete", name: "Delete Content", description: "Permanently delete content" },
  { id: "settings.read", name: "View Settings", description: "View system settings" },
  { id: "settings.write", name: "Manage Settings", description: "Change system settings" },
  { id: "audit.read", name: "View Audit Log", description: "View audit trail" },
];

export function RolePermissionEditor({
  role,
  onSave,
}: {
  role: Role;
  onSave: (permissions: string[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role.permissions)
  );
  const [saving, setSaving] = useState(false);

  function toggle(permissionId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions for {role.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allPermissions.map((perm) => (
          <div key={perm.id} className="flex items-start gap-3">
            <Checkbox
              id={perm.id}
              checked={selected.has(perm.id)}
              onCheckedChange={() => toggle(perm.id)}
            />
            <label htmlFor={perm.id} className="space-y-1 cursor-pointer">
              <p className="text-sm font-medium leading-none">{perm.name}</p>
              <p className="text-sm text-muted-foreground">{perm.description}</p>
            </label>
          </div>
        ))}
        <Button
          onClick={async () => {
            setSaving(true);
            await onSave(Array.from(selected));
            setSaving(false);
          }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Permissions"}
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Permission Guard Component

```tsx
import { redirect } from "next/navigation";

export async function RequirePermission({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userPermissions = await getUserPermissions(user.id);
  if (!userPermissions.includes(permission)) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Admin Stats Dashboard

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, AlertTriangle } from "lucide-react";

export default async function AdminDashboard() {
  const [userCount, contentCount, activeUsers, flaggedItems] = await Promise.all([
    db.user.count(),
    db.content.count(),
    db.user.count({ where: { lastActiveAt: { gte: new Date(Date.now() - 86400000) } } }),
    db.content.count({ where: { flagged: true } }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, trend: "+12%" },
    { label: "Content Items", value: contentCount, icon: FileText, trend: "+5%" },
    { label: "Active Today", value: activeUsers, icon: Activity, trend: "+3%" },
    { label: "Flagged", value: flaggedItems, icon: AlertTriangle, trend: "-2%", alert: flaggedItems > 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Key Rules

- Always check admin role in layout — redirect non-admins before rendering
- Log every destructive action (delete, role change, suspend) to audit trail
- Role-based permissions: store as string arrays, check with `.includes()`
- Use `RequirePermission` wrapper for granular page-level access control
- Admin tables need: search, sort, bulk actions, status indicators
- Audit log entries must include: actor, action, resource, timestamp, IP
- Use dropdown menus for row-level actions in user management tables
- Show stats dashboard as admin landing page with key metrics
