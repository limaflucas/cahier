import { fromPresentNous } from './derivations.js';

export default {
  id: 'participePresent',
  name: 'Participe présent',
  mood: 'Participes et gérondif',
  derivedFrom: fromPresentNous,
  summary: {
    fr: 'Forme invariable en -ant, surtout écrite : elle qualifie un nom ou exprime une cause.',
    pt: 'Forma invariável em -ant, sobretudo escrita: qualifica um nome ou expressa uma causa.',
  },
  formation: {
    rule: 'Radical de **« nous » au présent** + **-ant**.',
    notes: ['Trois exceptions : **étant** (être), **ayant** (avoir), **sachant** (savoir).'],
  },
  models: ['parler', 'finir', 'prendre', 'savoir'],
  uses: [
    {
      title: 'À la place d\'une relative (qui + verbe)',
      examples: [{ fr: 'Les candidats **parlant** espagnol sont prioritaires.', pt: 'Os candidatos que falam espanhol têm prioridade.' }],
    },
    {
      title: 'Cause',
      examples: [{ fr: '**Étant** malade, il n\'est pas venu.', pt: 'Por estar doente, ele não veio.' }],
    },
    {
      title: 'Actions qui s\'enchaînent (récit écrit)',
      examples: [{ fr: '**Ouvrant** la porte, elle découvrit le désordre.', pt: 'Ao abrir a porta, ela deu com a bagunça.' }],
    },
  ],
  advanced: [
    {
      title: 'Participe présent composé : l\'antériorité',
      text: '**ayant** ou **étant** + participe passé.',
      examples: [
        { fr: '**Ayant fini** son travail, il est parti.', pt: 'Tendo terminado o trabalho, ele foi embora.' },
        { fr: '**Étant arrivée** en retard, elle a raté le début.', pt: 'Como chegou atrasada, ela perdeu o começo.' },
      ],
    },
    {
      title: 'Proposition participiale',
      text: 'Le participe peut avoir son propre sujet (registre soutenu).',
      examples: [{ fr: 'Le temps **pressant**, nous avons écourté la réunion.', pt: 'Como o tempo era curto, encurtamos a reunião.' }],
    },
    {
      title: 'Participe présent ou adjectif verbal ?',
      text: 'Le participe est invariable ; l\'adjectif verbal s\'accorde et change parfois d\'orthographe : fatigu**ant** / fatig**ant**, convainqu**ant** / convainc**ant**, provoqu**ant** / provoc**ant**, néglige**ant** / néglig**ent**, différ**ant** / différ**ent**.',
      examples: [
        { fr: 'Une journée **fatigante**. / Les enfants, **fatiguant** leurs parents, …', pt: 'Um dia cansativo. / As crianças, cansando os pais, …' },
        { fr: 'Des arguments **convaincants**. / **Convainquant** le jury, elle a gagné.', pt: 'Argumentos convincentes. / Convencendo o júri, ela ganhou.' },
      ],
    },
  ],
  pitfalls: [
    {
      title: 'Plus rare que le gerúndio',
      note: 'O gerúndio é onipresente no português falado; em francês, o participe présent é sobretudo escrito. Na fala, prefira "qui + verbo" ou o gérondif.',
      examples: [{ fr: 'Les gens **qui habitent** ici… (plutôt que « habitant ici »)', pt: 'As pessoas que moram aqui…' }],
    },
    {
      title: 'Jamais d\'accord',
      examples: [{ fr: 'Des femmes **parlant** trois langues. (et non « parlantes »)', pt: 'Mulheres que falam três línguas.' }],
    },
  ],
  memory: [
    'Nous du présent, on coupe -ons, on met -ant : nous **fais**ons → **fais**ant. Les trois rebelles : **étant, ayant, sachant**.',
    'Participe présent = **invariable** ; adjectif verbal = **s\'accorde** (« des histoires captivant**es** »).',
  ],
};
