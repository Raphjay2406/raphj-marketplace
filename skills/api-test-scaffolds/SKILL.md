---
name: api-test-scaffolds
description: Integration test suites for API routes. Supertest + Vitest + Zod schema assertions + mocked external services. Per-route test file auto-generated from /gen:api scaffolds.
tier: domain
triggers: api-tests, supertest, integration-tests, zod-assertions
version: 0.1.0
---

# API Test Scaffolds

Every route scaffolded by `/gen:api` gets a test file.

## Layer 1 — Structure

```ts
// tests/api/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/signup/route';

describe('POST /api/auth/signup', () => {
  it('accepts valid signup', async () => {
    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'validPassword123!' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({ user: expect.any(Object) });
  });

  it('rejects weak password', async () => {
    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'weak' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles rate limit', async () => {
    // 10 rapid requests
    const requests = Array.from({ length: 11 }, () => POST(makeReq()));
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

## Layer 2 — External service mocking

Use `msw` (Mock Service Worker) for HTTP mocks:

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.post('https://api.stripe.com/v1/customers', () => {
    return HttpResponse.json({ id: 'cus_test_123' });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
```

## Layer 3 — DB mocking

For schema-coupled tests: use real test DB via testcontainers (Postgres in Docker) OR `@testing-library/db-mock` for unit tests.

```ts
// Test DB via testcontainers
import { PostgreSqlContainer } from '@testcontainers/postgresql';

let container;
beforeAll(async () => {
  container = await new PostgreSqlContainer().start();
  process.env.DATABASE_URL = container.getConnectionUri();
  await runMigrations();
});
afterAll(() => container.stop());
```

## Layer 4 — Webhook signature verification tests

For webhook endpoints:

```ts
it('rejects missing signature', async () => {
  const res = await POST(new Request('/', { method: 'POST', body: '{}' }));
  expect(res.status).toBe(400);
});

it('accepts valid signature', async () => {
  const payload = JSON.stringify({ type: 'test' });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: 'test_secret' });
  const res = await POST(new Request('/', {
    method: 'POST',
    body: payload,
    headers: { 'stripe-signature': sig },
  }));
  expect(res.status).toBe(200);
});
```

## Layer 5 — Integration

- `/gen:api <template>` auto-creates matching test file
- CI: `npm test` runs suite
- Coverage target: 80% of happy path + 3 error paths per route
- Ledger: `api-test-failed`

## Layer 6 — Anti-patterns

- ❌ Skipping rate-limit tests — silent breakage
- ❌ Mocking database with incorrect schema — tests pass, prod fails
- ❌ No webhook signature test — signature verification regressions slip
- ❌ Real API calls to external services — flaky + cost
