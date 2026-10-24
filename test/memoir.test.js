import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createMyWords } from '../server/myWords.js';
import { buildQuestion, cardWeight, createMemoir, toCard } from '../server/memoir.js';

const sense = (level, definition, translations, examples = []) => ({ level, definition, tags: [], translations, examples });
const entryOf = (word, pos, senses, gender = null) => ({ query: word, words: [{ word, ipa: null, sections: [{ pos, gender, senses }] }] });

const ENTRIES = {
  mener: entryOf('mener', 'Verb', [
    sense('B1', "conduire quelqu'un d'un endroit à un autre", ['levar', 'conduzir'], [
      { fr: 'Il mène sa fille à l’école.', pt: 'Ele **leva** a filha à escola.' },
    ]),
    sense('Rare', 'sens rare', ['raro']),
    sense('C1', 'être à la tête de', ['dirigir'], [{ fr: 'Elle dirige tout.', pt: 'Ela **dirige** tudo.' }]),
  ]),
  aboutir: entryOf('aboutir', 'Verb', [sense('B2', 'avoir comme résultat', ['resultar'])]),
  évoquer: entryOf('évoquer', 'Verb', [sense('C1', 'rappeler à la mémoire', ['evocar'])]),
  soutenir: entryOf('soutenir', 'Verb', [sense('B2', 'appuyer', ['apoiar'])]),
  détenir: entryOf('détenir', 'Verb', [sense('C1', 'posséder', ['deter'])]),
  taille: entryOf('taille', 'Noun', [sense('B1', 'partie du corps', ['cintura'])], 'f'),
  conduire: entryOf('conduire', 'Verb', [sense('A2', 'diriger un véhicule', ['Levar', 'guiar'])]),
  jadis: entryOf('jadis', 'Adverb', [sense('C2', 'autrefois', ['outrora'])]),
};

const cards = Object.entries(ENTRIES).map(([word, entry]) => toCard(entry, word)).filter(Boolean);
const card = (word) => cards.find((c) => c.word === word);
const MENER_FORMS = ['mener', 'mène'];
const PHRASE_FIRST = () => 0;
const GLOSS_FIRST = () => 0.99;

const ask = (direction, random, { senseId = 0, pool = cards } = {}) =>
  buildQuestion({
    card: card('mener'),
    sense: card('mener').senses.find((s) => s.id === senseId),
    cards: pool,
    direction,
    forms: MENER_FORMS,
    random,
  });

const optionSet = (question) => [...question.options].sort((a, b) => a.localeCompare(b, 'fr'));

test('toCard keeps A1–C1 senses with translations, numbered across the whole entry', () => {
  const mener = card('mener');
  assert.deepEqual(mener.senses.map((s) => [s.id, s.level, s.pos]), [[0, 'B1', 'Verb'], [2, 'C1', 'Verb']]);
  assert.deepEqual([...mener.translations], ['levar', 'conduzir', 'raro', 'dirigir']);
  assert.equal(toCard(ENTRIES.jadis, 'jadis'), null);
  assert.equal(toCard(null, 'rien'), null);
});

test('cardWeight doubles for words whose senses are all B2 or C1', () => {
  assert.equal(cardWeight(card('aboutir')), 2);
  assert.equal(cardWeight(card('taille')), 1);
  assert.equal(cardWeight(card('mener')), 1.5);
});

test('FR → PT phrase highlights the word and asks for its Portuguese translation', () => {
  const question = ask('fr-pt', PHRASE_FIRST);
  assert.deepEqual(question.clue, { kind: 'phrase', text: 'Il **mène** sa fille à l’école.' });
  assert.equal(question.options[question.answer], 'levar');
  assert.deepEqual(optionSet(question), ['apoiar', 'deter', 'evocar', 'levar', 'resultar']);
  assert.deepEqual(question.reveal, {
    pos: 'Verb',
    gender: null,
    level: 'B1',
    definition: "conduire quelqu'un d'un endroit à un autre",
    translations: ['levar', 'conduzir'],
    example: { fr: 'Il **mène** sa fille à l’école.', pt: 'Ele **leva** a filha à escola.' },
  });
});

test('FR → PT falls back to the definition when the word cannot be found in any example', () => {
  const question = ask('fr-pt', PHRASE_FIRST, { senseId: 2 });
  assert.deepEqual(question.clue, { kind: 'definition', text: 'être à la tête de' });
  assert.equal(question.options[question.answer], 'dirigir');
  assert.deepEqual(question.reveal.example, { fr: 'Elle dirige tout.', pt: 'Ela **dirige** tudo.' });
});

test('PT → FR phrase blanks the marked Portuguese word and asks for the French word', () => {
  const question = ask('pt-fr', PHRASE_FIRST);
  assert.deepEqual(question.clue, { kind: 'phrase', text: 'Ele **leva** a filha à escola.' });
  assert.equal(question.options[question.answer], 'mener');
  assert.deepEqual(optionSet(question), ['aboutir', 'détenir', 'évoquer', 'mener', 'soutenir']);
});

test('the gloss clue is the French definition or the Portuguese translations', () => {
  assert.deepEqual(ask('fr-pt', GLOSS_FIRST).clue, { kind: 'definition', text: "conduire quelqu'un d'un endroit à un autre" });
  assert.deepEqual(ask('pt-fr', GLOSS_FIRST).clue, { kind: 'translation', text: 'levar, conduzir' });
});

test('wrong options prefer the same part of speech and never include another right answer', () => {
  for (const random of [PHRASE_FIRST, GLOSS_FIRST, Math.random]) {
    for (const direction of ['fr-pt', 'pt-fr']) {
      const options = ask(direction, random).options;
      assert.equal(new Set(options).size, 5);
      for (const excluded of ['taille', 'cintura', 'conduire', 'Levar', 'guiar', 'dirigir']) {
        assert.ok(!options.includes(excluded), `${direction} offered ${excluded}`);
      }
    }
  }
});

test('buildQuestion gives up when fewer than four wrong options remain', () => {
  const pool = ['mener', 'conduire', 'aboutir', 'évoquer', 'soutenir'].map(card);
  assert.equal(ask('pt-fr', PHRASE_FIRST, { pool }), null);
  assert.equal(ask('fr-pt', PHRASE_FIRST, { pool }), null);
});

function memoirWith(saved, { random = PHRASE_FIRST, logger = { error() {} } } = {}) {
  const myWords = createMyWords(openDb(':memory:'));
  saved.forEach(myWords.add);
  const dictionary = {
    async definitions(word) {
      if (word === 'cassé') throw new Error('down');
      return ENTRIES[word] ?? null;
    },
  };
  const conjugator = { forms: (word) => (word === 'mener' ? MENER_FORMS : []) };
  return createMemoir({ myWords, dictionary, conjugator, random, logger });
}

const ALL = Object.keys(ENTRIES);

test('question asks about the requested word and sense', async () => {
  const question = await memoirWith(ALL).question({ word: 'mener', sense: 2 });
  assert.equal(question.word, 'mener');
  assert.equal(question.sense, 2);
});

test('question picks another usable sense or word when the request is not usable', async () => {
  const memoir = memoirWith(ALL, { random: Math.random });
  assert.notEqual((await memoir.question({ word: 'mener', sense: 1 })).sense, 1);
  assert.notEqual((await memoir.question({ word: 'jadis' })).word, 'jadis');
});

test('question skips excluded words unless nothing else is left', async () => {
  const memoir = memoirWith(ALL);
  const others = ALL.filter((word) => word !== 'taille');
  assert.equal((await memoir.question({ exclude: others })).word, 'taille');
  assert.ok(ALL.includes((await memoir.question({ exclude: ALL })).word));
});

test('question returns null with fewer than five usable words, skipping failed lookups', async () => {
  const errors = [];
  const memoir = memoirWith(['mener', 'aboutir', 'évoquer', 'soutenir', 'jadis', 'cassé'], {
    logger: { error: (...args) => errors.push(args.join(' ')) },
  });
  assert.equal(await memoir.question(), null);
  assert.deepEqual(errors, ['definitions for "cassé" failed: down']);
});
