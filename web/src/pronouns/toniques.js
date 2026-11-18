import { PERSONS, f } from './forms.js';

export default {
  id: 'toniques',
  name: 'Pronoms toniques',
  label: 'Tonique',
  hue: 210,
  chapter: 576,
  summary: {
    fr: "La forme forte du pronom : après une préposition, pour insister, après « c'est » et dans les réponses courtes.",
    pt: 'A forma forte do pronome: depois de preposição, para dar ênfase, depois de « c\'est » e nas respostas curtas.',
  },
  forms: {
    columns: PERSONS,
    rows: [
      { label: 'tonique', cells: [[f('moi')], [f('toi')], [f('lui'), f('elle'), f('soi')], [f('nous')], [f('vous')], [f('eux'), f('elles')]] },
    ],
  },
  uses: [
    {
      title: 'Après une préposition',
      examples: [
        { fr: 'Tu viens avec **moi** ?', pt: 'Você vem comigo?' },
        { fr: 'Ce cadeau est pour **eux**.', pt: 'Este presente é para eles.' },
      ],
      see: { to: '/grammaire/cod-coi#a-lui', label: 'COD et COI : je lui parle, mais je pense à lui' },
    },
    {
      title: 'Pour insister',
      text: 'Le pronom tonique se met en tête ou en fin de phrase ; le pronom sujet reste.',
      examples: [
        { fr: '**Moi**, je préfère le thé.', pt: 'Eu prefiro chá.' },
        { fr: 'Il ne sait rien, **lui**.', pt: 'Ele não sabe de nada.' },
      ],
    },
    {
      title: "Après « c'est » et dans les réponses courtes",
      examples: [
        { fr: "Qui a appelé ? — C'est **elle**.", pt: 'Quem ligou? — Foi ela.' },
        { fr: "Je n'ai pas faim. — **Moi** non plus.", pt: 'Não estou com fome. — Eu também não.' },
      ],
    },
    {
      title: 'Dans les comparaisons et avec -même',
      examples: [
        { fr: 'Il est plus grand que **toi**.', pt: 'Ele é mais alto que você.' },
        { fr: "Je l'ai réparé **moi-même**.", pt: 'Eu mesmo consertei.' },
      ],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
