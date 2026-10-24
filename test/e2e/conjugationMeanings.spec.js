import { test, expect } from '@playwright/test';
import { toEntry } from '../../server/reverso.js';
import { fixture } from '../helpers.js';

const penser = toEntry(fixture('penser'));
const firstSense = penser.words[0].sections[0].senses[0];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/dictionary/penser', (route) => route.fulfill({ json: penser }));
});

const trigger = (page) => page.getByRole('button', { name: 'Sens de « penser »' });
const meanings = (page) => page.getByRole('region', { name: 'Sens de « penser »' });

test('an icon between the verb and its sound icon shows its meanings on hover', async ({ page }) => {
  await page.goto('/conjugaison/penser');
  const heading = await page.getByRole('heading', { level: 1, name: 'penser' }).boundingBox();
  const icon = await trigger(page).boundingBox();
  const listen = await page.getByRole('button', { name: 'Écouter « penser »' }).boundingBox();
  expect(icon.x).toBeGreaterThanOrEqual(heading.x + heading.width);
  expect(icon.x + icon.width).toBeLessThanOrEqual(listen.x);
  expect(icon.y).toBeLessThan(heading.y + heading.height);

  await expect(meanings(page)).toBeHidden();
  await trigger(page).hover();
  await expect(meanings(page)).toContainText(firstSense.definition);
  await expect(meanings(page)).toContainText(firstSense.translations[0]);

  await page.mouse.move(0, 0);
  await expect(meanings(page)).toBeHidden();
});

test('the meanings match the search page', async ({ page }) => {
  await page.goto('/mot/penser');
  const searchPage = await page.locator('article section').allInnerTexts();
  expect(searchPage.length).toBeGreaterThan(0);

  await page.goto('/conjugaison/penser');
  await trigger(page).hover();
  await expect(meanings(page).locator('section')).toHaveText(searchPage, { useInnerText: true });
});

test('keyboard focus shows the meanings and Escape hides them', async ({ page }) => {
  await page.goto('/conjugaison/penser');
  await trigger(page).focus();
  await expect(meanings(page)).toContainText(firstSense.definition);
  await page.keyboard.press('Escape');
  await expect(meanings(page)).toBeHidden();
});

test('the icon says when the dictionary is unavailable', async ({ page }) => {
  await page.route('**/api/dictionary/penser', (route) => route.fulfill({ status: 502, json: { error: 'upstream_unavailable' } }));
  await page.goto('/conjugaison/penser');
  await trigger(page).hover();
  await expect(meanings(page)).toHaveText('Sens indisponibles pour le moment.');
});
