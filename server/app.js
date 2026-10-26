import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import express from 'express';
import { readBuildInfo } from './buildInfo.js';
import { createFlags } from './flags.js';
import { normalize } from './dictionary.js';
import { UpstreamError } from './reverso.js';
import { ListError } from './wordLists.js';

const MAX_WORD_LENGTH = 100;
const SESSION_COOKIE = 'cahier_sid';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const asyncRoute = (handler) => (req, res, next) => handler(req, res).catch(next);

/**
 * Reads one cookie from the request.
 * @param {import('express').Request} req
 * @param {string} name
 * @returns {string | undefined}
 */
function readCookie(req, name) {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
}

/**
 * The visitor's stable id for sticky Unleash rollouts, issuing one on first visit.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {string}
 */
function sessionId(req, res) {
  const existing = readCookie(req, SESSION_COOKIE);
  if (existing) return existing;
  const id = randomUUID();
  res.cookie(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: ONE_YEAR_MS });
  return id;
}

/**
 * What Unleash knows about the visitor: sticky session, address and browser.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {{ sessionId: string, remoteAddress: string, properties: { userAgent: string } }}
 */
function visitorContext(req, res) {
  return { sessionId: sessionId(req, res), remoteAddress: req.ip, properties: { userAgent: req.get('user-agent') ?? '' } };
}

/**
 * The list id in the path, or null when it is not a positive integer.
 * @param {import('express').Request} req
 * @returns {number | null}
 */
function listId(req) {
  return /^[1-9]\d*$/.test(req.params.id) ? Number(req.params.id) : null;
}

/**
 * The /api/lists routes, which exist only while the sac-de-mots flag is on.
 * @param {ReturnType<typeof import('./wordLists.js').createWordLists>} wordLists
 * @param {{ isEnabled(name: string, context: object): boolean }} flags
 * @returns {import('express').Router}
 */
function listRoutes(wordLists, flags) {
  const router = express.Router();
  const notFound = (res) => res.status(404).json({ error: 'not_found' });
  const fields = (req) => (req.body && typeof req.body === 'object' ? req.body : {});

  router.use((req, res, next) => (flags.isEnabled('sac-de-mots', visitorContext(req, res)) ? next() : notFound(res)));

  router.get('/', (_req, res) => res.json(wordLists.all()));

  router.post('/', (req, res) => res.status(201).json(wordLists.create(fields(req))));

  router.get('/:id', (req, res) => {
    const list = listId(req) && wordLists.get(listId(req));
    return list ? res.json(list) : notFound(res);
  });

  router.patch('/:id', (req, res) => {
    const list = listId(req) && wordLists.update(listId(req), fields(req));
    return list ? res.json(list) : notFound(res);
  });

  router.delete('/:id', (req, res) => (listId(req) && wordLists.remove(listId(req)) ? res.status(204).end() : notFound(res)));

  router.use((err, _req, res, next) => {
    if (!(err instanceof ListError)) return next(err);
    res.status(err.code === 'name_taken' ? 409 : 400).json({ error: err.code });
  });

  return router;
}

function wordParam(req, res) {
  const word = normalize(req.params.word);
  if (word && word.length <= MAX_WORD_LENGTH) return word;
  res.status(400).json({ error: 'invalid_word' });
  return null;
}

/**
 * Builds the HTTP app: the JSON API under /api and, when staticDir is given, the built SPA.
 * @param {object} deps services backing the API routes
 * @param {string} [deps.staticDir] absolute path to the built SPA (web/dist)
 * @param {{ name: string, version: string, commit: string }} [deps.build] what /api/version reports
 * @param {{ isEnabled(name: string, context: object): boolean, snapshot(context: object): Record<string, boolean> }} [deps.flags] feature flags
 * @returns {import('express').Express}
 */
export function createApp({
  db, dictionary, myWords, wordLists, conjugator, verbPicker, memoir, pronunciation,
  staticDir, build = readBuildInfo(), flags = createFlags(), logger = console,
}) {
  const app = express();
  app.set('trust proxy', 'loopback, uniquelocal');
  app.use(express.json());

  app.get('/api/version', (_req, res) => res.json(build));

  app.get('/api/flags', (req, res) => {
    res.set('Cache-Control', 'no-store').json(flags.snapshot(visitorContext(req, res)));
  });

  app.get('/api/health', (_req, res) => {
    const { ok } = db.prepare('SELECT 1 AS ok').get();
    res.json({ ok: ok === 1 });
  });

  app.get('/api/dictionary/:word', asyncRoute(async (req, res) => {
    const word = wordParam(req, res);
    if (!word) return;
    const entry = await dictionary.lookup(word);
    if (!entry) return res.status(404).json({ error: 'not_found' });
    res.json(entry);
  }));

  app.get('/api/audio/:word', asyncRoute(async (req, res) => {
    const word = wordParam(req, res);
    if (!word) return;
    const url = await pronunciation.audioUrl(word);
    if (!url) return res.status(404).json({ error: 'no_audio' });
    res.redirect(url);
  }));

  async function withSummary(saved) {
    try {
      return { ...saved, summary: await dictionary.summary(saved.word) };
    } catch (err) {
      logger.error(`summary for "${saved.word}" failed:`, err.message);
      return { ...saved, summary: null };
    }
  }

  app.get('/api/my-words', asyncRoute(async (_req, res) => {
    res.json(await Promise.all(myWords.list().map(withSummary)));
  }));

  app.put('/api/my-words/:word', (req, res) => {
    const word = wordParam(req, res);
    if (!word) return;
    myWords.add(word);
    res.status(204).end();
  });

  app.delete('/api/my-words/:word', (req, res) => {
    const word = wordParam(req, res);
    if (!word) return;
    myWords.remove(word);
    res.status(204).end();
  });

  app.get('/api/conjugation/:word', (req, res) => {
    const verb = wordParam(req, res);
    if (!verb) return;
    const board = conjugator.board(verb);
    if (!board) return res.status(404).json({ error: 'unknown_verb' });
    res.json(board);
  });

  app.get('/api/random-verb', asyncRoute(async (req, res) => {
    const exclude = typeof req.query.exclude === 'string' ? normalize(req.query.exclude) : undefined;
    const verb = await verbPicker.pick({ exclude });
    if (!verb) return res.status(404).json({ error: 'no_saved_verbs' });
    res.json({ verb });
  }));

  app.get('/api/memoir/question', asyncRoute(async (req, res) => {
    const { word, sense, exclude } = req.query;
    const question = await memoir.question({
      word: typeof word === 'string' ? normalize(word) : undefined,
      sense: typeof sense === 'string' ? Number(sense) : undefined,
      exclude: [exclude ?? []].flat().filter((w) => typeof w === 'string').map(normalize),
    });
    if (!question) return res.status(404).json({ error: 'not_enough_words' });
    res.json(question);
  }));

  if (wordLists) app.use('/api/lists', listRoutes(wordLists, flags));

  app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

  if (staticDir) {
    app.use('/assets', express.static(join(staticDir, 'assets'), { immutable: true, maxAge: '1y' }));
    app.use(express.static(staticDir, { index: false }));
    app.get('*', (_req, res) => res.set('Cache-Control', 'no-cache').sendFile(join(staticDir, 'index.html')));
  }

  app.use((err, _req, res, _next) => {
    if (err instanceof UpstreamError) {
      logger.error(err.message);
      return res.status(502).json({ error: 'upstream_unavailable' });
    }
    logger.error(err);
    res.status(500).json({ error: 'internal' });
  });

  return app;
}
