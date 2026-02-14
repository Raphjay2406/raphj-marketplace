---
name: testing-patterns
description: "Testing patterns: Vitest, React Testing Library, accessibility testing, visual regression, E2E with Playwright, MSW mocking, snapshot testing. Works with Next.js and Astro."
---

Use this skill when the user mentions testing, unit tests, integration tests, E2E tests, Vitest, Playwright, Testing Library, test coverage, a11y testing, or visual regression. Triggers on: test, testing, vitest, playwright, jest, testing library, E2E, coverage, a11y test, visual regression, MSW.

You are an expert at building comprehensive test suites for modern web applications.

## Vitest Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

```ts
// tests/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())
```

## Component Testing (React Testing Library)

```tsx
// components/__tests__/Counter.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Counter } from '../Counter'

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('disables at max count', async () => {
    const user = userEvent.setup()
    render(<Counter max={2} />)

    await user.click(screen.getByRole('button', { name: /increment/i }))
    await user.click(screen.getByRole('button', { name: /increment/i }))

    expect(screen.getByRole('button', { name: /increment/i })).toBeDisabled()
  })
})
```

## Form Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })

  it('submits with valid data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })
})
```

## API Mocking with MSW

```bash
npm install -D msw
```

```ts
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ])
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '3', ...body }, { status: 201 })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    return new HttpResponse(null, { status: 204 })
  }),
]
```

```ts
// tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

```ts
// tests/setup.ts — add MSW
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

```tsx
// Usage in test: override handler for specific test
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

it('shows error state on API failure', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.json({ error: 'Server error' }, { status: 500 }))
  )

  render(<UserList />)
  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument()
})
```

## Accessibility Testing

```bash
npm install -D vitest-axe
```

```tsx
import { axe, toHaveNoViolations } from 'vitest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  it('LoginForm has no a11y violations', async () => {
    const { container } = render(<LoginForm onSubmit={vi.fn()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Navigation has proper ARIA attributes', () => {
    render(<Navigation />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label')
  })

  it('Dialog is keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<EditDialog />)

    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

## E2E with Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

```ts
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can log in', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrong')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})
```

## Hook Testing

```tsx
import { renderHook, act } from '@testing-library/react'

describe('useCounter', () => {
  it('increments and decrements', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => result.current.increment())
    expect(result.current.count).toBe(1)

    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)
  })
})
```

## Astro Component Testing

```ts
// Astro components test with Playwright or container testing
// For React islands, test the React component directly with Vitest + RTL

// For full page testing:
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage renders correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('navigation')).toBeVisible()
})
```

## Best Practices

1. **Test behavior, not implementation**: Query by role, label, text — never by class name or test ID (unless necessary)
2. **userEvent over fireEvent**: `userEvent.setup()` simulates real user interactions
3. **MSW for API mocking**: Mock at the network level, not the module level
4. **Accessibility tests on every component**: `vitest-axe` catches WCAG violations automatically
5. **E2E for critical flows**: Login, checkout, onboarding — test the full user journey
6. **Run tests in CI**: `vitest run --coverage` for unit, `npx playwright test` for E2E
7. **Never test styling**: Test that elements exist and behave correctly, not their CSS
8. **Arrange-Act-Assert**: Clear structure in every test case
