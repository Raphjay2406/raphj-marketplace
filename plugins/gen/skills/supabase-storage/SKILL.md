---
name: supabase-storage
description: Supabase Storage — bucket creation, signed URLs, direct browser upload with RLS policies, image transformation API, CDN delivery.
tier: domain
triggers: supabase-storage, bucket, signed-url, image-transform, file-upload
version: 0.1.0
---

# Supabase Storage

## Layer 1 — Bucket setup

```sql
-- Private bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('avatars', 'avatars', false, 5242880, ARRAY['image/jpeg','image/png','image/webp']);

-- Public bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);
```

## Layer 2 — Policies (inherit RLS)

```sql
-- Users can only upload/read own avatar
CREATE POLICY "Users manage own avatar" ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read on blog images
CREATE POLICY "Public read blog" ON storage.objects FOR SELECT
  USING (bucket_id = 'blog');

-- Authenticated write blog (for authors)
CREATE POLICY "Authors write blog" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog' AND auth.role() = 'authenticated');
```

## Layer 3 — Direct browser upload

```ts
// Client
const file = event.target.files[0];
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.webp`, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'image/webp',
  });
```

Browser uploads direct to Supabase Storage; policies enforced server-side.

## Layer 4 — Signed URL (time-limited access)

```ts
// Server action
const { data } = await supabase.storage
  .from('private-documents')
  .createSignedUrl(`${userId}/invoice.pdf`, 3600);  // 1 hour
// data.signedUrl → give to client
```

## Layer 5 — Image transformation

Supabase renders on-the-fly:

```ts
const { data } = supabase.storage
  .from('blog')
  .getPublicUrl('hero.webp', {
    transform: { width: 800, height: 600, resize: 'cover', quality: 80 },
  });
```

Reduces need to pre-compute multiple sizes.

## Layer 6 — Integration

- Env: same as supabase-auth (url + anon key + service role)
- `/gen:supabase storage <bucket>` scaffolds bucket + RLS policies
- Chains with asset-forge-manifest — uploaded assets recorded
- CDN auto-enabled on Supabase Pro

## Layer 7 — Anti-patterns

- ❌ Public bucket for user-uploaded content without moderation — NSFW + legal exposure
- ❌ No `file_size_limit` — abusers upload GB files
- ❌ No `allowed_mime_types` — users upload .exe as avatar.png
- ❌ Signed URL too long (> 1 day) — credential equivalent; scope short
- ❌ Transform API on every request — cache transformed CDN URL
