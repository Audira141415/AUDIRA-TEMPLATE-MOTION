#!/usr/bin/env node
// Storyboard JSON -> voiced, rendered 1080x1920 MP4.
//
//   node engine/build-reel.mjs <storyboard.json> --out renders/<id> [--quality draft|looks|delivery] [--no-render] [--reuse-voice] [--dry-voice]
//
// Writes <out>/status.json as it goes so the studio can poll progress.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { dryVoiceStoryboard, voiceStoryboard } from "./tts.mjs";
import { composeReel } from "./compose.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const HF_VERSION = "0.8.223";

export async function buildReel(storyboard, outDir, { quality = "looks", render = true, reuseVoice = false, dryVoice = false } = {}) {
  outDir = resolve(outDir);
  mkdirSync(join(outDir, "assets", "audio"), { recursive: true });
  const status = (s) => writeFileSync(join(outDir, "status.json"), JSON.stringify({ ...s, at: new Date().toISOString() }));

  try {
    status({ state: "voicing", progress: 0.02 });
    cpSync(join(HERE, "assets", "sfx"), join(outDir, "assets", "sfx"), { recursive: true });
    writeFileSync(join(outDir, "storyboard.json"), JSON.stringify(storyboard, null, 2));
    writeFileSync(
      join(outDir, "hyperframes.json"),
      JSON.stringify({ paths: { blocks: "compositions", components: "compositions/components", assets: "assets" } }, null, 2),
    );

    const timelinePath = join(outDir, "timeline.json");
    const voice =
      reuseVoice && existsSync(timelinePath)
        ? (({ duration, beats }) => ({ duration, timeline: beats }))(JSON.parse(readFileSync(timelinePath, "utf8")))
        : dryVoice
        ? dryVoiceStoryboard(storyboard)
        : await voiceStoryboard(storyboard, {
            onProgress: ({ index, total }) => status({ state: "voicing", progress: 0.02 + 0.3 * (index / total) }),
          });
    if (voice.wav) writeFileSync(join(outDir, "assets", "audio", "vo.wav"), voice.wav);
    const words = voice.timeline.flatMap((b) => b.words).map((w, i) => ({ id: `w${i}`, ...w }));
    writeFileSync(join(outDir, "assets", "audio", "vo-words.json"), JSON.stringify(words, null, 2));
    writeFileSync(join(outDir, "timeline.json"), JSON.stringify({ duration: voice.duration, beats: voice.timeline }, null, 2));

    status({ state: "composing", progress: 0.35, duration: voice.duration });
    writeFileSync(join(outDir, "index.html"), composeReel(storyboard, voice));

    if (!render) {
      status({ state: "composed", progress: 1, duration: voice.duration });
      return { outDir, duration: voice.duration };
    }

    status({ state: "rendering", progress: 0.4, duration: voice.duration });
    const output = join(outDir, "reel.mp4");
    await run("npx", ["--yes", `hyperframes@${HF_VERSION}`, "render", outDir, "-o", output, "-q", quality, "--quiet"], (line) => {
      const m = line.match(/(\d{1,3})%/);
      if (m) status({ state: "rendering", progress: 0.4 + 0.6 * (Number(m[1]) / 100), duration: voice.duration });
    });
    if (!existsSync(output)) throw new Error("render selesai tanpa file reel.mp4");
    status({ state: "done", progress: 1, duration: voice.duration, file: "reel.mp4" });
    return { outDir, duration: voice.duration, file: output };
  } catch (err) {
    status({ state: "error", error: String(err?.message ?? err) });
    throw err;
  }
}

function run(cmd, args, onLine) {
  return new Promise((ok, fail) => {
    const win = process.platform === "win32";
    const argv = win ? args.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)) : args;
    const p = spawn(cmd, argv, { shell: win, stdio: ["ignore", "pipe", "pipe"] });
    let tail = "";
    const feed = (buf) => {
      const text = buf.toString();
      tail = (tail + text).slice(-4000);
      text.split(/\r?\n|\r/).forEach((l) => l && onLine?.(l));
    };
    p.stdout.on("data", feed);
    p.stderr.on("data", feed);
    p.on("error", fail);
    p.on("close", (code) => (code === 0 ? ok() : fail(new Error(`${cmd} ${args[2] ?? ""} exit ${code}\n${tail}`))));
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = (name, def) => {
    const i = argv.indexOf(`--${name}`);
    return i < 0 ? def : argv[i + 1];
  };
  const input = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1]?.startsWith("--") !== true);
  if (!input) {
    console.error("usage: node engine/build-reel.mjs <storyboard.json> --out <dir> [--quality draft] [--no-render]");
    process.exit(1);
  }
  const sb = JSON.parse(readFileSync(input, "utf8"));
  const out = opt("out", join("renders", sb.id ?? `reel-${Date.now()}`));
  const res = await buildReel(sb, out, { quality: opt("quality", "looks"), render: !argv.includes("--no-render"), reuseVoice: argv.includes("--reuse-voice"), dryVoice: argv.includes("--dry-voice") });
  console.log(`ok ${res.file ?? join(res.outDir, "index.html")} (${res.duration.toFixed(2)}s)`);
}
