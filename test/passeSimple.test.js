import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadLefff } from '../server/lefff.js';
import { createConjugator } from '../server/conjugator.js';
import { cellKey, levelById, newGame } from '../web/src/conjugation/game.js';
import { GAME_TENSES, TENSES } from '../web/src/tenses/index.js';

const conjugator = createConjugator(loadLefff());
const cellsOf = (verb) => conjugator.board(verb).tenses.passeSimple.cells;
const firstAnswers = (verb) => cellsOf(verb).map((cell) => cell?.answers[0] ?? null);

test('the passé simple follows its vowel series and irregular stems', () => {
  assert.deepEqual(firstAnswers('parler'), ['parlai', 'parlas', 'parla', 'parlâmes', 'parlâtes', 'parlèrent']);
  assert.deepEqual(firstAnswers('finir'), ['finis', 'finis', 'finit', 'finîmes', 'finîtes', 'finirent']);
  assert.deepEqual(firstAnswers('être'), ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent']);
  assert.deepEqual(firstAnswers('venir'), ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent']);
  assert.deepEqual(firstAnswers('falloir'), [null, null, 'fallut', null, null, null]);
  assert.deepEqual(cellsOf('se lever')[0].answers, ['me levai']);
});

test('passé simple cells carry the usual subject labels', () => {
  assert.deepEqual(cellsOf('parler').map((cell) => cell.label), ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']);
  assert.equal(cellsOf('aller')[0].label, "j'");
});

test('the forms Memoir looks for include the passé simple', () => {
  assert.ok(conjugator.forms('prendre').includes('prirent'));
});

test('the reference page shows the passé simple right after the plus-que-parfait', () => {
  const ids = TENSES.map((tense) => tense.id);
  assert.equal(ids[ids.indexOf('plusQueParfait') + 1], 'passeSimple');
  assert.equal(TENSES[ids.indexOf('passeSimple')].mood, 'Indicatif');
});

test('the game keeps its own tenses and leaves the passé simple out', () => {
  const pageOnly = TENSES.map((tense) => tense.id).filter((id) => id !== 'passeSimple');
  assert.deepEqual([...GAME_TENSES].sort(), pageOnly.sort());
  const board = {
    tenses: {
      present: { cells: [{ label: 'je', answers: ['plie'] }] },
      passeSimple: { cells: [{ label: 'je', answers: ['pliai'] }] },
    },
  };
  assert.deepEqual(Object.keys(newGame(board, levelById('reel')).cells), [cellKey('present', 0)]);
});
