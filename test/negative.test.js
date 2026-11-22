import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadLefff } from '../server/lefff.js';
import { createConjugator } from '../server/conjugator.js';

const conjugator = createConjugator(loadLefff());
const negativesOf = (verb, tense) => conjugator.board(verb).tenses[tense].cells.map((cell) => cell?.negative ?? null);

test('ne … pas frames the conjugated verb of a simple tense', () => {
  assert.deepEqual(negativesOf('parler', 'present'), [
    'ne parle pas', 'ne parles pas', 'ne parle pas', 'ne parlons pas', 'ne parlez pas', 'ne parlent pas',
  ]);
  assert.equal(negativesOf('prendre', 'subjonctif')[2], 'ne prenne pas');
  assert.equal(negativesOf('venir', 'passeSimple')[5], 'ne vinrent pas');
  assert.equal(negativesOf('se lever', 'present')[0], 'ne me lève pas');
});

test('ne … pas frames the auxiliary of a compound tense, ne comes before the reflexive pronoun', () => {
  assert.deepEqual(negativesOf('parler', 'passeCompose'), [
    "n'ai pas parlé", "n'as pas parlé", "n'a pas parlé", "n'avons pas parlé", "n'avez pas parlé", "n'ont pas parlé",
  ]);
  assert.deepEqual(negativesOf('aller', 'passeCompose'), [
    'ne suis pas allé', "n'es pas allé", "n'est pas allé", 'ne sommes pas allés', "n'êtes pas allés", 'ne sont pas allés',
  ]);
  assert.deepEqual(negativesOf('se lever', 'passeCompose'), [
    'ne me suis pas levé', "ne t'es pas levé", "ne s'est pas levé",
    'ne nous sommes pas levés', 'ne vous êtes pas levés', 'ne se sont pas levés',
  ]);
  assert.equal(negativesOf('se lever', 'plusQueParfait')[0], "ne m'étais pas levé");
  assert.equal(negativesOf('parler', 'subjonctifPasse')[0], "n'aie pas parlé");
  assert.equal(negativesOf('aller', 'futurAnterieur')[0], 'ne serai pas allé');
});

test('ne elides before a vowel or a silent h, not before an aspirated h', () => {
  assert.equal(negativesOf('aimer', 'present')[0], "n'aime pas");
  assert.equal(negativesOf('habiter', 'imparfait')[0], "n'habitais pas");
  assert.equal(negativesOf('haïr', 'present')[0], 'ne hais pas');
  assert.equal(negativesOf("s'habiller", 'present')[0], "ne m'habille pas");
});

test('the participles and the gérondif have a negative too', () => {
  assert.deepEqual(negativesOf('savoir', 'participePresent'), ['ne sachant pas']);
  assert.deepEqual(negativesOf('parler', 'gerondif'), ['en ne parlant pas']);
  assert.deepEqual(negativesOf('se lever', 'gerondif'), ['en ne se levant pas']);
  assert.deepEqual(negativesOf('parler', 'participePasse'), ["n'ayant pas parlé"]);
  assert.deepEqual(negativesOf('venir', 'participePasse'), ["n'étant pas venu"]);
  assert.deepEqual(negativesOf('se lever', 'participePasse'), ["ne s'étant pas levé"]);
});

test('a verb has a negative only where it has a form', () => {
  assert.deepEqual(negativesOf('falloir', 'present'), [null, null, 'ne faut pas', null, null, null]);
  assert.equal(negativesOf('falloir', 'passeCompose')[2], "n'a pas fallu");
  assert.deepEqual(negativesOf('falloir', 'participePresent'), [null]);
});

test('every negative is its first answer framed by ne … pas', () => {
  const unframed = (negative = '') => negative.replace(/(^| )(ne |n')/, '$1').replace(/ pas(?= |$)/, '');
  for (const verb of ['parler', 'aller', 'se lever', "s'asseoir", 'sortir', 'haïr', 'falloir', 'être']) {
    for (const [tense, { cells }] of Object.entries(conjugator.board(verb).tenses)) {
      if (tense === 'participePasse') continue;
      for (const cell of cells.filter(Boolean)) assert.equal(unframed(cell.negative), cell.answers[0], `${verb}, ${tense}`);
    }
  }
});
