import React from "react";
import { useApp } from "../../context/AppContext";

interface LevelBadgeProps {
  levelNumber?: number;
  isBerrani?: boolean;
  hasPrimeBerrani?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showPoints?: boolean;
  points?: number;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  levelNumber = 2,
  isBerrani = false,
  hasPrimeBerrani = false,
  size = "md",
  className = "",
  showPoints = false,
  points,
}) => {
  const { language } = useApp();
  const isAr = language === "ar";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  if (isBerrani) {
    return (
      <span
        className={`no-gradient-zone inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-bold rounded-full bg-gasra-accent/10 text-gasra-text border border-gasra-accent/30 ${sizeClasses[size]} ${className}`}
        title="Visiteur venant d'une autre wilaya"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gasra-accent" />
        <span>{isAr ? "البراني" : "Berrani"}</span>
        {hasPrimeBerrani && (
          <span className="text-[9px] font-black text-gasra-on-accent bg-gasra-accent px-1.5 py-0.2 rounded-full">
            +50% {isAr ? "منحة" : "Prime"}
          </span>
        )}
      </span>
    );
  }

  const levelConfigs: Record<number, { fr: string; ar: string }> = {
    1: { fr: "Jar", ar: "جار" },
    2: { fr: "Weld el Houma", ar: "ولد الحومة" },
    3: { fr: "Sahb el Kelma", ar: "صاحب الكلمة" },
    4: { fr: "Dalil", ar: "دليل" },
    5: { fr: "Kbir el Houma", ar: "كبير الحومة" },
  };

  const config = levelConfigs[levelNumber] || levelConfigs[1];

  return (
    <span
      className={`no-gradient-zone inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-bold rounded-full bg-gasra-accent/15 text-gasra-text border border-gasra-accent/35 ${sizeClasses[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gasra-accent" />
      <span>{isAr ? config.ar : config.fr}</span>
      {showPoints && points !== undefined && (
        <span className="opacity-80 text-[10px] font-mono text-gasra-accent">
          ({points} pts)
        </span>
      )}
    </span>
  );
};
