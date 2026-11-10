/**
 * Gasra templates — brand assets generated from a palette:
 *  - emblem()      glyph-only SVG group (transparent background, 200x200 box)
 *  - logoSvg()     the in-app logo (411x275, same aspect as /assets/logo.png)
 *  - iconSvg()     app icon / favicon (512x512)
 *  - overrideCss() small CSS block that re-colors the logo shimmer
 *
 * Emblems are glyph-only on purpose: the app also uses the logo as a CSS mask for its
 * shimmer effect (.logo-flow), so the logo's alpha channel must be the shape itself.
 *
 * Motifs: sunburst = "El Bahia, la radieuse" · arch+star = Moorish arch of Oran's old town ·
 * sunset = Corniche seafront · crescent+bars = raï nights · tricolor D = national colors
 * (deliberately NOT the flag, crescent or star).
 */
import { ROLES, buildColorMap } from "./palettes.mjs";

const r2 = (n) => Math.round(n * 100) / 100;
const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

/** Palette colors for the emblem: [primary, secondary, highlight] as #rrggbb. */
export function logoColors(pal) {
  const { hex } = buildColorMap(pal);
  // an entry is a role name (its anchor color), a specific source hex (e.g. "6f86ff"),
  // or a literal "#rrggbb" used as-is (not remapped)
  const of = (key) => {
    if (key.startsWith("#")) return key;
    const src = ROLES[key]?.anchor ?? key;
    return `#${hex.get(src) ?? src}`;
  };
  return (pal.logo ?? ["accent", "violet", "pop"]).map(of);
}

/** Color of any source hex after palette remap (for icon background etc.). */
function mapped(pal, h) {
  const { hex } = buildColorMap(pal);
  return `#${hex.get(h) ?? h}`;
}

function starPoints(cx, cy, points, outer, inner, startDeg = -90) {
  const out = [];
  for (let k = 0; k < points * 2; k++) {
    const [x, y] = polar(cx, cy, k % 2 === 0 ? outer : inner, startDeg + (k * 180) / points);
    out.push(`${r2(x)},${r2(y)}`);
  }
  return out.join(" ");
}

const EMBLEMS = {
  // El Bahia — "the radiant": sun with alternating rays
  sunburst([c1, c2, c3]) {
    let rays = "";
    for (let i = 0; i < 12; i++) {
      const [x1, y1] = polar(100, 100, 55, i * 30);
      const [x2, y2] = polar(100, 100, i % 2 === 0 ? 92 : 76, i * 30);
      rays += `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${i % 2 === 0 ? c1 : c2}" stroke-width="10" stroke-linecap="round"/>`;
    }
    return `${rays}<circle cx="100" cy="100" r="35" fill="${c1}"/><circle cx="100" cy="100" r="45" fill="none" stroke="${c3}" stroke-width="4"/>`;
  },

  // Wahran — Moorish horseshoe arch around an 8-point star
  arch([c1, c2, c3]) {
    return (
      `<path d="M 42 190 L 42 114 A 64 64 0 1 1 158 114 L 158 190" fill="none" stroke="${c1}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<polygon points="${starPoints(100, 148, 8, 36, 21)}" fill="${c2}"/>` +
      `<circle cx="100" cy="148" r="8" fill="${c3}"/>`
    );
  },

  // Corniche — striped sun setting over the sea
  sunset([c1, c2, c3]) {
    const wave = (y) => `<path d="M 22 ${y} q 19.5 -11 39 0 t 39 0 t 39 0 t 39 0" fill="none" stroke="${c2}" stroke-width="8" stroke-linecap="round"/>`;
    return (
      `<defs><mask id="sunStripes"><rect width="200" height="200" fill="#fff"/><rect y="94" width="200" height="4" fill="#000"/><rect y="106" width="200" height="6" fill="#000"/></mask></defs>` +
      `<path d="M 36 120 A 64 64 0 0 1 164 120 Z" fill="${c1}" mask="url(#sunStripes)"/>` +
      `<line x1="26" y1="124" x2="174" y2="124" stroke="${c3}" stroke-width="5" stroke-linecap="round"/>` +
      wave(142) + wave(160) + wave(178)
    );
  },

  // Layali — crescent moon over raï equalizer bars
  crescent([c1, c2, c3]) {
    const heights = [26, 46, 66, 42, 28];
    const bars = heights
      .map((h, i) => `<line x1="${48 + i * 26}" y1="${190 - h}" x2="${48 + i * 26}" y2="190" stroke="${i === 2 ? c3 : c2}" stroke-width="13" stroke-linecap="round"/>`)
      .join("");
    const [sx, sy] = [148, 40];
    const spark = `<polygon points="${sx},${sy - 15} ${sx + 4},${sy - 4} ${sx + 15},${sy} ${sx + 4},${sy + 4} ${sx},${sy + 15} ${sx - 4},${sy + 4} ${sx - 15},${sy} ${sx - 4},${sy - 4}" fill="${c3}"/>`;
    return (
      `<defs><mask id="moonCut"><rect width="200" height="200" fill="#fff"/><circle cx="122" cy="52" r="34" fill="#000"/></mask></defs>` +
      `<circle cx="96" cy="64" r="46" fill="${c1}" mask="url(#moonCut)"/>` + spark + bars
    );
  },

  // Dzair — monogram "D" in three horizontal bands (national colors, not the flag)
  "tricolor-d"([c1, c2, c3]) {
    return (
      `<defs><clipPath id="dOuter"><path d="M 36 26 H 92 A 74 74 0 0 1 92 174 H 36 Z"/></clipPath>` +
      `<mask id="dCounter"><rect width="200" height="200" fill="#fff"/><path d="M 68 56 H 92 A 44 44 0 0 1 92 144 H 68 Z" fill="#000"/></mask></defs>` +
      `<g mask="url(#dCounter)"><g clip-path="url(#dOuter)">` +
      `<rect x="30" y="20" width="160" height="64" fill="${c1}"/><rect x="30" y="82" width="160" height="38" fill="${c3}"/><rect x="30" y="118" width="160" height="64" fill="${c2}"/>` +
      `</g></g>`
    );
  },
};

export function hasEmblem(pal) {
  return Boolean(pal.emblem && EMBLEMS[pal.emblem]);
}

export function emblem(pal) {
  return EMBLEMS[pal.emblem](logoColors(pal));
}

/** In-app logo: transparent, 411x275 (same ratio as the original /assets/logo.png). */
export function logoSvg(pal) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 411 275" width="411" height="275">` +
    `<g transform="translate(205.5 137.5) scale(1.3) translate(-100 -100)">${emblem(pal)}</g></svg>`
  );
}

/** App icon: rounded (favicon / og:image) or full-bleed square (apple-touch / PWA icons). */
export function iconSvg(pal, { square = false } = {}) {
  const top = mapped(pal, "0e2732");
  const bottom = mapped(pal, "07151b");
  const edge = mapped(pal, "1f424e");
  const bg = square
    ? `<rect width="512" height="512" fill="url(#iconBg)"/>`
    : `<rect x="24" y="24" width="464" height="464" rx="112" fill="url(#iconBg)" stroke="${edge}" stroke-width="8"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">` +
    `<defs><linearGradient id="iconBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>` +
    `${bg}<g transform="translate(256 256) scale(1.5) translate(-100 -100)">${emblem(pal)}</g></svg>`
  );
}

/**
 * The original logo shimmer blends a hardcoded green/blue gradient with `mix-blend-mode: color`,
 * which would tint every themed emblem green/blue. Re-color it with the palette instead, using a
 * gentle `overlay` blend so multi-color emblems keep their colors.
 */
export function overrideCss(pal) {
  const [c1, c2] = logoColors(pal);
  let css =
    `.logo-flow{background-image:linear-gradient(90deg,${c1} 0%,${c2} 25%,${c1} 50%,${c2} 75%,${c1} 100%)!important;` +
    `mix-blend-mode:overlay!important;opacity:.6}`;
  // The original login headline gradient passes through the dark violet #5E47D1, which vanishes
  // into the dark background (letters disappear). Use only the bright members of the palette.
  const [g1, g2, g3] = ["2fddcb", "0dccf2", "ff6fd8"].map((h) => mapped(pal, h));
  css +=
    `.login-gradient-text{background:linear-gradient(90deg,${g1},${g2} 45%,${g3})!important;` +
    `-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important}`;
  // Optional: strength of the colored blobs in the dark-mode mesh background (original: 55%).
  if (pal.meshAlpha) css += `.dark .gasra-mesh-bg{--mesh-a:${pal.meshAlpha}%}`;
  return css;
}
