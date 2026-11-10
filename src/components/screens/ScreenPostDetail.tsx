import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, MessageCircle, Share2, Tag, Navigation, Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_POSTS, PostComment } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";
import { ReactionsBar } from "../common/ReactionsBar";
import { CoffeeModal } from "../common/CoffeeModal";

export const ScreenPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, language, user, triggerRaniJay } = useApp();
  const isAr = language === "ar";

  const post = posts.find((p) => p.id === id) || posts[0];
  const [comments, setComments] = useState<PostComment[]>(post.comments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: PostComment = {
      id: `c-${Date.now()}`,
      authorName: user.name,
      authorInitials: user.avatarInitials,
      authorLevelNumber: user.levelNumber,
      authorLevelTitle: user.levelTitleFr,
      timeAgo: "À l'instant",
      text: newCommentText.trim(),
      likesCount: 0,
    };

    setComments((prev) => [...prev, newComment]);
    setNewCommentText("");
  };

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gasra-surface-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text transition-colors"
          title={isAr ? "رجوع" : "Retour"}
        >
          {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </button>
        <div>
          <h2 className="text-sm font-bold text-gasra-text">
            {isAr ? "تفاصيل المنشور والتعليقات" : "Détail de la publication"}
          </h2>
          <span className="text-[11px] text-gasra-text-muted">
            {post.currentWilaya} · {post.timeAgo}
          </span>
        </div>
      </div>

      {/* Main Post Card */}
      <article className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-4">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <Link to={`/profil/${post.authorId}`} className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl btn-gasra-primary flex items-center justify-center font-bold text-sm">
              {post.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gasra-text hover:underline">
                  {post.authorName}
                </h3>
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
          </Link>

          {post.coffeeTipsDA > 0 && (
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
              ☕ {post.coffeeTipsDA} DA
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-gasra-text leading-relaxed mb-4">
          {isAr ? post.contentAr : post.contentFr}
        </p>

        {/* Attached Deal Preview */}
        {post.dealRef && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-bold text-xs text-gasra-text">
                {post.dealRef.businessName}
              </span>
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
                className="px-3 py-1.5 rounded-xl btn-gasra-primary font-bold text-xs shadow-xs"
              >
                {isAr ? "راني جاي" : "Rani jay"}
              </button>
            </div>
          </div>
        )}

        {/* Reactions Bar */}
        <ReactionsBar
          postId={post.id}
          reactions={post.reactions}
          userReaction={post.userReaction}
          onCoffeeClick={() => setCoffeeModalOpen(true)}
        />
      </article>

      {/* Comments Section */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
          <MessageCircle size={14} />
          <span>{isAr ? `التعليقات (${comments.length})` : `Commentaires (${comments.length})`}</span>
        </h4>

        {/* Comments List */}
        <div className="space-y-2">
          {comments.map((comm) => (
            <div
              key={comm.id}
              className="p-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-xs shadow-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gasra-surface-subtle flex items-center justify-center font-bold text-[11px] text-gasra-text">
                    {comm.authorInitials}
                  </div>
                  <span className="font-bold text-gasra-text">{comm.authorName}</span>
                  <LevelBadge levelNumber={comm.authorLevelNumber} size="sm" />
                </div>
                <span className="text-[10px] text-gasra-text-muted">{comm.timeAgo}</span>
              </div>
              <p className="text-gasra-text leading-relaxed ps-9">{comm.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleAddComment} className="flex items-center gap-2 sticky bottom-16 bg-gasra-bg pt-2">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={
            isAr
              ? "اكتب تعليقا أو شارك نصيحة مع أهل الحومة..."
              : "Écrire un commentaire aux voisins..."
          }
          className="flex-1 p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-xs text-gasra-text outline-none focus:border-[#3D5AFE]"
        />
        <button
          type="submit"
          className="p-3 rounded-2xl btn-gasra-primary shadow-xs hover:opacity-90 transition-opacity shrink-0"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Coffee Modal */}
      {coffeeModalOpen && (
        <CoffeeModal
          isOpen={coffeeModalOpen}
          onClose={() => setCoffeeModalOpen(false)}
          recipientName={post.authorName}
          postId={post.id}
        />
      )}
    </div>
  );
};
