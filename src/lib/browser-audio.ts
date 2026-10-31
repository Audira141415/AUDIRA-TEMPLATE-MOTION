'use client';

class BrowserAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenLineId: string | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
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

  // Speech Synthesis Voiceover
  public speakLine(lineId: string, text: string, role: 'human' | 'ai' | string) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (this.lastSpokenLineId === lineId) return;

    this.lastSpokenLineId = lineId;
    window.speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      
      // Adjust pitch and rate for character role
      if (role === 'ai') {
        utterance.pitch = 1.35; // slightly robotic/higher pitch
        utterance.rate = 1.15;
      } else if (role === 'boss') {
        utterance.pitch = 0.7; // deep boss voice
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 1.0; // natural human voice
        utterance.rate = 1.05;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.lastSpokenLineId = null;
  }
}

export const browserAudio = new BrowserAudioEngine();

