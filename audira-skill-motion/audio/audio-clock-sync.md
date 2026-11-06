# SOUND DESIGN ENGINE: Audio-Clock Synchronization
# AUDIRA AUDIO INTELLIGENCE

In high-end commercial animation, **Audio is the Master Clock**. Visual animation must never be constructed at arbitrary lengths and then forced over an audio file. The video timeline is slaves to speech pauses, phrase cadences, and musical transients.

---

## 1. Speech Silence Detection & Scene Pacing

When a voice-over file (`.mp3` or `.wav`) is supplied:
1. Run silence segmentation using ffmpeg:
   ```bash
   ffmpeg -i voiceover.mp3 -af silencedetect=noise=-30dB:d=0.35 -f null -
   ```
2. Interpret the output:
   - Any silence block exceeding `350ms` represents a natural breath pause.
   - **Rule:** Scene cuts and camera angle changes must snap directly to the midpoint of these silence blocks. Never cut while a speaker is mid-syllable!

---

## 2. Word-Level Visual Reaction Mapping

| Vocal Event | Directorial Rule | Visual Reaction |
| --- | --- | --- |
| **Hook Sentence (0.0s – 2.5s)** | Vocal tone is commanding and urgent | Hero prop drops; title snaps with 10% scale overshoot |
| **Operative Power Word** | Stress accent on key noun or metric | Word highlights in primary brand accent hex; subtitle micro-pulse |
| **Comedic / Skeptical Pause** | 0.5s dead silence before punchline | Character freezes motion, blinks once, head tilts 5° |
| **Final Call to Action** | Decisive, confident closing sentence | Camera tracks back; outro badge expands; CTA arrow pulses |

---

## 3. Musical Downbeat Alignment

If no VO is used (Music/SFX-only mode):
- Calculate target BPM: e.g. `120 BPM = 2 beats/second = 30 frames/beat @ 60 FPS`.
- Major scene transitions lock to Bar 1 (every 120 frames / 2.0s).
- Subtitle words trigger on every 8th note (15 frames).

