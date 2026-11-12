import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GAPS_IN_DAYS, addDays, isDay, localDay, nextReview } from '../server/schedule.js';

const TODAY = '2026-11-12';

test('a first right answer comes back the next day', () => {
  assert.deepEqual(nextReview(undefined, 'right', TODAY), { step: 0, dueOn: '2026-11-13' });
});

test('each right answer moves one gap up, and the last gap repeats', () => {
  assert.deepEqual(GAPS_IN_DAYS, [1, 3, 7, 14, 30, 60, 120]);
  const gaps = [];
  let progress;
  for (let review = 0; review < 8; review++) {
    progress = nextReview(progress, 'right', TODAY);
    gaps.push((Date.parse(progress.dueOn) - Date.parse(TODAY)) / 86_400_000);
  }
  assert.deepEqual(gaps, [1, 3, 7, 14, 30, 60, 120, 120]);
  assert.equal(progress.step, 6);
});

test('a miss goes back to one day', () => {
  assert.deepEqual(nextReview({ step: 4 }, 'wrong', TODAY), { step: 0, dueOn: '2026-11-13' });
  assert.deepEqual(nextReview(undefined, 'wrong', TODAY), { step: 0, dueOn: '2026-11-13' });
});

test('a hinted right answer keeps the gap', () => {
  assert.deepEqual(nextReview({ step: 3 }, 'hinted', TODAY), { step: 3, dueOn: '2026-11-26' });
  assert.deepEqual(nextReview(undefined, 'hinted', TODAY), { step: 0, dueOn: '2026-11-13' });
});

test('days roll over months and years', () => {
  assert.equal(addDays('2026-12-30', 3), '2027-01-02');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-03-28', 2), '2026-03-30');
});

test('only real calendar days are days', () => {
  assert.equal(isDay('2026-11-12'), true);
  assert.equal(isDay('2028-02-29'), true);
  assert.equal(isDay('2026-02-30'), false);
  assert.equal(isDay('2026-13-01'), false);
  assert.equal(isDay('12/11/2026'), false);
  assert.equal(isDay('2026-11-12T00:00'), false);
  assert.equal(isDay(undefined), false);
  assert.equal(isDay(['2026-11-12']), false);
});

test('the local day is the calendar day where the server runs', () => {
  assert.equal(localDay(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(localDay(new Date(2026, 10, 12, 0, 0)), '2026-11-12');
});
