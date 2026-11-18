import { PERSONS, f } from './forms.js';

export default {
  id: 'possessifs',
  name: 'Pronoms possessifs',
  label: 'Possessif',
  hue: 140,
  chapter: 875,
  summary: {
    fr: "Ils remplacent un nom précédé d'un possessif : mon livre → le mien. Ils s'accordent avec la chose possédée, pas avec le possesseur.",
    pt: 'Substituem um substantivo com possessivo: mon livre → le mien (o meu). Concordam com a coisa possuída, não com o dono.',
  },
  forms: {
    columns: PERSONS,
    rows: [
      { label: 'masc. sing.', cells: [[f('le mien')], [f('le tien')], [f('le sien')], [f('le nôtre')], [f('le vôtre')], [f('le leur')]] },
      { label: 'fém. sing.', cells: [[f('la mienne')], [f('la tienne')], [f('la sienne')], [f('la nôtre')], [f('la vôtre')], [f('la leur')]] },
      { label: 'masc. plur.', cells: [[f('les miens')], [f('les tiens')], [f('les siens')], [f('les nôtres')], [f('les vôtres')], [f('les leurs')]] },
      { label: 'fém. plur.', cells: [[f('les miennes')], [f('les tiennes')], [f('les siennes')], [f('les nôtres')], [f('les vôtres')], [f('les leurs')]] },
    ],
  },
  uses: [
    {
      title: 'Pour ne pas répéter le nom',
      examples: [
        { fr: "Ce n'est pas ton parapluie, c'est **le mien**.", pt: 'Não é o seu guarda-chuva, é o meu.' },
        { fr: 'Ma voiture est en panne ; on prend **la tienne** ?', pt: 'Meu carro quebrou; vamos no seu?' },
      ],
    },
    {
      title: "L'accord suit la chose possédée",
      text: 'Le genre et le nombre viennent du nom remplacé, jamais du possesseur.',
      examples: [
        { fr: 'Paul a oublié sa clé, alors je lui ai prêté **la mienne**.', pt: 'O Paul esqueceu a chave, então emprestei a minha.' },
        { fr: 'Marie cherche son stylo ; **le sien** est bleu.', pt: 'A Marie está procurando a caneta; a dela é azul.' },
      ],
    },
    {
      title: 'Avec à et de : au mien, du tien',
      text: "L'article se contracte comme d'habitude.",
      examples: [
        { fr: 'Je pense à mes enfants, et toi **aux tiens** ?', pt: 'Penso nos meus filhos, e você nos seus?' },
        { fr: 'Parle-moi de ton projet, je te parlerai **du mien**.', pt: 'Me fala do seu projeto que eu te falo do meu.' },
      ],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
