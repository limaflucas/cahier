import { normalize } from './dictionary.js';
import { spellings, startsWithVowelSound } from './frenchSpelling.js';
import { conjugationHints } from './conjugationHints.js';

const SIMPLE_TENSES = { present: 'P', imparfait: 'I', passeSimple: 'J', futur: 'F', conditionnel: 'C', subjonctif: 'S' };
const COMPOUND_TENSES = {
  passeCompose: 'present',
  plusQueParfait: 'imparfait',
  futurAnterieur: 'futur',
  conditionnelPasse: 'conditionnel',
  subjonctifPasse: 'subjonctif',
};
const SUBJUNCTIVE_TENSES = new Set(['subjonctif', 'subjonctifPasse']);

const PERSONS = [0, 1, 2, 3, 4, 5];
const SUBJECTS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const IMPERSONAL_SUBJECTS = { 2: 'il', 5: 'ils' };
const REFLEXIVES = ['me', 'te', 'se', 'nous', 'vous', 'se'];
const ELIDED_REFLEXIVES = { me: "m'", te: "t'", se: "s'" };

const ETRE_VERBS = new Set([
  'advenir', 'aller', 'apparaître', 'arriver', 'décéder', 'devenir', 'intervenir', 'mourir', 'naître', 'partir',
  'parvenir', 'redevenir', 'renaître', 'repartir', 'rester', 'retomber', 'revenir', 'survenir', 'tomber', 'venir',
]);
const ETRE_OR_AVOIR_VERBS = new Set([
  'descendre', 'entrer', 'monter', 'passer', 'redescendre', 'remonter', 'rentrer', 'repasser', 'ressortir',
  'retourner', 'sortir',
]);
const INVARIABLE_WHEN_PRONOMINAL = new Set([
  'complaire', 'convenir', 'déplaire', 'mentir', 'nuire', 'parler', 'plaire', 'ressembler', 'rire', 'sourire',
  'succéder', 'suffire', 'téléphoner',
]);

const PRONOMINAL_INPUT = /^(?:se |s')(.+)$/;

export function parseVerb(input) {
  const text = normalize(input).replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
  const match = text.match(PRONOMINAL_INPUT);
  return match ? { infinitive: match[1].trim(), pronominal: true } : { infinitive: text, pronominal: false };
}

const unique = (items) => [...new Set(items)];

const mapValues = (object, fn) => Object.fromEntries(Object.entries(object).map(([key, value]) => [key, fn(value, key)]));

function withReflexive(person, form, infinitive) {
  const pronoun = REFLEXIVES[person];
  const elided = ELIDED_REFLEXIVES[pronoun];
  return elided && startsWithVowelSound(form, infinitive) ? elided + form : `${pronoun} ${form}`;
}

function auxiliariesOf(infinitive, pronominal) {
  if (pronominal || ETRE_VERBS.has(infinitive)) return ['être'];
  if (ETRE_OR_AVOIR_VERBS.has(infinitive)) return ['être', 'avoir'];
  return ['avoir'];
}

function participlesAgreeingWith(person, [masculine, masculinePlural, feminine, femininePlural]) {
  if (person === 4) return [masculinePlural, femininePlural, masculine, feminine];
  return person > 2 ? [masculinePlural, femininePlural] : [masculine, feminine];
}

function subjectOf(verb, tense, person, canonicalAnswer) {
  if (verb.impersonal) return IMPERSONAL_SUBJECTS[person];
  if (person > 0) return SUBJECTS[person];
  if (tense in COMPOUND_TENSES && !verb.pronominal) return "je/j'";
  return startsWithVowelSound(canonicalAnswer, verb.infinitive) ? "j'" : 'je';
}

function subjectLabel(verb, tense, person, canonicalAnswer) {
  const subject = subjectOf(verb, tense, person, canonicalAnswer);
  if (!SUBJUNCTIVE_TENSES.has(tense)) return subject;
  return subject.startsWith('i') ? `qu'${subject}` : `que ${subject}`;
}

function pronominalized(verb, person, forms) {
  return verb.pronominal ? forms.map((form) => withReflexive(person, form, verb.infinitive)) : forms;
}

/**
 * A form framed by ne … pas, ne elided before a vowel sound.
 * @param {string} form the conjugated verb, or the auxiliary of a compound form, with its reflexive pronoun
 * @param {string} infinitive the infinitive of the form, which tells a silent h from an aspirated one
 * @param {string} [participle] the past participle that follows pas in a compound form
 * @returns {string}
 */
function negated(form, infinitive, participle) {
  const ne = startsWithVowelSound(form, infinitive) ? "n'" : 'ne ';
  return participle ? `${ne}${form} pas ${participle}` : `${ne}${form} pas`;
}

/**
 * The six cells of a simple tense, null where the verb has no form.
 * @param {object} verb the described verb
 * @param {string} tense
 * @returns {({ label: string, answers: string[], negative: string } | null)[]}
 */
function simpleCells(verb, tense) {
  const key = SIMPLE_TENSES[tense];
  return PERSONS.map((person) => {
    const alternatives = verb.spelled[key]?.[person];
    if (!alternatives) return null;
    const answers = pronominalized(verb, person, alternatives);
    return { label: subjectLabel(verb, tense, person, answers[0]), answers, negative: negated(answers[0], verb.infinitive) };
  });
}

/**
 * The six cells of a compound tense, with every auxiliary and agreement the verb accepts; the negative is the first answer's.
 * @param {Record<string, object>} verbs the Lefff forms, by infinitive
 * @param {object} verb the described verb
 * @param {string} tense
 * @returns {({ label: string, answers: string[], negative: string } | null)[]}
 */
function compoundCells(verbs, verb, tense) {
  const auxiliaryKey = SIMPLE_TENSES[COMPOUND_TENSES[tense]];
  const participles = verb.forms.K;
  return PERSONS.map((person) => {
    if (!participles?.[0] || !verb.spelled.P?.[person]) return null;
    const compounds = verb.auxiliaries.flatMap((auxiliary) => {
      const auxiliaryForm = verbs[auxiliary][auxiliaryKey][person];
      const conjugated = verb.pronominal ? withReflexive(person, auxiliaryForm, auxiliary) : auxiliaryForm;
      const agrees = auxiliary === 'être' && !verb.invariable;
      const forms = agrees ? participlesAgreeingWith(person, participles) : [participles[0]];
      return forms.filter(Boolean).map((participle) => ({ auxiliary, conjugated, participle }));
    });
    const answers = unique(compounds.map(({ conjugated, participle }) => `${conjugated} ${participle}`));
    const [first] = compounds;
    return {
      label: subjectLabel(verb, tense, person, answers[0]),
      answers,
      negative: negated(first.conjugated, first.auxiliary, first.participle),
    };
  });
}

/**
 * The one cell of a non-finite form, or null when the verb has none.
 * @param {string[] | null} answers
 * @param {string | null} negative
 * @returns {({ label: null, answers: string[], negative: string } | null)[]}
 */
const singleCell = (answers, negative) => [answers ? { label: null, answers, negative } : null];

/**
 * The participles and the gérondif. The participe passé's negative is the compound participle's: n'ayant pas parlé.
 * @param {Record<string, object>} verbs the Lefff forms, by infinitive
 * @param {object} verb the described verb
 * @returns {Record<'participePresent' | 'gerondif' | 'participePasse', ({ label: null, answers: string[], negative: string } | null)[]>}
 */
function nonFiniteCells(verbs, verb) {
  const presentParticiple = verb.spelled.G?.[0];
  const presentParticiples = presentParticiple ? pronominalized(verb, 2, presentParticiple) : null;
  const negativeParticiple = presentParticiples && negated(presentParticiples[0], verb.infinitive);
  const pastParticiple = verb.forms.K?.[0];
  const [auxiliary] = verb.auxiliaries;
  const [auxiliaryParticiple] = pronominalized(verb, 2, verbs[auxiliary].G);
  return {
    participePresent: singleCell(presentParticiples, negativeParticiple),
    gerondif: singleCell(presentParticiples?.map((form) => `en ${form}`), negativeParticiple && `en ${negativeParticiple}`),
    participePasse: singleCell(
      pastParticiple ? [pastParticiple] : null,
      pastParticiple && negated(auxiliaryParticiple, auxiliary, pastParticiple),
    ),
  };
}

function describeVerb(data, { infinitive, pronominal }) {
  const spelled = mapValues(data, (forms, key) =>
    forms.map((form, index) => (form ? spellings(infinitive, key, index, form) : null)),
  );
  return {
    infinitive,
    pronominal,
    spelled,
    forms: mapValues(spelled, (alternatives) => alternatives.map((options) => options?.[0] ?? null)),
    auxiliaries: auxiliariesOf(infinitive, pronominal),
    invariable: pronominal && INVARIABLE_WHEN_PRONOMINAL.has(infinitive),
    impersonal: Boolean(data.P) && PERSONS.every((person) => !data.P[person] || person in IMPERSONAL_SUBJECTS),
  };
}

/**
 * The conjugation board of a verb: every tense's cells, with their hints.
 * @param {Record<string, object>} verbs the Lefff forms, by infinitive
 * @param {{ infinitive: string, pronominal: boolean }} parsed
 * @returns {{ verb: string, auxiliary: string, tenses: Record<string, { cells: object[], hints: object[] }> }}
 */
function buildBoard(verbs, parsed) {
  const verb = describeVerb(verbs[parsed.infinitive], parsed);
  const cells = {
    ...nonFiniteCells(verbs, verb),
    ...mapValues(SIMPLE_TENSES, (_key, tense) => simpleCells(verb, tense)),
    ...mapValues(COMPOUND_TENSES, (_auxiliaryTense, tense) => compoundCells(verbs, verb, tense)),
  };
  const hints = conjugationHints(verb);
  return {
    verb: verb.pronominal ? withReflexive(2, verb.infinitive, verb.infinitive) : verb.infinitive,
    auxiliary: verb.auxiliaries.join(' ou '),
    tenses: mapValues(cells, (tenseCells, tense) => ({ cells: tenseCells, hints: hints[tense] ?? [] })),
  };
}

export function createConjugator(verbs) {
  const isVerb = (input) => Object.hasOwn(verbs, parseVerb(input).infinitive);
  return {
    isVerb,
    forms(input) {
      const { infinitive } = parseVerb(input);
      return isVerb(infinitive) ? unique([infinitive, ...Object.values(verbs[infinitive]).flat().filter(Boolean)]) : [];
    },
    board: (input) => (isVerb(input) ? buildBoard(verbs, parseVerb(input)) : null),
  };
}
