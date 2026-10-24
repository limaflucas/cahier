export const ADVANCED_LEVELS = new Set(['B2', 'C1']);

export function levelWeight(senses, bonus) {
  const advanced = senses.filter((sense) => ADVANCED_LEVELS.has(sense.level)).length;
  return 1 + (bonus * advanced) / senses.length;
}
