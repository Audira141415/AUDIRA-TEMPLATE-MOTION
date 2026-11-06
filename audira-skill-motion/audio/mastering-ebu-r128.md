# SOUND DESIGN ENGINE: Mastering & EBU R128 Loudness Protocol
# AUDIRA AUDIO INTELLIGENCE

All Audira final renders must comply strictly with modern digital streaming and social platform loudness standards (EBU R128 / ITU-R BS.1770-4).

---

## 1. Loudness Target Specifications

| Parameter | Platform Standard | Audira Production Rule | Why It Matters |
| --- | --- | --- | --- |
| **Integrated Loudness ($I$)** | $-14.0\text{ LUFS} \pm 1.0\text{ LUFS}$ | **$-14.0\text{ LUFS}$ (Strict)** | Matches TikTok, YouTube Shorts, and Instagram Reels normalization algorithms |
| **Maximum True Peak ($TP$)** | $\le -1.0\text{ dBFS}$ | **$-1.0\text{ dBFS}$** | Prevents inter-sample peak distortion when compressed to lossy codecs |
| **Loudness Range ($LRA$)** | $5.0\text{ LU} - 9.0\text{ LU}$ | **$6.5\text{ LU}$** | Guarantees clear vocal intelligibility on small mobile phone speakers |
| **Sample Rate** | 48,000 Hz (48 kHz) | **48 kHz / 24-bit** | Video broadcast standard |

---

## 2. Automated Normalization Command

To normalize an unmastered audio track to exactly -14 LUFS with True Peak limiting:

```bash
ffmpeg -i mixed_audio.wav -af loudnorm=I=-14:TP=-1.0:LRA=7:print_format=summary master_normalized.wav
```

---

## 3. Loudness Verification Pass / Fail Gate

Run after final muxing:
```bash
ffmpeg -i out/final.mp4 -af "ebur128=framelog=verbose" -f null - 2>&1 | tail -n 15
```

- **PASS:** Integrated loudness between `-13.5 LUFS` and `-14.5 LUFS`, True Peak below `-1.0 dBFS`.
- **FAIL / REJECT:** Integrated loudness louder than `-13.0 LUFS` (will be penalized and turned down by TikTok algorithms) or softer than `-16.0 LUFS` (barely audible to mobile viewers).

