import React, { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

/**
 * PlaystationMirageCanvas
 * Fond animé "mirage" PlayStation : filaments vaporeux, gracieux et épurés,
 * sans saturation blanche, utilisant purement le dégradé #0DCCF2 → #5E47D1 → #FC56C1 avec dominance du rose.
 *
 * Densité aérée et fluide, WebGL pur sans dépendance externe.
 */

export type MirageOptions = {
  /** Dégradé des filaments (3 couleurs hex). */
  colors?: [string, string, string];
  /** Intensité globale des filaments. Défaut 0.95 en sombre, 0.6 en clair. */
  intensity?: number;
  /** Nombre de filaments simultanés visibles (défaut 2, plus aéré). */
  maxWisps?: number;
  /** Vitesse de dérive (1 = normale). */
  speed?: number;
  /** Résolution de rendu. */
  resolution?: number;
};

type Props = MirageOptions & {
  /** Dégradé du fond (haut → bas). */
  backgroundFrom?: string;
  backgroundTo?: string;
  className?: string;
};

const MAX_WISPS = 4;

/* ------------------------------------------------------------------ */
/* Shaders GLSL purs                                                  */
/* ------------------------------------------------------------------ */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

#define MAXW ${MAX_WISPS}

uniform vec2  uRes;
uniform float uTime;
uniform float uIntensity;
uniform vec3  uC0;
uniform vec3  uC1;
uniform vec3  uC2;
// a: centre.x, centre.y, angle, vie (0–1)
// b: graine, longueur, largeur, (libre)
uniform vec4 uA[MAXW];
uniform vec4 uB[MAXW];

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.03;
    a *= 0.5;
  }
  return v;
}

float fbm2(vec2 p) {
  return 0.65 * noise(p) + 0.35 * noise(p * 2.1 + 17.0);
}

vec3 gradient(float t) {
  t = clamp(t, 0.0, 1.0);
  // Cyan (#0DCCF2) -> court trait d'union Violet (#5E47D1) -> Rose prédominant (#FC56C1 / #DB57C5)
  // Le violet n'est qu'un trait d'union rapide (t < 0.28), le rose prédomine largement sur 72% de l'amplitude
  return t < 0.28 ? mix(uC0, uC1, t / 0.28) : mix(uC1, uC2, (t - 0.28) / 0.72);
}

// Étoiles cosmiques profondes qui scintillent périodiquement
vec3 renderDeepStars(vec2 p, float time) {
  vec3 starCol = vec3(0.0);

  // 1. Poussière céleste profonde (micro-étoiles scintillantes distantes)
  vec2 g1 = p * 26.0;
  vec2 id1 = floor(g1);
  vec2 f1 = fract(g1) - 0.5;
  float h1 = hash(id1 + vec2(17.43, 83.19));

  if (h1 > 0.86) {
    vec2 offset1 = vec2(hash(id1 * 2.11 + 1.3) - 0.5, hash(id1 * 3.47 + 7.8) - 0.5) * 0.72;
    float d1 = length(f1 - offset1);

    // Scintillement périodique organique avec temps de repos
    float spd1 = 0.55 + hash(id1 * 7.1) * 1.1;
    float ph1 = h1 * 6.28318;
    float wave1 = sin(time * spd1 + ph1) * 0.5 + 0.5;
    float twinkle1 = pow(wave1, 3.2);

    float core1 = smoothstep(0.042, 0.0, d1);
    float glow1 = exp(-d1 * 16.0) * 0.35;
    float intensity1 = (core1 + glow1) * (0.12 + 0.88 * twinkle1);

    vec3 tint1 = (hash(id1 + 33.1) > 0.5) ? mix(vec3(1.0), uC0, 0.45) : mix(vec3(1.0), uC2, 0.45);
    starCol += tint1 * intensity1 * 0.45;
  }

  // 2. Étoiles principales en profondeur avec éclat ponctuel et micro-aigrettes
  vec2 g2 = p * 13.5 + vec2(3.7, 8.1);
  vec2 id2 = floor(g2);
  vec2 f2 = fract(g2) - 0.5;
  float h2 = hash(id2 + vec2(53.27, 29.81));

  if (h2 > 0.91) {
    vec2 offset2 = vec2(hash(id2 * 1.83 + 3.1) - 0.5, hash(id2 * 2.71 + 5.9) - 0.5) * 0.70;
    float d2 = length(f2 - offset2);

    float spd2 = 0.40 + hash(id2 * 4.9) * 0.85;
    float ph2 = h2 * 6.28318;
    // S'illumine doucement puis scintille avec vivacité
    float wave2 = sin(time * spd2 + ph2) * 0.5 + 0.5;
    float twinkle2 = pow(wave2, 4.5);

    // Aigrette de diffraction subtile quand l'étoile atteint son zénith de brillance
    vec2 dAbs = abs(f2 - offset2);
    float spike = (smoothstep(0.016, 0.0, dAbs.x) * smoothstep(0.12, 0.0, dAbs.y) +
                   smoothstep(0.016, 0.0, dAbs.y) * smoothstep(0.12, 0.0, dAbs.x)) * 0.32 * twinkle2;

    float core2 = smoothstep(0.065, 0.0, d2);
    float halo2 = exp(-d2 * 12.0) * 0.45;
    float intensity2 = (core2 * 1.1 + halo2 + spike) * (0.16 + 0.84 * twinkle2);

    float tintSeed = hash(id2 + 104.2);
    vec3 tint2 = vec3(1.0);
    if (tintSeed > 0.6) {
      tint2 = mix(vec3(1.0), uC0, 0.55);
    } else if (tintSeed > 0.25) {
      tint2 = mix(vec3(1.0), uC2, 0.55);
    }

    starCol += tint2 * intensity2 * 0.70;
  }

  return starCol;
}

void main() {
  // Coordonnées centrées, normalisées sur la hauteur
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  for (int i = 0; i < MAXW; i++) {
    vec4 a = uA[i];
    vec4 b = uB[i];
    float life = a.w;
    if (life <= 0.001) continue;

    float seed = b.x;
    float len  = b.y;
    float wid  = b.z;

    // Repère local du filament (x = axe longitudinal, y = axe transversal)
    vec2 d = p - a.xy;
    vec2 dir = vec2(cos(a.z), sin(a.z));
    vec2 q = vec2(dot(d, dir), dot(d, vec2(-dir.y, dir.x)));

    float t = uTime * 0.05;
    float along = q.x / len; // -1 (traîne) … 1 (tête)

    // Enveloppe d'effilement : extrémités douces
    float env = exp(-along * along * 1.9);
    float spread = 0.68 + 0.55 * smoothstep(0.85, -1.0, along);

    // Ondulation organique vaporeuse
    q.y += sin(q.x * 1.7 + uTime * 0.18 + seed) * 0.05;

    // Bruit domain-warped étiré dans le sens de déplacement
    vec2 sp = q * vec2(1.7, 3.2) + seed;
    sp.x -= t * 2.0;
    vec2 w1 = vec2(fbm(sp + vec2(0.0, t)), fbm(sp + vec2(5.2, 1.3) - t));
    vec2 w2 = vec2(
      fbm(sp + 3.0 * w1 + vec2(1.7, 9.2) + t * 0.7),
      fbm(sp + 3.0 * w1 + vec2(8.3, 2.8) - t * 0.8)
    );
    float smoke = fbm2(sp + 2.5 * w2);

    // Profil transversal aéré (moins dense, plus vaporeux)
    float across = abs(q.y) / (wid * spread);
    float core = exp(-across * across * 4.4);
    float whisps = smoothstep(0.32, 0.82, smoke) * exp(-across * 2.8);
    float shape = (core * 0.65 + whisps * 0.55) * env;

    // Fondu doux d'entrée et de sortie
    float fade = smoothstep(0.0, 0.18, life) * smoothstep(1.0, 0.82, life);
    shape *= fade;

    // Dégradé 100% fidèle #0DCCF2 → #5E47D1 → #FC56C1 avec dominance du rose
    float colorT = clamp(along * 0.5 + 0.5 + (smoke - 0.5) * 0.32, 0.0, 1.0);
    vec3 wispCol = gradient(colorT);

    col += wispCol * shape;
    alpha += shape;
  }

  col *= uIntensity;
  alpha = clamp(alpha * uIntensity, 0.0, 0.72);

  // Étoiles cosmiques scintillantes dans les profondeurs
  // Étoiles plus lointaines : atténuées et légèrement fondues dans le bleu nuit
  vec3 deepStars = renderDeepStars(p, uTime) * uIntensity * 0.38;
  // Les filaments vaporeux flottent devant et voilent doucement les étoiles en arrière-plan
  vec3 finalCol = deepStars * (1.0 - clamp(alpha * 0.85, 0.0, 0.85)) + col;
  float finalAlpha = clamp(alpha + length(deepStars) * 0.9, 0.0, 0.85);

  // Rendu WebGL prémultiplié sans voile blanc
  gl_FragColor = vec4(finalCol, finalAlpha);
}
`;

/* ------------------------------------------------------------------ */
/* Helpers WebGL & Couleurs                                           */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0.24, 0.88, 0.81];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

interface Wisp {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  life: number;
  lifeSpeed: number;
  seed: number;
  len: number;
  wid: number;
  delay: number;
}

// Zones d'apparition aérées pour couvrir l'écran sans surcharge
const SCREEN_ZONES = [
  { yMin: 0.18, yMax: 0.38, preferAngle: -0.22 },  // Zone supérieure
  { yMin: -0.15, yMax: 0.10, preferAngle: 0.30 },  // Zone centrale
  { yMin: -0.38, yMax: -0.16, preferAngle: -0.25 },// Zone inférieure
  { yMin: -0.20, yMax: 0.20, preferAngle: 0.48 },  // Diagonale fluide
];

function createMirage(
  aspect: number,
  speedMultiplier: number,
  zoneIndex = 0,
  initialDelay = 0
): Wisp {
  const zone = SCREEN_ZONES[zoneIndex % SCREEN_ZONES.length];
  const angle = zone.preferAngle + (Math.random() - 0.5) * 0.4;
  const spd = (0.024 + Math.random() * 0.032) * speedMultiplier;

  const spawnY = zone.yMin + Math.random() * (zone.yMax - zone.yMin);
  const spawnX = (Math.random() - 0.5) * aspect * 1.3;

  return {
    x: spawnX,
    y: spawnY,
    vx: Math.cos(angle) * spd,
    vy: Math.sin(angle) * spd,
    angle,
    vAngle: (Math.random() - 0.5) * 0.035 * speedMultiplier,
    life: 0,
    lifeSpeed: (1.0 / (8.5 + Math.random() * 5.5)) * speedMultiplier,
    seed: Math.random() * 100.0,
    len: 0.95 + Math.random() * 0.6, // Filament fin et fluide
    wid: 0.10 + Math.random() * 0.06, // Moins épais, vaporeux
    delay: initialDelay,
  };
}

/* ------------------------------------------------------------------ */
/* Composant PlaystationMirageCanvas                                  */
/* ------------------------------------------------------------------ */

export const PlaystationMirageCanvas: React.FC<Props> = ({
  colors: colorsProp,
  backgroundFrom,
  backgroundTo,
  intensity,
  maxWisps = 2,
  speed = 1,
  resolution = 0.75,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useApp();
  const isDark = theme === "dark";
  // Vagues : dégradé de marque cyan → violet → rose dans les deux modes
  const colors =
    colorsProp ?? ["#0DCCF2", "#5E47D1", "#FC56C1"];

  // Palette fidèle PlayStation :
  // En mode sombre : bleu nuit d'origine très assombri (#020D1C -> #01050C), proche du noir mais toujours bleu
  // En mode clair « Nacre » : gris perle (#ECEDF3 -> #FAFAFC), vagues de la marque en léger
  const effectiveBgFrom = backgroundFrom ?? (isDark ? "#020D1C" : "#ECEDF3");
  const effectiveBgTo = backgroundTo ?? (isDark ? "#01050C" : "#FAFAFC");
  const effectiveIntensity = intensity ?? (isDark ? 0.95 : 0.6);

  const colorsRef = useRef(colors);
  colorsRef.current = colors;
  const intensityRef = useRef(effectiveIntensity);
  intensityRef.current = effectiveIntensity;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
      }) ||
      (canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
      }) as WebGLRenderingContext | null);

    if (!gl) return;

    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    // Quad plein écran
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResLoc = gl.getUniformLocation(prog, "uRes");
    const uTimeLoc = gl.getUniformLocation(prog, "uTime");
    const uIntensityLoc = gl.getUniformLocation(prog, "uIntensity");
    const uC0Loc = gl.getUniformLocation(prog, "uC0");
    const uC1Loc = gl.getUniformLocation(prog, "uC1");
    const uC2Loc = gl.getUniformLocation(prog, "uC2");

    // Tableaux de wisps
    const uALoc =
      gl.getUniformLocation(prog, "uA[0]") ?? gl.getUniformLocation(prog, "uA");
    const uBLoc =
      gl.getUniformLocation(prog, "uB[0]") ?? gl.getUniformLocation(prog, "uB");

    const uAData = new Float32Array(MAX_WISPS * 4);
    const uBData = new Float32Array(MAX_WISPS * 4);

    // Initialisation aérée : 2 filaments par défaut, échelonnés dans le temps
    const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    const wisps: Wisp[] = [];
    const count = Math.min(Math.max(1, maxWisps), MAX_WISPS);
    for (let i = 0; i < count; i++) {
      wisps.push(createMirage(aspect, speedRef.current, i, i * 3.0));
    }

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const res = Math.max(0.4, Math.min(1.0, resolution));
      width = Math.floor(window.innerWidth * res * dpr);
      height = Math.floor(window.innerHeight * res * dpr);

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      gl.useProgram(prog);
      gl.uniform2f(uResLoc, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Boucle d'animation
    let animId = 0;
    let lastTime = performance.now();
    let totalTime = 0;

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      totalTime += delta * speedRef.current;

      const currentAspect = window.innerWidth / Math.max(window.innerHeight, 1);

      // Mise à jour des filaments
      for (let i = 0; i < count; i++) {
        const w = wisps[i];
        if (w.delay > 0) {
          w.delay -= delta;
          uAData[i * 4 + 3] = 0;
          continue;
        }

        w.life += w.lifeSpeed * delta;
        w.x += w.vx * delta;
        w.y += w.vy * delta;
        w.angle += w.vAngle * delta;

        // Réapparition aérée
        if (w.life >= 1.0) {
          wisps[i] = createMirage(
            currentAspect,
            speedRef.current,
            i + Math.floor(Math.random() * 2) + 1,
            Math.random() * 1.5
          );
          uAData[i * 4 + 3] = 0;
          continue;
        }

        uAData[i * 4 + 0] = w.x;
        uAData[i * 4 + 1] = w.y;
        uAData[i * 4 + 2] = w.angle;
        uAData[i * 4 + 3] = w.life;

        uBData[i * 4 + 0] = w.seed;
        uBData[i * 4 + 1] = w.len;
        uBData[i * 4 + 2] = w.wid;
        uBData[i * 4 + 3] = 0;
      }

      for (let i = count; i < MAX_WISPS; i++) {
        uAData[i * 4 + 3] = 0;
      }

      gl.useProgram(prog);
      gl.uniform1f(uTimeLoc, totalTime);
      gl.uniform1f(uIntensityLoc, intensityRef.current);

      const [c0, c1, c2] = colorsRef.current;
      const rgb0 = hexToRgb(c0);
      const rgb1 = hexToRgb(c1);
      const rgb2 = hexToRgb(c2);
      gl.uniform3f(uC0Loc, rgb0[0], rgb0[1], rgb0[2]);
      gl.uniform3f(uC1Loc, rgb1[0], rgb1[1], rgb1[2]);
      gl.uniform3f(uC2Loc, rgb2[0], rgb2[1], rgb2[2]);

      if (uALoc) gl.uniform4fv(uALoc, uAData);
      if (uBLoc) gl.uniform4fv(uBLoc, uBData);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [maxWisps, resolution]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700 ${className}`}
      style={{
        background: `linear-gradient(180deg, ${effectiveBgFrom} 0%, ${effectiveBgTo} 100%)`,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block mirage-canvas"
        style={{ width: "100%", height: "100%" }}
      />
      {/* Grain de toile : donne au mirage un rendu de peinture à l'huile */}
      <div className="mirage-canvas-grain" />
    </div>
  );
};

export default PlaystationMirageCanvas;