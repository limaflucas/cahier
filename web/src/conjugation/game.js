import { grade } from './grade.js';

export const LEVELS = [
  { id: 'facile', label: 'Facile', prefilled: 0.75 },
  { id: 'moyen', label: 'Moyen', prefilled: 0.4 },
  { id: 'reel', label: 'Réel', prefilled: 0 },
];

export const DEFAULT_LEVEL = 'moyen';

export const levelById = (id) => LEVELS.find((level) => level.id === id) ?? levelById(DEFAULT_LEVEL);

export const cellKey = (tense, index) => `${tense}:${index}`;

function shuffled(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function newGame(board, level, random = Math.random) {
  const playable = Object.entries(board.tenses).flatMap(([tense, { cells }]) =>
    cells.flatMap((cell, index) => (cell ? [[cellKey(tense, index), cell]] : [])),
  );
  const given = new Set(
    shuffled(playable.map(([key]) => key), random).slice(0, Math.round(playable.length * level.prefilled)),
  );
  const cells = Object.fromEntries(
    playable.map(([key, { answers }]) => [
      key,
      given.has(key)
        ? { answers, value: answers[0], status: 'given', attempts: 0, checked: answers[0] }
        : { answers, value: '', status: 'empty', attempts: 0, checked: '' },
    ]),
  );
  return { cells, finished: false };
}

export const isLocked = (cell) => ['given', 'correct', 'revealed'].includes(cell.status);

function updateCell(state, key, update) {
  const cell = state.cells[key];
  if (!cell || isLocked(cell) || state.finished) return state;
  return { ...state, cells: { ...state.cells, [key]: { ...cell, ...update(cell) } } };
}

function check(cell) {
  const status = grade(cell.value, cell.answers);
  const attempted = status !== 'empty' && cell.value.trim() !== cell.checked.trim();
  return { status, attempts: cell.attempts + (attempted ? 1 : 0), checked: cell.value };
}

function reveal(cell) {
  return isLocked(cell) ? cell : { ...cell, status: 'revealed', value: cell.answers[0], lastAttempt: cell.value };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'type':
      return updateCell(state, action.key, () => ({ value: action.value }));
    case 'check':
      return updateCell(state, action.key, check);
    case 'finish':
      return {
        finished: true,
        cells: Object.fromEntries(Object.entries(state.cells).map(([key, cell]) => [key, reveal(cell)])),
      };
    case 'restart':
      return action.game;
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}

export function scoreOf(state) {
  const cells = Object.values(state.cells);
  const playable = cells.filter((cell) => cell.status !== 'given');
  const correct = playable.filter((cell) => cell.status === 'correct');
  return {
    playable: playable.length,
    correct: correct.length,
    firstTry: correct.filter((cell) => cell.attempts === 1).length,
    afterRetry: correct.filter((cell) => cell.attempts > 1).length,
    revealed: playable.filter((cell) => cell.status === 'revealed').length,
    complete: playable.length > 0 && correct.length === playable.length,
  };
}
