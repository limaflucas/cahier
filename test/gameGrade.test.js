import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeRecall } from '../web/src/games/grade.js';

const PENSAIT = { answer: 'pensait', word: 'penser' };

test('the sentence’s form is right', () => {
  assert.equal(gradeRecall('pensait', PENSAIT), 'correct');
  assert.equal(gradeRecall(" aujourd’hui ", { answer: "aujourd'hui", word: "aujourd'hui" }), 'correct');
});

test('case does not matter', () => {
  assert.equal(gradeRecall('penser', { answer: 'Penser', word: 'penser' }), 'correct');
  assert.equal(gradeRecall('PENSAIT', PENSAIT), 'correct');
});

test('the dictionary form counts, as lemma', () => {
  assert.equal(gradeRecall('penser', PENSAIT), 'lemma');
  assert.equal(gradeRecall('se plier', { answer: 'plie', word: 'se plier' }), 'lemma');
});

test('missing accents count, flagged', () => {
  assert.equal(gradeRecall('pense', { answer: 'pensé', word: 'penser' }), 'accent');
  assert.equal(gradeRecall('eleve', { answer: 'élève', word: 'élève' }), 'accent');
  assert.equal(gradeRecall('elever', { answer: 'élevait', word: 'élever' }), 'accent');
});

test('anything else is wrong', () => {
  assert.equal(gradeRecall('pensais', PENSAIT), 'wrong');
  assert.equal(gradeRecall('croire', PENSAIT), 'wrong');
});

test('blank is empty', () => {
  assert.equal(gradeRecall('   ', PENSAIT), 'empty');
});
