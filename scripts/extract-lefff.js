import { readFileSync, writeFileSync } from 'node:fs';

const [source, target = 'server/data/lefff-verbs.json'] = process.argv.slice(2);
if (!source) {
  console.error('usage: node scripts/extract-lefff.js <french-verbs-lefff/dist/conjugations.json> [target]');
  process.exit(1);
}

const KEPT_TENSES = ['P', 'I', 'F', 'C', 'S', 'G', 'K'];

const participle = (ms, mp, fs, fp) => ({ K: [ms, mp, fs, fp] });
const invariableParticiple = (form) => participle(form, form, form, form);

const CORRECTIONS = {
  pouvoir: { P: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'] },
  taire: { P: ['tais', 'tais', 'tait', 'taisons', 'taisez', 'taisent'] },
  vêtir: { P: ['vêts', 'vêts', 'vêt', 'vêtons', 'vêtez', 'vêtent'] },
  dévêtir: { P: ['dévêts', 'dévêts', 'dévêt', 'dévêtons', 'dévêtez', 'dévêtent'] },
  revêtir: { P: ['revêts', 'revêts', 'revêt', 'revêtons', 'revêtez', 'revêtent'] },
  résoudre: participle('résolu', 'résolus', 'résolue', 'résolues'),
  devoir: participle('dû', 'dus', 'due', 'dues'),
  redevoir: participle('redû', 'redus', 'redue', 'redues'),
  mouvoir: participle('mû', 'mus', 'mue', 'mues'),
  croître: participle('crû', 'crus', 'crue', 'crues'),
  recroître: participle('recrû', 'recrus', 'recrue', 'recrues'),
  accroître: participle('accru', 'accrus', 'accrue', 'accrues'),
  décroître: participle('décru', 'décrus', 'décrue', 'décrues'),
  inclure: participle('inclus', 'inclus', 'incluse', 'incluses'),
  occlure: participle('occlus', 'occlus', 'occluse', 'occluses'),
  reclure: participle('reclus', 'reclus', 'recluse', 'recluses'),
  luire: invariableParticiple('lui'),
  reluire: invariableParticiple('relui'),
};

const present = (form) => (form && form !== 'NA' ? form : null);

const lefff = JSON.parse(readFileSync(source, 'utf8'));
const verbs = {};
for (const [verb, tenses] of Object.entries(lefff)) {
  const kept = {};
  for (const key of KEPT_TENSES) {
    if (tenses[key]) kept[key] = tenses[key].map(present);
  }
  verbs[verb] = { ...kept, ...CORRECTIONS[verb] };
}

writeFileSync(target, JSON.stringify(verbs));
console.log(`${Object.keys(verbs).length} verbs written to ${target}`);
