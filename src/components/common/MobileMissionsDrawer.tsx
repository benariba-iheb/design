import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Target, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MissionsHoumaList } from "./MissionsHoumaList";

/**
 * Tiroir "Missions de la Houma" pour téléphone :
 * une languette reste collée au bord de l'écran en permanence,
 * le panneau s'ouvre et se ferme en glissant.
 */
export const MobileMissionsDrawer: React.FC = () => {
  const { language } = useApp();
  const isAr = language === "ar";
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Fermer à chaque changement de page et avec Échap
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Côté droit en français, côté gauche en arabe (RTL)
  const side = isAr ? "left-0" : "right-0";
  const hiddenShift = isAr ? "-translate-x-full" : "translate-x-full";
  const OpenIcon = isAr ? ChevronRight : ChevronLeft;

  return (
    <div className="lg:hidden">
      {/* Voile sombre */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Conteneur qui glisse : panneau + languette accrochée à son bord */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 ${side} z-[60] w-[82vw] max-w-[320px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : hiddenShift
        }`}
        role="dialog"
        aria-label={isAr ? "مهام الحومة" : "Missions de la Houma"}
        aria-hidden={!open}
      >
        {/* Languette toujours visible au bord de l'écran */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer les missions" : "Ouvrir les missions"}
          className={`gasra-missions-tab absolute top-1/2 -translate-y-1/2 ${
            isAr ? "left-full rounded-r-2xl" : "right-full rounded-l-2xl"
          } flex flex-col items-center gap-1.5 py-3 px-1.5 text-white shadow-[0_0_16px_rgba(94,71,209,0.5)]`}
        >
          {open ? <X size={16} /> : <OpenIcon size={16} />}
          <Target size={16} />
          <span className="text-[10px] font-black tracking-wider [writing-mode:vertical-rl] rotate-180">
            {isAr ? "المهام" : "MISSIONS"}
          </span>
          <span className="w-4 h-4 rounded-full bg-white text-[#5E47D1] text-[9px] font-black flex items-center justify-center">
            2
          </span>
        </button>

        {/* Panneau */}
        <div
          className={`gasra-card-glass ${
            isAr ? "rounded-r-3xl" : "rounded-l-3xl"
          } shadow-2xl`}
        >
          <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-gasra-text tracking-tight flex items-center gap-1.5">
              <Target size={16} className="text-[#0DCCF2]" />
              <span>{isAr ? "مهام الحومة" : "Missions de la Houma"}</span>
            </h3>
            <Link
              to="/missions"
              onClick={() => setOpen(false)}
              className="text-[11px] font-bold text-gasra-accent hover:underline flex items-center gap-0.5"
            >
              <span>{isAr ? "عرض الكل" : "Voir tout"}</span>
              <span className="text-xs">→</span>
            </Link>
          </div>

          <MissionsHoumaList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};
