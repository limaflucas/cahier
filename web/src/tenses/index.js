import present from './present.js';
import passeCompose from './passeCompose.js';
import imparfait from './imparfait.js';
import plusQueParfait from './plusQueParfait.js';
import futur from './futur.js';
import futurAnterieur from './futurAnterieur.js';
import conditionnel from './conditionnel.js';
import conditionnelPasse from './conditionnelPasse.js';
import subjonctif from './subjonctif.js';
import subjonctifPasse from './subjonctifPasse.js';
import gerondif from './gerondif.js';
import participePresent from './participePresent.js';
import participePasse from './participePasse.js';

export const TENSES = [
  present,
  passeCompose,
  imparfait,
  plusQueParfait,
  futur,
  futurAnterieur,
  conditionnel,
  conditionnelPasse,
  subjonctif,
  subjonctifPasse,
  gerondif,
  participePresent,
  participePasse,
];

export const TENSES_BY_ID = Object.fromEntries(TENSES.map((tense) => [tense.id, tense]));

export const NON_FINITE_TENSES = ['participePresent', 'gerondif', 'participePasse'];

export const TWIN_TENSES = [
  ['present', 'passeCompose'],
  ['imparfait', 'plusQueParfait'],
  ['futur', 'futurAnterieur'],
  ['conditionnel', 'conditionnelPasse'],
  ['subjonctif', 'subjonctifPasse'],
];

export function groupByMood(items, moodOf) {
  const groups = [];
  for (const item of items) {
    const mood = moodOf(item);
    if (groups.at(-1)?.mood !== mood) groups.push({ mood, items: [] });
    groups.at(-1).items.push(item);
  }
  return groups;
}

export const tenseAnchor = (id) => `/temps-verbaux#${id}`;
