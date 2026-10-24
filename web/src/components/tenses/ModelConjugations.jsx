const MIN_VISIBLE_STEM = 2;

function commonPrefix(words) {
  let prefix = words[0];
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

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

export default function ModelConjugations({ tense, boards }) {
  const models = tense.models.map((verb) => boards[verb]).filter(Boolean);
  if (models.length === 0) return null;

  const formsOf = (board) => board.tenses[tense.id].cells.map((cell) => cell.answers[0]);
  const columns = models.map((board) => ({ verb: board.verb, forms: formsOf(board) }));
  const labels = models[0].tenses[tense.id].cells.map((cell) => cell.label);
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
                <th scope="row" lang="fr" className="py-1 pr-3 text-left text-xs font-normal whitespace-nowrap text-stone-500">
                  {label}
                </th>
              )}
              {columns.map(({ verb, forms }) => (
                <td key={verb} lang="fr" className="px-2 py-1 font-serif whitespace-nowrap text-stone-800">
                  <Form form={forms[index]} stem={commonPrefix(forms)} compound={compound} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
