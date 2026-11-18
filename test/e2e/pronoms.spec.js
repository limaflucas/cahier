import { test, expect } from '@playwright/test';

const FLAGS_ROUTE = /\/api\/flags$/;
const LABELS = [
  'Personnel sujet', 'Tonique', 'Possessif', 'Démonstratif', 'Neutre', 'Réfléchi',
  'COD / COI', 'En / y', 'Relatif', 'Interrogatif', 'Indéfini',
];
const TITLES = [
  'Pronoms personnels sujets', 'Pronoms toniques', 'Pronoms possessifs', 'Pronoms démonstratifs',
  'Pronoms neutres', 'Pronoms réfléchis', 'Pronoms COD et COI', 'Pronoms en et y',
  'Pronoms relatifs', 'Pronoms interrogatifs', 'Pronoms indéfinis',
];
const PERSONS = ['1re sing.', '2e sing.', '3e sing.', '1re plur.', '2e plur.', '3e plur.'];

/**
 * Opens the Pronoms page with its flag on.
 * @param {import('@playwright/test').Page} page
 * @param {string} [path]
 */
async function openPronoms(page, path = '/pronoms') {
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-pronoms': true } }));
  await page.goto(path);
}

const table = (page) => page.getByRole('table', { name: 'Le tableau' });
const section = (scope, name) => scope.getByRole('region', { name, exact: true });
const title = (page, name) => page.getByRole('heading', { name, level: 2, exact: true });

test('the menu and the page follow the cahier-pronoms flag', async ({ page }) => {
  const menu = page.getByRole('navigation', { name: 'Menu' }).getByRole('link');
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: {} }));
  await page.goto('/pronoms');
  await expect(menu.filter({ hasText: 'Temps verbaux' })).toBeVisible();
  await expect(menu.filter({ hasText: 'Pronoms' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Pronoms', level: 1 })).toHaveCount(0);

  await page.unroute(FLAGS_ROUTE);
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-pronoms': true } }));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Pronoms', level: 1 })).toBeVisible();
  const labels = await menu.allInnerTexts();
  expect(labels.indexOf('Pronoms')).toBe(labels.indexOf('Temps verbaux') + 1);
});

test('the table holds the eleven families', async ({ page }) => {
  await openPronoms(page);
  for (const label of LABELS) {
    await expect(table(page).getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await expect(table(page).getByRole('rowheader').filter({ hasText: /(sing|plur)\.$/ })).toHaveText(PERSONS);
});

test('clicking a pronoun opens its family with that pronoun highlighted', async ({ page }) => {
  await openPronoms(page);
  await table(page).getByRole('link', { name: 'leur', exact: true }).click();

  await expect(page).toHaveURL(/\/pronoms#cod-coi$/);
  await expect(title(page, 'Pronoms COD et COI')).toBeInViewport();
  const codCoi = section(page, 'Pronoms COD et COI');
  await expect(codCoi.locator('mark')).toHaveText('leur');
  await expect(codCoi.locator('mark')).toHaveCount(0, { timeout: 5000 });

  await page.goBack();
  await expect(page).toHaveURL(/\/pronoms$/);
  await expect(table(page)).toBeInViewport();
});

test('the COD me highlights in the COD row', async ({ page }) => {
  await openPronoms(page);
  const firstSingular = table(page).getByRole('row').filter({ has: page.getByRole('rowheader', { name: '1re sing.' }) });
  await firstSingular.getByRole('link', { name: "me (m')", exact: true }).nth(1).click();

  const forms = section(section(page, 'Pronoms COD et COI'), 'Formes');
  await expect(forms.getByRole('row', { name: /^COD/ }).locator('mark')).toHaveText("me (m')");
  await expect(forms.getByRole('row', { name: /^COI/ }).locator('mark')).toHaveCount(0);
});

test('a family name opens its section and ↑ Tableau comes back', async ({ page }) => {
  await openPronoms(page);
  await table(page).getByRole('link', { name: 'Relatif', exact: true }).click();

  await expect(page).toHaveURL(/\/pronoms#relatifs$/);
  await expect(title(page, 'Pronoms relatifs')).toBeInViewport();
  const relatifs = section(page, 'Pronoms relatifs');
  await expect(relatifs.locator('mark')).toHaveCount(0);

  await relatifs.getByRole('link', { name: '↑ Tableau' }).click();
  await expect(page.getByRole('heading', { name: 'Le tableau', level: 2 })).toBeInViewport();
});

test('a pick from the keyboard moves focus to the section it opens', async ({ page }) => {
  await openPronoms(page);
  await table(page).getByRole('link', { name: 'leur', exact: true }).focus();
  await page.keyboard.press('Enter');

  await expect(title(page, 'Pronoms COD et COI')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(section(page, 'Pronoms COD et COI').getByRole('link', { name: /Vidéo/ })).toBeFocused();
});

test('two picks in the same family leave one step to go back', async ({ page }) => {
  await openPronoms(page);
  await table(page).getByRole('link', { name: 'leur', exact: true }).click();
  await expect(page).toHaveURL(/#cod-coi$/);
  await table(page).getByRole('link', { name: 'lui', exact: true }).last().click();
  await expect(section(page, 'Pronoms COD et COI').locator('mark')).toHaveText('lui');

  await page.goBack();
  await expect(page).toHaveURL(/\/pronoms$/);
});

test('a pronoun opens in a new tab with Ctrl or Cmd', async ({ page, context }) => {
  await openPronoms(page);
  const opened = context.waitForEvent('page');
  await table(page).getByRole('link', { name: 'leur', exact: true }).click({ modifiers: ['ControlOrMeta'] });
  await expect(await opened).toHaveURL(/\/pronoms#cod-coi$/);
  await expect(page).toHaveURL(/\/pronoms$/);
});

test("opening a family's link lands on it", async ({ page }) => {
  await openPronoms(page, '/pronoms#en-y');
  await expect(title(page, 'Pronoms en et y')).toBeInViewport();
});

test('every section has its forms, its uses and its chapter of the video', async ({ page }) => {
  await openPronoms(page);
  for (const name of TITLES) {
    const family = section(page, name);
    await expect(section(family, 'Formes')).toBeVisible();
    await expect(section(family, 'Emplois')).toBeVisible();
  }
  await expect(section(page, 'Pronoms COD et COI').getByRole('link', { name: /Vidéo/ }))
    .toHaveAttribute('href', 'https://www.youtube.com/watch?v=Puhiz1gRaOc&t=2640s');
});

test('the page fits a phone screen, the table scrolls inside its box', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPronoms(page);
  await expect(table(page)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

test('COD et COI leaves its deeper rules to the Grammaire page and links to them', async ({ page }) => {
  await openPronoms(page);
  const family = section(page, 'Pronoms COD et COI');
  for (const name of ['Place dans la phrase', 'Niveau B2–C1', 'Pièges pour lusophones']) {
    await expect(section(family, name)).toHaveCount(0);
  }
  await expect(family.getByText('Pour retenir', { exact: true })).toHaveCount(0);

  await section(family, 'Pour aller plus loin').getByRole('link', { name: /La place du pronom/ }).click();
  await expect(page).toHaveURL(/\/grammaire\/cod-coi#place$/);
  await expect(page.getByRole('heading', { name: 'La place du pronom : avant le verbe', level: 3 })).toBeInViewport();
});

test('an Emplois point leads to its rule on the Grammaire page', async ({ page }) => {
  await openPronoms(page);
  await section(section(page, 'Pronoms COD et COI'), 'Emplois').getByRole('link', { name: /lui et leur/ }).click();
  await expect(page).toHaveURL(/\/grammaire\/cod-coi#lui-leur$/);
  await expect(page.getByRole('heading', { name: 'Lui et leur : des personnes, après à', level: 3 })).toBeInViewport();
});

test('the COD et COI page leads back to the table while the flag is on', async ({ page }) => {
  const back = page.getByRole('link', { name: /tous les pronoms dans un tableau/ });
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: {} }));
  await page.goto('/grammaire/cod-coi');
  await expect(page.getByRole('heading', { name: 'COD et COI', level: 1 })).toBeVisible();
  await expect(back).toHaveCount(0);

  await page.unroute(FLAGS_ROUTE);
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-pronoms': true } }));
  await page.reload();
  await back.click();
  await expect(page).toHaveURL(/\/pronoms#tableau$/);
  await expect(table(page)).toBeVisible();
});
