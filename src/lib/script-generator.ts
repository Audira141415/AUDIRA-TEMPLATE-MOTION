import { Storyboard, MotionFormat, MoodType, StoryboardLine, SpeakerEmotion } from '@/types/motion';
import { DEMO_STORYBOARDS } from './templates';

function buildWords(text: string, start: number) {
  let t = start;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const d = 0.12 + word.replace(/[^\p{L}\p{N}]/gu, '').length * 0.055;
      const w = { word, start: +t.toFixed(2), end: +(t + d).toFixed(2) };
      t += d + 0.03;
      return w;
    });
}

function makeLine(
  id: string,
  speaker: string,
  role: StoryboardLine['speakerRole'],
  text: string,
  startSec: number,
  durationSec: number,
  emotion: SpeakerEmotion
): StoryboardLine {
  return {
    id,
    speaker,
    speakerRole: role,
    text,
    startSec,
    durationSec,
    emotion,
    words: buildWords(text, startSec),
  };
}

export async function generateStoryboardFromIdea(
  idea: string,
  format: MotionFormat,
  mood: MoodType
): Promise<Storyboard> {
  if (!idea.trim()) {
    return DEMO_STORYBOARDS[format];
  }

  const cleanIdea = idea.trim();
  const words = cleanIdea.split(' ');
  const title = words.slice(0, 7).join(' ') + (words.length > 7 ? '...' : '');

  let speakerAName = 'Ash';
  let speakerBName = 'Audira';
  let location = '24-Hour Neon Diner';
  let commentHook = 'Ketik pendapat lo di kolom komentar: Tim Setuju atau Tim Nolak?';
  let lines: StoryboardLine[] = [];

  if (format === 'what_if_3d') {
    speakerAName = 'Dr. Simulasi';
    speakerBName = 'Atmosphere HUD';
    location = 'Ocean Pier (3D Crowd)';
    commentHook = 'Kalo simulasi ini terjadi nyata besok, lo bakal lari ke mana?';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `GAS RELEASED: 696.857.638 Liter gas dilepas serentak oleh 8,2 miliar manusia.`, 0, 3.2, 'hyped'),
      makeLine('gen-2', speakerAName, 'narrator', `Satu pertanyaan mustahil dimainkan dalam simulasi 3D berskala global: ${cleanIdea}.`, 3.4, 3.5, 'thoughtful'),
      makeLine('gen-3', speakerAName, 'narrator', `Gelombang kejut setara 1.500 ton TNT menghantam garis pantai dan memicu badai metana.`, 7.0, 3.2, 'shocked'),
      makeLine('gen-4', speakerAName, 'narrator', `Pertanyaannya: apakah atmosfer bumi sanggup menahan ledakan gas sebesar ini?`, 10.3, 3.0, 'smug'),
    ];
  } else if (format === 'zombie_survival') {
    speakerAName = 'Survivor Ray';
    speakerBName = 'Radar Defense';
    location = 'Isolated Farm Perimeter';
    commentHook = 'Berapa hari kira-kira lo bisa bertahan hidup di ladang zombie kayak gini?';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `HARI KE-42: Radar mendeteksi 1.420 pergerakan aktif di batas luar perkebunan.`, 0, 3.2, 'angry'),
      makeLine('gen-2', speakerAName, 'narrator', `Selama kamu tetap berada di dalam perimeter pohon pelindung, bunker masih aman.`, 3.4, 3.5, 'thoughtful'),
      makeLine('gen-3', speakerAName, 'narrator', `Tapi pagar barikade barat mulai retak oleh desakan gerombolan zombie mutan.`, 7.0, 3.2, 'shocked'),
      makeLine('gen-4', speakerAName, 'narrator', `PILIH: Perbaiki barikade malam ini, atau kabur menembus hutan rimba?`, 10.3, 3.0, 'hyped'),
    ];
  } else if (format === 'how_its_built') {
    speakerAName = 'Arch-Builder';
    speakerBName = 'Subsurface HUD';
    location = 'Underground Greenhouse Cutaway';
    commentHook = 'Kalo lo punya bunker rahasia di bawah rumah, ruangan apa yang bakal lo buat?';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `Dari permukaan tanah tampak seperti rumah pinggiran kota biasa yang damai.`, 0, 3.2, 'neutral'),
      makeLine('gen-2', speakerAName, 'narrator', `Tapi tepat dua belas meter di bawah tanah, tersembunyi struktur rahasia: ${cleanIdea}.`, 3.4, 3.6, 'hyped'),
      makeLine('gen-3', speakerAName, 'narrator', `Potongan melintang memperlihatkan tiga lapisan tanah dan sistem hidroponik mandiri.`, 7.1, 3.2, 'thoughtful'),
      makeLine('gen-4', speakerAName, 'narrator', `Fasilitas ini sanggup menyuplai oksigen dan tanaman segar selama lima tahun berturut-turut.`, 10.4, 3.0, 'smug'),
    ];
  } else if (format === 'cosmic_voyage') {
    speakerAName = 'Cosmic Voice';
    speakerBName = 'Orbital Tracker';
    location = 'Low Earth Orbit (350km)';
    commentHook = 'Pernahkah lo ngerasa betapa kerdilnya masalah kita di alam semesta?';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `Keliling khatulistiwa bumi membentang sejauh 40.075 kilometer di ruang hampa.`, 0, 3.2, 'thoughtful'),
      makeLine('gen-2', speakerAName, 'narrator', `Dalam skala perjalanan kosmik delapan bulan, perjalanan ini lebih lambat dari sepeda: ${cleanIdea}.`, 3.4, 3.6, 'neutral'),
      makeLine('gen-3', speakerAName, 'narrator', `Dari orbit luar angkasa, atmosfer bumi terlihat setipis lapisan kelereng kaca.`, 7.1, 3.2, 'thoughtful'),
      makeLine('gen-4', speakerAName, 'narrator', `Semua peradaban dan jejak sejarah manusia berada di titik biru pucat ini.`, 10.4, 3.0, 'hyped'),
    ];
  } else if (format === 'roblox_story') {
    speakerAName = 'Noob Blox';
    speakerBName = 'Pro Bacon';
    location = 'Tower of Hell (Obby)';
    commentHook = 'Kalo lo punya 100.000 Robux, gamepass apa yang langsung lo beli?';
    lines = [
      makeLine('gen-1', speakerAName, 'human', `Bro, bagi Robux dong! Gue mau beli speed coil di Obby ini!`, 0, 3.0, 'hyped'),
      makeLine('gen-2', speakerBName, 'human', `Skill issue, bro. Di Obby parkour pake skill murni, bukan Robux!`, 3.2, 3.2, 'smug'),
      makeLine('gen-3', speakerAName, 'human', `Tapi rintangan laser merah di stage ini nggak ngotak!`, 6.5, 3.0, 'angry'),
      makeLine('gen-4', speakerBName, 'human', `Loncat pas laser muter, bukan pas lagi bengong. OOF!`, 9.6, 2.8, 'sarcastic'),
      makeLine('gen-5', speakerAName, 'human', `Yah... kepleset lagi. Suara OOF gue udah seratus kali hari ini!`, 12.5, 3.0, 'shocked'),
    ];
  } else if (format === 'whiteboard') {
    speakerAName = 'Narrator';
    speakerBName = 'Diagram';
    location = 'Clean Studio Board';
    commentHook = 'Tulis di komentar: poin mana yang paling relevan sama hidup lo?';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `Kenapa kita sering terjebak dalam masalah ini? Mari kita bedah.`, 0, 3.0, 'thoughtful'),
      makeLine('gen-2', speakerAName, 'narrator', `Inti masalahnya sederhana: ${cleanIdea}.`, 3.2, 3.0, 'neutral'),
      makeLine('gen-3', speakerAName, 'narrator', `Otak kita selalu mencari jalan pintas dengan energi paling minim.`, 6.3, 3.2, 'thoughtful'),
      makeLine('gen-4', speakerAName, 'narrator', `Solusinya: ubah langkah pertama menjadi sesuatu yang mustahil untuk ditolak.`, 9.6, 3.2, 'hyped'),
    ];
  } else if (format === 'pixel_rpg') {
    speakerAName = 'Player 1';
    speakerBName = 'Reality Boss';
    location = 'Retro Dungeon 16-bit';
    commentHook = 'Kalo lo ada di posisi ini, skill apa yang bakal lo pake?';
    lines = [
      makeLine('gen-1', speakerAName, 'hero', `WILD BOSS APPEARS! Level 99 menghalangi jalan pulang!`, 0, 3.0, 'shocked'),
      makeLine('gen-2', speakerBName, 'boss', `Menyerahlah, ${cleanIdea} akan menguras seluruh energimu!`, 3.1, 3.2, 'smug'),
      makeLine('gen-3', speakerAName, 'hero', `Aktifkan skill ultimate: Ngopi hitam dan mode fokus tanpa henti!`, 6.4, 3.2, 'hyped'),
      makeLine('gen-4', speakerBName, 'boss', `CRITICAL HIT! Boss tumbang dan kamu berhasil naik level!`, 9.7, 3.0, 'angry'),
    ];
  } else if (format === 'breaking_news') {
    speakerAName = 'News Anchor';
    speakerBName = 'Investigator';
    location = 'Breaking News Studio';
    commentHook = 'Tag orang yang kelakuannya persis kayak berita barusan!';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `LAPORAN KHUSUS: Kejadian menghebohkan baru saja terjadi hari ini.`, 0, 3.0, 'hyped'),
      makeLine('gen-2', speakerAName, 'narrator', `Berdasarkan pantauan langsung di lokasi: ${cleanIdea}.`, 3.1, 3.2, 'neutral'),
      makeLine('gen-3', speakerBName, 'human', `Warga sekitar mengaku panik dan tidak menyangka akan separah ini!`, 6.4, 3.0, 'shocked'),
      makeLine('gen-4', speakerAName, 'narrator', `Pihak berwenang mengimbau agar tetap tenang dan segera tinggalkan komentar.`, 9.5, 3.2, 'thoughtful'),
    ];
  } else if (format === 'clean_explainer') {
    speakerAName = 'Analyst';
    speakerBName = 'Data Stream';
    location = 'Fintech Motion Grid';
    commentHook = 'Simpan video ini biar lo bisa cek ulang datanya nanti!';
    lines = [
      makeLine('gen-1', speakerAName, 'narrator', `Tiga angka yang paling menentukan kenapa hal ini terjadi:`, 0, 2.8, 'hyped'),
      makeLine('gen-2', speakerAName, 'narrator', `Pertama, faktor utama yang sering diabaikan: ${cleanIdea}.`, 2.9, 3.3, 'thoughtful'),
      makeLine('gen-3', speakerAName, 'narrator', `Kedua, 80 persen orang gagal menyadari pola tersembunyi ini.`, 6.3, 3.2, 'neutral'),
      makeLine('gen-4', speakerAName, 'narrator', `Ketiga, jika kamu kuasai prinsip ini, hasilnya akan berlipat ganda.`, 9.6, 3.2, 'hyped'),
    ];
  } else {
    // Default Character Banter
    lines = [
      makeLine('gen-1', speakerAName, 'human', `Bro, lo harus denger ini: ${cleanIdea.slice(0, 60)}...`, 0, 3.2, mood === 'angry' ? 'angry' : 'hyped'),
      makeLine('gen-2', speakerBName, 'ai', `Tunggu sebentar. Logika lo ada di mana? Realitasnya nggak sesimpel itu.`, 3.3, 3.5, 'sarcastic'),
      makeLine('gen-3', speakerAName, 'human', `Tapi semua orang di internet bilang cara ini 100% berhasil!`, 6.9, 3.2, 'shocked'),
      makeLine('gen-4', speakerBName, 'ai', `Orang di internet juga bilang investasi tanah di Mars itu menguntungkan.`, 10.2, 3.0, 'smug'),
    ];
  }

  const baseTheme = DEMO_STORYBOARDS[format]?.visualTheme || {
    primaryColor: '#ea580c',
    accentColor: '#facc15',
    backgroundColor: '#141413',
  };

  const lastLine = lines[lines.length - 1];
  const totalDuration = lastLine ? lastLine.startSec + lastLine.durationSec : 13.5;

  return {
    id: `story-${Date.now()}`,
    title,
    concept: cleanIdea,
    format,
    mood,
    durationSec: +totalDuration.toFixed(1),
    fps: 30,
    locationName: location,
    characters: {
      characterA: { name: speakerAName, title: 'Inisiator / Host', avatar: 'user' },
      characterB: { name: speakerBName, title: 'Counterpart / System', avatar: 'ai' },
    },
    lines,
    commentMagnetHook: commentHook,
    visualTheme: baseTheme,
  };
}
