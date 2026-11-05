'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Copy, 
  Terminal, 
  Cpu, 
  Box, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Play,
  FileCode,
  Laptop,
  CheckCircle2,
  Zap,
  MessageCircle,
  FolderTree
} from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

type StepTab = 'prasyarat' | 'motion' | 'mesh' | 'render' | 'troubleshooting';

export default function InstallationGuidePage() {
  const [activeTab, setActiveTab] = useState<StepTab>('prasyarat');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const CLAUDE_MCP_CONFIG = `{
  "mcpServers": {
    "audira": {
      "command": "node",
      "args": [
        "F:/AUDIRA-ALL-SKILL/mcp-server/src/index.js"
      ]
    }
  }
}`;

  const CURSOR_MCP_CONFIG = `{
  "mcpServers": {
    "audira-skill-mesh": {
      "command": "node",
      "args": ["C:/audira-mesh/mcp-server/src/index.js"]
    }
  }
}`;

  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-[1180px] px-4 py-12 md:px-8 md:py-20">
        {/* Breadcrumb & Top Label */}
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          <Link href="/" className="hover:text-paper transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-accent font-bold">Buku Panduan Instalasi</span>
          <span>•</span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] text-emerald-400 font-bold">
            Versi Resmi 3.0.0
          </span>
        </div>

        {/* Hero Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
          <div className="max-w-[780px] space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-bold">
                PANDUAN LENGKAP PEMBELI LISENSI RESMI
              </p>
            </div>
            <h1 className="font-display text-[34px] sm:text-[50px] font-extrabold leading-[1.05] tracking-tight text-paper">
              Instalasi &amp; Menjalankan <br className="hidden sm:inline" />
              <span className="text-accent">AUDIRA Skill Motion + Agentic Skill Mesh</span>
            </h1>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Panduan langkah demi langkah untuk menjalankan engine 3D Remotion dan mengaktifkan <strong>AUDIRA Skill Mesh (MCP Server)</strong> di Claude Code, Cursor, Windsurf, Antigravity, atau terminal laptop/PC Anda.
            </p>
          </div>

          {/* Quick Direct Support Card */}
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-4 shrink-0 min-w-[240px]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>GARANSI SETUP 1-ON-1</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Jika bingung atau ada kendala teknis, tim AUDIRA siap mendampingi lewat WhatsApp / remote desktop hingga video pertama Anda berhasil dirender.
            </p>
            <a
              href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20sudah%20beli%20lisensi%20dan%20ingin%20konsultasi%20panduan%20instalasi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bantuan WhatsApp Mas Agus</span>
            </a>
          </div>
        </div>

        {/* 5-Step Tab Navigator */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-5 gap-2 bg-card p-1.5 rounded-2xl border border-line">
          {[
            { id: 'prasyarat', step: '01', title: 'Prasyarat PC', icon: Laptop },
            { id: 'motion', step: '02', title: 'Skill Motion 3D', icon: Box },
            { id: 'mesh', step: '03', title: 'MCP Skill Mesh', icon: Cpu },
            { id: 'render', step: '04', title: 'Render Pertama', icon: Play },
            { id: 'troubleshooting', step: '05', title: 'Solusi Kendala', icon: HelpCircle },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as StepTab)}
                className={`flex flex-col items-center sm:items-start p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-accent text-ink font-bold shadow-md'
                    : 'text-muted hover:text-paper hover:bg-tile'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-[10px] uppercase font-black ${isActive ? 'text-ink/80' : 'text-accent'}`}>
                    LANGKAH {tab.step}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Icon className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                  <span className="text-xs sm:text-sm font-bold truncate">{tab.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Prasyarat Sistem */}
        {activeTab === 'prasyarat' && (
          <div className="space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 animate-fade-in">
            <div>
              <span className="font-mono text-xs font-bold text-accent uppercase">LANGKAH 01</span>
              <h2 className="text-2xl font-bold tracking-tight text-paper mt-1">
                Kebutuhan Sistem &amp; Software Pendukung
              </h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Sebelum memulai, pastikan dua software gratis (Node.js dan ffmpeg) sudah terpasang di komputer Anda. Keduanya hanya perlu diinstal sekali saja.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Node.js Requirement */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent uppercase">1. NODE.JS (VERSI LTS)</span>
                  <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-[10px] text-accent font-bold">Wajib</span>
                </div>
                <h3 className="font-display font-bold text-lg text-paper">Node.js v20.x atau v22.x</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Digunakan untuk menjalankan mesin compiler Remotion 4.0, Three.js, dan server lokal.
                </p>
                <div className="pt-2">
                  <a
                    href="https://nodejs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-paper px-3.5 py-2 text-xs font-bold text-ink hover:bg-white transition-colors"
                  >
                    <span>Unduh Node.js Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* FFmpeg Requirement */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase">2. FFMPEG AUDIO/VIDEO</span>
                  <span className="rounded bg-cyan-400/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">Wajib</span>
                </div>
                <h3 className="font-display font-bold text-lg text-paper">FFmpeg &amp; FFprobe CLI</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Digunakan untuk sinkronisasi audio presisi sub-frame dan normalisasi audio broadcast (-14 LUFS).
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between bg-ink border border-line rounded-lg p-2 font-mono text-xs">
                    <span className="text-emerald-400">winget install ffmpeg</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('winget install ffmpeg', 'ffmpeg_win')}
                      className="text-[11px] text-dim hover:text-paper"
                    >
                      {copiedKey === 'ffmpeg_win' ? 'Tersalin' : 'Salin (Windows)'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-ink border border-line rounded-lg p-2 font-mono text-xs">
                    <span className="text-cyan-400">brew install ffmpeg</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('brew install ffmpeg', 'ffmpeg_mac')}
                      className="text-[11px] text-dim hover:text-paper"
                    >
                      {copiedKey === 'ffmpeg_mac' ? 'Tersalin' : 'Salin (Mac)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Capability Info */}
            <div className="rounded-2xl border border-line-soft bg-ink p-5 space-y-2">
              <h4 className="font-mono text-xs font-bold text-paper uppercase flex items-center gap-2">
                <Laptop className="w-4 h-4 text-accent" />
                <span>Spesifikasi Komputer yang Direkomendasikan:</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted pt-1">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span><strong>Apple Silicon:</strong> Mac M1 / M2 / M3 / M4 (Sangat lancar, render hardware GPU).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span><strong>Windows PC:</strong> GPU NVIDIA / AMD / Intel Arc dengan 4GB+ VRAM.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span><strong>RAM &amp; Storage:</strong> Minimal RAM 8 GB (16 GB lebih baik) &amp; sisa ruang disk 5 GB.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('motion')}
                className="btn-primary py-3 px-6 text-sm font-bold"
              >
                <span>Lanjut ke Langkah 02 (Pasang Skill Motion)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Pasang audira-skill-motion */}
        {activeTab === 'motion' && (
          <div className="space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 animate-fade-in">
            <div>
              <span className="font-mono text-xs font-bold text-accent uppercase">LANGKAH 02</span>
              <h2 className="text-2xl font-bold tracking-tight text-paper mt-1">
                Memasang Paket Visual Engine (audira-skill-motion)
              </h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Setelah pembayaran terverifikasi, Anda menerima link download file arsip ZIP atau repositori Git privat. Berikut cara menempatkan foldernya.
              </p>
            </div>

            {/* Folder Structure Visualization */}
            <div className="rounded-2xl border border-line bg-ink p-5">
              <span className="font-mono text-xs font-bold text-dim uppercase mb-3 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-accent" />
                Struktur Folder audira-skill-motion:
              </span>
              <pre className="font-mono text-xs text-muted leading-relaxed overflow-x-auto">
{`audira-skill-motion/
├── kits/                  # 29 Kit Gaya Sinematik 3D (Buildforge, Precision, dll.)
├── starter/               # Template proyek Remotion 4.0 siap render
│   ├── src/               # Source code React Three Fiber & Shaders
│   ├── remotion.config.ts # Konfigurasi resolusi 1080x1920 & 60 FPS
│   └── package.json       # Dependensi Three.js, R3F & Remotion
├── audira-brand.json      # Konfigurasi logo watermark & warna brand
├── start_remotion.bat     # Shortcut 1-klik buka Studio 3D (Windows)
└── SKILL.md               # Instruksi sutradara otonom Claude Code`}
              </pre>
            </div>

            {/* 2 Ways to Install */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <span className="font-mono text-xs font-bold text-accent uppercase">CARA A: DI CLAUDE CODE</span>
                <h3 className="font-display font-bold text-base text-paper">Folder Skill Claude Pribadi</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Salin folder <code className="text-accent bg-black/40 px-1 rounded font-mono">audira-skill-motion</code> ke direktori skill lokal Anda:
                </p>
                <div className="space-y-1.5 font-mono text-[11px] text-paper">
                  <div className="bg-ink p-2 rounded border border-line">
                    <span className="text-dim">Windows:</span> C:\Users\&lt;user&gt;\.claude\skills\audira-motion\
                  </div>
                  <div className="bg-ink p-2 rounded border border-line">
                    <span className="text-dim">macOS:</span> ~/.claude/skills/audira-motion/
                  </div>
                </div>
                <p className="text-[11px] text-dim">
                  Buka kembali terminal Claude Code, lalu ketik perintah <code className="text-accent">/audira-motion</code>.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase">CARA B: DI CURSOR / VS CODE</span>
                <h3 className="font-display font-bold text-base text-paper">Workspace Proyek Mandiri</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Buka folder <code className="text-cyan-400 bg-black/40 px-1 rounded font-mono">starter/</code> langsung di Cursor atau VS Code, lalu buka Terminal:
                </p>
                <div className="bg-ink p-3 rounded-xl border border-line font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <span>npm install</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('npm install', 'npm_inst')}
                    className="text-[11px] text-dim hover:text-paper"
                  >
                    {copiedKey === 'npm_inst' ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
                <p className="text-[11px] text-dim">
                  Dependensi Remotion dan Three.js akan otomatis terpasang dalam 1-2 menit.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('prasyarat')}
                className="btn-outline py-2.5 px-5 text-xs font-semibold"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mesh')}
                className="btn-primary py-3 px-6 text-sm font-bold"
              >
                <span>Lanjut ke Langkah 03 (Aktivasi MCP Mesh)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Aktivasi audira-skill-mesh (MCP Server) */}
        {activeTab === 'mesh' && (
          <div className="space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 animate-fade-in">
            <div>
              <span className="font-mono text-xs font-bold text-purple-400 uppercase">LANGKAH 03 (KUNCI PRESISI)</span>
              <h2 className="text-2xl font-bold tracking-tight text-paper mt-1">
                Aktivasi AUDIRA Skill Mesh (MCP Server)
              </h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Inilah rahasia mengapa hasil video AI bisa 100% presisi dan tidak halusinasi: <strong>Model Context Protocol (MCP)</strong> memberi AI Anda alat nyata untuk mengendalikan Three.js, membuat voiceover, dan menyusun audio sync.
              </p>
            </div>

            {/* The 3 Active Superpowers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-tile border border-line space-y-1">
                <span className="font-mono text-[10px] text-accent font-bold uppercase">TOOL 1</span>
                <h4 className="font-bold text-sm text-paper">audira_auto_orchestrate</h4>
                <p className="text-xs text-muted">
                  Sutradara otonom yang otomatis memilihkan kit 3D terbaik dan angle kamera sesuai ide naskah Anda.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-tile border border-line space-y-1">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">TOOL 2</span>
                <h4 className="font-bold text-sm text-paper">audira_generate_voiceover</h4>
                <p className="text-xs text-muted">
                  Memproduksi audio suara jernih Cartesia AI dan timestamp JSON per kata untuk sinkronisasi subtitle kinetik.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-tile border border-line space-y-1">
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">TOOL 3</span>
                <h4 className="font-bold text-sm text-paper">audira_validate_social_captions</h4>
                <p className="text-xs text-muted">
                  Menghasilkan paket caption viral lengkap dengan hashtag untuk TikTok, Reels, Shorts, dan X.
                </p>
              </div>
            </div>

            {/* MCP Setup Guide for Claude Desktop / Claude Code */}
            <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-paper uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Konfigurasi 1-Klik di Claude Desktop / Claude Code
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(CLAUDE_MCP_CONFIG, 'claude_mcp')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold text-accent hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'claude_mcp' ? 'Tersalin!' : 'Salin JSON'}</span>
                </button>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Buka file konfigurasi Claude di <code className="text-accent font-mono text-[11px] bg-black/40 px-1 rounded">%APPDATA%\Claude\claude_desktop_config.json</code> (Windows) atau <code className="text-accent font-mono text-[11px] bg-black/40 px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS), lalu tambahkan blok berikut:
              </p>
              <pre className="p-4 rounded-xl bg-ink border border-line font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{CLAUDE_MCP_CONFIG}
              </pre>
            </div>

            {/* MCP Setup Guide for Cursor */}
            <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
              <span className="font-mono text-xs font-bold text-paper uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Cara Pasang di Cursor IDE
              </span>
              <ol className="list-decimal list-inside text-xs text-muted space-y-1.5 leading-relaxed">
                <li>Buka Cursor → klik menu <strong>Settings</strong> (ikon roda gigi) → <strong>Features</strong> → <strong>MCP Servers</strong>.</li>
                <li>Klik tombol <strong>+ Add New MCP Server</strong>.</li>
                <li>Isi <strong>Name</strong>: <code className="text-paper font-mono">audira</code></li>
                <li>Isi <strong>Type</strong>: pilih <code className="text-paper font-mono">command</code></li>
                <li>Isi <strong>Command</strong>: <code className="text-accent font-mono">node F:/AUDIRA-ALL-SKILL/mcp-server/src/index.js</code></li>
                <li>Status akan berubah hijau <em>Connected</em>. Cursor Anda sekarang bisa memanggil seluruh fungsi sutradara AUDIRA!</li>
              </ol>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('motion')}
                className="btn-outline py-2.5 px-5 text-xs font-semibold"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('render')}
                className="btn-primary py-3 px-6 text-sm font-bold"
              >
                <span>Lanjut ke Langkah 04 (Render Video Pertama)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Render Video Pertama */}
        {activeTab === 'render' && (
          <div className="space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 animate-fade-in">
            <div>
              <span className="font-mono text-xs font-bold text-accent uppercase">LANGKAH 04</span>
              <h2 className="text-2xl font-bold tracking-tight text-paper mt-1">
                Menjalankan Perintah &amp; Render Video MP4 Pertama
              </h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Pilih cara kerja yang paling nyaman untuk Anda: biarkan AI menyutradarai secara otonom, atau gunakan antarmuka Studio 3D interaktif.
              </p>
            </div>

            {/* Workflow 1: AI Prompt Command */}
            <div className="rounded-2xl border-2 border-accent/40 bg-tile p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-accent text-ink font-mono text-[10px] font-black uppercase">
                  CARA UTAMA
                </span>
                <h3 className="font-display font-bold text-base text-paper">
                  Perintah Otonom Claude Code / Cursor
                </h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Cukup ketik perintah naskah di terminal Claude Code. AI akan memanggil `audira-skill-mesh` dan menyusun video secara otomatis:
              </p>
              <div className="bg-ink p-4 rounded-xl border border-line font-mono text-xs text-paper flex items-center justify-between">
                <span className="text-accent">
                  /audira-motion Buatkan video 3D promosi jam tangan titanium dengan narasi suara jernih dan caption viral
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('/audira-motion Buatkan video 3D promosi jam tangan titanium dengan narasi suara jernih dan caption viral', 'cmd_prompt')}
                  className="text-xs text-dim hover:text-paper font-semibold ml-2 shrink-0"
                >
                  {copiedKey === 'cmd_prompt' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <p className="text-[11px] text-dim">
                Claude akan otomatis membuat folder komposisi, menghasilkan audio TTS, merakit scene 3D, dan merender tes tampilan.
              </p>
            </div>

            {/* Workflow 2: Remotion Studio Web UI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">PREVIEW BROWSER</span>
                <h4 className="font-bold text-sm text-paper">Remotion Studio UI</h4>
                <p className="text-xs text-muted">
                  Buka editor interaktif di browser (Port 3000) untuk scrubbing timeline per frame:
                </p>
                <div className="bg-ink p-2 rounded font-mono text-xs text-cyan-300">
                  npm run remotion:dev
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                <span className="font-mono text-[10px] text-yellow-400 font-bold uppercase">UJI CEPAT</span>
                <h4 className="font-bold text-sm text-paper">Smoke Test Visual</h4>
                <p className="text-xs text-muted">
                  Render 1 frame still gambar HD untuk memastikan tekstur dan pencahayaan pas:
                </p>
                <div className="bg-ink p-2 rounded font-mono text-xs text-yellow-300">
                  npm run remotion:smoke
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">EKSPOR FINAL</span>
                <h4 className="font-bold text-sm text-paper">Render MP4 1080p 60FPS</h4>
                <p className="text-xs text-muted">
                  Render video vertikal 9:16 Full HD berkualitas siaran bebas watermark:
                </p>
                <div className="bg-ink p-2 rounded font-mono text-xs text-emerald-300">
                  npm run remotion:render
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('mesh')}
                className="btn-outline py-2.5 px-5 text-xs font-semibold"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('troubleshooting')}
                className="btn-primary py-3 px-6 text-sm font-bold"
              >
                <span>Lihat Solusi Kendala (Troubleshooting)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Troubleshooting / Solusi Kendala */}
        {activeTab === 'troubleshooting' && (
          <div className="space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 animate-fade-in">
            <div>
              <span className="font-mono text-xs font-bold text-red-400 uppercase">LANGKAH 05</span>
              <h2 className="text-2xl font-bold tracking-tight text-paper mt-1">
                Solusi Kendala Teknis Populer (Troubleshooting Runbook)
              </h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Jawaban praktis jika Anda menemui kendala saat pertama kali menjalankan proyek di komputer Anda.
              </p>
            </div>

            <div className="space-y-3">
              {/* Issue 1 */}
              <div className="rounded-2xl border border-line bg-tile p-4 space-y-2">
                <h4 className="font-bold text-sm text-paper flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>1. Pesan: &quot;ffmpeg is not recognized as an internal or external command&quot;</span>
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Penyebab:</strong> FFmpeg belum terpasang atau belum masuk ke System Environment Variables (PATH).
                  <br />
                  <strong>Solusi:</strong> Buka PowerShell sebagai Administrator lalu jalankan <code className="text-accent font-mono">winget install ffmpeg</code>, kemudian tutup dan buka kembali terminal Anda agar PATH terbarui.
                </p>
              </div>

              {/* Issue 2 */}
              <div className="rounded-2xl border border-line bg-tile p-4 space-y-2">
                <h4 className="font-bold text-sm text-paper flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>2. Pesan: &quot;Node.js version is not supported&quot;</span>
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Penyebab:</strong> Menggunakan versi Node.js yang terlalu lawas (di bawah v18) atau versi bleeding-edge ganjil.
                  <br />
                  <strong>Solusi:</strong> Unduh dan pasang versi <strong>LTS (v20 atau v22)</strong> dari <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-accent underline">nodejs.org</a>.
                </p>
              </div>

              {/* Issue 3 */}
              <div className="rounded-2xl border border-line bg-tile p-4 space-y-2">
                <h4 className="font-bold text-sm text-paper flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>3. Render terasa lambat atau ada peringatan WebGL</span>
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Penyebab:</strong> Render 3D berjalan pada mode software (CPU) karena GPU driver belum aktif.
                  <br />
                  <strong>Solusi:</strong> Pastikan driver grafis Anda (NVIDIA GeForce Experience atau AMD Software) terbarui, dan aktifkan <em>Hardware Acceleration</em> di browser Chrome/Edge Anda.
                </p>
              </div>

              {/* Issue 4 */}
              <div className="rounded-2xl border border-line bg-tile p-4 space-y-2">
                <h4 className="font-bold text-sm text-paper flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>4. Suara narasi tidak bersuara saat render lokal</span>
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Penyebab:</strong> File audio `.wav` belum di-generate atau kunci Cartesia API belum terpasang.
                  <br />
                  <strong>Solusi:</strong> Di paket Master &amp; Creator Lab, tool MCP `audira_generate_voiceover` otomatis menggunakan gateway audio resmi. Periksa apakah folder <code className="text-accent font-mono">public/audio/</code> sudah memuat file audio naskah Anda.
                </p>
              </div>
            </div>

            {/* Direct Support CTA */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-tile to-ink border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-paper">Masih Mengalami Kendala? Jangan Ragu Hubungi Kami</h4>
                <p className="text-xs text-muted mt-0.5">
                  Sebagai pembeli lisensi resmi, Anda berhak mendapatkan bantuan teknis langsung dari kreator sistem (Mas Agus).
                </p>
              </div>
              <a
                href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20butuh%20bantuan%20setup%20instalasi%20Audira%20Motion"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 btn-primary py-3 px-5 text-xs font-bold shadow-lg"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                <span>Chat Mas Agus di WhatsApp ➔</span>
              </a>
            </div>
          </div>
        )}

        {/* Bottom Navigation & CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link
            href="/#produk"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors"
          >
            <span>➔ Kembali ke Pilihan Lisensi 3D</span>
          </Link>

          <a
            href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20ingin%20tanya-tanya%20seputar%20lisensi%20dan%20instalasi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-orange-400 transition-colors"
          >
            <span>Konsultasi Teknis Pra-Beli via WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
