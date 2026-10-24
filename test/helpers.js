import { readFileSync } from 'node:fs';

export const fixture = (name) =>
  JSON.parse(readFileSync(new URL(`./fixtures/reverso-${name}.json`, import.meta.url), 'utf8'));

export async function withServer(app, fn) {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  try {
    return await fn(base);
  } finally {
    server.close();
  }
}
