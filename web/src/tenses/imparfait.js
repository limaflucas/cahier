import { fromPresentNous } from './derivations.js';

export default {
  id: 'imparfait',
  name: 'Imparfait',
  mood: 'Indicatif',
  derivedFrom: fromPresentNous,
  summary: {
    fr: 'Le décor du passé : descriptions, habitudes, actions en cours.',
    pt: 'O pano de fundo do passado: descrições, hábitos, ações em andamento.',
  },
  formation: {
    rule: 'Radical de **« nous » au présent** (sans -ons) + terminaisons.',
    endings: [{ label: null, forms: ['-ais', '-ais', '-ait', '-ions', '-iez', '-aient'] }],
    notes: [
      'Une seule exception : **être** → **ét-** (j\'étais).',
      '-cer / -ger : je commen**ç**ais, je mang**e**ais, mais nous commen**c**ions, nous mang**i**ons.',
      'Radical en -i ou en -y : nous étudi**ions**, vous pay**iez**.',
    ],
  },
  models: ['parler', 'finir', 'prendre'],
  uses: [
    {
      title: 'Description, décor, état',
      examples: [
        { fr: 'Il **faisait** froid et la ville **dormait** encore.', pt: 'Fazia frio e a cidade ainda dormia.' },
        { fr: 'Ma grand-mère **avait** les yeux verts.', pt: 'Minha avó tinha olhos verdes.' },
      ],
    },
    {
      title: 'Habitude passée',
      examples: [
        { fr: 'Chaque été, nous **allions** en Bretagne.', pt: 'Todo verão, a gente ia para a Bretanha.' },
        { fr: 'Avant, je **fumais** un paquet par jour.', pt: 'Antes, eu fumava um maço por dia.' },
      ],
    },
    {
      title: 'Action en cours, interrompue par un événement',
      text: 'L\'imparfait installe la scène, le **passé composé** fait surgir l\'événement.',
      examples: [{ fr: 'Je **prenais** ma douche quand le téléphone a sonné.', pt: 'Eu estava tomando banho quando o telefone tocou.' }],
    },
    {
      title: 'Hypothèse sur le présent',
      text: '**Si** + imparfait → conditionnel présent.',
      examples: [{ fr: 'Si j\'**avais** le temps, je lirais davantage.', pt: 'Se eu tivesse tempo, leria mais.' }],
    },
  ],
  advanced: [
    {
      title: 'Imparfait de politesse',
      text: 'Il atténue une demande en la plaçant dans le passé.',
      examples: [
        { fr: 'Je **voulais** vous demander un service.', pt: 'Eu queria pedir um favor ao senhor.' },
        { fr: 'Je **venais** pour l\'annonce de l\'appartement.', pt: 'Eu vim por causa do anúncio do apartamento.' },
      ],
    },
    {
      title: 'Suggestion avec « et si »',
      examples: [{ fr: 'Et si on **allait** au cinéma ce soir ?', pt: 'E se a gente fosse ao cinema hoje à noite?' }],
    },
    {
      title: 'Discours indirect au passé',
      text: 'Un présent rapporté après un verbe au passé devient imparfait.',
      examples: [{ fr: 'Elle m\'a dit qu\'elle **était** fatiguée.', pt: 'Ela me disse que estava cansada.' }],
    },
    {
      title: 'Imparfait hypothétique et imparfait narratif',
      text: 'Hypothétique : un fait qui a failli se produire. Narratif (écrit, presse) : un événement ponctuel présenté comme un tableau.',
      examples: [
        { fr: 'Un pas de plus et il **tombait**.', pt: 'Mais um passo e ele caía.' },
        { fr: 'Le lendemain, il **quittait** Paris pour toujours.', pt: 'No dia seguinte, ele deixava Paris para sempre.' },
      ],
    },
    {
      title: 'Venir de et être en train de au passé',
      examples: [{ fr: 'Il **venait de** partir quand tu es arrivé.', pt: 'Ele tinha acabado de sair quando você chegou.' }],
    },
  ],
  pitfalls: [
    {
      title: '« Se eu fosse » → si + imparfait',
      note: 'Depois de "si", nunca o conditionnel: o imperfeito do subjuntivo português vira imparfait.',
      examples: [{ fr: 'Si j\'**étais** riche, j\'achèterais une maison à la mer. (et non « si je serais »)', pt: 'Se eu fosse rico, compraria uma casa na praia.' }],
    },
    {
      title: 'Durée limitée → passé composé',
      text: 'Même pour un état, une durée **délimitée** demande le passé composé.',
      examples: [{ fr: 'J\'**ai habité** dix ans à Paris. / Quand j\'**habitais** à Paris…', pt: 'Morei dez anos em Paris. / Quando eu morava em Paris…' }],
    },
    {
      title: '« Eu estava fazendo » → je faisais',
      note: 'O imperfeito progressivo português corresponde ao imparfait simples.',
      examples: [{ fr: 'Qu\'est-ce que tu **faisais** quand je t\'ai appelé ?', pt: 'O que você estava fazendo quando eu te liguei?' }],
    },
  ],
  memory: [
    '**Imparfait = le décor, passé composé = l\'action** : imaginez un film, l\'imparfait est l\'arrière-plan, le passé composé ce qui surgit au premier plan.',
    'Nous du présent, on coupe -ons, on colle -ais : nous **finiss**ons → je **finiss**ais.',
    '-ais, -ais, -ait, -aient se prononcent tous [ɛ] : seuls **nous** et **vous** s\'entendent (-ions, -iez).',
  ],
};
