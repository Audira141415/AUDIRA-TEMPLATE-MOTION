// Eight more reel formats. Each returns { captions, css, bg, stage, overlay?, script } like the
// formats in compose.mjs; `h` carries the shared helpers (esc, short, wordSpans).

export function extraFormats({ esc, short, wordSpans }) {
  const linesOf = (beats) => beats.filter((b) => b.kind === "line");
  const initial = (name) => esc(String(name).trim().charAt(0).toUpperCase() || "?");

  return {
    kinetic_type(sb, beats) {
      const lines = linesOf(beats);
      const LOOKS = [
        { bg: "var(--ground)", ink: "#f4f3f0", hot: "var(--primary)" },
        { bg: "var(--primary)", ink: "#0b0b0b", hot: "#f4f3f0" },
        { bg: "#f4f3f0", ink: "#0b0b0b", hot: "var(--primary)" },
        { bg: "#0b0b0b", ink: "var(--accent)", hot: "#f4f3f0" },
      ];
      const blocks = lines
        .map((l, i) => {
          const chars = l.text.length;
          const size = Math.max(84, Math.min(170, Math.round(Math.sqrt((940 * 880) / (chars * 0.62)) * 0.85)));
          const longest = l.words.reduce((m, w, k) => (w.text.length > l.words[m].text.length ? k : m), 0);
          const look = LOOKS[i % LOOKS.length];
          const words = l.words
            .map((w, k) => `<span class="kt-w" id="kt${i}-w${k}" style="color:${k === longest ? look.hot : look.ink}">${esc(w.text)}</span>`)
            .join("");
          return `<div class="kt-line" id="kt${i}" style="font-size:${size}px">${words}</div>`;
        })
        .join("");
      return {
        captions: false,
        css: `
          #kt-bg { position:absolute; inset:0; background:var(--ground); }
          .kt-line { position:absolute; left:70px; right:70px; top:260px; height:1000px; display:flex; flex-wrap:wrap; align-content:center;
            justify-content:center; gap:.08em .26em; opacity:0; }
          .kt-w { display:inline-block; font-family:'Archivo Black', Inter, sans-serif; font-weight:900; line-height:.95; text-transform:uppercase; letter-spacing:-.02em; }
          #kt-bar { position:absolute; left:70px; right:70px; top:1290px; height:10px; background:rgba(127,127,127,.35); }
          #kt-fill { height:100%; width:100%; background:var(--primary); transform-origin:0 50%; transform:scaleX(0); }`,
        bg: `<div id="kt-bg"></div>`,
        stage: `${blocks}<div id="kt-bar"><div id="kt-fill"></div></div>`,
        script: `
          const LOOK_BG = ${JSON.stringify(LOOKS.map((l) => l.bg))};
          tl.fromTo("#kt-fill", { scaleX: 0 }, { scaleX: 1, duration: hook ? hook.start : D, ease: "none" }, 0);
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.06);
            if (i > 0) tl.set("#kt" + (i - 1), { opacity: 0 }, t0);
            tl.set("#kt-bg", { background: LOOK_BG[i % LOOK_BG.length] }, t0);
            tl.set("#kt" + i, { opacity: 1 }, t0);
            tl.fromTo("#cam", { x: 0 }, { x: 10, duration: 0.04, yoyo: true, repeat: 3, ease: "none" }, t0);
            ln.words.forEach((w, k) => {
              tl.fromTo("#kt" + i + "-w" + k, { opacity: 0, scale: 2.1, rotation: k % 2 ? 6 : -6 },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.16, ease: "power4.out" }, w.start);
            });
          });
          if (hook && lines.length) tl.set("#kt" + (lines.length - 1), { opacity: 0 }, hook.start - 0.2);`,
      };
    },

    chat_story(sb, beats) {
      const lines = linesOf(beats);
      const a = sb.characters.characterA;
      const b = sb.characters.characterB;
      const bubbles = lines
        .map((l, i) => {
          const mine = l.speaker === a.name;
          const mm = String(9 + Math.floor(i / 6)).padStart(2, "0") + "." + String(41 + i).padStart(2, "0");
          return `<div class="ch-b ${mine ? "ch-me" : "ch-them"}" id="ch${i}">${esc(l.text)}<span class="ch-t">${mm}${mine ? " ✓✓" : ""}</span></div>`;
        })
        .join("");
      return {
        captions: false,
        css: `
          #bg { background:#0b141a; }
          #bg::after { content:""; position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,.05) 3px, transparent 3.5px); background-size:46px 46px; }
          #ch-head { position:absolute; left:0; right:0; top:168px; height:140px; background:#202c33; display:flex; align-items:center; gap:24px; padding:0 48px; }
          #ch-av { width:86px; height:86px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center;
            font:900 44px/1 'Archivo Black', sans-serif; }
          #ch-name { font:700 42px/1.1 Inter, sans-serif; color:#e9edef; }
          .ch-st { font:500 30px/1.3 Inter, sans-serif; position:absolute; white-space:nowrap; }
          #ch-online { color:#8696a0; } #ch-typing { color:#25d366; opacity:0; }
          #ch-area { position:absolute; left:0; right:0; top:330px; height:990px; overflow:hidden; }
          #ch-list { position:absolute; left:40px; right:40px; top:20px; display:flex; flex-direction:column; gap:22px; }
          .ch-b { max-width:78%; padding:22px 28px 16px; border-radius:26px; font:500 40px/1.3 Inter, sans-serif; color:#e9edef; opacity:0; }
          .ch-me { align-self:flex-end; background:#005c4b; border-top-right-radius:6px; }
          .ch-them { align-self:flex-start; background:#202c33; border-top-left-radius:6px; }
          .ch-t { display:block; text-align:right; margin-top:6px; font:500 24px/1 Inter, sans-serif; color:rgba(233,237,239,.6); }`,
        bg: "",
        stage: `
          <div id="ch-head"><div id="ch-av">${initial(b.name)}</div>
            <div><div id="ch-name">${esc(b.name)}</div><div style="position:relative;height:40px">
              <span class="ch-st" id="ch-online">online</span><span class="ch-st" id="ch-typing">sedang mengetik…</span></div></div></div>
          <div id="ch-area"><div id="ch-list">${bubbles}</div></div>`,
        script: `
          const A = ${JSON.stringify(a.name)};
          const list = document.getElementById("ch-list");
          lines.forEach((ln, i) => {
            const el = document.getElementById("ch" + i);
            if (ln.speaker !== A) {
              const t = Math.max(0, ln.start - 0.7);
              tl.set("#ch-online", { opacity: 0 }, t); tl.set("#ch-typing", { opacity: 1 }, t);
              tl.set("#ch-online", { opacity: 1 }, ln.start); tl.set("#ch-typing", { opacity: 0 }, ln.start);
            }
            tl.fromTo(el, { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "back.out(1.8)" }, Math.max(0, ln.start - 0.05));
            const shift = Math.max(0, el.offsetTop + el.offsetHeight - 940);
            if (shift > 0) tl.to(list, { y: -shift, duration: 0.3, ease: "power3.out" }, Math.max(0, ln.start - 0.05));
          });`,
      };
    },

    top_list(sb, beats) {
      const lines = linesOf(beats);
      const n = lines.length;
      const items = lines
        .map(
          (l, i) => `<div class="tl-item" id="tli${i}"><div class="tl-num" id="tln${i}">#${n - i}</div><div class="tl-name">${esc(short(l.text, 6))}</div></div>`,
        )
        .join("");
      const chips = lines.map((_, i) => `<div class="tl-chip" id="tlc${i}">${n - i}</div>`).join("");
      return {
        captions: true,
        css: `
          #bg { background:radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--primary) 40%, transparent), transparent 60%), var(--ground); }
          #tl-kick { position:absolute; left:80px; top:200px; font:700 30px/1 'JetBrains Mono', monospace; color:var(--accent); letter-spacing:.14em; text-transform:uppercase; }
          #tl-title { position:absolute; left:80px; right:80px; top:250px; font:900 62px/1.05 Inter, sans-serif; color:#fff; letter-spacing:-.02em; }
          .tl-item { position:absolute; left:80px; right:80px; top:430px; height:560px; text-align:center; opacity:0; }
          .tl-num { font:900 330px/1 'Archivo Black', sans-serif; color:var(--primary); -webkit-text-stroke:10px #000; paint-order:stroke fill; }
          .tl-name { margin-top:20px; font:900 62px/1.1 Inter, sans-serif; color:#fff; }
          #tl-chips { position:absolute; left:80px; right:80px; top:1050px; display:flex; justify-content:center; gap:16px; }
          .tl-chip { width:76px; height:76px; border-radius:20px; border:3px solid rgba(255,255,255,.25); color:rgba(255,255,255,.5);
            display:flex; align-items:center; justify-content:center; font:900 34px/1 'Archivo Black', sans-serif; }
          #caps { top:1160px !important; }`,
        bg: "",
        stage: `<div id="tl-kick">Top ${n}</div><div id="tl-title">${esc(short(sb.title, 9))}</div>${items}<div id="tl-chips">${chips}</div>`,
        script: `
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.1);
            if (i > 0) tl.to("#tli" + (i - 1), { opacity: 0, x: -120, duration: 0.2, ease: "power2.in" }, t0 - 0.05);
            tl.fromTo("#tli" + i, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.25, ease: "power4.out" }, t0);
            tl.fromTo("#tln" + i, { scale: 1.8, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.2)" }, t0);
            tl.to("#tlc" + i, { backgroundColor: "${sb.visualTheme.primaryColor}", color: "#fff", borderColor: "#000", scale: 1.12, duration: 0.2 }, t0);
            if (i > 0) tl.to("#tlc" + (i - 1), { scale: 1, duration: 0.2 }, t0);
          });`,
      };
    },

    quiz(sb, beats) {
      const lines = linesOf(beats);
      const q = lines[0];
      const answer = lines.length > 2 ? lines[lines.length - 1] : null;
      const options = lines.slice(1, answer ? -1 : undefined).slice(0, 4);
      const optHtml = options
        .map((l, k) => `<div class="qz-opt" id="qzo${k}" style="top:${640 + k * 150}px"><b>${"ABCD"[k]}</b><span>${esc(short(l.text, 9))}</span></div>`)
        .join("");
      const confetti = Array.from({ length: 36 }, (_, i) => {
        const x = 80 + ((i * 97) % 920);
        const c = ["var(--primary)", "var(--accent)", "#f4f3f0", "#22c55e"][i % 4];
        return `<i class="qz-cf" id="qzc${i}" style="left:${x}px;background:${c};transform:rotate(${(i * 37) % 180}deg)"></i>`;
      }).join("");
      return {
        captions: false,
        css: `
          #bg { background:linear-gradient(160deg, var(--ground), #000); }
          #qz-tag { position:absolute; left:80px; top:200px; padding:12px 22px; background:var(--accent); color:#000; border:4px solid #000; border-radius:999px;
            font:900 28px/1 'Archivo Black', sans-serif; letter-spacing:.1em; }
          #qz-q { position:absolute; left:80px; right:80px; top:280px; min-height:300px; padding:40px; background:#f4f3f0; color:#111; border:6px solid #000;
            border-radius:32px; box-shadow:12px 12px 0 var(--primary); font:900 54px/1.15 Inter, sans-serif; opacity:0; }
          #qz-timer { position:absolute; left:80px; right:80px; top:610px; height:14px; background:rgba(255,255,255,.15); border-radius:8px; overflow:hidden; }
          #qz-tfill { height:100%; width:100%; background:var(--primary); transform-origin:0 50%; }
          .qz-opt { position:absolute; left:80px; right:80px; height:126px; display:flex; align-items:center; gap:26px; padding:0 32px; background:#1d1d24;
            border:4px solid rgba(255,255,255,.18); border-radius:26px; color:#fff; font:700 38px/1.15 Inter, sans-serif; opacity:0; }
          .qz-opt b { flex:none; width:70px; height:70px; border-radius:18px; background:var(--primary); color:#fff; display:flex; align-items:center;
            justify-content:center; font:900 36px/1 'Archivo Black', sans-serif; }
          #qz-ans { position:absolute; left:60px; right:60px; top:700px; padding:44px; background:#22c55e; color:#04130a; border:6px solid #000; border-radius:34px;
            box-shadow:14px 14px 0 #000; opacity:0; }
          #qz-ans small { display:block; font:900 30px/1 'Archivo Black', sans-serif; letter-spacing:.12em; margin-bottom:18px; }
          #qz-ans p { font:900 56px/1.12 Inter, sans-serif; }
          .qz-cf { position:absolute; top:-40px; width:22px; height:34px; opacity:0; }`,
        bg: "",
        stage: `<div id="qz-tag">KUIS</div><div id="qz-q">${esc(q?.text ?? "")}</div><div id="qz-timer"><div id="qz-tfill"></div></div>${optHtml}
          <div id="qz-ans" data-layout-allow-occlusion data-layout-allow-overlap><small>JAWABAN</small><p>${esc(answer?.text ?? "")}</p></div>${confetti}`,
        script: `
          const nOpt = ${options.length};
          const hasAnswer = ${answer ? "true" : "false"};
          if (lines[0]) tl.fromTo("#qz-q", { opacity: 0, y: -40, rotation: -2 }, { opacity: 1, y: 0, rotation: 0, duration: 0.35, ease: "back.out(1.6)" }, Math.max(0, lines[0].start - 0.1));
          for (let k = 0; k < nOpt; k++) {
            const ln = lines[k + 1];
            tl.fromTo("#qzo" + k, { opacity: 0, x: k % 2 ? 140 : -140 }, { opacity: 1, x: 0, duration: 0.28, ease: "power4.out" }, Math.max(0, ln.start - 0.1));
          }
          if (hasAnswer) {
            const ans = lines[lines.length - 1];
            const t1 = lines[1] ? lines[1].start : 0;
            tl.fromTo("#qz-tfill", { scaleX: 1 }, { scaleX: 0, duration: Math.max(0.5, ans.start - t1), ease: "none" }, t1);
            for (let k = 0; k < nOpt; k++) tl.to("#qzo" + k, { opacity: 0.25, duration: 0.2 }, ans.start - 0.15);
            tl.fromTo("#qz-ans", { opacity: 0, scale: 0.5, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2.4)" }, ans.start - 0.1);
            for (let i = 0; i < 36; i++) {
              tl.fromTo("#qzc" + i, { opacity: 1, y: 0 }, { y: 900 + (i * 53) % 700, rotation: 360 + i * 20, duration: 1.6 + (i % 5) * 0.2, ease: "power1.in" }, ans.start - 0.05 + (i % 6) * 0.04);
              tl.set("#qzc" + i, { opacity: 0 }, ans.start + 2.4);
            }
          }`,
      };
    },

    podcast_clip(sb, beats) {
      const a = sb.characters.characterA;
      const b = sb.characters.characterB;
      const bars = Array.from({ length: 40 }, (_, i) => `<div class="pc-bar" id="pcb${i}"></div>`).join("");
      const tile = (c, id) =>
        `<div class="pc-tile" id="${id}"><div class="pc-ring" id="${id}-ring"></div><div class="pc-av">${initial(c.name)}</div><p class="pc-name">${esc(c.name)}</p><p class="pc-role">${esc(c.title)}</p></div>`;
      return {
        captions: true,
        css: `
          #bg { background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--primary) 35%, transparent), transparent 55%), #0c0c10; }
          #pc-chip { position:absolute; left:80px; top:200px; display:flex; align-items:center; gap:14px; font:700 28px/1 'JetBrains Mono', monospace; color:#fff; letter-spacing:.12em; }
          #pc-chip i { width:18px; height:18px; border-radius:50%; background:#ef4444; }
          #pc-title { position:absolute; left:80px; right:80px; top:250px; font:900 56px/1.08 Inter, sans-serif; color:#fff; letter-spacing:-.02em; }
          .pc-tile { position:absolute; top:430px; width:400px; text-align:center; }
          #pcA { left:90px; } #pcB { right:90px; }
          .pc-av { position:relative; margin:0 auto; width:250px; height:250px; border-radius:50%; background:#1f1f27; border:6px solid #000;
            display:flex; align-items:center; justify-content:center; font:900 120px/1 'Archivo Black', sans-serif; color:var(--accent); }
          .pc-ring { position:absolute; left:50%; top:0; margin-left:-140px; width:280px; height:280px; margin-top:-15px; border-radius:50%;
            border:10px solid var(--primary); opacity:.15; }
          .pc-name { margin-top:26px; font:900 44px/1 Inter, sans-serif; color:#fff; }
          .pc-role { margin-top:10px; font:600 28px/1.2 Inter, sans-serif; color:#a1a1aa; }
          #pc-wave { position:absolute; left:110px; right:110px; top:860px; height:200px; display:flex; align-items:center; gap:9px; }
          .pc-bar { flex:1; height:100%; border-radius:8px; background:linear-gradient(var(--accent), var(--primary)); transform:scaleY(.06); }`,
        bg: "",
        stage: `<div id="pc-chip"><i></i>PODCAST · ${esc(short(sb.locationName, 4))}</div><div id="pc-title">${esc(short(sb.title, 9))}</div>
          ${tile(a, "pcA")}${tile(b, "pcB")}<div id="pc-wave">${bars}</div>`,
        script: `
          const A = ${JSON.stringify(a.name)};
          lines.forEach((ln) => {
            const me = ln.speaker === A ? "#pcA" : "#pcB";
            const other = ln.speaker === A ? "#pcB" : "#pcA";
            tl.to(me, { opacity: 1, scale: 1.05, duration: 0.2 }, ln.start - 0.1);
            tl.to(other, { opacity: 0.45, scale: 0.95, duration: 0.2 }, ln.start - 0.1);
            ln.words.forEach((w, k) => {
              tl.fromTo(me + "-ring", { opacity: 0.9, scale: 1 }, { opacity: 0.2, scale: 1.12, duration: Math.max(0.12, w.end - w.start), ease: "power2.out" }, w.start);
              for (let b = 0; b < 40; b++) {
                if ((b + k) % 3) continue;
                tl.to("#pcb" + b, { scaleY: 0.15 + 0.85 * Math.abs(Math.sin((k + 1) * 1.3 + b * 0.7)), duration: 0.09 }, w.start);
              }
            });
            tl.to(".pc-bar", { scaleY: 0.06, duration: 0.2 }, ln.end);
          });`,
      };
    },

    comic_strip(sb, beats) {
      const lines = linesOf(beats);
      const a = sb.characters.characterA;
      const TINTS = ["var(--primary)", "var(--accent)", "#93c5fd", "#fde68a"];
      const SOUNDS = { shocked: "WHAT?!", angry: "GRRR!", hyped: "BOOM!", smug: "HEH.", sarcastic: "OH YA?" };
      const panels = lines
        .map((l, i) => {
          const left = l.speaker === a.name;
          const sound = SOUNDS[l.emotion];
          return `<div class="cm-p" id="cmp${i}" style="top:${240 + i * 1100}px;--tint:${TINTS[i % TINTS.length]}">
            <div class="cm-cap">${esc(l.speaker)}</div>
            <svg class="cm-fig" viewBox="0 0 300 420" style="${left ? "left:60px" : "right:60px"}">
              <circle cx="150" cy="110" r="90" fill="#111"/><path d="M30 420 C40 260 90 220 150 220 C210 220 260 260 270 420 Z" fill="#111"/>
              <circle cx="${left ? 185 : 115}" cy="100" r="14" fill="#fff"/></svg>
            <div class="cm-bal" style="${left ? "right:50px" : "left:50px"}"><div class="cm-txt">${wordSpans(l.words, "cm" + i)}</div>
              <i class="cm-tail" style="${left ? "left:60px" : "right:60px"}"></i></div>
            ${sound ? `<div class="cm-sfx" id="cms${i}" style="${left ? "right:80px" : "left:80px"}">${sound}</div>` : ""}
          </div>`;
        })
        .join("");
      return {
        captions: false,
        css: `
          #bg { background:#f4efe1; }
          #cm-board { position:absolute; left:0; top:0; width:1080px; height:1920px; }
          .cm-p { position:absolute; left:60px; right:60px; height:1000px; overflow:hidden; border:10px solid #111; background:var(--tint);
            box-shadow:16px 16px 0 #111; }
          .cm-p::before { content:""; position:absolute; inset:0; background-image:radial-gradient(rgba(0,0,0,.22) 3px, transparent 3.5px); background-size:22px 22px; }
          .cm-cap { position:absolute; left:0; top:0; padding:14px 26px; background:#facc15; border-right:8px solid #111; border-bottom:8px solid #111;
            font:900 32px/1 'Archivo Black', sans-serif; color:#111; text-transform:uppercase; }
          .cm-fig { position:absolute; bottom:-10px; width:330px; height:460px; }
          .cm-bal { position:absolute; top:120px; width:560px; padding:36px 40px; background:#fff; border:7px solid #111; border-radius:46px; }
          .cm-txt { font:900 44px/1.18 'Archivo Black', sans-serif; color:#111; text-transform:uppercase; }
          .cm-txt .pw { opacity:0; }
          .cm-tail { position:absolute; bottom:-46px; width:0; height:0; border-left:26px solid transparent; border-right:26px solid transparent; border-top:46px solid #111; }
          .cm-sfx { position:absolute; bottom:460px; padding:18px 30px; background:#ef4444; color:#fff; border:7px solid #111; transform:rotate(-8deg);
            font:900 64px/1 'Archivo Black', sans-serif; opacity:0; }`,
        bg: "",
        stage: `<div id="cm-board">${panels}</div>`,
        script: `
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.35);
            if (i > 0) tl.to("#cm-board", { y: -1100 * i, duration: 0.45, ease: "power3.inOut" }, t0);
            tl.fromTo("#cmp" + i, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(1.6)" }, t0 + 0.2);
            reveal("cm" + i, ln.words);
            if (document.getElementById("cms" + i)) {
              tl.fromTo("#cms" + i, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, ln.start + 0.15);
            }
          });`,
      };
    },

    terminal_hack(sb, beats) {
      const lines = linesOf(beats);
      const a = sb.characters.characterA;
      const rows = lines
        .map((l, i) => {
          const mine = l.speaker === a.name;
          return `<div class="tm-row ${mine ? "tm-in" : "tm-out"}" id="tmr${i}"><span class="tm-pr">${mine ? "$" : ">"}</span><span>${wordSpans(l.words, "tm" + i)}<i class="tm-cur" id="tmc${i}"></i></span></div>`;
        })
        .join("");
      return {
        captions: false,
        css: `
          #bg { background:#030703; }
          #tm-win { position:absolute; left:50px; right:50px; top:190px; height:1130px; border:3px solid #1e3a1e; border-radius:22px; overflow:hidden; background:#041004; }
          #tm-bar { height:74px; display:flex; align-items:center; gap:14px; padding:0 26px; background:#0b1f0b; border-bottom:3px solid #1e3a1e;
            font:700 28px/1 'JetBrains Mono', monospace; color:#4ade80; }
          #tm-bar i { width:20px; height:20px; border-radius:50%; background:#1e3a1e; }
          #tm-body { position:absolute; left:34px; right:34px; top:100px; }
          .tm-row { display:flex; gap:20px; margin-bottom:28px; font:500 38px/1.35 'JetBrains Mono', monospace; opacity:0; }
          .tm-in { color:#4ade80; } .tm-out { color:#fbbf24; }
          .tm-pr { flex:none; opacity:.7; }
          .tm-row > span:last-child { min-width:0; overflow-wrap:anywhere; }
          .tm-row .pw { opacity:0; }
          .tm-cur { display:inline-block; width:.6em; height:1em; margin-left:.1em; vertical-align:-.12em; background:currentColor; opacity:0; }
          #tm-scan { position:absolute; inset:0; pointer-events:none; background:repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 5px); }
          #tm-flash { position:absolute; inset:0; background:#4ade80; mix-blend-mode:screen; opacity:0; }`,
        bg: "",
        stage: `<div id="tm-win"><div id="tm-bar"><i></i><i></i><i></i>&nbsp;root@audira:~ ${esc(short(sb.locationName, 3))}</div><div id="tm-body">${rows}</div></div>`,
        overlay: `<div id="tm-scan"></div><div id="tm-flash"></div>`,
        script: `
          const body = document.getElementById("tm-body");
          lines.forEach((ln, i) => {
            const t0 = Math.max(0, ln.start - 0.08);
            tl.set("#tmr" + i, { opacity: 1 }, t0);
            reveal("tm" + i, ln.words);
            tl.set("#tmc" + i, { opacity: 1 }, t0);
            for (let t = t0 + 0.25; t < ln.end; t += 0.5) { tl.set("#tmc" + i, { opacity: 0 }, t); tl.set("#tmc" + i, { opacity: 1 }, t + 0.25); }
            tl.set("#tmc" + i, { opacity: 0 }, ln.end + 0.05);
            tl.fromTo("#tm-flash", { opacity: 0.18 }, { opacity: 0, duration: 0.18 }, t0);
            tl.fromTo("#cam", { x: -8, skewX: 4 }, { x: 0, skewX: 0, duration: 0.12, ease: "power2.out" }, t0);
            const row = document.getElementById("tmr" + i);
            const shift = Math.max(0, row.offsetTop + row.offsetHeight - 980);
            if (shift > 0) tl.to(body, { y: -shift, duration: 0.25, ease: "power2.out" }, t0);
          });`,
      };
    },

    versus(sb, beats) {
      const lines = linesOf(beats);
      const a = sb.characters.characterA;
      const b = sb.characters.characterB;
      const says = (side) =>
        lines
          .map((l, i) => ((l.speaker === a.name) === (side === "A") ? `<p class="vs-say" id="vss${i}">${wordSpans(l.words, "vs" + i)}</p>` : ""))
          .join("");
      return {
        captions: false,
        css: `
          #bg { background:#09090b; }
          .vs-half { position:absolute; left:40px; right:40px; height:560px; border:6px solid #000; border-radius:34px; overflow:hidden; padding:40px 44px; }
          #vsA { top:180px; background:linear-gradient(135deg, var(--primary), #000 160%); }
          #vsB { top:770px; background:linear-gradient(135deg, var(--accent), #000 160%); }
          .vs-name { font:900 72px/1 'Archivo Black', sans-serif; color:#fff; text-transform:uppercase; -webkit-text-stroke:6px #000; paint-order:stroke fill; }
          .vs-role { margin-top:10px; font:700 28px/1.2 Inter, sans-serif; color:rgba(255,255,255,.85); }
          .vs-score { position:absolute; right:44px; top:40px; font:900 64px/1 'Archivo Black', sans-serif; color:#fff; -webkit-text-stroke:6px #000; paint-order:stroke fill; }
          .vs-say { position:absolute; left:44px; right:44px; bottom:44px; padding:26px 30px; background:rgba(0,0,0,.55); border-radius:22px;
            font:800 42px/1.2 Inter, sans-serif; color:#fff; opacity:0; }
          .vs-say .pw { opacity:.2; }
          .vs-dim { position:absolute; inset:0; background:#000; opacity:0; }
          #vs-badge { position:absolute; left:50%; top:752px; margin-left:-75px; margin-top:-75px; width:150px; height:150px; border-radius:50%;
            background:#facc15; border:8px solid #000; display:flex; align-items:center; justify-content:center; z-index:5;
            font:900 64px/1 'Archivo Black', sans-serif; color:#000; }`,
        bg: "",
        stage: `
          <div class="vs-half" id="vsA"><p class="vs-name">${esc(a.name)}</p><p class="vs-role">${esc(a.title)}</p><span class="vs-score" id="vsA-score">0</span>${says("A")}<div class="vs-dim" id="vsA-dim"></div></div>
          <div class="vs-half" id="vsB"><p class="vs-name">${esc(b.name)}</p><p class="vs-role">${esc(b.title)}</p><span class="vs-score" id="vsB-score">0</span>${says("B")}<div class="vs-dim" id="vsB-dim"></div></div>
          <div id="vs-badge">VS</div>`,
        script: `
          const A = ${JSON.stringify(a.name)};
          tl.fromTo("#vsA", { x: -1100 }, { x: 0, duration: 0.35, ease: "power4.out" }, 0);
          tl.fromTo("#vsB", { x: 1100 }, { x: 0, duration: 0.35, ease: "power4.out" }, 0.05);
          tl.fromTo("#vs-badge", { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" }, 0.25);
          const score = { A: 0, B: 0 };
          let prev = null;
          lines.forEach((ln, i) => {
            const side = ln.speaker === A ? "A" : "B";
            const other = side === "A" ? "B" : "A";
            const t0 = Math.max(0, ln.start - 0.08);
            if (prev !== null) tl.set("#vss" + prev, { opacity: 0 }, t0);
            tl.fromTo("#vss" + i, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, t0);
            reveal("vs" + i, ln.words, 0.2);
            tl.to("#vs" + side + "-dim", { opacity: 0, duration: 0.2 }, t0);
            tl.to("#vs" + other + "-dim", { opacity: 0.5, duration: 0.2 }, t0);
            tl.fromTo("#vs-badge", { rotation: side === "A" ? -15 : 15 }, { rotation: 0, duration: 0.3, ease: "back.out(3)" }, t0);
            score[side] += 1;
            tl.set("#vs" + side + "-score", { textContent: String(score[side]) }, ln.end);
            tl.fromTo("#vs" + side + "-score", { scale: 1.6 }, { scale: 1, duration: 0.25, ease: "back.out(3)" }, ln.end);
            prev = i;
          });`,
      };
    },

    roblox_story(sb, beats) {
      const lines = linesOf(beats);
      const a = sb.characters.characterA;
      const b = sb.characters.characterB;
      const bubbles = lines
        .map((l, i) => {
          const isA = l.speaker === a.name;
          return `<div class="rbx-bub ${isA ? "rbx-a" : "rbx-b"}" id="rbxb${i}">
            <div class="rbx-who">[${esc(l.speaker)}]</div>
            <div class="rbx-say">${wordSpans(l.words, "rbx" + i)}</div>
            <div class="rbx-tail"></div>
          </div>`;
        })
        .join("");

      return {
        captions: false,
        css: `
          #bg { background:radial-gradient(circle at 50% 30%, #0d1e3d 0%, #070b19 75%); }
          #rbx-hud { position:absolute; left:40px; right:40px; top:160px; display:flex; justify-content:space-between; align-items:center; }
          #rbx-menu { display:flex; gap:12px; }
          .rbx-btn { background:rgba(0,0,0,.7); border:3px solid rgba(255,255,255,.2); color:#fff; border-radius:12px; padding:10px 18px; font:900 24px/1 'Space Mono', monospace; }
          #rbx-stage-tag { background:#0284c7; border:3px solid #38bdf8; color:#fff; border-radius:12px; padding:10px 20px; font:900 24px/1 'Archivo Black', sans-serif; letter-spacing:.05em; }
          #rbx-robux { background:rgba(6,78,59,.8); border:3px solid #10b981; color:#6ee7b7; border-radius:12px; padding:10px 20px; font:900 24px/1 'Archivo Black', sans-serif; }
          .rbx-actor { position:absolute; bottom:360px; width:340px; height:500px; }
          #actor-noob { left:60px; }
          #actor-pro { right:60px; }
          .rbx-actor svg { width:100%; height:100%; overflow:visible; }
          .rbx-bub { position:absolute; bottom:880px; width:520px; padding:24px 28px; background:#fff; border:7px solid #000; border-radius:28px; box-shadow:8px 8px 0 #000; opacity:0; }
          .rbx-a { left:80px; }
          .rbx-b { right:80px; }
          .rbx-who { font:900 24px/1 'Archivo Black', sans-serif; color:#0284c7; margin-bottom:8px; }
          .rbx-say { font:800 36px/1.25 Inter, sans-serif; color:#000; }
          .rbx-say .pw { opacity:.15; }
          .rbx-tail { position:absolute; bottom:-28px; left:60px; width:0; height:0; border-left:16px solid transparent; border-right:16px solid transparent; border-top:28px solid #000; }
          .rbx-b .rbx-tail { left:auto; right:60px; }
          #rbx-oof { position:absolute; left:50%; top:50%; margin-left:-200px; margin-top:-60px; width:400px; padding:20px; background:#dc2626; border:8px solid #000; border-radius:24px; text-align:center; font:900 68px/1 'Archivo Black', sans-serif; color:#facc15; box-shadow:12px 12px 0 #000; opacity:0; transform:rotate(-8deg); z-index:90; }
          #rbx-lava { position:absolute; left:0; right:0; bottom:0; height:240px; background:linear-gradient(0deg, #ef4444 0%, #b91c1c 80%, transparent); }
        `,
        bg: `
          <div id="rbx-lava"></div>
          <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
            <polygon points="120,1350 480,1350 510,1400 150,1400" fill="#0284c7" stroke="#000" stroke-width="4"/>
            <rect x="120" y="1300" width="360" height="50" rx="8" fill="#38bdf8" stroke="#000" stroke-width="5"/>
            <polygon points="600,1350 960,1350 990,1400 630,1400" fill="#15803d" stroke="#000" stroke-width="4"/>
            <rect x="600" y="1300" width="360" height="50" rx="8" fill="#22c55e" stroke="#000" stroke-width="5"/>
          </svg>
        `,
        stage: `
          <div id="rbx-hud">
            <div id="rbx-menu"><span class="rbx-btn">☰</span><span id="rbx-stage-tag">STAGE 42</span></div>
            <div id="rbx-robux">R$ 999,999</div>
          </div>
          <div class="rbx-actor" id="actor-noob">
            <svg viewBox="0 0 200 320">
              <rect x="65" y="30" width="70" height="70" rx="12" fill="#ffd900" stroke="#000" stroke-width="6"/>
              <ellipse cx="88" cy="62" rx="5" ry="7" fill="#000"/>
              <ellipse cx="112" cy="62" rx="5" ry="7" fill="#000"/>
              <path d="M88 78 Q100 88 112 78" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>
              <rect x="55" y="98" width="90" height="100" rx="6" fill="#0055bf" stroke="#000" stroke-width="6"/>
              <rect x="25" y="98" width="32" height="95" rx="6" fill="#ffd900" stroke="#000" stroke-width="5"/>
              <rect x="143" y="98" width="32" height="95" rx="6" fill="#ffd900" stroke="#000" stroke-width="5"/>
              <rect x="58" y="196" width="40" height="100" rx="4" fill="#00a850" stroke="#000" stroke-width="5"/>
              <rect x="102" y="196" width="40" height="100" rx="4" fill="#00a850" stroke="#000" stroke-width="5"/>
            </svg>
          </div>
          <div class="rbx-actor" id="actor-pro">
            <svg viewBox="0 0 200 320">
              <rect x="60" y="15" width="80" height="30" rx="6" fill="#633b1e" stroke="#000" stroke-width="4"/>
              <rect x="65" y="35" width="70" height="70" rx="12" fill="#f5d0a9" stroke="#000" stroke-width="6"/>
              <rect x="75" y="58" width="50" height="15" rx="3" fill="#000" stroke="#71717a" stroke-width="2"/>
              <rect x="55" y="103" width="90" height="100" rx="6" fill="#111827" stroke="#000" stroke-width="6"/>
              <circle cx="100" cy="140" r="16" fill="#dc2626"/>
              <rect x="25" y="103" width="32" height="95" rx="6" fill="#1f2937" stroke="#000" stroke-width="5"/>
              <rect x="143" y="103" width="32" height="95" rx="6" fill="#1f2937" stroke="#000" stroke-width="5"/>
              <rect x="58" y="201" width="40" height="100" rx="4" fill="#374151" stroke="#000" stroke-width="5"/>
              <rect x="102" y="201" width="40" height="100" rx="4" fill="#374151" stroke="#000" stroke-width="5"/>
            </svg>
          </div>
          ${bubbles}
          <div id="rbx-oof">💥 OOF!</div>
        `,
        script: `
          const A = ${JSON.stringify(a.name)};
          lines.forEach((ln, i) => {
            const isA = ln.speaker === A;
            const me = isA ? "#actor-noob" : "#actor-pro";
            const other = isA ? "#actor-pro" : "#actor-noob";
            const t0 = Math.max(0, ln.start - 0.08);
            if (i > 0) tl.set("#rbxb" + (i - 1), { opacity: 0 }, t0);
            tl.set("#rbxb" + i, { opacity: 1 }, t0);
            reveal("rbx" + i, ln.words, 0.2);
            tl.to(me, { y: -30, scale: 1.06, duration: 0.18, yoyo: true, repeat: 3, ease: "power2.out" }, t0);
            tl.to(other, { y: 0, scale: 0.95, duration: 0.2 }, t0);
            if (ln.emotion === 'shocked' || ln.emotion === 'angry') {
              tl.fromTo("#rbx-oof", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.2, duration: 0.2, ease: "back.out(3)" }, t0 + 0.1);
              tl.to("#rbx-oof", { opacity: 0, duration: 0.2 }, t0 + 0.9);
              tl.fromTo("#cam", { x: -14 }, { x: 14, duration: 0.05, yoyo: true, repeat: 5, ease: "none" }, t0 + 0.1);
            }
          });
        `,
      };
    },
  };
}
