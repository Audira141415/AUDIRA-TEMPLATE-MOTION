import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { LandingConfig, DEFAULT_LANDING_CONFIG } from '@/types/landing';

export type { LandingConfig, TestimonialItem, TrustStatItem, FaqItem } from '@/types/landing';
export { DEFAULT_LANDING_CONFIG } from '@/types/landing';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'landing-config.json');

export function readLandingConfig(): LandingConfig {
  if (!existsSync(CONFIG_FILE)) {
    writeLandingConfig(DEFAULT_LANDING_CONFIG);
    return DEFAULT_LANDING_CONFIG;
  }
  try {
    const raw = readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_LANDING_CONFIG,
      ...parsed,
      hero: { ...DEFAULT_LANDING_CONFIG.hero, ...(parsed.hero || {}) },
      sectionVisibility: { ...DEFAULT_LANDING_CONFIG.sectionVisibility, ...(parsed.sectionVisibility || {}) },
      pricingTiers: { ...DEFAULT_LANDING_CONFIG.pricingTiers, ...(parsed.pricingTiers || {}) },
      dfyPlans: { ...DEFAULT_LANDING_CONFIG.dfyPlans, ...(parsed.dfyPlans || {}) },
      contact: { ...DEFAULT_LANDING_CONFIG.contact, ...(parsed.contact || {}) },
      promoBanner: { ...DEFAULT_LANDING_CONFIG.promoBanner, ...(parsed.promoBanner || {}) },
    };
  } catch (err) {
    console.error('Error reading landing-config.json:', err);
    return DEFAULT_LANDING_CONFIG;
  }
}

export function writeLandingConfig(config: LandingConfig): LandingConfig {
  mkdirSync(DATA_DIR, { recursive: true });
  const updated: LandingConfig = {
    ...config,
    updatedAt: new Date().toISOString()
  };
  const tmp = `${CONFIG_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(updated, null, 2));
  renameSync(tmp, CONFIG_FILE);
  return updated;
}
