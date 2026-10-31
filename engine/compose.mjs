// Storyboard + measured voice timeline -> one HyperFrames composition (index.html), 1080x1920.
// Every animation is placed on a single paused GSAP timeline from the voice word timings.

import { extraFormats } from "./formats-extra.mjs";
import { extraFormats2 } from "./formats-extra2.mjs";
import { captionCss, captionScript, pickCaption, pickTransition, transitionCss, transitionHtml, transitionScript } from "./styles.mjs";

const W = 1080;
const H = 1920;

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const short = (text, n) => {
  const words = String(text).replace(/\s+/g, " ").trim().split(" ");
  return words.length <= n ? words.join(" ") : words.slice(0, n).join(" ") + "…";
};

function captionGroups(beats, maxWords) {
  const groups = [];
  beats.forEach((b, bi) => {
    if (b.kind === "hook") return;
    let cur = [];
    const flush = () => {
      if (cur.length) groups.push({ beat: bi, words: cur });
      cur = [];
    };
    b.words.forEach((w) => {
      cur.push(w);
      if (cur.length >= maxWords || /[.,!?:;…]$/.test(w.text)) flush();
    });
    flush();
  });
  groups.forEach((g) => (g.start = Math.max(0.1, g.words[0].start - 0.06)));
  groups.forEach((g, i) => {
    const next = groups[i + 1];
    const last = g.words.at(-1).end;
    g.end = next ? Math.min(next.start, last + 0.35) : last + 0.35;
  });
  return groups;
}

const wordSpans = (words, prefix) =>
  words.map((w, i) => `<span class="pw" id="${prefix}-w${i}">${esc(w.text)}</span>`).join("");

// ---------------------------------------------------------------- formats

const FORMATS = {
  character_banter(sb, beats) {
    const a = sb.characters.characterA;
    const b = sb.characters.characterB;
    const sign = esc(sb.locationName.toUpperCase());
    const signSize = Math.max(26, Math.min(40, Math.floor(620 / Math.max(sign.length, 1))));
    return {
      captions: true,
      css: `
        #bg svg { position:absolute; inset:0; width:100%; height:100%; }
        .actor { position:absolute; top:560px; width:500px; height:820px; transform-origin:50% 100%; }
        #actor-a { left:20px; } #actor-b { right:20px; }
        .actor svg { width:100%; height:100%; overflow:visible; }
        .plate { position:absolute; top:-6px; left:50%; margin-left:-150px; width:300px; text-align:center; }
        .plate span { display:inline-block; padding:12px 26px; border:4px solid #000; border-radius:999px;
          font:900 30px/1 'Archivo Black', Inter, sans-serif; letter-spacing:.04em; box-shadow:6px 6px 0 #000; }
        #actor-a .plate span { background:var(--primary); color:#fff; }
        #actor-b .plate span { background:var(--accent); color:#141413; }
        .plate small { display:block; margin-top:12px; font:700 28px/1 Inter, sans-serif; color:#d4d4d8; letter-spacing:.06em; text-transform:uppercase; }
        #table { position:absolute; left:0; right:0; top:1380px; bottom:0; }`,
      bg: `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1a2e"/><stop offset=".6" stop-color="#100f18"/><stop offset="1" stop-color="#07070b"/></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#wall)"/>
        <g filter="url(#glow)">
          <rect x="190" y="200" width="700" height="104" rx="52" fill="none" stroke="var(--primary)" stroke-width="5"/>
          <text x="540" y="${252 + signSize * 0.36}" fill="var(--accent)" text-anchor="middle" font-family="Archivo Black, Inter" font-size="${signSize}" letter-spacing="4">${sign}</text>
        </g>
        <rect x="110" y="360" width="860" height="560" rx="18" fill="#080a14" stroke="#2a2a33" stroke-width="8"/>
        <g fill="#1b1b22"><rect x="150" y="600" width="80" height="320"/><rect x="380" y="640" width="90" height="280"/><rect x="620" y="610" width="90" height="310"/><rect x="840" y="660" width="90" height="260"/></g>
        <g fill="#26262f"><rect x="250" y="520" width="110" height="400"/><rect x="490" y="470" width="110" height="450"/><rect x="730" y="540" width="95" height="380"/></g>
        <g fill="#f59e0b" opacity=".55"><rect x="275" y="560" width="14" height="14"/><rect x="320" y="620" width="14" height="14"/><rect x="515" y="520" width="14" height="14"/><rect x="560" y="600" width="14" height="14"/><rect x="755" y="590" width="14" height="14"/><rect x="520" y="700" width="14" height="14"/></g>
        <line x1="540" y1="360" x2="540" y2="920" stroke="#2a2a33" stroke-width="8"/>
      </svg>`,
      stage: `
        <div class="actor" id="actor-a">
          <svg viewBox="0 0 500 820">
            <path d="M70 820 C70 590 140 540 250 540 C360 540 430 590 430 820 Z" fill="var(--primary)" stroke="#000" stroke-width="6"/>
            <path d="M200 545 L250 620 L300 545" fill="none" stroke="#000" stroke-width="6"/>
            <rect x="220" y="470" width="60" height="80" rx="12" fill="#f6c9a8" stroke="#000" stroke-width="6"/>
            <ellipse cx="250" cy="340" rx="140" ry="155" fill="#ffd9bd" stroke="#000" stroke-width="6"/>
            <path d="M110 320 C100 170 400 160 390 320 C360 250 300 232 250 232 C190 232 140 250 110 320 Z" fill="#18181b" stroke="#000" stroke-width="6"/>
            <g id="a-brows"><rect id="a-brow-l" x="160" y="285" width="62" height="12" rx="6" fill="#18181b"/><rect id="a-brow-r" x="278" y="285" width="62" height="12" rx="6" fill="#18181b"/></g>
            <g id="a-eyes"><ellipse cx="192" cy="335" rx="16" ry="20" fill="#18181b"/><ellipse cx="308" cy="335" rx="16" ry="20" fill="#18181b"/></g>
            <ellipse cx="160" cy="395" rx="22" ry="12" fill="#fb7185" opacity=".45"/><ellipse cx="340" cy="395" rx="22" ry="12" fill="#fb7185" opacity=".45"/>
            <path id="a-mouth-c" d="M215 420 Q250 440 285 420" fill="none" stroke="#000" stroke-width="7" stroke-linecap="round"/>
            <ellipse id="a-mouth-o" cx="250" cy="428" rx="30" ry="24" fill="#3f0d12" stroke="#000" stroke-width="6" opacity="0"/>
          </svg>
          <div class="plate"><span>${esc(a.name)}</span><small>${esc(a.title)}</small></div>
        </div>
        <div class="actor" id="actor-b">
          <svg viewBox="0 0 500 820">
            <path d="M90 820 C90 610 150 560 250 560 C350 560 410 610 410 820 Z" fill="#27272a" stroke="#000" stroke-width="6"/>
            <circle cx="250" cy="650" r="26" fill="var(--accent)" stroke="#000" stroke-width="5"/>
            <line x1="250" y1="190" x2="250" y2="130" stroke="#000" stroke-width="8"/><circle id="b-led" cx="250" cy="120" r="20" fill="var(--primary)" stroke="#000" stroke-width="6"/>
            <rect x="80" y="190" width="340" height="330" rx="90" fill="var(--accent)" stroke="#000" stroke-width="6"/>
            <rect x="122" y="250" width="256" height="200" rx="56" fill="#141413" stroke="#000" stroke-width="6"/>
            <g id="b-brows"><rect id="b-brow-l" x="158" y="282" width="58" height="10" rx="5" fill="var(--primary)"/><rect id="b-brow-r" x="284" y="282" width="58" height="10" rx="5" fill="var(--primary)"/></g>
            <g id="b-eyes"><rect x="170" y="305" width="34" height="44" rx="12" fill="var(--primary)"/><rect x="296" y="305" width="34" height="44" rx="12" fill="var(--primary)"/></g>
            <path id="b-mouth-c" d="M210 395 L290 395" stroke="var(--primary)" stroke-width="9" stroke-linecap="round"/>
            <rect id="b-mouth-o" x="214" y="378" width="72" height="38" rx="16" fill="var(--primary)" opacity="0"/>
          </svg>
          <div class="plate"><span>${esc(b.name)}</span><small>${esc(b.title)}</small></div>
        </div>
        <div id="table"><svg viewBox="0 0 ${W} 540" width="100%" height="100%" preserveAspectRatio="none">
          <rect width="${W}" height="540" fill="#18181b"/><rect width="${W}" height="18" fill="#3f3f46"/>
          <ellipse cx="540" cy="110" rx="96" ry="22" fill="#000" opacity=".5"/>
          <rect x="488" y="20" width="104" height="82" rx="14" fill="#f4f3f0" stroke="#000" stroke-width="5"/>
          <path d="M592 38 C626 38 626 78 592 78" fill="none" stroke="#f4f3f0" stroke-width="10"/>
        </svg></div>`,
      script: `
        const A = ${JSON.stringify(a.name)};
        const BROW = { angry: [18, -18], shocked: [-10, 10], smug: [0, -14], sarcastic: [-8, 0], hyped: [-6, 6], thoughtful: [6, 0], neutral: [0, 0] };
        let side = null;
        lines.forEach((ln, i) => {
          const isA = ln.speaker === A;
          const me = isA ? "#actor-a" : "#actor-b";
          const other = isA ? "#actor-b" : "#actor-a";
          const p = isA ? "a" : "b";
          tl.to(me, { scale: 1.06, y: -14, opacity: 1, duration: 0.22, ease: "power3.out" }, ln.start - 0.1);
          tl.to(other, { scale: 0.93, y: 10, opacity: 0.62, duration: 0.22, ease: "power3.out" }, ln.start - 0.1);
          const punch = 1.05 + (i % 3) * 0.035;
          tl.to("#cam", { scale: punch, transformOrigin: (isA ? "28%" : "72%") + " 55%", duration: side === p ? 0.5 : 0.28, ease: side === p ? "power2.inOut" : "power4.out" }, ln.start - 0.12);
          const br = BROW[ln.emotion] || BROW.neutral;
          tl.to("#" + p + "-brow-l", { rotation: br[0], y: ln.emotion === "shocked" ? -12 : 0, svgOrigin: p === "a" ? "191 291" : "187 287", duration: 0.18 }, ln.start);
          tl.to("#" + p + "-brow-r", { rotation: br[1], y: ln.emotion === "shocked" ? -12 : 0, svgOrigin: p === "a" ? "309 291" : "313 287", duration: 0.18 }, ln.start);
          talk("#" + p + "-mouth-o", "#" + p + "-mouth-c", ln.words);
          side = p;
        });
        for (let t = 1.7; t < D; t += 3.3) {
          ["#a-eyes", "#b-eyes"].forEach((e, k) => {
            const s = t + k * 0.9;
            tl.to(e, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.06 }, s);
            tl.to(e, { scaleY: 1, duration: 0.08 }, s + 0.1);
          });
        }
        if (hook) tl.to("#cam", { scale: 1, transformOrigin: "50% 55%", duration: 0.6, ease: "power3.inOut" }, hook.start - 0.2);`,
    };
  },

  whiteboard(sb, beats) {
    const lines = beats.filter((b) => b.kind === "line");
    const ICONS = [
      "M60 150 C20 150 10 100 40 80 C30 40 80 20 100 45 C120 10 180 20 180 70 C220 80 220 140 175 150 Z M100 150 L100 200 M70 200 L130 200",
      "M30 120 L190 120 M140 70 L190 120 L140 170",
      "M110 30 C60 30 40 70 40 100 C40 140 75 150 80 185 L140 185 C145 150 180 140 180 100 C180 70 160 30 110 30 Z M85 210 L135 210",
      "M110 30 A80 80 0 1 0 110.1 30 M110 110 L110 60 M110 110 L150 135",
      "M40 170 L40 120 M85 170 L85 90 M130 170 L130 60 M175 170 L175 35 M25 185 L195 185",
      "M110 25 L135 85 L200 90 L150 130 L165 195 L110 160 L55 195 L70 130 L20 90 L85 85 Z",
    ];
    const panels = lines
      .map(
        (l, i) => `
        <div class="wb-panel" id="wb-p${i}" style="top:${300 + i * 1700}px">
          <div class="wb-num">${String(i + 1).padStart(2, "0")}</div>
          <svg class="wb-ico" viewBox="0 0 220 220"><path id="wb-path${i}" d="${ICONS[i % ICONS.length]}"/></svg>
          <div class="wb-head" id="wb-h${i}">${esc(short(l.text, 6))}</div>
          <svg class="wb-under" viewBox="0 0 700 40" preserveAspectRatio="none"><path id="wb-u${i}" d="M10 25 C180 5 420 38 690 14"/></svg>
        </div>`,
      )
      .join("");
    return {
      captions: true,
      css: `
        #root { --brand-ink:rgba(20,20,19,.45); }
        #bg { background:#fbfbf8; }
        #bg::after { content:""; position:absolute; inset:0; background-image:linear-gradient(#e7e5df 2px, transparent 2px), linear-gradient(90deg, #e7e5df 2px, transparent 2px); background-size:72px 72px; opacity:.55; }
        #board { position:absolute; left:0; top:0; width:${W}px; height:${H}px; }
        .wb-panel { position:absolute; left:110px; width:860px; height:720px; }
        .wb-num { font:900 64px/1 Nunito, sans-serif; color:var(--primary); }
        .wb-ico { position:absolute; left:290px; top:40px; width:280px; height:280px; }
        .wb-ico path { fill:none; stroke:#141413; stroke-width:9; stroke-linecap:round; stroke-linejoin:round; }
        .wb-head { position:absolute; top:360px; left:0; right:0; text-align:center; font:900 66px/1.12 Nunito, sans-serif; color:#141413; }
        .wb-under { position:absolute; left:80px; top:560px; width:700px; height:40px; }
        .wb-under path { fill:none; stroke:var(--primary); stroke-width:10; stroke-linecap:round; }
        #pen { position:absolute; left:0; top:0; width:120px; height:120px; }
        #wb-title { position:absolute; top:190px; left:0; right:0; text-align:center; font:800 30px/1 Nunito, sans-serif; color:#71717a; letter-spacing:.12em; text-transform:uppercase; }
        .cap-g .cw { color:#141413; -webkit-text-stroke:0; text-shadow:none; }
        .cap-g .cw[data-on="1"] { color:var(--primary); }`,
      bg: `<div id="wb-title">${esc(short(sb.title, 7))}</div>`,
      stage: `<div id="board">${panels}</div>
        <svg id="pen" viewBox="0 0 120 120"><g transform="rotate(35 60 60)"><rect x="48" y="-20" width="24" height="96" rx="6" fill="var(--primary)" stroke="#000" stroke-width="4"/><path d="M48 76 L60 104 L72 76 Z" fill="#141413"/></g></svg>`,
      script: `
        const SPACING = 1700;
        lines.forEach((ln, i) => {
          if (i > 0) tl.to("#board", { y: -SPACING * i, duration: 0.55, ease: "power3.inOut" }, ln.start - 0.3);
          const path = document.getElementById("wb-path" + i);
          const len = path.getTotalLength();
          const panelTop = 300;
          const drawDur = Math.min(1.6, Math.max(0.8, (ln.end - ln.start) * 0.55));
          tl.set(path, { strokeDasharray: len, strokeDashoffset: len }, 0);
          const prog = { v: 0 };
          tl.fromTo(prog, { v: 0 }, {
            v: 1, duration: drawDur, ease: "none",
            onUpdate: () => {
              path.style.strokeDashoffset = len * (1 - prog.v);
              const pt = path.getPointAtLength(len * prog.v);
              const s = 280 / 220;
              gsap.set("#pen", { x: 110 + 290 + pt.x * s - 30, y: panelTop + 40 + pt.y * s - 100, opacity: prog.v < 1 ? 1 : 0 });
            },
          }, ln.start);
          tl.fromTo("#wb-h" + i, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, ln.start + drawDur * 0.6);
          const u = document.getElementById("wb-u" + i);
          const ul = u.getTotalLength();
          tl.set(u, { strokeDasharray: ul, strokeDashoffset: ul }, 0);
          tl.to(u, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, ln.start + drawDur * 0.6 + 0.25);
        });
        tl.set("#pen", { opacity: 0 }, 0);
        if (hook) tl.to("#board", { opacity: 0.25, duration: 0.4 }, hook.start - 0.2);`,
    };
  },

  pixel_rpg(sb, beats) {
    const a = sb.characters.characterA;
    const b = sb.characters.characterB;
    const px = (rows, colors) =>
      rows
        .map((r, y) =>
          [...r]
            .map((c, x) => (c === "." ? "" : `<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[c]}"/>`))
            .join(""),
        )
        .join("");
    const hero = px(
      ["....kkkk....", "...khhhhk...", "..khhhhhhk..", "..kssssssk..", "..ksksskssk.", "..kssssssk..", "...kssssk...", "..kbbbbbbk..", ".kbbybbybbk.", ".ksbbbbbbsk.", "..kbbbbbbk..", "..kpp..ppk..", "..kpp..ppk..", "..kkk..kkk.."],
      { k: "#0b0b12", h: "#7c2d12", s: "#fcd34d", b: "#2563eb", y: "#facc15", p: "#334155" },
    );
    const boss = px(
      ["..k........k..", ".krk......krk.", ".krrk....krrk.", "..krrkkkkrrk..", "..krrrrrrrrk..", ".krrwwrrwwrrk.", ".krrwkrrkwrrk.", ".krrrrrrrrrrk.", ".krrkwwwwkrrk.", "..krrrrrrrrk..", ".kgrrrrrrrrgk.", "kggkrrrrrrkggk", "kgk.krrrrk.kgk", ".k...kkkk...k."],
      { k: "#0b0b12", r: "#b91c1c", w: "#f8fafc", g: "#16a34a" },
    );
    const lines = beats.filter((x) => x.kind === "line");
    const dialog = lines
      .map((l, i) => `<div class="rpg-say" id="rpg-say${i}"><div class="rpg-who">${esc(l.speaker)}</div><div class="rpg-txt">${wordSpans(l.words, "rpg" + i)}</div></div>`)
      .join("");
    return {
      captions: false,
      css: `
        #bg { background:linear-gradient(#0b1026 0 58%, #1e293b 58% 61%, #14532d 61% 100%); }
        #bg::after { content:""; position:absolute; inset:0; background-image:radial-gradient(#fff 2px, transparent 2.5px); background-size:90px 110px; opacity:.35; height:55%; }
        .sprite { position:absolute; image-rendering:pixelated; }
        .sprite svg { width:100%; height:100%; shape-rendering:crispEdges; }
        #hero { left:110px; top:780px; width:300px; height:350px; }
        #boss { right:90px; top:330px; width:380px; height:380px; }
        .hp { position:absolute; width:440px; padding:16px 18px; background:#0b0b12; border:6px solid #f8fafc; box-shadow:8px 8px 0 #000; font:700 26px/1 'Space Mono', monospace; color:#f8fafc; text-transform:uppercase; }
        .hp .bar { margin-top:12px; height:22px; background:#3f3f46; border:3px solid #f8fafc; }
        .hp .fill { height:100%; width:100%; background:#22c55e; transform-origin:0 50%; }
        #hp-boss { left:90px; top:220px; } #hp-hero { right:90px; top:900px; }
        #rpg-box { position:absolute; left:70px; right:70px; top:1150px; height:178px; background:#0b0b12; border:6px solid #f8fafc; box-shadow:0 0 0 6px #0b0b12, 10px 10px 0 6px #000; }
        .rpg-say { position:absolute; inset:18px 26px; opacity:0; }
        .rpg-who { font:700 26px/1 'Space Mono', monospace; color:#facc15; text-transform:uppercase; margin-bottom:12px; }
        .rpg-txt { font:700 33px/1.3 'Space Mono', monospace; color:#f8fafc; }
        .rpg-txt .pw { opacity:0; }
        #lvl { position:absolute; left:0; right:0; top:560px; text-align:center; font:900 120px/1 'Archivo Black', sans-serif; color:#facc15; -webkit-text-stroke:8px #000; paint-order:stroke fill; opacity:0; }`,
      bg: "",
      stage: `
        <div class="hp" id="hp-boss">${esc(b.name)}<div class="bar"><div class="fill" id="hp-boss-f" style="background:#ef4444"></div></div></div>
        <div class="sprite" id="boss"><svg viewBox="0 0 14 14">${boss}</svg></div>
        <div class="sprite" id="hero"><svg viewBox="0 0 12 14">${hero}</svg></div>
        <div class="hp" id="hp-hero">${esc(a.name)} LV.1<div class="bar"><div class="fill" id="hp-hero-f"></div></div></div>
        <div id="rpg-box">${dialog}</div>
        <div id="lvl">LEVEL UP!</div>`,
      script: `
        const A = ${JSON.stringify(a.name)};
        let hpBoss = 1, hpHero = 1;
        lines.forEach((ln, i) => {
          const heroTurn = ln.speaker === A;
          const me = heroTurn ? "#hero" : "#boss";
          const foe = heroTurn ? "#boss" : "#hero";
          if (i > 0) tl.set("#rpg-say" + (i - 1), { opacity: 0 }, ln.start - 0.05);
          tl.set("#rpg-say" + i, { opacity: 1 }, ln.start - 0.05);
          reveal("rpg" + i, ln.words);
          const hit = ln.start + Math.min(0.5, (ln.end - ln.start) * 0.3);
          tl.to(me, { x: heroTurn ? 120 : -120, y: heroTurn ? -60 : 60, duration: 0.12, ease: "power4.in" }, hit - 0.12);
          tl.to(me, { x: 0, y: 0, duration: 0.3, ease: "power3.out" }, hit);
          [0, 0.08, 0.16, 0.24].forEach((o, k) => tl.set(foe, { opacity: k % 2 ? 1 : 0.15 }, hit + o));
          tl.set(foe, { opacity: 1 }, hit + 0.32);
          tl.fromTo("#cam", { x: 0 }, { x: 14, duration: 0.05, yoyo: true, repeat: 5, ease: "none" }, hit);
          if (heroTurn) { hpBoss = Math.max(0.05, hpBoss - 0.9 / Math.ceil(lines.length / 2)); tl.to("#hp-boss-f", { scaleX: hpBoss, duration: 0.4 }, hit); }
          else { hpHero = Math.max(0.2, hpHero - 0.22); tl.to("#hp-hero-f", { scaleX: hpHero, backgroundColor: hpHero < 0.5 ? "#f59e0b" : "#22c55e", duration: 0.4 }, hit); }
        });
        if (hook) {
          tl.set("#rpg-say" + (lines.length - 1), { opacity: 0 }, hook.start - 0.1);
          tl.to("#hp-boss-f", { scaleX: 0, duration: 0.4 }, hook.start - 0.3);
          tl.to("#boss", { opacity: 0, y: 80, duration: 0.5, ease: "power2.in" }, hook.start - 0.3);
          tl.fromTo("#lvl", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, hook.start - 0.2);
          tl.to("#lvl", { y: -330, scale: 0.6, duration: 0.4, ease: "power3.inOut" }, hook.start + 0.5);
        }`,
    };
  },

  breaking_news(sb, beats) {
    const a = sb.characters.characterA;
    const lines = beats.filter((x) => x.kind === "line");
    const bubbles = lines
      .map((l, i) => {
        const mine = l.speaker !== a.name;
        return `<div class="bub ${mine ? "me" : "them"}" id="bub${i}"><div class="bub-who">${esc(l.speaker)}</div>${wordSpans(l.words, "bub" + i)}</div>`;
      })
      .join("");
    const ticker = esc(`${sb.title}  •  ${sb.locationName}  •  ${sb.commentMagnetHook}  •  `).repeat(3);
    return {
      captions: false,
      css: `
        #bg { background:radial-gradient(circle at 50% 30%, #3b0a0a, #0a0a0f 70%); }
        #bg::after { content:""; position:absolute; inset:0; background-image:repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 6px); }
        #bn-top { position:absolute; left:60px; right:60px; top:200px; display:flex; gap:16px; align-items:stretch; }
        #bn-flag { background:#dc2626; color:#fff; padding:20px 30px; font:900 52px/1 'Archivo Black', sans-serif; letter-spacing:.02em; border:5px solid #000; box-shadow:8px 8px 0 #000; transform-origin:0 50%; }
        #bn-live { background:#fff; color:#dc2626; padding:20px 24px; font:900 38px/1.3 'Archivo Black', sans-serif; border:5px solid #000; box-shadow:8px 8px 0 #000; }
        #bn-head { position:absolute; left:60px; right:60px; top:340px; background:#f8fafc; color:#0a0a0f; padding:22px 28px; font:900 46px/1.15 Inter, sans-serif; border:5px solid #000; box-shadow:8px 8px 0 #000; }
        #phone { position:absolute; left:110px; right:110px; top:560px; height:600px; overflow:hidden; border-radius:40px; background:#111827; border:6px solid #000; box-shadow:12px 12px 0 #000; }
        #chat { position:absolute; left:28px; right:28px; top:30px; }
        .bub { position:relative; max-width:80%; padding:20px 26px; margin-bottom:22px; border-radius:30px; font:700 36px/1.28 Inter, sans-serif; opacity:0; }
        .bub .pw { opacity:.18; }
        .bub-who { font:800 20px/1 Inter, sans-serif; letter-spacing:.08em; text-transform:uppercase; opacity:.7; margin-bottom:8px; }
        .them { background:#374151; color:#f9fafb; border-bottom-left-radius:8px; }
        .me { background:#dc2626; color:#fff; margin-left:auto; border-bottom-right-radius:8px; }
        #lower { position:absolute; left:60px; right:200px; top:1200px; background:#0a0a0f; border-left:14px solid #dc2626; padding:16px 24px; color:#fff; }
        #lower b { position:relative; display:block; height:38px; font:900 34px/1.1 'Archivo Black', sans-serif; }
        .ln { position:absolute; left:0; top:0; font-style:normal; opacity:0; }
        #lower span { font:600 24px/1.4 Inter, sans-serif; color:#d4d4d8; }
        #ticker { position:absolute; left:0; right:0; top:1350px; height:84px; background:#facc15; border-top:5px solid #000; border-bottom:5px solid #000; overflow:hidden; white-space:nowrap; }
        #ticker-in { position:absolute; left:0; top:0; font:900 40px/74px Inter, sans-serif; color:#0a0a0f; }`,
      bg: "",
      stage: `
        <div id="bn-top"><div id="bn-flag">BREAKING NEWS</div><div id="bn-live">LIVE</div></div>
        <div id="bn-head">${esc(sb.title)}</div>
        <div id="phone"><div id="chat">${bubbles}</div></div>
        <div id="lower"><b id="lower-name">${lines.map((l, i) => `<i class="ln" id="ln${i}">${esc(l.speaker)}</i>`).join("")}&nbsp;</b><span>${esc(sb.locationName)}</span></div>
        <div id="ticker"><div id="ticker-in">${ticker}</div></div>`,
      script: `
        tl.fromTo("#bn-flag", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power4.out" }, 0);
        tl.fromTo("#bn-head", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, 0.15);
        tl.fromTo("#ticker-in", { x: 0 }, { x: -2600, duration: D, ease: "none" }, 0);
        for (let t = 0.5; t < D; t += 1) tl.set("#bn-live", { opacity: 0.35 }, t), tl.set("#bn-live", { opacity: 1 }, t + 0.5);
        lines.forEach((ln, i) => {
          tl.fromTo("#bub" + i, { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "back.out(1.8)" }, ln.start - 0.08);
          reveal("bub" + i, ln.words, 0.18);
          if (i > 0) tl.set("#ln" + (i - 1), { opacity: 0 }, ln.start);
          tl.set("#ln" + i, { opacity: 1 }, ln.start);
          tl.fromTo("#lower", { x: -40 }, { x: 0, duration: 0.2, ease: "power3.out" }, ln.start);
        });
        const chat = document.getElementById("chat");
        lines.forEach((ln, i) => {
          const el = document.getElementById("bub" + i);
          const bottom = el.offsetTop + el.offsetHeight;
          const shift = Math.max(0, bottom - 540);
          if (shift > 0) tl.to(chat, { y: -shift, duration: 0.35, ease: "power3.out" }, ln.start - 0.08);
        });`,
    };
  },

  clean_explainer(sb, beats) {
    const lines = beats.filter((x) => x.kind === "line");
    const cards = lines
      .map(
        (l, i) => `<div class="ex-card" id="ex-c${i}" style="top:${i * 190}px"><div class="ex-n">${String(i + 1).padStart(2, "0")}</div><div class="ex-t">${esc(short(l.text, 7))}</div></div>`,
      )
      .join("");
    const bars = lines.map((_, i) => `<div class="ex-bar" id="ex-b${i}" style="left:${i * (560 / lines.length)}px;width:${560 / lines.length - 18}px"></div>`).join("");
    return {
      captions: true,
      css: `
        #bg { background:radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--primary) 45%, transparent), transparent 55%), #0b0b1a; }
        #bg::after { content:""; position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px); background-size:60px 60px; }
        #ex-kicker { position:absolute; left:80px; top:200px; font:700 26px/1 'JetBrains Mono', monospace; color:var(--accent); letter-spacing:.14em; text-transform:uppercase; }
        #ex-title { position:absolute; left:80px; right:80px; top:250px; font:900 64px/1.05 Inter, sans-serif; color:#fff; letter-spacing:-.02em; }
        #ex-list { position:absolute; left:80px; right:80px; top:440px; height:560px; overflow:hidden; }
        #ex-rail { position:absolute; left:0; right:0; top:0; }
        .ex-card { position:absolute; left:0; right:0; height:166px; display:flex; align-items:center; gap:28px; padding:0 32px; background:rgba(255,255,255,.06); border:2px solid rgba(255,255,255,.12); border-radius:28px; opacity:0; }
        .ex-n { font:900 58px/1 'JetBrains Mono', monospace; color:var(--primary); min-width:90px; }
        .ex-t { font:700 38px/1.18 Inter, sans-serif; color:#fff; }
        #ex-chart { position:absolute; left:80px; right:80px; top:1230px; height:120px; border-bottom:3px solid rgba(255,255,255,.35); }
        #ex-bars { position:absolute; left:220px; bottom:0; width:560px; height:120px; }
        .ex-bar { position:absolute; bottom:0; height:100%; background:linear-gradient(var(--accent), var(--primary)); border-radius:12px 12px 0 0; transform-origin:50% 100%; transform:scaleY(0); }
        #ex-count { position:absolute; left:0; bottom:12px; font:900 64px/1 'JetBrains Mono', monospace; color:#fff; }
        #caps { top:1030px !important; }`,
      bg: "",
      stage: `
        <div id="ex-kicker">${esc(sb.locationName)}</div>
        <div id="ex-title">${esc(short(sb.title, 9))}</div>
        <div id="ex-list"><div id="ex-rail">${cards}</div></div>
        <div id="ex-chart"><div id="ex-count">0%</div><div id="ex-bars">${bars}</div></div>`,
      script: `
        tl.fromTo("#ex-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0.05);
        const counter = { v: 0 };
        const countEl = document.getElementById("ex-count");
        lines.forEach((ln, i) => {
          tl.fromTo("#ex-c" + i, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.3, ease: "power4.out" }, ln.start - 0.1);
          if (i > 0) tl.to("#ex-c" + (i - 1), { opacity: 0.4, duration: 0.25 }, ln.start - 0.1);
          if (i >= 3) tl.to("#ex-rail", { y: -(i - 2) * 190, duration: 0.4, ease: "power3.inOut" }, ln.start - 0.15);
          const h = 0.3 + 0.7 * ((i + 1) / lines.length);
          tl.to("#ex-b" + i, { scaleY: h, duration: 0.45, ease: "power3.out" }, ln.start);
          tl.to(counter, { v: Math.round(h * 100), duration: 0.45, ease: "power2.out", onUpdate: () => { countEl.textContent = Math.round(counter.v) + "%"; } }, ln.start);
        });
        tl.set("#caps", { y: 0 }, 0);`,
    };
  },

  docu_story(sb, beats) {
    const lines = beats.filter((x) => x.kind === "line");
    const SCENES = [
      `<svg viewBox="0 0 1080 1100" preserveAspectRatio="xMidYMid slice"><rect width="1080" height="1100" fill="#b9a27c"/><rect y="700" width="1080" height="400" fill="#7d6849"/><g fill="#3e3222"><rect x="120" y="380" width="200" height="330"/><rect x="360" y="300" width="260" height="410"/><rect x="660" y="420" width="300" height="290"/><path d="M360 300 L490 200 L620 300 Z"/></g><g fill="#d8c8a6"><rect x="410" y="380" width="50" height="70"/><rect x="520" y="380" width="50" height="70"/><rect x="170" y="440" width="40" height="60"/></g></svg>`,
      `<svg viewBox="0 0 1080 1100" preserveAspectRatio="xMidYMid slice"><rect width="1080" height="1100" fill="#a8946f"/><circle cx="540" cy="420" r="160" fill="#4a3c2a"/><path d="M290 1100 C300 760 400 640 540 640 C680 640 780 760 790 1100 Z" fill="#4a3c2a"/><rect x="420" y="560" width="240" height="40" fill="#2e251a"/></svg>`,
      `<svg viewBox="0 0 1080 1100" preserveAspectRatio="xMidYMid slice"><rect width="1080" height="1100" fill="#c2ad86"/><g fill="#5b4a33"><rect x="80" y="160" width="920" height="600" rx="10"/></g><g fill="#e6d8b8"><rect x="140" y="220" width="380" height="24"/><rect x="140" y="270" width="800" height="16"/><rect x="140" y="306" width="760" height="16"/><rect x="140" y="342" width="790" height="16"/><rect x="140" y="378" width="560" height="16"/><rect x="140" y="440" width="360" height="260"/></g></svg>`,
      `<svg viewBox="0 0 1080 1100" preserveAspectRatio="xMidYMid slice"><rect width="1080" height="1100" fill="#b09a74"/><g fill="#3a2f20"><circle cx="260" cy="420" r="80"/><path d="M140 900 C150 640 200 540 260 540 C320 540 370 640 380 900 Z"/><circle cx="540" cy="380" r="90"/><path d="M400 900 C410 620 470 500 540 500 C610 500 670 620 680 900 Z"/><circle cx="820" cy="430" r="78"/><path d="M700 900 C710 650 760 550 820 550 C880 550 930 650 940 900 Z"/></g></svg>`,
    ];
    const photos = lines
      .map((_, i) => `<div class="photo" id="ph${i}"><div class="ph-in" id="ph-in${i}">${SCENES[i % SCENES.length]}</div></div>`)
      .join("");
    const bars = Array.from({ length: 28 }, (_, i) => `<div class="wv" id="wv${i}"></div>`).join("");
    return {
      captions: true,
      css: `
        #bg { background:#0c0a08; }
        .photo { position:absolute; left:70px; right:70px; top:300px; height:760px; overflow:hidden; border:14px solid #efe6d2; box-shadow:0 30px 60px rgba(0,0,0,.6); opacity:0; }
        .ph-in { position:absolute; inset:-40px; filter:sepia(.55) contrast(1.05); }
        .ph-in svg { width:100%; height:100%; }
        #grain { position:absolute; inset:-100px; opacity:.16; mix-blend-mode:overlay; pointer-events:none; }
        #vig { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.75)); }
        #doc-stamp { position:absolute; left:80px; top:200px; font:700 28px/1 'IBM Plex Mono', monospace; color:#e8dcc0; letter-spacing:.16em; text-transform:uppercase; }
        #doc-title { position:absolute; left:110px; right:110px; top:900px; padding:24px; background:rgba(12,10,8,.72); font:700 40px/1.2 'Playfair Display', serif; font-style:italic; color:#e8dcc0; text-align:center; opacity:0; }
        #wave { position:absolute; left:250px; width:580px; top:1360px; height:80px; display:flex; gap:8px; align-items:center; }
        .wv { flex:1; height:100%; background:#e8dcc0; border-radius:6px; transform:scaleY(.08); }
        .cap-g .cw { font-family:'Playfair Display', serif !important; font-weight:900; text-transform:none; }
        .cap-g .cw[data-on="1"] { color:#f5c46b; }`,
      bg: "",
      stage: `${photos}
        <div id="doc-stamp">ARSIP · ${esc(sb.locationName)}</div>
        <div id="doc-title">${esc(sb.title)}</div>
        <div id="wave">${bars}</div>`,
      overlay: `<svg id="grain" viewBox="0 0 400 400" preserveAspectRatio="none"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="400" height="400" filter="url(#n)"/></svg><div id="vig"></div>`,
      script: `
        lines.forEach((ln, i) => {
          tl.fromTo("#ph" + i, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power1.inOut" }, Math.max(0, ln.start - 0.3));
          if (i > 0) tl.to("#ph" + (i - 1), { opacity: 0, duration: 0.45 }, ln.start - 0.3);
          const dir = i % 2 ? -1 : 1;
          tl.fromTo("#ph-in" + i, { scale: 1.0, x: -20 * dir, y: 10 }, { scale: 1.14, x: 24 * dir, y: -16, duration: ln.end - ln.start + 0.8, ease: "none" }, Math.max(0, ln.start - 0.3));
          ln.words.forEach((w, k) => {
            for (let b = 0; b < 28; b += 1) {
              const amp = 0.2 + 0.8 * Math.abs(Math.sin((k + 1) * 1.7 + b * 0.9));
              if (b % 3 === k % 3) tl.to("#wv" + b, { scaleY: amp, duration: 0.08 }, w.start);
            }
          });
          tl.to(".wv", { scaleY: 0.08, duration: 0.2 }, ln.end);
        });
        tl.fromTo("#doc-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2);
        tl.to("#doc-title", { opacity: 0, duration: 0.4 }, lines[0] ? lines[0].end : 2);
        for (let t = 0; t < D; t += 1 / 12) tl.set("#grain", { x: ((t * 997) % 100) - 50, y: ((t * 613) % 100) - 50 }, t);`,
    };
  },
};

Object.assign(FORMATS, extraFormats({ esc, short, wordSpans }), extraFormats2({ esc, short, wordSpans }));

export const FORMAT_IDS = Object.keys(FORMATS);
export { CAPTION_STYLES, TRANSITIONS } from "./styles.mjs";

// Word timings estimated from text length, for previews and layout tests without TTS.
export function estimateTimeline(storyboard, { lead = 0.08, gap = 0.14, tail = 0.9 } = {}) {
  const hookSpeaker =
    storyboard.lines.find((l) => l.speakerRole === "ai" || l.speakerRole === "boss") ?? storyboard.lines.at(-1);
  const beats = [
    ...storyboard.lines.map((l) => ({ ...l, kind: "line" })),
    { id: "hook", kind: "hook", speaker: hookSpeaker?.speaker ?? "", speakerRole: hookSpeaker?.speakerRole ?? "narrator", text: storyboard.commentMagnetHook, emotion: "neutral" },
  ].filter((b) => b.text?.trim());
  let cursor = lead;
  const timeline = beats.map((b, i) => {
    const words = b.text.split(/\s+/).filter(Boolean).map((text) => {
      const d = 0.12 + text.replace(/[^\p{L}\p{N}]/gu, "").length * 0.055;
      const w = { text, start: +cursor.toFixed(3), end: +(cursor + d).toFixed(3) };
      cursor += d + (/[.,!?]$/.test(text) ? 0.18 : 0.03);
      return w;
    });
    const beat = { ...b, start: words[0].start, end: words.at(-1).end, words };
    if (i < beats.length - 1) cursor += i === beats.length - 2 ? gap * 2.5 : gap;
    return beat;
  });
  return { duration: +(cursor + tail).toFixed(3), timeline };
}

// ---------------------------------------------------------------- sound design

const SFX = {
  whoosh: { src: "assets/sfx/whoosh-short.mp3", dur: 0.6, vol: 0.35 },
  pop: { src: "assets/sfx/pop.mp3", dur: 0.5, vol: 0.6 },
  hit: { src: "assets/sfx/impact-bass-1.mp3", dur: 1.0, vol: 0.5 },
  notif: { src: "assets/sfx/notification.mp3", dur: 0.8, vol: 0.4 },
};

function sfxCues(format, beats) {
  const lines = beats.filter((b) => b.kind === "line");
  const hook = beats.find((b) => b.kind === "hook");
  const cues = [];
  lines.forEach((ln, i) => {
    if (format === "pixel_rpg") cues.push(["hit", ln.start + Math.min(0.5, (ln.end - ln.start) * 0.3)]);
    else if (format === "breaking_news" || format === "chat_story") cues.push(["notif", ln.start - 0.08]);
    else if (format === "kinetic_type" || format === "top_list") cues.push(["hit", ln.start - 0.06]);
    else if (format === "comic_strip" && ["shocked", "angry", "hyped"].includes(ln.emotion)) cues.push(["hit", ln.start + 0.15]);
    else if (i > 0 && ln.speaker !== lines[i - 1].speaker) cues.push(["whoosh", ln.start - 0.12]);
  });
  if (hook) cues.push(["pop", hook.start - 0.2]);
  return cues.map(([kind, t], i) => ({ id: `sfx-${kind}-${i}`, kind, start: Math.max(0, +t.toFixed(3)) }));
}

const sfxTag = (c) =>
  `<audio id="${c.id}" class="clip" data-start="${c.start}" data-duration="${SFX[c.kind].dur}" data-track-index="3" data-volume="${SFX[c.kind].vol}" src="${SFX[c.kind].src}"></audio>`;

// ---------------------------------------------------------------- assemble

// preview: true drops the audio and loads fonts from Google Fonts, for an in-browser iframe.
export function composeReel(storyboard, voice, { sfx = true, preview = false } = {}) {
  const fmt = FORMATS[storyboard.format] ?? FORMATS.character_banter;
  const beats = voice.timeline;
  const D = voice.duration;
  const f = fmt(storyboard, beats);
  const maxWords = ["hyped", "angry", "rude", "frustrated"].includes(storyboard.mood) ? 3 : 4;
  const groups = f.captions ? captionGroups(beats, maxWords) : [];
  const hook = beats.find((b) => b.kind === "hook");
  const theme = storyboard.visualTheme;
  const cap = pickCaption(storyboard.style?.caption);
  const tx = pickTransition(storyboard.style?.transition);

  const capHtml = groups
    .map(
      (g, gi) =>
        `<div class="cap-g" id="cg${gi}">${g.words.map((w, wi) => `<span class="cw" id="cg${gi}-${wi}">${esc(w.text)}</span>`).join("")}</div>`,
    )
    .join("");

  const T = {
    D,
    beats: beats.map(({ kind, speaker, emotion, start, end, words }) => ({ kind, speaker, emotion, start, end, words })),
    groups: groups.map((g) => ({ start: g.start, end: g.end, words: g.words.map((w) => [w.start, w.end]) })),
  };

  const sfxTags = sfx && !preview ? sfxCues(storyboard.format, beats).map(sfxTag).join("\n  ") : "";
  const voTag = preview
    ? ""
    : `<audio id="vo" class="clip" data-start="0" data-duration="${D}" data-track-index="2" data-volume="1" src="assets/audio/vo.wav"></audio>`;
  const fontLink = preview
    ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=IBM+Plex+Mono:wght@700&family=Nunito:wght@800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Mono:wght@700&display=swap" />`
    : "";

  return `<!doctype html>
<html lang="id" data-resolution="portrait">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<title>${esc(storyboard.title)}</title>
${fontLink}
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
  :root { --primary:${theme.primaryColor}; --accent:${theme.accentColor}; --ground:${theme.backgroundColor}; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:${W}px; height:${H}px; overflow:hidden; background:#000; }
  #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--ground); font-family:Inter, sans-serif; }
  #cam { position:absolute; inset:0; }
  #bg, #stage { position:absolute; inset:0; }
  #brand { position:absolute; right:60px; top:1460px; font:900 28px/1 'Archivo Black', sans-serif; letter-spacing:.14em; color:var(--brand-ink, rgba(255,255,255,.55)); }
  #caps { position:absolute; left:0; right:0; top:1150px; height:200px; }
  .cap-g { position:absolute; left:80px; right:80px; top:0; text-align:center; opacity:0; visibility:hidden; }
  .pw { display:inline-block; margin-right:.25em; }
  .cw { display:inline-block; margin:0 .14em; font:900 82px/1.08 'Archivo Black', Inter, sans-serif; color:#fff; text-transform:uppercase;
        -webkit-text-stroke:10px #000; paint-order:stroke fill; letter-spacing:-.01em; }
  .cw[data-on="1"] { color:var(--primary); }
  #dim { position:absolute; inset:0; background:#000; opacity:0; }
  #hook { position:absolute; left:80px; right:80px; top:640px; padding:56px 48px 52px; background:#f4f3f0; color:#141413;
          border:6px solid #000; border-radius:36px; box-shadow:14px 14px 0 var(--primary); opacity:0; }
  #hook-chip { display:inline-flex; align-items:center; gap:12px; padding:12px 22px; background:var(--primary); color:#fff; border:4px solid #000;
               border-radius:999px; font:900 30px/1 'Archivo Black', sans-serif; letter-spacing:.08em; margin-bottom:28px; }
  #hook-text { font:900 60px/1.12 Inter, sans-serif; letter-spacing:-.02em; }
  ${f.css}
  ${captionCss(cap)}
  ${transitionCss}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${W}" data-height="${H}">
  <div id="fx">
    <div id="cam">
      <div id="bg">${f.bg}</div>
      <div id="stage">${f.stage}</div>
    </div>
  </div>
  ${f.overlay ?? ""}
  ${transitionHtml}
  <div id="brand">AUDIRA MOTION</div>
  <div id="caps" class="cs-${cap}" data-layout-allow-overlap>${capHtml}</div>
  <div id="dim"></div>
  <div id="hook" data-layout-allow-overlap data-layout-allow-occlusion>
    <div id="hook-chip"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4z" fill="#fff" stroke="#000" stroke-width="2"/></svg>KOMENTAR</div>
    <div id="hook-text">${esc(storyboard.commentMagnetHook)}</div>
  </div>
  ${voTag}
  ${sfxTags}
</div>
<script>
  const T = ${JSON.stringify(T)};
  const D = T.D;
  const lines = T.beats.filter((b) => b.kind === "line");
  const hook = T.beats.find((b) => b.kind === "hook");
  const tl = gsap.timeline({ paused: true });

  function talk(openSel, closedSel, words) {
    words.forEach((w) => {
      for (let t = w.start; t < w.end - 0.04; t += 0.15) {
        tl.set(openSel, { opacity: 1 }, t);
        tl.set(closedSel, { opacity: 0 }, t);
        tl.set(openSel, { opacity: 0 }, Math.min(t + 0.09, w.end));
        tl.set(closedSel, { opacity: 1 }, Math.min(t + 0.09, w.end));
      }
    });
  }

  function reveal(prefix, words, dimTo) {
    words.forEach((w, i) => tl.fromTo("#" + prefix + "-w" + i, { opacity: dimTo ?? 0 }, { opacity: 1, duration: 0.06 }, w.start));
  }

  ${captionScript(cap)}

  ${f.script}

  ${transitionScript(tx)}

  if (hook) {
    tl.to("#dim", { opacity: 0.55, duration: 0.3 }, hook.start - 0.25);
    tl.to("#stage", { opacity: 0.35, duration: 0.3 }, hook.start - 0.25);
    tl.fromTo("#hook", { opacity: 0, y: 90, rotation: -2 }, { opacity: 1, y: 0, rotation: 0, duration: 0.42, ease: "back.out(1.6)" }, hook.start - 0.2);
  }
  tl.set({}, {}, D);
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
</script>
</body>
</html>
`;
}
