# Rappel and Constructions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two review games, Rappel and Constructions (Prépositions, Genre), on one review schedule stored on the server.

**Architecture:**
- **Games.** A *game* turns saved words into candidate items and builds a card for an item.
- **Schedule.** One `reviews` table records each item's schedule. A pure deck function picks today's cards (due items plus up to 10 new ones).
- **API.** One generic router serves `GET /session` and `POST /answers` per game, behind the game's Unleash flag.
- **Browser.** One `ReviewSession` component runs any game: it shows the cards, brings missed ones back, and records first answers.

**Tech Stack:** Express 4, node:sqlite, React 19, React Router 7, Tailwind 4, zod + Anthropic SDK, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-11-rappel-constructions-design.md`

## Global Constraints

- Gaps in days: `[1, 3, 7, 14, 30, 60, 120]`; 10 new items per game per day.
- Flags: `cahier-rappel` (Rappel), `cahier-constructions` (Prépositions and Genre). Off: the API answers 404 `{ error: 'not_found' }` and the menu item is hidden.
- Days are `YYYY-MM-DD` strings sent by the browser (`today`); the server's own date is the fallback.
- A session costs a constant number of SQLite statements; never one per item.
- Copy is in French; JSDoc on every function and class; comments only when unavoidable.
- Test first: write unit, smoke and e2e tests, watch them fail, implement, watch them pass. Never change an existing test.
- Each PR is a single commit, stacked: `feat/rappel` → `feat/constructions-prepositions` → `feat/constructions-genre`.

## Review Focus

1. A saved word that none of its key meaning's examples contain (irregular forms, `se plier`, expressions) gets a meaning-only card, never a sentence that shows the answer. Test: `rappel.test.js`, "a meaning whose examples never contain the word gives a meaning-only card".
2. An answer at the start of a sentence (`Penser`) typed in lowercase is right. Test: `gameGrade.test.js`, "case does not matter".
3. Days roll over months and years, and impossible dates are refused (`2026-02-30`). Test: `schedule.test.js`.
4. A word removed from Mes mots in the middle of a session: `POST /answers` answers 404 `not_saved` and the page keeps going. Tests: the routes test and the e2e "a failed save does not stop the session".
5. A construction whose `gap` does not give back its example, or has no blank or two, is never shown. Duplicate patterns are shown once. Test: `constructions.test.js`.

---

## Part A — Schedule and Rappel (branch `feat/rappel`)

### Task A1: Schedule arithmetic

**Files:** Create `server/schedule.js`; Test `test/schedule.test.js`

**Interfaces — Produces:**
- `GAPS_IN_DAYS: number[]`.
- `isDay(text: unknown): boolean`.
- `addDays(day: string, days: number): string`.
- `localDay(date?: Date): string`.
- `nextReview(previous: { step: number } | undefined, outcome: 'right' | 'hinted' | 'wrong', today: string): { step: number, dueOn: string }`.

- [ ] Tests:
  - "a first right answer comes back the next day": `{ step: 0, dueOn: '2026-11-13' }` from `'2026-11-12'`.
  - "each right answer moves one gap up, and the last gap repeats": steps 0…6 give gaps 1, 3, 7, 14, 30, 60, 120, and step 6 right stays at 6 (120 days).
  - "a miss goes back to one day": from step 4 → step 0, `+1`.
  - "a hinted right answer keeps the gap": from step 3 → step 3, `+14`; new + hinted → step 0, `+1`.
  - "days roll over months and years": `addDays('2026-12-30', 3) === '2027-01-02'`, `addDays('2028-02-28', 1) === '2028-02-29'`.
  - "only real calendar days are days": `isDay('2026-02-30') === false`, `isDay('2026-11-12') === true`, `isDay('12/11/2026') === false`, `isDay(undefined) === false`.
- [ ] Run `node --test test/schedule.test.js`: fails (module missing).
- [ ] Implement with UTC date arithmetic.
- [ ] Run: passes.

### Task A2: Reviews table and deck

**Files:**
- Modify `server/db.js` (add `reviews`).
- Create `server/reviews.js` and `server/deck.js`.
- Test `test/reviews.test.js` and `test/deck.test.js`.

**Interfaces — Produces:**
- Table: `reviews(game TEXT, word TEXT REFERENCES my_words(word) ON DELETE CASCADE, item TEXT DEFAULT '', step INTEGER, due_on TEXT, introduced_on TEXT, answered INTEGER DEFAULT 0, PRIMARY KEY (game, word, item))`.
- `itemKey({ word, item }): string` (JSON of the pair).
- `createReviews(db)` → `{ progress(game): Map<itemKey, { step, dueOn, introducedOn, answered }>, record(game, { word, item }, outcome, today): { step, dueOn } | null }`. It returns null when the word is not saved (foreign-key failure, errcode 787).
- `NEW_PER_DAY = 10`.
- `buildSession({ items, progress, today, cardOf, random }): Promise<{ cards, due, fresh, total, nextDueOn }>`:
  - `items` are `{ word, item }[]`, highest priority first.
  - `cardOf(item, progress | undefined)` returns `Promise<card | null>`.
- `shuffleApart(items, groupOf, random)`.

- [ ] Reviews tests:
  - "recording creates the item with today as its first day".
  - "recording again moves it along the schedule and counts the answers" (`answered` 1 → 2).
  - "progress is per game".
  - "removing a word from Mes mots deletes its progress".
  - "an unsaved word is not recorded" (returns null).
- [ ] Deck tests:
  - "due items and new items make today's cards".
  - "new items are capped at 10 a day, minus those already started today".
  - "asking twice without answering gives the same new items".
  - "items whose card cannot be built are skipped and the next new item takes their place".
  - "nextDueOn is the soonest later due day, or null".
  - "cards of the same word are kept apart when possible" (`shuffleApart`).
- [ ] Run: both files fail.
- [ ] Implement: `progress` is one `SELECT`; `record` is one `SELECT` and one upsert. `buildSession` picks due items, then new ones until the quota is filled, then `shuffleApart`.
- [ ] Run: passes.

### Task A3: Rappel cards

**Files:**
- Modify `server/wordSummary.js` (export `keySensesOf(sections)`, full senses with `pos`; `keyMeaningsOf` maps it).
- Create `server/rappel.js`.
- Test `test/rappel.test.js`.

**Interfaces:**
- Consumes `markWord`, `inflectionsOf` (`locateWord.js`), `headwordOf` (`reverso.js`).
- Produces `rappelCard({ word, entry, forms, turn }): { word, item: '', sentence: string | null, answer, portuguese: string | null, translations, definition, pos, level } | null`.
  - `sentence` marks the answer with `**`.
  - `translations` holds up to 3.
- Produces `rappelGame({ myWords, dictionary, formsOf, logger })` → `{ flag: 'cahier-rappel', name: 'rappel', items(): Promise<{ items }>, cardOf(item, progress) }`.
  - `turn` = `progress?.answered ?? 0`.
  - A dictionary failure gives `null`.

- [ ] Tests:
  - "each turn uses the next key meaning, in turn" (turn 0, 1, 2, 3 → meanings 0, 1, 2, 0).
  - "the sentence hides the form it uses" (`answer: 'pensait'`, sentence `Il **pensait** …`).
  - "the Portuguese sentence comes along when Reverso has one".
  - "a meaning whose examples never contain the word gives a meaning-only card" (`sentence: null`, `answer` = word).
  - "a word with neither a sentence nor translations gives no card".
  - "items are the saved words, newest first".
- [ ] Run: fails. Implement. Run: passes.

### Task A4: Game routes and Rappel API

**Files:**
- Create `server/visitor.js` (move `readCookie`, `sessionId`, `visitorContext` out of `app.js`).
- Create `server/gameRoutes.js`.
- Modify `server/app.js`: `createApp({ …, reviews, games: { rappel, prepositions, genre } })` mounts `/api/rappel`, `/api/constructions/prepositions`, `/api/constructions/genre` before the `/api` 404.
- Modify `server/index.js` (wire `createReviews`, `rappelGame`).
- Test `test/rappelRoutes.test.js`.

**Interfaces — Produces:**
- `gameRoutes({ game, reviews, flags, random? })`:
  - `GET /session?today=` → `{ cards, due, fresh, total, nextDueOn, ...details }`, where `details` are the extra fields of `game.items()`.
  - `POST /answers { word, item = '', outcome, today? }` → `200 { step, dueOn }`.
- Errors:
  - `400 { error: 'invalid_day' }`;
  - `400 { error: 'invalid_answer' }` (outcome not right/hinted/wrong, word missing, or item not a string);
  - `404 { error: 'not_saved' }`.

- [ ] Tests:
  - "with the flag off, the Rappel API does not exist" (both routes 404 `not_found`).
  - "a session lists today's cards".
  - "an answer moves the word along and takes it out of today's session".
  - "a bad day or outcome is refused".
  - "an answer for an unsaved word is 404".
- [ ] Smoke `test/smoke/rappel.smoke.test.js`, "the Rappel API follows the cahier-rappel flag": on → 200 with an array of cards and a bad outcome → 400; off → 404.
- [ ] CI: add `cahier-rappel=on` to the smoke job's `FLAGS_OVERRIDE` in `.gitea/workflows/ci.yml`.
- [ ] Run unit and smoke (local server with `FLAGS_OVERRIDE=cahier-rappel=on`): fail. Implement. Run: pass, along with the whole unit suite.

### Task A5: Rappel page

**Files:**
- Create:
  - `web/src/answer.js` (`normalizeAnswer`, `withoutAccents`, moved from `conjugation/grade.js`, which imports them);
  - `web/src/games/grade.js`, `web/src/games/session.js`, `web/src/games/today.js`;
  - `web/src/components/games/ReviewSession.jsx`;
  - `web/src/components/rappel/RappelCard.jsx`;
  - `web/src/pages/Rappel.jsx`.
- Modify `web/src/api.js`, `web/src/main.jsx`, `web/src/Layout.jsx` (menu item after Memoir).
- Test `test/gameGrade.test.js`, `test/gameSession.test.js`, `test/e2e/rappel.spec.js`.

**Interfaces — Produces:**
- `gradeRecall(input, { answer, word }): 'empty' | 'correct' | 'lemma' | 'accent' | 'wrong'`.
- `newSession(cards)`, `currentCard(session)`, `answerCard(session, outcome): { session, first: boolean }`, `isFinished(session)`, `REVIEW_DELAY = 3`. The session keeps `{ queue, answered, rightFirstTime }`.
- `localDay(date?)`.
- `api.gameSession(path, today, signal)`, `api.gameAnswer(path, answer)`.
- `<ReviewSession title path Card emptyText notes? />`, where `Card` receives `{ card, onFinish(outcome) }`.

- [ ] Unit tests:
  - grade: "the sentence's form is right"; "case does not matter"; "the dictionary form counts, as lemma"; "missing accents count, flagged"; "anything else is wrong"; "blank is empty".
  - session: "a missed card comes back three cards later"; "only the first answer to a card is recorded"; "the session finishes when every card was answered right once"; "rightFirstTime counts first answers".
- [ ] E2E (mock `/api/flags` and `/api/rappel/*`):
  - "the menu shows Rappel only while its flag is on";
  - "typing the word in the sentence records a right answer";
  - "the dictionary form counts but shows the sentence's form";
  - "a missed word comes back and is recorded once, as wrong";
  - "the hint shows the first letter and records hinted";
  - "J'avais raison turns a miss into a right answer";
  - "with nothing due, the page says when to come back";
  - "a failed save does not stop the session".
- [ ] Run (`npm run build && npx playwright test test/e2e/rappel.spec.js`, unit): fail. Implement. Run: pass, along with the full unit, e2e and smoke suites.
- [ ] Squash into one commit, push `feat/rappel`, open the PR, wait for green CI.

## Part B — Prépositions (branch `feat/constructions-prepositions` from `feat/rappel`)

### Task B1: Richer constructions and their refresh

**Files:**
- Modify `server/prepositions.js`:
  - schema adds `gap`, `answer`, `portuguese`, `differsFromPortuguese`;
  - the prompt asks for no-preposition constructions too;
  - `max_tokens: 4096`.
- Modify `server/dictionary.js`: `cachedPrepositions(verbs): Map<verb, constructions>` in one query; `refreshPrepositions(verb): Promise<constructions | null>`.
- Create `server/constructions.js`.
- Test `test/constructions.test.js`, `test/dictionaryRefresh.test.js`.

**Interfaces — Produces:**
- `isDrillable(construction): boolean`. True when there is exactly one `___` and `gap` with `answer` in the blank equals `example`, ignoring whitespace and apostrophe style.
- `needsRefresh(constructions | undefined): boolean`. True when nothing is cached, or a construction has no `gap`.
- `prepositionCard(verb, construction)` → `{ word: verb, item: pattern, sentence: gap, answer, pattern, meaning, portuguese, differsFromPortuguese, example }`.
- `createConstructionRefresher({ dictionary, logger })` → `{ refresh(verbs) }`: one verb at a time, each at most once.
- `prepositionsGame({ myWords, dictionary, refresher, logger })` → `{ name: 'prepositions', flag: 'cahier-constructions', items(): Promise<{ items, preparing }>, cardOf }`.

- [ ] Tests:
  - "a construction is drillable when its blank gives back its example" (including `d'`, and `''` for no preposition);
  - "a gap with no blank, two blanks or another sentence is not drillable";
  - "old constructions without gap need a refresh";
  - "the same pattern twice is drilled once";
  - "refreshing replaces the cached constructions";
  - "cached constructions of many verbs come in one read";
  - "the refresher handles one verb at a time and each once";
  - "items are the drillable constructions of saved verbs, and verbs still to refresh are counted as preparing".
- [ ] Run: fail. Implement. Run: pass.

### Task B2: Prépositions API and page

**Files:**
- Modify `server/app.js`, `server/index.js`.
- Modify `web/src/games/grade.js` (`gradePreposition`), `web/src/main.jsx`, `web/src/Layout.jsx`.
- Create `web/src/pages/Constructions.jsx`, `web/src/components/constructions/PrepositionCard.jsx`, `web/src/components/games/GapSentence.jsx`.
- Tests:
  - `test/prepositionsGameRoutes.test.js`, `test/gameGrade.test.js` (new cases);
  - `test/smoke/constructions.smoke.test.js`;
  - `test/e2e/constructions.spec.js`.
- CI: add `cahier-constructions=on`.

**Interfaces — Produces:** `gradePreposition(input, answer): 'correct' | 'contraction' | 'accent' | 'wrong'`, plus `contractionOf(answer): string | null` (e.g. `'à + le = au'`).

- [ ] Tests:
  - grade: "the preposition as written is right"; "the uncontracted preposition counts, with its contraction"; "a missing accent counts, flagged"; "no preposition is answered with an empty answer".
  - routes: flag off → 404; session with preparing count; answers recorded under the construction's pattern.
  - smoke: "the Prépositions API follows the cahier-constructions flag".
  - e2e:
    - "the menu shows Constructions only while its flag is on";
    - "typing the preposition records a right answer and shows the Portuguese contrast";
    - "a preposition button answers at once";
    - "à for au counts and explains the contraction";
    - "sans préposition answers a construction without one";
    - "verbs still being prepared are announced".
- [ ] Run: fail. Implement. Run: pass with all suites. Squash, push, open the PR, wait for green CI.

## Part C — Genre (branch `feat/constructions-genre` from `feat/constructions-prepositions`)

### Task C1: Genre cards, API and tab

**Files:**
- Create `server/genre.js`.
- Modify `server/app.js`, `server/index.js`.
- Create `web/src/components/constructions/GenreCard.jsx`.
- Modify `web/src/pages/Constructions.jsx` (tabs Prépositions | Genre), `web/src/main.jsx` (`/constructions/:mode`; `/constructions` redirects to `prepositions`).
- Tests: `test/genre.test.js`, `test/genreRoutes.test.js`, `test/smoke/genre.smoke.test.js`, `test/e2e/genre.spec.js`.

**Interfaces — Produces:**
- `USUAL_GENDER_BY_ENDING`: endings → `'m' | 'f'`.
- `endingRule(noun, gender): { ending, usualGender, exception } | null`. It uses the noun's first word, and the longest ending wins.
- `articlesFor(noun): ['un', 'une'] | ['le', 'la']`.
- `genreCard(word, entry)` → `{ word, item: '', gender, articles, translations, rule } | null`.
- `genreGame({ myWords, dictionary, logger })`.

- [ ] Tests:
  - "a noun starting with a vowel or h asks un or une";
  - "only nouns with one gender, m or f, as their first part of speech are cards";
  - "the longest known ending gives the usual gender";
  - "a noun against its ending is an exception";
  - "a compound noun follows its first word";
  - routes: flag off → 404, session, answers;
  - smoke: "the Genre API follows the cahier-constructions flag";
  - e2e:
    - "the Genre tab asks for the article and records the answer";
    - "keys 1 and 2 answer";
    - "the feedback shows the ending's usual gender and exceptions";
    - "/constructions opens Prépositions".
- [ ] Run: fail. Implement. Run: pass with all suites. Squash, push, open the PR, wait for green CI.

## Finally

- [ ] Create `cahier-rappel` and `cahier-constructions` in Unleash: on in development, off in production.
- [ ] Report the three PR links, the merge order, and how to try each game.
