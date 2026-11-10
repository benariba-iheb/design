import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "motion/react";
import { useApp } from "../../context/AppContext";
import { useAutoHideNav } from "../../hooks/useAutoHideNav";
import { SIDEBAR_ITEMS, SidebarItem } from "./Sidebar";

/**
 * Dock Gasra (ordinateur) : barre flottante en verre centrée en bas de l'écran.
 * Les icônes grossissent selon la proximité de la souris (effet loupe) et
 * une "goutte" lumineuse glisse sous la rubrique active.
 */
const GROUPS: string[][] = [
  ["feed", "explorer", "creer", "marketplace"],
  ["missions", "communauté", "amis", "pages"],
  ["messages", "notifications", "paiements"],
  ["profil"],
];

const BASE = 44;
const MAX = 66;

function DockIcon({
  item,
  mouseX,
  active,
  isAr,
}: {
  item: SidebarItem;
  mouseX: MotionValue<number>;
  active: boolean;
  isAr: boolean;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [hover, setHover] = useState(false);
  const distance = useTransform(mouseX, (v) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || v === Infinity) return 999;
    return v - (r.left + r.width / 2);
  });
  const sizeRaw = useTransform(distance, [-150, 0, 150], [BASE, MAX, BASE]);
  const size = useSpring(sizeRaw, { stiffness: 320, damping: 22, mass: 0.4 });
  const iconSize = useTransform(size, (s) => s * 0.45);
  const Icon = item.icon;
  const label = isAr ? item.labelAr : item.labelFr;

  return (
    <Link
      ref={ref}
      to={item.path}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col items-center"
    >
      {/* Infobulle */}
      <motion.span
        initial={false}
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 6 }}
        transition={{ duration: 0.15 }}
        className="dock-tooltip absolute -top-9 whitespace-nowrap text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none"
      >
        {label}
      </motion.span>

      <motion.span
        style={{ width: size, height: size }}
        className={`dock-icon relative flex items-center justify-center rounded-2xl ${active ? "is-active" : ""}`}
      >
        <motion.span style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
          <Icon size={22} className="w-full h-full" />
        </motion.span>
        {item.badge && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md">
            {item.badge}
          </span>
        )}
      </motion.span>

      {/* Goutte active */}
      <span className="h-2 flex items-end">
        {active && (
          <motion.span
            layoutId="dock-drop"
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="dock-drop block w-1.5 h-1.5 rounded-full"
          />
        )}
      </span>
    </Link>
  );
}

export const DesktopDock: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const location = useLocation();
  const mouseX = useMotionValue(Infinity);
  const hidden = useAutoHideNav();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="hidden lg:flex fixed bottom-5 inset-x-0 z-40 justify-center pointer-events-none">
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 40, opacity: 0 }}
        animate={hidden ? { y: 120, opacity: 0, scale: 0.94 } : { y: 0, opacity: 1, scale: 1 }}
        transition={
          hidden
            ? { duration: 0.32, ease: [0.4, 0, 0.2, 1] }
            : { type: "spring", stiffness: 380, damping: 28, mass: 0.7 }
        }
        className="dock-shell gasra-card-glass pointer-events-auto flex items-end gap-2 px-3 pt-2.5 pb-1 rounded-[26px] shadow-2xl"
      >
        {GROUPS.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <span className="dock-sep self-center w-px h-8 mx-1" />}
            {group.map((id) => {
              const item = SIDEBAR_ITEMS.find((it) => it.id === id);
              if (!item) return null;
              return (
                <DockIcon key={id} item={item} mouseX={mouseX} active={isActive(item.path)} isAr={isAr} />
              );
            })}
          </React.Fragment>
        ))}
      </motion.nav>
    </div>
  );
};
