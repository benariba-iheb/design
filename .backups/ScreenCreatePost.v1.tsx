import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Star, PenTool, Image, Sparkles, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_DEALS } from "../../data/mockData";

export const ScreenCreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { language, currentQuartier, currentWilaya } = useApp();
  const isAr = language === "ar";

  const [postType, setPostType] = useState<"deal" | "review" | "standard">("deal");
  const [selectedDealId, setSelectedDealId] = useState(MOCK_DEALS[0].id);
  const [dealScansEstimate, setDealScansEstimate] = useState(15);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedDeal = MOCK_DEALS.find((d) => d.id === selectedDealId) || MOCK_DEALS[0];
  const estimatedCommission = selectedDeal.creatorCommissionDA * dealScansEstimate;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-gasra-bg min-h-full pb-20 p-4 text-gasra-text">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gasra-surface-border">
        <div>
          <h2 className="text-base font-bold text-gasra-text">
            {isAr ? "إنشاء منشور جديد" : "Créer une publication"}
          </h2>
          <div className="flex items-center gap-1 text-[11px] text-gasra-text-muted">
            <MapPin size={12} className="text-[#E0503A]" />
            <span>{currentQuartier}</span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF] bg-blue-50 dark:bg-[#162447] px-2 py-0.5 rounded-full">
          {isAr ? "أرباح مباشرة" : "Gains directs"}
        </span>
      </div>

      {/* Post Type Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-gasra-surface-subtle border border-gasra-surface-border mb-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setPostType("deal")}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
            postType === "deal"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] shadow-xs"
              : "text-gasra-text-secondary hover:text-gasra-text"
          }`}
        >
          <Tag size={14} />
          <span className="truncate">{isAr ? "ترويج بون" : "Promouvoir un bon"}</span>
        </button>

        <button
          type="button"
          onClick={() => setPostType("review")}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
            postType === "review"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] shadow-xs"
              : "text-gasra-text-secondary hover:text-gasra-text"
          }`}
        >
          <Star size={14} />
          <span className="truncate">{isAr ? "كتابة رأي" : "Laisser un avis"}</span>
        </button>

        <button
          type="button"
          onClick={() => setPostType("standard")}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
            postType === "standard"
              ? "bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] shadow-xs"
              : "text-gasra-text-secondary hover:text-gasra-text"
          }`}
        >
          <PenTool size={14} />
          <span className="truncate">{isAr ? "خبر الحومة" : "Info quartier"}</span>
        </button>
      </div>

      {isSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gasra-surface rounded-3xl border border-gasra-surface-border animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-lg font-bold text-gasra-text mb-1">
            {isAr ? "تم نشر منشورك بنجاح !" : "Publication mise en ligne !"}
          </h3>
          <p className="text-xs text-gasra-text-secondary">
            {isAr
              ? "منشورك مرئي لجيرانك في باب الزوار وعلى خريطة قصرة."
              : "Visible immédiatement par vos voisins et sur la carte du quartier."}
          </p>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* TYPE 1: PROMOTE A DEAL */}
            {postType === "deal" && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
                <label className="text-xs font-bold text-gasra-text block">
                  {isAr ? "اختر البون الذي تريد الترويج له في حومتك" : "Sélectionner un Bon du quartier"}
                </label>

                <select
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gasra-surface-border bg-gasra-surface-subtle text-xs font-medium text-gasra-text"
                >
                  {MOCK_DEALS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.businessName} — {d.titleFr} ({d.discount} · Comm: {d.creatorCommissionDA} DA/scan)
                    </option>
                  ))}
                </select>

                {/* Real-time Earnings Simulator */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-[#162447] border border-blue-200 dark:border-[#2B458A]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-gasra-text">
                      {isAr ? "محاكي أرباحك بالدينار :" : "Simulateur de gains créateur :"}
                    </span>
                    <span className="font-mono font-black text-sm text-[#3D5AFE] dark:text-[#6F86FF]">
                      {estimatedCommission.toLocaleString()} DA
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gasra-text-secondary">
                    <span>{dealScansEstimate} {isAr ? "جار يمسح الكود" : "voisins scannent le QR"}</span>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={dealScansEstimate}
                      onChange={(e) => setDealScansEstimate(Number(e.target.value))}
                      className="flex-1 accent-[#3D5AFE]"
                    />
                    <span className="font-mono text-gasra-text font-bold">{dealScansEstimate}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gasra-text-muted">
                    {isAr
                      ? "الدفع مضمون : 100% من العمولة تدخل رصيدك فور مسح الزبون للكود في المحل."
                      : "Gains automatiques : vous touchez votre commission dès que le QR est scanné en magasin."}
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 2: LEAVE A CERTIFIED REVIEW */}
            {postType === "review" && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-gasra-surface border border-gasra-surface-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gasra-text">
                    {isAr ? "تقييمك للمحل" : "Votre note"}
                  </label>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-lg p-0.5 hover:scale-120 transition-transform"
                      >
                        {star <= rating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <span>
                    {isAr
                      ? "رتبتك : ولد الحومة (ولد الحي)"
                      : "Pondération : Weld el Houma (Niveau 2)"}
                  </span>
                  <span className="font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF]">
                    +85 pts (~125 DA)
                  </span>
                </div>
              </div>
            )}

            {/* Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gasra-text">
                {isAr ? "محتوى المنشور أو نصيحتك للجيران" : "Votre texte ou recommandation"}
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isAr
                    ? "احكِ لأهل الحومة عن تجربتك أو انصحهم بالبون الترويجي..."
                    : "Racontez à vos voisins ce qui vaut le détour ou expliquez le bon plan..."
                }
                className="w-full p-3 rounded-2xl border border-gasra-surface-border bg-gasra-surface text-xs text-gasra-text outline-none focus:border-[#3D5AFE]"
              />
            </div>

            {/* Media Upload Sketch Wireframe Box */}
            <div className="p-4 rounded-2xl bg-hatched border-2 border-dashed border-gasra-surface-border flex flex-col items-center justify-center text-center text-xs text-gasra-text-muted">
              <Image size={24} className="mb-1 text-gasra-text-secondary" />
              <span className="font-semibold text-gasra-text">
                {isAr ? "إضافة صورة أو فيديو قصير (Story)" : "Ajouter photo ou courte vidéo (Story)"}
              </span>
              <span className="text-[10px] mt-0.5">
                {isAr ? "تصوير مباشر من الهاتف" : "Format vertical recommandé"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] font-bold text-xs shadow-md hover:opacity-95 transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{isAr ? "نشر في قصرة الآن" : "Publier sur Gasra"}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      )}
    </div>
  );
};
