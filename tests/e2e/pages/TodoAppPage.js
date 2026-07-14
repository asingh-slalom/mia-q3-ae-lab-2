const { expect } = require('@playwright/test');

class TodoAppPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'To Do App' });
    this.newItemInput = page.getByPlaceholder('Enter item name');
    this.addItemButton = page.getByRole('button', { name: 'Add Item' });
    this.itemsHeading = page.getByRole('heading', { name: 'Items from Database' });
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.heading).toBeVisible();
    await expect(this.itemsHeading).toBeVisible();
  }

  async expectSeedDataVisible() {
    await expect(this.page.getByText('Review project requirements')).toBeVisible();
    await expect(this.page.getByText('Sketch the todo list layout')).toBeVisible();
  }

  async addItem(name) {
    await this.newItemInput.fill(name);
    await this.addItemButton.click();
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async deleteItem(name) {
    const item = this.page.locator('li', { hasText: name });
    await item.getByRole('button', { name: 'Delete' }).click();
    await expect(this.page.getByText(name)).toHaveCount(0);
  }
}

module.exports = { TodoAppPage };