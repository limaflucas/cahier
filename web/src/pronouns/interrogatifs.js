import { f } from './forms.js';

export default {
  id: 'interrogatifs',
  name: 'Pronoms interrogatifs',
  label: 'Interrogatif',
  hue: 312,
  chapter: 4069,
  summary: {
    fr: 'Ils posent une question sur une personne (qui), une chose (que, quoi) ou un choix (lequel).',
    pt: 'Fazem uma pergunta sobre uma pessoa (qui), uma coisa (que, quoi) ou uma escolha (lequel).',
  },
  forms: {
    list: [
      { ...f('qui'), note: 'une personne : **Qui** vient ce soir ?' },
      { ...f('que', { elided: "qu'" }), note: 'une chose, avant le verbe : **Que** fais-tu ?' },
      { ...f('quoi'), note: 'une chose, après une préposition ou en fin de phrase : À **quoi** penses-tu ?' },
      { ...f('lequel'), note: 'un choix, masc. sing. : **Lequel** préfères-tu ?' },
      { ...f('laquelle'), note: 'un choix, fém. sing.' },
      { ...f('lesquels'), note: 'un choix, masc. plur.' },
      { ...f('lesquelles'), note: 'un choix, fém. plur.' },
    ],
  },
  uses: [
    {
      title: 'qui : une personne',
      examples: [
        { fr: '**Qui** as-tu vu hier ?', pt: 'Quem você viu ontem?' },
        { fr: 'Avec **qui** pars-tu en vacances ?', pt: 'Com quem você vai viajar de férias?' },
      ],
    },
    {
      title: 'que ou quoi : une chose',
      text: "**que** avant le verbe ; **quoi** après une préposition, ou en fin de phrase à l'oral.",
      examples: [
        { fr: '**Que** fais-tu ce week-end ? · Tu fais **quoi** ce week-end ?', pt: 'O que você vai fazer no fim de semana?' },
        { fr: 'De **quoi** parlez-vous ?', pt: 'Do que vocês estão falando?' },
      ],
    },
    {
      title: 'lequel : un choix',
      text: "Il s'accorde avec le nom qu'il remplace.",
      examples: [
        { fr: "J'ai deux romans. **Lequel** veux-tu ?", pt: 'Tenho dois romances. Qual você quer?' },
        { fr: 'Parmi ces chemises, **laquelle** préfères-tu ?', pt: 'Dessas camisas, qual você prefere?' },
      ],
    },
    {
      title: "Avec est-ce que, à l'oral",
      examples: [
        { fr: "**Qu'est-ce qui** se passe ?", pt: 'O que está acontecendo?' },
        { fr: "**Qu'est-ce que** tu veux boire ?", pt: 'O que você quer beber?' },
      ],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
