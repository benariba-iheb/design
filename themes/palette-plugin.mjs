/**
 * Vite plugin: turns the Gasra app into a template without touching its source files.
 *
 *  1. Colors   — remaps brand hex / rgba() values in the compiled CSS and in src/ modules.
 *                Hex values inside Tailwind arbitrary-value brackets (`bg-[#0B1E26]`) and inside
 *                escaped CSS selectors (`.bg-\[\#0B1E26\]`) are left alone so class names still
 *                match their CSS rules; only the *values* change.
 *  2. Brand    — replaces the product name (Latin + Arabic), the referral prefix and the tagline.
 *  3. Logo     — serves the themed logo at /assets/logo.png (as SVG), plus /icon.svg and PNG icons.
 *  4. HTML     — recolors <meta theme-color>, rewrites <title>/OG tags, re-colors the logo shimmer.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildColorMap, GASRA_BRAND } from "./palettes.mjs";
import { hasEmblem, logoSvg, iconSvg, overrideCss } from "./brand.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* ---------- color rewriting ---------- */
const HEX = String.raw`(?<!\\)#(?<hex>[0-9a-fA-F]{6})(?<al>[0-9a-fA-F]{2})?(?![0-9a-fA-F])`;
const RGB = String.raw`(?<pre>rgba?\(\s*)(?<cr>\d{1,3})(?<s1>\s*,\s*|\s+)(?<cg>\d{1,3})(?<s2>\s*,\s*|\s+)(?<cb>\d{1,3})`;
// A Tailwind arbitrary value, e.g. [#0B1E26] or [0_0_10px_#0DCCF2] — never touched in JS code.
const BRACKET = String.raw`(?<br>\[[^\]\s"'\x60\\]*\])`;
const RE_CSS = new RegExp(`${HEX}|${RGB}`, "g");
const RE_JS = new RegExp(`${BRACKET}|${HEX}|${RGB}`, "g");

function colorRewriter(map, { js }) {
  if (map.hex.size === 0 && map.rgb.size === 0) return (code) => code;
  const re = js ? RE_JS : RE_CSS;
  return (code) =>
    code.replace(re, (m, ...rest) => {
      const g = rest.at(-1);
      if (g.br) return m;
      if (g.hex) {
        const to = map.hex.get(g.hex.toLowerCase());
        if (!to) return m;
        return `#${g.hex === g.hex.toUpperCase() ? to.toUpperCase() : to}${g.al ?? ""}`;
      }
      const to = map.rgb.get(`${g.cr},${g.cg},${g.cb}`);
      if (!to) return m;
      const [r, gr, b] = to.split(",");
      return `${g.pre}${r}${g.s1}${gr}${g.s2}${b}`;
    });
}

/* ---------- brand text rewriting ---------- */
// Compiled JS may carry Arabic as \uXXXX escapes; handle both forms.
const esc = (s) => [...s].map((c) => (c.charCodeAt(0) > 127 ? `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}` : c)).join("");
const swap = (code, from, to) => (from === to ? code : code.split(from).join(to).split(esc(from)).join(esc(to)));

function brandRewriter(brand) {
  if (brand.name === GASRA_BRAND.name) return (code) => code;
  return (code) => {
    let out = code
      .replace(/\bGasra\b/g, brand.name)
      .replace(/\bBonsGasra\b/g, `Bons${brand.name}`) // hashtag
      .replace(/\bGASRA-/g, `${brand.name.toUpperCase()}-`); // referral-code prefix
    out = swap(out, GASRA_BRAND.nameAr, brand.nameAr);
    out = swap(out, GASRA_BRAND.tagline, brand.tagline);
    out = swap(out, GASRA_BRAND.taglineAr, brand.taglineAr);
    // Whole phrases are swapped above; what is left are the two fragments of the split login headline.
    out = swap(out, GASRA_BRAND.headline[0], brand.headline[0]);
    out = swap(out, GASRA_BRAND.headline[1], brand.headline[1]);
    return out;
  };
}

/* ---------- plugin ---------- */
export function palettePlugin(pal) {
  const map = buildColorMap(pal);
  const recolorCss = colorRewriter(map, { js: false });
  const recolorJs = colorRewriter(map, { js: true });
  const rebrand = brandRewriter(pal.brand);
  const branded = hasEmblem(pal);
  const assetDir = path.join(HERE, "assets", pal.id);
  let srcDir = "";

  const send = (res, type, body) => {
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "no-cache");
    res.end(body);
  };
  const PNGS = new Set(["/apple-touch-icon.png", "/pwa-192x192.png", "/pwa-512x512.png", "/favicon.ico"]);

  return {
    name: `gasra-template:${pal.id}`,
    enforce: "post",

    configResolved(config) {
      srcDir = path.join(config.root, "src") + path.sep;
    },

    transform(code, id) {
      const file = id.split("?")[0];
      if (!file.startsWith(srcDir) || !/\.(css|[jt]sx?)$/.test(file)) return null;
      const isCss = file.endsWith(".css");
      // CSS keeps the product name untouched (comments only); JS/TS gets the full treatment.
      const out = isCss ? recolorCss(code) : rebrand(recolorJs(code));
      return out === code ? null : { code: out, map: null };
    },

    transformIndexHtml: {
      order: "post",
      handler(html) {
        const out = rebrand(recolorCss(html));
        const tags = branded
          ? [{ tag: "style", attrs: { id: "gasra-template-override" }, children: overrideCss(pal), injectTo: "head" }]
          : [];
        return { html: out, tags };
      },
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader("X-Gasra-Template", pal.id);
        if (!branded) return next();
        const url = (req.url ?? "").split("?")[0];
        if (url === "/icon.svg") return send(res, "image/svg+xml", iconSvg(pal));
        if (url === "/icon-square.svg") return send(res, "image/svg+xml", iconSvg(pal, { square: true })); // source for the PNG icons
        // The app loads this URL via <img> and as a CSS mask; the response type decides, not the extension.
        if (url === "/assets/logo.png") return send(res, "image/svg+xml", logoSvg(pal));
        if (PNGS.has(url)) {
          const file = path.join(assetDir, url.slice(1));
          if (fs.existsSync(file)) return send(res, "image/png", fs.readFileSync(file));
        }
        next();
      });
    },
  };
}
