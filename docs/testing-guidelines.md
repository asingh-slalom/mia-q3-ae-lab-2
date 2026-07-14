# Testing Guidelines

These guidelines define the default testing approach for this project. All new features should include appropriate tests, and all tests should be maintainable, isolated, and repeatable.

## General Principles

- All new features must include the right level of test coverage.
- Tests must be isolated and independent. Each test should create its own data and never rely on execution order or shared state from other tests.
- Setup and teardown hooks are required where needed so tests pass reliably across repeated runs.
- Tests should be easy to understand, easy to update, and aligned with project behavior rather than internal implementation details.
- Prefer focused, readable test cases over large, brittle test suites.

## Unit Tests

- Use Jest to test individual functions and React components in isolation.
- Unit test files must use the naming convention `*.test.js` or `*.test.ts`.
- Backend unit tests should be placed in `packages/backend/__tests__/`.
- Frontend unit tests should be placed in `packages/frontend/src/__tests__/`.
- Name unit test files to match what they are testing, such as `app.test.js` for `app.js`.

## Integration Tests

- Use Jest and Supertest to test backend API endpoints with real HTTP requests.
- Integration tests should be placed in `packages/backend/__tests__/integration/`.
- Integration test files must use the naming convention `*.test.js` or `*.test.ts`.
- Name integration test files based on the API behavior they cover, such as `todos-api.test.js`.

## End-to-End Tests

- Use Playwright for end-to-end testing. Playwright is the required E2E framework for this project.
- E2E tests should be placed in `tests/e2e/`.
- E2E test files must use the naming convention `*.spec.js` or `*.spec.ts`.
- Name E2E test files after the user journey they cover, such as `todo-workflow.spec.js`.
- Playwright tests must use one browser only.
- Playwright tests must use the Page Object Model (POM) pattern for maintainability.
- Limit E2E coverage to 5 to 8 critical user journeys, focusing on happy paths and key edge cases rather than exhaustive coverage.

## Port Configuration

- Always use environment variables with sensible defaults for port configuration.
- Backend services should use `const PORT = process.env.PORT || 3030;`.
- The frontend uses React's default port `3000`, but it should remain overridable through the `PORT` environment variable.
- This port configuration approach allows CI/CD workflows to dynamically detect and assign ports.

## Maintainability Expectations

- Use clear test names that describe observable behavior.
- Keep test setup close to the test unless shared setup clearly improves readability.
- Avoid unnecessary duplication, but do not hide important behavior behind overly complex test helpers.
- Update or add tests whenever behavior changes.