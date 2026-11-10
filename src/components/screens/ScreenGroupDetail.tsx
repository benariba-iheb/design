import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Users, Shield, MapPin, Plus, Check, MessageSquare, ArrowLeft, ArrowRight, Share2, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_GROUPS, MOCK_POSTS } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";
import { ReactionsBar } from "../common/ReactionsBar";

export const ScreenGroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, user } = useApp();
  const isAr = language === "ar";

  const group = MOCK_GROUPS.find((g) => g.id === id) || MOCK_GROUPS[0];
  const [isJoined, setIsJoined] = useState(true);
  const [activeTab, setActiveTab] = useState<"feed" | "rules" | "members">("feed");
  const [postText, setPostText] = useState("");
  const [localPosts, setLocalPosts] = useState(MOCK_POSTS.slice(0, 2));

  const handleCreateGroupPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    const newP = {
      ...MOCK_POSTS[0],
      id: `p-${Date.now()}`,
      authorName: user.name,
      contentFr: postText,
      contentAr: postText,
      timeAgo: "À l'instant",
      reactions: { ya3tik_saha: 1 },
      dealRef: undefined,
      comments: [],
    };

    setLocalPosts((prev) => [newP, ...prev]);
    setPostText("");
  };

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Header with back navigation */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gasra-surface-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text"
        >
          {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </button>
        <span className="text-xs font-bold text-gasra-text truncate max-w-[200px]">
          {group.name}
        </span>
        <button className="p-2 rounded-xl bg-gasra-surface-subtle text-gasra-text-secondary">
          <Share2 size={16} />
        </button>
      </div>

      {/* Group Hero Cover Card */}
      <div className="p-5 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-4">
        {/* Banner */}
        <div className="w-full h-28 rounded-2xl bg-hatched border border-gasra-surface-border flex items-center justify-center text-xs text-gasra-text-muted mb-4">
          <span className="bg-gasra-surface/80 px-3 py-1 rounded-full backdrop-blur-xs font-mono">
            [Bannière : {group.bannerHatched}]
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h1 className="text-lg font-black text-gasra-text leading-tight">
              {group.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-gasra-text-muted mt-1">
              <MapPin size={13} className="text-[#E0503A]" />
              <span>{group.wilaya} · {group.commune}</span>
            </div>
          </div>

          <button
            onClick={() => setIsJoined(!isJoined)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isJoined
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "btn-gasra-primary shadow-xs"
            }`}
          >
            {isJoined ? (
              <>
                <Check size={14} />
                <span>{isAr ? "عضو" : "Membre"}</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>{isAr ? "انضمام" : "Rejoindre"}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gasra-text-secondary leading-relaxed mb-3">
          {isAr ? group.descriptionAr : group.descriptionFr}
        </p>

        <div className="flex items-center gap-3 text-xs text-gasra-text-muted pt-2 border-t border-gasra-surface-border">
          <span className="flex items-center gap-1">
            <Users size={13} />
            <strong className="text-gasra-text">{group.membersCount.toLocaleString()}</strong> membres
          </span>
          <span>·</span>
          <span>
            <strong className="text-gasra-text">{group.postsCount}</strong> publications
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === "feed" ? "btn-gasra-primary shadow-xs" : "bg-gasra-surface text-gasra-text-secondary"
          }`}
        >
          {isAr ? "المنشورات" : "Discussions"}
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === "rules" ? "btn-gasra-primary shadow-xs" : "bg-gasra-surface text-gasra-text-secondary"
          }`}
        >
          {isAr ? "قوانين الحومة" : "Règles du groupe"}
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-3 py-1.5 rounded-full transition-all ${
            activeTab === "members" ? "btn-gasra-primary shadow-xs" : "bg-gasra-surface text-gasra-text-secondary"
          }`}
        >
          {isAr ? "الأعضاء" : "Membres"}
        </button>
      </div>

      {/* Tab 1: Discussions & Post Form */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          {/* Post into group */}
          <form onSubmit={handleCreateGroupPost} className="p-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border shadow-xs flex items-center gap-2">
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={
                isAr
                  ? "شارك خبرا أو مساعدة مع أعضاء المجموعة..."
                  : "Partager une info ou une entraide dans le groupe..."
              }
              className="flex-1 bg-gasra-surface-subtle p-2.5 rounded-xl text-xs text-gasra-text outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl btn-gasra-primary text-xs font-bold shadow-xs shrink-0"
            >
              {isAr ? "نشر" : "Publier"}
            </button>
          </form>

          {/* Group Feed */}
          <div className="space-y-3">
            {localPosts.map((p) => (
              <div key={p.id} className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gasra-text">{p.authorName}</span>
                    <LevelBadge levelNumber={p.authorLevel.levelNumber} size="sm" />
                  </div>
                  <span className="text-[10px] text-gasra-text-muted">{p.timeAgo}</span>
                </div>
                <p className="text-gasra-text leading-relaxed">
                  {isAr ? p.contentAr : p.contentFr}
                </p>
                <ReactionsBar postId={p.id} reactions={p.reactions} userReaction={p.userReaction} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Group Rules */}
      {activeTab === "rules" && (
        <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs text-xs space-y-3">
          <h3 className="font-bold text-sm text-gasra-text flex items-center gap-1.5">
            <Shield size={16} className="text-[#3D5AFE]" />
            <span>{isAr ? "ميثاق وقوانين المجموعة" : "Charte de confiance du quartier"}</span>
          </h3>
          <ul className="space-y-2 text-gasra-text-secondary">
            {group.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-gasra-surface-subtle">
                <span className="font-bold text-gasra-text">0{idx + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 3: Group Members */}
      {activeTab === "members" && (
        <div className="space-y-2">
          {["Amine Rezgui", "Karim Benchikh", "Yacine B.", "Nassim Kouba"].map((m, i) => (
            <div key={m} className="p-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl btn-gasra-primary flex items-center justify-center font-bold text-xs">
                  {m.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="font-bold text-gasra-text">{m}</span>
              </div>
              <LevelBadge levelNumber={i === 1 ? 3 : 2} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
