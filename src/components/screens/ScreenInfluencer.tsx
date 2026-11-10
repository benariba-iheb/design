import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Target, Trophy, GraduationCap, Award, Coins, BarChart3, PlayCircle, CheckCircle2, Lock, Eye, Heart, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TIERS = [
  { name: "Explorer", min: 0 },
  { name: "Creator", min: 50 },
  { name: "Influencer", min: 200 },
  { name: "Ambassadeur", min: 500 },
];

const LESSONS = [
  { t: "Filmer un bon plan en 20 secondes", d: "6 min", done: true },
  { t: "Écrire une légende qui donne envie", d: "4 min", done: true },
  { t: "Lancer un live ELLAMA réussi", d: "8 min", done: false },
  { t: "Négocier une mission avec un commerce", d: "7 min", done: false },
];

export const ScreenInfluencer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const isNew = !!user.isNew;
  const certified = !!user.certified;
  const pts = user.points;
  const [tab, setTab] = useState<"missions" | "revenus" | "stats" | "academy">("missions");

  const tierIdx = TIERS.reduce((i, t, k) => (pts >= t.min ? k : i), 0);
  const tier = TIERS[tierIdx];
  const next = TIERS[tierIdx + 1];
  const pct = next ? Math.round(((pts - tier.min) / (next.min - tier.min)) * 100) : 100;
  const lessonsDone = isNew ? 0 : LESSONS.filter((l) => l.done).length;

  const stats = [
    { icon: Target, value: isNew ? 0 : 14, label: "Missions" },
    { icon: Trophy, value: pts, label: "pts" },
    { icon: GraduationCap, value: lessonsDone, label: "Leçons" },
  ];

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="flex items-center gap-3">
        <span className="w-14 h-14 rounded-2xl bg-gasra-accent/12 flex items-center justify-center">
          <ShieldCheck size={26} />
        </span>
        <div>
          <h1 className="text-2xl font-black text-gasra-text tracking-tight">Espace Influenceur</h1>
          {certified ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent">
              <ShieldCheck size={12} /> Certifié
            </span>
          ) : (
            <span className="text-xs text-gasra-text-muted">Non certifié</span>
          )}
        </div>
      </div>

      {!certified && (
        <div className="gasra-card-glass rounded-3xl p-4 flex flex-wrap items-center gap-3">
          <Lock size={20} />
          <div className="flex-1 min-w-[200px] text-sm">
            <b className="text-gasra-text">Deviens Influenceur Certifié</b>
            <span className="block text-xs text-gasra-text-muted">Badge visible, missions exclusives mieux payées et Gasra Academy complète.</span>
          </div>
          <Link to="/abonnements" className="px-4 py-2 rounded-xl btn-gasra-primary text-sm">
            Voir l'offre
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="py-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface flex flex-col items-center gap-1">
              <Icon size={20} />
              <span className="text-xl font-black font-mono text-gasra-text">{s.value.toLocaleString("fr-FR")}</span>
              <span className="text-[11px] text-gasra-text-muted">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Parcours de certification */}
      <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface space-y-3">
        <div className="flex items-center gap-2 font-bold text-gasra-text">
          <Award size={18} /> Parcours de certification
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gasra-text-secondary">
            Niveau actuel : <b className="text-gasra-text">{tier.name}</b>
          </span>
          <span className="font-mono font-bold text-gasra-accent">{pts} pts</span>
        </div>
        <div className="h-2 rounded-full bg-gasra-surface-subtle overflow-hidden">
          <motion.div className="influence-bar h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.max(3, pct)}%` }} transition={{ duration: 1 }} />
        </div>
        <p className="text-xs text-gasra-text-muted">{next ? `Prochain palier : ${next.name} à ${next.min} pts (${next.min - pts} restants)` : "Palier maximum atteint 👑"}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIERS.map((t, i) => (
            <div key={t.name} className={`journey-step py-2.5 rounded-xl text-center ${i < tierIdx ? "done" : i === tierIdx ? "current" : "todo"}`}>
              <div className="text-xs font-bold">{t.name}</div>
              <div className="text-[10px] opacity-70">{t.min}+</div>
            </div>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div className="grid grid-cols-4 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
        {(["missions", "revenus", "stats", "academy"] as const).map((t) => {
          const active = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} className={`relative z-10 py-2 text-sm font-semibold transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
              {active && <motion.span layoutId="infl-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              {t === "missions" ? "Missions" : t === "revenus" ? "Revenus" : t === "stats" ? "Stats" : "Academy"}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === "missions" &&
            (isNew ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-gasra-text-muted">Aucune mission pour le moment</p>
                <Link to="/missions" className="px-4 py-2 rounded-xl border border-gasra-surface-border bg-gasra-surface text-sm font-semibold text-gasra-text">
                  Voir les missions
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { t: "Vidéo 20 s : le four à bois", s: "Sandwicherie El Forno", r: "+300 DA", st: "En cours" },
                  { t: "Challenge du match de la houma", s: "Houma Sport", r: "+1 000 DA", st: "Exclusive" },
                  { t: "Story Café des Frères", s: "Café des Frères", r: "+100 pts", st: "Terminée" },
                ].map((m) => (
                  <div key={m.t} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                    <Target size={18} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-gasra-text truncate">{m.t}</span>
                      <span className="block text-[11px] text-gasra-text-muted">{m.s}</span>
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gasra-surface-subtle text-gasra-text-secondary">{m.st}</span>
                    <span className="font-mono text-sm font-bold text-gasra-accent">{m.r}</span>
                  </div>
                ))}
              </div>
            ))}

          {tab === "revenus" && (
            <div className="grid sm:grid-cols-3 gap-2.5">
              {[
                { l: "Ce mois", v: isNew ? 0 : 12000 },
                { l: "En attente", v: isNew ? 0 : 1800 },
                { l: "Total gagné", v: isNew ? 0 : 86400 },
              ].map((r) => (
                <div key={r.l} className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                  <div className="flex items-center gap-1.5 text-[11px] text-gasra-text-muted">
                    <Coins size={13} /> {r.l}
                  </div>
                  <div className="font-mono font-bold text-lg text-gasra-text mt-1">{r.v.toLocaleString("fr-FR")} DA</div>
                </div>
              ))}
              <Link to="/portefeuille" className="sm:col-span-3 text-center text-sm font-semibold text-gasra-accent py-2">
                Voir le portefeuille →
              </Link>
            </div>
          )}

          {tab === "stats" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { icon: Eye, l: "Vues 30 j", v: isNew ? 0 : 48200 },
                { icon: Heart, l: "Réactions", v: isNew ? 0 : 6310 },
                { icon: Users, l: "Abonnés", v: user.followers ?? 0 },
                { icon: BarChart3, l: "Taux d'engagement", v: isNew ? 0 : 7.4, pct: true },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.l} className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                    <div className="flex items-center gap-1.5 text-[11px] text-gasra-text-muted">
                      <Icon size={13} /> {s.l}
                    </div>
                    <div className="font-mono font-bold text-lg text-gasra-text mt-1">
                      {s.v.toLocaleString("fr-FR")}
                      {s.pct ? " %" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "academy" && (
            <div className="space-y-2.5">
              {LESSONS.map((l, i) => {
                const done = !isNew && l.done;
                const locked = !certified && i >= 2;
                return (
                  <div key={l.t} className={`flex items-center gap-3 p-3.5 rounded-2xl border border-gasra-surface-border bg-gasra-surface ${locked ? "opacity-60" : ""}`}>
                    {done ? <CheckCircle2 size={19} /> : locked ? <Lock size={18} /> : <PlayCircle size={19} />}
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-gasra-text">{l.t}</span>
                      <span className="block text-[11px] text-gasra-text-muted">{l.d}{locked ? " · réservé aux certifiés" : ""}</span>
                    </span>
                    {done && <span className="text-[11px] font-semibold text-emerald-400">Terminée</span>}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
