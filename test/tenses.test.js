import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadLefff } from '../server/lefff.js';
import { createConjugator } from '../server/conjugator.js';
import { TENSES, TENSES_BY_ID } from '../web/src/tenses/index.js';

const board = createConjugator(loadLefff()).board('plier');

test('the reference page and the game cover exactly the same tenses', () => {
  assert.deepEqual(TENSES.map((tense) => tense.id).sort(), Object.keys(board.tenses).sort());
});

test('every derivation points at an existing cell', () => {
  for (const tense of TENSES) {
    if (!tense.derivedFrom) continue;
    board.tenses[tense.id].cells.forEach((_cell, person) => {
      for (const [sourceId, index] of tense.derivedFrom.sources(person)) {
        assert.ok(TENSES_BY_ID[sourceId], `${tense.id} → unknown tense ${sourceId}`);
        assert.ok(board.tenses[sourceId].cells[index], `${tense.id} → ${sourceId}[${index}] is missing`);
      }
    });
  }
});

test('every tense has the content the reference page renders', () => {
  for (const tense of TENSES) {
    assert.ok(tense.name && tense.summary.fr && tense.summary.pt && tense.formation.rule, tense.id);
    for (const point of [...tense.uses, ...tense.advanced, ...tense.pitfalls]) {
      assert.ok(point.title, `${tense.id}: point without title`);
      for (const example of point.examples) assert.ok(example.fr && example.pt, `${tense.id}: ${point.title}`);
    }
    assert.ok(tense.memory.length > 0, `${tense.id}: no memory tips`);
  }
});
