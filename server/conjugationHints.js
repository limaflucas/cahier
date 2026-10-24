const PRONOMINAL_HINT = "Verbe pronominal : me, te, se, nous, vous, se devant le verbe (m', t', s' devant une voyelle).";
const AYER_HINT = '-ayer : y ou i devant un e muet (je paie ou je paye). Les deux orthographes sont acceptées.';
const DEFECTIVE_HINT = 'Verbe défectif : seules les personnes affichées existent.';
const IRREGULAR_PRESENT_HINT = 'Verbe très irrégulier au présent : à connaître par cœur.';

const SINGULAR_PATTERNS = [
  { je: 'ds', il: 'd', endings: '-ds, -ds, -d' },
  { je: 'cs', il: 'c', endings: '-cs, -cs, -c' },
  { je: 'x', il: 't', endings: '-x, -x, -t' },
  { je: 'e', il: 'e', endings: '-e, -es, -e' },
  { je: 's', il: 't', endings: '-s, -s, -t' },
];

const PAST_PARTICIPLE_ENDINGS = ['ert', 'is', 'it', 'û', 'u', 'i', 't', 's', 'é'];

const AUXILIARY_TENSE_NAMES = {
  passeCompose: 'au présent',
  plusQueParfait: "à l'imparfait",
  futurAnterieur: 'au futur simple',
  conditionnelPasse: 'au conditionnel présent',
  subjonctifPasse: 'au subjonctif présent',
};

const stemOf = (form, ending) => (form?.endsWith(ending) ? form.slice(0, -ending.length) : null);

export function conjugationGroup(infinitive, forms) {
  if (infinitive.endsWith('er') && infinitive !== 'aller') return 1;
  if (/[iï]r$/.test(infinitive) && /[iï]ssons$/.test(forms.P?.[3] ?? '')) return 2;
  return 3;
}

function doubledVowelHints(radical) {
  if (radical?.endsWith('i')) return ['Le radical finit par -i : nous …iions, vous …iiez (deux i).'];
  if (radical?.endsWith('y')) return ['Le radical finit par -y : nous …yions, vous …yiez (y puis i).'];
  return [];
}

function firstGroupPresentHints(infinitive, je) {
  const stem = infinitive.slice(0, -2);
  const hints = [`1er groupe : radical « ${stem}- » + -e, -es, -e, -ons, -ez, -ent.`];
  const muteStem = stemOf(je, 'e');
  if (muteStem && muteStem !== stem) {
    hints.push(`Devant une terminaison muette (je, tu, il, ils), le radical devient « ${muteStem}- ».`);
  }
  if (infinitive.endsWith('cer')) hints.push('-cer : c devient ç devant o pour garder le son [s] (nous …çons).');
  if (infinitive.endsWith('ger')) hints.push('-ger : on garde le e après le g devant o pour garder le son [ʒ] (nous …geons).');
  if (infinitive.endsWith('ayer')) hints.push(AYER_HINT);
  return hints;
}

function secondGroupPresentHints([je, , , nous]) {
  const radical = stemOf(nous, 'ssons');
  const hints = [`2e groupe : « ${radical}- » + -s, -s, -t au singulier, « ${radical}ss- » + -ons, -ez, -ent au pluriel.`];
  const singularStem = stemOf(je, 's');
  if (singularStem !== radical) hints.push(`Au singulier, le radical devient « ${singularStem}- ».`);
  return hints;
}

function thirdGroupPresentHints([je, , il, nous, vous, ils]) {
  const nousStem = stemOf(nous, 'ons');
  const ilsStem = stemOf(ils, 'ent');
  const pattern = SINGULAR_PATTERNS.find((candidate) => je.endsWith(candidate.je) && il?.endsWith(candidate.il));
  if (!nousStem || !ilsStem || !pattern) return [IRREGULAR_PRESENT_HINT];
  const hints = [
    `3e groupe : au singulier, terminaisons ${pattern.endings}.`,
    nousStem === ilsStem
      ? `Pluriel : radical « ${nousStem}- » + -ons, -ez, -ent.`
      : `Pluriel : radical « ${nousStem}- » pour nous et vous, « ${ilsStem}- » pour ils.`,
  ];
  if (vous && !vous.endsWith('ez')) hints.push('Attention : la forme de « vous » ne se termine pas en -ez.');
  return hints;
}

function presentHints({ infinitive, forms, group }) {
  const present = forms.P ?? [];
  if (!present[0]) return [DEFECTIVE_HINT];
  if (group === 1) return firstGroupPresentHints(infinitive, present[0]);
  if (group === 2) return secondGroupPresentHints(present);
  return thirdGroupPresentHints(present);
}

function imparfaitHints({ forms }) {
  const radical = stemOf(forms.I?.[2], 'ait');
  if (!radical) return [];
  const nousStem = stemOf(forms.P?.[3], 'ons');
  const hints = [];
  if (radical === nousStem) hints.push(`Radical de « nous » au présent, sans -ons : « ${radical}- ».`);
  else if (forms.P?.[3]) hints.push(`Exception : le radical est « ${radical}- », pas celui de « nous » au présent.`);
  else hints.push(`Radical : « ${radical}- ».`);
  const radicalBeforeI = stemOf(forms.I[3], 'ions');
  if (radicalBeforeI && radicalBeforeI !== radical) {
    hints.push(`Devant -ions et -iez, le radical redevient « ${radicalBeforeI}- ».`);
  }
  return [...hints, ...doubledVowelHints(radicalBeforeI ?? radical)];
}

function futurHints({ infinitive, forms, group }) {
  const radical = stemOf(forms.F?.[2], 'a');
  if (!radical) return [];
  const endsWithRe = infinitive.endsWith('re');
  const regularRadical = endsWithRe ? infinitive.slice(0, -1) : infinitive;
  const hints = [];
  if (radical === regularRadical) {
    hints.push(endsWithRe ? `Radical : l'infinitif sans le e final, « ${radical}- ».` : `Radical : l'infinitif entier, « ${radical}- ».`);
  } else if (group === 1 && radical === `${stemOf(forms.P?.[0], 'e')}er`) {
    hints.push(`Le radical garde le changement de « je » au présent : « ${radical}- ».`);
  } else {
    hints.push(`Radical irrégulier : « ${radical}- ».`);
  }
  if (infinitive.endsWith('ayer')) hints.push(AYER_HINT);
  return hints;
}

function conditionnelHints({ forms }) {
  const radical = stemOf(forms.C?.[2], 'ait');
  if (!radical) return [];
  return [
    `Radical du futur, « ${radical}- », + terminaisons de l'imparfait (-ais, -ais, -ait, -ions, -iez, -aient).`,
    'Ne confondez pas : je …rai (futur) et je …rais (conditionnel).',
  ];
}

function subjonctifHints({ forms }) {
  const subjonctif = forms.S ?? [];
  const radical = stemOf(subjonctif[2], 'e');
  const ilsStem = stemOf(forms.P?.[5], 'ent');
  const hints = [];
  if (!radical) hints.push('Subjonctif très irrégulier : à connaître par cœur.');
  else if (radical === ilsStem) hints.push(`je, tu, il, ils : radical de « ils » au présent, sans -ent : « ${radical}- ».`);
  else hints.push(`Radical irrégulier pour je, tu, il, ils : « ${radical}- ».`);

  const nousRadical = stemOf(subjonctif[3], 'ions');
  if (subjonctif[3] && subjonctif[3] === forms.I?.[3]) hints.push("nous, vous : mêmes formes qu'à l'imparfait.");
  else if (nousRadical) hints.push(`nous, vous : radical « ${nousRadical}- » + -ions, -iez.`);
  return [...hints, ...doubledVowelHints(nousRadical)];
}

function participePresentHints({ forms, pronominal }) {
  const radical = stemOf(forms.G?.[0], 'ant');
  if (!radical) return [];
  const hints = [];
  if (radical === stemOf(forms.P?.[3], 'ons')) hints.push(`Radical de « nous » au présent + -ant : « ${radical}- ».`);
  else if (forms.P?.[3]) hints.push(`Forme irrégulière : radical « ${radical}- » + -ant.`);
  else hints.push(`Radical « ${radical}- » + -ant.`);
  if (pronominal) hints.push("Verbe pronominal : se (s' devant une voyelle) avant le participe.");
  return hints;
}

function gerondifHints({ forms, pronominal }) {
  if (!forms.G?.[0]) return [];
  return [pronominal ? "en + se + participe présent (s' devant une voyelle)." : 'en + participe présent.'];
}

function participePasseHints({ forms, group }) {
  const participle = forms.K?.[0];
  if (!participle) return [];
  if (group === 1) return ['1er groupe : terminaison -é.'];
  if (group === 2) return ['2e groupe : terminaison -i.'];
  const ending = PAST_PARTICIPLE_ENDINGS.find((candidate) => participle.endsWith(candidate));
  const hints = [ending ? `3e groupe : participe en -${ending}.` : '3e groupe : participe irrégulier.'];
  if (/[st]$/.test(participle)) hints.push("La consonne finale est muette : pensez au féminin pour l'entendre.");
  return hints;
}

function compoundHints(tense, { pronominal, auxiliaries, invariable }) {
  const auxiliaryTense = AUXILIARY_TENSE_NAMES[tense];
  if (pronominal) {
    return [
      `Verbe pronominal : pronom réfléchi + être ${auxiliaryTense} + participe passé.`,
      invariable
        ? 'Participe passé invariable : le pronom réfléchi est complément indirect.'
        : "Le participe passé s'accorde avec le sujet (-e, -s, -es).",
    ];
  }
  if (auxiliaries.length > 1) {
    return [
      `Auxiliaire être ou avoir ${auxiliaryTense} + participe passé.`,
      "Être sans complément d'objet direct (accord avec le sujet), avoir avec un COD (pas d'accord). Les deux sont acceptés.",
    ];
  }
  if (auxiliaries[0] === 'être') {
    return [`Auxiliaire être ${auxiliaryTense} + participe passé.`, "Le participe passé s'accorde avec le sujet (-e, -s, -es)."];
  }
  return [`Auxiliaire avoir ${auxiliaryTense} + participe passé.`, "Pas d'accord avec le sujet."];
}

export function conjugationHints(verb) {
  const context = { ...verb, group: conjugationGroup(verb.infinitive, verb.forms) };
  const simpleTense = (hints) => (verb.pronominal ? [...hints, PRONOMINAL_HINT] : hints);
  return {
    participePresent: participePresentHints(context),
    gerondif: gerondifHints(context),
    participePasse: participePasseHints(context),
    present: simpleTense(presentHints(context)),
    imparfait: simpleTense(imparfaitHints(context)),
    futur: simpleTense(futurHints(context)),
    conditionnel: simpleTense(conditionnelHints(context)),
    subjonctif: simpleTense(subjonctifHints(context)),
    ...Object.fromEntries(Object.keys(AUXILIARY_TENSE_NAMES).map((tense) => [tense, compoundHints(tense, context)])),
  };
}
