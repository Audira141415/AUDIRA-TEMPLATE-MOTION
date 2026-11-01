import { NextResponse } from 'next/server';
import { getInternalAiConfig } from '@/lib/ai-config';
import { VOICE_CATALOG } from '@/types/ai-config';

export const runtime = 'nodejs';

const CARTESIA_API = 'https://api.cartesia.ai';
const CARTESIA_VERSION = '2025-04-16';
const SAMPLE_RATE = 44100;
const BYTES_PER_SEC = SAMPLE_RATE * 2;

const EMOTION_MAP: Record<string, string> = {
  hyped: 'excited',
  angry: 'angry',
  shocked: 'surprised',
  smug: 'content',
  sarcastic: 'sarcastic',
  thoughtful: 'calm',
};

function wavHeader(pcmLength: number): Buffer {
  const hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0);
  hdr.writeUInt32LE(36 + pcmLength, 4);
  hdr.write('WAVE', 8);
  hdr.write('fmt ', 12);
  hdr.writeUInt32LE(16, 16);
  hdr.writeUInt16LE(1, 20); // PCM
  hdr.writeUInt16LE(1, 22); // Mono
  hdr.writeUInt32LE(SAMPLE_RATE, 24);
  hdr.writeUInt32LE(BYTES_PER_SEC, 28);
  hdr.writeUInt16LE(2, 32);
  hdr.writeUInt16LE(16, 34);
  hdr.write('data', 36);
  hdr.writeUInt32LE(pcmLength, 40);
  return hdr;
}

export async function GET() {
  const config = getInternalAiConfig();
  const rawKey = config.voiceAi?.cartesiaApiKey || process.env.CARTESIA_API_KEY || '';
  const hasKey = !!rawKey && rawKey.startsWith('sk_car');

  return NextResponse.json({
    ok: true,
    provider: 'cartesia',
    model: 'sonic-3',
    language: 'id',
    hasKey,
    keyPreview: hasKey ? `${rawKey.slice(0, 8)}••••••••` : 'Belum diatur',
    catalog: VOICE_CATALOG,
    supportedProviders: ['cartesia', 'elevenlabs', 'openai'],
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const text = (body.text || '').trim();
    if (!text) {
      return NextResponse.json({ error: 'Parameter text wajib diisi.' }, { status: 400 });
    }

    const config = getInternalAiConfig();
    const apiKey = (config.voiceAi?.cartesiaApiKey || process.env.CARTESIA_API_KEY || '').trim();

    if (!apiKey) {
      return NextResponse.json({
        error: 'CARTESIA_API_KEY belum dikonfigurasi. Silakan isi di menu Admin atau .env.local',
      }, { status: 400 });
    }

    // Resolve voiceId (accepts UUID or key name like 'andi', 'safira', etc.)
    let voiceId = body.voiceId || body.voiceKey || 'a053f6bc-7df4-40de-96d4-de026bc47ce8';
    const foundCatalog = VOICE_CATALOG.find((v) => v.key === voiceId || v.id === voiceId);
    if (foundCatalog) {
      voiceId = foundCatalog.id;
    }

    const speed = Math.max(0.6, Math.min(1.6, Number(body.speed) || 1.0));
    const rawEmotion = body.emotion || 'neutral';
    const cartesiaEmotion = EMOTION_MAP[rawEmotion] || undefined;

    // Call Cartesia SSE endpoint
    const payload = {
      model_id: 'sonic-3',
      transcript: text,
      voice: { mode: 'id', id: voiceId },
      language: 'id',
      add_timestamps: true,
      output_format: { container: 'raw', encoding: 'pcm_s16le', sample_rate: SAMPLE_RATE },
      generation_config: {
        speed,
        ...(cartesiaEmotion ? { emotion: cartesiaEmotion } : {}),
      },
    };

    const cartesiaRes = await fetch(`${CARTESIA_API}/tts/sse`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!cartesiaRes.ok) {
      const errTxt = await cartesiaRes.text();
      return NextResponse.json({
        error: `Cartesia API error HTTP ${cartesiaRes.status}: ${errTxt}`,
      }, { status: cartesiaRes.status });
    }

    const chunks: Buffer[] = [];
    const words: Array<{ text: string; start: number; end: number }> = [];

    const streamText = await cartesiaRes.text();
    for (const line of streamText.split('\n')) {
      if (!line.startsWith('data:')) continue;
      try {
        const ev = JSON.parse(line.slice(5));
        if (ev.type === 'error') {
          throw new Error(ev.error || 'Cartesia SSE event error');
        }
        if (ev.type === 'chunk' && ev.data) {
          chunks.push(Buffer.from(ev.data, 'base64'));
        }
        if (ev.type === 'timestamps' && ev.word_timestamps) {
          const w = ev.word_timestamps;
          w.words.forEach((t: string, i: number) => {
            words.push({
              text: t,
              start: Number(w.start[i].toFixed(3)),
              end: Number(w.end[i].toFixed(3)),
            });
          });
        }
      } catch (parseErr) {
        // continue parsing lines
      }
    }

    const pcm = Buffer.concat(chunks);
    const durationSec = Number((pcm.length / BYTES_PER_SEC).toFixed(2));
    const wav = Buffer.concat([wavHeader(pcm.length), pcm]);
    const latencyMs = Date.now() - startTime;

    // Check return format
    if (body.returnFormat === 'audio') {
      return new Response(wav, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': String(wav.length),
          'X-Duration-Sec': String(durationSec),
          'X-Latency-Ms': String(latencyMs),
        },
      });
    }

    const audioBase64 = `data:audio/wav;base64,${wav.toString('base64')}`;

    return NextResponse.json({
      ok: true,
      provider: 'cartesia',
      model: 'sonic-3',
      voiceId,
      voiceName: foundCatalog?.name || 'Custom',
      durationSec,
      latencyMs,
      words,
      audioBase64,
    });
  } catch (err) {
    return NextResponse.json({
      error: `Voiceover generation failed: ${err instanceof Error ? err.message : String(err)}`,
    }, { status: 500 });
  }
}

