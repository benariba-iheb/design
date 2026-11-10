import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  RefreshCw,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  History,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ScreenWallet: React.FC = () => {
  const { user, language, convertPointsToDA, withdrawToEdahabia } = useApp();
  const isAr = language === "ar";

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(2000);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<"edahabia" | "cash">("edahabia");

  const [convertedToast, setConvertedToast] = useState(false);

  const handleConvert = () => {
    if (user.points <= 0) return;
    convertPointsToDA();
    setConvertedToast(true);
    setTimeout(() => setConvertedToast(false), 2500);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawToEdahabia(withdrawAmount)) {
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
      }, 1800);
    }
  };

  const transactions = [
    {
      id: "tx-1",
      titleFr: "Commission Bon Sandwicherie El Forno",
      titleAr: "عمولة بون مطعم الفرنو",
      date: "Aujourd'hui · 14:20",
      amountDA: +360,
      type: "commission",
      status: "Succès",
    },
    {
      id: "tx-2",
      titleFr: "Pourboire café reçu de Karim B.",
      titleAr: "قهوة مرسلة من كريم ب.",
      date: "Hier · 18:45",
      amountDA: +100,
      type: "tip",
      status: "Succès",
    },
    {
      id: "tx-3",
      titleFr: "Conversion hebdomadaire points (Wilaya 16)",
      titleAr: "تحويل نقاط الأسبوع (ولاية 16)",
      date: "01 Nov · 09:00",
      amountDA: +720,
      type: "conversion",
      status: "Succès",
    },
    {
      id: "tx-4",
      titleFr: "Retrait vers carte Edahabia / BaridiMob",
      titleAr: "سحب نحو البطاقة الذهبية / بريدي موب",
      date: "28 Oct · 11:15",
      amountDA: -2000,
      type: "withdrawal",
      status: "Viré",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gasra-surface-border">
        <div>
          <h2 className="text-base font-bold text-gasra-text">
            {isAr ? "محفظة قصرة بالدينار" : "Portefeuille Gasra (DA)"}
          </h2>
          <p className="text-[11px] text-gasra-text-muted">
            {isAr ? "مربوطة بالبطاقة الذهبية وبريدي موب" : "Connecté à Edahabia & BaridiMob"}
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck size={12} />
          {isAr ? "آمن 100%" : "Passerelle GIE"}
        </span>
      </div>

      {/* Main Wallet Card */}
      <div className="p-5 rounded-3xl bg-linear-to-br from-[#0B1E26] to-[#14303B] text-white border border-[#234E5E] shadow-xl mb-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#E4FF3C]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 text-xs text-[#9DB4BB]">
          <span>{isAr ? "الرصيد المتاح للسحب" : "Solde disponible"}</span>
          <span className="font-mono text-[11px]">Compte n° 0021-****-16</span>
        </div>

        <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight mb-4">
          {user.walletBalanceDA.toLocaleString()}{" "}
          <span className="text-xl font-sans text-[#E4FF3C]">DA</span>
        </div>

        {/* Withdrawal & Top-Up Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="py-2.5 px-3 rounded-xl bg-[#E4FF3C] text-[#0B1E26] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 transition-transform active:scale-98"
          >
            <ArrowUpRight size={15} />
            <span>{isAr ? "سحب الأموال" : "Retirer l'argent"}</span>
          </button>

          <button
            onClick={() => alert("Recharge par Edahabia, CIB ou Flexy.")}
            className="py-2.5 px-3 rounded-xl bg-[#193A47] hover:bg-[#204959] text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowDownLeft size={15} />
            <span>{isAr ? "شحن الرصيد" : "Recharger"}</span>
          </button>
        </div>
      </div>

      {/* Contributor Points Card with Live Conversion */}
      <div className="p-4 rounded-3xl bg-gasra-surface border border-gasra-surface-border shadow-xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Coins size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gasra-text">
                {isAr ? "كاش نقاط المساهمين" : "Cagnotte Points Contributeur"}
              </h4>
              <p className="text-[10px] text-gasra-text-muted">
                {isAr ? "ولاية الجزائر (16) · تحويل أسبوعي" : "Wilaya d'Alger (16) · Valeur x1.5"}
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="font-mono font-bold text-sm text-[#3D5AFE] dark:text-[#6F86FF]">
              {user.points} pts
            </span>
            <span className="text-[10px] text-gasra-text-muted block font-mono">
              ~ {Math.floor(user.points * 1.5)} DA
            </span>
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={user.points <= 0}
          className="w-full mt-2 py-2 rounded-xl bg-gasra-surface-subtle hover:bg-gasra-surface-border disabled:opacity-40 text-gasra-text font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw size={13} />
          <span>
            {isAr
              ? `تحويل ${user.points} نقطة إلى رصيد دج الآن`
              : `Convertir ${user.points} pts en ${Math.floor(user.points * 1.5)} DA`}
          </span>
        </button>

        {convertedToast && (
          <div className="mt-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] text-center font-bold animate-in fade-in">
            {isAr ? "تم تحويل النقاط وإضافتها لرصيدك !" : "Points convertis avec succès dans votre portefeuille !"}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gasra-text-secondary px-1">
          <span className="flex items-center gap-1">
            <History size={13} />
            <span>{isAr ? "سجل العمليات الأخير" : "Historique récent"}</span>
          </span>
          <span className="text-[10px] text-gasra-text-muted font-normal">
            Dernières 48h
          </span>
        </div>

        <div className="space-y-1.5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-2xl bg-gasra-surface border border-gasra-surface-border flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-gasra-text leading-tight">
                  {isAr ? tx.titleAr : tx.titleFr}
                </div>
                <div className="text-[10px] text-gasra-text-muted mt-0.5">
                  {tx.date}
                </div>
              </div>

              <div className="text-end">
                <span
                  className={`font-mono font-bold text-xs ${
                    tx.amountDA > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gasra-text"
                  }`}
                >
                  {tx.amountDA > 0 ? `+${tx.amountDA}` : tx.amountDA} DA
                </span>
                <span className="text-[9px] block text-gasra-text-muted">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-gasra-surface p-6 border border-gasra-surface-border shadow-2xl text-gasra-text">
            {withdrawSuccess ? (
              <div className="py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-base font-bold text-gasra-text mb-1">
                  {isAr ? "تم إرسال طلب السحب بنجاح !" : "Demande de virement envoyée !"}
                </h3>
                <p className="text-xs text-gasra-text-secondary">
                  {isAr
                    ? `تم تحويل ${withdrawAmount} دج نحو بطاقتك الذهبية.`
                    : `${withdrawAmount} DA en cours de transfert vers votre compte.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-gasra-text">
                    {isAr ? "سحب رصيد بالدينار" : "Retrait en Dinars"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="text-xs text-gasra-text-muted hover:text-gasra-text"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gasra-text-secondary">
                    {isAr ? "طريقة السحب" : "Mode de retrait"}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod("edahabia")}
                      className={`p-2.5 rounded-xl border text-start font-semibold ${
                        withdrawMethod === "edahabia"
                          ? "border-[#3D5AFE] bg-blue-50 dark:bg-[#162447] text-[#3D5AFE] dark:text-[#6F86FF]"
                          : "border-gasra-surface-border bg-gasra-surface-subtle"
                      }`}
                    >
                      <CreditCard size={16} className="mb-1" />
                      <div>Edahabia / BaridiMob</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawMethod("cash")}
                      className={`p-2.5 rounded-xl border text-start font-semibold ${
                        withdrawMethod === "cash"
                          ? "border-[#0B1E26] dark:border-[#E4FF3C] bg-gasra-surface"
                          : "border-gasra-surface-border bg-gasra-surface-subtle"
                      }`}
                    >
                      <Building size={16} className="mb-1" />
                      <div>Cash chez partenaire</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gasra-text-secondary">
                    {isAr ? "المبلغ المراد سحبه (دج)" : "Montant à retirer (DA)"}
                  </label>
                  <input
                    type="number"
                    min={500}
                    max={user.walletBalanceDA}
                    step={100}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gasra-surface-border bg-gasra-surface font-mono font-bold text-base text-gasra-text outline-none"
                  />
                  <div className="text-[10px] text-gasra-text-muted">
                    Solde maximum : {user.walletBalanceDA} DA
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={withdrawAmount > user.walletBalanceDA}
                  className="w-full py-3 rounded-xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] font-bold text-xs hover:opacity-95 disabled:opacity-40 shadow-sm"
                >
                  {isAr ? `تأكيد سحب ${withdrawAmount} دج` : `Confirmer le retrait de ${withdrawAmount} DA`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
