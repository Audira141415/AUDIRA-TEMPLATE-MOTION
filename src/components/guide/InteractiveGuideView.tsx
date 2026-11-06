'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowLeft,
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
  BookOpen,
  Wand2,
  Sliders,
  Key,
  ListChecks,
  LayoutList
} from 'lucide-react';
import { ALL_20_KITS } from '@/components/landing/Remotion3DShowcase';
import { VideoTutorialPlayer } from './VideoTutorialPlayer';

export type OSType = 'windows' | 'mac';
export type ViewMode = 'wizard' | 'full';

const CHECKLIST_STEPS = [
  { id: 'node', stepNum: 1, label: 'Node.js v20+ & FFmpeg aktif di terminal' },
  { id: 'claude_cli', stepNum: 1, label: 'Claude Code CLI / Desktop terinstal & login' },
  { id: 'extract', stepNum: 2, label: 'Folder audira-skill-motion diekstrak & npm install selesai' },
  { id: 'skill_copy', stepNum: 2, label: 'File SKILL.md & 29 kits terpasang di .claude/skills/' },
  { id: 'mcp', stepNum: 3, label: 'MCP Server AUDIRA terhubung (/mcp status hijau)' },
  { id: 'render', stepNum: 4, label: 'Video MP4 1080p 60 FPS pertama berhasil dirender' },
];

const PROMPT_DURATION_OPTIONS = [
  { id: '9:16-30s', label: '9:16 Reels / TikTok (30 Detik)', ratio: '9:16 (1080x1920)', duration: '30 detik' },
  { id: '9:16-60s', label: '9:16 Shorts / TikTok (60 Detik)', ratio: '9:16 (1080x1920)', duration: '60 detik' },
  { id: '16:9-60s', label: '16:9 YouTube Landscape (60 Detik)', ratio: '16:9 (1920x1080)', duration: '60 detik' },
  { id: '1:1-30s', label: '1:1 Carousel / Feed (30 Detik)', ratio: '1:1 (1080x1080)', duration: '30 detik' },
];

export interface InteractiveGuideViewProps {
  user: { id: string; name: string; email: string; role: string };
  initialLicense?: string;
  isInsideDashboard?: boolean;
}

export const InteractiveGuideView: React.FC<InteractiveGuideViewProps> = ({
  user,
  initialLicense = 'AUD-LAB-2026-9A82F1',
  isInsideDashboard = false,
}) => {
  const [selectedOS, setSelectedOS] = useState<OSType>('windows');
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [activeWizardStep, setActiveWizardStep] = useState<number>(1);
  const [activeVideoEpisode, setActiveVideoEpisode] = useState<'01' | '02' | '03'>('01');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleJumpToVideo = (epId: '01' | '02' | '03') => {
    setActiveVideoEpisode(epId);
    if (viewMode === 'wizard') {
      setActiveWizardStep(0);
    }
    setTimeout(() => {
      const elem = document.getElementById('video-tutorial');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Dynamic Customer Path & License Configurator
  const [customPathWin, setCustomPathWin] = useState('C:/audira-skill-motion');
  const [customPathMac, setCustomPathMac] = useState('~/audira-skill-motion');
  const [licenseInput, setLicenseInput] = useState(initialLicense);

  useEffect(() => {
    if (initialLicense) {
      setLicenseInput(initialLicense);
    }
  }, [initialLicense]);

  // Interactive Prompt Generator State (for all 29 3D styles)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedKitId, setSelectedKitId] = useState<string>('cyberforge');
  const [customTopic, setCustomTopic] = useState<string>(
    'Cara kerja reaktor AI kuantum masa depan dengan hologram 3D dan cincin telemetri berputar'
  );
  const [selectedDurationId, setSelectedDurationId] = useState<string>('9:16-30s');
  const [includeVoiceover, setIncludeVoiceover] = useState<boolean>(true);
  const [includeCaptions, setIncludeCaptions] = useState<boolean>(true);

  // Interactive checklist state persisted in localStorage
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    node: false,
    claude_cli: false,
    extract: false,
    skill_copy: false,
    mcp: false,
    render: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('audira_setup_checklist_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCheckedItems((prev) => ({ ...prev, ...parsed }));
        }
      }
      const savedOs = localStorage.getItem('audira_setup_os') as OSType | null;
      if (savedOs === 'windows' || savedOs === 'mac') {
        setSelectedOS(savedOs);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('audira_setup_checklist_v3', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSelectOS = (os: OSType) => {
    setSelectedOS(os);
    try {
      localStorage.setItem('audira_setup_os', os);
    } catch {
      // ignore
    }
  };

  const totalChecklist = CHECKLIST_STEPS.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalChecklist) * 100);

  const activeFolderPath = selectedOS === 'windows' ? customPathWin.trim() || 'C:/audira-skill-motion' : customPathMac.trim() || '~/audira-skill-motion';
  const normalizedMcpPath = activeFolderPath.replace(/\\/g, '/').replace(/\/+$/, '');

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredKits = useMemo(() => {
    if (selectedCategory === 'all') return ALL_20_KITS;
    return ALL_20_KITS.filter((k) => k.group === selectedCategory);
  }, [selectedCategory]);

  const activeKit = useMemo(() => {
    return ALL_20_KITS.find((k) => k.id === selectedKitId) || ALL_20_KITS[0];
  }, [selectedKitId]);

  const activeDurationObj = useMemo(() => {
    return PROMPT_DURATION_OPTIONS.find((d) => d.id === selectedDurationId) || PROMPT_DURATION_OPTIONS[0];
  }, [selectedDurationId]);

  const generatedClaudePrompt = useMemo(() => {
    const extras: string[] = [];
    if (includeVoiceover) extras.push('narasi voiceover Bahasa Indonesia yang jernih');
    if (includeCaptions) extras.push('subtitle kinetik per kata (auto-synced)');
    const extraText = extras.length > 0 ? ` Lengkap dengan ${extras.join(' serta ')}.` : '';
    return `/audira-motion Gunakan kit 3D [${activeKit.name}] (${activeKit.character}) untuk membuat video format ${activeDurationObj.ratio} berdurasi ${activeDurationObj.duration}. Topik utama: "${customTopic}".${extraText} Setelah scene selesai dirakit, jalankan smoke test visual dan siapkan perintah render MP4 60 FPS.`;
  }, [activeKit, activeDurationObj, customTopic, includeVoiceover, includeCaptions]);

  const CLAUDE_MCP_CONFIG = `{
  "mcpServers": {
    "audira": {
      "command": "node",
      "args": [
        "${normalizedMcpPath}/mcp-server/src/index.js"
      ],
      "env": {
        "AUDIRA_LICENSE_KEY": "${licenseInput.trim() || initialLicense}"
      }
    }
  }
}`;

  const CLAUDE_MCP_CLI_CMD = `claude mcp add audira -e AUDIRA_LICENSE_KEY=${licenseInput.trim() || initialLicense} -- node "${normalizedMcpPath}/mcp-server/src/index.js"`;

  const AUTO_INSTALLER_SCRIPT = selectedOS === 'windows'
    ? `# ==========================================================
# AUDIRA SKILL MOTION 3D - SCRIPT AUTO-INSTALLER (WINDOWS)
# PEMILIK LISENSI: ${user.name} (${user.email})
# KODE LISENSI: ${licenseInput.trim() || initialLicense}
# ==========================================================
Write-Host "1. Memeriksa Node.js & FFmpeg..." -ForegroundColor Cyan
node -v
ffmpeg -version

Write-Host "2. Memasang Claude Code CLI secara global..." -ForegroundColor Cyan
npm install -g @anthropic-ai/claude-code

Write-Host "3. Membuat folder Skill Global di ~/.claude/skills/audira-motion..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills\\audira-motion" | Out-Null
Copy-Item -Path "${activeFolderPath.replace(/\//g, '\\')}\\*" -Destination "$HOME\\.claude\\skills\\audira-motion\\" -Recurse -Force

Write-Host "4. Menginstal dependensi Remotion 4.0 & Three.js..." -ForegroundColor Cyan
Set-Location "${activeFolderPath.replace(/\//g, '\\')}"
npm install

Write-Host "5. Mendaftarkan MCP Server AUDIRA ke Claude Code..." -ForegroundColor Cyan
${CLAUDE_MCP_CLI_CMD}

Write-Host "SELESAI! Ketik 'claude' lalu jalankan '/audira-motion halo' untuk mulai!" -ForegroundColor Green`
    : `#!/usr/bin/env bash
# ==========================================================
# AUDIRA SKILL MOTION 3D - SCRIPT AUTO-INSTALLER (macOS/Linux)
# PEMILIK LISENSI: ${user.name} (${user.email})
# KODE LISENSI: ${licenseInput.trim() || initialLicense}
# ==========================================================
set -e
echo "1. Memeriksa Node.js & FFmpeg..."
node -v
ffmpeg -version

echo "2. Memasang Claude Code CLI secara global..."
npm install -g @anthropic-ai/claude-code

echo "3. Membuat folder Skill Global di ~/.claude/skills/audira-motion..."
mkdir -p ~/.claude/skills/audira-motion
cp -r ${activeFolderPath}/* ~/.claude/skills/audira-motion/

echo "4. Menginstal dependensi Remotion 4.0 & Three.js..."
cd ${activeFolderPath}
npm install

echo "5. Mendaftarkan MCP Server AUDIRA ke Claude Code..."
${CLAUDE_MCP_CLI_CMD}

echo "SELESAI! Ketik 'claude' lalu jalankan '/audira-motion halo' untuk mulai!"`;

  const handleDownloadInstallerScript = () => {
    const filename = selectedOS === 'windows' ? 'install-audira-motion.ps1' : 'install-audira-motion.sh';
    const blob = new Blob([AUTO_INSTALLER_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadOfflineArtifact = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Artifact Panduan Instalasi Mandiri - AUDIRA Skill Motion 3D</title>
  <style>
    :root { --bg: #0f0f0e; --card: #181816; --tile: #20201d; --accent: #ff6a2a; --text: #f4f3f0; --muted: #a3a19a; --line: #2d2d28; --green: #10b981; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding: 24px; }
    .container { max-width: 960px; margin: 0 auto; }
    .badge { display: inline-block; background: rgba(255,106,42,0.15); color: var(--accent); border: 1px solid rgba(255,106,42,0.4); padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; font-family: monospace; }
    h1 { font-size: 28px; margin: 12px 0 8px; }
    h2 { font-size: 20px; color: var(--accent); margin-top: 0; }
    .card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    pre { background: #090908; border: 1px solid var(--line); padding: 14px; border-radius: 12px; overflow-x: auto; color: var(--green); font-size: 13px; }
    code { font-family: ui-monospace, monospace; }
    .kit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; margin-top: 12px; }
    .kit-item { background: var(--tile); border: 1px solid var(--line); border-radius: 10px; padding: 10px; font-size: 12px; }
    .kit-item strong { color: var(--accent); display: block; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">OFFLINE ARTIFACT GUIDE • KHUSUS PEMBELI RESMI AUDIRA</span>
    <h1>Panduan Instalasi Mandiri & Katalog 29 Gaya 3D</h1>
    <p style="color: var(--muted)">Pemilik Lisensi: <strong>${user.name}</strong> (${user.email}) | Kode Lisensi: <code>${licenseInput}</code></p>

    <div class="card">
      <h2>Langkah 1: Pasang Node.js LTS, FFmpeg & Claude Code CLI</h2>
      <p>Pastikan Node.js v20+ dari <a href="https://nodejs.org" style="color:var(--accent)">nodejs.org</a> sudah terpasang, lalu jalankan di terminal:</p>
      <pre># Windows (PowerShell Admin):
winget install ffmpeg
npm install -g @anthropic-ai/claude-code

# macOS (Terminal):
brew install ffmpeg
npm install -g @anthropic-ai/claude-code</pre>
    </div>

    <div class="card">
      <h2>Langkah 2: Pasang Folder Skill ke Claude (.claude/skills/)</h2>
      <pre># Windows (PowerShell):
mkdir -p $HOME\\.claude\\skills\\audira-motion
Copy-Item -Path "${activeFolderPath.replace(/\//g, '\\')}\\*" -Destination "$HOME\\.claude\\skills\\audira-motion\\" -Recurse -Force

# macOS / Linux:
mkdir -p ~/.claude/skills/audira-motion
cp -r ${activeFolderPath}/* ~/.claude/skills/audira-motion/</pre>
    </div>

    <div class="card">
      <h2>Langkah 3: Hubungkan MCP Server AUDIRA (1 Baris Perintah)</h2>
      <pre>${CLAUDE_MCP_CLI_CMD}</pre>
      <p style="font-size:13px;color:var(--muted)">Atau salin JSON berikut ke <code>claude_desktop_config.json</code>:</p>
      <pre>${CLAUDE_MCP_CONFIG}</pre>
    </div>

    <div class="card">
      <h2>Langkah 4: Prompt Siap Pakai & Render Video MP4 60 FPS</h2>
      <pre>${generatedClaudePrompt}</pre>
      <pre># Preview Studio di Browser:
npm run remotion:dev

# Uji 1 Frame Cepat (Smoke Test):
npm run remotion:smoke

# Render Video MP4 Full HD 1080x1920 60 FPS:
npm run remotion:render</pre>
    </div>

    <div class="card">
      <h2>Katalog Lengkap 29 Gaya Visual 3D (Cheat Sheet Prompt)</h2>
      <div class="kit-grid">
        ${ALL_20_KITS.map((k) => `<div class="kit-item"><strong>${k.name}</strong><span>${k.character}</span></div>`).join('')}
      </div>
    </div>

    <div class="card">
      <h2>Bantuan Teknis 1-on-1 Tim AUDIRA</h2>
      <p>Jika ada kendala instalasi, hubungi WhatsApp Resmi Tim AUDIRA: <a href="https://wa.me/6282112001600" style="color:var(--green);font-weight:bold">+62 821-1200-1600</a></p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Panduan-Interaktif-AUDIRA-Motion-3D.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TROUBLESHOOTING_LIST = [
    {
      id: 'claude_cmd',
      title: 'Pesan Error: "claude is not recognized" saat mengetik claude di terminal',
      cause: 'Paket CLI resmi Claude Code dari Anthropic belum terinstal secara global di Node.js Anda.',
      solutionWin: 'Jalankan di PowerShell: npm install -g @anthropic-ai/claude-code lalu tutup dan buka kembali PowerShell, kemudian ketik: claude',
      solutionMac: 'Jalankan di Terminal: sudo npm install -g @anthropic-ai/claude-code lalu ketik: claude'
    },
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
      id: 'skill_not_found',
      title: 'Perintah "/audira-motion" tidak muncul saat mengetik /skills di Claude Code',
      cause: 'Letak file SKILL.md masih terbungkus di dalam sub-folder ganda (misal: .claude/skills/audira-motion/audira-skill-motion/SKILL.md).',
      solutionWin: 'Pastikan file SKILL.md berada tepat di C:\\Users\\<NamaUser>\\.claude\\skills\\audira-motion\\SKILL.md kemudian restart sesi Claude Code (/exit lalu ketik claude).',
      solutionMac: 'Pastikan file SKILL.md berada tepat di ~/.claude/skills/audira-motion/SKILL.md kemudian restart sesi Claude Code.'
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

  const shouldShowStep = (stepNumber: number) => {
    if (viewMode === 'full') return true;
    return activeWizardStep === stepNumber;
  };

  return (
    <div className="space-y-8 font-display">
      
      {/* Top Banner showing Customer Authentication Status */}
      <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-card to-card p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              AKSES TERVERIFIKASI RESMI
            </span>
            <span className="text-xs font-mono text-dim">
              Pemilik Lisensi: <strong className="text-paper">{user.name}</strong> ({user.email})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-paper tracking-tight">
            Buku Panduan Instalasi Mandiri &amp; Prompt Studio 29 Gaya 3D
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Materi ini dikunci khusus untuk pembeli resmi. Ikuti 5 langkah mandiri di bawah atau unduh script auto-installer untuk merender video 3D pertama Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadOfflineArtifact}
            className="btn-outline py-2 px-3 text-xs font-semibold inline-flex items-center gap-1.5"
            title="Simpan panduan ini sebagai file HTML mandiri"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>Unduh HTML Offline</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadInstallerScript}
            className="btn-primary py-2 px-3 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            title="Unduh script untuk auto-setup di terminal"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-Installer ({selectedOS === 'windows' ? '.PS1' : '.SH'})</span>
          </button>
        </div>
      </div>

      {/* Visual 3-Minute Quick Flow Blueprint */}
      <div className="rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/10 via-tile to-card p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-accent text-ink font-mono text-xs font-black">
              ✦
            </span>
            <h3 className="font-bold text-sm sm:text-base text-paper">
              Ringkasan Alur Cepat Instalasi (Hanya Butuh ~3-5 Menit)
            </h3>
          </div>
          <span className="text-xs font-mono text-accent font-semibold">
            Mudah • Pemula Friendly • Tanpa Coding Rumit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-ink border border-line space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent font-bold">LANGKAH 01</span>
              <span className="text-[10px] text-dim font-mono">~2 Menit</span>
            </div>
            <h4 className="font-bold text-paper text-xs">Pasang Prasyarat</h4>
            <p className="text-[11px] text-muted">
              Instal Node.js LTS, FFmpeg, dan Claude Code CLI di komputer.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ink border border-line space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent font-bold">LANGKAH 02</span>
              <span className="text-[10px] text-dim font-mono">~1 Menit</span>
            </div>
            <h4 className="font-bold text-paper text-xs">Pasang Folder Skill</h4>
            <p className="text-[11px] text-muted">
              Salin isi paket ZIP ke folder <code className="text-accent font-mono">~/.claude/skills/audira-motion/</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ink border border-cyan-500/40 bg-cyan-950/15 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-cyan-400 font-bold">LANGKAH 03</span>
              <span className="text-[10px] text-dim font-mono">~30 Detik</span>
            </div>
            <h4 className="font-bold text-paper text-xs">Hubungkan MCP Server</h4>
            <p className="text-[11px] text-muted">
              Jalankan 1 baris perintah <code className="text-cyan-300 font-mono">claude mcp add</code> untuk koneksi otak sutradara.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ink border border-emerald-500/40 bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald-400 font-bold">LANGKAH 04</span>
              <span className="text-[10px] text-emerald-400 font-mono">Selesai!</span>
            </div>
            <h4 className="font-bold text-paper text-xs">Sutradarai &amp; Render</h4>
            <p className="text-[11px] text-emerald-200/80">
              Ketik <code className="text-emerald-300 font-mono">/audira-motion</code> lalu tonton preview atau render MP4 1080p.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Control Bar: OS Selector + Custom Path Configurator + View Mode */}
      <div className="rounded-3xl border-2 border-line bg-card p-5 sm:p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-accent flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              KONFIGURATOR PERINTAH OTOMATIS (CUSTOM PATH &amp; OS):
            </span>
            <p className="text-xs sm:text-sm text-muted">
              Pilih sistem operasi komputer Anda. Seluruh perintah copy terminal dan blok JSON di bawah ini akan otomatis menyesuaikan!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* OS Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-ink border border-line">
              <button
                type="button"
                onClick={() => handleSelectOS('windows')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedOS === 'windows'
                    ? 'bg-accent text-ink shadow-md'
                    : 'text-muted hover:text-paper'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows (PowerShell)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectOS('mac')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedOS === 'mac'
                    ? 'bg-accent text-ink shadow-md'
                    : 'text-muted hover:text-paper'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>macOS / Linux</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-ink border border-line">
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'full'
                    ? 'bg-paper text-ink shadow-md'
                    : 'text-muted hover:text-paper'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Semua Langkah</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('wizard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'wizard'
                    ? 'bg-paper text-ink shadow-md'
                    : 'text-muted hover:text-paper'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Mode Wizard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Inputs: Path & License Key */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase font-bold text-dim flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-accent" />
              <span>Lokasi Folder Paket yang Anda Ekstrak di Laptop Anda:</span>
            </label>
            {selectedOS === 'windows' ? (
              <input
                type="text"
                value={customPathWin}
                onChange={(e) => setCustomPathWin(e.target.value)}
                placeholder="Contoh: C:/audira-skill-motion"
                className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 font-mono text-xs text-emerald-400 focus:border-accent focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={customPathMac}
                onChange={(e) => setCustomPathMac(e.target.value)}
                placeholder="Contoh: ~/audira-skill-motion"
                className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 font-mono text-xs text-emerald-400 focus:border-accent focus:outline-none"
              />
            )}
            <p className="text-[11px] text-dim">
              *Ketik lokasi folder tempat Anda mengekstrak file ZIP agar seluruh perintah copy dan JSON MCP otomatis pas.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase font-bold text-dim flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kode Lisensi Resmi Anda:</span>
            </label>
            <input
              type="text"
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value)}
              placeholder="Contoh: AUD-LAB-2026-9A82F1"
              className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 font-mono text-xs text-cyan-300 focus:border-accent focus:outline-none"
            />
            <p className="text-[11px] text-dim">
              *Tersambung otomatis dengan lisensi akun Anda ({user.name}).
            </p>
          </div>
        </div>
      </div>

      {/* Wizard Stepper Progress Pill Bar (Only visible in Wizard Mode) */}
      {viewMode === 'wizard' && (
        <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-paper">
            <Wand2 className="w-4 h-4 text-accent" />
            <span>
              {activeWizardStep === 0 
                ? 'MODE WIZARD AKTIF: Menonton Video Tutorial Resmi (EP 01 - 03)' 
                : `MODE WIZARD AKTIF: Fokus menyelesaikan Langkah 0${activeWizardStep} dari 05`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { num: 0, label: '🎬 Video' },
              { num: 1, label: '01' },
              { num: 2, label: '02' },
              { num: 3, label: '03' },
              { num: 4, label: '04' },
              { num: 5, label: '05' },
            ].map((step) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveWizardStep(step.num)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeWizardStep === step.num
                    ? 'bg-accent text-ink shadow'
                    : 'bg-ink text-muted hover:text-paper border border-line'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
                { num: 0, href: '#video-tutorial', step: '🎬', title: 'Video Panduan (EP 01 - 03)' },
                { num: 1, href: '#langkah-1', step: '01', title: 'Prasyarat & Claude Code CLI' },
                { num: 2, href: '#langkah-2', step: '02', title: 'Pasang Skill ke .claude/skills/' },
                { num: 3, href: '#langkah-3', step: '03', title: 'Aktivasi Otak AI (MCP Mesh)' },
                { num: 4, href: '#langkah-4', step: '04', title: 'Generator Prompt 29 Gaya & Render' },
                { num: 5, href: '#langkah-5', step: '05', title: 'Diagnosa Kendala (Troubleshooting)' },
              ].map((item) => {
                const isActive = viewMode === 'wizard' && activeWizardStep === item.num;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      if (viewMode === 'wizard') {
                        e.preventDefault();
                        setActiveWizardStep(item.num);
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${
                      isActive
                        ? 'border-accent bg-accent/15 text-paper'
                        : 'border-transparent hover:border-line hover:bg-tile text-muted hover:text-paper'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-accent group-hover:text-orange-400">
                        {item.step}
                      </span>
                      <span className="font-semibold">{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-dim group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
                  </a>
                );
              })}
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
                {completedCount}/{totalChecklist} ({progressPercent}%)
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
              {CHECKLIST_STEPS.map((chk) => (
                <label 
                  key={chk.id} 
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-tile cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[chk.id]}
                    onChange={() => toggleCheck(chk.id)}
                    className="mt-0.5 size-4 rounded border-line bg-ink text-accent focus:ring-accent accent-[#ff6a2a]"
                  />
                  <span className={checkedItems[chk.id] ? 'line-through text-dim font-medium leading-snug' : 'text-paper font-medium leading-snug'}>
                    {chk.label}
                  </span>
                </label>
              ))}
            </div>

            {progressPercent === 100 && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold text-center">
                🎉 Selamat! Komputer Anda sudah 100% siap menyutradarai video 3D!
              </div>
            )}
          </div>

          {/* Direct 1-on-1 Support Card */}
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-tile to-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>GARANSI SETUP 1-ON-1 SAMPAI JADI</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Sebagai pemilik lisensi resmi, Anda berhak meminta pendampingan langsung dari Tim AUDIRA via WhatsApp atau remote desktop jika ada kendala instalasi.
            </p>
            <div className="text-[11px] font-mono text-emerald-300 bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              WA Resmi: <strong>+62 821-1200-1600</strong>
            </div>
            <a
              href={`https://wa.me/6282112001600?text=${encodeURIComponent(`Halo Tim AUDIRA, saya pembeli lisensi ${licenseInput} (${user.name}) dan membutuhkan pendampingan instalasi mandiri.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Chat WhatsApp (+62 821-1200-1600) ➔</span>
            </a>
          </div>

        </aside>

        {/* RIGHT COLUMN: Continuous Step-by-Step Content (8 Cols) */}
        <main className="lg:col-span-8 space-y-12">

          {/* SECTION VIDEO WALKTHROUGH RESMI (EPISODE 01, 02, 03) */}
          {(viewMode === 'full' || activeWizardStep === 0) && (
            <section id="video-tutorial" className="scroll-mt-24">
              <VideoTutorialPlayer 
                initialEpisodeId={activeVideoEpisode}
                onEpisodeChange={(ep) => setActiveVideoEpisode(ep)}
              />
            </section>
          )}

          {/* LANGKAH 01: PRASYARAT PC, FFMPEG & CLAUDE CODE CLI */}
          {shouldShowStep(1) && (
            <section id="langkah-1" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                    01
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                    LANGKAH 01 DARI 05 • PERSIAPAN PERANGKAT LUNAK DASAR
                  </span>
                </div>
                <span className="font-mono text-[11px] text-dim">Estimasi: 2 Menit</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Instalasi Node.js LTS, FFmpeg &amp; Claude Code CLI
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Sebelum memasang skill 3D, pastikan 3 komponen dasar gratis ini sudah aktif di komputer Anda. Ketiganya hanya perlu dipasang satu kali.
                </p>
              </div>

              {/* In-Context Video Callout */}
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-accent" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-accent uppercase font-bold block">Video Terkait Langkah Ini</span>
                    <span className="text-xs font-bold text-paper">Episode 01: Pasang Skill audira-motion ke Claude (98 Detik)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToVideo('01')}
                  className="btn-outline py-1.5 px-3 text-xs font-bold inline-flex items-center gap-1.5 shrink-0 hover:bg-accent hover:text-black"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tonton Video EP 01 ➔</span>
                </button>
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
                <h3 className="font-bold text-base text-paper">Pasang Node.js v20.x atau v22.x LTS</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Mesin runtime JavaScript untuk menjalankan compiler Remotion 4.0, Three.js, dan server lokal di laptop Anda.
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

              {/* Requirement 2: FFmpeg & Claude Code CLI */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase">SOFTWARE 2 &amp; 3</span>
                    <span className="text-dim">•</span>
                    <span className="text-xs font-bold text-paper">FFmpeg &amp; Claude Code CLI Resmi</span>
                  </div>
                  <span className="rounded bg-cyan-400/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">Salin &amp; Jalankan</span>
                </div>
                <h3 className="font-bold text-base text-paper">Instal FFmpeg &amp; Claude Code lewat Terminal</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Buka <strong>{selectedOS === 'windows' ? 'PowerShell (Run as Administrator)' : 'Terminal macOS / Linux'}</strong>, lalu jalankan perintah berikut:
                </p>

                {/* Terminal Box */}
                <div className="rounded-xl border border-line bg-ink overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-line bg-tile-2 text-xs text-dim font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="size-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="size-2.5 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-2 text-paper text-[11px]">
                        {selectedOS === 'windows' ? 'PowerShell (Administrator)' : 'Terminal (bash/zsh)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        selectedOS === 'windows'
                          ? 'winget install ffmpeg\nnpm install -g @anthropic-ai/claude-code'
                          : 'brew install ffmpeg\nnpm install -g @anthropic-ai/claude-code',
                        'step1_cmd'
                      )}
                      className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-bold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'step1_cmd' ? 'Tersalin!' : 'Salin Perintah'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{selectedOS === 'windows' ? `# 1. Pasang FFmpeg di Windows:
winget install ffmpeg

# 2. Pasang Claude Code CLI resmi dari Anthropic:
npm install -g @anthropic-ai/claude-code

# 3. Cek versi untuk memastikan semua aktif:
node -v && ffmpeg -version && claude --version` : `# 1. Pasang FFmpeg via Homebrew:
brew install ffmpeg

# 2. Pasang Claude Code CLI resmi dari Anthropic:
npm install -g @anthropic-ai/claude-code

# 3. Cek versi untuk memastikan semua aktif:
node -v && ffmpeg -version && claude --version`}
                  </pre>
                </div>
                <p className="text-[11px] text-dim">
                  *Setelah instalasi selesai, tutup dan buka kembali terminal Anda, lalu ketik <code>claude</code> untuk login ke akun Claude Anda.
                </p>

                {/* Expected Output Verification Box */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ciri-ciri Instalasi Berhasil (Uji di Terminal):</span>
                  </div>
                  <div className="font-mono text-xs text-muted space-y-1 bg-ink p-3 rounded-lg border border-line">
                    <p><span className="text-paper">&gt; node -v</span> ➔ <span className="text-emerald-400">v20.x.x atau v22.x.x</span> <span className="text-dim">(Muncul versi Node)</span></p>
                    <p><span className="text-paper">&gt; ffmpeg -version</span> ➔ <span className="text-emerald-400">ffmpeg version 7.x...</span> <span className="text-dim">(Muncul info FFmpeg)</span></p>
                    <p><span className="text-paper">&gt; claude --version</span> ➔ <span className="text-emerald-400">claude 0.x.x</span> <span className="text-dim">(Claude Code CLI siap)</span></p>
                  </div>
                </div>
              </div>

              {/* Wizard Footer Navigation */}
              {viewMode === 'wizard' && (
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <span className="text-xs text-dim">Langkah 1 dari 5</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckedItems((p) => ({ ...p, node: true, claude_cli: true }));
                      setActiveWizardStep(2);
                    }}
                    className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <span>Tandai Selesai &amp; Lanjut ke Langkah 02</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>
          )}


          {/* LANGKAH 02: MEMASANG SKILL KE CLAUDE */}
          {shouldShowStep(2) && (
            <section id="langkah-2" className="scroll-mt-24 space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                    02
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                    LANGKAH 02 DARI 05 • INTI INSTALASI SKILL CLAUDE
                  </span>
                </div>
                <span className="font-mono text-[11px] text-dim">Estimasi: 1 Menit</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Ekstrak Paket &amp; Pasang Skill ke Claude (<code>.claude/skills/</code>)
                </h2>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">
                  Agar Claude mengenali perintah <strong><code>/audira-motion</code></strong> beserta 29 gaya visual 3D, salin file <strong><code>SKILL.md</code></strong> dan folder <strong><code>kits/</code></strong> ke direktori skill Claude Anda.
                </p>
              </div>

              {/* In-Context Video Callout */}
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-accent" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-accent uppercase font-bold block">Video Terkait Langkah Ini</span>
                    <span className="text-xs font-bold text-paper">Episode 01: Ekstrak ZIP &amp; Pasang SKILL.md ke ~/.claude/skills/ (Detik 00:46)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToVideo('01')}
                  className="btn-outline py-1.5 px-3 text-xs font-bold inline-flex items-center gap-1.5 shrink-0 hover:bg-accent hover:text-black"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tonton Video EP 01 ➔</span>
                </button>
              </div>

              {/* Directory Tree Card */}
              <div className="rounded-2xl border border-line bg-ink overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-tile-2 text-xs font-mono text-paper">
                  <span className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-accent" />
                    <span>{normalizedMcpPath}/ (Isi Paket ZIP yang Anda Dapatkan)</span>
                  </span>
                  <span className="text-dim text-[11px]">29 Kit Gaya 3D</span>
                </div>
                <pre className="p-4 sm:p-5 font-mono text-xs text-muted leading-relaxed overflow-x-auto">
{`${normalizedMcpPath}/
├── SKILL.md               # 🌟 FILE UTAMA: Doktrin sutradara otonom & instruksi Claude
├── kits/                  # 29 Kit Gaya 3D (Buildforge, Precision, Cyberforge, dll.)
├── mcp-server/            # Server MCP lokal (audira_auto_orchestrate & voiceover)
├── starter/               # Template proyek Remotion 4.0 siap pakai
│   ├── src/               # Source code React Three Fiber, Shaders & Camera rigs
│   ├── remotion.config.ts # Konfigurasi resolusi 1080x1920 60 FPS
│   └── package.json       # Dependensi Remotion 4.0 & Three.js
├── setup.bat              # Script instalasi otomatis 1-klik untuk Windows
├── audira-brand.json      # Konfigurasi logo watermark & palet warna brand Anda
└── PANDUAN_INSTALASI.md   # Buku manual instalasi lengkap offline`}
                </pre>
              </div>

              {/* Shortcut Cepat Buka Folder Skill */}
              <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <FolderTree className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>CARA PALING MUDAH BUKA FOLDER SKILL (TANPA PERLU HAFAL TERMINAL):</span>
                </div>
                <div className="text-xs text-muted leading-relaxed space-y-1.5">
                  {selectedOS === 'windows' ? (
                    <>
                      <p>1. Tekan tombol <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-cyan-300 font-bold">Win + R</kbd> di keyboard Anda.</p>
                      <p>2. Salin dan tempel: <code className="text-cyan-300 font-mono font-bold bg-black/60 px-2 py-0.5 rounded select-all">%USERPROFILE%\.claude\skills</code> lalu klik <strong>OK</strong>.</p>
                      <p>3. Buat folder baru bernama <code className="text-emerald-400 font-mono font-bold">audira-motion</code>, lalu seret/ekstrak seluruh isi file ZIP ke dalam folder tersebut.</p>
                    </>
                  ) : (
                    <>
                      <p>1. Buka Finder, tekan <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-cyan-300 font-bold">Cmd + Shift + G</kbd>.</p>
                      <p>2. Ketik <code className="text-cyan-300 font-mono font-bold bg-black/60 px-2 py-0.5 rounded">~/.claude/skills</code> lalu tekan Enter.</p>
                      <p>3. Buat folder <code className="text-emerald-400 font-mono font-bold">audira-motion</code> lalu letakkan seluruh isi ZIP di dalamnya.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Peringatan Anti-Gagal (Dobel Folder) */}
              <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-950/20 p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>JEBAKAN PALING SERING: JANGAN SAMPAI FOLDER DOBEL (Video EP 01 - Detik 00:49)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1">
                    <span className="font-mono text-red-400 font-bold flex items-center gap-1">
                      ❌ CONTOH SALAH (Folder Terbungkus 2 Kali):
                    </span>
                    <p className="font-mono text-[11px] text-red-200/90 break-all">
                      .../.claude/skills/audira-motion/<strong className="text-red-400 underline">audira-motion</strong>/SKILL.md
                    </p>
                    <p className="text-[11px] text-dim">
                      *Jika terbungkus folder ganda seperti ini, Claude tidak akan mengenali perintah /audira-motion!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      ✅ CONTOH BENAR (Langsung di Folder Utama):
                    </span>
                    <p className="font-mono text-[11px] text-emerald-200 break-all">
                      .../.claude/skills/audira-motion/<strong className="text-emerald-400 underline">SKILL.md</strong>
                    </p>
                    <p className="text-[11px] text-emerald-300/80">
                      *File SKILL.md dan folder kits/ harus langsung berada di dalam folder audira-motion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Method 1: Terminal Copy */}
              <div className="rounded-2xl border-2 border-accent/40 bg-tile p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent text-ink font-mono text-[10px] font-black uppercase">
                      METODE A (OTOMATIS VIA TERMINAL)
                    </span>
                    <h4 className="font-bold text-base text-paper">
                      Salin Skill &amp; Instal Dependensi Proyek
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-accent font-bold">1 Kali Setup • Aktif di Mana Saja</span>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  Perintah di bawah ini sudah disesuaikan dengan folder Anda (<code>{activeFolderPath}</code>). Salin dan jalankan di terminal:
                </p>

                {/* OS Terminal Box */}
                <div className="rounded-xl border border-line bg-ink overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-line bg-tile-2 text-xs text-dim font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="size-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="size-2.5 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-2 text-paper text-[11px]">
                        {selectedOS === 'windows' ? 'PowerShell (Salin ke Claude Skills & npm install)' : 'Terminal macOS / Linux (Salin ke Claude Skills & npm install)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        selectedOS === 'windows'
                          ? `New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills\\audira-motion"\nCopy-Item -Path "${activeFolderPath.replace(/\//g, '\\')}\\*" -Destination "$HOME\\.claude\\skills\\audira-motion\\" -Recurse -Force\ncd "${activeFolderPath.replace(/\//g, '\\')}"\nnpm install`
                          : `mkdir -p ~/.claude/skills/audira-motion\ncp -r ${activeFolderPath}/* ~/.claude/skills/audira-motion/\ncd ${activeFolderPath}\nnpm install`,
                        'copy_skill_dir'
                      )}
                      className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-bold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'copy_skill_dir' ? 'Tersalin!' : 'Salin Perintah'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{selectedOS === 'windows' ? `# 1. Buat folder skill global & salin seluruh kit 3D:
New-Item -ItemType Directory -Force -Path "$HOME\\.claude\\skills\\audira-motion"
Copy-Item -Path "${activeFolderPath.replace(/\//g, '\\')}\\*" -Destination "$HOME\\.claude\\skills\\audira-motion\\" -Recurse -Force

# 2. Masuk ke folder proyek & instal modul Remotion 4.0 + Three.js:
cd "${activeFolderPath.replace(/\//g, '\\')}"
npm install` : `# 1. Buat folder skill global & salin seluruh kit 3D:
mkdir -p ~/.claude/skills/audira-motion
cp -r ${activeFolderPath}/* ~/.claude/skills/audira-motion/

# 2. Masuk ke folder proyek & instal modul Remotion 4.0 + Three.js:
cd ${activeFolderPath}
npm install`}
                  </pre>
                </div>

                {/* Verification Check */}
                <div className="p-3.5 rounded-xl bg-ink/70 border border-line text-xs space-y-1">
                  <span className="font-mono text-[11px] font-bold text-accent uppercase block">
                    Pastikan Letak File SKILL.md Berada Tepat di:
                  </span>
                  <p className="font-mono text-paper text-[11px] break-all">
                    {selectedOS === 'windows'
                      ? 'C:\\Users\\<NamaUser>\\.claude\\skills\\audira-motion\\SKILL.md'
                      : '~/.claude/skills/audira-motion/SKILL.md'}
                  </p>
                </div>
              </div>

              {/* Verification & Smoke Test Step */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-tile to-ink p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CARA TES APAKAH SKILL SUDAH TERBACA OLEH CLAUDE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-ink border border-line space-y-1">
                    <span className="font-mono text-[11px] text-emerald-400 font-bold block">1. Cek Daftar Skill:</span>
                    <p className="text-muted text-[11px]">Buka terminal di folder proyek, ketik <code>claude</code> lalu ketik:</p>
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

              {/* Wizard Footer Navigation */}
              {viewMode === 'wizard' && (
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveWizardStep(1)}
                    className="btn-outline py-2 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Langkah 01</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckedItems((p) => ({ ...p, extract: true, skill_copy: true }));
                      setActiveWizardStep(3);
                    }}
                    className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <span>Tandai Selesai &amp; Lanjut ke Langkah 03</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>
          )}


          {/* LANGKAH 03: AKTIVASI MCP SKILL MESH */}
          {shouldShowStep(3) && (
            <section id="langkah-3" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                    03
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                    LANGKAH 03 DARI 05 • KONEKSI OTAK SUTRADARA (MCP)
                  </span>
                </div>
                <span className="font-mono text-[11px] text-dim">Estimasi: 1 Menit</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Aktivasi AUDIRA Skill Mesh (MCP Server)
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  <strong>Model Context Protocol (MCP)</strong> menghubungkan Claude langsung ke mesin orkestrasi video AUDIRA, generator voiceover Cartesia, dan validator subtitle kinetik.
                </p>
              </div>

              {/* In-Context Video Callout */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-cyan-400" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold block">Video Terkait Langkah Ini</span>
                    <span className="text-xs font-bold text-paper">Episode 02: Sambungkan audira-skill-mesh (MCP) ke Claude (90 Detik)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToVideo('02')}
                  className="btn-outline py-1.5 px-3 text-xs font-bold inline-flex items-center gap-1.5 shrink-0 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500 hover:text-black"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tonton Video EP 02 ➔</span>
                </button>
              </div>

              {/* 1-Line CLI Registration (EASIEST WAY!) */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/15 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    CARA PALING CEPAT (1 BARIS PERINTAH DI TERMINAL)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(CLAUDE_MCP_CLI_CMD, 'mcp_cli_one_line')}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-accent hover:underline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'mcp_cli_one_line' ? 'Tersalin!' : 'Salin Perintah'}</span>
                  </button>
                </div>
                <p className="text-xs text-muted">
                  Cukup jalankan 1 baris perintah ini di terminal untuk mendaftarkan server MCP AUDIRA beserta kode lisensi Anda:
                </p>
                <div className="rounded-xl border border-line bg-ink p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {CLAUDE_MCP_CLI_CMD}
                </div>
              </div>

              {/* Manual JSON Config Box */}
              <div className="rounded-2xl border border-line bg-tile p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-paper uppercase flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Alternatif Manual: File claude_desktop_config.json
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
                  Jika Anda menggunakan aplikasi Claude Desktop atau ingin mengatur file JSON secara manual di <code className="text-accent font-mono text-[11px] bg-black/40 px-1 rounded">
                    {selectedOS === 'windows' 
                      ? '%APPDATA%\\Claude\\claude_desktop_config.json' 
                      : '~/Library/Application Support/Claude/claude_desktop_config.json'}
                  </code>:
                </p>
                <div className="rounded-xl border border-line bg-ink overflow-hidden">
                  <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                    {CLAUDE_MCP_CONFIG}
                  </pre>
                </div>
              </div>

              {/* How to verify MCP Connection */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CARA MEMASTIKAN KONEKSI MCP BERHASIL (Video EP 02 - Detik 01:10):</span>
                </div>
                <p className="text-xs text-muted">
                  Buka terminal lalu ketik perintah berikut:
                </p>
                <div className="p-3 rounded-xl bg-ink border border-line font-mono text-xs text-paper space-y-1">
                  <p><span className="text-dim">&gt;</span> <span className="text-accent font-bold">claude mcp list</span></p>
                  <p className="text-emerald-400 pt-1">✔ audira-skill-mesh: Connected</p>
                  <p className="text-dim text-[11px] pt-1">
                    *Jika status bertuliskan <span className="text-emerald-400 font-bold">&quot;Connected&quot;</span>, berarti Claude sudah 100% siap memanggil 925+ fungsi sutradara otonom!
                  </p>
                </div>
              </div>

              {/* Cartesia Voiceover Note */}
              <div className="rounded-2xl border border-line bg-tile p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-paper">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Fitur Suara Narator Otomatis (Cartesia AI):</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Jika Anda ingin video Anda bersuara narator otomatis bahasa Indonesia, daftar akun gratis di <a href="https://cartesia.ai" target="_blank" rel="noopener noreferrer" className="text-accent underline font-mono">cartesia.ai</a>, ambil API Key gratisnya, lalu sertakan flag <code className="text-paper bg-ink px-1 rounded">-e CARTESIA_API_KEY=kunci_anda</code> pada perintah <code>claude mcp add</code>. Jika tanpa voiceover, animasi visual 3D tetap bisa dirender 100% lancar.
                </p>
              </div>

              {/* Wizard Footer Navigation */}
              {viewMode === 'wizard' && (
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveWizardStep(2)}
                    className="btn-outline py-2 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Langkah 02</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckedItems((p) => ({ ...p, mcp: true }));
                      setActiveWizardStep(4);
                    }}
                    className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <span>Tandai Selesai &amp; Buka Generator Prompt 29 Gaya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>
          )}


          {/* LANGKAH 04: INTERACTIVE PROMPT GENERATOR (29 GAYA 3D) & RENDER PERTAMA */}
          {shouldShowStep(4) && (
            <section id="langkah-4" className="scroll-mt-24 space-y-6 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                    04
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                    LANGKAH 04 DARI 05 • STUDIO GENERATOR PROMPT 29 GAYA 3D
                  </span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 font-bold">Siap Pakai!</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Generator Prompt Interaktif (29 Gaya 3D) &amp; Render MP4
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Pilih salah satu dari <strong>29 Gaya Visual 3D</strong> di bawah, masukkan ide topik Anda, lalu salin prompt sutradara yang dihasilkan secara otomatis!
                </p>
              </div>

              {/* In-Context Video Callout */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block">Video Terkait Langkah Ini</span>
                    <span className="text-xs font-bold text-paper">Episode 03: Pakai Keduanya Sampai Jadi AI Motion Remotion (91 Detik)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToVideo('03')}
                  className="btn-outline py-1.5 px-3 text-xs font-bold inline-flex items-center gap-1.5 shrink-0 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-black"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tonton Video EP 03 ➔</span>
                </button>
              </div>

              {/* INTERACTIVE PROMPT BUILDER ARTIFACT */}
              <div className="rounded-2xl border-2 border-accent/50 bg-tile p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-accent" />
                    <h3 className="font-bold text-base text-paper">
                      Interactive Prompt Builder • 29 Signature Styles
                    </h3>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all', label: 'Semua (29)' },
                      { id: 'arsitektur', label: 'Arsitektur & Mesin' },
                      { id: 'taktil', label: 'Taktil & Karakter' },
                      { id: 'sains', label: 'Sains & Produk' },
                      { id: 'kosmik', label: 'Kosmik & Sci-Fi' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-accent text-ink'
                            : 'bg-ink text-muted hover:text-paper border border-line'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step A: Pick 3D Style from Grid */}
                <div className="space-y-2">
                  <label className="font-mono text-[11px] uppercase font-bold text-dim block">
                    1. KLIK GAYA VISUAL 3D YANG INGIN ANDA GUNAKAN ({filteredKits.length} TERSEDIA):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto pr-1">
                    {filteredKits.map((kit) => {
                      const isSelected = kit.id === selectedKitId;
                      return (
                        <button
                          key={kit.id}
                          type="button"
                          onClick={() => {
                            setSelectedKitId(kit.id);
                            setCustomTopic(kit.promptExample.replace('/audira-motion ', ''));
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                            isSelected
                              ? 'border-accent bg-accent/15 shadow-md'
                              : 'border-line bg-ink hover:border-line-soft'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-mono text-[11px] font-black ${isSelected ? 'text-accent' : 'text-paper'}`}>
                              {kit.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                          </div>
                          <span className="text-[10px] text-muted line-clamp-2 leading-tight">
                            {kit.character}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step B: Topic & Format Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-7 space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-dim block">
                      2. TULIS IDE TOPIK / NASKAH VIDEO ANDA:
                    </label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className="w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-xs text-paper focus:border-accent focus:outline-none"
                      placeholder="Contoh: Rumah modern 2 lantai dirakit bertahap dari pondasi..."
                    />
                  </div>

                  <div className="md:col-span-5 space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-dim block">
                      3. PILIH RASIO &amp; DURASI VIDEO:
                    </label>
                    <select
                      value={selectedDurationId}
                      onChange={(e) => setSelectedDurationId(e.target.value)}
                      className="w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-xs text-paper focus:border-accent focus:outline-none"
                    >
                      {PROMPT_DURATION_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step C: Checkboxes for Voiceover & Captions */}
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVoiceover}
                      onChange={(e) => setIncludeVoiceover(e.target.checked)}
                      className="size-4 rounded border-line bg-ink accent-[#ff6a2a]"
                    />
                    <span className="text-paper font-medium">Sertakan Voiceover Bahasa Indonesia (Cartesia TTS)</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCaptions}
                      onChange={(e) => setIncludeCaptions(e.target.checked)}
                      className="size-4 rounded border-line bg-ink accent-[#ff6a2a]"
                    />
                    <span className="text-paper font-medium">Sertakan Subtitle Kinetik Otomatis</span>
                  </label>
                </div>

                {/* Generated Prompt Output Box */}
                <div className="rounded-xl border border-accent/40 bg-ink p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-accent uppercase">
                      PROMPT SIAP TEMPEL KE CLAUDE CODE / CURSOR:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(generatedClaudePrompt, 'generated_prompt')}
                      className="btn-primary py-1.5 px-3.5 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      {copiedKey === 'generated_prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'generated_prompt' ? 'Prompt Tersalin!' : 'Salin Prompt Ini'}</span>
                    </button>
                  </div>
                  <p className="font-mono text-xs text-emerald-400 leading-relaxed select-all">
                    {generatedClaudePrompt}
                  </p>
                </div>
              </div>

              {/* Realistic Chat Simulation with Claude Code */}
              <div className="rounded-2xl border-2 border-line bg-ink overflow-hidden space-y-0 shadow-lg">
                <div className="flex items-center justify-between px-4 py-2.5 bg-tile border-b border-line text-xs font-mono">
                  <span className="text-accent font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    SIMULASI EKSEKUSI DI CLAUDE CODE CLI (Video EP 03):
                  </span>
                  <span className="text-dim text-[10px]">Cukup Pakai Bahasa Sehari-hari</span>
                </div>

                <div className="p-4 sm:p-5 space-y-3 font-mono text-xs leading-relaxed">
                  {/* User Bubble */}
                  <div className="p-3.5 rounded-xl bg-tile border border-line space-y-1">
                    <span className="text-[10px] uppercase font-bold text-accent block">ANDA (PRODUSER):</span>
                    <p className="text-emerald-400">
                      /audira-motion Buatkan video 9:16 durasi 30 detik tentang teknologi AI masa depan dengan gaya Cyberforge 3D dan suara vokal narator Indonesia.
                    </p>
                  </div>

                  {/* Claude Code Response Bubble */}
                  <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/30 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-paper block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      CLAUDE CODE (SUTRADARA OTONOM):
                    </span>
                    <div className="text-paper/90 space-y-1">
                      <p>✔ 1. Memuat kit 3D Cyberforge &amp; rigging kamera Three.js (Rotasi Hologram 60 FPS)</p>
                      <p>✔ 2. Menulis naskah narasi &amp; memanggil suara Cartesia AI (Audio tersimpan di public/)</p>
                      <p>✔ 3. Menyusun subtitle kinetik per kata (Tersinkronisasi otomatis)</p>
                      <p>✔ 4. Menyiapkan proyek Remotion 4.0 komposisi 1080x1920 60 FPS</p>
                    </div>
                    <p className="text-muted text-[11px] pt-1.5 border-t border-line">
                      👉 Ketik <code className="text-accent font-bold">npm run remotion:dev</code> untuk tonton pratinjau di browser, atau ketik <code className="text-emerald-400 font-bold">npm run remotion:render</code> untuk mengekspor file MP4 final ke folder out/.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Render Commands: Studio, Smoke, Final */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">1. PREVIEW LIVE</span>
                  <h4 className="font-bold text-sm text-paper">Remotion Studio UI</h4>
                  <p className="text-xs text-muted">
                    Buka timeline interaktif di browser (<code>localhost:3000</code>):
                  </p>
                  <div className="bg-ink p-2.5 rounded-lg font-mono text-xs text-cyan-300 flex items-center justify-between">
                    <span>npm run remotion:dev</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('npm run remotion:dev', 'cmd_dev')}
                      className="text-[10px] text-accent hover:underline"
                    >
                      {copiedKey === 'cmd_dev' ? '✓' : 'Salin'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                  <span className="font-mono text-[10px] text-yellow-400 font-bold uppercase">2. UJI CEPAT 1 FRAME</span>
                  <h4 className="font-bold text-sm text-paper">Smoke Test Visual</h4>
                  <p className="text-xs text-muted">
                    Render 1 gambar still HD untuk cek lighting &amp; teks:
                  </p>
                  <div className="bg-ink p-2.5 rounded-lg font-mono text-xs text-yellow-300 flex items-center justify-between">
                    <span>npm run remotion:smoke</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('npm run remotion:smoke', 'cmd_smoke')}
                      className="text-[10px] text-accent hover:underline"
                    >
                      {copiedKey === 'cmd_smoke' ? '✓' : 'Salin'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-tile border border-line space-y-2">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">3. EKSPOR MP4 FINAL</span>
                  <h4 className="font-bold text-sm text-paper">MP4 1080p 60 FPS</h4>
                  <p className="text-xs text-muted">
                    Render video Full HD siap upload ke folder <code>out/</code>:
                  </p>
                  <div className="bg-ink p-2.5 rounded-lg font-mono text-xs text-emerald-300 flex items-center justify-between">
                    <span>npm run remotion:render</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('npm run remotion:render', 'cmd_render')}
                      className="text-[10px] text-accent hover:underline"
                    >
                      {copiedKey === 'cmd_render' ? '✓' : 'Salin'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wizard Footer Navigation */}
              {viewMode === 'wizard' && (
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveWizardStep(3)}
                    className="btn-outline py-2 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Langkah 03</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckedItems((p) => ({ ...p, render: true }));
                      setActiveWizardStep(5);
                    }}
                    className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <span>Tandai Selesai &amp; Lihat Troubleshooting</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>
          )}


          {/* LANGKAH 05: TROUBLESHOOTING & FAQ */}
          {shouldShowStep(5) && (
            <section id="langkah-5" className="scroll-mt-24 space-y-5 rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-ink font-mono text-xs font-black">
                    05
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                    LANGKAH 05 DARI 05 • DIAGNOSA MANDIRI
                  </span>
                </div>
                <span className="font-mono text-[11px] text-dim">6 Solusi Instan</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                  Solusi Kendala Teknis Populer (Troubleshooting)
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Jika Anda menemukan pesan error saat instalasi atau render, ketik kata kunci error di bawah untuk melihat solusinya sesuai sistem operasi Anda.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 size-4 text-dim" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari solusi kendala (misal: claude, ffmpeg, node, skill, webgl, audio)..."
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
                      <strong>Solusi ({selectedOS === 'windows' ? 'Windows' : 'macOS'}):</strong>{' '}
                      {selectedOS === 'windows' ? item.solutionWin : item.solutionMac}
                    </div>
                  </div>
                ))}

                {filteredTroubleshoot.length === 0 && (
                  <div className="p-6 text-center text-xs text-dim">
                    Tidak ditemukan kendala dengan kata kunci &quot;{searchQuery}&quot;. Hubungi Tim AUDIRA di WhatsApp jika ada pertanyaan lain.
                  </div>
                )}
              </div>

              {/* Still Need Help VIP Box */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-tile to-ink p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-paper">Masih Menemukan Error Lain?</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Jangan buang waktu berjam-jam debugging sendiri. Hubungi Tim AUDIRA langsung untuk pendampingan setup 1-on-1.
                  </p>
                </div>
                <a
                  href={`https://wa.me/6282112001600?text=${encodeURIComponent(`Halo Tim AUDIRA, saya butuh bantuan instalasi Audira Motion untuk lisensi ${licenseInput}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 btn-primary py-2.5 px-4 text-xs font-bold shadow-md"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  <span>Tanya AUDIRA di WhatsApp ➔</span>
                </a>
              </div>

              {/* Wizard Footer Navigation */}
              {viewMode === 'wizard' && (
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveWizardStep(4)}
                    className="btn-outline py-2 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Langkah 04</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('full')}
                    className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesai &amp; Tampilkan Semua Langkah</span>
                  </button>
                </div>
              )}
            </section>
          )}

        </main>
      </div>

    </div>
  );
};

