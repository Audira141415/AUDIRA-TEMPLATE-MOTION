import 'server-only';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ServerNodeConfig, ServerSystemConfig } from '@/types/server-monitoring';

export type { ServerNodeConfig, ServerSystemConfig };

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'server-config.json');

const DEFAULT_CONFIG: ServerSystemConfig = {
  primaryNodeId: 'local-node',
  nodes: [
    {
      id: 'local-node',
      name: 'AUDIRA Workstation (Current Host)',
      host: '127.0.0.1',
      port: 3788,
      protocol: 'http',
      sshUser: 'asus',
      sshPort: 22,
      deployPath: 'F:/AUDIRA-TEMPLATE-MOTION',
      role: 'local',
      isCurrent: true,
      healthUrl: 'http://127.0.0.1:3788/api/health',
      notes: 'Local development and motion preview workstation'
    },
    {
      id: 'prod-linux-main',
      name: 'AUDIRA Production Linux Server (Node 168)',
      host: '192.168.100.168',
      port: 3788,
      protocol: 'http',
      sshUser: 'audira',
      sshPort: 22,
      deployPath: '/home/audira/AUDIRA-TEMPLATE-MOTION',
      role: 'production',
      isCurrent: false,
      healthUrl: 'http://192.168.100.168:3788/api/health',
      notes: 'Main production Ubuntu Linux server running Docker / PM2'
    },
    {
      id: 'prod-linux-backup',
      name: 'AUDIRA Standby Cluster (Node 158)',
      host: '192.168.100.158',
      port: 3788,
      protocol: 'http',
      sshUser: 'audira',
      sshPort: 22,
      deployPath: '/home/audira/AUDIRA-TEMPLATE-MOTION',
      role: 'staging',
      isCurrent: false,
      healthUrl: 'http://192.168.100.158:3788/api/health',
      notes: 'Secondary failover node and dedicated render worker'
    }
  ],
  autoRefreshIntervalSec: 10,
  alertThresholds: {
    cpuPercent: 85,
    ramPercent: 90,
    diskPercent: 90
  },
  maintenanceMode: false,
  updatedAt: new Date().toISOString()
};

export function readServerConfig(): ServerSystemConfig {
  if (!existsSync(CONFIG_FILE)) {
    writeServerConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  try {
    const raw = readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ServerSystemConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      nodes: Array.isArray(parsed.nodes) && parsed.nodes.length > 0 ? parsed.nodes : DEFAULT_CONFIG.nodes,
      alertThresholds: {
        ...DEFAULT_CONFIG.alertThresholds,
        ...(parsed.alertThresholds || {})
      },
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch (err) {
    console.error('Error reading server-config.json, returning defaults:', err);
    return DEFAULT_CONFIG;
  }
}

export function writeServerConfig(config: ServerSystemConfig): ServerSystemConfig {
  mkdirSync(DATA_DIR, { recursive: true });
  const updated: ServerSystemConfig = {
    ...config,
    updatedAt: new Date().toISOString()
  };
  const tmp = `${CONFIG_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(updated, null, 2), 'utf8');
  renameSync(tmp, CONFIG_FILE);
  return updated;
}
