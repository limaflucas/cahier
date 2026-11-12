import { headwordOf } from './reverso.js';

const MAX_TRANSLATIONS = 3;
const GENDERS = ['m', 'f'];
const STARTS_WITH_VOWEL_OR_H = /^[aeiouyhàâäéèêëîïôöùûüÿœæ]/i;
const WORD_SEPARATOR = /[\s-]/;

const FEMININE_ENDINGS = [
  'aison', 'tion', 'sion', 'té', 'tié', 'ette', 'elle', 'esse', 'euse', 'ence', 'ance',
  'ure', 'ude', 'ade', 'ière', 'aille', 'ie', 'ée', 'ise', 'ine',
];
const MASCULINE_ENDINGS = [
  'age', 'ment', 'ent', 'isme', 'eau', 'et', 'oir', 'ier', 'ail', 'eil', 'eu', 'ou',
  'al', 'at', 'as', 'in', 'ain', 'acle', 'ège',
];

/** The noun endings that tell a noun's usual gender. */
export const USUAL_GENDER_BY_ENDING = new Map([
  ...FEMININE_ENDINGS.map((ending) => [ending, 'f']),
  ...MASCULINE_ENDINGS.map((ending) => [ending, 'm']),
]);

const ENDINGS_LONGEST_FIRST = [...USUAL_GENDER_BY_ENDING.keys()].sort((a, b) => b.length - a.length);

/**
 * The rule a noun's ending gives for its gender: a compound noun ends where its first word does,
 * and the longest known ending wins.
 * @param {string} noun
 * @param {'m' | 'f'} gender the noun's real gender
 * @returns {{ ending: string, usualGender: 'm' | 'f', exception: boolean } | null} null when no known ending applies
 */
export function endingRule(noun, gender) {
  const [firstWord] = noun.toLowerCase().split(WORD_SEPARATOR);
  const ending = ENDINGS_LONGEST_FIRST.find((known) => firstWord.endsWith(known));
  if (!ending) return null;
  const usualGender = USUAL_GENDER_BY_ENDING.get(ending);
  return { ending, usualGender, exception: usualGender !== gender };
}

/**
 * The masculine and feminine articles that show a noun's gender: l' hides it before a vowel or h,
 * so those nouns take un or une.
 * @param {string} noun
 * @returns {['un', 'une'] | ['le', 'la']}
 */
export function articlesFor(noun) {
  return STARTS_WITH_VOWEL_OR_H.test(noun) ? ['un', 'une'] : ['le', 'la'];
}

/**
 * A Genre card: the article that goes with a noun, which the word's dictionary entry must give first,
 * with one gender.
 * @param {string} word
 * @param {object | null} entry the word's dictionary entry
 * @returns {{ gender: 'm' | 'f', articles: string[], answer: string, translations: string[], rule: object | null } | null}
 */
export function genreCard(word, entry) {
  const [first] = headwordOf(entry, word)?.sections ?? [];
  if (first?.pos !== 'Noun' || !GENDERS.includes(first.gender)) return null;
  const articles = articlesFor(word);
  const translations = first.senses.find((sense) => sense.translations.length > 0)?.translations ?? [];
  return {
    gender: first.gender,
    articles,
    answer: articles[GENDERS.indexOf(first.gender)],
    translations: translations.slice(0, MAX_TRANSLATIONS),
    rule: endingRule(word, first.gender),
  };
}

/**
 * Genre: the article of each saved noun, newest saved first.
 * @param {object} deps
 * @param {ReturnType<typeof import('./myWords.js').createMyWords>} deps.myWords
 * @param {{ definitions(word: string): Promise<object | null> }} deps.dictionary
 */
export function genreGame({ myWords, dictionary, logger = console }) {
  return {
    name: 'genre',
    flag: 'cahier-constructions',

    /** @returns {Promise<{ items: { word: string, item: string }[] }>} every saved word: only nouns get a card */
    items: async () => ({ items: myWords.list().map(({ word }) => ({ word, item: '' })) }),

    /**
     * @param {{ word: string }} item
     * @returns {Promise<object | null>}
     */
    async cardOf({ word }) {
      try {
        return genreCard(word, await dictionary.definitions(word));
      } catch (err) {
        logger.error(`definitions for "${word}" failed:`, err.message);
        return null;
      }
    },
  };
}
