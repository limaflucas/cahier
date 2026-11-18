import { f } from './forms.js';

export default {
  id: 'relatifs',
  name: 'Pronoms relatifs',
  label: 'Relatif',
  hue: 285,
  chapter: 3556,
  summary: {
    fr: 'Ils relient deux phrases en reprenant un nom : qui sujet, que complément, dont pour « de », où pour le lieu et le temps.',
    pt: 'Ligam duas frases retomando um substantivo: qui sujeito, que complemento, dont para « de », où para lugar e tempo.',
  },
  forms: {
    list: [
      { ...f('qui'), note: "sujet du verbe qui suit : l'ami **qui** arrive" },
      { ...f('que', { elided: "qu'" }), note: "COD du verbe qui suit : le film **que** j'ai vu" },
      { ...f('quoi'), note: 'après une préposition, pour une chose vague : ce à **quoi** je pense' },
      { ...f('dont'), note: 'remplace de + … : le livre **dont** je parle' },
      { ...f('où'), note: 'lieu ou moment : la ville **où** je vis, le jour **où**…' },
      { ...f('lequel'), note: 'après une préposition : la table sur **laquelle**…' },
      { ...f('auquel'), note: 'à + lequel : le projet **auquel** je pense' },
      { ...f('duquel'), note: 'de + lequel, après une locution : le parc près **duquel**…' },
    ],
  },
  uses: [
    {
      title: 'qui sujet, que complément',
      examples: [
        { fr: "J'ai un ami **qui** habite à Nice.", pt: 'Tenho um amigo que mora em Nice.' },
        { fr: "Le film **que** j'ai vu hier était long.", pt: 'O filme que eu vi ontem era longo.' },
      ],
    },
    {
      title: 'dont : remplace de + …',
      examples: [
        { fr: "C'est le livre **dont** je t'ai parlé.", pt: 'É o livro de que te falei.' },
        { fr: "J'ai trouvé l'outil **dont** j'avais besoin.", pt: 'Encontrei a ferramenta de que eu precisava.' },
      ],
      see: { to: '/grammaire/cod-coi#relatifs', label: 'COD et COI : que, dont, à qui, auquel suivent la construction du verbe' },
    },
    {
      title: 'où : le lieu et le moment',
      examples: [
        { fr: "La maison **où** j'ai grandi a été vendue.", pt: 'A casa onde eu cresci foi vendida.' },
        { fr: 'Le jour **où** tu es arrivé, il neigeait.', pt: 'No dia em que você chegou, estava nevando.' },
      ],
    },
    {
      title: 'Après une préposition : lequel, ou qui pour une personne',
      examples: [
        { fr: 'La raison pour **laquelle** je pars est simple.', pt: 'O motivo pelo qual vou embora é simples.' },
        { fr: 'Le collègue avec **qui** je travaille est très sympa.', pt: 'O colega com quem trabalho é muito legal.' },
      ],
    },
  ],
  advanced: [],
  pitfalls: [],
  memory: [],
};
