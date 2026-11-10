import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BadgeCheck, MapPin, Users, FileText, UserPlus, Check, Shield, ShieldCheck, Share2, Heart, MessageCircle, Bookmark, MoreHorizontal, Clock, Phone, Globe, Store } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PAGES, TYPE_LABEL, OfficialPage } from "./ScreenPages";
import { PEOPLE } from "../../data/people";
import { PersonAvatar } from "../common/PersonAvatar";

interface PagePost {
  id: string;
  title: string;
  text: string;
  tags: string[];
  img?: string;
  emoji: string;
  time: string;
  likes: number;
  comments: number;
}

const IMG_CONCERT = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=70";
const IMG_RUN = "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=70";

function postsFor(p: OfficialPage): PagePost[] {
  const city = p.place.split(",").pop()?.trim() || "Alger";
  const base: Record<string, PagePost[]> = {
    agence: [
      { id: "a1", title: `Festival de la musique ${city} 2026 🎶`, text: `Trois soirées d'exception au Théâtre de Verdure : jeunes talents, têtes d'affiche et hommage aux légendes du Raï et du Chaâbi. Billetterie ouverte sur place et sur Gasra, paiement Edahabia accepté.`, tags: ["Visit" + city, "Culture", "Musique"], img: IMG_CONCERT, emoji: "🎶", time: "il y a 2 j", likes: 214, comments: 31 },
      { id: "a2", title: "Marathon universitaire — inscriptions ouvertes 🏃", text: "Départ du front de mer le 28 août à 7h. Parcours de 5 et 10 km, ravitaillement tous les 2 km. Inscription gratuite pour les étudiants.", tags: ["Sport", "Jeunesse"], img: IMG_RUN, emoji: "🏃", time: "il y a 5 j", likes: 156, comments: 18 },
      { id: "a3", title: "Horaires d'été des services 🕘", text: "Du 1er juillet au 31 août, nos guichets sont ouverts de 8h à 14h du dimanche au jeudi. Les démarches en ligne restent disponibles 24h/24.", tags: ["Info"], emoji: "🕘", time: "il y a 1 sem", likes: 88, comments: 7 },
    ],
    commune: [
      { id: "c1", title: "Travaux de voirie rue des Martyrs 🚧", text: "Réfection de la chaussée du 12 au 20 novembre. Déviation par le boulevard principal. Merci pour votre patience.", tags: ["Travaux", "Houma"], emoji: "🚧", time: "il y a 1 j", likes: 64, comments: 22 },
      { id: "c2", title: "Collecte des encombrants ce samedi ♻️", text: "Déposez vos encombrants devant votre immeuble avant 8h. Les camions passeront dans tous les quartiers de la commune.", tags: ["Propreté", "Citoyen"], emoji: "♻️", time: "il y a 3 j", likes: 120, comments: 9 },
    ],
    wilaya: [
      { id: "w1", title: "Ouverture du nouveau parc urbain 🌳", text: "Le parc de 12 hectares ouvre ses portes vendredi : aires de jeux, pistes cyclables et espaces de pique-nique.", tags: ["Ville", "Famille"], emoji: "🌳", time: "il y a 4 j", likes: 402, comments: 57 },
    ],
    commerce: [
      { id: "s1", title: "Nouveau four à bois 🔥", text: "Venez goûter nos pizzas et chawarmas cuits au four à bois. Bon exclusif Gasra -30% sur le menu XL cette semaine !", tags: ["BonsGasra", "Food"], emoji: "🍔", time: "il y a 6 h", likes: 98, comments: 14 },
    ],
    association: [
      { id: "as1", title: "Couffin solidaire 🤝", text: "Nous collectons des denrées pour 200 familles. Points de dépôt à la maison de jeunes et au café des Frères.", tags: ["Solidarité", "Bénévolat"], emoji: "🤝", time: "il y a 2 j", likes: 233, comments: 40 },
    ],
  };
  return base[p.type] || base.agence;
}

const PostCard: React.FC<{ page: OfficialPage; post: PagePost }> = ({ page, post }) => {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gasra-surface-border bg-gasra-surface overflow-hidden flex flex-col">
      <header className="flex items-center gap-2.5 p-3">
        <span className="w-9 h-9 shrink-0 rounded-full bg-gasra-surface-subtle flex items-center justify-center">{page.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gasra-text truncate">{page.name}</span>
            <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gasra-accent/12 text-gasra-accent">Page officielle</span>
          </div>
          <div className="text-[11px] text-gasra-text-muted">{post.time}</div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gasra-surface-subtle" aria-label="Options">
          <MoreHorizontal size={16} />
        </button>
      </header>
      {post.img ? (
        <img src={post.img} alt="" className="w-full aspect-[16/9] object-cover" loading="lazy" />
      ) : (
        <div className="w-full aspect-[16/9] flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${page.cover[0]}, ${page.cover[1]})` }}>
          {post.emoji}
        </div>
      )}
      <div className="p-3.5 flex-1 flex flex-col gap-1.5">
        <h3 className="font-bold text-gasra-text">{post.title}</h3>
        <p className={`text-sm text-gasra-text-secondary ${open ? "" : "line-clamp-3"}`}>{post.text}</p>
        <button onClick={() => setOpen(!open)} className="self-start text-xs font-semibold text-gasra-accent">
          {open ? "Réduire" : "Lire plus →"}
        </button>
        <div className="flex flex-wrap gap-1.5 text-xs text-gasra-accent">
          {post.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
      </div>
      <footer className="flex items-center gap-1 px-2 pb-2">
        <button onClick={() => setLiked(!liked)} className={`page-act flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs ${liked ? "is-liked" : ""}`}>
          <Heart size={16} /> {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="page-act flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs">
          <MessageCircle size={16} /> {post.comments}
        </button>
        <button className="page-act flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs">
          <Share2 size={16} />
        </button>
        <button onClick={() => setSaved(!saved)} className={`page-act ms-auto p-1.5 rounded-lg ${saved ? "is-saved" : ""}`} aria-label="Enregistrer">
          <Bookmark size={16} />
        </button>
      </footer>
    </motion.article>
  );
};

export const ScreenPageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  const isAr = language === "ar";
  const page = PAGES.find((p) => p.id === id) || PAGES[0];
  const posts = postsFor(page);
  const [tab, setTab] = useState<"pubs" | "apropos" | "abonnes">("pubs");
  const [following, setFollowing] = useState(false);
  const [member, setMember] = useState(false);
  const [shared, setShared] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <div className="w-full p-3 sm:p-5 space-y-4">
      <button onClick={() => navigate("/pages")} className="flex items-center gap-1.5 text-sm text-gasra-text-secondary hover:text-gasra-text">
        <ArrowLeft size={16} /> {isAr ? "كل الصفحات" : "Toutes les pages"}
      </button>

      {/* Couverture + identité */}
      <div className="gasra-card-glass rounded-3xl overflow-hidden">
        <div className="relative h-40 sm:h-56" style={{ background: `linear-gradient(120deg, ${p0(page)}, ${page.cover[1]})` }}>
          <span className="page-cover-pattern absolute inset-0" />
          <span className="absolute inset-0 flex items-center justify-end pe-10 text-7xl sm:text-8xl opacity-30 select-none">{page.emoji}</span>
        </div>
        <div className="px-4 sm:px-6 pb-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 relative">
          <span className="page-logo -mt-12 sm:-mt-14 w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full flex items-center justify-center text-4xl">{page.emoji}</span>
          <div className="min-w-0 flex-1 sm:pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gasra-text tracking-tight">{page.name}</h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent">
                <BadgeCheck size={12} /> Officielle
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gasra-text-muted">
              <span>{isAr ? TYPE_LABEL[page.type].ar : TYPE_LABEL[page.type].fr}</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {page.place}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> {(page.followers + (following ? 1 : 0)).toLocaleString("fr-FR")} abonnés
              </span>
              <span className="flex items-center gap-1">
                <FileText size={12} /> {posts.length} publications
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:pt-3">
            <button onClick={() => setFollowing(!following)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold ${following ? "bg-gasra-surface-subtle text-gasra-text" : "btn-gasra-primary"}`}>
              {following ? <Check size={16} /> : <UserPlus size={16} />} {following ? "Abonné" : "Suivre"}
            </button>
            <button onClick={() => setMember(!member)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border ${member ? "border-gasra-accent/50 bg-gasra-accent/12 text-gasra-accent" : "border-gasra-surface-border bg-gasra-surface text-gasra-text"}`}>
              {member ? <ShieldCheck size={16} /> : <Shield size={16} />} {member ? "Membre" : "Devenir membre"}
            </button>
            <button onClick={share} className="p-2.5 rounded-xl hover:bg-gasra-surface-subtle" aria-label="Partager">
              {shared ? <Check size={17} /> : <Share2 size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="inline-grid grid-cols-3 p-1 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
        {[
          { id: "pubs" as const, fr: "Publications" },
          { id: "apropos" as const, fr: "À propos" },
          { id: "abonnes" as const, fr: "Abonnés" },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative z-10 px-4 py-2 text-sm font-semibold transition-colors ${active ? "text-gasra-text" : "text-gasra-text-muted hover:text-gasra-text"}`}>
              {active && <motion.span layoutId="pagedetail-tab" className="explore-tab-pill absolute inset-0 rounded-xl -z-10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              {t.fr}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === "pubs" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {posts.map((post) => (
                <PostCard key={post.id} page={page} post={post} />
              ))}
            </div>
          )}

          {tab === "apropos" && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface space-y-2">
                <h3 className="font-bold text-gasra-text">{isAr ? "حول الصفحة" : "Présentation"}</h3>
                <p className="text-sm text-gasra-text-secondary">
                  Page officielle « {page.name} » sur Gasra. Retrouve ici les annonces, événements et informations utiles pour les habitants de {page.place}.
                </p>
                {page.link && (
                  <Link to={page.link} className="inline-flex items-center gap-1.5 mt-1 px-3.5 py-2 rounded-xl btn-gasra-primary text-xs">
                    <Store size={14} /> Voir la vitrine et le bon
                  </Link>
                )}
              </div>
              <div className="p-4 rounded-2xl border border-gasra-surface-border bg-gasra-surface space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-gasra-text-secondary">
                  <MapPin size={15} /> {page.place}
                </div>
                <div className="flex items-center gap-2 text-gasra-text-secondary">
                  <Clock size={15} /> Dim – Jeu · 8h00 – 16h30
                </div>
                <div className="flex items-center gap-2 text-gasra-text-secondary">
                  <Phone size={15} /> 023 00 00 00
                </div>
                <div className="flex items-center gap-2 text-gasra-text-secondary">
                  <Globe size={15} /> gasra.dz/pages/{page.id}
                </div>
              </div>
            </div>
          )}

          {tab === "abonnes" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PEOPLE.map((p) => (
                <Link key={p.id} to="/amis" className="flex items-center gap-3 p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface hover:bg-gasra-surface-subtle transition-colors">
                  <PersonAvatar p={p} size={40} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-gasra-text truncate">{p.name}</span>
                    <span className="block text-[11px] text-gasra-text-muted">{p.wilaya}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const p0 = (p: OfficialPage) => p.cover[0];
