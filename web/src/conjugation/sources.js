import { TENSES_BY_ID } from '../tenses/index.js';
import { cellKey } from './game.js';

export function sourceKeys(key) {
  if (!key) return new Set();
  const [tense, index] = key.split(':');
  const sources = TENSES_BY_ID[tense].derivedFrom?.sources(Number(index)) ?? [];
  return new Set(sources.map(([sourceTense, sourceIndex]) => cellKey(sourceTense, sourceIndex)));
}
