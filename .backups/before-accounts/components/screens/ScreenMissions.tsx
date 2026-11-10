import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  Trophy,
  Clock,
  TrendingUp,
  Camera,
  Video,
  Share2,
  Star,
  MapPin,
  Compass,
  Gift,
  Flame,
  Megaphone,
  Users,
  Ticket,
  Coins,
  CheckCircle2,
  Upload,
  X,
  ThumbsUp,
  ThumbsDown,
  Timer,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type MType = "photo" | "video" | "story" | "avis" | "visite" | "decouverte" | "promotion" | "challenge" | "citoyen";
type Reward = { kind: "reduction" | "points" | "cash"; value: number };

interface Mission {
  id: string;
  type: MType;
  emoji: string;
  title: string;
  sponsor: string;
  desc: string;
  reward: Reward;
  pts: number;
  wilaya: string;
  total: number;
  taken: number;
  timeLimit?: string;
  berrani?: boolean;
  status: "available" | "in_progress" | "completed";
}

const TYPES: Record<MType, { fr: string; icon: React.ComponentType<{ size?: number }>; color: string; emoji: string }> = {
  photo: { fr: "Poster une photo", icon: Camera, color: "#3B82F6", emoji: "📷" },
  video: { fr: "Poster une vidéo", icon: Video, color: "#F0207A", emoji: "🎬" },
  story: { fr: "Poster une story", icon: Share2, color: "#D946EF", emoji: "📱" },
  avis: { fr: "Laisser un avis", icon: Star, color: "#F59E0B", emoji: "⭐" },
  visite: { fr: "Visiter le commerce", icon: MapPin, color: "#EF4444", emoji: "📍" },
  decouverte: { fr: "Découverte", icon: Compass, color: "#06B6D4", emoji: "🔍" },
  promotion: { fr: "Promotion", icon: Gift, color: "#22C55E", emoji: "🎁" },
  challenge: { fr: "Challenge", icon: Flame, color: "#FF8552", emoji: "🏆" },
  citoyen: { fr: "Mission citoyenne", icon: Megaphone, color: "#2fddcb", emoji: "🤝" },
};

const INITIAL: Mission[] = [
  { id: "m1", type: "photo", emoji: "📷", title: "Photo ton burger !", sponsor: "Burger House Bab Ezzouar", desc: "Prends une photo appétissante de ton burger et partage-la sur Gasra avec le bon du jour.", reward: { kind: "reduction", value: 200 }, pts: 50, wilaya: "Alger", total: 30, taken: 8, timeLimit: "Reste 3 jours", status: "available" },
  { id: "m2", type: "story", emoji: "☕", title: "Story Café des Frères", sponsor: "Café des Frères", desc: "Poste une story depuis la terrasse et mentionne le café.", reward: { kind: "points", value: 100 }, pts: 60, wilaya: "Alger", total: 50, taken: 0, status: "available" },
  { id: "m3", type: "avis", emoji: "⭐", title: "Avis Dar El Bahdja", sponsor: "Dar El Bahdja", desc: "Écris un avis détaillé sur ton expérience culinaire (plat, service, prix).", reward: { kind: "reduction", value: 500 }, pts: 80, wilaya: "Alger", total: 20, taken: 11, status: "available" },
  { id: "m4", type: "citoyen", emoji: "🧺", title: "Photographier les tarifs de la nouvelle laverie", sponsor: "Mission de quartier", desc: "Vérifie sur place l'ouverture et prends une photo nette du tableau des tarifs pour informer les habitants.", reward: { kind: "cash", value: 180 }, pts: 120, wilaya: "Alger", total: 5, taken: 2, timeLimit: "Expire aujourd'hui à 18h", status: "available" },
  { id: "m5", type: "citoyen", emoji: "💡", title: "Signaler le candélabre du rond-point 8 Mai", sponsor: "APC Bab Ezzouar", desc: "Photo + localisation exacte du candélabre défaillant. Transmis directement à la commune.", reward: { kind: "cash", value: 120 }, pts: 80, wilaya: "Alger", total: 10, taken: 6, timeLimit: "Urgent", status: "available" },
  { id: "m6", type: "video", emoji: "🎬", title: "Vidéo 20 s : le four à bois", sponsor: "Sandwicherie El Forno", desc: "Filme 20 secondes du nouveau four à bois et partage-la avec le bon -30 %.", reward: { kind: "cash", value: 300 }, pts: 90, wilaya: "Alger", total: 15, taken: 9, status: "available" },
  { id: "m7", type: "visite", emoji: "📍", title: "Passe chez TechZone DZ", sponsor: "TechZone DZ", desc: "Rends-toi en boutique et scanne le QR Gasra à la caisse.", reward: { kind: "reduction", value: 300 }, pts: 40, wilaya: "Alger", total: 40, taken: 17, status: "available" },
  { id: "m8", type: "decouverte", emoji: "🔍", title: "Explore Oran en Berrani", sponsor: "Office du Tourisme", desc: "Visite 3 lieux partenaires à Oran. Ta Prime Berrani s'applique.", reward: { kind: "points", value: 250 }, pts: 150, wilaya: "Oran", total: 100, taken: 42, berrani: true, status: "available" },
  { id: "m9", type: "promotion", emoji: "🎁", title: "Partage le bon -15 % Lalla Beauté", sponsor: "Lalla Beauté", desc: "Partage le bon à 3 amies. Commission dès qu'une cliente le scanne au salon.", reward: { kind: "cash", value: 150 }, pts: 50, wilaya: "Tlemcen", total: 25, taken: 4, status: "available" },
  { id: "m10", type: "challenge", emoji: "⚽", title: "Challenge du match de la houma", sponsor: "Houma Sport", desc: "Meilleure photo du tournoi de vendredi, votée par la communauté.", reward: { kind: "reduction", value: 1000 }, pts: 200, wilaya: "Alger", total: 60, taken: 23, timeLimit: "Vendredi", status: "available" },
  { id: "m11", type: "citoyen", emoji: "💊", title: "Recenser les pharmacies de garde du weekend", sponsor: "Mission solidaire", desc: "Vérifie 2 pharmacies de garde et confirme leurs horaires.", reward: { kind: "cash", value: 150 }, pts: 100, wilaya: "Alger", total: 8, taken: 8, status: "completed" },
];

const TO_VOTE = [
  { id: "v1", author: "Ines B.", mission: "Photo ton burger !", emoji: "🍔", caption: "Le double cheese avec la vue sur la cité 😍" },
  { id: "v2", author: "Samy H.", mission: "Challenge du match", emoji: "⚽", caption: "Le but de la victoire à la 89e !" },
  { id: "v3", author: "Leïla K.", mission: "Story Café des Frères", emoji: "☕", caption: "Qahwa et makrout en terrasse" },
];

const rewardLabel = (r: Reward) =>
  r.kind === "reduction" ? `${r.value} DA de réduction` : r.kind === "points" ? `${r.value} points` : `${r.value} DA`;

export const ScreenMissions: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const [missions, setMissions] = useState<Mission[]>(INITIAL);
  const [filter, setFilter] = useState<"toutes" | MType>("toutes");
  const [tab, setTab] = useState<"dispo" | "mes" | "voter">("dispo");
  const [proof, setProof] = useState<Mission | null>(null);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const [toast, setToast] = useState<string | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3200);
  };

  const done = missions.filter((m) => m.status === "completed");
  const ongoing = missions.filter((m) => m.status === "in_progress");
  const earned = done.reduce((n, m) => n + m.pts, 0) + Object.keys(votes).length * 5;

  const list = useMemo(() => {
    const base = tab === "mes" ? missions.filter((m) => m.status !== "available") : missions.filter((m) => m.status === "available");
    return filter === "toutes" ? base : base.filter((m) => m.type === filter);
  }, [missions, tab, filter]);

  const join = (id: string) => {
    setMissions((ms) => ms.map((m) => (m.id === id ? { ...m, status: "in_progress", taken: m.taken + 1 } : m)));
    flash("Mission rejointe ! Envoie ta preuve une fois terminée.");
  };
  const validate = (m: Mission) => {
    setMissions((ms) => ms.map((x) => (x.id === m.id ? { ...x, status: "completed" } : x)));
    setProof(null);
    flash(`Bravo ! +${m.pts} pts · ${rewardLabel(m.reward)}`);
  };

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gasra-text tracking-tight flex items-center gap-2">
          <Sparkles size={24} /> Missions
        </h1>
        <p className="text-sm text-gasra-text-muted mt-1">{isAr ? "أنجز المهام واربح المكافآت" : "Complète des missions pour ta houma et gagne des récompenses"}</p>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { icon: Trophy, value: done.length, label: "Réussies", cls: "text-amber-400" },
          { icon: Clock, value: ongoing.length, label: "En cours", cls: "text-orange-400" },
          { icon: TrendingUp, value: earned, label: "pts gagnés", cls: "text-gasra-accent" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`mission-stat py-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface flex flex-col items-center gap-1 ${s.cls}`}>
              <Icon size={20} />
              <motion.span key={s.value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-xl font-black font-mono text-gasra-text">
                {s.value}
              </motion.span>
              <span className="text-[11px] text-gasra-text-muted">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(["toutes", ...Object.keys(TYPES)] as ("toutes" | MType)[]).map((k) => {
          const active = filter === k;
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${active ? "bg-gasra-accent text-gasra-on-accent" : "bg-gasra-surface text-gasra-text-secondary hover:text-gasra-text border border-gasra-surface-border"}`}
            >
              <span>{k === "toutes" ? "🎯" : TYPES[k].emoji}</span>
              {k === "toutes" ? "Toutes" : TYPES[k].fr}
            </button>
          );
        })}
      </div>

      {/* Onglets */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
        {[
          { id: "dispo" as const, fr: "Disponibles" },
          { id: "mes" as const, fr: "Mes missions", n: ongoing.length },
          { id: "voter" as const, fr: "À voter", n: TO_VOTE.length - Object.keys(votes).length },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative z-10 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
              {active && <motion.span layoutId="missions-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              {t.fr}
              {!!t.n && t.n > 0 && <span className="text-[10px] font-bold px-1.5 rounded-full bg-gasra-accent/20 text-gasra-accent">{t.n}</span>}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
        {/* Liste */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tab !== "voter" &&
              list.map((m, i) => {
                const T = TYPES[m.type];
                const Icon = T.icon;
                const pct = Math.round((m.taken / m.total) * 100);
                const full = m.taken >= m.total && m.status === "available";
                return (
                  <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.03 }} className="mission-card rounded-2xl border border-gasra-surface-border bg-gasra-surface overflow-hidden" style={{ ["--mc" as any]: T.color }}>
                    {/* Bandeau type */}
                    <div className="mission-band flex items-center justify-between px-4 py-2 text-[11px] font-bold uppercase tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <Icon size={13} /> {T.fr}
                      </span>
                      <span className="flex items-center gap-2 normal-case font-semibold">
                        {m.berrani && <span className="px-2 py-0.5 rounded-full bg-[#FF8552]/20 text-[#FF8552]">Prime Berrani +50%</span>}
                        <span className="flex items-center gap-1 opacity-80">
                          <MapPin size={11} /> {m.wilaya}
                        </span>
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="mission-icon w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-xl">{m.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gasra-text leading-snug">{m.title}</h3>
                          <div className="text-xs font-semibold text-gasra-accent">{m.sponsor}</div>
                        </div>
                        <div className="shrink-0 text-end">
                          <span className={`mission-reward ${m.reward.kind} flex items-center justify-end gap-1 text-sm font-bold`}>
                            {m.reward.kind === "reduction" ? <Ticket size={15} /> : m.reward.kind === "points" ? <Trophy size={15} /> : <Coins size={15} />}
                            {rewardLabel(m.reward)}
                          </span>
                          {m.timeLimit && (
                            <span className="flex items-center justify-end gap-1 text-[11px] text-gasra-text-muted mt-0.5">
                              <Timer size={11} /> {m.timeLimit}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gasra-text-secondary">{m.desc}</p>
                      <div className="flex items-center gap-4 text-xs text-gasra-text-muted">
                        <span className="flex items-center gap-1">
                          <Trophy size={12} /> +{m.pts} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {m.taken}/{m.total}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gasra-surface-subtle overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gasra-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                      </div>
                      {m.status === "available" && (
                        <button disabled={full} onClick={() => join(m.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-gasra-primary text-sm disabled:opacity-40">
                          <Sparkles size={16} /> {full ? "Complet" : "Rejoindre la mission"}
                        </button>
                      )}
                      {m.status === "in_progress" && (
                        <button onClick={() => setProof(m)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gasra-accent/50 bg-gasra-accent/10 text-gasra-accent text-sm font-semibold">
                          <Upload size={16} /> Envoyer ma preuve
                        </button>
                      )}
                      {m.status === "completed" && (
                        <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/12 text-emerald-400 text-sm font-semibold">
                          <CheckCircle2 size={16} /> Mission accomplie et récompensée
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {tab !== "voter" && list.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gasra-surface-border py-12 text-center text-sm text-gasra-text-muted flex flex-col items-center gap-2">
              <Sparkles size={26} />
              {tab === "mes" ? "Tu n'as pas encore rejoint de mission." : "Aucune mission dans cette catégorie pour le moment."}
            </div>
          )}

          {/* À voter */}
          {tab === "voter" && (
            <div className="grid sm:grid-cols-2 gap-3">
              {TO_VOTE.map((v) => {
                const vote = votes[v.id];
                return (
                  <div key={v.id} className="rounded-2xl border border-gasra-surface-border bg-gasra-surface overflow-hidden">
                    <div className="aspect-[4/3] flex items-center justify-center text-6xl bg-gasra-surface-subtle">{v.emoji}</div>
                    <div className="p-3.5 space-y-2">
                      <div className="text-[11px] text-gasra-text-muted">
                        {v.author} · {v.mission}
                      </div>
                      <p className="text-sm text-gasra-text">{v.caption}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setVotes((s) => ({ ...s, [v.id]: "up" }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold ${vote === "up" ? "btn-gasra-primary" : "bg-gasra-surface-subtle text-gasra-text"}`}>
                          <ThumbsUp size={14} /> Valide
                        </button>
                        <button onClick={() => setVotes((s) => ({ ...s, [v.id]: "down" }))} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold ${vote === "down" ? "bg-red-500/20 text-red-400" : "bg-gasra-surface-subtle text-gasra-text"}`}>
                          <ThumbsDown size={14} /> Pas conforme
                        </button>
                      </div>
                      {vote && <div className="text-[11px] text-gasra-accent">+5 pts pour ton vote</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Héros du quartier */}
        <aside className="gasra-card-glass rounded-3xl p-4 space-y-3 lg:sticky lg:top-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} />
            <h2 className="font-bold text-gasra-text">Héros du quartier</h2>
          </div>
          <p className="text-[11px] text-gasra-text-muted -mt-2">Bab Ezzouar · ce mois-ci</p>
          {[
            { name: "Amine Rezgui", pts: "1 420 pts", reward: "+12 000 DA", medal: "🥇" },
            { name: "Ines Boudiaf", pts: "1 180 pts", reward: "+9 500 DA", medal: "🥈" },
            { name: "Samy Haddad", pts: "940 pts", reward: "+7 200 DA", medal: "🥉" },
          ].map((h) => (
            <div key={h.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-gasra-surface-subtle">
              <span className="text-2xl">{h.medal}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gasra-text truncate">{h.name}</span>
                <span className="block text-[11px] text-gasra-text-muted">{h.reward} gagnés</span>
              </span>
              <span className="font-mono text-xs font-bold text-gasra-accent">{h.pts}</span>
            </div>
          ))}
        </aside>
      </div>

      {/* Envoi de preuve */}
      <AnimatePresence>
        {proof && (
          <motion.div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setProof(null)} />
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} className="relative w-full max-w-md gasra-card-glass rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gasra-text">Validation de la preuve</h3>
                <button onClick={() => setProof(null)} className="p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gasra-text-secondary">{proof.title}</p>
              <div className="p-6 rounded-2xl border-2 border-dashed border-gasra-surface-border bg-gasra-surface flex flex-col items-center gap-1 text-center">
                <Camera size={26} />
                <span className="text-sm font-semibold text-gasra-text">Joindre une photo nette du lieu</span>
                <span className="text-[11px] text-gasra-text-muted">Elle sera vérifiée par la communauté (onglet « À voter »)</span>
              </div>
              <button onClick={() => validate(proof)} className="w-full py-3 rounded-2xl btn-gasra-primary text-sm">
                Valider et encaisser · {rewardLabel(proof.reward)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-24 lg:bottom-28 inset-x-0 z-[80] flex justify-center pointer-events-none">
            <span className="px-4 py-2.5 rounded-2xl gasra-card-glass text-sm text-gasra-text shadow-xl flex items-center gap-2">
              <CheckCircle2 size={16} /> {toast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
