import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contractionOf, gradePreposition } from '../web/src/games/grade.js';

test('the preposition as written is right', () => {
  assert.equal(gradePreposition('au', 'au'), 'correct');
  assert.equal(gradePreposition('À', 'à'), 'correct');
  assert.equal(gradePreposition('d’', "d'"), 'correct');
});

test('the uncontracted preposition counts, with its contraction', () => {
  assert.equal(gradePreposition('à', 'au'), 'contraction');
  assert.equal(gradePreposition('de', 'des'), 'contraction');
  assert.equal(gradePreposition('de', "d'"), 'contraction');
  assert.equal(contractionOf('au'), 'à + le = au');
  assert.equal(contractionOf('aux'), 'à + les = aux');
  assert.equal(contractionOf('du'), 'de + le = du');
  assert.equal(contractionOf('des'), 'de + les = des');
  assert.equal(contractionOf("d'"), "de + voyelle = d'");
  assert.equal(contractionOf('à'), null);
});

test('a missing accent counts, flagged', () => {
  assert.equal(gradePreposition('a', 'à'), 'accent');
});

test('no preposition is answered with an empty answer', () => {
  assert.equal(gradePreposition('', ''), 'correct');
  assert.equal(gradePreposition('de', ''), 'wrong');
  assert.equal(gradePreposition('', 'à'), 'wrong');
});

test('another preposition is wrong', () => {
  assert.equal(gradePreposition('de', 'à'), 'wrong');
  assert.equal(gradePreposition('en', 'dans'), 'wrong');
  assert.equal(gradePreposition('du', 'de'), 'wrong');
});
