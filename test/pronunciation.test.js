import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createPronunciation, fetchAudioFiles, pickAudioUrl } from '../server/pronunciation.js';
import { UpstreamError } from '../server/reverso.js';

const file = (name) => ({
  title: `Fichier:${name}`,
  url: `https://upload.wikimedia.org/wikipedia/commons/x/xy/${encodeURIComponent(name)}?utm_source=fr.wiktionary.org`,
});

test('pickAudioUrl prefers a Lingua Libre French recording of the exact word', () => {
  const files = [
    file('Wikipedia-logo-v2.svg'),
    file('LL-Q809 (pol)-Olaf-but.wav'),
    file('Fr-but.ogg'),
    file('LL-Q150 (fra)-WikiLucas00-but (verbe boire).wav'),
    file('LL-Q150 (fra)-Sartus85-but.wav'),
    file('LL-Q150 (fra)-Poslovitch-but.wav'),
  ];
  assert.equal(
    pickAudioUrl(files, 'but'),
    'https://upload.wikimedia.org/wikipedia/commons/x/xy/LL-Q150%20(fra)-Sartus85-but.wav',
  );
});

test('pickAudioUrl falls back to Fr- recordings, including regional ones', () => {
  assert.match(pickAudioUrl([file('Fr-bien que.ogg')], 'bien que'), /Fr-bien%20que\.ogg$/);
  assert.match(pickAudioUrl([file('Fr-Paris--accéder.ogg')], 'accéder'), /Fr-Paris--acc%C3%A9der\.ogg$/);
});

test('pickAudioUrl ignores other words, languages and non-audio files', () => {
  const files = [
    file('Fr-but-fr-CA-Québec-(Lac-Saint-Jean).ogg'),
    file('LL-Q1860 (eng)-Back ache-but.wav'),
    file('Fr-bien que.ogg'),
    file('Fr-but.svg'),
  ];
  assert.equal(pickAudioUrl(files, 'but'), null);
  assert.equal(pickAudioUrl(files, 'que'), null);
  assert.equal(pickAudioUrl([], 'but'), null);
});

test('pickAudioUrl matches typographic apostrophes and case', () => {
  assert.ok(pickAudioUrl([file('LL-Q150 (fra)-X-D’ailleurs.wav')], "d'ailleurs"));
});

test('fetchAudioFiles maps Wiktionary pages to file URLs', async () => {
  let requested;
  const fetch = async (url) => {
    requested = new URL(url);
    return Response.json({
      query: {
        pages: [
          { title: 'Fichier:Fr-but.ogg', imageinfo: [{ url: 'https://upload.wikimedia.org/a/ab/Fr-but.ogg' }] },
          { title: 'Fichier:Missing.ogg', missing: true },
        ],
      },
    });
  };
  assert.deepEqual(await fetchAudioFiles('but', { fetch }), [
    { title: 'Fichier:Fr-but.ogg', url: 'https://upload.wikimedia.org/a/ab/Fr-but.ogg' },
  ]);
  assert.equal(requested.searchParams.get('titles'), 'but');
  assert.equal(requested.searchParams.get('generator'), 'images');
  assert.deepEqual(await fetchAudioFiles('zzz', { fetch: async () => Response.json({ batchcomplete: true }) }), []);
});

test('fetchAudioFiles throws UpstreamError when Wiktionary fails', async () => {
  const rateLimited = async () => new Response('You are making too many requests', { status: 429 });
  await assert.rejects(fetchAudioFiles('but', { fetch: rateLimited }), UpstreamError);
  const notJson = async () => new Response('You are making too many requests');
  await assert.rejects(fetchAudioFiles('but', { fetch: notJson }), UpstreamError);
  const offline = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(fetchAudioFiles('but', { fetch: offline }), UpstreamError);
});

test('audioUrl caches found and missing recordings', async () => {
  const calls = [];
  const pronunciation = createPronunciation({
    db: openDb(':memory:'),
    fetchAudioFiles: async (word) => {
      calls.push(word);
      return word === 'but' ? [file('Fr-but.ogg')] : [];
    },
  });
  for (let i = 0; i < 2; i++) {
    assert.match(await pronunciation.audioUrl('but'), /Fr-but\.ogg$/);
    assert.equal(await pronunciation.audioUrl('zzz'), null);
  }
  assert.deepEqual(calls, ['but', 'zzz']);
});

test('audioUrl does not cache upstream failures', async () => {
  let attempts = 0;
  const pronunciation = createPronunciation({
    db: openDb(':memory:'),
    fetchAudioFiles: async () => {
      if (++attempts === 1) throw new UpstreamError('down');
      return [file('Fr-but.ogg')];
    },
  });
  await assert.rejects(pronunciation.audioUrl('but'), UpstreamError);
  assert.match(await pronunciation.audioUrl('but'), /Fr-but\.ogg$/);
});
