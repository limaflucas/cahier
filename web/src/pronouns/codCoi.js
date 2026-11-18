import { PERSONS, f } from './forms.js';

/**
 * A direct object form, keyed apart from the indirect one it may share its spelling with.
 * @param {string} form
 * @param {string} [elided]
 */
const cod = (form, elided) => f(form, { elided, key: `cod:${form}` });

/**
 * An indirect object form, keyed apart from the direct one it may share its spelling with.
 * @param {string} form
 * @param {string} [elided]
 */
const coi = (form, elided) => f(form, { elided, key: `coi:${form}` });

export default {
  id: 'cod-coi',
  name: 'Pronoms COD et COI',
  label: 'COD / COI',
  hue: 24,
  chapter: 2640,
  summary: {
    fr: "Ils remplacent le complément d'un verbe : le COD sans préposition, le COI introduit par « à ».",
    pt: 'Substituem o complemento do verbo: o objeto direto sem preposição, o indireto introduzido por « à ».',
  },
  forms: {
    columns: PERSONS,
    rows: [
      { label: 'COD', cells: [[cod('me', "m'")], [cod('te', "t'")], [cod('le', "l'"), cod('la', "l'")], [cod('nous')], [cod('vous')], [cod('les')]] },
      { label: 'COI', cells: [[coi('me', "m'")], [coi('te', "t'")], [coi('lui')], [coi('nous')], [coi('vous')], [coi('leur')]] },
    ],
  },
  uses: [
    {
      title: 'COD : sans préposition',
      text: 'Il répond à « qui ? » ou « quoi ? » juste après le verbe.',
      examples: [
        { fr: 'Je vois **Marie** tous les matins. → Je **la** vois tous les matins.', pt: 'Vejo a Marie todas as manhãs. → Eu a vejo todas as manhãs.' },
        { fr: 'Tu as lu **ces articles** ? — Oui, je **les** ai lus.', pt: 'Você leu esses artigos? — Li, sim.' },
      ],
      see: { to: '/grammaire/cod-coi#pronoms', label: 'COD et COI : remplacer un complément par un pronom' },
    },
    {
      title: 'COI : à + personne',
      text: '**lui** et **leur** remplacent une personne introduite par « à ». Pour une chose, on emploie **y**.',
      examples: [
        { fr: "J'écris **à ma sœur**. → Je **lui** écris.", pt: 'Escrevo para minha irmã. → Escrevo para ela.' },
        { fr: 'Il a téléphoné **à ses parents**. → Il **leur** a téléphoné.', pt: 'Ele ligou para os pais. → Ele ligou para eles.' },
      ],
      see: { to: '/grammaire/cod-coi#lui-leur', label: 'COD et COI : lui et leur, des personnes après à' },
    },
    {
      title: 'me, te, nous, vous : COD ou COI',
      text: "À la 1re et à la 2e personne, la forme ne change pas ; c'est le verbe qui décide.",
      examples: [{ fr: 'Il **me** regarde. (regarder qqn) · Il **me** parle. (parler à qqn)', pt: 'Ele olha para mim. · Ele fala comigo.' }],
      see: { to: '/grammaire/cod-coi#les-reperer', label: 'COD et COI : repérer un COD ou un COI' },
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
  more: [
    { to: '/grammaire/cod-coi#place', label: 'La place du pronom : avant le verbe' },
    { to: '/grammaire/cod-coi#deux-pronoms', label: 'Deux pronoms : un ordre fixe' },
    { to: '/grammaire/cod-coi#imperatif', label: "À l'impératif affirmatif : après le verbe" },
    { to: '/grammaire/cod-coi#accord-participe', label: "L'accord du participe passé avec le COD placé avant" },
    { to: '/grammaire/cod-coi#niveau-b2-c1', label: "Niveau B2–C1 : pronominaux, faire faire, deux pronoms à l'impératif…" },
    { to: '/grammaire/cod-coi#pieges-pour-lusophones', label: 'Pièges pour lusophones' },
  ],
};
