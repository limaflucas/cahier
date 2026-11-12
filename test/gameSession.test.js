import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REVIEW_DELAY, answerCard, currentCard, isFinished, newSession } from '../web/src/games/session.js';

const cardsOf = (...words) => words.map((word) => ({ word, item: '' }));
const order = (session) => session.queue.map(({ word }) => word);

/**
 * Answers the current card of each step in turn.
 * @returns {{ session: object, firsts: boolean[] }}
 */
function play(session, outcomes) {
  const firsts = [];
  for (const outcome of outcomes) {
    const answered = answerCard(session, outcome);
    firsts.push(answered.first);
    session = answered.session;
  }
  return { session, firsts };
}

test('a missed card comes back three cards later', () => {
  assert.equal(REVIEW_DELAY, 3);
  const { session } = play(newSession(cardsOf('a', 'b', 'c', 'd', 'e')), ['wrong']);
  assert.deepEqual(order(session), ['b', 'c', 'd', 'a', 'e']);
  assert.deepEqual(order(play(newSession(cardsOf('a', 'b')), ['wrong']).session), ['b', 'a']);
});

test('a right or hinted answer takes the card out', () => {
  const { session } = play(newSession(cardsOf('a', 'b', 'c')), ['right', 'hinted']);
  assert.deepEqual(order(session), ['c']);
  assert.deepEqual(currentCard(session), { word: 'c', item: '' });
});

test('only the first answer to a card is recorded', () => {
  const { firsts } = play(newSession(cardsOf('a', 'b')), ['wrong', 'right', 'wrong', 'right']);
  assert.deepEqual(firsts, [true, true, false, false]);
});

test('cards of one word are told apart by their item', () => {
  const cards = [{ word: 'penser', item: 'à' }, { word: 'penser', item: 'de' }];
  assert.deepEqual(play(newSession(cards), ['right', 'right']).firsts, [true, true]);
});

test('the session finishes when every card was answered right once', () => {
  let { session } = play(newSession(cardsOf('a')), ['wrong']);
  assert.equal(isFinished(session), false);
  ({ session } = play(session, ['right']));
  assert.equal(isFinished(session), true);
  assert.equal(currentCard(session), null);
  assert.equal(isFinished(newSession([])), true);
});

test('rightFirstTime counts the cards answered right, without a hint, the first time', () => {
  const { session } = play(newSession(cardsOf('a', 'b', 'c')), ['wrong', 'right', 'hinted', 'right']);
  assert.equal(session.rightFirstTime, 1);
  assert.equal(session.total, 3);
});

test('every answer is a new turn, so a card that comes back starts afresh', () => {
  const { session } = play(newSession(cardsOf('a', 'b')), ['wrong', 'right']);
  assert.equal(session.turn, 2);
});
