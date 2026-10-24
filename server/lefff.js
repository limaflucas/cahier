import { readFileSync } from 'node:fs';

const LEFFF_VERBS = new URL('./data/lefff-verbs.json', import.meta.url);

export const loadLefff = (path = LEFFF_VERBS) => JSON.parse(readFileSync(path, 'utf8'));
