# TODO App Functional Requirements

## Core Task Management

1. Users can create a new task with a required title.
2. Users can edit an existing task title.
3. Users can delete a task.
4. Users can mark a task as complete or incomplete.

## Task Details

1. Users can add an optional description to a task.
2. Users can set an optional due date for a task.
3. Users can assign a priority level to a task (Low, Medium, High).

## Organization and Display

1. Tasks are sorted by status and due date by default:
   - Incomplete tasks appear before completed tasks.
   - Within each group, tasks with earlier due dates appear first.
   - Tasks without due dates appear after tasks with due dates.
2. Users can manually sort tasks by:
   - Due date
   - Priority
   - Creation date
   - Alphabetical title
3. Users can filter tasks by status (All, Active, Completed).
4. Users can search tasks by title or description keyword.

## Validation and Behavior

1. The app prevents creation of tasks with an empty title.
2. Due dates cannot be set to invalid date values.
3. Task changes are saved and persist when the page is refreshed.
