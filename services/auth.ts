import { users } from '../mock-data/seed';
import { roles } from '../mock-data/roles';
import { permissionGrants } from '../mock-data/permissions';
import { endpoint, type ApiResult } from './mock-api';
import type { User } from '../mock-data/types';

const SESSION_KEY = 'wego.mock.session.v1';
export interface MockSession { token: string; userId: string; issuedAt: string; expiresAt: string; }
export interface AuthPayload { user: Omit<User, 'passwordHash'>; roles: typeof roles; permissions: typeof permissionGrants; session: MockSession; }
function safeUser(user: User): Omit<User, 'passwordHash'> { const { passwordHash: _secret, ...publicFields } = user; return publicFields; }
function token() { return `wego_demo_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`; }
function persist(session: MockSession | null) {
  if (typeof localStorage === 'undefined') return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

/** Password is a shared demonstration credential only; this mock hash is not cryptographic. */
export async function login(email: string, password: string): Promise<ApiResult<AuthPayload>> {
  return endpoint(() => {
    const user = users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.passwordHash === `mock-sha256:${password}` && candidate.status === 'active');
    if (!user) throw new Error('Invalid email or password');
    const issuedAt = new Date();
    const session: MockSession = { token: token(), userId: user.id, issuedAt: issuedAt.toISOString(), expiresAt: new Date(issuedAt.getTime() + 8 * 60 * 60 * 1000).toISOString() };
    persist(session);
    return { user: safeUser(user), roles: roles.filter((role) => user.roleIds.includes(role.id)), permissions: permissionGrants.filter((grant) => user.roleIds.includes(grant.roleId)), session };
  }, { errorRate: 0 });
}

export async function restoreSession(): Promise<ApiResult<AuthPayload | null>> {
  return endpoint(() => {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    let session: MockSession;
    try { session = JSON.parse(raw) as MockSession; } catch { persist(null); return null; }
    if (!session.token || Date.parse(session.expiresAt) <= Date.now()) { persist(null); return null; }
    const user = users.find((candidate) => candidate.id === session.userId && candidate.status === 'active');
    if (!user) { persist(null); return null; }
    return { user: safeUser(user), roles: roles.filter((role) => user.roleIds.includes(role.id)), permissions: permissionGrants.filter((grant) => user.roleIds.includes(grant.roleId)), session };
  }, { errorRate: 0 });
}
export async function logout(): Promise<ApiResult<null>> {
  return endpoint(() => { persist(null); return null; }, { errorRate: 0 });
}
