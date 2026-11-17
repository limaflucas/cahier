import { test } from 'node:test';
import assert from 'node:assert/strict';
import codCoi from '../web/src/grammar/codCoi.js';
import { frenchSpacing, parseMarks } from '../web/src/grammar/marks.js';
import { TENSES_BY_ID } from '../web/src/tenses/index.js';

const LEVELS = ['A2', 'B1', 'B2', 'C1'];
const rank = (level) => LEVELS.indexOf(level);
const marksIn = (text) => parseMarks(text).filter((part) => part.kind);
const rules = () => [...codCoi.basics, ...codCoi.advanced];

/**
 * Every string inside the value, with the key it sits under.
 * @param {unknown} value
 * @param {string} [key]
 * @returns {Generator<[string, string]>}
 */
function* textsOf(value, key = '') {
  if (typeof value === 'string') yield [key, value];
  else if (Array.isArray(value)) for (const item of value) yield* textsOf(item, key);
  else if (value && typeof value === 'object') for (const [name, item] of Object.entries(value)) yield* textsOf(item, name);
}

test('marks split a sentence into plain text, bold and the complements', () => {
  assert.deepEqual(parseMarks("Je {COD:le} **lui** donne {COI:à l'enfant}."), [
    { text: 'Je ' },
    { text: 'le', kind: 'COD' },
    { text: ' ' },
    { text: 'lui', strong: true },
    { text: ' donne ' },
    { text: "à l'enfant", kind: 'COI' },
    { text: '.' },
  ]);
});

test('malformed marks are refused instead of showing up raw', () => {
  for (const text of ['Je {COS:le} vois.', 'Je {COD le} vois.', 'Je {COD:} vois.', 'Je **le vois.', 'Je le} vois.']) {
    assert.throws(() => parseMarks(text), SyntaxError, text);
  }
});

test('French spacing keeps ? ! : ; and guillemets on the line of the word next to them', () => {
  assert.equal(frenchSpacing('Tu viens ? Oui : « non » ; enfin !'), 'Tu viens\u00a0? Oui\u00a0: «\u00a0non\u00a0»\u00a0; enfin\u00a0!');
  assert.equal(frenchSpacing('Elle → lui'), 'Elle → lui');
});

test('every French text on the page has well-formed marks, and the Portuguese has none', () => {
  const texts = [...textsOf(codCoi)];
  assert.ok(texts.length > 0);
  for (const [key, text] of texts) {
    if (key === 'pt' || key === 'note') assert.doesNotMatch(text, /[{}]|\*\*/, text);
    else assert.doesNotThrow(() => parseMarks(text), text);
  }
});

test('Les repérer climbs from A2 to C1, four examples or more a level, each with its question and a marked complement', () => {
  const levels = codCoi.examples.map((example) => example.level);
  assert.deepEqual(levels, [...levels].sort((a, b) => rank(a) - rank(b)));
  assert.deepEqual([...new Set(levels)], LEVELS);
  for (const level of LEVELS) assert.ok(levels.filter((each) => each === level).length >= 4, level);
  for (const { fr, question, pt } of codCoi.examples) {
    assert.ok(question && pt, fr);
    assert.ok(marksIn(fr).length > 0, `${fr}: no COD or COI marked`);
  }
});

test('the basic rules are A2 or B1, the advanced ones B2 or C1, each with its own anchor, an explanation and examples', () => {
  for (const [part, allowed] of [[codCoi.basics, ['A2', 'B1']], [codCoi.advanced, ['B2', 'C1']]]) {
    assert.ok(part.length > 0);
    for (const rule of part) {
      assert.ok(allowed.includes(rule.level), `${rule.title}: ${rule.level}`);
      assert.ok(rule.id && rule.title && rule.text, rule.id);
      assert.ok(rule.examples.length > 0, `${rule.title}: no example`);
      for (const example of rule.examples) assert.ok(example.fr && example.pt, rule.title);
    }
  }
  assert.deepEqual([...new Set(codCoi.advanced.map((rule) => rule.level))].sort(), ['B2', 'C1']);
  const ids = rules().map((rule) => rule.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('the links between Temps verbaux and COD et COI land on anchors that exist', () => {
  const anchors = {
    '/grammaire/cod-coi': new Set(rules().map((rule) => rule.id)),
    '/temps-verbaux': new Set(Object.keys(TENSES_BY_ID)),
  };
  for (const tense of ['passeCompose', 'participePasse']) {
    const to = TENSES_BY_ID[tense].advanced.find((point) => point.see)?.see.to ?? '';
    const [path, anchor] = to.split('#');
    assert.equal(path, '/grammaire/cod-coi', tense);
    assert.ok(anchors[path].has(anchor), `${tense} → ${to}`);
  }
  const back = rules().filter((rule) => rule.see);
  assert.ok(back.length > 0);
  for (const rule of back) {
    const [path, anchor] = rule.see.to.split('#');
    assert.ok(anchors[path]?.has(anchor), `${rule.id} → ${rule.see.to}`);
  }
});
