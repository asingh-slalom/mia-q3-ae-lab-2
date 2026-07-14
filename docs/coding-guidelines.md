# Coding Guidelines

This project values readable, maintainable code over clever shortcuts. A good implementation should be easy for another teammate to understand, test, and extend with confidence. The principles below summarize the expected coding style and quality standards for both frontend and backend work in this repository.

## Formatting and Readability

Code should be consistently formatted and intentionally named.

- Use clear, descriptive names for files, functions, variables, and tests.
- Keep functions focused on one responsibility.
- Prefer early returns and simple control flow over deeply nested conditionals.
- Remove dead code, commented-out code, and unused variables.
- Keep files organized so related logic is easy to find.

Consistency matters more than personal preference. Follow existing project patterns when there is any ambiguity.

## Import Organization

Imports should be predictable and tidy.

- Group imports by type in a stable order.
- Keep third-party imports separate from local module imports.
- Use one import path style consistently (for example, always relative where expected by the codebase).
- Avoid duplicate imports and circular dependencies.
- Import only what is needed.

When files grow, revisit import structure to preserve clarity.

## Linting and Static Quality Checks

Linting is a required quality gate, not an optional cleanup step.

- Run ESLint regularly during development, not only before submission.
- Treat lint warnings as quality signals and fix root causes.
- Do not suppress lint rules unless there is a clear, documented reason.
- Keep the codebase warning-free whenever possible.

Linting enforces baseline consistency, catches common bugs early, and keeps code reviews focused on behavior and design rather than style drift.

## DRY and Reuse

Apply DRY (Don’t Repeat Yourself) to reduce maintenance cost and defect risk.

- Extract repeated logic into reusable functions, utilities, or components.
- Centralize shared constants and validation rules.
- Prefer composition over copy/paste.
- Avoid premature abstraction: only generalize when repetition is real and meaningful.

A little duplication can be acceptable temporarily, but repeated patterns should be consolidated before they spread.

## Testing and Reliability Mindset

Quality includes confidence in behavior.

- Add or update tests whenever behavior changes.
- Favor tests that assert user-visible outcomes and business behavior.
- Keep tests readable and deterministic.
- Avoid brittle tests that depend on incidental implementation details.

Every code change should improve or preserve confidence in the system.

## Maintainability and Review Readiness

Before considering work complete, validate that it is review-ready.

- Ensure code is understandable without extra verbal explanation.
- Confirm edge cases and error paths are handled intentionally.
- Keep pull requests focused and coherent.
- Include concise comments only where logic is non-obvious.

The goal is sustainable delivery: code that solves today’s problem without creating tomorrow’s confusion.
