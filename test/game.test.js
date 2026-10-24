import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grade, normalizeAnswer } from '../web/src/conjugation/grade.js';
import { cellKey, gameReducer, levelById, newGame, scoreOf } from '../web/src/conjugation/game.js';

test('normalizeAnswer folds case, apostrophes and spacing', () => {
  assert.equal(normalizeAnswer('  Me  SUIS   Assis '), 'me suis assis');
  assert.equal(normalizeAnswer('m’ assieds'), "m'assieds");
});

test('grade accepts any listed answer and an optional subject pronoun', () => {
  assert.equal(grade('paye', ['paie', 'paye']), 'correct');
  assert.equal(grade('je plie', ['plie']), 'correct');
  assert.equal(grade("qu'il plie", ['plie']), 'correct');
  assert.equal(grade('nous plions', ['nous plions']), 'correct');
  assert.equal(grade('nous nous plions', ['nous plions']), 'correct');
  assert.equal(grade("j'ai plié", ['ai plié']), 'correct');
});

test('grade separates accent slips from wrong answers', () => {
  assert.equal(grade('plie', ['plié']), 'accent');
  assert.equal(grade('commencais', ['commençais']), 'accent');
  assert.equal(grade('plions', ['pliions']), 'wrong');
  assert.equal(grade('   ', ['plie']), 'empty');
});

const board = {
  tenses: {
    present: { cells: [{ label: 'je', answers: ['plie'] }, null, { label: 'il', answers: ['plie'] }, { label: 'nous', answers: ['plions'] }] },
    participePasse: { cells: [{ label: null, answers: ['plié'] }] },
  },
};

test('newGame prefills the level share of existing cells', () => {
  const statuses = (level) => Object.values(newGame(board, levelById(level)).cells).map((cell) => cell.status);
  assert.equal(statuses('facile').filter((status) => status === 'given').length, 3);
  assert.equal(statuses('moyen').filter((status) => status === 'given').length, 2);
  assert.equal(statuses('reel').filter((status) => status === 'given').length, 0);
  assert.equal(Object.keys(newGame(board, levelById('reel')).cells).length, 4);
});

test('cells are graded on check, locked once correct, and scored by attempts', () => {
  const key = cellKey('present', 3);
  const steps = [
    { type: 'type', key, value: 'plions?' },
    { type: 'check', key },
    { type: 'check', key },
    { type: 'type', key, value: 'plions' },
    { type: 'check', key },
    { type: 'type', key, value: 'changed' },
    { type: 'type', key: cellKey('present', 0), value: 'plie' },
    { type: 'check', key: cellKey('present', 0) },
  ];
  const state = steps.reduce(gameReducer, newGame(board, levelById('reel')));
  assert.equal(state.cells[key].status, 'correct');
  assert.equal(state.cells[key].value, 'plions');
  assert.equal(state.cells[key].attempts, 2);
  assert.deepEqual(scoreOf(state), { playable: 4, correct: 2, firstTry: 1, afterRetry: 1, revealed: 0, complete: false });
});

test('finish reveals every unsolved cell', () => {
  const finished = gameReducer(newGame(board, levelById('reel')), { type: 'finish' });
  assert.equal(finished.finished, true);
  assert.equal(finished.cells[cellKey('participePasse', 0)].value, 'plié');
  assert.equal(scoreOf(finished).revealed, 4);
});
