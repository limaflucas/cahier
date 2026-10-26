# Sac de mots, step 1: lists — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Behind the `sac-de-mots` flag, a « Sac de mots » menu entry, a lists page and empty list pages where the learner creates, renames, deletes, sorts and filters named lists with an optional emoji.

**Architecture:** A `word_lists` table and a `createWordLists(db)` model on the server, exposed as REST under `/api/lists` and answering 404 while the flag is off for the visitor. Two React pages (`/sac-de-mots`, `/sac-de-mots/:id`) built from small components, hidden from the menu and router while the flag is off.

**Tech Stack:** Express 4, node:sqlite, React 19, React Router 7, Tailwind 4, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-24-sac-de-mots-design.md` (sections « A list », « Pages » except the header search on a list page, « Flag behaviour »; step 1 of « Delivery »).

## Global Constraints

- Test first for the whole step: Task 1 writes every unit, smoke and e2e test; they must all fail before Task 2 starts, and all pass at the end. Never change an existing test without the user's consent; if one fails, report which, why, and the proposed fix, then wait.
- Flag name: `sac-de-mots`. Off → no menu entry, `/sac-de-mots…` renders nothing, every `/api/lists…` route answers `404 {"error":"not_found"}`.
- Name: trimmed, 1–60 characters (code points), unique ignoring case and accents.
- Emoji: optional, exactly one emoji grapheme (ZWJ sequences, flags and variation selectors count as one); empty means none.
- Copy (French, exact): menu « Sac de mots »; title « Sac de mots (n) »; button « Nouveau sac »; count « 0 mot », « 1 mot », « 2 mots »; sort « Date » / « A→Z »; delete « Supprimer », confirm « Supprimer « Maison » ? » with « Oui » / « Non »; empty list « Ce sac est vide. Tapez un mot dans la recherche en haut pour l'ajouter. »; unknown list « Ce sac n'existe pas. »; errors `invalid_name` « Donnez un nom de 1 à 60 caractères. », `name_taken` « Un sac porte déjà ce nom. », `invalid_emoji` « Choisissez un seul emoji. »; search placeholder on `/sac-de-mots` « Filtrer mes sacs… ».
- « Supprimer » is the last element on the right of its row (lists page) and of the title row (list page).
- Sort default « Date », newest first (ties: higher id first); « A→Z » uses French collation ignoring case and accents. Stored in `localStorage` key `sacs.ordre`, wrapped in try/catch.
- JSDoc on every new function and component. No comments otherwise. No attribution lines in commits or PRs.

## Review Focus

- Renaming a list to its own name with different case (« maison » → « Maison ») must succeed, not clash with itself. Test in Task 2.
- Composite emoji (« 👩‍🍳 », « 🇫🇷 », « ❤️ ») must be accepted as one emoji; « 🏠🏠 » and « ab » rejected. Test in Task 2.
- A 60-character name with accents or an emoji inside must pass; 61 must fail (counted in characters, not bytes). Test in Task 2.
- A deep link to a deleted, unknown or non-numeric list id shows « Ce sac n'existe pas. » once flags load. Test in Task 1's e2e, made green in Task 5.
- Storage that throws or holds garbage reads as « Date ». Test in Task 4.

---

### Task 1: The red suite

**Files:**
- Create: `test/wordLists.test.js`, `test/listRoutes.test.js`, `test/listOrder.test.js`, `test/smoke/lists.smoke.test.js`, `test/e2e/lists.spec.js`
- Modify: `playwright.config.js` (the `on` server's `FLAGS_OVERRIDE` becomes `version-badge=on,sac-de-mots=on`), `.gitea/workflows/ci.yml` (smoke step starts the server with `FLAGS_OVERRIDE=sac-de-mots=on`)

**Interfaces:**
- Produces, for later tasks to satisfy: `createWordLists(db)` and `ListError` from `server/wordLists.js`; `createApp({ …, wordLists, flags })`; `sortLists`, `readListsOrder`, `saveListsOrder`, `wordCountLabel` from `web/src/lists/order.js`.

- [ ] **Step 1: `test/wordLists.test.js`** (uses `openDb(':memory:')`)
  - `create` returns `{ id: number, name, emoji: null, createdAt: string, wordCount: 0 }`, name trimmed (« ␠Maison␠ » → « Maison »).
  - `all()` returns newest first; same `createdAt` → higher id first.
  - `create`/`update` throw `ListError` with `code === 'invalid_name'` for « », « ␠␠ », 61 characters; accept 60 characters that include « é » and « 🏠 ».
  - `name_taken` for « Été » after « ete », and for « ÉTÉ »; on `update` too, but renaming a list « maison » → « Maison » succeeds.
  - Emoji: « 🏠 », « 👩‍🍳 », « 🇫🇷 », « ❤️ » accepted; « 🏠🏠 », « ab », « a » → `invalid_emoji`; « » and `null` → `emoji: null`.
  - `update(id, { emoji: null })` clears it; `update(id, { name })` keeps the emoji; `update` of an unknown id → `null`.
  - `get(unknown)` → `null`; `remove(id)` → `true`, again → `false`.
- [ ] **Step 2: `test/listRoutes.test.js`** (pattern of `test/routes.test.js`, `createFlags({ overrides })`)
  - Flag off: `GET /api/lists`, `POST /api/lists`, `GET /api/lists/1` → 404 `{ error: 'not_found' }`.
  - Flag on: `POST {"name":"Maison","emoji":"🏠"}` → 201 with the list; `GET /api/lists` → `[list]`; `GET /api/lists/:id` → list; `PATCH {"name":"Cuisine"}` → 200 renamed; `POST` duplicate → 409 `{ error: 'name_taken' }`; `POST {"name":""}` → 400 `{ error: 'invalid_name' }`; `POST {"name":"X","emoji":"ab"}` → 400 `{ error: 'invalid_emoji' }`; `DELETE` → 204, then `GET` → 404; `GET /api/lists/abc` → 404.
- [ ] **Step 3: `test/listOrder.test.js`** (fake `localStorage` as in `test/searchHistory.test.js`)
  - `sortLists(lists, 'date')` newest first, ties by id desc; `sortLists(lists, 'alpha')` on « zoo », « Été », « avion », « école » → « avion », « école », « Été », « zoo »; input not mutated.
  - `readListsOrder()` → `'date'` with no storage, throwing storage, or « oops » stored; `'alpha'` after `saveListsOrder('alpha')`.
  - `wordCountLabel(0|1|2)` → « 0 mot », « 1 mot », « 2 mots ».
- [ ] **Step 4: `test/smoke/lists.smoke.test.js`**: test « the list API follows the sac-de-mots flag »: read `/api/flags`; if `sac-de-mots` is on, `GET /api/lists` is 200 with an array, otherwise 404. Read-only: never creates data.
- [ ] **Step 5: `test/e2e/lists.spec.js`** (`baseURL` 4174 for the flag-on tests; each test names its lists with a unique suffix and scopes the page with the header search)
  - Flag off (4173): no « Sac de mots » link in the menu; `GET /api/lists` → 404.
  - Menu: « Sac de mots » link right after « Mes mots ».
  - Create « Maison <id> » with « 🏠 » from the grid → row shows « 🏠 », the name and « 0 mot »; title count goes up; clicking the name opens `/sac-de-mots/<n>` with the title and the empty-list text.
  - Create with a typed emoji « 👩‍🍳 ».
  - Errors: empty name → « Donnez un nom de 1 à 60 caractères. »; « été <id> » after « Été <id> » → « Un sac porte déjà ce nom. ».
  - Rename inline from the lists page (pencil) and from the list page.
  - Delete from the lists page: « Non » keeps it, « Oui » removes it; the « Supprimer » button is the right-most element of the row. Delete from the list page returns to `/sac-de-mots`.
  - Sort: default « Date » shows the newest first; « A→Z » reorders; the choice survives a reload.
  - Header search placeholder « Filtrer mes sacs… »; typing filters the rows by name.
  - Deep links to an unknown id and to `/sac-de-mots/abc` show « Ce sac n'existe pas. ».
- [ ] **Step 6: Apply the config changes listed under Files.**
- [ ] **Step 7: Run everything and confirm red**

Run: `npm run test:unit`, then a production build served with `FLAGS_OVERRIDE=sac-de-mots=on` and `BASE_URL=… npm run test:smoke`, then `npx playwright test test/e2e/lists.spec.js`.
Expected: every new test fails (missing modules, 404s, missing elements); every existing test still passes.

- [ ] **Step 8: Commit** the tests, config and both docs: `test: sac de mots lists, failing first`.

### Task 2: List model

**Files:**
- Modify: `server/db.js` (add `word_lists`)
- Create: `server/wordLists.js`

**Interfaces:**
- Produces: `createWordLists(db) → { all(): List[], get(id: number): List | null, create({ name, emoji }): List, update(id: number, { name?, emoji? }): List | null, remove(id: number): boolean }`; `class ListError extends Error { code: 'invalid_name' | 'name_taken' | 'invalid_emoji' }`; `List = { id, name, emoji, createdAt, wordCount }` (`wordCount` is `0` until step 2 adds list words).

- [ ] **Step 1: Add the table**: `word_lists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, name_key TEXT NOT NULL UNIQUE, emoji TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`.
- [ ] **Step 2: Implement `server/wordLists.js`**: `name_key` is the name folded with NFD, diacritics removed, `toLocaleLowerCase('fr')`; uniqueness via the index, mapping the constraint error to `name_taken`. Emoji check: `Intl.Segmenter` gives exactly one grapheme, matching `\p{Extended_Pictographic}` or `\p{Regional_Indicator}`.
- [ ] **Step 3: Run** `node --test test/wordLists.test.js`. Expected: PASS.
- [ ] **Step 4: Commit** `feat: word lists model`.

### Task 3: List API behind the flag

**Files:**
- Modify: `server/app.js`, `server/index.js`

**Interfaces:**
- Consumes: `createWordLists`, `ListError` (Task 2); `flags.isEnabled(name, context)`.
- Produces: `GET/POST /api/lists`, `GET/PATCH/DELETE /api/lists/:id` with the statuses pinned in Task 1 Step 2.

- [ ] **Step 1: Extract `visitorContext(req, res)`** from the `/api/flags` handler and reuse it there.
- [ ] **Step 2: Gate `/api/lists`** with middleware that answers `404 {"error":"not_found"}` unless `flags.isEnabled('sac-de-mots', visitorContext(req, res))`; ids that are not positive integers → 404; `ListError` → 400, or 409 for `name_taken`.
- [ ] **Step 3: Wire `wordLists: createWordLists(db)`** in `server/index.js`.
- [ ] **Step 4: Run** `node --test test/listRoutes.test.js` and the smoke suite against a build with the flag on. Expected: PASS.
- [ ] **Step 5: Commit** `feat: list API behind the sac-de-mots flag`.

### Task 4: Client data helpers

**Files:**
- Modify: `web/src/api.js` (`request` accepts `body`, sent as JSON with `Content-Type: application/json`)
- Create: `web/src/lists/order.js`

**Interfaces:**
- Produces: `api.lists(signal)`, `api.list(id, signal)`, `api.createList({ name, emoji })`, `api.updateList(id, patch)`, `api.deleteList(id)`; `sortLists(lists, order: 'date' | 'alpha') → List[]`, `readListsOrder() → 'date' | 'alpha'`, `saveListsOrder(order)`, `wordCountLabel(n) → string`.

- [ ] **Step 1: Implement both files.** `ApiError` keeps carrying the server's `error` code as its message.
- [ ] **Step 2: Run** `node --test test/listOrder.test.js`. Expected: PASS.
- [ ] **Step 3: Commit** `feat: list client helpers`.

### Task 5: Pages, menu and routes

**Files:**
- Modify: `web/src/flags.jsx` (export `useFlags()`; `useFlag` uses it), `web/src/Layout.jsx` (menu entry `{ to: '/sac-de-mots', label: 'Sac de mots', flag: 'sac-de-mots' }` after Mes mots, filtered by `useFlags()`), `web/src/main.jsx` (routes `sac-de-mots` and `sac-de-mots/:id`, wrapped so they render nothing while the flag is off), `web/src/components/SearchBar.jsx` (placeholder « Filtrer mes sacs… » and aria-label « Filtrer mes sacs ou chercher un mot » on `/sac-de-mots` exactly)
- Create: `web/src/pages/WordLists.jsx`, `web/src/pages/WordList.jsx`, `web/src/components/lists/ListForm.jsx`, `web/src/components/lists/EmojiPicker.jsx`, `web/src/components/lists/DeleteConfirm.jsx`, `web/src/components/lists/SortSwitch.jsx`, `web/src/lists/emojis.js`

**Interfaces:**
- Consumes: Task 4 helpers; `matchesSearch` from `web/src/wordSearch.js`; `useOutletContext().search`.
- Produces: `ListForm({ initial?: { name, emoji }, submitLabel, onSubmit(values): Promise<void>, onCancel })` showing the server error copy; `EmojiPicker({ value, onChange })`, a grid of `EMOJI_SUGGESTIONS` (30 entries in `web/src/lists/emojis.js`) plus a text field for any emoji; `DeleteConfirm({ name, onConfirm, onCancel })`; `SortSwitch({ value, onChange, options: { value, label }[] })`. Steps 2–4 reuse all four.

- [ ] **Step 1: Implement the flag plumbing, menu, routes and search placeholder.**
- [ ] **Step 2: Implement the components and both pages** per the spec's « Pages » section and the copy in Global Constraints; the list page loads with `api.list`, shows « Ce sac n'existe pas. » on 404, and goes to `/sac-de-mots` after deletion.
- [ ] **Step 3: Run** `npm run build && npx playwright test test/e2e/lists.spec.js`. Expected: PASS.
- [ ] **Step 4: Commit** `feat: sac de mots pages behind the flag`.

### Task 6: Deliver

**Files:**
- Modify: `.gitea/workflows/deploy.yml` (`EXPECTED_FLAGS: version-badge,sac-de-mots`)

- [ ] **Step 1: Create the flag `sac-de-mots` in Unleash** (off in `development` and `production`), with the admin token the user provides.
- [ ] **Step 2: Run every suite:** `npm run test:unit`, smoke against a flag-on build, `npm run test:e2e`. Expected: all pass. If an existing test fails, stop and report it.
- [ ] **Step 3: Commit** `chore: expect the sac-de-mots flag after deploy`, push, open the PR into `master`, wait for green CI, hand it to the user. Do not merge.
- [ ] **Step 4: Start the app locally** in the background on this branch with `FLAGS_OVERRIDE=sac-de-mots=on` and `DB_PATH` pointing at a copy of `data/french.db`, and give the user http://localhost:5173.
