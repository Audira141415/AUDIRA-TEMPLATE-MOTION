import { Storyboard, MotionFormat, MoodType, StoryboardLine } from '@/types/motion';
import { DEMO_STORYBOARDS } from './templates';

export async function generateStoryboardFromIdea(
  idea: string,
  format: MotionFormat,
  mood: MoodType
): Promise<Storyboard> {
  // If idea matches a demo or is empty, use demo
  if (!idea.trim()) {
    return DEMO_STORYBOARDS[format];
  }

  // Pre-configured dynamic prompt synthesizer based on format & mood
  const words = idea.split(' ');
  const title = words.slice(0, 7).join(' ') + (words.length > 7 ? '...' : '');

  // Split idea into 4 logical video beats:
  // 1. Hook (detik 0 - 3)
  // 2. Complication / Debate (detik 3 - 7)
  // 3. Punchline / Climax (detik 7 - 10)
  // 4. Comment Magnet Outro (detik 10 - 13)

  let speakerAName = 'Ash';
  let speakerBName = 'Nara';
  let location = '24-Hour Neon Diner';
  let commentHook = 'Ketik pendapat lo di kolom komentar: Tim Setuju atau Tim Nolak?';

  if (format === 'whiteboard') {
    speakerAName = 'Narrator';
    speakerBName = 'Diagram';
    location = 'Clean Studio Board';
    commentHook = 'Tulis di komentar: poin mana yang paling relevan sama hidup lo?';
  } else if (format === 'pixel_rpg') {
    speakerAName = 'Player 1';
    speakerBName = 'Reality Boss';
    location = 'Retro Dungeon 16-bit';
    commentHook = 'Kalo lo ada di posisi ini, skill apa yang bakal lo pake?';
  } else if (format === 'breaking_news') {
    speakerAName = 'News Anchor';
    speakerBName = 'Investigator';
    location = 'Breaking News Studio';
    commentHook = 'Tag orang yang kelakuannya persis kayak berita barusan!';
  } else if (format === 'clean_explainer') {
    speakerAName = 'Analyst';
    speakerBName = 'Data Stream';
    location = 'Fintech Motion Grid';
    commentHook = 'Simpan video ini biar lo bisa cek ulang langkahnya nanti!';
  } else if (format === 'docu_story') {
    speakerAName = 'Voice of History';
    speakerBName = 'Archive Memory';
    location = 'Documentary Vault';
    commentHook = 'Pernahkah lo ngerasain hal yang sama? Tulis di bawah!';
  }

  const lines: StoryboardLine[] = [
    {
      id: 'gen-1',
      speaker: speakerAName,
      speakerRole: format === 'character_banter' ? 'human' : 'narrator',
      text: `Bro, lo harus denger ini: ${idea.slice(0, 60)}...`,
      startSec: 0,
      durationSec: 3.2,
      emotion: mood === 'angry' ? 'angry' : 'hyped',
      words: [
        { word: 'Bro,', start: 0, end: 0.5 },
        { word: 'lo', start: 0.5, end: 0.8 },
        { word: 'harus', start: 0.8, end: 1.2 },
        { word: 'denger', start: 1.2, end: 1.6 },
        { word: 'ini:', start: 1.6, end: 2.1 },
        { word: idea.slice(0, 30), start: 2.1, end: 3.2 },
      ],
    },
    {
      id: 'gen-2',
      speaker: speakerBName,
      speakerRole: 'ai',
      text: `Tunggu sebentar. Logika lo ada di mana? Realitasnya nggak sesimpel itu.`,
      startSec: 3.3,
      durationSec: 3.5,
      emotion: 'sarcastic',
      words: [
        { word: 'Tunggu', start: 3.3, end: 3.8 },
        { word: 'sebentar.', start: 3.8, end: 4.3 },
        { word: 'Logika', start: 4.3, end: 4.8 },
        { word: 'lo', start: 4.8, end: 5.1 },
        { word: 'ada', start: 5.1, end: 5.4 },
        { word: 'di', start: 5.4, end: 5.7 },
        { word: 'mana?', start: 5.7, end: 6.2 },
        { word: 'Realitasnya', start: 6.2, end: 6.8 },
      ],
    },
    {
      id: 'gen-3',
      speaker: speakerAName,
      speakerRole: format === 'character_banter' ? 'human' : 'hero',
      text: `Tapi semua orang di internet bilang cara ini 100% berhasil!`,
      startSec: 6.9,
      durationSec: 3.2,
      emotion: 'shocked',
      words: [
        { word: 'Tapi', start: 6.9, end: 7.3 },
        { word: 'semua', start: 7.3, end: 7.7 },
        { word: 'orang', start: 7.7, end: 8.1 },
        { word: 'di', start: 8.1, end: 8.4 },
        { word: 'internet', start: 8.4, end: 8.9 },
        { word: 'bilang', start: 8.9, end: 9.3 },
        { word: 'berhasil!', start: 9.3, end: 10.1 },
      ],
    },
    {
      id: 'gen-4',
      speaker: speakerBName,
      speakerRole: 'ai',
      text: `Orang di internet juga bilang investasi tanah di Mars itu menguntungkan.`,
      startSec: 10.2,
      durationSec: 3.0,
      emotion: 'smug',
      words: [
        { word: 'Orang', start: 10.2, end: 10.6 },
        { word: 'di', start: 10.6, end: 10.9 },
        { word: 'internet', start: 10.9, end: 11.4 },
        { word: 'juga', start: 11.4, end: 11.8 },
        { word: 'bilang', start: 11.8, end: 12.3 },
        { word: 'tanah', start: 12.3, end: 12.7 },
        { word: 'Mars!', start: 12.7, end: 13.2 },
      ],
    },
  ];

  const baseTheme = DEMO_STORYBOARDS[format].visualTheme;

  return {
    id: `story-${Date.now()}`,
    title,
    concept: idea,
    format,
    mood,
    durationSec: 13.2,
    fps: 30,
    locationName: location,
    characters: {
      characterA: { name: speakerAName, title: 'Inisiator Ide', avatar: 'user' },
      characterB: { name: speakerBName, title: 'Counterpart AI', avatar: 'ai' },
    },
    lines,
    commentMagnetHook: commentHook,
    visualTheme: baseTheme,
  };
}

