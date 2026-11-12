import { formsOf, markWord } from './locateWord.js';
import { headwordOf } from './reverso.js';
import { keySensesOf } from './wordSummary.js';

const MAX_TRANSLATIONS = 3;

/**
 * The example with the word blanked out, when the example uses the word exactly once.
 * @param {{ fr: string, pt: string | null }} example
 * @param {string[]} forms
 * @returns {{ sentence: string, answer: string, portuguese: string | null } | null} the sentence marks the answer with **
 */
function blanked(example, forms) {
  const sentence = markWord(example.fr, forms);
  if (!sentence) return null;
  const [before, answer, after] = sentence.split('**');
  return markWord(`${before} ${after}`, forms) ? null : { sentence, answer, portuguese: example.pt };
}

/**
 * The card asking for the word through one of its senses: an example with the word blanked out,
 * else the definition and translations, which ask for the dictionary form.
 * @param {object} sense a key sense, with its part of speech and gender
 * @param {string} word the dictionary form
 * @param {string[]} forms
 * @param {number} round how often this sense was asked already, to take its examples in turn
 * @returns {object | null} null when the sense has neither an example nor translations to ask with
 */
function senseCard(sense, word, forms, round) {
  const sentences = sense.examples.map((example) => blanked(example, forms)).filter(Boolean);
  const translations = sense.translations.slice(0, MAX_TRANSLATIONS);
  const shown = { definition: sense.definition, translations, pos: sense.pos, gender: sense.gender, level: sense.level };
  if (sentences.length > 0) return { ...sentences[round % sentences.length], ...shown };
  return translations.length > 0 ? { sentence: null, answer: word, portuguese: null, ...shown } : null;
}

/**
 * A Rappel card: the word to type from memory, asked through one of its key senses, the next one each turn.
 * @param {{ word: string, entry: object | null, forms: string[], turn: number }} options
 *   turn: how often the word was answered before
 * @returns {object | null} null when no key sense can ask for the word
 */
export function rappelCard({ word, entry, forms, turn }) {
  const senses = keySensesOf(headwordOf(entry, word)?.sections ?? []);
  for (let offset = 0; offset < senses.length; offset++) {
    const card = senseCard(senses[(turn + offset) % senses.length], word, forms, Math.floor(turn / senses.length));
    if (card) return card;
  }
  return null;
}

/**
 * Rappel: type a saved word from memory, newest saved first.
 * @param {object} deps
 * @param {ReturnType<typeof import('./myWords.js').createMyWords>} deps.myWords
 * @param {{ definitions(word: string): Promise<object | null> }} deps.dictionary
 * @param {{ forms(word: string): string[] }} deps.conjugator
 */
export function rappelGame({ myWords, dictionary, conjugator, logger = console }) {
  return {
    name: 'rappel',
    flag: 'cahier-rappel',

    /** @returns {Promise<{ items: { word: string, item: string }[] }>} */
    items: async () => ({ items: myWords.list().map(({ word }) => ({ word, item: '' })) }),

    /**
     * @param {{ word: string }} item
     * @param {{ answered: number } | undefined} progress
     * @returns {Promise<object | null>}
     */
    async cardOf({ word }, progress) {
      try {
        const entry = await dictionary.definitions(word);
        return rappelCard({ word, entry, forms: formsOf(word, conjugator), turn: progress?.answered ?? 0 });
      } catch (err) {
        logger.error(`definitions for "${word}" failed:`, err.message);
        return null;
      }
    },
  };
}
