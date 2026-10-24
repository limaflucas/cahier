import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeWord } from '../server/wordSummary.js';
import { toEntry } from '../server/reverso.js';
import { fixture } from './helpers.js';

const sense = (level, definition = level) => ({ level, definition, translations: [] });
const entryOf = (word, ...sections) => ({ words: [{ word, sections }] });
const meaningsOf = (entry, word) => summarizeWord(entry, word).meanings.map(({ pos, definition }) => `${pos} ${definition}`);

test('classifications list each part of speech with its gender', () => {
  assert.deepEqual(summarizeWord(toEntry(fixture('penser')), 'penser').classifications, [
    { pos: 'Verb', gender: null },
    { pos: 'Noun', gender: 'm' },
  ]);
  assert.deepEqual(summarizeWord(toEntry(fixture('homme')), 'homme').classifications, [{ pos: 'Noun', gender: 'm' }]);
});

test('the first meaning, then the first B2, then the first C1', () => {
  const { meanings } = summarizeWord(toEntry(fixture('penser')), 'penser');
  assert.deepEqual(meanings.map(({ pos, level }) => `${pos} ${level}`), ['Verb A1', 'Verb B2', 'Noun C1']);
  assert.match(meanings[0].definition, /^utiliser son esprit/);
  assert.deepEqual(meanings[1].translations, ['lembrar-se']);
});

test('the second B2 takes the third place when there is no C1', () => {
  const entry = entryOf('plier', { pos: 'Verb', senses: [sense('B1'), sense('B2', 'b2-a'), sense('B2', 'b2-b'), sense('B2', 'b2-c')] });
  assert.deepEqual(meaningsOf(entry, 'plier'), ['Verb B1', 'Verb b2-a', 'Verb b2-b']);
});

test('the first meaning is never repeated in the B2 or C1 place', () => {
  const entry = entryOf('orge', { pos: 'Noun', senses: [sense('B2', 'grains'), sense('C1', 'céréale')] });
  assert.deepEqual(meaningsOf(entry, 'orge'), ['Noun grains', 'Noun céréale']);
});

test('missing levels leave their place empty', () => {
  const entry = entryOf('saisir', { pos: 'Verb', senses: [sense('A2'), sense('B1'), sense('C1', 'c1-a'), sense('C1', 'c1-b')] });
  assert.deepEqual(meaningsOf(entry, 'saisir'), ['Verb A2', 'Verb c1-a']);
  assert.deepEqual(summarizeWord(null, 'saisir'), { classifications: [], meanings: [] });
});

test('the saved headword is preferred over other headwords of the entry', () => {
  const entry = {
    words: [
      { word: 'plier', sections: [{ pos: 'Verb', senses: [sense('B1')] }] },
      { word: 'se plier', sections: [{ pos: 'Verb', senses: [sense('A2'), sense('C1')] }] },
    ],
  };
  assert.deepEqual(meaningsOf(entry, 'se plier'), ['Verb A2', 'Verb C1']);
});

test('each meaning keeps at most three translations', () => {
  const entry = entryOf('saisir', {
    pos: 'Verb',
    senses: [{ level: 'A2', definition: 'a', translations: ['agarrar', 'apanhar', 'pegar', 'segurar'] }],
  });
  assert.deepEqual(summarizeWord(entry, 'saisir').meanings[0].translations, ['agarrar', 'apanhar', 'pegar']);
});
