import { randomUUID } from 'node:crypto';

const SESSION_COOKIE = 'cahier_sid';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Reads one cookie from the request.
 * @param {import('express').Request} req
 * @param {string} name
 * @returns {string | undefined}
 */
function readCookie(req, name) {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
}

/**
 * The visitor's stable id for sticky Unleash rollouts, issuing one on first visit.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {string}
 */
function sessionId(req, res) {
  const existing = readCookie(req, SESSION_COOKIE);
  if (existing) return existing;
  const id = randomUUID();
  res.cookie(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: ONE_YEAR_MS });
  return id;
}

/**
 * What Unleash knows about the visitor: sticky session, address and browser.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {{ sessionId: string, remoteAddress: string, properties: { userAgent: string } }}
 */
export function visitorContext(req, res) {
  return { sessionId: sessionId(req, res), remoteAddress: req.ip, properties: { userAgent: req.get('user-agent') ?? '' } };
}
