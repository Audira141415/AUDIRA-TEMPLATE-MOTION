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
  FolderTree,
  ChevronRight,
  Monitor,
  Apple,
  Search,
  BookOpen
} from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

type OSType = 'windows' | 'mac';

export default function InstallationGuidePage() {
  const [selectedOS, setSelectedOS] = useState<OSType>('windows');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    node: false,
    ffmpeg: false,
    extract: false,
    mcp: false,
    render: false
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 5) * 100);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const CLAUDE_MCP_CONFIG_WIN = `{
  "mcpServers": {
    "audira": {
      "command": "node",
      "args": [
        "C:/audira-mesh/mcp-server/src/index.js"
      ]
    }
  }
}`;

  const CLAUDE_MCP_CONFIG_MAC = `{
  "mcpServers": {
    "audira": {
      "command": "node",
      "args": [
        "/Users/USERNAME/audira-mesh/mcp-server/src/index.js"
      ]
    }
  }
}`;

  const TROUBLESHOOTING_LIST = [
    {
      id: 'ffmpeg',
      title: 'Pesan Error: "ffmpeg is not recognized as an internal or external command"',
      cause: 'FFmpeg belum terinstal di laptop atau path direktori bin belum didaftarkan ke System PATH Windows.',
      solutionWin: 'Jalankan di PowerShell Admin: winget install ffmpeg lalu restart terminal PowerShell / VS Code agar environment variable ter-refresh.',
      solutionMac: 'Jalankan di Terminal: brew install ffmpeg'
    },
    {
      id: 'node',
      title: 'Pesan Error: "Node.js version is not supported (butuh v18+ atau v20+)"',
      cause: 'Versi Node.js yang aktif di terminal terlalu lawas (v14/v16) atau versi ganjil eksperimental.',
      solutionWin: 'Unduh installer Node.js v20 atau v22 LTS dari https://nodejs.org lalu pasang dan jalankan "node -v" untuk verifikasi.',
      solutionMac: 'Jalankan "nvm install 20 && nvm use 20" atau instal via "brew install node@20".'
    },
    {
      id: 'webgl',
      title: 'Render 3D terasa lambat atau ada notifikasi WebGL Software Fallback',
      cause: 'Remotion berjalan pada mode CPU software rendering karena driver GPU belum terdeteksi atau hardware acceleration mati di browser.',
      solutionWin: 'Buka Chrome/Edge -> Settings -> System -> aktifkan "Use graphics acceleration when available", dan pastikan driver NVIDIA/AMD terbarui.',
      solutionMac: 'Di Mac M1/M2/M3/M4 akselerasi GPU otomatis aktif secara native lewat Apple Metal.'
    },
    {
      id: 'audio',
      title: 'Suara narator tidak keluar atau Cartesia API error',
      cause: 'Kunci API suara belum diisi di file .env atau gateway audio lokal sedang offline.',
      solutionWin: 'Cek file .env di folder starter: isi CARTESIA_API_KEY=... atau gunakan mode Offline TTS lokal yang otomatis disediakan di paket Master & Lab.',
      solutionMac: 'Pastikan file public/audio/ memuat file narasi .wav hasil sinkronisasi.'
    }
  ];

  const filteredTroubleshoot = TROUBLESHOOTING_LIST.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.cause.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ink font-display text-paper antialiased selection:bg-accent selection:text-ink">
      <SiteHeader />

      {/* Main Container */}
      <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-8 md:py-12">
        
        {/* Breadcrumb & Version Pill */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
            <Link href="/" className="hover:text-paper transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-accent font-bold">Buku Panduan Resmi</span>
            <span>/</span>
            <span className="text-fg-2">Instalasi &amp; Eksekusi</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-xs text-emerald-400 font-bold">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              VERSI 3.0.0 PRODUKSI
            </span>
            <span className="hidden sm:inline text-xs text-dim font-mono">• Terverifikasi Maret 2026</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-10 max-w-[900px] space-y-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-mono font-bold text-accent">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DOKUMENTASI RESMI PEMBELI LISENSI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-paper">
            Buku Panduan Instalasi <br />
            <span className="text-accent">AUDIRA Skill Motion + Agentic Skill Mesh</span>
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Panduan lengkap langkah-demi-langkah memasang Visual Engine 3D Remotion 4.0 dan mengaktifkan <strong>Otak Sutradara AI (MCP Server)</strong> di komputer Anda. Ikuti 5 langkah di bawah untuk mulai merender video reels 1080p 60 FPS pertama Anda dalam 5 menit.
          </p>

          {/* Quick Action Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <a 
              href="#langkah-1"
              className="btn-primary py-2.5 px-5 font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
            >
              <span>Mulai dari Langkah 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => handleCopy(`https://github.com/Audira141415/AUDIRA-TEMPLATE-MOTION/blob/master/PANDUAN_INSTALASI.md`, 'doc_link')}
              className="btn-outline py-2.5 px-4 font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-accent" />
              <span>{copiedKey === 'doc_link' ? '✓ Link Dokumen Tersalin' : 'Salin Link Dokumen Offline'}</span>
            </button>

            <a
              href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20sudah%20beli%20lisensi%20dan%20ingin%20tanya%20panduan%20instalasi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-2.5 font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bantuan 1-on-1 Mas Agus</span>
            </a>
          </div>
        </div>

        {/* Global OS Selector Bar */}
        <div className="mb-10 rounded-2xl border-2 border-line bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              PILIH SISTEM OPERASI KOMPUTER ANDA:
            </span>
            <p className="text-xs sm:text-sm text-muted">
              Perintah terminal dan letak folder akan otomatis disesuaikan dengan sistem operasi yang Anda pilih.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-ink border border-line shrink-0">
            <button
              type="button"
              onClick={() => setSelectedOS('windows')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedOS === 'windows'
                  ? 'bg-accent text-ink shadow-md'
                  : 'text-muted hover:text-paper'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Windows (PowerShell)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOS('mac')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedOS === 'mac'
                  ? 'bg-accent text-ink shadow-md'
                  : 'text-muted hover:text-paper'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>macOS / Linux (Terminal)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sticky Table of Contents & Interactive Checklist (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 z-10">
            
            {/* Navigation Stepper Menu */}
            <div className="rounded-2xl border border-line bg-card p-5 space-y-4">
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-dim block">
                DAFTAR LANGKAH SETUP:
              </span>

              <nav className="space-y-1.5 text-xs font-medium">
                {[
                  { href: '#langkah-1', step: '01', title: 'Prasyarat PC & Software' },
                  { href: '#langkah-2', step: '02', title: 'Pasang Skill ke Claude' },
                  { href: '#langkah-3', step: '03', title: 'Aktivasi Otak AI (MCP Mesh)' },
                  { href: '#langkah-4', step: '04', title: 'Perintah & Render Pertama' },
                  { href: '#langkah-5', step: '05', title: 'Solusi Kendala (Troubleshooting)' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-line hover:bg-tile text-muted hover:text-paper transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-accent group-hover:text-orange-400">
                        {item.step}
                      </span>
                      <span className="font-semibold">{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-dim group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Interactive Progress Checklist */}
            <div className="rounded-2xl border border-line bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-accent flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CHECKLIST KESIAPAN SETUP
                </span>
                <span className="text-xs font-mono font-bold text-paper">
                  {completedCount}/5 ({progressPercent}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-ink overflow-hidden border border-line">
                <div 
                  className="h-full bg-accent transition-all duration-300 rounded-full" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { id: 'node', label: 'Node.js v20+ terpasang' },
                  { id: 'ffmpeg', label: 'FFmpeg aktif di terminal' },
                  { id: 'extract', label: 'Skill terpasang di Claude' },
                  { id: 'mcp', label: 'MCP Server terhubung ke AI' },
                  { id: 'render', label: 'Video uji coba berhasil dirender' },
                ].map((chk) => (
                  <label 
                    key={chk.id} 
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-tile cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[chk.id]}
                      onChange={() => toggleCheck(chk.id)}
                      className="size-4 rounded border-line bg-ink text-accent focus:ring-accent accent-[#ff6a2a]"
                    />
                    <span className={checkedItems[chk.id] ? 'line-through text-dim font-medium' : 'text-paper font-medium'}>
                      {chk.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Direct 1-on-1 Support Card */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-tile to-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>GARANSI SETUP 1-ON-1 SAMPAI JADI</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Pembeli lisensi resmi berhak meminta pendampingan langsung dari Mas Agus via WhatsApp atau remote desktop jika ada kendala instalasi.
              </p>
              <a
                href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20pembeli%20lisensi%20Audira%20Motion%20dan%20membutuhkan%20bantuan%20setup%20instalasi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Chat WhatsApp Mas Agus ➔</span>
              </a>
            </div>

          </aside>

          {/* RIGHT COLUMN: Continuous Step-by-Step Content (8 Cols) */}
          <main className="lg:col-span-8 space-y-12">

            {/* LANGKAH 01: PRASYARAT PC & SOFTWARE */}
            <section id="langkah-1" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                  01
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  LANGKAH 01 DARI 05
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Prasyarat Komputer &amp; Software Pendukung
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Sebelum menjalankan engine 3D Remotion, pastikan komputer Anda memiliki dua perangkat lunak standar gratis berikut. Keduanya hanya perlu dipasang satu kali.
                </p>
              </div>

              {/* Requirement 1: Node.js */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent uppercase">SOFTWARE 1</span>
                    <span className="text-dim">•</span>
                    <span className="text-xs font-bold text-paper">Node.js (Versi LTS)</span>
                  </div>
                  <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-[10px] text-accent font-bold">Wajib</span>
                </div>
                <h3 className="font-bold text-base text-paper">Node.js v20.x atau v22.x LTS</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Mesin runtime JavaScript untuk menjalankan compiler Remotion 4.0, Three.js, dan server lokal di komputer Anda.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://nodejs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-paper px-4 py-2 text-xs font-bold text-ink hover:bg-white transition-colors"
                  >
                    <span>Unduh Node.js LTS Resmi (nodejs.org)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-dim font-mono">Pilih tombol &quot;LTS Recommended For Most Users&quot;</span>
                </div>
              </div>

              {/* Requirement 2: FFmpeg with OS-Specific Commands */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase">SOFTWARE 2</span>
                    <span className="text-dim">•</span>
                    <span className="text-xs font-bold text-paper">FFmpeg &amp; FFprobe</span>
                  </div>
                  <span className="rounded bg-cyan-400/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">Wajib</span>
                </div>
                <h3 className="font-bold text-base text-paper">FFmpeg Media Processor</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Digunakan oleh Remotion untuk menggabungkan frame gambar 3D menjadi file MP4 60 FPS dan menyeimbangkan volume audio ke standar siaran (-14 LUFS).
                </p>

                {/* Terminal Box for FFmpeg */}
                <div className="rounded-xl border border-line bg-ink overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-line bg-tile-2 text-xs text-dim font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="size-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="size-2.5 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-2 text-paper text-[11px]">
                        {selectedOS === 'windows' ? 'PowerShell (Run as Admin)' : 'Terminal (bash/zsh)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedOS === 'windows' ? 'winget install ffmpeg' : 'brew install ffmpeg', 'ffmpeg_cmd')}
                      className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-bold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'ffmpeg_cmd' ? 'Tersalin!' : 'Salin Perintah'}</span>
                    </button>
                  </div>
                  <div className="p-3.5 font-mono text-xs text-emerald-400">
                    {selectedOS === 'windows' ? 'winget install ffmpeg' : 'brew install ffmpeg'}
                  </div>
                </div>
                <p className="text-[11px] text-dim">
                  *Setelah instalasi selesai, tutup dan buka kembali terminal Anda agar perintah <code>ffmpeg -version</code> terdeteksi.
                </p>
              </div>

              {/* Hardware Specs Card */}
              <div className="rounded-2xl border border-line-soft bg-ink p-4 space-y-2">
                <span className="text-[11px] font-mono font-bold text-dim uppercase block">
                  SPESIFIKASI KOMPUTER YANG DIREKOMENDASIKAN:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted pt-1">
                  <div className="p-3 rounded-xl bg-tile border border-line">
                    <span className="font-bold text-paper block">Apple Mac:</span>
                    <span className="text-[11px]">Chip M1, M2, M3, atau M4 (sangat cepat dengan Metal GPU).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-tile border border-line">
                    <span className="font-bold text-paper block">Windows PC:</span>
                    <span className="text-[11px]">GPU NVIDIA RTX / AMD Radeon dengan minimal 4 GB VRAM.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-tile border border-line">
                    <span className="font-bold text-paper block">RAM &amp; SSD:</span>
                    <span className="text-[11px]">RAM 8 GB (16 GB disarankan) &amp; sisa ruang disk 5 GB.</span>
                  </div>
                </div>
              </div>
            </section>


            {/* LANGKAH 02: MEMASANG SKILL KE CLAUDE */}
            <section id="langkah-2" className="scroll-mt-24 space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                  02
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  LANGKAH 02 DARI 05 (INTI INSTALASI SKILL)
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Memasang Skill ke Claude (Claude Code CLI &amp; Claude Desktop)
                </h2>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">
                  Agar Claude bertindak sebagai sutradara 3D otonom, file skill <strong>`SKILL.md`</strong> dan folder <strong>`kits/`</strong> harus didaftarkan ke sistem Claude Anda. Pilih salah satu cara berikut:
                </p>
              </div>

              {/* Crucial Account Requirement Notice */}
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300 text-sm">Penting: Kebutuhan Akun Claude Code</h4>
                  <p className="leading-relaxed text-muted">
                    Skill ini dirancang untuk dijalankan melalui <strong>Claude Code</strong> (agen coding terminal resmi dari Anthropic) atau aplikasi <strong>Claude Desktop</strong>. Anda memerlukan akun Claude berbayar (Claude Pro, Max, Team, Enterprise) atau akun Anthropic API Key (<code className="text-amber-300 font-mono">ANTHROPIC_API_KEY</code>).
                  </p>
                  <p className="text-[11px] text-dim">
                    *Alasan: Obrolan web gratis di claude.ai tidak memiliki akses terminal lokal atau kartu grafis (GPU) laptop Anda untuk mengompilasi dan merender file video MP4 60 FPS.
                  </p>
                </div>
              </div>

              {/* Directory Tree Card */}
              <div className="rounded-2xl border border-line bg-ink overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-tile-2 text-xs font-mono text-paper">
                  <span className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-accent" />
                    <span>audira-skill-motion/ (Struktur Paket Skill yang Anda Dapatkan)</span>
                  </span>
                  <span className="text-dim text-[11px]">29 Kit Gaya 3D</span>
                </div>
                <pre className="p-4 sm:p-5 font-mono text-xs text-muted leading-relaxed overflow-x-auto">
{`audira-skill-motion/
├── SKILL.md               # 🌟 FILE UTAMA: Doktrin sutradara otonom & instruksi Claude
├── kits/                  # 29 Kit Gaya 3D (Buildforge, Precision, Cyberforge, dll.)
├── starter/               # Template proyek Remotion 4.0 siap pakai
│   ├── src/               # Source code React Three Fiber, Shaders & Camera rigs
│   ├── remotion.config.ts # Konfigurasi resolusi 1080x1920 60 FPS
│   └── package.json       # Dependensi Remotion 4.0 & Three.js
├── audira-brand.json      # Konfigurasi logo watermark & palet warna brand Anda
├── PANDUAN_INSTALASI.md   # Buku manual instalasi lengkap offline
└── START_HERE.md          # Panduan kilat memulai 3 langkah`}
                </pre>
              </div>

              {/* 3 Step-by-Step Installation Methods */}
              <div className="space-y-4">
                
                {/* Method 1: Claude Code Global Skills Folder (RECOMMENDED) */}
                <div className="rounded-2xl border-2 border-accent/40 bg-tile p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-accent text-ink font-mono text-[10px] font-black uppercase">
                        METODE 1 (DIREKOMENDASIKAN)
                      </span>
                      <h4 className="font-bold text-base text-paper">
                        Pasang ke Direktori Skill Global Claude Code CLI
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-accent font-bold">1 Kali Setup • Aktif di Mana Saja</span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    Claude Code membaca semua skill kustom dari folder konfigurasi pengguna <code className="text-paper font-mono">.claude/skills/</code>. Cukup salin folder skill ke lokasi berikut:
                  </p>

                  {/* OS Terminal Box */}
                  <div className="rounded-xl border border-line bg-ink overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 py-2 border-b border-line bg-tile-2 text-xs text-dim font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-red-500/80 inline-block" />
                        <span className="size-2.5 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="size-2.5 rounded-full bg-green-500/80 inline-block" />
                        <span className="ml-2 text-paper text-[11px]">
                          {selectedOS === 'windows' ? 'PowerShell (Salin Otomatis ke Claude Skills)' : 'Terminal macOS / Linux (Salin ke Claude Skills)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(
                          selectedOS === 'windows'
                            ? `mkdir -p $HOME\\.claude\\skills\\audira-motion ; Copy-Item -Path "audira-skill-motion\\*" -Destination "$HOME\\.claude\\skills\\audira-motion\\" -Recurse -Force`
                            : `mkdir -p ~/.claude/skills/audira-motion && cp -r audira-skill-motion/* ~/.claude/skills/audira-motion/`,
                          'copy_skill_dir'
                        )}
                        className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-bold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'copy_skill_dir' ? 'Tersalin!' : 'Salin Perintah'}</span>
                      </button>
                    </div>
                    <div className="p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto">
                      {selectedOS === 'windows' ? (
                        <>
                          <span className="text-dim"># 1. Buat folder skill &amp; salin file:</span><br />
                          mkdir -p $HOME\.claude\skills\audira-motion<br />
                          Copy-Item -Path &quot;audira-skill-motion\*&quot; -Destination &quot;$HOME\.claude\skills\audira-motion\&quot; -Recurse -Force
                        </>
                      ) : (
                        <>
                          <span className="text-dim"># 1. Buat folder skill &amp; salin file:</span><br />
                          mkdir -p ~/.claude/skills/audira-motion<br />
                          cp -r audira-skill-motion/* ~/.claude/skills/audira-motion/
                        </>
                      )}
                    </div>
                  </div>

                  {/* Verification Check */}
                  <div className="p-3.5 rounded-xl bg-ink/70 border border-line text-xs space-y-1">
                    <span className="font-mono text-[11px] font-bold text-accent uppercase block">
                      Pastikan Letak File SKILL.md Berada di:
                    </span>
                    <p className="font-mono text-paper text-[11px] break-all">
                      {selectedOS === 'windows'
                        ? 'C:\\Users\\<NamaUser>\\.claude\\skills\\audira-motion\\SKILL.md'
                        : '~/.claude/skills/audira-motion/SKILL.md'}
                    </p>
                  </div>
                </div>

                {/* Method 2: Claude Desktop App GUI */}
                <div className="rounded-2xl border border-line bg-tile p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold uppercase border border-cyan-800">
                      METODE 2 (ANTARMUKA GRAFIS)
                    </span>
                    <h4 className="font-bold text-base text-paper">
                      Upload Skill di Aplikasi Claude Desktop
                    </h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Bagi Anda yang menggunakan aplikasi resmi Claude Desktop di Mac atau Windows:
                  </p>
                  <ol className="list-decimal list-inside text-xs text-muted space-y-2 leading-relaxed bg-ink p-4 rounded-xl border border-line">
                    <li>Buka aplikasi <strong>Claude Desktop</strong>.</li>
                    <li>Klik foto profil Anda di pojok kiri/kanan bawah → pilih <strong>Settings</strong> (atau <strong>Preferences</strong>).</li>
                    <li>Pilih tab <strong>Capabilities</strong> atau <strong>Skills</strong> (atau menu <strong>Customize</strong> → <strong>Skills</strong>).</li>
                    <li>Klik tombol <strong>+ Add Skill</strong> atau <strong>Upload a Skill</strong>.</li>
                    <li>Pilih file arsip ZIP <code className="text-paper font-mono">audira-skill-motion.zip</code> (atau pilih folder yang memuat <code className="text-accent font-mono">SKILL.md</code>).</li>
                    <li>Beri nama skill: <code className="text-paper font-mono">audira-motion</code>.</li>
                    <li>Pastikan status skill berubah hijau <strong>Active</strong>.</li>
                  </ol>
                </div>

                {/* Method 3: Workspace / Project-Level Skill */}
                <div className="rounded-2xl border border-line bg-tile p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-tile-2 text-dim font-mono text-[10px] font-bold uppercase border border-line">
                      METODE 3 (PROJECT-LEVEL)
                    </span>
                    <h4 className="font-bold text-base text-paper">
                      Pasang di Folder Workspace Khusus Proyek Anda
                    </h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Jika Anda ingin skill ini hanya aktif di dalam satu folder proyek video kerja tertentu:
                  </p>
                  <div className="text-xs text-muted space-y-1.5 bg-ink p-4 rounded-xl border border-line">
                    <p>1. Buka folder kerja proyek Anda di terminal atau VS Code / Cursor.</p>
                    <p>2. Buat folder <code className="text-paper font-mono">.claude/skills/audira-motion/</code> di dalam root folder proyek tersebut.</p>
                    <p>3. Letakkan file <code className="text-accent font-mono">SKILL.md</code> dan folder <code className="text-paper font-mono">kits/</code> ke dalamnya.</p>
                    <p>4. Saat Claude Code dibuka di folder proyek tersebut, Claude otomatis mengenali skill ini.</p>
                  </div>
                </div>

              </div>

              {/* Verification & Smoke Test Step */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-tile to-ink p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CARA VERIFIKASI BAHWA SKILL SUDAH TERPASANG DI CLAUDE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-ink border border-line space-y-1">
                    <span className="font-mono text-[11px] text-emerald-400 font-bold block">1. Cek Daftar Skill:</span>
                    <p className="text-muted text-[11px]">Buka terminal, jalankan <code>claude</code> lalu ketik:</p>
                    <code className="text-accent font-mono font-bold block">/skills</code>
                    <p className="text-dim text-[10px]">*Pastikan `audira-motion` muncul di daftar skill aktif.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-ink border border-line space-y-1">
                    <span className="font-mono text-[11px] text-emerald-400 font-bold block">2. Uji Panggilan Sutradara:</span>
                    <p className="text-muted text-[11px]">Ketik perintah uji coba:</p>
                    <code className="text-accent font-mono font-bold block">/audira-motion halo</code>
                    <p className="text-dim text-[10px]">*Claude akan langsung menyapa sebagai Sutradara 3D AUDIRA!</p>
                  </div>
                </div>
              </div>
            </section>


            {/* LANGKAH 03: AKTIVASI MCP SKILL MESH */}
            <section id="langkah-3" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                  03
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  LANGKAH 03 DARI 05 (KUNCI PRESISI)
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Aktivasi AUDIRA Skill Mesh (MCP Server)
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Inilah rahasia mengapa AI Anda tidak akan halusinasi kode atau timing audio: <strong>Model Context Protocol (MCP)</strong> menghubungkan AI langsung ke mesin sutradara video AUDIRA.
                </p>
              </div>

              {/* The 3 Superpowers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-tile border border-line space-y-1.5">
                  <span className="font-mono text-[10px] text-accent font-bold uppercase">ALAT 1</span>
                  <h4 className="font-bold text-sm text-paper">audira_auto_orchestrate</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Sutradara otonom yang otomatis memilihkan kit 3D terbaik dan angle kamera sesuai ide naskah Anda.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-tile border border-line space-y-1.5">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">ALAT 2</span>
                  <h4 className="font-bold text-sm text-paper">audira_generate_voiceover</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Memproduksi audio narator jernih Cartesia AI dan timestamp JSON per kata untuk sinkronisasi subtitle kinetik.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-tile border border-line space-y-1.5">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">ALAT 3</span>
                  <h4 className="font-bold text-sm text-paper">audira_validate_social_captions</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Menghasilkan paket caption viral lengkap dengan hashtag relevan untuk TikTok, Reels, dan Shorts.
                  </p>
                </div>
              </div>

              {/* Claude Config Box */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-paper uppercase flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Konfigurasi MCP di Claude Desktop / Claude Code
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedOS === 'windows' ? CLAUDE_MCP_CONFIG_WIN : CLAUDE_MCP_CONFIG_MAC, 'claude_mcp')}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-accent hover:underline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'claude_mcp' ? 'Tersalin!' : 'Salin JSON'}</span>
                  </button>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Buka file <code className="text-accent font-mono text-[11px] bg-black/40 px-1 rounded">
                    {selectedOS === 'windows' 
                      ? '%APPDATA%\\Claude\\claude_desktop_config.json' 
                      : '~/Library/Application Support/Claude/claude_desktop_config.json'}
                  </code> lalu masukkan blok berikut:
                </p>
                <div className="rounded-xl border border-line bg-ink overflow-hidden">
                  <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                    {selectedOS === 'windows' ? CLAUDE_MCP_CONFIG_WIN : CLAUDE_MCP_CONFIG_MAC}
                  </pre>
                </div>
              </div>

              {/* Cursor Config Guide */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <span className="font-mono text-xs font-bold text-paper uppercase flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Cara Pasang di Cursor IDE (Antarmuka Grafis)
                </span>
                <ol className="list-decimal list-inside text-xs text-muted space-y-1.5 leading-relaxed">
                  <li>Buka Cursor → klik menu <strong>Settings</strong> (ikon roda gigi) → <strong>Features</strong> → <strong>MCP Servers</strong>.</li>
                  <li>Klik tombol <strong>+ Add New MCP Server</strong>.</li>
                  <li>Isi <strong>Name</strong>: <code className="text-paper font-mono">audira</code></li>
                  <li>Isi <strong>Type</strong>: pilih <code className="text-paper font-mono">command</code></li>
                  <li>Isi <strong>Command</strong>: <code className="text-accent font-mono">node C:/audira-mesh/mcp-server/src/index.js</code> (sesuaikan path folder Anda).</li>
                  <li>Status akan berubah hijau <em>Connected</em>. Cursor Anda siap menyutradarai video!</li>
                </ol>
              </div>
            </section>


            {/* LANGKAH 04: PERINTAH & RENDER PERTAMA */}
            <section id="langkah-4" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                  04
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  LANGKAH 04 DARI 05
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Perintah AI &amp; Render Video MP4 Pertama
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Semua sistem sudah siap! Sekarang saatnya membuat video pertama Anda menggunakan satu baris perintah naskah.
                </p>
              </div>

              {/* The Master Prompt Card */}
              <div className="rounded-2xl border-2 border-accent/40 bg-tile p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent text-ink font-mono text-[10px] font-black uppercase">
                    CARA PALING PRAKTIS
                  </span>
                  <h4 className="font-bold text-sm text-paper">Perintah Otonom Claude Code / Cursor</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Buka terminal AI Anda, lalu ketik prompt berikut:
                </p>
                <div className="rounded-xl border border-line bg-ink p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                  <span className="text-accent">
                    /audira-motion Buatkan video 3D gaya Cyber Tech tentang tren AI 2026 dengan narasi suara jernih dan hook viral
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('/audira-motion Buatkan video 3D gaya Cyber Tech tentang tren AI 2026 dengan narasi suara jernih dan hook viral', 'master_prompt')}
                    className="shrink-0 btn-primary py-1.5 px-3 text-[11px] font-bold"
                  >
                    {copiedKey === 'master_prompt' ? 'Tersalin' : 'Salin Perintah'}
                  </button>
                </div>
                <p className="text-[11px] text-dim">
                  AI akan otomatis membuat folder komposisi, menghasilkan audio suara jernih Cartesia, merakit scene 3D, dan merender frame pengujian.
                </p>
              </div>

              {/* 3 Render Commands: Studio, Smoke, Final */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">1. BROWSER STUDIO</span>
                  <h4 className="font-bold text-sm text-paper">Remotion Studio UI</h4>
                  <p className="text-xs text-muted">
                    Buka timeline interaktif di browser (Port 3000):
                  </p>
                  <div className="bg-ink p-2 rounded font-mono text-xs text-cyan-300">
                    pnpm remotion:dev
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                  <span className="font-mono text-[10px] text-yellow-400 font-bold uppercase">2. UJI CEPAT</span>
                  <h4 className="font-bold text-sm text-paper">Smoke Test Visual</h4>
                  <p className="text-xs text-muted">
                    Render 1 gambar still untuk cek lighting &amp; teks:
                  </p>
                  <div className="bg-ink p-2 rounded font-mono text-xs text-yellow-300">
                    pnpm remotion:smoke
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">3. EKSPOR FINAL</span>
                  <h4 className="font-bold text-sm text-paper">MP4 1080p 60 FPS</h4>
                  <p className="text-xs text-muted">
                    Render video vertikal 9:16 Full HD bebas watermark:
                  </p>
                  <div className="bg-ink p-2 rounded font-mono text-xs text-emerald-300">
                    pnpm remotion:render
                  </div>
                </div>

              </div>
            </section>


            {/* LANGKAH 05: TROUBLESHOOTING & FAQ */}
            <section id="langkah-5" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                  05
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  LANGKAH 05 DARI 05
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Solusi Kendala Teknis Populer (Troubleshooting)
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Kompilasi solusi praktis jika Anda menemukan pesan error atau kendala di sistem Anda.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 size-4 text-dim" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari solusi kendala (misal: ffmpeg, node, webgl, audio)..."
                  className="w-full rounded-xl border border-line bg-tile pl-10 pr-4 py-2.5 text-xs sm:text-sm text-paper placeholder:text-dim focus:border-accent focus:outline-none"
                />
              </div>

              {/* Troubleshooting Accordion / Cards */}
              <div className="space-y-3">
                {filteredTroubleshoot.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-line bg-tile p-5 space-y-2">
                    <h4 className="font-bold text-sm text-paper flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs text-dim">
                      <strong>Penyebab:</strong> {item.cause}
                    </p>
                    <div className="p-3 rounded-xl bg-ink border border-line text-xs text-emerald-400 font-mono">
                      <strong>Solusi:</strong> {selectedOS === 'windows' ? item.solutionWin : item.solutionMac}
                    </div>
                  </div>
                ))}

                {filteredTroubleshoot.length === 0 && (
                  <div className="p-6 text-center text-xs text-dim">
                    Tidak ditemukan kendala dengan kata kunci &quot;{searchQuery}&quot;. Hubungi Mas Agus di WhatsApp jika ada pertanyaan lain.
                  </div>
                )}
              </div>

              {/* Still Need Help VIP Box */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-tile to-ink p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-paper">Masih Menemukan Error Lain?</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Jangan buang waktu berjam-jam debugging sendiri. Hubungi Mas Agus langsung untuk pendampingan setup.
                  </p>
                </div>
                <a
                  href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20butuh%20bantuan%20instalasi%20Audira%20Motion%20di%20laptop%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 btn-primary py-2.5 px-4 text-xs font-bold shadow-md"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  <span>Chat Mas Agus di WhatsApp ➔</span>
                </a>
              </div>
            </section>

          </main>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link
            href="/#produk"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors"
          >
            <span>➔ Kembali ke Pilihan Lisensi 3D</span>
          </Link>

          <a
            href="https://wa.me/6285709666240?text=Halo%20Mas%20Agus,%20saya%20ingin%20tanya%20seputar%20lisensi%20dan%20instalasi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-orange-400 transition-colors"
          >
            <span>Konsultasi Pra-Beli via WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      <SiteFooter />
    </div>
  );
}
