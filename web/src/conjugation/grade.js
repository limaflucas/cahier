import { normalizeAnswer, withoutAccents } from '../answer.js';

export { normalizeAnswer };

const SUBJECT = /^(?:que |qu')?(?:je |j'|tu |il |elle |on |nous |vous |ils |elles )/;

export function grade(input, answers) {
  const value = normalizeAnswer(input);
  if (!value) return 'empty';
  const readings = [value, value.replace(SUBJECT, '')];
  const accepted = answers.map(normalizeAnswer);
  if (readings.some((reading) => accepted.includes(reading))) return 'correct';
  const acceptedLoosely = accepted.map(withoutAccents);
  if (readings.some((reading) => acceptedLoosely.includes(withoutAccents(reading)))) return 'accent';
  return 'wrong';
}
