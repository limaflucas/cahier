import { PERSONS, f } from './forms.js';

export default {
  id: 'reflechis',
  name: 'Pronoms réfléchis',
  label: 'Réfléchi',
  hue: 335,
  chapter: 2000,
  summary: {
    fr: "Ils accompagnent les verbes pronominaux : le sujet agit sur lui-même, ou plusieurs sujets agissent les uns sur les autres.",
    pt: 'Acompanham os verbos pronominais: o sujeito age sobre si mesmo, ou vários sujeitos agem uns sobre os outros.',
  },
  forms: {
    columns: PERSONS,
    rows: [
      { label: 'réfléchi', cells: [[f('me', { elided: "m'" })], [f('te', { elided: "t'" })], [f('se', { elided: "s'" })], [f('nous')], [f('vous')], [f('se', { elided: "s'" })]] },
    ],
  },
  uses: [
    {
      title: "L'action revient sur le sujet",
      examples: [
        { fr: 'Je **me** lève à sept heures.', pt: 'Eu me levanto às sete.' },
        { fr: "Elle **s'**habille en cinq minutes.", pt: 'Ela se veste em cinco minutos.' },
      ],
    },
    {
      title: 'Une action réciproque',
      examples: [
        { fr: "Ils **s'**écrivent chaque semaine.", pt: 'Eles se escrevem toda semana.' },
        { fr: 'Nous **nous** sommes rencontrés à Lyon.', pt: 'Nós nos conhecemos em Lyon.' },
      ],
    },
    {
      title: 'Les verbes toujours pronominaux',
      text: "Certains verbes n'existent qu'avec un pronom réfléchi.",
      examples: [
        { fr: 'Je **me** souviens de ce jour.', pt: 'Eu me lembro desse dia.' },
        { fr: "Il **s'**est moqué de moi.", pt: 'Ele zombou de mim.' },
      ],
    },
    {
      title: 'Avec être aux temps composés',
      text: 'Les verbes pronominaux se conjuguent toujours avec **être**.',
      examples: [{ fr: "Elle **s'est** couchée tard.", pt: 'Ela se deitou tarde.' }],
      see: { to: '/grammaire/cod-coi#pronominaux', label: "COD et COI : l'accord du participe, se est-il COD ou COI ?" },
    },
    {
      title: "À l'impératif affirmatif : toi, nous, vous",
      text: 'Le pronom passe après le verbe ; te devient **toi**.',
      examples: [
        { fr: 'Lève-**toi** ! Dépêchons-**nous** !', pt: 'Levanta! Vamos nos apressar!' },
        { fr: 'Mais à la forme négative : ne **te** lève pas.', pt: 'Mas na negativa: não se levante.' },
      ],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
