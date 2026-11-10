import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Home, Compass, Plus, ShoppingBag, User } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAutoHideNav } from "../../hooks/useAutoHideNav";

/** Rubriques de la barre du bas — elles sont retirées du menu hamburger pour ne pas les doubler. */
export const BOTTOM_NAV_IDS = ["feed", "explorer", "creer", "marketplace", "profil"];

const NAV_ITEMS = [
  { id: "feed", path: "/", labelFr: "Feed", labelAr: "الرئيسية", icon: Home },
  { id: "explorer", path: "/explorer", labelFr: "Explorer", labelAr: "استكشاف", icon: Compass },
  { id: "creer", path: "/creer", labelFr: "Poster", labelAr: "نشر", icon: Plus },
  { id: "marketplace", path: "/marketplace", labelFr: "Market", labelAr: "السوق", icon: ShoppingBag },
  { id: "profil", path: "/profil", labelFr: "Profil", labelAr: "حسابي", icon: User },
];

/**
 * Barre de navigation "liquide" (téléphone) :
 * la barre se creuse en encoche sous l'onglet actif et l'icône monte dans une bulle,
 * l'encoche et la bulle glissent ensemble avec un effet élastique.
 */
export const BottomNav: React.FC = () => {
  const { language } = useApp();
  const location = useLocation();
  const isAr = language === "ar";
  const barRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [x, setX] = useState<number | null>(null);
  const hidden = useAutoHideNav();

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) =>
      item.path === "/"
        ? location.pathname === "/" || location.pathname === "/feed"
        : location.pathname.startsWith(item.path)
    )
  );
  const ActiveIcon = NAV_ITEMS[activeIndex].icon;

  useLayoutEffect(() => {
    const measure = () => {
      const bar = barRef.current;
      const el = itemRefs.current[activeIndex];
      if (!bar || !el) return;
      const b = bar.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setX(r.left - b.left + r.width / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, language]);

  return (
    <motion.nav
      className="fixed bottom-0 start-0 end-0 z-40 pointer-events-none pb-safe"
      initial={false}
      animate={hidden ? { y: 110, opacity: 0, scale: 0.96 } : { y: 0, opacity: 1, scale: 1 }}
      transition={
        hidden
          ? { duration: 0.32, ease: [0.4, 0, 0.2, 1] }
          : { type: "spring", stiffness: 420, damping: 30, mass: 0.7 }
      }
    >
      <div ref={barRef} className="relative w-full max-w-md mx-auto h-[68px] pointer-events-auto">
        {/* Barre creusée (l'encoche suit l'onglet actif) */}
        <div
          className="liquid-bar absolute inset-x-2 bottom-2 top-3 rounded-[26px]"
          style={{ ["--notch-x" as any]: x !== null ? `${x - 8}px` : "50%" }}
        />

        {/* Bulle de l'onglet actif */}
        {x !== null && (
          <motion.div
            className="liquid-bubble absolute top-[-14px] w-[52px] h-[52px] -ml-[26px] rounded-full flex items-center justify-center"
            initial={false}
            animate={{ left: x }}
            transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.9 }}
          >
            <motion.span
              key={activeIndex}
              initial={{ scale: 0.4, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.06 }}
              className="flex"
            >
              <ActiveIcon size={22} strokeWidth={2.4} />
            </motion.span>
          </motion.div>
        )}

        {/* Onglets */}
        <div className="absolute inset-x-2 bottom-2 top-3 flex items-center justify-around px-2">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const active = i === activeIndex;
            return (
              <Link
                key={item.id}
                to={item.path}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                aria-label={isAr ? item.labelAr : item.labelFr}
                className="liquid-tab relative flex flex-col items-center justify-end w-14 h-full pb-1.5"
              >
                <motion.span
                  animate={{ opacity: active ? 0 : 1, y: active ? 10 : 0, scale: active ? 0.6 : 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex mb-0.5"
                >
                  <Icon size={20} strokeWidth={2} />
                </motion.span>
                <span
                  className={`text-[10px] font-bold tracking-tight transition-colors ${
                    active ? "text-gasra-accent" : "text-gasra-text-muted"
                  }`}
                >
                  {isAr ? item.labelAr : item.labelFr}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};
