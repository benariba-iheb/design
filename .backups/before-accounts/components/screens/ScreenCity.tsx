import React, { useState } from "react";
import {
  Building2,
  Sun,
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ScreenCity: React.FC = () => {
  const { currentWilaya, currentQuartier, language } = useApp();
  const isAr = language === "ar";
  const [reported, setReported] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gasra-surface-border">
        <div>
          <h2 className="text-base font-bold text-gasra-text flex items-center gap-2">
            <Building2 size={18} className="text-[#E0503A] dark:text-[#FF8A78]" />
            <span>{isAr ? "مدينتي وحومتي" : "Ma Ville & Mon Quartier"}</span>
          </h2>
          <p className="text-[11px] text-gasra-text-muted">
            {currentQuartier} · {currentWilaya}
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gasra-surface-subtle font-bold text-gasra-text-secondary">
          Infos APC Mairie
        </span>
      </div>

      {/* Weather & Daily Card */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-md mb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider block">
            {isAr ? "طقس اليوم" : "Météo locale"} · Bab Ezzouar
          </span>
          <div className="text-3xl font-black font-mono mt-1">23°C</div>
          <span className="text-xs text-blue-100">
            {isAr ? "مشمس ورياح خفيفة" : "Ensoleillé · Air marin agréable"}
          </span>
        </div>

        <Sun size={48} className="text-amber-300 animate-spin-slow opacity-90" />
      </div>

      {/* Official APC Mairie Alerts */}
      <div className="space-y-3 mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-amber-500" />
          <span>{isAr ? "تنبيهات البلدية والمصالح المحلية" : "Alertes de la Commune (APC)"}</span>
        </h3>

        <div className="space-y-2">
          <div className="p-3.5 rounded-2xl bg-gasra-surface border-l-4 border-l-amber-500 border border-gasra-surface-border shadow-xs text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-gasra-text">
              <span>{isAr ? "أشغال تعبيد الطرقات" : "Travaux de voirie rond-point 8 Mai"}</span>
              <span className="text-[10px] font-mono text-gasra-text-muted">Aujourd'hui</span>
            </div>
            <p className="text-gasra-text-secondary leading-snug">
              {isAr
                ? "أشغال صيانة الطريق الرابط بين حي 8 ماي وجامعة باب الزوار مستمرة لغاية المساء."
                : "Déviation active vers le boulevard de l'Université jusqu'à 18h."}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gasra-surface border-l-4 border-l-blue-500 border border-gasra-surface-border shadow-xs text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-gasra-text">
              <span>{isAr ? "برنامج توزيع المياه (سيال)" : "Distribution eau potable (SEAAL)"}</span>
              <span className="text-[10px] font-mono text-gasra-text-muted">Quotidien</span>
            </div>
            <p className="text-gasra-text-secondary leading-snug">
              {isAr
                ? "التوزيع منتظم كل يوم من 06:00 إلى 14:00 في كامل الأحياء المجاورة."
                : "Alimentation normale de 06h à 14h dans toute la cité Ismail Yefsah."}
            </p>
          </div>
        </div>
      </div>

      {/* Pharmacies de Garde */}
      <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
            <HeartPulse size={14} className="text-emerald-500" />
            <span>{isAr ? "صيدلية المناوبة الليلة" : "Pharmacie de garde de nuit"}</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            Ouverte 24h/24
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-gasra-text">Pharmacie El Afia (د. بن سعيد)</h4>
            <div className="text-gasra-text-muted text-[11px] mt-0.5">
              Face à la mosquée Bilal, Cité Ismail Yefsah
            </div>
            <div className="text-[11px] text-[#3D5AFE] dark:text-[#6F86FF] font-semibold mt-1">
              Tel : 023 83 XX XX
            </div>
          </div>

          <a
            href="tel:023830000"
            className="p-2.5 rounded-xl btn-gasra-primary flex items-center gap-1 text-xs font-bold"
          >
            <PhoneCall size={14} />
            <span>Appeler</span>
          </a>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gasra-text-secondary mb-3 flex items-center gap-1.5">
          <PhoneCall size={14} />
          <span>{isAr ? "أرقام الطوارئ السريعة" : "Numéros d'urgence en Algérie"}</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <a href="tel:14" className="p-2.5 rounded-2xl bg-gasra-surface-subtle hover:bg-gasra-surface-border transition-colors">
            <div className="font-mono font-black text-sm text-[#E0503A]">14</div>
            <div className="text-[10px] text-gasra-text-muted mt-0.5">Protection Civile</div>
          </a>

          <a href="tel:17" className="p-2.5 rounded-2xl bg-gasra-surface-subtle hover:bg-gasra-surface-border transition-colors">
            <div className="font-mono font-black text-sm text-[#3D5AFE]">17 / 1548</div>
            <div className="text-[10px] text-gasra-text-muted mt-0.5">Police Secours</div>
          </a>

          <a href="tel:1021" className="p-2.5 rounded-2xl bg-gasra-surface-subtle hover:bg-gasra-surface-border transition-colors">
            <div className="font-mono font-black text-sm text-emerald-600">1021</div>
            <div className="text-[10px] text-gasra-text-muted mt-0.5">Gendarmerie</div>
          </a>
        </div>
      </div>

      {/* Citizen Incident Reporting Button */}
      <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs text-xs">
        <h4 className="font-bold text-gasra-text mb-1">
          {isAr ? "شفت مشكل في الحومة ؟" : "Un problème dans le quartier ?"}
        </h4>
        <p className="text-gasra-text-secondary text-[11px] mb-3">
          Signalez un trou dans la chaussée, une ampoule d'éclairage cassée ou un dépôt sauvage. Gagnez 50 points contributeur.
        </p>

        {reported ? (
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-center font-bold text-[11px]">
            Signalement transmis aux services communaux ! (+50 pts)
          </div>
        ) : (
          <button
            onClick={() => setReported(true)}
            className="w-full py-2.5 rounded-xl btn-gasra-secondary font-bold text-xs"
          >
            {isAr ? "إرسال إشعار للبلدية (+50 نقطة)" : "Signaler une anomalie (+50 pts)"}
          </button>
        )}
      </div>
    </div>
  );
};
