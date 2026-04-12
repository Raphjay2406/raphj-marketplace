---
name: supabase-realtime
description: Supabase Realtime — Postgres Changes (table subscriptions), Presence (who's online), Broadcast (ephemeral messages). React hooks pattern for live data.
tier: domain
triggers: supabase-realtime, postgres-changes, presence, broadcast, live-data
version: 0.1.0
---

# Supabase Realtime

## Layer 1 — Three channels

| Kind | Use case | Latency |
|---|---|---|
| Postgres Changes | Listen to INSERT/UPDATE/DELETE on specific tables | ~100ms |
| Presence | Who's currently connected (with shared state) | ~50ms |
| Broadcast | Ephemeral messages between clients | ~20ms |

## Layer 2 — Postgres Changes

```ts
// Enable on table (one-time)
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

// Subscribe
useEffect(() => {
  const channel = supabase.channel('posts-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => setPosts(p => [...p, payload.new]))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' },
      (payload) => setPosts(p => p.map(x => x.id === payload.new.id ? payload.new : x)))
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

RLS applies — users only receive events for rows they can read.

## Layer 3 — Presence

```ts
const channel = supabase.channel('room-123');

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    setOnlineUsers(Object.values(state).flat());
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('joined:', key);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('left:', key);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ user: userId, online_at: new Date().toISOString() });
    }
  });
```

Great for collaborative docs, live chat rooms, "X people viewing this product".

## Layer 4 — Broadcast

```ts
const channel = supabase.channel('cursors');

// Send
channel.send({ type: 'broadcast', event: 'cursor', payload: { x, y, user: userId } });

// Receive
channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
  renderCursor(payload);
});
channel.subscribe();
```

Used for live cursors, typing indicators, ephemeral collab signals.

## Layer 5 — React hook pattern

```tsx
// hooks/useRealtimePost.ts
export function useRealtimePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('posts').select('*').eq('id', postId).single()
      .then(({ data }) => setPost(data));

    const channel = supabase.channel(`post:${postId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts', filter: `id=eq.${postId}` },
        ({ new: updated }) => setPost(updated as Post))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  return post;
}
```

## Layer 6 — Rate limits + scale

- 100 simultaneous channels per client
- 200 messages/second per channel
- Horizontal scale with Supabase Pro

For high-traffic (>100 concurrent subscribers per channel): consider partitioning or Push Protocol.

## Layer 7 — Integration

- `/gen:supabase realtime <table>` enables realtime + scaffolds subscription hook
- Chains with UI components via useRealtimePost-style hooks
- Ledger: `realtime-channel-opened` (rate-limited)

## Layer 8 — Anti-patterns

- ❌ Subscribing without unsubscribing — connection leak
- ❌ Realtime everywhere (even static content) — battery drain
- ❌ Presence on public pages — anonymous user floods
- ❌ Broadcast for persistent data — use Postgres Changes instead
- ❌ No RLS → realtime leaks — publication still respects RLS, but misconfigured policies leak live too
