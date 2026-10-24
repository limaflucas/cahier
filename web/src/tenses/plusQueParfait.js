import { compoundDerivation } from './derivations.js';

export default {
  id: 'plusQueParfait',
  name: 'Plus-que-parfait',
  mood: 'Indicatif',
  derivedFrom: compoundDerivation('à l\'imparfait'),
  summary: {
    fr: 'Le passé du passé : une action antérieure à une autre action passée.',
    pt: 'O passado do passado: uma ação anterior a outra ação passada.',
  },
  formation: {
    rule: 'Auxiliaire **avoir** ou **être** à l\'**imparfait** + **participe passé**.',
    auxiliary: {
      avoir: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
      être: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
    },
    notes: ['Mêmes règles d\'auxiliaire et d\'accord qu\'au passé composé.'],
  },
  models: ['parler', 'aller', 'se lever'],
  uses: [
    {
      title: 'Antériorité dans le passé',
      examples: [
        { fr: 'Quand je suis arrivé, le train **était** déjà **parti**.', pt: 'Quando cheguei, o trem já tinha partido.' },
        { fr: 'Elle a retrouvé le livre qu\'elle **avait perdu**.', pt: 'Ela encontrou o livro que tinha perdido.' },
      ],
    },
    {
      title: 'Discours indirect au passé',
      text: 'Un passé composé rapporté après un verbe au passé devient plus-que-parfait.',
      examples: [{ fr: 'Il m\'a avoué qu\'il **avait menti**.', pt: 'Ele me confessou que tinha mentido.' }],
    },
    {
      title: 'Irréel du passé',
      text: '**Si** + plus-que-parfait → conditionnel passé.',
      examples: [{ fr: 'Si tu m\'**avais prévenu**, je serais venu.', pt: 'Se você tivesse me avisado, eu teria vindo.' }],
    },
    {
      title: 'Regret avec « si seulement »',
      examples: [{ fr: 'Si seulement je t\'**avais écouté** !', pt: 'Se ao menos eu tivesse te escutado!' }],
    },
  ],
  advanced: [
    {
      title: 'Plus-que-parfait de politesse',
      text: 'Comme l\'imparfait, il adoucit une demande.',
      examples: [{ fr: 'J\'**étais venu** vous demander un conseil.', pt: 'Eu tinha vindo pedir um conselho ao senhor.' }],
    },
    {
      title: 'Antériorité dans une habitude',
      text: 'Avec dès que, quand, une fois que + imparfait dans la principale.',
      examples: [{ fr: 'Dès qu\'il **avait fini** son travail, il allait courir.', pt: 'Assim que terminava o trabalho, ele ia correr.' }],
    },
    {
      title: 'Concordance des temps',
      examples: [{ fr: 'Elle croyait que nous **étions partis** sans elle.', pt: 'Ela achava que a gente tinha ido embora sem ela.' }],
    },
  ],
  pitfalls: [
    {
      title: 'Le portugais oral simplifie, le français non',
      note: 'No português falado, "ele disse que já comeu" é comum; em francês, a anterioridade exige o plus-que-parfait.',
      examples: [{ fr: 'Il a dit qu\'il **avait** déjà **mangé**.', pt: 'Ele disse que já tinha comido.' }],
    },
    {
      title: 'Jamais de conditionnel après « si »',
      examples: [{ fr: 'Si j\'**avais su**… (et non « si j\'aurais su »)', pt: 'Se eu soubesse… / Se eu tivesse sabido…' }],
    },
  ],
  memory: [
    'Plus-que-parfait = **imparfait de l\'auxiliaire** + participe : c\'est « l\'imparfait composé ».',
    'Sur la ligne du temps : **plus-que-parfait ← passé composé ← maintenant**.',
    'La phrase-modèle de l\'irréel du passé : « **Si j\'avais su, je ne serais pas venu.** »',
  ],
};
