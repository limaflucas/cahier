import Marked from '../Marked.jsx';

const PERSONS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

function rowsOf(formation) {
  return [
    ...(formation.endings ?? []).map(({ label, forms }) => ({ label: label ?? 'terminaisons', forms })),
    ...Object.entries(formation.auxiliary ?? {}).map(([auxiliary, forms]) => ({ label: auxiliary, forms })),
  ];
}

function FormsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-md text-sm">
        <thead>
          <tr className="text-left text-xs text-stone-500">
            <td />
            {PERSONS.map((person) => (
              <th key={person} scope="col" className="px-2 pb-1 font-medium">{person}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, forms }) => (
            <tr key={label} className="border-t border-stone-100">
              <th scope="row" className="py-1.5 pr-3 text-left text-xs font-medium text-stone-600">{label}</th>
              {forms.map((form, i) => (
                <td key={i} lang="fr" className="px-2 py-1.5 font-serif text-stone-900">{form}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
