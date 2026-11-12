import { test, expect } from '@playwright/test';

const FLAGS_ROUTE = /\/api\/flags$/;
const SESSION_ROUTE = /\/api\/constructions\/prepositions\/session/;
const ANSWERS_ROUTE = /\/api\/constructions\/prepositions\/answers$/;

const card = (word, pattern, sentence, answer, more = {}) => ({
  word,
  item: pattern,
  sentence,
  answer,
  pattern,
  meaning: 'pensar em alguém ou algo',
  portuguese: 'pensar em alguém/algo',
  differsFromPortuguese: false,
  example: sentence.replace('___', answer),
  ...more,
});
const PENSER_A = card('penser', 'penser à qqn/qqch', 'Je pense ___ toi.', 'à', { differsFromPortuguese: true });
const PENSER_AU = card('penser', 'penser à qqch', 'Il pense ___ voyage.', 'au', { portuguese: 'pensar na viagem' });
const AIMER = card('aimer', 'aimer qqch', "J'aime ___ le chocolat.", '', {
  meaning: 'gostar de algo', portuguese: 'gostar de algo', differsFromPortuguese: true, example: "J'aime le chocolat.",
});

/**
 * Opens Prépositions with the flag on and a mocked session, collecting every answer the page records.
 * @returns {Promise<object[]>}
 */
async function openPrepositions(page, { cards = [PENSER_A], preparing = 0, url = '/constructions/prepositions' } = {}) {
  const answers = [];
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-constructions': true } }));
  await page.route(SESSION_ROUTE, (route) => route.fulfill({ json: { cards, due: 0, fresh: cards.length, nextDueOn: null, preparing } }));
  await page.route(ANSWERS_ROUTE, (route) => {
    answers.push(route.request().postDataJSON());
    return route.fulfill({ json: { step: 0, dueOn: '2026-11-13' } });
  });
  await page.goto(url);
  return answers;
}

const answerBox = (page) => page.getByRole('textbox', { name: 'Votre réponse' });
const verdict = (page) => page.getByRole('status');
const preposition = (page, name) => page.getByRole('group', { name: 'Prépositions' }).getByRole('button', { name, exact: true });

test('the menu shows Constructions only while its flag is on', async ({ page }) => {
  const menu = page.getByRole('navigation', { name: 'Menu' }).getByRole('link');
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-rappel': true } }));
  await page.goto('/');
  await expect(menu.filter({ hasText: 'Rappel' })).toBeVisible();
  await expect(menu.filter({ hasText: 'Constructions' })).toHaveCount(0);

  await page.unroute(FLAGS_ROUTE);
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-rappel': true, 'cahier-constructions': true } }));
  await page.reload();
  await expect(menu.filter({ hasText: 'Constructions' })).toBeVisible();
  const labels = await menu.allInnerTexts();
  expect(labels.indexOf('Constructions')).toBe(labels.indexOf('Rappel') + 1);
});

test('/constructions opens Prépositions', async ({ page }) => {
  await openPrepositions(page, { url: '/constructions' });
  await expect(page).toHaveURL(/\/constructions\/prepositions$/);
  await expect(page.getByRole('heading', { name: 'Constructions' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Constructions' }).getByRole('link', { name: 'Prépositions' }))
    .toHaveAttribute('aria-current', 'page');
});

test('typing the preposition records a right answer and shows the Portuguese contrast', async ({ page }) => {
  const answers = await openPrepositions(page);
  await expect(page.getByText('Quelle préposition complète la phrase ?')).toBeVisible();
  await expect(page.getByText('préposition manquante')).toBeAttached();
  await expect(page.getByText('pensar em alguém ou algo')).toBeVisible();

  await answerBox(page).fill('à');
  await answerBox(page).press('Enter');
  await expect(verdict(page)).toHaveText('Bonne réponse !');
  await expect(page.getByText('Je pense à toi.')).toBeVisible();
  await expect(page.getByText('penser à qqn/qqch')).toBeVisible();
  await expect(page.getByText('pensar em alguém/algo', { exact: true })).toBeVisible();
  await expect(page.getByText('≠ português')).toBeVisible();
  await page.getByRole('button', { name: 'Suivant' }).click();

  await expect(page.getByText('Séance terminée !')).toBeVisible();
  await expect.poll(() => answers.map(({ word, item, outcome }) => [word, item, outcome]))
    .toEqual([['penser', 'penser à qqn/qqch', 'right']]);
});

test('a preposition button answers at once', async ({ page }) => {
  const answers = await openPrepositions(page);
  await preposition(page, 'de').click();
  await expect(verdict(page)).toHaveText('Pas cette fois. Réponse : « à ».');
  await page.getByRole('button', { name: 'Suivant' }).click();
  await expect(page.getByText('Quelle préposition complète la phrase ?')).toBeVisible();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['wrong']);
});

test('à for au counts and explains the contraction', async ({ page }) => {
  const answers = await openPrepositions(page, { cards: [PENSER_AU] });
  await preposition(page, 'à').click();
  await expect(verdict(page)).toHaveText('Bonne réponse ! à + le = au.');
  await expect(page.getByText('≠ português')).toHaveCount(0);
  await page.getByRole('button', { name: 'Suivant' }).click();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['right']);
});

test('sans préposition answers a construction without one', async ({ page }) => {
  const answers = await openPrepositions(page, { cards: [AIMER] });
  await page.getByRole('button', { name: 'sans préposition' }).click();
  await expect(verdict(page)).toHaveText('Bonne réponse !');
  await expect(page.getByText("J'aime le chocolat.")).toBeVisible();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['right']);
});

test('verbs still being prepared are announced', async ({ page }) => {
  await openPrepositions(page, { cards: [], preparing: 3 });
  await expect(page.getByText('3 verbes en préparation : revenez dans quelques minutes.')).toBeVisible();
});
