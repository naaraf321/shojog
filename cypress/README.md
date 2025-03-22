# Cypress Integration Testing

This directory contains the Cypress integration tests for the ShudhuMCQ Platform. These tests ensure that key user flows and interactions work correctly throughout the application.

## Test Structure

- `e2e/` - Contains end-to-end test files for different features

  - `auth.cy.ts` - Tests for authentication flows
  - `mock-exam.cy.ts` - Tests for the mock exam taking process
  - `question-bank.cy.ts` - Tests for question bank navigation
  - `doubts-forum.cy.ts` - Tests for doubt forum interactions

- `support/` - Contains support files and custom commands

  - `commands.ts` - Custom Cypress commands (login, navigation, etc.)
  - `e2e.ts` - Configuration for e2e tests

- `fixtures/` - Contains test data (if needed)

## Running the Tests

To run the Cypress tests, use the following commands:

- `npm run cypress` - Opens the Cypress UI for interactive testing
- `npm run cypress:headless` - Runs the tests in headless mode
- `npm run test:e2e` - Starts the development server and runs Cypress tests
- `npm run test:e2e:headless` - Starts the development server and runs headless tests

## Data Attributes

We use `data-cy` attributes throughout the codebase for stable test selectors. When adding new components, make sure to include appropriate `data-cy` attributes for testing.

Examples:

```jsx
<button data-cy="signin-button">Sign In</button>
<input data-cy="email-input" type="email" />
```

## Best Practices

1. Keep tests focused on user flows, not implementation details
2. Use a consistent pattern for selectors (data-cy attributes)
3. Avoid sharing state between tests
4. Make sure tests clean up after themselves
5. Don't rely on the order of test execution

## Test Environment

The tests assume a clean database state. Mock data should be provided through the API or fixture files. Authentication is handled through custom commands that manage the login process.
