const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

const createTodo = async (overrides = {}) => {
  const payload = {
    title: `Todo ${Date.now()} ${Math.random()}`,
    description: 'Integration test todo',
    dueDate: '2026-07-20',
    priority: 'Medium',
    ...overrides,
  };

  const response = await request(app)
    .post('/api/todos')
    .send(payload)
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  return response.body;
};

describe('Todo API integration', () => {
  it('lists todos in the expected shape', async () => {
    const response = await request(app).get('/api/todos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        priority: expect.stringMatching(/Low|Medium|High/),
        completed: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it('creates a todo with optional details', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({
        title: 'Ship backend todo API',
        description: 'Add validation and ordering support.',
        dueDate: '2026-07-25',
        priority: 'High',
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'Ship backend todo API',
        description: 'Add validation and ordering support.',
        dueDate: '2026-07-25',
        priority: 'High',
        completed: false,
      })
    );
  });

  it('rejects an empty title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '   ' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Todo title is required' });
  });

  it('rejects an invalid due date', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Invalid due date', dueDate: 'not-a-date' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Due date must be a valid date value' });
  });

  it('updates an existing todo', async () => {
    const todo = await createTodo({ title: 'Original title', priority: 'Low' });

    const response = await request(app)
      .put(`/api/todos/${todo.id}`)
      .send({
        title: 'Updated title',
        description: 'Updated description',
        dueDate: '2026-08-01',
        priority: 'High',
        completed: true,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: todo.id,
        title: 'Updated title',
        description: 'Updated description',
        dueDate: '2026-08-01',
        priority: 'High',
        completed: true,
      })
    );
  });

  it('toggles completion state', async () => {
    const todo = await createTodo({ title: 'Toggle me', completed: false });

    const response = await request(app).patch(`/api/todos/${todo.id}/toggle`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: todo.id,
        completed: true,
      })
    );
  });

  it('deletes an existing todo', async () => {
    const todo = await createTodo({ title: 'Delete me' });

    const deleteResponse = await request(app).delete(`/api/todos/${todo.id}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ message: 'Todo deleted successfully', id: todo.id });

    const secondDelete = await request(app).delete(`/api/todos/${todo.id}`);
    expect(secondDelete.status).toBe(404);
    expect(secondDelete.body).toEqual({ error: 'Todo not found' });
  });

  it('sorts incomplete todos before completed ones and pushes undated tasks last', async () => {
    const completedTodo = await createTodo({
      title: 'Completed todo sort check',
      dueDate: '2026-07-18',
      completed: true,
    });
    const undatedTodo = await createTodo({
      title: 'Undated todo sort check',
      dueDate: null,
      completed: false,
    });
    const datedTodo = await createTodo({
      title: 'Dated todo sort check',
      dueDate: '2026-07-16',
      completed: false,
    });

    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);

    const titles = response.body.map((todo) => todo.title);

    expect(titles.indexOf(datedTodo.title)).toBeLessThan(titles.indexOf(undatedTodo.title));
    expect(titles.indexOf(undatedTodo.title)).toBeLessThan(titles.indexOf(completedTodo.title));
  });
});