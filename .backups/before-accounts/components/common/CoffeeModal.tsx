import React, { useState } from "react";
import { X, Coffee, Check, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface CoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  postId: string;
}

export const CoffeeModal: React.FC<CoffeeModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  postId,
}) => {
  const { user, sendCoffeeTip, language } = useApp();
  const isAr = language === "ar";
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = () => {
    if (user.walletBalanceDA < selectedAmount) {
      setError(
        isAr
          ? "رصيدك غير كافٍ. يمكنك شحن المحفظة عبر البطاقة الذهبية أو فليكسي."
          : "Solde insuffisant dans votre portefeuille Gasra."
      );
      return;
    }
    const ok = sendCoffeeTip(postId, selectedAmount);
    if (ok) {
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-gasra-surface border border-gasra-surface-border p-6 shadow-2xl text-gasra-text">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1.5 rounded-full text-gasra-text-muted hover:bg-gasra-surface-subtle"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="py-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check size={32} />
            </div>
            <h3 className="text-lg font-bold">
              {isAr ? "يعطيك الصحة ! قهوتك لحقت" : "Ya3tik saha ! Café envoyé"}
            </h3>
            <p className="text-xs text-gasra-text-secondary mt-1">
              {isAr
                ? `تم تحويل ${selectedAmount} دج إلى ${recipientName}. ربي يخلف عليك !`
                : `${selectedAmount} DA transférés avec succès à ${recipientName}.`}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl">
                ☕
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight">
                  {isAr ? "خلّص عليه قهوة" : "9ahwa Tal3a"}
                </h3>
                <p className="text-xs text-gasra-text-secondary">
                  {isAr ? `تشجيع لـ ${recipientName}` : `Pourboire pour ${recipientName}`}
                </p>
              </div>
            </div>

            <p className="text-xs text-gasra-text-secondary mb-4 leading-relaxed">
              {isAr
                ? "قصرة تحيي تقاليد القهوة الجزائرية : ادعم صانع محتوى أو جارك بمبلغ رمزي يصل مباشرة لمحفظته بالدينار."
                : "La tradition du café algérien : soutenez un créateur ou un voisin utile avec un micro-pourboire en Dinars versé instantanément."}
            </p>

            {/* Amount Selection Buttons */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[50, 100, 200].map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setError(null);
                    }}
                    className={`py-3 px-2 rounded-2xl text-center border font-bold transition-all ${
                      isSelected
                        ? "border-[#0B1E26] bg-[#0B1E26] text-[#E4FF3C] dark:border-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] shadow-sm scale-102"
                        : "border-gasra-surface-border bg-gasra-surface-subtle text-gasra-text hover:bg-gasra-surface-border"
                    }`}
                  >
                    <div className="text-sm">{amt} DA</div>
                    <div className="text-[10px] font-normal opacity-75">
                      {amt === 50
                        ? isAr ? "قهوة كحلة" : "Café noir"
                        : amt === 100
                        ? isAr ? "كابوتشينو" : "Capuccino"
                        : isAr ? "قهوة وحلوى" : "Café & Gâteau"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* User balance check */}
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gasra-surface-subtle mb-4">
              <span className="text-gasra-text-secondary">
                {isAr ? "رصيدك المتاح :" : "Votre solde disponible :"}
              </span>
              <span className="font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF]">
                {user.walletBalanceDA.toLocaleString()} DA
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs mb-4">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSend}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] hover:opacity-95 shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Coffee size={16} />
              <span>
                {isAr
                  ? `تأكيد إرسال ${selectedAmount} دج`
                  : `Envoyer ${selectedAmount} DA`}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
