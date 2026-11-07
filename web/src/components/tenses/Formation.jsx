import Marked from '../Marked.jsx';

const PERSONS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

/**
 * The formation's ending series and auxiliaries, each with its six forms.
 * @param {{ endings?: { label: string | null, forms: string[] }[], auxiliary?: Record<string, string[]> }} formation
 * @returns {{ label: string, forms: string[] }[]}
 */
function rowsOf(formation) {
  return [
    ...(formation.endings ?? []).map(({ label, forms }) => ({ label: label ?? 'terminaisons', forms })),
    ...Object.entries(formation.auxiliary ?? {}).map(([auxiliary, forms]) => ({ label: auxiliary, forms })),
  ];
}

/**
 * The forms as a table with one row per person and one column per series.
 * @param {{ rows: { label: string, forms: string[] }[] }} props
 */
function FormsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-stone-500">
            <td />
            {rows.map(({ label }) => (
              <th key={label} scope="col" className="px-2 pb-1 align-bottom font-medium">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERSONS.map((person, index) => (
            <tr key={person} className="border-t border-stone-100">
              <th scope="row" lang="fr" className="py-1.5 pr-3 text-left text-xs font-normal whitespace-nowrap text-stone-500">
                {person}
              </th>
              {rows.map(({ label, forms }) => (
                <td key={label} lang="fr" className="px-2 py-1.5 font-serif text-stone-900">{forms[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The forms as a compact list, one line per series.
 * @param {{ rows: { label: string, forms: string[] }[] }} props
 */
function FormsList({ rows }) {
  return (
    <ul className="space-y-0.5">
      {rows.map(({ label, forms }) => (
        <li key={label}>
          <span className="text-stone-500">{label} : </span>
          <span lang="fr" className="font-serif text-stone-900">{forms.join(', ')}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * How a tense is formed: the rule, its forms and the notes.
 * @param {{ formation: object, compact?: boolean }} props compact lists the forms instead of tabulating them
 */
export default function Formation({ formation, compact = false }) {
  const rows = rowsOf(formation);
  const Forms = compact ? FormsList : FormsTable;
  return (
    <div className="space-y-3">
      <p className="text-stone-800"><Marked text={formation.rule} /></p>
      {rows.length > 0 && <Forms rows={rows} />}
      {formation.notes?.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-stone-600 marker:text-stone-300">
          {formation.notes.map((note) => <li key={note}><Marked text={note} /></li>)}
        </ul>
      )}
    </div>
  );
}
