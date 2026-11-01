'use client';

let userHasInteracted = false;

if (typeof window !== 'undefined') {
  const markGesture = () => {
    userHasInteracted = true;
    window.removeEventListener('click', markGesture, true);
    window.removeEventListener('keydown', markGesture, true);
    window.removeEventListener('pointerdown', markGesture, true);
    window.removeEventListener('touchstart', markGesture, true);
  };
  window.addEventListener('click', markGesture, { capture: true, passive: true });
  window.addEventListener('keydown', markGesture, { capture: true, passive: true });
  window.addEventListener('pointerdown', markGesture, { capture: true, passive: true });
  window.addEventListener('touchstart', markGesture, { capture: true, passive: true });
}

export function isAudioInteractionAllowed(): boolean {
  return userHasInteracted;
}

class BrowserAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private lastSpokenLineId: string | null = null;
  private audioCache: Map<string, string> = new Map();
  private prefetchingIds: Set<string> = new Set();
  private voiceVolume: number = 1.0;
  private sfxVolume: number = 0.6;

  public setVoiceVolume(vol: number) {
    this.voiceVolume = Math.max(0, Math.min(1, vol));
    if (this.currentAudioElement) {
      this.currentAudioElement.volume = this.isMuted ? 0 : this.voiceVolume;
    }
  }

  public getVoiceVolume(): number {
    return this.voiceVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public async unlock(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    userHasInteracted = true;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }

    return this.ctx ? this.ctx.state === 'running' : false;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || !userHasInteracted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx && this.ctx.state === 'running' ? this.ctx : null;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Pop SFX for word captions
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(950, t + 0.04);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch {
      // ignore
    }
  }

  // 8-bit Chiptune SFX for Pixel RPG
  public playChiptuneBlip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'square';
      const notes = [440, 523, 659, 784];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // ignore
    }
  }

  // Marker drawing squeak for Whiteboard
  public playMarkerSqueak() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
      osc.frequency.linearRampToValueAtTime(1400, t + 0.05);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // ignore
    }
  }

  // Urgent News Alert for Breaking News
  public playNewsAlert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      [0, 0.1].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(idx === 0 ? 587 : 880, t + delay);

        gain.gain.setValueAtTime(0.08, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + delay);
        osc.stop(t + delay + 0.12);
      });
    } catch {
      // ignore
    }
  }

  // Iconic Roblox "OOF!" Death / Impact Sound
  public playOofSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch drop from 340Hz down to 120Hz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.18);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(170, t);
      osc2.frequency.exponentialRampToValueAtTime(60, t + 0.18);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + 0.22);
      osc2.stop(t + 0.22);
    } catch {
      // ignore
    }
  }

  // Roblox Obby Jump / Item Collect Chime
  public playRobloxChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.05); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.1); // G5
      osc.frequency.setValueAtTime(1046.50, t + 0.15); // C6

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // ignore
    }
  }

  // 100% Authentic Indonesian AI Voiceover (Cartesia AI First with strict Indonesian SpeechSynthesis guard)
  public async speakLine(
    lineId: string, 
    text: string, 
    role: 'human' | 'ai' | string, 
    emotion?: string
  ) {
    if (this.isMuted || !userHasInteracted || typeof window === 'undefined') return;
    if (this.lastSpokenLineId === lineId) return;

    this.lastSpokenLineId = lineId;
    this.stopSpeech();

    // Priority 1: Check in-memory Cartesia Indonesian Audio Cache
    const cachedDataUrl = this.audioCache.get(lineId);
    if (cachedDataUrl) {
      this.playCachedAudio(cachedDataUrl);
      return;
    }

    // Priority 2: Fetch native Indonesian Cartesia voice from /api/voiceover
    const voiceKey = role === 'ai' ? 'safira' : role === 'narrator' ? 'galang' : role === 'boss' ? 'citra' : 'andi';
    
    try {
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceKey,
          emotion: emotion || 'neutral',
        }),
      });
      const data = await res.json();
      if (res.ok && data.audioBase64) {
        this.audioCache.set(lineId, data.audioBase64);
        if (this.lastSpokenLineId === lineId && !this.isMuted) {
          this.playCachedAudio(data.audioBase64);
        }
        return;
      }
    } catch {
      // ignore network errors and fallback safely
    }

    // Priority 3: Fallback to browser SpeechSynthesis ONLY IF native Indonesian voice exists!
    // NEVER use an American English voice (e.g. Microsoft David) for Indonesian text!
    if (window.speechSynthesis) {
      try {
        const voices = window.speechSynthesis.getVoices();
        const indonesianVoice = voices.find((v) => 
          v.lang.toLowerCase().startsWith('id') || 
          v.name.toLowerCase().includes('indonesia') ||
          v.name.toLowerCase().includes('gadis') ||
          v.name.toLowerCase().includes('andika')
        );

        // Strict Guard: Only speak if authentic Indonesian voice is available in browser
        if (indonesianVoice) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = indonesianVoice;
          utterance.lang = 'id-ID';
          if (role === 'ai') {
            utterance.pitch = 1.35;
            utterance.rate = 1.15;
          } else if (role === 'boss') {
            utterance.pitch = 0.7;
            utterance.rate = 0.95;
          } else {
            utterance.pitch = 1.0;
            utterance.rate = 1.05;
          }
          this.currentUtterance = utterance;
          window.speechSynthesis.speak(utterance);
        }
      } catch {
        // ignore
      }
    }
  }

  private playCachedAudio(dataUrl: string) {
    try {
      if (this.currentAudioElement) {
        this.currentAudioElement.pause();
        this.currentAudioElement = null;
      }
      const audio = new Audio(dataUrl);
      audio.volume = this.isMuted ? 0 : this.voiceVolume;
      this.currentAudioElement = audio;
      audio.play().catch(() => {});
    } catch {
      // ignore
    }
  }

  // Batch synthesize all storyboard lines via Cartesia AI and return exact duration and word timestamps
  public async batchSynthesizeLines(
    lines: Array<{ id: string; text: string; speakerRole: string; emotion?: string }>,
    onProgress?: (index: number, total: number) => void
  ): Promise<Map<string, { durationSec: number; words: Array<{ word: string; start: number; end: number }> }>> {
    const results = new Map<string, { durationSec: number; words: Array<{ word: string; start: number; end: number }> }>();
    if (typeof window === 'undefined') return results;

    let idx = 0;
    for (const line of lines) {
      idx++;
      if (onProgress) onProgress(idx, lines.length);

      const voiceKey = line.speakerRole === 'ai' ? 'safira' : line.speakerRole === 'narrator' ? 'galang' : line.speakerRole === 'boss' ? 'citra' : 'andi';
      try {
        const res = await fetch('/api/voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: line.text,
            voiceKey,
            emotion: line.emotion || 'neutral',
          }),
        });
        const data = await res.json();
        if (res.ok && data.audioBase64) {
          this.audioCache.set(line.id, data.audioBase64);
          results.set(line.id, {
            durationSec: data.durationSec || 3.0,
            words: data.words || [],
          });
        }
      } catch (err) {
        console.error('Batch voice synthesis failed for line:', line.id, err);
      }
    }

    return results;
  }

  // Prefetch all storyboard lines in Indonesian Cartesia voice on load
  public async prefetchLines(lines: Array<{ id: string; text: string; speakerRole: string; emotion?: string }>) {
    if (typeof window === 'undefined') return;
    for (const line of lines) {
      if (this.audioCache.has(line.id) || this.prefetchingIds.has(line.id)) continue;
      this.prefetchingIds.add(line.id);

      const voiceKey = line.speakerRole === 'ai' ? 'safira' : line.speakerRole === 'narrator' ? 'galang' : line.speakerRole === 'boss' ? 'citra' : 'andi';
      fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: line.text,
          voiceKey,
          emotion: line.emotion || 'neutral',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.audioBase64) {
            this.audioCache.set(line.id, data.audioBase64);
          }
        })
        .catch(() => {})
        .finally(() => {
          this.prefetchingIds.delete(line.id);
        });
    }
  }

  public stopSpeech() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.lastSpokenLineId = null;
  }
}

export const browserAudio = new BrowserAudioEngine();
