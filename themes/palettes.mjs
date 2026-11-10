/**
 * Gasra — palettes (color templates).
 *
 * The app's brand colors are spread over CSS variables AND ~280 hardcoded hex values.
 * Instead of copying the project, every template is produced by *remapping* those source
 * colors on the fly (see palette-plugin.mjs). A palette only says, per brand "role", which
 * hue that role should have. Colors are rotated in OKLCH, which keeps each color's
 * lightness, so text/background contrast is (nearly) the same as in the original design.
 *
 * Semantic colors are deliberately NOT in ROLES and stay identical in every template:
 * errors (reds), success (greens), warnings/gold (ambers), social brands (Facebook,
 * Instagram, TikTok) and the neutral grays.
 *
 * Run `node themes/palettes.mjs` to print every palette's resulting colors + contrast.
 */
import { fileURLToPath } from "node:url";

/* ------------------------------------------------------------------ */
/* Roles: which source colors belong to which brand role               */
/* (hex lowercase, no '#'; rgb = triples used in rgba()/rgb() calls)   */
/* ------------------------------------------------------------------ */
export const ROLES = {
  // Turquoise accent: buttons, icons, links
  accent: {
    anchor: "2fddcb",
    hex: ["2fddcb", "1fbcab", "0f8a7e", "26cfbd", "22c9b8", "e9fbf8", "c9f2ec", "eef8f7"],
    rgb: [[47, 221, 203]],
  },
  // Gradient trio: cyan -> violet -> rose (mesh background, rings, toggles, Ellama)
  cyan: { anchor: "0dccf2", hex: ["0dccf2", "c4f4fc", "9fe7f6"], rgb: [[13, 204, 242]] },
  violet: { anchor: "5e47d1", hex: ["5e47d1"], rgb: [[94, 71, 209]] },
  rose: {
    anchor: "db57c5",
    hex: ["db57c5", "fc56c1", "ff6fd8", "ff3d6e"],
    rgb: [[219, 87, 197], [255, 61, 110]],
  },
  // README identity: "Pétrole et Citron" + Argent (blue) + Local (coral)
  pop: { anchor: "e4ff3c", hex: ["e4ff3c", "f2ff7a"], rgb: [] }, // citron
  money: { anchor: "3d5afe", hex: ["3d5afe", "6f86ff"], rgb: [] }, // "Argent & gains"
  local: { anchor: "e0503a", hex: ["e0503a", "ff8a78", "421d17", "d0402b"], rgb: [] }, // "Local & affluence"
  // Petrol family: dark inks, on-accent text, dark-mode secondary text, icon backgrounds
  ink: {
    anchor: "0b1e26",
    hex: [
      "0b1e26", "14303b", "234e5e", "123e4a", "092b35", "04212b", "18262d", "0e1a20",
      "97b6bf", "64848e", "9db4bb", "859ca4", "030d11", "05161c", "07151b", "0e2732", "1f424e",
    ],
    rgb: [[8, 80, 110]],
  },
  // Navy family: dark-mode surfaces + mesh base, light-mode inks / pearl base
  base: {
    anchor: "0d1830",
    hex: [
      "020d1c", "0d1830", "162447", "2b458a", "0a1026", "0b1030", "141a44", "0b0f2a",
      "1a1f4d", "0a0d26", "14162b", "ecedf3", "4a4d63", "7c7f94",
    ],
    rgb: [[10, 22, 52], [16, 30, 66], [9, 18, 40], [20, 22, 43]],
  },
};

/* ------------------------------------------------------------------ */
/* Palettes. hues = target OKLCH hue (deg) per role; missing = unchanged */
/* chroma = per-role saturation multiplier (default 1).                  */
/* OKLCH hue guide: 30 red · 55 orange · 95 amber · 125 lime · 150 green */
/* 190 teal/cyan · 235 sky · 265 blue · 295 violet · 330 magenta · 355 pink */
/* ------------------------------------------------------------------ */
export const BASE_PORT = 3000;

/**
 * Each template = a theme rooted in Oran + a matching brand (name, Arabic name, tagline)
 * + a matching emblem (see brand.mjs). `logo` lists which color roles feed the emblem:
 * [primary, secondary, highlight].
 *
 * NOTE: the names / Arabic text / taglines below are PROPOSALS — have a native speaker
 * from Oran review them, and check name availability / trademark before launch.
 */
export const GASRA_BRAND = {
  name: "Gasra",
  nameAr: "قصرة",
  tagline: "De ton quartier, à ton pays",
  taglineAr: "من حومتك، لبلادك",
  // The login hero renders the slogan as two fragments around a <br/>; these are swapped separately.
  headline: ["De ton quartier,", "à ton pays."],
};

export const PALETTES = [
  {
    id: "original",
    name: "Original",
    port: BASE_PORT,
    blurb: "Le design d'origine « Gasra », sans modification (référence).",
    brand: GASRA_BRAND,
  },
  {
    id: "bahia",
    name: "Bahia",
    port: BASE_PORT + 1,
    blurb: "El Bahia, la radieuse : bleu Méditerranée, blanc de la ville, or du soleil.",
    brand: {
      name: "Bahia",
      nameAr: "الباهية",
      tagline: "Oran, la radieuse, se retrouve ici",
      taglineAr: "وهران الباهية تجمعنا",
      headline: ["Oran, la radieuse,", "se retrouve ici."],
    },
    emblem: "sunburst",
    // sun = a literal bright gold; the mesh itself stays cool (azure / blue / aqua)
    logo: ["#F6B93B", "accent", "pop"],
    hues: { accent: 215, cyan: 232, violet: 258, rose: 196, pop: 215, money: 88, local: 38, ink: 240, base: 252 },
    chroma: { pop: 0.3 },
  },
  {
    id: "wahran",
    name: "Wahran",
    port: BASE_PORT + 2,
    blurb: "Pierre ocre de Santa Cruz, terre cuite de Sidi El Houari, portes bleues.",
    brand: {
      name: "Wahran",
      nameAr: "وهران",
      tagline: "Oran, houma par houma",
      taglineAr: "وهران، حومة بحومة",
      headline: ["Oran,", "houma par houma."],
    },
    emblem: "arch",
    logo: ["accent", "rose", "pop"],
    hues: { accent: 62, cyan: 55, violet: 32, rose: 16, pop: 95, money: 250, local: 28, ink: 45, base: 38 },
    // muted on purpose: terracotta and stone, not fire-engine red
    chroma: { pop: 0.5, cyan: 0.8, violet: 0.5, rose: 0.65 },
    meshAlpha: 45,
  },
  {
    id: "corniche",
    name: "Corniche",
    port: BASE_PORT + 3,
    blurb: "Coucher de soleil sur le front de mer : orange, rose, indigo.",
    brand: {
      name: "Corniche",
      nameAr: "الكورنيش",
      tagline: "Rendez-vous face à la mer",
      taglineAr: "موعدنا على البحر",
      headline: ["Rendez-vous", "face à la mer."],
    },
    emblem: "sunset",
    logo: ["accent", "rose", "pop"],
    hues: { accent: 45, cyan: 50, violet: 285, rose: 355, pop: 85, money: 255, local: 25, ink: 272, base: 278 },
  },
  {
    id: "layali",
    name: "Layali",
    port: BASE_PORT + 4,
    blurb: "Nuits d'Oran, capitale du raï : néon magenta, violet et noir.",
    brand: {
      name: "Layali",
      nameAr: "ليالي",
      tagline: "Les nuits d'Oran ne dorment pas",
      taglineAr: "ليالي وهران لا تنام",
      headline: ["Les nuits d'Oran", "ne dorment pas."],
    },
    emblem: "crescent",
    logo: ["accent", "cyan", "pop"],
    hues: { accent: 335, cyan: 192, violet: 305, rose: 345, pop: 118, money: 205, local: 40, ink: 305, base: 312 },
    meshAlpha: 28, // night: dark base with neon glows instead of a full wash of color
  },
  {
    id: "dzair",
    name: "Dzair",
    port: BASE_PORT + 5,
    blurb: "Vert, blanc et rouge : les couleurs du pays, sans reprendre le drapeau.",
    brand: {
      name: "Dzair",
      nameAr: "دزاير",
      tagline: "De ton quartier, à ton pays",
      taglineAr: "من حومتك، لبلادك",
      headline: ["De ton quartier,", "à ton pays."],
    },
    emblem: "tricolor-d",
    logo: ["accent", "local", "pop"],
    hues: { accent: 150, cyan: 162, violet: 148, rose: 27, pop: 95, money: 148, local: 27, ink: 160, base: 165 },
    chroma: { pop: 0.18, rose: 0.75 },
    meshAlpha: 42,
  },
];

/* ------------------------------------------------------------------ */
/* Color math: sRGB <-> OKLab/OKLCH (Björn Ottosson), with gamut mapping */
/* ------------------------------------------------------------------ */
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export function rgbToHex([r, g, b]) {
  return [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");
}

function rgbToOklch([r8, g8, b8]) {
  const [r, g, b] = [r8, g8, b8].map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

function oklchToLinear({ L, C, h }) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** OKLCH -> sRGB [0..255]; if out of gamut, lower chroma (keeping L and h) until it fits. */
function oklchToRgb(lch) {
  const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
  let lin = oklchToLinear(lch);
  if (!inGamut(lin)) {
    let lo = 0;
    let hi = lch.C;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear({ ...lch, C: mid }))) lo = mid;
      else hi = mid;
    }
    lin = oklchToLinear({ ...lch, C: lo });
  }
  return lin.map((v) => Math.round(Math.min(1, Math.max(0, toGam(Math.min(1, Math.max(0, v))))) * 255));
}

/* ------------------------------------------------------------------ */
/* Map builder                                                          */
/* ------------------------------------------------------------------ */
/** Returns { hex: Map('2fddcb' -> 'ff9f1c'), rgb: Map('47,221,203' -> '255,159,28') }. Empty for "original". */
export function buildColorMap(palette) {
  const hex = new Map();
  const rgb = new Map();
  for (const [role, def] of Object.entries(ROLES)) {
    const target = palette.hues?.[role];
    const chroma = palette.chroma?.[role] ?? 1;
    if (target == null && chroma === 1) continue; // role unchanged
    const delta = target == null ? 0 : target - rgbToOklch(hexToRgb(def.anchor)).h;
    const recolor = (rgbIn) => {
      const { L, C, h } = rgbToOklch(rgbIn);
      return oklchToRgb({ L, C: C * chroma, h: (h + delta + 360) % 360 });
    };
    for (const h of def.hex) hex.set(h, rgbToHex(recolor(hexToRgb(h))));
    for (const t of def.rgb) rgb.set(t.join(","), recolor(t).join(","));
  }
  return { hex, rgb };
}

/* ------------------------------------------------------------------ */
/* Contrast helper (WCAG) — used by the CLI report below                 */
/* ------------------------------------------------------------------ */
function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => toLin(v / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
export function contrast(hexA, hexB) {
  const [a, b] = [luminance(hexToRgb(hexA)), luminance(hexToRgb(hexB))].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/* ------------------------------------------------------------------ */
/* CLI report: node themes/palettes.mjs                                   */
/* ------------------------------------------------------------------ */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PAIRS = [
    ["bouton: texte sur accent", "2fddcb", "04212b"],
    ["clair: accent (texte) sur perle", "0f8a7e", "ecedf3"],
    ["sombre: texte sur surface", "eef8f7", "0d1830"],
    ["sombre: texte secondaire", "97b6bf", "0d1830"],
    ["pastille citron sur pétrole", "e4ff3c", "0b1e26"],
    ["sombre: argent sur surface", "6f86ff", "0d1830"],
    ["clair: argent sur perle", "3d5afe", "ecedf3"],
  ];
  const pick = process.argv[2];
  for (const p of PALETTES.filter((x) => !pick || x.id === pick)) {
    const { hex } = buildColorMap(p);
    const m = (h) => hex.get(h) ?? h;
    console.log(`\n== ${p.name} (:${p.port}) — ${p.blurb}`);
    console.log("   rôles :", Object.entries(ROLES).map(([r, d]) => `${r} #${d.anchor}→#${m(d.anchor)}`).join("  "));
    for (const [label, fg, bg] of PAIRS) {
      const before = contrast(fg, bg);
      const after = contrast(m(fg), m(bg));
      const flag = after < before * 0.85 ? "  ⚠ contraste en baisse" : "";
      console.log(`   ${label.padEnd(34)} ${before.toFixed(2).padStart(5)} → ${after.toFixed(2).padStart(5)}${flag}`);
    }
  }
}
