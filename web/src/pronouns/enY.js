import { f } from './forms.js';

export default {
  id: 'en-y',
  name: 'Pronoms en et y',
  label: 'En / y',
  hue: 188,
  chapter: 3094,
  summary: {
    fr: 'Deux petits mots qui remplacent un complément de chose ou de lieu : en remplace « de + … », y remplace « à + … ».',
    pt: 'Duas palavrinhas que substituem um complemento de coisa ou de lugar: en substitui « de + … », y substitui « à + … ».',
  },
  forms: {
    list: [
      { ...f('en'), note: "remplace de + chose, une quantité, le lieu d'où l'on vient" },
      { ...f('y'), note: "remplace à + chose, le lieu où l'on est ou où l'on va" },
    ],
  },
  uses: [
    {
      title: 'en : une quantité',
      text: 'Avec un partitif, un nombre ou une expression de quantité. Le nombre reste après le verbe.',
      examples: [
        { fr: "Tu veux **du café** ? — Oui, j'**en** veux bien.", pt: 'Quer café? — Quero, sim.' },
        { fr: "Combien **de frères** as-tu ? — J'**en** ai deux.", pt: 'Quantos irmãos você tem? — Tenho dois.' },
      ],
      see: { to: '/grammaire/cod-coi#en', label: 'COD et COI : en, une quantité ou un complément en de' },
    },
    {
      title: "en : de + chose, ou le lieu d'où l'on vient",
      examples: [
        { fr: 'Il parle souvent **de son voyage** ? — Oui, il **en** parle tout le temps.', pt: 'Ele fala muito da viagem? — Fala o tempo todo.' },
        { fr: "Tu reviens **de la plage** ? — Oui, j'**en** reviens.", pt: 'Você está voltando da praia? — Estou voltando de lá.' },
      ],
      see: { to: '/grammaire/cod-coi#de-lui', label: "COD et COI : pour une personne, de lui, d'elle" },
    },
    {
      title: "y : à + chose, ou le lieu où l'on est ou va",
      examples: [
        { fr: "Tu penses **à ton examen** ? — J'**y** pense sans arrêt.", pt: 'Você pensa na prova? — Penso nela o tempo todo.' },
        { fr: 'Elle va **à Lyon** demain ? — Oui, elle **y** va en train.', pt: 'Ela vai a Lyon amanhã? — Vai, de trem.' },
      ],
      see: { to: '/grammaire/cod-coi#y', label: 'COD et COI : y, à + une chose' },
    },
  ],
  advanced: [
    {
      title: 'Les expressions figées',
      text: "Dans beaucoup d'expressions courantes, en ou y est figé et ne remplace plus rien.",
      examples: [
        { fr: "Je m'**en** vais. Il m'**en** veut encore.", pt: 'Vou embora. Ele ainda está chateado comigo.' },
        { fr: 'On **y** va ? — Ça **y** est, je suis prêt.', pt: 'Vamos? — Pronto, já estou pronto.' },
      ],
    },
    {
      title: "Pas de y devant le futur d'aller",
      text: 'Par euphonie, y disparaît devant irai, irais, etc.',
      examples: [{ fr: "Tu vas à Rome cet été ? — Oui, j'**irai** en août.", pt: 'Você vai a Roma neste verão? — Vou em agosto.' }],
    },
  ],
  pitfalls: [
    {
      title: "« Vou » tout seul → j'y vais",
      note: 'Em português o lugar fica subentendido; em francês aller pede um complemento: y.',
      examples: [{ fr: "Tu vas à la fête ce soir ? — Oui, j'**y** vais.", pt: 'Você vai à festa hoje? — Vou.' }],
    },
  ],
  memory: [],
  more: [
    { to: '/grammaire/cod-coi#a-lui', label: 'Je lui parle, mais je pense à lui' },
    { to: '/grammaire/cod-coi#y-en-idees', label: 'Y et en : reprendre une phrase entière' },
    { to: '/grammaire/cod-coi#en-accord', label: "En et l'accord du participe" },
    { to: '/grammaire/cod-coi#pieges-pour-lusophones', label: "Pièges pour lusophones : en et y n'existent pas en portugais" },
  ],
};
