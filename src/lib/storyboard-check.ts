import { CaptionStyle, MoodType, MotionFormat, SpeakerEmotion, Storyboard, StoryboardLine, TransitionStyle } from '@/types/motion';
import { CAPTION_STYLES, TRANSITIONS } from '../../engine/compose.mjs';
import { MOODS } from '@/lib/moods';
import { FORMAT_BRIEF, FORMAT_THEMES } from '@/lib/script-prompts';

export type CheckResult = {
  storyboard: Storyboard | null;
  errors: string[];
  warnings: string[];
  fixes: string[];
};

const EMOTIONS: SpeakerEmotion[] = ['neutral', 'hyped', 'angry', 'shocked', 'smug', 'thoughtful', 'sarcastic'];
const FORMATS = Object.keys(FORMAT_BRIEF) as MotionFormat[];
const NARRATOR_ONLY = new Set(
  FORMATS.filter((f) => FORMAT_BRIEF[f].roles[0] === 'narrator' && FORMAT_BRIEF[f].roles[1] === 'narrator'),
);
const MAX_WORDS = 16;
const HEX = /^#[0-9a-f]{6}$/i;
const PRICE = /(?:rp\.?\s*\d|\d+(?:[.,]\d+)?\s*(?:juta|jt|ribu|rb|k)\b)/i;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

// Pulls the JSON object out of a chat reply: code fences, prose before or after, smart quotes.
function extractJson(raw: string): { value: unknown; fixes: string[] } {
  const fixes: string[] = [];
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    text = fence[1];
    fixes.push('Blok kode ``` dibuang.');
  }
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first < 0) throw new Error('Tidak ada objek JSON { … } di jawaban yang ditempel.');
  if (last <= first) {
    throw new Error('JSON terpotong: tidak ada kurung } penutup. Jawaban AI kemungkinan terpotong; minta AI melanjutkan atau mengirim ulang JSON lengkapnya.');
  }
  if (first > 0 || last < text.length - 1) fixes.push('Teks di luar JSON dibuang.');
  text = text.slice(first, last + 1);
  if (/[“”]/.test(text)) {
    text = text.replace(/[“”]/g, '"');
    fixes.push('Tanda kutip miring diganti tanda kutip biasa.');
  }
  const noTrailing = text.replace(/,\s*([}\]])/g, '$1');
  if (noTrailing !== text) fixes.push('Koma berlebih sebelum } atau ] dihapus.');
  try {
    return { value: JSON.parse(noTrailing), fixes };
  } catch (e) {
    throw new Error(`JSON tidak valid: ${(e as Error).message}`);
  }
}

function estimateWords(text: string, start: number) {
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

export function checkStoryboard(raw: string, selectedFormat: MotionFormat): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fixes: string[] = [];

  let data: Record<string, unknown>;
  try {
    const parsed = extractJson(raw);
    fixes.push(...parsed.fixes);
    if (!parsed.value || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) throw new Error('JSON harus berupa satu objek { … }.');
    data = parsed.value as Record<string, unknown>;
  } catch (e) {
    return { storyboard: null, errors: [(e as Error).message], warnings, fixes };
  }

  // Format and mood
  let format = str(data.format) as MotionFormat;
  if (!FORMATS.includes(format)) {
    fixes.push(`Format "${str(data.format) || '(kosong)'}" tidak dikenal, dipakai format yang dipilih: ${selectedFormat}.`);
    format = selectedFormat;
  } else if (format !== selectedFormat) {
    warnings.push(`JSON ini untuk format ${format}, bukan ${selectedFormat} yang sedang dipilih. Format dari JSON yang dipakai.`);
  }
  let mood = str(data.mood) as MoodType;
  if (!MOODS.some((m) => m.id === mood)) {
    fixes.push(`Mood "${str(data.mood) || '(kosong)'}" tidak dikenal, dipakai "hyped".`);
    mood = 'hyped';
  }

  // Characters
  const chars = (data.characters ?? {}) as Record<string, Record<string, unknown> | undefined>;
  const castA = { name: str(chars.characterA?.name), title: str(chars.characterA?.title) };
  const castB = { name: str(chars.characterB?.name), title: str(chars.characterB?.title) };
  // Missing character names are taken from who actually speaks in the lines.
  const lineSpeakers = (Array.isArray(data.lines) ? (data.lines as Record<string, unknown>[]) : [])
    .map((l) => str(l?.speaker))
    .filter((s) => s && s !== 'A' && s !== 'B');
  const sameName = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  if (!castA.name && lineSpeakers[0]) {
    castA.name = lineSpeakers[0];
    fixes.push(`Nama karakter A kosong, diambil dari naskah: "${castA.name}".`);
  }
  const otherSpeaker = lineSpeakers.find((s) => !sameName(s, castA.name));
  if (!castB.name && otherSpeaker && !NARRATOR_ONLY.has(format)) {
    castB.name = otherSpeaker;
    fixes.push(`Nama karakter B kosong, diambil dari naskah: "${castB.name}".`);
  }
  if (!castA.name) {
    castA.name = NARRATOR_ONLY.has(format) ? 'Narator' : 'Tokoh A';
    fixes.push(`Nama karakter A kosong, diisi "${castA.name}".`);
  }
  if (!castB.name) {
    castB.name = NARRATOR_ONLY.has(format) ? castA.name : 'Tokoh B';
    fixes.push(`Nama karakter B kosong, diisi "${castB.name}".`);
  }
  castA.title ||= 'Tokoh';
  castB.title ||= 'Tokoh';

  // Lines
  const rawLines = Array.isArray(data.lines) ? (data.lines as Record<string, unknown>[]) : [];
  if (!rawLines.length) errors.push('Tidak ada "lines" (baris naskah) di JSON.');
  const [roleA, roleB] = FORMAT_BRIEF[format].roles;
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ');
  let cursor = 0.08;
  const lines: StoryboardLine[] = [];
  rawLines.forEach((l, i) => {
    const n = i + 1;
    const text = str(l?.text);
    if (!text) {
      warnings.push(`Baris ${n} tidak punya teks dan dilewati.`);
      return;
    }
    const who = str(l.speaker);
    let side: 'A' | 'B';
    if (norm(who) === norm(castA.name) || who === 'A') side = 'A';
    else if (norm(who) === norm(castB.name) || who === 'B') side = 'B';
    else {
      side = 'A';
      fixes.push(`Baris ${n}: pembicara "${who || '(kosong)'}" tidak cocok dengan karakter mana pun, dianggap ${castA.name}.`);
    }
    if (side === 'B' && NARRATOR_ONLY.has(format) && castB.name !== castA.name) {
      side = 'A';
      fixes.push(`Baris ${n}: format ini hanya memakai satu narator, dibacakan oleh ${castA.name}.`);
    }
    let emotion = str(l.emotion) as SpeakerEmotion;
    if (!EMOTIONS.includes(emotion)) {
      if (l.emotion !== undefined) fixes.push(`Baris ${n}: emosi "${str(l.emotion)}" tidak dikenal, diganti "neutral".`);
      emotion = 'neutral';
    }
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount > MAX_WORDS) warnings.push(`Baris ${n} berisi ${wordCount} kata (maks ${MAX_WORDS}). Caption dan suaranya akan terasa panjang.`);

    const words = estimateWords(text, cursor);
    const end = words.length ? words[words.length - 1].end : cursor + 1;
    lines.push({
      id: `l${n}`,
      speaker: side === 'A' ? castA.name : castB.name,
      speakerRole: side === 'A' ? roleA : roleB,
      text,
      emotion,
      startSec: +cursor.toFixed(2),
      durationSec: +(end - cursor).toFixed(2),
      words,
    });
    cursor = end + 0.15;
  });

  // Format rules
  const count = lines.length;
  const speakers = new Set(lines.map((l) => l.speaker));
  if (count && count < 3) warnings.push(`Hanya ${count} baris. Reel biasanya butuh minimal 3 baris supaya ada alur.`);
  if (count > 14) warnings.push(`${count} baris akan menghasilkan video yang panjang (lebih dari ±45 detik).`);
  if (!NARRATOR_ONLY.has(format) && count >= 2 && speakers.size < 2) {
    warnings.push(`Format ${format} paling bagus dengan dua tokoh bergantian, tapi semua baris diucapkan ${[...speakers][0]}.`);
  }
  if (format === 'quiz' && count !== 5) warnings.push(`Kuis sebaiknya tepat 5 baris (pertanyaan, 3 pilihan, jawaban). Sekarang ${count} baris.`);
  if (format === 'top_list' && (count < 3 || count > 7)) warnings.push(`Top list sebaiknya 3–7 item. Sekarang ${count}.`);
  if (format === 'receipt') {
    lines.slice(0, -1).forEach((l, i) => {
      if (!PRICE.test(l.text)) warnings.push(`Struk: baris ${i + 1} tidak menyebut harga (contoh "Rp 25.000" atau "45 ribu"), jadi tidak ikut dihitung di total.`);
    });
  }
  if (format === 'docu_story' || format === 'quiz' || format === 'clean_explainer') {
    warnings.push('Format ini menyajikan fakta. Periksa sendiri kebenaran nama, angka, dan tahun sebelum dipublikasikan.');
  }

  // Hook, theme, metadata
  let hook = str(data.commentMagnetHook);
  if (!hook) {
    hook = 'Kamu setuju atau tidak? Tulis di komentar!';
    fixes.push('Pertanyaan penutup (commentMagnetHook) kosong, diisi pertanyaan umum.');
  } else if (hook.split(/\s+/).length > 14) {
    warnings.push('Pertanyaan penutup lebih dari 14 kata; kartu komentarnya akan padat.');
  }
  const t = (data.visualTheme ?? {}) as Record<string, unknown>;
  let visualTheme = FORMAT_THEMES[format];
  if (HEX.test(str(t.primaryColor)) && HEX.test(str(t.accentColor)) && HEX.test(str(t.backgroundColor))) {
    visualTheme = { primaryColor: str(t.primaryColor), accentColor: str(t.accentColor), backgroundColor: str(t.backgroundColor) };
  } else {
    fixes.push('Warna tema tidak lengkap atau tidak valid, dipakai warna bawaan format.');
  }
  const title = str(data.title) || lines[0]?.text.split(/\s+/).slice(0, 6).join(' ') || 'Reel tanpa judul';
  if (!str(data.title)) fixes.push('Judul kosong, diambil dari baris pertama.');
  const id = str(data.id).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'reel';

  if (errors.length || !lines.length) return { storyboard: null, errors: errors.length ? errors : ['Tidak ada baris yang bisa dipakai.'], warnings, fixes };

  const rawStyle = (data.style ?? {}) as Record<string, unknown>;
  const style = {
    caption: (str(rawStyle.caption) in CAPTION_STYLES ? str(rawStyle.caption) : 'auto') as CaptionStyle,
    transition: (str(rawStyle.transition) in TRANSITIONS ? str(rawStyle.transition) : 'auto') as TransitionStyle,
  };
  if (data.style !== undefined && (style.caption !== str(rawStyle.caption) || style.transition !== str(rawStyle.transition))) {
    fixes.push('Gaya caption atau transisi tidak dikenal, diganti "bawaan format".');
  }

  return {
    storyboard: {
      id,
      style,
      title,
      concept: str(data.concept) || title,
      format,
      mood,
      durationSec: +(cursor + 3.5).toFixed(1),
      fps: 30,
      locationName: str(data.locationName) || title.split(/\s+/).slice(0, 3).join(' '),
      characters: { characterA: { ...castA, avatar: 'a' }, characterB: { ...castB, avatar: 'b' } },
      lines,
      commentMagnetHook: hook,
      visualTheme,
    },
    errors,
    warnings,
    fixes,
  };
}
