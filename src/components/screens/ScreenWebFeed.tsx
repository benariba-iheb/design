import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Award,
  Wallet,
  Tag,
  Zap,
  TrendingUp,
  Image,
  Share2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_PULSE, MOCK_DEALS, Post } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";
import { ReactionsBar } from "../common/ReactionsBar";
import { CoffeeModal } from "../common/CoffeeModal";

export const ScreenWebFeed: React.FC = () => {
  const { user, posts, currentWilaya, currentQuartier, language, triggerRaniJay } = useApp();
  const isAr = language === "ar";
  const [coffeeModalTarget, setCoffeeModalTarget] = useState<Post | null>(null);
  const pulse = MOCK_PULSE;

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-gasra-bg text-gasra-text py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE (Col 1-3, 280-300px) : Profil & Réputation */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Identity card */}
          <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#14303B] dark:text-[#E4FF3C] flex items-center justify-center font-bold text-lg">
                {user.avatarInitials}
              </div>
              <div className="truncate">
                <h3 className="font-bold text-sm text-gasra-text truncate">{user.name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-gasra-text-muted">
                  <MapPin size={11} className="text-[#E0503A]" />
                  <span className="truncate">{user.commune}</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <LevelBadge levelNumber={user.levelNumber} size="sm" />
            </div>

            <div className="p-3.5 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border mb-3">
              <div className="text-[10px] text-gasra-text-secondary font-semibold uppercase tracking-wider">
                {isAr ? "رصيد المحفظة بالدينار" : "Solde disponible"}
              </div>
              <div className="text-xl font-mono font-black text-gasra-text mt-0.5">
                {user.walletBalanceDA.toLocaleString()} DA
              </div>
            </div>

            <div className="space-y-1 text-xs font-medium text-gasra-text-secondary">
              <Link
                to="/profil"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gasra-surface-subtle transition-colors"
              >
                <span>{isAr ? "الملف الشخصي" : "Mon profil & réputations"}</span>
                <ChevronRight size={14} />
              </Link>
              <Link
                to="/portefeuille"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gasra-surface-subtle transition-colors"
              >
                <span>{isAr ? "سحب إلى البطاقة الذهبية" : "Retirer vers Edahabia"}</span>
                <ChevronRight size={14} />
              </Link>
              <Link
                to="/creer"
                className="flex items-center justify-between p-2 rounded-xl hover:bg-gasra-surface-subtle transition-colors text-[#3D5AFE] dark:text-[#6F86FF] font-semibold"
              >
                <span>{isAr ? "ترويج بون جديد (+DA)" : "Promouvoir un bon (+DA)"}</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Wilaya Status */}
          <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs text-xs">
            <h4 className="font-bold text-gasra-text mb-2">
              {isAr ? "السمعة المحلية" : "Territoire d'ancrage"}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-gasra-surface-subtle">
                <span className="font-bold">16 - Alger</span>
                <span className="text-[#3D5AFE] font-bold">Weld el Houma (490 pts)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-gasra-surface-subtle">
                <span className="font-bold">31 - Oran</span>
                <span className="text-amber-600 font-bold">Berrani (+50% prime)</span>
              </div>
            </div>
          </div>
        </aside>

        {/* COLONNE CENTRALE (Col 4-8, ~640px) : Pouls & Fil d'actualité */}
        <main className="lg:col-span-6 space-y-4">
          {/* Le Pouls du quartier */}
          <div className="p-4 rounded-3xl bg-gasra-surface border-2 border-gasra-surface-border shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E0503A] animate-pulse" />
                <h3 className="font-bold text-sm text-gasra-text">
                  {isAr ? "نبض الحي اليوم" : "Le Pouls du quartier"} — {currentQuartier}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gasra-text-muted">Direct</span>
            </div>

            <div className="space-y-2 mb-3">
              {pulse.news.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-gasra-surface-subtle text-xs flex items-start gap-2"
                >
                  <span className="font-mono text-[10px] font-bold text-[#3D5AFE] bg-gasra-surface px-1.5 py-0.5 rounded">
                    {item.tag}
                  </span>
                  <p className="text-[11px] leading-snug">{isAr ? item.textAr : item.textFr}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Create Box */}
          <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gasra-surface-subtle flex items-center justify-center font-bold text-sm">
              AR
            </div>
            <Link
              to="/creer"
              className="flex-1 p-2.5 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-xs text-gasra-text-muted transition-colors"
            >
              {isAr
                ? "واش كاين جديد في الحومة ؟ روّج بون أو اكتب رأي..."
                : "Quoi de neuf dans la houma ? Partagez un bon plan ou un avis..."}
            </Link>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl bg-gasra-surface border border-gasra-surface-border p-5 shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#14303B] dark:text-[#E4FF3C] flex items-center justify-center font-bold text-sm">
                      {post.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gasra-text">{post.authorName}</h4>
                        <LevelBadge
                          levelNumber={post.authorLevel.levelNumber}
                          isBerrani={post.isBerrani}
                          size="sm"
                        />
                      </div>
                      <div className="text-[11px] text-gasra-text-muted">
                        {post.currentWilaya} · {post.timeAgo}
                      </div>
                    </div>
                  </div>

                  {post.coffeeTipsDA > 0 && (
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200">
                      ☕ {post.coffeeTipsDA} DA
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gasra-text leading-relaxed mb-3">
                  {isAr ? post.contentAr : post.contentFr}
                </p>

                {post.dealRef && (
                  <div className="mb-3 p-3.5 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs">{post.dealRef.businessName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E0503A] text-white font-bold text-xs">
                        {post.dealRef.discount}
                      </span>
                    </div>

                    <div className="w-full h-32 rounded-xl bg-hatched border border-gasra-surface-border flex items-center justify-center text-xs text-gasra-text-muted mb-2">
                      [Photo esquisse : {post.dealRef.titleFr}]
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#3D5AFE] dark:text-[#6F86FF]">
                          {post.dealRef.dealPrice} DA
                        </span>
                        <span className="text-[10px] line-through text-gasra-text-muted ms-1.5">
                          {post.dealRef.originalPrice} DA
                        </span>
                      </div>
                      <button
                        onClick={() => triggerRaniJay(post.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] font-bold text-xs"
                      >
                        {isAr ? "راني جاي" : "Rani jay"}
                      </button>
                    </div>
                  </div>
                )}

                <ReactionsBar
                  postId={post.id}
                  reactions={post.reactions}
                  userReaction={post.userReaction}
                  onCoffeeClick={() => setCoffeeModalTarget(post)}
                />
              </article>
            ))}
          </div>
        </main>

        {/* COLONNE DROITE (Col 9-12, ~320-340px) : Bons du coin & Missions */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Mini Interactive Map Preview */}
          <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs">
            <div className="flex items-center justify-between mb-2 text-xs font-bold">
              <span>{isAr ? "خريطة الحومة" : "Carte du quartier"}</span>
              <Link to="/explorer" className="text-[#3D5AFE] text-[11px] hover:underline">
                Agrandir
              </Link>
            </div>
            <div className="w-full h-36 rounded-2xl bg-hatched border border-gasra-surface-border relative overflow-hidden flex flex-col items-center justify-center text-center p-2 text-xs text-gasra-text-muted">
              <MapPin size={22} className="text-[#E0503A] mb-1 animate-bounce" />
              <span className="font-bold text-gasra-text">Bab Ezzouar</span>
              <span className="text-[10px]">4 bons & 2 missions autour de vous</span>
            </div>
          </div>

          {/* Top Bons Actifs */}
          <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gasra-text-secondary mb-3 flex items-center gap-1.5">
              <Tag size={13} className="text-[#3D5AFE]" />
              <span>{isAr ? "بونات شائعة الآن" : "Bons populaires du coin"}</span>
            </h4>
            <div className="space-y-2">
              {MOCK_DEALS.map((d) => (
                <div key={d.id} className="p-2.5 rounded-xl bg-gasra-surface-subtle text-xs">
                  <div className="flex items-center justify-between font-bold mb-0.5">
                    <span className="truncate">{d.businessName}</span>
                    <span className="text-[#E0503A] font-mono">{d.discount}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gasra-text-muted">
                    <span>{d.dealPrice} DA</span>
                    <span className="text-[#3D5AFE] font-mono">+{d.creatorCommissionDA} DA/scan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cagnotte de Wilaya */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-[#0B1E26] to-[#14303B] text-white border border-[#234E5E] shadow-sm">
            <div className="text-[10px] font-mono text-[#E4FF3C] uppercase tracking-wider mb-1">
              Cagnotte Territoriale (16 - Alger)
            </div>
            <div className="text-xl font-mono font-black text-white mb-2">
              450 000 DA
            </div>
            <p className="text-[11px] text-[#9DB4BB] leading-snug">
              Redistribués chaque dimanche aux contributeurs et voisins actifs selon leur niveau.
            </p>
          </div>
        </aside>
      </div>

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
