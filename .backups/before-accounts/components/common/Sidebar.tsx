import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  PlusCircle,
  ShoppingBag,
  Target,
  Users,
  UserCheck,
  Building2,
  MessageSquare,
  Bell,
  Wallet,
  User,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BOTTOM_NAV_IDS } from "./BottomNav";

export interface SidebarItem {
  id: string;
  path: string;
  labelFr: string;
  labelAr: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "feed", path: "/", labelFr: "Feed", labelAr: "الرئيسية", icon: Home },
  { id: "explorer", path: "/explorer", labelFr: "Explorer", labelAr: "استكشف", icon: Compass },
  { id: "creer", path: "/creer", labelFr: "Poster", labelAr: "نشر", icon: PlusCircle },
  { id: "marketplace", path: "/marketplace", labelFr: "Marketplace", labelAr: "السوق", icon: ShoppingBag },
  { id: "missions", path: "/missions", labelFr: "Missions", labelAr: "مهام الحومة", icon: Target, badge: "3" },
  { id: "communauté", path: "/groupes", labelFr: "Communauté", labelAr: "المجتمع", icon: Users },
  { id: "amis", path: "/amis", labelFr: "Amis", labelAr: "الأصدقاء", icon: UserCheck },
  { id: "pages", path: "/pages", labelFr: "Pages", labelAr: "المتاجر", icon: Building2 },
  { id: "messages", path: "/messages", labelFr: "Messages", labelAr: "الرسائل", icon: MessageSquare, badge: 2 },
  { id: "notifications", path: "/notifications", labelFr: "Notifications", labelAr: "الإشعارات", icon: Bell, badge: 4 },
  { id: "paiements", path: "/portefeuille", labelFr: "Paiements", labelAr: "المحفظة", icon: Wallet },
  { id: "profil", path: "/profil", labelFr: "Profil", labelAr: "حسابي", icon: User },
];

export const Sidebar: React.FC<{
  className?: string;
  onItemClick?: () => void;
  isMobileDrawer?: boolean;
}> = ({
  className = "",
  onItemClick,
  isMobileDrawer = false,
}) => {
  const location = useLocation();
  const { language, user, sidebarCollapsed, toggleSidebarCollapsed } = useApp();
  const isAr = language === "ar";
  const collapsed = !isMobileDrawer && sidebarCollapsed;

  const isCurrentActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/feed" || location.pathname === "/web-feed";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`shrink-0 flex flex-col py-3 select-none transition-all duration-300 ease-in-out ${
        collapsed ? "sidebar-rail w-14 px-1.5" : "w-64 px-3.5"
      } ${className}`}
    >
      {/* Top Toggle for Desktop (fluid open/close indicator) */}
      {!isMobileDrawer && (
        <div className={`mb-2 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
          {!collapsed && (
            <span className="text-[11px] font-black uppercase tracking-wider text-gasra-text-muted">
              {isAr ? "القائمة" : "Menu"}
            </span>
          )}
          <button
            onClick={toggleSidebarCollapsed}
            className="p-1.5 rounded-xl text-gasra-text-secondary hover:text-gasra-accent hover:bg-gasra-accent/10 transition-colors"
            title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
        {SIDEBAR_ITEMS.filter((item) => !isMobileDrawer || !BOTTOM_NAV_IDS.includes(item.id)).map((item) => {
          const active = isCurrentActive(item.path);
          const Icon = item.icon;
          const label = isAr ? item.labelAr : item.labelFr;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onItemClick}
              title={collapsed ? label : undefined}
              className={`group relative flex items-center rounded-2xl text-sm font-semibold transition-all duration-200 ${
                collapsed
                  ? "rail-item justify-center p-2.5"
                  : "justify-between px-3.5 py-2.5"
              } ${
                active
                  ? collapsed
                    ? "rail-active text-gasra-accent"
                    : "btn-gasra-primary text-gasra-on-accent shadow-md font-bold scale-[1.02]"
                  : "text-gasra-text-secondary hover:text-gasra-accent hover:bg-gasra-accent/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={collapsed ? 18 : 19}
                  className={`transition-transform duration-200 ${
                    active && !collapsed
                      ? "text-gasra-on-accent"
                      : "text-gasra-text-muted group-hover:text-gasra-accent group-hover:scale-110"
                  }`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </div>

              {/* Badge */}
              {item.badge && (
                collapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-gasra-accent shadow-[0_0_6px_var(--gasra-accent)]" />
                ) : (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      active
                        ? "bg-gasra-on-accent text-gasra-accent"
                        : "bg-gasra-accent/20 text-gasra-accent border border-gasra-accent/40"
                    }`}
                  >
                    {item.badge}
                  </span>
                )
              )}

              {/* Tooltip on hover when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-gasra-surface border border-gasra-surface-border text-gasra-text text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {label}
                  {item.badge && (
                    <span className="ml-1.5 text-gasra-accent font-mono">({item.badge})</span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile mini status in sidebar bottom */}
      <div className="mt-3 pt-3 border-t border-gasra-surface-border/60">
        <Link
          to="/profil"
          onClick={onItemClick}
          title={collapsed ? user.name : undefined}
          className={`flex items-center rounded-2xl hover:bg-gasra-accent/10 transition-colors group ${
            collapsed ? "justify-center p-2" : "gap-2.5 p-2"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gasra-accent text-gasra-on-accent font-black flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gasra-text truncate group-hover:text-gasra-accent transition-colors">
                {user.name}
              </div>
              <div className="text-[10px] text-gasra-text-muted truncate">
                {user.walletBalanceDA.toLocaleString()} DA · {user.originWilayaName}
              </div>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};

