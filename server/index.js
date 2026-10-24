import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { readBuildInfo } from './buildInfo.js';
import { createConjugator } from './conjugator.js';
import { createDictionary } from './dictionary.js';
import { loadLefff } from './lefff.js';
import { createMemoir } from './memoir.js';
import { createMyWords } from './myWords.js';
import { createPrepositionFinder } from './prepositions.js';
import { createPronunciation, fetchAudioFiles } from './pronunciation.js';
import { fetchDefinition } from './reverso.js';
import { createVerbPicker } from './verbPicker.js';

const port = Number(process.env.PORT ?? 3000);
const spaDir = fileURLToPath(new URL('../web/dist', import.meta.url));
const db = openDb();

const findPrepositions = process.env.ANTHROPIC_API_KEY
  ? createPrepositionFinder({ client: new Anthropic() })
  : null;
if (!findPrepositions) console.warn('ANTHROPIC_API_KEY not set: verb prepositions disabled');

const dictionary = createDictionary({ db, fetchDefinition, findPrepositions });
const myWords = createMyWords(db);
const conjugator = createConjugator(loadLefff());

const app = createApp({
  db,
  dictionary,
  myWords,
  conjugator,
  verbPicker: createVerbPicker({ myWords, dictionary, conjugator }),
  memoir: createMemoir({ myWords, dictionary, conjugator }),
  pronunciation: createPronunciation({ db, fetchAudioFiles }),
  staticDir: existsSync(spaDir) ? spaDir : undefined,
  build: readBuildInfo(),
});

const server = app.listen(port, () => console.log(`server listening on http://localhost:${port}`));

process.on('SIGTERM', () => server.close(() => {
  db.close();
  process.exit(0);
}));
