// Multi-voice Cartesia TTS. Each storyboard line is voiced by its speaker's voice, laid
// end-to-end on one timeline; the resulting audio is the master clock for the reel.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { estimateTimeline } from "./compose.mjs";

const API = "https://api.cartesia.ai";
const VERSION = "2025-04-16";
const RATE = 44100;
const BYTES_PER_SEC = RATE * 2;

export const VOICES = {
  andi: "a053f6bc-7df4-40de-96d4-de026bc47ce8",
  safira: "9076f14a-5602-48a7-bfd1-67ef9b40dd6d",
  galang: "04b567df-2923-4b0c-896b-4b7df0a07e1a",
  siti: "b441c4fd-4910-4c55-ae56-f0291057e2cc",
  citra: "74546efd-3ac5-4c41-ba59-4756227f429a",
};

const ROLE_VOICE = {
  human: VOICES.andi,
  hero: VOICES.andi,
  ai: VOICES.safira,
  boss: VOICES.citra,
  narrator: VOICES.galang,
};

const FORMAT_NARRATOR = {
  breaking_news: VOICES.siti,
  docu_story: VOICES.galang,
  whiteboard: VOICES.galang,
  clean_explainer: VOICES.andi,
};

const MOOD_SPEED = { calm: 0.92, warm: 0.97, motivational: 1.04, hyped: 1.12, frustrated: 1.05, angry: 1.08, rude: 1.02 };

const EMOTION_TAG = {
  hyped: "excited",
  angry: "angry",
  shocked: "surprised",
  smug: "content",
  sarcastic: "sarcastic",
  thoughtful: "calm",
};

export function loadKey() {
  if (process.env.CARTESIA_API_KEY) return process.env.CARTESIA_API_KEY.trim();
  for (const f of [join(process.cwd(), ".env.local"), join(process.cwd(), ".env"), join(homedir(), ".audira", "secrets.env")]) {
    if (!existsSync(f)) continue;
    const m = readFileSync(f, "utf8").match(/^\s*CARTESIA_API_KEY\s*=\s*["']?([^"'\r\n]+)/m);
    if (m) return m[1].trim();
  }
  return null;
}

export function voiceFor(storyboard, line) {
  const { characterA, characterB } = storyboard.characters;
  const owner = line.speaker === characterA.name ? characterA : line.speaker === characterB.name ? characterB : null;
  if (owner?.voiceId) return owner.voiceId;
  if (line.speakerRole === "narrator" && FORMAT_NARRATOR[storyboard.format]) return FORMAT_NARRATOR[storyboard.format];
  const voice = ROLE_VOICE[line.speakerRole] ?? VOICES.andi;
  // Two human characters would otherwise share a voice; B takes the second one.
  if (owner === characterB && voice === VOICES.andi) return VOICES.safira;
  return voice;
}

async function synth(key, { text, voiceId, speed, emotion }) {
  const base = {
    model_id: "sonic-3",
    transcript: text,
    voice: { mode: "id", id: voiceId },
    language: "id",
    add_timestamps: true,
    output_format: { container: "raw", encoding: "pcm_s16le", sample_rate: RATE },
  };
  const withEmotion = { ...base, generation_config: { speed, ...(emotion ? { emotion } : {}) } };
  const plain = { ...base, generation_config: { speed } };
  const headers = { "X-API-Key": key, "Cartesia-Version": VERSION, "Content-Type": "application/json" };

  let body = withEmotion;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch(`${API}/tts/sse`, { method: "POST", headers, body: JSON.stringify(body) });
    if (r.status === 429 || r.status >= 500) {
      await new Promise((ok) => setTimeout(ok, 1500 * attempt));
      continue;
    }
    if (r.status === 400 && body === withEmotion) {
      body = plain;
      continue;
    }
    if (!r.ok) throw new Error(`Cartesia HTTP ${r.status}: ${await r.text()}`);
    const chunks = [];
    const words = [];
    for (const line of (await r.text()).split("\n")) {
      if (!line.startsWith("data:")) continue;
      const ev = JSON.parse(line.slice(5));
      if (ev.type === "error") throw new Error(`Cartesia: ${ev.error ?? JSON.stringify(ev)}`);
      if (ev.type === "chunk" && ev.data) chunks.push(Buffer.from(ev.data, "base64"));
      if (ev.type === "timestamps" && ev.word_timestamps) {
        const w = ev.word_timestamps;
        w.words.forEach((t, i) => words.push({ text: t, start: w.start[i], end: w.end[i] }));
      }
    }
    return { pcm: Buffer.concat(chunks), words };
  }
  throw new Error("Cartesia kept failing (rate limit / server error)");
}

function wav(pcm) {
  const hdr = Buffer.alloc(44);
  hdr.write("RIFF", 0);
  hdr.writeUInt32LE(36 + pcm.length, 4);
  hdr.write("WAVE", 8);
  hdr.write("fmt ", 12);
  hdr.writeUInt32LE(16, 16);
  hdr.writeUInt16LE(1, 20);
  hdr.writeUInt16LE(1, 22);
  hdr.writeUInt32LE(RATE, 24);
  hdr.writeUInt32LE(BYTES_PER_SEC, 28);
  hdr.writeUInt16LE(2, 32);
  hdr.writeUInt16LE(16, 34);
  hdr.write("data", 36);
  hdr.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([hdr, pcm]);
}

const silence = (sec) => Buffer.alloc(Math.round(sec * RATE) * 2);

// Voices every line plus the closing hook. Returns the WAV buffer and the measured
// timeline: one entry per beat with absolute start/end and its words.
export async function voiceStoryboard(storyboard, { lead = 0.08, gap = 0.14, tail = 0.9, onProgress } = {}) {
  const key = loadKey();
  if (!key) throw new Error("CARTESIA_API_KEY tidak ditemukan (env, .env.local, atau ~/.audira/secrets.env)");

  const speed = MOOD_SPEED[storyboard.mood] ?? 1;
  const hookSpeaker =
    storyboard.lines.find((l) => l.speakerRole === "ai" || l.speakerRole === "boss") ?? storyboard.lines.at(-1);
  const beats = [
    ...storyboard.lines.map((l) => ({ ...l, kind: "line" })),
    {
      id: "hook",
      kind: "hook",
      speaker: hookSpeaker?.speaker ?? "",
      speakerRole: hookSpeaker?.speakerRole ?? "narrator",
      text: storyboard.commentMagnetHook,
      emotion: "neutral",
    },
  ].filter((b) => b.text?.trim());

  const parts = [silence(lead)];
  let cursor = lead;
  const timeline = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    onProgress?.({ step: "tts", index: i, total: beats.length, text: b.text });
    const { pcm, words } = await synth(key, {
      text: b.text,
      voiceId: voiceFor(storyboard, b),
      speed,
      emotion: EMOTION_TAG[b.emotion],
    });
    const dur = pcm.length / BYTES_PER_SEC;
    timeline.push({
      ...b,
      start: +cursor.toFixed(3),
      end: +(cursor + dur).toFixed(3),
      words: words.map((w) => ({ text: w.text, start: +(cursor + w.start).toFixed(3), end: +(cursor + w.end).toFixed(3) })),
    });
    parts.push(pcm);
    cursor += dur;
    const pause = i === beats.length - 2 ? gap * 2.5 : gap;
    if (i < beats.length - 1) {
      parts.push(silence(pause));
      cursor += pause;
    }
  }
  parts.push(silence(tail));
  cursor += tail;

  return { wav: wav(Buffer.concat(parts)), duration: +cursor.toFixed(3), timeline };
}

// Offline stand-in for layout and motion tests: silent audio over estimated word timings.
// Never ship a reel built this way.
export function dryVoiceStoryboard(storyboard) {
  const { duration, timeline } = estimateTimeline(storyboard);
  return { wav: wav(silence(duration)), duration, timeline };
}
