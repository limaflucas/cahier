import { fromFutureAndImparfait } from './derivations.js';

export default {
  id: 'conditionnel',
  name: 'Conditionnel présent',
  mood: 'Conditionnel',
  derivedFrom: fromFutureAndImparfait,
  summary: {
    fr: 'L\'hypothétique, l\'imaginaire, la politesse et l\'information non confirmée.',
    pt: 'O hipotético, o imaginário, a polidez e a informação não confirmada.',
  },
  formation: {
    rule: '**Radical du futur** + **terminaisons de l\'imparfait**.',
    endings: [{ label: null, forms: ['-ais', '-ais', '-ait', '-ions', '-iez', '-aient'] }],
    notes: ['Mêmes radicaux irréguliers qu\'au futur : je **ser**ais, j\'**aur**ais, j\'**ir**ais, je **fer**ais, je **pourr**ais, je **voudr**ais…'],
  },
  models: ['parler', 'finir', 'prendre'],
  uses: [
    {
      title: 'Hypothèse',
      text: '**Si** + imparfait → conditionnel présent.',
      examples: [
        { fr: 'Si j\'avais plus d\'argent, je **voyagerais** en Asie.', pt: 'Se eu tivesse mais dinheiro, viajaria pela Ásia.' },
        { fr: 'À ta place, je **refuserais**.', pt: 'No seu lugar, eu recusaria.' },
      ],
    },
    {
      title: 'Politesse',
      examples: [
        { fr: '**Pourriez**-vous m\'indiquer la gare ?', pt: 'O senhor poderia me indicar a estação?' },
        { fr: 'Je **voudrais** un café, s\'il vous plaît.', pt: 'Eu queria um café, por favor.' },
      ],
    },
    {
      title: 'Souhait, rêve, conseil',
      examples: [
        { fr: 'J\'**aimerais** tant vivre au bord de la mer.', pt: 'Eu adoraria morar à beira-mar.' },
        { fr: 'Tu **devrais** te reposer un peu.', pt: 'Você deveria descansar um pouco.' },
      ],
    },
    {
      title: 'Futur dans le passé',
      text: 'Au discours indirect passé, le futur devient conditionnel.',
      examples: [{ fr: 'Il m\'a promis qu\'il **viendrait**.', pt: 'Ele me prometeu que viria.' }],
    },
  ],
  advanced: [
    {
      title: 'Conditionnel journalistique',
      text: 'Il signale une information **non confirmée** : le journaliste ne la prend pas à son compte.',
      examples: [
        { fr: 'Le ministre **serait** sur le point de démissionner.', pt: 'O ministro estaria prestes a renunciar.' },
        { fr: 'Selon nos sources, l\'accord **prévoirait** une hausse des salaires.', pt: 'Segundo nossas fontes, o acordo preveria um aumento salarial.' },
      ],
    },
    {
      title: 'Au cas où, quand bien même + conditionnel',
      examples: [
        { fr: 'Prends un parapluie au cas où il **pleuvrait**.', pt: 'Leve um guarda-chuva caso chova.' },
        { fr: 'Quand bien même tu **insisterais**, je refuserais.', pt: 'Mesmo que você insistisse, eu recusaria.' },
      ],
    },
    {
      title: 'Hypothèse sans « si »',
      text: 'Deux conditionnels juxtaposés valent « même si ».',
      examples: [{ fr: 'Il **viendrait** me supplier, je ne **céderais** pas.', pt: 'Ainda que ele viesse me implorar, eu não cederia.' }],
    },
    {
      title: 'Imaginaire et indignation',
      examples: [
        { fr: 'On **dirait** que tu **serais** le roi et moi le dragon.', pt: 'Vamos fingir que você é o rei e eu, o dragão.' },
        { fr: 'Moi, je **mentirais** ? Jamais !', pt: 'Eu, mentir? Nunca!' },
      ],
    },
  ],
  pitfalls: [
    {
      title: 'Le conditionnel va dans la principale, jamais après « si »',
      examples: [{ fr: 'Si j\'**étais** toi, je **partirais**. (et non « si je serais »)', pt: 'Se eu fosse você, iria embora.' }],
    },
    {
      title: '« Se eu pudesse, eu viajava » → je voyagerais',
      note: 'No português falado o imperfeito substitui o futuro do pretérito; em francês, o conditionnel é obrigatório.',
      examples: [{ fr: 'Si je pouvais, je **voyagerais** tout le temps.', pt: 'Se eu pudesse, viajava o tempo todo.' }],
    },
    {
      title: '« Caso chova » → au cas où + conditionnel',
      note: 'Onde o português usa o subjuntivo, "au cas où" pede o conditionnel.',
      examples: [{ fr: 'Au cas où tu **aurais** besoin de moi, appelle-moi.', pt: 'Caso você precise de mim, me ligue.' }],
    },
  ],
  memory: [
    'Conditionnel = **futur + imparfait** : on garde le radical du futur (avec son r) et on met les terminaisons de l\'imparfait.',
    'Je parler**ai** (futur, une promesse) / je parler**ais** (conditionnel, un rêve) : le **s** ajoute du « si ».',
    'Les quatre politesses à savoir par cœur : je **voudrais**, j\'**aimerais**, **pourriez**-vous, **auriez**-vous.',
  ],
};
