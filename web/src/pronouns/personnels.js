import { PERSONS, f } from './forms.js';

export default {
  id: 'personnels',
  name: 'Pronoms personnels sujets',
  label: 'Personnel sujet',
  hue: 45,
  chapter: 21,
  summary: {
    fr: "Ils disent qui fait l'action. En français, le sujet est obligatoire, sauf à l'impératif.",
    pt: 'Dizem quem faz a ação. Em francês o sujeito é obrigatório, exceto no imperativo.',
  },
  forms: {
    columns: PERSONS,
    rows: [
      { label: 'sujet', cells: [[f('je', { elided: "j'" })], [f('tu')], [f('il'), f('elle'), f('on')], [f('nous')], [f('vous')], [f('ils'), f('elles')]] },
    ],
  },
  uses: [
    {
      title: 'Le sujet est toujours exprimé',
      text: 'Contrairement au portugais, la terminaison du verbe ne suffit pas : le pronom est obligatoire.',
      examples: [
        { fr: '**Je** parle français. (et non « parle français »)', pt: 'Falo francês.' },
        { fr: '**Il** pleut depuis ce matin.', pt: 'Está chovendo desde hoje de manhã.' },
      ],
    },
    {
      title: 'tu ou vous',
      text: "**tu** pour un proche, un enfant ou un collègue qui vous tutoie ; **vous** pour une personne qu'on vouvoie, ou pour plusieurs personnes.",
      examples: [
        { fr: '**Tu** viens ce soir, Marc ?', pt: 'Você vem hoje à noite, Marc?' },
        { fr: 'Madame, **vous** pouvez signer ici ?', pt: 'A senhora pode assinar aqui?' },
      ],
    },
    {
      title: "on remplace nous à l'oral",
      text: 'Le verbe reste à la 3e personne du singulier.',
      examples: [
        { fr: '**On** va au cinéma ce soir ?', pt: 'A gente vai ao cinema hoje?' },
        { fr: '**On** a gagné le match hier !', pt: 'A gente ganhou o jogo ontem!' },
      ],
    },
    {
      title: 'ils pour un groupe mixte',
      text: "Il suffit d'un seul masculin dans le groupe pour employer **ils**.",
      examples: [{ fr: 'Marie et Paul ? **Ils** sont déjà partis.', pt: 'A Marie e o Paul? Eles já foram embora.' }],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
