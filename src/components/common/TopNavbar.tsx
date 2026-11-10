import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  Bell,
  Wallet,
  Menu,
  X,
  Trophy,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { GasraLogo } from "./GasraLogo";
import { useApp } from "../../context/AppContext";
import { Sidebar } from "./Sidebar";
import { NotificationDropdown } from "./NotificationDropdown";
import { CelestialThemeToggle } from "./CelestialThemeToggle";

export const TopNavbar: React.FC = () => {
  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    user,
    setLanguage,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    unreadNotificationsCount,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full gasra-topbar no-gradient-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Desktop sidebar toggle + Mobile hamburger + Brand logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gasra-accent/15 text-gasra-text transition-colors"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <GasraLogo size="md" />
          </div>

          {/* Center: Universal Search Input matching user's screenshot ("Rechercher partout") */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-lg mx-2 sm:mx-6 hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher partout (commerces, posts, wilaya...)"
                className="w-full pl-10 pr-12 py-2 rounded-2xl bg-gasra-surface/90 border border-gasra-surface-border focus:border-gasra-accent focus:ring-2 focus:ring-gasra-accent/30 text-xs sm:text-sm text-gasra-text placeholder:text-gasra-text-muted transition-all outline-none"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gasra-text-muted"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-gasra-surface-subtle border border-gasra-surface-border text-gasra-text-muted">
                ⌘K
              </span>
            </div>
          </form>

          {/* Right: Quick controls (Theme, Language pills, Trophies, Notifications, Wallet) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Toggle — cadran d'éclipse céleste */}
            <CelestialThemeToggle />

            {/* Language Selector Pills: FR / EN / عربي / ⵜⴰⵎ (matching screenshot) */}
            <div className="flex items-center p-0.5 rounded-xl bg-gasra-surface-subtle border border-gasra-surface-border text-[11px] font-bold">
              <button
                onClick={() => setLanguage("fr")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === "fr"
                    ? "bg-gasra-accent text-gasra-on-accent font-black shadow-xs"
                    : "text-gasra-text-secondary hover:text-gasra-accent"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === "ar"
                    ? "bg-gasra-accent text-gasra-on-accent font-black shadow-xs"
                    : "text-gasra-text-secondary hover:text-gasra-accent"
                }`}
              >
                عربي
              </button>
            </div>

            {/* Gamification / Missions Icon - Golden Trophy */}
            <Link
              to="/missions"
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 transition-all group"
              title="Missions & Trophées"
            >
              <Trophy
                size={18}
                className="text-amber-400 fill-amber-400/30 transition-transform group-hover:scale-110"
              />
            </Link>

            {/* Notifications - Bell with floating dropdown window */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-xl transition-all group ${
                  notificationsOpen
                    ? "bg-gasra-accent/20 text-gasra-accent"
                    : "text-gasra-text-secondary hover:text-gasra-accent hover:bg-gasra-accent/15"
                }`}
                title="Notifications"
                aria-label="Afficher les notifications"
              >
                <Bell size={18} className="transition-transform group-hover:scale-110" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  </span>
                )}
              </button>

              {/* Floating Notifications Window */}
              <NotificationDropdown
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            {/* Wallet Quick Pill */}
            <Link
              to="/portefeuille"
              className="flex items-center gap-1.5 whitespace-nowrap shrink-0 px-3 py-1.5 rounded-2xl bg-gasra-accent/15 border border-gasra-accent/40 text-gasra-accent text-xs font-bold hover:bg-gasra-accent hover:text-gasra-on-accent transition-all"
              title="Portefeuille Gasra"
            >
              <Wallet size={15} />
              <span className="hidden sm:inline font-mono">{user.walletBalanceDA.toLocaleString()} DA</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-gasra-bg border-r border-gasra-surface-border p-4 flex flex-col z-10 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gasra-surface-border mb-3">
              <GasraLogo size="md" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gasra-surface-subtle text-gasra-text"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onItemClick={() => setMobileMenuOpen(false)} isMobileDrawer={true} />
          </div>
        </div>
      )}
    </>
  );
};
