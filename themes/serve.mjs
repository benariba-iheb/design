/**
 * Starts one Vite dev server per template, each on its own port, from the SAME source tree.
 *
 *   node themes/serve.mjs                      all templates (3000 original, 3001..3005 themed)
 *   node themes/serve.mjs --only bahia,layali  just those
 *   node themes/serve.mjs --no-original        skip the :3000 reference
 *   node themes/serve.mjs --lan                listen on all interfaces (default: 127.0.0.1 only)
 *   node themes/serve.mjs --list               show templates and exit
 *
 * Each server gets its own dependency cache (node_modules/.vite-template-<id>) so they never race,
 * and the PWA plugin is dropped from these instances (no shared dev-dist, no service-worker caching
 * of stale themes). Ports are strict: if one is busy that template is reported and skipped.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, loadConfigFromFile } from "vite";
import { PALETTES } from "./palettes.mjs";
import { palettePlugin } from "./palette-plugin.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUN_DIR = path.join(ROOT, "themes", ".run");
const PID_FILE = path.join(RUN_DIR, "pid");

/* ---------- args ---------- */
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

if (flag("list")) {
  for (const p of PALETTES) console.log(`${String(p.port).padEnd(5)} ${p.id.padEnd(9)} ${p.brand.name.padEnd(9)} ${p.blurb}`);
  process.exit(0);
}

let chosen = PALETTES;
const only = value("only")?.split(",").map((s) => s.trim()).filter(Boolean);
if (only?.length) {
  const unknown = only.filter((id) => !PALETTES.some((p) => p.id === id));
  if (unknown.length) {
    console.error(`Unknown template(s): ${unknown.join(", ")}. Available: ${PALETTES.map((p) => p.id).join(", ")}`);
    process.exit(2);
  }
  chosen = PALETTES.filter((p) => only.includes(p.id));
}
if (flag("no-original")) chosen = chosen.filter((p) => p.id !== "original");
const host = flag("lan") ? "0.0.0.0" : value("host") ?? "127.0.0.1";

/* ---------- start ---------- */
process.chdir(ROOT); // the project's vite config resolves the "@" alias from process.cwd()

const flatten = async (plugins) => (await Promise.all([plugins ?? []].flat(Infinity))).flat(Infinity).filter(Boolean);

async function start(pal) {
  const loaded = await loadConfigFromFile({ command: "serve", mode: "development" }, path.join(ROOT, "vite.config.ts"), ROOT);
  if (!loaded) throw new Error("vite.config.ts not found");
  const { plugins, server: serverCfg, ...rest } = loaded.config;
  const basePlugins = (await flatten(plugins)).filter((p) => !String(p.name).startsWith("vite-plugin-pwa"));
  const server = await createServer({
    ...rest,
    root: ROOT,
    configFile: false,
    clearScreen: false,
    logLevel: "warn",
    cacheDir: path.join(ROOT, "node_modules", `.vite-template-${pal.id}`),
    plugins: [...basePlugins, palettePlugin(pal)],
    server: { ...serverCfg, host, port: pal.port, strictPort: true, open: false },
  });
  await server.listen();
  return server;
}

const running = [];
const failed = [];
for (const pal of chosen) {
  try {
    running.push({ pal, server: await start(pal) });
  } catch (err) {
    failed.push({ pal, err });
  }
}

console.log("");
for (const { pal } of running) {
  console.log(`  ✓ http://${host === "0.0.0.0" ? "localhost" : host}:${pal.port}/   ${pal.brand.name.padEnd(9)} ${pal.id === "original" ? "(référence)" : pal.blurb}`);
}
for (const { pal, err } of failed) {
  const why = /already in use|EADDRINUSE/i.test(String(err?.message)) ? `port ${pal.port} already in use` : err?.message ?? err;
  console.log(`  ✗ ${pal.id}: ${why}`);
}
console.log(host === "0.0.0.0" ? "\n  ⚠ Listening on ALL interfaces (--lan): reachable from your network.\n" : "\n  Listening on localhost only. Use --lan to open it to your network.\n");

if (running.length === 0) process.exit(1);

fs.mkdirSync(RUN_DIR, { recursive: true });
fs.writeFileSync(PID_FILE, String(process.pid));

let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  await Promise.allSettled(running.map(({ server }) => server.close()));
  fs.rmSync(PID_FILE, { force: true });
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
