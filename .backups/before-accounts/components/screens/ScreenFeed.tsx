import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Plus,
  MessageCircle,
  Share2,
  Calendar,
  Sparkles,
  TrendingUp,
  Tag,
  CheckCircle,
  Clock,
  Compass,
  Users,
  Layers,
  Store,
  Target,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_PULSE, Post } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";
import { ReactionsBar } from "../common/ReactionsBar";
import { CoffeeModal } from "../common/CoffeeModal";
import { EllamaLiveModal } from "../common/EllamaLiveModal";
import { MissionsHoumaList } from "../common/MissionsHoumaList";

// Stories / Status data inspired by the user's screenshot
interface StoryItem {
  id: string;
  name: string;
  avatar: string;
  hasUnseen: boolean;
  isAdd?: boolean;
}

const STORIES: StoryItem[] = [
  { id: "add", name: "Ajouter une story", avatar: "", hasUnseen: false, isAdd: true },
  { id: "ines", name: "Ines", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", hasUnseen: true },
  { id: "samy", name: "Samy (Bab Ezzouar)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", hasUnseen: true },
  { id: "leila", name: "Leïla (Oran)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", hasUnseen: false },
  { id: "karim", name: "Karim (Ghardaïa)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", hasUnseen: false },
];

export const ScreenFeed: React.FC = () => {
  const { posts, currentWilaya, currentQuartier, language, triggerRaniJay } = useApp();
  const [ellamaOpen, setEllamaOpen] = useState(false);
  const isAr = language === "ar";

  const [activePrimaryFilter, setActivePrimaryFilter] = useState<"pour_toi" | "quartier" | "cercles" | "decouvertes">("pour_toi");
  const [activeSubFilter, setActiveSubFilter] = useState<string>("tous");
  const [coffeeModalTarget, setCoffeeModalTarget] = useState<Post | null>(null);
  const [claimedDealId, setClaimedDealId] = useState<string | null>(null);

  const pulse = MOCK_PULSE;

  const filteredPosts = posts.filter((post) => {
    if (activeSubFilter === "commerces" && !post.dealRef) return false;
    if (activeSubFilter === "quartier" && !post.currentWilaya.includes("16")) return false;
    if (activeSubFilter === "missions" && !post.dealRef && !post.contentFr.toLowerCase().includes("bon")) return false;
    if (activePrimaryFilter === "quartier" && !post.currentWilaya.includes("16")) return false;
    if (activePrimaryFilter === "cercles" && post.isBerrani) return false;
    if (activePrimaryFilter === "decouvertes" && !post.isBerrani && !post.dealRef) return false;
    return true;
  });

  const displayPosts = filteredPosts.length > 0 ? filteredPosts : posts;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 p-3 sm:p-5">
      {/* Center Feed Column */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Top Header & Stories Bar (Matching User's Screenshot) */}
        <div className="gasra-card-glass rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="min-w-0 text-xl sm:text-2xl font-black text-gasra-text tracking-tight flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span>{isAr ? "شريط الأخبار" : "Fil d'actualité"}</span>
              <span className="w-fit max-w-full truncate text-[11px] sm:text-xs font-medium tracking-normal px-2.5 py-0.5 rounded-full bg-gasra-accent/12 text-gasra-accent">
                {currentQuartier} · {currentWilaya}
              </span>
            </h1>
            <button
              onClick={() => setEllamaOpen(true)}
              className="ellama-cta no-gradient-border shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-black tracking-[0.14em]"
              title="ELLAMA"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-white" />
              </span>
              ELLAMA
            </button>
          </div>

          {/* Stories Horizontal Reel with cycling animated gradient rings */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {STORIES.map((story) => (
              <div
                key={story.id}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-transform duration-200 group-hover:scale-105 flex items-center justify-center ${
                      story.isAdd
                        ? "border-2 border-dashed border-gasra-accent bg-gasra-accent/10 hover:bg-gasra-accent/20"
                        : story.hasUnseen
                        ? "story-ring-animated story-ring-glow p-[3px]"
                        : "story-ring-animated p-[2px]"
                    }`}
                  >
                    {story.isAdd ? (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-gasra-accent icon-animated-gradient">
                        <Plus size={22} />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full p-0.5 bg-gasra-surface overflow-hidden">
                        <img
                          src={story.avatar}
                          alt={story.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Story badge indicator as in reference screenshot */}
                  {!story.isAdd && story.hasUnseen && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gasra-accent text-gasra-on-accent border-2 border-white dark:border-gasra-surface flex items-center justify-center text-[10px] font-black shadow-xs">
                      +
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-gasra-text truncate max-w-[70px] text-center">
                  {story.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Filter Chips: Pour toi, Mon quartier, Mes cercles, Découvertes with icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: "pour_toi", labelFr: "Pour toi", labelAr: "لك", icon: Sparkles },
            { id: "quartier", labelFr: "Mon quartier", labelAr: "حومتي", icon: MapPin },
            { id: "cercles", labelFr: "Mes cercles", labelAr: "دوائري", icon: Users },
            { id: "decouvertes", labelFr: "Découvertes", labelAr: "اكتشافات", icon: Compass },
          ].map((item) => {
            const Icon = item.icon;
            const active = activePrimaryFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePrimaryFilter(item.id as typeof activePrimaryFilter)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl transition-all shrink-0 ${
                  active
                    ? "btn-gasra-primary gasra-chip-active shadow-sm"
                    : "gasra-card-glass text-gasra-text-secondary hover:text-gasra-accent"
                }`}
              >
                <Icon size={14} className={active ? "text-gasra-on-accent" : "text-gasra-accent"} />
                <span>{isAr ? item.labelAr : item.labelFr}</span>
              </button>
            );
          })}
        </div>

        {/* Sub Category Chips with icons: Tous, Quartier, Commerces, Missions, Apprentissage, Institutions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold scrollbar-none">
          {[
            { id: "tous", fr: "Tous", ar: "الكل", icon: Layers },
            { id: "quartier", fr: "Quartier", ar: "الحومة", icon: MapPin },
            { id: "commerces", fr: "Commerces", ar: "المتاجر", icon: Store },
            { id: "missions", fr: "Missions", ar: "المهام", icon: Target },
            { id: "apprentissage", fr: "Apprentissage", ar: "التعليم", icon: GraduationCap },
            { id: "institutions", fr: "Institutions", ar: "المؤسسات", icon: Building2 },
          ].map((sub) => {
            const Icon = sub.icon;
            const active = activeSubFilter === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubFilter(sub.id)}
                className={`subfilter-tab relative flex items-center gap-1.5 px-2.5 py-1.5 transition-colors shrink-0 ${
                  active ? "is-active text-gasra-text" : "text-gasra-text-secondary hover:text-gasra-text"
                }`}
              >
                <Icon size={12} />
                <span>{isAr ? sub.ar : sub.fr}</span>
              </button>
            );
          })}
        </div>

        {/* Posts Feed Grid / Column */}
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="gasra-card-glass rounded-3xl p-4 sm:p-5 shadow-sm hover:border-gasra-accent/40 transition-all"
            >
              {/* Author Row */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <Link to={`/profil/${post.authorId}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-2xl bg-gasra-accent text-gasra-on-accent flex items-center justify-center font-black text-sm shadow-xs">
                    {post.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="font-bold text-sm text-gasra-text group-hover:text-gasra-accent transition-colors whitespace-nowrap">
                        {post.authorName}
                      </h3>
                      <LevelBadge
                        levelNumber={post.authorLevel.levelNumber}
                        isBerrani={post.isBerrani}
                        hasPrimeBerrani={post.isBerrani}
                        size="sm"
                      />
                    </div>
                    <div className="text-[11px] text-gasra-text-muted flex items-center gap-1.5 mt-0.5">
                      <span>{post.currentWilaya}</span>
                      <span>·</span>
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </Link>

                {post.coffeeTipsDA > 0 && (
                  <span className="shrink-0 whitespace-nowrap text-xs font-mono font-bold text-gasra-on-accent bg-gasra-accent px-2.5 py-1 rounded-xl shadow-xs">
                    ☕ {post.coffeeTipsDA} DA
                  </span>
                )}
              </div>

              {/* Post Text */}
              <Link to={`/post/${post.id}`} className="block mb-3">
                <p className="text-sm sm:text-base text-gasra-text leading-relaxed">
                  {isAr ? post.contentAr : post.contentFr}
                </p>
              </Link>

              {/* Deal / Promo Card (Gasra local voucher) */}
              {post.dealRef && (
                <div className="mb-4 p-4 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Link
                      to="/commerce/biz-1"
                      className="text-xs font-bold text-gasra-text hover:text-gasra-accent"
                    >
                      {post.dealRef.businessName}
                    </Link>
                    <span className="px-2.5 py-0.5 rounded-full bg-gasra-accent text-gasra-on-accent font-black text-xs">
                      {post.dealRef.discount}
                    </span>
                  </div>

                  <Link to={`/post/${post.id}`}>
                    <div className="w-full h-32 rounded-xl bg-hatched border border-gasra-surface-border flex items-center justify-center text-xs text-gasra-text-muted mb-3 font-semibold">
                      [Photo : {post.dealRef.titleFr}]
                    </div>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono font-black text-base text-gasra-accent">
                        {post.dealRef.dealPrice} DA
                        <span className="text-xs line-through text-gasra-text-muted ms-2 font-normal">
                          {post.dealRef.originalPrice} DA
                        </span>
                      </div>
                      <div className="text-[10px] text-gasra-text-secondary">
                        Gain créateur : <strong className="text-gasra-text font-mono">{post.dealRef.creatorCommissionDA} DA</strong> / scan
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerRaniJay(post.id)}
                        className="px-3 py-1.5 rounded-xl border border-gasra-accent text-gasra-accent hover:bg-gasra-accent/15 font-bold text-xs transition-colors"
                        title="Signaler votre visite prochaine"
                      >
                        {isAr ? "راني جاي" : "Rani jay"}
                      </button>

                      <button
                        onClick={() => setClaimedDealId(post.dealRef!.id)}
                        className="px-3.5 py-1.5 rounded-xl btn-gasra-primary text-xs shadow-xs"
                      >
                        {claimedDealId === post.dealRef.id
                          ? isAr ? "تم الحصول عليه ✓" : "Bon obtenu ✓"
                          : isAr ? "أخذ البون" : "Prendre le bon"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments counter */}
              <div className="flex items-center justify-between text-xs text-gasra-text-muted pb-2">
                <Link to={`/post/${post.id}`} className="hover:text-gasra-accent flex items-center gap-1.5 font-medium">
                  <MessageCircle size={14} />
                  <span>{post.comments ? post.comments.length : post.commentsCount} commentaires</span>
                </Link>
                <span>{post.sharesCount} partages</span>
              </div>

              {/* Authentic Algerian Reactions Bar strictly styled with l'accent Gasra */}
              <ReactionsBar
                postId={post.id}
                reactions={post.reactions}
                userReaction={post.userReaction}
                allowRaniJay={true}
                onCoffeeClick={() => setCoffeeModalTarget(post)}
              />
            </article>
          ))}
        </div>
      </div>

      {/* Right Column: Événements locaux, Tendances & Recommandations (Matching User's Screenshot) */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">
        {/* Événements locaux card */}
        <div className="gasra-card-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-gasra-text tracking-tight flex items-center gap-1.5">
              <Calendar size={16} className="text-gasra-accent" />
              <span>{isAr ? "الفعاليات المحلية" : "Événements locaux"}</span>
            </h3>
            <span className="text-[10px] text-gasra-text-muted font-bold">Oran / Alger</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border">
              <div className="h-24 rounded-xl bg-cover bg-center mb-2 overflow-hidden relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80')" }}>
                <span className="absolute top-2 start-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-gasra-accent text-gasra-on-accent">
                  Musique
                </span>
              </div>
              <h4 className="text-xs font-bold text-gasra-text leading-snug">
                Festival de la Musique d'Oran
              </h4>
              <p className="text-[11px] text-gasra-text-muted mb-2">22 Août 2026 · Théâtre de Verdure</p>
              <button className="w-full py-1.5 rounded-xl btn-gasra-primary text-xs font-bold">
                M'inscrire
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border">
              <div className="h-24 rounded-xl bg-cover bg-center mb-2 overflow-hidden relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=400&q=80')" }}>
                <span className="absolute top-2 start-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-gasra-accent text-gasra-on-accent">
                  Sport
                </span>
              </div>
              <h4 className="text-xs font-bold text-gasra-text leading-snug">
                Marathon Universitaire
              </h4>
              <p className="text-[11px] text-gasra-text-muted mb-2">28 Août 2026 · Front de mer</p>
              <button className="w-full py-1.5 rounded-xl btn-gasra-primary text-xs font-bold">
                M'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Tendances à Oran / Alger */}
        <div className="gasra-card-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <h3 className="font-black text-sm text-gasra-text tracking-tight flex items-center gap-1.5">
            <TrendingUp size={16} className="text-gasra-accent" />
            <span>{isAr ? "الترند في وهران" : "Tendances à Oran"}</span>
          </h3>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {["#Tendances à Oran", "#hant_fight", "#commerloo", "#porithen", "#oran", "#SantaCruz", "#BonsGasra"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-xl bg-gasra-surface-subtle text-gasra-text-secondary font-medium cursor-pointer hover:text-gasra-accent transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Missions de la Houma Section (Just before Recommandations) — sur mobile : tiroir latéral (MobileMissionsDrawer) */}
        <div className="hidden lg:block gasra-card-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-gasra-text tracking-tight flex items-center gap-1.5">
              <Target size={16} className="text-gasra-accent" />
              <span>{isAr ? "مهام الحومة" : "Missions de la Houma"}</span>
            </h3>
            <Link
              to="/missions"
              className="text-[11px] font-bold text-gasra-accent hover:underline flex items-center gap-0.5"
            >
              <span>{isAr ? "عرض الكل" : "Voir tout"}</span>
              <span className="text-xs">→</span>
            </Link>
          </div>

          <MissionsHoumaList />
        </div>

        {/* Recommandations */}
        <div className="gasra-card-glass rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <h3 className="font-black text-sm text-gasra-text tracking-tight flex items-center gap-1.5">
            <Sparkles size={16} className="text-gasra-accent" />
            <span>{isAr ? "اقتراحات لك" : "Recommandations"}</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { name: "Bakeraria local", sub: "Boulangerie artisanale · Il y a 8 mois", avatar: "🥐" },
              { name: "Organisation Étudiante Pmo", sub: "Club universitaire · Il y a 5 mois", avatar: "🎓" },
              { name: "Café des Artistes", sub: "Khemisti · 4.8 étoiles", avatar: "☕" },
            ].map((rec, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-2xl hover:bg-gasra-surface-subtle transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gasra-surface-subtle border border-gasra-surface-border flex items-center justify-center text-sm">
                    {rec.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gasra-text">{rec.name}</div>
                    <div className="text-[10px] text-gasra-text-muted truncate max-w-[130px]">{rec.sub}</div>
                  </div>
                </div>
                <button className="px-3 py-1 rounded-xl btn-gasra-primary text-[11px] font-bold">
                  Suivre
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ELLAMA — démo de live */}
      <EllamaLiveModal isOpen={ellamaOpen} onClose={() => setEllamaOpen(false)} />

      {/* Coffee Tip Modal */}
      {coffeeModalTarget && (
        <CoffeeModal
          isOpen={!!coffeeModalTarget}
          onClose={() => setCoffeeModalTarget(null)}
          recipientName={coffeeModalTarget.authorName}
          postId={coffeeModalTarget.id}
        />
      )}
    </div>
  );
};
