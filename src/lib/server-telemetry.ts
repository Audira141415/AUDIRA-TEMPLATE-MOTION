import 'server-only';
import os from 'node:os';
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { readServerConfig } from './server-config';
import { getInternalAiConfig } from './ai-config';
import { listJobs } from './render-jobs';
import {
  ServerNodeConfig,
  CpuMetrics,
  RamMetrics,
  ProcessMetrics,
  OsMetrics,
  DirectorySizeItem,
  StorageMetrics,
  ServiceStatusItem,
  NodeHealthResult,
  ServerTelemetryReport,
} from '@/types/server-monitoring';

export type {
  CpuMetrics,
  RamMetrics,
  ProcessMetrics,
  OsMetrics,
  DirectorySizeItem,
  StorageMetrics,
  ServiceStatusItem,
  NodeHealthResult,
  ServerTelemetryReport,
};

function calculateCpuUsage(): number {
  const cpus = os.cpus();
  if (!cpus || cpus.length === 0) return 0;

  let totalIdle = 0;
  let totalTick = 0;

  for (const cpu of cpus) {
    const { user, nice, sys, idle, irq } = cpu.times;
    const coreTotal = user + nice + sys + idle + irq;
    totalTick += coreTotal;
    totalIdle += idle;
  }

  if (totalTick === 0) return 0;
  const usage = Math.round(((totalTick - totalIdle) / totalTick) * 100);
  return Math.min(100, Math.max(0, usage));
}

function getDirectorySize(dirPath: string): { sizeBytes: number; filesCount: number } {
  if (!existsSync(dirPath)) return { sizeBytes: 0, filesCount: 0 };
  let sizeBytes = 0;
  let filesCount = 0;

  function traverse(current: string) {
    try {
      const entries = readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(current, entry.name);
        try {
          if (entry.isDirectory()) {
            // Avoid deep node_modules traversal
            if (entry.name !== 'node_modules' && entry.name !== '.git') {
              traverse(full);
            }
          } else if (entry.isFile()) {
            sizeBytes += statSync(full).size;
            filesCount++;
          }
        } catch {
          // ignore unreadable files
        }
      }
    } catch {
      // ignore
    }
  }

  traverse(dirPath);
  return { sizeBytes, filesCount };
}

function getLocalIpAddresses(): { interface: string; ip: string; isInternal: boolean }[] {
  const nets = os.networkInterfaces();
  const results: { interface: string; ip: string; isInternal: boolean }[] = [];

  for (const [ifaceName, netInfos] of Object.entries(nets)) {
    if (!netInfos) continue;
    for (const net of netInfos) {
      if (net.family === 'IPv4') {
        results.push({
          interface: ifaceName,
          ip: net.address,
          isInternal: net.internal
        });
      }
    }
  }
  return results;
}

export async function probeNodeHealth(node: ServerNodeConfig): Promise<NodeHealthResult> {
  if (node.isCurrent) {
    return {
      nodeId: node.id,
      name: node.name,
      host: node.host,
      port: node.port,
      role: node.role,
      isCurrent: true,
      online: true,
      latencyMs: 1,
      statusCode: 200
    };
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(node.healthUrl || `http://${node.host}:${node.port}/api/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    return {
      nodeId: node.id,
      name: node.name,
      host: node.host,
      port: node.port,
      role: node.role,
      isCurrent: false,
      online: res.ok,
      latencyMs,
      statusCode: res.status
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      nodeId: node.id,
      name: node.name,
      host: node.host,
      port: node.port,
      role: node.role,
      isCurrent: false,
      online: false,
      latencyMs: Date.now() - startTime,
      error: err?.message || 'Connection refused or timeout'
    };
  }
}

export async function gatherServerTelemetry(): Promise<ServerTelemetryReport> {
  const config = readServerConfig();
  const aiConfig = getInternalAiConfig();
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramUsagePercent = Math.round((usedMem / totalMem) * 100);
  const cpuUsagePercent = calculateCpuUsage();

  const platform = os.platform();
  const platformFriendly = 
    platform === 'win32' ? 'Windows' :
    platform === 'linux' ? 'Linux' :
    platform === 'darwin' ? 'macOS' : platform;

  // Process memory
  const memUsage = process.memoryUsage();
  const procMetrics: ProcessMetrics = {
    pid: process.pid,
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryRssBytes: memUsage.rss,
    heapTotalBytes: memUsage.heapTotal,
    heapUsedBytes: memUsage.heapUsed,
    externalBytes: memUsage.external
  };

  // Directories Tracked
  const cwd = process.cwd();
  const trackedDirs = [
    { name: 'Render Video Vault (renders/)', path: path.join(cwd, 'renders') },
    { name: 'Database & Auth Vault (data/)', path: path.join(cwd, 'data') },
    { name: 'Panduan Video Assets (public/panduan-videos/)', path: path.join(cwd, 'public', 'panduan-videos') },
    { name: 'Next.js Build & Cache (.next/cache/)', path: path.join(cwd, '.next', 'cache') }
  ];

  const storageItems: DirectorySizeItem[] = trackedDirs.map((dir) => {
    const exists = existsSync(dir.path);
    const { sizeBytes, filesCount } = exists ? getDirectorySize(dir.path) : { sizeBytes: 0, filesCount: 0 };
    return {
      name: dir.name,
      path: dir.path,
      sizeBytes,
      filesCount,
      exists
    };
  });

  const totalTrackedBytes = storageItems.reduce((acc, it) => acc + it.sizeBytes, 0);

  // Render Jobs
  const jobs = listJobs();
  const activeJobs = jobs.filter(j => j.state === 'running' || j.state === 'queued');

  // Probe nodes in parallel
  const nodesHealth = await Promise.all(config.nodes.map(n => probeNodeHealth(n)));

  // Services matrix
  const remotionInstalled = existsSync(path.join(cwd, 'audira-skill-motion', 'node_modules', 'remotion')) ||
                            existsSync(path.join(cwd, 'node_modules', 'remotion'));

  const services: ServiceStatusItem[] = [
    {
      id: 'remotion-engine',
      name: 'Remotion 4.0 Visual 3D Engine',
      status: remotionInstalled ? 'healthy' : 'warning',
      label: remotionInstalled ? 'Ready & Armed' : 'Standalone Mode',
      details: `29 Kit Gaya 3D terdaftar, ${jobs.length} reel pernah dirender`,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'data-vault',
      name: 'Atomic JSON Database Vault',
      status: existsSync(path.join(cwd, 'data', 'users.json')) ? 'healthy' : 'warning',
      label: 'Optimal Zero-Latency',
      details: 'users, orders, coupons, site-config, server-config, landing-config',
      lastChecked: new Date().toISOString()
    },
    {
      id: 'ai-gateway',
      name: `AI Hub (${aiConfig.activeProvider})`,
      status: aiConfig.providers[aiConfig.activeProvider]?.apiKey ? 'healthy' : 'warning',
      label: aiConfig.providers[aiConfig.activeProvider]?.apiKey ? 'Key Configured' : 'Key Needed',
      details: `Model: ${aiConfig.providers[aiConfig.activeProvider]?.model || 'default'}`,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'cartesia-voice',
      name: 'Cartesia Voiceover TTS Engine',
      status: aiConfig.voiceAi?.cartesiaApiKey ? 'healthy' : 'inactive',
      label: aiConfig.voiceAi?.cartesiaApiKey ? 'Active & Ready' : 'Unconfigured',
      details: 'Word timestamp sync & Indonesian voice synthesis',
      lastChecked: new Date().toISOString()
    }
  ];

  // Overall server status calculation
  let serverStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
  if (cpuUsagePercent > config.alertThresholds.cpuPercent || ramUsagePercent > config.alertThresholds.ramPercent) {
    serverStatus = 'critical';
  } else if (cpuUsagePercent > 70 || ramUsagePercent > 75) {
    serverStatus = 'warning';
  }

  return {
    timestamp: new Date().toISOString(),
    serverStatus,
    cpu: {
      model: cpus[0]?.model || 'Generic Processor',
      cores: cpus.length,
      speedMhz: cpus[0]?.speed || 0,
      usagePercent: cpuUsagePercent,
      loadAverage: os.loadavg() as [number, number, number]
    },
    ram: {
      totalBytes: totalMem,
      freeBytes: freeMem,
      usedBytes: usedMem,
      usagePercent: ramUsagePercent
    },
    process: procMetrics,
    os: {
      platform,
      platformFriendly,
      arch: os.arch(),
      hostname: os.hostname(),
      systemUptimeSeconds: Math.floor(os.uptime()),
      localIps: getLocalIpAddresses()
    },
    storage: {
      items: storageItems,
      totalTrackedBytes
    },
    services,
    nodesHealth,
    activeAiProvider: aiConfig.activeProvider,
    activeRenderJobsCount: activeJobs.length
  };
}
