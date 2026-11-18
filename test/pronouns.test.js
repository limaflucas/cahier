import { test } from 'node:test';
import assert from 'node:assert/strict';
import grammaire from '../web/src/grammar/codCoi.js';
import { parseMarks } from '../web/src/grammar/marks.js';
import { FAMILIES, FAMILIES_BY_ID, formsOf } from '../web/src/pronouns/index.js';
import { FREE_ROWS, PERSON_ROWS, TABLE_COLUMNS } from '../web/src/pronouns/table.js';

const keysOf = (familyId) => new Set(formsOf(FAMILIES_BY_ID[familyId]).map(({ key }) => key));

test("the page follows the video's eleven families, in order", () => {
  assert.deepEqual(FAMILIES.map(({ id }) => id), [
    'personnels', 'toniques', 'possessifs', 'demonstratifs', 'neutres', 'reflechis',
    'cod-coi', 'en-y', 'relatifs', 'interrogatifs', 'indefinis',
  ]);
  assert.deepEqual(FAMILIES.map(({ chapter }) => chapter), [21, 576, 875, 1330, 1582, 2000, 2640, 3094, 3556, 4069, 4407]);
});

test('every family has the content its section renders', () => {
  for (const family of FAMILIES) {
    assert.ok(family.name && family.label && family.summary.fr && family.summary.pt, family.id);
    assert.ok(formsOf(family).length > 0, `${family.id}: no forms`);
    assert.ok(family.uses.length > 0, `${family.id}: no Emplois`);
    for (const point of [...family.uses, ...(family.placement ?? []), ...family.advanced, ...family.pitfalls]) {
      assert.ok(point.title, `${family.id}: point without title`);
      for (const example of point.examples) assert.ok(example.fr && example.pt, `${family.id}: ${point.title}`);
    }
  }
});

test('a form key always names the same form', () => {
  for (const family of FAMILIES) {
    const cells = 'list' in family.forms ? family.forms.list : family.forms.rows.flatMap(({ cells }) => cells.flat());
    const seen = new Map();
    for (const { key, form, elided } of cells) {
      const shown = `${form}|${elided ?? ''}`;
      assert.equal(seen.get(key) ?? shown, shown, `${family.id}: ${key}`);
      seen.set(key, shown);
    }
  }
});

test("every pronoun in the table is one of its family's forms", () => {
  for (const { cells } of PERSON_ROWS) {
    cells.forEach((cell, column) => {
      const family = TABLE_COLUMNS[column].family;
      for (const key of cell?.keys ?? []) assert.ok(keysOf(family).has(key), `${family}: ${key}`);
    });
  }
  for (const { family, keys } of FREE_ROWS) {
    for (const key of keys ?? []) assert.ok(keysOf(family).has(key), `${family}: ${key}`);
  }
});

test('every family is reachable from the table', () => {
  const reachable = new Set([...TABLE_COLUMNS, ...FREE_ROWS].map(({ family }) => family));
  assert.deepEqual([...reachable].sort(), FAMILIES.map(({ id }) => id).sort());
});

test('the person rows tile the table', () => {
  const height = PERSON_ROWS.length;
  assert.equal(PERSON_ROWS.reduce((sum, { person }) => sum + (person?.span ?? 0), 0), height);
  TABLE_COLUMNS.forEach(({ family, part }, column) => {
    let coveredUntil = 0;
    PERSON_ROWS.forEach(({ cells }, row) => {
      const cell = cells[column];
      if (row < coveredUntil) {
        assert.equal(cell, null, `${family} ${part ?? ''}: row ${row} is covered by a span above`);
        return;
      }
      assert.ok(cell, `${family} ${part ?? ''}: row ${row} is empty`);
      coveredUntil = row + (cell.span ?? 1);
    });
    assert.equal(coveredUntil, height, `${family} ${part ?? ''}: spans run past the table`);
  });
});

const GRAMMAIRE = '/grammaire/cod-coi';
const pointsOf = (family) => [...family.uses, ...(family.placement ?? []), ...family.advanced, ...family.pitfalls];
const anchorsTo = (links) => links.map(({ to }) => {
  const [path, anchor] = to.split('#');
  assert.equal(path, GRAMMAIRE, to);
  return anchor;
});
const plain = (text) => parseMarks(text).map(({ text: part }) => part).join('').replace(/\s+/g, ' ').trim();

/**
 * Every French example sentence held anywhere inside the value.
 * @param {unknown} value
 * @returns {Generator<string>}
 */
function* examplesIn(value) {
  if (Array.isArray(value)) for (const item of value) yield* examplesIn(item);
  else if (value && typeof value === 'object') {
    if (typeof value.fr === 'string' && typeof value.pt === 'string') yield value.fr;
    for (const item of Object.values(value)) yield* examplesIn(item);
  }
}

test('COD et COI keeps its forms and uses, and leaves the rest to its Grammaire page', () => {
  const family = FAMILIES_BY_ID['cod-coi'];
  assert.equal(family.placement, undefined);
  assert.deepEqual([family.advanced, family.pitfalls, family.memory], [[], [], []]);
  assert.deepEqual(anchorsTo(family.uses.map(({ see }) => see ?? { to: '' })), ['pronoms', 'lui-leur', 'les-reperer']);
  assert.deepEqual(anchorsTo(family.more), ['place', 'deux-pronoms', 'imperatif', 'accord-participe', 'niveau-b2-c1', 'pieges-pour-lusophones']);
});

test('En et y keeps what the Grammaire page lacks, and links to the rest', () => {
  const family = FAMILIES_BY_ID['en-y'];
  assert.deepEqual(anchorsTo(family.uses.map(({ see }) => see ?? { to: '' })), ['en', 'de-lui', 'y']);
  assert.deepEqual(family.advanced.map(({ title }) => title), ['Les expressions figées', "Pas de y devant le futur d'aller"]);
  assert.deepEqual(family.pitfalls.map(({ title }) => title), ["« Vou » tout seul → j'y vais"]);
  assert.deepEqual(family.memory, []);
  assert.deepEqual(anchorsTo(family.more), ['a-lui', 'y-en-idees', 'en-accord', 'pieges-pour-lusophones']);
});

test('the families a Grammaire rule deepens link one point to it', () => {
  const expected = { toniques: 'a-lui', neutres: 'le-neutre', relatifs: 'relatifs', reflechis: 'pronominaux' };
  for (const [id, anchor] of Object.entries(expected)) {
    assert.deepEqual(anchorsTo(pointsOf(FAMILIES_BY_ID[id]).filter(({ see }) => see).map(({ see }) => see)), [anchor], id);
  }
});

test('every link to the COD et COI page lands on an anchor it has', () => {
  const anchors = new Set([...grammaire.basics, ...grammaire.advanced].map(({ id }) => id));
  for (const { id } of Object.values(grammaire.parts)) anchors.add(id);
  const links = FAMILIES.flatMap((family) => [...pointsOf(family).filter(({ see }) => see).map(({ see }) => see), ...(family.more ?? [])]);
  assert.ok(links.length >= 20, `${links.length} links`);
  for (const link of links) {
    assert.ok(link.label, link.to);
    for (const anchor of anchorsTo([link])) assert.ok(anchors.has(anchor), link.to);
  }
});

test('no example sentence is on both the Pronoms and the COD et COI pages', () => {
  const theirs = new Set([...examplesIn(grammaire)].map(plain));
  for (const family of FAMILIES) {
    for (const sentence of examplesIn(pointsOf(family))) assert.ok(!theirs.has(plain(sentence)), `${family.id}: ${sentence}`);
  }
});
