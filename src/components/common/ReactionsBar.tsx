import React, { useState } from "react";
import { GASRA_REACTIONS, Reaction } from "../../data/mockData";
import { ReactionIcon } from "./ReactionIcon";
import { useApp } from "../../context/AppContext";

interface ReactionsBarProps {
  postId: string;
  reactions: Record<string, number>;
  userReaction?: string;
  allowRaniJay?: boolean;
  onCoffeeClick?: () => void;
  className?: string;
}

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  postId,
  reactions,
  userReaction,
  allowRaniJay = true,
  onCoffeeClick,
  className = "",
}) => {
  const { reactToPost, language } = useApp();
  const [showPicker, setShowPicker] = useState(false);
  const isAr = language === "ar";

  const availableReactions = allowRaniJay
    ? GASRA_REACTIONS
    : GASRA_REACTIONS.filter((r) => r.id !== "rani_jay");

  const defaultReaction = GASRA_REACTIONS.find((r) => r.id === "ya3tik_saha")!;
  const activeReactionObj = GASRA_REACTIONS.find((r) => r.id === userReaction);

  return (
    <div className={`no-gradient-zone relative flex flex-wrap items-center justify-between gap-1 pt-2.5 border-t border-gasra-surface-border text-xs ${className}`}>
      {/* Active Reactions Counter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 py-1">
        {Object.entries(reactions)
          .filter(([, count]) => count > 0)
          .map(([id, count]) => {
            const rx = GASRA_REACTIONS.find((r) => r.id === id);
            const isUserSelected = userReaction === id;
            if (!rx) return null;
            return (
              <button
                key={id}
                onClick={() => reactToPost(postId, id)}
                title={`${isAr ? rx.labelAr : rx.labelFr} — ${rx.descriptionFr}`}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  isUserSelected
                    ? "bg-gasra-accent text-gasra-on-accent shadow-xs"
                    : "bg-gasra-surface-subtle text-gasra-text-secondary hover:text-gasra-accent hover:bg-gasra-accent/10 border border-gasra-surface-border"
                }`}
              >
                <ReactionIcon id={id} size={14} />
                <span>{isAr ? rx.labelAr : rx.labelFr}</span>
                <span className="font-mono text-[10px] opacity-90">{count}</span>
              </button>
            );
          })}
      </div>

      {/* Action Buttons: React Trigger + Coffee Tip */}
      <div className="flex items-center gap-1.5 ms-auto">
        {/* Main React Button with Picker */}
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
              userReaction
                ? "border-gasra-accent bg-gasra-accent/15 text-gasra-accent"
                : "border-gasra-surface-border bg-gasra-surface hover:border-gasra-accent text-gasra-text"
            }`}
          >
            {userReaction ? (
              <>
                <ReactionIcon id={userReaction} size={15} />
                <span>{isAr ? activeReactionObj?.labelAr : activeReactionObj?.labelFr}</span>
              </>
            ) : (
              <>
                <ReactionIcon id="ya3tik_saha" size={15} />
                <span>{isAr ? defaultReaction.labelAr : defaultReaction.labelFr}</span>
              </>
            )}
          </button>

          {/* Reaction Picker Flyout */}
          {showPicker && (
            <div
              className="absolute bottom-full mb-2 start-0 z-40 flex items-center gap-1 p-2 bg-gasra-surface border border-gasra-accent/40 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
              style={{ minWidth: "270px" }}
            >
              {availableReactions.map((r: Reaction) => {
                const isSelected = userReaction === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      reactToPost(postId, r.id);
                      setShowPicker(false);
                    }}
                    title={`${isAr ? r.labelAr : r.labelFr} : ${r.descriptionFr}`}
                    className={`group relative flex flex-col items-center p-1.5 rounded-xl transition-all transform hover:scale-125 ${
                      isSelected ? "bg-gasra-accent/20 ring-1 ring-gasra-accent" : "hover:bg-gasra-accent/10"
                    }`}
                  >
                    <ReactionIcon id={r.id} size={22} />
                    <span className="text-[9px] text-gasra-text-muted mt-0.5 truncate max-w-[42px] font-semibold">
                      {isAr ? r.labelAr : r.labelFr}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 9ahwa Tal3a */}
        {onCoffeeClick && (
          <button
            onClick={onCoffeeClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition-all font-bold text-xs"
            title="Soutenir avec un pourboire de 50 à 200 DA"
          >
            <span>☕</span>
            <span className="hidden sm:inline">{isAr ? "قهوة" : "9ahwa Tal3a"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
