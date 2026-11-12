import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { createConstructionRefresher, prepositionsGame } from '../server/constructions.js';
import { openDb } from '../server/db.js';
import { createDictionary } from '../server/dictionary.js';
import { createFlags } from '../server/flags.js';
import { createMyWords } from '../server/myWords.js';
import { createReviews } from '../server/reviews.js';
import { withServer } from './helpers.js';

const construction = (pattern, example, gap, answer) => ({
  pattern, meaning: `sens de ${pattern}`, example, gap, answer, portuguese: `pt de ${pattern}`, differsFromPortuguese: false,
});
const PENSER = [
  construction('penser à qqn/qqch', 'Je pense à toi.', 'Je pense ___ toi.', 'à'),
  construction('penser de qqch', 'Que penses-tu de ce film ?', 'Que penses-tu ___ ce film ?', 'de'),
];
const PARLER_OLD = [{ pattern: 'parler de qqch', meaning: 'falar de', example: 'Il parle de son travail.' }];
const PARLER = [construction('parler de qqch', 'Il parle de son travail.', 'Il parle ___ son travail.', 'de')];
const quiet = { error() {} };
const TODAY = '2026-11-12';

/**
 * The app with Prépositions over two saved verbs: penser, whose constructions are ready, and parler, whose
 * constructions predate gap sentences and come back from Claude when `finish` is called.
 */
function appWith({ on = true } = {}) {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  myWords.add('penser');
  myWords.add('parler');
  const cache = db.prepare('INSERT INTO preposition_cache (verb, json) VALUES (?, ?)');
  cache.run('penser', JSON.stringify(PENSER));
  cache.run('parler', JSON.stringify(PARLER_OLD));
  const asked = [];
  let finish;
  const found = new Promise((resolve) => { finish = () => resolve(PARLER); });
  const dictionary = createDictionary({
    db, fetchDefinition: async () => null, logger: quiet, findPrepositions: (verb) => (asked.push(verb), found),
  });
  const app = createApp({
    db,
    myWords,
    reviews: createReviews(db),
    games: [prepositionsGame({
      myWords, dictionary, conjugator: { isVerb: () => true }, refresher: createConstructionRefresher({ dictionary, logger: quiet }),
    })],
    flags: createFlags({ overrides: { 'cahier-constructions': on } }),
    logger: quiet,
  });
  return { app, asked, finish: async () => { finish(); await found; await new Promise((resolve) => setImmediate(resolve)); } };
}

const sessionOn = (base) => fetch(`${base}/api/constructions/prepositions/session?today=${TODAY}`).then((res) => res.json());
const answer = (base, body) => fetch(`${base}/api/constructions/prepositions/answers`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
const itemsOf = (session) => session.cards.map(({ word, item }) => `${word}: ${item}`).sort();

test('with the flag off, the Prépositions API does not exist', () =>
  withServer(appWith({ on: false }).app, async (base) => {
    const session = await fetch(`${base}/api/constructions/prepositions/session`);
    const answered = await answer(base, { word: 'penser', item: 'penser à qqn/qqch', outcome: 'right' });
    for (const res of [session, answered]) assert.deepEqual([res.status, await res.json()], [404, { error: 'not_found' }]);
  }));

test('a session lists the constructions of saved verbs and how many verbs are being prepared', async () => {
  const { app, asked, finish } = appWith();
  await withServer(app, async (base) => {
    const first = await sessionOn(base);
    assert.deepEqual(itemsOf(first), ['penser: penser de qqch', 'penser: penser à qqn/qqch']);
    assert.equal(first.preparing, 1);
    assert.deepEqual(asked, ['parler']);
    const card = first.cards.find(({ item }) => item === 'penser à qqn/qqch');
    assert.equal(card.sentence, 'Je pense ___ toi.');
    assert.equal(card.answer, 'à');
    assert.equal(card.portuguese, 'pt de penser à qqn/qqch');

    await finish();
    const second = await sessionOn(base);
    assert.deepEqual(itemsOf(second), ['parler: parler de qqch', 'penser: penser de qqch', 'penser: penser à qqn/qqch']);
    assert.equal(second.preparing, 0);
    assert.deepEqual(asked, ['parler']);
  });
});

test('answers are recorded per construction', () =>
  withServer(appWith().app, async (base) => {
    const res = await answer(base, { word: 'penser', item: 'penser à qqn/qqch', outcome: 'right', today: TODAY });
    assert.deepEqual([res.status, await res.json()], [200, { step: 0, dueOn: '2026-11-13' }]);
    assert.deepEqual(itemsOf(await sessionOn(base)), ['penser: penser de qqch']);
  }));
