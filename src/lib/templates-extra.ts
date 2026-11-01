import { MoodType, SpeakerEmotion, Storyboard, StoryboardLine } from '@/types/motion';

export type ExtraFormat =
  | 'kinetic_type'
  | 'chat_story'
  | 'top_list'
  | 'quiz'
  | 'podcast_clip'
  | 'comic_strip'
  | 'terminal_hack'
  | 'versus'
  | 'map_journey'
  | 'recipe_steps'
  | 'social_post'
  | 'receipt'
  | 'retro_vhs'
  | 'sticky_notes'
  | 'roblox_story'
  | 'what_if_3d'
  | 'zombie_survival'
  | 'how_its_built'
  | 'cosmic_voyage';

type Cast = { name: string; title: string };
type RawLine = [speaker: 'A' | 'B', text: string, emotion: SpeakerEmotion];

function demo(
  format: ExtraFormat,
  opts: {
    title: string;
    concept: string;
    mood: MoodType;
    locationName: string;
    a: Cast;
    b: Cast;
    roles: [StoryboardLine['speakerRole'], StoryboardLine['speakerRole']];
    theme: Storyboard['visualTheme'];
    hook: string;
    lines: RawLine[];
  },
): Storyboard {
  let t = 0.08;
  const lines = opts.lines.map(([who, text, emotion], i) => {
    const start = t;
    const words = text.split(' ').filter(Boolean).map((word) => {
      const d = 0.12 + word.replace(/[^\p{L}\p{N}]/gu, '').length * 0.055;
      const w = { word, start: +t.toFixed(2), end: +(t + d).toFixed(2) };
      t += d + 0.03;
      return w;
    });
    t += 0.14;
    return {
      id: `${format}-${i + 1}`,
      speaker: who === 'A' ? opts.a.name : opts.b.name,
      speakerRole: opts.roles[who === 'A' ? 0 : 1],
      text,
      startSec: +start.toFixed(2),
      durationSec: +(t - start).toFixed(2),
      emotion,
      words,
    };
  });
  return {
    id: `demo-${format}`,
    title: opts.title,
    concept: opts.concept,
    format,
    mood: opts.mood,
    durationSec: +(t + 3.5).toFixed(1),
    fps: 30,
    locationName: opts.locationName,
    characters: { characterA: { ...opts.a, avatar: 'a' }, characterB: { ...opts.b, avatar: 'b' } },
    lines,
    commentMagnetHook: opts.hook,
    visualTheme: opts.theme,
  };
}

export const EXTRA_THEMES: Record<ExtraFormat, Storyboard['visualTheme']> = {
  kinetic_type: { primaryColor: '#ea580c', accentColor: '#facc15', backgroundColor: '#0b0b0b' },
  chat_story: { primaryColor: '#25d366', accentColor: '#e9edef', backgroundColor: '#0b141a' },
  top_list: { primaryColor: '#f43f5e', accentColor: '#fda4af', backgroundColor: '#12060a' },
  quiz: { primaryColor: '#8b5cf6', accentColor: '#facc15', backgroundColor: '#140b2e' },
  podcast_clip: { primaryColor: '#f97316', accentColor: '#fde68a', backgroundColor: '#0c0c10' },
  comic_strip: { primaryColor: '#f472b6', accentColor: '#67e8f9', backgroundColor: '#f4efe1' },
  terminal_hack: { primaryColor: '#4ade80', accentColor: '#fbbf24', backgroundColor: '#030703' },
  versus: { primaryColor: '#2563eb', accentColor: '#dc2626', backgroundColor: '#09090b' },
  map_journey: { primaryColor: '#dc2626', accentColor: '#0ea5e9', backgroundColor: '#e9e3d2' },
  recipe_steps: { primaryColor: '#ea580c', accentColor: '#facc15', backgroundColor: '#fff7ed' },
  social_post: { primaryColor: '#0ea5e9', accentColor: '#8b5cf6', backgroundColor: '#f5f5f4' },
  receipt: { primaryColor: '#dc2626', accentColor: '#78716c', backgroundColor: '#1c1917' },
  retro_vhs: { primaryColor: '#fde047', accentColor: '#22d3ee', backgroundColor: '#000000' },
  sticky_notes: { primaryColor: '#dc2626', accentColor: '#fde047', backgroundColor: '#b88552' },
  roblox_story: { primaryColor: '#00a2ff', accentColor: '#facc15', backgroundColor: '#070b19' },
  what_if_3d: { primaryColor: '#38bdf8', accentColor: '#f59e0b', backgroundColor: '#050c18' },
  zombie_survival: { primaryColor: '#84cc16', accentColor: '#ef4444', backgroundColor: '#0b1307' },
  how_its_built: { primaryColor: '#f59e0b', accentColor: '#10b981', backgroundColor: '#130d07' },
  cosmic_voyage: { primaryColor: '#60a5fa', accentColor: '#e0f2fe', backgroundColor: '#02040a' },
};

export const EXTRA_CATALOG: Array<{
  id: ExtraFormat;
  name: string;
  tagline: string;
  badge: string;
  iconName: string;
  description: string;
  previewColor: string;
}> = [
  { id: 'roblox_story', name: 'Roblox Obby & Skits', tagline: 'Blocky 3D Avatars, Obby Parkour & OOF! Sounds', badge: '🔥 Viral Gen-Z', iconName: 'Box', description: 'Format mega-viral Roblox: Karakter kotak Noob vs Pro berlaga di rintangan Obby parkour, dilengkapi Roblox bubble chat, leaderboard Robux R$, dan sound effect OOF legendaris.', previewColor: '#00a2ff' },
  { id: 'what_if_3d', name: 'What If 3D (Simulation)', tagline: 'Massive Crowd Physics & Disaster Hypotheses', badge: '3.1M TikTok', iconName: 'Users', description: 'Satu pertanyaan hipotetis mustahil dimainkan dalam simulasi 3D berskala epik: kerumunan orang, perhitungan gas/energi live ticker, dan visual sinematik.', previewColor: '#38bdf8' },
  { id: 'zombie_survival', name: 'Zombie Survival', tagline: 'Top-down Tactical Outbreak Map', badge: '260.2K TikTok', iconName: 'Shield', description: 'Simulasi pertahanan bunker top-down hari demi hari: radar infeksi, perimeter lingkaran pohon pelindung, dan survival strategis di ladang terisolasi.', previewColor: '#84cc16' },
  { id: 'how_its_built', name: 'How It\'s Built (3D Cutaway)', tagline: 'Underground Cross-Section Architectural X-Ray', badge: '300K Views', iconName: 'Layers', description: 'Potongan melintang 3D arsitektur: rumah permukaan dibelah mengungkap bunker hidroponik bawah tanah dengan lapisan tanah, pipa udara, dan sayuran segar.', previewColor: '#f59e0b' },
  { id: 'cosmic_voyage', name: 'Long-Form 3D Films', tagline: 'Planetary Science & Cosmic Earth Odyssey', badge: '1.58M YouTube', iconName: 'Compass', description: 'Perjalanan 3D kosmis sinematik: bumi berputar megah di ruang hampa, atmosfer bercahaya, dan skala waktu astronomi yang memukau.', previewColor: '#60a5fa' },
  { id: 'kinetic_type', name: 'Kinetic Typography', tagline: 'Big Bold Words Slamming the Screen', badge: 'Paling Simpel', iconName: 'Type', description: 'Kata-kata raksasa menghantam layar mengikuti suara, latar berganti warna tiap kalimat. Cocok untuk quote dan opini panas.', previewColor: '#ea580c' },
  { id: 'chat_story', name: 'Chat Story', tagline: 'Drama Told Through a Chat Screen', badge: 'Storytime', iconName: 'MessageCircle', description: 'Cerita disampaikan lewat layar chat: bubble masuk satu per satu, status "sedang mengetik", dan notifikasi.', previewColor: '#25d366' },
  { id: 'top_list', name: 'Top List', tagline: 'Countdown From #N to #1', badge: 'Disimpan Orang', iconName: 'ListOrdered', description: 'Hitung mundur peringkat dengan angka raksasa dan baris progres, dari nomor terbesar ke juara.', previewColor: '#f43f5e' },
  { id: 'quiz', name: 'Kuis / Trivia', tagline: 'Question, Options, Timer, Reveal', badge: 'Komen Tinggi', iconName: 'HelpCircle', description: 'Pertanyaan, pilihan jawaban, timer, lalu jawaban terungkap dengan confetti. Penonton menebak di komentar.', previewColor: '#8b5cf6' },
  { id: 'podcast_clip', name: 'Podcast Clip', tagline: 'Two Hosts, Waveform, Captions', badge: 'Talk Show', iconName: 'Mic', description: 'Potongan obrolan dua host dengan avatar yang menyala saat bicara, waveform, dan caption besar.', previewColor: '#f97316' },
  { id: 'comic_strip', name: 'Komik / Webtoon', tagline: 'Panels, Balloons, Sound Effects', badge: 'Unik', iconName: 'BookOpen', description: 'Panel komik ala webtoon yang bergulir ke bawah, balon dialog, dan efek suara "BOOM!" di momen kaget.', previewColor: '#f472b6' },
  { id: 'terminal_hack', name: 'Terminal Hacker', tagline: 'Green Code Typed Live', badge: 'Tech', iconName: 'Terminal', description: 'Layar terminal hijau: perintah dan balasan sistem diketik live dengan kursor berkedip dan efek glitch.', previewColor: '#4ade80' },
  { id: 'map_journey', name: 'Rute Perjalanan', tagline: 'Animated Route With Pins', badge: 'Travel', iconName: 'Map', description: 'Peta bergaya ilustrasi: rute tergambar dari titik ke titik, pin jatuh di tiap tempat, lengkap dengan label.', previewColor: '#dc2626' },
  { id: 'recipe_steps', name: 'Resep / Tutorial', tagline: 'Step Cards, Pot and Progress', badge: 'How-to', iconName: 'ChefHat', description: 'Langkah demi langkah dengan kartu besar, bahan yang jatuh ke panci, dan bar progres.', previewColor: '#ea580c' },
  { id: 'social_post', name: 'Utas Sosmed', tagline: 'Thread of Posts With Climbing Likes', badge: 'Viral', iconName: 'AtSign', description: 'Cerita sebagai utas postingan: kartu muncul berurutan dan jumlah suka terus naik.', previewColor: '#0ea5e9' },
  { id: 'receipt', name: 'Struk Belanja', tagline: 'Receipt Printing Line by Line', badge: 'Keuangan', iconName: 'Receipt', description: 'Struk yang tercetak baris demi baris, harga terbaca otomatis, total di akhir, dan stempel.', previewColor: '#78716c' },
  { id: 'retro_vhs', name: 'Retro VHS', tagline: '90s Home Video Look', badge: 'Nostalgia', iconName: 'Tv', description: 'Rekaman rumahan era 90-an: tulisan PLAY, jam berjalan, garis tracking, dan subtitle kuning.', previewColor: '#fde047' },
  { id: 'sticky_notes', name: 'Papan Catatan', tagline: 'Sticky Notes Pinned to a Cork Board', badge: 'Ide & Tips', iconName: 'StickyNote', description: 'Catatan tempel warna-warni dipaku ke papan gabus, satu catatan per poin.', previewColor: '#fde047' },
  { id: 'versus', name: 'Versus', tagline: 'Split Screen Showdown With Score', badge: 'Debat', iconName: 'Swords', description: 'Layar terbelah dua: dua kubu adu argumen bergantian dengan lencana VS dan skor yang bertambah.', previewColor: '#2563eb' },
];

export const EXTRA_DEMOS: Record<ExtraFormat, Storyboard> = {
  roblox_story: demo('roblox_story', {
    title: 'Noob Minta 1000 Robux Buat Gamepass',
    concept: 'Noob merengek minta Robux ke Pro demi beli gamepass di Obby tersulit',
    mood: 'hyped',
    locationName: 'Tower of Hell (Stage 42)',
    a: { name: 'Noob Blox', title: 'Level 1 Obby Player' },
    b: { name: 'Pro Bacon', title: 'Top 1 Global Obby' },
    roles: ['human', 'human'],
    theme: EXTRA_THEMES.roblox_story,
    hook: 'Kalo lo punya 100.000 Robux, gamepass apa yang langsung lo beli?',
    lines: [
      ['A', 'Bro, bagi 1000 Robux dong! Gue mau beli speed coil di Obby ini!', 'hyped'],
      ['B', 'Skill issue, bro. Di Tower of Hell pake skill murni, bukan Robux!', 'smug'],
      ['A', 'Tapi lava merah di stage empat puluh dua ini nggak ngotak!', 'angry'],
      ['B', 'Loncat pas laser muter, bukan pas lagi bengong. OOF!', 'sarcastic'],
      ['A', 'Yah... kepleset lagi. Suara OOF gue udah seratus kali hari ini!', 'shocked'],
    ],
  }),
  kinetic_type: demo('kinetic_type', {
    title: 'Berhenti Nunggu Mood',
    concept: 'Opini keras soal menunggu motivasi',
    mood: 'motivational',
    locationName: 'Studio Tipografi',
    a: { name: 'Narator', title: 'Suara Utama' },
    b: { name: 'Narator', title: 'Suara Utama' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.kinetic_type,
    hook: 'Kamu tim nunggu mood atau tim jalan dulu?',
    lines: [
      ['A', 'Motivasi itu bukan bensin.', 'hyped'],
      ['A', 'Motivasi itu bonus yang datang setelah kamu mulai.', 'thoughtful'],
      ['A', 'Orang yang menunggu mood akan menunggu selamanya.', 'angry'],
      ['A', 'Mulai lima menit. Sisanya ikut sendiri.', 'hyped'],
    ],
  }),
  chat_story: demo('chat_story', {
    title: 'Pinjam Seratus, Katanya',
    concept: 'Teman pinjam uang dengan alasan yang makin aneh',
    mood: 'frustrated',
    locationName: 'WhatsApp',
    a: { name: 'Kamu', title: 'Pemilik Saldo' },
    b: { name: 'Doni', title: 'Teman SMA' },
    roles: ['human', 'human'],
    theme: EXTRA_THEMES.chat_story,
    hook: 'Kasih pinjam lagi atau blokir sekarang?',
    lines: [
      ['B', 'Bro, pinjam seratus dulu dong. Darurat banget.', 'neutral'],
      ['A', 'Darurat apa? Minggu lalu juga darurat.', 'sarcastic'],
      ['B', 'Kucing gue ulang tahun. Harus ada kue.', 'thoughtful'],
      ['A', 'Lo nggak punya kucing, Don.', 'shocked'],
      ['B', 'Makanya. Gue mau beli kucingnya juga.', 'smug'],
    ],
  }),
  top_list: demo('top_list', {
    title: '5 Kebiasaan yang Diam-diam Bikin Boros',
    concept: 'Peringkat kebiasaan kecil yang menguras dompet',
    mood: 'warm',
    locationName: 'Dompet Kita',
    a: { name: 'Narator', title: 'Pemandu' },
    b: { name: 'Narator', title: 'Pemandu' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.top_list,
    hook: 'Nomor berapa yang paling kamu banget?',
    lines: [
      ['A', 'Langganan aplikasi yang lupa kamu pakai.', 'neutral'],
      ['A', 'Ongkir kecil yang dibayar berkali-kali.', 'thoughtful'],
      ['A', 'Kopi kekinian setiap hari kerja.', 'smug'],
      ['A', 'Checkout tengah malam karena diskon.', 'shocked'],
      ['A', 'Belanja tanpa daftar, cuma ikut perasaan.', 'hyped'],
    ],
  }),
  quiz: demo('quiz', {
    title: 'Kuis: Planet Paling Panas',
    concept: 'Trivia tentang tata surya',
    mood: 'hyped',
    locationName: 'Ruang Kuis',
    a: { name: 'Host', title: 'Pembawa Kuis' },
    b: { name: 'Host', title: 'Pembawa Kuis' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.quiz,
    hook: 'Jawaban kamu tadi apa? Jujur di komentar!',
    lines: [
      ['A', 'Planet mana yang paling panas di tata surya?', 'hyped'],
      ['A', 'Merkurius, paling dekat dengan Matahari.', 'neutral'],
      ['A', 'Venus, yang diselimuti awan tebal.', 'neutral'],
      ['A', 'Mars, si planet merah.', 'neutral'],
      ['A', 'Jawabannya Venus. Efek rumah kacanya bikin lebih panas dari Merkurius.', 'shocked'],
    ],
  }),
  podcast_clip: demo('podcast_clip', {
    title: 'Kerja Remote Itu Enak, Katanya',
    concept: 'Dua host membahas sisi lain kerja dari rumah',
    mood: 'warm',
    locationName: 'Eps 07',
    a: { name: 'Raka', title: 'Host' },
    b: { name: 'Sinta', title: 'Co-host' },
    roles: ['human', 'human'],
    theme: EXTRA_THEMES.podcast_clip,
    hook: 'Kamu lebih produktif di rumah atau di kantor?',
    lines: [
      ['A', 'Orang kira kerja remote itu santai seharian.', 'neutral'],
      ['B', 'Padahal batas jam kerja jadi hilang total.', 'thoughtful'],
      ['A', 'Jam sembilan malam masih balas chat kantor.', 'sarcastic'],
      ['B', 'Kuncinya tutup laptop di jam yang sama setiap hari.', 'hyped'],
    ],
  }),
  comic_strip: demo('comic_strip', {
    title: 'Hari Pertama Diet',
    concept: 'Niat diet yang runtuh dalam satu hari',
    mood: 'hyped',
    locationName: 'Dapur Kos',
    a: { name: 'Bima', title: 'Pejuang Diet' },
    b: { name: 'Martabak', title: 'Godaan' },
    roles: ['human', 'human'],
    theme: EXTRA_THEMES.comic_strip,
    hook: 'Diet kamu biasanya tumbang di jam berapa?',
    lines: [
      ['A', 'Mulai hari ini gue diet. Serius.', 'hyped'],
      ['B', 'Martabak keju setengah porsi lagi promo.', 'smug'],
      ['A', 'Setengah porsi itu hampir sama dengan nol.', 'thoughtful'],
      ['A', 'Kok tinggal kotaknya doang?!', 'shocked'],
    ],
  }),
  terminal_hack: demo('terminal_hack', {
    title: 'Mencari File Skripsi Final',
    concept: 'Mahasiswa mencari file skripsi yang benar-benar final',
    mood: 'frustrated',
    locationName: 'Laptop Kampus',
    a: { name: 'Dita', title: 'Mahasiswi' },
    b: { name: 'SISTEM', title: 'Terminal' },
    roles: ['human', 'ai'],
    theme: EXTRA_THEMES.terminal_hack,
    hook: 'Nama file final kamu biasanya apa?',
    lines: [
      ['A', 'cari skripsi final', 'neutral'],
      ['B', 'Ditemukan 14 file bernama final.', 'smug'],
      ['A', 'tampilkan yang paling final', 'thoughtful'],
      ['B', 'skripsi_final_revisi_beneran_final_v9.docx', 'sarcastic'],
      ['A', 'hapus semua kecuali yang itu', 'angry'],
    ],
  }),
  versus: demo('versus', {
    title: 'Bubur Diaduk vs Tidak Diaduk',
    concept: 'Debat abadi cara makan bubur ayam',
    mood: 'rude',
    locationName: 'Gerobak Bubur',
    a: { name: 'Tim Aduk', title: 'Rasa Merata' },
    b: { name: 'Tim Rapi', title: 'Tekstur Terjaga' },
    roles: ['human', 'human'],
    theme: EXTRA_THEMES.versus,
    hook: 'Kamu tim aduk atau tim rapi?',
    lines: [
      ['A', 'Bubur diaduk itu rasanya merata di setiap suap.', 'hyped'],
      ['B', 'Diaduk itu bikin bubur kelihatan seperti adonan semen.', 'smug'],
      ['A', 'Yang dimakan rasanya, bukan fotonya.', 'angry'],
      ['B', 'Kerupuknya jadi lembek. Itu kejahatan.', 'sarcastic'],
    ],
  }),
  map_journey: demo('map_journey', {
    title: '3 Hari Keliling Yogyakarta',
    concept: 'Rute liburan hemat tiga hari di Jogja',
    mood: 'warm',
    locationName: 'Yogyakarta',
    a: { name: 'Narator', title: 'Pemandu' },
    b: { name: 'Narator', title: 'Pemandu' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.map_journey,
    hook: 'Kalau ke Jogja, tempat wajib kamu apa?',
    lines: [
      ['A', 'Hari pertama mulai dari Malioboro saat pagi masih sepi.', 'hyped'],
      ['A', 'Siangnya jalan ke Keraton dan Taman Sari.', 'neutral'],
      ['A', 'Hari kedua kejar matahari terbit di Candi Prambanan.', 'thoughtful'],
      ['A', 'Hari ketiga tutup dengan sunset di Pantai Parangtritis.', 'hyped'],
    ],
  }),
  recipe_steps: demo('recipe_steps', {
    title: 'Mie Goreng Telur 10 Menit',
    concept: 'Resep cepat mie goreng ala anak kos',
    mood: 'hyped',
    locationName: 'Dapur Kos',
    a: { name: 'Chef', title: 'Anak Kos' },
    b: { name: 'Chef', title: 'Anak Kos' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.recipe_steps,
    hook: 'Kamu tim telur dicampur atau telur ceplok?',
    lines: [
      ['A', 'Rebus mie dua menit saja, jangan sampai lembek.', 'neutral'],
      ['A', 'Tumis bawang putih sampai harum.', 'thoughtful'],
      ['A', 'Masukkan telur, orak-arik cepat.', 'hyped'],
      ['A', 'Campur mie, kecap, dan sedikit saus sambal.', 'neutral'],
      ['A', 'Taburi bawang goreng. Selesai dalam sepuluh menit.', 'hyped'],
    ],
  }),
  social_post: demo('social_post', {
    title: 'Utas: Gaji Pertama Habis di Hari Ketiga',
    concept: 'Cerita gaji pertama yang cepat habis',
    mood: 'frustrated',
    locationName: 'Utas',
    a: { name: 'Nadia', title: 'Fresh Graduate' },
    b: { name: 'Bayu', title: 'Teman Kantor' },
    roles: ['human', 'human'],
    theme: EXTRA_THEMES.social_post,
    hook: 'Gaji pertama kamu habis buat apa?',
    lines: [
      ['A', 'Utas: gaji pertama gue habis di hari ketiga. Begini ceritanya.', 'neutral'],
      ['A', 'Hari pertama traktir keluarga. Wajar, kan?', 'thoughtful'],
      ['A', 'Hari kedua beli sepatu karena katanya investasi penampilan.', 'smug'],
      ['B', 'Hari ketiga lo pinjam uang ke gue buat makan siang.', 'sarcastic'],
    ],
  }),
  receipt: demo('receipt', {
    title: 'Belanja Bulanan yang Bocor',
    concept: 'Rincian belanja yang tanpa sadar membengkak',
    mood: 'frustrated',
    locationName: 'Minimarket 24 Jam',
    a: { name: 'Narator', title: 'Kasir' },
    b: { name: 'Narator', title: 'Kasir' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.receipt,
    hook: 'Barang apa yang selalu ikut masuk keranjang kamu?',
    lines: [
      ['A', 'Niatnya cuma beli sabun, Rp 25.000.', 'neutral'],
      ['A', 'Lalu camilan yang lagi promo, 45 ribu.', 'thoughtful'],
      ['A', 'Minuman dingin karena haus, 18 ribu.', 'neutral'],
      ['A', 'Kaos kaki yang kebetulan lucu, 35 ribu.', 'smug'],
      ['A', 'Dan sabunnya? Lupa diambil.', 'shocked'],
    ],
  }),
  retro_vhs: demo('retro_vhs', {
    title: 'Liburan Keluarga Tahun 90-an',
    concept: 'Nostalgia rekaman liburan keluarga',
    mood: 'warm',
    locationName: 'Pantai Utara',
    a: { name: 'Narator', title: 'Kenangan' },
    b: { name: 'Narator', title: 'Kenangan' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.retro_vhs,
    hook: 'Kenangan liburan masa kecil kamu di mana?',
    lines: [
      ['A', 'Dulu liburan berarti satu mobil berisi tujuh orang.', 'thoughtful'],
      ['A', 'Bekal nasi bungkus dan termos teh manis.', 'neutral'],
      ['A', 'Ayah selalu salah jalan, tapi tidak pernah mengaku.', 'smug'],
      ['A', 'Dan entah kenapa, itu liburan terbaik yang pernah ada.', 'thoughtful'],
    ],
  }),
  sticky_notes: demo('sticky_notes', {
    title: '6 Cara Fokus Saat Kerja dari Rumah',
    concept: 'Tips fokus kerja di rumah',
    mood: 'calm',
    locationName: 'Meja Kerja',
    a: { name: 'Narator', title: 'Pemandu' },
    b: { name: 'Narator', title: 'Pemandu' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.sticky_notes,
    hook: 'Tips mana yang paling susah kamu jalani?',
    lines: [
      ['A', 'Pakai baju kerja walau di rumah.', 'neutral'],
      ['A', 'Taruh HP di ruangan lain.', 'thoughtful'],
      ['A', 'Kerjakan tugas tersulit di pagi hari.', 'neutral'],
      ['A', 'Istirahat lima menit setiap jam.', 'thoughtful'],
      ['A', 'Tutup tab yang tidak dipakai.', 'neutral'],
      ['A', 'Matikan laptop di jam yang sama.', 'thoughtful'],
    ],
  }),
  what_if_3d: demo('what_if_3d', {
    title: 'Bagaimana Kalau Seluruh Manusia Kentut Serentak?',
    concept: 'Simulasi fisika 3D hipotetis menghitung volume gas dan dampaknya ke atmosfer bumi',
    mood: 'hyped',
    locationName: 'Ocean Pier 3D Crowd',
    a: { name: 'Dr. Simulasi', title: 'Physics Engine Voice' },
    b: { name: 'Atmosphere HUD', title: 'Live Metric Ticker' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.what_if_3d,
    hook: 'Kalo lo ada di dermaga itu, lo bakal nahan atau ikut ngelepasin?',
    lines: [
      ['A', 'GAS RELEASED: 696.857.638 Liter gas dilepas serentak oleh 8,2 miliar manusia.', 'hyped'],
      ['A', 'Satu pertanyaan mustahil dimainkan dalam simulasi 3D berskala global.', 'thoughtful'],
      ['A', 'Gelombang kejut metana setara 1.500 ton TNT menghantam garis pantai.', 'shocked'],
      ['A', 'Awan gas hijau menyelimuti samudra dan burung camar berhamburan panik.', 'angry'],
      ['A', 'Pertanyaannya: apakah atmosfer bumi bisa selamat dari ledakan ini?', 'smug'],
    ],
  }),
  zombie_survival: demo('zombie_survival', {
    title: 'Hari ke-42: Bertahan dari Serbuan Zombie Farm',
    concept: 'Log survival harian bertahan dari wabah zombie di bunker ladang terisolasi',
    mood: 'frustrated',
    locationName: 'Isolated Farm Perimeter',
    a: { name: 'Survivor Ray', title: 'Base Commander' },
    b: { name: 'Radar Defense', title: 'Detection Grid' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.zombie_survival,
    hook: 'Berapa hari kira-kira lo bisa bertahan di ladang zombie kayak gini?',
    lines: [
      ['A', 'HARI KE-42: Radar mendeteksi 1.420 pergerakan di batas luar perkebunan.', 'angry'],
      ['A', 'Selama kamu tetap berada di dalam zona hijau pohon pelindung, bunker masih aman.', 'thoughtful'],
      ['A', 'Tapi pagar barikade barat mulai retak oleh dorongan kawanan zombie.', 'shocked'],
      ['A', 'Genset listrik tenaga surya hanya tersisa untuk tiga puluh enam jam ke depan.', 'angry'],
      ['A', 'PILIH: Perbaiki barikade malam ini, atau kabur menembus hutan rimba?', 'hyped'],
    ],
  }),
  how_its_built: demo('how_its_built', {
    title: 'Bongkar Rahasia Rumah Kaca Bawah Tanah',
    concept: 'Bedah arsitektur 3D cross-section bunker pertanian bawah tanah anti kiamat',
    mood: 'warm',
    locationName: 'Underground Greenhouse Cutaway',
    a: { name: 'Arch-Builder', title: 'Architectural Analyst' },
    b: { name: 'Subsurface HUD', title: 'Geology & Oxygen Sensor' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.how_its_built,
    hook: 'Kalo lo punya bunker rahasia di bawah rumah, mau diisi apa?',
    lines: [
      ['A', 'Dari permukaan tampak seperti rumah pinggiran kota biasa yang damai.', 'neutral'],
      ['A', 'Tapi tepat dua belas meter di bawah tanah, ada fasilitas pertanian rahasia.', 'hyped'],
      ['A', 'Potongan melintang memperlihatkan tiga lapisan tanah dan filtrasi udara mandiri.', 'thoughtful'],
      ['A', 'Rak hidroponik menghasilkan sayuran segar tanpa perlu seberkas pun sinar matahari.', 'smug'],
      ['A', 'Struktur ini sanggup menyuplai oksigen dan makanan selama lima tahun berturut-turut.', 'hyped'],
    ],
  }),
  cosmic_voyage: demo('cosmic_voyage', {
    title: 'Perjalanan Mengelilingi Khatulistiwa Bumi (Long-Form)',
    concept: 'Odyssey sinematik 3D menghitung kecepatan orbit dan skala waktu kosmik mengelilingi planet bumi',
    mood: 'calm',
    locationName: 'Low Earth Orbit (350km)',
    a: { name: 'Cosmic Voice', title: 'Deep Space Odyssey' },
    b: { name: 'Orbital Tracker', title: 'Telemetry Node' },
    roles: ['narrator', 'narrator'],
    theme: EXTRA_THEMES.cosmic_voyage,
    hook: 'Pernahkah lo ngerasa betapa kerdilnya masalah kita di alam semesta?',
    lines: [
      ['A', 'Keliling khatulistiwa bumi membentang sejauh 40.075 kilometer.', 'thoughtful'],
      ['A', 'Dalam skala film kosmik delapan bulan, perjalanan ini bergerak lebih lambat dari sepeda.', 'neutral'],
      ['A', 'Dari orbit luar angkasa, atmosfer bumi terlihat setipis lapisan kelereng kaca.', 'thoughtful'],
      ['A', 'Semua peradaban, perang, dan jejak cinta manusia berada di titik biru pucat ini.', 'thoughtful'],
      ['A', 'Sejauh apa pun kita melangkah, bumi tetap satu-satunya rumah yang kita punya.', 'thoughtful'],
    ],
  }),
};
