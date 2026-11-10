import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LayoutGrid, Building2, Search, BadgeCheck, MapPin, UserPlus, Check, Shield, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type PageType = "agence" | "commune" | "wilaya" | "commerce" | "association";

export interface OfficialPage {
  id: string;
  name: string;
  type: PageType;
  place: string;
  followers: number;
  posts: number;
  createdAt: number; // pour "Récentes"
  emoji: string;
  cover: [string, string];
  link?: string; // commerces → vitrine existante
}

export const TYPE_LABEL: Record<PageType, { fr: string; ar: string }> = {
  agence: { fr: "Agence publique", ar: "وكالة عمومية" },
  commune: { fr: "Commune", ar: "بلدية" },
  wilaya: { fr: "Wilaya", ar: "ولاية" },
  commerce: { fr: "Commerce", ar: "محل" },
  association: { fr: "Association", ar: "جمعية" },
};

export const PAGES: OfficialPage[] = [
  { id: "pg1", name: "Office National du Tourisme — Antenne Alger", type: "agence", place: "Alger Centre, Alger", followers: 1840, posts: 32, createdAt: 3, emoji: "🏛️", cover: ["#FF8552", "#5E47D1"] },
  { id: "pg2", name: "APC Bab Ezzouar", type: "commune", place: "Bab Ezzouar, Alger", followers: 3210, posts: 58, createdAt: 8, emoji: "🏢", cover: ["#0DCCF2", "#2fddcb"] },
  { id: "pg3", name: "Sûreté de Wilaya d'Alger", type: "agence", place: "Alger", followers: 5120, posts: 44, createdAt: 2, emoji: "🛡️", cover: ["#3B82F6", "#5E47D1"] },
  { id: "pg4", name: "Wilaya d'Alger", type: "wilaya", place: "Alger", followers: 8930, posts: 120, createdAt: 1, emoji: "🗺️", cover: ["#22C55E", "#0DCCF2"] },
  { id: "pg5", name: "Chambre de Commerce et d'Industrie Mitidja", type: "agence", place: "Blida", followers: 960, posts: 18, createdAt: 6, emoji: "📈", cover: ["#6B7280", "#5E47D1"] },
  { id: "pg6", name: "Direction de la Santé — Wilaya d'Alger", type: "agence", place: "Alger", followers: 2470, posts: 27, createdAt: 5, emoji: "🏥", cover: ["#14B8A6", "#3B82F6"] },
  { id: "pg7", name: "Sandwicherie El Forno", type: "commerce", place: "Bab Ezzouar, Alger", followers: 640, posts: 15, createdAt: 9, emoji: "🍔", cover: ["#FF3D6E", "#FF8552"], link: "/commerce" },
  { id: "pg8", name: "Association Nass El Kheir", type: "association", place: "Oran", followers: 1350, posts: 41, createdAt: 7, emoji: "🤝", cover: ["#DB57C5", "#5E47D1"] },
  { id: "pg9", name: "APC Oran", type: "commune", place: "Oran", followers: 4020, posts: 66, createdAt: 4, emoji: "🌊", cover: ["#0DCCF2", "#5E47D1"] },
];

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : `${n}`);

export const ScreenPages: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"pop" | "recent" | "az">("pop");
  const [type, setType] = useState<"tous" | PageType>("tous");
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [member, setMember] = useState<Record<string, boolean>>({});

  const list = useMemo(() => {
    let l = PAGES.filter((p) => (type === "tous" || p.type === type) && (!q.trim() || `${p.name} ${p.place}`.toLowerCase().includes(q.trim().toLowerCase())));
    if (sort === "pop") l = [...l].sort((a, b) => b.followers - a.followers);
    if (sort === "recent") l = [...l].sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "az") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [q, sort, type]);

  const types = (["tous", "agence", "commune", "wilaya", "commerce", "association"] as const).map((t) => ({
    id: t,
    label: t === "tous" ? (isAr ? "الكل" : "Tous") : isAr ? TYPE_LABEL[t].ar : TYPE_LABEL[t].fr,
    count: t === "tous" ? PAGES.length : PAGES.filter((p) => p.type === t).length,
  }));

  const chip = (active: boolean) =>
    `shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${active ? "bg-gasra-accent text-gasra-on-accent" : "bg-gasra-surface text-gasra-text-secondary hover:text-gasra-text border border-gasra-surface-border"}`;

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      {/* Bandeau */}
      <div className="gasra-card-glass rounded-3xl p-5 sm:p-6 pages-hero">
        <div className="flex items-center gap-1.5 text-xs text-gasra-text-muted">
          <LayoutGrid size={13} /> {isAr ? "الدليل" : "Annuaire"}
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black text-gasra-text tracking-tight flex items-center gap-2">
          <Building2 size={26} /> Pages
        </h1>
        <p className="mt-1.5 text-sm text-gasra-text-secondary max-w-xl">
          {isAr
            ? "كل الصفحات الرسمية على قصرة : مؤسسات، بلديات، ولايات، محلات وجمعيات."
            : "Toutes les pages officielles sur Gasra : institutions, communes, wilayas, commerces et associations."}
        </p>
      </div>

      {/* Recherche + tri */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gasra-text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isAr ? "ابحث عن صفحة، ولاية أو بلدية..." : "Rechercher une page, wilaya ou commune..."} className="w-full ps-9 pe-3 py-2.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-sm text-gasra-text placeholder:text-gasra-text-muted outline-none focus:ring-2 focus:ring-gasra-accent/30" />
        </div>
        <div className="flex gap-2">
          {[
            { id: "pop" as const, fr: "Populaires", ar: "الأكثر متابعة" },
            { id: "recent" as const, fr: "Récentes", ar: "الأحدث" },
            { id: "az" as const, fr: "A → Z", ar: "أ → ي" },
          ].map((s) => (
            <button key={s.id} onClick={() => setSort(s.id)} className={chip(sort === s.id)}>
              {isAr ? s.ar : s.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Types */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {types.map((t) => (
          <button key={t.id} onClick={() => setType(t.id)} className={chip(type === t.id)}>
            {t.label} <span className="opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Grille */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="page-card rounded-2xl border border-gasra-surface-border bg-gasra-surface overflow-hidden flex flex-col"
          >
            {/* Couverture */}
            <button type="button" onClick={() => navigate(`/pages/${p.id}`)} className="relative h-24 text-start" style={{ background: `linear-gradient(120deg, ${p.cover[0]}, ${p.cover[1]})` }}>
              <span className="page-cover-pattern absolute inset-0" />
              <span className="absolute -bottom-6 start-4 w-14 h-14 rounded-2xl bg-gasra-surface flex items-center justify-center text-2xl page-logo">{p.emoji}</span>
            </button>
            <div className="p-4 pt-8 flex-1 flex flex-col gap-2">
              <div className="flex items-start gap-1.5 cursor-pointer" onClick={() => navigate(`/pages/${p.id}`)}>
                <h3 className="font-bold text-gasra-text leading-snug hover:underline">{p.name}</h3>
                <BadgeCheck size={16} className="shrink-0 mt-0.5" />
              </div>
              <span className="w-fit text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent">
                {isAr ? TYPE_LABEL[p.type].ar : TYPE_LABEL[p.type].fr}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-gasra-text-muted">
                <MapPin size={11} /> {p.place}
              </div>
              <div className="text-xs text-gasra-text-secondary">
                <b className="text-gasra-text">{fmt(p.followers + (followed[p.id] ? 1 : 0))}</b> abonnés · <b className="text-gasra-text">{p.posts}</b> posts
              </div>
              <div className="flex gap-2 mt-auto pt-1">
                <button
                  onClick={() => setFollowed((f) => ({ ...f, [p.id]: !f[p.id] }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${followed[p.id] ? "bg-gasra-surface-subtle text-gasra-text" : "btn-gasra-primary"}`}
                >
                  {followed[p.id] ? <Check size={14} /> : <UserPlus size={14} />}
                  {followed[p.id] ? (isAr ? "متابَع" : "Suivi") : isAr ? "متابعة" : "Suivre"}
                </button>
                <button
                  onClick={() => setMember((m) => ({ ...m, [p.id]: !m[p.id] }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${member[p.id] ? "bg-gasra-accent/15 text-gasra-accent" : "bg-gasra-surface-subtle text-gasra-text hover:bg-gasra-accent/10"}`}
                >
                  {member[p.id] ? <ShieldCheck size={14} /> : <Shield size={14} />}
                  {member[p.id] ? (isAr ? "عضو" : "Membre") : isAr ? "انضم" : "Devenir membre"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {list.length === 0 && <p className="col-span-full text-center text-sm text-gasra-text-muted py-10">Aucune page trouvée.</p>}
      </div>
    </div>
  );
};
