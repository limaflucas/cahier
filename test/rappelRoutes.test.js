import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { openDb } from '../server/db.js';
import { createFlags } from '../server/flags.js';
import { createMyWords } from '../server/myWords.js';
import { rappelGame } from '../server/rappel.js';
import { toEntry } from '../server/reverso.js';
import { createReviews } from '../server/reviews.js';
import { addDays, localDay } from '../server/schedule.js';
import { fixture, withServer } from './helpers.js';

const PENSER = toEntry(fixture('penser'));
const quiet = { error() {} };

function appWith({ on = true } = {}) {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  myWords.add('penser');
  const dictionary = { definitions: async (word) => (word === 'penser' ? PENSER : null) };
  return createApp({
    db,
    myWords,
    reviews: createReviews(db),
    games: [rappelGame({ myWords, dictionary, conjugator: { forms: () => [] }, logger: quiet })],
    flags: createFlags({ overrides: { 'cahier-rappel': on } }),
    logger: quiet,
  });
}

const sessionOn = (base, today) => fetch(`${base}/api/rappel/session${today === undefined ? '' : `?today=${today}`}`);
const answer = (base, body) =>
  fetch(`${base}/api/rappel/answers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('with the flag off, the Rappel API does not exist', () =>
  withServer(appWith({ on: false }), async (base) => {
    for (const res of [await sessionOn(base, '2026-11-12'), await answer(base, { word: 'penser', outcome: 'right' })]) {
      assert.equal(res.status, 404);
      assert.deepEqual(await res.json(), { error: 'not_found' });
    }
  }));

test('a session lists today’s cards', () =>
  withServer(appWith(), async (base) => {
    const res = await sessionOn(base, '2026-11-12');
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    const session = await res.json();
    assert.deepEqual({ ...session, cards: session.cards.length }, { cards: 1, due: 0, fresh: 1, nextDueOn: null });
    const [card] = session.cards;
    assert.equal(card.word, 'penser');
    assert.equal(card.item, '');
    assert.equal(card.answer, 'penser');
    assert.equal(card.sentence, "Il faut **penser** avant d'agir dans cette situation.");
  }));

test('an answer moves the word along and takes it out of today’s session', () =>
  withServer(appWith(), async (base) => {
    const res = await answer(base, { word: 'penser', item: '', outcome: 'right', today: '2026-11-12' });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { step: 0, dueOn: '2026-11-13' });

    const today = await (await sessionOn(base, '2026-11-12')).json();
    assert.deepEqual(today, { cards: [], due: 0, fresh: 0, nextDueOn: '2026-11-13' });

    const tomorrow = await (await sessionOn(base, '2026-11-13')).json();
    assert.equal(tomorrow.due, 1);
    assert.equal(tomorrow.cards[0].level, 'B2');
  }));

test('a bad day or answer is refused', () =>
  withServer(appWith(), async (base) => {
    for (const today of ['2026-02-30', 'demain']) {
      const res = await sessionOn(base, today);
      assert.equal(res.status, 400, today);
      assert.deepEqual(await res.json(), { error: 'invalid_day' });
    }
    const late = await answer(base, { word: 'penser', outcome: 'right', today: 'hier' });
    assert.deepEqual([late.status, await late.json()], [400, { error: 'invalid_day' }]);
    for (const body of [{ word: 'penser', outcome: 'peut-être' }, { outcome: 'right' }, { word: 'penser', item: 3, outcome: 'right' }]) {
      const res = await answer(base, body);
      assert.deepEqual([res.status, await res.json()], [400, { error: 'invalid_answer' }], JSON.stringify(body));
    }
  }));

test('without a day, the server uses its own', () =>
  withServer(appWith(), async (base) => {
    assert.equal((await sessionOn(base)).status, 200);
    const res = await answer(base, { word: 'penser', outcome: 'wrong' });
    assert.deepEqual(await res.json(), { step: 0, dueOn: addDays(localDay(), 1) });
  }));

test('an answer for an unsaved word is 404', () =>
  withServer(appWith(), async (base) => {
    const res = await answer(base, { word: 'inconnu', outcome: 'right', today: '2026-11-12' });
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_saved' });
  }));
