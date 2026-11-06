import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMyWords } from '../server/myWords.js';
import { withServer } from './helpers.js';

const PENSER = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];

function appWith(dictionary) {
  const db = openDb(':memory:');
  return createApp({ db, dictionary, myWords: createMyWords(db), logger: { error() {} } });
}

test('GET /api/dictionary/:word does not wait for the prepositions', async () => {
  const asked = [];
  const lookup = async (word, options) => {
    asked.push(options);
    return { query: word, words: [] };
  };
  await withServer(appWith({ lookup }), async (base) => {
    assert.equal((await fetch(`${base}/api/dictionary/penser`)).status, 200);
    assert.deepEqual(asked, [{ awaitPrepositions: false }]);
  });
});

test('GET /api/prepositions/:verb returns the constructions, 404 when not looked up, 503 when unavailable', async () => {
  const known = { penser: PENSER, valoir: null };
  const prepositions = async (verb) => known[verb];
  await withServer(appWith({ prepositions }), async (base) => {
    const found = await fetch(`${base}/api/prepositions/Penser`);
    assert.equal(found.status, 200);
    assert.deepEqual(await found.json(), PENSER);
    assert.deepEqual(await (await fetch(`${base}/api/prepositions/marcher`)).json(), { error: 'not_found' });
    assert.equal((await fetch(`${base}/api/prepositions/marcher`)).status, 404);
    assert.equal((await fetch(`${base}/api/prepositions/valoir`)).status, 503);
    assert.equal((await fetch(`${base}/api/prepositions/%20`)).status, 400);
  });
});
