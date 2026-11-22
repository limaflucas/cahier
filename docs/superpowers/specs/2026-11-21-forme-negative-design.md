# Forme négative in the Modèles tables: design

Temps verbaux shows every tense's model verbs in a Modèles table. The user asked for the negative form in those tables, without an Unleash flag (2026-11-21), and picked the layout and the participe passé option below.

## Why

The negative is where word order trips a learner: `ne … pas` frames the auxiliary, not the participle (je **n'**ai **pas** parlé), `ne` comes before the reflexive pronoun (je **ne** me suis **pas** levé), and `ne` elides before a vowel or a silent h. Seeing each form right above its negative shows the frame at a glance.

## Goals

- Every Modèles table shows, under each form, its negative with `ne … pas`.
- `ne`/`n'` and `pas` are highlighted in the blue the table already uses for endings and auxiliaries.
- The participe passé shows the negative of the compound participle: n'ayant pas parlé, n'étant pas venu, ne s'étant pas levé.

## Non-goals

- Other negations (`ne … jamais`, `ne … plus`, `ne … rien`) and the dropped `ne` of spoken French.
- Negative forms in the Conjugaison game.
- An Unleash flag (the user waived it).

## Anti-goals

- Wrong French: a wrong elision (`n'hais`) or a misplaced `pas` (`n'ai parlé pas`).
- A page that scrolls sideways on a phone: wider tables scroll inside their box, as today.

## Approaches

Layout (the user's pick):

- **Under each form (picked).** Each cell gets a second line with its negative; tables double in height.
- Negative rows below: a "Forme négative" block of six rows after the affirmative rows; comparing one person means scanning down.
- An affirmative/négative switch per table: compact, but never shows both forms at once.

Where the negative is built (my call):

- **In the conjugator (picked).** Each board cell gets `negative`, built from the pieces the conjugator already holds (auxiliary, participle, reflexive pronoun) and elided with `startsWithVowelSound`, which knows the aspirated-h verbs.
- In the browser, from the affirmative string: needs string surgery on compound forms and cannot tell a silent h from an aspirated one.

## Design

- `GET /api/conjugation/:verb`: every non-null cell gains `negative`, the negative of `answers[0]` without its subject.
  - Simple tenses: `ne` + form + `pas` (ne parle pas, ne me lève pas).
  - Compound tenses: `ne` + auxiliary (with its reflexive pronoun) + `pas` + participle (n'ai pas parlé, ne t'es pas levé).
  - Participe présent: ne sachant pas; gérondif: en ne parlant pas.
  - Participe passé: the present participle of the verb's first auxiliary, then the participle (n'ayant pas parlé, n'étant pas venu, ne s'étant pas levé).
- `ModelConjugations`: each cell shows the form, then the negative on its own line, `ne`/`n'` and `pas` in blue. The row labels stay as they are.

## Left to the builder

The negative line's text colour, and how the browser finds `ne`/`n'` and `pas` in the string.
