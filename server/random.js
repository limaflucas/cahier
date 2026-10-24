export const pickOne = (items, random) => items[Math.floor(random() * items.length)];

export function shuffle(items, random) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function weightedChoice(choices, random) {
  let ticket = random() * choices.reduce((sum, { weight }) => sum + weight, 0);
  for (const { value, weight } of choices) {
    ticket -= weight;
    if (ticket < 0) return value;
  }
  return choices.at(-1).value;
}
