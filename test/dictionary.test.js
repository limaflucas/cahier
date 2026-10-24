import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createDictionary } from '../server/dictionary.js';
import { createMyWords } from '../server/myWords.js';
import { fixture } from './helpers.js';

const silent = { error() {} };
const PENSER = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];

function setup({ findPrepositions = async () => PENSER } = {}) {
  const db = openDb(':memory:');
  const calls = { fetch: [], preps: [] };
  const dictionary = createDictionary({
    db,
    logger: silent,
    fetchDefinition: async (word) => {
      calls.fetch.push(word);
      return fixture(word === 'pense' ? 'penser' : word);
    },
    findPrepositions: async (verb) => {
      calls.preps.push(verb);
      return findPrepositions(verb);
    },
  });
  return { db, dictionary, calls };
}

test('lookup normalizes the query and caches Reverso responses', async () => {
  const { dictionary, calls } = setup();
  await dictionary.lookup('  Homme ');
  const entry = await dictionary.lookup('homme');
  assert.deepEqual(calls.fetch, ['homme']);
  assert.equal(entry.words[0].word, 'homme');
  assert.equal(entry.words[0].prepositions, undefined);
});

test('lookup does not cache misses', async () => {
  const { dictionary, calls } = setup();
  assert.equal(await dictionary.lookup('mangeait'), null);
  assert.equal(await dictionary.lookup('mangeait'), null);
  assert.equal(calls.fetch.length, 2);
});

test('verbs get prepositions, cached by headword', async () => {
  const { dictionary, calls } = setup();
  assert.deepEqual((await dictionary.lookup('penser')).words[0].prepositions, PENSER);
  await dictionary.lookup('pense');
  assert.deepEqual(calls.preps, ['penser']);
});

test('preposition failures yield null and are retried later', async () => {
  let fail = true;
  const { dictionary, calls } = setup({
    findPrepositions: async () => {
      if (fail) throw new Error('boom');
      return PENSER;
    },
  });
  assert.equal((await dictionary.lookup('penser')).words[0].prepositions, null);
  fail = false;
  assert.deepEqual((await dictionary.lookup('penser')).words[0].prepositions, PENSER);
  assert.equal(calls.preps.length, 2);
});

test('lookup flags saved words', async () => {
  const { db, dictionary } = setup();
  createMyWords(db).add('homme');
  assert.equal((await dictionary.lookup('homme')).words[0].saved, true);
});
