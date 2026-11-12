# Rappel and Constructions: design

Two review games for Cahier. Both pick their cards from the words saved in Mes mots, and both use one review schedule that remembers every item between sessions. The user approved this design's defaults on 2026-11-11.

## Why

Cahier's only vocabulary game, Memoir, is four-option multiple choice and forgets everything once the session ends. The research behind these games:

- **Retrieval beats recognition.** Pulling a word out of memory beats re-reading or choosing it: about 80% recalled a week later against about a third (Karpicke & Roediger 2008). Flashcard-style recall kept 73% of words on delayed tests, against 24% for fill-in-the-blank from a word bank (Webb, Yanagisawa & Uchihara 2020).
- **Spacing works.** Spaced reviews have a medium-to-large effect on L2 learning, with longer gaps winning on delayed tests (Kim & Webb 2022).
- **Collocations are a trap for Portuguese speakers.** Collocations with no word-for-word equivalent in the learner's first language are hard (Peters 2016). Contrast with that language helps (Laufer & Girsai 2008). Matching or multiple-choice exercises plant wrong pairings (Boers et al. 2014).
- **Gender endings help.** About 80% of French nouns have an ending that predicts their gender (Lyster 2006).

## Goals

- **Rappel:** type a saved word from memory into one of its example sentences.
- **Constructions · Prépositions:** type the missing preposition in a verb's example sentence, then see how Portuguese says it.
- **Constructions · Genre:** choose the article of a saved noun (`___ maison` → `la`).
- **Schedule:** one review schedule for all three games, stored on the server so phone and computer share it.

## Non-goals

- Practising a Sac de mots list (later).
- Due counts in the menu.
- Streaks, points or leaderboards.
- Portuguese gender contrast in Genre (it would need a Claude call per noun).
- Nouns that take both genders (`mf`) and plural-only nouns.

## Anti-goals

- **No choosing a construction from options.** Prepositions are typed or tapped from the fixed list of prepositions, never chosen among whole wrong phrases.
- **No surprise Claude spending.** Claude is called once per verb, in the background, and never per answer.
- **No per-item SQLite statements.** A session costs a constant number of queries: production SQLite sits on GlusterFS, where each statement is slow.

## The schedule

- **Items.** One per game per item: a saved word for Rappel and Genre, a verb's construction for Prépositions.
- **Gaps.** 1 → 3 → 7 → 14 → 30 → 60 → 120 days (120 repeats). The first right answer schedules the item 1 day later; each further right answer moves one gap up.
- **A miss** sends the item back to the 1-day gap.
- **A hint** (Rappel's first letter): a right answer after a hint keeps the current gap.
- **"Right"** covers a right answer, a missing accent, the dictionary form instead of the sentence's form (Rappel), and a preposition typed without its contraction (`à` for `au`).
- **New items:** 10 a day per game. Saved words come in newest first, and a newly saved word goes to the front.
- **What counts.** Only the first answer to an item in a session counts. A missed item comes back three cards later, until it is answered right once.
- **Days** are the learner's calendar days. The browser sends its local date (`YYYY-MM-DD`); the server falls back to its own date.
- **Removing a word** from Mes mots deletes its progress in every game.

## Rappel

- **The card.** One of the word's key meanings (the up to three shown in Mes mots), a different one on each review, in turn. The cue is an example sentence from that meaning with the word blanked, the Portuguese translations, and the Portuguese sentence when Reverso has one.
- **No sentence.** When no example of that meaning contains the word, the card shows the French definition and the translations instead, and the answer is the dictionary form.
- **The answer** is the form the sentence uses (`pensait`, `belles`). The dictionary form counts as right but shows the expected form. Missing accents count as right but are flagged.
- **Buttons.** "Indice" reveals the first letter. After a wrong verdict, "J'avais raison" turns it into right, for typos.

## Constructions · Prépositions

- **Which constructions.** Those of the verbs in Mes mots (the word page's "prépositions" section).
- **More fields.** Each construction gains:
  - `gap`: the example with the preposition replaced by `___`;
  - `answer`: the preposition exactly as written (`à`, `au`, `d'`), or `""` when French takes none;
  - `portuguese`: the Brazilian Portuguese construction, e.g. `pensar em alguém/algo`;
  - `differsFromPortuguese`: whether a word-for-word translation from Portuguese gets the preposition wrong.
- **No-preposition constructions.** Claude also lists constructions where Portuguese uses a preposition and French doesn't (`gostar de` → `aimer qqch`).
- **Unusable constructions.** A construction whose `gap` does not give back its example when `answer` is put in the blank is skipped.
- **Refreshing old data.** Verbs whose cached constructions predate these fields, or have none, are fetched again in the background: one verb at a time, each at most once per server run, started when the game loads. The game says how many verbs are still being prepared.
- **The card:**
  - the gap sentence and the construction's Portuguese meaning;
  - a text field plus buttons for the common prepositions and "sans préposition";
  - after answering, the construction, its Portuguese equivalent and, when they differ, "≠ português".
- **Contractions.** `à` for `au` counts as right, with the note "à + le = au".
- **Order.** One item per construction; cards of the same verb are kept apart.

## Constructions · Genre

- **Which nouns:** saved words whose first part of speech is a noun with a single gender, `m` or `f`.
- **The card:** `___ maison` with the Portuguese translation. A noun starting with a vowel or `h` asks `un`/`une`, because `l'` hides the gender. Otherwise it asks `le`/`la`.
- **Answering:** two buttons, also keys `1` and `2`.
- **Feedback:** the article and noun, plus the ending's usual gender when the noun's first word has a known ending (`-aison`: feminine). When the noun goes against its ending, it is shown as an exception.

## Pages and flags

- **Pages.** `/rappel` (flag `cahier-rappel`). `/constructions/prepositions` and `/constructions/genre` (flag `cahier-constructions`), with `/constructions` opening Prépositions.
- **Menu.** Both games go after Memoir and appear only while their flag is on.
- **API.** Behind the same flags:
  - `GET /api/rappel/session?today=` and `POST /api/rappel/answers`;
  - the same pair under `/api/constructions/prepositions` and `/api/constructions/genre`.
- **Flags.** Both are off in production until the user rolls them out. Removing them is a later PR.

## Delivery

Three PRs, each one commit, stacked in this order:

1. Schedule and Rappel.
2. Prépositions.
3. Genre.
