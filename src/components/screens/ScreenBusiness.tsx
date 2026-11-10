import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Check,
  Star,
  Tag,
  Share2,
  QrCode,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_DEALS } from "../../data/mockData";
import { LevelBadge } from "../common/LevelBadge";

export const ScreenBusiness: React.FC = () => {
  const { language, triggerRaniJay } = useApp();
  const isAr = language === "ar";

  const [raniJayCount, setRaniJayCount] = useState(24);
  const [hasClickedRaniJay, setHasClickedRaniJay] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const deal = MOCK_DEALS[0]; // Sandwicherie El Forno

  const handleRaniJay = () => {
    if (!hasClickedRaniJay) {
      setRaniJayCount((c) => c + 1);
      setHasClickedRaniJay(true);
      triggerRaniJay("biz-1");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Banner / Store Cover (Hatched medium-fidelity wireframe) */}
      <div className="relative w-full h-36 rounded-3xl bg-hatched border border-gasra-surface-border overflow-hidden mb-3 flex items-center justify-center text-xs text-gasra-text-muted">
        <span className="bg-gasra-surface/80 px-3 py-1 rounded-full backdrop-blur-xs font-mono">
          [Esquisse : Vitrine Sandwicherie El Forno]
        </span>

        <span className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-[#0B1E26] text-[#E4FF3C] text-[10px] font-bold flex items-center gap-1">
          <ShieldCheck size={12} />
          {isAr ? "محل موثق برو" : "Vitrine Pro"}
        </span>
      </div>

      {/* Business Details Header */}
      <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h1 className="text-lg font-black text-gasra-text">
              Sandwicherie & Four El Forno
            </h1>
            <p className="text-xs text-gasra-text-secondary">
              مطعم وشاورما على الحطب · Bab Ezzouar
            </p>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-xl text-amber-700 dark:text-amber-300 font-bold text-xs">
            <Star size={13} fill="currentColor" />
            <span>4.8</span>
            <span className="text-[10px] opacity-75">(42 avis)</span>
          </div>
        </div>

        <div className="space-y-1 text-xs text-gasra-text-muted mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#E0503A]" />
            <span>Cité Ismail Yefsah, Bt 12, Bab Ezzouar (Alger)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} />
            <span>Ouvert aujourd'hui : 11h30 – 23h30</span>
          </div>
        </div>

        {/* PROMINENT RANI JAY (راني جاي) BUTTON */}
        <div className="p-3 rounded-2xl bg-[#FFF1EF] dark:bg-[#421D17] border border-[#FF8A78]/40 mb-2">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-bold text-[#E0503A] dark:text-[#FF8A78] flex items-center gap-1.5">
              <Navigation size={14} />
              <span>{isAr ? "مقياس الإقبال الحي :" : "Affluence en direct :"}</span>
            </span>
            <span className="font-mono font-black text-[#E0503A] dark:text-[#FF8A78]">
              {raniJayCount} {isAr ? "زبون في الطريق" : "personnes en route"}
            </span>
          </div>

          <button
            onClick={handleRaniJay}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
              hasClickedRaniJay
                ? "bg-emerald-600 text-white"
                : "bg-[#E0503A] hover:bg-[#d0402b] text-white"
            }`}
          >
            {hasClickedRaniJay ? (
              <>
                <Check size={16} />
                <span>{isAr ? "راني جاي ! تم إشعار المطعم" : "Rani jay ! Le restaurateur est prévenu"}</span>
              </>
            ) : (
              <>
                <Navigation size={16} />
                <span>{isAr ? "راني جاي (إشعار بالوصول)" : "Rani jay ! (J'arrive bientôt)"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ACTIVE DEALS SECTION */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
            <Tag size={14} className="text-[#3D5AFE]" />
            <span>{isAr ? "البونات النشطة في المحل" : "Bons du quartier actifs"}</span>
          </h3>
          <span className="text-[10px] font-mono text-[#3D5AFE] dark:text-[#6F86FF] font-bold">
            {isAr ? "عمولة للشباب" : "Commissions créateurs"}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-gasra-surface border-2 border-gasra-surface-border shadow-xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                {deal.discount}
              </span>
              <h4 className="font-bold text-sm text-gasra-text mt-1">
                {isAr ? deal.titleAr : deal.titleFr}
              </h4>
            </div>
            <div className="text-end">
              <span className="font-mono font-black text-sm text-[#3D5AFE] dark:text-[#6F86FF]">
                {deal.dealPrice} DA
              </span>
              <span className="text-[10px] line-through text-gasra-text-muted block">
                {deal.originalPrice} DA
              </span>
            </div>
          </div>

          <p className="text-xs text-gasra-text-secondary mb-3">
            {isAr
              ? "شاورما دجاج متبلة على الطريقة الشامية مع مشروب حمود بوعلام حبة باردة."
              : "Menu complet cuit au feu de bois avec boisson Hamoud fraîche."}
          </p>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#162447] border border-blue-200 dark:border-[#2B458A] flex items-center justify-between text-xs mb-3">
            <span className="text-gasra-text">
              {isAr ? "عمولة صانع المحتوى :" : "Commission créateur :"}
            </span>
            <span className="font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF]">
              {deal.creatorCommissionDA} DA {isAr ? "لكل زبون" : "/ scan"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex-1 py-2.5 rounded-xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] font-bold text-xs flex items-center justify-center gap-2"
            >
              <QrCode size={15} />
              <span>{isAr ? "إظهار رمز QR في المحل" : "Générer le QR du Bon"}</span>
            </button>
            <Link
              to="/creer"
              className="p-2.5 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text text-xs font-semibold flex items-center gap-1"
              title="Promouvoir et toucher des commissions"
            >
              <Share2 size={15} />
              <span>Promouvoir</span>
            </Link>
          </div>
        </div>
      </div>

      {/* REPUTATION REVIEWS WITH BADGES */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gasra-text-secondary flex items-center gap-1.5">
          <MessageSquare size={14} />
          <span>{isAr ? "آراء أهل الحومة والبرانية" : "Avis vérifiés par rang territorial"}</span>
        </h3>

        <div className="space-y-2">
          {/* Review 1 by Sahb el Kelma */}
          <div className="p-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gasra-text">Karim Benchikh</span>
                <LevelBadge levelNumber={3} size="sm" />
              </div>
              <span className="text-[10px] text-gasra-text-muted">Il y a 2j</span>
            </div>
            <p className="text-gasra-text leading-snug">
              « Chawarma propre, viande fraîche et pain fait maison. Ammi Rachid toujours souriant. Validé par les anciens du quartier ! »
            </p>
          </div>

          {/* Review 2 by Weld el Houma */}
          <div className="p-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border text-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gasra-text">Yacine B.</span>
                <LevelBadge levelNumber={2} size="sm" />
              </div>
              <span className="text-[10px] text-gasra-text-muted">Il y a 4j</span>
            </div>
            <p className="text-gasra-text leading-snug">
              « Le bon de -30% a fonctionné directement au comptoir en 2 secondes chrono avec le QR Gasra. Rapport qualité prix imbattable. »
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Simulation Modal for the deal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs rounded-3xl bg-gasra-surface p-6 text-center border border-gasra-surface-border shadow-2xl">
            <h3 className="font-bold text-sm text-gasra-text mb-1">
              {isAr ? "امسح عند الكاسة للاستفادة" : "Présentez ce QR au comptoir"}
            </h3>
            <p className="text-[11px] text-gasra-text-secondary mb-4">
              Bon -30% : Sandwicherie El Forno (560 DA au lieu de 800 DA)
            </p>

            <div className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl border flex items-center justify-center mb-4">
              <QrCode size={150} className="text-[#0B1E26]" />
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2.5 rounded-xl bg-gasra-surface-subtle font-bold text-xs text-gasra-text hover:bg-gasra-surface-border"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
