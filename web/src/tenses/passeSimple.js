export default {
  id: 'passeSimple',
  name: 'Passé simple',
  mood: 'Indicatif',
  summary: {
    fr: 'Le passé du récit écrit : romans, contes, biographies, livres d\'histoire. On le lit bien plus qu\'on ne l\'écrit.',
    pt: 'O passado da narração escrita: romances, contos, biografias, livros de história. Mais para reconhecer do que para usar.',
  },
  formation: {
    rule: 'Un radical propre au verbe + l\'une des **trois séries** de terminaisons, en **-a**, en **-i** ou en **-u**.',
    endings: [
      { label: 'en -a : tous les -er', forms: ['-ai', '-as', '-a', '-âmes', '-âtes', '-èrent'] },
      { label: 'en -i : finir, prendre, faire…', forms: ['-is', '-is', '-it', '-îmes', '-îtes', '-irent'] },
      { label: 'en -u : être, avoir, -oir…', forms: ['-us', '-us', '-ut', '-ûmes', '-ûtes', '-urent'] },
    ],
    notes: [
      'Au 3e groupe, le **participe passé** donne souvent le radical : pris → je **pris**, mis → je **mis**, lu → je **lus**, voulu → je **voulus**.',
      'Mais pas toujours : faire → je **fis**, voir → je **vis**, écrire → j\'**écrivis**, naître → je **naquis**, mourir → je **mourus**.',
      '**Venir** et **tenir** (et leurs composés) ont leur propre série : je **vins**, nous **vînmes**, ils **vinrent**.',
      'Accent circonflexe à **nous** et **vous** : nous parl**â**mes, vous fin**î**tes, nous f**û**mes.',
      '-cer / -ger devant a : je commen**ç**ai, il mang**e**a, mais ils commencèrent, ils mangèrent.',
    ],
  },
  models: ['parler', 'finir', 'prendre', 'être', 'venir'],
  uses: [
    {
      title: 'Les événements du récit',
      text: 'Il fait avancer l\'histoire : des actions achevées qui se succèdent. L\'**imparfait** reste le décor.',
      examples: [
        { fr: 'Il **ouvrit** la porte, **regarda** autour de lui et **sortit** sans un mot.', pt: 'Ele abriu a porta, olhou em volta e saiu sem dizer uma palavra.' },
        { fr: 'Il pleuvait depuis le matin quand le train **entra** en gare.', pt: 'Chovia desde cedo quando o trem entrou na estação.' },
      ],
    },
    {
      title: 'Biographies et histoire',
      examples: [
        { fr: 'Victor Hugo **naquit** à Besançon en 1802.', pt: 'Victor Hugo nasceu em Besançon em 1802.' },
        { fr: 'La Première Guerre mondiale **dura** plus de quatre ans.', pt: 'A Primeira Guerra Mundial durou mais de quatro anos.' },
      ],
    },
    {
      title: 'Contes',
      examples: [{ fr: 'Ils se **marièrent** et **eurent** beaucoup d\'enfants.', pt: 'Eles se casaram e tiveram muitos filhos.' }],
    },
  ],
  advanced: [
    {
      title: 'Passé simple ou passé composé ?',
      text: 'Même valeur, registre différent : le **passé composé** raconte à l\'oral et rattache le passé au présent ; le **passé simple** coupe le récit du moment où l\'on parle. On ne les mélange pas dans un même récit.',
      examples: [
        { fr: 'Il **entra**, **s\'assit** et **commanda** un café. (récit écrit)', pt: 'Ele entrou, sentou-se e pediu um café.' },
        { fr: 'Il **est entré**, il **s\'est assis** et il **a commandé** un café. (oral)', pt: 'Ele entrou, se sentou e pediu um café.' },
      ],
    },
    {
      title: 'Le passé antérieur, son temps composé',
      text: 'Auxiliaire au passé simple + participe passé : l\'action achevée juste avant, après **quand**, **dès que**, **après que**, **à peine… que**.',
      examples: [
        { fr: 'Dès qu\'il **eut fini** son discours, la salle **applaudit**.', pt: 'Assim que ele terminou o discurso, a plateia aplaudiu.' },
        { fr: 'À peine **fut**-elle **sortie** qu\'il **se mit** à pleuvoir.', pt: 'Mal ela tinha saído, começou a chover.' },
      ],
    },
    {
      title: 'À l\'oral, un effet de style',
      text: 'Employé en parlant, il donne un ton solennel ou ironique, comme si l\'on racontait une légende.',
      examples: [{ fr: 'Et ce jour-là, Paul **fit** la vaisselle sans qu\'on le lui demande.', pt: 'E nesse dia, o Paulo lavou a louça sem ninguém pedir.' }],
    },
  ],
  pitfalls: [
    {
      title: '« Ontem eu vi » → hier, j\'ai vu',
      note: 'O pretérito perfeito português cobre os dois tempos. Na fala, nos e-mails e nas mensagens, use o passé composé: o passé simple soa literário.',
      examples: [{ fr: 'Hier, j\'**ai vu** Marie au marché. (et non « je vis Marie »)', pt: 'Ontem eu vi a Marie na feira.' }],
    },
    {
      title: 'Je vis : voir ou vivre ?',
      text: 'Certaines formes se confondent avec le présent : seul le contexte tranche.',
      examples: [
        { fr: 'Je **vis** la mer pour la première fois à vingt ans. (voir, passé simple)', pt: 'Vi o mar pela primeira vez aos vinte anos.' },
        { fr: 'Je **vis** à Lyon depuis deux ans. (vivre, présent)', pt: 'Moro em Lyon há dois anos.' },
        { fr: 'Il **finit** son café et **partit**. (finit : présent ou passé simple)', pt: 'Ele terminou o café e foi embora.' },
      ],
    },
    {
      title: '« Falaram » → ils parlèrent',
      note: 'Na 3ª pessoa do plural dos verbos em -er, o francês tem -èrent, nunca -arent.',
      examples: [{ fr: 'Ils **parlèrent** toute la nuit. (et non « ils parlarent »)', pt: 'Eles conversaram a noite toda.' }],
    },
  ],
  memory: [
    '**On le lit plus qu\'on ne l\'écrit** : apprenez d\'abord à reconnaître **il/elle** et **ils/elles**, les personnes du récit.',
    'Trois voyelles : **a** pour les -er (il parl**a**), **i** pour finir, prendre, faire (il pr**it**), **u** pour être, avoir, les -oir (il f**ut**, il e**ut**, il voul**ut**).',
    'Dix formes à reconnaître sans hésiter : il **fut**, il **eut**, il **fit**, il **dit**, il **vit**, il **prit**, il **mit**, il **vint**, il **put**, il **sut**.',
  ],
};
