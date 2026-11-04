import { MotionFormat, MoodType } from '@/types/motion';

export type GalleryCategory = 'gaming' | 'explainer' | 'story';

export type ReelSample = {
  file: string;
  format: MotionFormat;
  kind: string;
  title: string;
  quote: string;
  tags: [string, string, string];
  category: GalleryCategory;
};

export const REELS: ReelSample[] = [
  // 1. Gaming, Skits & Obby (7 gaya)
  {
    file: 'roblox_story',
    format: 'roblox_story',
    kind: 'Roblox Obby',
    title: 'Noob Minta 1000 Robux',
    quote: 'karakter avatar Roblox obby beradu argumen di lintasan parkour lava.',
    tags: ['Roblox Obby', 'Noob vs Pro', 'Sound Effect OOF'],
    category: 'gaming',
  },
  {
    file: 'banter',
    format: 'character_banter',
    kind: 'Character Banter',
    title: 'Ash mau resign jadi streamer',
    quote: 'dua host animasi adu argumen pedas membongkar ilusi gaji streamer pemula.',
    tags: ['Character Banter', 'Dual Avatar', 'Debat Lucu'],
    category: 'gaming',
  },
  {
    file: 'pixel_rpg',
    format: 'pixel_rpg',
    kind: 'Life as a game',
    title: 'Boss fight: meeting jam 5 sore',
    quote: 'petualangan RPG 16-bit menghadapi bos divisi kantor di Jumat sore.',
    tags: ['16-Bit RPG', 'Office Humor', 'Boss Fight'],
    category: 'gaming',
  },
  {
    file: 'breaking_news',
    format: 'breaking_news',
    kind: 'Breaking news',
    title: 'Fenomena "aku OTW"',
    quote: 'siaran berita investigasi kilat membongkar sinyal HP yang ternyata masih rebahan.',
    tags: ['Breaking News', 'Live Ticker', 'Investigasi'],
    category: 'gaming',
  },
  {
    file: 'comic_strip',
    format: 'comic_strip',
    kind: 'Webtoon Comic',
    title: 'Hari pertama diet',
    quote: 'panel webtoon bergulir halus: niat sarapan oatmeal buyar seketika cium gorengan.',
    tags: ['Comic Strip', 'Webtoon Scroll', 'Relatable'],
    category: 'gaming',
  },
  {
    file: 'versus',
    format: 'versus',
    kind: 'Versus Duel',
    title: 'Bubur diaduk vs tidak',
    quote: 'layar split duel: adu argumen kuliner terbesar nusantara dengan live scoring.',
    tags: ['Split Screen', 'Vote Realtime', 'Food War'],
    category: 'gaming',
  },
  {
    file: 'terminal_hack',
    format: 'terminal_hack',
    kind: 'Terminal CLI',
    title: 'Cari skripsi final',
    quote: 'prompt bash hitam hijau menyusuri ribuan folder mencari file revisi terakhir.',
    tags: ['Terminal CLI', 'Green CRT', 'Dev Satire'],
    category: 'gaming',
  },

  // 2. Edukasi & Data Explainer (7 gaya)
  {
    file: 'clean_explainer',
    format: 'clean_explainer',
    kind: 'Data Explainer',
    title: '3 angka algoritma video pendek',
    quote: 'bedah metrik retensi 3 detik pertama dengan grafik persentase data bergerak.',
    tags: ['Data Explainer', 'Algorithm Hack', 'Growth 101'],
    category: 'explainer',
  },
  {
    file: 'whiteboard',
    format: 'whiteboard',
    kind: 'Whiteboard',
    title: 'Kenapa otak suka menunda',
    quote: 'gambar spidol live menggambar interaksi dopamin dan sistem prokrastinasi otak.',
    tags: ['Whiteboard Live', 'Brain Science', 'Hand Drawn'],
    category: 'explainer',
  },
  {
    file: 'kinetic_type',
    format: 'kinetic_type',
    kind: 'Kinetic Type',
    title: 'Berhenti nunggu mood',
    quote: 'tipografi raksasa menabrak layar sinkron sempurna dengan hentakan vokal.',
    tags: ['Kinetic Type', 'Vocal Sync', 'High Impact'],
    category: 'explainer',
  },
  {
    file: 'top_list',
    format: 'top_list',
    kind: 'Top List',
    title: '5 kebiasaan bikin boros',
    quote: 'hitung mundur angka raksasa dari nomor 5 ke nomor 1 dengan efek punchy.',
    tags: ['Top List 3D', 'Finance Tips', 'Countdown'],
    category: 'explainer',
  },
  {
    file: 'quiz',
    format: 'quiz',
    kind: 'Interactive Quiz',
    title: 'Planet paling panas',
    quote: 'pertanyaan interaktif dengan countdown bar, 4 pilihan tombol neon, dan confetti.',
    tags: ['Trivia Quiz', 'Countdown Timer', 'Comment Bait'],
    category: 'explainer',
  },
  {
    file: 'receipt',
    format: 'receipt',
    kind: 'Receipt Struk',
    title: 'Belanja bulanan yang bocor',
    quote: 'struk kasir minimarket tercetak otomatis menjumlahkan pengeluaran tak sadar.',
    tags: ['Thermal Receipt', 'Cashflow Check', 'Printer FX'],
    category: 'explainer',
  },
  {
    file: 'sticky_notes',
    format: 'sticky_notes',
    kind: 'Sticky Notes',
    title: '6 cara fokus kerja di rumah',
    quote: 'papan gabus kantor: catatan warna-warni dipaku satu per satu memuat poin penting.',
    tags: ['Sticky Notes', 'Cork Board', 'Productivity'],
    category: 'explainer',
  },

  // 3. Story, Drama & Dokumenter (7 gaya)
  {
    file: 'chat_story',
    format: 'chat_story',
    kind: 'Chat Story',
    title: 'Pinjam seratus, katanya',
    quote: 'rekaman layar chat WA dengan animasi mengetik, centang biru, dan audio notif.',
    tags: ['Chat Story', 'WhatsApp UI', 'Real Drama'],
    category: 'story',
  },
  {
    file: 'map_journey',
    format: 'map_journey',
    kind: 'Map Journey',
    title: '3 hari keliling Jogja',
    quote: 'garis rute animasi dinamis di atas peta vintage menghubungkan spot kuliner.',
    tags: ['GPS Route', 'Map Journey', 'Travel Reel'],
    category: 'story',
  },
  {
    file: 'docu_story',
    format: 'docu_story',
    kind: 'Dokumenter',
    title: 'Kisah nyata arsip & narator',
    quote: 'foto arsip sejarah bergerak lambat dengan narasi berat dan twist tak terduga.',
    tags: ['Archive Docu', 'Deep Narration', 'Twist Ending'],
    category: 'story',
  },
  {
    file: 'podcast_clip',
    format: 'podcast_clip',
    kind: 'Podcast Clip',
    title: 'Kerja remote itu enak?',
    quote: 'potongan obrolan santai dua podcaster dengan avatar menyala dan visualizer audio.',
    tags: ['Podcast Split', 'Live Waveform', 'Glow Avatar'],
    category: 'story',
  },
  {
    file: 'recipe_steps',
    format: 'recipe_steps',
    kind: 'Recipe Steps',
    title: 'Mie goreng 10 menit',
    quote: 'kartu resep raksasa dengan timer bahan dan sound effect wajan menggoda.',
    tags: ['Cookbook Card', 'Step by Step', 'Quick Recipe'],
    category: 'story',
  },
  {
    file: 'social_post',
    format: 'social_post',
    kind: 'Social Post',
    title: 'Gaji pertama habis di hari ketiga',
    quote: 'tangkapan utas cuitan dengan counter likes dan share yang naik terus.',
    tags: ['Threads UI', 'Viral Post', 'Social Proof'],
    category: 'story',
  },
  {
    file: 'retro_vhs',
    format: 'retro_vhs',
    kind: 'Retro VHS',
    title: 'Liburan keluarga 90-an',
    quote: 'efek pita kaset VHS analog, scanline glitch, subtitle font kuning khas 1994.',
    tags: ['Retro VHS', 'Analog Glitch', 'Nostalgia 90s'],
    category: 'story',
  },
];

export const FORMAT_CARDS: Array<{ reel: ReelSample; name: string; pitch: string; topics: string[] }> = [
  {
    reel: REELS[1], // banter
    name: 'Character reel',
    pitch: 'Dua tokoh mendebat ide kamu. Cepat, lucu, gampang dibagikan.',
    topics: ['Satu orang', 'Dua teman', 'Manusia vs AI'],
  },
  {
    reel: REELS[8], // whiteboard
    name: 'Whiteboard',
    pitch: 'Topik apa pun digambar spidol secara live sambil narator bercerita.',
    topics: ['Sains', 'Produk kamu', 'Sejarah'],
  },
  {
    reel: REELS[2], // pixel_rpg
    name: 'Life as a game',
    pitch: 'Harimu jadi RPG 16-bit: musuh, HP, serangan, boss, lalu level up.',
    topics: ['Kerja kantor', 'Pindah kos', 'Belajar nyetir'],
  },
  {
    reel: REELS[3], // breaking_news
    name: 'Breaking news',
    pitch: 'Drama kecilmu dilaporkan seperti berita utama. Lengkap dengan chat dan ticker.',
    topics: ['Grup WA keluarga', 'Rebutan kulkas'],
  },
  {
    reel: REELS[7], // clean_explainer
    name: 'Explainer',
    pitch: 'Topik rumit dibedah langkah demi langkah, dengan angka yang bisa dicek.',
    topics: ['Dengan presenter', 'Grafik saja'],
  },
  {
    reel: REELS[16], // docu_story
    name: 'Dokumenter',
    pitch: 'Kisah nyata bergaya dokumenter: foto arsip, narator, dan twist di akhir.',
    topics: ['Sejarah', 'Tokoh lokal'],
  },
  { reel: REELS[9], name: 'Kinetic type', pitch: 'Kata-kata raksasa menghantam layar mengikuti suara. Paling cocok untuk opini dan quote.', topics: ['Opini', 'Motivasi', 'Quote'] },
  { reel: REELS[14], name: 'Chat story', pitch: 'Cerita lewat layar chat: pesan masuk satu per satu, lengkap dengan "sedang mengetik".', topics: ['Drama teman', 'Mantan', 'Grup keluarga'] },
  { reel: REELS[10], name: 'Top list', pitch: 'Hitung mundur dari nomor terbesar ke juara, dengan angka raksasa.', topics: ['Tips', 'Rekomendasi', 'Fakta'] },
  { reel: REELS[11], name: 'Kuis', pitch: 'Pertanyaan, pilihan, timer, lalu jawaban dengan confetti. Penonton menebak di komentar.', topics: ['Trivia', 'Sains', 'Geografi'] },
  { reel: REELS[17], name: 'Podcast clip', pitch: 'Potongan obrolan dua host dengan avatar menyala, waveform, dan caption besar.', topics: ['Talk show', 'Wawancara'] },
  { reel: REELS[4], name: 'Komik', pitch: 'Panel ala webtoon yang bergulir, balon dialog, dan efek suara di momen kaget.', topics: ['Lucu', 'Slice of life'] },
  { reel: REELS[6], name: 'Terminal', pitch: 'Layar terminal hijau yang menjawab masalah sehari-hari dengan gaya komputer.', topics: ['Tech', 'Mahasiswa', 'Kantor'] },
  { reel: REELS[5], name: 'Versus', pitch: 'Layar terbelah dua, dua kubu adu argumen dengan skor yang terus bertambah.', topics: ['Debat', 'Pilihan', 'Selera'] },
  { reel: REELS[15], name: 'Rute perjalanan', pitch: 'Peta ilustrasi dengan rute yang tergambar dan pin di setiap tempat.', topics: ['Travel', 'Kuliner', 'Road trip'] },
  { reel: REELS[18], name: 'Resep / tutorial', pitch: 'Langkah demi langkah dengan kartu besar dan bar progres.', topics: ['Masak', 'DIY', 'Beres-beres'] },
  { reel: REELS[19], name: 'Utas sosmed', pitch: 'Cerita sebagai utas postingan, jumlah suka naik terus.', topics: ['Storytime', 'Curhat'] },
  { reel: REELS[12], name: 'Struk belanja', pitch: 'Struk tercetak baris demi baris, total dihitung otomatis.', topics: ['Keuangan', 'Belanja'] },
  { reel: REELS[20], name: 'Retro VHS', pitch: 'Rekaman rumahan era 90-an: PLAY, jam berjalan, subtitle kuning.', topics: ['Nostalgia', 'Kenangan'] },
  { reel: REELS[13], name: 'Papan catatan', pitch: 'Catatan tempel dipaku ke papan gabus, satu catatan per tips.', topics: ['Tips', 'Checklist'] },
  { reel: REELS[0], name: 'Roblox Obby & Skits', pitch: 'Karakter Noob vs Pro di lintasan obby parkour, dilengkapi bubble chat Roblox, Robux R$, dan efek suara OOF!', topics: ['Obby Parkour', 'Noob vs Pro', 'Robux Drama'] },
];

export const MOOD_SAMPLES: Record<MoodType, { line: string; verdict: string }> = {
  calm: { line: 'Empat puluh followers itu awal yang baik. Tapi belum cukup buat bayar kos.', verdict: 'Audira yang kalem. Pelan, tapi kena.' },
  warm: { line: 'Gue dukung mimpi lo. Gimana kalau streaming malam dulu, kerja tetap jalan?', verdict: 'Audira yang hangat. Kayak sahabat sendiri.' },
  motivational: { line: 'Semua streamer besar mulai dari nol. Bedanya, mereka nggak resign di hari pertama.', verdict: 'Audira yang memotivasi. Dorong, tapi realistis.' },
  hyped: { line: 'Empat puluh?! Itu satu kelas penuh! Ayo bikin jadwal streaming sekarang juga!', verdict: 'Audira yang hyped. All in, mungkin kebablasan.' },
  frustrated: { line: 'Ya ampun, ini ketiga kalinya bulan ini lo mau resign. Cek dulu saldo lo.', verdict: 'Audira yang frustrasi. Capek, tapi tetap nyimak.' },
  angry: { line: 'Resign besok?! Cicilan motor lo siapa yang bayar, followers lo?!', verdict: 'Audira yang marah. Nada tinggi, fakta tajam.' },
  rude: { line: 'Tiga puluh sembilan itu bot. Satunya lagi nyokap lo.', verdict: 'Audira yang nyolot. Roasting tanpa rem.' },
};
