export const REVIEW_DELAY = 3;
export const RECENT_SIZE = 5;

export const newSession = () => ({ asked: 0, correct: 0, recent: [], missed: [] });

export function nextRequest(session) {
  const due = session.missed.find((entry) => entry.dueAt <= session.asked);
  return due ? { word: due.word, sense: due.sense } : { exclude: session.recent };
}

export const isReview = (request) => request.word !== undefined;

const same = (a, b) => a.word === b.word && a.sense === b.sense;

export function recordAnswer(session, { request, question, correct }) {
  const asked = session.asked + 1;
  const missed = session.missed.filter((entry) => !same(entry, question) && !same(entry, request));
  if (!correct) missed.push({ word: question.word, sense: question.sense, dueAt: asked + REVIEW_DELAY });
  return {
    asked,
    correct: session.correct + (correct ? 1 : 0),
    recent: [question.word, ...session.recent.filter((word) => word !== question.word)].slice(0, RECENT_SIZE),
    missed,
  };
}
