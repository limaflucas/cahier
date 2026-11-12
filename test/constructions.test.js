import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createConstructionRefresher, isDrillable, needsRefresh, prepositionCard, prepositionsGame } from '../server/constructions.js';
import { openDb } from '../server/db.js';
import { createMyWords } from '../server/myWords.js';

const construction = (pattern, example, gap, answer, more = {}) => ({
  pattern, meaning: `sens de ${pattern}`, example, gap, answer, portuguese: `pt de ${pattern}`, differsFromPortuguese: false, ...more,
});
const PENSER_A = construction('penser à qqn/qqch', 'Je pense à toi.', 'Je pense ___ toi.', 'à', { differsFromPortuguese: true });
const PENSER_AU = construction('penser à qqch', 'Il pense au voyage.', 'Il pense ___ voyage.', 'au');
const PARLER_D = construction('parler de qqn', 'Elle parle d’elle.', 'Elle parle ___elle.', "d'");
const AIMER = construction('aimer qqch', "J'aime le chocolat.", "J'aime ___ le chocolat.", '');
const quiet = { error() {} };
const tick = () => new Promise((resolve) => setImmediate(resolve));

test('a construction is drillable when its blank gives back its example', () => {
  for (const drillable of [PENSER_A, PENSER_AU, PARLER_D, AIMER]) assert.equal(isDrillable(drillable), true, drillable.pattern);
  assert.equal(isDrillable({ ...PENSER_A, gap: 'Je pense ____ toi.' }), true);
  assert.equal(isDrillable({ ...PARLER_D, gap: 'Elle parle ___ elle.' }), true);
});

test('a gap with no blank, two blanks or another sentence is not drillable', () => {
  assert.equal(isDrillable({ ...PENSER_A, gap: 'Je pense à toi.' }), false);
  assert.equal(isDrillable({ ...PENSER_A, gap: 'Je pense ___ toi et ___ lui.' }), false);
  assert.equal(isDrillable({ ...PENSER_A, gap: 'Tu penses ___ moi.' }), false);
  assert.equal(isDrillable({ ...PENSER_A, answer: 'de' }), false);
});

test('old constructions without a gap, or none cached at all, need a refresh', () => {
  const { gap, answer, portuguese, differsFromPortuguese, ...old } = PENSER_A;
  assert.equal(needsRefresh(undefined), true);
  assert.equal(needsRefresh([PENSER_A, old]), true);
  assert.equal(needsRefresh([PENSER_A, AIMER]), false);
  assert.equal(needsRefresh([]), false);
});

test('a card asks for the preposition in the gap and shows the Portuguese construction', () => {
  assert.deepEqual(prepositionCard(PENSER_A), {
    sentence: 'Je pense ___ toi.',
    answer: 'à',
    pattern: 'penser à qqn/qqch',
    meaning: 'sens de penser à qqn/qqch',
    portuguese: 'pt de penser à qqn/qqch',
    differsFromPortuguese: true,
    example: 'Je pense à toi.',
  });
});

/**
 * The Prépositions game over saved words, with the constructions and refreshes given.
 * @returns {{ game: object, refreshed: string[][] }}
 */
function gameWith({ saved, cached }) {
  const db = openDb(':memory:');
  const insert = db.prepare('INSERT INTO my_words (word, added_at) VALUES (?, ?)');
  saved.forEach((word, i) => insert.run(word, `2026-11-${String(10 - i).padStart(2, '0')} 10:00:00`));
  const refreshed = [];
  const game = prepositionsGame({
    myWords: createMyWords(db),
    dictionary: { cachedPrepositions: (verbs) => new Map(verbs.filter((verb) => cached[verb]).map((verb) => [verb, cached[verb]])) },
    conjugator: { isVerb: (word) => word !== 'maison' },
    refresher: { refresh: (verbs) => (refreshed.push(verbs), verbs.length) },
  });
  return { game, refreshed };
}

test('items are the drillable constructions of saved verbs, newest verb first', async () => {
  const broken = { ...PENSER_AU, pattern: 'penser sur qqch', gap: 'Il pense voyage.' };
  const { game } = gameWith({
    saved: ['aimer', 'maison', 'penser'],
    cached: { aimer: [AIMER], penser: [PENSER_A, broken, PENSER_AU] },
  });
  const { items } = await game.items();
  assert.equal(game.name, 'prepositions');
  assert.equal(game.flag, 'cahier-constructions');
  assert.deepEqual(items.map(({ word, item }) => [word, item]), [
    ['aimer', 'aimer qqch'], ['penser', 'penser à qqn/qqch'], ['penser', 'penser à qqch'],
  ]);
  assert.deepEqual(await game.cardOf(items[1], undefined), prepositionCard(PENSER_A));
});

test('the same pattern twice is drilled once', async () => {
  const again = { ...PENSER_A, example: 'Je pense à lui.', gap: 'Je pense ___ lui.' };
  const { game } = gameWith({ saved: ['penser'], cached: { penser: [PENSER_A, again] } });
  assert.deepEqual((await game.items()).items.map(({ item }) => item), ['penser à qqn/qqch']);
});

test('verbs whose constructions are old or missing are refreshed and counted as preparing', async () => {
  const { gap, answer, portuguese, differsFromPortuguese, ...old } = PENSER_A;
  const { game, refreshed } = gameWith({ saved: ['aller', 'penser', 'aimer'], cached: { penser: [old], aimer: [AIMER] } });
  const { items, preparing } = await game.items();
  assert.deepEqual(items.map(({ item }) => item), ['aimer qqch']);
  assert.equal(preparing, 2);
  assert.deepEqual(refreshed, [['aller', 'penser']]);
});

test('the refresher handles one verb at a time and each once', async () => {
  const asked = [];
  const answers = [];
  const dictionary = { refreshPrepositions: (verb) => new Promise((resolve) => { asked.push(verb); answers.push(resolve); }) };
  const refresher = createConstructionRefresher({ dictionary, logger: quiet });

  assert.equal(refresher.refresh(['penser', 'parler']), 2);
  assert.deepEqual(asked, ['penser']);
  assert.equal(refresher.refresh(['penser', 'aller']), 2);

  answers[0]([]);
  await tick();
  assert.deepEqual(asked, ['penser', 'parler']);
  answers[1]([]);
  await tick();
  answers[2]([]);
  await tick();
  assert.deepEqual(asked, ['penser', 'parler', 'aller']);
  assert.equal(refresher.refresh(['penser', 'parler', 'aller']), 0);
});

test('a failed refresh moves on to the next verb', async () => {
  const asked = [];
  const errors = [];
  const dictionary = {
    refreshPrepositions: async (verb) => {
      asked.push(verb);
      if (verb === 'penser') throw new Error('database is locked');
      return [];
    },
  };
  const refresher = createConstructionRefresher({ dictionary, logger: { error: (...args) => errors.push(args) } });
  refresher.refresh(['penser', 'parler']);
  await tick();
  await tick();
  assert.deepEqual(asked, ['penser', 'parler']);
  assert.equal(errors.length, 1);
});
