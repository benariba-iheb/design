import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Store, ExternalLink, Package, ShoppingCart, BarChart3, CheckCircle2, Plus, Trash2, Share2, Tag, Users, Crown, Settings, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { acctKey } from "../../data/accounts";

type Tab = "overview" | "produits" | "commandes" | "missions" | "partages" | "promotions" | "clients" | "abonnement" | "parametres";

interface Prod { id: string; shopId: string; key: string; name: string; priceDA: number; category: string; emoji: string }
interface ShopState { shop: { id: string; name: string; description: string; category: string; wilaya: string; rating: number; verified?: boolean; mine?: boolean }; products: Prod[] }

const ORDERS = [
  { id: "#1048", client: "Ines B.", product: "Écouteurs sans fil Pro", total: 5500, status: "À expédier", date: "Aujourd'hui · 10:12" },
  { id: "#1047", client: "Karim B.", product: "Montre connectée Sport", total: 8500, status: "En séquestre", date: "Hier · 19:40" },
  { id: "#1046", client: "Samy H.", product: "Chargeur rapide 33W", total: 2300, status: "Livrée", date: "07 Nov · 14:05" },
  { id: "#1045", client: "Leïla K.", product: "Batterie externe 20 000 mAh", total: 3900, status: "Livrée", date: "05 Nov · 11:30" },
];
const SHARES = [
  { who: "Ines Boudiaf", what: "Story · Écouteurs sans fil Pro", scans: 42, commission: 2520 },
  { who: "Samy Haddad", what: "Vidéo 20 s · Montre connectée", scans: 18, commission: 1440 },
];

const fmt = (n: number) => `${n.toLocaleString("fr-FR")} DA`;

export const ScreenShopManage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const KEY = acctKey("myShop");
  const [state, setState] = useState<ShopState | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  });
  const [tab, setTab] = useState<Tab>("overview");
  const [promo, setPromo] = useState({ active: true, value: 15 });
  const save = (s: ShopState) => {
    setState(s);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  };

  const hasActivity = !user.isNew && (state?.products.length || 0) > 0;
  const orders = hasActivity ? ORDERS : [];
  const ca = orders.reduce((n, o) => n + o.total, 0);
  const premium = user.plan !== "gratuit";

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = useMemo(
    () => [
      { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
      { id: "produits", label: "Produits", icon: Package },
      { id: "commandes", label: "Commandes", icon: ShoppingCart },
      { id: "missions", label: "Missions", icon: Sparkles },
      { id: "partages", label: "Partages", icon: Share2 },
      { id: "promotions", label: "Promotions", icon: Tag },
      { id: "clients", label: "Clients", icon: Users },
      { id: "abonnement", label: "Abonnement", icon: Crown },
      { id: "parametres", label: "Paramètres", icon: Settings },
    ],
    []
  );

  if (!state) {
    return (
      <div className="w-full max-w-2xl mx-auto p-3 sm:p-5 space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="gasra-card-glass rounded-3xl p-8 text-center space-y-3">
          <span className="inline-flex w-14 h-14 rounded-2xl bg-gasra-accent/12 items-center justify-center">
            <Store size={26} />
          </span>
          <h1 className="text-xl font-bold text-gasra-text">Tu n'as pas encore de boutique</h1>
          <p className="text-sm text-gasra-text-secondary">Sur Gasra, il faut une boutique pour vendre. Elle est gratuite et prête en une minute.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl btn-gasra-primary text-sm">
            <Plus size={16} /> Créer ma boutique
          </Link>
        </div>
      </div>
    );
  }

  const { shop, products } = state;
  const kpis = [
    { icon: Package, label: "Produits", value: String(products.length), sub: `${products.length} en stock` },
    { icon: ShoppingCart, label: "Commandes 30 j", value: String(orders.length), sub: `${orders.filter((o) => o.status === "À expédier").length} à expédier` },
    { icon: BarChart3, label: "CA 30 j", value: fmt(ca), sub: hasActivity ? "+18 % vs mois dernier" : "—" },
    { icon: CheckCircle2, label: "Missions restantes", value: premium ? "5" : "2", sub: premium ? "5/mois" : "2/mois" },
  ];

  const empty = (t: string) => <div className="py-10 text-center text-sm text-gasra-text-muted">{t}</div>;

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
        <ArrowLeft size={16} /> Gestion · {shop.name}
      </button>

      <div className="gasra-card-glass rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-14 h-14 shrink-0 rounded-2xl bg-gasra-surface-subtle flex items-center justify-center">
            <Store size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-gasra-text">{shop.name}</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Active</span>
              {premium && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-gasra-accent/40 text-gasra-accent">Boutique Premium</span>}
            </div>
            <div className="text-xs text-gasra-text-muted">
              {shop.wilaya} · {shop.description}
            </div>
          </div>
          <Link to="/marketplace" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gasra-surface-border bg-gasra-surface text-sm font-semibold text-gasra-text">
            <ExternalLink size={15} /> Fiche publique
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="p-3.5 rounded-2xl bg-gasra-surface-subtle">
                <div className="flex items-center gap-1.5 text-[11px] text-gasra-text-muted">
                  <Icon size={13} /> {k.label}
                </div>
                <div className="text-lg font-black font-mono text-gasra-text mt-1">{k.value}</div>
                <div className="text-[11px] text-gasra-text-muted">{k.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative z-10 shrink-0 px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
              {active && <motion.span layoutId="shop-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="gasra-card-glass rounded-3xl p-4 sm:p-5">
          {tab === "overview" && (
            <div className="space-y-3">
              <h2 className="font-bold text-gasra-text">Activité récente</h2>
              {orders.length
                ? orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gasra-surface-subtle">
                      <ShoppingCart size={16} />
                      <span className="flex-1 min-w-0 text-sm">
                        <b className="text-gasra-text">{o.client}</b> <span className="text-gasra-text-secondary">a commandé {o.product}</span>
                      </span>
                      <span className="font-mono text-sm font-bold text-gasra-text">{fmt(o.total)}</span>
                    </div>
                  ))
                : empty("Aucune commande pour le moment.")}
            </div>
          )}

          {tab === "produits" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gasra-text">{products.length} produits</h2>
                <Link to="/marketplace" className="flex items-center gap-1 px-3 py-1.5 rounded-xl btn-gasra-primary text-xs">
                  <Plus size={14} /> Ajouter
                </Link>
              </div>
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gasra-surface-subtle">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="flex-1 min-w-0 text-sm font-semibold text-gasra-text truncate">{p.name}</span>
                  <span className="font-mono text-sm font-bold text-gasra-accent">{fmt(p.priceDA)}</span>
                  <button onClick={() => save({ ...state, products: products.filter((x) => x.id !== p.id) })} className="p-2 rounded-lg hover:bg-red-500/15" aria-label="Supprimer">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {!products.length && empty("Aucun produit. Ajoute ton premier produit depuis le Marketplace.")}
            </div>
          )}

          {tab === "commandes" && (
            <div className="space-y-2.5">
              {orders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-gasra-surface-subtle text-sm">
                  <span className="font-mono text-gasra-text-muted">{o.id}</span>
                  <span className="flex-1 min-w-0">
                    <b className="text-gasra-text">{o.client}</b> · <span className="text-gasra-text-secondary">{o.product}</span>
                    <span className="block text-[11px] text-gasra-text-muted">{o.date}</span>
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${o.status === "Livrée" ? "bg-emerald-500/15 text-emerald-400" : o.status === "En séquestre" ? "bg-amber-400/15 text-amber-400" : "bg-gasra-accent/15 text-gasra-accent"}`}>{o.status}</span>
                  <span className="font-mono font-bold text-gasra-text">{fmt(o.total)}</span>
                </div>
              ))}
              {!orders.length && empty("Aucune commande pour le moment.")}
            </div>
          )}

          {tab === "missions" && (
            <div className="space-y-3">
              <p className="text-sm text-gasra-text-secondary">Crée une mission pour que les créateurs de la houma parlent de ta boutique. Tu paies seulement quand un client scanne le bon.</p>
              <Link to="/missions" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-gasra-primary text-sm">
                <Sparkles size={15} /> Créer une mission
              </Link>
              <div className="text-xs text-gasra-text-muted">{premium ? "5" : "2"} missions disponibles ce mois</div>
            </div>
          )}

          {tab === "partages" && (
            <div className="space-y-2.5">
              {(hasActivity ? SHARES : []).map((s) => (
                <div key={s.who} className="flex items-center gap-3 p-3 rounded-2xl bg-gasra-surface-subtle text-sm">
                  <Share2 size={16} />
                  <span className="flex-1 min-w-0">
                    <b className="text-gasra-text">{s.who}</b>
                    <span className="block text-[11px] text-gasra-text-muted">{s.what}</span>
                  </span>
                  <span className="text-end">
                    <span className="block font-mono font-bold text-gasra-text">{s.scans} scans</span>
                    <span className="block text-[11px] text-gasra-text-muted">{fmt(s.commission)} versés</span>
                  </span>
                </div>
              ))}
              {!hasActivity && empty("Personne n'a encore partagé tes produits.")}
            </div>
          )}

          {tab === "promotions" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gasra-surface-subtle">
                <span className="text-sm">
                  <b className="text-gasra-text">Bon Gasra -{promo.value} %</b>
                  <span className="block text-[11px] text-gasra-text-muted">Visible sur le fil et le Radar de la Houma</span>
                </span>
                <button onClick={() => setPromo({ ...promo, active: !promo.active })} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${promo.active ? "bg-emerald-500/15 text-emerald-400" : "bg-gasra-surface text-gasra-text-muted"}`}>
                  {promo.active ? "Active" : "En pause"}
                </button>
              </div>
              <label className="block text-xs text-gasra-text-secondary">
                Réduction : <b className="text-gasra-text">{promo.value} %</b>
                <input type="range" min={5} max={50} step={5} value={promo.value} onChange={(e) => setPromo({ ...promo, value: Number(e.target.value) })} className="gains-range w-full mt-1" />
              </label>
            </div>
          )}

          {tab === "clients" && (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-2xl bg-gasra-surface-subtle text-sm">
                  <b className="text-gasra-text">{o.client}</b>
                  <span className="text-gasra-text-muted">1 commande · {fmt(o.total)}</span>
                </div>
              ))}
              {!orders.length && empty("Tes clients apparaîtront ici après leur première commande.")}
            </div>
          )}

          {tab === "abonnement" && (
            <div className="flex items-center gap-3">
              <Crown size={20} />
              <div className="flex-1 text-sm">
                <b className="text-gasra-text">{premium ? "Boutique Premium" : "Boutique gratuite"}</b>
                <span className="block text-[11px] text-gasra-text-muted">{premium ? "Produits illimités, 5 missions par mois" : "20 produits, 2 missions par mois"}</span>
              </div>
              <Link to="/abonnements" className="px-3.5 py-2 rounded-xl btn-gasra-primary text-xs">
                {premium ? "Gérer" : "Passer Premium"}
              </Link>
            </div>
          )}

          {tab === "parametres" && (
            <div className="space-y-2.5">
              <input defaultValue={shop.name} onBlur={(e) => save({ ...state, shop: { ...shop, name: e.target.value || shop.name } })} className="w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-sm text-gasra-text" />
              <textarea defaultValue={shop.description} onBlur={(e) => save({ ...state, shop: { ...shop, description: e.target.value } })} rows={3} className="w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-sm text-gasra-text resize-none" />
              <p className="text-[11px] text-gasra-text-muted">Les modifications sont enregistrées automatiquement.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
