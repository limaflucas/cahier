import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createDictionary } from '../server/dictionary.js';

const OLD = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];
const NEW = [{ ...OLD[0], gap: 'Je pense ___ toi.', answer: 'à', portuguese: 'pensar em alguém', differsFromPortuguese: true }];
const quiet = { error() {} };

/**
 * A database that counts the statements it runs.
 * @returns {{ db: import('node:sqlite').DatabaseSync, reads: () => number }}
 */
function countingDb() {
  const db = openDb(':memory:');
  let count = 0;
  const counted = (statement) => new Proxy(statement, {
    get: (target, name) => (typeof target[name] === 'function'
      ? (...args) => { count += 1; return target[name](...args); }
      : target[name]),
  });
  const proxy = new Proxy(db, {
    get: (target, name) => (name === 'prepare' ? (sql) => counted(target.prepare(sql)) : target[name].bind?.(target) ?? target[name]),
  });
  return { db: proxy, reads: () => count };
}

function dictionaryWith({ db = openDb(':memory:'), findPrepositions = null } = {}) {
  const cache = db.prepare('INSERT INTO preposition_cache (verb, json) VALUES (?, ?)');
  cache.run('penser', JSON.stringify(OLD));
  cache.run('parler', '[]');
  return createDictionary({ db, fetchDefinition: async () => null, findPrepositions, logger: quiet });
}

test('cached constructions of many verbs come in one read', () => {
  const { db, reads } = countingDb();
  const dictionary = dictionaryWith({ db });
  const before = reads();
  const cached = dictionary.cachedPrepositions(['penser', 'parler', 'aller']);
  assert.equal(reads() - before, 1);
  assert.deepEqual(cached, new Map([['penser', OLD], ['parler', []]]));
});

test('refreshing replaces the cached constructions', async () => {
  const asked = [];
  const dictionary = dictionaryWith({ findPrepositions: async (verb) => (asked.push(verb), NEW) });
  assert.deepEqual(await dictionary.refreshPrepositions('penser'), NEW);
  assert.deepEqual(asked, ['penser']);
  assert.deepEqual(dictionary.knownPrepositions('penser'), NEW);
});

test('a failed refresh keeps what was cached', async () => {
  const failing = dictionaryWith({ findPrepositions: async () => { throw new Error('overloaded'); } });
  assert.equal(await failing.refreshPrepositions('penser'), null);
  assert.deepEqual(failing.knownPrepositions('penser'), OLD);
  const withoutClaude = dictionaryWith();
  assert.equal(await withoutClaude.refreshPrepositions('penser'), null);
  assert.deepEqual(withoutClaude.knownPrepositions('penser'), OLD);
});
