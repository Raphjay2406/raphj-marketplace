# Real-Time Collaboration

Live cursors, collaborative editing with Yjs, presence indicators, conflict resolution, and real-time multiplayer UI patterns.

## Yjs + TipTap Collaborative Editor

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useMemo } from "react";

const colors = [
  "#f87171", "#fb923c", "#facc15", "#4ade80",
  "#22d3ee", "#818cf8", "#e879f9", "#f472b6",
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function CollaborativeEditor({
  roomId,
  userName,
}: {
  roomId: string;
  userName: string;
}) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const provider = useMemo(
    () =>
      new WebsocketProvider(
        process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL!,
        roomId,
        ydoc
      ),
    [roomId, ydoc]
  );

  useEffect(() => {
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: { name: userName, color: getRandomColor() },
      }),
    ],
  });

  return (
    <div className="rounded-lg border">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <PresenceAvatars provider={provider} />
      </div>
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus-within:outline-none"
      />
    </div>
  );
}
```

## Presence Avatars

```tsx
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WebsocketProvider } from "y-websocket";

interface UserPresence {
  name: string;
  color: string;
}

export function PresenceAvatars({ provider }: { provider: WebsocketProvider }) {
  const [users, setUsers] = useState<Map<number, UserPresence>>(new Map());

  useEffect(() => {
    const awareness = provider.awareness;

    function updateUsers() {
      const states = awareness.getStates() as Map<number, { user?: UserPresence }>;
      const userMap = new Map<number, UserPresence>();
      states.forEach((state, clientId) => {
        if (state.user && clientId !== awareness.clientID) {
          userMap.set(clientId, state.user);
        }
      });
      setUsers(userMap);
    }

    awareness.on("change", updateUsers);
    updateUsers();

    return () => awareness.off("change", updateUsers);
  }, [provider]);

  const userList = Array.from(users.values());

  if (userList.length === 0) {
    return <span className="text-xs text-muted-foreground">Only you</span>;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {userList.slice(0, 5).map((user, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Avatar
                className="h-7 w-7 border-2 border-background"
                style={{ zIndex: userList.length - i }}
              >
                <AvatarFallback
                  className="text-[10px] text-white font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{user.name}</TooltipContent>
          </Tooltip>
        ))}
        {userList.length > 5 && (
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarFallback className="text-[10px]">
              +{userList.length - 5}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="ml-3 text-xs text-muted-foreground">
          {userList.length + 1} online
        </span>
      </div>
    </TooltipProvider>
  );
}
```

## Live Cursors

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CursorPosition {
  x: number;
  y: number;
  name: string;
  color: string;
}

export function LiveCursors({
  children,
  channel,
  userName,
  userColor,
}: {
  children: React.ReactNode;
  channel: BroadcastChannel;
  userName: string;
  userColor: string;
}) {
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      channel.postMessage({
        type: "cursor",
        userId: userName,
        x,
        y,
        name: userName,
        color: userColor,
      });
    },
    [channel, userName, userColor]
  );

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (data.type === "cursor" && data.userId !== userName) {
        setCursors((prev) => {
          const next = new Map(prev);
          next.set(data.userId, {
            x: data.x,
            y: data.y,
            name: data.name,
            color: data.color,
          });
          return next;
        });
      }
    }

    channel.addEventListener("message", onMessage);
    return () => channel.removeEventListener("message", onMessage);
  }, [channel, userName]);

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      {children}

      {/* Render other cursors */}
      {Array.from(cursors.entries()).map(([id, cursor]) => (
        <div
          key={id}
          className="pointer-events-none absolute z-50 transition-all duration-100"
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
          }}
        >
          {/* Cursor arrow */}
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill={cursor.color}
            className="drop-shadow-sm"
          >
            <path d="M0 0L16 12L8 12L4 20L0 0Z" />
          </svg>
          {/* Name label */}
          <span
            className="ml-4 -mt-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </span>
        </div>
      ))}
    </div>
  );
}
```

## Conflict Resolution Banner

```tsx
"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConflictBannerProps {
  message: string;
  onKeepMine: () => void;
  onKeepTheirs: () => void;
  onMerge: () => void;
}

export function ConflictBanner({
  message,
  onKeepMine,
  onKeepTheirs,
  onMerge,
}: ConflictBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
      <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
      <p className="flex-1 text-sm text-yellow-800 dark:text-yellow-200">
        {message}
      </p>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onKeepMine}>
          Keep Mine
        </Button>
        <Button variant="outline" size="sm" onClick={onKeepTheirs}>
          Keep Theirs
        </Button>
        <Button size="sm" onClick={onMerge}>
          Merge
        </Button>
      </div>
    </div>
  );
}
```

## Real-Time Status Indicator

```tsx
interface OnlineStatusProps {
  status: "online" | "away" | "busy" | "offline";
  showLabel?: boolean;
}

const statusConfig = {
  online: { color: "bg-green-500", label: "Online" },
  away: { color: "bg-yellow-500", label: "Away" },
  busy: { color: "bg-red-500", label: "Busy" },
  offline: { color: "bg-gray-400", label: "Offline" },
};

export function OnlineStatus({ status, showLabel = false }: OnlineStatusProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        {status === "online" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.color}`} />
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}
```

## Key Rules

- Use Yjs for CRDT-based collaborative editing — handles conflicts automatically
- `y-websocket` for WebSocket transport, `y-indexeddb` for offline persistence
- TipTap: disable built-in history when using Collaboration extension
- Live cursors: broadcast relative positions (%) not absolute pixels
- Cursor SVG: small arrow pointer with colored name label
- Presence avatars: stacked with negative margin, cap at 5 + overflow count
- Awareness API: track user presence, cursor positions, and selection state
- Conflict resolution: offer Keep Mine / Keep Theirs / Merge options
- Online status: pulsing green dot for online, static dots for other states
- Clean up Yjs doc and provider in useEffect cleanup to prevent memory leaks
