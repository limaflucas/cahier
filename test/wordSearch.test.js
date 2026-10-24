import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesSearch } from '../web/src/wordSearch.js';

test('words match from the start of any of their parts, ignoring case and accents', () => {
  assert.ok(matchesSearch('plier', 'pl'));
  assert.ok(matchesSearch('pliable', 'PLI'));
  assert.ok(matchesSearch('carré', 'carre'));
  assert.ok(matchesSearch('se plier', 'plier'));
  assert.ok(matchesSearch('se plier', 'se pl'));
  assert.ok(matchesSearch("s'asseoir", 'asse'));
  assert.ok(!matchesSearch('déplier', 'plier'));
  assert.ok(!matchesSearch('saisir', 'pl'));
});

test('an empty search matches everything', () => {
  assert.ok(matchesSearch('hors', ''));
  assert.ok(matchesSearch('hors', '   '));
});
