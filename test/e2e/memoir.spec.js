import { test, expect } from '@playwright/test';

const QUESTION = {
  word: 'mener',
  sense: 0,
  direction: 'pt-fr',
  clue: { kind: 'translation', text: 'levar, conduzir' },
  options: ['aboutir', 'mener', 'évoquer', 'soutenir'],
  answer: 1,
  reveal: {
    pos: 'Verb',
    gender: null,
    level: 'B1',
    definition: "conduire quelqu'un d'un endroit à un autre",
    translations: ['levar', 'conduzir'],
    example: null,
  },
};
const QUESTION_ROUTE = /\/api\/memoir\/question/;

const options = (page) => page.getByRole('main').getByRole('listitem').getByRole('button');

test('the four options are stacked one above the other, full width', async ({ page }) => {
  await page.route(QUESTION_ROUTE, (route) => route.fulfill({ json: QUESTION }));
  await page.goto('/memoir');
  await expect(options(page)).toHaveCount(4);

  const boxes = await Promise.all((await options(page).all()).map((option) => option.boundingBox()));
  boxes.slice(1).forEach((below, i) => {
    const above = boxes[i];
    expect(below.x).toBe(above.x);
    expect(below.width).toBe(above.width);
    expect(below.y).toBeGreaterThanOrEqual(above.y + above.height);
  });
});

test('Memoir asks for at least four saved words', async ({ page }) => {
  await page.route(QUESTION_ROUTE, (route) => route.fulfill({ status: 404, json: { error: 'not_enough_words' } }));
  await page.goto('/memoir');
  await expect(page.getByText("Memoir a besoin d'au moins 4 mots enregistrés.")).toBeVisible();
});
