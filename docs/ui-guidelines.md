# UI Guidelines for the TODO App

## Purpose

This document defines the baseline UI and UX standards for the TODO app. All frontend implementation decisions should follow these guidelines to keep the experience consistent, accessible, and easy to use.

## Design Principles

- Clarity over decoration.
- Fast task entry and completion.
- Consistency across all screens and states.
- Accessibility is required, not optional.

## Component System

- Use Material UI (MUI) as the primary component library.
- Prefer MUI components before creating custom components.
- Build reusable wrappers only when needed for app-wide consistency (for example: `AppButton`, `PageContainer`, `EmptyState`).
- Avoid mixing multiple UI libraries.

## Color Palette

Use a simple, high-contrast palette:

- Primary: `#0B5FFF` (main actions, links, active states)
- Secondary: `#00A37A` (success and supportive highlights)
- Warning: `#F59E0B`
- Error: `#D92D20`
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Text Primary: `#0F172A`
- Text Secondary: `#475467`
- Border/Divider: `#D0D5DD`

Rules:

- Keep color usage semantic (do not use red for non-error actions).
- Meet WCAG contrast minimums for text and interactive UI.
- Do not rely on color alone to communicate status.

## Typography

- Use `Roboto` as the default font family (Material default).
- Type scale:
  - H1: 32px / 40px, 700
  - H2: 24px / 32px, 600
  - H3: 20px / 28px, 600
  - Body: 16px / 24px, 400
  - Caption: 14px / 20px, 400
- Keep line lengths readable and avoid dense text blocks.

## Layout and Spacing

- Use an 8px spacing grid.
- Standard page padding: 24px desktop, 16px mobile.
- Maintain consistent vertical rhythm between sections.
- Limit content width to improve readability (for example max-width around 960px on desktop).

## Buttons and Interactive Elements

- Primary actions: `contained` MUI Button using primary color.
- Secondary actions: `outlined` MUI Button.
- Low-emphasis actions: `text` MUI Button.
- Minimum touch target: 44x44px.
- Use clear, action-oriented labels (for example: "Add Task", "Mark Complete").
- Disabled states must remain legible and clearly non-interactive.

## Forms and Input Behavior

- Use MUI `TextField`, `Select`, `Checkbox`, and related inputs.
- Every input must have a visible label.
- Show validation errors inline and in plain language.
- Validate on blur and on submit; avoid excessive validation noise while typing.
- Preserve user input on recoverable errors.

## TODO-Specific Interaction Rules

- Provide a single prominent entry point for adding a task.
- A task item must clearly show:
  - Completion state
  - Title
  - Optional metadata (due date, priority, tags)
- Completed tasks must be visually distinct but still readable.
- Destructive actions (delete/clear completed) require confirmation.
- Support keyboard-first workflows for add, edit, toggle complete, and delete.

## States and Feedback

Every key view must support:

- Loading state (skeleton or progress indicator)
- Empty state (helpful guidance and next action)
- Error state (clear message and retry option)
- Success feedback where appropriate (snackbar/toast)

## Accessibility Requirements

- Conform to WCAG 2.1 AA standards.
- Full keyboard navigation support with visible focus indicators.
- Provide semantic landmarks and heading hierarchy.
- All icon-only buttons must include accessible names (`aria-label`).
- Ensure screen reader announcements for dynamic updates (for example: task added, task completed).
- Respect reduced motion preferences.

## Responsiveness

- Support mobile-first layouts starting at 320px width.
- Use responsive breakpoints consistent with MUI defaults.
- Ensure controls and text remain usable at 200% zoom.
- Avoid horizontal scrolling for primary app flows.

## Motion and Transitions

- Keep animations subtle and purposeful.
- Standard transition duration: 150ms to 250ms.
- Do not animate large layout shifts that can disorient users.
- Honor `prefers-reduced-motion` by minimizing non-essential animation.

## Icons

- Use Material Symbols or Material Icons consistently.
- Pair icons with text for important actions when space allows.
- Keep icon sizes and stroke styles consistent within a view.

## Testing and Quality Gates

Before merging UI changes:

- Verify keyboard-only navigation for all task flows.
- Check color contrast for text and controls.
- Confirm screen reader labels for all interactive controls.
- Validate responsive behavior on mobile and desktop breakpoints.
- Ensure no critical layout or interaction regressions in existing tests.

## Definition of Done for UI Work

A UI change is complete only when:

- It follows this guideline document.
- It is visually consistent with existing app patterns.
- It is accessible and responsive.
- It includes or updates tests as needed for behavior changes.
