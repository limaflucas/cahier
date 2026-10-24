import { test, expect } from '@playwright/test';

test('the app is called Cahier', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Cahier');
  await expect(page.getByRole('banner').getByRole('link', { name: 'Cahier', exact: true })).toBeVisible();
});

test('a deep link renders its page', async ({ page }) => {
  await page.goto('/mes-mots');
  await expect(page.getByRole('heading', { name: /Mes mots/ })).toBeVisible();
});
