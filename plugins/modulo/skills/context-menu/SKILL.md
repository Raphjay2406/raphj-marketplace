# Context Menu & Command Palette

Right-click context menus, command palette (Cmd+K), keyboard shortcuts system, and advanced menu interactions.

## Right-Click Context Menu

```tsx
"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import {
  Copy,
  Clipboard,
  Trash2,
  Share,
  Edit,
  Star,
  FolderPlus,
  Download,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";

interface FileContextMenuProps {
  children: React.ReactNode;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onRename: () => void;
  onShare: () => void;
  onDownload: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function FileContextMenu({
  children,
  onCopy,
  onPaste,
  onDelete,
  onRename,
  onShare,
  onDownload,
  onToggleFavorite,
  isFavorite,
}: FileContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onPaste}>
          <Clipboard className="mr-2 h-4 w-4" />
          Paste
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onRename}>
          <Edit className="mr-2 h-4 w-4" />
          Rename
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share className="mr-2 h-4 w-4" />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Copy Link</ContextMenuItem>
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuItem>Slack</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderPlus className="mr-2 h-4 w-4" />
            Move to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Documents</ContextMenuItem>
            <ContextMenuItem>Archive</ContextMenuItem>
            <ContextMenuItem>Trash</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuCheckboxItem checked={isFavorite} onClick={onToggleFavorite}>
          <Star className="mr-2 h-4 w-4" />
          Favorite
        </ContextMenuCheckboxItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Advanced Command Palette (Cmd+K)

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Home,
  Settings,
  User,
  FileText,
  Search,
  Moon,
  Sun,
  LogOut,
  Plus,
  Zap,
  HelpCircle,
  Keyboard,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  group: string;
  onSelect: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  // Register Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions: CommandAction[] = [
    // Navigation
    { id: "home", label: "Go to Home", icon: Home, group: "Navigation", onSelect: () => router.push("/"), keywords: ["dashboard"] },
    { id: "settings", label: "Go to Settings", icon: Settings, group: "Navigation", shortcut: "Ctrl+,", onSelect: () => router.push("/settings") },
    { id: "profile", label: "Go to Profile", icon: User, group: "Navigation", onSelect: () => router.push("/profile") },

    // Actions
    { id: "new-doc", label: "Create New Document", icon: Plus, group: "Actions", shortcut: "Ctrl+N", onSelect: () => router.push("/new") },
    { id: "search-docs", label: "Search Documents", icon: Search, group: "Actions", shortcut: "Ctrl+F", onSelect: () => {} },

    // Theme
    {
      id: "toggle-theme",
      label: resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      icon: resolvedTheme === "dark" ? Sun : Moon,
      group: "Preferences",
      onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },

    // Help
    { id: "help", label: "Help & Support", icon: HelpCircle, group: "Help", onSelect: () => router.push("/help") },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard, group: "Help", shortcut: "Ctrl+/", onSelect: () => {} },
    { id: "logout", label: "Sign Out", icon: LogOut, group: "Account", onSelect: () => {} },
  ];

  // Group actions
  const groups = actions.reduce((acc, action) => {
    if (!acc[action.group]) acc[action.group] = [];
    acc[action.group].push(action);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groups).map(([group, items], i) => (
          <div key={group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((action) => (
                <CommandItem
                  key={action.id}
                  value={`${action.label} ${action.keywords?.join(" ") ?? ""}`}
                  onSelect={() => {
                    action.onSelect();
                    setOpen(false);
                  }}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
```

## Keyboard Shortcuts Hook

```tsx
"use client";

import { useEffect, useCallback } from "react";

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Usage
function App() {
  useKeyboardShortcuts([
    { key: "n", ctrl: true, handler: () => createNew(), description: "Create new item" },
    { key: "s", ctrl: true, handler: () => save(), description: "Save" },
    { key: "/", ctrl: true, handler: () => showHelp(), description: "Show shortcuts" },
    { key: "Escape", handler: () => closeDialog(), description: "Close dialog" },
  ]);
}
```

## Keyboard Shortcuts Dialog

```tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShortcutInfo {
  keys: string[];
  description: string;
  group: string;
}

const shortcuts: ShortcutInfo[] = [
  { keys: ["Ctrl", "K"], description: "Open command palette", group: "General" },
  { keys: ["Ctrl", "N"], description: "Create new item", group: "General" },
  { keys: ["Ctrl", "S"], description: "Save changes", group: "General" },
  { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts", group: "General" },
  { keys: ["Esc"], description: "Close dialog / cancel", group: "General" },
  { keys: ["Ctrl", "Z"], description: "Undo", group: "Editing" },
  { keys: ["Ctrl", "Shift", "Z"], description: "Redo", group: "Editing" },
  { keys: ["Ctrl", "B"], description: "Bold text", group: "Editing" },
  { keys: ["J"], description: "Next item", group: "Navigation" },
  { keys: ["K"], description: "Previous item", group: "Navigation" },
];

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const groups = shortcuts.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {} as Record<string, ShortcutInfo[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">{group}</h4>
              <div className="space-y-2">
                {items.map((s) => (
                  <div key={s.description} className="flex items-center justify-between">
                    <span className="text-sm">{s.description}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key) => (
                        <kbd
                          key={key}
                          className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Key Rules

- Context menu: use shadcn/ui `ContextMenu` — accessible, keyboard navigable
- Submenus: use `ContextMenuSub` for nested options (Share, Move to)
- Destructive items: red text via `text-destructive` class
- Command palette: Cmd+K to toggle, fuzzy search via `value` prop with keywords
- Group actions logically: Navigation, Actions, Preferences, Help
- Always show keyboard shortcuts in menu items via `CommandShortcut` / `ContextMenuShortcut`
- Keyboard shortcuts hook: ignore events in inputs/textareas/contenteditable
- Use `e.metaKey || e.ctrlKey` for cross-platform Cmd/Ctrl support
- Shortcuts dialog: group by category, show as `<kbd>` elements
