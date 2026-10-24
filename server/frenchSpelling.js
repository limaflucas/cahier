const H_ASPIRE_VERBS = new Set([
  'hacher', 'hachurer', 'haïr', 'haler', 'hâler', 'haleter', 'handicaper', 'hanter', 'happer', 'harasser',
  'harceler', 'harnacher', 'harponner', 'hasarder', 'hâter', 'hausser', 'héler', 'hennir', 'hérisser',
  'heurter', 'hiérarchiser', 'hisser', 'hocher', 'honnir', 'hoqueter', 'houspiller', 'huer', 'hululer', 'hurler',
]);

const VOWEL_START = /^[aàâäeéèêëiîïoôöuùûüyœæ]/;

export function startsWithVowelSound(form, infinitive) {
  if (VOWEL_START.test(form)) return true;
  return form.startsWith('h') && !H_ASPIRE_VERBS.has(infinitive);
}

const ASSEOIR_WITH_IE = {
  P: ['assieds', 'assieds', 'assied', 'asseyons', 'asseyez', 'asseyent'],
  I: ['asseyais', 'asseyais', 'asseyait', 'asseyions', 'asseyiez', 'asseyaient'],
  F: ['assiérai', 'assiéras', 'assiéra', 'assiérons', 'assiérez', 'assiéront'],
  C: ['assiérais', 'assiérais', 'assiérait', 'assiérions', 'assiériez', 'assiéraient'],
  S: ['asseye', 'asseyes', 'asseye', 'asseyions', 'asseyiez', 'asseyent'],
  G: ['asseyant'],
};

const withPrefix = (prefix, tenses) =>
  Object.fromEntries(Object.entries(tenses).map(([key, forms]) => [key, forms.map((form) => prefix + form)]));

const PREFERRED_FORMS = {
  asseoir: ASSEOIR_WITH_IE,
  rasseoir: withPrefix('r', ASSEOIR_WITH_IE),
};

const LITERARY_FORMS = {
  pouvoir: { P: [['puis']] },
};

const MUTE_E_AFTER_AY = /ay(?=e(?:s|nt|r\w*)?$)/;
const ACUTE_BEFORE_LAST_SYLLABLE = /é([^aeiouyéèêë]+er)$/;

function rectifiedFuture(infinitive, key, form) {
  if ((key !== 'F' && key !== 'C') || !ACUTE_BEFORE_LAST_SYLLABLE.test(infinitive) || !form.startsWith(infinitive)) {
    return null;
  }
  return infinitive.replace(ACUTE_BEFORE_LAST_SYLLABLE, 'è$1') + form.slice(infinitive.length);
}

export function spellings(infinitive, key, index, form) {
  const iBeforeMuteE = infinitive.endsWith('ayer') && MUTE_E_AFTER_AY.test(form) ? form.replace(MUTE_E_AFTER_AY, 'ai') : null;
  const candidates = [
    PREFERRED_FORMS[infinitive]?.[key]?.[index],
    iBeforeMuteE,
    form,
    rectifiedFuture(infinitive, key, form),
    ...(LITERARY_FORMS[infinitive]?.[key]?.[index] ?? []),
  ];
  return [...new Set(candidates.filter(Boolean))];
}
