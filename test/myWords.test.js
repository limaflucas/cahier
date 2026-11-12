import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createMyWords } from '../server/myWords.js';

function savedWords(...words) {
  const myWords = createMyWords(openDb(':memory:'));
  words.forEach(myWords.add);
  return myWords;
}

test('a saved word is found ignoring case, accents and surrounding spaces', () => {
  const myWords = savedWords('école', "s'asseoir");
  assert.equal(myWords.find('ecole')?.word, 'école');
  assert.equal(myWords.find(' ÉCOLE ')?.word, 'école');
  assert.equal(myWords.find("S'ASSEOIR")?.word, "s'asseoir");
});

test('a word that is only the start of a saved word is not found', () => {
  const myWords = savedWords('école');
  assert.equal(myWords.find('ecol'), null);
  assert.equal(myWords.find(''), null);
});

test('the exact spelling wins over another saved word that differs only in accents', () => {
  const myWords = savedWords('péché', 'pêche');
  assert.equal(myWords.find('pêche')?.word, 'pêche');
  assert.equal(myWords.find('péché')?.word, 'péché');
});

test('a found word says when it was saved', () => {
  const found = savedWords('école').find('ecole');
  assert.match(found.addedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
});
