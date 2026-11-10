import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Coins,
  Coffee,
  Award,
  Tag,
  CheckCheck,
  Check,
  Filter,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { GasraNotification } from "../../data/mockData";

export const ScreenNotifications: React.FC = () => {
  const {
    language,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useApp();
  const isAr = language === "ar";
  const [filter, setFilter] = useState<"all" | "money" | "coffee" | "level" | "deal">("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const getIcon = (type: GasraNotification["type"]) => {
    switch (type) {
      case "money":
        return <Coins size={18} className="text-gasra-accent" />;
      case "coffee":
        return <Coffee size={18} className="text-amber-400" />;
      case "level":
        return <Award size={18} className="text-gasra-accent" />;
      case "deal":
        return <Tag size={18} className="text-gasra-accent" />;
      default:
        return <Bell size={18} className="text-gasra-text" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-full pb-20 p-4 sm:p-6 text-gasra-text max-w-4xl mx-auto w-full">
      {/* Top Header Card */}
      <div className="gasra-card-glass rounded-3xl p-5 mb-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gasra-surface-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gasra-text flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-gasra-accent/15 text-gasra-accent">
                <Bell size={20} />
              </span>
              <span>{isAr ? "مركز الإشعارات" : "Notifications"}</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gasra-accent text-gasra-on-accent">
                  {unreadNotificationsCount} {isAr ? "جديدة" : "nouvelles"}
                </span>
              )}
            </h1>
            <p className="text-xs text-gasra-text-muted mt-1">
              {isAr ? "متابعة أرباحك، نشاطات حومتك والترقيات" : "Gains en DA, cafés reçus, promotions et alertes de ta houma"}
            </p>
          </div>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="self-start sm:self-auto text-xs font-bold text-gasra-accent hover:bg-gasra-accent/10 px-3 py-1.5 rounded-xl border border-gasra-accent/30 transition-all flex items-center gap-1.5"
            >
              <CheckCheck size={15} />
              <span>{isAr ? "تحديد الكل كمقروء" : "Tout marquer lu"}</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 text-xs font-bold scrollbar-none">
          {[
            { id: "all", fr: "Toutes", ar: "الكل" },
            { id: "money", fr: "Gains (DA)", ar: "الأرباح" },
            { id: "coffee", fr: "Cafés ☕", ar: "قهوة" },
            { id: "level", fr: "Réputation", ar: "الرتب" },
            { id: "deal", fr: "Bons & Deals", ar: "البونات" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 ${
                filter === tab.id
                  ? "bg-gasra-accent text-gasra-on-accent font-black shadow-xs"
                  : "bg-gasra-surface-subtle text-gasra-text-secondary hover:text-gasra-accent border border-gasra-surface-border"
              }`}
            >
              {isAr ? tab.ar : tab.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="gasra-card-glass rounded-3xl p-8 text-center text-gasra-text-muted">
            <Bell size={32} className="mx-auto mb-2 text-gasra-accent/50" />
            <p className="text-sm font-semibold">{isAr ? "لا توجد إشعارات حاليا" : "Aucune notification dans cette catégorie."}</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`group p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer ${
                notif.isRead
                  ? "gasra-card-glass border-gasra-surface-border opacity-85 hover:opacity-100"
                  : "gasra-card-glass border-gasra-accent/40 shadow-sm ring-1 ring-gasra-accent/20 hover:border-gasra-accent"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm text-gasra-text truncate flex items-center gap-2">
                      <span>{isAr ? notif.titleAr : notif.titleFr}</span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-gasra-accent shadow-[0_0_8px_var(--gasra-accent)]" />
                      )}
                    </h4>
                    <span className="text-[11px] font-mono text-gasra-text-muted shrink-0">
                      {notif.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-gasra-text-secondary leading-relaxed mb-2.5">
                    {isAr ? notif.descriptionAr : notif.descriptionFr}
                  </p>

                  <div className="flex items-center justify-between">
                    {notif.badgeAmount ? (
                      <span className="inline-block px-3 py-1 rounded-xl bg-gasra-accent/15 text-gasra-accent border border-gasra-accent/30 font-mono font-bold text-xs">
                        {notif.badgeAmount}
                      </span>
                    ) : (
                      <span />
                    )}

                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationAsRead(notif.id);
                        }}
                        className="text-[11px] font-semibold text-gasra-text-muted hover:text-gasra-accent flex items-center gap-1 transition-colors"
                      >
                        <Check size={13} />
                        <span>{isAr ? "تعليم كمقروء" : "Marquer lu"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

