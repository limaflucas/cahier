import { f } from './forms.js';

export default {
  id: 'neutres',
  name: 'Pronoms neutres',
  label: 'Neutre',
  hue: 262,
  chapter: 1582,
  summary: {
    fr: "Ils reprennent une idée, une situation ou une phrase entière. Ils n'ont ni genre ni nombre.",
    pt: 'Retomam uma ideia, uma situação ou uma frase inteira. Não têm gênero nem número.',
  },
  forms: {
    list: [
      { ...f('ce', { elided: "c'" }), note: "devant être, et devant qui / que : **c'**est vrai, **ce** que tu dis" },
      { ...f('ceci'), note: 'ce qui va suivre ; écrit ou soutenu' },
      { ...f('cela'), note: 'ce qui précède ; écrit ou soutenu' },
      { ...f('ça'), note: "cela, à l'oral : **ça** va ?" },
      { ...f('le'), note: 'reprend une idée : tu es sûr ? — oui, je **le** suis' },
      { ...f('il'), note: 'sujet impersonnel : **il** faut, **il** pleut' },
    ],
  },
  uses: [
    {
      title: 'ce devant être',
      examples: [
        { fr: "**C'**est une bonne idée.", pt: 'É uma boa ideia.' },
        { fr: '**Ce** sont mes voisins.', pt: 'São os meus vizinhos.' },
      ],
    },
    {
      title: 'ce qui, ce que : « a coisa que »',
      examples: [
        { fr: "**Ce qui** compte, c'est la santé.", pt: 'O que importa é a saúde.' },
        { fr: 'Dis-moi **ce que** tu veux.', pt: 'Me diz o que você quer.' },
      ],
    },
    {
      title: "ça à l'oral, cela à l'écrit",
      examples: [
        { fr: '**Ça** me plaît beaucoup.', pt: 'Gosto muito disso.' },
        { fr: '**Cela** dit, la décision reste difficile.', pt: 'Dito isso, a decisão continua difícil.' },
      ],
    },
    {
      title: 'le neutre : reprendre une idée',
      examples: [
        { fr: 'Il est malade ? — Oui, je **le** sais.', pt: 'Ele está doente? — Sim, eu sei.' },
        { fr: 'Elle est fatiguée, mais elle ne **le** montre pas.', pt: 'Ela está cansada, mas não demonstra.' },
      ],
      see: { to: '/grammaire/cod-coi#le-neutre', label: 'COD et COI : le neutre, COD ou attribut' },
    },
    {
      title: 'il impersonnel : un sujet sans personne',
      examples: [{ fr: '**Il** faut partir tôt : **il** fait froid.', pt: 'É preciso sair cedo: está frio.' }],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
