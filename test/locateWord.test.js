import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inflectionsOf, markWord } from '../server/locateWord.js';

test('markWord wraps the first whole-word match of any form, ignoring case', () => {
  assert.equal(markWord('Il mène sa fille.', ['mener', 'mène']), 'Il **mène** sa fille.');
  assert.equal(markWord('Taille unique, belle taille.', ['taille']), '**Taille** unique, belle taille.');
  assert.equal(markWord('Les détailles.', ['taille']), null);
  assert.equal(markWord('Rien ici.', []), null);
});

test('markWord prefers the longest form at the same position', () => {
  assert.equal(markWord('Des contraintes fortes.', inflectionsOf('contrainte')), 'Des **contraintes** fortes.');
});

test('markWord treats apostrophes as boundaries and folds curly ones', () => {
  assert.equal(markWord("J'évoque l’idée.", ['évoque']), "J'**évoque** l’idée.");
  assert.equal(markWord('C’est bon, d’ailleurs il gagne.', ["d'ailleurs"]), 'C’est bon, **d’ailleurs** il gagne.');
});

test('markWord matches multi-word items across any spacing', () => {
  assert.equal(markWord('Il vient plus  souvent ici.', ['plus souvent']), 'Il vient **plus  souvent** ici.');
});

test('inflectionsOf adds plural and feminine endings to single words only', () => {
  assert.deepEqual(inflectionsOf('certain'), ['certain', 'certains', 'certaine', 'certaines']);
  assert.deepEqual(inflectionsOf('bijou'), ['bijou', 'bijous', 'bijoux']);
  assert.deepEqual(inflectionsOf('plus souvent'), ['plus souvent']);
  assert.deepEqual(inflectionsOf("d'ailleurs"), ["d'ailleurs"]);
});
