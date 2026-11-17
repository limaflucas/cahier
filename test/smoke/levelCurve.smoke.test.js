import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const LONG_AGO = '2000-01-01';
const TIER_BY_LEVEL = { B1: 0, B2: 0, C1: 0, A2: 1, C2: 1, A1: 2 };

/**
 * @param {string | null} level
 * @returns {number} 0 for the levels Cahier favours, 1 next to them, rare or unlevelled, 2 for A1
 */
const tierOf = (level) => TIER_BY_LEVEL[level] ?? 1;

test('Rappel asks each new word through its highest-weighted key meaning', async (t) => {
  const flags = await (await fetch(`${base}/api/flags`)).json();
  if (flags['cahier-rappel'] !== true) return t.skip('cahier-rappel is off');
  const res = await fetch(`${base}/api/rappel/session?today=${LONG_AGO}`);
  assert.equal(res.status, 200);
  let checked = 0;
  for (const card of (await res.json()).cards) {
    const { summary } = await (await fetch(`${base}/api/my-words/${encodeURIComponent(card.word)}`)).json();
    if (!summary || summary.meanings.some(({ translations }) => translations.length === 0)) continue;
    const [expected] = summary.meanings.toSorted((a, b) => tierOf(a.level) - tierOf(b.level));
    assert.equal(card.definition, expected.definition, card.word);
    checked++;
  }
  if (checked === 0) t.skip('no new word to check');
});
