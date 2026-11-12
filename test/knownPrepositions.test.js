import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createDictionary } from '../server/dictionary.js';
import { fixture } from './helpers.js';

const PENSER = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];

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

test('known prepositions are none for a verb nobody looked up, and asking does not search', () => {
  const { dictionary, asked } = setup();
  assert.equal(dictionary.knownPrepositions('penser'), null);
  assert.deepEqual(asked, []);
});

test('known prepositions do not wait for a search still under way', async () => {
  const { dictionary, answer } = setup();
  await dictionary.lookup('penser', { awaitPrepositions: false });
  assert.equal(dictionary.knownPrepositions('penser'), null);
  answer(PENSER);
});

test('known prepositions are the ones a lookup found', async () => {
  const { dictionary, answer } = setup();
  answer(PENSER);
  await dictionary.lookup('penser');
  assert.deepEqual(dictionary.knownPrepositions('penser'), PENSER);
});
