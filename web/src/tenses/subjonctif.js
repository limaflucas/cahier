import { fromPresentIlsAndImparfait } from './derivations.js';

export default {
  id: 'subjonctif',
  name: 'Subjonctif présent',
  mood: 'Subjonctif',
  derivedFrom: fromPresentIlsAndImparfait,
  summary: {
    fr: 'Le mode du subjectif : volonté, sentiment, doute, nécessité, et après certaines conjonctions.',
    pt: 'O modo do subjetivo: vontade, sentimento, dúvida, necessidade e depois de certas conjunções.',
  },
  formation: {
    rule: 'je, tu, il, ils : radical de **« ils » au présent** (sans -ent). nous, vous : formes de l\'**imparfait**.',
    endings: [{ label: null, forms: ['-e', '-es', '-e', '-ions', '-iez', '-ent'] }],
    notes: [
      'Neuf irréguliers : que je **sois**, que j\'**aie**, que j\'**aille**, que je **fasse**, que je **puisse**, que je **sache**, que je **veuille**, que je **vaille**, qu\'il **faille**.',
      'Avec un seul sujet, on préfère l\'infinitif : je veux **partir** (et non « je veux que je parte »).',
    ],
  },
  models: ['parler', 'finir', 'prendre'],
  uses: [
    {
      title: 'Volonté, ordre, souhait',
      examples: [
        { fr: 'Je veux que tu **viennes** avec moi.', pt: 'Quero que você venha comigo.' },
        { fr: 'Elle souhaite que nous **soyons** à l\'heure.', pt: 'Ela deseja que a gente chegue na hora.' },
      ],
    },
    {
      title: 'Sentiment',
      examples: [
        { fr: 'Je suis ravi que vous **soyez** là.', pt: 'Fico muito feliz que vocês estejam aqui.' },
        { fr: 'J\'ai peur qu\'il ne **comprenne** pas.', pt: 'Tenho medo de que ele não entenda.' },
      ],
    },
    {
      title: 'Nécessité, obligation',
      examples: [{ fr: 'Il faut que nous **partions** tôt.', pt: 'A gente precisa sair cedo.' }],
    },
    {
      title: 'Doute, possibilité',
      examples: [{ fr: 'Il est possible qu\'il **pleuve** demain.', pt: 'É possível que chova amanhã.' }],
    },
    {
      title: 'Après certaines conjonctions',
      text: 'pour que, afin que, bien que, quoique, avant que, jusqu\'à ce que, à condition que, sans que, pourvu que, de peur que.',
      examples: [
        { fr: 'Je t\'explique pour que tu **comprennes**.', pt: 'Eu te explico para que você entenda.' },
        { fr: 'Attends-moi jusqu\'à ce que je **revienne**.', pt: 'Me espere até eu voltar.' },
      ],
    },
  ],
  advanced: [
    {
      title: 'Concession',
      examples: [
        { fr: 'Bien qu\'il **soit** fatigué, il continue.', pt: 'Embora esteja cansado, ele continua.' },
        { fr: 'Quoi qu\'il **fasse**, il est critiqué.', pt: 'Faça o que fizer, ele é criticado.' },
      ],
    },
    {
      title: 'Opinion niée ou interrogée',
      text: 'Penser, croire, trouver + indicatif à l\'affirmatif, mais **subjonctif** au négatif ou à l\'interrogatif inversé.',
      examples: [
        { fr: 'Je pense qu\'il **a** raison. / Je ne pense pas qu\'il **ait** raison.', pt: 'Acho que ele tem razão. / Não acho que ele tenha razão.' },
        { fr: 'Croyez-vous qu\'il **puisse** venir ?', pt: 'O senhor acredita que ele possa vir?' },
      ],
    },
    {
      title: 'Superlatif, le seul, le premier, le dernier',
      examples: [{ fr: 'C\'est le meilleur film que je **connaisse**.', pt: 'É o melhor filme que eu conheço.' }],
    },
    {
      title: 'Relative à l\'existence incertaine',
      examples: [
        { fr: 'Je cherche un appartement qui **soit** calme.', pt: 'Procuro um apartamento que seja tranquilo.' },
        { fr: 'J\'ai trouvé un appartement qui **est** calme.', pt: 'Encontrei um apartamento que é tranquilo.' },
      ],
    },
    {
      title: 'Le fait que, en tête de phrase',
      examples: [{ fr: 'Le fait qu\'il ne **réponde** pas m\'inquiète.', pt: 'O fato de ele não responder me preocupa.' }],
    },
    {
      title: 'Subjonctif seul et ne explétif',
      text: 'En phrase indépendante, il exprime un ordre ou un souhait. Après avant que, à moins que, de peur que, le **ne** explétif (sans valeur négative) appartient au registre soutenu.',
      examples: [
        { fr: 'Pourvu qu\'il **fasse** beau !', pt: 'Tomara que faça sol!' },
        { fr: 'Partons avant qu\'il ne **pleuve**.', pt: 'Vamos embora antes que chova.' },
      ],
    },
  ],
  pitfalls: [
    {
      title: '« Espero que » → j\'espère que + indicatif',
      note: 'Esperar pede subjuntivo em português, mas "espérer" pede indicativo (geralmente o futur).',
      examples: [{ fr: 'J\'espère que tu **viendras**. (et non « que tu viennes »)', pt: 'Espero que você venha.' }],
    },
    {
      title: '« Talvez » → peut-être + indicatif',
      examples: [{ fr: 'Il **viendra** peut-être demain.', pt: 'Talvez ele venha amanhã.' }],
    },
    {
      title: 'Après que + indicatif, avant que + subjonctif',
      note: 'A norma pede o indicativo depois de "après que", porque o fato já aconteceu.',
      examples: [{ fr: 'Après qu\'il **est** parti, on a rangé. / Avant qu\'il **parte**, on a parlé.', pt: 'Depois que ele saiu, arrumamos. / Antes que ele saísse, conversamos.' }],
    },
    {
      title: '« Quando / se + futuro do subjuntivo » ne donne jamais un subjonctif',
      examples: [{ fr: 'Quand tu **seras** prêt, dis-le-moi. Si tu **peux**, viens.', pt: 'Quando você estiver pronto, me avise. Se puder, venha.' }],
    },
  ],
  memory: [
    '« **Ils** » du présent donne la base : ils **prenn**ent → que je **prenn**e ; ils **finiss**ent → que je **finiss**e.',
    'nous et vous = **imparfait** : que nous **prenions**, que vous **preniez** — les mêmes formes !',
    'Les neuf rebelles en chanson : **sois, aie, aille, fasse, puisse, sache, veuille, vaille, faille**.',
    'Pensez « **subjectif** » : dès que la phrase dit ce que quelqu\'un veut, ressent, craint ou met en doute — et non un fait —, le subjonctif arrive.',
  ],
};
