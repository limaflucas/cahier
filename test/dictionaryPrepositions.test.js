import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createDictionary } from '../server/dictionary.js';
import { fixture } from './helpers.js';

const PENSER = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];
const STILL_WAITING = 'still waiting';
const soon = () => new Promise((resolve) => setTimeout(() => resolve(STILL_WAITING), 100));

function setup() {
  const asked = [];
  let answer;
  const answered = new Promise((resolve) => { answer = resolve; });
  const dictionary = createDictionary({
    db: openDb(':memory:'),
    logger: { error() {} },
    fetchDefinition: async (word) => fixture(word),
    findPrepositions: (verb) => {
      asked.push(verb);
      return answered;
    },
  });
  return { dictionary, asked, answer };
}

const quickLookup = (dictionary, word) =>
  Promise.race([dictionary.lookup(word, { awaitPrepositions: false }), soon()]);

test('a lookup can return before the prepositions are found', async () => {
  const { dictionary, answer } = setup();
  try {
    const entry = await quickLookup(dictionary, 'penser');
    assert.notEqual(entry, STILL_WAITING);
    assert.equal(entry.words[0].prepositions, 'pending');
  } finally {
    answer(PENSER);
  }
});

test('pending prepositions can be awaited, then come with the lookup', async () => {
  const { dictionary, asked, answer } = setup();
  await quickLookup(dictionary, 'penser');
  const found = dictionary.prepositions('penser');
  answer(PENSER);
  assert.deepEqual(await found, PENSER);
  assert.deepEqual((await quickLookup(dictionary, 'penser')).words[0].prepositions, PENSER);
  assert.deepEqual(asked, ['penser']);
});

test('lookups while the prepositions are pending ask for them once', async () => {
  const { dictionary, asked, answer } = setup();
  await quickLookup(dictionary, 'penser');
  await quickLookup(dictionary, 'penser');
  answer(PENSER);
  await dictionary.prepositions('penser');
  assert.deepEqual(asked, ['penser']);
});

test('prepositions nobody looked up are not searched for', async () => {
  const { dictionary, asked, answer } = setup();
  answer(PENSER);
  assert.equal(await dictionary.prepositions('penser'), undefined);
  assert.deepEqual(asked, []);
});
