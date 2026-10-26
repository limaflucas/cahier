/** A failed API call; the message is the server's error code. */
export class ApiError extends Error {
  /**
   * @param {number} status
   * @param {string} code
   */
  constructor(status, code) {
    super(code);
    this.status = status;
  }
}

/**
 * Calls the API, sending `body` as JSON when given.
 * @param {string} path below /api
 * @param {{ method?: string, signal?: AbortSignal, body?: unknown }} [options]
 * @returns {Promise<any>} the JSON reply, or null for 204
 */
async function request(path, { method = 'GET', signal, body } = {}) {
  const json = body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  const res = await fetch(`/api${path}`, { method, signal, ...json });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? 'unknown');
  }
  return res.status === 204 ? null : res.json();
}

const enc = encodeURIComponent;

function memoirQuery({ word, sense, exclude = [] }) {
  const params = new URLSearchParams();
  if (word) params.set('word', word);
  if (sense !== undefined) params.set('sense', sense);
  exclude.forEach((w) => params.append('exclude', w));
  return params.toString();
}

export const api = {
  lookup: (word, signal) => request(`/dictionary/${enc(word)}`, { signal }),
  myWords: (signal) => request('/my-words', { signal }),
  save: (word) => request(`/my-words/${enc(word)}`, { method: 'PUT' }),
  unsave: (word) => request(`/my-words/${enc(word)}`, { method: 'DELETE' }),
  conjugation: (verb, signal) => request(`/conjugation/${enc(verb)}`, { signal }),
  memoirQuestion: (query, signal) => request(`/memoir/question?${memoirQuery(query)}`, { signal }),
  flags: (signal) => request('/flags', { signal }),
  version: (signal) => request('/version', { signal }),
  randomVerb: (exclude) => request(`/random-verb${exclude ? `?exclude=${enc(exclude)}` : ''}`),
  lists: (signal) => request('/lists', { signal }),
  list: (id, signal) => request(`/lists/${enc(id)}`, { signal }),
  createList: ({ name, emoji }) => request('/lists', { method: 'POST', body: { name, emoji } }),
  updateList: (id, patch) => request(`/lists/${enc(id)}`, { method: 'PATCH', body: patch }),
  deleteList: (id) => request(`/lists/${enc(id)}`, { method: 'DELETE' }),
};
