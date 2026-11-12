import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { openDb } from '../server/db.js';
import { createFlags } from '../server/flags.js';
import { genreGame } from '../server/genre.js';
import { createMyWords } from '../server/myWords.js';
import { toEntry } from '../server/reverso.js';
import { createReviews } from '../server/reviews.js';
import { fixture, withServer } from './helpers.js';

const quiet = { error() {} };
const TODAY = '2026-11-12';

function appWith({ on = true } = {}) {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  ['homme', 'penser', 'belle'].forEach((word) => myWords.add(word));
  const dictionary = { definitions: async (word) => toEntry(fixture(word)) };
  return createApp({
    db,
    myWords,
    reviews: createReviews(db),
    games: [genreGame({ myWords, dictionary, logger: quiet })],
    flags: createFlags({ overrides: { 'cahier-constructions': on } }),
    logger: quiet,
  });
}

const sessionOn = (base) => fetch(`${base}/api/constructions/genre/session?today=${TODAY}`).then((res) => res.json());
const answer = (base, body) => fetch(`${base}/api/constructions/genre/answers`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('with the flag off, the Genre API does not exist', () =>
  withServer(appWith({ on: false }), async (base) => {
    const session = await fetch(`${base}/api/constructions/genre/session`);
    const answered = await answer(base, { word: 'homme', outcome: 'right' });
    for (const res of [session, answered]) assert.deepEqual([res.status, await res.json()], [404, { error: 'not_found' }]);
  }));

test('a Genre session asks for the saved nouns only, and an answer schedules the noun', () =>
  withServer(appWith(), async (base) => {
    const first = await sessionOn(base);
    assert.deepEqual(first.cards.map(({ word, answer: article }) => [word, article]), [['homme', 'un']]);

    const res = await answer(base, { word: 'homme', item: '', outcome: 'right', today: TODAY });
    assert.deepEqual([res.status, await res.json()], [200, { step: 0, dueOn: '2026-11-13' }]);
    assert.deepEqual(await sessionOn(base), { cards: [], due: 0, fresh: 0, nextDueOn: '2026-11-13' });
  }));
