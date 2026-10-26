import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { readBuildInfo } from './buildInfo.js';
import { createConjugator } from './conjugator.js';
import { createDictionary } from './dictionary.js';
import { createFlags, createUnleashClient, parseOverrides } from './flags.js';
import { loadLefff } from './lefff.js';
import { createMemoir } from './memoir.js';
import { createMyWords } from './myWords.js';
import { createPrepositionFinder } from './prepositions.js';
import { createPronunciation, fetchAudioFiles } from './pronunciation.js';
import { fetchDefinition } from './reverso.js';
import { createVerbPicker } from './verbPicker.js';
import { createWordLists } from './wordLists.js';

const port = Number(process.env.PORT ?? 3000);
const spaDir = fileURLToPath(new URL('../web/dist', import.meta.url));
const db = openDb();

const findPrepositions = process.env.ANTHROPIC_API_KEY
  ? createPrepositionFinder({ client: new Anthropic() })
  : null;
if (!findPrepositions) console.warn('ANTHROPIC_API_KEY not set: verb prepositions disabled');

const dictionary = createDictionary({ db, fetchDefinition, findPrepositions });
const myWords = createMyWords(db);
const unleash = createUnleashClient();
if (!unleash) console.warn('UNLEASH_URL or UNLEASH_API_TOKEN not set: flags come from FLAGS_OVERRIDE only');
const conjugator = createConjugator(loadLefff());

const app = createApp({
  db,
  dictionary,
  myWords,
  wordLists: createWordLists(db),
  conjugator,
  verbPicker: createVerbPicker({ myWords, dictionary, conjugator }),
  memoir: createMemoir({ myWords, dictionary, conjugator }),
  pronunciation: createPronunciation({ db, fetchAudioFiles }),
  staticDir: existsSync(spaDir) ? spaDir : undefined,
  build: readBuildInfo(),
  flags: createFlags({ client: unleash, overrides: parseOverrides(process.env.FLAGS_OVERRIDE) }),
});

const server = app.listen(port, () => console.log(`server listening on http://localhost:${port}`));

process.on('SIGTERM', () => server.close(() => {
  unleash?.destroy();
  db.close();
  process.exit(0);
}));
