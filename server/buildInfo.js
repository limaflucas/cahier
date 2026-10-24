import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * Describes the running build.
 * @param {string} [root] directory holding package.json and an optional .commit file
 * @param {Record<string, string | undefined>} [env] environment; GIT_COMMIT overrides .commit
 * @returns {{ name: string, version: string, commit: string }}
 */
export function readBuildInfo(root = PROJECT_ROOT, env = process.env) {
  const { name, version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  return { name, version, commit: env.GIT_COMMIT || readCommitFile(root) || 'dev' };
}

/**
 * Reads the commit hash written at image build time.
 * @param {string} root
 * @returns {string} the hash, or '' when the file is absent
 */
function readCommitFile(root) {
  try {
    return readFileSync(join(root, '.commit'), 'utf8').trim();
  } catch {
    return '';
  }
}
