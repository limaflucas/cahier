import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelWeight, sensesWeight } from '../server/levels.js';

const E2 = Math.exp(-2);
const E8 = Math.exp(-8);

/**
 * @param {number} actual
 * @param {number} expected
 * @param {string} label
 */
const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-12, `${label}: ${actual} instead of ${expected}`);

test('B1, B2 and C1 weigh the most, and the weight falls off like a normal curve on either side', () => {
  for (const level of ['B1', 'B2', 'C1']) assert.equal(levelWeight(level), 1, level);
  near(levelWeight('A2'), E2, 'A2');
  near(levelWeight('C2'), E2, 'C2');
  near(levelWeight('A1'), E8, 'A1');
});

test('rare and unlevelled meanings weigh as C2', () => {
  for (const level of ['Rare', null, undefined]) near(levelWeight(level), E2, String(level));
});

test('a word weighs the average of its meanings, and nothing without any', () => {
  near(sensesWeight([{ level: 'B2' }, { level: 'A2' }]), (1 + E2) / 2, 'B2 and A2');
  assert.equal(sensesWeight([{ level: 'B1' }, { level: 'C1' }, { level: 'B2' }]), 1);
  assert.equal(sensesWeight([]), 0);
});
