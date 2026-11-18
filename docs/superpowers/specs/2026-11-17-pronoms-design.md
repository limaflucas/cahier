# Pronoms: design

A reference page that explains the eleven families of French pronouns, built around one table that holds every pronoun. The user approved the mockup (https://claude.ai/artifact/BzC8Nn1TsQ747LQWxhj7Qn, version 2) and its defaults on 2026-11-17, and asked for an "Emplois" block in every family.

## Why

Pronouns are where a Portuguese speaker's French breaks most often: object pronouns go before the verb, `en` and `y` have no Portuguese equivalent, and `lui`, `leur`, `le sien` don't follow Portuguese gender. Cahier already has a reference page for verb tenses (Temps verbaux). Pronoms is its counterpart: one place to look a pronoun up, see the whole system at once, and jump to the explanation.

The reference is the video [All 11 French Pronouns in One Video!](https://www.youtube.com/watch?v=Puhiz1gRaOc) (French Time). Its chapters fix the eleven families and their order.

## Goals

- **One table** with every pronoun of the eleven families.
- **Click to explain.** Clicking a pronoun, or a family's name, in the table scrolls to that family's explanation and highlights the pronoun that was clicked.
- **An explanation per family**, in the depth of Temps verbaux: summary, forms, Emplois, and later Niveau B2–C1, Pièges pour lusophones and Pour retenir.

## Non-goals

- A pronoun practice game (a separate feature, later).
- Listen buttons on the examples.
- Embedding the video; the page links to it.
- A floating "back to table" button; each section ends with a link back.

## Anti-goals

- **Content that is wrong.** Every French example must be correct, idiomatic French; every Portuguese line is Brazilian Portuguese.
- **A table that breaks the phone layout.** The page never scrolls sideways; the table scrolls inside its own box.

## The eleven families

In the video's order, each with its chapter start (seconds), its id (also the URL anchor), and its table label:

| id | Section title | Table label | Chapter |
|---|---|---|---|
| `personnels` | Pronoms personnels sujets | Personnel sujet | 21 (0:21) |
| `toniques` | Pronoms toniques | Tonique | 576 (9:36) |
| `possessifs` | Pronoms possessifs | Possessif | 875 (14:35) |
| `demonstratifs` | Pronoms démonstratifs | Démonstratif | 1330 (22:10) |
| `neutres` | Pronoms neutres | Neutre | 1582 (26:22) |
| `reflechis` | Pronoms réfléchis | Réfléchi | 2000 (33:20) |
| `cod-coi` | Pronoms COD et COI | COD / COI | 2640 (44:00) |
| `en-y` | Pronoms en et y | En / y | 3094 (51:34) |
| `relatifs` | Pronoms relatifs | Relatif | 3556 (59:16) |
| `interrogatifs` | Pronoms interrogatifs | Interrogatif | 4069 (1:07:49) |
| `indefinis` | Pronoms indéfinis | Indéfini | 4407 (1:13:27) |

Neutres holds `ce (c')`, `ceci`, `cela`, `ça`, neutral `le` and impersonal `il` (approved default).

## The page

- **Route** `/pronoms`, wide layout (like Temps verbaux). Menu entry "Pronoms" right after "Temps verbaux", before "Grammaire".
- **Header:** title "Pronoms", a French lead, its Portuguese line, and a credit line linking the video.
- **The table** ("Le tableau", anchor `tableau`), layout A of the mockup:
  - Columns, in the video's order: Personnel sujet, Tonique, Possessif, Réfléchi, COD, COI. COD and COI sit under one "COD / COI" header. Every header is a link to its family.
  - Rows: 1re sing. (je), 2e sing. (tu), 3e sing. (il, elle, on), 1re plur. (nous), 2e plur. (vous), 3e plur. (ils, elles). The row header names the person and spans the person's rows.
  - Cells merge where a form repeats: réfléchi `se` across il/elle/on and across ils/elles; COI `lui` across il/elle; COD `les` and COI `leur` across ils/elles; possessives across il/elle/on and across ils/elles.
  - `on` has no COD or COI form: those cells show "—" with a footnote (`on` takes `nous` or `vous`).
  - Elided forms show beside their pronoun: `je (j')`, `me (m')`.
  - Possessive cells list all forms (`le mien · la mienne` / `les miens · les miennes`).
  - Below the person rows, a band "Ne changent pas avec la personne" holds one row per remaining family (démonstratifs, neutres, en et y, relatifs, interrogatifs, indéfinis): its name, then its forms. Démonstratifs show only `celui celle ceux celles` and a note "+ -ci, -là, de, qui…".
  - Each family has a pastel hue (after the video thumbnail) used for its header pill, a light wash on its cells, and its section's swatch.
- **Clicking** a pronoun scrolls (smoothly, unless the visitor prefers reduced motion) to its family's section, puts the family's anchor in the URL (so Back returns to the table and links can be shared), and highlights that same pronoun in the section's Formes box for about 2.5 s. Clicking a family name does the same without highlighting a pronoun. Opening `/pronoms#cod-coi` lands on that section.
- **Each section** (anchor = family id):
  - title, a "▶ Vidéo · 44:00" link to the chapter (`…watch?v=Puhiz1gRaOc&t=2640s`, new tab);
  - summary in French and Portuguese;
  - **Formes**: the family's forms, as a small table by person (and by gender/number for possessifs and démonstratifs) or as a list with a one-line note per form;
  - **Emplois**: points (title, optional text, optional Portuguese note, examples in French with a Portuguese line), the same shape as Temps verbaux's points;
  - **Niveau B2–C1**, **Pièges pour lusophones**, **Pour retenir**: rendered only when the family has them;
  - **Pour aller plus loin**: links to the Grammaire rules that go deeper, rendered only when the family has them;
  - "↑ Tableau", back to the table.
- **Content:** the mockup's text (version 2) is the starting content: summaries, forms and Emplois for all eleven, and En et y's own nuances and pitfalls.

## Links with Grammaire

Since #25, `/grammaire/cod-coi` explains COD and COI, en and y from A2 to C1. Pronoms keeps its own page and does not repeat that page; the two link to each other (decided 2026-11-17).

- **COD et COI** keeps what the table needs: summary, Formes, Emplois. Each Emplois point links to its rule (`#pronoms`, `#lui-leur`, `#les-reperer`). Placement, the order of two pronouns, B2–C1, pitfalls and tips live only on the Grammaire page; Pour aller plus loin links to `#place`, `#deux-pronoms`, `#imperatif`, `#accord-participe`, `#niveau-b2-c1` and `#pieges-pour-lusophones`.
- **En et y** keeps its Emplois, each linked to `#en`, `#de-lui` or `#y`, and what the Grammaire page lacks: fixed expressions, no *y* before *irai*, *j'y vais* for a place. *De lui / à lui*, *j'en ai trois* and its tips go; Pour aller plus loin links to `#a-lui`, `#y-en-idees`, `#en-accord` and `#pieges-pour-lusophones`.
- **Toniques, neutres, relatifs, réfléchis** keep their points; the one a Grammaire rule deepens links to it (`#a-lui`, `#le-neutre`, `#relatifs`, `#pronominaux`).
- **Back:** the COD et COI page's header links to `/pronoms#tableau` while `cahier-pronoms` is on, and shows nothing while it is off.
- **Menu:** Temps verbaux, Pronoms (flagged), Grammaire.
- No French example sentence appears on both pages.

## Delivery

Behind the Unleash flag `cahier-pronoms` (off), in two PRs:

1. **This PR:** the route, menu entry, table, click navigation and highlight, and all eleven sections with summary, Formes and Emplois (plus the complete COD et COI and En et y sections already written).
2. **Next PR:** Niveau B2–C1, Pièges pour lusophones and Pour retenir for the nine families other than COD et COI and En et y, then remove the flag.

## Tests

- **Unit** (`test/pronouns.test.js`): eleven families in the video's order with unique ids; each has a title, table label, both summaries, forms and at least one Emplois point whose examples all have French and Portuguese; every pronoun in the table exists in its family's Formes (so the highlight always finds it); every family is reachable from the table.
- **E2E** (`test/e2e/pronoms.spec.js`): the menu and the page follow the flag; the table shows all eleven families; clicking `leur` in the COI column lands on COD et COI with `leur` highlighted and `#cod-coi` in the URL; clicking a family name lands on its section and "↑ Tableau" returns; every section has Formes, Emplois and a video link; no sideways scroll at phone width.
- **Smoke** (`test/smoke/pronoms.smoke.test.js`): the deployed bundle contains the Pronoms page.

## Left to the builder

File layout (follow `web/src/tenses/`), component split, exact hues, the highlight's look, and wording of UI strings not quoted above.
