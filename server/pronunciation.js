import { UpstreamError } from './reverso.js';

const ENDPOINT = 'https://fr.wiktionary.org/w/api.php';
const AUDIO_EXT = /\.(?:wav|ogg|oga|mp3|flac)$/;

export async function fetchAudioFiles(word, { fetch = globalThis.fetch, timeoutMs = 10_000 } = {}) {
  const params = new URLSearchParams({
    action: 'query',
    titles: word,
    redirects: '1',
    generator: 'images',
    gimlimit: 'max',
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
    formatversion: '2',
  });
  let res;
  try {
    res = await fetch(`${ENDPOINT}?${params}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'french-study/0.1 (personal French study app)' },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    throw new UpstreamError(`Wiktionary unreachable: ${err.message}`, { cause: err });
  }
  if (!res.ok) throw new UpstreamError(`Wiktionary responded ${res.status}`);
  const json = await res.json().catch((err) => {
    throw new UpstreamError(`Wiktionary sent invalid JSON: ${err.message}`, { cause: err });
  });
  return (json.query?.pages ?? [])
    .filter((page) => page.imageinfo?.[0]?.url)
    .map((page) => ({ title: page.title, url: page.imageinfo[0].url }));
}

const fold = (text) => text.normalize('NFC').replaceAll('’', "'").toLowerCase();

function rank(title, word) {
  const name = fold(title.slice(title.indexOf(':') + 1));
  if (!AUDIO_EXT.test(name)) return 0;
  const stem = name.replace(AUDIO_EXT, '');
  if (!stem.endsWith(`-${word}`)) return 0;
  if (stem.startsWith('ll-q150 (fra)-')) return 2;
  return stem.startsWith('fr-') ? 1 : 0;
}

export function pickAudioUrl(files, word) {
  const target = fold(word);
  const [best] = files
    .map((file) => ({ file, rank: rank(file.title, target) }))
    .filter((candidate) => candidate.rank > 0)
    .sort((a, b) => b.rank - a.rank);
  return best ? best.file.url.split('?')[0] : null;
}

export function createPronunciation({ db, fetchAudioFiles }) {
  const getCached = db.prepare('SELECT url FROM audio_cache WHERE word = ?');
  const putCached = db.prepare('INSERT OR REPLACE INTO audio_cache (word, url) VALUES (?, ?)');

  return {
    async audioUrl(word) {
      const cached = getCached.get(word);
      if (cached) return cached.url;
      const url = pickAudioUrl(await fetchAudioFiles(word), word);
      putCached.run(word, url);
      return url;
    },
  };
}
