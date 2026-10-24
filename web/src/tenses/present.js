export default {
  id: 'present',
  name: 'Présent',
  mood: 'Indicatif',
  summary: {
    fr: 'Ce qui est vrai maintenant, habituellement ou toujours.',
    pt: 'O que é verdade agora, habitualmente ou sempre.',
  },
  formation: {
    rule: 'Les terminaisons dépendent du **groupe** du verbe.',
    endings: [
      { label: '1er groupe (-er)', forms: ['-e', '-es', '-e', '-ons', '-ez', '-ent'] },
      { label: '2e groupe (-ir, -issons)', forms: ['-is', '-is', '-it', '-issons', '-issez', '-issent'] },
      { label: '3e groupe', forms: ['-s / -x', '-s / -x', '-t / -d', '-ons', '-ez', '-ent'] },
    ],
    notes: [
      'Au 3e groupe, le radical change souvent : apprenez les **trois bases** je / nous / ils (je **prends**, nous **prenons**, ils **prennent**).',
      'Verbes en -cer et -ger : nous commen**ç**ons, nous mang**e**ons.',
      'Verbes en -eler / -eter : j\'appe**ll**e, j\'ach**è**te ; en -é-er : je préf**è**re.',
    ],
  },
  models: ['parler', 'finir', 'prendre'],
  uses: [
    {
      title: 'Action en cours',
      text: 'Pour insister sur le déroulement : **être en train de** + infinitif.',
      examples: [
        { fr: 'Je **lis** un roman de Modiano.', pt: 'Estou lendo um romance do Modiano.' },
        { fr: 'Ne la dérange pas, elle **est en train de** préparer sa soutenance.', pt: 'Não a incomode, ela está preparando a defesa dela.' },
      ],
    },
    {
      title: 'Habitude et vérité générale',
      examples: [
        { fr: 'Le dimanche, nous **déjeunons** chez mes parents.', pt: 'Aos domingos, almoçamos na casa dos meus pais.' },
        { fr: 'L\'eau **bout** à cent degrés.', pt: 'A água ferve a cem graus.' },
      ],
    },
    {
      title: 'Futur proche et certain',
      examples: [
        { fr: 'Je **pars** demain à l\'aube.', pt: 'Parto amanhã de madrugada.' },
        { fr: 'Le train **arrive** dans dix minutes.', pt: 'O trem chega em dez minutos.' },
      ],
    },
    {
      title: 'Action commencée dans le passé qui dure encore',
      text: 'Avec **depuis**, **ça fait … que**, **il y a … que**.',
      examples: [
        { fr: 'J\'**habite** à Lyon depuis trois ans.', pt: 'Moro em Lyon há três anos.' },
        { fr: 'Ça fait une heure qu\'il t\'**attend**.', pt: 'Faz uma hora que ele está te esperando.' },
      ],
    },
  ],
  advanced: [
    {
      title: 'Présent de narration',
      text: 'Raconter un fait passé au présent le rend plus vivant ; très courant dans les récits historiques et à l\'oral.',
      examples: [
        { fr: 'En 1789, le peuple **prend** la Bastille.', pt: 'Em 1789, o povo toma a Bastilha.' },
        { fr: 'Hier, je **sors** du bureau et là, qui je **vois** ? Mon ancien prof !', pt: 'Ontem eu saio do escritório e quem eu vejo? Meu antigo professor!' },
      ],
    },
    {
      title: 'Après « si » de condition',
      text: '**Si** + présent → présent, futur ou impératif. Jamais de futur après ce « si ».',
      examples: [
        { fr: 'Si tu **viens**, on ira au cinéma.', pt: 'Se você vier, a gente vai ao cinema.' },
        { fr: 'Si vous **avez** des questions, n\'hésitez pas.', pt: 'Se tiverem dúvidas, não hesitem.' },
      ],
    },
    {
      title: 'Ordre atténué',
      text: 'Le présent remplace l\'impératif pour une consigne familière.',
      examples: [{ fr: 'Tu **fermes** la porte en sortant, s\'il te plaît.', pt: 'Fecha a porta quando sair, por favor.' }],
    },
    {
      title: 'Proverbes et maximes',
      examples: [
        { fr: 'Qui **va** à la chasse **perd** sa place.', pt: 'Quem vai ao vento perde o assento.' },
        { fr: 'L\'appétit **vient** en mangeant.', pt: 'O apetite vem com a comida.' },
      ],
    },
  ],
  pitfalls: [
    {
      title: '« Há três anos que… » → présent',
      text: 'Une action qui continue se met au présent avec **depuis**, pas au passé composé.',
      note: 'Em português usamos o presente também; o erro é traduzir "há" por "il y a" + passé composé.',
      examples: [{ fr: 'J\'**apprends** le français depuis deux ans. (et non « j\'ai appris »)', pt: 'Aprendo francês há dois anos.' }],
    },
    {
      title: '« Se eu puder » → si + présent',
      note: 'O futuro do subjuntivo não existe em francês: depois de "si", use o presente.',
      examples: [{ fr: 'Si je **peux**, je passerai te voir.', pt: 'Se eu puder, passo para te ver.' }],
    },
    {
      title: '« Estou fazendo » → je fais',
      text: 'Le français n\'a pas de forme progressive avec un participe : présent simple ou **être en train de**.',
      examples: [{ fr: 'Qu\'est-ce que tu **fais** ? — Je **cuisine**.', pt: 'O que você está fazendo? — Estou cozinhando.' }],
    },
  ],
  memory: [
    'Apprenez les verbes du 3e groupe par leurs **trois bases** : je **dois**, nous **devons**, ils **doivent** — tout le reste suit.',
    'Seuls quatre verbes font « ils » en **-ont** : ils **v**ont, ils **o**nt, ils **f**ont, ils **s**ont (aller, avoir, faire, être).',
    'Seuls être, faire et dire ont « vous » sans -ez : vous **êtes**, vous **faites**, vous **dites**.',
    'Au 1er groupe, je, tu, il et ils se prononcent pareil : **-e, -es, -e, -ent** sont muets.',
  ],
};
