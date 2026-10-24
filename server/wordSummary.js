import { headwordOf } from './reverso.js';

const MAX_TRANSLATIONS = 3;

function classificationsOf(sections) {
  const unique = new Map(sections.map(({ pos, gender }) => [`${pos}:${gender}`, { pos, gender }]));
  return [...unique.values()];
}

function keyMeaningsOf(sections) {
  const senses = sections.flatMap(({ pos, senses }) =>
    senses.map(({ level, definition, translations }) => ({
      pos,
      level,
      definition,
      translations: translations.slice(0, MAX_TRANSLATIONS),
    })),
  );
  const [first, ...others] = senses;
  if (!first) return [];
  const atLevel = (level) => others.filter((sense) => sense.level === level);
  const [firstB2, secondB2] = atLevel('B2');
  const [firstC1] = atLevel('C1');
  return [first, firstB2, firstC1 ?? secondB2].filter(Boolean);
}

export function summarizeWord(entry, word) {
  const sections = headwordOf(entry, word)?.sections ?? [];
  return { classifications: classificationsOf(sections), meanings: keyMeaningsOf(sections) };
}
