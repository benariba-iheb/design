import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Coins,
  Coffee,
  Award,
  Tag,
  CheckCheck,
  Check,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { GasraNotification } from "../../data/mockData";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    language,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useApp();
  const isAr = language === "ar";
  const [filter, setFilter] = useState<"all" | "money" | "coffee" | "houma">("all");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Close on outside click or ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "money") return n.type === "money";
    if (filter === "coffee") return n.type === "coffee";
    if (filter === "houma") return n.type === "level" || n.type === "deal";
    return true;
  });

  const getIcon = (type: GasraNotification["type"]) => {
    switch (type) {
      case "money":
        return <Coins size={16} className="text-gasra-accent" />;
      case "coffee":
        return <Coffee size={16} className="text-amber-400" />;
      case "level":
        return <Award size={16} className="text-gasra-accent" />;
      case "deal":
        return <Tag size={16} className="text-gasra-accent" />;
      default:
        return <Bell size={16} className="text-gasra-text" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl gasra-card-glass border border-gasra-surface-border shadow-2xl backdrop-blur-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-gasra-surface-border bg-gasra-surface/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gasra-accent/15 text-gasra-accent">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gasra-text">
              {isAr ? "الإشعارات" : "Notifications"}
            </h3>
            {unreadNotificationsCount > 0 ? (
              <span className="text-[10px] text-gasra-accent font-bold">
                {unreadNotificationsCount} {isAr ? "غير مقروءة" : "non lues"}
              </span>
            ) : (
              <span className="text-[10px] text-gasra-text-muted">
                {isAr ? "كل شيء محدث" : "À jour"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-gasra-accent hover:bg-gasra-accent/15 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              title="Tout marquer comme lu"
            >
              <CheckCheck size={13} />
              <span className="hidden sm:inline">{isAr ? "تعليم الكل" : "Tout marquer lu"}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gasra-text-muted hover:text-gasra-text hover:bg-gasra-surface-subtle transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-2 bg-gasra-surface-subtle/50 border-b border-gasra-surface-border text-[11px] font-bold overflow-x-auto scrollbar-none">
        {[
          { id: "all", label: isAr ? "الكل" : "Tout" },
          { id: "money", label: isAr ? "الأرباح" : "Gains DA" },
          { id: "coffee", label: isAr ? "قهوة ☕" : "Cafés ☕" },
          { id: "houma", label: isAr ? "الحومة" : "Houma" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
              filter === tab.id
                ? "bg-gasra-accent text-gasra-on-accent font-bold shadow-xs"
                : "text-gasra-text-secondary hover:text-gasra-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gasra-surface-border/50 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gasra-text-muted text-xs">
            {isAr ? "لا توجد إشعارات جديدة" : "Aucune notification ici."}
          </div>
        ) : (
          filtered.slice(0, 6).map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-3.5 transition-colors cursor-pointer hover:bg-gasra-accent/5 flex items-start gap-3 ${
                notif.isRead ? "opacity-75" : "bg-gasra-accent/5 font-semibold"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gasra-surface-subtle border border-gasra-surface-border flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-gasra-text truncate">
                    {isAr ? notif.titleAr : notif.titleFr}
                  </h4>
                  <span className="text-[10px] font-mono text-gasra-text-muted shrink-0">
                    {notif.timeAgo}
                  </span>
                </div>

                <p className="text-[11px] text-gasra-text-secondary leading-snug line-clamp-2">
                  {isAr ? notif.descriptionAr : notif.descriptionFr}
                </p>

                {notif.badgeAmount && (
                  <div className="mt-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-gasra-accent/15 text-gasra-accent border border-gasra-accent/30 font-mono font-bold text-[10px]">
                      {notif.badgeAmount}
                    </span>
                  </div>
                )}
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-gasra-accent shadow-[0_0_6px_var(--gasra-accent)] shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer link to full screen */}
      <div className="p-3 border-t border-gasra-surface-border bg-gasra-surface/90 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gasra-accent hover:underline"
        >
          <span>{isAr ? "عرض كل الإشعارات" : "Voir toutes les notifications"}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
