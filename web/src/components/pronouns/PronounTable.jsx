import { Fragment } from 'react';
import { FAMILIES, FAMILIES_BY_ID, formsOf } from '../../pronouns/index.js';
import { FREE_ROWS, PERSON_ROWS, TABLE_COLUMNS } from '../../pronouns/table.js';
import FormText from './FormText.jsx';
import PickLink from './PickLink.jsx';
import { TINT, TINT_HOVER, WASH, hueStyle } from './hue.js';

const FORMS = Object.fromEntries(FAMILIES.map((family) => [family.id, new Map(formsOf(family).map((form) => [form.key, form]))]));
const BORDER = 'border border-stone-200';

/**
 * The header groups: one per family, with its parts (COD, COI) when it spans several columns.
 * @returns {{ family: string, parts: string[] }[]}
 */
function headerGroups() {
  const groups = [];
  for (const { family, part } of TABLE_COLUMNS) {
    const last = groups.at(-1);
    if (last?.family === family) last.parts.push(part);
    else groups.push({ family, parts: part ? [part] : [] });
  }
  return groups;
}

/**
 * A family's name as a tinted pill that opens its section.
 * @param {{ family: string, label?: string, onPick: Function }} props
 */
function FamilyPill({ family, label, onPick }) {
  const { hue, label: name } = FAMILIES_BY_ID[family];
  return (
    <PickLink
      to={family}
      onPick={onPick}
      style={hueStyle(hue)}
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${TINT} hover:brightness-95`}
    >
      {label ?? name}
    </PickLink>
  );
}

/**
 * The pronouns of one family, as links that open its section on that pronoun.
 * @param {{ family: string, keys: string[], onPick: Function }} props
 */
function FormLinks({ family, keys, onPick }) {
  return keys.map((key, index) => (
    <Fragment key={key}>
      {index > 0 && <span aria-hidden="true" className="text-stone-300">·</span>}
      <PickLink
        to={family}
        formKey={key}
        onPick={onPick}
        className={`rounded-md px-1.5 font-serif text-base text-stone-900 ${TINT_HOVER}`}
      >
        <FormText form={FORMS[family].get(key)} />
      </PickLink>
    </Fragment>
  ));
}

/**
 * One cell of the person rows.
 * @param {{ family: string, cell: { keys?: string[], none?: true, span?: number }, onPick: Function }} props
 */
function PersonCell({ family, cell, onPick }) {
  const props = { rowSpan: cell.span, style: hueStyle(FAMILIES_BY_ID[family].hue) };
  if (cell.none) {
    return <td {...props} className={`${BORDER} ${WASH} px-2 py-1.5 text-center text-stone-400`}>—<sup>*</sup></td>;
  }
  const lines = cell.keys.length > 2 ? [cell.keys.slice(0, 2), cell.keys.slice(2)] : [cell.keys];
  return (
    <td {...props} className={`${BORDER} ${WASH} px-1.5 py-1.5`}>
      {lines.map((keys) => (
        <div key={keys[0]} className="whitespace-nowrap">
          <FormLinks family={family} keys={keys} onPick={onPick} />
        </div>
      ))}
    </td>
  );
}

/**
 * Every pronoun of the eleven families in one table: by person, then the families that don't vary with it.
 * @param {{ onPick: (id: string, key?: string) => void }} props
 */
export default function PronounTable({ onPick }) {
  const groups = headerGroups();
  return (
    <section id="tableau" aria-labelledby="tableau-title" className="mt-10 scroll-mt-6">
      <h2 id="tableau-title" tabIndex={-1} className="font-serif text-2xl font-semibold text-stone-900 focus:outline-none">Le tableau</h2>
      <p className="mt-1 text-sm text-stone-500">Cliquez sur un pronom ou sur le nom d'une famille pour lire son explication.</p>
      <div className="mt-4 overflow-x-auto">
        <table aria-labelledby="tableau-title" className="w-full min-w-[46rem] border-collapse bg-white text-left text-sm">
          <thead>
            <tr>
              <td rowSpan={2} className={BORDER} />
              {groups.map(({ family, parts }) => (
                <th key={family} scope="col" colSpan={parts.length || undefined} rowSpan={parts.length ? undefined : 2} className={`${BORDER} px-2 py-2 font-normal`}>
                  <FamilyPill family={family} onPick={onPick} />
                </th>
              ))}
            </tr>
            <tr>
              {groups.flatMap(({ family, parts }) => parts.map((part) => (
                <th key={part} scope="col" className={`${BORDER} px-2 py-1.5 font-normal`}>
                  <FamilyPill family={family} label={part} onPick={onPick} />
                </th>
              )))}
            </tr>
          </thead>
          <tbody>
            {PERSON_ROWS.map(({ person, cells }, row) => (
              <tr key={row}>
                {person && (
                  <th scope="row" rowSpan={person.span} className={`${BORDER} px-3 py-1.5 text-xs font-medium whitespace-nowrap text-stone-500`}>
                    {person.label}
                  </th>
                )}
                {cells.map((cell, column) => cell && (
                  <PersonCell key={column} family={TABLE_COLUMNS[column].family} cell={cell} onPick={onPick} />
                ))}
              </tr>
            ))}
          </tbody>
          <tbody>
            <tr>
              <th scope="rowgroup" colSpan={TABLE_COLUMNS.length + 1} className={`${BORDER} bg-stone-100 px-3 py-2 text-xs font-semibold tracking-wide text-stone-500 uppercase`}>
                Ne changent pas avec la personne
              </th>
            </tr>
            {FREE_ROWS.map(({ family, keys, more }) => (
              <tr key={family}>
                <th scope="row" colSpan={2} className={`${BORDER} px-2 py-2 font-normal`}>
                  <FamilyPill family={family} onPick={onPick} />
                </th>
                <td colSpan={TABLE_COLUMNS.length - 1} style={hueStyle(FAMILIES_BY_ID[family].hue)} className={`${BORDER} ${WASH} px-1.5 py-2`}>
                  <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                    <FormLinks family={family} keys={keys ?? [...FORMS[family].keys()]} onPick={onPick} />
                    {more && <span className="ml-2 text-xs text-stone-500">{more}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-stone-500">
        * <em>on</em> n'a pas de forme COD ni COI : on emploie <strong className="font-semibold text-stone-700">nous</strong> (on = nous) ou{' '}
        <strong className="font-semibold text-stone-700">vous</strong> (on = les gens).
      </p>
    </section>
  );
}
