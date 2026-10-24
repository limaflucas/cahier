import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createMyWords } from '../server/myWords.js';
import { createVerbPicker, verbWeight } from '../server/verbPicker.js';

const entryWith = (word, pos, levels) => ({
  words: [{ word, sections: [{ pos, senses: levels.map((level) => ({ level })) }] }],
});

function pickerWith({ saved, verbs, entries, random = () => 0, logger = { error() {} } }) {
  const myWords = createMyWords(openDb(':memory:'));
  saved.forEach(myWords.add);
  const dictionary = {
    async definitions(word) {
      const entry = entries[word];
      if (entry instanceof Error) throw entry;
      return entry ?? null;
    },
  };
  const conjugator = { isVerb: (word) => verbs.includes(word) };
  return createVerbPicker({ myWords, dictionary, conjugator, random, logger });
}

test('verbWeight favours verbs whose senses are mostly B2 or C1', () => {
  assert.equal(verbWeight(null, 'plier'), 1);
  assert.equal(verbWeight(entryWith('plier', 'Verb', ['A1', 'B1']), 'plier'), 1);
  assert.equal(verbWeight(entryWith('plier', 'Verb', ['A1', 'B2', 'C1', 'C2']), 'plier'), 2.5);
  assert.equal(verbWeight(entryWith('plier', 'Verb', ['C1']), 'plier'), 4);
  assert.equal(verbWeight(entryWith('devoir', 'Noun', ['B2']), 'devoir'), 0);
});

test('pick draws saved verbs in proportion to their weight', async () => {
  const entries = { plier: entryWith('plier', 'Verb', ['A1']), saisir: entryWith('saisir', 'Verb', ['C1']) };
  const options = { saved: ['plier', 'pliable', 'saisir'], verbs: ['plier', 'saisir'], entries };
  assert.equal(await pickerWith({ ...options, random: () => 0.1 }).pick(), 'plier');
  assert.equal(await pickerWith({ ...options, random: () => 0.5 }).pick(), 'saisir');
});

test('pick avoids the previous verb unless it is the only one', async () => {
  const entries = { plier: entryWith('plier', 'Verb', ['A1']), saisir: entryWith('saisir', 'Verb', ['C1']) };
  const both = pickerWith({ saved: ['plier', 'saisir'], verbs: ['plier', 'saisir'], entries, random: () => 0.9 });
  assert.equal(await both.pick({ exclude: 'saisir' }), 'plier');
  const single = pickerWith({ saved: ['saisir'], verbs: ['saisir'], entries });
  assert.equal(await single.pick({ exclude: 'saisir' }), 'saisir');
});

test('pick skips words only saved as nouns and survives dictionary failures', async () => {
  const errors = [];
  const picker = pickerWith({
    saved: ['devoir', 'saisir'],
    verbs: ['devoir', 'saisir'],
    entries: { devoir: entryWith('devoir', 'Noun', ['B1']), saisir: new Error('down') },
    random: () => 0,
    logger: { error: (...args) => errors.push(args) },
  });
  assert.equal(await picker.pick(), 'saisir');
  assert.equal(errors.length, 1);
});

test('pick returns null without saved verbs', async () => {
  assert.equal(await pickerWith({ saved: ['pliable'], verbs: [], entries: {} }).pick(), null);
});
