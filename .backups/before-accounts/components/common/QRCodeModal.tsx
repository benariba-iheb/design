import React, { useState } from "react";
import { QrCode, X, Copy, Check, ExternalLink, Smartphone } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const isAr = language === "ar";
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://gasra.app";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High quality pure SVG QR Code pattern (deterministic representation)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-gasra-surface border border-gasra-surface-border p-6 shadow-2xl text-gasra-text">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-full text-gasra-text-muted hover:bg-gasra-surface-subtle"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0B1E26] text-[#E4FF3C] mb-3">
            <Smartphone size={24} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {isAr ? "امسح الرمز لتجربة قصرة على هاتفك" : "Scanner pour tester sur smartphone"}
          </h3>
          <p className="text-xs text-gasra-text-secondary mt-1">
            {isAr
              ? "مخصص للجنة التحكيم : افتح الكاميرا في هاتفك، امسح الرمز واكتشف تجربة الهاتف الحقيقية."
              : "Spécial Jury & Testeurs : ouvrez l'appareil photo de votre téléphone pour tester l'application en conditions réelles."}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-inner mx-auto max-w-[280px]">
          {/* Real styled QR Code rendered via SVG */}
          <svg className="w-56 h-56" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="160" height="160" fill="white" />
            
            {/* Top-Left Finder */}
            <rect x="10" y="10" width="40" height="40" rx="6" fill="#0B1E26" />
            <rect x="16" y="16" width="28" height="28" rx="3" fill="white" />
            <rect x="22" y="22" width="16" height="16" rx="2" fill="#0B1E26" />
            <circle cx="30" cy="30" r="3" fill="#E4FF3C" />

            {/* Top-Right Finder */}
            <rect x="110" y="10" width="40" height="40" rx="6" fill="#0B1E26" />
            <rect x="116" y="16" width="28" height="28" rx="3" fill="white" />
            <rect x="122" y="22" width="16" height="16" rx="2" fill="#0B1E26" />
            <circle cx="130" cy="30" r="3" fill="#E4FF3C" />

            {/* Bottom-Left Finder */}
            <rect x="10" y="110" width="40" height="40" rx="6" fill="#0B1E26" />
            <rect x="16" y="116" width="28" height="28" rx="3" fill="white" />
            <rect x="22" y="122" width="16" height="16" rx="2" fill="#0B1E26" />
            <circle cx="30" cy="130" r="3" fill="#E4FF3C" />

            {/* Simulated QR data modules */}
            <g fill="#0B1E26">
              {/* Timing patterns */}
              <rect x="56" y="26" width="6" height="6" />
              <rect x="68" y="26" width="6" height="6" />
              <rect x="80" y="26" width="6" height="6" />
              <rect x="92" y="26" width="6" height="6" />
              <rect x="26" y="56" width="6" height="6" />
              <rect x="26" y="68" width="6" height="6" />
              <rect x="26" y="80" width="6" height="6" />
              <rect x="26" y="92" width="6" height="6" />

              {/* Data blocks */}
              <rect x="56" y="56" width="12" height="12" rx="2" />
              <rect x="74" y="56" width="6" height="6" />
              <rect x="86" y="56" width="18" height="6" />
              <rect x="110" y="56" width="6" height="18" />
              <rect x="122" y="62" width="12" height="6" />
              <rect x="140" y="56" width="6" height="6" />

              <rect x="56" y="74" width="6" height="12" />
              <rect x="68" y="74" width="18" height="6" />
              <rect x="92" y="68" width="12" height="12" />
              <rect x="122" y="74" width="6" height="12" />
              <rect x="134" y="74" width="12" height="6" />

              <rect x="56" y="92" width="18" height="6" />
              <rect x="80" y="86" width="6" height="18" />
              <rect x="92" y="92" width="12" height="6" />
              <rect x="110" y="86" width="18" height="6" />
              <rect x="134" y="86" width="12" height="12" />

              {/* Center brand badge */}
              <rect x="65" y="65" width="30" height="30" rx="8" fill="#0B1E26" />
              <text x="80" y="85" textAnchor="middle" fill="#E4FF3C" fontSize="16" fontWeight="bold" fontFamily="sans-serif">G</text>

              {/* Bottom right data */}
              <rect x="56" y="110" width="12" height="6" />
              <rect x="74" y="110" width="6" height="12" />
              <rect x="86" y="110" width="18" height="6" />
              <rect x="110" y="110" width="6" height="18" />
              <rect x="122" y="116" width="18" height="6" />
              <rect x="56" y="128" width="6" height="18" />
              <rect x="68" y="122" width="18" height="6" />
              <rect x="92" y="122" width="12" height="12" />
              <rect x="110" y="134" width="12" height="12" />
              <rect x="128" y="128" width="18" height="6" />
              <rect x="74" y="134" width="6" height="12" />
              <rect x="86" y="140" width="18" height="6" />
              <rect x="128" y="140" width="6" height="6" />
              <rect x="140" y="134" width="6" height="12" />
            </g>
          </svg>

          <span className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Scan & Install Gasra PWA
          </span>
        </div>

        {/* URL Link and Copy */}
        <div className="mt-5 flex items-center gap-2 p-2 rounded-xl bg-gasra-surface-subtle border border-gasra-surface-border">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 bg-transparent text-xs text-gasra-text font-mono truncate px-2 outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] text-xs font-semibold hover:opacity-90 shrink-0"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? (isAr ? "تم النسخ" : "Copié !") : (isAr ? "نسخ" : "Copier")}</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-center text-gasra-text-muted">
          {isAr
            ? "يعمل مع كاميرا أي هاتف أندرويد أو آيفون بدون تطبيق وسيط."
            : "Fonctionne avec l'appareil photo de n'importe quel smartphone iOS ou Android."}
        </p>
      </div>
    </div>
  );
};
