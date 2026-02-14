---
name: real-time-ui
description: "Real-time UI patterns: WebSocket connections, presence indicators, live cursors, streaming AI responses, notification badges, optimistic UI with conflict resolution."
---

Use this skill when the user mentions real-time, WebSocket, live updates, presence, online status, live cursors, chat, streaming, SSE, notifications, or collaborative features. Triggers on: real-time, websocket, live, presence, online, cursor, streaming, SSE, notification badge, collaborative.

You are an expert at building real-time UIs that feel alive and responsive.

## Presence Indicators

```tsx
// Online/offline dot
function PresenceDot({ status }: { status: 'online' | 'away' | 'offline' }) {
  return (
    <span className={cn(
      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
      status === 'online' && "bg-green-500",
      status === 'away' && "bg-yellow-500",
      status === 'offline' && "bg-gray-400",
    )} />
  )
}

// Avatar with presence
function UserAvatar({ user }: { user: User }) {
  return (
    <div className="relative">
      <Avatar><AvatarImage src={user.avatar} /><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
      <PresenceDot status={user.status} />
    </div>
  )
}

// "X people viewing" indicator
function ViewerCount({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      {count} {count === 1 ? 'person' : 'people'} viewing
    </div>
  )
}
```

## Streaming AI Chat Interface

```tsx
'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      setMessages((prev) =>
        prev.map((m) => m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m)
      )
    }

    setMessages((prev) =>
      prev.map((m) => m.id === assistantMsg.id ? { ...m, streaming: false } : m)
    )
    setIsStreaming(false)
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="flex flex-col h-[600px] rounded-xl border">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' && "flex-row-reverse")}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>{msg.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
              </Avatar>
              <div className={cn(
                "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm",
                msg.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}>
                {msg.content}
                {msg.streaming && <span className="inline-block w-1.5 h-4 bg-foreground/70 ml-0.5 animate-pulse" />}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isStreaming}
          />
          <Button type="submit" size="icon" disabled={isStreaming || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
```

## Notification System

```tsx
// Badge with count
function NotificationBell({ count }: { count: number }) {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  )
}

// Notification dropdown
function NotificationCenter({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild><NotificationBell count={notifications.filter(n => !n.read).length} /></PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <Button variant="ghost" size="sm" className="text-xs">Mark all read</Button>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.map((n) => (
            <div key={n.id} className={cn("flex gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer", !n.read && "bg-primary/5")}>
              <div className={cn("mt-1 h-2 w-2 rounded-full flex-shrink-0", n.read ? "bg-transparent" : "bg-primary")} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.timeAgo}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
```

## WebSocket Connection Hook
```tsx
export function useWebSocket(url: string) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [lastMessage, setLastMessage] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    const ws = new WebSocket(url)
    wsRef.current = ws
    setStatus('connecting')

    ws.onopen = () => setStatus('connected')
    ws.onmessage = (e) => setLastMessage(JSON.parse(e.data))
    ws.onclose = () => {
      setStatus('disconnected')
      reconnectRef.current = setTimeout(connect, 3000) // Auto-reconnect
    }
  }, [url])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectRef.current)
      wsRef.current?.close()
    }
  }, [connect])

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  return { status, lastMessage, send }
}
```

## Best Practices

1. **Auto-reconnect**: WebSocket connections drop — always reconnect with backoff
2. **Optimistic first**: Show changes instantly, sync in background, rollback on conflict
3. **Presence is lightweight**: Send heartbeats every 30s, mark offline after 60s silence
4. **Stream token by token**: For AI responses, stream individual tokens for responsiveness
5. **Debounce cursor updates**: Send cursor position at most every 50ms, not every mousemove
6. **Connection status UI**: Show a subtle banner when disconnected, auto-dismiss on reconnect
7. **Queue when offline**: Buffer messages during disconnection, send when reconnected
