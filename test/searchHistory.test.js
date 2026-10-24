import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { withSearch, readRecentSearches, rememberSearch } from '../web/src/searchHistory.js';

function fakeStorage() {
  const items = new Map();
  return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)) };
}

const deniedStorage = {
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('denied'); },
};

afterEach(() => delete globalThis.localStorage);

test('the newest search comes first and a repeated search moves back to the top', () => {
  assert.deepEqual(withSearch(['b', 'a'], 'c'), ['c', 'b', 'a']);
  assert.deepEqual(withSearch(['b', 'a'], 'a'), ['a', 'b']);
  assert.deepEqual(withSearch(['Maison', 'pêche'], 'maison'), ['maison', 'pêche']);
  assert.deepEqual(withSearch(['péché'], 'pêche'), ['pêche', 'péché']);
});

test('only the last five searches are kept', () => {
  assert.deepEqual(withSearch(['e', 'd', 'c', 'b', 'a'], 'f'), ['f', 'e', 'd', 'c', 'b']);
});

test('remembered searches are read back newest first', () => {
  globalThis.localStorage = fakeStorage();
  assert.deepEqual(readRecentSearches(), []);
  rememberSearch('répandue');
  assert.deepEqual(rememberSearch('mettre'), ['mettre', 'répandue']);
  assert.deepEqual(readRecentSearches(), ['mettre', 'répandue']);
});

test('corrupt or unavailable storage reads as an empty history', () => {
  globalThis.localStorage = fakeStorage();
  globalThis.localStorage.setItem('recherche.recentes', '{oops');
  assert.deepEqual(readRecentSearches(), []);
  globalThis.localStorage.setItem('recherche.recentes', '{"mot":1}');
  assert.deepEqual(readRecentSearches(), []);
  globalThis.localStorage = deniedStorage;
  assert.deepEqual(readRecentSearches(), []);
  assert.deepEqual(rememberSearch('mot'), ['mot']);
});
