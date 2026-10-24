export class ApiError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
  }
}

async function request(path, { method = 'GET', signal } = {}) {
  const res = await fetch(`/api${path}`, { method, signal });
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
  randomVerb: (exclude) => request(`/random-verb${exclude ? `?exclude=${enc(exclude)}` : ''}`),
};
