import 'server-only';
import { createHmac, randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SECRET_FILE = path.join(DATA_DIR, '.auth-secret');

export const SESSION_COOKIE = 'audira_session';
const SESSION_DAYS = 30;

export type Role = 'customer' | 'user' | 'superadmin';

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  role?: Role;
  disabled?: boolean;
};
export type PublicUser = { id: string; name: string; email: string; role: Role };
export type AdminUserView = PublicUser & { createdAt: string; disabled: boolean };

const toPublic = ({ id, name, email, role }: StoredUser): PublicUser => ({ 
  id, 
  name, 
  email, 
  role: role === 'superadmin' ? 'superadmin' : (role === 'user' ? 'user' : 'customer') 
});

const DEFAULT_SUPERADMINS: StoredUser[] = [
  {
    id: 'audira-superadmin-2026',
    name: 'Audira',
    email: 'audira@audira.my.id',
    passwordHash: 'scrypt$PzGad1R+YsByzGLIiXPCTw==$7/qXiVrqGhD5ZG3Kpl4zlj6grLgbmtgLf6CNNrWsNooZVNk90YOdeeFOJ1u4sHKDR04A3q0OYJvZVmFzAeOSIA==',
    createdAt: '2026-11-05T09:00:00.000Z',
    role: 'superadmin',
  },
  {
    id: 'fbb381df-238a-43fc-b6bb-d4b4d8063765',
    name: 'Agus Dwi Rianto',
    email: 'official@audira.my.id',
    passwordHash: 'scrypt$PzGad1R+YsByzGLIiXPCTw==$7/qXiVrqGhD5ZG3Kpl4zlj6grLgbmtgLf6CNNrWsNooZVNk90YOdeeFOJ1u4sHKDR04A3q0OYJvZVmFzAeOSIA==',
    createdAt: '2026-10-31T06:31:44.134Z',
    role: 'superadmin',
  },
];

function readUsers(): StoredUser[] {
  if (!existsSync(USERS_FILE)) {
    writeUsers(DEFAULT_SUPERADMINS);
    return DEFAULT_SUPERADMINS;
  }
  try {
    const users = JSON.parse(readFileSync(USERS_FILE, 'utf8')) as StoredUser[];
    if (!users.some((u) => u.email === 'audira@audira.my.id')) {
      users.unshift(DEFAULT_SUPERADMINS[0]);
      writeUsers(users);
    }
    return users;
  } catch {
    return DEFAULT_SUPERADMINS;
  }
}

function writeUsers(users: StoredUser[]) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${USERS_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(users, null, 2));
  renameSync(tmp, USERS_FILE);
}

function secret(): Buffer {
  if (process.env.AUTH_SECRET) return Buffer.from(process.env.AUTH_SECRET);
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET wajib diset di production');
  if (!existsSync(SECRET_FILE)) {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(SECRET_FILE, randomBytes(32).toString('hex'));
  }
  return Buffer.from(readFileSync(SECRET_FILE, 'utf8').trim());
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

async function verifyPassword(password: string, stored: string) {
  const [, saltB64, keyB64] = stored.split('$');
  const expected = Buffer.from(keyB64, 'base64');
  const key = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
  return timingSafeEqual(key, expected);
}

// A fixed hash to compare against when the email is unknown, so a miss takes as long as a hit.
const DUMMY_HASH = 'scrypt$AAAAAAAAAAAAAAAAAAAAAA==$' + Buffer.alloc(64).toString('base64');

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function validateRegistration(input: { name?: string; email?: string; password?: string }) {
  const name = input.name?.trim() ?? '';
  const email = normalizeEmail(input.email ?? '');
  const password = input.password ?? '';
  if (name.length < 2 || name.length > 60) return { error: 'Nama harus 2–60 karakter.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return { error: 'Format email tidak valid.' };
  if (password.length < 8 || password.length > 128) return { error: 'Kata sandi minimal 8 karakter.' };
  return { name, email, password };
}

export async function createUser(
  name: string, 
  email: string, 
  password: string, 
  role: Role = 'customer'
): Promise<PublicUser | null> {
  const users = readUsers();
  const norm = normalizeEmail(email);
  if (users.some((u) => u.email === norm)) return null;

  // Strict Security Gate: Public registration ALWAYS defaults to 'customer' (or 'user').
  // Never allow public creation of 'superadmin'.
  const safeRole: Role = role === 'superadmin' ? 'customer' : (role || 'customer');

  const user: StoredUser = { 
    id: randomUUID(), 
    name, 
    email: norm, 
    passwordHash: await hashPassword(password), 
    createdAt: new Date().toISOString(),
    role: safeRole
  };
  writeUsers([...users, user]);
  return toPublic(user);
}

export async function authenticate(emailOrUsername: string, password: string): Promise<PublicUser | null> {
  const norm = normalizeEmail(emailOrUsername);
  const user = readUsers().find(
    (u) =>
      u.email === norm ||
      (norm === 'audira' && (u.email === 'audira@audira.my.id' || u.name.toLowerCase() === 'audira')),
  );
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  return user && ok && !user.disabled ? toPublic(user) : null;
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export async function startSession(userId: string) {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString('base64url');
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<PublicUser | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { uid: string; exp: number };
  if (Date.now() > exp) return null;
  const user = readUsers().find((u) => u.id === uid);
  return user && !user.disabled ? toPublic(user) : null;
}

export async function currentAdmin(): Promise<PublicUser | null> {
  const user = await currentUser();
  return user?.role === 'superadmin' ? user : null;
}

export async function requireSuperadmin(): Promise<PublicUser> {
  const admin = await currentAdmin();
  if (!admin) {
    throw new Error('Akses khusus superadmin. Akun Anda tidak memiliki izin mengelola sistem ini.');
  }
  return admin;
}

export function listUsers(): AdminUserView[] {
  return readUsers().map((u) => ({ ...toPublic(u), createdAt: u.createdAt, disabled: !!u.disabled }));
}

// Applies an admin change to another account. Refuses anything that would leave the
// site without an active superadmin, and any change an admin makes to their own account.
export function updateUserByAdmin(
  actorId: string,
  targetId: string,
  change: { role?: Role; disabled?: boolean } | 'delete',
): { error: string } | { ok: true } {
  if (actorId === targetId) return { error: 'Tidak bisa mengubah akun sendiri dari sini.' };
  const users = readUsers();
  const target = users.find((u) => u.id === targetId);
  if (!target) return { error: 'Pengguna tidak ditemukan.' };

  const next =
    change === 'delete'
      ? users.filter((u) => u.id !== targetId)
      : users.map((u) => (u.id === targetId ? { ...u, ...change } : u));
  if (!next.some((u) => u.role === 'superadmin' && !u.disabled)) {
    return { error: 'Harus tersisa minimal satu superadmin aktif.' };
  }
  writeUsers(next);
  return { ok: true };
}

// Small in-memory brake on password guessing: 8 attempts per key per 10 minutes.
const attempts = new Map<string, { count: number; reset: number }>();
export function tooManyAttempts(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.reset) {
    attempts.set(key, { count: 1, reset: now + 600_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}
