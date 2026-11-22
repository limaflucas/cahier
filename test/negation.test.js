import { test } from 'node:test';
import assert from 'node:assert/strict';
import { negationParts } from '../web/src/tenses/negation.js';

test("negationParts singles out ne, n' and pas", () => {
  assert.deepEqual(negationParts("n'ai pas parlé"), [
    { text: "n'", negation: true },
    { text: 'ai ', negation: false },
    { text: 'pas', negation: true },
    { text: ' parlé', negation: false },
  ]);
  assert.deepEqual(negationParts('en ne passant pas'), [
    { text: 'en ', negation: false },
    { text: 'ne', negation: true },
    { text: ' passant ', negation: false },
    { text: 'pas', negation: true },
  ]);
});
