import { test, expect } from '@playwright/test';

const PERSONS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const PRACTICE = "S'entraîner sur un verbe";

const section = (page, name) => page.getByRole('region', { name, exact: true });

test('the passé simple has its section, its model verbs and no practice link', async ({ page }) => {
  await page.goto('/temps-verbaux');
  await expect(section(page, "Vue d'ensemble").getByRole('link', { name: 'Passé simple' })).toBeVisible();

  await page.getByRole('navigation', { name: 'Sommaire' }).getByRole('link', { name: 'Passé simple' }).click();
  const passeSimple = section(page, 'Passé simple');
  await expect(passeSimple.getByRole('heading', { name: 'Passé simple', exact: true, level: 2 })).toBeInViewport();
  await expect(section(passeSimple, 'Modèles').getByRole('table')).toContainText('prirent');
  await expect(passeSimple.getByRole('link', { name: PRACTICE })).toHaveCount(0);
  await expect(section(page, 'Imparfait').getByRole('link', { name: PRACTICE })).toBeVisible();
});

test('every Formation table lists the persons down its first column', async ({ page }) => {
  await page.goto('/temps-verbaux');
  const tables = page.getByRole('region', { name: 'Formation', exact: true }).getByRole('table');
  await expect(tables).toHaveCount(11);
  for (const table of await tables.all()) {
    await expect(table.getByRole('rowheader')).toHaveText(PERSONS);
  }

  const present = section(section(page, 'Présent'), 'Formation').getByRole('table');
  await expect(present.getByRole('columnheader')).toHaveText(['1er groupe (-er)', '2e groupe (-ir, -issons)', '3e groupe']);
  await expect(present.getByRole('row').nth(1).getByRole('cell')).toHaveText(['-e', '-is', '-s / -x']);
});

test('the page fits a phone screen, wide tables scroll inside their box', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/temps-verbaux');
  await expect(section(section(page, 'Conditionnel passé'), 'Modèles').getByRole('table')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
