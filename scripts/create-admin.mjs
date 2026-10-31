#!/usr/bin/env node
// Creates a superadmin account, or promotes an existing account, in data/users.json.
// The password is typed at the prompt (hidden) and never passed on the command line.
//
//   node scripts/create-admin.mjs <email> [--name "Nama Admin"]

import { randomBytes, randomUUID, scrypt as scryptCb } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

const argv = process.argv.slice(2);
const email = (argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--name') ?? '').trim().toLowerCase();
const nameFlag = argv.indexOf('--name');
const name = nameFlag >= 0 ? argv[nameFlag + 1]?.trim() : 'Superadmin';

const die = (msg) => {
  console.error(`x ${msg}`);
  process.exit(1);
};

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) die('pakai: node scripts/create-admin.mjs <email> [--name "Nama"]');

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
const lines = rl[Symbol.asyncIterator]();
let hideInput = false;
rl._writeToOutput = (s) => rl.output.write(hideInput && process.stdin.isTTY ? (s.includes('\n') ? '\n' : '') : s);

async function ask(question, hidden) {
  process.stdout.write(question);
  hideInput = hidden;
  const { value = '' } = await lines.next();
  hideInput = false;
  if (!process.stdin.isTTY) process.stdout.write('\n');
  return value;
}

const users = existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE, 'utf8')) : [];
const existing = users.find((u) => u.email === email);

let passwordHash = existing?.passwordHash;
if (!existing) {
  const password = await ask('Kata sandi baru (min. 8 karakter): ', true);
  if (password.length < 8) die('kata sandi minimal 8 karakter');
  const again = await ask('Ulangi kata sandi: ', true);
  if (again !== password) die('kata sandi tidak sama');
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  passwordHash = `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

rl.close();

const next = existing
  ? users.map((u) => (u.email === email ? { ...u, role: 'superadmin', disabled: false } : u))
  : [...users, { id: randomUUID(), name, email, passwordHash, createdAt: new Date().toISOString(), role: 'superadmin' }];

mkdirSync(path.dirname(USERS_FILE), { recursive: true });
writeFileSync(`${USERS_FILE}.tmp`, JSON.stringify(next, null, 2));
renameSync(`${USERS_FILE}.tmp`, USERS_FILE);

console.log(existing ? `ok ${email} sekarang superadmin (kata sandi tidak diubah)` : `ok superadmin ${email} dibuat`);
