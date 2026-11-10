import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALGERIAN_WILAYAS } from "../../data/wilayas";
import { useApp } from "../../context/AppContext";
import { Check, Shield, ArrowRight, Video, EyeOff } from "lucide-react";
import { GasraLogo } from "../common/GasraLogo";

export const ScreenOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { language, setCurrentWilaya, setCurrentQuartier } = useApp();
  const isAr = language === "ar";

  // Step 1: Phone number, Step 2: OTP, Step 3: Wilaya & Quartier, Step 4: Show vs Discreet
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phone, setPhone] = useState("0661234567");
  const [otp, setOtp] = useState(["4", "8", "1", "9"]);
  const [selectedWilayaCode, setSelectedWilayaCode] = useState("16");
  const [selectedCommune, setSelectedCommune] = useState("Bab Ezzouar");
  const [selectedQuartier, setSelectedQuartier] = useState("Cité Ismail Yefsah");
  const [preference, setPreference] = useState<"creator" | "contributor">("creator");

  const currentWilayaObj = ALGERIAN_WILAYAS.find((w) => w.code === selectedWilayaCode) || ALGERIAN_WILAYAS[0];

  const handleFinish = () => {
    setCurrentWilaya(`${currentWilayaObj.code} - ${currentWilayaObj.nameFr}`);
    setCurrentQuartier(`${selectedCommune} — ${selectedQuartier}`);
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-gasra-surface min-h-full text-gasra-text">
      {/* Header with Step indicator */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <GasraLogo size="sm" showSlogan={false} asLink={false} />
          <span className="text-[11px] font-mono text-gasra-text-muted bg-gasra-surface-subtle px-2 py-0.5 rounded-full">
            {isAr ? `خطوة ${step} من 4` : `Étape ${step} sur 4`}
          </span>
        </div>

        {/* Progress line */}
        <div className="w-full h-1 bg-gasra-surface-subtle rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-[#0B1E26] dark:bg-[#E4FF3C] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: Phone number */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-gasra-text">
                {isAr ? "أدخل رقم هاتفك" : "Entrez votre numéro"}
              </h2>
              <p className="text-xs text-gasra-text-secondary mt-1">
                {isAr
                  ? "لربط حسابك بمحفظة قصرة وبطاقتك الذهبية واستلام أرباحك."
                  : "Pour lier votre compte à la carte Edahabia et recevoir vos gains en DA."}
              </p>
            </div>

            {/* Medium fidelity wireframe input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gasra-text-secondary">
                {isAr ? "رقم الهاتف النقال الجزائري" : "Numéro de téléphone algérien"}
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-gasra-surface-border bg-gasra-surface-subtle">
                <span className="font-mono text-xs font-bold text-gasra-text-secondary">
                  +213
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-sm font-bold text-gasra-text outline-none"
                  placeholder="06 XX XX XX XX"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gasra-text-muted">
              <Shield size={14} className="text-[#3D5AFE] dark:text-[#6F86FF]" />
              <span>
                {isAr
                  ? "متوافق مع شبكات موبيليس، جيزي وأوريدو."
                  : "Compatible Mobilis, Djezzy et Ooredoo."}
              </span>
            </div>

            {/* Wireframe simulated visual placeholder */}
            <div className="w-full h-24 rounded-2xl bg-hatched border border-gasra-surface-border flex items-center justify-center text-xs text-gasra-text-muted">
              [Zone d'illustration : Ancrage local & Edahabia]
            </div>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-gasra-text">
                {isAr ? "رمز التحقق السريع" : "Code de confirmation"}
              </h2>
              <p className="text-xs text-gasra-text-secondary mt-1">
                {isAr
                  ? `أرسلنا رمزا من 4 أرقام إلى الرقم ${phone}.`
                  : `Code envoyé par SMS au ${phone}.`}
              </p>
            </div>

            {/* 4-digit boxes */}
            <div className="flex items-center justify-center gap-3 py-4">
              {otp.map((digit, i) => (
                <div
                  key={i}
                  className="w-13 h-14 rounded-xl border-2 border-gasra-surface-border bg-gasra-surface-subtle flex items-center justify-center text-xl font-mono font-bold text-[#3D5AFE] dark:text-[#6F86FF]"
                >
                  {digit}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gasra-text-secondary">
              {isAr ? "لم يصلك الرمز ؟" : "Pas reçu le SMS ?"}{" "}
              <button className="underline font-semibold text-gasra-text">
                {isAr ? "إعادة الإرسال (30 ثا)" : "Renvoyer le code (30s)"}
              </button>
            </p>
          </div>
        )}

        {/* STEP 3: Wilaya & Quartier */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-gasra-text">
                {isAr ? "اختر حومتك" : "Choisissez votre quartier"}
              </h2>
              <p className="text-xs text-gasra-text-secondary mt-1">
                {isAr
                  ? "السمعة والنقاط تبدأ من حومتك، وتكبر حتى تصبح كبير الحومة !"
                  : "Votre réputation commence dans votre quartier et grandit jusqu'au rang d'Ancien."}
              </p>
            </div>

            {/* Wilaya selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gasra-text-secondary">
                {isAr ? "الولاية" : "Wilaya"}
              </label>
              <select
                value={selectedWilayaCode}
                onChange={(e) => {
                  setSelectedWilayaCode(e.target.value);
                  const w = ALGERIAN_WILAYAS.find((x) => x.code === e.target.value);
                  if (w && w.communes[0]) {
                    setSelectedCommune(w.communes[0].nameFr);
                    setSelectedQuartier(w.communes[0].quartiers[0] || "Centre");
                  }
                }}
                className="w-full p-3 rounded-xl border border-gasra-surface-border bg-gasra-surface-subtle text-xs font-medium text-gasra-text"
              >
                {ALGERIAN_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {w.nameFr} ({w.nameAr})
                  </option>
                ))}
              </select>
            </div>

            {/* Commune selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gasra-text-secondary">
                {isAr ? "البلدية" : "Commune"}
              </label>
              <select
                value={selectedCommune}
                onChange={(e) => {
                  setSelectedCommune(e.target.value);
                  const c = currentWilayaObj.communes.find((x) => x.nameFr === e.target.value);
                  if (c && c.quartiers[0]) {
                    setSelectedQuartier(c.quartiers[0]);
                  }
                }}
                className="w-full p-3 rounded-xl border border-gasra-surface-border bg-gasra-surface-subtle text-xs font-medium text-gasra-text"
              >
                {currentWilayaObj.communes.map((c) => (
                  <option key={c.nameFr} value={c.nameFr}>
                    {c.nameFr} ({c.nameAr})
                  </option>
                ))}
              </select>
            </div>

            {/* Quartier selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gasra-text-secondary">
                {isAr ? "الحي / الحومة" : "Quartier / Cité"}
              </label>
              <select
                value={selectedQuartier}
                onChange={(e) => setSelectedQuartier(e.target.value)}
                className="w-full p-3 rounded-xl border border-gasra-surface-border bg-gasra-surface-subtle text-xs font-medium text-gasra-text"
              >
                {(
                  currentWilayaObj.communes.find((c) => c.nameFr === selectedCommune)
                    ?.quartiers || ["Centre"]
                ).map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 4: Creator vs Contributor */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-gasra-text">
                {isAr ? "واش تفضل ؟" : "Tu préfères..."}
              </h2>
              <p className="text-xs text-gasra-text-secondary mt-1">
                {isAr
                  ? "تظهر بالصوت والصورة، وإلا تبقى سري وتجمع النقاط بهدوء ؟"
                  : "Te montrer en vidéo ou rester discret et accumuler des points ?"}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Creator Choice */}
              <button
                type="button"
                onClick={() => setPreference("creator")}
                className={`w-full p-4 rounded-2xl border text-start transition-all ${
                  preference === "creator"
                    ? "border-[#3D5AFE] bg-blue-50/50 dark:bg-[#162447] ring-2 ring-[#3D5AFE]/30"
                    : "border-gasra-surface-border bg-gasra-surface-subtle"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-[#3D5AFE]" />
                    <span className="font-bold text-sm text-gasra-text">
                      {isAr ? "نحب نظهر (صانع محتوى)" : "Me montrer (Créateur)"}
                    </span>
                  </div>
                  {preference === "creator" && <Check size={16} className="text-[#3D5AFE]" />}
                </div>
                <p className="text-xs text-gasra-text-secondary leading-relaxed">
                  {isAr
                    ? "أروّج عروض وتخفيضات المحلات بفيديوهات سريعة، ونربح عمولة مباشرة بالدينار عند مسح كل بون في المحل."
                    : "Je promeus les bons du quartier en story ou vidéo. Commission directe en DA à chaque QR scanné en magasin."}
                </p>
              </button>

              {/* Contributor Choice */}
              <button
                type="button"
                onClick={() => setPreference("contributor")}
                className={`w-full p-4 rounded-2xl border text-start transition-all ${
                  preference === "contributor"
                    ? "border-[#0B1E26] dark:border-[#E4FF3C] bg-gasra-surface ring-2 ring-[#E4FF3C]/30"
                    : "border-gasra-surface-border bg-gasra-surface-subtle"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <EyeOff size={18} className="text-gasra-text" />
                    <span className="font-bold text-sm text-gasra-text">
                      {isAr ? "نبقى سري (مساهم في الحومة)" : "Rester discret (Contributeur)"}
                    </span>
                  </div>
                  {preference === "contributor" && <Check size={16} className="text-[#E4FF3C]" />}
                </div>
                <p className="text-xs text-gasra-text-secondary leading-relaxed">
                  {isAr
                    ? "أكتب آراء موثقة، أصور قوائم الأسعار وأنجز مهام خفيفة. أربح نقاطا تتحول أسبوعيا لدنانير من كاش الولاية."
                    : "Avis vérifiés, photos de menus, alertes utiles. Des points convertis chaque semaine en DA via la cagnotte de wilaya."}
                </p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="pt-6 border-t border-gasra-surface-border flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gasra-text-secondary hover:bg-gasra-surface-subtle"
          >
            {isAr ? "رجوع" : "Retour"}
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => {
            if (step < 4) {
              setStep((prev) => (prev + 1) as 2 | 3 | 4);
            } else {
              handleFinish();
            }
          }}
          className="flex-1 max-w-[200px] py-3 rounded-xl bg-[#0B1E26] text-[#E4FF3C] dark:bg-[#E4FF3C] dark:text-[#0B1E26] font-bold text-xs hover:opacity-95 shadow-md flex items-center justify-center gap-2"
        >
          <span>{step === 4 ? (isAr ? "ابدأ قصرة" : "Accéder à Gasra") : (isAr ? "متابعة" : "Continuer")}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
