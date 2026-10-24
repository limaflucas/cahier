import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { openDb } from '../server/db.js';
import { importData } from '../server/importData.js';

const [sourcePath, targetPath = process.env.DB_PATH ?? 'data/french.db'] = process.argv.slice(2);

if (!sourcePath) {
  console.error('usage: node scripts/import-data.js <source.db> [target.db]');
  process.exit(2);
}
if (!existsSync(sourcePath)) {
  console.error(`${sourcePath}: no such file`);
  process.exit(1);
}

const source = new DatabaseSync(sourcePath, { readOnly: true });
const target = openDb(targetPath);
console.log(JSON.stringify(importData(source, target)));
source.close();
target.close();
