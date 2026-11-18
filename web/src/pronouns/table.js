/**
 * A table cell holding the forms with these keys, spanning rows when they repeat below.
 * @param {string[]} keys
 * @param {number} [span]
 */
const cell = (keys, span) => (span ? { keys, span } : { keys });

const NONE = { none: true };

export const TABLE_COLUMNS = [
  { family: 'personnels' },
  { family: 'toniques' },
  { family: 'possessifs' },
  { family: 'reflechis' },
  { family: 'cod-coi', part: 'COD' },
  { family: 'cod-coi', part: 'COI' },
];

export const PERSON_ROWS = [
  {
    person: { label: '1re sing.', span: 1 },
    cells: [cell(['je']), cell(['moi']), cell(['le mien', 'la mienne', 'les miens', 'les miennes']), cell(['me']), cell(['cod:me']), cell(['coi:me'])],
  },
  {
    person: { label: '2e sing.', span: 1 },
    cells: [cell(['tu']), cell(['toi']), cell(['le tien', 'la tienne', 'les tiens', 'les tiennes']), cell(['te']), cell(['cod:te']), cell(['coi:te'])],
  },
  {
    person: { label: '3e sing.', span: 3 },
    cells: [cell(['il']), cell(['lui']), cell(['le sien', 'la sienne', 'les siens', 'les siennes'], 3), cell(['se'], 3), cell(['cod:le']), cell(['coi:lui'], 2)],
  },
  { person: null, cells: [cell(['elle']), cell(['elle']), null, null, cell(['cod:la']), null] },
  { person: null, cells: [cell(['on']), cell(['soi']), null, null, NONE, NONE] },
  {
    person: { label: '1re plur.', span: 1 },
    cells: [cell(['nous']), cell(['nous']), cell(['le nôtre', 'la nôtre', 'les nôtres']), cell(['nous']), cell(['cod:nous']), cell(['coi:nous'])],
  },
  {
    person: { label: '2e plur.', span: 1 },
    cells: [cell(['vous']), cell(['vous']), cell(['le vôtre', 'la vôtre', 'les vôtres']), cell(['vous']), cell(['cod:vous']), cell(['coi:vous'])],
  },
  {
    person: { label: '3e plur.', span: 2 },
    cells: [cell(['ils']), cell(['eux']), cell(['le leur', 'la leur', 'les leurs'], 2), cell(['se'], 2), cell(['cod:les'], 2), cell(['coi:leur'], 2)],
  },
  { person: null, cells: [cell(['elles']), cell(['elles']), null, null, null, null] },
];

export const FREE_ROWS = [
  { family: 'demonstratifs', keys: ['celui', 'celle', 'ceux', 'celles'], more: '+ -ci, -là, de, qui…' },
  { family: 'neutres' },
  { family: 'en-y' },
  { family: 'relatifs' },
  { family: 'interrogatifs' },
  { family: 'indefinis' },
];
