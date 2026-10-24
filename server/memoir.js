import { levelWeight } from './levels.js';
import { inflectionsOf, markWord } from './locateWord.js';
import { pickOne, shuffle, weightedChoice } from './random.js';
import { headwordOf } from './reverso.js';

const EXCLUDED_LEVELS = new Set(['Rare', 'C2']);
const ADVANCED_BONUS = 1;
const OPTION_COUNT = 5;
const MAX_CLUE_TRANSLATIONS = 3;
const DIRECTIONS = ['fr-pt', 'pt-fr'];
const CLUE_LANGUAGE = { 'fr-pt': 'fr', 'pt-fr': 'pt' };

const fold = (text) => text.toLowerCase();
const hasSingleMark = (text) => text?.split('**').length === 3;

export function toCard(entry, word) {
  const all = (headwordOf(entry, word)?.sections ?? [])
    .flatMap(({ pos, gender, senses }) => senses.map((sense) => ({ ...sense, pos, gender })))
    .map((sense, id) => ({ ...sense, id }));
  const senses = all.filter((sense) => !EXCLUDED_LEVELS.has(sense.level) && sense.translations.length > 0);
  if (senses.length === 0) return null;
  return { word, senses, translations: new Set(all.flatMap((sense) => sense.translations.map(fold))) };
}

export const cardWeight = (card) => levelWeight(card.senses, ADVANCED_BONUS);

function chooseClue(direction, sense, examples, random) {
  const language = CLUE_LANGUAGE[direction];
  const phrases = examples.filter((example) => hasSingleMark(example[language]));
  const phrase = phrases.length > 0 ? pickOne(phrases, random) : null;
  const phraseClue = phrase && { kind: 'phrase', text: phrase[language], example: phrase };
  const glossClue =
    direction === 'fr-pt'
      ? sense.definition && { kind: 'definition', text: sense.definition }
      : { kind: 'translation', text: sense.translations.slice(0, MAX_CLUE_TRANSLATIONS).join(', ') };
  const [first, second] = random() < 0.5 ? [phraseClue, glossClue] : [glossClue, phraseClue];
  return first || second || null;
}

function wrongOptions(direction, card, sense, cards, random) {
  const candidates = shuffle(cards.filter((other) => other.word !== card.word), random).flatMap((other) => {
    const samePos = other.senses.filter((s) => s.pos === sense.pos);
    if (direction === 'pt-fr') {
      const clashes = sense.translations.some((translation) => other.translations.has(fold(translation)));
      return clashes ? [] : [{ value: other.word, samePos: samePos.length > 0 }];
    }
    const value = pickOne(samePos.length > 0 ? samePos : other.senses, random).translations[0];
    return card.translations.has(fold(value)) ? [] : [{ value, samePos: samePos.length > 0 }];
  });
  const seen = new Set();
  return [...candidates.filter((c) => c.samePos), ...candidates.filter((c) => !c.samePos)]
    .map(({ value }) => value)
    .filter((value) => !seen.has(fold(value)) && seen.add(fold(value)))
    .slice(0, OPTION_COUNT - 1);
}

export function buildQuestion({ card, sense, cards, direction, forms, random }) {
  const examples = sense.examples.map(({ fr, pt }) => ({ fr: markWord(fr, forms) ?? fr, pt }));
  const clue = chooseClue(direction, sense, examples, random);
  const wrong = wrongOptions(direction, card, sense, cards, random);
  if (!clue || wrong.length < OPTION_COUNT - 1) return null;

  const correct = direction === 'fr-pt' ? sense.translations[0] : card.word;
  const options = shuffle([correct, ...wrong], random);
  const { pos, gender, level, definition, translations } = sense;
  return {
    word: card.word,
    sense: sense.id,
    direction,
    clue: { kind: clue.kind, text: clue.text },
    options,
    answer: options.indexOf(correct),
    reveal: {
      pos,
      gender,
      level,
      definition,
      translations,
      example: clue.example ?? (examples.length > 0 ? pickOne(examples, random) : null),
    },
  };
}

export function createMemoir({ myWords, dictionary, conjugator, random = Math.random, logger = console }) {
  function formsOf(word) {
    const verbForms = conjugator.forms(word);
    return verbForms.length > 0 ? verbForms : inflectionsOf(word);
  }

  async function cardOf(word) {
    try {
      return toCard(await dictionary.definitions(word), word);
    } catch (err) {
      logger.error(`definitions for "${word}" failed:`, err.message);
      return null;
    }
  }

  function chooseCard(cards, exclude) {
    const fresh = cards.filter((card) => !exclude.includes(card.word));
    const pool = fresh.length > 0 ? fresh : cards;
    return weightedChoice(pool.map((card) => ({ value: card, weight: cardWeight(card) })), random);
  }

  return {
    async question({ word, sense, exclude = [] } = {}) {
      const cards = (await Promise.all(myWords.list().map((saved) => cardOf(saved.word)))).filter(Boolean);
      if (cards.length < OPTION_COUNT) return null;
      const card = cards.find((c) => c.word === word) ?? chooseCard(cards, exclude);
      const chosen = card.senses.find((s) => s.id === sense) ?? pickOne(card.senses, random);
      const forms = formsOf(card.word);
      for (const direction of shuffle(DIRECTIONS, random)) {
        const question = buildQuestion({ card, sense: chosen, cards, direction, forms, random });
        if (question) return question;
      }
      return null;
    },
  };
}
