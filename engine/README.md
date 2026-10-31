# AUDIRA Motion Engine

Storyboard JSON → suara multi-karakter (Cartesia) → komposisi HyperFrames → MP4 1080x1920.

```
node engine/build-reel.mjs <storyboard.json> --out renders/<id> [--quality draft|looks|delivery]
```

| Flag | Fungsi |
| --- | --- |
| `--no-render` | Berhenti setelah `index.html` tersusun (untuk preview / snapshot) |
| `--reuse-voice` | Pakai `timeline.json` + `vo.wav` yang sudah ada, tanpa memanggil Cartesia lagi |
| `--dry-voice` | Timing perkiraan + audio hening, hanya untuk uji layout |

- `tts.mjs`: satu suara per peran (human, ai, narrator, boss), kecepatan mengikuti mood. Klip disambung berurutan, dan suara menjadi jam utama.
- `compose.mjs`: 6 format (`character_banter`, `whiteboard`, `pixel_rpg`, `breaking_news`, `clean_explainer`, `docu_story`). Caption kata per kata, hook komentar penutup, dan SFX dikunci ke timestamp kata.
- Hasil di `<out>/`: `index.html`, `assets/audio/vo.wav`, `vo-words.json`, `timeline.json`, `status.json`, `reel.mp4`.
- Studio memanggilnya lewat `POST /api/render`, lalu memantau `GET /api/render/<id>` dan mengunduh dari `/api/render/<id>/file`.
- Override suara per karakter: `characters.characterA.voiceId`.
