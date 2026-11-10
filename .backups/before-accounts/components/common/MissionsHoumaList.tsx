import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/** Liste des missions de la Houma — partagée entre la colonne droite (desktop) et le tiroir latéral (mobile). */
export const MissionsHoumaList: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { language } = useApp();
  const isAr = language === "ar";

  return (
    <div className="space-y-2.5">
      <div className="p-3 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border hover:border-gasra-accent/40 transition-colors">
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-gasra-text truncate max-w-[160px]">
            {isAr ? "تصوير أسعار المغسلة" : "Horaires laverie auto"}
          </span>
          <span className="text-gasra-accent font-mono font-black">+180 DA</span>
        </div>
        <p className="text-[10px] text-gasra-text-muted mb-2">
          Bab Ezzouar · Reste 3 places
        </p>
        <div className="w-full h-1 rounded-full bg-gasra-surface overflow-hidden mb-2.5">
          <div className="w-3/5 h-full bg-gasra-accent" />
        </div>
        <Link
          to="/missions"
          onClick={onNavigate}
          className="w-full py-1.5 rounded-xl btn-gasra-primary text-[11px] font-black flex items-center justify-center gap-1 shadow-xs"
        >
          {isAr ? "مشاركة" : "Participer"}
        </Link>
      </div>

      <div className="p-3 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border hover:border-gasra-accent/40 transition-colors">
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-gasra-text truncate max-w-[160px]">
            {isAr ? "إنارة الحي المعطلة" : "Éclairage rond-point 8 Mai"}
          </span>
          <span className="text-amber-400 font-mono font-black">+120 DA</span>
        </div>
        <p className="text-[10px] text-gasra-text-muted mb-2">
          Signalement citoyen · Urgent
        </p>
        <div className="w-full h-1 rounded-full bg-gasra-surface overflow-hidden mb-2.5">
          <div className="w-1/2 h-full bg-amber-400" />
        </div>
        <Link
          to="/missions"
          onClick={onNavigate}
          className="w-full py-1.5 rounded-xl bg-gasra-accent/15 text-gasra-accent border border-gasra-accent/30 hover:bg-gasra-accent hover:text-gasra-on-accent text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
        >
          {isAr ? "مشاركة" : "Participer"}
        </Link>
      </div>
    </div>
  );
};
