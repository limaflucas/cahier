export default {
  title: 'COD et COI',
  summary: {
    fr: "Le complément d'objet direct et le complément d'objet indirect : ce qu'ils sont, comment les reconnaître, et les règles qui en dépendent, des pronoms à l'accord du participe passé, jusqu'aux finesses des niveaux B2 et C1.",
    pt: 'O objeto direto e o objeto indireto: o que são, como reconhecê-los e as regras que dependem deles, dos pronomes à concordância do particípio, até as sutilezas dos níveis B2 e C1.',
  },
  parts: {
    whatTheyAre: { id: 'ce-que-c-est', title: "Ce que c'est" },
    spotting: { id: 'les-reperer', title: 'Les repérer' },
    basics: { id: 'regles-de-base', title: 'Règles de base' },
    advanced: { id: 'niveau-b2-c1', title: 'Niveau B2–C1' },
    pitfalls: { id: 'pieges-pour-lusophones', title: 'Pièges pour lusophones' },
  },
  legend: [
    { kind: 'COD', hint: 'sans préposition : qui ? quoi ?', pt: 'objeto direto' },
    { kind: 'COI', hint: 'après à, de… : à qui ? de quoi ?', pt: 'objeto indireto' },
  ],
  intros: {
    lookalikes: 'Ces compléments ressemblent à un COD ou à un COI sans en être. Pour chacun, un test permet de trancher.',
    spotting: 'Une méthode en quatre étapes, puis des exemples de plus en plus difficiles.',
    basics: "Niveaux A2 et B1 : les pronoms, leur place dans la phrase et l'accord du participe passé.",
    advanced: "Les finesses qui font la différence à l'écrit et à l'oral soutenu.",
    pitfalls: 'Le portugais ne construit pas toujours ces verbes comme le français : ces écarts causent la plupart des erreurs.',
  },

  definitions: [
    {
      kind: 'COD',
      text: "Il complète le verbe **directement**, sans préposition : c'est l'être ou la chose sur qui porte l'action. On le trouve en posant la question **qui ?** ou **quoi ?** juste après le verbe.",
      pt: 'É o objeto direto: completa o verbo sem preposição.',
      forms: [
        { label: 'un groupe nominal', fr: 'Elle lit {COD:un roman}.', pt: 'Ela lê um romance.' },
        { label: 'un pronom', fr: 'Elle {COD:le} lit.', pt: 'Ela o lê.' },
        { label: 'un infinitif', fr: 'Il veut {COD:partir}.', pt: 'Ele quer ir embora.' },
        { label: 'une proposition', fr: "Je pense {COD:qu'il viendra}.", pt: 'Acho que ele virá.' },
      ],
    },
    {
      kind: 'COI',
      text: "Il complète le verbe **par une préposition**, presque toujours **à** ou **de**, parfois sur, en ou contre. On le trouve avec les questions **à qui ? à quoi ? de qui ? de quoi ?** La préposition n'est pas libre : c'est le verbe qui la choisit (parler à, se souvenir de, compter sur).",
      pt: 'É o objeto indireto: completa o verbo por meio de uma preposição, que depende do verbo.',
      forms: [
        { label: 'un groupe nominal', fr: 'Il parle {COI:à son frère}.', pt: 'Ele fala com o irmão.' },
        { label: 'un pronom', fr: 'Il {COI:lui} parle.', pt: 'Ele fala com ele.' },
        { label: 'un infinitif', fr: 'Pense {COI:à fermer la porte}.', pt: 'Lembre-se de fechar a porta.' },
        { label: 'une proposition', fr: 'Je tiens {COI:à ce que tu viennes}.', pt: 'Faço questão de que você venha.' },
      ],
    },
  ],
  portuguese: {
    fr: "Le portugais fait la même distinction : le COD est l'objeto direto, le COI l'objeto indireto. Mais les deux langues ne donnent pas toujours la même construction au même verbe (remercier quelqu'un, agradecer a alguém) : vérifiez toujours la construction française.",
    pt: 'O português faz a mesma distinção, mas a regência nem sempre coincide: confira sempre a construção francesa.',
  },
  lookalikes: [
    {
      title: "L'attribut du sujet",
      text: "Après un **verbe d'état** (être, devenir, sembler, paraître, rester, demeurer, avoir l'air, passer pour), le mot qui suit **qualifie le sujet** : il ne reçoit aucune action.",
      test: "Le sujet et l'attribut désignent la même chose (Paul = médecin). L'attribut s'accorde avec le sujet et se remplace par le invariable, même au féminin ou au pluriel.",
      examples: [
        { fr: 'Paul est **médecin**. / Paul consulte {COD:un médecin}.', pt: 'Paulo é médico. / Paulo consulta um médico.' },
        { fr: 'Elles sont devenues **célèbres**. → Elles **le** sont devenues.', pt: 'Elas ficaram famosas. → Ficaram.' },
      ],
    },
    {
      title: "L'attribut du COD",
      text: "Avec trouver, rendre, croire, juger, nommer, élire, appeler ou considérer comme, un adjectif ou un nom peut **qualifier le COD** : c'est son attribut, pas un second complément.",
      test: 'On peut relier les deux par être : je trouve cette ville belle → cette ville est belle. Cet attribut s\'accorde avec le COD.',
      examples: [
        { fr: 'Je trouve {COD:cette ville} **belle**.', pt: 'Acho esta cidade bonita.' },
        { fr: "Ses collègues {COD:l'}ont élue **présidente**.", pt: 'Os colegas a elegeram presidente.' },
      ],
    },
    {
      title: 'Les compléments circonstanciels',
      text: "Ils donnent le **cadre** de l'action : lieu, temps, manière, cause, but, moyen. Ils répondent à où ? quand ? comment ? pourquoi ? et non à qui ? ou quoi ?",
      test: 'On peut presque toujours les **déplacer** ou les **supprimer** sans casser la phrase. Un COD ou un COI, lui, reste attaché au verbe.',
      examples: [
        { fr: '**Le soir**, elle lit {COD:le journal} **dans le métro**.', pt: 'À noite, ela lê o jornal no metrô.' },
        { fr: 'Il a parlé {COI:à son patron} **à cause de la grève**.', pt: 'Ele falou com o chefe por causa da greve.' },
      ],
    },
    {
      title: 'Les compléments de lieu des verbes de déplacement',
      text: "Après aller, venir, arriver, habiter, partir ou rentrer, un complément en à ou de n'est **pas un COI** : il indique un **lieu** et répond à où ? ou d'où ? La grammaire traditionnelle le range parmi les compléments circonstanciels de lieu ; on le dit aussi essentiel, car on ne peut pas le supprimer.",
      test: 'Posez la question : je vais où ? → à Paris (un lieu) ; je pense à quoi ? → à Paris (un COI). Les deux se remplacent par y, jamais par lui ou leur.',
      examples: [
        { fr: "Je vais **à Paris**. → J'**y** vais.", pt: 'Vou a Paris. → Vou lá.' },
        { fr: 'Elle vient **de Lyon**. → Elle **en** vient.', pt: 'Ela vem de Lyon. → Ela vem de lá.' },
        { fr: "Je pense {COI:à Paris}. → J'{COI:y} pense.", pt: 'Penso em Paris. → Penso nisso.' },
      ],
    },
    {
      title: 'Du, de la, des : article ou préposition ?',
      text: 'Du, de la, des et de peuvent être des **articles** (partitifs ou indéfinis) : ils font alors partie du COD. Ils peuvent aussi être la **préposition de**, seule ou contractée (de + le = du, de + les = des) : ils introduisent alors un COI, ou un complément de lieu.',
      test: "Changez de déterminant. Je mange du pain → je mange le pain : la phrase tient, c'est un article (COD). Je parle du film → je parle le film : impossible, c'est la préposition (COI).",
      examples: [
        { fr: "Je mange {COD:du pain}. → J'{COD:en} mange.", pt: 'Eu como pão.' },
        { fr: "Je parle {COI:du film}. → J'{COI:en} parle.", pt: 'Falo do filme. → Falo dele.' },
        { fr: 'Elle revient **du marché**.', pt: 'Ela está voltando da feira.' },
      ],
    },
    {
      title: "Le COS, ou complément d'objet second",
      text: "Quand un verbe a **deux compléments d'objet**, le second est souvent appelé COS. Ce n'est pas une troisième sorte de complément : c'est un COI, qui se remplace par lui, leur, en ou y. Verbes typiques : donner, offrir, prêter, envoyer, dire, demander, promettre, apprendre, montrer quelque chose à quelqu'un.",
      test: 'Posez les deux questions : quoi ? donne le COD, à qui ? donne le COS.',
      examples: [
        { fr: "J'ai prêté {COD:ma voiture} {COI:à Léa}. → Je {COD:la} {COI:lui} ai prêtée.", pt: 'Emprestei meu carro para a Léa. → Emprestei-o a ela.' },
        { fr: 'Elle a parlé {COI:de son projet} {COI:à ses collègues}. → Elle {COI:leur} {COI:en} a parlé.', pt: 'Ela falou do projeto com os colegas. → Ela falou disso com eles.' },
      ],
    },
    {
      title: "Le complément d'agent",
      text: "Dans une phrase **passive**, par (parfois de) introduit celui qui fait l'action. Ce n'est pas un COI : c'est le sujet de la phrase active.",
      test: "Remettez la phrase à l'actif : le complément d'agent redevient sujet.",
      examples: [
        { fr: 'Le projet a été accepté **par le jury**. → Le jury a accepté {COD:le projet}.', pt: 'O projeto foi aceito pelo júri. → O júri aceitou o projeto.' },
        { fr: 'Elle est aimée **de tous**.', pt: 'Ela é amada por todos.' },
      ],
    },
    {
      title: "Les compléments du nom et de l'adjectif",
      text: "De et à introduisent aussi des compléments qui dépendent d'un **nom** ou d'un **adjectif**, pas du verbe.",
      test: "Cherchez le mot que le complément précise : s'il disparaît avec un nom ou un adjectif, ce n'est pas un complément du verbe.",
      examples: [
        { fr: 'Le livre **de Paul** est sur la table.', pt: 'O livro do Paulo está na mesa.' },
        { fr: 'Elle est fière **de son fils**. / Elle parle {COI:de son fils}.', pt: 'Ela tem orgulho do filho. / Ela fala do filho.' },
      ],
    },
    {
      title: 'Les compléments de mesure et de prix',
      text: "Avec coûter, valoir, peser, mesurer, durer, vivre, courir ou dormir pris au sens propre, le complément indique une **quantité** : un prix, un poids, une durée. Ce n'est pas un COD, même sans préposition.",
      test: "Il répond à combien ? plutôt qu'à quoi ?, et la phrase n'a pas de passif (« vingt euros sont coûtés » est impossible). Au sens figuré, en revanche, c'est un vrai COD.",
      examples: [
        { fr: 'Ce livre coûte **vingt euros**.', pt: 'Este livro custa vinte euros.' },
        { fr: 'Il a couru **deux heures**. / Il a couru {COD:un grand risque}.', pt: 'Ele correu duas horas. / Ele correu um grande risco.' },
      ],
    },
    {
      title: 'Le sujet placé après un verbe impersonnel',
      text: "Dans une tournure **impersonnelle** (il manque, il reste, il arrive, il existe), le groupe placé après le verbe en est le **sujet réel**, qu'on appelle aussi séquence de l'impersonnel : ce n'est pas un COD.",
      test: 'Retournez la phrase : il manque deux chaises → deux chaises manquent.',
      examples: [
        { fr: 'Il manque **deux chaises**.', pt: 'Faltam duas cadeiras.' },
        { fr: 'Il est arrivé **un accident**.', pt: 'Aconteceu um acidente.' },
      ],
    },
    {
      title: 'Les verbes transitifs employés seuls',
      text: "Un verbe qui peut avoir un COD s'emploie aussi **sans complément** (emploi absolu) : la phrase n'a alors pas de COD.",
      test: "Ne cherchez pas un COD absent : il mange n'en a pas, il mange une pomme en a un.",
      examples: [
        { fr: 'Ne {COD:le} dérange pas, il **mange**.', pt: 'Não o incomode, ele está comendo.' },
        { fr: "Elle **écrit** depuis l'âge de dix ans. / Elle écrit {COD:des romans}.", pt: 'Ela escreve desde os dez anos. / Ela escreve romances.' },
      ],
    },
  ],

  method: [
    'Trouvez le **verbe conjugué** et son sujet.',
    'Posez la question **qui ? ou quoi ?** juste après le verbe : la réponse est le **COD**. Posez **à qui ? à quoi ? de qui ? de quoi ?** : la réponse est le **COI**. Une réponse à où ? quand ? comment ? ou combien ? est un autre complément.',
    'Vérifiez en **remplaçant** par un pronom : le, la, les (ou en, après un article indéfini ou partitif) pour un COD ; lui, leur, y ou en pour un COI.',
    'Dernier test pour le COD : la phrase passe **au passif**, et le COD en devient le sujet (Marie lit le roman → le roman est lu par Marie). Un COI ne le peut pas, sauf après obéir, désobéir et pardonner (vous êtes pardonné). Quelques verbes, comme avoir ou comporter, n\'ont pas de passif.',
  ],
  examples: [
    { level: 'A2', fr: 'Elle achète {COD:du pain}.', question: 'Elle achète quoi ? → {COD:du pain}', pt: 'Ela compra pão.' },
    { level: 'A2', fr: 'Nous attendons {COD:le bus}.', question: 'Nous attendons quoi ? → {COD:le bus}', pt: 'Estamos esperando o ônibus.' },
    { level: 'A2', fr: 'Il téléphone {COI:à sa mère} tous les soirs.', question: 'Il téléphone à qui ? → {COI:à sa mère}', pt: 'Ele liga para a mãe todas as noites.' },
    {
      level: 'A2',
      fr: "J'écris {COD:une carte postale} {COI:à mes amis}.",
      question: "J'écris quoi ? → {COD:une carte postale} · à qui ? → {COI:à mes amis}",
      pt: 'Escrevo um cartão-postal para os meus amigos.',
    },
    { level: 'B1', fr: 'Tu connais {COD:Julie} ? — Oui, je {COD:la} connais bien.', question: 'Je connais qui ? → {COD:la} (Julie)', pt: 'Você conhece a Julie? — Sim, conheço bem.' },
    {
      level: 'B1',
      fr: 'Ton frère ? Je {COI:lui} ai envoyé {COD:un message}.',
      question: "J'ai envoyé quoi ? → {COD:un message} · à qui ? → {COI:lui} (à ton frère)",
      pt: 'Seu irmão? Mandei uma mensagem para ele.',
    },
    {
      level: 'B1',
      fr: "Il se souvient {COI:de son premier jour d'école}.",
      question: "Il se souvient de quoi ? → {COI:de son premier jour d'école}",
      pt: 'Ele se lembra do primeiro dia de aula.',
    },
    { level: 'B1', fr: 'Tes clés ? Je {COD:les} ai trouvées sous le canapé.', question: "J'ai trouvé quoi ? → {COD:les} (tes clés)", pt: 'Suas chaves? Encontrei embaixo do sofá.' },
    { level: 'B2', fr: "Je crois {COD:qu'il a raison}. → Je {COD:le} crois.", question: "Je crois quoi ? → {COD:qu'il a raison}", pt: 'Acho que ele tem razão. → Acho.' },
    {
      level: 'B2',
      fr: 'Ces photos, je {COD:les} {COI:lui} ai montrées hier.',
      question: "J'ai montré quoi ? → {COD:les} (ces photos) · à qui ? → {COI:lui}",
      pt: 'Essas fotos, eu mostrei para ele ontem.',
    },
    {
      level: 'B2',
      fr: "Le film {COI:dont} tu {COI:m'}as parlé passe ce soir.",
      question: "Tu m'as parlé de quoi ? → {COI:dont} (du film) · à qui ? → {COI:m'} (à moi)",
      pt: 'O filme de que você me falou passa hoje à noite.',
    },
    { level: 'B2', fr: "C'est un projet {COI:auquel} je tiens beaucoup.", question: 'Je tiens à quoi ? → {COI:auquel} (à ce projet)', pt: 'É um projeto ao qual tenho muito apego.' },
    {
      level: 'C1',
      fr: "Ce qu'il m'a dit, je ne {COD:l'}ai jamais répété.",
      question: "Je n'ai jamais répété quoi ? → {COD:l'} (ce qu'il m'a dit)",
      pt: 'O que ele me disse, eu nunca repeti.',
    },
    {
      level: 'C1',
      fr: 'Le garagiste ? Je {COI:lui} ai fait réparer {COD:ma voiture}.',
      question: "J'ai fait réparer quoi ? → {COD:ma voiture} · à qui ? → {COI:lui} (au garagiste)",
      pt: 'O mecânico? Mandei ele consertar meu carro.',
    },
    {
      level: 'C1',
      fr: 'Dites-{COI:moi} {COD:où vous voulez aller}.',
      question: 'Dites quoi ? → {COD:où vous voulez aller} · à qui ? → {COI:moi}',
      pt: 'Diga-me aonde vocês querem ir.',
    },
    {
      level: 'C1',
      fr: "Elle {COI:s'}est permis {COD:quelques remarques}.",
      question: "Elle a permis quoi ? → {COD:quelques remarques} · à qui ? → {COI:s'} (à elle-même)",
      pt: 'Ela se permitiu alguns comentários.',
    },
  ],

  basics: [
    {
      id: 'pronoms',
      level: 'A2',
      title: 'Les pronoms COD et COI',
      text: "Pour ne pas répéter un complément, on le remplace par un pronom. Seule la 3e personne distingue les deux : **le, la, les** pour le COD, **lui, leur** pour le COI. Me, te, nous et vous servent pour les deux. Devant une voyelle ou un h muet, me, te, le et la deviennent m', t', l'.",
      table: {
        head: ['', 'COD', 'COI'],
        rows: [
          ['je', "me, m'", "me, m'"],
          ['tu', "te, t'", "te, t'"],
          ['il, elle', "{COD:le, la, l'}", '{COI:lui}'],
          ['nous', 'nous', 'nous'],
          ['vous', 'vous', 'vous'],
          ['ils, elles', '{COD:les}', '{COI:leur}'],
        ],
      },
      examples: [
        { fr: 'Tu vois {COD:Marc} ? → Tu {COD:le} vois ?', pt: 'Você está vendo o Marc? → Está vendo ele?' },
        { fr: 'Tu parles {COI:à Marc} ? → Tu {COI:lui} parles ?', pt: 'Você fala com o Marc? → Fala com ele?' },
        { fr: "Il {COD:m'}attend. / Il {COI:m'}écrit.", pt: 'Ele está me esperando. / Ele me escreve.' },
      ],
    },
    {
      id: 'lui-leur',
      level: 'A2',
      title: 'Lui et leur : des personnes, après à',
      text: 'Lui (singulier) et leur (pluriel) remplacent **à + une personne** (ou un animal), au masculin comme au féminin. Le pronom leur ne prend jamais de s : ne le confondez pas avec le possessif leurs.',
      examples: [
        { fr: "J'écris {COI:à ma grand-mère}. → Je {COI:lui} écris.", pt: 'Escrevo para a minha avó. → Escrevo para ela.' },
        { fr: 'Il a répondu {COI:à ses clients}. → Il {COI:leur} a répondu.', pt: 'Ele respondeu aos clientes. → Ele respondeu a eles.' },
        { fr: 'Je {COI:leur} rends {COD:leurs livres}.', pt: 'Devolvo a eles os livros deles.' },
      ],
    },
    {
      id: 'place',
      level: 'A2',
      title: 'La place du pronom : avant le verbe',
      text: "Le pronom se place **juste avant le verbe conjugué**, donc avant l'auxiliaire aux temps composés. La négation encadre le bloc pronom + verbe.",
      examples: [
        { fr: 'Je {COD:la} vois. → Je ne {COD:la} vois pas.', pt: 'Eu a vejo. → Não a vejo.' },
        { fr: "Je {COD:l'}ai vue. → Je ne {COD:l'}ai pas vue.", pt: 'Eu a vi. → Não a vi.' },
        { fr: 'Tu {COI:leur} as téléphoné ?', pt: 'Você ligou para eles?' },
      ],
    },
    {
      id: 'en',
      level: 'B1',
      title: 'En : une quantité, ou un complément en de',
      text: '**En** remplace un COD introduit par un article indéfini ou partitif (un, une, des, du, de la) ou par une quantité : on répète alors le nombre ou la quantité à la fin. Il remplace aussi un COI introduit par **de** quand il désigne une chose.',
      examples: [
        { fr: 'Tu veux {COD:du café} ? → Tu {COD:en} veux ?', pt: 'Você quer café? → Quer?' },
        { fr: "J'ai {COD:trois frères}. → J'{COD:en} ai trois.", pt: 'Tenho três irmãos. → Tenho três.' },
        { fr: 'Il parle {COI:de son travail}. → Il {COI:en} parle.', pt: 'Ele fala do trabalho. → Ele fala disso.' },
      ],
    },
    {
      id: 'y',
      level: 'B1',
      title: 'Y : à + une chose',
      text: "**Y** remplace un COI introduit par **à** quand il désigne une **chose** ou une idée (penser à, réfléchir à, s'intéresser à, participer à, répondre à une question). Il remplace aussi un complément de lieu (j'y vais), qui n'est pas un COI.",
      examples: [
        { fr: 'Tu penses {COI:à ton examen} ? → Tu {COI:y} penses ?', pt: 'Você está pensando na prova? → Está pensando nisso?' },
        { fr: 'Elle a répondu {COI:à la question}. → Elle {COI:y} a répondu.', pt: 'Ela respondeu à pergunta. → Ela respondeu.' },
        { fr: 'Elle a répondu {COI:au professeur}. → Elle {COI:lui} a répondu.', pt: 'Ela respondeu ao professor. → Ela respondeu a ele.' },
      ],
    },
    {
      id: 'a-lui',
      level: 'B1',
      title: 'Je lui parle, mais je pense à lui',
      text: "Avec quelques verbes, à + une personne ne devient pas lui ou leur : on garde **à + pronom tonique** (moi, toi, lui, elle, nous, vous, eux, elles) après le verbe. C'est le cas de penser à, songer à, tenir à, faire attention à, renoncer à, et des verbes pronominaux suivis de à (s'intéresser à, s'habituer à, s'adresser à).",
      examples: [
        { fr: 'Je parle {COI:à Julie}. → Je {COI:lui} parle.', pt: 'Falo com a Julie. → Falo com ela.' },
        { fr: 'Je pense {COI:à Julie}. → Je pense {COI:à elle}. (et non « je lui pense »)', pt: 'Penso na Julie. → Penso nela.' },
        { fr: "Il s'intéresse {COI:à ses élèves}. → Il s'intéresse {COI:à eux}.", pt: 'Ele se interessa pelos alunos. → Ele se interessa por eles.' },
      ],
    },
    {
      id: 'de-lui',
      level: 'B1',
      title: "De + une personne : de lui, d'elle",
      text: 'Pour un COI en **de**, en remplace une chose ; pour une **personne**, on préfère **de + pronom tonique**.',
      examples: [
        { fr: "Tu te souviens {COI:de ce voyage} ? → Tu t'{COI:en} souviens ?", pt: 'Você se lembra dessa viagem? → Você se lembra?' },
        { fr: 'Tu te souviens {COI:de Paul} ? → Tu te souviens {COI:de lui} ?', pt: 'Você se lembra do Paulo? → Você se lembra dele?' },
        { fr: "On parle beaucoup {COI:de cette actrice}. → On parle beaucoup {COI:d'elle}.", pt: 'Fala-se muito dessa atriz. → Fala-se muito dela.' },
      ],
    },
    {
      id: 'infinitif',
      level: 'B1',
      title: "Avec un infinitif : devant l'infinitif",
      text: "Quand un verbe est suivi d'un **infinitif** (vouloir, pouvoir, devoir, aller, venir de, savoir), le pronom se place devant l'infinitif dont il est le complément. Faire, laisser et les verbes de perception font exception : voir le niveau C1.",
      examples: [
        { fr: 'Je vais {COI:lui} écrire.', pt: 'Vou escrever para ele.' },
        { fr: 'Tu peux {COD:les} aider ?', pt: 'Você pode ajudá-los?' },
        { fr: 'Je viens de {COD:le} finir.', pt: 'Acabei de terminá-lo.' },
      ],
    },
    {
      id: 'imperatif',
      level: 'B1',
      title: "À l'impératif affirmatif : après le verbe",
      text: "À l'impératif **affirmatif**, le pronom suit le verbe, avec un trait d'union ; me et te deviennent **moi** et **toi**. À l'impératif **négatif**, il reprend sa place avant le verbe. Devant en et y, les verbes en -er gardent leur s : manges-en, vas-y.",
      examples: [
        { fr: 'Regarde-{COD:la} ! → Ne {COD:la} regarde pas !', pt: 'Olhe para ela! → Não olhe para ela!' },
        { fr: 'Téléphone-{COI:moi} ce soir. → Ne {COI:me} téléphone pas.', pt: 'Me liga hoje à noite. → Não me ligue.' },
        { fr: 'Des cerises ? Manges-{COD:en} !', pt: 'Cerejas? Coma algumas!' },
      ],
    },
    {
      id: 'deux-pronoms',
      level: 'B1',
      title: 'Deux pronoms : un ordre fixe',
      text: "Avec deux pronoms avant le verbe, l'ordre ne change jamais :",
      order: ['me, te, se, nous, vous', '{COD:le, la, les}', '{COI:lui, leur}', 'y', 'en'],
      examples: [
        { fr: 'Il {COI:me} {COD:le} donne.', pt: 'Ele me dá isso.' },
        { fr: 'Je {COD:la} {COI:lui} prête.', pt: 'Eu a empresto para ele.' },
        { fr: 'Je {COI:vous} {COD:en} apporte deux.', pt: 'Eu trago dois para vocês.' },
      ],
    },
    {
      id: 'accord-participe',
      level: 'B1',
      title: "L'accord du participe passé avec le COD placé avant",
      text: "Avec **avoir**, le participe passé ne s'accorde jamais avec le sujet. Il s'accorde avec le **COD** quand celui-ci est placé **avant** le verbe : pronom (le, la, l', les, me, te, nous, vous), relatif que, ou groupe interrogatif (quelle robe, combien de livres). Il ne s'accorde **jamais avec un COI**.",
      examples: [
        { fr: "J'ai acheté {COD:des fleurs}. → Je {COD:les} ai acheté**es**.", pt: 'Comprei flores. → Comprei-as.' },
        { fr: 'Les lettres {COD:que} tu as écrit**es**.', pt: 'As cartas que você escreveu.' },
        { fr: '{COD:Quelle robe} as-tu choisi**e** ?', pt: 'Que vestido você escolheu?' },
        { fr: 'Ces amies, je {COI:leur} ai parlé hier.', pt: 'Essas amigas, falei com elas ontem.' },
      ],
      see: { to: '/temps-verbaux#participePasse', label: 'Temps verbaux : le participe passé' },
    },
  ],

  advanced: [
    {
      id: 'pronominaux',
      level: 'B2',
      title: 'Verbes pronominaux : se est-il COD ou COI ?',
      text: "Aux temps composés, les pronominaux prennent **être**, mais leur participe suit la règle d'avoir : il s'accorde avec le COD placé avant. Tout dépend donc de se : COD (laver quelqu'un → elle s'est lavée) ou COI (parler à quelqu'un → ils se sont parlé). Si le COD vient **après** le verbe, pas d'accord. Les verbes qui n'existent qu'à la forme pronominale (s'évanouir, se souvenir, s'enfuir, se moquer) s'accordent avec le sujet.",
      examples: [
        { fr: "Elle {COD:s'}est lavé**e**.", pt: 'Ela se lavou.' },
        { fr: "Elle {COI:s'}est lavé {COD:les mains}.", pt: 'Ela lavou as mãos.' },
        { fr: 'Ils {COI:se} sont parlé pendant des heures.', pt: 'Eles conversaram durante horas.' },
        { fr: 'Elles se sont souvenu**es** {COI:de tout}.', pt: 'Elas se lembraram de tudo.' },
      ],
    },
    {
      id: 'relatifs',
      level: 'B2',
      title: 'Que, dont, à qui, auquel : le relatif suit la construction du verbe',
      text: "Le pronom relatif prend la fonction du complément qu'il remplace : **que** pour un COD, **dont** pour un complément en de, **à qui** (personnes) ou **auquel, à laquelle, auxquels, auxquelles** pour un COI en à. Pour choisir, retrouvez la construction du verbe de la relative.",
      examples: [
        { fr: 'Le roman {COD:que} je lis.', pt: 'O romance que estou lendo.' },
        { fr: "Le roman {COI:dont} je {COI:t'}ai parlé.", pt: 'O romance de que te falei.' },
        { fr: "La collègue {COI:à qui} j'ai écrit.", pt: 'A colega para quem escrevi.' },
        { fr: 'Les questions {COI:auxquelles} il a répondu.', pt: 'As perguntas às quais ele respondeu.' },
      ],
    },
    {
      id: 'le-neutre',
      level: 'B2',
      title: 'Le neutre : reprendre une idée',
      text: "**Le**, invariable, reprend toute une idée ou une proposition COD : je le sais, je le crois, je l'espère. Il reprend aussi un attribut, adjectif ou nom, même au féminin ou au pluriel ; ce n'est alors pas un COD.",
      examples: [
        { fr: 'Elle est partie ? — Oui, je {COD:le} sais.', pt: 'Ela foi embora? — Sim, eu sei.' },
        { fr: 'Il va pleuvoir ? — Je {COD:le} crains.', pt: 'Vai chover? — Receio que sim.' },
        { fr: 'Fatiguées, elles **le** sont vraiment.', pt: 'Cansadas, elas estão mesmo.' },
      ],
    },
    {
      id: 'y-en-idees',
      level: 'B2',
      title: 'Y et en : reprendre une phrase entière',
      text: "Comme le, **y** et **en** reprennent toute une proposition, selon la construction du verbe : y pour à cela (tenir à ce que, s'attendre à ce que), en pour de cela (se douter que, se souvenir que, se plaindre que).",
      examples: [
        { fr: "Tu viendras ? J'{COI:y} tiens.", pt: 'Você vem? Faço questão.' },
        { fr: "Il va refuser, je m'{COI:en} doute.", pt: 'Ele vai recusar, imagino.' },
        { fr: "Qu'il soit en retard ? On s'{COI:y} attendait.", pt: 'Que ele se atrasasse? Já esperávamos.' },
      ],
    },
    {
      id: 'sens-construction',
      level: 'B2',
      title: 'Un verbe, plusieurs constructions, plusieurs sens',
      text: "Beaucoup de verbes changent de sens selon qu'ils ont un COD ou un COI, et selon la préposition. Apprenez toujours le sens avec la construction.",
      examples: [
        { fr: 'Il a manqué {COD:le train}. / Tu {COI:me} manques. / Il manque {COI:de patience}.', pt: 'Ele perdeu o trem. / Sinto sua falta. / Falta-lhe paciência.' },
        { fr: 'Elle joue {COI:au tennis}. / Elle joue {COI:du piano}.', pt: 'Ela joga tênis. / Ela toca piano.' },
        { fr: 'Je crois {COD:Paul}. / Je crois {COI:en Dieu}. / Je crois {COI:au progrès}.', pt: 'Acredito no Paulo (no que ele diz). / Acredito em Deus. / Acredito no progresso.' },
        { fr: 'Il tient {COI:à sa mère}. / Il tient {COI:de sa mère}.', pt: 'Ele é apegado à mãe. / Ele puxou à mãe.' },
      ],
    },
    {
      id: 'personne-cod-coi',
      level: 'B2',
      title: "Aider quelqu'un à, conseiller à quelqu'un de : qui est le COD ?",
      text: "Devant un infinitif, regardez ce qui est le COD. Si c'est l'infinitif (conseiller quelque chose à quelqu'un), la personne est **COI** : conseiller, permettre, interdire, défendre, demander, dire, proposer, promettre, ordonner à quelqu'un de. Si c'est la personne (aider quelqu'un à quelque chose), l'infinitif est un COI : aider, encourager, inviter, obliger, forcer quelqu'un à ; empêcher, persuader, convaincre, prier, remercier quelqu'un de.",
      examples: [
        { fr: "J'aide {COD:mes voisins} {COI:à déménager}. → Je {COD:les} aide {COI:à déménager}.", pt: 'Ajudo meus vizinhos a se mudar. → Eu os ajudo a se mudar.' },
        { fr: "J'ai conseillé {COI:à Léa} {COD:de partir}. → Je {COI:lui} ai conseillé {COD:de partir}.", pt: 'Aconselhei a Léa a ir embora. → Aconselhei-a a ir embora.' },
        { fr: 'On {COD:les} a empêchés {COI:de sortir}. / On {COI:leur} a interdit {COD:de sortir}.', pt: 'Eles foram impedidos de sair. / Eles foram proibidos de sair.' },
      ],
    },
    {
      id: 'imperatif-deux-pronoms',
      level: 'B2',
      title: "Deux pronoms à l'impératif affirmatif",
      text: "À l'impératif affirmatif, l'ordre change : le **COD vient d'abord**, puis le COI, puis y et en, tous reliés par des traits d'union. Moi et toi deviennent m' et t' devant en et y. À l'impératif négatif, on revient à l'ordre habituel.",
      order: ['verbe', '{COD:le, la, les}', '{COI:moi, toi, lui, nous, vous, leur}', 'y', 'en'],
      examples: [
        { fr: 'Donne-{COD:le}-{COI:moi} !', pt: 'Me dá isso!' },
        { fr: 'Rends-{COD:les}-{COI:leur}.', pt: 'Devolva-os a eles.' },
        { fr: "Donne-{COI:m'}{COD:en} un peu.", pt: 'Me dá um pouco.' },
        { fr: 'Ne {COD:le} {COI:lui} dis pas.', pt: 'Não diga isso a ele.' },
      ],
    },
    {
      id: 'accord-infinitif',
      level: 'C1',
      title: "Participe passé suivi d'un infinitif",
      text: "Avec voir, entendre, regarder, écouter, sentir ou envoyer suivis d'un infinitif, le participe s'accorde avec le COD placé avant **si ce COD fait l'action de l'infinitif**. S'il la subit, c'est le COD de l'infinitif, et le participe reste invariable.",
      examples: [
        { fr: "Les musiciens {COD:que} j'ai entendu**s** jouer.", pt: 'Os músicos que eu ouvi tocar.' },
        { fr: "Les airs {COD:que} j'ai entendu jouer.", pt: 'As melodias que eu ouvi tocar.' },
        { fr: "Elle {COD:s'}est vu**e** tomber. / Elle {COI:s'}est vu remettre {COD:un prix}.", pt: 'Ela se viu cair. / Ela recebeu um prêmio.' },
      ],
    },
    {
      id: 'fait-laisse',
      level: 'C1',
      title: 'Fait et laissé devant un infinitif',
      text: "**Fait** suivi d'un infinitif ne s'accorde jamais : le COD appartient à tout le groupe faire + infinitif. Pour **laissé**, les rectifications de l'orthographe de 1990 recommandent aussi l'invariable ; l'accord traditionnel, qui suit la règle d'entendu, reste admis.",
      examples: [
        { fr: 'Ces maisons, il {COD:les} a **fait** construire.', pt: 'Essas casas, ele mandou construir.' },
        { fr: "Elle {COI:s'}est **fait** couper {COD:les cheveux}.", pt: 'Ela cortou o cabelo (no salão).' },
        { fr: 'Je {COD:les} ai **laissé** partir. (accord traditionnel : laissés)', pt: 'Eu os deixei partir.' },
      ],
    },
    {
      id: 'faire-faire',
      level: 'C1',
      title: 'Faire faire : où vont les pronoms ?',
      text: "Avec faire ou laisser suivis d'un infinitif, les pronoms se placent **devant faire**, jamais devant l'infinitif. Si l'infinitif a déjà son propre COD, celui qui fait l'action est introduit par **à** (ou par) : c'est un COI, remplacé par lui ou leur.",
      examples: [
        { fr: 'Je fais venir {COD:le plombier}. → Je {COD:le} fais venir.', pt: 'Mando chamar o encanador. → Mando chamá-lo.' },
        { fr: 'Je fais réparer {COD:la voiture} {COI:au garagiste}. → Je {COD:la} {COI:lui} fais réparer.', pt: 'Mando o mecânico consertar o carro. → Mando ele consertar.' },
        { fr: 'Fais-{COD:les} entrer.', pt: 'Mande-os entrar.' },
      ],
    },
    {
      id: 'pronominaux-invariables',
      level: 'C1',
      title: 'Se succéder, se plaire, se nuire : un participe qui ne bouge pas',
      text: "Quand se est COI et qu'aucun COD ne précède, le participe reste invariable : se parler, se téléphoner, se sourire, se mentir, se nuire, se ressembler, se succéder, se suffire, se plaire, se déplaire, se complaire.",
      examples: [
        { fr: 'Les ministres {COI:se} sont succédé.', pt: 'Os ministros se sucederam.' },
        { fr: 'Elles {COI:se} sont plu dès le premier jour.', pt: 'Elas gostaram uma da outra desde o primeiro dia.' },
        { fr: 'Ils {COI:se} sont souri.', pt: 'Eles sorriram um para o outro.' },
      ],
    },
    {
      id: 'datif-possession',
      level: 'C1',
      title: 'Il lui a pris la main : le COI à la place du possessif',
      text: "Pour une **partie du corps**, le français préfère un pronom COI suivi de l'article défini plutôt qu'un possessif : le pronom dit à qui appartient la partie du corps.",
      examples: [
        { fr: 'Il {COI:lui} a pris {COD:la main}. (plus naturel que « il a pris sa main »)', pt: 'Ele pegou na mão dela.' },
        { fr: 'Je {COI:me} suis cassé {COD:la jambe}.', pt: 'Quebrei a perna.' },
        { fr: 'Elle {COI:se} lave {COD:les cheveux} tous les jours.', pt: 'Ela lava o cabelo todos os dias.' },
      ],
    },
    {
      id: 'mesure',
      level: 'C1',
      title: 'Coûter, valoir, peser : mesure ou vrai COD ?',
      text: 'Au sens propre, coûter, valoir, peser, mesurer, durer, vivre et courir ont un complément de **mesure** (combien ?) : ce n\'est pas un COD, donc pas d\'accord. Au sens figuré, le complément devient un vrai COD, et le participe s\'accorde.',
      examples: [
        { fr: "Les deux cents euros que ce vélo {COI:m'}a coûté.", pt: 'Os duzentos euros que essa bicicleta me custou.' },
        { fr: "Les efforts {COD:que} ce travail {COI:m'}a coûté**s**.", pt: 'Os esforços que esse trabalho me custou.' },
        { fr: "Les quatre-vingts kilos qu'il a pesé autrefois. / Les bagages {COD:qu'}il a pesé**s**.", pt: 'Os oitenta quilos que ele já pesou. / As malas que ele pesou.' },
      ],
    },
    {
      id: 'en-accord',
      level: 'C1',
      title: "En et l'accord du participe",
      text: "Avec **en** COD, le participe reste en principe **invariable** : en ne transmet ni genre ni nombre. Après un adverbe de quantité placé avant (combien, autant, tant), certains grammairiens admettent l'accord ; l'invariable reste la règle générale.",
      examples: [
        { fr: 'Des fautes, il {COD:en} a fait beaucoup.', pt: 'Erros, ele cometeu muitos.' },
        { fr: "Des lettres ? J'{COD:en} ai reçu trois.", pt: 'Cartas? Recebi três.' },
        { fr: 'Ces lettres, je {COD:les} ai toutes lu**es**.', pt: 'Essas cartas, eu li todas.' },
      ],
    },
    {
      id: 'te-presenter-a-lui',
      level: 'C1',
      title: 'Je te présenterai à lui : deux pronoms qui ne se combinent pas',
      text: 'Quand le COD est me, te, se, nous ou vous, le COI ne peut pas être lui ou leur devant le verbe : il passe après le verbe, sous la forme **à + pronom tonique**.',
      examples: [
        { fr: 'Je {COD:te} présenterai {COI:à lui}. (et non « je te lui présenterai »)', pt: 'Vou te apresentar a ele.' },
        { fr: "Elle {COD:s'}est adressé**e** {COI:à lui}.", pt: 'Ela se dirigiu a ele.' },
      ],
    },
  ],

  pitfalls: {
    groups: [
      {
        title: 'COD en français, objeto indireto em português',
        verbs: [
          { fr: "remercier quelqu'un", pronoun: 'je {COD:le} remercie', pt: 'agradecer a alguém' },
          { fr: 'aimer quelque chose', pronoun: "je {COD:l'}aime", pt: 'gostar de algo' },
          { fr: "regarder quelqu'un", pronoun: 'je {COD:la} regarde', pt: 'olhar para alguém' },
          { fr: "attendre quelqu'un", pronoun: "je {COD:l'}attends", pt: 'esperar por alguém' },
          { fr: "épouser quelqu'un", pronoun: "il {COD:l'}a épousée", pt: 'casar com alguém' },
          { fr: "croire quelqu'un", pronoun: 'je {COD:le} crois', pt: 'acreditar em alguém' },
          { fr: "appeler quelqu'un", pronoun: "je {COD:l'}appelle", pt: 'ligar para alguém' },
          { fr: 'se rappeler quelque chose', pronoun: 'je me {COD:le} rappelle', pt: 'lembrar-se de algo' },
        ],
      },
      {
        title: 'COI en français, objeto direto ou outra preposição em português',
        verbs: [
          { fr: "téléphoner à quelqu'un", pronoun: 'je {COI:lui} téléphone', pt: 'ligar para alguém' },
          { fr: "parler à quelqu'un", pronoun: 'je {COI:lui} parle', pt: 'falar com alguém' },
          { fr: "ressembler à quelqu'un", pronoun: 'je {COI:lui} ressemble', pt: 'parecer com alguém' },
          { fr: "obéir à quelqu'un", pronoun: 'je {COI:lui} obéis', pt: 'obedecer alguém' },
          { fr: "pardonner à quelqu'un", pronoun: 'je {COI:lui} pardonne', pt: 'perdoar alguém' },
          { fr: "conseiller à quelqu'un de", pronoun: 'je {COI:lui} conseille de…', pt: 'aconselhar alguém a' },
          { fr: "plaire à quelqu'un", pronoun: 'ça {COI:lui} plaît', pt: 'agradar alguém (ele gosta disso)' },
          { fr: "manquer à quelqu'un", pronoun: 'tu {COI:me} manques', pt: 'sentir falta de alguém (sinto sua falta)' },
          { fr: 'profiter de quelque chose', pronoun: "j'{COI:en} profite", pt: 'aproveitar algo' },
          { fr: "penser à quelqu'un", pronoun: 'je pense {COI:à lui}', pt: 'pensar em alguém' },
          { fr: "rêver de quelqu'un", pronoun: 'je rêve {COI:de lui}', pt: 'sonhar com alguém' },
        ],
      },
    ],
    points: [
      {
        title: 'Le pronom va avant le verbe, jamais après',
        note: 'No Brasil se diz “eu vi ele”, “ajudei ela”. Em francês, o pronome objeto é átono e vem antes do verbo: nunca “j’ai vu lui”.',
        examples: [
          { fr: "Je {COD:l'}ai vu hier. (et non « j'ai vu lui »)", pt: 'Eu vi ele ontem.' },
          { fr: "Je {COD:l'}ai aidée {COI:à porter ses valises}.", pt: 'Ajudei ela a carregar as malas.' },
        ],
      },
      {
        title: 'Lui ne veut pas dire você',
        note: 'Em português, “lhe” virou pronome de “você” (eu lhe digo = digo a você). Em francês, lui é só “a ele, a ela”; para “você”, use te ou vous.',
        examples: [
          { fr: 'Je {COI:vous} dis {COD:la vérité}.', pt: 'Eu lhe digo a verdade.' },
          { fr: 'Je {COD:vous} remercie.', pt: 'Eu lhe agradeço.' },
        ],
      },
      {
        title: 'Le pronom ne disparaît pas',
        note: 'Em português, o objeto some: “Você viu o filme? — Vi.” Em francês, o verbo pede o pronome.',
        examples: [
          { fr: "Tu as vu {COD:le film} ? — Oui, je {COD:l'}ai vu.", pt: 'Você viu o filme? — Vi.' },
          { fr: "Tu sais {COD:qu'il part} ? — Oui, je {COD:le} sais.", pt: 'Você sabe que ele vai embora? — Sei.' },
        ],
      },
      {
        title: "En et y n'existent pas en portugais",
        note: 'O português não tem equivalente de en e y, mas em francês eles são obrigatórios.',
        examples: [
          { fr: "Tu as {COD:des enfants} ? — Oui, j'{COD:en} ai deux.", pt: 'Você tem filhos? — Tenho dois.' },
          { fr: "Tu penses {COI:à ton voyage} ? — Oui, j'{COI:y} pense.", pt: 'Você pensa na viagem? — Penso.' },
        ],
      },
    ],
  },

  memory: [
    "**Qui ? quoi ?** sans préposition : COD. **À qui ? de quoi ?** : COI. **Où ? quand ? comment ? combien ?** : ni l'un ni l'autre.",
    '**Lui, leur** : des personnes, après à. **Y** : des choses, après à. **En** : après de, ou avec une quantité.',
    "L'ordre des pronoms : **me te se nous vous → le la les → lui leur → y → en**. Y passe toujours avant en, comme dans « il y en a ».",
    "Le participe avec **avoir** regarde en arrière : il ne s'accorde qu'avec un COD déjà apparu, jamais avec un COI, jamais avec en.",
    "Apprenez chaque verbe **avec sa construction** (remercier quelqu'un, téléphoner à quelqu'un, se souvenir de quelque chose) : c'est elle qui choisit le pronom.",
  ],
};
