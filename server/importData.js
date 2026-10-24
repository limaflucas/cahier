/**
 * Copies into `target` every row of `source` that it lacks, for each table and column both share.
 * Rows already in `target` win, so running it again imports nothing.
 * @param {import('node:sqlite').DatabaseSync} source
 * @param {import('node:sqlite').DatabaseSync} target
 * @returns {Record<string, { source: number, imported: number }>} counts per table
 */
export function importData(source, target) {
  const sourceTables = new Set(tables(source));
  const report = {};
  target.exec('BEGIN');
  try {
    for (const table of tables(target).filter((name) => sourceTables.has(name))) {
      report[table] = copyTable(source, target, table);
    }
    target.exec('COMMIT');
  } catch (err) {
    target.exec('ROLLBACK');
    throw err;
  }
  return report;
}

/**
 * @param {import('node:sqlite').DatabaseSync} source
 * @param {import('node:sqlite').DatabaseSync} target
 * @param {string} table present in both databases
 * @returns {{ source: number, imported: number }}
 */
function copyTable(source, target, table) {
  const targetColumns = new Set(columns(target, table));
  const shared = columns(source, table).filter((name) => targetColumns.has(name));
  const list = shared.map(quote).join(', ');
  const insert = target.prepare(
    `INSERT INTO ${quote(table)} (${list}) VALUES (${shared.map(() => '?').join(', ')}) ON CONFLICT DO NOTHING`,
  );
  const rows = source.prepare(`SELECT ${list} FROM ${quote(table)}`).all();
  let imported = 0;
  for (const row of rows) imported += Number(insert.run(...shared.map((name) => row[name])).changes);
  return { source: rows.length, imported };
}

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @returns {string[]} user tables, sorted by name
 */
function tables(db) {
  return db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all().map(({ name }) => name);
}

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {string} table
 * @returns {string[]}
 */
function columns(db, table) {
  return db.prepare(`PRAGMA table_info(${quote(table)})`).all().map(({ name }) => name);
}

/**
 * @param {string} identifier
 * @returns {string} the identifier quoted for SQL
 */
function quote(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}
