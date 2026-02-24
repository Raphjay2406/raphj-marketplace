# Generate Tests

Generate comprehensive test suites for components and pages in the project.

## Process

### Phase 1: Discover Components
1. Scan `src/components/` and `app/` for React components
2. Identify components WITHOUT existing test files
3. Prioritize: shared components > page components > utility components

### Phase 2: Analyze Each Component
For each component, determine:
- Props interface and required/optional props
- User interactions (clicks, inputs, form submissions)
- Conditional rendering paths
- Async operations (data fetching, mutations)
- Accessibility requirements (ARIA, roles)

### Phase 3: Generate Test Files
For each component, create a test file with:

**Unit Tests (Vitest + React Testing Library):**
- Renders without crashing
- Renders with required props
- Renders conditional content correctly
- Handles user interactions
- Handles edge cases (empty data, error states)
- Accessibility: correct roles and aria attributes

**Pattern:**
```
ComponentName.test.tsx → alongside ComponentName.tsx
```

### Phase 4: Generate E2E Tests
For critical user flows, create Playwright tests:
- Navigation flows
- Form submission flows
- Authentication flows
- CRUD operation flows

**Pattern:**
```
e2e/flow-name.spec.ts
```

### Phase 5: Verify
Run `npx vitest run` to ensure all tests pass. Fix any failing tests.

## Output

- Test files created alongside each component
- E2E tests in `e2e/` directory
- Summary of test coverage added

## Rules

- Use Vitest + React Testing Library for unit tests
- Use Playwright for E2E tests
- Test behavior, not implementation details
- Use `screen.getByRole()` over `getByTestId()`
- Mock external APIs with MSW patterns
- Test both happy path and error states
- Include accessibility assertions
- Follow existing test patterns if tests already exist in the project
