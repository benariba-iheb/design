import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Store,
  ShoppingBag,
  Scale,
  Search,
  Star,
  Plus,
  X,
  ArrowLeft,
  Lock,
  Sparkles,
  CheckCircle2,
  BadgeCheck,
  Package,
  Trophy,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

/* ------------------------------------------------------------------ */
/* Données                                                             */
/* ------------------------------------------------------------------ */
type Cat = "electronique" | "mode" | "beaute" | "alimentation" | "maison" | "sport";

interface Shop {
  id: string;
  name: string;
  description: string;
  category: Cat;
  wilaya: string;
  rating: number;
  verified?: boolean;
  mine?: boolean;
}
interface Product {
  id: string;
  shopId: string;
  key: string; // même produit chez plusieurs boutiques → comparateur
  name: string;
  priceDA: number;
  category: Cat;
  emoji: string;
}

const CATS: { id: "tout" | Cat; fr: string; ar: string; emoji: string }[] = [
  { id: "tout", fr: "Tout", ar: "الكل", emoji: "🛍️" },
  { id: "electronique", fr: "Électronique", ar: "إلكترونيات", emoji: "📱" },
  { id: "mode", fr: "Mode", ar: "موضة", emoji: "👗" },
  { id: "beaute", fr: "Beauté", ar: "جمال", emoji: "💄" },
  { id: "alimentation", fr: "Alimentation", ar: "مواد غذائية", emoji: "🍕" },
  { id: "maison", fr: "Maison", ar: "منزل", emoji: "🏠" },
  { id: "sport", fr: "Sport", ar: "رياضة", emoji: "⚽" },
];
const CAT_EMOJI: Record<Cat, string> = { electronique: "📱", mode: "👗", beaute: "💄", alimentation: "🍕", maison: "🏠", sport: "⚽" };

const SHOPS: Shop[] = [
  { id: "s1", name: "TechZone DZ", description: "Smartphones, accessoires et réparation express", category: "electronique", wilaya: "Alger", rating: 4.7, verified: true },
  { id: "s2", name: "Hanout Fashion", description: "Prêt-à-porter homme & femme, arrivages chaque semaine", category: "mode", wilaya: "Oran", rating: 4.4 },
  { id: "s3", name: "Lalla Beauté", description: "Cosmétiques naturels et soins à l'huile d'argan", category: "beaute", wilaya: "Tlemcen", rating: 4.9, verified: true },
  { id: "s4", name: "Souk Bio Mitidja", description: "Produits du terroir : huile d'olive, miel, dattes", category: "alimentation", wilaya: "Blida", rating: 4.8 },
  { id: "s5", name: "Dar Zellige Déco", description: "Artisanat, tapis berbères et décoration", category: "maison", wilaya: "Oran", rating: 4.6, verified: true },
  { id: "s6", name: "Houma Sport", description: "Équipements de foot, running et salle", category: "sport", wilaya: "Alger", rating: 4.3 },
  { id: "s7", name: "Phone Center Sétif", description: "Téléphones neufs et reconditionnés garantis", category: "electronique", wilaya: "Sétif", rating: 4.5 },
];

const PRODUCTS: Product[] = [
  { id: "x1", shopId: "s1", key: "ecouteurs", name: "Écouteurs sans fil Pro", priceDA: 6500, category: "electronique", emoji: "🎧" },
  { id: "x2", shopId: "s7", key: "ecouteurs", name: "Écouteurs sans fil Pro", priceDA: 5900, category: "electronique", emoji: "🎧" },
  { id: "x3", shopId: "s1", key: "chargeur", name: "Chargeur rapide 33W", priceDA: 2400, category: "electronique", emoji: "🔌" },
  { id: "x4", shopId: "s7", key: "chargeur", name: "Chargeur rapide 33W", priceDA: 2800, category: "electronique", emoji: "🔌" },
  { id: "x5", shopId: "s2", key: "survet", name: "Survêtement coton", priceDA: 4800, category: "mode", emoji: "🧥" },
  { id: "x6", shopId: "s6", key: "survet", name: "Survêtement coton", priceDA: 5200, category: "mode", emoji: "🧥" },
  { id: "x7", shopId: "s3", key: "argan", name: "Huile d'argan 100 ml", priceDA: 1900, category: "beaute", emoji: "🧴" },
  { id: "x8", shopId: "s3", key: "savon", name: "Savon noir traditionnel", priceDA: 650, category: "beaute", emoji: "🧼" },
  { id: "x9", shopId: "s4", key: "huile", name: "Huile d'olive 1 L", priceDA: 1200, category: "alimentation", emoji: "🫒" },
  { id: "x10", shopId: "s4", key: "miel", name: "Miel de jujubier 500 g", priceDA: 3500, category: "alimentation", emoji: "🍯" },
  { id: "x11", shopId: "s5", key: "tapis", name: "Tapis berbère fait main", priceDA: 24000, category: "maison", emoji: "🧶" },
  { id: "x12", shopId: "s5", key: "lampe", name: "Lampe en cuivre ciselé", priceDA: 7800, category: "maison", emoji: "🪔" },
  { id: "x13", shopId: "s6", key: "ballon", name: "Ballon de foot T5", priceDA: 2600, category: "sport", emoji: "⚽" },
  { id: "x14", shopId: "s6", key: "baskets", name: "Baskets running", priceDA: 9500, category: "sport", emoji: "👟" },
  { id: "x15", shopId: "s2", key: "baskets", name: "Baskets running", priceDA: 8900, category: "sport", emoji: "👟" },
];

const fmtDA = (n: number) => `${n.toLocaleString("fr-FR")} DA`;

/* Boutique de l'utilisateur (gardée sur l'appareil pour la démo) */
interface MyShop { shop: Shop; products: Product[] }
const STORAGE_KEY = "gasra.myShop";
function useMyShop() {
  const [state, setState] = useState<MyShop | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [state]);
  return [state, setState] as const;
}

/* ------------------------------------------------------------------ */
/* Petits composants                                                   */
/* ------------------------------------------------------------------ */
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="relative w-full max-w-md gasra-card-glass rounded-3xl shadow-2xl"
        >
          <div className="p-5 max-h-[88vh] overflow-y-auto">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ShopRow: React.FC<{ shop: Shop; count: number; onOpen: () => void; index: number }> = ({ shop, count, onOpen, index }) => (
  <motion.button
    type="button"
    onClick={onOpen}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
    className="market-row w-full text-start flex items-center gap-4 p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface"
  >
    <span className="w-12 h-12 shrink-0 rounded-xl bg-gasra-surface-subtle flex items-center justify-center text-xl">
      {CAT_EMOJI[shop.category]}
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex items-center gap-1.5">
        <span className="font-bold text-gasra-text truncate">{shop.name}</span>
        {shop.verified && <BadgeCheck size={15} />}
      </span>
      <span className="block text-xs text-gasra-text-muted truncate">{shop.description}</span>
      <span className="flex items-center gap-2 mt-1 text-[11px]">
        <span className="flex items-center gap-0.5 text-amber-400 font-semibold">★ {shop.rating.toFixed(1)}</span>
        <span className="px-2 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent font-semibold">{shop.wilaya}</span>
        <span className="text-gasra-text-muted">{count} produits</span>
      </span>
    </span>
  </motion.button>
);

const ProductCard: React.FC<{ p: Product; shopName: string; onClick?: () => void; index: number }> = ({ p, shopName, onClick, index }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.025 }}
    whileHover={{ y: -3 }}
    className="market-row text-start flex flex-col rounded-2xl border border-gasra-surface-border bg-gasra-surface overflow-hidden"
  >
    <span className="aspect-[4/3] flex items-center justify-center text-4xl bg-gasra-surface-subtle">{p.emoji}</span>
    <span className="p-3">
      <span className="block text-sm font-semibold text-gasra-text leading-snug line-clamp-2">{p.name}</span>
      <span className="block text-[11px] text-gasra-text-muted mt-0.5 truncate">{shopName}</span>
      <span className="block font-mono font-bold text-gasra-accent mt-1.5">{fmtDA(p.priceDA)}</span>
    </span>
  </motion.button>
);

/* ------------------------------------------------------------------ */
/* Écran                                                               */
/* ------------------------------------------------------------------ */
export const MarketplaceHome: React.FC = () => {
  const { language, user } = useApp();
  const isAr = language === "ar";
  const [my, setMy] = useMyShop();

  const [tab, setTab] = useState<"boutiques" | "produits" | "comparateur">("boutiques");
  const [cat, setCat] = useState<"tout" | Cat>("tout");
  const [q, setQ] = useState("");
  const [openShopId, setOpenShopId] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // formulaires
  const [shopForm, setShopForm] = useState({ name: "", description: "", category: "electronique" as Cat, wilaya: (user.originWilayaName || "Alger") as string });
  const [prodForm, setProdForm] = useState({ name: "", price: "", category: "electronique" as Cat });

  const allShops = useMemo(() => (my ? [my.shop, ...SHOPS] : SHOPS), [my]);
  const allProducts = useMemo(() => (my ? [...my.products, ...PRODUCTS] : PRODUCTS), [my]);
  const shopName = (id: string) => allShops.find((s) => s.id === id)?.name || "";
  const countFor = (id: string) => allProducts.filter((p) => p.shopId === id).length;

  const match = (s: string) => !q.trim() || s.toLowerCase().includes(q.trim().toLowerCase());
  const shops = allShops.filter((s) => (cat === "tout" || s.category === cat) && (match(s.name) || match(s.description)));
  const products = allProducts.filter((p) => (cat === "tout" || p.category === cat) && (match(p.name) || match(shopName(p.shopId))));

  // Comparateur : produits proposés par au moins 2 boutiques
  const comparable = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    allProducts.forEach((p) => (groups[p.key] = [...(groups[p.key] || []), p]));
    return Object.values(groups).filter((g) => g.length > 1);
  }, [allProducts]);
  const [compareKey, setCompareKey] = useState<string>("ecouteurs");
  const compareList = (comparable.find((g) => g[0].key === compareKey) || comparable[0] || []).slice().sort((a, b) => a.priceDA - b.priceDA);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // Règle : pas de boutique → pas d'annonce
  const onSell = () => (my ? setAddOpen(true) : setGateOpen(true));

  const createShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopForm.name.trim()) return;
    const shop: Shop = { id: "mine", name: shopForm.name.trim(), description: shopForm.description.trim() || "Nouvelle boutique Gasra", category: shopForm.category, wilaya: shopForm.wilaya, rating: 0, mine: true };
    setMy({ shop, products: [] });
    setCreateOpen(false);
    setProdForm((f) => ({ ...f, category: shopForm.category }));
    flash(isAr ? "تم إنشاء متجرك !" : "Ta boutique est en ligne ! Ajoute ton premier produit.");
    setTimeout(() => setAddOpen(true), 400);
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!my || !prodForm.name.trim() || !Number(prodForm.price)) return;
    const name = prodForm.name.trim();
    const p: Product = {
      id: `m${Date.now()}`,
      shopId: "mine",
      // même nom qu'un produit existant → même fiche dans le comparateur
      key: allProducts.find((x) => x.name.toLowerCase() === name.toLowerCase())?.key || name.toLowerCase(),
      name,
      priceDA: Number(prodForm.price),
      category: prodForm.category,
      emoji: CAT_EMOJI[prodForm.category],
    };
    setMy({ ...my, products: [p, ...my.products] });
    setProdForm({ name: "", price: "", category: prodForm.category });
    setAddOpen(false);
    flash(isAr ? "تمت إضافة المنتج" : "Produit publié dans ta boutique");
  };

  const fieldCls = "w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30";

  /* ---------- Vitrine d'une boutique ---------- */
  const openShop = allShops.find((s) => s.id === openShopId);
  if (openShop) {
    const list = allProducts.filter((p) => p.shopId === openShop.id);
    return (
      <div className="w-full p-3 sm:p-5 space-y-4">
        <button onClick={() => setOpenShopId(null)} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
          <ArrowLeft size={16} /> {isAr ? "رجوع" : "Toutes les boutiques"}
        </button>
        <div className="gasra-card-glass rounded-3xl p-5 flex items-center gap-4">
          <span className="w-16 h-16 shrink-0 rounded-2xl bg-gasra-surface-subtle flex items-center justify-center text-3xl">{CAT_EMOJI[openShop.category]}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black text-gasra-text flex items-center gap-1.5">
              {openShop.name} {openShop.verified && <BadgeCheck size={18} />}
            </h1>
            <p className="text-sm text-gasra-text-muted">{openShop.description}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="text-amber-400 font-semibold">★ {openShop.rating ? openShop.rating.toFixed(1) : "Nouveau"}</span>
              <span className="px-2 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent font-semibold">{openShop.wilaya}</span>
              <span className="text-gasra-text-muted">{list.length} produits</span>
            </div>
          </div>
          {openShop.mine && (
            <button onClick={() => setAddOpen(true)} className="hidden sm:flex shrink-0 items-center gap-1.5 px-4 py-2.5 rounded-xl btn-gasra-primary text-sm">
              <Plus size={16} /> {isAr ? "إضافة منتج" : "Ajouter un produit"}
            </button>
          )}
        </div>
        {openShop.mine && (
          <button onClick={() => setAddOpen(true)} className="sm:hidden w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl btn-gasra-primary text-sm">
            <Plus size={16} /> {isAr ? "إضافة منتج" : "Ajouter un produit"}
          </button>
        )}
        {list.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} shopName={openShop.name} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-gasra-text-muted">
            <Package size={28} className="mx-auto mb-2" />
            {isAr ? "لا توجد منتجات بعد" : "Aucun produit pour l'instant."}
          </div>
        )}
        {renderModals()}
      </div>
    );
  }

  function renderModals() {
    return (
      <>
        {/* Règle : boutique obligatoire */}
        <Modal open={gateOpen} onClose={() => setGateOpen(false)}>
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gasra-accent/12 flex items-center justify-center">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-gasra-text">{isAr ? "تحتاج متجراً للبيع" : "Il te faut une boutique pour vendre"}</h3>
            <p className="text-sm text-gasra-text-secondary">
              {isAr
                ? "في سوق قصرة، كل بائع يملك متجره الخاص مع قائمة منتجاته. أنشئ متجرك مجاناً لتنشر إعلاناتك."
                : "Sur le Marketplace Gasra, chaque vendeur a sa propre boutique en ligne avec son catalogue. Crée la tienne gratuitement pour publier tes annonces."}
            </p>
            <ul className="text-start text-sm space-y-1.5 p-3 rounded-2xl bg-gasra-surface-subtle">
              {(isAr
                ? ["صفحة متجر باسمك", "قائمة منتجات غير محدودة", "ظهور في المقارن"]
                : ["Une vitrine à ton nom", "Un catalogue de produits illimité", "Tes prix visibles dans le comparateur"]
              ).map((t) => (
                <li key={t} className="flex items-center gap-2 text-gasra-text">
                  <CheckCircle2 size={15} /> {t}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setGateOpen(false);
                setCreateOpen(true);
              }}
              className="w-full py-3 rounded-2xl btn-gasra-primary text-sm flex items-center justify-center gap-2"
            >
              <Store size={16} /> {isAr ? "أنشئ متجري" : "Créer ma boutique"}
            </button>
          </div>
        </Modal>

        {/* Création de boutique */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
          <form onSubmit={createShop} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gasra-text">{isAr ? "إنشاء متجري" : "Créer ma boutique"}</h3>
              <button type="button" onClick={() => setCreateOpen(false)} className="p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <input required value={shopForm.name} onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })} placeholder={isAr ? "اسم المتجر" : "Nom de la boutique"} className={fieldCls} />
            <textarea rows={2} value={shopForm.description} onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })} placeholder={isAr ? "وصف قصير" : "Ce que tu vends, en une phrase"} className={`${fieldCls} resize-none`} />
            <div className="grid grid-cols-2 gap-2">
              <select value={shopForm.category} onChange={(e) => setShopForm({ ...shopForm, category: e.target.value as Cat })} className={fieldCls}>
                {CATS.filter((c) => c.id !== "tout").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {isAr ? c.ar : c.fr}
                  </option>
                ))}
              </select>
              <input value={shopForm.wilaya} onChange={(e) => setShopForm({ ...shopForm, wilaya: e.target.value })} placeholder="Wilaya" className={fieldCls} />
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl btn-gasra-primary text-sm flex items-center justify-center gap-2">
              <Sparkles size={16} /> {isAr ? "افتح متجري" : "Ouvrir ma boutique"}
            </button>
          </form>
        </Modal>

        {/* Ajout de produit (seulement avec une boutique) */}
        <Modal open={addOpen && !!my} onClose={() => setAddOpen(false)}>
          <form onSubmit={addProduct} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gasra-text">{isAr ? "إضافة منتج" : "Ajouter un produit"}</h3>
                <p className="text-xs text-gasra-text-muted">{my?.shop.name}</p>
              </div>
              <button type="button" onClick={() => setAddOpen(false)} className="p-1.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 rounded-2xl border-2 border-dashed border-gasra-surface-border bg-gasra-surface flex flex-col items-center text-center gap-1">
              <span className="text-3xl">{CAT_EMOJI[prodForm.category]}</span>
              <span className="text-xs text-gasra-text-muted">{isAr ? "أضف صور المنتج" : "Ajouter des photos du produit"}</span>
            </div>
            <input required value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} placeholder={isAr ? "اسم المنتج" : "Nom du produit"} className={fieldCls} />
            <div className="grid grid-cols-2 gap-2">
              <input required inputMode="numeric" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value.replace(/\D/g, "") })} placeholder={isAr ? "السعر (دج)" : "Prix (DA)"} className={fieldCls} />
              <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as Cat })} className={fieldCls}>
                {CATS.filter((c) => c.id !== "tout").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {isAr ? c.ar : c.fr}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl btn-gasra-primary text-sm flex items-center justify-center gap-2">
              <Plus size={16} /> {isAr ? "نشر المنتج" : "Publier le produit"}
            </button>
          </form>
        </Modal>

        {/* Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed bottom-24 lg:bottom-28 inset-x-0 z-[80] flex justify-center pointer-events-none"
            >
              <span className="px-4 py-2.5 rounded-2xl gasra-card-glass text-sm text-gasra-text shadow-xl flex items-center gap-2">
                <CheckCircle2 size={16} /> {toast}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  const tabs = [
    { id: "boutiques" as const, fr: "Boutiques", ar: "المتاجر", icon: Store },
    { id: "produits" as const, fr: "Produits", ar: "المنتجات", icon: ShoppingBag },
    { id: "comparateur" as const, fr: "Comparateur", ar: "المقارن", icon: Scale },
  ];

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-gasra-text tracking-tight">Marketplace</h1>
        <button onClick={onSell} className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-gasra-primary text-sm">
          {my ? <Plus size={16} /> : <Store size={16} />}
          {my ? (isAr ? "إضافة منتج" : "Ajouter un produit") : isAr ? "بيع على قصرة" : "Vendre sur Gasra"}
        </button>
      </div>

      {/* Onglets */}
      <div className="relative grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
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
                <motion.span layoutId="market-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
              )}
              <Icon size={14} />
              <span>{isAr ? t.ar : t.fr}</span>
            </button>
          );
        })}
      </div>

      {tab !== "comparateur" && (
        <>
          <div className="relative">
            <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gasra-text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isAr ? "ابحث عن منتج أو متجر..." : "Rechercher un produit ou boutique..."} className={`${fieldCls} ps-10`} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATS.map((c) => {
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
        </>
      )}

      {/* ---------- Boutiques ---------- */}
      {tab === "boutiques" && (
        <div className="space-y-2.5">
          {my ? (
            <button
              onClick={() => setOpenShopId("mine")}
              className="w-full text-start gasra-card-glass rounded-3xl p-4 flex items-center gap-4"
            >
              <span className="w-12 h-12 shrink-0 rounded-xl bg-gasra-accent/15 flex items-center justify-center text-xl">{CAT_EMOJI[my.shop.category]}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-gasra-accent">{isAr ? "متجري" : "Ma boutique"}</span>
                <span className="block font-bold text-gasra-text truncate">{my.shop.name}</span>
                <span className="block text-xs text-gasra-text-muted">{my.products.length} produits en ligne</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setAddOpen(true);
                }}
                className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl btn-gasra-primary text-xs"
              >
                <Plus size={14} /> {isAr ? "منتج" : "Produit"}
              </span>
            </button>
          ) : (
            <div className="gasra-card-glass rounded-3xl p-4 flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl bg-gasra-accent/12 flex items-center justify-center">
                <Store size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-gasra-text">{isAr ? "تريد البيع ؟" : "Tu veux vendre ?"}</div>
                <div className="text-xs text-gasra-text-muted">
                  {isAr ? "أنشئ متجرك المجاني لنشر منتجاتك." : "Ouvre ta boutique gratuite pour publier tes produits."}
                </div>
              </div>
              <button onClick={() => setCreateOpen(true)} className="shrink-0 px-3.5 py-2 rounded-xl btn-gasra-primary text-xs">
                {isAr ? "أنشئ متجري" : "Créer ma boutique"}
              </button>
            </div>
          )}

          <h2 className="text-sm font-bold text-gasra-text pt-2">{isAr ? "المتاجر" : "Boutiques"}</h2>
          {shops
            .filter((s) => !s.mine)
            .map((s, i) => (
              <ShopRow key={s.id} shop={s} count={countFor(s.id)} index={i} onOpen={() => setOpenShopId(s.id)} />
            ))}
          {shops.filter((s) => !s.mine).length === 0 && <p className="text-center text-sm text-gasra-text-muted py-8">Aucune boutique trouvée.</p>}
        </div>
      )}

      {/* ---------- Produits ---------- */}
      {tab === "produits" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} shopName={shopName(p.shopId)} index={i} onClick={() => setOpenShopId(p.shopId)} />
          ))}
          {products.length === 0 && <p className="col-span-full text-center text-sm text-gasra-text-muted py-8">Aucun produit trouvé.</p>}
        </div>
      )}

      {/* ---------- Comparateur ---------- */}
      {tab === "comparateur" && (
        <div className="space-y-3">
          <p className="text-sm text-gasra-text-secondary">
            {isAr ? "قارن سعر نفس المنتج بين المتاجر." : "Compare le prix d'un même produit entre les boutiques."}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {comparable.map((g) => {
              const active = (compareList[0]?.key || "") === g[0].key;
              return (
                <button
                  key={g[0].key}
                  onClick={() => setCompareKey(g[0].key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                    active ? "bg-gasra-accent text-gasra-on-accent" : "bg-gasra-surface text-gasra-text-secondary hover:text-gasra-text"
                  }`}
                >
                  <span>{g[0].emoji}</span>
                  {g[0].name}
                </button>
              );
            })}
          </div>
          <div className="gasra-card-glass rounded-3xl p-2 sm:p-3">
            {compareList.map((p, i) => {
              const shop = allShops.find((s) => s.id === p.shopId);
              const best = i === 0;
              const diff = p.priceDA - compareList[0].priceDA;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl ${best ? "compare-best" : ""}`}
                >
                  <span className="w-8 text-center font-mono font-bold text-gasra-text-muted">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 font-semibold text-gasra-text truncate">
                      {shop?.name} {shop?.verified && <BadgeCheck size={14} />}
                    </span>
                    <span className="block text-[11px] text-gasra-text-muted">
                      {shop?.wilaya} · ★ {shop?.rating ? shop.rating.toFixed(1) : "—"}
                    </span>
                  </span>
                  <span className="text-end">
                    <span className="block font-mono font-bold text-gasra-text">{fmtDA(p.priceDA)}</span>
                    {best ? (
                      <span className="flex items-center justify-end gap-1 text-[11px] font-semibold text-gasra-accent">
                        <Trophy size={11} /> {isAr ? "أفضل سعر" : "Meilleur prix"}
                      </span>
                    ) : (
                      <span className="block text-[11px] text-gasra-text-muted">+{fmtDA(diff)}</span>
                    )}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {renderModals()}
    </div>
  );
};
