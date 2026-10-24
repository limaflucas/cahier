import { fromPresentParticiple } from './derivations.js';

export default {
  id: 'gerondif',
  name: 'Gérondif',
  mood: 'Participes et gérondif',
  derivedFrom: fromPresentParticiple,
  summary: {
    fr: 'en + participe présent : simultanéité, manière, moyen ou condition — avec le même sujet que le verbe principal.',
    pt: 'en + particípio presente: simultaneidade, modo, meio ou condição — com o mesmo sujeito do verbo principal.',
  },
  formation: {
    rule: '**en** + **participe présent** : en parlant, en finissant, en prenant.',
    notes: [
      'Invariable. Avec un verbe pronominal, le pronom s\'accorde avec le sujet : en **me** levant, en **nous** levant (forme de base : en **se** levant).',
    ],
  },
  models: ['parler', 'finir', 'prendre'],
  uses: [
    {
      title: 'Simultanéité',
      examples: [
        { fr: 'Il chante **en prenant** sa douche.', pt: 'Ele canta enquanto toma banho.' },
        { fr: 'Ne parle pas **en mangeant** !', pt: 'Não fale de boca cheia!' },
      ],
    },
    {
      title: 'Manière, moyen',
      examples: [
        { fr: 'C\'est **en forgeant** qu\'on devient forgeron.', pt: 'É praticando que se aprende.' },
        { fr: 'Elle a appris l\'anglais **en regardant** des séries.', pt: 'Ela aprendeu inglês assistindo a séries.' },
      ],
    },
    {
      title: 'Condition',
      examples: [{ fr: '**En partant** maintenant, tu arriveras à l\'heure.', pt: 'Se sair agora, você chega na hora.' }],
    },
    {
      title: 'Cause',
      examples: [{ fr: 'Il s\'est blessé **en tombant** de vélo.', pt: 'Ele se machucou ao cair da bicicleta.' }],
    },
  ],
  advanced: [
    {
      title: '« Tout en » : simultanéité ou opposition',
      examples: [
        { fr: '**Tout en reconnaissant** ses qualités, je ne partage pas son avis.', pt: 'Embora reconheça as qualidades dele, não compartilho da opinião dele.' },
        { fr: 'Elle travaille **tout en écoutant** de la musique.', pt: 'Ela trabalha ouvindo música ao mesmo tempo.' },
      ],
    },
    {
      title: 'Le sujet doit être le même',
      text: 'Le gérondif renvoie toujours au sujet du verbe principal. Sinon, utilisez une subordonnée.',
      examples: [{ fr: 'Quand je suis sorti, la pluie a commencé. (et non « en sortant, la pluie a commencé »)', pt: 'Quando eu saí, começou a chover.' }],
    },
    {
      title: 'Gérondif ou participe présent ?',
      text: 'Le gérondif dit **quand / comment** à propos du sujet ; le participe présent décrit le **nom** qui le précède.',
      examples: [{ fr: 'J\'ai vu Paul **en sortant** du cinéma (c\'est moi qui sortais). / J\'ai vu Paul **sortant** du cinéma (c\'est Paul).', pt: 'Vi o Paul quando eu saía do cinema. / Vi o Paul saindo do cinema.' }],
    },
  ],
  pitfalls: [
    {
      title: 'Le gerúndio portugais n\'est pas toujours un gérondif',
      note: '"Estou fazendo" é presente simples ou être en train de; mas "saiu correndo" funciona: il est sorti en courant.',
      examples: [{ fr: 'Il est sorti **en courant**. / Je **suis en train de** lire.', pt: 'Ele saiu correndo. / Estou lendo.' }],
    },
  ],
  memory: [
    'Le gérondif répond à **« comment ? »** ou **« quand ? »** : en + -ant, et le sujet ne change pas.',
    'Proverbe-modèle : « C\'est **en forgeant** qu\'on devient forgeron. »',
  ],
};
