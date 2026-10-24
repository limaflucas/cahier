import express from 'express';
import { normalize } from './dictionary.js';
import { UpstreamError } from './reverso.js';

const MAX_WORD_LENGTH = 100;
const asyncRoute = (handler) => (req, res, next) => handler(req, res).catch(next);

function wordParam(req, res) {
  const word = normalize(req.params.word);
  if (word && word.length <= MAX_WORD_LENGTH) return word;
  res.status(400).json({ error: 'invalid_word' });
  return null;
}

export function createApp({ db, dictionary, myWords, conjugator, verbPicker, memoir, pronunciation, logger = console }) {
  const app = express();
  app.use(express.json());

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
