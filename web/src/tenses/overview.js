export const TIMELINE = [
  { tenses: ['plusQueParfait'], moment: 'avant un moment passé' },
  { tenses: ['passeCompose', 'imparfait'], moment: 'passé' },
  { tenses: ['present'], moment: 'maintenant', now: true },
  { tenses: ['futurAnterieur'], moment: 'avant un moment futur' },
  { tenses: ['futur'], moment: 'futur' },
];

export const DERIVATIONS = [
  {
    source: '« nous » du présent',
    targets: ['imparfait', 'participePresent', 'gerondif'],
    example: 'nous **pren**ons → je **pren**ais, **pren**ant, en **pren**ant',
  },
  {
    source: '« ils » du présent',
    targets: ['subjonctif'],
    example: 'ils **prenn**ent → que je **prenn**e ; nous et vous comme à l\'imparfait : que nous **pren**ions',
  },
  {
    source: 'l\'infinitif',
    targets: ['futur', 'conditionnel'],
    example: '**prendr**e → je **prendr**ai → je **prendr**ais',
  },
  {
    source: 'le participe passé',
    targets: ['passeCompose', 'plusQueParfait', 'futurAnterieur', 'conditionnelPasse', 'subjonctifPasse'],
    example: '**pris** → j\'ai pris, j\'avais pris, j\'aurai pris, j\'aurais pris, que j\'aie pris',
  },
];

export const SI_CLAUSES = [
  {
    condition: 'si + présent',
    consequence: 'présent, futur ou impératif',
    example: 'Si tu **viens**, on **ira** au cinéma.',
    pt: 'Se você vier… (futuro do subjuntivo)',
  },
  {
    condition: 'si + imparfait',
    consequence: 'conditionnel présent',
    example: 'Si j\'**avais** le temps, je **lirais** davantage.',
    pt: 'Se eu tivesse… (imperfeito do subjuntivo)',
  },
  {
    condition: 'si + plus-que-parfait',
    consequence: 'conditionnel passé',
    example: 'Si j\'**avais su**, je ne **serais** pas **venu**.',
    pt: 'Se eu tivesse sabido… (mais-que-perfeito do subjuntivo)',
  },
];

export const REPORTED_SPEECH = [
  { direct: '« Je **pars**. »', reported: 'Il a dit qu\'il **partait**.', shift: 'présent → imparfait' },
  { direct: '« Je **suis parti**. »', reported: 'Il a dit qu\'il **était parti**.', shift: 'passé composé → plus-que-parfait' },
  { direct: '« Je **partirai**. »', reported: 'Il a dit qu\'il **partirait**.', shift: 'futur → conditionnel présent' },
  { direct: '« Je **serai parti**. »', reported: 'Il a dit qu\'il **serait parti**.', shift: 'futur antérieur → conditionnel passé' },
];

export const STUDY_TIPS = [
  'Apprenez chaque verbe par ses **formes clés** : je, nous et ils au présent, je au futur et le participe passé. Presque tout le reste s\'en déduit, comme le montrent les liens du jeu.',
  'Essayez de **retrouver** une forme avant de la relire : remplir une case de mémoire (niveau Réel) ancre mieux que dix relectures.',
  '**Espacez** les révisions : rejouez un verbe le lendemain, trois jours plus tard, puis une semaine après.',
  'Conjuguez **dans une phrase** et à voix haute (« je prends le train ») : on retient des phrases, pas des listes.',
  'Notez les formes **rebelles** que vous ratez et rejouez ces verbes en priorité.',
];
