import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createMyWords } from '../server/myWords.js';
import { createReviews, itemKey } from '../server/reviews.js';

const PENSER = { word: 'penser', item: '' };

function withSaved(...words) {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  words.forEach((word) => myWords.add(word));
  return { myWords, reviews: createReviews(db) };
}

test('recording creates the item with today as its first day', () => {
  const { reviews } = withSaved('penser');
  assert.deepEqual(reviews.record('rappel', PENSER, 'right', '2026-11-12'), { step: 0, dueOn: '2026-11-13' });
  assert.deepEqual(reviews.progress('rappel').get(itemKey(PENSER)), {
    step: 0, dueOn: '2026-11-13', introducedOn: '2026-11-12', answered: 1,
  });
});

test('recording again moves it along the schedule and counts the answers', () => {
  const { reviews } = withSaved('penser');
  reviews.record('rappel', PENSER, 'right', '2026-11-12');
  assert.deepEqual(reviews.record('rappel', PENSER, 'right', '2026-11-13'), { step: 1, dueOn: '2026-11-16' });
  assert.deepEqual(reviews.progress('rappel').get(itemKey(PENSER)), {
    step: 1, dueOn: '2026-11-16', introducedOn: '2026-11-12', answered: 2,
  });
});

test('progress is per game', () => {
  const { reviews } = withSaved('penser');
  reviews.record('rappel', PENSER, 'right', '2026-11-12');
  assert.equal(reviews.progress('genre').size, 0);
  assert.equal(reviews.progress('rappel').size, 1);
});

test('items of the same word are told apart', () => {
  const { reviews } = withSaved('penser');
  const toSomeone = { word: 'penser', item: 'penser à qqn' };
  const ofSomething = { word: 'penser', item: 'penser qqch de qqn' };
  reviews.record('prepositions', toSomeone, 'right', '2026-11-12');
  reviews.record('prepositions', ofSomething, 'wrong', '2026-11-12');
  const progress = reviews.progress('prepositions');
  assert.equal(progress.size, 2);
  assert.notEqual(itemKey(toSomeone), itemKey(ofSomething));
  assert.equal(progress.get(itemKey(toSomeone)).answered, 1);
});

test('removing a word from Mes mots deletes its progress', () => {
  const { myWords, reviews } = withSaved('penser', 'maison');
  reviews.record('rappel', PENSER, 'right', '2026-11-12');
  reviews.record('genre', { word: 'maison', item: '' }, 'right', '2026-11-12');
  reviews.record('genre', PENSER, 'right', '2026-11-12');
  myWords.remove('penser');
  assert.equal(reviews.progress('rappel').size, 0);
  assert.deepEqual([...reviews.progress('genre').keys()], [itemKey({ word: 'maison', item: '' })]);
});

test('an unsaved word is not recorded', () => {
  const { reviews } = withSaved('penser');
  assert.equal(reviews.record('rappel', { word: 'inconnu', item: '' }, 'right', '2026-11-12'), null);
  assert.equal(reviews.progress('rappel').size, 0);
});
