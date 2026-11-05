'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Terminal, 
  Sparkles, 
  Layers, 
  Check, 
  Copy, 
  ArrowRight, 
  Cpu, 
  Eye, 
  Compass, 
  Flame, 
  Building2, 
  Activity,
  Play,
  Target
} from 'lucide-react';
import { REELS } from './reels';

interface SignatureCard {
  id: string;
  kit: string;
  badge: string;
  title: string;
  quote: string;
  image: string;
  tags: [string, string, string];
  command: string;
  prompt: string;
  suitableFor: string;
}

const SIGNATURE_CARDS: SignatureCard[] = [
  {
    id: 'buildforge',
    kit: 'BUILDFORGE',
    badge: 'ARCHITECTURE 3D',
    title: 'Perakitan Rumah Modern 3D',
    quote: 'animasi perakitan bertahap: pondasi struktur, rangka baja, hingga finishing kaca modern.',
    image: '/3d-kits/buildforge.jpg',
    tags: ['Architecture 3D', 'Modular Assembly', 'Pondasi Baja'],
    command: 'npx remotion still starter/src/index.ts BuildforgePreview out/buildforge.png',
    prompt: '/audira-motion Rumah dua lantai dirakit bertahap dari pondasi semen, tiang baja ringan, hingga instalasi kaca panorama modern.',
    suitableFor: 'Promo properti, arsitektur, real estate, progres konstruksi, & interior rumah.',
  },
  {
    id: 'precision',
    kit: 'PRECISION',
    badge: 'PRODUCT CMF 3D',
    title: 'Exploded View Jam Titanium',
    quote: 'iklan produk mewah komersial: roda gigi mekanik dan casing titanium terurai melayang presisi.',
    image: '/3d-kits/precision.jpg',
    tags: ['Exploded View', 'CMF Titanium', 'Studio Lighting'],
    command: 'npx remotion still starter/src/index.ts PrecisionPreview out/precision.png',
    prompt: '/audira-motion Jam tangan kronograf titanium mewah 3D meledak terurai memperlihatkan susunan roda gigi mesin dan dial safir.',
    suitableFor: 'Iklan produk mewah (luxury goods), gadget, jam tangan mekanik, audio & elektronik premium.',
  },
  {
    id: 'pixelstory',
    kit: 'PIXELSTORY',
    badge: 'CINEMATIC 2.5D',
    title: 'Mercusuar Badai Malam 2.5D',
    quote: 'sinematik pixel-art atmosferik: sorotan lampu mercusuar menembus badai ombak malam hari.',
    image: '/3d-kits/pixelstory.jpg',
    tags: ['Pixel Art 2.5D', 'Point Lighting', 'Badai Laut'],
    command: 'npx remotion still starter/src/index.ts PixelstoryPreview out/pixelstory.png',
    prompt: '/audira-motion Mercusuar pixel-art di atas tebing karang saat badai malam, lampu sorot berputar dengan partikel hujan dinamis.',
    suitableFor: 'Gaming review, konten retro nostalgia, cerita drama indie, & reels bertema lofi chill.',
  },
  {
    id: 'cyberforge',
    kit: 'CYBERFORGE',
    badge: 'SCI-FI HOLOGRAM 3D',
    title: 'Hologram Inti Kuantum AI',
    quote: 'proyeksi telemetri sci-fi 3D: cincin HUD berputar mengelilingi inti reaktor kuantum.',
    image: '/3d-kits/cyberforge.jpg',
    tags: ['Sci-Fi Hologram', 'HUD Telemetry', 'Grid Neon'],
    command: 'npx remotion still starter/src/index.ts CyberforgePreview out/cyberforge.png',
    prompt: '/audira-motion Inti reaktor AI kuantum holografik 3D melayang di ruang gelap dengan cincin data telemetri berputar cepat.',
    suitableFor: 'Cybersecurity, AI & Cloud Computing, fintech crypto/web3, & peluncuran software enterprise.',
  }
];

export interface KitCatalogItem {
  id: string;
  name: string;
  group: 'arsitektur' | 'taktil' | 'sains' | 'kosmik';
  character: string;
  promptExample: string;
  previewId: string;
  sampleImg: string;
}

export const ALL_20_KITS: KitCatalogItem[] = [
  {
    id: 'pixelstory',
    name: 'PIXELSTORY',
    group: 'taktil',
    character: 'Sinematik 2.5D pixel-art & pencahayaan titik',
    promptExample: '/audira-motion Animasi pixel tentang penjaga mercusuar yang menyalakan lampu saat badai malam.',
    previewId: 'PixelstoryPreview',
    sampleImg: '/3d-kits/pixelstory.jpg'
  },
  {
    id: 'voxelverse',
    name: 'VOXELVERSE',
    group: 'kosmik',
    character: 'Miniatur dunia 3D dari balok voxel & survival diorama',
    promptExample: '/audira-motion Kota mini voxel saat malam hujan, robot pengantar membawa lentera bersinar.',
    previewId: 'VoxelversePreview',
    sampleImg: '/3d-kits/voxelverse.jpg'
  },
  {
    id: 'precision',
    name: 'PRECISION',
    group: 'sains',
    character: 'Iklan produk mewah 3D / exploded view CMF titanium',
    promptExample: '/audira-motion Iklan 3D jam tangan mekanik mewah, close-up titanium dan roda gigi meledak terurai.',
    previewId: 'PrecisionPreview',
    sampleImg: '/3d-kits/precision.jpg'
  },
  {
    id: 'paperworld',
    name: 'PAPERWORLD',
    group: 'taktil',
    character: 'Cerita miniatur kertas lipat origami & layered papercraft',
    promptExample: '/audira-motion Cerita kertas tentang tukang kebun kecil yang mengembalikan warna ke kota origami.',
    previewId: 'PaperworldPreview',
    sampleImg: '/3d-kits/paperworld.jpg'
  },
  {
    id: 'innerworks',
    name: 'INNERWORKS',
    group: 'arsitektur',
    character: 'Membedah cara kerja mesin (X-Ray cutaway & kinematika)',
    promptExample: '/audira-motion Cara kerja kipas angin turbin elektrik, casing transparan dan poros kumparan berputar.',
    previewId: 'InnerworksPreview',
    sampleImg: '/3d-kits/innerworks.jpg'
  },
  {
    id: 'worldforge',
    name: 'WORLDFORGE',
    group: 'kosmik',
    character: 'Menjelajahi dunia 3D luas, bola bumi & fisika orbit',
    promptExample: '/audira-motion Planet bumi berputar megah di ruang hampa dengan atmosfer realistis dan cincin partikel.',
    previewId: 'WorldforgePreview',
    sampleImg: '/3d-kits/worldforge.jpg'
  },
  {
    id: 'timeforge',
    name: 'TIMEFORGE',
    group: 'arsitektur',
    character: 'Satu objek berevolusi lintas era dan waktu',
    promptExample: '/audira-motion Evolusi telepon genggam dari era batu bata analog 90-an sampai smartphone lipat masa kini.',
    previewId: 'TimeforgePreview',
    sampleImg: '/3d-kits/timeforge.jpg'
  },
  {
    id: 'buildforge',
    name: 'BUILDFORGE',
    group: 'arsitektur',
    character: 'Bangunan dirakit tahap demi tahap dari pondasi hingga finishing',
    promptExample: '/audira-motion Rumah dua lantai dibangun dari tanah kosong, pondasi semen, rangka baja, hingga taman asri.',
    previewId: 'BuildforgePreview',
    sampleImg: '/3d-kits/buildforge.jpg'
  },
  {
    id: 'cyberforge',
    name: 'CYBERFORGE',
    group: 'kosmik',
    character: 'Hologram 3D sci-fi, cincin telemetri HUD & grid neon',
    promptExample: '/audira-motion Animasi hologram 3D inti kuantum AI dengan lingkaran telemetri HUD berputar.',
    previewId: 'CyberforgePreview',
    sampleImg: '/3d-kits/cyberforge.jpg'
  },
  {
    id: 'draftforge',
    name: 'DRAFTFORGE',
    group: 'arsitektur',
    character: 'Cetak biru arsitektur CAD & skema dimensi ISO presisi',
    promptExample: '/audira-motion Skema cetak biru 3D mesin roket pendorong, garis ukuran dimensi presisi ISO exploded view.',
    previewId: 'DraftforgePreview',
    sampleImg: '/3d-kits/draftforge.jpg'
  },
  {
    id: 'clayworld',
    name: 'CLAYWORLD',
    group: 'taktil',
    character: 'Animasi stop-motion tanah liat plastisin & karakter kenyal',
    promptExample: '/audira-motion Cerita stop-motion monster kecil yang melompat kenyal di dunia jamur plastisin.',
    previewId: 'ClayworldPreview',
    sampleImg: '/3d-kits/clayworld.jpg'
  },
  {
    id: 'polyverse',
    name: 'POLYVERSE',
    group: 'kosmik',
    character: 'Pulau melayang low-poly minimalis dengan fajar pastel',
    promptExample: '/audira-motion Pulau melayang low-poly minimalis dengan pohon pinus bergoyang dan air terjun kristal.',
    previewId: 'PolyversePreview',
    sampleImg: '/3d-kits/polyverse.jpg'
  },
  {
    id: 'toonforge',
    name: 'TOONFORGE',
    group: 'taktil',
    character: 'Aksi anime cel-shaded 3D, manga speed lines & semburan plasma',
    promptExample: '/audira-motion Aksi robot mecha tempur meluncur cepat dengan garis kecepatan manga dan plasma kembar.',
    previewId: 'ToonforgePreview',
    sampleImg: '/3d-kits/toonforge.jpg'
  },
  {
    id: 'glasscraft',
    name: 'GLASSCRAFT',
    group: 'sains',
    character: 'Spatial computing glassmorphism, prisma spektrum & cairan',
    promptExample: '/audira-motion Kartu kaca buram melayang, pembiasan prisma spektrum pelangi, dan tetesan kristal cair.',
    previewId: 'GlasscraftPreview',
    sampleImg: '/3d-kits/glasscraft.jpg'
  },
  {
    id: 'nanoforge',
    name: 'NANOFORGE',
    group: 'sains',
    character: 'Mikroskop Cryo-EM & DNA heliks ganda bersinar',
    promptExample: '/audira-motion Sains mikroskopis 3D heliks ganda DNA bersinar dengan pasangan basa berputar.',
    previewId: 'NanoforgePreview',
    sampleImg: '/3d-kits/nanoforge.jpg'
  },
  {
    id: 'inkstory',
    name: 'INKSTORY',
    group: 'kosmik',
    character: 'Lukisan tinta Timur (Sumi-e), Shan Shui & kaligrafi',
    promptExample: '/audira-motion Lukisan kaligrafi tinta Cina 3D di atas kertas beras tua dengan pegunungan Shan Shui.',
    previewId: 'InkstoryPreview',
    sampleImg: '/3d-kits/inkstory.jpg'
  },
  {
    id: 'lidarforge',
    name: 'LIDARFORGE',
    group: 'sains',
    character: 'Survei drone LiDAR 3D, elevasi titik awan & tirai laser',
    promptExample: '/audira-motion Survei drone LiDAR 3D titik awan ketinggian tanah, tirai laser menyapu lembah.',
    previewId: 'LidarforgePreview',
    sampleImg: '/3d-kits/lidarforge.jpg'
  },
  {
    id: 'circuitforge',
    name: 'CIRCUITFORGE',
    group: 'sains',
    character: 'Motherboard PCB 3D makro, jalur tembaga & arus elektron',
    promptExample: '/audira-motion Sirkuit motherboard PCB 3D makro dengan jalur tembaga presisi dan aliran pulsa listrik.',
    previewId: 'CircuitforgePreview',
    sampleImg: '/3d-kits/circuitforge.jpg'
  },
  {
    id: 'brickcraft',
    name: 'BRICKCRAFT',
    group: 'taktil',
    character: 'Balok mainan plastik 3D interlocking stud & snap diorama',
    promptExample: '/audira-motion Animasi stop-motion balok plastik di atas meja kayu, potongan balok terbang merakit rumah.',
    previewId: 'BrickcraftPreview',
    sampleImg: '/3d-kits/brickcraft.jpg'
  },
  {
    id: 'urbanforge',
    name: 'URBANFORGE',
    group: 'arsitektur',
    character: 'Maket arsitektur putih monokrom & proyeksi zonasi neon',
    promptExample: '/audira-motion Maket arsitektur putih monokrom kota futuristik, bayangan matahari bergerak presisi.',
    previewId: 'UrbanforgePreview',
    sampleImg: '/3d-kits/urbanforge.jpg'
  },
  {
    id: 'isocraft',
    name: 'ISOCRAFT',
    group: 'arsitektur',
    character: 'Diorama isometrik cross-section 3D & potong silang sudut 45°',
    promptExample: '/audira-motion Diorama isometrik arsitektur perkotaan mini potong silang sudut 45 derajat.',
    previewId: 'IsocraftPreview',
    sampleImg: '/3d-kits/isocraft.jpg'
  },
  {
    id: 'vintageforge',
    name: 'VINTAGEFORGE',
    group: 'arsitektur',
    character: 'Teknik blueprint retro 1920-an & drafting sepia',
    promptExample: '/audira-motion Skema drafting arsitektur klasik tahun 1920-an di atas kertas linen sepia.',
    previewId: 'VintageforgePreview',
    sampleImg: '/3d-kits/vintageforge.jpg'
  },
  {
    id: 'chalkcraft',
    name: 'CHALKCRAFT',
    group: 'arsitektur',
    character: 'Animasi gambar kapur papan tulis sekolah & diagram',
    promptExample: '/audira-motion Ilustrasi kapur putih dan pastel di papan tulis hitam bertekstur kasar.',
    previewId: 'ChalkcraftPreview',
    sampleImg: '/3d-kits/chalkcraft.jpg'
  },
  {
    id: 'kintsugi',
    name: 'KINTSUGI',
    group: 'taktil',
    character: 'Seni retakan emas keramik Jepang 3D & rekonstruksi porselen',
    promptExample: '/audira-motion Mangkuk keramik hitam pecah terbelah dan menyatu kembali dengan garis emas berkilau.',
    previewId: 'KintsugiPreview',
    sampleImg: '/3d-kits/kintsugi.jpg'
  },
  {
    id: 'audirabot',
    name: 'AUDIRABOT',
    group: 'taktil',
    character: 'Maskot robot AUDIRA 3D metalik & artikulasi sendi presisi',
    promptExample: '/audira-motion Karakter robot AUDIRA mini dengan mata LED biru bercahaya dan artikulasi sendi presisi.',
    previewId: 'AudirabotPreview',
    sampleImg: '/3d-kits/audirabot.jpg'
  },
  {
    id: 'thermalforge',
    name: 'THERMALFORGE',
    group: 'sains',
    character: 'Visual pencitraan termal inframerah FLIR 3D & gradien panas',
    promptExample: '/audira-motion Pemindaian termal inframerah spektrum FLIR suhu panas merah dan dingin biru tua.',
    previewId: 'ThermalforgePreview',
    sampleImg: '/3d-kits/thermalforge.jpg'
  },
  {
    id: 'brutalforge',
    name: 'BRUTALFORGE',
    group: 'kosmik',
    character: 'Monolit beton brutalist monokrom & arsitektur masif',
    promptExample: '/audira-motion Monolit beton brutalist raksasa monokrom dengan sudut geometris tajam.',
    previewId: 'BrutalforgePreview',
    sampleImg: '/3d-kits/brutalforge.jpg'
  },
  {
    id: 'retrowave',
    name: 'RETROWAVE',
    group: 'kosmik',
    character: 'Dunia synthwave retro 80-an, grid kawat ungu & sunset neon',
    promptExample: '/audira-motion Pemandangan synthwave retrowave jalanan neon tanpa batas dengan matahari terbenam kawat 3D.',
    previewId: 'RetrowavePreview',
    sampleImg: '/3d-kits/retrowave.jpg'
  },
  {
    id: 'textvoyage',
    name: 'TEXTVOYAGE',
    group: 'kosmik',
    character: 'Tipografi kinetik 3D sinematik & teks ekspresif melayang',
    promptExample: '/audira-motion Tipografi kinetik 3D huruf tebal meluncur di ruang gelap dengan partikel debu.',
    previewId: 'TextvoyagePreview',
    sampleImg: '/3d-kits/textvoyage.jpg'
  }
];

export const Remotion3DShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [copiedKit, setCopiedKit] = useState<string | null>(null);

  const handleCopyPrompt = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKit(id);
    setTimeout(() => setCopiedKit(null), 2000);
  };

  const filteredKits = ALL_20_KITS.filter((kit) => {
    if (selectedGroup === 'all') return true;
    return kit.group === selectedGroup;
  });

  return (
    <section id="remotion-3d" className="mx-auto max-w-[1240px] px-4 py-16 md:px-8 md:py-24">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
        <div className="flex max-w-[760px] flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent font-bold">
              AUDIRA SKILL MOTION 3D ENGINE
            </p>
          </div>
          <h2 className="font-display text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-paper">
            29 Gaya Sinematik 3D Nyata. <br className="hidden sm:inline" />
            <span className="text-accent">Bukan AI Halusinasi, Ini Simulasi Fisika.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Digerakkan langsung oleh <strong>Remotion 4.0</strong>, <strong>React Three Fiber</strong>, dan <strong>Three.js</strong> di folder <code className="text-xs bg-tile px-2 py-0.5 rounded border border-line text-accent">audira-skill-motion/</code>. Setiap frame dirender presisi dengan kamera terarah, material PBR, dan soft-shadows.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'featured' ? 'all' : 'featured')}
            className="inline-flex items-center gap-2 rounded-xl border border-edge bg-tile px-4 py-2.5 text-xs font-bold text-fg-2 hover:bg-tile-2 hover:border-line-strong hover:text-paper transition-all"
          >
            <Compass className="w-4 h-4 text-accent" />
            <span>{activeTab === 'featured' ? 'Jelajahi Semua 29 Gaya 3D' : 'Tampilkan 4 Unggulan'}</span>
          </button>
          
          <a
            href="#produk"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-ink shadow-md hover:bg-orange-500 transition-colors"
          >
            <span>Beli Lisensi 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* FEATURED VIEW: Exact 4-Column Row (Matching User Mockup) */}
      {activeTab === 'featured' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNATURE_CARDS.map((card) => {
            const isCopied = copiedKit === card.id;

            return (
              <div
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-line bg-card p-3.5 sm:p-4 shadow-card-warm transition-transform hover:-translate-y-1 hover:border-line-strong"
              >
                {/* Top Prompt Quote Snippet */}
                <div className="mb-2.5 min-h-[38px]">
                  <p className="text-xs italic leading-relaxed text-muted/90 line-clamp-2">
                    &ldquo;{card.quote}&rdquo;
                  </p>
                </div>

                {/* Vertical 9:16 Visual Poster / 3D Render Canvas */}
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink border border-line-soft group">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/3d-kits/buildforge.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35" />

                  {/* Play / Inspect Overlay matching user mockup */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex size-14 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-white group-hover:bg-accent group-hover:text-ink">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </span>
                  </div>

                  {/* Top Badge Pill */}
                  <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-md bg-ink/90 border border-line/80 px-2.5 py-0.5 font-mono text-[10px] font-bold text-fg-2 uppercase tracking-wide">
                    {card.badge}
                  </span>

                  {/* Bottom Engine Watermark */}
                  <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded bg-black/70 px-2 py-0.5 font-mono text-[9px] text-accent border border-accent/30 font-bold uppercase">
                    {card.kit}
                  </span>
                </div>

                {/* Card Meta & 3 Tag Pills */}
                <div className="mt-3.5 flex flex-col flex-1 justify-between">
                  {/* 3 Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-[#2e2922] bg-[#201d18] px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-medium text-[#c5b8a5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Title */}
                  <h4 className="font-display text-[15px] sm:text-[16px] font-bold leading-tight text-paper line-clamp-1">
                    {card.title}
                  </h4>

                  {/* Cocok Untuk Box */}
                  <div className="mt-2.5 rounded-xl border border-line bg-tile/70 p-2.5 text-left">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                      <Target className="w-3 h-3 text-accent shrink-0" />
                      <span>Cocok Untuk:</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-1">
                      {card.suitableFor}
                    </p>
                  </div>

                  {/* Quick Action Link: "Pilih Gaya Ini ->" pointing to license packages */}
                  <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                    <a
                      href="#produk"
                      className="group/link inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-fg-2 hover:text-accent transition-colors"
                    >
                      <span>Pilih Gaya Ini</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(card.prompt, card.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-accent transition-colors"
                      title="Salin prompt 3D"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-dim hover:text-accent" />}
                      <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Prompt'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EXPANDED VIEW: All 20 Remotion 3D Signature Kits Catalog */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Sub-group Filters */}
          <div className="flex flex-wrap gap-2 pb-2">
            {[
              { id: 'all', label: 'Semua 29 Gaya', count: 29 },
              { id: 'arsitektur', label: 'Arsitektur & Mesin', count: 8 },
              { id: 'taktil', label: 'Taktil & Stop-Motion', count: 7 },
              { id: 'sains', label: 'Sains & Medis', count: 4 },
              { id: 'kosmik', label: 'Dunia & Komersial', count: 10 },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGroup === g.id
                    ? 'bg-accent text-ink shadow-md'
                    : 'bg-tile border border-edge text-muted hover:border-line-strong hover:text-paper'
                }`}
              >
                <span>{g.label}</span>
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">({g.count})</span>
              </button>
            ))}
          </div>

          {/* Grid of 20 Kits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredKits.map((kit) => {
              const isCopied = copiedKit === kit.id;
              const matchingReel = REELS.find((r) => r.file === kit.id);
              const suitableForText = matchingReel?.suitableFor || kit.character;

              return (
                <div
                  key={kit.id}
                  className="rounded-2xl border border-line bg-card p-4 flex flex-col justify-between hover:border-accent/50 transition-colors"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-ink mb-3 border border-line">
                      <img
                        src={kit.sampleImg}
                        alt={kit.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/3d-kits/buildforge.jpg';
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] font-black text-accent uppercase">
                        {kit.name}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-paper mb-1">
                      {kit.name}
                    </h4>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-2">
                      {kit.character}
                    </p>

                    {/* Cocok Untuk Box */}
                    <div className="mb-3 rounded-lg border border-line bg-tile/70 p-2 text-left">
                      <div className="flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                        <Target className="w-2.5 h-2.5 text-accent shrink-0" />
                        <span>Cocok Untuk:</span>
                      </div>
                      <p className="text-[11px] text-muted/90 leading-tight mt-0.5 line-clamp-2">
                        {suitableForText}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line-soft space-y-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(kit.promptExample, kit.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-edge bg-tile px-3 py-2 text-xs font-bold text-fg-2 hover:bg-tile-2 hover:border-accent hover:text-paper transition-all"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-accent" />}
                      <span>{isCopied ? 'Prompt Tersalin!' : 'Salin Contoh Prompt'}</span>
                    </button>
                    
                    <div className="text-[10px] font-mono text-dim truncate">
                      ID: {kit.previewId}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1-Click Launchpad Terminal Bar */}
      <div className="mt-12 rounded-3xl border border-line bg-gradient-to-br from-card via-tile to-ink p-6 sm:p-8 shadow-card-warm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[620px] space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase font-bold">
              <Terminal className="w-4 h-4" />
              <span>Cara Menjalankan Remotion Studio 3D</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-paper">
              Jalankan Langsung di Terminal Anda Tanpa Setup Rumit
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Klik ganda file <code className="text-accent bg-black/40 px-2 py-0.5 rounded border border-line">start_remotion.bat</code> di root folder, atau jalankan perintah npm di bawah:
            </p>
          </div>

          {/* Code Snippets */}
          <div className="flex flex-col gap-2 min-w-[300px]">
            <div className="flex items-center justify-between rounded-xl bg-ink border border-line px-3.5 py-2.5 font-mono text-xs text-emerald-400">
              <span>npm run remotion:dev</span>
              <span className="text-[10px] text-dim">Studio Port 3000</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-ink border border-line px-3.5 py-2.5 font-mono text-xs text-cyan-400">
              <span>npm run remotion:smoke</span>
              <span className="text-[10px] text-dim">Smoke Visual Test</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-ink border border-line px-3.5 py-2.5 font-mono text-xs text-amber-400">
              <span>npm run remotion:render</span>
              <span className="text-[10px] text-dim">Render MP4 4K/60</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
