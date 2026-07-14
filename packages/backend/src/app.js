const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (priority IN ('Low', 'Medium', 'High')),
    CHECK (completed IN (0, 1))
  )
`);

const insertTodoStmt = db.prepare(`
  INSERT INTO todos (title, description, due_date, priority, completed)
  VALUES (@title, @description, @dueDate, @priority, @completed)
`);

const selectTodoByIdStmt = db.prepare('SELECT * FROM todos WHERE id = ?');
const deleteTodoStmt = db.prepare('DELETE FROM todos WHERE id = ?');

const listTodosQuery = `
  SELECT * FROM todos
  ORDER BY
    completed ASC,
    CASE WHEN due_date IS NULL THEN 1 ELSE 0 END ASC,
    due_date ASC,
    created_at DESC
`;

const initialTodos = [
  {
    title: 'Review project requirements',
    description: 'Read the functional and UI guidelines before expanding the app.',
    dueDate: null,
    priority: 'High',
    completed: 0,
  },
  {
    title: 'Sketch the todo list layout',
    description: 'Outline the main sections for add, filter, and list views.',
    dueDate: null,
    priority: 'Medium',
    completed: 0,
  },
  {
    title: 'Verify backend tests',
    description: 'Keep the API contract covered while the data model evolves.',
    dueDate: null,
    priority: 'Low',
    completed: 1,
  },
];

initialTodos.forEach((todo) => {
  insertTodoStmt.run(todo);
});

console.log('In-memory todo database initialized with sample data');

function normalizeDueDate(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return { error: 'Due date must be a valid date value' };
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: 'Due date must be a valid date value' };
  }

  return parsedDate.toISOString().slice(0, 10);
}

function normalizeTodo(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    priority: row.priority,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTodoToLegacyItem(todo) {
  return {
    id: todo.id,
    name: todo.title,
    created_at: todo.createdAt,
  };
}

function validateTodoPayload(payload, { partial = false } = {}) {
  const allowedFields = ['title', 'description', 'dueDate', 'priority', 'completed'];
  const providedFields = allowedFields.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));

  if (partial && providedFields.length === 0) {
    return { error: 'At least one todo field is required' };
  }

  const normalizedTodo = {};

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'title')) {
    if (typeof payload.title !== 'string' || payload.title.trim() === '') {
      return { error: 'Todo title is required' };
    }

    normalizedTodo.title = payload.title.trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'description')) {
    if (payload.description !== null && typeof payload.description !== 'string') {
      return { error: 'Description must be a string' };
    }

    normalizedTodo.description = payload.description ? payload.description.trim() : null;
  } else if (!partial) {
    normalizedTodo.description = null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'dueDate')) {
    const normalizedDueDate = normalizeDueDate(payload.dueDate);
    if (normalizedDueDate && normalizedDueDate.error) {
      return normalizedDueDate;
    }

    normalizedTodo.dueDate = normalizedDueDate;
  } else if (!partial) {
    normalizedTodo.dueDate = null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'priority')) {
    if (!VALID_PRIORITIES.includes(payload.priority)) {
      return { error: 'Priority must be Low, Medium, or High' };
    }

    normalizedTodo.priority = payload.priority;
  } else if (!partial) {
    normalizedTodo.priority = 'Medium';
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'completed')) {
    if (typeof payload.completed !== 'boolean') {
      return { error: 'Completed must be a boolean' };
    }

    normalizedTodo.completed = payload.completed ? 1 : 0;
  } else if (!partial) {
    normalizedTodo.completed = 0;
  }

  return { value: normalizedTodo };
}

function getTodoOrNull(id) {
  return selectTodoByIdStmt.get(id);
}

function requireValidId(id) {
  const parsedId = Number.parseInt(id, 10);
  if (Number.isNaN(parsedId)) {
    return { error: 'Valid todo ID is required' };
  }

  return { value: parsedId };
}

function updateTodo(id, updates) {
  const fields = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
    fields.push('title = ?');
    values.push(updates.title);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'description')) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'dueDate')) {
    fields.push('due_date = ?');
    values.push(updates.dueDate);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'priority')) {
    fields.push('priority = ?');
    values.push(updates.priority);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
    fields.push('completed = ?');
    values.push(updates.completed);
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  db.prepare(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return normalizeTodo(getTodoOrNull(id));
}

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.get('/api/todos', (req, res) => {
  try {
    const todos = db.prepare(listTodosQuery).all().map(normalizeTodo);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const validation = validateTodoPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const result = insertTodoStmt.run(validation.value);
    const id = result.lastInsertRowid;

    const newTodo = normalizeTodo(getTodoOrNull(id));
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.put('/api/todos/:id', (req, res) => {
  try {
    const validationId = requireValidId(req.params.id);
    if (validationId.error) {
      return res.status(400).json({ error: validationId.error });
    }

    const existingTodo = getTodoOrNull(validationId.value);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const validation = validateTodoPayload(req.body, { partial: true });
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const updatedTodo = updateTodo(validationId.value, validation.value);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.patch('/api/todos/:id/toggle', (req, res) => {
  try {
    const validationId = requireValidId(req.params.id);
    if (validationId.error) {
      return res.status(400).json({ error: validationId.error });
    }

    const existingTodo = getTodoOrNull(validationId.value);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = updateTodo(validationId.value, {
      completed: existingTodo.completed ? 0 : 1,
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const validationId = requireValidId(req.params.id);
    if (validationId.error) {
      return res.status(400).json({ error: validationId.error });
    }

    const existingTodo = getTodoOrNull(validationId.value);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const result = deleteTodoStmt.run(validationId.value);

    if (result.changes > 0) {
      res.json({ message: 'Todo deleted successfully', id: validationId.value });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Compatibility aliases while the frontend is migrated from items to todos.
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare(listTodosQuery).all().map(normalizeTodo).map(mapTodoToLegacyItem);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const validation = validateTodoPayload({ title: req.body.name });
    if (validation.error) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const result = insertTodoStmt.run(validation.value);
    const todo = normalizeTodo(getTodoOrNull(result.lastInsertRowid));
    res.status(201).json(mapTodoToLegacyItem(todo));
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const validationId = requireValidId(req.params.id);
    if (validationId.error) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingTodo = getTodoOrNull(validationId.value);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const result = deleteTodoStmt.run(validationId.value);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: validationId.value });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = { app, db, insertTodoStmt };