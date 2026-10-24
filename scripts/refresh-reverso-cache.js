// Re-fetches cached Reverso entries still holding European Portuguese ('pt') translations,
// plus saved words that were never cached, so everything uses Brazilian Portuguese ('bp').
// Reverso rate-limits aggressively: requests are sequential, spaced out, and back off on errors.
// Safe to re-run: entries already in Brazilian Portuguese are skipped.
import { openDb } from '../server/db.js';
import { fetchDefinition, toEntry } from '../server/reverso.js';
import { normalize } from '../server/dictionary.js';

const STALE_MARKER = '"lang":"pt"';
const BACKOFF_MINUTES = [1, 2, 4, 8];
const delayMs = Number(process.argv[2] ?? 8000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jittered = (ms) => ms * (0.75 + Math.random() * 0.5);

const db = openDb();
db.exec('PRAGMA busy_timeout = 5000');
const getRaw = db.prepare('SELECT json FROM reverso_cache WHERE query = ?');
const putRaw = db.prepare('INSERT OR REPLACE INTO reverso_cache (query, json) VALUES (?, ?)');

const needsRefresh = (query) => {
  const row = getRaw.get(query);
  return !row || row.json.includes(STALE_MARKER);
};

const cached = db.prepare('SELECT query FROM reverso_cache ORDER BY query').all().map((r) => r.query);
const saved = db.prepare('SELECT word FROM my_words ORDER BY word').all().map((r) => normalize(r.word));
const queries = [...new Set([...cached, ...saved])].filter(needsRefresh);

async function fetchPolitely(query) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchDefinition(query);
    } catch (err) {
      if (attempt >= BACKOFF_MINUTES.length) throw err;
      console.log(`  ${err.message} — waiting ${BACKOFF_MINUTES[attempt]} min`);
      await sleep(BACKOFF_MINUTES[attempt] * 60_000);
    }
  }
}

const firstTranslation = (entry) =>
  entry.words.flatMap((w) => w.sections.flatMap((s) => s.senses.flatMap((sense) => sense.translations)))[0] ?? '—';

console.log(`${queries.length} entries to refresh, ~${Math.round(delayMs / 1000)}s apart`);
const updated = [];
const notFound = [];

for (const [i, query] of queries.entries()) {
  if (i > 0) await sleep(jittered(delayMs));
  if (!needsRefresh(query)) continue; // refreshed meanwhile by the running app
  let raw;
  try {
    raw = await fetchPolitely(query);
  } catch (err) {
    console.error(`Aborting at "${query}" (${i}/${queries.length}): ${err.message}. Re-run to resume.`);
    process.exit(1);
  }
  const entry = toEntry(raw);
  if (entry) {
    putRaw.run(query, JSON.stringify(raw));
    updated.push(query);
  } else {
    notFound.push(query);
  }
  console.log(`[${i + 1}/${queries.length}] ${query} → ${entry ? firstTranslation(entry) : 'not found, left as is'}`);
}

console.log(`Done: ${updated.length} updated, ${notFound.length} not found${notFound.length ? `: ${notFound.join(', ')}` : ''}`);
