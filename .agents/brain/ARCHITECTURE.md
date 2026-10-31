# ARCHITECTURE — AUDIRA TEMPLATE MOTION

> Technical Architecture, Video Motion Engine, Multi-Voice Synthesis, and Remotion Pipeline.  
> **Version:** v1.0.0-production  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. System Topology Overview

AUDIRA TEMPLATE MOTION dirancang dengan pendekatan modular berbasis Next.js 15, Remotion Core, WebCodecs/Canvas, dan AI Orchestration:

```
                            +-----------------------------------------------+
                            |             Web User Dashboard UI             |
                            |   - Idea Input & Mood Selector (Hyped/Angry)  |
                            |   - Format Switcher (6 Visual Archetypes)     |
                            |   - Interactive Video Player (@remotion/player)|
                            +-----------------------+-----------------------+
                                                    |
                                                    v
+-----------------------------------------------------------------------------------+
|                        AI Script & Storyboard Generator Layer                     |
|                                                                                   |
|  - Prompt Engine: Mengubah ide kasar menjadi naskah berirama dialog & hook 0.4s   |
|  - JSON Storyboard Protocol: Karakter, ekspresi wajah, durasi, dan visual cues    |
|  - Tone Shifter: Sarcastic, Hyped, Angry, Chill, Philosophical                    |
+---------------------------------------------------+-------------------------------+
                                                    |
                                                    v
+-----------------------------------------------------------------------------------+
|                        Audio & Multi-Voice Synthesis Pipeline                     |
|                                                                                   |
|  - TTS Integration: Cartesia Sonic / ElevenLabs / Kokoro (0-npm native fetch)     |
|  - Word-level Timestamp Alignment: Menghitung detik mulai & durasi per kata       |
|  - SFX & Ambience: Chiptune 8-bit, marker squeak, news intro alert, click sounds  |
+---------------------------------------------------+-------------------------------+
                                                    |
                                                    v
+-----------------------------------------------------------------------------------+
|                        Visual Motion Composition Engine (Remotion)                |
|                                                                                   |
|  - Format 1: CharacterBanterComposition (Rigged 2D Avatars, Mouth Bounce, Diner)  |
|  - Format 2: WhiteboardComposition (SVG Path Tracing with Marker Drawing Hand)    |
|  - Format 3: PixelRpgComposition (16-bit Retro Sprites, Battle UI, Dialogue Box)  |
|  - Format 4: BreakingNewsComposition (Lower-third Ticker, Receipt Chat Mockups)   |
|  - Format 5: CleanExplainerComposition (Kinetic SaaS Motion, Animated Charts)     |
|  - Format 6: DocuStoryComposition (Ken Burns Pan/Zoom, Grain, Archive Photos)    |
|  - WordByWordCaptions: Kinetic animated pop-up subtitle overlay                   |
+---------------------------------------------------+-------------------------------+
                                                    |
                                                    v
+-----------------------------------------------------------------------------------+
|                          Rendering & Video Delivery Pipeline                      |
|                                                                                   |
|  - Client-side Quick Export: MediaRecorder / WebCodecs MP4/WebM fast download     |
|  - Server-side Pro Export: Remotion Lambda / Docker FFmpeg worker (1080x1920)     |
|  - Storage: Cloudflare R2 / AWS S3                                                |
+-----------------------------------------------------------------------------------+
```

---

## 2. Format Specification & Render Matrix

| Format ID | Resolusi | FPS | Durasi Rata-rata | Komponen Visual Utama |
| :--- | :--- | :--- | :--- | :--- |
| `character_banter` | 1080x1920 | 30 | 25 - 60s | 2D vector avatars, speaker zoom, reactive mouth sync, 27 background scenes |
| `whiteboard` | 1080x1920 | 30 | 30 - 90s | Animated SVG paths (`stroke-dashoffset`), dynamic marker cursor, paper texture |
| `pixel_rpg` | 1080x1920 | 30 | 20 - 45s | 16-bit pixel art canvas, retro HP bar, bitmap dialogue box, 8-bit SFX |
| `breaking_news` | 1080x1920 | 30 | 20 - 45s | Breaking news red banner, scrolling bottom ticker, floating chat bubbles |
| `clean_explainer`| 1080x1920 | 30 | 30 - 60s | Sleek kinetic cards, progress steps, animated data charts, source citations |
| `docu_story` | 1080x1920 | 30 | 30 - 75s | Ken Burns zoom/pan on photos, analog film grain, audio wavebars |

---

## 3. JSON Storyboard Protocol SSOT

Setiap video direpresentasikan dalam skema JSON terstandar:

```typescript
export interface VideoStoryboard {
  id: string;
  title: string;
  format: 'character_banter' | 'whiteboard' | 'pixel_rpg' | 'breaking_news' | 'clean_explainer' | 'docu_story';
  mood: 'hyped' | 'sarcastic' | 'angry' | 'chill' | 'curious';
  durationInFrames: number;
  fps: number;
  audioUrl?: string;
  backgroundTheme: string;
  lines: Array<{
    id: string;
    speaker: string;
    avatarUrl?: string;
    text: string;
    startFrame: number;
    durationInFrames: number;
    emotion: 'neutral' | 'hyped' | 'angry' | 'shocked' | 'smug';
    words: Array<{
      word: string;
      start: number; // in seconds
      end: number;   // in seconds
    }>;
  }>;
  visualEvents?: Array<{
    frame: number;
    type: 'zoom_in' | 'shake' | 'receipt_pop' | 'level_up' | 'draw_path';
    payload?: any;
  }>;
  commentMagnetHook: string; // Kalimat penutup pemancing komentar
}
```

