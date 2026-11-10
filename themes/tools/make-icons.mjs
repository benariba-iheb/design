/**
 * Renders the PNG icons of every template (apple-touch-icon, pwa-192/512, favicon) into
 * themes/assets/<id>/. Needs: the template servers running, Firefox, python3 + Pillow.
 * Re-run it after changing an emblem or a palette:
 *
 *   bash themes/themes.sh start --no-original   # if not already running
 *   node themes/tools/make-icons.mjs [id ...]
 *
 * The SVG source is the live /icon-square.svg endpoint of each server, so the PNGs always match
 * what the template serves. (The Firefox profile must live in a non-hidden folder under $HOME
 * when Firefox is a snap, hence ~/gasra-icons-profile-*.)
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTES } from "../palettes.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const wanted = process.argv.slice(2);
const targets = PALETTES.filter((p) => p.emblem && (!wanted.length || wanted.includes(p.id)));
if (!targets.length) { console.error("No matching template with an emblem."); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DBG = 9444;
const profile = fs.mkdtempSync(path.join(os.homedir(), "gasra-icons-profile-"));
const ff = spawn("firefox", ["--headless", "--new-instance", "--profile", profile, "--remote-debugging-port", String(DBG), "about:blank"], { stdio: "ignore" });
const cleanup = () => { try { ff.kill("SIGKILL"); } catch {} fs.rmSync(profile, { recursive: true, force: true }); };
process.on("exit", cleanup);
await sleep(4000);

const ws = new WebSocket(`ws://127.0.0.1:${DBG}/session`);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("cannot reach Firefox remote agent")); });
let id = 1;
const pending = new Map();
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.type === "error" ? p.rej(new Error(m.message)) : p.res(m.result); }
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = id++; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });

await send("session.new", { capabilities: {} });
const context = (await send("browsingContext.getTree", {})).contexts[0].context;
await send("browsingContext.setViewport", { context, viewport: { width: 512, height: 512 } });

const PY = `
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
for name, size in [("pwa-512x512.png", 512), ("pwa-192x192.png", 192), ("apple-touch-icon.png", 180), ("favicon.ico", 32)]:
    im.resize((size, size), Image.LANCZOS).save(out + "/" + name, format="PNG")
`;

let failed = 0;
for (const pal of targets) {
  const outDir = path.join(ROOT, "themes", "assets", pal.id);
  fs.mkdirSync(outDir, { recursive: true });
  try {
    await send("browsingContext.navigate", { context, url: `http://127.0.0.1:${pal.port}/icon-square.svg`, wait: "complete" });
    await sleep(500);
    const shot = await send("browsingContext.captureScreenshot", { context });
    const src = path.join(outDir, "_icon-512.png");
    fs.writeFileSync(src, Buffer.from(shot.data, "base64"));
    const r = spawnSync("python3", ["-I", "-c", PY, src, outDir], { encoding: "utf8" });
    fs.rmSync(src, { force: true });
    if (r.status !== 0) throw new Error(r.stderr || "python failed");
    console.log(`✓ ${pal.id}: ${fs.readdirSync(outDir).join(", ")}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${pal.id}: ${e.message}`);
  }
}
ws.close();
cleanup();
process.exit(failed ? 1 : 0);
