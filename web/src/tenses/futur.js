import { fromInfinitive } from './derivations.js';

export default {
  id: 'futur',
  name: 'Futur simple',
  mood: 'Indicatif',
  derivedFrom: fromInfinitive,
  summary: {
    fr: 'Ce qui arrivera : projets, prévisions, promesses.',
    pt: 'O que vai acontecer: planos, previsões, promessas.',
  },
  formation: {
    rule: '**Infinitif** (sans le -e final des verbes en -re) + terminaisons.',
    endings: [{ label: null, forms: ['-ai', '-as', '-a', '-ons', '-ez', '-ont'] }],
    notes: [
      'Les terminaisons sont celles du **présent d\'avoir** : (j\')ai, (tu) as, (il) a, (nous av)ons, (vous av)ez, (ils) ont.',
      'Le radical finit toujours par **-r** : pas de r, pas de futur.',
      'Radicaux irréguliers : être → **ser-**, avoir → **aur-**, aller → **ir-**, faire → **fer-**, savoir → **saur-**, venir → **viendr-**, voir → **verr-**, pouvoir → **pourr-**, vouloir → **voudr-**, devoir → **devr-**, falloir → **faudr-**, envoyer → **enverr-**.',
    ],
  },
  models: ['parler', 'finir', 'prendre'],
  uses: [
    {
      title: 'Projet, prévision',
      examples: [
        { fr: 'L\'année prochaine, je **passerai** le DALF C1.', pt: 'No ano que vem, vou fazer o DALF C1.' },
        { fr: 'Demain, il **pleuvra** sur toute la Bretagne.', pt: 'Amanhã vai chover em toda a Bretanha.' },
      ],
    },
    {
      title: 'Promesse, engagement',
      examples: [{ fr: 'Je te le **rendrai** lundi, promis.', pt: 'Eu te devolvo na segunda, prometo.' }],
    },
    {
      title: 'Consigne, ordre poli',
      examples: [{ fr: 'Vous **remettrez** le dossier avant vendredi.', pt: 'Entreguem o dossiê até sexta-feira.' }],
    },
    {
      title: 'Conséquence d\'une condition',
      text: '**Si** + présent → futur.',
      examples: [{ fr: 'Si tu t\'entraînes, tu **réussiras**.', pt: 'Se você treinar, vai conseguir.' }],
    },
  ],
  advanced: [
    {
      title: 'Après quand, lorsque, dès que, aussitôt que, tant que',
      text: 'Pour une action future, ces conjonctions exigent le **futur**, jamais le présent.',
      examples: [
        { fr: 'Quand tu **seras** grand, tu comprendras.', pt: 'Quando você crescer, vai entender.' },
        { fr: 'Je t\'appellerai dès que j\'**arriverai**.', pt: 'Eu te ligo assim que chegar.' },
      ],
    },
    {
      title: 'Futur d\'atténuation',
      text: 'Dans la langue formelle, le futur adoucit une demande.',
      examples: [{ fr: 'Je vous **demanderai** de bien vouloir patienter.', pt: 'Peço que tenham a gentileza de aguardar.' }],
    },
    {
      title: 'Futur historique',
      text: 'Dans un récit au présent, il annonce ce qui viendra plus tard.',
      examples: [{ fr: 'Napoléon naît en 1769 ; il **deviendra** empereur en 1804.', pt: 'Napoleão nasce em 1769; vai se tornar imperador em 1804.' }],
    },
    {
      title: 'Futur simple ou futur proche ?',
      text: 'Le **futur proche** (aller + infinitif) est lié au présent, imminent ou déjà décidé ; le **futur simple** est plus détaché, plus formel.',
      examples: [
        { fr: 'Attention, tu **vas tomber** !', pt: 'Cuidado, você vai cair!' },
        { fr: 'Un jour, tu **tomberas** amoureux.', pt: 'Um dia, você vai se apaixonar.' },
      ],
    },
  ],
  pitfalls: [
    {
      title: '« Quando eu tiver tempo » → quand + futur',
      note: 'O futuro do subjuntivo português vira futur simple depois de quand, lorsque, dès que.',
      examples: [{ fr: 'Quand j\'**aurai** le temps, je t\'écrirai. (et non « quand j\'ai le temps »)', pt: 'Quando eu tiver tempo, te escrevo.' }],
    },
    {
      title: 'Jamais de futur après le « si » de condition',
      examples: [{ fr: 'Si tu **viens**, on **ira** au cinéma. (et non « si tu viendras »)', pt: 'Se você vier, a gente vai ao cinema.' }],
    },
    {
      title: 'Futur ou conditionnel ?',
      text: '« Je parlerai » et « je parlerais » se prononcent souvent pareil : c\'est le sens qui choisit.',
      examples: [{ fr: 'Demain, je lui **parlerai**. / Si je pouvais, je lui **parlerais**.', pt: 'Amanhã falo com ele. / Se eu pudesse, falaria com ele.' }],
    },
  ],
  memory: [
    'Futur = **infinitif + avoir** : parler-**ai**, parler-**as**, parler-**a**… le latin disait « j\'ai à parler ».',
    'Irréguliers en **-rr-** : verrai, enverrai, pourrai, courrai, mourrai, acquerrai.',
    'Irréguliers en **-dr-** : viendrai, tiendrai, voudrai, faudra, vaudrai. En **-vr-** : devrai, recevrai, pleuvra.',
    'Les solitaires : **ser**ai, **aur**ai, **saur**ai, **ir**ai, **fer**ai.',
  ],
};
