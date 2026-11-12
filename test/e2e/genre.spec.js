import { test, expect } from '@playwright/test';

const FLAGS_ROUTE = /\/api\/flags$/;
const SESSION_ROUTE = /\/api\/constructions\/genre\/session/;
const ANSWERS_ROUTE = /\/api\/constructions\/genre\/answers$/;

const MAISON = {
  word: 'maison',
  item: '',
  gender: 'f',
  articles: ['le', 'la'],
  answer: 'la',
  translations: ['casa', 'lar'],
  rule: { ending: 'aison', usualGender: 'f', exception: false },
};
const IMAGE = {
  word: 'image',
  item: '',
  gender: 'f',
  articles: ['un', 'une'],
  answer: 'une',
  translations: ['imagem'],
  rule: { ending: 'age', usualGender: 'm', exception: true },
};

/**
 * Opens the Genre tab with the flag on and a mocked session, collecting every answer the page records.
 * @returns {Promise<object[]>}
 */
async function openGenre(page, cards = [MAISON]) {
  const answers = [];
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-constructions': true } }));
  await page.route(SESSION_ROUTE, (route) => route.fulfill({ json: { cards, due: 0, fresh: cards.length, nextDueOn: null } }));
  await page.route(ANSWERS_ROUTE, (route) => {
    answers.push(route.request().postDataJSON());
    return route.fulfill({ json: { step: 0, dueOn: '2026-11-13' } });
  });
  await page.goto('/constructions/genre');
  return answers;
}

const articles = (page) => page.getByRole('group', { name: 'Articles' }).getByRole('button');

test('the Genre tab asks for the article and records the answer', async ({ page }) => {
  const answers = await openGenre(page);
  await expect(page.getByRole('navigation', { name: 'Constructions' }).getByRole('link', { name: 'Genre' }))
    .toHaveAttribute('aria-current', 'page');
  await expect(page.getByText('Quel article va avec ce nom ?')).toBeVisible();
  await expect(page.getByText('article manquant')).toBeAttached();
  await expect(page.getByText('casa, lar')).toBeVisible();
  await expect(articles(page)).toHaveText(['1 le', '2 la']);

  await articles(page).filter({ hasText: 'la' }).click();
  await expect(page.getByRole('status')).toHaveText('Bonne réponse !');
  await expect(page.getByText('Les noms en -aison sont en général féminins.')).toBeVisible();
  await page.getByRole('button', { name: 'Suivant' }).click();

  await expect(page.getByText('Séance terminée !')).toBeVisible();
  await expect.poll(() => answers).toEqual([expect.objectContaining({ word: 'maison', item: '', outcome: 'right' })]);
});

test('keys 1 and 2 answer', async ({ page }) => {
  const answers = await openGenre(page);
  await expect(articles(page)).toHaveCount(2);
  await page.keyboard.press('1');
  await expect(page.getByRole('status')).toHaveText('Pas cette fois. Réponse : « la maison ».');
  await page.keyboard.press('2');
  await expect(page.getByRole('status')).toHaveText('Pas cette fois. Réponse : « la maison ».');
  await page.getByRole('button', { name: 'Suivant' }).click();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['wrong']);
});

test('a noun starting with a vowel asks un or une, and an exception to its ending is shown as such', async ({ page }) => {
  await openGenre(page, [IMAGE]);
  await expect(articles(page)).toHaveText(['1 un', '2 une']);
  await articles(page).filter({ hasText: 'une' }).click();
  await expect(page.getByRole('status')).toHaveText('Bonne réponse !');
  await expect(page.getByText('Exception : les noms en -age sont en général masculins.')).toBeVisible();
});

test('the tabs switch between Prépositions and Genre', async ({ page }) => {
  await openGenre(page);
  await expect(page).toHaveURL(/\/constructions\/genre$/);
  await expect(page.getByText('casa, lar')).toBeVisible();
  await page.route(/\/api\/constructions\/prepositions\/session/, (route) =>
    route.fulfill({ json: { cards: [], due: 0, fresh: 0, nextDueOn: null, preparing: 0 } }));
  await page.getByRole('navigation', { name: 'Constructions' }).getByRole('link', { name: 'Prépositions' }).click();
  await expect(page).toHaveURL(/\/constructions\/prepositions$/);
  await expect(page.getByText('Aucune construction à réviser.')).toBeVisible();
});
