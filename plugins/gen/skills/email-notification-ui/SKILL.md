---
name: email-notification-ui
description: "Notification UI patterns: toast notifications (Sonner), alert banners, inline alerts, notification dropdowns, badge counts, empty states. Works with Next.js and Astro."
---

Use this skill when the user mentions notifications, toasts, alerts, banners, snackbar, notification center, badge count, or feedback messages. Triggers on: notification, toast, alert, banner, snackbar, badge, feedback, sonner, announcement.

You are an expert at building polished notification and feedback UI systems.

## Toast Notifications (Sonner)

```tsx
// Setup: add Toaster to root layout
// Next.js: app/layout.tsx
// Astro: in your base Layout.astro (inside a React island)
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
```

```tsx
// Usage anywhere
import { toast } from 'sonner'

// Simple
toast.success('Changes saved successfully')
toast.error('Failed to save changes')
toast.warning('Your session will expire soon')
toast.info('New version available')

// With description
toast.success('File uploaded', { description: 'document.pdf has been uploaded to your workspace' })

// With action
toast('New message from Sarah', {
  description: 'Hey, are we still meeting tomorrow?',
  action: { label: 'Reply', onClick: () => router.push('/messages') },
})

// Promise-based (auto loading → success/error)
toast.promise(saveData(), {
  loading: 'Saving changes...',
  success: 'Changes saved!',
  error: 'Could not save changes',
})

// Persistent (manual dismiss)
toast.warning('Unsaved changes', {
  duration: Infinity,
  action: { label: 'Save', onClick: () => save() },
  cancel: { label: 'Discard', onClick: () => discard() },
})
```

## Alert Banners (Top of Page)

```tsx
function AlertBanner({ variant, message, dismissible = true, onDismiss }: AlertBannerProps) {
  const styles = {
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  }

  const icons = {
    info: <Info className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
  }

  return (
    <div className={cn("flex items-center gap-3 border-b px-4 py-2.5 text-sm", styles[variant])}>
      {icons[variant]}
      <p className="flex-1">{message}</p>
      {dismissible && (
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// Usage: place above main content
<AlertBanner variant="warning" message="Scheduled maintenance on Feb 15, 2026 from 2-4am UTC." />
```

## Inline Alerts (shadcn Alert)

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Informational
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
</Alert>

// Destructive
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
</Alert>

// Success (custom variant)
<Alert className="border-green-500/20 text-green-700 dark:text-green-400 [&>svg]:text-green-500">
  <CheckCircle2 className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>
```

## Notification Dropdown

```tsx
interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description: string
  timeAgo: string
  read: boolean
  avatar?: string
}

function NotificationCenter({ notifications }: { notifications: NotificationItem[] }) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="text-sm font-semibold">Notifications</h4>
          <Button variant="ghost" size="sm" className="text-xs h-7">Mark all read</Button>
        </div>
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BellOff className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                {!n.read && <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                {n.read && <div className="mt-2 h-2 w-2 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.timeAgo}</p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">View all notifications</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## Empty States

```tsx
function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// Usage
<EmptyState
  icon={Inbox}
  title="No messages"
  description="When you receive messages, they'll appear here."
  action={<Button>Compose Message</Button>}
/>
```

## Confirmation Dialog

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="sm">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account and all associated data.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Delete Account
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Astro Integration

```astro
---
// Astro: Toaster must be inside a React island
import { Toaster } from '../components/ui/sonner'
import { NotificationCenter } from '../components/NotificationCenter'
---

<Layout>
  <header>
    <NotificationCenter client:load notifications={[]} />
  </header>
  <main>
    <slot />
  </main>
  <Toaster client:load richColors position="bottom-right" />
</Layout>
```

## Best Practices

1. **Sonner for transient feedback**: Use `toast()` for save confirmations, errors, actions
2. **Banners for persistent messages**: Maintenance notices, trial expiring, feature announcements
3. **Inline alerts for contextual feedback**: Form errors, section warnings, success states
4. **Notification center for async events**: New messages, status changes, team activity
5. **Confirmation dialogs for destructive actions**: Delete, cancel subscription, leave team
6. **Empty states for zero-data views**: Always show icon + title + description + action
7. **Never block user flow**: Toasts auto-dismiss, banners are dismissible, alerts are inline
8. **Accessible**: Toast announcements use aria-live, alerts use role="alert"
