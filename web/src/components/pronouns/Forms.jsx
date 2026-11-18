import { Fragment } from 'react';
import Marked from '../Marked.jsx';
import FormText from './FormText.jsx';
import { TINT } from './hue.js';

/**
 * One form of the family, marked while it is the one picked in the table.
 * @param {{ form: { key: string, form: string, elided?: string }, highlighted: string | null }} props
 */
function Form({ form, highlighted }) {
  if (form.key === highlighted) {
    return (
      <mark className={`rounded-md px-1.5 font-serif text-stone-900 ring-2 ring-yellow-400 ${TINT}`}>
        <FormText form={form} />
      </mark>
    );
  }
  return <span className="px-1.5 font-serif text-stone-900"><FormText form={form} /></span>;
}

/**
 * A family's forms: a table by person (or gender and number), or a list with a note per form.
 * @param {{ family: object, highlighted: string | null }} props
 */
export default function Forms({ family, highlighted }) {
  const { forms } = family;
  if ('list' in forms) {
    return (
      <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-2">
        {forms.list.map(({ note, ...form }) => (
          <Fragment key={form.key}>
            <dt lang="fr"><Form form={form} highlighted={highlighted} /></dt>
            <dd className="text-sm text-stone-700"><Marked text={note} /></dd>
          </Fragment>
        ))}
      </dl>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-stone-500">
            <td />
            {forms.columns.map((column) => (
              <th key={column} scope="col" className="px-2 pb-1 align-bottom font-medium whitespace-nowrap">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {forms.rows.map(({ label, cells }) => (
            <tr key={label} className="border-t border-stone-100">
              <th scope="row" className="py-1.5 pr-3 text-left text-xs font-normal whitespace-nowrap text-stone-500">{label}</th>
              {cells.map((cell, index) => (
                <td key={index} lang="fr" className="px-0.5 py-1.5 whitespace-nowrap">
                  {cell.map((form, position) => (
                    <Fragment key={form.key}>
                      {position > 0 && <span className="-ml-1.5 text-stone-400">,</span>}
                      <Form form={form} highlighted={highlighted} />
                    </Fragment>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
