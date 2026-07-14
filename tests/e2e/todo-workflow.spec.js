const { test } = require('@playwright/test');
const { TodoAppPage } = require('./pages/TodoAppPage');

test.describe('todo workflow', () => {
  test('loads the seeded items from the backend', async ({ page }) => {
    const todoAppPage = new TodoAppPage(page);

    await todoAppPage.goto();
    await todoAppPage.expectSeedDataVisible();
  });

  test('adds and deletes an item', async ({ page }) => {
    const todoAppPage = new TodoAppPage(page);
    const newItemName = `Playwright item ${Date.now()}`;

    await todoAppPage.goto();
    await todoAppPage.addItem(newItemName);
    await todoAppPage.deleteItem(newItemName);
  });
});