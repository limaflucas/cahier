import { test, expect } from '@playwright/test';
import { toEntry } from '../../server/reverso.js';
import { fixture } from '../helpers.js';

const PENSER = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];
const entry = toEntry(fixture('penser'));
const firstSense = entry.words[0].sections[0].senses[0];
const lookup = { ...entry, words: entry.words.map((w) => ({ ...w, saved: false, prepositions: 'pending' })) };

const prepositions = (page) => page.getByRole('region', { name: 'prépositions' });

test.beforeEach(async ({ page }) => {
  await page.route('**/api/dictionary/penser', (route) => route.fulfill({ json: lookup }));
});

test('the definitions show while the prepositions are still being found', async ({ page }) => {
  let answer;
  const answered = new Promise((resolve) => { answer = resolve; });
  await page.route('**/api/prepositions/penser', async (route) => route.fulfill({ json: await answered }));

  await page.goto('/mot/penser');
  await expect(page.getByText(firstSense.definition).first()).toBeVisible();
  await expect(prepositions(page)).toContainText('Recherche des prépositions…');

  answer(PENSER);
  await expect(prepositions(page)).toContainText('penser à qqn/qqch');
  await expect(prepositions(page)).toContainText('pensar em');
  await expect(prepositions(page)).not.toContainText('Recherche des prépositions…');
});

test('prepositions that cannot be found say so', async ({ page }) => {
  await page.route('**/api/prepositions/penser', (route) =>
    route.fulfill({ status: 503, json: { error: 'prepositions_unavailable' } }));

  await page.goto('/mot/penser');
  await expect(prepositions(page)).toContainText('Indisponibles pour le moment.');
});
