import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

/**
 * CelestialThemeToggle
 * Sélecteur de mode Nuit / Jour innovant et tactile d'inspiration avant-gardiste.
 * Remplace les classiques icônes soleil/lune par un cadran d'éclipse céleste
 * (Mode Crépuscule cosmique avec halo cyan/violet vs Mode Zénith diurne radiant).
 */
export const CelestialThemeToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex items-center justify-center p-1 rounded-2xl transition-all duration-300 focus:outline-hidden ${className}`}
      title={isDark ? "Mode Crépuscule actif · Passer au Zénith diurne" : "Mode Zénith actif · Passer au Crépuscule"}
      aria-label="Changer de thème céleste"
    >
      {/* Capsule extérieure avec bordure en dégradé irisé */}
      <div className="no-gradient-border relative w-12 h-7 rounded-full p-0.5 bg-gasra-surface-subtle/80 border border-gasra-surface-border group-hover:border-[#0DCCF2]/60 backdrop-blur-md transition-all duration-300 shadow-inner flex items-center">
        {/* Halo orbital en arrière-plan */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${
            isDark
              ? "bg-gradient-to-r from-[#0DCCF2]/20 via-[#5E47D1]/20 to-[#FC56C1]/30 opacity-90"
              : "bg-gradient-to-r from-amber-400/20 via-[#0DCCF2]/20 to-[#FC56C1]/20 opacity-70"
          }`}
        />

        {/* Micro-étoiles / étincelles en mode nuit */}
        {isDark && (
          <div className="absolute right-2 top-1.5 w-1 h-1 rounded-full bg-[#0DCCF2] animate-ping opacity-60" />
        )}
        {!isDark && (
          <div className="absolute left-2 top-1.5 w-1 h-1 rounded-full bg-amber-400 opacity-60" />
        )}

        {/* Sphère céleste glissante & rotative (L'orbe d'éclipse) */}
        <div
          className={`no-gradient-border relative w-5 h-5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md flex items-center justify-center overflow-hidden ${
            isDark
              ? "translate-x-5 bg-gradient-to-tr from-[#05161c] via-[#092b35] to-[#123e4a] border border-[#0DCCF2]/80 shadow-[0_0_10px_rgba(13,204,242,0.5)]"
              : "translate-x-0 bg-gradient-to-tr from-amber-300 via-amber-400 to-[#0DCCF2] border border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
          }`}
        >
          {/* Cratère / Éclipse intérieure */}
          {isDark ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Croissant d'éclipse cyan / rose */}
              <div className="w-3.5 h-3.5 rounded-full bg-transparent border-t-2 border-r-2 border-[#0DCCF2] rotate-45 transform" />
              <div className="absolute w-1 h-1 rounded-full bg-[#FC56C1] top-1 right-1" />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Noyau solaire radiant */}
              <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_6px_#fff]" />
            </div>
          )}
        </div>
      </div>

      {/* Micro-indicateur d'état flottant au survol */}
      {isHovered && (
        <span className="no-gradient-border absolute -bottom-7 right-0 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-md bg-gasra-surface border border-gasra-surface-border text-gasra-text shadow-lg pointer-events-none z-50">
          {isDark ? "Crépuscule" : "Zénith"}
        </span>
      )}
    </button>
  );
};
