import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMyWords } from '../server/myWords.js';
import { withServer } from './helpers.js';

const meaning = { pos: 'Noun', level: 'A1', definition: 'être humain adulte de sexe masculin', translations: ['homem'] };

function appWithWords(count) {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  for (let i = 0; i < count; i++) myWords.add(`mot${i}`);
  const summary = async () => ({ classifications: [{ pos: 'Noun', gender: 'masculine' }], meanings: [meaning] });
  return createApp({ db, dictionary: { summary }, myWords, logger: { error() {} } });
}

test('API replies are compressed for clients that accept it', () =>
  withServer(appWithWords(50), async (base) => {
    const res = await fetch(`${base}/api/my-words`, { headers: { 'Accept-Encoding': 'gzip' } });
    assert.equal(res.headers.get('content-encoding'), 'gzip');
    assert.equal((await res.json()).length, 50);
  }));
