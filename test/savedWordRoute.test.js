import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMyWords } from '../server/myWords.js';
import { UpstreamError } from '../server/reverso.js';
import { withServer } from './helpers.js';

const construction = (preposition) => ({
  pattern: `penser ${preposition} qqch`,
  meaning: `pensar ${preposition}`,
  example: `Je pense ${preposition} ça.`,
});
const PENSER = ['à', 'de', 'sur', 'pour'].map(construction);
const SUMMARY = {
  classifications: [{ pos: 'Verb', gender: null }],
  meanings: [{ pos: 'Verb', level: 'A1', definition: 'réfléchir', translations: ['pensar'] }],
};

function appWith({ saved = [], summary = async () => SUMMARY, known = {} } = {}) {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  saved.forEach(myWords.add);
  const dictionary = { summary, knownPrepositions: (verb) => known[verb] ?? null };
  return createApp({ db, dictionary, myWords, logger: { error() {} } });
}

const preview = (base, word) => fetch(`${base}/api/my-words/${encodeURIComponent(word)}`);

test('GET /api/my-words/:word finds the saved word ignoring case and accents', () =>
  withServer(appWith({ saved: ['école'] }), async (base) => {
    const res = await preview(base, 'Ecole');
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.word, 'école');
    assert.match(body.addedAt, /^\d{4}-\d{2}-\d{2} /);
    assert.deepEqual(body.summary, SUMMARY);
  }));

test('GET /api/my-words/:word gives a verb its first three known prepositions', () =>
  withServer(appWith({ saved: ['penser'], known: { penser: PENSER } }), async (base) => {
    const body = await (await preview(base, 'penser')).json();
    assert.deepEqual(body.prepositions.map(({ pattern }) => pattern), ['penser à qqch', 'penser de qqch', 'penser sur qqch']);
  }));

test('GET /api/my-words/:word gives no prepositions when none are known', () =>
  withServer(appWith({ saved: ['école'] }), async (base) => {
    assert.deepEqual((await (await preview(base, 'école')).json()).prepositions, []);
  }));

test('GET /api/my-words/:word still answers when the summary fails', () => {
  const summary = async () => {
    throw new UpstreamError('down');
  };
  return withServer(appWith({ saved: ['école'], summary }), async (base) => {
    const res = await preview(base, 'école');
    assert.equal(res.status, 200);
    assert.equal((await res.json()).summary, null);
  });
});

test('GET /api/my-words/:word is 404 for a word not saved and 400 for a blank one', () =>
  withServer(appWith({ saved: ['école'] }), async (base) => {
    const missing = await preview(base, 'écol');
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { error: 'not_saved' });
    assert.equal((await preview(base, ' ')).status, 400);
  }));
