import React from "react";
import {
  Settings,
  Moon,
  Sun,
  Globe,
  MapPin,
  CreditCard,
  Shield,
  Smartphone,
  Info,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ALGERIAN_WILAYAS } from "../../data/wilayas";
import { PWAInstallButton } from "../common/PWAInstallButton";

export const ScreenSettings: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    user,
    currentWilaya,
    setCurrentWilaya,
  } = useApp();
  const isAr = language === "ar";

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gasra-surface-border">
        <div>
          <h2 className="text-base font-bold text-gasra-text flex items-center gap-2">
            <Settings size={18} />
            <span>{isAr ? "إعدادات التطبيق" : "Paramètres"}</span>
          </h2>
          <p className="text-[11px] text-gasra-text-muted">
            {isAr ? "المظهر، اللغة، الولاية والمحفظة" : "Thème, langue, wilaya et compte"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* APPEARANCE SECTION */}
        <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            <span>{isAr ? "المظهر والسمة" : "Apparence & Thème"}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setTheme("light")}
              className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition-all ${
                theme === "light"
                  ? "btn-gasra-primary shadow-xs ring-2 ring-[#3D5AFE]/30"
                  : "bg-gasra-surface-subtle border-gasra-surface-border text-gasra-text"
              }`}
            >
              <Sun size={20} className={theme === "light" ? "text-amber-500" : ""} />
              <span>{isAr ? "الوضع المضيء" : "Mode Clair"}</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition-all ${
                theme === "dark"
                  ? "btn-gasra-primary shadow-xs ring-2 ring-[#E4FF3C]/30"
                  : "bg-gasra-surface-subtle border-gasra-surface-border text-gasra-text"
              }`}
            >
              <Moon size={20} className={theme === "dark" ? "text-[#E4FF3C]" : ""} />
              <span>{isAr ? "الوضع الليلي (قصرة)" : "Mode Sombre"}</span>
            </button>
          </div>
        </div>

        {/* LANGUAGE SECTION */}
        <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
            <Globe size={14} />
            <span>{isAr ? "اللغة والاتجاه" : "Langue & Direction"}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setLanguage("fr")}
              className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                language === "fr"
                  ? "btn-gasra-primary shadow-xs"
                  : "bg-gasra-surface-subtle border-gasra-surface-border text-gasra-text"
              }`}
            >
              <div>Français (LTR)</div>
              <div className="text-[10px] font-normal opacity-75">Direction de gauche à droite</div>
            </button>

            <button
              onClick={() => setLanguage("ar")}
              className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                language === "ar"
                  ? "btn-gasra-primary shadow-xs"
                  : "bg-gasra-surface-subtle border-gasra-surface-border text-gasra-text"
              }`}
            >
              <div>العربية (RTL)</div>
              <div className="text-[10px] font-normal opacity-75">اتجاه من اليمين إلى اليسار</div>
            </button>
          </div>
        </div>

        {/* WILAYA CHANGER */}
        <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
            <MapPin size={14} className="text-[#E0503A]" />
            <span>{isAr ? "الولاية النشطة حاليا" : "Wilaya de navigation"}</span>
          </h3>

          <select
            value={currentWilaya.split(" ")[0]}
            onChange={(e) => {
              const selected = ALGERIAN_WILAYAS.find((w) => w.code === e.target.value);
              if (selected) {
                setCurrentWilaya(`${selected.code} - ${selected.nameFr}`);
              }
            }}
            className="w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface-subtle text-xs font-semibold text-gasra-text outline-none"
          >
            {ALGERIAN_WILAYAS.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} - {w.nameFr} ({w.nameAr})
              </option>
            ))}
          </select>
        </div>

        {/* PAYMENT LINK */}
        <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
            <CreditCard size={14} className="text-[#3D5AFE]" />
            <span>{isAr ? "البطاقة الذهبية وبريدي موب" : "Passerelle Edahabia"}</span>
          </h3>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-[#162447] border border-blue-200 dark:border-[#2B458A] flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-gasra-text">{user.isNew ? "Aucune carte liée" : "Edahabia n° 6280 **** 4819"}</div>
              <div className="text-[10px] text-gasra-text-muted">{user.isNew ? "Lie ta carte Edahabia pour retirer tes gains" : `Liée à ${user.name} (CCP ${user.originWilayaName})`}</div>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* PWA Section */}
        <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone size={18} className="text-gasra-text" />
            <div>
              <div className="font-bold text-xs text-gasra-text">
                {isAr ? "تطبيق الهاتف (PWA)" : "Application Mobile (PWA)"}
              </div>
              <div className="text-[10px] text-gasra-text-muted">
                {isAr ? "تثبيت للشاشة الكاملة" : "Ajouter à l'écran d'accueil"}
              </div>
            </div>
          </div>
          <PWAInstallButton compact />
        </div>

        {/* App Version Info */}
        <div className="text-center text-[11px] text-gasra-text-muted py-2">
          Gasra V1.0 · « من حومتك، لبلادك » · Défi Design
        </div>
      </div>
    </div>
  );
};
