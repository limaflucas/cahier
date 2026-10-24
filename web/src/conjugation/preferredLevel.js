import { DEFAULT_LEVEL, levelById } from './game.js';

const STORAGE_KEY = 'conjugaison.niveau';

export function readPreferredLevel() {
  try {
    return levelById(localStorage.getItem(STORAGE_KEY)).id;
  } catch {
    return DEFAULT_LEVEL;
  }
}

export function savePreferredLevel(level) {
  try {
    localStorage.setItem(STORAGE_KEY, level);
  } catch {
    // Remembering the level is a convenience; private browsing may refuse storage.
  }
}
