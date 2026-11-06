import { test, expect } from '@playwright/test';
import { toEntry } from '../../server/reverso.js';
import { summarizeWord } from '../../server/wordSummary.js';
import { fixture } from '../helpers.js';

const saved = ['penser', 'homme', 'belle'].map((word, i) => ({
  word,
  addedAt: `2026-10-1${i} 10:00:00`,
  summary: summarizeWord(toEntry(fixture(word)), word),
}));

const search = (page) => page.getByRole('combobox', { name: 'Filtrer mes mots ou chercher un mot' });
const wordLink = (page, word) => page.getByRole('main').getByRole('link', { name: word, exact: true });
const row = (page, word) =>
  page.getByRole('main').getByRole('listitem').filter({ has: page.getByRole('link', { name: word, exact: true }) });

test.beforeEach(async ({ page }) => {
  await page.route('**/api/my-words', (route) => route.fulfill({ json: saved }));
});

test('filtering hides the other words and clearing shows the same rows again', async ({ page }) => {
  await page.goto('/mes-mots');
  const belle = await row(page, 'belle').elementHandle();

  await search(page).fill('hom');
  await expect(page.getByRole('heading', { name: 'Mes mots (1 sur 3)' })).toBeVisible();
  await expect(wordLink(page, 'homme')).toBeVisible();
  await expect(wordLink(page, 'belle')).toBeHidden();

  await search(page).fill('');
  await expect(page.getByRole('heading', { name: 'Mes mots (3)' })).toBeVisible();
  await expect(wordLink(page, 'belle')).toBeVisible();
  expect(await belle.evaluate((row) => row.isConnected)).toBe(true);
});

test('rows off screen skip rendering until scrolled to', async ({ page }) => {
  await page.goto('/mes-mots');
  await expect(row(page, 'penser')).toHaveCSS('content-visibility', 'auto');
});
