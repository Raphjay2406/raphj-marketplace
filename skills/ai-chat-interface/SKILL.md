---
name: ai-chat-interface
description: "AI chat interface patterns: streaming responses, message bubbles, code highlighting, model selector, chat history, file attachments, typing indicators. Works with Next.js and Astro."
---

Use this skill when the user mentions AI chat, chatbot, chat interface, streaming response, message bubbles, chat UI, conversational UI, LLM interface, or AI assistant. Triggers on: chat, chatbot, AI assistant, streaming, message, conversation, LLM, GPT, Claude.

You are an expert at building polished AI chat interfaces with streaming, code highlighting, and rich interactions.

## Chat Layout Shell

```tsx
// Next.js: app/chat/layout.tsx
// Astro: Use as a React island with client:load
'use client'

export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar: Chat History */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30">
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <h2 className="text-sm font-semibold">Chats</h2>
          <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          {conversations.map((c) => (
            <button
              key={c.id}
              className={cn(
                "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                c.active ? "bg-accent" : "hover:bg-accent/50"
              )}
            >
              <p className="truncate font-medium">{c.title}</p>
              <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
            </button>
          ))}
        </ScrollArea>
      </aside>

      {/* Main chat area */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
```

## Message Bubbles with Markdown + Code

```tsx
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn("flex gap-3 px-4", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>

      <div className={cn("max-w-[80%] space-y-2", isUser && "text-right")}>
        <div className={cn(
          "inline-block rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        )}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match
                  return isInline ? (
                    <code className="rounded bg-black/10 px-1.5 py-0.5 text-xs font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="relative my-2 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2 text-xs text-white/60">
                        <span>{match[1]}</span>
                        <Button
                          variant="ghost" size="sm"
                          className="h-6 text-xs text-white/60 hover:text-white"
                          onClick={() => navigator.clipboard.writeText(String(children))}
                        >
                          <Copy className="h-3 w-3 mr-1" />Copy
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0 }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          {message.streaming && (
            <span className="inline-block w-1.5 h-4 bg-foreground/70 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground px-1">{message.timestamp}</p>
      </div>
    </div>
  )
}
```

## Chat Input with Auto-Resize

```tsx
'use client'
import { useRef, useState, useCallback } from 'react'

export function ChatInput({ onSend, isStreaming }: { onSend: (msg: string) => void; isStreaming: boolean }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
    }
  }, [])

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-2xl border bg-muted/30 p-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); adjustHeight() }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
            }}
            placeholder="Type a message..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[36px] py-2"
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={isStreaming || !input.trim()}
            className="flex-shrink-0 rounded-xl"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
```

## Streaming Response Hook

```tsx
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = async (content: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date() }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true, timestamp: new Date() }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsStreaming(true)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
        signal: abortRef.current.signal,
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages(prev =>
          prev.map(m => m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m)
        )
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m => m.id === assistantMsg.id
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
          )
        )
      }
    } finally {
      setMessages(prev =>
        prev.map(m => m.id === assistantMsg.id ? { ...m, streaming: false } : m)
      )
      setIsStreaming(false)
    }
  }

  const stopStreaming = () => abortRef.current?.abort()

  return { messages, isStreaming, sendMessage, stopStreaming }
}
```

## Model Selector

```tsx
function ModelSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const models = [
    { id: 'claude-sonnet', name: 'Claude Sonnet', description: 'Fast and capable' },
    { id: 'claude-opus', name: 'Claude Opus', description: 'Most intelligent' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'OpenAI flagship' },
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {models.map(m => (
          <SelectItem key={m.id} value={m.id}>
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Typing Indicator

```tsx
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4">
      <Avatar className="h-8 w-8"><AvatarFallback className="bg-muted">AI</AvatarFallback></Avatar>
      <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3 rounded-bl-md">
        <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}
```

## Next.js API Route (Streaming)

```tsx
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 4096,
    messages,
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(event.delta.text))
          }
        }
        controller.close()
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
```

## Astro: Chat as React Island

```astro
---
// src/pages/chat.astro
import Layout from '../layouts/Layout.astro'
import { ChatPage } from '../components/ChatPage'
---

<Layout title="AI Chat">
  <ChatPage client:load />
</Layout>
```

```tsx
// src/components/ChatPage.tsx — React component with client:load
export function ChatPage() {
  const { messages, isStreaming, sendMessage, stopStreaming } = useChat()

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center justify-between border-b px-4">
        <h1 className="text-sm font-semibold">AI Chat</h1>
        <ModelSelector value={model} onChange={setModel} />
      </header>
      <ScrollArea className="flex-1 py-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          {isStreaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
        </div>
      </ScrollArea>
      <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  )
}
```

## Best Practices

1. **Stream token by token**: Use ReadableStream for real-time response rendering
2. **Auto-resize textarea**: Grow to content, cap at max-height, shrink on clear
3. **Code blocks with copy**: Language label + copy button on every code fence
4. **Abort support**: Let users stop generation mid-stream with AbortController
5. **Scroll to bottom**: Auto-scroll during streaming, but not if user scrolled up
6. **Keyboard shortcuts**: Enter sends, Shift+Enter adds newline
7. **Accessible**: aria-live on message list, proper roles on chat elements
8. **Astro**: Use `client:load` for the full chat island — it's fully interactive
