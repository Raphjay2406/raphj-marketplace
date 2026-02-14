# Notification Center

In-app notification feeds, notification preferences, push notification setup, real-time notification badges, and notification grouping.

## Notification Bell with Badge

```tsx
"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationFeed } from "./notification-feed";

export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <NotificationFeed onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
```

## Notification Feed

```tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCheck,
  MessageSquare,
  Heart,
  UserPlus,
  AlertCircle,
  Settings,
} from "lucide-react";
import { markAllRead, markAsRead } from "./actions";

interface Notification {
  id: string;
  type: "comment" | "like" | "follow" | "mention" | "system" | "invite";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actor?: { name: string; avatar: string };
  actionUrl?: string;
}

const typeIcons = {
  comment: MessageSquare,
  like: Heart,
  follow: UserPlus,
  mention: MessageSquare,
  system: AlertCircle,
  invite: UserPlus,
};

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = typeIcons[notification.type];

  return (
    <button
      onClick={() => {
        if (!notification.read) onRead(notification.id);
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
      }}
      className={cn(
        "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50",
        !notification.read && "bg-primary/5"
      )}
    >
      {notification.actor ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={notification.actor.avatar} />
          <AvatarFallback>{notification.actor.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 space-y-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{notification.title}</span>
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.body}
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

export function NotificationFeed({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function handleRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unread = notifications.filter((n) => !n.read);

  return (
    <div>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {unread.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
            <a href="/settings/notifications">
              <Settings className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="all" className="flex-1 rounded-none border-b-2 data-[state=active]:border-primary">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1 rounded-none border-b-2 data-[state=active]:border-primary">
            Unread ({unread.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} onRead={handleRead} />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {unread.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={handleRead} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Notification Preferences

```tsx
"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NotificationPrefs {
  email: { comments: boolean; mentions: boolean; updates: boolean; marketing: boolean };
  push: { comments: boolean; mentions: boolean; updates: boolean };
  inApp: { comments: boolean; mentions: boolean; updates: boolean; system: boolean };
}

export function NotificationPreferences({
  initial,
  onSave,
}: {
  initial: NotificationPrefs;
  onSave: (prefs: NotificationPrefs) => Promise<void>;
}) {
  const [prefs, setPrefs] = useState(initial);
  const [saving, setSaving] = useState(false);

  function toggle(channel: keyof NotificationPrefs, type: string) {
    setPrefs((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type as keyof (typeof prev)[typeof channel]],
      },
    }));
  }

  const channels: { key: keyof NotificationPrefs; title: string; description: string; types: { key: string; label: string }[] }[] = [
    {
      key: "email",
      title: "Email Notifications",
      description: "Receive notifications via email",
      types: [
        { key: "comments", label: "Comments on your posts" },
        { key: "mentions", label: "When someone mentions you" },
        { key: "updates", label: "Product updates" },
        { key: "marketing", label: "Marketing emails" },
      ],
    },
    {
      key: "push",
      title: "Push Notifications",
      description: "Browser and mobile push notifications",
      types: [
        { key: "comments", label: "Comments" },
        { key: "mentions", label: "Mentions" },
        { key: "updates", label: "Important updates" },
      ],
    },
    {
      key: "inApp",
      title: "In-App Notifications",
      description: "Notifications shown in the app",
      types: [
        { key: "comments", label: "Comments" },
        { key: "mentions", label: "Mentions" },
        { key: "updates", label: "Updates" },
        { key: "system", label: "System alerts" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {channels.map((channel) => (
        <Card key={channel.key}>
          <CardHeader>
            <CardTitle className="text-lg">{channel.title}</CardTitle>
            <CardDescription>{channel.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {channel.types.map((type) => (
              <div key={type.key} className="flex items-center justify-between">
                <Label htmlFor={`${channel.key}-${type.key}`} className="cursor-pointer">
                  {type.label}
                </Label>
                <Switch
                  id={`${channel.key}-${type.key}`}
                  checked={prefs[channel.key][type.key as keyof (typeof prefs)[typeof channel.key]] as boolean}
                  onCheckedChange={() => toggle(channel.key, type.key)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={async () => {
          setSaving(true);
          await onSave(prefs);
          setSaving(false);
        }}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}
```

## Push Notification Setup

```ts
// lib/push-notifications.ts
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  const granted = await requestNotificationPermission();
  if (!granted) return null;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  // Send subscription to server
  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  return subscription;
}
```

## Key Rules

- Notification bell: show count badge (cap at 99+), Popover for feed
- Feed: tabs for All/Unread, ScrollArea for bounded height
- Mark all read button: only show when there are unread notifications
- Unread indicator: blue dot on right side + subtle background tint
- Time display: relative ("2m ago", "3h ago", "1d ago")
- Preferences: grouped by channel (email, push, in-app) with Switch toggles
- Push: request permission only on user action, never on page load
- Always provide a link to notification settings from the feed header
- Notification types: use different icons per type (comment, like, follow, system)
