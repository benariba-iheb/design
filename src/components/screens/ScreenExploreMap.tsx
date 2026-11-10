import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import L from "leaflet";
import {
  Search,
  TrendingUp,
  Store,
  Sparkles,
  MapPin,
  Navigation,
  Check,
  ChevronRight,
  Radar,
  Map as MapIcon,
  Star,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

/* ------------------------------------------------------------------ */
/* Données de démo                                                     */
/* ------------------------------------------------------------------ */
type Category = "restaurants" | "fastfood" | "cafes" | "vetements" | "tech" | "beaute" | "sport";

interface Place {
  id: string;
  name: string;
  category: Category;
  emoji: string;
  quartier: string;
  distance: number; // mètres
  bearing: number; // degrés (0 = nord)
  rating: number;
  deal?: string;
  trending: number;
  forYou: number;
}

const CENTER: [number, number] = [36.718, 3.182];

const PLACES: Place[] = [
  { id: "p1", name: "Sandwicherie El Forno", category: "fastfood", emoji: "🍔", quartier: "Bab Ezzouar", distance: 240, bearing: 35, rating: 4.7, deal: "-30%", trending: 98, forYou: 92 },
  { id: "p2", name: "Café des Frères", category: "cafes", emoji: "☕", quartier: "Kouba", distance: 600, bearing: 210, rating: 4.8, trending: 76, forYou: 88 },
  { id: "p3", name: "Dar El Bahdja", category: "restaurants", emoji: "🍽️", quartier: "Bab Ezzouar", distance: 420, bearing: 300, rating: 4.6, deal: "-15%", trending: 81, forYou: 70 },
  { id: "p4", name: "Hanout Fashion", category: "vetements", emoji: "👗", quartier: "Cité 5 Juillet", distance: 780, bearing: 120, rating: 4.3, trending: 54, forYou: 61 },
  { id: "p5", name: "TechZone DZ", category: "tech", emoji: "💻", quartier: "Bab Ezzouar", distance: 350, bearing: 165, rating: 4.5, deal: "-10%", trending: 69, forYou: 95 },
  { id: "p6", name: "Salon Lalla Beauté", category: "beaute", emoji: "💄", quartier: "El Hamiz", distance: 900, bearing: 70, rating: 4.9, trending: 63, forYou: 58 },
  { id: "p7", name: "City Stade 5 Juillet", category: "sport", emoji: "⚽", quartier: "Cité 5 Juillet", distance: 850, bearing: 255, rating: 4.4, trending: 88, forYou: 67 },
  { id: "p8", name: "Pizzeria Napoli", category: "fastfood", emoji: "🍕", quartier: "Bab Ezzouar", distance: 520, bearing: 340, rating: 4.2, trending: 72, forYou: 74 },
  { id: "p9", name: "Qahwa Tal3a", category: "cafes", emoji: "🧉", quartier: "Dar El Beida", distance: 300, bearing: 95, rating: 4.6, deal: "1 offert", trending: 90, forYou: 83 },
  { id: "p10", name: "Gym Houma Fit", category: "sport", emoji: "🏋️", quartier: "El Hamiz", distance: 680, bearing: 20, rating: 4.5, trending: 57, forYou: 79 },
];

const CATEGORIES: { id: "tout" | Category; fr: string; ar: string; emoji: string }[] = [
  { id: "tout", fr: "Tout", ar: "الكل", emoji: "🌟" },
  { id: "restaurants", fr: "Restaurants", ar: "مطاعم", emoji: "🍽️" },
  { id: "fastfood", fr: "Fast Food", ar: "أكل سريع", emoji: "🍔" },
  { id: "cafes", fr: "Cafés", ar: "مقاهي", emoji: "☕" },
  { id: "vetements", fr: "Vêtements", ar: "ملابس", emoji: "👗" },
  { id: "tech", fr: "Tech", ar: "تقنية", emoji: "💻" },
  { id: "beaute", fr: "Beauté", ar: "جمال", emoji: "💄" },
  { id: "sport", fr: "Sport", ar: "رياضة", emoji: "⚽" },
];

const TRENDS = [
  { tag: "#BonsGasra", n: 164 },
  { tag: "#chawarma", n: 137 },
  { tag: "#qahwa_tal3a", n: 113 },
  { tag: "#match_houma", n: 103 },
  { tag: "#tech_dz", n: 60 },
  { tag: "#soldes", n: 52 },
  { tag: "#beauté", n: 39 },
];

const MAX_DIST = 1000;
const fmtDist = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);
const walkMin = (m: number) => Math.max(1, Math.round(m / 80));
const toLatLng = (p: Place): [number, number] => {
  const r = p.distance / 111320;
  const b = (p.bearing * Math.PI) / 180;
  return [CENTER[0] + r * Math.cos(b), CENTER[1] + (r * Math.sin(b)) / Math.cos((CENTER[0] * Math.PI) / 180)];
};

/* ------------------------------------------------------------------ */
/* Radar de la Houma                                                   */
/* ------------------------------------------------------------------ */
const SWEEP_S = 6;

const HoumaRadar: React.FC<{
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ places, selectedId, onSelect }) => {
  const selected = places.find((p) => p.id === selectedId);
  const pos = (p: Place) => {
    const r = (Math.min(p.distance, MAX_DIST) / MAX_DIST) * 44; // % du rayon utile
    const b = (p.bearing * Math.PI) / 180;
    return { x: 50 + Math.sin(b) * r, y: 50 - Math.cos(b) * r };
  };

  return (
    <div className="radar relative w-full aspect-square max-w-[440px] mx-auto select-none">
      {/* Anneaux de distance */}
      {[0.25, 0.5, 0.75, 1].map((k, i) => (
        <div
          key={k}
          className="radar-ring absolute rounded-full"
          style={{ inset: `${50 - 44 * k}%` }}
        >
          {i % 2 === 1 && (
            <span className="radar-ring-label absolute left-1/2 -translate-x-1/2 -top-2 text-[9px] font-mono px-1 rounded">
              {fmtDist(MAX_DIST * k)}
            </span>
          )}
        </div>
      ))}
      {/* Croix */}
      <div className="radar-axis absolute left-1/2 top-[6%] bottom-[6%] w-px -translate-x-1/2" />
      <div className="radar-axis absolute top-1/2 left-[6%] right-[6%] h-px -translate-y-1/2" />

      {/* Balayage */}
      <div className="radar-sweep absolute rounded-full" style={{ inset: "6%", animationDuration: `${SWEEP_S}s` }} />

      {/* Ondes émises depuis toi */}
      <div className="radar-pulse absolute rounded-full" />
      <div className="radar-pulse absolute rounded-full" style={{ animationDelay: "1.5s" }} />

      {/* Ligne vers le lieu sélectionné */}
      {selected && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <motion.line
            key={selected.id}
            x1={50}
            y1={50}
            x2={pos(selected).x}
            y2={pos(selected).y}
            className="radar-link"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
      )}

      {/* Toi */}
      <div className="radar-me absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" />

      {/* Lieux */}
      <AnimatePresence>
        {places.map((p) => {
          const { x, y } = pos(p);
          const active = p.id === selectedId;
          return (
            <motion.button
              key={p.id}
              onClick={() => onSelect(p.id)}
              title={p.name}
              className={`radar-blip absolute -translate-x-1/2 -translate-y-1/2 ${active ? "is-active" : ""}`}
              style={{ left: `${x}%`, top: `${y}%`, ["--blip-delay" as any]: `${(p.bearing / 360) * SWEEP_S}s` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: active ? 1.25 : 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              whileHover={{ scale: 1.3 }}
            >
              <span className="radar-blip-dot flex items-center justify-center w-8 h-8 rounded-full text-sm">
                {p.emoji}
              </span>
              {p.deal && <span className="radar-blip-deal absolute -top-2 -right-3 text-[9px] font-bold px-1.5 rounded-full">{p.deal}</span>}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Plan classique (Leaflet) — accessible via le bouton "Plan"           */
/* ------------------------------------------------------------------ */
const PlanMap: React.FC<{ places: Place[]; selectedId: string | null; onSelect: (id: string) => void }> = ({
  places,
  selectedId,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { center: CENTER, zoom: 15, zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markers.current.forEach((m) => m.remove());
    markers.current = places.map((p) => {
      const active = p.id === selectedId;
      const icon = L.divIcon({
        className: "gasra-plan-pin",
        html: `<div class="gasra-plan-pin-dot${active ? " is-active" : ""}">${p.emoji}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      const m = L.marker(toLatLng(p), { icon }).addTo(map);
      m.on("click", () => onSelect(p.id));
      return m;
    });
    const sel = places.find((p) => p.id === selectedId);
    if (sel) map.panTo(toLatLng(sel));
  }, [places, selectedId, onSelect]);

  return <div ref={ref} className="plan-map w-full aspect-square max-w-[440px] mx-auto rounded-3xl overflow-hidden" />;
};

/* ------------------------------------------------------------------ */
/* Écran Explorer                                                      */
/* ------------------------------------------------------------------ */
export const ScreenExploreMap: React.FC = () => {
  const { language, currentWilaya, triggerRaniJay } = useApp();
  const isAr = language === "ar";
  const city = (currentWilaya.split("-").pop() || "Alger").trim();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"explorer" | "pourtoi" | "trending">("explorer");
  const [cat, setCat] = useState<"tout" | Category>("tout");
  const [view, setView] = useState<"radar" | "plan">("radar");
  const [selectedId, setSelectedId] = useState<string | null>(PLACES[0].id);
  const [raniJay, setRaniJay] = useState<Record<string, boolean>>({});

  const places = useMemo(() => {
    let list = PLACES.filter(
      (p) =>
        (cat === "tout" || p.category === cat) &&
        (!query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase()))
    );
    if (tab === "explorer") list = [...list].sort((a, b) => a.distance - b.distance);
    if (tab === "pourtoi") list = [...list].sort((a, b) => b.forYou - a.forYou);
    if (tab === "trending") list = [...list].sort((a, b) => b.trending - a.trending);
    return list;
  }, [cat, query, tab]);

  useEffect(() => {
    if (places.length && !places.some((p) => p.id === selectedId)) setSelectedId(places[0].id);
  }, [places, selectedId]);

  const selected = places.find((p) => p.id === selectedId) || null;
  const onSelect = React.useCallback((id: string) => setSelectedId(id), []);

  const goRaniJay = (p: Place) => {
    triggerRaniJay(p.id);
    setRaniJay((r) => ({ ...r, [p.id]: true }));
  };

  const tabs = [
    { id: "explorer" as const, fr: "Explorer", ar: "استكشاف", icon: Store },
    { id: "pourtoi" as const, fr: "Pour toi", ar: "لك", icon: Sparkles },
    { id: "trending" as const, fr: "Trending", ar: "الرائج", icon: TrendingUp },
  ];

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      {/* Titre + recherche */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-gasra-text tracking-tight">
          {isAr ? `استكشف ${city}` : `Explorer ${city}`}
        </h1>
        <div className="relative">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gasra-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? "ابحث عن محل..." : "Rechercher un commerce..."}
            className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30"
          />
        </div>

        {/* Tendances */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gasra-text-secondary mb-2">
            <TrendingUp size={13} />
            <span>{isAr ? "الرائج" : "Tendances"}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TRENDS.map((t) => (
              <button
                key={t.tag}
                onClick={() => setQuery("")}
                className="shrink-0 px-3 py-1 rounded-full bg-gasra-accent/12 text-gasra-accent text-[11px] font-semibold whitespace-nowrap hover:bg-gasra-accent/20 transition-colors"
              >
                {t.tag} <span className="text-gasra-text-muted font-medium">({t.n})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Onglets Explorer / Pour toi / Trending */}
      <div className="explore-tabs relative grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative z-10 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
                active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="explore-tab"
                  className="explore-tab-pill absolute inset-0 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <Icon size={14} />
              <span>{isAr ? t.ar : t.fr}</span>
            </button>
          );
        })}
      </div>

      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                active ? "bg-gasra-accent text-gasra-on-accent" : "bg-gasra-surface text-gasra-text-secondary hover:text-gasra-text"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{isAr ? c.ar : c.fr}</span>
            </button>
          );
        })}
      </div>

      {/* Corps : liste + radar */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] items-start">
        {/* Radar (en premier sur téléphone) */}
        <div className="lg:order-2 lg:sticky lg:top-4 gasra-card-glass rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gasra-text">{isAr ? "رادار الحومة" : "Radar de la Houma"}</h2>
              <p className="text-[11px] text-gasra-text-muted">
                {places.length} {isAr ? "أماكن حولك" : "lieux autour de toi"}
              </p>
            </div>
            <div className="flex p-0.5 rounded-xl bg-gasra-surface-subtle text-[11px] font-semibold">
              {[
                { id: "radar" as const, fr: "Radar", icon: Radar },
                { id: "plan" as const, fr: "Plan", icon: MapIcon },
              ].map((v) => {
                const Icon = v.icon;
                const active = view === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                      active ? "bg-gasra-surface text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"
                    }`}
                  >
                    <Icon size={12} />
                    {v.fr}
                  </button>
                );
              })}
            </div>
          </div>

          {view === "radar" ? (
            <HoumaRadar places={places} selectedId={selectedId} onSelect={onSelect} />
          ) : (
            <PlanMap places={places} selectedId={selectedId} onSelect={onSelect} />
          )}

          {/* Lieu sélectionné */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gasra-surface-subtle"
              >
                <span className="w-10 h-10 shrink-0 rounded-xl bg-gasra-accent/12 flex items-center justify-center text-lg">
                  {selected.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gasra-text truncate">{selected.name}</div>
                  <div className="text-[11px] text-gasra-text-muted">
                    {walkMin(selected.distance)} min · {fmtDist(selected.distance)}
                  </div>
                </div>
                <button
                  onClick={() => goRaniJay(selected)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    raniJay[selected.id] ? "bg-emerald-500 text-white" : "btn-gasra-primary"
                  }`}
                >
                  {raniJay[selected.id] ? <Check size={13} /> : <Navigation size={13} />}
                  {raniJay[selected.id] ? (isAr ? "تم" : "Signalé") : isAr ? "راني جاي" : "Rani jay"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Liste des commerces */}
        <div className="lg:order-1 space-y-2.5">
          <AnimatePresence initial={false}>
            {places.map((p, i) => {
              const active = p.id === selectedId;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: i * 0.02 }}
                  onClick={() => setSelectedId(p.id)}
                  onMouseEnter={() => setSelectedId(p.id)}
                  className={`explore-item group flex items-center gap-4 p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface cursor-pointer transition-colors ${
                    active ? "is-active" : ""
                  }`}
                >
                  <span className="w-12 h-12 shrink-0 rounded-xl bg-gasra-accent/12 flex items-center justify-center text-xl">
                    {p.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-gasra-text truncate">{p.name}</span>
                      {p.deal && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gasra-accent text-gasra-on-accent">
                          {p.deal}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gasra-text-muted mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {p.quartier}
                      </span>
                      <span>·</span>
                      <span>{fmtDist(p.distance)}</span>
                      <span className="hidden sm:flex items-center gap-0.5">
                        · <Star size={10} /> {p.rating}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/commerce"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 p-2 rounded-xl text-gasra-text-muted hover:text-gasra-accent hover:bg-gasra-accent/10 transition-colors"
                    aria-label="Voir la fiche"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {places.length === 0 && (
            <div className="text-center text-sm text-gasra-text-muted py-10">
              {isAr ? "لا توجد نتائج" : "Aucun commerce ne correspond à ta recherche."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
