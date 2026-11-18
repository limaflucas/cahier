import { f } from './forms.js';

export default {
  id: 'indefinis',
  name: 'Pronoms indéfinis',
  label: 'Indéfini',
  hue: 92,
  chapter: 4407,
  summary: {
    fr: "Ils désignent des personnes ou des choses de façon vague : quelqu'un, rien, chacun, plusieurs…",
    pt: 'Designam pessoas ou coisas de forma vaga: alguém, nada, cada um, vários…',
  },
  forms: {
    list: [
      { ...f('on'), note: "les gens en général, ou « nous » à l'oral" },
      { ...f("quelqu'un"), note: 'une personne non précisée' },
      { ...f('quelque chose'), note: 'une chose non précisée' },
      { ...f('personne'), note: "avec ne : **Personne** n'est venu." },
      { ...f('rien'), note: 'avec ne : Je ne vois **rien**.' },
      { ...f('chacun'), note: 'chaque personne, une par une' },
      { ...f('tout'), note: "l'ensemble : **Tout** va bien." },
      { ...f('certains'), note: "une partie d'un groupe" },
      { ...f('plusieurs'), note: 'un nombre indéterminé, plus de deux' },
      { ...f('aucun'), note: "avec ne : **Aucun** n'a répondu." },
      { ...f("l'un, l'autre"), note: 'deux éléments mis en regard' },
      { ...f("n'importe qui"), note: 'une personne quelconque' },
    ],
  },
  uses: [
    {
      title: 'personne, rien, aucun : avec ne',
      text: "Ils s'emploient avec **ne**, sans **pas**.",
      examples: [
        { fr: "**Personne** n'a appelé.", pt: 'Ninguém ligou.' },
        { fr: 'Je ne comprends **rien**.', pt: 'Não entendo nada.' },
      ],
    },
    {
      title: "quelqu'un, quelque chose",
      examples: [
        { fr: "**Quelqu'un** t'attend en bas.", pt: 'Alguém está te esperando lá embaixo.' },
        { fr: 'Tu veux **quelque chose** à boire ?', pt: 'Quer alguma coisa para beber?' },
      ],
    },
    {
      title: 'chacun, tout, tous',
      text: '**tous**, pronom, se prononce avec le s.',
      examples: [
        { fr: '**Chacun** paie sa part.', pt: 'Cada um paga a sua parte.' },
        { fr: '**Tout** est prêt. Ils sont **tous** venus.', pt: 'Está tudo pronto. Vieram todos.' },
      ],
    },
    {
      title: 'certains, plusieurs',
      examples: [
        { fr: "**Certains** préfèrent le train, d'autres l'avion.", pt: 'Alguns preferem o trem, outros o avião.' },
        { fr: "J'ai lu ses romans ; **plusieurs** m'ont plu.", pt: 'Li os romances dele; vários me agradaram.' },
      ],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
