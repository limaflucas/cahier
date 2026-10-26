import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createWordLists, ListError } from '../server/wordLists.js';

const fresh = () => {
  const db = openDb(':memory:');
  return { db, lists: createWordLists(db) };
};

const rejects = (fn, code) => assert.throws(fn, (err) => err instanceof ListError && err.code === code);

test('a new list has a trimmed name, no emoji and no words', () => {
  const { lists } = fresh();
  const list = lists.create({ name: '  Maison  ' });
  assert.equal(typeof list.id, 'number');
  assert.equal(typeof list.createdAt, 'string');
  assert.deepEqual({ ...list, id: 0, createdAt: '' }, { id: 0, name: 'Maison', emoji: null, createdAt: '', wordCount: 0 });
  assert.deepEqual(lists.get(list.id), list);
});

test('lists come newest first, the later one first when created in the same second', () => {
  const { db, lists } = fresh();
  const maison = lists.create({ name: 'Maison' });
  const cuisine = lists.create({ name: 'Cuisine' });
  assert.deepEqual(lists.all().map((l) => l.name), ['Cuisine', 'Maison']);
  db.prepare("UPDATE word_lists SET created_at = '2999-01-01 00:00:00' WHERE id = ?").run(maison.id);
  assert.deepEqual(lists.all().map((l) => l.id), [maison.id, cuisine.id]);
});

test('a name must have 1 to 60 characters once trimmed', () => {
  const { lists } = fresh();
  rejects(() => lists.create({ name: '' }), 'invalid_name');
  rejects(() => lists.create({ name: '   ' }), 'invalid_name');
  rejects(() => lists.create({ name: 'a'.repeat(61) }), 'invalid_name');
  rejects(() => lists.create({}), 'invalid_name');
  const sixty = `é🏠${'a'.repeat(58)}`;
  assert.equal(lists.create({ name: sixty }).name, sixty);
  const other = lists.create({ name: 'Autre' });
  rejects(() => lists.update(other.id, { name: ' ' }), 'invalid_name');
});

test('names clash regardless of case and accents', () => {
  const { lists } = fresh();
  lists.create({ name: 'ete' });
  rejects(() => lists.create({ name: 'Été' }), 'name_taken');
  rejects(() => lists.create({ name: 'ÉTÉ' }), 'name_taken');
  const hiver = lists.create({ name: 'Hiver' });
  rejects(() => lists.update(hiver.id, { name: 'été' }), 'name_taken');
});

test('a list can be renamed to its own name with another case', () => {
  const { lists } = fresh();
  const maison = lists.create({ name: 'maison' });
  assert.equal(lists.update(maison.id, { name: 'Maison' }).name, 'Maison');
});

test('the emoji is optional and must be exactly one emoji', () => {
  const { lists } = fresh();
  for (const emoji of ['🏠', '👩‍🍳', '🇫🇷', '❤️']) assert.equal(lists.create({ name: `n${emoji}`, emoji }).emoji, emoji);
  for (const emoji of ['🏠🏠', 'ab', 'a']) rejects(() => lists.create({ name: `x${emoji}`, emoji }), 'invalid_emoji');
  assert.equal(lists.create({ name: 'vide', emoji: '' }).emoji, null);
  assert.equal(lists.create({ name: 'nul', emoji: null }).emoji, null);
});

test('updating changes only the given fields', () => {
  const { lists } = fresh();
  const list = lists.create({ name: 'Maison', emoji: '🏠' });
  assert.equal(lists.update(list.id, { name: 'Chez moi' }).emoji, '🏠');
  assert.equal(lists.update(list.id, { emoji: '🏡' }).name, 'Chez moi');
  assert.equal(lists.update(list.id, { emoji: null }).emoji, null);
  rejects(() => lists.update(list.id, { emoji: 'ab' }), 'invalid_emoji');
  assert.equal(lists.update(999, { name: 'Ailleurs' }), null);
});

test('unknown lists read as null and removing reports whether a list was there', () => {
  const { lists } = fresh();
  assert.equal(lists.get(999), null);
  const list = lists.create({ name: 'Maison' });
  assert.equal(lists.remove(list.id), true);
  assert.equal(lists.remove(list.id), false);
  assert.equal(lists.get(list.id), null);
  assert.deepEqual(lists.all(), []);
});
