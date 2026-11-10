import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, UserPen, Users, Target, Building2, Store, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useSocial } from "../../hooks/useSocial";

/** Parcours de bienvenue d'un nouveau compte : premières actions suggérées. */
export const WelcomeCard: React.FC<{ name: string }> = ({ name }) => {
  const { user } = useApp();
  const social = useSocial();
  const steps = [
    { done: !!(user.bio && (user.interests?.length || 0) > 0), label: "Complète ton profil et tes centres d'intérêt", to: "/profil/modifier", icon: UserPen, pts: 20 },
    { done: social.friends.length + social.sent.length > 0, label: "Ajoute tes premiers amis", to: "/amis", icon: Users, pts: 10 },
    { done: false, label: "Suis les pages de ta commune", to: "/pages", icon: Building2, pts: 10 },
    { done: false, label: "Rejoins ta première mission", to: "/missions", icon: Target, pts: 50 },
    { done: false, label: "Ouvre ta boutique (optionnel)", to: "/marketplace", icon: Store, pts: 30 },
  ];
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gasra-card-glass rounded-3xl p-4 sm:p-5 space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 shrink-0 rounded-2xl bg-gasra-accent/12 flex items-center justify-center">
          <Sparkles size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-gasra-text">Bienvenue sur Gasra, {name} 👋</h2>
          <p className="text-sm text-gasra-text-secondary">Voici 5 étapes pour bien démarrer dans ta houma et gagner tes premiers points.</p>
        </div>
        <span className="shrink-0 font-mono text-sm font-bold text-gasra-accent">
          {done}/{steps.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gasra-surface-subtle overflow-hidden">
        <motion.div className="h-full rounded-full bg-gasra-accent" initial={{ width: 0 }} animate={{ width: `${Math.max(4, pct)}%` }} transition={{ duration: 0.8 }} />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to} className={`welcome-step flex items-center gap-3 p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface ${s.done ? "is-done" : ""}`}>
              <Icon size={17} />
              <span className={`flex-1 min-w-0 text-sm ${s.done ? "line-through text-gasra-text-muted" : "text-gasra-text"}`}>{s.label}</span>
              {s.done ? <CheckCircle2 size={16} /> : <span className="text-[11px] font-semibold text-gasra-accent whitespace-nowrap">+{s.pts} pts</span>}
              {!s.done && <ChevronRight size={15} />}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
