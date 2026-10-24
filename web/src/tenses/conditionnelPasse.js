import { compoundDerivation } from './derivations.js';

export default {
  id: 'conditionnelPasse',
  name: 'Conditionnel passé',
  mood: 'Conditionnel',
  derivedFrom: compoundDerivation('au conditionnel'),
  summary: {
    fr: 'L\'irréel du passé : ce qui aurait pu arriver mais n\'est pas arrivé, le regret, le reproche.',
    pt: 'O irreal do passado: o que poderia ter acontecido e não aconteceu, o arrependimento, a censura.',
  },
  formation: {
    rule: 'Auxiliaire **avoir** ou **être** au **conditionnel présent** + **participe passé**.',
    auxiliary: {
      avoir: ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'],
      être: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'],
    },
    notes: ['Mêmes règles d\'auxiliaire et d\'accord qu\'au passé composé.'],
  },
  models: ['parler', 'aller', 'se lever'],
  uses: [
    {
      title: 'Irréel du passé',
      text: '**Si** + plus-que-parfait → conditionnel passé.',
      examples: [
        { fr: 'Si j\'avais su, je ne **serais** pas **venu**.', pt: 'Se eu soubesse, não teria vindo.' },
        { fr: 'Sans ton aide, nous n\'**aurions** jamais **réussi**.', pt: 'Sem sua ajuda, nunca teríamos conseguido.' },
      ],
    },
    {
      title: 'Regret',
      examples: [{ fr: 'J\'**aurais aimé** te connaître plus tôt.', pt: 'Eu teria gostado de te conhecer antes.' }],
    },
    {
      title: 'Reproche',
      examples: [
        { fr: 'Tu **aurais dû** me le dire !', pt: 'Você deveria ter me contado!' },
        { fr: 'Vous **auriez pu** prévenir.', pt: 'Vocês poderiam ter avisado.' },
      ],
    },
    {
      title: 'Futur antérieur dans le passé',
      examples: [{ fr: 'Il m\'avait assuré qu\'il **aurait fini** avant midi.', pt: 'Ele tinha me garantido que teria terminado antes do meio-dia.' }],
    },
  ],
  advanced: [
    {
      title: 'Conditionnel passé journalistique',
      text: 'Un fait passé non confirmé.',
      examples: [{ fr: 'L\'incendie **aurait été provoqué** par un court-circuit.', pt: 'O incêndio teria sido provocado por um curto-circuito.' }],
    },
    {
      title: 'Hypothèses mixtes',
      text: 'Une condition passée peut avoir une conséquence présente, et inversement.',
      examples: [
        { fr: 'Si tu avais pris ce train, tu **serais** déjà là.', pt: 'Se você tivesse pegado aquele trem, já estaria aqui.' },
        { fr: 'Si j\'étais plus prudent, je n\'**aurais** pas **signé** ce contrat.', pt: 'Se eu fosse mais prudente, não teria assinado esse contrato.' },
      ],
    },
    {
      title: 'Forme littéraire',
      text: 'À l\'écrit soutenu, le plus-que-parfait du subjonctif peut remplacer le conditionnel passé : à reconnaître, pas à produire.',
      examples: [{ fr: 'Il **eût été** préférable de se taire.', pt: 'Teria sido preferível calar-se.' }],
    },
  ],
  pitfalls: [
    {
      title: '« Deveria ter dito » → aurais dû dire',
      note: 'Em francês, é o verbo "devoir" que vai para o conditionnel passé; o infinitivo fica simples.',
      examples: [{ fr: 'Tu **aurais dû** partir plus tôt. (et non « tu devrais avoir parti »)', pt: 'Você deveria ter saído mais cedo.' }],
    },
    {
      title: '« Se eu tivesse sabido, não vinha » → je ne serais pas venu',
      note: 'O imperfeito coloquial português não serve aqui: o francês exige o conditionnel passé.',
      examples: [{ fr: 'Si j\'avais su, je ne **serais** pas **venu**.', pt: 'Se eu tivesse sabido, não teria vindo.' }],
    },
  ],
  memory: [
    'Les trois reproches en or : j\'**aurais dû**, j\'**aurais pu**, j\'**aurais voulu**.',
    '« Si j\'avais su, j\'aurais… » : deux temps composés qui se répondent (plus-que-parfait → conditionnel passé).',
  ],
};
