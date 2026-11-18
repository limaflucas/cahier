import { f } from './forms.js';

export default {
  id: 'demonstratifs',
  name: 'Pronoms démonstratifs',
  label: 'Démonstratif',
  hue: 2,
  chapter: 1330,
  summary: {
    fr: "Ils reprennent un nom déjà cité. Jamais seuls : suivis de -ci / -là, de « de » ou d'un relatif.",
    pt: 'Retomam um substantivo já citado. Nunca sozinhos: seguidos de -ci / -là, de « de » ou de um relativo.',
  },
  forms: {
    columns: ['masc. sing.', 'fém. sing.', 'masc. plur.', 'fém. plur.'],
    rows: [
      { label: '+ de, qui, que…', cells: [[f('celui')], [f('celle')], [f('ceux')], [f('celles')]] },
      { label: 'proche', cells: [[f('celui-ci')], [f('celle-ci')], [f('ceux-ci')], [f('celles-ci')]] },
      { label: 'éloigné', cells: [[f('celui-là')], [f('celle-là')], [f('ceux-là')], [f('celles-là')]] },
    ],
  },
  uses: [
    {
      title: '+ de : à qui est la chose',
      examples: [
        { fr: "Ce n'est pas mon vélo, c'est **celui de** mon frère.", pt: 'Não é a minha bicicleta, é a do meu irmão.' },
        { fr: 'Tes idées sont meilleures que **celles de** Marc.', pt: 'Suas ideias são melhores que as do Marc.' },
      ],
    },
    {
      title: '+ qui, que, dont : préciser lequel',
      examples: [
        { fr: 'Prends **celle qui** est sur la table.', pt: 'Pega a que está na mesa.' },
        { fr: "**Ceux que** j'ai lus étaient excellents.", pt: 'Os que eu li eram excelentes.' },
      ],
    },
    {
      title: '-ci et -là : choisir',
      text: "-ci désigne le plus proche, -là le plus éloigné ; à l'oral, -là s'emploie presque partout.",
      examples: [{ fr: 'Quelle robe préfères-tu, **celle-ci** ou **celle-là** ?', pt: 'Qual vestido você prefere, este ou aquele?' }],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
