import { MotionFormat, StoryboardLine } from '@/types/motion';
import { EXTRA_THEMES } from '@/lib/templates-extra';

export type Role = StoryboardLine['speakerRole'];

export const FORMAT_BRIEF: Record<MotionFormat, { cast: string; roles: [Role, Role] }> = {
  character_banter: {
    cast:
      'CHARACTER REEL. A = manusia dengan ide/masalah. B = karakter AI orisinal (nama buatan sendiri, misalnya Nara, Bubo, Kiko; jangan pakai nama produk/merek AI nyata) yang menanggapi sesuai mood. Dialog bergantian A dan B, 8-12 baris.',
    roles: ['human', 'ai'],
  },
  whiteboard: {
    cast:
      'WHITEBOARD. Semua baris dibawakan A = narator, B hanya nama konsep/diagram (tidak berbicara). Setiap baris adalah satu langkah cerita yang bisa digambar spidol, ada payoff di akhir. 6-9 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  pixel_rpg: {
    cast:
      'LIFE AS A GAME (RPG 16-bit). A = hero (si pengguna), B = boss (masalah sehari-hari yang dipersonifikasi). Gunakan istilah game: "WILD BOSS APPEARS", serangan, HP, item, level up. Bergantian A dan B, 7-10 baris.',
    roles: ['hero', 'boss'],
  },
  breaking_news: {
    cast:
      'BREAKING NEWS. A = news anchor yang melaporkan kejadian kecil sehari-hari dengan wajah serius seolah berita nasional. B = saksi/narasumber atau bukti chat. Mayoritas baris A, sisipkan 2-3 baris B. 7-10 baris.',
    roles: ['narrator', 'human'],
  },
  clean_explainer: {
    cast:
      'EXPLAINER. A = presenter yang membedah topik langkah demi langkah dengan angka konkret yang bisa dicek. Hindari klaim spesifik yang tidak pasti benar; kalau ragu, pakai pernyataan umum. 6-9 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  docu_story: {
    cast:
      'TRUE STORY / DOKUMENTER. A = narator dokumenter. Ceritakan kisah nyata sejarah yang terdokumentasi baik, dengan twist yang jarang orang tahu. Jangan mengarang fakta, nama, atau tahun; kalau ide pengguna tidak jelas kebenarannya, ceritakan versi yang aman dan umum. 7-10 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  kinetic_type: {
    cast:
      'KINETIC TYPOGRAPHY. A = satu narator. Setiap baris tampil sebagai kata-kata raksasa di layar, jadi tulis kalimat pendek yang tajam dan bisa berdiri sendiri seperti quote (4-9 kata). 4-7 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  chat_story: {
    cast:
      'CHAT STORY. Cerita lewat layar chat. A = pemilik HP ("Kamu"), B = lawan chat dengan nama orang. Tulis seperti pesan chat asli: singkat, santai, satu pesan per baris, ada eskalasi dan twist di pesan terakhir. 5-9 baris, bergantian A dan B (boleh dua pesan berturut-turut).',
    roles: ['human', 'human'],
  },
  top_list: {
    cast:
      'TOP LIST / COUNTDOWN. A = narator. Setiap baris adalah SATU item peringkat, diurutkan dari nomor terbesar ke nomor 1 (paling penting di akhir). Tiap baris menyebut itemnya langsung di awal kalimat. 4-6 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  quiz: {
    cast:
      'KUIS / TRIVIA. A = pembawa kuis. Baris 1 = pertanyaan. Baris 2-4 = tiga pilihan jawaban, satu per baris, singkat. Baris terakhir = jawaban yang benar beserta alasan singkat. Faktanya harus benar dan bisa dicek. Tepat 5 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  podcast_clip: {
    cast:
      'PODCAST CLIP. A = host, B = co-host atau tamu (nama orang biasa). Obrolan natural seperti potongan podcast, ada satu insight berguna di akhir. 4-8 baris bergantian A dan B.',
    roles: ['human', 'human'],
  },
  comic_strip: {
    cast:
      'KOMIK / WEBTOON. A = tokoh utama, B = tokoh lain atau benda/ide yang dipersonifikasi. Setiap baris adalah satu panel dengan balon dialog pendek (maks 10 kata) dan ada kejutan lucu di panel terakhir. Gunakan emosi shocked/angry/hyped untuk momen efek suara. 4-6 baris.',
    roles: ['human', 'human'],
  },
  terminal_hack: {
    cast:
      'TERMINAL HACKER. A = pengguna yang mengetik perintah di terminal (huruf kecil, gaya perintah singkat), B = SISTEM yang membalas seperti output komputer. Lucu karena sistemnya menjawab masalah sehari-hari dengan gaya teknis. 4-8 baris bergantian A dan B. Jangan berisi perintah peretasan sungguhan.',
    roles: ['human', 'ai'],
  },
  versus: {
    cast:
      'VERSUS. Dua kubu beradu argumen di layar terbelah. A dan B adalah nama kubu (misalnya "Tim Aduk" vs "Tim Rapi"). Bergantian A dan B, tiap baris satu argumen pendek yang makin pedas, tanpa menghina kelompok nyata. 4-8 baris.',
    roles: ['human', 'human'],
  },
  map_journey: {
    cast:
      'RUTE PERJALANAN. A = narator pemandu. Setiap baris adalah SATU titik perhentian berurutan di rute nyata (sebut nama tempatnya di awal kalimat), tempat dan urutannya masuk akal secara geografis. 3-6 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  recipe_steps: {
    cast:
      'RESEP / TUTORIAL. A = pemandu. Setiap baris adalah SATU langkah yang bisa langsung diikuti, diawali kata kerja (Rebus, Tumis, Potong...). Takaran dan waktu harus masuk akal dan aman. 4-7 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  social_post: {
    cast:
      'UTAS SOSMED. A = pemilik utas (nama orang), B = orang lain yang membalas. Baris pertama diawali "Utas:" lalu inti ceritanya. Tiap baris satu postingan pendek, B membalas sekali atau dua kali dengan twist. 4-7 baris.',
    roles: ['human', 'human'],
  },
  receipt: {
    cast:
      'STRUK BELANJA. A = narator. Setiap baris adalah SATU item pengeluaran dan WAJIB menyebut harganya dalam format "Rp 25.000" atau "45 ribu", supaya total bisa dihitung. Baris terakhir boleh tanpa harga sebagai punchline. 4-6 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  retro_vhs: {
    cast:
      'RETRO VHS. A = narator bernada nostalgia, bercerita tentang kenangan masa lalu (era 90-an atau 2000-an) seperti rekaman video rumahan. Kalimat hangat dan konkret, ditutup dengan kalimat yang menyentuh. 4-6 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  sticky_notes: {
    cast:
      'PAPAN CATATAN. A = narator. Setiap baris adalah SATU tips singkat (maks 8 kata) yang ditulis di catatan tempel, langsung bisa dipraktikkan. 4-6 baris, speaker selalu A.',
    roles: ['narrator', 'narrator'],
  },
  roblox_story: {
    cast:
      'ROBLOX OBBY & SKITS. A = Noob (pemain pemula kocak yang sering gagal obby), B = Pro (pemain jago/bacon hair yang suka roasting). Gunakan istilah Roblox: "OOF", "Robux", "Tower of Hell", "Speed coil", "Gamepass", "Skill issue", "Stage". Bergantian A dan B, 5-8 baris.',
    roles: ['human', 'human'],
  },
};

export const SYSTEM = `Kamu penulis naskah reels vertikal (Instagram Reels, TikTok, Shorts) untuk studio AUDIRA MOTION, berbahasa Indonesia gaul yang natural (lo/gue boleh kalau cocok dengan karakter).

Aturan retensi:
- Baris pertama adalah hook: langsung ke konflik atau klaim yang bikin berhenti scroll. Jangan basa-basi, jangan menyapa penonton.
- Tiap baris pendek, enak diucapkan TTS, maksimal 16 kata. Tulis angka kecil dengan huruf jika lebih natural diucapkan.
- Ada eskalasi dan satu punchline/twist sebelum akhir.
- commentMagnetHook adalah pertanyaan pilihan yang memancing orang berdebat di komentar.
- Tanpa emoji, tanpa hashtag, tanpa arahan panggung di dalam teks.
- Jangan memakai nama orang terkenal yang masih hidup atau merek dagang sebagai karakter.`;


export const FORMAT_THEMES: Record<MotionFormat, { primaryColor: string; accentColor: string; backgroundColor: string }> = {
  character_banter: { primaryColor: '#c2410c', accentColor: '#ffe9df', backgroundColor: '#141413' },
  whiteboard: { primaryColor: '#0284c7', accentColor: '#38bdf8', backgroundColor: '#fbfbf8' },
  pixel_rpg: { primaryColor: '#10b981', accentColor: '#facc15', backgroundColor: '#0b1026' },
  breaking_news: { primaryColor: '#dc2626', accentColor: '#facc15', backgroundColor: '#0a0a0f' },
  clean_explainer: { primaryColor: '#6366f1', accentColor: '#a5b4fc', backgroundColor: '#0b0b1a' },
  docu_story: { primaryColor: '#d97706', accentColor: '#e8dcc0', backgroundColor: '#0c0a08' },
  ...EXTRA_THEMES,
};

export const IDEA_STARTERS: Record<MotionFormat, string[]> = {
  character_banter: [
    'Ash mau resign jadi streamer padahal followers-nya baru 40',
    'Dita mau liburan ke Bali cuma modal 1,5 juta dan nol rencana',
    'Bima beli kopi 45 ribu tiap hari tapi bilang lagi nabung rumah',
  ],
  whiteboard: [
    'Kenapa kita selalu menunda kerjaan sampai mepet deadline',
    'Kenapa diam bisa terasa lebih nyaring dari teriakan',
    'Cara kerja bunga majemuk dijelaskan pakai seblak',
  ],
  pixel_rpg: [
    'Boss fight: meeting dadakan jam 4.58 sore',
    'Hari pertama belajar nyetir mobil manual di tanjakan',
    'Pindah kos dan harus angkut lemari sendirian',
  ],
  breaking_news: [
    'Fenomena "aku OTW" padahal baru selesai mandi',
    'Grup WA keluarga heboh gara-gara foto kulkas kosong',
    'Tetangga diduga menyimpan 12 kantong plastik di dalam kantong plastik',
  ],
  clean_explainer: [
    'Biaya tersembunyi di balik ongkir gratis',
    'Kenapa cicilan 0% tetap bisa bikin rugi',
    'Tiga angka yang paling menentukan reels kamu ditonton',
  ],
  docu_story: [
    'Kisah Typhoid Mary, pembawa penyakit yang tak pernah sakit',
    'Letusan Tambora 1815 dan tahun tanpa musim panas',
    'Laika, anjing pertama yang mengorbit Bumi',
  ],
  kinetic_type: [
    'Berhenti menunggu mood untuk mulai kerja',
    'Gaji naik tapi gaya hidup ikut naik',
    'Kenapa kamu nggak perlu disukai semua orang',
  ],
  chat_story: [
    'Teman pinjam seratus ribu dengan alasan makin aneh',
    'Mantan tiba-tiba chat "hai" jam dua pagi',
    'Grup arisan ribut soal siapa yang belum bayar',
  ],
  top_list: [
    '5 kebiasaan kecil yang diam-diam bikin boros',
    '5 kalimat yang bikin wawancara kerja gagal',
    '4 tanda kamu butuh libur sekarang juga',
  ],
  quiz: [
    'Planet paling panas di tata surya',
    'Hewan darat tercepat di dunia',
    'Ibu kota negara Australia',
  ],
  podcast_clip: [
    'Kerja remote itu enak, katanya',
    'Kenapa susah banget nabung di umur 20-an',
    'Haruskah kita membalas chat kantor di malam hari',
  ],
  comic_strip: [
    'Hari pertama diet langsung digoda martabak',
    'Alarm berbunyi lima kali dan semuanya dikalahkan',
    'Kucing yang merasa dirinya pemilik rumah',
  ],
  terminal_hack: [
    'Mencari file skripsi yang benar-benar final',
    'Mencoba menghapus rasa malas lewat terminal',
    'Mengecek sisa gaji di tanggal tua',
  ],
  versus: [
    'Bubur diaduk vs tidak diaduk',
    'Mandi pagi vs mandi malam',
    'Tim balas chat cepat vs tim balas besok',
  ],
  map_journey: [
    '3 hari keliling Yogyakarta dengan budget hemat',
    'Rute kuliner malam di Bandung',
    'Road trip Jakarta ke Bali lewat jalur darat',
  ],
  recipe_steps: [
    'Mie goreng telur 10 menit ala anak kos',
    'Cara bikin es kopi susu gula aren di rumah',
    'Cara rapikan lemari baju dalam 15 menit',
  ],
  social_post: [
    'Gaji pertama habis di hari ketiga',
    'Pertama kali jadi panitia nikahan sepupu',
    'Interview kerja yang berakhir canggung',
  ],
  receipt: [
    'Belanja bulanan yang tanpa sadar membengkak',
    'Biaya nongkrong satu malam di kafe',
    'Rincian biaya kos bulan pertama',
  ],
  retro_vhs: [
    'Liburan keluarga naik mobil tahun 90-an',
    'Main di warnet sepulang sekolah',
    'Lebaran di rumah nenek waktu kecil',
  ],
  sticky_notes: [
    '6 cara fokus saat kerja dari rumah',
    '5 kebiasaan pagi yang bikin hari lebih ringan',
    '4 tips hemat belanja bulanan',
  ],
  roblox_story: [
    'Noob minta 1000 Robux ke Pro demi beli gamepass di Obby tersulit',
    'Drama kepleset lava di stage 99 Tower of Hell padahal dikit lagi tamat',
    'Tipe-tipe player Roblox saat ketemu hacker di server publik',
  ],
};

// A self-contained prompt for any chat assistant: it returns storyboard JSON that
// engine/build-reel.mjs renders as-is.
export function buildCopyPrompt(format: MotionFormat, mood: { id: string; label: string; direction: string }, idea: string) {
  const [roleA, roleB] = FORMAT_BRIEF[format].roles;
  const theme = FORMAT_THEMES[format];
  return `${SYSTEM}

FORMAT
${FORMAT_BRIEF[format].cast}

MOOD: ${mood.label}
${mood.direction}

IDE
${idea.trim() || '(isi ide kamu di sini)'}

OUTPUT
Balas HANYA dengan satu blok JSON valid (tanpa penjelasan) dengan bentuk persis seperti ini:
{
  "id": "reel-<kata-kunci-pendek>",
  "title": "<judul maks 8 kata>",
  "concept": "<ide di atas>",
  "format": "${format}",
  "mood": "${mood.id}",
  "fps": 30,
  "durationSec": 0,
  "locationName": "<latar maks 4 kata>",
  "characters": {
    "characterA": { "name": "<nama A>", "title": "<label 2-3 kata>", "avatar": "a" },
    "characterB": { "name": "<nama B>", "title": "<label 2-3 kata>", "avatar": "b" }
  },
  "visualTheme": ${JSON.stringify(theme)},
  "commentMagnetHook": "<pertanyaan penutup maks 12 kata>",
  "lines": [
    { "id": "l1", "speaker": "<nama A atau B, sama persis>", "speakerRole": "<${roleA} untuk A, ${roleB} untuk B>", "text": "<maks 16 kata>", "emotion": "<neutral|hyped|angry|shocked|smug|thoughtful|sarcastic>", "startSec": 0, "durationSec": 0, "words": [] }
  ]
}
`;
}

export type TargetAIModel = 'claude' | 'chatgpt' | 'gemini' | 'deepseek';
export type DurationTarget = '15s' | '30s' | '45s';
export type SlangStyle = 'jakarta_gaul' | 'profesional' | 'genz_slang' | 'english_viral';

export interface AdvancedPromptOptions {
  format: MotionFormat;
  mood: { id: string; label: string; direction: string };
  idea: string;
  targetModel: TargetAIModel;
  duration: DurationTarget;
  slang: SlangStyle;
  charAName?: string;
  charBName?: string;
}

export function buildAdvancedPrompt(opts: AdvancedPromptOptions): string {
  const [roleA, roleB] = FORMAT_BRIEF[opts.format].roles;
  const theme = FORMAT_THEMES[opts.format];
  const charA = opts.charAName?.trim() || (opts.format === 'roblox_story' ? 'Noob Blox' : opts.format === 'pixel_rpg' ? 'Player Hero' : 'Ash');
  const charB = opts.charBName?.trim() || (opts.format === 'roblox_story' ? 'Pro Bacon' : opts.format === 'pixel_rpg' ? 'Reality Boss' : 'Nara');

  const lineCountGuide = opts.duration === '15s' 
    ? 'Tepat 4-5 baris dialog singkat, total durasi 14 detik.' 
    : opts.duration === '45s' 
    ? '10-14 baris dialog mendalam dengan 2 eskalasi dan twist.' 
    : '7-9 baris dialog natural, total durasi 25-30 detik.';

  let toneInstruction = '';
  if (opts.slang === 'profesional') {
    toneInstruction = 'Gunakan Bahasa Indonesia baku, santun, lugas, dan profesional (Anda/Saya atau penuturan formal, cocok untuk B2B/Edukasi).';
  } else if (opts.slang === 'genz_slang') {
    toneInstruction = 'Gunakan Bahasa Gen-Z kekinian campur slang internet (POV, skill issue, rizz, spill, no counter, OOF, gacor).';
  } else if (opts.slang === 'english_viral') {
    toneInstruction = 'Use English (conversational viral TikTok/Reels slang, witty, punchy, no filler words).';
  } else {
    toneInstruction = 'Gunakan Bahasa Indonesia gaul santai khas Jakarta/anak muda (lo/gue, ceplas-ceplos, natural).';
  }

  const cleanIdea = (opts.idea || 'Ide cerita viral').replace(/"/g, '\\"');
  const schemaExample = `{
  "id": "reel-${Date.now()}",
  "title": "<judul maks 8 kata>",
  "concept": "${cleanIdea}",
  "format": "${opts.format}",
  "mood": "${opts.mood.id}",
  "fps": 30,
  "durationSec": 0,
  "locationName": "<latar tempat maks 4 kata>",
  "characters": {
    "characterA": { "name": "${charA}", "title": "<label profesi/karakter>", "avatar": "a" },
    "characterB": { "name": "${charB}", "title": "<label profesi/karakter>", "avatar": "b" }
  },
  "visualTheme": ${JSON.stringify(theme)},
  "commentMagnetHook": "<pertanyaan penutup memicu debat di komentar maks 12 kata>",
  "lines": [
    {
      "id": "line-1",
      "speaker": "${charA}",
      "speakerRole": "${roleA}",
      "text": "<kalimat hook pembuka maksimal 14 kata>",
      "emotion": "hyped",
      "startSec": 0,
      "durationSec": 0,
      "words": []
    }
  ]
}`;

  if (opts.targetModel === 'claude') {
    return `<system_instructions>
Kamu adalah Viral Reel Scriptwriter kelas dunia di studio AUDIRA MOTION.
${SYSTEM}
Aturan Gaya Bahasa: ${toneInstruction}
Pedoman Panjang: ${lineCountGuide}
</system_instructions>

<format_specification>
${FORMAT_BRIEF[opts.format].cast}
Karakter A: ${charA}
Karakter B: ${charB}
Mood Utama: ${opts.mood.label} (${opts.mood.direction})
</format_specification>

<user_idea>
${opts.idea.trim() || 'Buat reel viral tentang dilema hidup sehari-hari'}
</user_idea>

<output_constraint>
Kembalikan HANYA satu blok kode JSON valid sesuai skema berikut. DILARANG menambahkan teks pembuka ("Tentu ini naskahnya..."), dilarang menambahkan teks penutup, dan jangan gunakan markdown di luar \`\`\`json.

${schemaExample}
</output_constraint>`;
  }

  if (opts.targetModel === 'chatgpt') {
    return `[SYSTEM: JSON MODE ACTIVATED]
You are a senior vertical video retention architect for AUDIRA MOTION reels.
Language & Tone: ${toneInstruction}
Length Target: ${lineCountGuide}

[FORMAT RULES]
${FORMAT_BRIEF[opts.format].cast}
Character A: ${charA}
Character B: ${charB}
Mood: ${opts.mood.label} - ${opts.mood.direction}

[REEL IDEA]
${opts.idea.trim() || 'Buat reel viral tentang dilema hidup sehari-hari'}

[OUTPUT FORMAT]
Respond ONLY with a single JSON object. No explanation, no markdown text outside the JSON object:
${schemaExample}`;
  }

  if (opts.targetModel === 'deepseek') {
    return `[NO_THINK] Output ONLY raw valid JSON starting with { and ending with }. Do NOT generate <think> reasoning tags, do NOT add introductory pleasantries.

Task: Generate a viral 9:16 vertical video script for AUDIRA MOTION.
Format: ${FORMAT_BRIEF[opts.format].cast}
Character A: ${charA}
Character B: ${charB}
Tone: ${toneInstruction}
Length: ${lineCountGuide}
Mood: ${opts.mood.label} (${opts.mood.direction})
User Idea: ${opts.idea.trim() || 'Dilema hidup sehari-hari'}

JSON Schema to follow:
${schemaExample}`;
  }

  // Gemini / Default
  return `[SYSTEM DIRECTIVE: AUDIRA MOTION PROMPT GENERATOR]
${SYSTEM}

Tones: ${toneInstruction}
Duration: ${lineCountGuide}

FORMAT:
${FORMAT_BRIEF[opts.format].cast}
Speaker A: ${charA}
Speaker B: ${charB}
Mood: ${opts.mood.label} (${opts.mood.direction})

IDE:
${opts.idea.trim() || 'Buat reel viral tentang dilema hidup sehari-hari'}

OUTPUT:
Balas HANYA dengan JSON valid (tanpa percakapan ramah-tamah):
${schemaExample}`;
}
