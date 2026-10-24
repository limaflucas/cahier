const APOSTROPHES = /[’‘`´]/g;
const SUBJECT = /^(?:que |qu')?(?:je |j'|tu |il |elle |on |nous |vous |ils |elles )/;

export const normalizeAnswer = (text) =>
  text
    .normalize('NFC')
    .toLowerCase()
    .replace(APOSTROPHES, "'")
    .replace(/\s*'\s*/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const withoutAccents = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').normalize('NFC');

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
