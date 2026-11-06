# SOUND DESIGN ENGINE: Dynamic Ducking & Audio Bus Balancing
# AUDIRA AUDIO INTELLIGENCE

A muddy mix where background music drowns out the narrator ruins audience comprehension. The Audira Audio Engine enforces automated, professional sidechain ducking.

---

## 1. 3-Bus Audio Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                   MASTER BUS OUTPUT                    │
│            Master Limiter: Ceiling -1.0 dBFS           │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  VOICE BUS   │     │   SFX BUS    │     │   BGM BUS    │
│  (Priority 1)│     │ (Priority 2) │     │ (Priority 3) │
│  Peak -3dBFS │     │  Peak -6dBFS │     │  Peak -12dBFS│
└──────┬───────┘     └──────────────┘     └──────▲───────┘
       │                                         │
       └─────────── Sidechain Duck Trigger ──────┘
```

---

## 2. Dynamic Ducking Parameters

When Voice Bus activity exceeds `-32 dBFS`:
- **Gain Reduction:** BGM is attenuated by **$-14\text{ dB}$** (Range: $-12\text{ dB}$ to $-16\text{ dB}$).
- **Attack Time:** `45ms` (Fast, unobtrusive ramp-down before speech starts).
- **Hold Time:** `180ms` (Keeps music lowered during brief pauses between words).
- **Release Time:** `450ms` (Smooth, musical return to full volume once speech finishes).

---

## 3. FFMPEG Sidechain Ducking Filter Expression

```bash
ffmpeg -i voiceover.wav -i music.mp3 -filter_complex \
"[1:a]asplit=2[bgm_full][bgm_ctrl]; \
 [bgm_ctrl][0:a]sidechaincompress=threshold=0.03:ratio=8:attack=45:release=450[ducked_bgm]; \
 [0:a][ducked_bgm]amix=inputs=2:weights=1.0 0.85[aout]" \
-map "[aout]" -c:a aac -b:a 320k mixed_master.m4a
```

