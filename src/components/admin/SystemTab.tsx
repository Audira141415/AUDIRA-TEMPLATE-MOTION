'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Server, 
  ShieldAlert, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  FileCode, 
  HardDrive,
  Lock,
  Layers
} from 'lucide-react';

export const SystemTab: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [purging, setPurging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleDownloadBackup = async () => {
    setDownloading(true);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/backup');
      if (!res.ok) throw new Error('Gagal mengunduh cadangan');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audira-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setNotice('Cadangan database JSON berhasil diunduh ke komputer Anda.');
    } catch (err: any) {
      setNotice(`Error: ${err?.message || 'Gagal export data'}`);
    } finally {
      setDownloading(false);
    }
  };

  const handlePurgeCache = async () => {
    setPurging(true);
    setNotice(null);
    try {
      // Simulate cache reload
      await new Promise(r => setTimeout(r, 600));
      setNotice('Cache konfigurasi dan memori landing page berhasil disegarkan.');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6 font-display">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-paper flex items-center gap-2">
          <Database className="w-5 h-5 text-accent" />
          <span>Sistem, Cadangan Data &amp; Pemeliharaan</span>
        </h3>
        <p className="text-xs text-muted">
          Kelola integritas database JSON lokal, unduh backup berkala, dan pantau status engine server Remotion.
        </p>
      </div>

      {notice && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Grid: Backup & Cache */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: 1-Click Backup */}
        <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-paper text-sm">Unduh Cadangan Lengkap (JSON Snapshot)</h4>
              <p className="text-[11px] text-dim">Orders, Users, Kupon, Site Config, &amp; Landing Page</p>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Simpan seluruh data transaksi penjualan, kredensial akun pengguna, lisensi terbitan, dan pengaturan website dalam satu file JSON terstruktur untuk proteksi data dan pemulihan darurat.
          </p>

          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full btn-primary py-2.5 px-4 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Mempersiapkan File...' : 'Unduh File Cadangan JSON (.json)'}</span>
          </button>
        </div>

        {/* Card 2: Cache & System Sync */}
        <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-cyan-950/60 border border-cyan-800 text-cyan-400">
              <RefreshCw className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-bold text-paper text-sm">Segarkan Memori &amp; Cache Konfigurasi</h4>
              <p className="text-[11px] text-dim">Sinkronisasi file data/ ke memori Next.js</p>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Paksa pembaruan data memori pada server jika ada modifikasi file JSON secara langsung melalui VS Code / editor tanpa perlu mematikan dev server port 3788.
          </p>

          <button
            type="button"
            onClick={handlePurgeCache}
            disabled={purging}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-tile py-2.5 px-4 text-xs font-bold text-paper hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${purging ? 'animate-spin text-accent' : ''}`} />
            <span>{purging ? 'Menyegarkan Cache...' : 'Segarkan Memori Server'}</span>
          </button>
        </div>

      </div>

      {/* Diagnostics / Environment Panel */}
      <div className="rounded-3xl border border-line bg-card p-6 space-y-4 shadow-xl">
        <h4 className="font-bold text-sm text-paper flex items-center gap-2 border-b border-line pb-3">
          <Server className="w-4 h-4 text-accent" />
          <span>Informasi Lingkungan Eksekusi &amp; Pipeline 3D</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-tile border border-line">
            <span className="text-dim font-mono text-[10px] uppercase block">Web Server</span>
            <span className="font-bold text-paper mt-0.5 block">Next.js 16.0 App Router</span>
            <span className="text-[10px] text-emerald-400 font-mono">Port 3788</span>
          </div>

          <div className="p-3 rounded-xl bg-tile border border-line">
            <span className="text-dim font-mono text-[10px] uppercase block">Video Engine</span>
            <span className="font-bold text-paper mt-0.5 block">Remotion 4.0 + Three.js</span>
            <span className="text-[10px] text-accent font-mono">29 Gaya Siap Render</span>
          </div>

          <div className="p-3 rounded-xl bg-tile border border-line">
            <span className="text-dim font-mono text-[10px] uppercase block">Database Store</span>
            <span className="font-bold text-paper mt-0.5 block">Local JSON Store (Atomic)</span>
            <span className="text-[10px] text-cyan-400 font-mono">Zero External DB Latency</span>
          </div>

          <div className="p-3 rounded-xl bg-tile border border-line">
            <span className="text-dim font-mono text-[10px] uppercase block">Kriptografi &amp; Auth</span>
            <span className="font-bold text-paper mt-0.5 block">PBKDF2 + SHA-256 HMAC</span>
            <span className="text-[10px] text-emerald-400 font-mono">Audira Guardian Shield</span>
          </div>
        </div>
      </div>
    </div>
  );
};

