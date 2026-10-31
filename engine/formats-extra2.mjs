// Six more reel formats (batch 2). Same contract as formats-extra.mjs.

export function extraFormats2({ esc, short, wordSpans }) {
  const linesOf = (beats) => beats.filter((b) => b.kind === "line");
  const initial = (name) => esc(String(name).trim().charAt(0).toUpperCase() || "?");

  // "Rp 45.000", "45 ribu", "45rb", "45k", "1,5 juta" -> rupiah value, else null.
  const parsePrice = (text) => {
    const m = String(text).match(/(?:rp\.?\s*)?(\d+(?:[.,]\d+)*)\s*(juta|jt|ribu|rb|k)?\b/i);
    if (!m || (!/rp/i.test(m[0]) && !m[2])) return null;
    let n = m[2] ? parseFloat(m[1].replace(",", ".")) : parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (/juta|jt/i.test(m[2] ?? "")) n *= 1_000_000;
    else if (m[2]) n *= 1000;
    return Math.round(n);
  };
  const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
  const itemLabel = (text) =>
    String(text)
      .replace(/(?:rp\.?\s*)?\d+(?:[.,]\d+)*\s*(?:juta|jt|ribu|rb|k)?\b/gi, (m) => (/rp|juta|jt|ribu|rb|k/i.test(m) ? "" : m))
      .replace(/[\s,.:;-]+$/, "")
      .trim();

  return {
    map_journey(sb, beats) {
      const lines = linesOf(beats);
      const n = Math.max(lines.length, 2);
      const pts = lines.map((_, i) => ({ x: i % 2 ? 790 - (i % 3) * 40 : 290 + (i % 3) * 40, y: 330 + (i * 700) / (n - 1) }));
      const d = pts.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `C${pts[i - 1].x} ${pts[i - 1].y + 120} ${p.x} ${p.y - 120} ${p.x} ${p.y}`)).join(" ");
      const pins = pts
        .map(
          (p, i) => `<g transform="translate(${p.x} ${p.y})"><g class="mj-pin" id="mjp${i}">
            <path d="M0 0 C-30 -40 -34 -70 0 -84 C34 -70 30 -40 0 0 Z" fill="var(--primary)" stroke="#111" stroke-width="5"/>
            <circle cy="-56" r="13" fill="#fff"/></g></g>`,
        )
        .join("");
      const labels = pts
        .map(
          (p, i) =>
            `<div class="mj-lab" id="mjl${i}" style="top:${p.y - 70}px;${p.x < 540 ? `left:${p.x + 46}px` : `right:${1080 - p.x + 46}px`}"><b>${String(i + 1).padStart(2, "0")}</b>${esc(short(lines[i].text, 5))}</div>`,
        )
        .join("");
      return {
        captions: true,
        css: `
          #bg { background:#e9e3d2; }
          #mj-map { position:absolute; inset:0; width:100%; height:100%; }
          #mj-head { position:absolute; left:70px; top:190px; padding:12px 22px; background:#111; color:#fff; border-radius:12px;
            font:700 28px/1 'JetBrains Mono', monospace; letter-spacing:.12em; text-transform:uppercase; }
          .mj-pin { opacity:0; }
          .mj-lab { position:absolute; max-width:420px; padding:14px 20px; background:#fff; border:4px solid #111; border-radius:16px;
            box-shadow:6px 6px 0 #111; font:800 30px/1.2 Inter, sans-serif; color:#111; opacity:0; }
          .mj-lab b { display:block; font:900 22px/1 'JetBrains Mono', monospace; color:var(--primary); margin-bottom:6px; }
          #caps { top:1150px !important; }
          .cap-g .cw { color:#111; -webkit-text-stroke:0; }
          .cap-g .cw[data-on="1"] { color:var(--primary); }
          #root { --brand-ink:rgba(17,17,17,.4); }`,
        bg: `<svg id="mj-map" viewBox="0 0 1080 1920">
          <g stroke="#d6cfba" stroke-width="2">${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 140}" x2="1080" y2="${i * 140}"/><line x1="${i * 90}" y1="0" x2="${i * 90}" y2="1920"/>`).join("")}</g>
          <path d="M-20 420 C180 360 260 520 420 470 C560 420 520 260 700 250 C880 240 980 380 1100 330 L1100 -20 L-20 -20 Z" fill="#cfe3d0"/>
          <path d="M-20 1180 C200 1080 300 1240 520 1170 C720 1100 760 980 1100 1040 L1100 1500 L-20 1500 Z" fill="#cfe3d0"/>
          <path d="M600 640 C700 600 820 660 860 760 C900 860 780 920 680 880 C580 840 520 700 600 640 Z" fill="#b9d6e8"/>
          <path id="mj-route" d="${d}" fill="none" stroke="#111" stroke-width="9" stroke-dasharray="1 0" stroke-linecap="round"/>
          ${pins}
          <circle id="mj-dot" r="18" fill="#fff" stroke="#111" stroke-width="6" cx="${pts[0]?.x ?? 0}" cy="${pts[0]?.y ?? 0}"/>
        </svg>`,
        stage: `<div id="mj-head">Rute · ${esc(short(sb.locationName, 4))}</div>${labels}`,
        script: `
          const route = document.getElementById("mj-route");
          const total = route.getTotalLength();
          const n = lines.length;
          const stops = [0];
          for (let i = 1; i < n; i++) {
            let lo = stops[i - 1], hi = total;
            const target = ${JSON.stringify(pts)}[i];
            for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; const p = route.getPointAtLength(mid); if (p.y < target.y - 0.5) lo = mid; else hi = mid; }
            stops.push(hi);
          }
          tl.set(route, { strokeDasharray: total, strokeDashoffset: total }, 0);
          const prog = { v: 0 };
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.1);
            if (i > 0) {
              tl.to(prog, { v: stops[i], duration: Math.min(0.9, Math.max(0.4, (ln.end - ln.start) * 0.4)), ease: "power2.inOut",
                onUpdate: () => {
                  route.style.strokeDashoffset = total - prog.v;
                  const p = route.getPointAtLength(prog.v);
                  gsap.set("#mj-dot", { attr: { cx: p.x, cy: p.y } });
                } }, t0);
            }
            const pinAt = i > 0 ? t0 + Math.min(0.9, Math.max(0.4, (ln.end - ln.start) * 0.4)) : t0;
            tl.fromTo("#mjp" + i, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out" }, pinAt);
            tl.fromTo("#mjl" + i, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, pinAt + 0.1);
          });`,
      };
    },

    recipe_steps(sb, beats) {
      const lines = linesOf(beats);
      const n = lines.length;
      const cards = lines
        .map(
          (l, i) => `<div class="rc-card" id="rcc${i}"><p class="rc-step">Langkah ${i + 1}/${n}</p><p class="rc-txt">${wordSpans(l.words, "rc" + i)}</p></div>`,
        )
        .join("");
      const drops = lines
        .map((_, i) => `<circle class="rc-drop" id="rcd${i}" cx="${430 + ((i * 53) % 220)}" cy="0" r="${22 + (i % 3) * 6}" fill="${["var(--primary)", "var(--accent)", "#84cc16", "#f59e0b"][i % 4]}"/>`)
        .join("");
      return {
        captions: false,
        css: `
          #bg { background:#fff7ed; }
          #bg::after { content:""; position:absolute; inset:0; background-image:linear-gradient(90deg, rgba(234,88,12,.06) 50%, transparent 50%),
            linear-gradient(rgba(234,88,12,.06) 50%, transparent 50%); background-size:120px 120px; }
          #rc-title { position:absolute; left:70px; right:70px; top:190px; padding:22px 30px; background:var(--primary); color:#fff; border:5px solid #111;
            border-radius:24px; box-shadow:8px 8px 0 #111; font:900 48px/1.1 Inter, sans-serif; }
          #rc-pot { position:absolute; left:0; top:360px; width:1080px; height:520px; }
          .rc-card { position:absolute; left:70px; right:70px; top:880px; min-height:300px; padding:32px 36px; background:#fff; border:5px solid #111;
            border-radius:28px; box-shadow:10px 10px 0 #111; opacity:0; }
          .rc-step { font:900 26px/1 'JetBrains Mono', monospace; color:var(--primary); letter-spacing:.1em; text-transform:uppercase; }
          .rc-txt { margin-top:16px; font:800 46px/1.2 Inter, sans-serif; color:#111; }
          .rc-txt .pw { opacity:.15; }
          #rc-bar { position:absolute; left:70px; right:70px; top:1220px; height:16px; background:#fed7aa; border:3px solid #111; border-radius:10px; overflow:hidden; }
          #rc-fill { height:100%; width:100%; background:var(--primary); transform-origin:0 50%; transform:scaleX(0); }
          #root { --brand-ink:rgba(17,17,17,.4); }`,
        bg: "",
        stage: `<div id="rc-title">${esc(short(sb.title, 7))}</div>
          <svg id="rc-pot" viewBox="0 0 1080 520">
            <g id="rc-steam" fill="none" stroke="#d6d3d1" stroke-width="10" stroke-linecap="round">
              <path d="M460 120 C440 80 480 60 460 20"/><path d="M540 120 C520 80 560 60 540 20"/><path d="M620 120 C600 80 640 60 620 20"/></g>
            ${drops}
            <path d="M330 220 L750 220 L720 440 C715 470 690 490 660 490 L420 490 C390 490 365 470 360 440 Z" fill="#334155" stroke="#111" stroke-width="8"/>
            <rect x="300" y="200" width="480" height="40" rx="18" fill="#475569" stroke="#111" stroke-width="8"/>
            <rect x="250" y="250" width="70" height="24" rx="12" fill="#111"/><rect x="760" y="250" width="70" height="24" rx="12" fill="#111"/>
          </svg>
          ${cards}<div id="rc-bar"><div id="rc-fill"></div></div>`,
        script: `
          for (let t = 0.4; t < D; t += 1.2) {
            tl.fromTo("#rc-steam", { y: 0, opacity: 0.9 }, { y: -30, opacity: 0.2, duration: 1.1, ease: "none" }, t);
          }
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.1);
            if (i > 0) tl.to("#rcc" + (i - 1), { opacity: 0, x: -80, duration: 0.2 }, t0 - 0.05);
            tl.fromTo("#rcc" + i, { opacity: 0, x: 120, rotation: 2 }, { opacity: 1, x: 0, rotation: 0, duration: 0.3, ease: "power4.out" }, t0);
            reveal("rc" + i, ln.words, 0.15);
            tl.fromTo("#rcd" + i, { attr: { cy: -40 } }, { attr: { cy: 250 }, duration: 0.45, ease: "power2.in" }, t0 + 0.15);
            tl.to("#rcd" + i, { opacity: 0, duration: 0.15 }, t0 + 0.6);
            tl.fromTo("#rc-pot", { scaleY: 0.96, transformOrigin: "50% 90%" }, { scaleY: 1, duration: 0.25, ease: "back.out(3)" }, t0 + 0.6);
            tl.to("#rc-fill", { scaleX: (i + 1) / lines.length, duration: 0.35, ease: "power2.out" }, t0);
          });`,
      };
    },

    social_post(sb, beats) {
      const lines = linesOf(beats);
      const a = sb.characters.characterA;
      const handle = (name) => "@" + String(name).toLowerCase().replace(/[^a-z0-9]+/g, "");
      const posts = lines
        .map((l, i) => {
          const c = l.speaker === a.name ? a : sb.characters.characterB;
          const likes = 120 + ((i * 937) % 4800);
          return `<article class="sp-post" id="spp${i}">
            <div class="sp-av" style="background:${l.speaker === a.name ? "var(--primary)" : "var(--accent)"}">${initial(c.name)}</div>
            <div class="sp-body"><p class="sp-who"><b>${esc(c.name)}</b> <span>${esc(handle(c.name))} · ${i + 1}j</span></p>
              <p class="sp-txt">${esc(l.text)}</p>
              <p class="sp-stats"><span>Balas ${12 + i * 7}</span><span>Bagikan ${30 + i * 19}</span><span class="sp-like">♥ <i id="spl${i}" data-likes="${likes}">0</i></span></p></div>
          </article>`;
        })
        .join("");
      return {
        captions: false,
        css: `
          #bg { background:#f5f5f4; }
          #sp-head { position:absolute; left:0; right:0; top:168px; height:110px; display:flex; align-items:center; justify-content:center; background:#fff;
            border-bottom:2px solid #e7e5e4; font:900 40px/1 Inter, sans-serif; color:#111; }
          #sp-area { position:absolute; left:0; right:0; top:280px; height:1040px; overflow:hidden; }
          #sp-list { position:absolute; left:0; right:0; top:0; }
          .sp-post { display:flex; gap:24px; padding:30px 44px; background:#fff; border-bottom:2px solid #e7e5e4; opacity:0; }
          .sp-av { flex:none; width:96px; height:96px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff;
            font:900 44px/1 'Archivo Black', sans-serif; border:4px solid #111; }
          .sp-who { font:500 30px/1.2 Inter, sans-serif; color:#78716c; } .sp-who b { color:#111; font-weight:800; }
          .sp-txt { margin-top:10px; font:500 40px/1.3 Inter, sans-serif; color:#111; }
          .sp-stats { margin-top:18px; display:flex; gap:48px; font:600 28px/1 Inter, sans-serif; color:#78716c; }
          .sp-like { color:#e11d48; } .sp-like i { font-style:normal; }
          #root { --brand-ink:rgba(17,17,17,.35); }`,
        bg: "",
        stage: `<div id="sp-head">Utas</div><div id="sp-area"><div id="sp-list">${posts}</div></div>`,
        script: `
          const list = document.getElementById("sp-list");
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.08);
            const el = document.getElementById("spp" + i);
            tl.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" }, t0);
            const shift = Math.max(0, el.offsetTop + el.offsetHeight - 1000);
            if (shift > 0) tl.to(list, { y: -shift, duration: 0.3, ease: "power3.out" }, t0);
            const likeEl = document.getElementById("spl" + i);
            const target = Number(likeEl.dataset.likes);
            const c = { v: 0 };
            tl.to(c, { v: target, duration: Math.max(1, D - t0 - 1), ease: "power2.out",
              onUpdate: () => { likeEl.textContent = Math.round(c.v).toLocaleString("id-ID"); } }, t0 + 0.3);
          });`,
      };
    },

    receipt(sb, beats) {
      const lines = linesOf(beats);
      const prices = lines.map((l) => parsePrice(l.text));
      const sum = prices.reduce((s, p) => s + (p ?? 0), 0);
      const rows = lines
        .map(
          (l, i) =>
            `<div class="rp-row" id="rpr${i}"><span>${esc(short(itemLabel(l.text), 5))}</span><b>${prices[i] != null ? rupiah(prices[i]) : ""}</b></div>`,
        )
        .join("");
      return {
        captions: true,
        css: `
          #bg { background:#1c1917; }
          #rp-paper { position:absolute; left:150px; right:150px; top:180px; padding:40px 44px 70px; background:#fafaf9; color:#1c1917;
            font:700 30px/1.35 'IBM Plex Mono', monospace; clip-path:polygon(0 0,100% 0,100% calc(100% - 24px),95% 100%,90% calc(100% - 24px),85% 100%,80% calc(100% - 24px),75% 100%,70% calc(100% - 24px),65% 100%,60% calc(100% - 24px),55% 100%,50% calc(100% - 24px),45% 100%,40% calc(100% - 24px),35% 100%,30% calc(100% - 24px),25% 100%,20% calc(100% - 24px),15% 100%,10% calc(100% - 24px),5% 100%,0 calc(100% - 24px)); }
          #rp-store { text-align:center; font:900 40px/1.1 'IBM Plex Mono', monospace; text-transform:uppercase; }
          #rp-sub { text-align:center; margin-top:8px; color:#78716c; font-size:24px; }
          .rp-hr { border:none; border-top:4px dashed #a8a29e; margin:22px 0; }
          .rp-row { display:flex; justify-content:space-between; gap:20px; margin-bottom:14px; opacity:0; }
          .rp-row b { flex:none; }
          #rp-total { display:flex; justify-content:space-between; font:900 40px/1 'IBM Plex Mono', monospace; opacity:0; }
          #rp-stamp { position:absolute; right:190px; top:520px; padding:14px 26px; border:8px solid #dc2626; color:#dc2626; border-radius:14px;
            font:900 56px/1 'Archivo Black', sans-serif; transform:rotate(-12deg); opacity:0; }
          #caps { top:1160px !important; }`,
        bg: "",
        stage: `<div id="rp-paper"><p id="rp-store">${esc(short(sb.locationName, 4))}</p><p id="rp-sub">${esc(short(sb.title, 7))}</p><hr class="rp-hr"/>
            <div id="rp-rows">${rows}</div><hr class="rp-hr"/><div id="rp-total"><span>TOTAL</span><span>${sum ? rupiah(sum) : "???"}</span></div></div>
          <div id="rp-stamp">LUNAS?</div>`,
        script: `
          tl.fromTo("#rp-paper", { y: -900 }, { y: 0, duration: 0.5, ease: "power3.out" }, 0);
          lines.forEach((ln, i) => {
            tl.fromTo("#rpr" + i, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.15, ease: "steps(3)" }, Math.max(0, ln.start - 0.05));
          });
          const last = lines[lines.length - 1];
          if (last) {
            tl.fromTo("#rp-total", { opacity: 0 }, { opacity: 1, duration: 0.15 }, last.end + 0.1);
            tl.fromTo("#rp-stamp", { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, last.end + 0.3);
          }`,
      };
    },

    retro_vhs(sb, beats) {
      const lines = linesOf(beats);
      const SCENES = [
        ["#f97316", "#7c2d12"],
        ["#38bdf8", "#1e3a8a"],
        ["#a3e635", "#14532d"],
        ["#f472b6", "#701a75"],
      ];
      const frames = lines
        .map((_, i) => {
          const [c1, c2] = SCENES[i % SCENES.length];
          return `<div class="vh-frame" id="vhf${i}" style="background:linear-gradient(180deg, ${c1}, ${c2})">
            <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice"><circle cx="${300 + (i * 170) % 480}" cy="520" r="150" fill="rgba(255,255,255,.35)"/>
            <path d="M0 1300 C220 1150 420 1240 620 1160 C800 1090 940 1180 1080 1120 L1080 1920 L0 1920 Z" fill="rgba(0,0,0,.35)"/>
            <path d="M420 1290 C420 1100 470 1040 540 1040 C610 1040 660 1100 660 1290 Z" fill="rgba(0,0,0,.55)"/><circle cx="540" cy="960" r="70" fill="rgba(0,0,0,.55)"/></svg></div>`;
        })
        .join("");
      const year = 1990 + ((sb.title.length * 7) % 9);
      return {
        captions: true,
        css: `
          #bg { background:#000; }
          .vh-frame { position:absolute; inset:0; opacity:0; filter:saturate(1.3) contrast(1.1); }
          .vh-frame svg { width:100%; height:100%; }
          #vh-play { position:absolute; left:80px; top:200px; font:700 54px/1 'Space Mono', monospace; color:#fff; text-shadow:3px 0 #ef4444, -3px 0 #22d3ee; }
          #vh-date { position:absolute; left:80px; top:1240px; font:700 44px/1 'Space Mono', monospace; color:#fff; text-shadow:3px 0 #ef4444, -3px 0 #22d3ee; }
          #vh-clock { position:absolute; right:80px; top:200px; font:700 44px/1 'Space Mono', monospace; color:#fff; text-shadow:3px 0 #ef4444, -3px 0 #22d3ee; }
          #vh-track { position:absolute; left:0; right:0; top:0; height:70px; background:linear-gradient(transparent, rgba(255,255,255,.28), transparent); mix-blend-mode:screen; }
          #vh-lines { position:absolute; inset:0; background:repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 3px, transparent 3px 6px); pointer-events:none; }
          #caps { top:1060px !important; }
          .cap-g .cw { font-family:'Space Mono', monospace !important; font-weight:700; color:#fde047; -webkit-text-stroke:0; text-transform:none;
            text-shadow:4px 4px 0 #000; font-size:64px; }
          .cap-g .cw[data-on="1"] { color:#fff; }`,
        bg: frames,
        stage: `<div id="vh-play">PLAY ▶</div><div id="vh-clock">SP <span id="vh-t">0:00:00</span></div><div id="vh-date">${year} · ${esc(short(sb.locationName, 3))}</div>`,
        overlay: `<div id="vh-track"></div><div id="vh-lines"></div>`,
        script: `
          for (let s = 0; s < D; s += 1) tl.set("#vh-t", { textContent: "0:00:" + String(Math.floor(s)).padStart(2, "0") }, s);
          for (let t = 0; t < D; t += 0.5) tl.set("#vh-play", { opacity: (t * 2) % 2 < 1 ? 1 : 0.2 }, t);
          tl.fromTo("#vh-track", { y: -80 }, { y: 1980, duration: 2.4, ease: "none", repeat: Math.ceil(D / 2.4) }, 0);
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.15);
            if (i > 0) tl.set("#vhf" + (i - 1), { opacity: 0 }, t0);
            tl.set("#vhf" + i, { opacity: 1 }, t0);
            tl.fromTo("#vhf" + i, { x: -30, skewX: 8 }, { x: 0, skewX: 0, duration: 0.15, ease: "steps(3)" }, t0);
            tl.fromTo("#vhf" + i, { scale: 1.02 }, { scale: 1.1, duration: ln.end - ln.start + 0.3, ease: "none" }, t0);
          });`,
      };
    },

    sticky_notes(sb, beats) {
      const lines = linesOf(beats);
      const COLORS = ["#fde047", "#f9a8d4", "#86efac", "#93c5fd", "#fdba74", "#c4b5fd"];
      const notes = lines
        .map((l, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const rot = [-4, 3, 2, -3, -2, 4][i % 6];
          return `<div class="sn-note" id="snn${i}" style="left:${col ? 560 : 80}px;top:${300 + row * 420}px;background:${COLORS[i % COLORS.length]};--r:${rot}deg">
            <i class="sn-pin"></i><p>${wordSpans(l.words, "sn" + i)}</p></div>`;
        })
        .join("");
      return {
        captions: false,
        css: `
          #bg { background:#b88552; }
          #bg::after { content:""; position:absolute; inset:0; background-image:radial-gradient(rgba(60,30,10,.35) 2px, transparent 2.5px),
            radial-gradient(rgba(255,230,190,.25) 2px, transparent 2.5px); background-size:26px 26px, 38px 38px; background-position:0 0, 13px 19px; }
          #sn-board { position:absolute; left:0; top:0; width:1080px; height:1920px; }
          #sn-title { position:absolute; left:80px; right:80px; top:180px; text-align:center; font:900 52px/1.1 Nunito, sans-serif; color:#fff;
            text-shadow:4px 4px 0 rgba(0,0,0,.35); }
          .sn-note { position:absolute; width:440px; min-height:360px; padding:56px 34px 34px; box-shadow:8px 14px 22px rgba(0,0,0,.35);
            transform:rotate(var(--r)); opacity:0; }
          .sn-note p { font:900 40px/1.2 Nunito, sans-serif; color:#1c1917; }
          .sn-note .pw { opacity:0; }
          .sn-pin { position:absolute; left:50%; top:16px; margin-left:-18px; width:36px; height:36px; border-radius:50%; background:#dc2626;
            box-shadow:inset -6px -6px 0 rgba(0,0,0,.25), 3px 5px 6px rgba(0,0,0,.4); }`,
        bg: "",
        stage: `<div id="sn-board"><p id="sn-title">${esc(short(sb.title, 7))}</p>${notes}</div>`,
        script: `
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.1);
            const row = Math.floor(i / 2);
            if (row >= 2 && i % 2 === 0) tl.to("#sn-board", { y: -(row - 1) * 420, duration: 0.45, ease: "power3.inOut" }, t0 - 0.2);
            tl.fromTo("#snn" + i, { opacity: 0, scale: 1.5, y: -60 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, t0);
            reveal("sn" + i, ln.words);
          });`,
      };
    },
  };
}
