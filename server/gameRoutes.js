import express from 'express';
import { buildSession } from './deck.js';
import { normalize } from './dictionary.js';
import { isDay, localDay } from './schedule.js';
import { visitorContext } from './visitor.js';

const OUTCOMES = new Set(['right', 'hinted', 'wrong']);

/**
 * The learner's day: the one the browser sent, else the server's own.
 * @param {unknown} sent
 * @returns {string | null} YYYY-MM-DD, or null when what was sent is not a day
 */
function dayOf(sent) {
  if (sent === undefined) return localDay();
  return isDay(sent) ? sent : null;
}

/**
 * The API of one review game, which exists only while the game's flag is on:
 * GET /session?today= gives today's cards, POST /answers records an answer.
 * @param {object} deps
 * @param {{ name: string, flag: string, items(): Promise<{ items: object[] }>, cardOf: Function }} deps.game
 * @param {ReturnType<typeof import('./reviews.js').createReviews>} deps.reviews
 * @param {{ isEnabled(name: string, context: object): boolean }} deps.flags
 * @returns {import('express').Router}
 */
export function gameRoutes({ game, reviews, flags }) {
  const router = express.Router();
  const refuse = (res, status, error) => res.status(status).json({ error });

  router.use((req, res, next) => (flags.isEnabled(game.flag, visitorContext(req, res)) ? next() : refuse(res, 404, 'not_found')));

  /**
   * @param {string} today
   * @returns {Promise<object>} today's cards and counts, plus whatever else the game reports
   */
  async function sessionOf(today) {
    const { items, ...details } = await game.items();
    const session = await buildSession({ items, progress: reviews.progress(game.name), today, cardOf: game.cardOf });
    return { ...session, ...details };
  }

  router.get('/session', (req, res, next) => {
    const today = dayOf(req.query.today);
    if (!today) return refuse(res, 400, 'invalid_day');
    sessionOf(today).then((session) => res.set('Cache-Control', 'no-store').json(session), next);
  });

  router.post('/answers', (req, res) => {
    const { word, item = '', outcome, today: sentDay } = req.body;
    const today = dayOf(sentDay);
    if (!today) return refuse(res, 400, 'invalid_day');
    const isAnswer = typeof word === 'string' && normalize(word) !== '' && typeof item === 'string' && OUTCOMES.has(outcome);
    if (!isAnswer) return refuse(res, 400, 'invalid_answer');
    const next = reviews.record(game.name, { word: normalize(word), item }, outcome, today);
    return next ? res.json(next) : refuse(res, 404, 'not_saved');
  });

  return router;
}
