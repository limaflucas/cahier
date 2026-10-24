import { compoundDerivation } from './derivations.js';

export default {
  id: 'subjonctifPasse',
  name: 'Subjonctif passé',
  mood: 'Subjonctif',
  derivedFrom: compoundDerivation('au subjonctif'),
  summary: {
    fr: 'Le subjonctif d\'une action achevée, antérieure au verbe principal ou à un moment futur.',
    pt: 'O subjuntivo de uma ação concluída, anterior ao verbo principal ou a um momento futuro.',
  },
  formation: {
    rule: 'Auxiliaire **avoir** ou **être** au **subjonctif présent** + **participe passé**.',
    auxiliary: {
      avoir: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
      être: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
    },
    notes: [
      'Mêmes déclencheurs que le subjonctif présent ; on choisit le passé quand l\'action est **déjà terminée**.',
      'Attention à l\'orthographe : que j\'ai**e**, qu\'il ai**t** (et non « que j\'ai »).',
    ],
  },
  models: ['parler', 'aller', 'se lever'],
  uses: [
    {
      title: 'Sentiment sur un fait passé',
      examples: [
        { fr: 'Je suis content que tu **aies réussi** ton examen.', pt: 'Estou feliz que você tenha passado no exame.' },
        { fr: 'C\'est dommage qu\'elle **soit partie** si tôt.', pt: 'É uma pena que ela tenha ido embora tão cedo.' },
      ],
    },
    {
      title: 'Doute sur le passé',
      examples: [{ fr: 'Je doute qu\'il **ait compris** la question.', pt: 'Duvido que ele tenha entendido a pergunta.' }],
    },
    {
      title: 'Action achevée avant un moment futur',
      examples: [{ fr: 'Il faut que tu **aies fini** avant 18 heures.', pt: 'Você precisa ter terminado antes das 18 horas.' }],
    },
    {
      title: 'Après bien que, avant que, sans que, jusqu\'à ce que',
      examples: [{ fr: 'Bien qu\'elle **soit partie** tôt, elle est arrivée en retard.', pt: 'Embora tenha saído cedo, ela chegou atrasada.' }],
    },
  ],
  advanced: [
    {
      title: 'Superlatif et « le seul » au passé',
      examples: [
        { fr: 'C\'est le plus beau voyage que j\'**aie** jamais **fait**.', pt: 'É a viagem mais bonita que eu já fiz.' },
        { fr: 'C\'est la seule personne qui m\'**ait** vraiment **aidé**.', pt: 'É a única pessoa que realmente me ajudou.' },
      ],
    },
    {
      title: 'Concordance dans la langue actuelle',
      text: 'Même après un verbe au passé, on emploie le subjonctif présent ou passé. L\'imparfait et le plus-que-parfait du subjonctif (qu\'il **vînt**, qu\'il **fût venu**) sont littéraires : à reconnaître seulement.',
      examples: [{ fr: 'Je voulais qu\'il **vienne**. / Je regrettais qu\'il ne **soit** pas **venu**.', pt: 'Eu queria que ele viesse. / Eu lamentava que ele não tivesse vindo.' }],
    },
    {
      title: 'Opinion niée sur le passé',
      examples: [{ fr: 'Je ne crois pas qu\'ils **aient reçu** ma lettre.', pt: 'Não acredito que eles tenham recebido minha carta.' }],
    },
  ],
  pitfalls: [
    {
      title: '« Embora tivesse saído » → bien qu\'elle soit sortie',
      note: 'O imperfeito e o mais-que-perfeito do subjuntivo portugueses viram, na língua corrente, subjonctif présent ou passé.',
      examples: [{ fr: 'Bien qu\'il **soit arrivé** en avance, il a attendu.', pt: 'Embora tivesse chegado adiantado, ele esperou.' }],
    },
    {
      title: 'Ne confondez pas « ai » et « aie »',
      examples: [{ fr: 'J\'**ai** fini. / Il faut que j\'**aie** fini.', pt: 'Terminei. / É preciso que eu tenha terminado.' }],
    },
  ],
  memory: [
    'Subjonctif passé = **subjonctif d\'avoir ou d\'être** + participe : que j\'**aie** fini, que je **sois** parti.',
    'Le présent regarde une action **en cours ou à venir**, le passé une action **déjà terminée** : « je suis content que tu **viennes** / que tu **sois venu** ».',
  ],
};
