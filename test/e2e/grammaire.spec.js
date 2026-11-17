import { test, expect } from '@playwright/test';

const PARTS = ["Ce que c'est", 'Les repérer', 'Règles de base', 'Niveau B2–C1', 'Pièges pour lusophones'];
const DIRECT = "complément d'objet direct";
const INDIRECT = "complément d'objet indirect";

const menuLinks = (page) => page.getByRole('navigation', { name: 'Menu' }).getByRole('link');
const section = (page, name) => page.getByRole('region', { name, exact: true });

test('Grammaire follows Temps verbaux in the menu and leads to COD et COI', async ({ page }) => {
  await page.goto('/');
  const grammaire = menuLinks(page).filter({ hasText: 'Grammaire' });
  await expect(grammaire).toBeVisible();
  const labels = await menuLinks(page).allInnerTexts();
  expect(labels.indexOf('Grammaire')).toBe(labels.indexOf('Temps verbaux') + 1);

  await grammaire.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Grammaire' })).toBeVisible();
  const topics = page.getByRole('list', { name: 'Fiches de grammaire' });
  await expect(topics.getByRole('link', { name: 'Temps verbaux', exact: true })).toHaveAttribute('href', '/temps-verbaux');

  await topics.getByRole('link', { name: 'COD et COI', exact: true }).click();
  await expect(page).toHaveURL(/\/grammaire\/cod-coi$/);
  await expect(page.getByRole('heading', { level: 1, name: 'COD et COI' })).toBeVisible();
  await expect(grammaire).toHaveAttribute('aria-current', 'page');
});

test('the contents list the five parts and jump to each', async ({ page }) => {
  await page.goto('/grammaire/cod-coi');
  const contents = page.getByRole('navigation', { name: 'Sommaire' });
  await expect(contents.getByRole('link')).toHaveText(PARTS);
  for (const part of PARTS) {
    await contents.getByRole('link', { name: part, exact: true }).click();
    await expect(section(page, part).getByRole('heading', { level: 2 })).toBeInViewport();
  }
});

test('COD and COI show in two colours that the legend explains, never as raw markup', async ({ page }) => {
  await page.goto('/grammaire/cod-coi');
  const legend = page.getByRole('list', { name: 'Légende' });
  await expect(legend).toContainText(DIRECT);
  await expect(legend).toContainText(INDIRECT);

  const spotting = section(page, 'Les repérer');
  const cod = spotting.getByTitle(DIRECT, { exact: true }).first();
  const coi = spotting.getByTitle(INDIRECT, { exact: true }).first();
  await expect(cod).toBeVisible();
  await expect(coi).toBeVisible();
  const background = (mark) => mark.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(await background(cod)).not.toBe(await background(coi));
  await expect(page.getByText(/\{CO[DI]:|\*\*/)).toHaveCount(0);
});

test('Les repérer climbs from A2 to C1, each example with its level and the question that finds it', async ({ page }) => {
  await page.goto('/grammaire/cod-coi');
  const examples = section(page, 'Les repérer').getByRole('list', { name: 'Exemples' }).getByRole('listitem');
  expect(await examples.count()).toBeGreaterThanOrEqual(16);
  await expect(examples.first().getByText('A2', { exact: true })).toBeVisible();
  await expect(examples.last().getByText('C1', { exact: true })).toBeVisible();
  await expect(examples.first()).toContainText('→');
});

test('every rule shows its level', async ({ page }) => {
  await page.goto('/grammaire/cod-coi');
  for (const [part, levels] of [['Règles de base', /^(A2|B1)$/], ['Niveau B2–C1', /^(B2|C1)$/]]) {
    const rules = section(page, part).getByRole('region');
    expect(await rules.count(), part).toBeGreaterThanOrEqual(6);
    for (const rule of await rules.all()) await expect(rule.getByText(levels)).toBeVisible();
  }
});

test('the agreement rules on Temps verbaux lead to the COD et COI page', async ({ page }) => {
  for (const tense of ['Passé composé', 'Participe passé']) {
    await page.goto('/temps-verbaux');
    await section(page, tense).getByRole('link', { name: /COD et COI/ }).click();
    await expect(page).toHaveURL(/\/grammaire\/cod-coi#.+/);
    const anchor = decodeURIComponent(new URL(page.url()).hash.slice(1));
    await expect(page.locator(`[id="${anchor}"]`)).toBeInViewport();
  }
});

test('the grammar pages fit a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/grammaire', '/grammaire/cod-coi']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBe(0);
  }
});
