# Forme négative Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every Modèles table on Temps verbaux shows, under each form, its negative with `ne … pas` highlighted.

**Architecture:** The conjugator adds `negative` (the negative of `answers[0]`, without its subject) to every board cell, built from the auxiliary, participle and reflexive pieces it already holds. `ModelConjugations` prints it on a second line of each cell, with `ne`/`n'` and `pas` in blue.

**Tech Stack:** Express 4, node:test, React 19, Tailwind 4, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-21-forme-negative-design.md`

## Global Constraints

- No Unleash flag (the user waived it).
- JSDoc on every function and component touched or added; comments only when unavoidable.
- Add tests only; never edit an existing test without the user's consent.
- Branch `feat/forme-negative` off `origin/master`; PR to `master` on gitea.homelab/homelab/cahier; never merge it. No Claude attribution anywhere.

## Review Focus

- Phone width: the longer cells must scroll inside their box, not the page (the existing test "the page fits a phone screen" covers it).
- être-or-avoir verbs (`sortir`): the negative follows `answers[0]` (être): `ne suis pas sorti` (invariant test, Task 1).
- `pas` inside a word (`passer`): highlighting must not split `passant` (`negationParts` test, Task 1).
- Missing forms (`falloir`): null cells stay null and nothing throws (Task 1).
- Aspirated h (`haïr`): `ne hais pas`, never `n'hais` (Task 1).

---

### Task 1: The failing tests

**Files:**
- Create: `test/negative.test.js`, `test/smoke/negative.smoke.test.js`
- Modify: `test/e2e/tempsVerbaux.spec.js` (append one test)

**Interfaces:**
- Produces: the expectations Tasks 2 and 3 satisfy: `cell.negative: string` on every non-null board cell; `negationParts(form: string): { text: string, negation: boolean }[]` exported by `web/src/tenses/negation.js`.

- [ ] **Step 1: Write the unit tests** in `test/negative.test.js`, with `negativesOf(verb, tense)` = the board's cells mapped to `cell?.negative ?? null`:
  - `ne … pas frames the conjugated verb of a simple tense`: parler présent = `['ne parle pas', 'ne parles pas', 'ne parle pas', 'ne parlons pas', 'ne parlez pas', 'ne parlent pas']`; prendre subjonctif[2] = `'ne prenne pas'`; venir passé simple[5] = `'ne vinrent pas'`; se lever présent[0] = `'ne me lève pas'`.
  - `ne … pas frames the auxiliary of a compound tense, ne comes before the reflexive pronoun`: parler passé composé = `["n'ai pas parlé", "n'as pas parlé", "n'a pas parlé", "n'avons pas parlé", "n'avez pas parlé", "n'ont pas parlé"]`; aller = `['ne suis pas allé', "n'es pas allé", "n'est pas allé", 'ne sommes pas allés', "n'êtes pas allés", 'ne sont pas allés']`; se lever = `['ne me suis pas levé', "ne t'es pas levé", "ne s'est pas levé", 'ne nous sommes pas levés', 'ne vous êtes pas levés', 'ne se sont pas levés']`; se lever plus-que-parfait[0] = `"ne m'étais pas levé"`; parler subjonctif passé[0] = `"n'aie pas parlé"`; aller futur antérieur[0] = `'ne serai pas allé'`.
  - `ne elides before a vowel or a silent h, not before an aspirated h`: aimer présent[0] = `"n'aime pas"`; habiter imparfait[0] = `"n'habitais pas"`; haïr présent[0] = `'ne hais pas'`; s'habiller présent[0] = `"ne m'habille pas"`.
  - `the participles and the gérondif have a negative too`: savoir participe présent = `['ne sachant pas']`; parler gérondif = `['en ne parlant pas']`; se lever gérondif = `['en ne se levant pas']`; participe passé: parler `["n'ayant pas parlé"]`, venir `["n'étant pas venu"]`, se lever `["ne s'étant pas levé"]`.
  - `a verb has a negative only where it has a form`: falloir présent = `[null, null, 'ne faut pas', null, null, null]`; falloir passé composé[2] = `"n'a pas fallu"`; falloir participe présent = `[null]`.
  - `every negative is its first answer framed by ne … pas`: for parler, aller, se lever, s'asseoir, sortir, haïr, falloir, être and every tense but participePasse, each non-null cell satisfies `cell.negative.replace(/(^| )(ne |n')/, '$1').replace(/ pas(?= |$)/, '') === cell.answers[0]`.
  - `negationParts singles out ne, n' and pas`: `"n'ai pas parlé"` → `[{ text: "n'", negation: true }, { text: 'ai ', negation: false }, { text: 'pas', negation: true }, { text: ' parlé', negation: false }]`; `'en ne passant pas'` → `[{ text: 'en ', negation: false }, { text: 'ne', negation: true }, { text: ' passant ', negation: false }, { text: 'pas', negation: true }]`.

- [ ] **Step 2: Write the smoke test** `the conjugation board carries the negative of every form`: `GET /api/conjugation/se%20lever` is 200; passé composé negatives equal the se lever list above; participe passé negatives = `["ne s'étant pas levé"]`.

- [ ] **Step 3: Write the e2e test** `every Modèles table shows each form above its negative`, reading cells with `{ useInnerText: true }` (row 0 is the header):
  - Présent row 1: `['parle ne parle pas', 'finis ne finis pas', 'prends ne prends pas']`
  - Passé composé row 1: `["ai parlé n'ai pas parlé", 'suis allé ne suis pas allé', 'me suis levé ne me suis pas levé']`; row 3: `["a parlé n'a pas parlé", "est allé n'est pas allé", "s'est levé ne s'est pas levé"]`
  - Subjonctif passé row 1: `["aie parlé n'aie pas parlé", 'sois allé ne sois pas allé', 'me sois levé ne me sois pas levé']`
  - Gérondif row 1: `['en parlant en ne parlant pas', 'en finissant en ne finissant pas', 'en prenant en ne prenant pas']`
  - Participe passé row 1: `["parlé n'ayant pas parlé", "fini n'ayant pas fini", "pris n'ayant pas pris", "fait n'ayant pas fait", "venu n'étant pas venu", "ouvert n'ayant pas ouvert"]`

- [ ] **Step 4: Run them all; every new test must fail**

Run: `npm run test:unit`, then `npm run build && PORT=3100 DB_PATH=$CLAUDE_JOB_DIR/tmp/smoke.db npm start` and `BASE_URL=http://localhost:3100 npm run test:smoke`, then `npm run test:e2e`.
Expected: the new tests FAIL (missing module `web/src/tenses/negation.js`, `negative` undefined, cells without negative lines); every existing test passes.

- [ ] **Step 5: Commit** `test: the Modèles tables show the negative form`

### Task 2: The conjugator builds the negatives

**Files:**
- Modify: `server/conjugator.js` (`simpleCells`, `compoundCells`, `singleCell`, `nonFiniteCells`, `buildBoard`)

**Interfaces:**
- Produces: `negative: string` on every non-null cell of `conjugator.board(verb).tenses[*].cells`.

- [ ] **Step 1: Add `negated(form: string, infinitive: string, participle?: string): string`**: `ne` (or `n'` when `startsWithVowelSound(form, infinitive)`) + form + `pas`, then the participle when given.
- [ ] **Step 2: Wire it in.** Simple cells: `negated(answers[0], verb.infinitive)`. Compound cells: keep each answer's auxiliary, conjugated auxiliary and participle, and negate the first. Participe présent: `negated(first present participle, infinitive)`; gérondif: `en ` + that. Participe passé: `negated(present participle of verb.auxiliaries[0] with the reflexive of person 2, that auxiliary, past participle)`; `nonFiniteCells` takes `verbs` for that.
- [ ] **Step 3: Run** `npm run test:unit`. Expected: every test passes except `negationParts singles out ne, n' and pas`.
- [ ] **Step 4: Commit** `feat: the conjugation board carries the negative of every form`

### Task 3: The Modèles table shows the negatives

**Files:**
- Create: `web/src/tenses/negation.js`
- Modify: `web/src/components/tenses/ModelConjugations.jsx`

**Interfaces:**
- Consumes: `cell.negative` (Task 2).
- Produces: `negationParts(form: string): { text: string, negation: boolean }[]`.

- [ ] **Step 1: Implement `negationParts`**: split on the whole words `ne`, `pas` and the prefix `n'`, at the start or after a space.
- [ ] **Step 2: Render the negative** under each form, in its own block line (`text-stone-600`), negation parts in `text-blue-700`. JSDoc on every function of the file.
- [ ] **Step 3: Run** `npm run test:unit`, the smoke suite against a fresh build, and `npm run test:e2e`. Expected: all PASS.
- [ ] **Step 4: Commit** `feat: the Modèles tables show the negative form`

### Task 4: Ship

- [ ] **Step 1:** Check the page at phone and desktop widths in a browser.
- [ ] **Step 2:** Push `feat/forme-negative`, open the PR as claudinho, wait for `ci / *` to go green, hand it over.
