import { negationParts } from '../../tenses/negation.js';

const MIN_VISIBLE_STEM = 2;

/**
 * The longest beginning all the words share.
 * @param {string[]} words
 * @returns {string}
 */
function commonPrefix(words) {
  let prefix = words[0];
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/**
 * A model form, its ending in blue, or its auxiliary when the tense is compound.
 * @param {{ form: string, stem: string, compound: boolean }} props
 */
function Form({ form, stem, compound }) {
  if (compound) {
    const split = form.lastIndexOf(' ');
    return (
      <>
        <span className="text-blue-700">{form.slice(0, split)}</span>
        {form.slice(split)}
      </>
    );
  }
  if (stem.length < MIN_VISIBLE_STEM || stem === form) return form;
  return (
    <>
      {stem}
      <span className="text-blue-700">{form.slice(stem.length)}</span>
    </>
  );
}

/**
 * A form's negative on a line of its own, ne, n' and pas in blue.
 * @param {{ form: string }} props
 */
function Negative({ form }) {
  return (
    <span className="block text-stone-600">
      {negationParts(form).map(({ text, negation }, index) =>
        negation ? <span key={index} className="text-blue-700">{text}</span> : text,
      )}
    </span>
  );
}

/**
 * A tense's model verbs side by side, each form above its negative.
 * @param {{ tense: object, boards: Record<string, object> }} props
 */
export default function ModelConjugations({ tense, boards }) {
  const models = tense.models.map((verb) => boards[verb]).filter(Boolean);
  if (models.length === 0) return null;

  const cellsOf = (board) => board.tenses[tense.id].cells;
  const columns = models.map((board) => ({
    verb: board.verb,
    forms: cellsOf(board).map((cell) => cell.answers[0]),
    negatives: cellsOf(board).map((cell) => cell.negative),
  }));
  const labels = cellsOf(models[0]).map((cell) => cell.label);
  const personal = labels.length > 1;
  const compound = Boolean(tense.formation.auxiliary);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            {personal && <td />}
            {columns.map(({ verb }) => (
              <th key={verb} scope="col" lang="fr" className="px-2 pb-1 font-serif font-semibold text-stone-900">{verb}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={index} className="border-t border-stone-100">
              {personal && (
                <th scope="row" lang="fr" className="py-1 pr-3 text-left align-baseline text-xs font-normal whitespace-nowrap text-stone-500">
                  {label}
                </th>
              )}
              {columns.map(({ verb, forms, negatives }) => (
                <td key={verb} lang="fr" className="px-2 py-1 align-baseline font-serif whitespace-nowrap text-stone-800">
                  <Form form={forms[index]} stem={commonPrefix(forms)} compound={compound} />
                  <Negative form={negatives[index]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
