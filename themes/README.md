# Gasra — Oran templates

Five complete identities (colors + name + logo + tagline), each served on its own port from the
**same source tree**. Nothing in `src/` is modified: a Vite plugin rewrites colors and brand text
on the fly (see `palette-plugin.mjs`).

| Port | Template | Name (Latin / Arabic) | Idea | Emblem |
|------|----------|-----------------------|------|--------|
| 3000 | original | Gasra / قصرة | the original design (your own `npm run dev`) | — |
| 3001 | **bahia** | Bahia / الباهية | *El Bahia*, "the radiant": Mediterranean blue, white, sun gold | sunburst |
| 3002 | **wahran** | Wahran / وهران | ochre stone, terracotta, old-town blue doors | Moorish arch + 8-point star |
| 3003 | **corniche** | Corniche / الكورنيش | sunset over the seafront: orange, pink, indigo | striped sun over waves |
| 3004 | **layali** | Layali / ليالي | Oran nights, capital of raï: neon on dark purple | crescent + equalizer bars |
| 3005 | **dzair** | Dzair / دزاير | green, cream, red — the national colors | tricolor "D" |

Previews: `themes/preview/` (login, signed-in dark, signed-in light).

## Run

```bash
npm run themes:start     # background, survives the terminal; logs in themes/.run/themes.log
npm run themes:status    # pid + HTTP status per port
npm run themes:stop
npm run themes           # foreground (Ctrl-C to stop)
```

Options (pass after `--`, or call `node themes/serve.mjs` directly):
`--only bahia,layali` · `--lan` (listen on the network; default is **127.0.0.1 only**) · `--list`.
The npm scripts already pass `--no-original`, because port 3000 is your own `npm run dev`.

Each port is its **own browser origin**: login session, theme (light/dark) and storage are separate
per port — log in again on each (demo account `amine`). The PWA plugin is disabled in these
instances so no service worker caches a stale theme.

## How a template is defined

`palettes.mjs` → `PALETTES`. For each template: a hue per brand **role** (accent, cyan, violet,
rose, pop, money, local, ink, base), optional chroma multipliers, `meshAlpha` (background glow
strength), the brand (`name`, `nameAr`, `tagline`, `taglineAr`, `headline`), the `emblem` and the
`logo` colors. Colors are rotated in OKLCH so lightness — hence text contrast — is preserved
(`node themes/palettes.mjs` prints the before/after contrast of the key text/background pairs).

Left untouched on purpose: semantic colors (reds = error, greens = success, ambers = warning/gold),
Facebook/Instagram/TikTok colors, neutral grays, and the demo logins (`amine@gasra.dz`,
password `Gasra2026!`).

Add a template: copy a block in `PALETTES`, pick hues/name/emblem, restart, then regenerate the
PNG icons: `node themes/tools/make-icons.mjs <id>` (needs Firefox + python3/Pillow).
New emblems go in `brand.mjs` (`EMBLEMS`; keep them glyph-only/transparent — the app uses the logo
as a CSS mask for its shimmer).

## Before launch

* **Names, Arabic text and taglines are proposals.** Have a native speaker from Oran review them,
  and check name availability / trademark (Bahia, Wahran, Layali… are common words).
* The Dzair emblem deliberately avoids the flag, crescent and star (official emblem).
* Not themed: the animated `public/assets/logo-anim/` design files (unused by the app) and the
  illustrations/photos under `public/assets/aistudio/`.
