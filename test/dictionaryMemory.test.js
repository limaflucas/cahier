import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { openDb } from '../server/db.js';
import { createDictionary } from '../server/dictionary.js';
import { fixture } from './helpers.js';

const silent = { error() {} };

function setup({ path = ':memory:', ...options } = {}) {
  const db = openDb(path);
  const fetched = [];
  const dictionary = createDictionary({
    db,
    logger: silent,
    fetchDefinition: async (word) => {
      fetched.push(word);
      return fixture(word);
    },
    ...options,
  });
  return { db, dictionary, fetched };
}

const cache = (db, query, raw) =>
  db.prepare('INSERT OR REPLACE INTO reverso_cache (query, json) VALUES (?, ?)').run(query, JSON.stringify(raw));

test('entries are read from SQLite once, then served from memory', async () => {
  const { db, dictionary, fetched } = setup();
  const first = await dictionary.definitions('homme');
  db.exec('DELETE FROM reverso_cache');
  assert.deepEqual(await dictionary.definitions('homme'), first);
  assert.deepEqual(fetched, ['homme']);
});

test('preload reads cached entries into memory without fetching', async () => {
  const { db, dictionary, fetched } = setup();
  cache(db, 'homme', fixture('homme'));
  cache(db, 'belle', fixture('belle'));
  dictionary.preload(['homme', 'belle', 'penser']);
  db.exec('DELETE FROM reverso_cache');
  assert.equal((await dictionary.definitions('homme')).words[0].word, 'homme');
  assert.equal((await dictionary.definitions('belle')).words[0].word, 'belle');
  assert.deepEqual(fetched, []);
});

test('writes from another connection reach memory within a second', async () => {
  const path = join(mkdtempSync(join(tmpdir(), 'cahier-memory-')), 'french.db');
  let now = 0;
  const { db, dictionary } = setup({ path, now: () => now });
  cache(db, 'homme', fixture('homme'));
  assert.equal((await dictionary.definitions('homme')).words[0].word, 'homme');

  const other = new DatabaseSync(path);
  cache(other, 'homme', fixture('belle'));
  other.close();
  assert.equal((await dictionary.definitions('homme')).words[0].word, 'homme');

  now += 1001;
  assert.equal((await dictionary.definitions('homme')).words[0].word, 'belle');
  db.close();
});

test('memory keeps the most recently used entries up to its limit', async () => {
  const { db, dictionary, fetched } = setup({ maxEntries: 1 });
  await dictionary.definitions('homme');
  await dictionary.definitions('belle');
  db.exec('DELETE FROM reverso_cache');
  await dictionary.definitions('belle');
  await dictionary.definitions('homme');
  assert.deepEqual(fetched, ['homme', 'belle', 'homme']);
});

test('entries shared from memory cannot be changed by their readers', async () => {
  const { dictionary } = setup();
  const entry = await dictionary.definitions('homme');
  assert.throws(() => entry.words[0].sections[0].senses.pop(), TypeError);
  assert.equal((await dictionary.summary('homme')).classifications.length > 0, true);
});
