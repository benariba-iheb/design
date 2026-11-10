import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Zap, Star, Crown, ShieldCheck, Check, X, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

type PlanId = "gratuit" | "premium" | "influenceur";

const PLANS: { id: PlanId; name: string; price: number; icon: React.ComponentType<{ size?: number }>; color: string; features: string[]; tag?: string }[] = [
  { id: "gratuit", name: "Gratuit", price: 0, icon: Star, color: "#9CA3AF", features: ["Poster du contenu", "Commenter et réagir", "Suivre des commerces et des pages", "Accès au fil d'actualité", "Missions de quartier"] },
  { id: "premium", name: "Premium", price: 800, icon: Crown, color: "#FBBF24", tag: "Populaire", features: ["Tout le Gratuit +", "Réductions exclusives chez les partenaires", "Statistiques avancées", "Badge Premium", "Boutique Premium (produits illimités)", "Support prioritaire"] },
  { id: "influenceur", name: "Influenceur Certifié", price: 3000, icon: ShieldCheck, color: "#2fddcb", features: ["Tout Premium +", "Badge Certifié visible", "Accès Gasra Academy", "Missions exclusives et mieux payées", "Analytics influenceur", "Priorité sur les missions", "Lives ELLAMA mis en avant"] },
];

export const ScreenSubscriptions: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useApp();
  const current = (user.plan || "gratuit") as PlanId;
  const [confirm, setConfirm] = useState<PlanId | null>(null);
  const [done, setDone] = useState(false);

  const target = PLANS.find((p) => p.id === confirm);
  const apply = () => {
    if (!confirm) return;
    updateUser({ plan: confirm, certified: confirm === "influenceur" ? true : user.certified && confirm !== "gratuit" });
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setConfirm(null);
    }, 1600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-5 space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="text-center space-y-2">
        <motion.span initial={{ scale: 0.6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} className="inline-flex w-14 h-14 rounded-2xl bg-gasra-accent/12 items-center justify-center">
          <Zap size={28} />
        </motion.span>
        <h1 className="text-3xl font-black tracking-tight text-gasra-text">Abonnements</h1>
        <p className="text-sm text-gasra-text-muted">Choisis le plan qui te convient</p>
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gasra-accent/12 text-gasra-accent">Plan actuel : {PLANS.find((p) => p.id === current)?.name}</span>
      </div>

      <div className="space-y-3">
        {PLANS.map((p, i) => {
          const Icon = p.icon;
          const active = p.id === current;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`plan-card relative rounded-3xl p-5 border ${active ? "is-active" : "border-gasra-surface-border bg-gasra-surface"}`}
              style={{ ["--pc" as any]: p.color }}
            >
              <div className="flex items-start gap-3">
                <span className="plan-icon w-11 h-11 shrink-0 rounded-xl flex items-center justify-center">
                  <Icon size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gasra-text">{p.name}</h2>
                    {p.tag && !active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400">{p.tag}</span>}
                  </div>
                  <div className="text-sm text-gasra-text-muted">{p.price ? `${p.price.toLocaleString("fr-FR")} DA / mois` : "Gratuit, pour toujours"}</div>
                </div>
                {active ? (
                  <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-gasra-accent/15 text-gasra-accent">Actif</span>
                ) : (
                  <button onClick={() => setConfirm(p.id)} className="shrink-0 px-4 py-2 rounded-xl btn-gasra-primary text-sm">
                    {PLANS.findIndex((x) => x.id === p.id) > PLANS.findIndex((x) => x.id === current) ? "Passer à ce plan" : "Choisir"}
                  </button>
                )}
              </div>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gasra-text-secondary">
                    <Check size={14} className="plan-check shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-gasra-text-muted">Paiement par CIB, Edahabia ou BaridiMob · sans engagement, résiliable à tout moment.</p>

      <AnimatePresence>
        {target && (
          <motion.div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setConfirm(null)} />
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} className="relative w-full max-w-sm gasra-card-glass rounded-3xl p-6 space-y-4 text-center">
              <button onClick={() => setConfirm(null)} className="absolute top-3 end-3 p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Fermer">
                <X size={17} />
              </button>
              {done ? (
                <div className="py-4 flex flex-col items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={36} />
                  <span className="font-bold">Plan {target.name} activé !</span>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gasra-text">Passer au plan {target.name}</h3>
                  <p className="text-sm text-gasra-text-secondary">
                    {target.price ? `${target.price.toLocaleString("fr-FR")} DA seront prélevés chaque mois (démo, aucun paiement réel).` : "Tu repasseras au plan Gratuit à la fin du mois en cours."}
                  </p>
                  <button onClick={apply} className="w-full py-3 rounded-2xl btn-gasra-primary text-sm">
                    Confirmer
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
