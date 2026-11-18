# Pronoms (PR 1: the page) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A flagged `/pronoms` page: one table of the eleven pronoun families whose pronouns and family names jump to each family's explanation (summary, Formes, Emplois).

**Architecture:** Plain JS data under `web/src/pronouns/` (one file per family, like `web/src/tenses/`), a table definition that refers to forms by key, and React components under `web/src/components/pronouns/`. The page keeps one piece of state, the highlighted form, and moves between sections with hash links that push history.

**Tech Stack:** React 19, react-router-dom 7, Tailwind 4, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-pronoms-design.md`. Content source: the approved mockup, https://claude.ai/artifact/BzC8Nn1TsQ747LQWxhj7Qn.

## Global Constraints

- Flag `cahier-pronoms`, off by default; route and menu entry render only while it is on.
- Route `/pronoms` in the wide layout; menu label `Pronoms`, right after `Temps verbaux`.
- Video `https://www.youtube.com/watch?v=Puhiz1gRaOc`; chapter links `…&t=<seconds>s`.
- Family ids, titles, labels and chapters exactly as the spec's table.
- French UI, Brazilian Portuguese lines in `lang="pt"`; JSDoc on every function and component; no comments unless unavoidable.
- Test first: write unit, e2e and smoke tests, see them all fail, then implement. Never edit an existing test without the user's consent.

## Review Focus

1. **Opening `/pronoms#en-y` directly**: the section only mounts after the flags load, so the hash scroll must run from the page's own mount → test in Task 1 (`opening a family's link lands on it`).
2. **Back after a click** returns to the table, not off the page → test in Task 1 (`clicking a pronoun…`, `page.goBack()`).
3. **The same word in two columns** (`me` COD vs COI) highlights only the one clicked → test in Task 1 (`the COD me highlights in the COD row`).
4. **Phone width**: no sideways page scroll; the table scrolls in its box → test in Task 1.
5. **A second click before the highlight fades** restarts the 2.5 s highlight on the new form → covered by keying the timer on each pick (Task 3); no separate test.

---

### Task 1: Failing tests

**Files:**
- Create: `test/pronouns.test.js`, `test/e2e/pronoms.spec.js`, `test/smoke/pronoms.smoke.test.js`

**Interfaces:**
- Consumes (from Tasks 2–3, not yet written): `FAMILIES`, `formsOf` from `web/src/pronouns/index.js`; `TABLE_COLUMNS`, `PERSON_ROWS`, `FREE_ROWS` from `web/src/pronouns/table.js`.

- [ ] **Step 1: Unit tests** (`test/pronouns.test.js`)
  - `the page follows the video's eleven families, in order`: ids deep-equal `['personnels','toniques','possessifs','demonstratifs','neutres','reflechis','cod-coi','en-y','relatifs','interrogatifs','indefinis']`; chapters deep-equal `[21,576,875,1330,1582,2000,2640,3094,3556,4069,4407]`.
  - `every family has the content its section renders`: `name`, `label`, `summary.fr`, `summary.pt`, `formsOf(f).length > 0`, `uses.length > 0`; every point in `uses`, `placement`, `advanced`, `pitfalls` has a title and examples with `fr` and `pt`.
  - `a form key always names the same form`: within a family, one key → one `form`/`elided` pair.
  - `every pronoun in the table is one of its family's forms`: every key in `PERSON_ROWS` cells (by column family) and `FREE_ROWS` is in `formsOf(family)`.
  - `every family is reachable from the table`: families of `TABLE_COLUMNS` ∪ `FREE_ROWS` = all ids.
  - `the person rows tile the table`: person spans sum to `PERSON_ROWS.length` (9); for each column, the spans of its non-null cells sum to 9 and no cell overlaps another's span.

- [ ] **Step 2: E2E tests** (`test/e2e/pronoms.spec.js`), with `/api/flags` faked to `{ 'cahier-pronoms': true }` unless stated:
  - `the menu and the page follow the cahier-pronoms flag`: flags `{}` → no `Pronoms` menu link and no `Pronoms` h1 at `/pronoms`; flag on → link right after `Temps verbaux`, h1 visible.
  - `the table holds the eleven families`: table named `Le tableau` has links named exactly `Personnel sujet, Tonique, Possessif, Démonstratif, Neutre, Réfléchi, COD / COI, En / y, Relatif, Interrogatif, Indéfini`; person row headers `1re sing., 2e sing., 3e sing., 1re plur., 2e plur., 3e plur.`.
  - `clicking a pronoun opens its family with that pronoun highlighted`: click link `leur` (exact) → URL ends `#cod-coi`; `Pronoms COD et COI` h2 in viewport; the section's `mark` has text `leur`; the mark is gone within 5 s; `page.goBack()` → URL has no hash and the table is in viewport.
  - `the COD me highlights in the COD row`: in the `1re sing.` row, click the second `me (m')` link → the `COD` row of the section's Formes holds the `mark` `me`; the `COI` row holds none.
  - `a family name opens its section and ↑ Tableau comes back`: click `Relatif` → `#relatifs`, `Pronoms relatifs` in viewport, no `mark`; click its `↑ Tableau` → table in viewport.
  - `opening a family's link lands on it`: `goto('/pronoms#en-y')` → `Pronoms en et y` h2 in viewport.
  - `every section has its forms, its uses and its chapter`: for each of the eleven titles, the region has regions `Formes` and `Emplois`; `Pronoms COD et COI`'s video link href is `https://www.youtube.com/watch?v=Puhiz1gRaOc&t=2640s`.
  - `the page fits a phone screen`: 390×844, page overflow `0`.

- [ ] **Step 3: Smoke test** (`test/smoke/pronoms.smoke.test.js`): `the deployed app ships the Pronoms page`: read the `<script … src="…js">` from `/`, fetch it, assert it contains `Pronoms personnels sujets` and `Pronoms indéfinis`.

- [ ] **Step 4: Run them; all must fail**
  Run: `npm run test:unit`, `npx playwright test test/e2e/pronoms.spec.js` (after `npm run build`), and `npm run build && PORT=3100 DB_PATH=$TMP/s.db npm start &` + `BASE_URL=http://localhost:3100 node --test test/smoke/pronoms.smoke.test.js`.
  Expected: unit fails on the missing module; every e2e and the smoke test fail.

### Task 2: Pronoun data

**Files:**
- Create: `web/src/pronouns/{personnels,toniques,possessifs,demonstratifs,neutres,reflechis,codCoi,enY,relatifs,interrogatifs,indefinis}.js`, `web/src/pronouns/index.js`, `web/src/pronouns/table.js`

**Interfaces — Produces:**
- `Form = { key: string, form: string, elided?: string }`; `Point = { title, text?, note?, order?: boolean, examples: { fr, pt }[] }` (Temps verbaux shape plus `order`).
- `Family = { id, name, label, hue: number, chapter: number, summary: { fr, pt }, forms: { columns: string[], rows: { label, cells: Form[][] }[] } | { list: (Form & { note: string })[] }, uses: Point[], placement?: Point[], advanced: Point[], pitfalls: Point[], memory: string[] }`.
- `index.js`: `FAMILIES: Family[]`, `FAMILIES_BY_ID`, `VIDEO_URL`, `chapterUrl(seconds): string`, `clock(seconds): string` (`'44:00'`, `'1:07:49'`), `formsOf(family): Form[]` (unique by key, in order).
- `table.js`: `TABLE_COLUMNS: { family, part?: 'COD'|'COI' }[]` (six, video order); `PERSON_ROWS: { person: { label, span } | null, cells: (({ keys: string[] } | { none: true }) & { span?: number } | null)[] }[]` (nine rows, null = covered by a span above); `FREE_ROWS: { family, keys?: string[], more?: string }[]`.

- [ ] **Step 1:** Port the mockup's families, forms, summaries and Emplois; COD et COI and En et y also get `placement`/`advanced`/`pitfalls`/`memory`; others get empty arrays. COD/COI keys are `cod:<form>` / `coi:<form>`; all other keys are the form itself. Hues: personnels 45, toniques 210, possessifs 140, demonstratifs 2, neutres 262, reflechis 335, cod-coi 24, en-y 188, relatifs 285, interrogatifs 312, indefinis 92.
- [ ] **Step 2:** `npm run test:unit` → all pass (261 + 6).
- [ ] **Step 3:** Commit `feat: pronoun families and their table`.

### Task 3: The page

**Files:**
- Create: `web/src/pages/Pronoms.jsx`, `web/src/components/pronouns/{PronounTable,FamilySection,Forms,OrderStrip}.jsx`
- Modify: `web/src/main.jsx` (route in the `wide` group), `web/src/Layout.jsx` (`MENU` entry), `web/src/components/tenses/Point.jsx` (render `children` after the text, for the order strip)

**Interfaces:**
- Consumes: Task 2's exports.
- `Pronoms` holds `highlight: { family, key, pick: number } | null` and `pick(id: string, key?: string)`: push `#id` with `useNavigate`, `scrollIntoView` (smooth unless `prefers-reduced-motion`), set the highlight; an effect clears it 2500 ms after each pick. On mount, scroll to `location.hash` if set.
- `PronounTable({ onPick })`: `<table aria-labelledby>` titled `Le tableau`; every pronoun/family is an `<a href="#id">` whose click calls `onPick(id, key)` after `preventDefault`. Inside an `overflow-x-auto` box.
- `FamilySection({ family, highlighted, onPick })`: `<section id aria-labelledby>` with h2 `family.name`, video link `▶ Vidéo · {clock}`, summaries, regions `Formes` and `Emplois` (and the optional blocks, reusing `Point`), `↑ Tableau` link.
- `Forms({ family, highlighted })`: table (row header = row label) or `dl` list; the form whose key equals `highlighted` renders as `<mark>`.

- [ ] **Step 1:** Build the components; hue via `style={{ '--h': hue }}` and Tailwind arbitrary `hsl(var(--h)_…)` classes.
- [ ] **Step 2:** `npm run test:e2e` → all pass, including the existing suites. Smoke against a local production build → pass.
- [ ] **Step 3:** Commit `feat: Pronoms page, behind cahier-pronoms`.

### Task 4: Ship

- [ ] Push `feat/pronoms`, open the PR on `gitea.homelab/homelab/cahier`, wait for green CI.
- [ ] Create `cahier-pronoms` in Unleash, off in `development` and `production`.
