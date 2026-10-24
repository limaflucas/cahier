import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadLefff } from '../server/lefff.js';
import { createConjugator, parseVerb } from '../server/conjugator.js';

const conjugator = createConjugator(loadLefff());

const answersOf = (board, tense) => board.tenses[tense].cells.map((cell) => cell?.answers ?? null);
const labelsOf = (board, tense) => board.tenses[tense].cells.map((cell) => cell?.label ?? null);
const hintsOf = (board, tense) => board.tenses[tense].hints.join('\n');

test('parseVerb recognises pronominal verbs and normalises apostrophes', () => {
  assert.deepEqual(parseVerb('  Se Plier '), { infinitive: 'plier', pronominal: true });
  assert.deepEqual(parseVerb('s’asseoir'), { infinitive: 'asseoir', pronominal: true });
  assert.deepEqual(parseVerb('plier'), { infinitive: 'plier', pronominal: false });
});

test('unknown verbs and inflected forms have no board', () => {
  assert.equal(conjugator.board('plie'), null);
  assert.equal(conjugator.board('xyzer'), null);
  assert.equal(conjugator.isVerb('pliable'), false);
  assert.equal(conjugator.isVerb('se plier'), true);
});

test('a regular verb gets simple and compound tenses built on avoir', () => {
  const board = conjugator.board('plier');
  assert.equal(board.verb, 'plier');
  assert.equal(board.auxiliary, 'avoir');
  assert.deepEqual(answersOf(board, 'present'), [['plie'], ['plies'], ['plie'], ['plions'], ['pliez'], ['plient']]);
  assert.deepEqual(answersOf(board, 'imparfait')[3], ['pliions']);
  assert.deepEqual(answersOf(board, 'passeCompose')[3], ['avons plié']);
  assert.deepEqual(answersOf(board, 'participePresent'), [['pliant']]);
  assert.deepEqual(answersOf(board, 'gerondif'), [['en pliant']]);
  assert.deepEqual(answersOf(board, 'participePasse'), [['plié']]);
  assert.deepEqual(labelsOf(board, 'subjonctif'), ['que je', 'que tu', "qu'il/elle", 'que nous', 'que vous', "qu'ils/elles"]);
  assert.equal(labelsOf(board, 'passeCompose')[0], "je/j'");
});

test('verbs conjugated with être accept both genders, and vous also the singular', () => {
  const board = conjugator.board('aller');
  assert.equal(board.auxiliary, 'être');
  assert.deepEqual(answersOf(board, 'passeCompose')[0], ['suis allé', 'suis allée']);
  assert.deepEqual(answersOf(board, 'passeCompose')[3], ['sommes allés', 'sommes allées']);
  assert.deepEqual(answersOf(board, 'plusQueParfait')[4], ['étiez allés', 'étiez allées', 'étiez allé', 'étiez allée']);
  assert.deepEqual(answersOf(board, 'futur')[0], ['irai']);
  assert.equal(labelsOf(board, 'futur')[0], "j'");
});

test('verbs taking either auxiliary accept être first, then avoir', () => {
  const board = conjugator.board('sortir');
  assert.equal(board.auxiliary, 'être ou avoir');
  assert.deepEqual(answersOf(board, 'passeCompose')[2], ['est sorti', 'est sortie', 'a sorti']);
});

test('pronominal verbs carry the reflexive pronoun, with elision', () => {
  const board = conjugator.board("s'asseoir");
  assert.equal(board.verb, "s'asseoir");
  assert.equal(board.auxiliary, 'être');
  assert.deepEqual(answersOf(board, 'present')[0], ["m'assieds", "m'assois"]);
  assert.deepEqual(answersOf(board, 'present')[3], ['nous asseyons', 'nous assoyons']);
  assert.deepEqual(answersOf(board, 'futur')[0], ["m'assiérai", "m'assoirai"]);
  assert.deepEqual(answersOf(board, 'passeCompose')[2], ["s'est assis", "s'est assise"]);
  assert.deepEqual(answersOf(board, 'gerondif'), [["en s'asseyant", "en s'assoyant"]]);
  assert.equal(labelsOf(board, 'present')[0], 'je');
});

test('reciprocal pronominals with an indirect pronoun keep the participle invariable', () => {
  const board = conjugator.board('se parler');
  assert.deepEqual(answersOf(board, 'passeCompose')[5], ['se sont parlé']);
});

test('spelling variants are accepted', () => {
  const payer = conjugator.board('payer');
  assert.deepEqual(answersOf(payer, 'present')[0], ['paie', 'paye']);
  assert.deepEqual(answersOf(payer, 'present')[3], ['payons']);
  assert.deepEqual(answersOf(payer, 'futur')[4], ['paierez', 'payerez']);
  assert.deepEqual(answersOf(conjugator.board('céder'), 'futur')[0], ['céderai', 'cèderai']);
  assert.deepEqual(answersOf(conjugator.board('pouvoir'), 'present')[0], ['peux', 'puis']);
});

test('corrected Lefff entries are used', () => {
  assert.deepEqual(answersOf(conjugator.board('résoudre'), 'participePasse'), [['résolu']]);
  assert.deepEqual(answersOf(conjugator.board('taire'), 'present')[2], ['tait']);
});

test('elision follows the first sound of the form', () => {
  assert.equal(labelsOf(conjugator.board('aimer'), 'present')[0], "j'");
  assert.equal(labelsOf(conjugator.board('aimer'), 'subjonctif')[0], "que j'");
  assert.equal(labelsOf(conjugator.board('habiter'), 'present')[0], "j'");
  assert.equal(labelsOf(conjugator.board('haïr'), 'present')[0], 'je');
});

test('impersonal verbs only show the persons that exist', () => {
  const board = conjugator.board('falloir');
  assert.deepEqual(answersOf(board, 'present'), [null, null, ['faut'], null, null, null]);
  assert.deepEqual(labelsOf(board, 'subjonctif'), [null, null, "qu'il", null, null, null]);
  assert.deepEqual(answersOf(board, 'passeCompose')[2], ['a fallu']);
  assert.deepEqual(answersOf(board, 'participePresent'), [null]);
  assert.deepEqual(board.tenses.gerondif.hints, []);
});

test('hints point at the stem each tense is built from', () => {
  assert.match(hintsOf(conjugator.board('plier'), 'imparfait'), /« pli- ».*\n.*deux i/);
  assert.match(hintsOf(conjugator.board('être'), 'imparfait'), /Exception : le radical est « ét- »/);
  assert.match(hintsOf(conjugator.board('appeler'), 'present'), /le radical devient « appell- »/);
  assert.match(hintsOf(conjugator.board('appeler'), 'futur'), /garde le changement.*« appeller- »/);
  assert.match(hintsOf(conjugator.board('commencer'), 'imparfait'), /redevient « commenc- »/);
  assert.match(hintsOf(conjugator.board('faire'), 'subjonctif'), /Radical irrégulier.*« fass- »/);
  assert.match(hintsOf(conjugator.board('prendre'), 'present'), /« pren- » pour nous et vous, « prenn- » pour ils/);
  assert.match(hintsOf(conjugator.board('dire'), 'present'), /« vous » ne se termine pas en -ez/);
  assert.match(hintsOf(conjugator.board('finir'), 'present'), /2e groupe/);
  assert.match(hintsOf(conjugator.board('aller'), 'futur'), /Radical irrégulier : « ir- »/);
  assert.match(hintsOf(conjugator.board('aller'), 'passeCompose'), /Auxiliaire être au présent/);
  assert.match(hintsOf(conjugator.board('se plier'), 'present'), /Verbe pronominal/);
});

test('forms lists every inflected form of a verb, and nothing for other words', () => {
  const forms = conjugator.forms('mener');
  for (const form of ['mener', 'mène', 'menait', 'mènera', 'mené', 'menées', 'menant']) assert.ok(forms.includes(form), form);
  assert.equal(new Set(forms).size, forms.length);
  assert.ok(conjugator.forms('se souvenir').includes('souvient'));
  assert.deepEqual(conjugator.forms('taille'), []);
});
