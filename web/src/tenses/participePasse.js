export default {
  id: 'participePasse',
  name: 'Participe passé',
  mood: 'Participes et gérondif',
  summary: {
    fr: 'La pièce maîtresse des temps composés et de la voix passive ; il s\'emploie aussi comme adjectif.',
    pt: 'A peça-chave dos tempos compostos e da voz passiva; também funciona como adjetivo.',
  },
  formation: {
    rule: '1er groupe → **-é** (parlé) ; 2e groupe → **-i** (fini) ; 3e groupe → **-i, -u, -is, -it, -t** (parti, vu, pris, dit, mort).',
    notes: [
      'Dans le jeu, on écrit la forme de base : **masculin singulier**.',
      'Pour trouver la consonne muette finale, passez au féminin : pri**se** → pri**s**, fai**te** → fai**t**, mor**te** → mor**t**.',
    ],
  },
  models: ['parler', 'finir', 'prendre', 'faire', 'venir', 'ouvrir'],
  uses: [
    {
      title: 'Temps composés',
      examples: [{ fr: 'J\'ai **fini**. Elle est **partie**. Nous nous sommes **levés** tôt.', pt: 'Terminei. Ela foi embora. Nós nos levantamos cedo.' }],
    },
    {
      title: 'Voix passive',
      text: '**être** + participe passé, accordé avec le sujet.',
      examples: [{ fr: 'Le projet **a été approuvé** par le conseil.', pt: 'O projeto foi aprovado pelo conselho.' }],
    },
    {
      title: 'Adjectif',
      examples: [{ fr: 'Une porte **fermée**, des fenêtres **ouvertes**.', pt: 'Uma porta fechada, janelas abertas.' }],
    },
    {
      title: 'Participe seul : l\'antériorité (écrit)',
      examples: [{ fr: '**Arrivée** à Paris, elle a cherché un logement.', pt: 'Ao chegar a Paris, ela procurou um lugar para morar.' }],
    },
  ],
  advanced: [
    {
      title: 'Avec avoir : accord avec le COD placé avant',
      examples: [
        { fr: 'Quelles villes as-tu **visitées** ?', pt: 'Que cidades você visitou?' },
        { fr: 'Les efforts qu\'il a **faits** ont payé.', pt: 'Os esforços que ele fez valeram a pena.' },
      ],
    },
    {
      title: 'Pas d\'accord avec « en »',
      examples: [{ fr: 'Des erreurs, j\'en ai **fait** beaucoup.', pt: 'Erros, eu cometi muitos.' }],
    },
    {
      title: 'Participe suivi d\'un infinitif',
      text: 'On accorde si le COD fait l\'action de l\'infinitif. **Fait** + infinitif reste toujours invariable.',
      examples: [
        { fr: 'La chanteuse que j\'ai **entendue** chanter. / La chanson que j\'ai **entendu** chanter.', pt: 'A cantora que ouvi cantar. / A canção que ouvi cantar.' },
        { fr: 'Elle s\'est **fait** couper les cheveux.', pt: 'Ela cortou o cabelo (no cabeleireiro).' },
      ],
    },
    {
      title: 'Verbes impersonnels : invariables',
      examples: [{ fr: 'Les chaleurs qu\'il a **fait** cet été…', pt: 'O calor que fez neste verão…' }],
    },
  ],
  pitfalls: [
    {
      title: 'Le particípio avec « ter » est invariable, pas en français',
      note: '"As cartas que eu tinha escrito": em francês, o particípio concorda com o COD colocado antes.',
      examples: [{ fr: 'Les lettres que j\'avais **écrites**.', pt: 'As cartas que eu tinha escrito.' }],
    },
    {
      title: 'Un seul participe par verbe',
      note: 'Nada de particípio duplo como aceitado/aceito: "accepté" serve para tudo.',
      examples: [{ fr: 'La proposition a été **acceptée**.', pt: 'A proposta foi aceita.' }],
    },
  ],
  memory: [
    'Avec **être**, le participe s\'accorde toujours avec le sujet, comme un adjectif.',
    'Avec **avoir**, on accorde seulement si le COD est déjà « apparu » avant : « Les pommes ? Je les ai **mangées**. »',
    'Astuce du féminin : « elle est mor**te** » → mort ; « une chose di**te** » → dit.',
  ],
};
