import React, { useEffect, useState } from "react";
import { Download, Share, X, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export const PWAInstallButton: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = "",
}) => {
  const { language } = useApp();
  const isAr = language === "ar";

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if already in standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    if (!deferredPrompt) {
      // Fallback instruction
      setShowIOSModal(true);
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 ${className}`}>
        <CheckCircle2 size={14} />
        <span>{isAr ? "مثبت على الجهاز" : "Appli installée"}</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all ${
          compact
            ? "px-2.5 py-1.5 text-xs bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] hover:opacity-90"
            : "px-3.5 py-2 text-xs sm:text-sm bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] shadow-sm hover:opacity-95"
        } ${className}`}
        title={isAr ? "تثبيت تطبيق قصرة على هاتفك" : "Installer Gasra sur votre écran d'accueil"}
      >
        <Download size={15} />
        <span>{isAr ? "تثبيت التطبيق (PWA)" : "Installer l'appli"}</span>
      </button>

      {/* iOS / General Safari Install Guidance Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-gasra-surface p-6 shadow-2xl border border-gasra-surface-border text-gasra-text">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 end-4 p-1 rounded-full text-gasra-text-muted hover:bg-gasra-surface-subtle"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B1E26] text-[#E4FF3C] flex items-center justify-center font-bold text-xl">
                G
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {isAr ? "تثبيت قصرة على هاتفك" : "Installer Gasra sur mobile"}
                </h3>
                <p className="text-xs text-gasra-text-secondary">
                  {isAr ? "بدون متجر وبدون تحميل ثقيل" : "Accès plein écran & notifications"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gasra-text-secondary">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gasra-surface-subtle">
                <span className="font-bold text-gasra-text">1.</span>
                <p>
                  {isAr
                    ? "اضغط على زر المشاركة (Share) في أسفل شاشة Safari أو متصفحك."
                    : "Sur Safari (iPhone) ou Chrome (Android), appuyez sur le bouton Partager / Options."}
                </p>
                <Share size={18} className="shrink-0 text-[#3D5AFE]" />
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gasra-surface-subtle">
                <span className="font-bold text-gasra-text">2.</span>
                <p>
                  {isAr
                    ? "اختر « إضافة إلى الشاشة الرئيسية » (Sur l'écran d'accueil)."
                    : "Faites défiler et sélectionnez « Sur l'écran d'accueil »."}
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gasra-surface-subtle">
                <span className="font-bold text-gasra-text">3.</span>
                <p>
                  {isAr
                    ? "يفتح تطبيق قصرة فورا في وضع الشاشة الكاملة كأي تطبيق حقيقي !"
                    : "Gasra s'ouvrira en plein écran avec son icône, sans barre de navigateur !"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl font-medium text-xs bg-gasra-surface-subtle hover:bg-gasra-surface-border text-gasra-text transition-colors"
            >
              {isAr ? "فهمت" : "J'ai compris"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
