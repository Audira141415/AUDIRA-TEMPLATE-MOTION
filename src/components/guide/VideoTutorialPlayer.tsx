'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Clock, 
  ListOrdered, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Zap,
  Layers,
  Film,
  Smartphone,
  Tv
} from 'lucide-react';

export interface VideoTutorialEpisode {
  id: '01' | '02' | '03';
  episodeNum: string;
  title: string;
  subtitle: string;
  durationSec: number;
  durationLabel: string;
  videoUrl: string;
  badge: string;
  tools: string[];
  chapters: { timeSec: number; timeLabel: string; title: string; desc: string }[];
  keyTakeaways: string[];
  quickCommand?: string;
}

export const TUTORIAL_EPISODES: VideoTutorialEpisode[] = [
  {
    id: '01',
    episodeNum: '01',
    title: 'Pasang Skill audira-motion ke Claude Code',
    subtitle: 'Persiapan Node.js LTS, FFmpeg, Ekstraksi Folder Skill & Verifikasi Perintah /audira-motion',
    durationSec: 98,
    durationLabel: '01:38 Menit',
    videoUrl: '/api/videos/panduan/01',
    badge: 'LANGKAH DASAR WAJIB',
    tools: ['Claude Code CLI', 'Node.js v20/v22', 'FFmpeg', 'PowerShell / Terminal'],
    chapters: [
      { timeSec: 0, timeLabel: '00:00', title: 'Kenapa Butuh Skill audira-motion', desc: 'Beda Claude Code CLI vs web chat biasa (compile 3D & render lokal).' },
      { timeSec: 21, timeLabel: '00:21', title: 'Prasyarat Node.js & FFmpeg', desc: 'Instalasi winget install ffmpeg dan pengecekan node -v di terminal.' },
      { timeSec: 40, timeLabel: '00:40', title: 'Lokasi Ekstraksi Folder Skill', desc: 'Folder tujuan: ~/.claude/skills/audira-motion/ di direktori user.' },
      { timeSec: 49, timeLabel: '00:49', title: 'Jebakan Paling Sering (Letak SKILL.md)', desc: 'Pastikan file SKILL.md tidak terbungkus subfolder ganda.' },
      { timeSec: 62, timeLabel: '01:02', title: 'Verifikasi /audira-motion', desc: 'Tutup & buka Claude Code, ketik /audira-motion untuk memastikan aktif.' },
      { timeSec: 75, timeLabel: '01:15', title: 'Uji Render Pertama (Smoke Test)', desc: 'Unduh paket pendukung render (540MB) dan pastikan render berjalan.' },
    ],
    keyTakeaways: [
      'Gunakan Claude Code CLI (bukan web chat biasa)',
      'Pastikan SKILL.md berada tepat di ~/.claude/skills/audira-motion/SKILL.md',
      'Restart terminal atau ketik /exit lalu claude untuk memuat skill baru'
    ],
    quickCommand: 'mkdir -p ~/.claude/skills/audira-motion'
  },
  {
    id: '02',
    episodeNum: '02',
    title: 'Sambungkan audira-skill-mesh (MCP) ke Claude',
    subtitle: 'Koneksi MCP Server untuk Mengakses 925+ Skill AI & Suara Narator Cartesia',
    durationSec: 90,
    durationLabel: '01:30 Menit',
    videoUrl: '/api/videos/panduan/02',
    badge: 'INTERKONEKSI AI & MCP',
    tools: ['Claude MCP API', 'audira-skill-mesh', 'Git', 'Cartesia AI Voice'],
    chapters: [
      { timeSec: 0, timeLabel: '00:00', title: 'Konsep MCP Mesh', desc: 'Colokan standar agar memori Claude tidak penuh membaca 900+ skill.' },
      { timeSec: 19, timeLabel: '00:19', title: 'Clone Repo & npm install', desc: 'Clone folder mcp-server dan wajib jalankan npm install.' },
      { timeSec: 42, timeLabel: '00:42', title: 'Daftarkan MCP ke Claude', desc: 'Gunakan perintah claude mcp add dengan scope user.' },
      { timeSec: 55, timeLabel: '00:55', title: 'Pengaturan Kunci Suara Cartesia', desc: 'Taruh flag -e CARTESIA_API_KEY di posisi paling belakang perintah.' },
      { timeSec: 70, timeLabel: '01:10', title: 'Uji Status: audira_status', desc: 'Jalankan claude mcp list & minta audira_status untuk memastikan online.' },
    ],
    keyTakeaways: [
      'Jalankan npm install di folder mcp-server sebelum mendaftarkan ke Claude',
      'Gunakan scope user agar server MCP aktif di semua folder proyek Anda',
      'Cek status dengan claude mcp list (harus Connected)'
    ],
    quickCommand: 'claude mcp list'
  },
  {
    id: '03',
    episodeNum: '03',
    title: 'Pakai Keduanya Sampai Jadi Video AI Motion 3D',
    subtitle: 'Sutradarai Video 3D Pertama Anda dari Naskah, Audio Suara, sampai File MP4 Siap Posting',
    durationSec: 91,
    durationLabel: '01:31 Menit',
    videoUrl: '/api/videos/panduan/03',
    badge: 'PRODUKSI & RENDER FINAL',
    tools: ['audira-motion', 'Remotion 4.0', 'Three.js 60 FPS', 'HyperFrames'],
    chapters: [
      { timeSec: 0, timeLabel: '00:00', title: 'Tiga Peran Utama', desc: 'Claude Code (pekerja), audira-motion (sutradara), Mesh (alat), Anda (produser).' },
      { timeSec: 15, timeLabel: '00:15', title: 'Mulai dengan Bahasa Sehari-hari', desc: 'Ketik /audira-motion lalu ceritakan ide video tanpa perlu hafal kode.' },
      { timeSec: 30, timeLabel: '00:30', title: 'Generate Suara & Timestamp Kata', desc: 'Panggil audira_generate_voiceover untuk narasi tersinkronisasi otomatis.' },
      { timeSec: 46, timeLabel: '00:46', title: 'Review Preview Visual & Revisi', desc: 'Tonton pratinjau dan berikan feedback revisi dalam bahasa natural.' },
      { timeSec: 57, timeLabel: '00:57', title: 'Render Final MP4 1080p 60 FPS', desc: 'Render otomatis ke format 9:16 tersimpan di folder out/.' },
      { timeSec: 68, timeLabel: '01:08', title: 'Eksplorasi Gaya Tambahan', desc: 'Gunakan audira_auto_orchestrate untuk gaya lain seperti HyperFrames.' }
    ],
    keyTakeaways: [
      'Cukup ceritakan ide konsep dalam satu paragraf biasa',
      'Preview visual dapat direvisi langsung dengan instruksi bahasa sehari-hari',
      'Hasil render 1080x1920 60 FPS siap tayang langsung di TikTok, Reels, dan Shorts'
    ],
    quickCommand: '/audira-motion Buat video 3D 9:16 tentang teknologi AI masa depan'
  }
];

interface VideoTutorialPlayerProps {
  initialEpisodeId?: '01' | '02' | '03';
  compactMode?: boolean;
  onEpisodeChange?: (epId: '01' | '02' | '03') => void;
}

export const VideoTutorialPlayer: React.FC<VideoTutorialPlayerProps> = ({
  initialEpisodeId = '01',
  compactMode = false,
  onEpisodeChange
}) => {
  const [selectedEpId, setSelectedEpId] = useState<'01' | '02' | '03'>(initialEpisodeId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [playerSizeMode, setPlayerSizeMode] = useState<'split' | 'jumbo'>('split');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setSelectedEpId(initialEpisodeId);
  }, [initialEpisodeId]);

  const activeEpisode = TUTORIAL_EPISODES.find(e => e.id === selectedEpId) || TUTORIAL_EPISODES[0];

  const handleSelectEpisode = (id: '01' | '02' | '03') => {
    setSelectedEpId(id);
    onEpisodeChange?.(id);
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (timeSec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timeSec;
    setCurrentTime(timeSec);
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    if (!videoRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {}
  };

  const fmtTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-3xl border-2 border-line bg-card p-4 sm:p-6 shadow-2xl space-y-5 font-display text-paper">
      
      {/* Top Episode Selector Tabs & Layout Mode Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold shrink-0">
              <Film className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-paper tracking-tight">
                  Video Walkthrough Resmi: Seri Pasang AUDIRA
                </h3>
                <span className="rounded-full bg-accent/20 border border-accent/40 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                  9:16 VERTICAL 1080P
                </span>
              </div>
              <p className="text-xs text-muted">
                Resolusi vertikal asli (1080x1920) sesuai format reels/shorts tutorial layar penuh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {/* Player View Mode Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-ink border border-line text-xs font-mono">
              <button
                type="button"
                onClick={() => setPlayerSizeMode('split')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  playerSizeMode === 'split' 
                    ? 'bg-accent text-ink shadow' 
                    : 'text-dim hover:text-paper'
                }`}
                title="Tampilkan Berdampingan dengan Daftar Chapter"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Berdampingan</span>
              </button>
              <button
                type="button"
                onClick={() => setPlayerSizeMode('jumbo')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  playerSizeMode === 'jumbo' 
                    ? 'bg-accent text-ink shadow' 
                    : 'text-dim hover:text-paper'
                }`}
                title="Tampilkan Video Ukuran Jumbo di Tengah"
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mode Jumbo</span>
              </button>
            </div>

            <div className="text-xs text-dim font-mono hidden md:block">
              Episode: <strong className="text-accent">{activeEpisode.episodeNum}/03</strong>
            </div>
          </div>
        </div>

        {/* Episode Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {TUTORIAL_EPISODES.map((ep) => {
            const isSelected = selectedEpId === ep.id;
            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => handleSelectEpisode(ep.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-accent bg-accent/15 ring-2 ring-accent/60 shadow-lg scale-[1.01]'
                    : 'border-line bg-tile hover:border-line-strong hover:bg-tile/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-accent text-ink' : 'bg-black/50 text-dim'
                  }`}>
                    EPISODE {ep.episodeNum}
                  </span>
                  <span className="text-[11px] font-mono text-dim flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ep.durationLabel}
                  </span>
                </div>
                <p className="text-xs font-bold text-paper line-clamp-1">
                  {ep.title}
                </p>
                <p className="text-[11px] text-muted line-clamp-1">
                  {ep.badge}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Video Cinema Box & Chapters */}
      <div className={`grid gap-6 items-start ${
        playerSizeMode === 'split' 
          ? 'grid-cols-1 lg:grid-cols-12' 
          : 'grid-cols-1 max-w-2xl mx-auto'
      }`}>
        
        {/* Video Player Column (Takes 5 cols on lg split mode, centered on mobile/jumbo) */}
        <div className={`${
          playerSizeMode === 'split' ? 'lg:col-span-5' : 'w-full'
        } flex flex-col items-center space-y-3`}>
          
          {/* Vertical 9:16 Video Player Container (Strictly Matches Native 1080x1920 Resolution) */}
          <div className={`relative rounded-3xl overflow-hidden border-2 border-accent/40 bg-black shadow-2xl aspect-[9/16] group ring-1 ring-white/10 w-full ${
            playerSizeMode === 'split' 
              ? 'max-w-[380px] sm:max-w-[410px]' 
              : 'max-w-[440px] sm:max-w-[480px]'
          } mx-auto transition-all`}>
            
            <video
              ref={videoRef}
              src={activeEpisode.videoUrl}
              className="w-full h-full object-contain bg-black"
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration || activeEpisode.durationSec);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />

            {/* Top Video Overlay Badge */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-accent shadow">
                EP {activeEpisode.episodeNum} • 9:16 VERTICAL 1080p
              </span>
              <span className="px-2 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-paper font-semibold shadow">
                {activeEpisode.durationLabel}
              </span>
            </div>

            {/* Big Play Overlay (when paused) */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30 z-10"
              >
                <div className="flex size-16 sm:size-20 items-center justify-center rounded-3xl bg-accent text-ink shadow-2xl shadow-orange-950/80 transition-transform group-hover:scale-110">
                  <Play className="w-8 h-8 fill-ink ml-1" />
                </div>
              </div>
            )}

            {/* Custom Bottom Control Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-3 sm:p-4 pt-10 flex flex-col gap-2.5 z-20 opacity-95 group-hover:opacity-100 transition-opacity">
              
              {/* Progress Slider */}
              <div 
                className="relative h-2 w-full bg-white/25 hover:bg-white/35 rounded-full cursor-pointer overflow-hidden transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  const newTime = pos * (duration || activeEpisode.durationSec);
                  handleSeek(newTime);
                }}
              >
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${((currentTime / (duration || activeEpisode.durationSec)) * 100) || 0}%` }}
                />
              </div>

              {/* Control Buttons Row */}
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    type="button" 
                    onClick={togglePlay}
                    className="p-1 text-white hover:text-accent transition-colors"
                    title={isPlaying ? 'Jeda Video' : 'Putar Video'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeek(0)}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                    title="Ulangi dari awal (00:00)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                    title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-[10px] sm:text-[11px] text-white/90">
                    {fmtTime(currentTime)} / {fmtTime(duration || activeEpisode.durationSec)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cycleSpeed}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 transition-colors"
                    title="Atur Kecepatan Putar"
                  >
                    {playbackSpeed}x
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                    title="Layar Penuh (Fullscreen)"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-mono text-dim text-center">
            *Klik video untuk play/pause, klik tombol ⛶ untuk layar penuh monitor.
          </p>
        </div>

        {/* Video Chapters & Timeline Column (Takes 7 cols on lg split mode) */}
        <div className={`${
          playerSizeMode === 'split' ? 'lg:col-span-7' : 'w-full'
        } space-y-4`}>
          
          {/* Episode Info & Quick Actions Card */}
          <div className="rounded-2xl border border-line bg-tile p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-accent block">
                  EPISODE {activeEpisode.episodeNum} • {activeEpisode.badge}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-paper">
                  {activeEpisode.title}
                </h4>
              </div>

              {activeEpisode.quickCommand && (
                <button
                  type="button"
                  onClick={() => handleCopyCommand(activeEpisode.quickCommand!)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink border border-line text-xs font-mono font-bold text-emerald-400 hover:border-emerald-500 transition-all shrink-0"
                  title="Salin Perintah Terkait"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{copiedCmd ? 'Tersalin!' : 'Salin Perintah'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {activeEpisode.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line-soft">
              <span className="text-[11px] font-mono text-dim">Alat / Komponen:</span>
              {activeEpisode.tools.map((tool, idx) => (
                <span key={idx} className="rounded-md bg-ink border border-line px-2 py-0.5 font-mono text-[10px] text-paper/80">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Chapters List */}
          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <span className="font-mono text-xs uppercase font-bold text-paper flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-accent" />
                <span>DAFTAR CHAPTER EPISODE {activeEpisode.episodeNum} ({activeEpisode.chapters.length})</span>
              </span>
              <span className="text-[10px] text-dim font-mono">Klik untuk lompat video</span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {activeEpisode.chapters.map((ch, idx) => {
                const isCurrent = currentTime >= ch.timeSec && (
                  idx === activeEpisode.chapters.length - 1 || currentTime < activeEpisode.chapters[idx + 1].timeSec
                );

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSeek(ch.timeSec)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'border-accent bg-accent/15 text-paper ring-1 ring-accent/50'
                        : 'border-transparent hover:border-line hover:bg-tile text-muted hover:text-paper'
                    }`}
                  >
                    <span className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isCurrent ? 'bg-accent text-ink font-black' : 'bg-ink text-dim'
                    }`}>
                      {ch.timeLabel}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-paper truncate">
                        {ch.title}
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">
                        {ch.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Takeaways Box */}
            <div className="pt-3 border-t border-line space-y-1.5 text-[11px]">
              <span className="font-mono text-[10px] uppercase font-bold text-dim block">
                POIN PENTING &amp; KUNCI SUKSES:
              </span>
              <ul className="space-y-1 text-muted">
                {activeEpisode.keyTakeaways.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
