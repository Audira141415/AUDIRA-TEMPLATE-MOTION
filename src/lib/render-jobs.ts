import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const RENDERS_DIR = path.join(process.cwd(), 'renders');

const ID = /^reel-[a-z0-9]+$/;

export function jobDir(id: string): string | null {
  return ID.test(id) ? path.join(RENDERS_DIR, id) : null;
}

export function setJobOwner(dir: string, userId: string) {
  writeFileSync(path.join(dir, 'owner.json'), JSON.stringify({ userId }));
}

// The job's folder, or null when it doesn't exist or belongs to someone else.
export function ownedJobDir(id: string, userId: string): string | null {
  const dir = jobDir(id);
  const ownerFile = dir && path.join(dir, 'owner.json');
  if (!ownerFile || !existsSync(ownerFile)) return null;
  return JSON.parse(readFileSync(ownerFile, 'utf8')).userId === userId ? dir : null;
}

export type JobSummary = { id: string; ownerId: string | null; state: string; title: string; format: string; createdAt: string; hasFile: boolean };

export function listJobs(): JobSummary[] {
  if (!existsSync(RENDERS_DIR)) return [];
  const read = (file: string) => {
    try {
      return JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      return null;
    }
  };
  return readdirSync(RENDERS_DIR)
    .filter((id) => ID.test(id))
    .map((id) => {
      const dir = path.join(RENDERS_DIR, id);
      const input = read(path.join(dir, 'input.json')) ?? {};
      return {
        id,
        ownerId: read(path.join(dir, 'owner.json'))?.userId ?? null,
        state: read(path.join(dir, 'status.json'))?.state ?? 'unknown',
        title: input.title ?? id,
        format: input.format ?? '-',
        createdAt: statSync(dir).birthtime.toISOString(),
        hasFile: existsSync(path.join(dir, 'reel.mp4')),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
