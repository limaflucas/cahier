const POS = {
  Noun: 'nom',
  Verb: 'verbe',
  Auxiliary_verb: 'verbe auxiliaire',
  Adjective: 'adjectif',
  Adverb: 'adverbe',
  Pronoun: 'pronom',
  Preposition: 'préposition',
  Conjunction: 'conjonction',
  Determiner: 'déterminant',
  Article: 'article',
  Interjection: 'interjection',
};

const GENDER = { m: 'masculin', f: 'féminin' };

const TAGS = {
  Transitive: 'transitif',
  Intransitive: 'intransitif',
  Pronominal: 'pronominal',
  Formal: 'soutenu',
  Informal: 'familier',
  Slang: 'argot',
  Dated: 'vieilli',
  Literary: 'littéraire',
  Countable: 'dénombrable',
  Uncountable: 'indénombrable',
};

const humanize = (value) => value.replaceAll('_', ' ').toLowerCase();

export const posLabel = (pos) => POS[pos] ?? humanize(pos);
export const genderLabel = (gender) => GENDER[gender] ?? gender;
export const tagLabel = (tag) => TAGS[tag] ?? humanize(tag);
