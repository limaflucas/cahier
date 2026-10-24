import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isReview, newSession, nextRequest, recordAnswer, REVIEW_DELAY } from '../web/src/memoir/session.js';

const q = (word, sense = 0) => ({ word, sense });

function play(session, answers) {
  return answers.reduce((s, [word, correct]) => recordAnswer(s, { request: nextRequest(s), question: q(word), correct }), session);
}

test('a fresh session asks for any word', () => {
  assert.deepEqual(nextRequest(newSession()), { exclude: [] });
  assert.equal(isReview(nextRequest(newSession())), false);
});

test('answers update the score and the recent words, newest first and without repeats', () => {
  const session = play(newSession(), [['a', true], ['b', false], ['a', true]]);
  assert.equal(session.asked, 3);
  assert.equal(session.correct, 2);
  assert.deepEqual(session.recent, ['a', 'b']);
});

test('recent words are capped', () => {
  const session = play(newSession(), ['a', 'b', 'c', 'd', 'e', 'f'].map((w) => [w, true]));
  assert.deepEqual(nextRequest(session), { exclude: ['f', 'e', 'd', 'c', 'b'] });
});

test(`a missed word comes back after ${REVIEW_DELAY} other questions, until answered right`, () => {
  let session = play(newSession(), [['miss', false], ['a', true], ['b', true]]);
  assert.equal(isReview(nextRequest(session)), false);
  session = play(session, [['c', true]]);
  assert.deepEqual(nextRequest(session), { word: 'miss', sense: 0 });

  session = play(session, [['miss', false], ['d', true], ['e', true], ['f', true]]);
  assert.deepEqual(nextRequest(session), { word: 'miss', sense: 0 });
  session = play(session, [['miss', true]]);
  assert.deepEqual(session.missed, []);
});

test('missing the same word again pushes it back instead of duplicating it', () => {
  const session = play(newSession(), [['miss', false], ['miss', false]]);
  assert.deepEqual(session.missed, [{ word: 'miss', sense: 0, dueAt: 2 + REVIEW_DELAY }]);
});

test('a review served with another word drops the stale entry', () => {
  let session = play(newSession(), [['gone', false], ['a', true], ['b', true], ['c', true]]);
  const request = nextRequest(session);
  session = recordAnswer(session, { request, question: q('other'), correct: true });
  assert.deepEqual(session.missed, []);
});
