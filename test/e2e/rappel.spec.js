import { test, expect } from '@playwright/test';

const FLAGS_ROUTE = /\/api\/flags$/;
const SESSION_ROUTE = /\/api\/rappel\/session/;
const ANSWERS_ROUTE = /\/api\/rappel\/answers$/;

const PENSER = {
  word: 'penser',
  item: '',
  sentence: 'Elle **pensait** changer de travail cette année.',
  answer: 'pensait',
  portuguese: 'Ela **pretendia** mudar de emprego este ano.',
  definition: "avoir l'intention de faire quelque chose",
  translations: ['pretender'],
  pos: 'Verb',
  gender: null,
  level: 'B1',
};
const MAISON = {
  word: 'maison',
  item: '',
  sentence: 'La **maison** de ma grand-mère est grande.',
  answer: 'maison',
  portuguese: null,
  definition: "bâtiment où l'on habite",
  translations: ['casa', 'lar'],
  pos: 'Noun',
  gender: 'f',
  level: 'A1',
};

/**
 * Opens Rappel with the flag on, a mocked session, and every answer the page records collected.
 * @returns {Promise<{ answers: object[], days: string[] }>}
 */
async function openRappel(page, { cards = [PENSER], nextDueOn = null, saveStatus = 200 } = {}) {
  const answers = [];
  const days = [];
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-rappel': true } }));
  await page.route(SESSION_ROUTE, (route) => {
    days.push(new URL(route.request().url()).searchParams.get('today'));
    return route.fulfill({ json: { cards, due: 0, fresh: cards.length, nextDueOn } });
  });
  await page.route(ANSWERS_ROUTE, (route) => {
    answers.push(route.request().postDataJSON());
    return saveStatus === 200
      ? route.fulfill({ json: { step: 0, dueOn: '2026-11-13' } })
      : route.fulfill({ status: saveStatus, json: { error: 'internal' } });
  });
  await page.goto('/rappel');
  return { answers, days };
}

const answerBox = (page) => page.getByRole('textbox', { name: 'Votre réponse' });
const verdict = (page) => page.getByRole('status');
const next = (page) => page.getByRole('button', { name: 'Suivant' });

test('the menu shows Rappel only while its flag is on', async ({ page }) => {
  const menu = page.getByRole('navigation', { name: 'Menu' }).getByRole('link');
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: {} }));
  await page.goto('/');
  await expect(menu.filter({ hasText: 'Memoir' })).toBeVisible();
  await expect(menu.filter({ hasText: 'Rappel' })).toHaveCount(0);

  await page.unroute(FLAGS_ROUTE);
  await page.route(FLAGS_ROUTE, (route) => route.fulfill({ json: { 'cahier-rappel': true } }));
  await page.reload();
  await expect(menu.filter({ hasText: 'Rappel' })).toBeVisible();
  const labels = await menu.allInnerTexts();
  expect(labels.indexOf('Rappel')).toBe(labels.indexOf('Memoir') + 1);
});

test('typing the word in the sentence records a right answer', async ({ page }) => {
  const { answers, days } = await openRappel(page);
  await expect(page.getByRole('heading', { name: 'Rappel' })).toBeVisible();
  await expect(page.getByText('Quel mot complète la phrase ?')).toBeVisible();
  await expect(page.getByText('mot manquant')).toBeAttached();
  await expect(page.getByText('Ela pretendia mudar de emprego este ano.')).toBeVisible();
  await expect(page.getByText('pretender', { exact: true })).toBeVisible();

  await answerBox(page).fill('pensait');
  await answerBox(page).press('Enter');
  await expect(verdict(page)).toHaveText('Bonne réponse !');
  await expect(page.getByText('Elle pensait changer de travail cette année.')).toBeVisible();
  await next(page).click();

  await expect(page.getByText('Séance terminée !')).toBeVisible();
  await expect(page.getByText('1 sur 1 du premier coup.')).toBeVisible();
  expect(days[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await expect.poll(() => answers).toEqual([{ word: 'penser', item: '', outcome: 'right', today: days[0] }]);
});

test('the dictionary form counts but shows the sentence’s form', async ({ page }) => {
  const { answers } = await openRappel(page);
  await answerBox(page).fill('penser');
  await page.getByRole('button', { name: 'Vérifier' }).click();
  await expect(verdict(page)).toHaveText('Bonne réponse ! Dans cette phrase : « pensait ».');
  await next(page).click();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['right']);
});

test('a missed word comes back and is recorded once, as wrong', async ({ page }) => {
  const { answers } = await openRappel(page, { cards: [PENSER, MAISON] });
  await answerBox(page).fill('pensais');
  await answerBox(page).press('Enter');
  await expect(verdict(page)).toHaveText('Pas cette fois. Réponse : « pensait ».');
  await next(page).click();

  await expect(page.getByText('casa, lar')).toBeVisible();
  await answerBox(page).fill('maison');
  await answerBox(page).press('Enter');
  await next(page).click();

  await expect(page.getByText('Ela pretendia mudar de emprego este ano.')).toBeVisible();
  await expect(answerBox(page)).toHaveValue('');
  await answerBox(page).fill('pensait');
  await answerBox(page).press('Enter');
  await next(page).click();

  await expect(page.getByText('1 sur 2 du premier coup.')).toBeVisible();
  await expect.poll(() => answers.map(({ word, outcome }) => `${word} ${outcome}`)).toEqual(['penser wrong', 'maison right']);
});

test('the hint shows the first letter and records hinted', async ({ page }) => {
  const { answers } = await openRappel(page);
  await page.getByRole('button', { name: 'Indice' }).click();
  await expect(page.getByText('Commence par « p »')).toBeVisible();
  await answerBox(page).fill('pensait');
  await answerBox(page).press('Enter');
  await next(page).click();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['hinted']);
});

test('J’avais raison turns a miss into a right answer', async ({ page }) => {
  const { answers } = await openRappel(page);
  await answerBox(page).fill('pensiat');
  await answerBox(page).press('Enter');
  await page.getByRole('button', { name: "J'avais raison" }).click();
  await expect(verdict(page)).toHaveText('Compté comme juste.');
  await next(page).click();
  await expect(page.getByText('Séance terminée !')).toBeVisible();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['right']);
});

test('Je ne sais pas shows the answer and records a miss', async ({ page }) => {
  const { answers } = await openRappel(page);
  await page.getByRole('button', { name: 'Je ne sais pas' }).click();
  await expect(verdict(page)).toHaveText('Réponse : « pensait ».');
  await expect(page.getByRole('button', { name: "J'avais raison" })).toHaveCount(0);
  await next(page).click();
  await expect(page.getByText('Ela pretendia mudar de emprego este ano.')).toBeVisible();
  await expect.poll(() => answers.map(({ outcome }) => outcome)).toEqual(['wrong']);
});

test('with nothing due, the page says when to come back', async ({ page }) => {
  await openRappel(page, { cards: [], nextDueOn: '2026-11-20' });
  await expect(page.getByText(/^Rien à réviser aujourd'hui\. Prochaine révision : \w+ 20 novembre\.$/)).toBeVisible();
});

test('with no saved words, the page points to Mes mots', async ({ page }) => {
  await openRappel(page, { cards: [] });
  await expect(page.getByText('Aucun mot à réviser.')).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Voir mes mots' })).toHaveAttribute('href', '/mes-mots');
});

test('a failed save does not stop the session', async ({ page }) => {
  await openRappel(page, { cards: [PENSER, MAISON], saveStatus: 500 });
  await answerBox(page).fill('pensait');
  await answerBox(page).press('Enter');
  await next(page).click();
  await expect(page.getByText('casa, lar')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText("Une réponse n'a pas pu être enregistrée.");
});
