import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createMyWords } from '../server/myWords.js';
import { rappelCard, rappelGame } from '../server/rappel.js';
import { toEntry } from '../server/reverso.js';
import { fixture } from './helpers.js';

const PENSER = toEntry(fixture('penser'));
const PENSER_FORMS = ['penser', 'pense', 'penses', 'pensons', 'pensez', 'pensent', 'pensait', 'pensé'];
const sense = (definition, translations, examples = []) => ({ level: 'B1', definition, tags: [], translations, examples });
const entryOf = (word, ...senses) => ({ query: word, words: [{ word, ipa: null, sections: [{ pos: 'Verb', gender: null, senses }] }] });

test('the card blanks the word in an example of its first key meaning', () => {
  assert.deepEqual(rappelCard({ word: 'penser', entry: PENSER, forms: PENSER_FORMS, turn: 0 }), {
    sentence: "Il faut **penser** avant d'agir dans cette situation.",
    answer: 'penser',
    portuguese: 'É preciso **pensar** antes de agir nessa situação.',
    definition: 'utiliser son esprit pour réfléchir ou imaginer',
    translations: ['pensar'],
    pos: 'Verb',
    gender: null,
    level: 'A1',
  });
});

test('each turn uses the next key meaning, in turn', () => {
  const levels = [0, 1, 2, 3].map((turn) => rappelCard({ word: 'penser', entry: PENSER, forms: PENSER_FORMS, turn }))
    .map(({ pos, level }) => `${pos} ${level}`);
  assert.deepEqual(levels, ['Verb A1', 'Verb B2', 'Noun C1', 'Verb A1']);
});

test('the sentence hides the form it uses', () => {
  const entry = entryOf('penser', sense("avoir l'intention", ['pretender'], [
    { fr: 'Elle pensait changer de travail cette année.', pt: 'Ela **pretendia** mudar de emprego este ano.' },
  ]));
  const card = rappelCard({ word: 'penser', entry, forms: PENSER_FORMS, turn: 0 });
  assert.equal(card.sentence, 'Elle **pensait** changer de travail cette année.');
  assert.equal(card.answer, 'pensait');
});

test('the Portuguese sentence comes along when Reverso has one', () => {
  const first = rappelCard({ word: 'penser', entry: PENSER, forms: PENSER_FORMS, turn: 0 });
  const later = rappelCard({ word: 'penser', entry: PENSER, forms: PENSER_FORMS, turn: 3 });
  assert.equal(first.portuguese, 'É preciso **pensar** antes de agir nessa situação.');
  assert.equal(later.sentence, 'Je dois **penser** à mon avenir sérieusement.');
  assert.equal(later.portuguese, null);
});

test('a meaning whose examples never contain the word gives a meaning-only card', () => {
  const entry = entryOf('se plier', sense('se soumettre à une règle', ['submeter-se', 'curvar-se'], [
    { fr: 'Il obéit aux règles du club.', pt: null },
  ]));
  assert.deepEqual(rappelCard({ word: 'se plier', entry, forms: ['se plier'], turn: 0 }), {
    sentence: null,
    answer: 'se plier',
    portuguese: null,
    definition: 'se soumettre à une règle',
    translations: ['submeter-se', 'curvar-se'],
    pos: 'Verb',
    gender: null,
    level: 'B1',
  });
});

test('a sentence that uses the word twice is not used', () => {
  const entry = entryOf('penser', sense('réfléchir', ['pensar'], [
    { fr: 'Je pense, donc je pense encore.', pt: null },
    { fr: 'Elle pense à son avenir.', pt: null },
  ]));
  assert.equal(rappelCard({ word: 'penser', entry, forms: PENSER_FORMS, turn: 0 }).sentence, 'Elle **pense** à son avenir.');
});

test('a word with neither a sentence nor translations gives no card', () => {
  const entry = entryOf('penser', sense('réfléchir', [], [{ fr: 'Il réfléchit.', pt: null }]));
  assert.equal(rappelCard({ word: 'penser', entry, forms: PENSER_FORMS, turn: 0 }), null);
  assert.equal(rappelCard({ word: 'penser', entry: null, forms: PENSER_FORMS, turn: 0 }), null);
});

test('an unusable meaning gives its turn to the next one', () => {
  const entry = entryOf('penser',
    sense('premier', ['pensar'], [{ fr: 'Elle pense à lui.', pt: null }]),
    { ...sense('deuxième', []), level: 'B2' });
  assert.equal(rappelCard({ word: 'penser', entry, forms: PENSER_FORMS, turn: 1 }).definition, 'premier');
});

function gameWith({ saved = [], definitions = async () => PENSER, logger = { error() {} } } = {}) {
  const db = openDb(':memory:');
  const insert = db.prepare('INSERT INTO my_words (word, added_at) VALUES (?, ?)');
  saved.forEach(([word, addedAt]) => insert.run(word, addedAt));
  return rappelGame({
    myWords: createMyWords(db),
    dictionary: { definitions },
    conjugator: { forms: (word) => (word === 'penser' ? PENSER_FORMS : []) },
    logger,
  });
}

test('items are the saved words, newest first', async () => {
  const game = gameWith({ saved: [['maison', '2026-11-01 10:00:00'], ['penser', '2026-11-10 09:00:00'], ['belle', '2026-11-05 08:00:00']] });
  assert.equal(game.name, 'rappel');
  assert.equal(game.flag, 'cahier-rappel');
  assert.deepEqual((await game.items()).items, [
    { word: 'penser', item: '' }, { word: 'belle', item: '' }, { word: 'maison', item: '' },
  ]);
});

test('a card’s turn is how often the word was answered', async () => {
  const game = gameWith();
  assert.equal((await game.cardOf({ word: 'penser', item: '' }, undefined)).level, 'A1');
  assert.equal((await game.cardOf({ word: 'penser', item: '' }, { answered: 1 })).level, 'B2');
});

test('a dictionary failure gives no card', async () => {
  const errors = [];
  const game = gameWith({ definitions: async () => { throw new Error('Reverso responded 503'); }, logger: { error: (...args) => errors.push(args) } });
  assert.equal(await game.cardOf({ word: 'penser', item: '' }, undefined), null);
  assert.equal(errors.length, 1);
});
