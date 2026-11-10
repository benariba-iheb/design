import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Wallet,
  History,
  Receipt,
  Download,
  TrendingUp,
  Crown,
  Store,
  ShieldCheck,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  X,
  Plus,
  FileDown,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type Tab = "wallet" | "historique" | "factures" | "retraits";

const TRANSACTIONS = [
  { id: "tx-1", titleFr: "Commission Bon Sandwicherie El Forno", titleAr: "عمولة بون مطعم الفرنو", date: "Aujourd'hui · 14:20", amountDA: 360, type: "commission" },
  { id: "tx-2", titleFr: "9ahwa Tal3a reçue de Karim B.", titleAr: "قهوة من كريم ب.", date: "Hier · 18:45", amountDA: 100, type: "tip" },
  { id: "tx-3", titleFr: "Conversion hebdomadaire des points (Wilaya 16)", titleAr: "تحويل نقاط الأسبوع (ولاية 16)", date: "01 Nov · 09:00", amountDA: 720, type: "conversion" },
  { id: "tx-4", titleFr: "Retrait vers carte Edahabia", titleAr: "سحب نحو البطاقة الذهبية", date: "28 Oct · 11:15", amountDA: -2000, type: "withdrawal" },
  { id: "tx-5", titleFr: "Abonnement Gasra Pro — Octobre", titleAr: "اشتراك قصرة برو — أكتوبر", date: "01 Oct · 08:00", amountDA: -490, type: "subscription" },
  { id: "tx-6", titleFr: "Commission Bon Café des Frères", titleAr: "عمولة بون مقهى الإخوة", date: "27 Sep · 17:30", amountDA: 240, type: "commission" },
];

const INVOICES = [
  { id: "F-2026-011", label: "Abonnement Gasra Pro", date: "01 Nov 2026", amountDA: 490, status: "Payée" },
  { id: "F-2026-010", label: "Abonnement Gasra Pro", date: "01 Oct 2026", amountDA: 490, status: "Payée" },
  { id: "F-2026-009", label: "Boost annonce Marketplace (7 jours)", date: "14 Sep 2026", amountDA: 300, status: "Payée" },
];

const METHODS = [
  { id: "cib", name: "Carte CIB", sub: "Cartes bancaires algériennes via SATIM", emoji: "💳" },
  { id: "edahabia", name: "Carte Edahabia", sub: "Algérie Poste — la plus utilisée", emoji: "🟡" },
  { id: "baridimob", name: "BaridiMob", sub: "Paiement mobile Algérie Poste", emoji: "📱" },
  { id: "mobile", name: "Paiement mobile", sub: "Flexy et opérateurs mobiles", emoji: "📲" },
  { id: "agence", name: "Agence partenaire", sub: "Paiement dans une agence locale", emoji: "🏢" },
  { id: "cash", name: "Espèces", sub: "Cash validé en agence partenaire", emoji: "💵" },
];

const SECURITY = [
  "Chiffrement SSL/TLS sur toutes les transactions",
  "Jetons sécurisés — aucune donnée de carte stockée",
  "Paiements Marketplace protégés par séquestre",
  "Limite de 200 000 DA par transaction",
  "Détection automatique des fraudes",
];

const fmt = (n: number) => `${Math.abs(n).toLocaleString("fr-FR")} DA`;

export const ScreenWallet: React.FC = () => {
  const { language, user, convertPointsToDA, withdrawToEdahabia } = useApp();
  const isAr = language === "ar";
  const [tab, setTab] = useState<Tab>("wallet");
  const TX = user.isNew ? [] : TRANSACTIONS;
  const INV = user.isNew ? [] : INVOICES;
  const [filter, setFilter] = useState<"tout" | "in" | "out">("tout");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState(2000);
  const [method, setMethod] = useState<"edahabia" | "baridimob" | "cash">("edahabia");
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  };

  const convert = () => {
    if (user.points <= 0) return;
    convertPointsToDA();
    flash(isAr ? "تم تحويل النقاط !" : "Points convertis dans ton portefeuille !");
  };

  const withdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawToEdahabia(amount)) {
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setWithdrawOpen(false);
      }, 1800);
    }
  };

  const tabs: { id: Tab; fr: string; ar: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "wallet", fr: "Wallet", ar: "المحفظة", icon: Wallet },
    { id: "historique", fr: "Historique", ar: "السجل", icon: History },
    { id: "factures", fr: "Factures", ar: "الفواتير", icon: Receipt },
    { id: "retraits", fr: "Retraits", ar: "السحوبات", icon: Download },
  ];

  const TxRow = ({ t }: { t: (typeof TRANSACTIONS)[number] }) => {
    const plus = t.amountDA > 0;
    return (
      <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gasra-surface-subtle transition-colors">
        <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${plus ? "tx-in" : "tx-out"}`}>
          {plus ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gasra-text truncate">{isAr ? t.titleAr : t.titleFr}</span>
          <span className="block text-[11px] text-gasra-text-muted">{t.date}</span>
        </span>
        <span className={`shrink-0 font-mono font-bold text-sm ${plus ? "text-emerald-400" : "text-gasra-text"}`}>
          {plus ? "+" : "−"}
          {fmt(t.amountDA)}
        </span>
      </div>
    );
  };

  const withdrawForm = (
    <form onSubmit={withdraw} className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "edahabia" as const, label: "Edahabia", emoji: "🟡" },
          { id: "baridimob" as const, label: "BaridiMob", emoji: "📱" },
          { id: "cash" as const, label: "Agence", emoji: "🏢" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`p-3 rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 border transition-colors ${method === m.id ? "border-gasra-accent bg-gasra-accent/12 text-gasra-text" : "border-gasra-surface-border bg-gasra-surface text-gasra-text-secondary"}`}
          >
            <span className="text-lg">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-gasra-text-secondary">{isAr ? "المبلغ (دج)" : "Montant (DA)"}</label>
        <input type="number" min={500} max={user.walletBalanceDA} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-lg font-mono font-bold text-gasra-text outline-none focus:ring-2 focus:ring-gasra-accent/30" />
        <div className="flex gap-2 mt-2">
          {[1000, 2000, user.walletBalanceDA].map((v) => (
            <button key={v} type="button" onClick={() => setAmount(v)} className="px-3 py-1 rounded-full bg-gasra-surface-subtle text-xs text-gasra-text-secondary hover:text-gasra-text">
              {v === user.walletBalanceDA ? "Tout" : fmt(v)}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={amount <= 0 || amount > user.walletBalanceDA} className="w-full py-3 rounded-2xl btn-gasra-primary text-sm disabled:opacity-40">
        {isAr ? `تأكيد سحب ${amount} دج` : `Confirmer le retrait de ${fmt(amount)}`}
      </button>
      <p className="text-[11px] text-gasra-text-muted text-center">{isAr ? "يصل خلال 24 ساعة" : "Versement sous 24 h · sans frais au-dessus de 1 000 DA"}</p>
    </form>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-5 space-y-5">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-gasra-text tracking-tight flex items-center gap-2">💰 {isAr ? "المدفوعات" : "Paiements"}</h1>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`relative shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text bg-gasra-surface"}`}>
                {active && <motion.span layoutId="wallet-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                <Icon size={15} />
                {isAr ? t.ar : t.fr}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">
          {/* ================= WALLET ================= */}
          {tab === "wallet" && (
            <>
              {/* Solde */}
              <div className="wallet-hero relative overflow-hidden rounded-3xl p-5 sm:p-6">
                <span className="wallet-hero-orb absolute -top-16 -right-16 w-56 h-56 rounded-full" />
                <div className="relative flex items-center gap-2 text-sm font-semibold opacity-80">
                  <Wallet size={17} /> {isAr ? "محفظة قصرة" : "Portefeuille Gasra"}
                </div>
                <div className="relative mt-2 flex items-baseline gap-2">
                  <motion.span key={user.walletBalanceDA} initial={{ scale: 1.08 }} animate={{ scale: 1 }} className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                    {user.walletBalanceDA.toLocaleString("fr-FR")}
                  </motion.span>
                  <span className="text-lg font-bold">DA</span>
                </div>
                <div className="relative text-xs opacity-75 mt-1">{isAr ? "مربوطة بالبطاقة الذهبية وبريدي موب" : "Connecté à Edahabia & BaridiMob"}</div>
                <div className="relative flex flex-wrap gap-2 mt-5">
                  <button onClick={() => setTab("historique")} className="wallet-hero-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold">
                    <TrendingUp size={16} /> {isAr ? "التفاصيل" : "Détails"}
                  </button>
                  <button onClick={() => setWithdrawOpen(true)} className="wallet-hero-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold">
                    <Download size={16} /> {isAr ? "سحب" : "Retirer"}
                  </button>
                  <button onClick={() => flash(isAr ? "قريباً" : "Recharge : bientôt disponible")} className="wallet-hero-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold">
                    <Plus size={16} /> {isAr ? "شحن" : "Recharger"}
                  </button>
                </div>
              </div>

              {/* Cagnotte points */}
              <div className="gasra-card-glass rounded-3xl p-4 flex items-center gap-3">
                <span className="w-11 h-11 shrink-0 rounded-xl bg-amber-400/15 flex items-center justify-center">
                  <Coins size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-gasra-text">{isAr ? "كاش نقاط المساهمين" : "Cagnotte points contributeur"}</div>
                  <div className="text-xs text-gasra-text-muted">
                    <b className="text-gasra-text font-mono">{user.points} pts</b> · {isAr ? "ولاية الجزائر · ×1.5" : `Wilaya ${user.originWilayaCode} · valeur ×1.5`}
                  </div>
                </div>
                <button onClick={convert} disabled={user.points <= 0} className="shrink-0 px-3.5 py-2 rounded-xl btn-gasra-primary text-xs disabled:opacity-40">
                  {isAr ? "حوّل" : "Convertir en DA"}
                </button>
              </div>

              {/* Accès rapides */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: isAr ? "الاشتراك" : "Abonnement", icon: Crown, to: "/abonnements" },
                  { label: "Marketplace", icon: Store, to: "/marketplace" },
                  { label: isAr ? "السجل" : "Historique", icon: History, onClick: () => setTab("historique") },
                  { label: isAr ? "الفواتير" : "Factures", icon: Receipt, onClick: () => setTab("factures") },
                ].map((a) => {
                  const Icon = a.icon;
                  const inner = (
                    <>
                      <Icon size={20} />
                      <span className="text-[11px] font-semibold text-gasra-text-secondary">{a.label}</span>
                    </>
                  );
                  const cls = "wallet-quick flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface";
                  return a.to ? (
                    <Link key={a.label} to={a.to} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <button key={a.label} onClick={a.onClick} className={cls}>
                      {inner}
                    </button>
                  );
                })}
              </div>

              {/* Moyens de paiement */}
              <section>
                <h2 className="text-base font-bold text-gasra-text mb-2.5">{isAr ? "وسائل الدفع المقبولة" : "Moyens de paiement acceptés"}</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {METHODS.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                      <span className="w-10 h-10 shrink-0 rounded-xl bg-gasra-surface-subtle flex items-center justify-center text-lg">{m.emoji}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-gasra-text">{m.name}</span>
                        <span className="block text-[11px] text-gasra-text-muted">{m.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Transactions récentes */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-gasra-text">{isAr ? "آخر العمليات" : "Transactions récentes"}</h2>
                  <button onClick={() => setTab("historique")} className="flex items-center gap-0.5 text-sm font-semibold text-gasra-accent">
                    {isAr ? "عرض الكل" : "Tout voir"} <ChevronRight size={15} />
                  </button>
                </div>
                <div className="gasra-card-glass rounded-3xl p-2">
                  {TX.slice(0, 3).map((t) => (
                    <TxRow key={t.id} t={t} />
                  ))}
                  {TX.length === 0 && (
                    <div className="py-8 flex flex-col items-center gap-2 text-sm text-gasra-text-muted">
                      <History size={26} /> {isAr ? "لا توجد عمليات بعد" : "Aucune transaction pour le moment"}
                    </div>
                  )}
                </div>
              </section>

              {/* Sécurité */}
              <section className="gasra-card-glass rounded-3xl p-5">
                <h2 className="flex items-center gap-2 font-bold text-gasra-text mb-3">
                  <ShieldCheck size={19} /> {isAr ? "أمان المدفوعات" : "Sécurité des paiements"}
                </h2>
                <ul className="space-y-2">
                  {SECURITY.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-sm text-gasra-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-gasra-accent shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {/* ================= HISTORIQUE ================= */}
          {tab === "historique" && (
            <>
              <div className="flex gap-2">
                {[
                  { id: "tout" as const, fr: "Tout" },
                  { id: "in" as const, fr: "Entrées" },
                  { id: "out" as const, fr: "Sorties" },
                ].map((f) => (
                  <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${filter === f.id ? "bg-gasra-accent text-gasra-on-accent" : "bg-gasra-surface text-gasra-text-secondary"}`}>
                    {f.fr}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                  <div className="text-[11px] text-gasra-text-muted">Gagné ce mois</div>
                  <div className="font-mono font-bold text-lg text-emerald-400">+{fmt(user.isNew ? 0 : 1420)}</div>
                </div>
                <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface">
                  <div className="text-[11px] text-gasra-text-muted">Retiré ce mois</div>
                  <div className="font-mono font-bold text-lg text-gasra-text">−{fmt(user.isNew ? 0 : 2000)}</div>
                </div>
              </div>
              <div className="gasra-card-glass rounded-3xl p-2">
                {TX.filter((t) => filter === "tout" || (filter === "in" ? t.amountDA > 0 : t.amountDA < 0)).map((t) => (
                  <TxRow key={t.id} t={t} />
                ))}
              </div>
            </>
          )}

          {/* ================= FACTURES ================= */}
          {tab === "factures" && (
            <>
              <div className="gasra-card-glass rounded-3xl p-4 flex items-center gap-3">
                <span className="w-11 h-11 shrink-0 rounded-xl bg-amber-400/15 flex items-center justify-center">
                  <Crown size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-gasra-text">{user.plan === "influenceur" ? "Influenceur Certifié" : user.plan === "premium" ? "Premium" : "Gratuit"}</div>
                  <div className="text-xs text-gasra-text-muted">{user.plan === "influenceur" ? "3 000 DA / mois · prochain prélèvement le 01 Déc" : user.plan === "premium" ? "800 DA / mois" : "Passe à Premium pour débloquer plus d'avantages"}</div>
                </div>
                <Link to="/abonnements" className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gasra-accent/15 text-gasra-accent">{user.plan === "gratuit" ? "Changer" : "Gérer"}</Link>
              </div>
              <div className="gasra-card-glass rounded-3xl p-2">
                {INV.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gasra-surface-subtle transition-colors">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-gasra-surface-subtle flex items-center justify-center">
                      <Receipt size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gasra-text truncate">{f.label}</span>
                      <span className="block text-[11px] text-gasra-text-muted">
                        {f.id} · {f.date} · {f.status}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-sm text-gasra-text">{fmt(f.amountDA)}</span>
                    <button onClick={() => flash(`Facture ${f.id} téléchargée (démo)`)} className="p-2 rounded-xl hover:bg-gasra-accent/12" aria-label="Télécharger">
                      <FileDown size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= RETRAITS ================= */}
          {tab === "retraits" && (
            <>
              <div className="gasra-card-glass rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gasra-text">{isAr ? "سحب رصيد" : "Nouveau retrait"}</h2>
                  <span className="text-xs text-gasra-text-muted">
                    Solde : <b className="text-gasra-text font-mono">{fmt(user.walletBalanceDA)}</b>
                  </span>
                </div>
                {done ? (
                  <div className="py-6 text-center text-sm text-emerald-400 flex flex-col items-center gap-2">
                    <CheckCircle2 size={30} /> {isAr ? "تم إرسال الطلب !" : "Demande de virement envoyée !"}
                  </div>
                ) : (
                  withdrawForm
                )}
              </div>
              <div className="gasra-card-glass rounded-3xl p-2">
                {TX.filter((t) => t.type === "withdrawal").map((t) => (
                  <TxRow key={t.id} t={t} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Fenêtre de retrait (depuis le solde) */}
      <AnimatePresence>
        {withdrawOpen && (
          <motion.div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setWithdrawOpen(false)} />
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} className="relative w-full max-w-md gasra-card-glass rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gasra-text">{isAr ? "سحب بالدينار" : "Retrait en dinars"}</h3>
                <button onClick={() => setWithdrawOpen(false)} className="p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>
              {done ? (
                <div className="py-6 text-center text-sm text-emerald-400 flex flex-col items-center gap-2">
                  <CheckCircle2 size={30} /> {isAr ? "تم إرسال الطلب !" : "Demande de virement envoyée !"}
                </div>
              ) : (
                withdrawForm
              )}
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
