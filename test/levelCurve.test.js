import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { prepositionsGame } from '../server/constructions.js';
import { openDb } from '../server/db.js';
import { buildSession } from '../server/deck.js';
import { createFlags } from '../server/flags.js';
import { genreGame } from '../server/genre.js';
import { createMemoir } from '../server/memoir.js';
import { createMyWords } from '../server/myWords.js';
import { rappelCard, rappelGame } from '../server/rappel.js';
import { toEntry } from '../server/reverso.js';
import { createReviews, itemKey } from '../server/reviews.js';
import { createVerbPicker } from '../server/verbPicker.js';
import { fixture, withServer } from './helpers.js';

const E2 = Math.exp(-2);
const E8 = Math.exp(-8);
const TODAY = '2026-11-12';
const quiet = { error() {} };
const PENSER = toEntry(fixture('penser'));
const PENSER_FORMS = ['penser', 'pense', 'penses', 'pensons', 'pensez', 'pensent', 'pensait', 'pensé'];

/**
 * @param {number} actual
 * @param {number} expected
 */
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} instead of ${expected}`);

/**
 * @param {string | null} level
 * @param {string} definition
 * @param {string[]} translations
 * @param {{ fr: string, pt: string | null }[]} [examples]
 */
const sense = (level, definition, translations, examples = []) => ({ level, definition, tags: [], translations, examples });

/**
 * A parsed dictionary entry with one part of speech.
 * @param {string} word
 * @param {object[]} senses
 * @param {string} [pos]
 */
const entryOf = (word, senses, pos = 'Verb') => ({ query: word, words: [{ word, ipa: null, sections: [{ pos, gender: null, senses }] }] });

/**
 * Random number generators that each always return the same number, evenly spread over [0, 1).
 * @param {number} count
 * @returns {(() => number)[]}
 */
const sweep = (count) => Array.from({ length: count }, (_, i) => () => (i + 0.5) / count);

/**
 * @param {string[]} values
 * @returns {Record<string, number>} how often each value occurs
 */
const tally = (values) => values.reduce((counts, value) => ({ ...counts, [value]: (counts[value] ?? 0) + 1 }), {});

/**
 * Saved words in a fresh database, the first one saved last.
 * @param {string[]} words at most 60
 */
function savedWords(words) {
  const db = openDb(':memory:');
  const insert = db.prepare('INSERT INTO my_words (word, added_at) VALUES (?, ?)');
  words.forEach((word, i) => insert.run(word, `2026-11-01 10:${String(59 - i).padStart(2, '0')}:00`));
  return { db, myWords: createMyWords(db) };
}

/**
 * Which saved verb « Piocher » draws for each number of a sweep.
 * @param {Record<string, string[]>} levelsByVerb the levels of each verb's meanings, newest saved first
 * @returns {Promise<Record<string, number>>}
 */
async function verbPicks(levelsByVerb) {
  const { myWords } = savedWords(Object.keys(levelsByVerb));
  const dictionary = { definitions: async (verb) => entryOf(verb, levelsByVerb[verb].map((level) => sense(level, verb, [verb]))) };
  const picks = [];
  for (const random of sweep(20)) {
    picks.push(await createVerbPicker({ myWords, dictionary, conjugator: { isVerb: () => true }, random, logger: quiet }).pick());
  }
  return tally(picks);
}

test('Piocher draws a B1 verb as often as a C1 verb', async () => {
  assert.deepEqual(await verbPicks({ plier: ['B1'], saisir: ['C1'] }), { plier: 10, saisir: 10 });
});

test('Piocher almost never draws a verb whose meanings are all A1 next to a B2 verb', async () => {
  assert.deepEqual(await verbPicks({ plier: ['A1'], saisir: ['B2'] }), { saisir: 20 });
});

const MEMOIR_WORDS = {
  tirer: entryOf('tirer', [sense('A2', 'amener vers soi', ['puxar']), sense('B2', 'lancer un projectile', ['atirar'])]),
  flâner: entryOf('flâner', [sense('B1', 'se promener sans but', ['passear'])]),
  aboutir: entryOf('aboutir', [sense('B2', 'avoir comme résultat', ['resultar'])]),
  évoquer: entryOf('évoquer', [sense('C1', 'rappeler à la mémoire', ['evocar'])]),
  conduire: entryOf('conduire', [sense('A2', 'diriger un véhicule', ['guiar'])]),
};

/**
 * Memoir's question for each number of a sweep, over these saved words.
 * @param {Record<string, object>} entries by word, newest saved first
 * @param {object} request
 * @returns {Promise<object[]>}
 */
async function memoirQuestions(entries, request) {
  const { myWords } = savedWords(Object.keys(entries));
  const dictionary = { definitions: async (word) => entries[word] ?? null };
  const questions = [];
  for (const random of sweep(20)) {
    questions.push(await createMemoir({ myWords, dictionary, conjugator: { forms: () => [] }, random, logger: quiet }).question(request));
  }
  return questions;
}

test('Memoir asks the B2 meaning of a word far more often than its A2 one', async () => {
  const questions = await memoirQuestions(MEMOIR_WORDS, { word: 'tirer' });
  assert.deepEqual(tally(questions.map(({ reveal }) => reveal.level)), { A2: 2, B2: 18 });
});

test('Memoir draws B1, B2 and C1 words alike, and A2 words rarely', async () => {
  const { tirer, ...oneMeaningEach } = MEMOIR_WORDS;
  const questions = await memoirQuestions(oneMeaningEach, {});
  assert.deepEqual(tally(questions.map(({ word }) => word)), { flâner: 6, aboutir: 7, évoquer: 6, conduire: 1 });
});

test('a word’s first Rappel card asks its highest-weighted key meaning', () => {
  assert.deepEqual(rappelCard({ word: 'penser', entry: PENSER, forms: PENSER_FORMS, turn: 0 }), {
    sentence: "Il **pense** souvent à ses vacances d'été.",
    answer: 'pense',
    portuguese: 'Ele **se lembra** frequentemente das férias de verão.',
    definition: 'se souvenir de quelque chose du passé',
    translations: ['lembrar-se'],
    pos: 'Verb',
    gender: null,
    level: 'B2',
  });
});

test('Rappel asks key meanings below B1 after the others', () => {
  const entry = entryOf('penser', [
    sense('A2', 'courant', ['pensar'], [{ fr: 'Elle pense à lui.', pt: null }]),
    sense('B2', 'soutenu', ['cogitar'], [{ fr: 'Il pense le monde.', pt: null }]),
  ]);
  const definitions = [0, 1, 2].map((turn) => rappelCard({ word: 'penser', entry, forms: PENSER_FORMS, turn }).definition);
  assert.deepEqual(definitions, ['soutenu', 'courant', 'soutenu']);
});

test('Rappel weighs a word by its key meanings', async () => {
  const { myWords } = savedWords(['penser']);
  const game = rappelGame({ myWords, dictionary: { definitions: async () => PENSER }, conjugator: { forms: () => PENSER_FORMS }, logger: quiet });
  near(await game.weightOf({ word: 'penser', item: '' }), (E8 + 1 + 1) / 3);
});

test('Genre weighs a noun by its meanings', async () => {
  const { myWords } = savedWords(['homme']);
  const game = genreGame({ myWords, dictionary: { definitions: async () => toEntry(fixture('homme')) }, logger: quiet });
  near(await game.weightOf({ word: 'homme', item: '' }), (E8 + 1 + 1 + 1) / 4);
});

test('a construction takes its verb’s weight, and the unlevelled weight when the verb is unknown', async () => {
  const { myWords } = savedWords(['penser']);
  const game = prepositionsGame({
    myWords,
    dictionary: { definitions: async (word) => (word === 'penser' ? PENSER : null), cachedPrepositions: () => new Map() },
    conjugator: { isVerb: () => true },
    refresher: { refresh: () => 0 },
    logger: quiet,
  });
  near(await game.weightOf({ word: 'penser', item: 'penser à qqn/qqch' }), (E8 + 7) / 8);
  near(await game.weightOf({ word: 'inconnu', item: 'inconnu de qqch' }), E2);
});

/**
 * @param {number} count
 * @param {string} prefix
 * @returns {string[]}
 */
const wordsFrom = (count, prefix) => Array.from({ length: count }, (_, i) => `${prefix}${String(i).padStart(2, '0')}`);
const itemsOf = (words) => words.map((word) => ({ word, item: '' }));
const plainCard = async ({ word }) => ({ prompt: word });
const freshWords = (session) => session.cards.map(({ word }) => word).sort();

test('a day’s new items are drawn by weight among the 30 newest not seen yet', async () => {
  const light = wordsFrom(5, 'léger');
  const inReach = wordsFrom(25, 'proche');
  const beyond = wordsFrom(10, 'loin');
  const session = await buildSession({
    items: itemsOf([...light, ...inReach, ...beyond]),
    progress: new Map(),
    today: TODAY,
    cardOf: plainCard,
    weightOf: async ({ word }) => (light.includes(word) ? 0.0003 : 1),
  });
  assert.equal(session.fresh, 10);
  for (const word of freshWords(session)) assert.ok(inReach.includes(word), `${word} came in`);
});

test('each day draws its own new items and keeps them for the whole day', async () => {
  const items = itemsOf(wordsFrom(20, 'mot'));
  const on = (today, progress = new Map()) => buildSession({ items, progress, today, cardOf: plainCard });
  const morning = freshWords(await on(TODAY));
  assert.notDeepEqual(freshWords(await on('2026-11-13')), morning);

  const answered = morning.slice(0, 4);
  const progress = new Map(answered.map((word) => [
    itemKey({ word, item: '' }), { step: 0, dueOn: '2026-11-13', introducedOn: TODAY, answered: 1 },
  ]));
  assert.deepEqual(freshWords(await on(TODAY, progress)), morning.slice(4));
});

test('two games draw their new items apart', async () => {
  const items = itemsOf(wordsFrom(20, 'mot'));
  const drawOf = async (seed) => freshWords(await buildSession({ items, progress: new Map(), today: TODAY, cardOf: plainCard, seed }));
  assert.notDeepEqual(await drawOf('rappel'), await drawOf('genre'));
});

test('items without a card leave their place among the 30 newest to the next ones', async () => {
  const first = wordsFrom(10, 'avec');
  const cardless = wordsFrom(25, 'sans');
  const next = wordsFrom(10, 'après');
  const session = await buildSession({
    items: itemsOf([...first, ...cardless, ...next]),
    progress: new Map(),
    today: TODAY,
    cardOf: async ({ word }) => (cardless.includes(word) ? null : {}),
  });
  assert.equal(session.fresh, 10);
  assert.ok(freshWords(session).some((word) => next.includes(word)), 'only the ten newest could come in');
});

test('a Rappel session leaves a newly saved A1 word for later while B1 to C1 words wait', async () => {
  const words = ['facile', ...wordsFrom(11, 'mot')];
  const { db, myWords } = savedWords(words);
  const dictionary = {
    definitions: async (word) => entryOf(word, [sense(word === 'facile' ? 'A1' : 'B2', `sens de ${word}`, [`tradução de ${word}`])], 'Noun'),
  };
  const app = createApp({
    db,
    myWords,
    reviews: createReviews(db),
    games: [rappelGame({ myWords, dictionary, conjugator: { forms: () => [] }, logger: quiet })],
    flags: createFlags({ overrides: { 'cahier-rappel': true } }),
    logger: quiet,
  });
  await withServer(app, async (base) => {
    const { cards } = await (await fetch(`${base}/api/rappel/session?today=${TODAY}`)).json();
    assert.equal(cards.length, 10);
    assert.ok(!cards.some(({ word }) => word === 'facile'), 'the A1 word came in');
  });
});
