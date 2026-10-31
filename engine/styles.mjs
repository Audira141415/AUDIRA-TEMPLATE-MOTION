// Caption looks and scene-change transitions shared by every format. "auto" keeps the
// format's own look; any other id overrides it.

export const CAPTION_STYLES = {
  auto: "Bawaan format",
  pop: "Pop tebal",
  box: "Kotak sorot",
  karaoke: "Karaoke",
  bounce: "Memantul",
  neon: "Neon",
  typewriter: "Mesin ketik",
  minimal: "Minimalis",
  outline: "Garis luar",
};

export const TRANSITIONS = {
  auto: "Bawaan format",
  flash: "Kilat putih",
  wipe: "Sapuan warna",
  zoom: "Zoom hentak",
  glitch: "Glitch RGB",
  shutter: "Rana kamera",
  whip: "Whip pan",
  iris: "Lingkaran membuka",
};

export const pickCaption = (id) => (id in CAPTION_STYLES ? id : "auto");
export const pickTransition = (id) => (id in TRANSITIONS ? id : "auto");

// Scoped by #caps.cs-<id> so it outranks each format's own `.cap-g .cw` rules.
export function captionCss(id) {
  const base = `#caps.cs-${id} .cw`;
  switch (id) {
    case "pop":
      return `${base} { font:900 82px/1.08 'Archivo Black', Inter, sans-serif !important; color:#fff; text-transform:uppercase;
          -webkit-text-stroke:10px #000; paint-order:stroke fill; text-shadow:none; }
        ${base}[data-on="1"] { color:var(--primary); }`;
    case "box":
      return `${base} { font:800 70px/1.25 Inter, sans-serif !important; color:#fff; text-transform:none; -webkit-text-stroke:0; padding:0 .16em;
          border-radius:.18em; text-shadow:0 4px 18px rgba(0,0,0,.55); }
        ${base}[data-on="1"] { background:var(--primary); color:#fff; text-shadow:none; }`;
    case "karaoke":
      return `${base} { font:900 76px/1.12 'Archivo Black', Inter, sans-serif !important; color:rgba(255,255,255,.38); text-transform:uppercase;
          -webkit-text-stroke:8px #000; paint-order:stroke fill; text-shadow:none; }
        ${base}[data-on="1"] { color:var(--primary); }`;
    case "bounce":
      return `${base} { font:900 84px/1.1 Nunito, Inter, sans-serif !important; color:#fff; text-transform:none; -webkit-text-stroke:9px #000;
          paint-order:stroke fill; text-shadow:none; opacity:0; }
        ${base}[data-on="1"] { color:var(--accent); }`;
    case "neon":
      return `${base} { font:900 78px/1.12 'Archivo Black', Inter, sans-serif !important; color:#fff; text-transform:uppercase; -webkit-text-stroke:0;
          text-shadow:0 0 6px var(--primary), 0 0 18px var(--primary), 0 0 36px var(--primary); }
        ${base}[data-on="1"] { color:var(--accent); text-shadow:0 0 8px var(--accent), 0 0 24px var(--accent), 0 0 48px var(--accent); }`;
    case "typewriter":
      return `${base} { font:700 62px/1.3 'JetBrains Mono', monospace !important; color:#fff; text-transform:none; -webkit-text-stroke:0; margin:0 .08em;
          background:rgba(0,0,0,.72); padding:.02em .12em; text-shadow:none; opacity:0; }
        ${base}[data-on="1"] { color:var(--accent); }`;
    case "minimal":
      return `#caps.cs-minimal .cap-g { top:60px; }
        ${base} { font:600 54px/1.3 Inter, sans-serif !important; color:#fff; text-transform:none; -webkit-text-stroke:0; margin:0 .1em;
          text-shadow:0 2px 12px rgba(0,0,0,.85); }`;
    case "outline":
      return `${base} { font:900 86px/1.08 'Archivo Black', Inter, sans-serif !important; color:transparent; text-transform:uppercase;
          -webkit-text-stroke:4px #fff; paint-order:normal; text-shadow:none; }
        ${base}[data-on="1"] { color:var(--primary); -webkit-text-stroke:4px var(--primary); }`;
    default:
      return "";
  }
}

// Builds the caption tweens for the chosen look; runs inside the composition script.
export function captionScript(id) {
  return `
  const CAP = ${JSON.stringify(id)};
  T.groups.forEach((g, gi) => {
    const id = "#cg" + gi;
    tl.set(id, { visibility: "visible" }, g.start);
    if (CAP === "neon") {
      [[0, 0.3], [0.04, 0.9], [0.08, 0.4], [0.12, 1]].forEach(([dt, o]) => tl.set(id, { opacity: o }, g.start + dt));
    } else if (CAP === "minimal") {
      tl.fromTo(id, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "power1.out" }, g.start);
    } else {
      tl.fromTo(id, { opacity: 0, y: 26, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "power4.out" }, g.start);
    }
    g.words.forEach((w, wi) => {
      const el = id + "-" + wi;
      const next = wi < g.words.length - 1 ? g.words[wi + 1][0] : null;
      if (CAP === "bounce") tl.fromTo(el, { opacity: 0, y: -70 }, { opacity: 1, y: 0, duration: 0.32, ease: "bounce.out" }, w[0]);
      else if (CAP === "typewriter") tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.01 }, w[0]);
      else if (CAP === "box") tl.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.12, ease: "power2.out" }, w[0]);
      else if (CAP === "auto" || CAP === "pop" || CAP === "outline") tl.fromTo(el, { scale: 0.7 }, { scale: 1, duration: 0.14, ease: "back.out(3)" }, w[0]);
      if (CAP === "minimal") return;
      tl.set(el, { attr: { "data-on": 1 } }, w[0]);
      if (next !== null && CAP !== "karaoke") tl.set(el, { attr: { "data-on": 0 } }, next);
    });
    tl.to(id, { opacity: 0, duration: 0.08, ease: "power2.in" }, g.end - 0.08);
    tl.set(id, { opacity: 0, visibility: "hidden" }, g.end);
  });`;
}

export const transitionCss = `
  #fx { position:absolute; inset:0; }
  .tx { position:absolute; inset:0; pointer-events:none; opacity:0; }
  #tx-flash { background:#fff; }
  #tx-wipe { background:var(--primary); opacity:1; }
  #tx-top, #tx-bot { background:#000; opacity:1; left:0; right:0; height:50%; }
  #tx-top { top:0; bottom:auto; }
  #tx-bot { top:auto; bottom:0; }
  #tx-iris { left:50%; top:50%; width:200px; height:200px; margin:-100px 0 0 -100px; border-radius:50%; background:var(--primary); }
  #tx-r, #tx-c { mix-blend-mode:screen; }
  #tx-r { background:rgba(255,0,60,.45); } #tx-c { background:rgba(0,220,255,.45); }`;

export const transitionHtml = `<div class="tx" id="tx-flash"></div><div class="tx" id="tx-wipe"></div><div class="tx" id="tx-top"></div><div class="tx" id="tx-bot"></div><div class="tx" id="tx-iris"></div><div class="tx" id="tx-r"></div><div class="tx" id="tx-c"></div>`;

// Fires the chosen transition at every line change and before the closing hook.
export function transitionScript(id) {
  return `
  const TX = ${JSON.stringify(id)};
  tl.set("#tx-wipe", { x: -1200 }, 0);
  tl.set("#tx-top", { y: -1000 }, 0);
  tl.set("#tx-bot", { y: 1000 }, 0);
  const cuts = lines.slice(1).map((l) => l.start - 0.12);
  if (hook) cuts.push(hook.start - 0.3);
  cuts.forEach((t0) => {
    t0 = Math.max(0, t0);
    if (TX === "flash") {
      tl.fromTo("#tx-flash", { opacity: 0.85 }, { opacity: 0, duration: 0.22, ease: "power2.out" }, t0);
    } else if (TX === "wipe") {
      tl.fromTo("#tx-wipe", { x: -1200 }, { x: 0, duration: 0.16, ease: "power3.in" }, t0 - 0.08);
      tl.to("#tx-wipe", { x: 1200, duration: 0.18, ease: "power3.out" }, t0 + 0.08);
    } else if (TX === "zoom") {
      tl.fromTo("#fx", { scale: 1.14 }, { scale: 1, duration: 0.32, ease: "power4.out" }, t0);
    } else if (TX === "glitch") {
      [[0, 18, -14], [0.05, -22, 10], [0.1, 12, -6], [0.15, 0, 0]].forEach(([dt, x, s]) => tl.set("#fx", { x, skewX: s / 2 }, t0 + dt));
      tl.fromTo("#tx-r", { opacity: 1, x: -16 }, { opacity: 0, x: 0, duration: 0.2 }, t0);
      tl.fromTo("#tx-c", { opacity: 1, x: 16 }, { opacity: 0, x: 0, duration: 0.2 }, t0);
    } else if (TX === "shutter") {
      tl.to("#tx-top", { y: 0, duration: 0.1, ease: "power2.in" }, t0 - 0.1);
      tl.to("#tx-bot", { y: 0, duration: 0.1, ease: "power2.in" }, t0 - 0.1);
      tl.to("#tx-top", { y: -1000, duration: 0.18, ease: "power3.out" }, t0 + 0.04);
      tl.to("#tx-bot", { y: 1000, duration: 0.18, ease: "power3.out" }, t0 + 0.04);
    } else if (TX === "whip") {
      tl.fromTo("#fx", { x: 260, skewX: -10 }, { x: 0, skewX: 0, duration: 0.26, ease: "power4.out" }, t0);
    } else if (TX === "iris") {
      tl.fromTo("#tx-iris", { opacity: 1, scale: 0 }, { scale: 22, duration: 0.3, ease: "power2.in" }, t0 - 0.12);
      tl.to("#tx-iris", { opacity: 0, duration: 0.16 }, t0 + 0.18);
    }
  });`;
}
