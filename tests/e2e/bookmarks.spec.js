import { test, expect } from '@playwright/test';

test.describe('Bookmark journeys', () => {
  test('add bookmark and see in list', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Title').fill('OpenAI');
    await page.getByLabel('URL').fill('https://openai.com');
    await page.getByRole('button', { name: 'Add Bookmark' }).click();

    await expect(page.getByRole('listitem').filter({ hasText: 'OpenAI' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'https://openai.com' })).toBeVisible();
  });

  test('search bookmark by title', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Title').fill('GitHub');
    await page.getByLabel('URL').fill('https://github.com');
    await page.getByRole('button', { name: 'Add Bookmark' }).click();

    await page.getByLabel('Search').fill('git');

    await expect(page.getByRole('listitem').filter({ hasText: 'GitHub' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'https://github.com' })).toBeVisible();
  });

  test('delete bookmark and confirm removal', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Title').fill('DeleteMe');
    await page.getByLabel('URL').fill('https://deleteme.example');
    await page.getByRole('button', { name: 'Add Bookmark' }).click();

    const target = page.getByRole('listitem').filter({ hasText: 'DeleteMe' });
    await expect(target).toBeVisible();

    await target.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('listitem').filter({ hasText: 'DeleteMe' })).toHaveCount(0);
  });
});
