import { COMPLEMENTS } from '../../grammar/marks.js';
import LevelBadge from '../LevelBadge.jsx';
import SeeAlso from '../SeeAlso.jsx';
import Complements, { Swatch } from './Complements.jsx';
import Examples from './Examples.jsx';

/**
 * Pronouns in the order they take, as a chain of chips.
 * @param {{ steps: string[] }} props
 */
function Order({ steps }) {
  return (
    <ol aria-label="Ordre des pronoms" className="mt-3 flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true" className="text-stone-400">→</span>}
          <span lang="fr" className="rounded-lg border border-stone-200 bg-white px-2 py-1 font-serif text-stone-800">
            <Complements text={step} />
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * A rule's table: a header row, then one row per line, its label first.
 * @param {{ table: { head: string[], rows: string[][] } }} props
 */
function Table({ table }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-stone-500">
            {table.head.map((cell, index) =>
              cell ? (
                <th key={index} scope="col" className="px-3 py-2 font-medium">
                  {COMPLEMENTS[cell] ? <Swatch kind={cell} /> : cell}
                </th>
              ) : (
                <td key={index} />
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {table.rows.map(([label, ...cells]) => (
            <tr key={label} className="border-t border-stone-100">
              <th scope="row" lang="fr" className="px-3 py-1.5 text-left text-xs font-normal whitespace-nowrap text-stone-500">
                {label}
              </th>
              {cells.map((cell, index) => (
                <td key={index} lang="fr" className="px-3 py-1.5 font-serif text-stone-900"><Complements text={cell} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * One grammar rule in its own anchored section: level, explanation, table or pronoun order, examples.
 * @param {{ rule: { id: string, level: string, title: string, text: string, order?: string[], table?: object, examples: object[], see?: object } }} props
 */
export default function Rule({ rule }) {
  return (
    <section id={rule.id} aria-labelledby={`${rule.id}-title`} className="scroll-mt-6">
      <div className="flex items-baseline gap-2">
        <LevelBadge level={rule.level} />
        <h3 id={`${rule.id}-title`} className="font-serif text-xl font-semibold text-stone-900"><Complements text={rule.title} /></h3>
      </div>
      <p className="mt-2 text-stone-700"><Complements text={rule.text} /></p>
      {rule.order && <Order steps={rule.order} />}
      {rule.table && <Table table={rule.table} />}
      <Examples examples={rule.examples} />
      {rule.see && <SeeAlso see={rule.see} />}
    </section>
  );
}
