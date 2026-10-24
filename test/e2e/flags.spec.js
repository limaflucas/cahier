import { test, expect } from '@playwright/test';

test('with every flag off, the app loads its flags and hides flagged features', async ({ page }) => {
  const flags = page.waitForResponse((res) => new URL(res.url()).pathname === '/api/flags');
  await page.goto('/');
  expect((await flags).status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByTestId('version-badge')).toHaveCount(0);
});

test.describe('with version-badge on', () => {
  test.use({ baseURL: 'http://localhost:4174' });

  test('the footer shows the running version and commit', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('version-badge')).toHaveText(/^Cahier \d+\.\d+\.\d+ · abcdef1$/);
  });
});
