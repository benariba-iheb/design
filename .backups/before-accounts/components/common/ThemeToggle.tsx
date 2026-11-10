import React from "react";
import { useApp } from "../../context/AppContext";

/**
 * Interrupteur de thème façon "pilule" :
 * clair  → piste cyan pâle + soleil jaune à gauche
 * sombre → piste nuit + lune cerclée du dégradé à droite
 */
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`gasra-theme-toggle no-gradient-border relative shrink-0 w-[58px] h-[30px] rounded-full transition-colors duration-500 ${
        isDark ? "is-dark" : "is-light"
      }`}
    >
      <span className="gasra-theme-knob absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]">
        <span className="gasra-theme-knob-dot" />
      </span>
    </button>
  );
};
