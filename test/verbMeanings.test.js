import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toEntry } from '../server/reverso.js';
import { verbSections } from '../web/src/conjugation/meanings.js';
import { fixture } from './helpers.js';

const sense = (definition) => ({ level: null, definition, translations: [], examples: [], tags: [] });

test('verbSections are the sections the search page shows for the verb', () => {
  const entry = toEntry(fixture('penser'));
  const sections = verbSections(entry, 'penser');
  assert.deepEqual(sections, entry.words.find((w) => w.word === 'penser').sections);
  assert.deepEqual(sections.map(({ pos }) => pos), ['Verb', 'Noun']);
});

test('verbSections prefers the headword spelled like the verb', () => {
  const entry = {
    words: [
      { word: 'plier', sections: [{ pos: 'Verb', senses: [sense('rabattre')] }] },
      { word: 'se plier', sections: [{ pos: 'Verb', senses: [sense('se soumettre')] }] },
    ],
  };
  assert.equal(verbSections(entry, 'se plier')[0].senses[0].definition, 'se soumettre');
  assert.equal(verbSections(entry, 'plier')[0].senses[0].definition, 'rabattre');
});

test('verbSections falls back to the first headword, and to nothing without an entry', () => {
  const entry = { words: [{ word: 'souvenir', sections: [{ pos: 'Verb', senses: [sense('se rappeler')] }] }] };
  assert.equal(verbSections(entry, 'se souvenir')[0].senses[0].definition, 'se rappeler');
  assert.deepEqual(verbSections(null, 'plier'), []);
  assert.deepEqual(verbSections({ words: [] }, 'plier'), []);
});
