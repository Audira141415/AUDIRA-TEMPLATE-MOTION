import { MoodType } from '@/types/motion';

export const MOODS: Array<{ id: MoodType; label: string; emoji: string; tagline: string; direction: string }> = [
  {
    id: 'calm',
    label: 'Kalem',
    emoji: '🌙',
    tagline: 'Pelan, jernih, nggak buru-buru.',
    direction:
      'Tenang dan jernih. Kalimat pendek, jeda terasa, tanpa tanda seru. Lawan bicara menenangkan, bukan menghakimi. Emosi dominan: thoughtful, neutral.',
  },
  {
    id: 'warm',
    label: 'Hangat',
    emoji: '🤗',
    tagline: 'Kayak sahabat yang peduli.',
    direction:
      'Hangat dan suportif seperti sahabat. Boleh bercanda ringan, tapi ujungnya peduli dan memberi jalan keluar. Emosi dominan: neutral, hyped (ringan), thoughtful.',
  },
  {
    id: 'motivational',
    label: 'Motivasi',
    emoji: '🔥',
    tagline: 'Dorongan keras, ujungnya bangkit.',
    direction:
      'Pelatih yang membakar semangat. Kalimat tegas dan ritmis, ada momen "turning point", ditutup dengan ajakan bertindak. Emosi dominan: hyped, thoughtful.',
  },
  {
    id: 'hyped',
    label: 'Hyped',
    emoji: '⚡',
    tagline: 'All in. Mungkin kebablasan.',
    direction:
      'Super antusias, energi tinggi, sedikit kebablasan sampai lucu. Banyak tanda seru, ide makin liar tiap baris. Emosi dominan: hyped, shocked.',
  },
  {
    id: 'frustrated',
    label: 'Frustrasi',
    emoji: '😩',
    tagline: 'Capek, tapi masih nyimak.',
    direction:
      'Lelah dan kesal karena kejadian berulang. Menghela napas lewat kata ("ya ampun", "lagi-lagi"), sindiran halus, tetap memberi fakta. Emosi dominan: sarcastic, thoughtful.',
  },
  {
    id: 'angry',
    label: 'Marah',
    emoji: '😡',
    tagline: 'Nada tinggi, fakta tajam.',
    direction:
      'Marah dan blak-blakan, nada tinggi, tapi isinya tetap fakta yang masuk akal. Tidak ada hinaan SARA, tidak ada kata kasar berat. Emosi dominan: angry, shocked.',
  },
  {
    id: 'rude',
    label: 'Nyolot',
    emoji: '😏',
    tagline: 'Roasting tanpa rem.',
    direction:
      'Nyolot dan sinis ala roasting teman tongkrongan. Punchline pedas, logika menohok, tapi tidak merendahkan kelompok mana pun dan tanpa kata kasar berat. Emosi dominan: smug, sarcastic.',
  },
];

export const moodById = (id: MoodType) => MOODS.find((m) => m.id === id) ?? MOODS[3];
