export interface ServerNodeConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: 'http' | 'https';
  sshUser: string;
  sshPort: number;
  deployPath: string;
  role: 'production' | 'staging' | 'worker' | 'local';
  isCurrent: boolean;
  healthUrl: string;
  notes?: string;
}

export interface ServerSystemConfig {
  primaryNodeId: string;
  nodes: ServerNodeConfig[];
  autoRefreshIntervalSec: number;
  alertThresholds: {
    cpuPercent: number;
    ramPercent: number;
    diskPercent: number;
  };
  maintenanceMode: boolean;
  updatedAt: string;
}

export interface CpuMetrics {
  model: string;
  cores: number;
  speedMhz: number;
  usagePercent: number;
  loadAverage: [number, number, number];
}

export interface RamMetrics {
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  usagePercent: number;
}

export interface ProcessMetrics {
  pid: number;
  uptimeSeconds: number;
  nodeVersion: string;
  memoryRssBytes: number;
  heapTotalBytes: number;
  heapUsedBytes: number;
  externalBytes: number;
}

export interface OsMetrics {
  platform: string;
  platformFriendly: string;
  arch: string;
  hostname: string;
  systemUptimeSeconds: number;
  localIps: { interface: string; ip: string; isInternal: boolean }[];
}

export interface DirectorySizeItem {
  name: string;
  path: string;
  sizeBytes: number;
  filesCount: number;
  exists: boolean;
}

export interface StorageMetrics {
  items: DirectorySizeItem[];
  totalTrackedBytes: number;
}

export interface ServiceStatusItem {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'inactive';
  label: string;
  details: string;
  lastChecked: string;
}

export interface NodeHealthResult {
  nodeId: string;
  name: string;
  host: string;
  port: number;
  role: string;
  isCurrent: boolean;
  online: boolean;
  latencyMs: number;
  statusCode?: number;
  error?: string;
}

export interface ServerTelemetryReport {
  timestamp: string;
  serverStatus: 'optimal' | 'warning' | 'critical';
  cpu: CpuMetrics;
  ram: RamMetrics;
  process: ProcessMetrics;
  os: OsMetrics;
  storage: StorageMetrics;
  services: ServiceStatusItem[];
  nodesHealth: NodeHealthResult[];
  activeAiProvider: string;
  activeRenderJobsCount: number;
}
