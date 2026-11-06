# GROWTH ENGINE: 9:16 Vertical Safe-Zone Standard (1080×1920)
# AUDIRA RETENTION INTELLIGENCE

Mobile social platforms display platform UI elements (search bars, sound titles, profile avatars, like/comment buttons, caption text, and progress bars) on top of the video canvas. Content placed in the danger zones is obscured.

---

## 1. Pixel Clearance Specifications

```
  0px ┌─────────────────────────────────────────┐
      │   TOP DANGER ZONE (Height: 180px)       │  <- Platform Header, Search Bar, Sound Title
180px ├──────────────────┬──────────────────────┤
      │                  │                      │
      │                  │                      │
      │                  │                      │
      │     SAFE         │    RIGHT RAIL        │
      │    ACTION        │    DANGER ZONE       │  <- Avatar, Like, Comment,
      │     AREA         │    (Width: 140px)    │     Bookmark, Share icons
      │                  │                      │
      │   (Width: 860px  │                      │
      │    Height: 1360px│                      │
      │                  │                      │
      │                  │                      │
1540px├──────────────────┴──────────────────────┤
      │   BOTTOM DANGER ZONE (Height: 380px)    │  <- Account name, Caption text, Audio ticker,
1920px└─────────────────────────────────────────┘     Interactive stickers, Scrub bar
      0px              940px                  1080px
```

- **Top Safe Clearance:** Keep **180px** clear of all text, logos, and critical subject faces.
- **Bottom Safe Clearance:** Keep **380px** clear of text subtitles, CTAs, and essential props.
- **Right Rail Danger Zone:** Keep rightmost **140px** clear from $Y = 700\text{px}$ to $Y = 1600\text{px}$.
- **Safe Center Action Box:** $X \in [80, 940]$, $Y \in [180, 1540]$.

---

## 2. Reusable SVG Safe-Zone Mask Overlay

Place this SVG as an overlay during preview development:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <!-- Top Danger Zone -->
  <rect x="0" y="0" width="1080" height="180" fill="red" opacity="0.25" />
  <text x="540" y="100" fill="#fff" font-size="28" font-family="sans-serif" text-anchor="middle">TOP DANGER ZONE (180px)</text>

  <!-- Bottom Danger Zone -->
  <rect x="0" y="1540" width="1080" height="380" fill="red" opacity="0.25" />
  <text x="540" y="1740" fill="#fff" font-size="28" font-family="sans-serif" text-anchor="middle">BOTTOM DANGER ZONE (380px - Caption & UI)</text>

  <!-- Right Danger Zone -->
  <rect x="940" y="600" width="140" height="940" fill="orange" opacity="0.25" />
  <text x="1010" y="1070" fill="#fff" font-size="22" font-family="sans-serif" text-anchor="middle" transform="rotate(-90 1010 1070)">RIGHT RAIL (ICONS)</text>

  <!-- Safe Action Area Box -->
  <rect x="80" y="180" width="860" height="1360" fill="none" stroke="#00FF66" stroke-width="3" stroke-dasharray="8 8" />
  <text x="510" y="240" fill="#00FF66" font-size="26" font-family="sans-serif" text-anchor="middle">SAFE ACTION BOUNDARY</text>
</svg>
```

