import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMyWords } from '../server/myWords.js';
import { UpstreamError } from '../server/reverso.js';
import { withServer } from './helpers.js';

function appWith({ lookup, summary = async () => ({ classifications: [], meanings: [] }), conjugator, verbPicker, memoir, pronunciation } = {}) {
  const db = openDb(':memory:');
  return createApp({
    db,
    dictionary: { lookup, summary },
    myWords: createMyWords(db),
    conjugator,
    verbPicker,
    memoir,
    pronunciation,
    logger: { error() {} },
  });
}

test('GET /api/health', () =>
  withServer(appWith(), async (base) => {
    assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { ok: true });
  }));

test('GET /api/audio/:word redirects to the recording, 404 or 502', async () => {
  const pronunciation = {
    audioUrl: async (word) => {
      if (word === 'down') throw new UpstreamError('nope');
      return word === 'à travers' ? 'https://upload.wikimedia.org/a/ab/LL-Q150_(fra)-X-%C3%A0_travers.wav' : null;
    },
  };
  await withServer(appWith({ pronunciation }), async (base) => {
    const found = await fetch(`${base}/api/audio/%C3%80%20Travers`, { redirect: 'manual' });
    assert.equal(found.status, 302);
    assert.equal(found.headers.get('location'), 'https://upload.wikimedia.org/a/ab/LL-Q150_(fra)-X-%C3%A0_travers.wav');
    assert.equal((await fetch(`${base}/api/audio/zzz`)).status, 404);
    assert.equal((await fetch(`${base}/api/audio/down`)).status, 502);
    assert.equal((await fetch(`${base}/api/audio/%20`)).status, 400);
  });
});

test('GET /api/dictionary/:word returns the entry, 404 or 502', async () => {
  const lookup = async (word) => {
    if (word === 'down') throw new UpstreamError('nope');
    return word === 'homme' ? { query: word, words: [] } : null;
  };
  await withServer(appWith({ lookup }), async (base) => {
    const ok = await fetch(`${base}/api/dictionary/Homme`);
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { query: 'homme', words: [] });
    assert.equal((await fetch(`${base}/api/dictionary/zzz`)).status, 404);
    assert.equal((await fetch(`${base}/api/dictionary/down`)).status, 502);
    assert.equal((await fetch(`${base}/api/dictionary/%20`)).status, 400);
  });
});

test('my-words can be added, listed and removed', () =>
  withServer(appWith(), async (base) => {
    const put = (w) => fetch(`${base}/api/my-words/${encodeURIComponent(w)}`, { method: 'PUT' });
    assert.equal((await put('Être')).status, 204);
    await put('être');
    const list = await (await fetch(`${base}/api/my-words`)).json();
    assert.deepEqual(list.map((w) => w.word), ['être']);
    assert.equal((await fetch(`${base}/api/my-words/%C3%AAtre`, { method: 'DELETE' })).status, 204);
    assert.deepEqual(await (await fetch(`${base}/api/my-words`)).json(), []);
  }));

test('GET /api/my-words lists each word with its summary, or null when the dictionary fails', () => {
  const plierSummary = {
    classifications: [{ pos: 'Verb', gender: null }],
    meanings: [{ pos: 'Verb', level: 'A1', definition: 'plier', translations: ['dobrar'] }],
  };
  const summary = async (word) => {
    if (word === 'saisir') throw new UpstreamError('down');
    return plierSummary;
  };
  return withServer(appWith({ summary }), async (base) => {
    for (const word of ['plier', 'saisir']) await fetch(`${base}/api/my-words/${word}`, { method: 'PUT' });
    const list = await (await fetch(`${base}/api/my-words`)).json();
    const summaryByWord = Object.fromEntries(list.map(({ word, summary }) => [word, summary]));
    assert.deepEqual(summaryByWord, { plier: plierSummary, saisir: null });
  });
});

test('GET /api/conjugation/:word returns the board or 404', async () => {
  const conjugator = { board: (verb) => (verb === 'se plier' ? { verb } : null) };
  await withServer(appWith({ conjugator }), async (base) => {
    const ok = await fetch(`${base}/api/conjugation/${encodeURIComponent('Se plier')}`);
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { verb: 'se plier' });
    const missing = await fetch(`${base}/api/conjugation/plie`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { error: 'unknown_verb' });
  });
});

test('GET /api/random-verb passes the excluded verb and reports an empty list', async () => {
  const calls = [];
  const verbPicker = {
    async pick(options) {
      calls.push(options);
      return options.exclude === 'saisir' ? 'plier' : null;
    },
  };
  await withServer(appWith({ verbPicker }), async (base) => {
    const ok = await fetch(`${base}/api/random-verb?exclude=Saisir`);
    assert.deepEqual(await ok.json(), { verb: 'plier' });
    const empty = await fetch(`${base}/api/random-verb`);
    assert.equal(empty.status, 404);
    assert.deepEqual(await empty.json(), { error: 'no_saved_verbs' });
    assert.deepEqual(calls, [{ exclude: 'saisir' }, { exclude: undefined }]);
  });
});

test('GET /api/memoir/question passes word, sense and excluded words, and reports too few words', async () => {
  const calls = [];
  const memoir = {
    async question(options) {
      calls.push(options);
      return options.word ? { word: options.word } : null;
    },
  };
  await withServer(appWith({ memoir }), async (base) => {
    const ok = await fetch(`${base}/api/memoir/question?word=Mener&sense=3`);
    assert.deepEqual(await ok.json(), { word: 'mener' });
    const empty = await fetch(`${base}/api/memoir/question?exclude=Taille&exclude=jadis`);
    assert.equal(empty.status, 404);
    assert.deepEqual(await empty.json(), { error: 'not_enough_words' });
    assert.deepEqual(calls, [
      { word: 'mener', sense: 3, exclude: [] },
      { word: undefined, sense: undefined, exclude: ['taille', 'jadis'] },
    ]);
  });
});
