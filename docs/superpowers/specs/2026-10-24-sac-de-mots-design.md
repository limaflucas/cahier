# Sac de mots — design

Status: draft for approval · 2026-10-24

## Why

The learner wants to group related words (a theme such as « maison » or « cuisine ») so they can study each group later. Mes mots is a single flat collection; Sac de mots adds named lists on top of it, each word optionally illustrated with a picture, and lets Memoir and Conjugaison draw from chosen lists.

## Goals

- Create, rename and delete named lists ("sacs"), each with an optional emoji.
- Add words to a list from the header search: first from Mes mots, otherwise from the dictionary.
- Manage a list's words like Mes mots: same rows, sorting, removing.
- Attach one picture per word per list: paste, upload, link, or pick a suggestion.
- Let Memoir and Conjugaison draw either from Mes mots or from chosen lists.

## Non-goals (for now)

- Showing on Mes mots which lists a word belongs to.
- Pictures in Mes mots or Memoir.
- Sharing lists, several users, nested lists, manual reordering.

## Anti-goals

- Losing a word the learner saved themselves because a list changed.
- A list action silently removing words from Mes mots.
- Anything reaching production users before the feature is complete.

## Words, lists and Mes mots

A word belongs to Mes mots when **the learner saved it themselves** (on `/mot/<mot>`) **or it is in at least one list**.

| Action | Effect |
|---|---|
| Add a word to a list | It joins the list and, through it, Mes mots. A word can be in several lists. |
| Retirer a word from a list | It leaves the list. It stays in Mes mots if it was saved directly or is still in another list; otherwise it leaves Mes mots too. |
| Delete a list | Same rule for each of its words. |
| Unsave on `/mot/<mot>` | Only possible while the word is in no list (see below), so it removes the word from Mes mots. |

- When Retirer also takes the word out of Mes mots, the word is removed right away and a notice says « « bateau » retiré du sac et de Mes mots » with a **Le garder dans Mes mots** button, which turns it into a directly saved word.
- Deleting a list whose words would leave Mes mots: the inline confirmation offers **Supprimer le sac et ses mots** or **Supprimer le sac, garder les mots dans Mes mots**.
- On `/mot/<mot>`, while the word is in one or more lists, the save button reads « Dans N sacs » and cannot be clicked; the learner removes the word from its lists instead.
- Everything that reads Mes mots today (Mes mots page, Memoir, « Autre verbe de mes mots », the dictionary's `saved` flag) sees the union: direct saves plus list words.

## A list

- **Name:** required, trimmed, 1–60 characters, unique ignoring case and accents (« Été », « ete » and « ÉTÉ » clash).
- **Emoji:** optional, one emoji. Picked from a grid of about 30 suggestions or typed. Nothing is shown when there is none.
- **Address:** a stable numeric id. Page `/sac-de-mots/<id>`, API `/api/lists/<id>`. Renaming never breaks a link.

## Pages

### Menu

« Sac de mots », right after « Mes mots ». On phones the top menu scrolls sideways.

### `/sac-de-mots`: the lists

- Title « Sac de mots (n) », a **Nouveau sac** button that opens an inline form (name and emoji), and a sort switch: **Date** (newest first, the default) or **A→Z**. The page remembers the choice in this browser.
- One row per list: emoji, name (opens the list), word count (« 12 mots »), a pencil for inline rename, and **Supprimer** as the last element on the right, with an inline confirmation (no browser pop-up).
- The header search filters lists by name.

### `/sac-de-mots/<id>`: one list

- Title with emoji and name, pencil (inline rename), sort switch (**Date d'ajout**, newest first by default, or **A→Z**; remembered separately from the lists page), and **Supprimer** as the last element on the right.
- One row per word, as on Mes mots (word linking to `/mot/<mot>`, classification, key meanings, date added) plus a picture thumbnail on the left and a **Retirer** button.
- Empty list: « Ce sac est vide. Tapez un mot dans la recherche en haut pour l'ajouter. »

### Header search on a list page

- Placeholder « Ajouter un mot à « Maison »… ».
- Typing filters the list's own words and opens a dropdown of matching Mes mots words not yet in the list; recent searches are not shown there. Clicking a suggestion or pressing Enter on it adds it immediately and clears the search.
- Enter with no suggestion chosen looks the text up in the dictionary, as Mes mots does:
  - exactly one headword, spelled as typed: it is added;
  - otherwise (an inflected form such as « mangeait » → « manger », or several headwords such as « plier » and « se plier »): the learner picks between what they typed and each headword;
  - nothing found: « Aucun résultat pour « … ». », nothing added;
  - dictionary down: « Le dictionnaire est indisponible pour le moment. ».
- A word already in the list: « « maison » est déjà dans le sac. »

## Pictures

- One picture **per word per list**: « maison » can look different in each list. At most 5 MB, JPEG, PNG, WebP or GIF, shrunk to 800 px wide at most before saving (an animated GIF stops moving).
- The picture area opens on the new row right after a word is added, and can be skipped. Every row can add, change or remove its picture later. Clicking a thumbnail shows it larger.
- Ways in: paste a copied image (⌘V), paste or type a link, drop a file, or choose a file.
- **Links:** `https` only. A direct image, or a web page whose preview image (`og:image`) is taken. Cahier fetches it server-side and keeps its own copy. The fetch refuses home-network and loopback addresses, stops at 5 MB and 10 seconds.
- **Suggestions**, shown in the picture area when they exist: first the pictures this word already has in other lists (one click reuses it), then Reverso's pictures. Reverso attaches pictures to some senses (about 16% of cached words have one); each suggestion shows the sense it belongs to. A chosen suggestion is copied like a link.
- **On `/mot/<mot>`**: a row of thumbnails under the word, one per list that has a picture for it, labelled with the list's emoji and name; clicking one opens that list. Reverso pictures are not shown there.

## Where Memoir and Conjugaison take words from

- An either-or selector: **Mes mots** (every word in Mes mots, list words included) or **Sacs** (only the words of the lists ticked below it).
- On the Memoir page and on the Conjugaison start page. In the game, « Autre verbe de mes mots » follows the same choice and becomes « Autre verbe de ma sélection ».
- Default: Mes mots, which matches today. Each page remembers its own choice in this browser.
- Too few words for Memoir, or no verb for Conjugaison: say so and point to the selector.

## Moving an install

`scripts/import-data.js` carries lists, list words and pictures, merging like Mes mots and safe to re-run.

## Delivery

Trunk-based, as the repo requires. Every step is its own short-lived branch and PR **into `master`**, test first, approved and merged by the learner. Each one deploys to production behind the Unleash flag **`sac-de-mots`**, which stays off in production until the feature is complete. Each step is a working piece the learner can try with the flag on.

| # | Piece |
|---|---|
| 1 | Flag, menu entry, lists page and empty list pages: create, rename, delete, sort, filter. This document ships with it. |
| 2 | Add Mes mots words to a list from the header search; list rows; sort; Retirer (these words never leave Mes mots). |
| 3 | Add words from the dictionary (choices, no result, already in the list); Retirer follows the rules above, with the notice and « Le garder dans Mes mots ». |
| 4 | Deleting a list with words, with the keep choice; « Dans N sacs » on the word page. |
| 5 | Pictures by upload, drop and paste; thumbnails; larger view; change; remove. |
| 6 | Pictures from links. |
| 7 | Suggestions: reuse from other lists, Reverso; the picture area opens on a new word. |
| 8 | Pictures on the word page. |
| 9 | Memoir selector. |
| 10 | Conjugaison selector and « Autre verbe de ma sélection ». |
| 11 | Import script. |
| 12 | Turn the flag on in production, then remove it from the code. |

### Flag behaviour

- Off: no menu entry; `/sac-de-mots…` behaves like an unknown page; every list and picture endpoint answers 404; the selectors, « Dans N sacs » and word-page pictures are hidden. The database tables exist regardless.
- E2E tests run the feature against a server with `FLAGS_OVERRIDE=sac-de-mots=on` and check that it is hidden with the flag off. The smoke suite checks that the list API follows the flag reported by `/api/flags`, and `deploy.yml` expects `sac-de-mots` among the Unleash flags.

## Calls made by the builder (not discussed)

- A word's date in Mes mots is the earliest of its direct save and its first list addition.
- A word's picture in a list is deleted when the word leaves that list. A reused picture is a copy, so changing one never changes the other.
- A→Z sorting follows French order, ignoring case and accents.
- On `/sac-de-mots`, Enter in the header search opens the word page, as everywhere else outside a list.
- The « Le garder dans Mes mots » notice stays until the next action on the page.
- Memoir with **Sacs** chosen but no list ticked counts as too few words.

## Left to the builder

Database schema, endpoint payloads and status codes, the emoji set, styling within the existing look, the client-side image resizing method, and how the import remaps list ids.
