# QA GATE: Render Validation
# AUDIRA QUALITY ASSURANCE PROTOCOL

The **Render Validation** protocol ensures that the rendered MP4 file strictly satisfies commercial broadcast, social platform encoding, and audio loudness specifications.

---

## 1. Technical Render Specification Standards

| Attribute | Preview Specification | Final Master Specification |
| --- | --- | --- |
| **Resolution** | 540 × 960 (9:16) | **1080 × 1920 (9:16 vertical HD)** |
| **Framerate** | 30.00 FPS constant | **60.00 FPS constant** (zero dropped frames) |
| **Video Codec** | H.264 / AVC (High Profile @ L4.2) | **H.264 / AVC (High Profile @ L5.1)** |
| **Pixel Format** | `yuv420p` (Universal compatibility) | `yuv420p` |
| **Bitrate Target** | 2.5 Mbps – 4 Mbps | 16 Mbps – 24 Mbps (CRF 18) |
| **Audio Codec** | AAC-LC, Stereo 44.1 kHz, 192 kbps | **AAC-LC, Stereo 48.0 kHz, 320 kbps** |
| **Integrated Loudness** | -16 LUFS ± 1.0 LUFS | **-14.0 LUFS integrated** (EBU R128 / ITU-R BS.1770) |
| **Maximum True Peak** | < -1.0 dBFS | **< -1.0 dBFS** (Strictly zero clipping) |

---

## 2. Automated Validation Commands (PowerShell / Bash)

Run these validation commands on any rendered master:

### 2.1 Video Integrity & Resolution Verification
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -of default=noprint_wrappers=1 out/final.mp4
# Expected output:
# codec_name=h264
# width=1080
# height=1920
# r_frame_rate=60/1
```

### 2.2 Black Frame & Glitch Scan
```bash
ffmpeg -i out/final.mp4 -vf "blackdetect=d=0.1:pix_th=0.10" -f null - 2>&1 | grep -i black_start
# Expected: Empty output (No black frames detected)
```

### 2.3 Audio Loudness Audit (-14 LUFS)
```bash
ffmpeg -i out/final.mp4 -af "ebur128=framelog=verbose" -f null - 2>&1 | grep -E "(Integrated loudness|True peak)"
# Expected:
# Integrated loudness: I: -14.0 LUFS
# True peak: Peak: < -1.0 dBFS
```

