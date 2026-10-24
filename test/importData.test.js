import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { openDb } from '../server/db.js';
import { importData } from '../server/importData.js';

function oldInstall() {
  const db = openDb(':memory:');
  db.exec(`
    INSERT INTO my_words (word, added_at) VALUES ('belle', '2026-10-15 00:43:49'), ('homme', '2026-10-16 10:00:00');
    INSERT INTO reverso_cache (query, json, fetched_at) VALUES ('belle', '{"a":1}', '2026-10-15 00:43:50');
    INSERT INTO preposition_cache (verb, json, created_at) VALUES ('penser', '[]', '2026-10-17 09:00:00');
    INSERT INTO audio_cache (word, url, fetched_at) VALUES ('belle', 'https://example.test/belle.mp3', '2026-10-15 00:44:00'), ('but', NULL, '2026-10-15 00:45:00');
  `);
  return db;
}

const rows = (db, table) => db.prepare(`SELECT * FROM ${table} ORDER BY 1`).all().map((row) => ({ ...row }));

test('imports every row of every table into a new install, keeping its dates', () => {
  const source = oldInstall();
  const target = openDb(':memory:');
  assert.deepEqual(importData(source, target), {
    audio_cache: { source: 2, imported: 2 },
    my_words: { source: 2, imported: 2 },
    preposition_cache: { source: 1, imported: 1 },
    reverso_cache: { source: 1, imported: 1 },
  });
  for (const table of ['my_words', 'reverso_cache', 'preposition_cache', 'audio_cache']) {
    assert.deepEqual(rows(target, table), rows(source, table), table);
  }
});

test('running it again imports nothing new', () => {
  const source = oldInstall();
  const target = openDb(':memory:');
  importData(source, target);
  const again = importData(source, target);
  assert.deepEqual(Object.values(again).map(({ imported }) => imported), [0, 0, 0, 0]);
  assert.equal(rows(target, 'my_words').length, 2);
});

test('keeps what the target already has', () => {
  const target = openDb(':memory:');
  target.exec("INSERT INTO my_words (word, added_at) VALUES ('belle', '2026-10-20 12:00:00')");
  assert.equal(importData(oldInstall(), target).my_words.imported, 1);
  assert.equal(target.prepare("SELECT added_at FROM my_words WHERE word = 'belle'").get().added_at, '2026-10-20 12:00:00');
});

test('ignores tables and columns the target does not know', () => {
  const source = new DatabaseSync(':memory:');
  source.exec(`
    CREATE TABLE my_words (word TEXT PRIMARY KEY, added_at TEXT NOT NULL, legacy TEXT);
    CREATE TABLE games (id INTEGER PRIMARY KEY);
    INSERT INTO my_words VALUES ('plier', '2026-10-15 02:02:34', 'x');
    INSERT INTO games VALUES (1);
  `);
  const target = openDb(':memory:');
  assert.deepEqual(importData(source, target), { my_words: { source: 1, imported: 1 } });
  assert.deepEqual(rows(target, 'my_words'), [{ word: 'plier', added_at: '2026-10-15 02:02:34' }]);
});
