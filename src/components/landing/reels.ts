import { Motion3DFormat, MotionFormat, MoodType } from '@/types/motion';

export type GalleryCategory = 'all' | 'arsitektur' | 'taktil' | 'geometris' | 'sains' | 'komersial';

export type ReelSample = {
  file: string;
  format: Motion3DFormat | MotionFormat;
  kind: string;
  title: string;
  quote: string;
  tags: [string, string, string];
  category: GalleryCategory;
  command?: string;
  prompt: string;
  engine: string;
  author: string;
};

export const REELS: ReelSample[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. EDUKASI, ARSITEKTUR & MESIN (5 Gaya)
  // ─────────────────────────────────────────────────────────────
  {
    file: 'innerworks',
    format: 'innerworks',
    kind: 'X-Ray Cutaway',
    title: 'Mekanika Mesin Transparan & Kinematika',
    quote: 'Cara kerja kipas angin turbin elektrik, casingnya transparan dan poros kumparan berputar di dalam.',
    tags: ['X-Ray Cutaway', 'Poros Kumparan', 'Rotasi Fisika'],
    category: 'arsitektur',
    command: 'npx remotion still starter/src/index.ts InnerworksPreview out/innerworks.png',
    prompt: '/audira-motion Cara kerja kipas angin turbin elektrik, casingnya transparan dan poros kumparan berputar di dalam.',
    engine: 'Three.js PBR Transparent Depth',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'buildforge',
    format: 'buildforge',
    kind: 'Architecture 3D',
    title: 'Perakitan Konstruksi Bangunan Bertahap',
    quote: 'Rumah dua lantai dibangun dari tanah kosong, pondasi semen, rangka baja, dinding bata, hingga taman asri.',
    tags: ['Modular Assembly', 'Pondasi Baja', 'Finishing Kaca'],
    category: 'arsitektur',
    command: 'npx remotion still starter/src/index.ts BuildforgePreview out/buildforge.png',
    prompt: '/audira-motion Rumah dua lantai dibangun dari tanah kosong, pondasi semen, rangka baja, dinding bata, hingga taman asri.',
    engine: 'Orthogonal Clash Detection System',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'timeforge',
    format: 'timeforge',
    kind: 'Physical Evolution',
    title: 'Evolusi Desain Fisik Benda Lintas Era',
    quote: 'Evolusi telepon genggam dari era batu bata analog 90-an sampai smartphone lipat masa kini.',
    tags: ['Evolusi Era', 'Transisi Objek', 'Sejarah Desain'],
    category: 'arsitektur',
    command: 'npx remotion still starter/src/index.ts TimeforgePreview out/timeforge.png',
    prompt: '/audira-motion Evolusi telepon genggam dari era batu bata analog 90-an sampai smartphone lipat masa kini.',
    engine: 'Studio Chrono Interpolator',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'draftforge',
    format: 'draftforge',
    kind: 'CAD Blueprint',
    title: 'Cetak Biru Arsitektur & Skema ISO Mesin',
    quote: 'Skema cetak biru 3D mesin roket pendorong, garis ukuran dimensi presisi ISO lalu exploded view.',
    tags: ['ISO Blueprint', 'Dimensi Presisi', 'Wireframe CAD'],
    category: 'arsitektur',
    command: 'npx remotion still starter/src/index.ts DraftforgePreview out/draftforge.png',
    prompt: '/audira-motion Skema cetak biru 3D mesin roket pendorong, garis ukuran dimensi presisi ISO lalu exploded view.',
    engine: 'Vector Edge Contour Renderer',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'urbanforge',
    format: 'urbanforge',
    kind: 'Urban Plaster Model',
    title: 'Maket Kota Putih Monokrom & Proyeksi Data',
    quote: 'Maket arsitektur putih monokrom kota futuristik, bayangan matahari bergerak, lapisan data zonasi diproyeksikan dengan cahaya neon.',
    tags: ['White Plaster', 'Bayangan Surya', 'Proyeksi Zonasi'],
    category: 'arsitektur',
    command: 'npx remotion still starter/src/index.ts UrbanforgePreview out/urbanforge.png',
    prompt: '/audira-motion Maket arsitektur putih monokrom kota futuristik, bayangan matahari bergerak, lapisan data zonasi diproyeksikan dengan cahaya neon.',
    engine: 'Dynamic Solar Shadow Projection',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. KARAKTER & CERITA TAKTIL (5 Gaya)
  // ─────────────────────────────────────────────────────────────
  {
    file: 'pixelstory',
    format: 'pixelstory',
    kind: 'Cinematic 2.5D',
    title: 'Mercusuar Badai Malam 2.5D Pixel-Art',
    quote: 'Animasi pixel tentang penjaga mercusuar yang menyalakan lampu saat badai malam. Musik saja.',
    tags: ['Pixel Art 2.5D', 'Point Lighting', 'Badai Laut'],
    category: 'taktil',
    command: 'npx remotion still starter/src/index.ts PixelstoryPreview out/pixelstory.png',
    prompt: '/audira-motion Animasi pixel tentang penjaga mercusuar yang menyalakan lampu saat badai malam. Musik saja.',
    engine: 'Cinematic Pixel Depth Rig',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'paperworld',
    format: 'paperworld',
    kind: 'Paper Craft',
    title: 'Diorama Kertas Lipat Origami Handmade',
    quote: 'Cerita kertas tentang tukang kebun kecil yang mengembalikan warna ke kota origami.',
    tags: ['Paper Craft', 'Hinge Origami', 'Diorama Kertas'],
    category: 'taktil',
    command: 'npx remotion still starter/src/index.ts PaperworldPreview out/paperworld.png',
    prompt: '/audira-motion Cerita kertas tentang tukang kebun kecil yang mengembalikan warna ke kota origami.',
    engine: 'Rigid Hinge Origami Kinematics',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'clayworld',
    format: 'clayworld',
    kind: 'Claymation 15 FPS',
    title: 'Stop-Motion Animasi Tanah Liat Plastisin',
    quote: 'Cerita animasi stop-motion monster kecil yang melompat kenyal di dunia jamur dan melambaikan tangan.',
    tags: ['Stop-Motion 15FPS', 'Karakter Kenyal', 'Tekstur Clay'],
    category: 'taktil',
    command: 'npx remotion still starter/src/index.ts ClayworldPreview out/clayworld.png',
    prompt: '/audira-motion Cerita animasi stop-motion monster kecil yang melompat kenyal di dunia jamur dan melambaikan tangan.',
    engine: 'Plasticine 15 FPS Stepper Engine',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'toonforge',
    format: 'toonforge',
    kind: 'Cel-Shaded Anime',
    title: 'Aksi Mecha Cel-Shaded & Manga Speed Lines',
    quote: 'Aksi robot mecha tempur meluncur cepat dengan garis kecepatan manga dan semburan plasma kembar.',
    tags: ['Anime Cel-Shaded', 'Manga Speed Lines', 'Semburan Plasma'],
    category: 'taktil',
    command: 'npx remotion still starter/src/index.ts ToonforgePreview out/toonforge.png',
    prompt: '/audira-motion Aksi robot mecha tempur meluncur cepat dengan garis kecepatan manga dan semburan plasma kembar.',
    engine: 'Inverted-Hull Contour Shading',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'brickcraft',
    format: 'brickcraft',
    kind: 'Toy Bricks 3D',
    title: 'Balok Mainan Plastik & Stop-Motion Meja',
    quote: 'Animasi stop-motion balok plastik di atas meja kayu, potongan balok terbang dan snap presisi membentuk rumah kecil.',
    tags: ['Modular Studs', 'Snap Assembly', 'Tabletop Toy'],
    category: 'taktil',
    command: 'npx remotion still starter/src/index.ts BrickcraftPreview out/brickcraft.png',
    prompt: '/audira-motion Animasi stop-motion balok plastik di atas meja kayu, potongan balok terbang dan snap presisi membentuk rumah kecil.',
    engine: 'Interlocking Stud Snap Engine',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. DUNIA GEOMETRIS & ALAM (3 Gaya)
  // ─────────────────────────────────────────────────────────────
  {
    file: 'voxelverse',
    format: 'voxelverse',
    kind: '3D Voxel World',
    title: 'Miniatur Kota Voxel Malam Hari Berhujan',
    quote: 'Kota mini voxel saat malam hujan, robot pengantar membawa lentera bersinar. Ada VO MP3.',
    tags: ['Voxel Miniatur', 'Pencahayaan Lentera', 'Hujan Partikel'],
    category: 'geometris',
    command: 'npx remotion still starter/src/index.ts VoxelversePreview out/voxelverse.png',
    prompt: '/audira-motion Kota mini voxel saat malam hujan, robot pengantar membawa lentera bersinar. Ada VO MP3.',
    engine: 'Raytraced Voxel Chunk Engine',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'worldforge',
    format: 'worldforge',
    kind: 'Cinematic 3D World',
    title: 'Eksplorasi Planet & Samudra Bawah Kubah Kaca',
    quote: 'Kota futuristik di dasar samudra dengan kubah kaca raksasa dan terowongan bercahaya. Ini file VO-nya.',
    tags: ['3D Orbit World', 'Kubah Kaca', 'Eksplorasi Planet'],
    category: 'geometris',
    command: 'npx remotion still starter/src/index.ts WorldforgePreview out/worldforge.png',
    prompt: '/audira-motion Kota futuristik di dasar samudra dengan kubah kaca raksasa dan terowongan bercahaya. Ini file VO-nya.',
    engine: 'Cinematic Orbit Trajectory Engine',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'polyverse',
    format: 'polyverse',
    kind: 'Low-Poly Diorama',
    title: 'Pulau Melayang Low-Poly Minimalis & Fajar Pastel',
    quote: 'Pulau melayang low-poly minimalis dengan pohon pinus bergoyang, sungai berkilau, dan fajar pastel.',
    tags: ['Low-Poly Faceted', 'Pulau Melayang', 'Fajar Pastel'],
    category: 'geometris',
    command: 'npx remotion still starter/src/index.ts PolyversePreview out/polyverse.png',
    prompt: '/audira-motion Pulau melayang low-poly minimalis dengan pohon pinus bergoyang, sungai berkilau, dan fajar pastel.',
    engine: 'Faceted Flat-Shading Lighting',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. SAINS, MEDIS & GEOGRAFI (3 Gaya)
  // ─────────────────────────────────────────────────────────────
  {
    file: 'nanoforge',
    format: 'nanoforge',
    kind: 'Molecular Nanotech',
    title: 'Heliks Ganda DNA & Mikroskop Cryo-EM 3D',
    quote: 'Sains mikroskopis 3D heliks ganda DNA bersinar dengan pasangan basa berputar dan vesikel sel berdenyut.',
    tags: ['DNA Double Helix', 'Cryo-EM Nanotech', 'Brownian Dynamics'],
    category: 'sains',
    command: 'npx remotion still starter/src/index.ts NanoforgePreview out/nanoforge.png',
    prompt: '/audira-motion Sains mikroskopis 3D heliks ganda DNA bersinar dengan pasangan basa berputar dan vesikel sel berdenyut.',
    engine: 'Brownian Molecular Simulation',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'inkstory',
    format: 'inkstory',
    kind: 'Sumi-e Ink Wash',
    title: 'Lukisan Tinta Cina Shan Shui & Kaligrafi 3D',
    quote: 'Lukisan kaligrafi tinta Cina 3D di atas kertas beras tua dengan pegunungan Shan Shui dan cap stempel merah.',
    tags: ['Sumi-e Ink Wash', 'Xuan Paper 3D', 'Shan Shui Mist'],
    category: 'sains',
    command: 'npx remotion still starter/src/index.ts InkstoryPreview out/inkstory.png',
    prompt: '/audira-motion Lukisan kaligrafi tinta Cina 3D di atas kertas beras tua dengan pegunungan Shan Shui dan cap stempel merah.',
    engine: 'Dynamic Ink Ribbon Shading',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'lidarforge',
    format: 'lidarforge',
    kind: 'LiDAR Point Cloud',
    title: 'Survei Drone LiDAR 3D & Titik Awan Elevasi',
    quote: 'Survei drone LiDAR 3D titik awan (point cloud) ketinggian tanah, tirai laser menyapu lembah, telemetri GPS.',
    tags: ['Elevation Bathymetry', 'Laser Sweep', 'GPS Telemetry'],
    category: 'sains',
    command: 'npx remotion still starter/src/index.ts LidarforgePreview out/lidarforge.png',
    prompt: '/audira-motion Survei drone LiDAR 3D titik awan (point cloud) ketinggian tanah, tirai laser menyapu lembah, telemetri GPS.',
    engine: 'Geospatial Point Cloud Colormap',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. TEKNOLOGI TINGGI & KOMERSIAL (4 Gaya)
  // ─────────────────────────────────────────────────────────────
  {
    file: 'cyberforge',
    format: 'cyberforge',
    kind: 'Sci-Fi Hologram',
    title: 'Hologram Inti Kuantum AI & Telemetri HUD',
    quote: 'Animasi hologram 3D inti kuantum AI dengan lingkaran telemetri HUD berputar dan grid neon siber.',
    tags: ['Quantum Core', 'HUD Telemetry', 'Neon Cyber Grid'],
    category: 'komersial',
    command: 'npx remotion still starter/src/index.ts CyberforgePreview out/cyberforge.png',
    prompt: '/audira-motion Animasi hologram 3D inti kuantum AI dengan lingkaran telemetri HUD berputar dan grid neon siber.',
    engine: 'Additive Emissive Shader Core',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'precision',
    format: 'precision',
    kind: 'Exploded View CMF',
    title: 'Iklan Produk Mewah 3D & Komponen Titanium',
    quote: 'Iklan 3D jam tangan mekanik mewah, close-up titanium dan roda gigi meledak terurai lalu menyatu lagi.',
    tags: ['Exploded View', 'CMF Titanium', 'Lighting Komersial'],
    category: 'komersial',
    command: 'npx remotion still starter/src/index.ts PrecisionPreview out/precision.png',
    prompt: '/audira-motion Iklan 3D jam tangan mekanik mewah, close-up titanium dan roda gigi meledak terurai lalu menyatu lagi.',
    engine: 'Hard-Surface CMF Studio Rig',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'glasscraft',
    format: 'glasscraft',
    kind: 'Spatial Glassmorphism',
    title: 'Prisma Kaca Refraktif & Liquid Glass VisionOS',
    quote: 'Kartu kaca buram (frosted glass) melayang, pembiasan prisma spektrum pelangi, dan tetesan kristal cair.',
    tags: ['Liquid Glass', 'Prisma Spektrum', 'Frosted Transmission'],
    category: 'komersial',
    command: 'npx remotion still starter/src/index.ts GlasscraftPreview out/glasscraft.png',
    prompt: '/audira-motion Kartu kaca buram (frosted glass) melayang, pembiasan prisma spektrum pelangi, dan tetesan kristal cair.',
    engine: 'Physical Transmission & Dispersion',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
  {
    file: 'circuitforge',
    format: 'circuitforge',
    kind: 'Macro PCB 3D',
    title: 'Makroskopik Motherboard PCB & Arus Elektron Amber',
    quote: 'Sirkuit motherboard PCB 3D makro dengan jalur tembaga presisi, chip BGA silikon, dan aliran pulsa listrik amber.',
    tags: ['Motherboard PCB', 'Jalur Tembaga', 'Pulsa Elektron'],
    category: 'komersial',
    command: 'npx remotion still starter/src/index.ts CircuitforgePreview out/circuitforge.png',
    prompt: '/audira-motion Sirkuit motherboard PCB 3D makro dengan jalur tembaga presisi, chip BGA silikon, dan aliran pulsa listrik amber.',
    engine: 'Octilinear PCB Trace Engine',
    author: 'Agus Dwi Rianto (AUDIRA MDA)',
  },
];

export const FORMAT_CARDS: Array<{ reel: ReelSample; name: string; pitch: string; topics: string[] }> = REELS.map(
  (r) => ({
    reel: r,
    name: r.kind,
    pitch: r.quote,
    topics: [r.tags[0], r.tags[1], r.tags[2]],
  })
);

export const MOOD_SAMPLES: Record<MoodType, { line: string; verdict: string }> = {
  calm: { line: 'Struktur rangka titanium terpasang presisi dengan toleransi sub-milimeter.', verdict: 'Audira yang tenang dan kalkulatif.' },
  warm: { line: 'Setiap lipatan kertas ini menyimpan kehangatan sentuhan tangan manusia.', verdict: 'Audira yang emosional dan bercerita.' },
  motivational: { line: 'Dari tanah kosong menjadi mahakarya arsitektur modern berkelas dunia.', verdict: 'Audira yang membakar semangat eksplorasi.' },
  hyped: { line: 'Arus data kuantum melonjak 400 Teraflops! Perhatikan rotasi cincin telemetri HUD!', verdict: 'Audira yang eksplosif dan penuh energi masa depan.' },
  frustrated: { line: 'Toleransi 0.5 mikron meleset di poros gear ketiga. Kalibrasi ulang sekarang juga.', verdict: 'Audira perfeksionis standar industri manufaktur.' },
  angry: { line: 'Suhu inti reaktor melampaui batas aman! Segera buka ventilasi pendingin cair!', verdict: 'Audira darurat tensi tinggi.' },
  rude: { line: 'Ini bukan simulasi fisika sembarangan. Prompt halusinasi murahanmu tidak berlaku di sini.', verdict: 'Audira tegas menolak generic AI slop.' },
};
