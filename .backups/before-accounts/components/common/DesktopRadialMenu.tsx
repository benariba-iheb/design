import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { SIDEBAR_ITEMS, SidebarItem } from "./Sidebar";

/**
 * Menu radial (ordinateur) — adapté de react-menu-radial (version Motion, MIT, vmaspad).
 * Un bouton rond reste collé au bord gauche ; au clic, les rubriques se déploient en arc
 * de cercle avec un effet ressort, sur un voile flouté.
 */
const ITEM_SIZE = 74;
const START_ANGLE = -88;
const END_ANGLE = 88;

function RadialItem({
  item,
  index,
  total,
  radius,
  active,
  isAr,
  onSelect,
}: {
  item: SidebarItem;
  index: number;
  total: number;
  radius: number;
  active: boolean;
  isAr: boolean;
  onSelect: (item: SidebarItem) => void;
}) {
  const angleRange = END_ANGLE - START_ANGLE;
  const angleRad = (START_ANGLE + (index * angleRange) / Math.max(1, total - 1)) * (Math.PI / 180);
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;
  const Icon = item.icon;
  const label = isAr ? item.labelAr : item.labelFr;

  return (
    <motion.button
      onClick={() => onSelect(item)}
      title={label}
      className={`radial-item group absolute flex flex-col items-center justify-center rounded-2xl gasra-card-glass shadow-xl ${
        active ? "radial-item-active" : ""
      }`}
      style={{ width: ITEM_SIZE, height: ITEM_SIZE, marginLeft: -ITEM_SIZE / 2, marginTop: -ITEM_SIZE / 2 }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ x, y, opacity: 1, scale: 1 }}
      exit={{ x: 0, y: 0, opacity: 0, scale: 0, transition: { duration: 0.22, delay: (total - index) * 0.015 } }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        delay: index * 0.035,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.94 }}
    >
      {item.badge && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md z-20">
          {item.badge}
        </span>
      )}
      <div className="flex flex-col items-center justify-center gap-1 z-10 w-full h-full p-1.5">
        <Icon size={21} className="transition-transform group-hover:scale-110" />
        <span
          className={`text-[9.5px] font-bold leading-tight text-center w-full overflow-hidden text-ellipsis whitespace-nowrap ${
            active ? "text-gasra-accent" : "text-gasra-text-secondary group-hover:text-gasra-text"
          }`}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}

export const DesktopRadialMenu: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [radius, setRadius] = useState(260);
  const location = useLocation();
  const navigate = useNavigate();

  // Rayon adapté à la hauteur de l'écran pour que l'arc tienne toujours
  useEffect(() => {
    const fit = () => setRadius(Math.max(190, Math.min(275, (window.innerHeight - 140) / 2)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const totalBadges = SIDEBAR_ITEMS.reduce((n, i) => n + (Number(i.badge) || 0), 0);

  return (
    <div className="hidden lg:block">
      {/* Voile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[45] bg-black/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Ancre : bord gauche, milieu de l'écran */}
      <div className="fixed z-[50] left-20 top-1/2 pointer-events-none" style={{ width: 0, height: 0 }}>
        <div className="absolute pointer-events-auto" style={{ left: 0, top: 0 }}>
          <AnimatePresence>
            {isOpen &&
              SIDEBAR_ITEMS.map((item, i) => (
                <RadialItem
                  key={item.id}
                  item={item}
                  index={i}
                  total={SIDEBAR_ITEMS.length}
                  radius={radius}
                  active={isActive(item.path)}
                  isAr={isAr}
                  onSelect={(it) => {
                    navigate(it.path);
                    setIsOpen(false);
                  }}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* Bouton central */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          className={`radial-center absolute pointer-events-auto flex items-center justify-center rounded-full gasra-card-glass shadow-2xl ${
            isOpen ? "is-open" : ""
          }`}
          style={{ width: 58, height: 58, left: -29, top: -29 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
        >
          <div className="flex flex-col gap-[5px] items-center justify-center">
            <motion.div animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }} className="w-5 h-[2px] rounded-full bg-gasra-accent" />
            <motion.div animate={{ opacity: isOpen ? 0 : 1 }} className="w-5 h-[2px] rounded-full bg-gasra-accent" />
            <motion.div animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }} className="w-5 h-[2px] rounded-full bg-gasra-accent" />
          </div>
          {!isOpen && totalBadges > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
