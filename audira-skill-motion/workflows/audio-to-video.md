# WORKFLOW: Audio-to-Video (VO & Music Beat Sync)
# AUDIRA MOTION WORKFLOWS

This workflow anchors 3D visual animation directly to audio cues: speech syllables, voice-over pauses, musical transients, and drop beats.

---

## 1. Input Requirements
- Audio file (`.mp3` or `.wav`).
- Optional transcript or timestamped subtitles (SRT/VTT).

---

## 2. Step-by-Step Execution Pipeline

### Step 1: Audio Analysis & Beat Grid Extraction
1. Measure exact audio duration (`ffprobe -i audio.mp3 -show_entries format=duration`).
2. Detect pauses and sentence endpoints using `npm run vo -- audio.mp3` or silencedetect filter:
   - Identify speech silence blocks (> 300ms) as natural scene cut candidates.
3. Detect musical downbeats and transient spikes for kinetic text reveals or camera snap-zooms.

### Step 2: Beat-Locked Shot Timeline
- Align 3D shot transitions precisely to audio cut points:
  - `Shot 1`: 0.0s to 3.2s (Sentence 1 Hook)
  - `Shot 2`: 3.2s to 7.8s (Sentence 2 Value Proposition)
  - `Shot 3`: 7.8s to 12.4s (Sentence 3 Feature Demonstration)
  - `Shot 4`: 12.4s to End (Sentence 4 CTA)

### Step 3: Character Speech & Action Synchronization
- Character head nods, arm gestures, or visor blinks trigger at the start of vocal phrases.
- Idle breathing animation continues during vocal pauses.

### Step 4: Subtitle & Kinetic Typography Projection
- Display synchronized kinetic subtitles in the lower third (respecting the 280px bottom safe margin).
- Highlight key operative words in primary brand accent color.

### Step 5: Master Audio Mix & Loudness Compliance
- Mix voice-over, background music, and SFX:
  - VO: Centered, prioritized, high clarity.
  - BGM: Ducked by `-12dB` under speech.
- Normalize master output to **-14 LUFS integrated** (EBU R128) with maximum true peak at **-1.0 dBFS**.

