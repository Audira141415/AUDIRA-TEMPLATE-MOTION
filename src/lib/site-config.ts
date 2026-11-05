import 'server-only';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export interface SiteConfig {
  whatsappNumber: string;
  ownerName: string;
  bcaAccountNumber: string;
  bcaAccountName: string;
  pricing: {
    starter: string;
    starterOriginal: string;
    master: string;
    masterOriginal: string;
    lab: string;
    labOriginal: string;
    dfySingle: string;
    dfySingleOriginal: string;
    dfyBundle: string;
    dfyBundleOriginal: string;
    dfyRetainer: string;
    dfyRetainerOriginal: string;
  };
  promoBanner: {
    enabled: boolean;
    badge: string;
    text: string;
    link: string;
  };
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');

const DEFAULT_CONFIG: SiteConfig = {
  whatsappNumber: '6285709666240',
  ownerName: 'Agus Dwi Rianto (AUDIRA MDA)',
  bcaAccountNumber: '8691888291',
  bcaAccountName: 'Agus Dwi Rianto',
  pricing: {
    starter: 'Rp149.000',
    starterOriginal: 'Rp299.000',
    master: 'Rp299.000',
    masterOriginal: 'Rp599.000',
    lab: 'Rp499.000',
    labOriginal: 'Rp999.000',
    dfySingle: 'Rp349.000',
    dfySingleOriginal: 'Rp550.000',
    dfyBundle: 'Rp1.399.000',
    dfyBundleOriginal: 'Rp1.745.000',
    dfyRetainer: 'Rp3.490.000',
    dfyRetainerOriginal: 'Rp5.500.000'
  },
  promoBanner: {
    enabled: true,
    badge: 'PROMO SPESIAL 2026',
    text: 'Gratis Bundling AUDIRA Skill Mesh (MCP Server) + Panduan Lengkap untuk Setiap Pembelian Lisensi Resmi',
    link: '#produk'
  },
  updatedAt: new Date().toISOString()
};

export function readSiteConfig(): SiteConfig {
  if (!existsSync(CONFIG_FILE)) {
    writeSiteConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  try {
    const raw = readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(raw) as SiteConfig;
  } catch (err) {
    console.error('Error reading site-config.json:', err);
    return DEFAULT_CONFIG;
  }
}

export function writeSiteConfig(config: SiteConfig): SiteConfig {
  mkdirSync(DATA_DIR, { recursive: true });
  const updated = {
    ...config,
    updatedAt: new Date().toISOString()
  };
  const tmp = `${CONFIG_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(updated, null, 2));
  renameSync(tmp, CONFIG_FILE);
  return updated;
}

