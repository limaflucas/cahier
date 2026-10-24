import { compoundDerivation } from './derivations.js';

export default {
  id: 'futurAnterieur',
  name: 'Futur antérieur',
  mood: 'Indicatif',
  derivedFrom: compoundDerivation('au futur'),
  summary: {
    fr: 'Une action future qui sera achevée avant une autre action future ou avant un moment donné.',
    pt: 'Uma ação futura que estará concluída antes de outra ação futura ou de um momento dado.',
  },
  formation: {
    rule: 'Auxiliaire **avoir** ou **être** au **futur simple** + **participe passé**.',
    auxiliary: {
      avoir: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
      être: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
    },
    notes: ['Mêmes règles d\'auxiliaire et d\'accord qu\'au passé composé.'],
  },
  models: ['parler', 'aller', 'se lever'],
  uses: [
    {
      title: 'Antériorité dans le futur',
      text: 'De deux actions futures, celle qui se termine **en premier** prend le futur antérieur.',
      examples: [
        { fr: 'Quand tu **auras fini**, tu pourras sortir.', pt: 'Quando você terminar, vai poder sair.' },
        { fr: 'Dès qu\'il **sera arrivé**, nous passerons à table.', pt: 'Assim que ele chegar, vamos para a mesa.' },
      ],
    },
    {
      title: 'Action achevée à une date future',
      examples: [{ fr: 'D\'ici juin, j\'**aurai terminé** ma thèse.', pt: 'Até junho, terei terminado minha tese.' }],
    },
  ],
  advanced: [
    {
      title: 'Futur antérieur de probabilité',
      text: 'Une supposition sur un fait **passé**, sans certitude.',
      examples: [
        { fr: 'Il n\'est pas là ? Il **aura oublié** le rendez-vous.', pt: 'Ele não está? Deve ter esquecido o compromisso.' },
        { fr: 'Le colis n\'est pas arrivé : il **se sera perdu**.', pt: 'O pacote não chegou: deve ter se perdido.' },
      ],
    },
    {
      title: 'Bilan anticipé',
      text: 'Fréquent dans la presse et les discours pour juger un fait du point de vue de l\'avenir.',
      examples: [{ fr: 'Cette réforme **aura marqué** tout le quinquennat.', pt: 'Essa reforma terá marcado todo o mandato.' }],
    },
    {
      title: 'Au discours indirect passé, il devient conditionnel passé',
      examples: [{ fr: 'Il a promis qu\'il **aurait fini** avant midi.', pt: 'Ele prometeu que teria terminado antes do meio-dia.' }],
    },
  ],
  pitfalls: [
    {
      title: '« Quando eu terminar » → quand j\'aurai fini',
      note: 'O português aceita o futuro do subjuntivo simples; o francês exige o futur antérieur para marcar o que termina antes.',
      examples: [{ fr: 'Quand j\'**aurai terminé**, je t\'appellerai.', pt: 'Quando eu terminar, te ligo.' }],
    },
    {
      title: '« Deve ter esquecido » → il aura oublié',
      note: 'O "dever + infinitivo passado" de suposição tem um equivalente elegante: o futur antérieur.',
      examples: [{ fr: 'Elle **aura raté** son train. (= elle a sans doute raté son train)', pt: 'Ela deve ter perdido o trem.' }],
    },
  ],
  memory: [
    'Futur antérieur = **futur de l\'auxiliaire** + participe : j\'**aurai** fini, je **serai** parti.',
    '« Quand j\'**aurai fini**, je **partirai** » : la première étape prend le composé, la seconde le simple.',
    '« Il **aura oublié** » = « il a sans doute oublié » : le futur antérieur sert aussi à deviner.',
  ],
};
