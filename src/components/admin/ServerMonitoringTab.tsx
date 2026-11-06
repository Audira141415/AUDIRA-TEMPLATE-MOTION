'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Copy,
  Check,
  Download,
  Trash2,
  Plus,
  Globe,
  ShieldCheck,
  Clock,
  Radio,
  Play,
  ExternalLink,
  Sliders,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ServerTelemetryReport,
  ServerSystemConfig,
  ServerNodeConfig,
  NodeHealthResult
} from '@/types/server-monitoring';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}h`);
  if (h > 0 || d > 0) parts.push(`${h}j`);
  parts.push(`${m}m`);
  return parts.join(' ');
}

type LogEntry = {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
};

export const ServerMonitoringTab: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ServerTelemetryReport | null>(null);
  const [config, setConfig] = useState<ServerSystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(10);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: 'ok' | 'warn' | 'error'; message: string } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Node Edit / Add Modal state
  const [editingNode, setEditingNode] = useState<ServerNodeConfig | null>(null);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [showDeployHelp, setShowDeployHelp] = useState(false);

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [{ id: Math.random().toString(36).substring(2, 9), time, type, message }, ...prev.slice(0, 49)]);
  }, []);

  const fetchTelemetry = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/server/telemetry', { cache: 'no-store' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setTelemetry(data.telemetry);
      setConfig(data.config);
      setLastUpdated(new Date());
      if (isManual) {
        addLog('info', 'Data telemetri server berhasil disegarkan.');
      }
    } catch (err: any) {
      console.error('Fetch telemetry error:', err);
      addLog('error', `Gagal memuat telemetri: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addLog]);

  // Initial load
  useEffect(() => {
    fetchTelemetry(false);
    addLog('info', 'Inisialisasi koneksi monitoring server AUDIRA...');
  }, [fetchTelemetry, addLog]);

  // Auto-refresh timer
  useEffect(() => {
    if (autoRefreshSec <= 0) return;
    const interval = setInterval(() => {
      fetchTelemetry(false);
    }, autoRefreshSec * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshSec, fetchTelemetry]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addLog('info', `Perintah disalin ke clipboard: ${text.slice(0, 36)}...`);
  };

  // Actions
  const handleClearCache = async () => {
    if (!window.confirm('Bersihkan file temporer render (.tmp / .part)? File reel.mp4 final tidak akan dihapus.')) return;
    setActionBusy('clear-cache');
    try {
      const res = await fetch('/api/admin/server/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-render-cache' }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ tone: 'ok', message: data.message });
        addLog('success', data.message);
        fetchTelemetry(false);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setToast({ tone: 'error', message: err?.message || 'Gagal membersihkan cache' });
      addLog('error', `Gagal bersihkan cache: ${err?.message}`);
    } finally {
      setActionBusy(null);
    }
  };

  const handleTestEngine = async () => {
    setActionBusy('test-engine');
    try {
      const res = await fetch('/api/admin/server/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-engine' }),
      });
      const data = await res.json();
      if (res.ok) {
        const msg = `Engine Test OK: ${data.details.engine} (${data.details.registeredKits} Kit 3D siap render).`;
        setToast({ tone: 'ok', message: msg });
        addLog('success', msg);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setToast({ tone: 'error', message: err?.message || 'Uji engine gagal' });
      addLog('error', `Uji engine gagal: ${err?.message}`);
    } finally {
      setActionBusy(null);
    }
  };

  const handleTestAi = async () => {
    setActionBusy('test-ai');
    try {
      const res = await fetch('/api/admin/server/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-ai' }),
      });
      const data = await res.json();
      if (data.ok) {
        const msg = `${data.result.message} (Model: ${data.result.model})`;
        setToast({ tone: 'ok', message: msg });
        addLog('success', msg);
      } else {
        const msg = data.result?.message || 'AI Gateway tidak merespon';
        setToast({ tone: 'warn', message: msg });
        addLog('warn', msg);
      }
    } catch (err: any) {
      setToast({ tone: 'error', message: err?.message || 'Uji AI gagal' });
      addLog('error', `Uji AI gagal: ${err?.message}`);
    } finally {
      setActionBusy(null);
    }
  };

  const handlePingNode = async (node: ServerNodeConfig) => {
    setActionBusy(`ping-${node.id}`);
    try {
      const res = await fetch('/api/admin/server/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping-node', payload: { node } }),
      });
      const data = await res.json();
      if (data.ok && data.result) {
        const result: NodeHealthResult = data.result;
        if (result.online) {
          const msg = `Node ${node.name} ONLINE (${result.latencyMs}ms)`;
          setToast({ tone: 'ok', message: msg });
          addLog('success', msg);
        } else {
          const msg = `Node ${node.name} OFFLINE (${result.error || 'Connection refused'})`;
          setToast({ tone: 'warn', message: msg });
          addLog('warn', msg);
        }
        fetchTelemetry(false);
      }
    } catch (err: any) {
      setToast({ tone: 'error', message: `Gagal ping node: ${err?.message}` });
      addLog('error', `Gagal ping node ${node.name}: ${err?.message}`);
    } finally {
      setActionBusy(null);
    }
  };

  const handleSaveNode = async (node: ServerNodeConfig) => {
    try {
      const res = await fetch('/api/admin/server/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-node', payload: { node } }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ tone: 'ok', message: `Konfigurasi server node ${node.name} berhasil disimpan.` });
        addLog('success', `Node diperbarui: ${node.name} (${node.host}:${node.port})`);
        setEditingNode(null);
        setIsCreatingNode(false);
        fetchTelemetry(false);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(`Gagal menyimpan node: ${err?.message}`);
    }
  };

  const handleDeleteNode = async (nodeId: string, nodeName: string) => {
    if (!window.confirm(`Hapus node '${nodeName}' dari daftar server monitoring?`)) return;
    try {
      const res = await fetch('/api/admin/server/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-node', payload: { nodeId } }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ tone: 'ok', message: `Node ${nodeName} dihapus.` });
        addLog('info', `Node server dihapus: ${nodeName}`);
        fetchTelemetry(false);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(`Gagal menghapus node: ${err?.message}`);
    }
  };

  const handleExportDiagnostics = () => {
    if (!telemetry) return;
    const report = {
      exportTime: new Date().toISOString(),
      telemetry,
      config,
      recentLogs: logs,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audira-server-diagnostic-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addLog('info', 'Laporan diagnosa sistem berhasil diunduh.');
  };

  if (loading && !telemetry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm font-bold text-paper font-mono">Menghubungkan ke Server Telemetri AUDIRA...</p>
        <p className="text-xs text-dim">Membaca metrik CPU, RAM, Disk, dan Remote Node Linux</p>
      </div>
    );
  }

  const cpu = telemetry?.cpu;
  const ram = telemetry?.ram;
  const proc = telemetry?.process;
  const osInfo = telemetry?.os;
  const storage = telemetry?.storage;

  const cpuColor = (cpu?.usagePercent ?? 0) > 85 ? 'text-red-400' : (cpu?.usagePercent ?? 0) > 70 ? 'text-amber-400' : 'text-emerald-400';
  const cpuBarColor = (cpu?.usagePercent ?? 0) > 85 ? 'bg-red-500' : (cpu?.usagePercent ?? 0) > 70 ? 'bg-amber-500' : 'bg-emerald-500';

  const ramColor = (ram?.usagePercent ?? 0) > 85 ? 'text-red-400' : (ram?.usagePercent ?? 0) > 70 ? 'text-amber-400' : 'text-cyan-400';
  const ramBarColor = (ram?.usagePercent ?? 0) > 85 ? 'bg-red-500' : (ram?.usagePercent ?? 0) > 70 ? 'bg-amber-500' : 'bg-cyan-500';

  const isServerOptimal = telemetry?.serverStatus === 'optimal';

  return (
    <div className="space-y-6 font-display">
      
      {/* 1. Header & Live Telemetry Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`size-2.5 rounded-full ${isServerOptimal ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isServerOptimal ? 'SISTEM SERVER: OPTIMAL • 200 OK' : 'SISTEM SERVER: DALAM PENGAWASAN'}
            </span>
            <span className="text-[11px] text-dim">• {osInfo?.hostname || 'AUDIRA-HOST'} ({osInfo?.platformFriendly} {osInfo?.arch})</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-paper flex items-center gap-2">
            <Server className="w-6 h-6 text-accent" />
            <span>Pusat Monitoring &amp; Integrasi Server</span>
          </h3>
          <p className="text-xs text-muted">
            Pantau beban CPU/RAM real-time, storage render video, healthcheck remote node Linux, dan kendali server.
          </p>
        </div>

        {/* Polling & Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-dim" />
            <span className="text-[11px] text-dim font-medium">Auto-refresh:</span>
            <select
              value={autoRefreshSec}
              onChange={(e) => setAutoRefreshSec(Number(e.target.value))}
              className="bg-transparent font-mono text-xs font-bold text-accent outline-none cursor-pointer"
            >
              <option value={0} className="bg-tile text-paper">Mati</option>
              <option value={5} className="bg-tile text-paper">5 dtk</option>
              <option value={10} className="bg-tile text-paper">10 dtk</option>
              <option value={30} className="bg-tile text-paper">30 dtk</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchTelemetry(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-tile px-3.5 py-2 text-xs font-bold text-fg-2 hover:border-line-strong hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
            <span>{isRefreshing ? 'Memperbarui...' : 'Segarkan'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportDiagnostics}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/15 px-3.5 py-2 text-xs font-bold text-accent hover:bg-accent/25 transition-all active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor Diagnosa</span>
          </button>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className={`rounded-2xl border px-4 py-3 text-xs font-bold flex items-center justify-between gap-3 ${
            toast.tone === 'ok'
              ? 'border-emerald-900 bg-emerald-950/40 text-emerald-200'
              : toast.tone === 'warn'
              ? 'border-amber-900 bg-amber-950/40 text-amber-200'
              : 'border-red-900 bg-red-950/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.tone === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-[11px] text-dim hover:text-paper"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Top Resource Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: CPU Usage */}
        <div className="rounded-3xl border border-line bg-card p-5 space-y-3 shadow-lg hover:border-line-strong transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-dim flex items-center gap-1.5 font-bold">
              <Cpu className="w-4 h-4 text-accent" />
              Beban Prosesor (CPU)
            </span>
            <span className={`font-mono text-sm font-extrabold ${cpuColor}`}>
              {cpu?.usagePercent}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-tile overflow-hidden">
            <div
              className={`h-full ${cpuBarColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(2, cpu?.usagePercent ?? 0))}%` }}
            />
          </div>

          <div className="space-y-1 text-[11px]">
            <p className="font-semibold text-paper truncate" title={cpu?.model}>
              {cpu?.model}
            </p>
            <div className="flex items-center justify-between text-dim font-mono">
              <span>{cpu?.cores} Logical Cores</span>
              <span>{cpu?.speedMhz} MHz</span>
            </div>
          </div>
        </div>

        {/* Card 2: RAM Memory */}
        <div className="rounded-3xl border border-line bg-card p-5 space-y-3 shadow-lg hover:border-line-strong transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-dim flex items-center gap-1.5 font-bold">
              <Activity className="w-4 h-4 text-cyan-400" />
              Memori RAM Server
            </span>
            <span className={`font-mono text-sm font-extrabold ${ramColor}`}>
              {ram?.usagePercent}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-tile overflow-hidden">
            <div
              className={`h-full ${ramBarColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(2, ram?.usagePercent ?? 0))}%` }}
            />
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-paper font-semibold">
              <span>Terpakai: {formatBytes(ram?.usedBytes ?? 0)}</span>
              <span className="text-dim">/ {formatBytes(ram?.totalBytes ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-dim font-mono">
              <span className="text-emerald-400 font-semibold">{formatBytes(ram?.freeBytes ?? 0)} Bebas</span>
              <span>Physical RAM</span>
            </div>
          </div>
        </div>

        {/* Card 3: Node.js Runtime & Heap */}
        <div className="rounded-3xl border border-line bg-card p-5 space-y-3 shadow-lg hover:border-line-strong transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-dim flex items-center gap-1.5 font-bold">
              <Zap className="w-4 h-4 text-emerald-400" />
              Node.js Process Heap
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold">
              PID: {proc?.pid}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-tile overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(2, Math.round(((proc?.heapUsedBytes ?? 0) / (proc?.heapTotalBytes || 1)) * 100)))}%`
              }}
            />
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-paper font-semibold">
              <span>Heap: {formatBytes(proc?.heapUsedBytes ?? 0)}</span>
              <span className="text-dim">RSS: {formatBytes(proc?.memoryRssBytes ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-dim font-mono">
              <span>Node {proc?.nodeVersion}</span>
              <span>Uptime: {formatUptime(proc?.uptimeSeconds ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Video Vault & Storage */}
        <div className="rounded-3xl border border-line bg-card p-5 space-y-3 shadow-lg hover:border-line-strong transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-dim flex items-center gap-1.5 font-bold">
              <HardDrive className="w-4 h-4 text-purple-400" />
              Kapasitas Vault Media
            </span>
            <span className="font-mono text-xs text-purple-400 font-bold">
              {formatBytes(storage?.totalTrackedBytes ?? 0)}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-tile overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: '38%' }} />
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-paper font-semibold">
              <span>Renders: {formatBytes(storage?.items[0]?.sizeBytes ?? 0)}</span>
              <span className="text-dim">{storage?.items[0]?.filesCount ?? 0} files</span>
            </div>
            <div className="flex items-center justify-between text-dim font-mono">
              <span>DB JSON: {formatBytes(storage?.items[1]?.sizeBytes ?? 0)}</span>
              <span className="text-emerald-400">Health: OK</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Node Integration & Remote Server Management */}
      <div className="rounded-3xl border border-line bg-card p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-paper">
                Integrasi Server Node &amp; Multi-Cluster AUDIRA
              </h4>
            </div>
            <p className="text-xs text-muted">
              Kelola node server produksi Linux (Ubuntu 24.04 / 192.168.100.168), cluster cadangan, dan workstation lokal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeployHelp(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-tile px-3 py-1.5 text-xs font-semibold text-paper hover:border-accent hover:text-accent transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>Panduan SSH Deploy</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingNode({
                  id: `node-${Date.now()}`,
                  name: 'Node Linux Baru',
                  host: '192.168.100.',
                  port: 3788,
                  protocol: 'http',
                  sshUser: 'audira',
                  sshPort: 22,
                  deployPath: '/home/audira/AUDIRA-TEMPLATE-MOTION',
                  role: 'worker',
                  isCurrent: false,
                  healthUrl: 'http://192.168.100.168:3788/api/health',
                  notes: 'Worker komputasi tambahan'
                });
                setIsCreatingNode(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl btn-primary px-3 py-1.5 text-xs font-bold shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Node Server</span>
            </button>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config?.nodes.map((node) => {
            const health = telemetry?.nodesHealth.find((h) => h.nodeId === node.id);
            const isPinging = actionBusy === `ping-${node.id}`;
            const sshCmd = `ssh ${node.sshUser}@${node.host}`;

            return (
              <div
                key={node.id}
                className={`rounded-2xl border p-4 space-y-3 transition-all ${
                  node.isCurrent 
                    ? 'border-accent/40 bg-accent/5' 
                    : health?.online 
                    ? 'border-emerald-500/30 bg-tile' 
                    : 'border-line bg-tile/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${health?.online ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                      <span className="font-bold text-xs text-paper">{node.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-dim block mt-0.5">
                      {node.protocol}://{node.host}:{node.port}
                    </span>
                  </div>

                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase font-bold shrink-0 ${
                      node.role === 'production'
                        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400'
                        : node.role === 'local'
                        ? 'border-accent/50 bg-accent/15 text-accent'
                        : 'border-cyan-500/50 bg-cyan-950/40 text-cyan-400'
                    }`}
                  >
                    {node.role}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-card border border-line space-y-1 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-dim">
                    <span>Status Koneksi:</span>
                    <span className={`font-bold ${health?.online ? 'text-emerald-400' : 'text-red-400'}`}>
                      {health?.online ? `ONLINE (${health.latencyMs}ms)` : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-dim">
                    <span>SSH Login:</span>
                    <span className="text-paper">{node.sshUser}@{node.host}:{node.sshPort}</span>
                  </div>
                  <div className="flex items-center justify-between text-dim">
                    <span>Target Path:</span>
                    <span className="text-paper truncate max-w-[150px]" title={node.deployPath}>
                      {node.deployPath}
                    </span>
                  </div>
                </div>

                {/* Node Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isPinging}
                      onClick={() => handlePingNode(node)}
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-2.5 py-1 text-[11px] font-semibold text-paper hover:border-accent hover:text-accent transition-all disabled:opacity-50"
                      title="Ping HTTP Healthcheck"
                    >
                      <Radio className={`w-3 h-3 ${isPinging ? 'animate-spin text-accent' : 'text-emerald-400'}`} />
                      <span>{isPinging ? 'Pinging...' : 'Uji Ping'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(sshCmd, `ssh-${node.id}`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-2 py-1 text-[11px] font-semibold text-dim hover:text-paper transition-all"
                      title="Salin Perintah SSH"
                    >
                      {copiedId === `ssh-${node.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>SSH</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNode(node);
                        setIsCreatingNode(false);
                      }}
                      className="text-[11px] font-semibold text-accent hover:underline px-1.5 py-0.5"
                    >
                      Edit
                    </button>
                    {!node.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNode(node.id, node.name)}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-300 px-1.5 py-0.5"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Services Matrix & Quick Operational Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Services Matrix (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h4 className="font-bold text-sm text-paper flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Matriks Layanan &amp; Engine Terpasang</span>
            </h4>
            <span className="font-mono text-[10px] text-dim uppercase">
              4 Sub-Sistem Terverifikasi
            </span>
          </div>

          <div className="space-y-3">
            {telemetry?.services.map((svc) => (
              <div
                key={svc.id}
                className="p-3.5 rounded-2xl bg-tile border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        svc.status === 'healthy'
                          ? 'bg-emerald-400'
                          : svc.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-zinc-500'
                      }`}
                    />
                    <span className="font-bold text-paper text-sm">{svc.name}</span>
                  </div>
                  <p className="text-[11px] text-dim pl-4">{svc.details}</p>
                </div>

                <div className="text-right sm:shrink-0 pl-4 sm:pl-0">
                  <span
                    className={`inline-block font-mono text-[10px] px-2.5 py-0.5 rounded-md border font-bold uppercase ${
                      svc.status === 'healthy'
                        ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                        : svc.status === 'warning'
                        ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                        : 'border-line bg-card text-muted'
                    }`}
                  >
                    {svc.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Network Interfaces Information */}
          <div className="p-4 rounded-2xl bg-tile/60 border border-line space-y-2 mt-4 text-xs">
            <span className="font-mono text-[10px] text-dim uppercase font-bold block">
              Network Adapters (Local IP Discovery)
            </span>
            <div className="flex flex-wrap gap-2">
              {osInfo?.localIps.map((net, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-card border border-line text-paper inline-flex items-center gap-1.5"
                >
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span className="text-dim">{net.interface}:</span>
                  <span className="font-bold text-cyan-300">{net.ip}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Operational Controls & Maintenance (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
          <h4 className="font-bold text-sm text-paper flex items-center gap-2 border-b border-line pb-3">
            <Sliders className="w-4 h-4 text-accent" />
            <span>Pusat Kendali &amp; Pemeliharaan Server</span>
          </h4>

          <div className="space-y-2.5 text-xs">
            
            <button
              type="button"
              disabled={actionBusy !== null}
              onClick={handleClearCache}
              className="w-full p-3.5 rounded-2xl bg-tile border border-line hover:border-amber-500/50 flex items-center justify-between text-left group transition-all disabled:opacity-50"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-paper block group-hover:text-amber-400">
                  Bersihkan Cache &amp; Temp Render
                </span>
                <span className="text-[11px] text-dim">
                  Hapus file temporer .tmp dan освободить memori disk
                </span>
              </div>
              <Trash2 className="w-4 h-4 text-dim group-hover:text-amber-400 group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              disabled={actionBusy !== null}
              onClick={handleTestEngine}
              className="w-full p-3.5 rounded-2xl bg-tile border border-line hover:border-accent flex items-center justify-between text-left group transition-all disabled:opacity-50"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-paper block group-hover:text-accent">
                  Uji Engine Remotion 4.0
                </span>
                <span className="text-[11px] text-dim">
                  Verifikasi compiler bundler &amp; kesiapan 29 gaya visual 3D
                </span>
              </div>
              <Play className="w-4 h-4 text-dim group-hover:text-accent group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              disabled={actionBusy !== null}
              onClick={handleTestAi}
              className="w-full p-3.5 rounded-2xl bg-tile border border-line hover:border-emerald-500/50 flex items-center justify-between text-left group transition-all disabled:opacity-50"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-paper block group-hover:text-emerald-400">
                  Uji Latensi AI Gateway ({telemetry?.activeAiProvider})
                </span>
                <span className="text-[11px] text-dim">
                  Kirim ping test ke penyedia LLM &amp; hitung response time (ms)
                </span>
              </div>
              <Zap className="w-4 h-4 text-dim group-hover:text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleExportDiagnostics}
              className="w-full p-3.5 rounded-2xl bg-tile border border-line hover:border-cyan-500/50 flex items-center justify-between text-left group transition-all"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-paper block group-hover:text-cyan-400">
                  Unduh Laporan Diagnosa JSON
                </span>
                <span className="text-[11px] text-dim">
                  Simpan rekam jejak telemetri lengkap untuk analisis audit
                </span>
              </div>
              <Download className="w-4 h-4 text-dim group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
            </button>

          </div>
        </div>

      </div>

      {/* 5. Live Activity & Telemetry Stream Log */}
      <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-sm text-paper">
              Log Aktivitas &amp; Event Stream Server
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="text-[11px] text-dim hover:text-paper font-mono"
          >
            Bersihkan Log
          </button>
        </div>

        <div className="h-44 overflow-y-auto rounded-2xl bg-tile border border-line p-3 font-mono text-[11px] space-y-1.5 scrollbar-thin">
          {logs.length === 0 && (
            <p className="text-dim text-center py-10">Belum ada aktivitas baru terekam.</p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-dim shrink-0">[{log.time}]</span>
              <span
                className={`uppercase font-bold shrink-0 ${
                  log.type === 'success'
                    ? 'text-emerald-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : log.type === 'error'
                    ? 'text-red-400'
                    : 'text-cyan-400'
                }`}
              >
                [{log.type}]
              </span>
              <span className="text-paper/90 break-all">{log.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD / EDIT NODE */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-card p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold text-paper flex items-center gap-2">
                <Server className="w-5 h-5 text-accent" />
                <span>{isCreatingNode ? 'Tambah Server Node Baru' : 'Edit Konfigurasi Server Node'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingNode(null);
                  setIsCreatingNode(false);
                }}
                className="text-dim hover:text-paper text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-[11px] text-dim uppercase block mb-1">Nama Node</label>
                <input
                  type="text"
                  value={editingNode.name}
                  onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent outline-none"
                  placeholder="e.g. AUDIRA Production Linux (Node 168)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-dim uppercase block mb-1">Host IP / Domain</label>
                  <input
                    type="text"
                    value={editingNode.host}
                    onChange={(e) => setEditingNode({ ...editingNode, host: e.target.value })}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper font-mono focus:border-accent outline-none"
                    placeholder="192.168.100.168"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-dim uppercase block mb-1">Port Web / App</label>
                  <input
                    type="number"
                    value={editingNode.port}
                    onChange={(e) => setEditingNode({ ...editingNode, port: Number(e.target.value) })}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper font-mono focus:border-accent outline-none"
                    placeholder="3788"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-dim uppercase block mb-1">User SSH</label>
                  <input
                    type="text"
                    value={editingNode.sshUser}
                    onChange={(e) => setEditingNode({ ...editingNode, sshUser: e.target.value })}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper font-mono focus:border-accent outline-none"
                    placeholder="audira"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-dim uppercase block mb-1">Peran Node</label>
                  <select
                    value={editingNode.role}
                    onChange={(e) => setEditingNode({ ...editingNode, role: e.target.value as any })}
                    className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent outline-none cursor-pointer"
                  >
                    <option value="production">Production Main</option>
                    <option value="staging">Staging / Backup</option>
                    <option value="worker">Dedicated Render Worker</option>
                    <option value="local">Local Workstation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] text-dim uppercase block mb-1">Path Direktori di Server</label>
                <input
                  type="text"
                  value={editingNode.deployPath}
                  onChange={(e) => setEditingNode({ ...editingNode, deployPath: e.target.value })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper font-mono focus:border-accent outline-none"
                  placeholder="/home/audira/AUDIRA-TEMPLATE-MOTION"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-dim uppercase block mb-1">Healthcheck URL Endpoint</label>
                <input
                  type="text"
                  value={editingNode.healthUrl}
                  onChange={(e) => setEditingNode({ ...editingNode, healthUrl: e.target.value })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper font-mono focus:border-accent outline-none"
                  placeholder="http://192.168.100.168:3788/api/health"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-dim uppercase block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={editingNode.notes || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, notes: e.target.value })}
                  className="w-full rounded-xl border border-line bg-tile px-3.5 py-2 text-paper focus:border-accent outline-none"
                  placeholder="Ubuntu Linux 24.04 LTS LTS, PM2 cluster"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingNode(null);
                  setIsCreatingNode(false);
                }}
                className="btn-outline px-4 py-2 text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSaveNode(editingNode)}
                className="btn-primary px-5 py-2 text-xs font-bold shadow-md"
              >
                Simpan Konfigurasi Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SSH DEPLOYMENT CHEATSHEET */}
      {showDeployHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-line bg-card p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold text-paper flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                <span>Panduan Prosedur Deployment ke Server Produksi Linux</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowDeployHelp(false)}
                className="text-dim hover:text-paper text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-muted">
              <p>
                Sesuai dengan protokol keselamatan operasi <strong className="text-paper">AUDIRA Safe Deployment</strong>, deployment ke server Linux (<code className="text-accent font-mono">192.168.100.168</code>) dijalankan secara terisolasi tanpa mengganggu container lain.
              </p>

              <div className="space-y-2">
                <span className="font-bold text-paper block">Langkah 1: Masuk ke Server Linux via SSH</span>
                <div className="p-3 rounded-xl bg-tile border border-line font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                  <span>ssh audira@192.168.100.168</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('ssh audira@192.168.100.168', 'deploy-1')}
                    className="text-dim hover:text-white"
                  >
                    {copiedId === 'deploy-1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-paper block">Langkah 2: Masuk Folder &amp; Tarik Pembaruan Git</span>
                <div className="p-3 rounded-xl bg-tile border border-line font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                  <span>cd ~/AUDIRA-TEMPLATE-MOTION &amp;&amp; git pull origin master</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('cd ~/AUDIRA-TEMPLATE-MOTION && git pull origin master', 'deploy-2')}
                    className="text-dim hover:text-white"
                  >
                    {copiedId === 'deploy-2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-paper block">Langkah 3: Install Dependensi &amp; Build Next.js</span>
                <div className="p-3 rounded-xl bg-tile border border-line font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                  <span>pnpm install --frozen-lockfile &amp;&amp; pnpm build</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('pnpm install --frozen-lockfile && pnpm build', 'deploy-3')}
                    className="text-dim hover:text-white"
                  >
                    {copiedId === 'deploy-3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-paper block">Langkah 4: Restart Service PM2 Zero-Downtime</span>
                <div className="p-3 rounded-xl bg-tile border border-line font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                  <span>pm2 reload audira-motion || pm2 start npm --name "audira-motion" -- start</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('pm2 reload audira-motion || pm2 start npm --name "audira-motion" -- start', 'deploy-4')}
                    className="text-dim hover:text-white"
                  >
                    {copiedId === 'deploy-4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-paper block">Langkah 5: Verifikasi Healthcheck Endpoint</span>
                <div className="p-3 rounded-xl bg-tile border border-line font-mono text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>curl -s http://127.0.0.1:3788/api/health</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('curl -s http://127.0.0.1:3788/api/health', 'deploy-5')}
                    className="text-dim hover:text-white"
                  >
                    {copiedId === 'deploy-5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeployHelp(false)}
                className="btn-primary px-5 py-2 text-xs font-bold"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
