import { compoundDerivation } from './derivations.js';

export default {
  id: 'passeCompose',
  name: 'Passé composé',
  mood: 'Indicatif',
  derivedFrom: compoundDerivation('au présent'),
  summary: {
    fr: 'Une action achevée dans le passé, souvent avec une conséquence dans le présent.',
    pt: 'Uma ação concluída no passado, muitas vezes com consequência no presente.',
  },
  formation: {
    rule: 'Auxiliaire **avoir** ou **être** au **présent** + **participe passé**.',
    auxiliary: {
      avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
      être: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    },
    notes: [
      '**Être** avec les verbes de mouvement ou de changement d\'état (aller, venir, partir, arriver, naître, mourir, rester, tomber…) et avec **tous les verbes pronominaux**.',
      'Avec être, le participe s\'accorde avec le **sujet** : elle est parti**e**, ils sont venu**s**.',
      'Avec avoir, il s\'accorde avec le **COD placé avant** : les lettres que j\'ai écrit**es**.',
    ],
  },
  models: ['parler', 'aller', 'se lever'],
  uses: [
    {
      title: 'Action ponctuelle achevée',
      examples: [
        { fr: 'Hier, j\'**ai rencontré** ta sœur au marché.', pt: 'Ontem encontrei sua irmã na feira.' },
        { fr: 'Elle **est née** à Dakar en 1998.', pt: 'Ela nasceu em Dakar em 1998.' },
      ],
    },
    {
      title: 'Succession d\'événements dans un récit',
      examples: [
        { fr: 'Il **est entré**, il **a posé** son sac et il **s\'est assis**.', pt: 'Ele entrou, largou a mochila e se sentou.' },
      ],
    },
    {
      title: 'Expérience et bilan',
      examples: [
        { fr: 'Tu **as** déjà **lu** Proust ?', pt: 'Você já leu Proust?' },
        { fr: 'Nous **avons visité** trois fois le Japon.', pt: 'Visitamos o Japão três vezes.' },
      ],
    },
    {
      title: 'Action passée dont le résultat compte maintenant',
      examples: [{ fr: 'J\'**ai perdu** mes clés : je ne peux pas rentrer.', pt: 'Perdi minhas chaves: não consigo entrar em casa.' }],
    },
  ],
  advanced: [
    {
      title: 'Accord avec le COD antéposé',
      text: 'Avec **avoir**, le participe s\'accorde avec le COD s\'il est placé **avant** le verbe (que, le, la, les, quel…).',
      examples: [
        { fr: 'La décision qu\'ils **ont prise** était risquée.', pt: 'A decisão que eles tomaram era arriscada.' },
        { fr: 'Ces photos, je les **ai prises** à Rome.', pt: 'Essas fotos, eu tirei em Roma.' },
      ],
    },
    {
      title: 'Verbes à double auxiliaire',
      text: 'Sortir, monter, descendre, passer, rentrer, retourner : **être** sans COD, **avoir** avec un COD — et le sens change.',
      examples: [
        { fr: 'Elle **est sortie** ce soir. / Elle **a sorti** le chien.', pt: 'Ela saiu hoje à noite. / Ela levou o cachorro para passear.' },
        { fr: 'Nous **sommes passés** par Lyon. / Nous **avons passé** une semaine à Lyon.', pt: 'Passamos por Lyon. / Passamos uma semana em Lyon.' },
      ],
    },
    {
      title: 'Pronominaux : accord selon la fonction du pronom',
      text: 'On accorde si le pronom est COD ; pas d\'accord s\'il est COI ou si le COD vient après.',
      examples: [
        { fr: 'Elle s\'est **lavée**. / Elle s\'est **lavé** les mains.', pt: 'Ela se lavou. / Ela lavou as mãos.' },
        { fr: 'Ils se sont **parlé** pendant des heures.', pt: 'Eles conversaram durante horas.' },
      ],
    },
    {
      title: 'Passé composé ou passé simple ?',
      text: 'À l\'écrit littéraire, le **passé simple** remplace le passé composé (« il entra, il posa son sac »). À l\'oral et dans la presse, on utilise le passé composé.',
      examples: [{ fr: 'Il **entra**, **posa** son sac et **s\'assit**. (littéraire)', pt: 'Ele entrou, largou a mochila e se sentou.' }],
    },
  ],
  pitfalls: [
    {
      title: 'Pretérito perfeito ≠ toujours passé composé',
      text: 'Pour un décor, un état ou une habitude dans le passé, le français exige l\'**imparfait**.',
      note: '"Quando eu era criança, eu morava no Rio": os dois verbos descrevem uma situação, não um evento.',
      examples: [{ fr: 'Quand j\'**étais** petit, j\'**habitais** à Rio. (et non « j\'ai habité »)', pt: 'Quando eu era criança, eu morava no Rio.' }],
    },
    {
      title: 'Pronominal → toujours être',
      note: '"Eu me enganei" usa o auxiliar être em francês, nunca avoir.',
      examples: [{ fr: 'Je **me suis trompé** de numéro. (et non « je m\'ai trompé »)', pt: 'Liguei para o número errado.' }],
    },
    {
      title: '« Há dois anos » (= atrás) → il y a',
      text: '**Il y a** + durée situe un événement terminé ; **depuis** + présent décrit ce qui dure encore.',
      examples: [{ fr: 'Je **suis arrivé** en France il y a deux ans.', pt: 'Cheguei à França há dois anos.' }],
    },
  ],
  memory: [
    '**DR & MRS VANDERTRAMP** : Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir — les verbes qui prennent être.',
    '**La maison d\'être** : on y naît, on arrive, on entre, on monte, on descend, on sort, on part, on tombe par la fenêtre… et on y meurt.',
    'Un COD possible après le verbe ? → **avoir** (elle a sorti **la poubelle**). Aucun COD ? → **être** (elle est sortie).',
  ],
};
