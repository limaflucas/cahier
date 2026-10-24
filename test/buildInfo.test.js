import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readBuildInfo } from '../server/buildInfo.js';

function project({ commitFile } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'cahier-build-'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'cahier', version: '9.9.9' }));
  if (commitFile !== undefined) writeFileSync(join(dir, '.commit'), commitFile);
  return dir;
}

test('readBuildInfo reads the package version and the .commit file', () => {
  assert.deepEqual(readBuildInfo(project({ commitFile: 'deadbeef\n' }), {}), { name: 'cahier', version: '9.9.9', commit: 'deadbeef' });
});

test('readBuildInfo prefers GIT_COMMIT over the .commit file', () => {
  assert.equal(readBuildInfo(project({ commitFile: 'deadbeef' }), { GIT_COMMIT: 'cafe42' }).commit, 'cafe42');
});

test('readBuildInfo falls back to "dev" without a commit', () => {
  assert.equal(readBuildInfo(project(), {}).commit, 'dev');
});
