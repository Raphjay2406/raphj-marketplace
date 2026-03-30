---
name: social-features
description: "Social feature patterns: threaded comments, reactions/emoji picker, share buttons, embed cards, social proof widgets, user mentions, like/upvote system, follow buttons. Works with Next.js and Astro."
---

Use this skill when the user mentions comments, reactions, share buttons, social proof, mentions, likes, upvotes, follow, or social features. Triggers on: comments, reactions, share, social proof, mentions, likes, upvote, follow, emoji.

You are an expert at building social interaction UIs with shadcn/ui.

## Threaded Comments

```tsx
interface Comment {
  id: string; author: { name: string; avatar: string }; content: string;
  createdAt: string; likes: number; liked: boolean; replies?: Comment[]
}

function CommentThread({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [replying, setReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  return (
    <div className={cn(depth > 0 && 'ml-8 pl-4 border-l-2')}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className={cn('flex items-center gap-1 text-xs', comment.liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground')}>
              <Heart className={cn('h-3.5 w-3.5', comment.liked && 'fill-current')} />
              {comment.likes}
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setReplying(!replying)}>
              Reply
            </button>
          </div>
          {replying && <CommentInput className="mt-3" onSubmit={() => setReplying(false)} placeholder="Write a reply..." />}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {!showReplies ? (
            <button className="text-xs text-primary ml-11" onClick={() => setShowReplies(true)}>
              Show {comment.replies.length} replies
            </button>
          ) : (
            <div className="space-y-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CommentInput({ onSubmit, placeholder, className }: { onSubmit: (text: string) => void; placeholder?: string; className?: string }) {
  const [text, setText] = useState('')
  return (
    <div className={cn('flex gap-3', className)}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea placeholder={placeholder ?? 'Write a comment...'} value={text} onChange={e => setText(e.target.value)} rows={2} className="resize-none" />
        <div className="flex justify-end mt-2">
          <Button size="sm" disabled={!text.trim()} onClick={() => { onSubmit(text); setText('') }}>Post</Button>
        </div>
      </div>
    </div>
  )
}
```

## Reaction Bar

```tsx
const reactions = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '🎉', label: 'Celebrate' },
]

function ReactionBar({ counts, userReaction, onReact }: {
  counts: Record<string, number>; userReaction: string | null; onReact: (emoji: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {reactions.map(r => {
        const count = counts[r.emoji] || 0
        const isActive = userReaction === r.emoji
        return (
          <button
            key={r.emoji}
            onClick={() => onReact(r.emoji)}
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors',
              isActive ? 'bg-primary/10 text-primary border border-primary/30' : 'hover:bg-accent border border-transparent'
            )}
            title={r.label}
          >
            <span>{r.emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
```

## Share Buttons

```tsx
function ShareButtons({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const platforms = [
    { name: 'Twitter', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`, icon: Twitter },
    { name: 'LinkedIn', href: `https://linkedin.com/sharing/share-offsite/?url=${encoded}`, icon: Linkedin },
    { name: 'Facebook', href: `https://facebook.com/sharer/sharer.php?u=${encoded}`, icon: Facebook },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  return (
    <div className="flex items-center gap-2">
      {platforms.map(p => (
        <Button key={p.name} variant="outline" size="icon" asChild>
          <a href={p.href} target="_blank" rel="noopener noreferrer" title={`Share on ${p.name}`}>
            <p.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <Button variant="outline" size="icon" onClick={copyLink} title="Copy link">
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

## Social Proof Widget

```tsx
function SocialProof({ avatars, count, label }: { avatars: string[]; count: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {avatars.slice(0, 5).map((src, i) => (
          <Avatar key={i} className="h-8 w-8 border-2 border-background">
            <AvatarImage src={src} />
            <AvatarFallback className="text-xs">{i + 1}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="text-sm">
        <span className="font-semibold">{count.toLocaleString()}+</span>
        <span className="text-muted-foreground ml-1">{label}</span>
      </div>
    </div>
  )
}

// Usage
<SocialProof avatars={userAvatars} count={12500} label="developers trust us" />
```

## Best Practices

1. Threaded comments: max 3 levels deep, then collapse with "Show N replies"
2. Reactions: show emoji + count, highlight user's own reaction
3. Share buttons: open in popup window (600x400), include copy-to-clipboard
4. Social proof: overlapping avatars + count + trust phrase
5. Comments: textarea with avatar, submit disabled when empty
6. Like/heart: toggle with fill animation, optimistic update
7. Mentions: use `@` trigger with Command/Popover autocomplete
8. For Astro: mount comment/reaction components as React islands with `client:visible`
9. Always show relative time ("2h ago") not absolute timestamps
10. Rate limit reactions/comments on the server side
