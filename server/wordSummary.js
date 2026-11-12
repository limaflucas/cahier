import { headwordOf } from './reverso.js';

const MAX_TRANSLATIONS = 3;

function classificationsOf(sections) {
  const unique = new Map(sections.map(({ pos, gender }) => [`${pos}:${gender}`, { pos, gender }]));
  return [...unique.values()];
}

/**
 * The up to three senses Mes mots shows for a word: the first one, then the first B2, then the first C1
 * (or the second B2 when there is no C1).
 * @param {{ pos: string, gender: string | null, senses: object[] }[]} sections
 * @returns {object[]} whole senses, each with its part of speech and gender
 */
export function keySensesOf(sections) {
  const [first, ...others] = sections.flatMap(({ pos, gender, senses }) => senses.map((sense) => ({ ...sense, pos, gender })));
  if (!first) return [];
  const atLevel = (level) => others.filter((sense) => sense.level === level);
  const [firstB2, secondB2] = atLevel('B2');
  const [firstC1] = atLevel('C1');
  return [first, firstB2, firstC1 ?? secondB2].filter(Boolean);
}

/**
 * @param {{ pos: string, gender: string | null, senses: object[] }[]} sections
 * @returns {{ pos: string, level: string | null, definition: string, translations: string[] }[]} the key senses,
 *   as Mes mots shows them
 */
function keyMeaningsOf(sections) {
  return keySensesOf(sections).map(({ pos, level, definition, translations }) => ({
    pos,
    level,
    definition,
    translations: translations.slice(0, MAX_TRANSLATIONS),
  }));
}

export function summarizeWord(entry, word) {
  const sections = headwordOf(entry, word)?.sections ?? [];
  return { classifications: classificationsOf(sections), meanings: keyMeaningsOf(sections) };
}
