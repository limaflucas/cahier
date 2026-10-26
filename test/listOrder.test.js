import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readListsOrder, saveListsOrder, sortLists, wordCountLabel } from '../web/src/lists/order.js';

function fakeStorage() {
  const items = new Map();
  return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)) };
}

const deniedStorage = {
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('denied'); },
};

afterEach(() => delete globalThis.localStorage);

const list = (id, name, createdAt) => ({ id, name, emoji: null, createdAt, wordCount: 0 });

test('by date, the newest list comes first and the later id breaks ties', () => {
  const lists = [
    list(1, 'Maison', '2026-10-20 10:00:00'),
    list(3, 'Cuisine', '2026-10-24 09:00:00'),
    list(2, 'Travail', '2026-10-24 09:00:00'),
  ];
  assert.deepEqual(sortLists(lists, 'date').map((l) => l.id), [3, 2, 1]);
  assert.deepEqual(lists.map((l) => l.id), [1, 3, 2]);
});

test('A→Z follows French order, ignoring case and accents', () => {
  const lists = ['zoo', 'Été', 'avion', 'école'].map((name, i) => list(i, name, '2026-10-24 09:00:00'));
  assert.deepEqual(sortLists(lists, 'alpha').map((l) => l.name), ['avion', 'école', 'Été', 'zoo']);
});

test('the chosen order is remembered', () => {
  globalThis.localStorage = fakeStorage();
  assert.equal(readListsOrder(), 'date');
  saveListsOrder('alpha');
  assert.equal(readListsOrder(), 'alpha');
});

test('missing, refused or garbled storage reads as by date', () => {
  assert.equal(readListsOrder(), 'date');
  globalThis.localStorage = deniedStorage;
  assert.equal(readListsOrder(), 'date');
  assert.doesNotThrow(() => saveListsOrder('alpha'));
  globalThis.localStorage = fakeStorage();
  globalThis.localStorage.setItem('sacs.ordre', 'oops');
  assert.equal(readListsOrder(), 'date');
});

test('word counts read naturally in French', () => {
  assert.equal(wordCountLabel(0), '0 mot');
  assert.equal(wordCountLabel(1), '1 mot');
  assert.equal(wordCountLabel(2), '2 mots');
});
