import { MotionFormat, MoodType } from '@/types/motion';

export type ReelSample = { file: string; format: MotionFormat; kind: string; title: string };

export const REELS: ReelSample[] = [
  { file: 'banter', format: 'character_banter', kind: 'Character reel', title: 'Ash mau resign jadi streamer' },
  { file: 'whiteboard', format: 'whiteboard', kind: 'Whiteboard', title: 'Kenapa otak suka menunda' },
  { file: 'pixel_rpg', format: 'pixel_rpg', kind: 'Life as a game', title: 'Boss fight: meeting jam 5 sore' },
  { file: 'breaking_news', format: 'breaking_news', kind: 'Breaking news', title: 'Fenomena "aku OTW"' },
  { file: 'clean_explainer', format: 'clean_explainer', kind: 'Explainer', title: '3 angka algoritma video pendek' },
  { file: 'docu_story', format: 'docu_story', kind: 'Dokumenter', title: 'Contoh gaya arsip & narator' },
  { file: 'kinetic_type', format: 'kinetic_type', kind: 'Kinetic type', title: 'Berhenti nunggu mood' },
  { file: 'chat_story', format: 'chat_story', kind: 'Chat story', title: 'Pinjam seratus, katanya' },
  { file: 'top_list', format: 'top_list', kind: 'Top list', title: '5 kebiasaan bikin boros' },
  { file: 'quiz', format: 'quiz', kind: 'Kuis', title: 'Planet paling panas' },
  { file: 'podcast_clip', format: 'podcast_clip', kind: 'Podcast clip', title: 'Kerja remote itu enak?' },
  { file: 'comic_strip', format: 'comic_strip', kind: 'Komik', title: 'Hari pertama diet' },
  { file: 'terminal_hack', format: 'terminal_hack', kind: 'Terminal', title: 'Cari skripsi final' },
  { file: 'versus', format: 'versus', kind: 'Versus', title: 'Bubur diaduk vs tidak' },
  { file: 'map_journey', format: 'map_journey', kind: 'Rute', title: '3 hari keliling Jogja' },
  { file: 'recipe_steps', format: 'recipe_steps', kind: 'Resep', title: 'Mie goreng 10 menit' },
  { file: 'social_post', format: 'social_post', kind: 'Utas', title: 'Gaji pertama habis di hari ketiga' },
  { file: 'receipt', format: 'receipt', kind: 'Struk', title: 'Belanja bulanan yang bocor' },
  { file: 'retro_vhs', format: 'retro_vhs', kind: 'Retro VHS', title: 'Liburan keluarga 90-an' },
  { file: 'sticky_notes', format: 'sticky_notes', kind: 'Catatan', title: '6 cara fokus kerja di rumah' },
];

export const FORMAT_CARDS: Array<{ reel: ReelSample; name: string; pitch: string; topics: string[] }> = [
  {
    reel: REELS[0],
    name: 'Character reel',
    pitch: 'Dua tokoh mendebat ide kamu. Cepat, lucu, gampang dibagikan.',
    topics: ['Satu orang', 'Dua teman', 'Manusia vs AI'],
  },
  {
    reel: REELS[1],
    name: 'Whiteboard',
    pitch: 'Topik apa pun digambar spidol secara live sambil narator bercerita.',
    topics: ['Sains', 'Produk kamu', 'Sejarah'],
  },
  {
    reel: REELS[2],
    name: 'Life as a game',
    pitch: 'Harimu jadi RPG 16-bit: musuh, HP, serangan, boss, lalu level up.',
    topics: ['Kerja kantor', 'Pindah kos', 'Belajar nyetir'],
  },
  {
    reel: REELS[3],
    name: 'Breaking news',
    pitch: 'Drama kecilmu dilaporkan seperti berita utama. Lengkap dengan chat dan ticker.',
    topics: ['Grup WA keluarga', 'Rebutan kulkas'],
  },
  {
    reel: REELS[4],
    name: 'Explainer',
    pitch: 'Topik rumit dibedah langkah demi langkah, dengan angka yang bisa dicek.',
    topics: ['Dengan presenter', 'Grafik saja'],
  },
  {
    reel: REELS[5],
    name: 'Dokumenter',
    pitch: 'Kisah nyata bergaya dokumenter: foto arsip, narator, dan twist di akhir.',
    topics: ['Sejarah', 'Tokoh lokal'],
  },
  { reel: REELS[6], name: 'Kinetic type', pitch: 'Kata-kata raksasa menghantam layar mengikuti suara. Paling cocok untuk opini dan quote.', topics: ['Opini', 'Motivasi', 'Quote'] },
  { reel: REELS[7], name: 'Chat story', pitch: 'Cerita lewat layar chat: pesan masuk satu per satu, lengkap dengan "sedang mengetik".', topics: ['Drama teman', 'Mantan', 'Grup keluarga'] },
  { reel: REELS[8], name: 'Top list', pitch: 'Hitung mundur dari nomor terbesar ke juara, dengan angka raksasa.', topics: ['Tips', 'Rekomendasi', 'Fakta'] },
  { reel: REELS[9], name: 'Kuis', pitch: 'Pertanyaan, pilihan, timer, lalu jawaban dengan confetti. Penonton menebak di komentar.', topics: ['Trivia', 'Sains', 'Geografi'] },
  { reel: REELS[10], name: 'Podcast clip', pitch: 'Potongan obrolan dua host dengan avatar menyala, waveform, dan caption besar.', topics: ['Talk show', 'Wawancara'] },
  { reel: REELS[11], name: 'Komik', pitch: 'Panel ala webtoon yang bergulir, balon dialog, dan efek suara di momen kaget.', topics: ['Lucu', 'Slice of life'] },
  { reel: REELS[12], name: 'Terminal', pitch: 'Layar terminal hijau yang menjawab masalah sehari-hari dengan gaya komputer.', topics: ['Tech', 'Mahasiswa', 'Kantor'] },
  { reel: REELS[13], name: 'Versus', pitch: 'Layar terbelah dua, dua kubu adu argumen dengan skor yang terus bertambah.', topics: ['Debat', 'Pilihan', 'Selera'] },
  { reel: REELS[14], name: 'Rute perjalanan', pitch: 'Peta ilustrasi dengan rute yang tergambar dan pin di setiap tempat.', topics: ['Travel', 'Kuliner', 'Road trip'] },
  { reel: REELS[15], name: 'Resep / tutorial', pitch: 'Langkah demi langkah dengan kartu besar dan bar progres.', topics: ['Masak', 'DIY', 'Beres-beres'] },
  { reel: REELS[16], name: 'Utas sosmed', pitch: 'Cerita sebagai utas postingan, jumlah suka naik terus.', topics: ['Storytime', 'Curhat'] },
  { reel: REELS[17], name: 'Struk belanja', pitch: 'Struk tercetak baris demi baris, total dihitung otomatis.', topics: ['Keuangan', 'Belanja'] },
  { reel: REELS[18], name: 'Retro VHS', pitch: 'Rekaman rumahan era 90-an: PLAY, jam berjalan, subtitle kuning.', topics: ['Nostalgia', 'Kenangan'] },
  { reel: REELS[19], name: 'Papan catatan', pitch: 'Catatan tempel dipaku ke papan gabus, satu catatan per tips.', topics: ['Tips', 'Checklist'] },
];

export const MOOD_SAMPLES: Record<MoodType, { line: string; verdict: string }> = {
  calm: { line: 'Empat puluh followers itu awal yang baik. Tapi belum cukup buat bayar kos.', verdict: 'Nara yang kalem. Pelan, tapi kena.' },
  warm: { line: 'Gue dukung mimpi lo. Gimana kalau streaming malam dulu, kerja tetap jalan?', verdict: 'Nara yang hangat. Kayak sahabat sendiri.' },
  motivational: { line: 'Semua streamer besar mulai dari nol. Bedanya, mereka nggak resign di hari pertama.', verdict: 'Nara yang memotivasi. Dorong, tapi realistis.' },
  hyped: { line: 'Empat puluh?! Itu satu kelas penuh! Ayo bikin jadwal streaming sekarang juga!', verdict: 'Nara yang hyped. All in, mungkin kebablasan.' },
  frustrated: { line: 'Ya ampun, ini ketiga kalinya bulan ini lo mau resign. Cek dulu saldo lo.', verdict: 'Nara yang frustrasi. Capek, tapi tetap nyimak.' },
  angry: { line: 'Resign besok?! Cicilan motor lo siapa yang bayar, followers lo?!', verdict: 'Nara yang marah. Nada tinggi, fakta tajam.' },
  rude: { line: 'Tiga puluh sembilan itu bot. Satunya lagi nyokap lo.', verdict: 'Nara yang nyolot. Roasting tanpa rem.' },
};
