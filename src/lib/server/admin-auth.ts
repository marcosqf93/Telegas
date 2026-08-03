type PairRecord = {
  email: string;
  code: string;
  expiresAt: number;
};

type SessionRecord = {
  email: string;
  token: string;
  trustedAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __telegasPairCodes: Map<string, PairRecord> | undefined;
  // eslint-disable-next-line no-var
  var __telegasAdminSessions: Map<string, SessionRecord> | undefined;
}

const pairCodes = globalThis.__telegasPairCodes ?? new Map<string, PairRecord>();
const adminSessions = globalThis.__telegasAdminSessions ?? new Map<string, SessionRecord>();

globalThis.__telegasPairCodes = pairCodes;
globalThis.__telegasAdminSessions = adminSessions;

function makeCode() {
  return String(Math.floor(Math.random() * 90) + 10);
}

function makeToken() {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function createPairCode(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const code = makeCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  pairCodes.set(normalizedEmail, { email: normalizedEmail, code, expiresAt });
  return { email: normalizedEmail, code, expiresAt };
}

export function confirmPairCode(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const record = pairCodes.get(normalizedEmail);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    pairCodes.delete(normalizedEmail);
    return null;
  }
  if (record.code !== code.trim()) return null;

  const session = { email: normalizedEmail, token: makeToken(), trustedAt: new Date().toISOString() };
  adminSessions.set(session.token, session);
  pairCodes.delete(normalizedEmail);
  return session;
}
