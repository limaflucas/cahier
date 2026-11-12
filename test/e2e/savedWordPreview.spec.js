import { test, expect } from '@playwright/test';
import { toEntry } from '../../server/reverso.js';
import { summarizeWord } from '../../server/wordSummary.js';
import { fixture } from '../helpers.js';

const PREPOSITIONS = [
  { pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' },
  { pattern: 'penser de qqn/qqch', meaning: 'achar de', example: "Qu'en penses-tu ?" },
  { pattern: 'penser + inf.', meaning: 'pretender', example: 'Je pense partir demain.' },
];
const entry = toEntry(fixture('penser'));
const summary = summarizeWord(entry, 'penser');
const saved = { word: 'penser', addedAt: '2026-10-10 10:00:00', summary, prepositions: PREPOSITIONS };
const lookup = { ...entry, words: entry.words.map((w) => ({ ...w, saved: true, prepositions: PREPOSITIONS })) };

const search = (page, name = 'Chercher un mot') => page.getByRole('combobox', { name });
const card = (page) => page.getByRole('listbox', { name: 'Dans mes mots' });

test.beforeEach(async ({ page }) => {
  await page.route('**/api/my-words/*', (route) => {
    const word = decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop());
    return word.toLowerCase() === 'penser'
      ? route.fulfill({ json: saved })
      : route.fulfill({ status: 404, json: { error: 'not_saved' } });
  });
  await page.route('**/api/dictionary/penser', (route) => route.fulfill({ json: lookup }));
});

test('typing a saved word shows its key meanings and prepositions', async ({ page }) => {
  await page.goto('/');
  await search(page).fill('Penser');

  await expect(card(page).getByRole('option', { name: 'penser' })).toBeVisible();
  for (const { definition, translations } of summary.meanings) {
    await expect(card(page)).toContainText(definition);
    await expect(card(page)).toContainText(translations[0]);
  }
  for (const { pattern, meaning } of PREPOSITIONS) {
    await expect(card(page)).toContainText(pattern);
    await expect(card(page)).toContainText(meaning);
  }
  await expect(card(page)).not.toContainText('Je pense à toi.');
});

test('Enter on a saved word opens its page in the saved spelling', async ({ page }) => {
  await page.goto('/');
  await search(page).fill('Penser');
  await expect(card(page)).toBeVisible();

  await search(page).press('Enter');
  await expect(page).toHaveURL(/\/mot\/penser$/);
  await expect(card(page)).toBeHidden();
});

test('clicking the card opens the word page', async ({ page }) => {
  await page.goto('/');
  await search(page).fill('Penser');

  await card(page).getByRole('option', { name: 'penser' }).click();
  await expect(page).toHaveURL(/\/mot\/penser$/);
});

test('a word that is not saved shows no card and Enter looks it up as typed', async ({ page }) => {
  await page.goto('/');
  const answered = page.waitForResponse('**/api/my-words/zzz');
  await search(page).fill('zzz');
  await answered;

  await expect(card(page)).toBeHidden();
  await search(page).press('Enter');
  await expect(page).toHaveURL(/\/mot\/zzz$/);
});

test('Escape closes the card', async ({ page }) => {
  await page.goto('/');
  await search(page).fill('penser');
  await expect(card(page)).toBeVisible();

  await search(page).press('Escape');
  await expect(card(page)).toBeHidden();
});

test('on Mes mots the card shows over the filtered list', async ({ page }) => {
  await page.route('**/api/my-words', (route) => route.fulfill({ json: [saved] }));
  await page.goto('/mes-mots');
  await search(page, 'Filtrer mes mots ou chercher un mot').fill('penser');

  await expect(card(page)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mes mots (1)' })).toBeVisible();
});
